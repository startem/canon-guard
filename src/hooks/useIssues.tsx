import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export type IssueSeverity = "critical" | "high" | "medium" | "low";
export type IssueStatus = "open" | "in-progress" | "resolved" | "closed";

export interface Issue {
  id: string;
  client_id: string;
  audit_id: string | null;
  title: string;
  description: string | null;
  severity: IssueSeverity;
  status: IssueStatus;
  category: string | null;
  due_date: string | null;
  assignee: string | null;
  created_at: string;
  updated_at: string;
}

export const useIssues = () => {
  const { currentClient } = useWorkspace();
  const clientId = currentClient?.id ?? null;
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!clientId) {
      setIssues([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("issues")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    setIssues((data ?? []) as Issue[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = useCallback(async (id: string, status: IssueStatus) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    await supabase.from("issues").update({ status }).eq("id", id);
  }, []);

  const remove = useCallback(async (id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
    await supabase.from("issues").delete().eq("id", id);
  }, []);

  return { issues, loading, clientId, updateStatus, remove, reload: load };
};
