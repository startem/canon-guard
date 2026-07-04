import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export interface AgencyMember {
  user_id: string;
  role: string;
  full_name: string;
  email: string;
}

/**
 * Lists the members of the current agency with their profile names, so the app
 * can assign issues to real users (assignee is a uuid referencing auth.users).
 */
export const useAgencyMembers = () => {
  const { currentAgency } = useWorkspace();
  const agencyId = currentAgency?.id ?? null;
  const [members, setMembers] = useState<AgencyMember[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!agencyId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: memberRows } = await supabase
      .from("agency_members")
      .select("user_id, role")
      .eq("agency_id", agencyId);

    const rows = memberRows ?? [];
    const ids = rows.map((r) => r.user_id);

    let profilesById: Record<string, { full_name: string | null; email: string | null }> = {};
    if (ids.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", ids);
      profilesById = Object.fromEntries(
        (profiles ?? []).map((p) => [p.id, { full_name: p.full_name, email: p.email }])
      );
    }

    setMembers(
      rows.map((r) => ({
        user_id: r.user_id,
        role: r.role,
        full_name: profilesById[r.user_id]?.full_name ?? profilesById[r.user_id]?.email ?? "Unknown user",
        email: profilesById[r.user_id]?.email ?? "",
      }))
    );
    setLoading(false);
  }, [agencyId]);

  useEffect(() => {
    load();
  }, [load]);

  return { members, loading, reload: load };
};
