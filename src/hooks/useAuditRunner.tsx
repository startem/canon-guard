import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export interface AuditFinding {
  id: string;
  audit_id: string;
  title: string;
  description: string | null;
  severity: "low" | "medium" | "high" | "critical";
  category: string | null;
  recommendation: string | null;
  status: string;
  created_at: string;
}

export interface AuditRecord {
  id: string;
  client_id: string;
  type: string;
  title: string;
  score: number | null;
  status: string;
  summary: string | null;
  created_at: string;
  completed_at: string | null;
}

export const useAuditRunner = (auditType: string) => {
  const { currentClient } = useWorkspace();
  const clientId = currentClient?.id ?? null;

  const [latestAudit, setLatestAudit] = useState<AuditRecord | null>(null);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLatest = useCallback(async () => {
    if (!clientId) {
      setLatestAudit(null);
      setFindings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: audits } = await supabase
      .from("audits")
      .select("*")
      .eq("client_id", clientId)
      .eq("type", auditType)
      .order("created_at", { ascending: false })
      .limit(1);
    const audit = (audits?.[0] as AuditRecord) ?? null;
    setLatestAudit(audit);
    if (audit) {
      const { data: f } = await supabase
        .from("audit_findings")
        .select("*")
        .eq("audit_id", audit.id)
        .order("created_at", { ascending: true });
      setFindings((f ?? []) as AuditFinding[]);
    } else {
      setFindings([]);
    }
    setLoading(false);
  }, [clientId, auditType]);

  useEffect(() => {
    loadLatest();
  }, [loadLatest]);

  const runAudit = useCallback(
    async (input: { content?: string; url?: string }) => {
      if (!clientId) {
        setError("Select a client first.");
        return { ok: false as const, error: "Select a client first." };
      }
      setRunning(true);
      setError(null);
      try {
        const { data, error: fnErr } = await supabase.functions.invoke("run-audit", {
          body: { clientId, auditType, content: input.content, url: input.url },
        });
        if (fnErr) {
          const msg = fnErr.message || "Audit failed.";
          setError(msg);
          return { ok: false as const, error: msg };
        }
        if (data?.error) {
          setError(data.error);
          return { ok: false as const, error: data.error };
        }
        await loadLatest();
        return { ok: true as const, data };
      } catch (e) {
        const msg = String(e);
        setError(msg);
        return { ok: false as const, error: msg };
      } finally {
        setRunning(false);
      }
    },
    [clientId, auditType, loadLatest]
  );

  return { latestAudit, findings, loading, running, error, clientId, runAudit, reload: loadLatest };
};
