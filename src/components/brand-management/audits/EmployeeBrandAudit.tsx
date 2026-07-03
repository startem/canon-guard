import { AuditRunnerPanel } from "./AuditRunnerPanel";

export const EmployeeBrandAudit = () => {
  return (
    <AuditRunnerPanel
      auditType="employee-brand"
      title="Employee Brand Alignment Audit"
      description="AI checks employee-facing or employee-generated material against this client's brand voice and messaging pillars."
      placeholder="Paste internal comms, LinkedIn bios, or employee posts to audit for brand alignment…"
    />
  );
};
