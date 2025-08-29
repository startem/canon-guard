import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Shield, Plus, Users, Bell, Clock, AlertTriangle, Info, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Rule {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  enabled: boolean;
}

interface ApprovalRole {
  id: string;
  role: string;
  assignee: string;
  requiresApproval: {
    messaging: boolean;
    visuals: boolean;
    legal: boolean;
  };
}

const initialRules: Rule[] = [
  {
    id: '1',
    title: 'Tagline Placement Requirement',
    description: 'Tagline must appear on hero section of website and primary marketing materials',
    severity: 'high',
    enabled: true
  },
  {
    id: '2',
    title: 'Primary Color Usage Threshold',
    description: 'Primary color usage must be greater than 80% on brand assets',
    severity: 'medium',
    enabled: true
  },
  {
    id: '3',
    title: 'Logo Clear Space Requirements',
    description: 'Logo must maintain minimum clear space of 2x logo height on all sides',
    severity: 'high',
    enabled: true
  },
  {
    id: '4',
    title: 'Typography Consistency',
    description: 'Only approved brand fonts should be used in external communications',
    severity: 'medium',
    enabled: false
  },
  {
    id: '5',
    title: 'Legal Disclaimer Presence',
    description: 'Required legal disclaimers must be present on promotional materials',
    severity: 'high',
    enabled: true
  }
];

const initialApprovalRoles: ApprovalRole[] = [
  {
    id: '1',
    role: 'Marketing Lead',
    assignee: 'Sarah Johnson',
    requiresApproval: { messaging: true, visuals: true, legal: false }
  },
  {
    id: '2',
    role: 'Legal Counsel',
    assignee: 'Michael Chen',
    requiresApproval: { messaging: false, visuals: false, legal: true }
  },
  {
    id: '3',
    role: 'Design Director',
    assignee: 'Emily Rodriguez',
    requiresApproval: { messaging: false, visuals: true, legal: false }
  },
  {
    id: '4',
    role: 'Brand Manager',
    assignee: 'David Kim',
    requiresApproval: { messaging: true, visuals: true, legal: true }
  }
];

export function GovernanceAlerts() {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [approvalRoles, setApprovalRoles] = useState<ApprovalRole[]>(initialApprovalRoles);
  const [auditFrequency, setAuditFrequency] = useState('weekly');
  const [alertThreshold, setAlertThreshold] = useState([75]);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newRule, setNewRule] = useState({
    title: '',
    description: '',
    severity: 'medium' as Rule['severity']
  });

  const [newRole, setNewRole] = useState({
    role: '',
    assignee: '',
    requiresApproval: { messaging: false, visuals: false, legal: false }
  });

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const addRule = () => {
    if (!newRule.title || !newRule.description) return;
    
    const rule: Rule = {
      id: Date.now().toString(),
      ...newRule,
      enabled: true
    };
    
    setRules(prev => [...prev, rule]);
    setNewRule({ title: '', description: '', severity: 'medium' });
    setIsRuleDialogOpen(false);
    toast({ title: "Rule added successfully" });
  };

  const addApprovalRole = () => {
    if (!newRole.role || !newRole.assignee) return;
    
    const role: ApprovalRole = {
      id: Date.now().toString(),
      ...newRole
    };
    
    setApprovalRoles(prev => [...prev, role]);
    setNewRole({ role: '', assignee: '', requiresApproval: { messaging: false, visuals: false, legal: false } });
    setIsRoleDialogOpen(false);
    toast({ title: "Approval role added successfully" });
  };

  const updateApprovalRequirement = (roleId: string, type: keyof ApprovalRole['requiresApproval'], value: boolean) => {
    setApprovalRoles(prev => prev.map(role =>
      role.id === roleId 
        ? { ...role, requiresApproval: { ...role.requiresApproval, [type]: value } }
        : role
    ));
  };

  const getSeverityBadge = (severity: Rule['severity']) => {
    const config = {
      low: { color: 'bg-blue-500', icon: Info },
      medium: { color: 'bg-yellow-500', icon: AlertTriangle },
      high: { color: 'bg-red-500', icon: XCircle }
    };
    
    const { color, icon: Icon } = config[severity];
    
    return (
      <Badge className={`${color} text-white hover:${color}/90`}>
        <Icon className="h-3 w-3 mr-1" />
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Governance & Alerts</h1>
          <p className="text-muted-foreground mt-2">
            Manage brand governance rules, approval workflows, and audit alerts
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
                    <span>Rules & Guardrails</span>
                  </div>
                  <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
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
                            onChange={(e) => setNewRule(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter rule title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ruleDescription">Description</Label>
                          <Textarea
                            id="ruleDescription"
                            value={newRule.description}
                            onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe the rule requirements"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ruleSeverity">Severity Level</Label>
                          <Select
                            value={newRule.severity}
                            onValueChange={(value: Rule['severity']) => 
                              setNewRule(prev => ({ ...prev, severity: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addRule} className="bg-primary hover:bg-primary/90">
                          Add Rule
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  ))}
                </div>
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
                    <Button size="sm">
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
                          value={newRole.role}
                          onChange={(e) => setNewRole(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="e.g., Content Manager"
                        />
                      </div>
                      <div>
                        <Label htmlFor="assignee">Assignee</Label>
                        <Input
                          id="assignee"
                          value={newRole.assignee}
                          onChange={(e) => setNewRole(prev => ({ ...prev, assignee: e.target.value }))}
                          placeholder="Team member name"
                        />
                      </div>
                      <div>
                        <Label>Approval Requirements</Label>
                        <div className="space-y-2 mt-2">
                          {Object.entries(newRole.requiresApproval).map(([type, checked]) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(value) =>
                                  setNewRole(prev => ({
                                    ...prev,
                                    requiresApproval: {
                                      ...prev.requiresApproval,
                                      [type]: !!value
                                    }
                                  }))
                                }
                              />
                              <span className="text-sm capitalize">{type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addApprovalRole} className="bg-primary hover:bg-primary/90">
                        Add Role
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvalRoles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4 space-y-3">
                    <div>
                      <h4 className="font-medium">{role.role}</h4>
                      <p className="text-sm text-muted-foreground">{role.assignee}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Approval Required For:</Label>
                      <div className="space-y-1">
                        {Object.entries(role.requiresApproval).map(([type, required]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{type}</span>
                            <Checkbox
                              checked={required}
                              onCheckedChange={(checked) =>
                                updateApprovalRequirement(role.id, type as keyof ApprovalRole['requiresApproval'], !!checked)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audit Scheduling & Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Audit Scheduling & Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="auditFrequency">Audit Frequency</Label>
                <Select value={auditFrequency} onValueChange={setAuditFrequency}>
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
              </div>

              <div>
                <Label>Alert Threshold</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={alertThreshold}
                    onValueChange={setAlertThreshold}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Alert when brand health drops below {alertThreshold[0]}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Notification Preferences</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">In-App Notifications</p>
                      <p className="text-sm text-muted-foreground">Show notifications in the platform</p>
                    </div>
                    <Switch
                      checked={inAppNotifications}
                      onCheckedChange={setInAppNotifications}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>Next Scheduled Audit</span>
                  <span className="font-medium">Tomorrow, 2:00 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}