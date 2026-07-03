import { AuditRunnerPanel } from "./AuditRunnerPanel";

export const BrandPerceptionAudit = () => {
  return (
    <AuditRunnerPanel
      auditType="brand-perception"
      title="Brand Perception Audit"
      description="AI evaluates how submitted mentions, reviews, or press coverage align with this client's intended brand perception and messaging pillars."
      placeholder="Paste social mentions, reviews, press quotes, or survey responses to assess brand perception…"
    />
  );
};
