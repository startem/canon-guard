import { AuditRunnerPanel } from "./AuditRunnerPanel";

export const SocialMediaAudit = () => {
  return (
    <AuditRunnerPanel
      auditType="social-media"
      title="Social Media Audit"
      description="AI checks social posts and captions against this client's voice, messaging pillars, boilerplate, and legal requirements."
      placeholder="Paste social posts, captions, or a content calendar to audit for brand alignment…"
    />
  );
};
