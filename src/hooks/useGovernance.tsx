import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export type Severity = "low" | "medium" | "high" | "critical";

export interface GovernanceRule {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  severity: Severity;
  category: string;
  consequences: string | null;
  enabled: boolean;
}

export interface ApprovalRole {
  id: string;
  client_id: string;
  role_name: string;
  assignee: string | null;
  requires_messaging: boolean;
  requires_visuals: boolean;
  requires_legal: boolean;
  priority: number;
}

export interface AuditSchedule {
  id: string;
  client_id: string;
  audit_type: string;
  frequency: string;
  is_active: boolean;
  next_run: string | null;
  last_run: string | null;
}

export const useGovernance = () => {
  const { currentClient } = useWorkspace();
  const clientId = currentClient?.id ?? null;

  const [rules, setRules] = useState<GovernanceRule[]>([]);
  const [roles, setRoles] = useState<ApprovalRole[]>([]);
  const [schedules, setSchedules] = useState<AuditSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!clientId) {
      setRules([]);
      setRoles([]);
      setSchedules([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [r, a, s] = await Promise.all([
      supabase.from("governance_rules").select("*").eq("client_id", clientId).order("created_at"),
      supabase.from("approval_roles").select("*").eq("client_id", clientId).order("priority"),
      supabase.from("audit_schedules").select("*").eq("client_id", clientId).order("created_at"),
    ]);
    setRules((r.data ?? []) as GovernanceRule[]);
    setRoles((a.data ?? []) as ApprovalRole[]);
    setSchedules((s.data ?? []) as AuditSchedule[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  // Rules
  const addRule = async (r: { title: string; description: string; severity: Severity; category?: string; consequences?: string }) => {
    if (!clientId) return;
    await supabase.from("governance_rules").insert({ client_id: clientId, ...r, enabled: true });
    await load();
  };
  const toggleRule = async (id: string, enabled: boolean) => {
    setRules((prev) => prev.map((x) => (x.id === id ? { ...x, enabled } : x)));
    await supabase.from("governance_rules").update({ enabled }).eq("id", id);
  };
  const deleteRule = async (id: string) => {
    setRules((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("governance_rules").delete().eq("id", id);
  };

  // Roles
  const addRole = async (r: {
    role_name: string;
    assignee: string;
    requires_messaging: boolean;
    requires_visuals: boolean;
    requires_legal: boolean;
  }) => {
    if (!clientId) return;
    await supabase.from("approval_roles").insert({ client_id: clientId, priority: roles.length + 1, ...r });
    await load();
  };
  const updateRoleRequirement = async (
    id: string,
    key: "requires_messaging" | "requires_visuals" | "requires_legal",
    value: boolean
  ) => {
    setRoles((prev) => prev.map((x) => (x.id === id ? { ...x, [key]: value } : x)));
    const patch: Record<string, boolean> = { [key]: value };
    await supabase.from("approval_roles").update(patch).eq("id", id);
  };
  const deleteRole = async (id: string) => {
    setRoles((prev) => prev.filter((x) => x.id !== id));
    await supabase.from("approval_roles").delete().eq("id", id);
  };

  // Schedule (single "all" schedule per client for frequency)
  const setFrequency = async (frequency: string) => {
    if (!clientId) return;
    const existing = schedules.find((s) => s.audit_type === "all");
    if (existing) {
      setSchedules((prev) => prev.map((s) => (s.id === existing.id ? { ...s, frequency } : s)));
      await supabase.from("audit_schedules").update({ frequency }).eq("id", existing.id);
    } else {
      await supabase.from("audit_schedules").insert({ client_id: clientId, audit_type: "all", frequency });
      await load();
    }
  };

  return {
    clientId,
    loading,
    rules,
    roles,
    schedules,
    addRule,
    toggleRule,
    deleteRule,
    addRole,
    updateRoleRequirement,
    deleteRole,
    setFrequency,
  };
};
