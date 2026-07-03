import { AuditRunnerPanel } from "./AuditRunnerPanel";

export const CustomerExperienceAudit = () => {
  return (
    <AuditRunnerPanel
      auditType="customer-experience"
      title="Customer Experience Audit"
      description="AI evaluates customer touchpoints against this client's brand promise, voice, and messaging pillars."
      placeholder="Paste support replies, onboarding copy, or CX touchpoint text to audit against the brand…"
    />
  );
};
