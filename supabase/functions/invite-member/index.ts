import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const VALID_ROLES = ["admin", "editor", "viewer"];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization" }, 401);

    const caller = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await caller.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const agencyId = typeof body?.agency_id === "string" ? body.agency_id : "";
    const role = typeof body?.role === "string" ? body.role : "viewer";

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Valid email required" }, 400);
    if (!agencyId) return json({ error: "agency_id required" }, 400);
    if (!VALID_ROLES.includes(role)) return json({ error: "Invalid role" }, 400);

    // Verify caller is owner/admin of the agency (uses RLS-safe SECURITY DEFINER function)
    const { data: allowed, error: roleErr } = await caller.rpc("has_agency_role", {
      _agency_id: agencyId,
      _roles: ["owner", "admin"],
    });
    if (roleErr || !allowed) return json({ error: "Only owners and admins can invite members" }, 403);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Find an existing user with this email, otherwise invite a new one.
    let invitedUserId: string | null = null;
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existing = list?.users?.find((u) => u.email?.toLowerCase() === email);

    if (existing) {
      invitedUserId = existing.id;
    } else {
      const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email);
      if (inviteErr || !invited?.user) {
        return json({ error: inviteErr?.message ?? "Failed to invite user" }, 400);
      }
      invitedUserId = invited.user.id;
    }

    // Add (or upsert) the membership.
    const { error: memberErr } = await admin
      .from("agency_members")
      .upsert({ agency_id: agencyId, user_id: invitedUserId, role }, { onConflict: "agency_id,user_id" });
    if (memberErr) return json({ error: memberErr.message }, 400);

    return json({ ok: true, user_id: invitedUserId, existing: !!existing });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error" }, 500);
  }
});
