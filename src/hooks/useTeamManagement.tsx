import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useAuth } from "@/contexts/AuthContext";

export type MemberRole = "owner" | "admin" | "editor" | "viewer";

export interface TeamMember {
  id: string; // agency_members row id
  user_id: string;
  role: MemberRole;
  full_name: string;
  email: string;
  joined_at: string;
  is_self: boolean;
}

/**
 * Real agency team management backed by agency_members + profiles.
 * Owners/admins can invite, change roles, and remove members (enforced by RLS).
 */
export const useTeamManagement = () => {
  const { currentAgency, role } = useWorkspace();
  const { user } = useAuth();
  const agencyId = currentAgency?.id ?? null;
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const canManage = role === "owner" || role === "admin";

  const load = useCallback(async () => {
    if (!agencyId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: rows } = await supabase
      .from("agency_members")
      .select("id, user_id, role, created_at")
      .eq("agency_id", agencyId)
      .order("created_at", { ascending: true });

    const list = rows ?? [];
    const ids = list.map((r) => r.user_id);
    let profiles: Record<string, { full_name: string | null; email: string | null }> = {};
    if (ids.length > 0) {
      const { data: p } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", ids);
      profiles = Object.fromEntries((p ?? []).map((row) => [row.id, { full_name: row.full_name, email: row.email }]));
    }

    setMembers(
      list.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        role: r.role as MemberRole,
        full_name: profiles[r.user_id]?.full_name ?? profiles[r.user_id]?.email ?? "Pending invite",
        email: profiles[r.user_id]?.email ?? "",
        joined_at: r.created_at,
        is_self: r.user_id === user?.id,
      }))
    );
    setLoading(false);
  }, [agencyId, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const updateRole = useCallback(
    async (memberId: string, newRole: MemberRole) => {
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
      const { error } = await supabase.from("agency_members").update({ role: newRole }).eq("id", memberId);
      if (error) await load();
      return { error: error?.message ?? null };
    },
    [load]
  );

  const removeMember = useCallback(
    async (memberId: string) => {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      const { error } = await supabase.from("agency_members").delete().eq("id", memberId);
      if (error) await load();
      return { error: error?.message ?? null };
    },
    [load]
  );

  const inviteMember = useCallback(
    async (email: string, memberRole: MemberRole) => {
      if (!agencyId) return { error: "No agency selected" };
      const { data, error } = await supabase.functions.invoke("invite-member", {
        body: { email, agency_id: agencyId, role: memberRole },
      });
      if (error) return { error: error.message };
      if (data?.error) return { error: data.error as string };
      await load();
      return { error: null };
    },
    [agencyId, load]
  );

  return { members, loading, canManage, currentRole: role, updateRole, removeMember, inviteMember, reload: load };
};
