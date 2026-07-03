import { AuditRunnerPanel } from "./AuditRunnerPanel";

export const LegalComplianceAudit = () => {
  return (
    <AuditRunnerPanel
      auditType="legal-compliance"
      title="Legal Compliance Audit"
      description="AI checks submitted material against this client's mandatory legal items, disclaimers, and risk requirements."
      placeholder="Paste copy, claims, or an asset description to audit for required legal and compliance elements…"
    />
  );
};
