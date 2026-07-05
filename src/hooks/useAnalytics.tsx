import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";

interface AuditRow {
  id: string;
  type: string;
  score: number | null;
  status: string;
  created_at: string;
}

interface IssueRow {
  id: string;
  severity: string;
  status: string;
  category: string | null;
  created_at: string;
}

export interface AnalyticsRange {
  from: Date;
  to: Date;
}

const TYPE_LABELS: Record<string, string> = {
  "visual-identity": "Visual Identity",
  "content": "Content",
  "social-media": "Social Media",
  "digital-asset": "Digital Assets",
  "brand-consistency": "Brand Consistency",
  "brand-perception": "Brand Perception",
  "competitor-analysis": "Competitor Analysis",
  "customer-experience": "Customer Experience",
  "employee-brand": "Employee Brand",
  "legal-compliance": "Legal Compliance",
};

const labelFor = (type: string) =>
  TYPE_LABELS[type] ?? type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Aggregates real audit + issue data for the current client into the shapes the
 * Analytics Dashboard needs. Everything respects the date range passed in.
 */
export const useAnalytics = (range: AnalyticsRange) => {
  const { currentClient } = useWorkspace();
  const clientId = currentClient?.id ?? null;
  const [audits, setAudits] = useState<AuditRow[]>([]);
  const [issues, setIssues] = useState<IssueRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!clientId) {
      setAudits([]);
      setIssues([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: auditData }, { data: issueData }] = await Promise.all([
      supabase
        .from("audits")
        .select("id, type, score, status, created_at")
        .eq("client_id", clientId)
        .order("created_at", { ascending: true }),
      supabase
        .from("issues")
        .select("id, severity, status, category, created_at")
        .eq("client_id", clientId)
        .order("created_at", { ascending: true }),
    ]);
    setAudits((auditData ?? []) as AuditRow[]);
    setIssues((issueData ?? []) as IssueRow[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  const inRange = useCallback(
    (iso: string) => {
      const t = new Date(iso).getTime();
      return t >= range.from.getTime() && t <= range.to.getTime() + 86_400_000;
    },
    [range.from, range.to]
  );

  const data = useMemo(() => {
    const scopedAudits = audits.filter((a) => inRange(a.created_at) && a.score != null);
    const scopedIssues = issues.filter((i) => inRange(i.created_at));

    // Health trend: average completed audit score per month
    const byMonth = new Map<string, { total: number; count: number; label: string }>();
    for (const a of scopedAudits) {
      const d = new Date(a.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
      const entry = byMonth.get(key) ?? { total: 0, count: 0, label };
      entry.total += a.score as number;
      entry.count += 1;
      byMonth.set(key, entry);
    }
    const healthTrend = Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => ({ month: v.label, health: Math.round(v.total / v.count) }));

    // Compliance by audit type: average latest score per type
    const byType = new Map<string, { total: number; count: number }>();
    for (const a of scopedAudits) {
      const entry = byType.get(a.type) ?? { total: 0, count: 0 };
      entry.total += a.score as number;
      entry.count += 1;
      byType.set(a.type, entry);
    }
    const complianceByType = Array.from(byType.entries())
      .map(([type, v]) => ({ category: labelFor(type), compliance: Math.round(v.total / v.count) }))
      .sort((a, b) => b.compliance - a.compliance);

    // Issue distribution by severity
    const sevColors: Record<string, string> = {
      critical: "#dc2626",
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#10b981",
    };
    const openIssues = scopedIssues.filter((i) => i.status !== "resolved" && i.status !== "closed");
    const sevCount = new Map<string, number>();
    for (const i of openIssues) sevCount.set(i.severity, (sevCount.get(i.severity) ?? 0) + 1);
    const issueDistribution = ["critical", "high", "medium", "low"]
      .filter((s) => (sevCount.get(s) ?? 0) > 0)
      .map((s) => ({ severity: s[0].toUpperCase() + s.slice(1), count: sevCount.get(s) ?? 0, color: sevColors[s] }));

    // Category breakdown table (audits per type + avg score)
    const categoryRows = complianceByType.map((c) => {
      const typeIssues = scopedIssues.filter(
        (i) => labelFor(i.category ?? "") === c.category
      ).length;
      return { category: c.category, score: c.compliance, issues: typeIssues };
    });

    // Key metrics
    const overallHealth =
      complianceByType.length > 0
        ? Math.round(complianceByType.reduce((s, c) => s + c.compliance, 0) / complianceByType.length)
        : null;
    const prevHealth =
      healthTrend.length >= 2 ? healthTrend[healthTrend.length - 2].health : null;
    const latestHealth =
      healthTrend.length >= 1 ? healthTrend[healthTrend.length - 1].health : overallHealth;
    const healthDelta =
      prevHealth != null && latestHealth != null ? latestHealth - prevHealth : null;

    const resolved = scopedIssues.filter((i) => i.status === "resolved" || i.status === "closed").length;
    const resolutionRate =
      scopedIssues.length > 0 ? Math.round((resolved / scopedIssues.length) * 100) : null;
    const highPriority = openIssues.filter((i) => i.severity === "critical" || i.severity === "high").length;

    return {
      healthTrend,
      complianceByType,
      issueDistribution,
      categoryRows,
      metrics: {
        overallHealth,
        healthDelta,
        totalAudits: scopedAudits.length,
        openIssues: openIssues.length,
        highPriority,
        resolutionRate,
      },
      hasData: scopedAudits.length > 0 || scopedIssues.length > 0,
    };
  }, [audits, issues, inRange]);

  return { ...data, loading, clientId, reload: load };
};
