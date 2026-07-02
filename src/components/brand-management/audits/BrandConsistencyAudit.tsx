import { AuditRunnerPanel } from "./AuditRunnerPanel";

export const BrandConsistencyAudit = () => {
  return (
    <AuditRunnerPanel
      auditType="brand-consistency"
      title="Brand Consistency Audit"
      description="AI checks submitted material against this client's Brand Canon — colors, messaging pillars, boilerplate, and legal requirements."
      placeholder="Paste website copy, an email, a social post, or an asset description to audit for brand consistency…"
    />
  );
};
