import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/layout/SectionCard";
import { EmptyState } from "@/components/layout/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Plus, Users, Bell, AlertTriangle, Info, XCircle, Trash2, AlertOctagon, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGovernance, Severity } from "@/hooks/useGovernance";

export function GovernanceAlerts() {
  const {
    clientId,
    loading,
    rules,
    roles,
    schedules,
    addRule,
    toggleRule,
    deleteRule,
    addRole,
    updateRoleRequirement,
    deleteRole,
    setFrequency,
  } = useGovernance();
  const { toast } = useToast();

  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState<{ title: string; description: string; severity: Severity }>({
    title: "",
    description: "",
    severity: "medium",
  });
  const [newRole, setNewRole] = useState({
    role_name: "",
    assignee: "",
    requires_messaging: false,
    requires_visuals: false,
    requires_legal: false,
  });

  const frequency = schedules.find((s) => s.audit_type === "all")?.frequency ?? "weekly";

  const handleAddRule = async () => {
    if (!newRule.title || !newRule.description) return;
    await addRule(newRule);
    setNewRule({ title: "", description: "", severity: "medium" });
    setIsRuleDialogOpen(false);
    toast({ title: "Rule added" });
  };

  const handleAddRole = async () => {
    if (!newRole.role_name || !newRole.assignee) return;
    await addRole(newRole);
    setNewRole({ role_name: "", assignee: "", requires_messaging: false, requires_visuals: false, requires_legal: false });
    setIsRoleDialogOpen(false);
    toast({ title: "Approval role added" });
  };

  const getSeverityBadge = (severity: Severity) => {
    const config: Record<Severity, { color: string; icon: typeof Info }> = {
      low: { color: "bg-blue-500", icon: Info },
      medium: { color: "bg-yellow-500", icon: AlertTriangle },
      high: { color: "bg-orange-500", icon: XCircle },
      critical: { color: "bg-red-600", icon: AlertOctagon },
    };
    const { color, icon: Icon } = config[severity];
    return (
      <Badge className={`${color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Governance &amp; Alerts</h1>
          <p className="text-muted-foreground mt-2">
            Manage brand governance rules, approval workflows, and audit scheduling
            {!clientId && " — select a client to begin"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Rules & Guardrails */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Rules &amp; Guardrails</span>
                  </div>
                  <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button disabled={!clientId}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Rule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Rule</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="ruleTitle">Rule Title</Label>
                          <Input
                            id="ruleTitle"
                            value={newRule.title}
                            onChange={(e) => setNewRule((p) => ({ ...p, title: e.target.value }))}
                            placeholder="Enter rule title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ruleDescription">Description</Label>
                          <Textarea
                            id="ruleDescription"
                            value={newRule.description}
                            onChange={(e) => setNewRule((p) => ({ ...p, description: e.target.value }))}
                            placeholder="Describe the rule requirements"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ruleSeverity">Severity Level</Label>
                          <Select
                            value={newRule.severity}
                            onValueChange={(value: Severity) => setNewRule((p) => ({ ...p, severity: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddRule}>Add Rule</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : rules.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    {clientId ? "No rules yet. Add your first governance rule." : "Select a client to manage rules."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {rules.map((rule) => (
                      <div key={rule.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{rule.title}</h4>
                            {getSeverityBadge(rule.severity)}
                          </div>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={rule.enabled} onCheckedChange={(v) => toggleRule(rule.id, v)} />
                          <Button variant="ghost" size="sm" onClick={() => deleteRule(rule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Approvals</span>
                </div>
                <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={!clientId}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Approval Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="roleName">Role Title</Label>
                        <Input
                          id="roleName"
                          value={newRole.role_name}
                          onChange={(e) => setNewRole((p) => ({ ...p, role_name: e.target.value }))}
                          placeholder="e.g., Content Manager"
                        />
                      </div>
                      <div>
                        <Label htmlFor="assignee">Assignee</Label>
                        <Input
                          id="assignee"
                          value={newRole.assignee}
                          onChange={(e) => setNewRole((p) => ({ ...p, assignee: e.target.value }))}
                          placeholder="Team member name"
                        />
                      </div>
                      <div>
                        <Label>Approval Requirements</Label>
                        <div className="space-y-2 mt-2">
                          {([
                            ["requires_messaging", "Messaging"],
                            ["requires_visuals", "Visuals"],
                            ["requires_legal", "Legal"],
                          ] as const).map(([key, label]) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                checked={newRole[key]}
                                onCheckedChange={(value) => setNewRole((p) => ({ ...p, [key]: !!value }))}
                              />
                              <span className="text-sm">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddRole}>Add Role</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-24 w-full" />
              ) : roles.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  {clientId ? "No approval roles yet." : "Select a client to manage approvals."}
                </p>
              ) : (
                <div className="space-y-4">
                  {roles.map((role) => (
                    <div key={role.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{role.role_name}</h4>
                          <p className="text-sm text-muted-foreground">{role.assignee}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteRole(role.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Approval Required For:</Label>
                        <div className="space-y-1">
                          {([
                            ["requires_messaging", "Messaging"],
                            ["requires_visuals", "Visuals"],
                            ["requires_legal", "Legal"],
                          ] as const).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm">{label}</span>
                              <Checkbox
                                checked={role[key]}
                                onCheckedChange={(checked) => updateRoleRequirement(role.id, key, !!checked)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Audit Scheduling</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="auditFrequency">Audit Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency} disabled={!clientId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  How often automated audits should run for this client.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
