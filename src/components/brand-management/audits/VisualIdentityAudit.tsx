import { AuditRunnerPanel } from "./AuditRunnerPanel";

export const VisualIdentityAudit = () => {
  return (
    <AuditRunnerPanel
      auditType="visual-identity"
      title="Visual Identity Audit"
      description="AI checks described visual assets against this client's approved color tokens and visual identity rules."
      placeholder="Describe the asset's colors, typography, and layout (or paste a spec) to audit visual identity…"
    />
  );
};
