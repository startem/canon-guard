import { AuditRunnerPanel } from "./AuditRunnerPanel";

export const CompetitorAnalysisAudit = () => {
  return (
    <AuditRunnerPanel
      auditType="competitor-analysis"
      title="Competitor Analysis Audit"
      description="AI compares competitor material against this client's Brand Canon to surface positioning gaps, overlaps, and differentiation opportunities."
      placeholder="Paste competitor copy, taglines, or positioning statements to analyze against this client's brand…"
    />
  );
};
