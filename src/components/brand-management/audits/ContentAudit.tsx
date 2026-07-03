import { AuditRunnerPanel } from "./AuditRunnerPanel";

export const ContentAudit = () => {
  return (
    <AuditRunnerPanel
      auditType="content"
      title="Content Audit"
      description="AI reviews long-form content against this client's Brand Canon — tone, messaging pillars, keywords, and boilerplate consistency."
      placeholder="Paste blog copy, an article, or marketing content to audit against the brand canon…"
    />
  );
};
