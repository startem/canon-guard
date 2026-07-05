import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export interface Baseline {
  id: string;
  client_id: string;
  label: string;
  overall_score: number;
  category_scores: Record<string, number>;
  audits_count: number;
  findings_count: number;
  issues_count: number;
  notes: string | null;
  created_at: string;
}

export interface DriftPoint {
  date: string;
  score: number;
  type: string;
}

/**
 * Computes a live snapshot of the client's brand health from the most recent
 * audit per type, then persists it as a baseline row. Drift is the delta
 * between the current live score and the reference (first) baseline.
 */
export const useBaselines = () => {
  const { currentClient } = useWorkspace();
  const clientId = currentClient?.id ?? null;

  const [baselines, setBaselines] = useState<Baseline[]>([]);
  const [loading, setLoading] = useState(true);
  const [capturing, setCapturing] = useState(false);

  const load = useCallback(async () => {
    if (!clientId) {
      setBaselines([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("baselines")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    setBaselines(((data ?? []) as unknown) as Baseline[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  /** Reads all completed audits and returns the latest score per audit type. */
  const computeLiveSnapshot = useCallback(async () => {
    if (!clientId) return null;
    const { data: audits } = await supabase
      .from("audits")
      .select("id, type, score, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    const rows = (audits ?? []) as Array<{ id: string; type: string; score: number | null; created_at: string }>;
    if (rows.length === 0) return null;

    // Latest audit per type (rows already sorted newest-first)
    const latestByType: Record<string, { id: string; score: number }> = {};
    for (const r of rows) {
      if (!latestByType[r.type] && typeof r.score === "number") {
        latestByType[r.type] = { id: r.id, score: r.score };
      }
    }

    const categoryScores: Record<string, number> = {};
    const auditIds: string[] = [];
    Object.entries(latestByType).forEach(([type, v]) => {
      categoryScores[type] = v.score;
      auditIds.push(v.id);
    });

    const scores = Object.values(categoryScores);
    const overall = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    let findingsCount = 0;
    if (auditIds.length) {
      const { count } = await supabase
        .from("audit_findings")
        .select("id", { count: "exact", head: true })
        .in("audit_id", auditIds);
      findingsCount = count ?? 0;
    }

    const { count: issuesCount } = await supabase
      .from("issues")
      .select("id", { count: "exact", head: true })
      .eq("client_id", clientId)
      .neq("status", "closed");

    return {
      overall_score: overall,
      category_scores: categoryScores,
      audits_count: auditIds.length,
      findings_count: findingsCount,
      issues_count: issuesCount ?? 0,
    };
  }, [clientId]);

  const captureBaseline = useCallback(
    async (label = "Baseline") => {
      if (!clientId) return { error: "Select a client first.", data: null };
      setCapturing(true);
      const snapshot = await computeLiveSnapshot();
      if (!snapshot) {
        setCapturing(false);
        return { error: "No completed audits yet — run audits before capturing a baseline.", data: null };
      }
      const { data, error } = await supabase
        .from("baselines")
        .insert({ client_id: clientId, label, ...snapshot })
        .select("*")
        .single();
      setCapturing(false);
      if (!error && data) {
        setBaselines((prev) => [(data as unknown) as Baseline, ...prev]);
      }
      return { error: error?.message ?? null, data: ((data as unknown) as Baseline) ?? null };
    },
    [clientId, computeLiveSnapshot]
  );

  const removeBaseline = useCallback(async (id: string) => {
    setBaselines((prev) => prev.filter((b) => b.id !== id));
    await supabase.from("baselines").delete().eq("id", id);
  }, []);

  /** Drift trend: score of every audit over time (oldest first) for charting. */
  const getDriftTrend = useCallback(async (): Promise<DriftPoint[]> => {
    if (!clientId) return [];
    const { data } = await supabase
      .from("audits")
      .select("type, score, created_at")
      .eq("client_id", clientId)
      .not("score", "is", null)
      .order("created_at", { ascending: true });
    return ((data ?? []) as Array<{ type: string; score: number; created_at: string }>).map((r) => ({
      date: r.created_at,
      score: r.score,
      type: r.type,
    }));
  }, [clientId]);

  // Reference baseline = the earliest captured one
  const referenceBaseline = baselines.length ? baselines[baselines.length - 1] : null;
  const currentBaseline = baselines.length ? baselines[0] : null;
  const drift =
    referenceBaseline && currentBaseline
      ? currentBaseline.overall_score - referenceBaseline.overall_score
      : null;

  return {
    baselines,
    loading,
    capturing,
    clientId,
    currentBaseline,
    referenceBaseline,
    drift,
    captureBaseline,
    computeLiveSnapshot,
    removeBaseline,
    getDriftTrend,
    reload: load,
  };
};
