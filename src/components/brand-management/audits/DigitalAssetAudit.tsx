import { AuditRunnerPanel } from "./AuditRunnerPanel";

export const DigitalAssetAudit = () => {
  return (
    <AuditRunnerPanel
      auditType="digital-asset"
      title="Digital Asset Audit"
      description="AI audits described digital assets (web pages, emails, banners) against this client's Brand Canon for consistency."
      placeholder="Paste or describe a web page, email, or digital asset to audit against the brand canon…"
    />
  );
};
