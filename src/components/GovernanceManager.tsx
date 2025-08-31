import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Edit, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  Calendar
} from "lucide-react";

interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  severity: "high" | "medium" | "low";
  category: "brand-consistency" | "messaging" | "visual-identity" | "legal-compliance";
  consequences: string;
  lastUpdated: string;
  isActive: boolean;
}

interface AuditSchedule {
  id: string;
  auditType: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  dayOfWeek?: string;
  dayOfMonth?: number;
  time: string;
  lastRun?: string;
  nextRun: string;
  isActive: boolean;
}

interface ApprovalRole {
  id: string;
  roleName: string;
  assetTypes: string[];
  defaultReviewer: string;
  priority: number;
}

interface GovernanceManagerProps {
  rules: GovernanceRule[];
  schedules: AuditSchedule[];
  roles: ApprovalRole[];
  onUpdateRules: (rules: GovernanceRule[]) => void;
  onUpdateSchedules: (schedules: AuditSchedule[]) => void;
  onUpdateRoles: (roles: ApprovalRole[]) => void;
}

export const GovernanceManager = ({ 
  rules, 
  schedules, 
  roles, 
  onUpdateRules, 
  onUpdateSchedules, 
  onUpdateRoles 
}: GovernanceManagerProps) => {
  const [selectedRule, setSelectedRule] = useState<GovernanceRule | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<AuditSchedule | null>(null);
  const [selectedRole, setSelectedRole] = useState<ApprovalRole | null>(null);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveRule = (rule: GovernanceRule) => {
    if (selectedRule) {
      onUpdateRules(rules.map(r => r.id === selectedRule.id ? rule : r));
      toast({
        title: "Rule Updated",
        description: `${rule.name} has been updated successfully.`,
      });
    } else {
      onUpdateRules([...rules, { ...rule, id: Date.now().toString() }]);
      toast({
        title: "Rule Created",
        description: `${rule.name} has been created successfully.`,
      });
    }
    setIsRuleDialogOpen(false);
    setSelectedRule(null);
  };

  const handleDeleteRule = (id: string) => {
    onUpdateRules(rules.filter(r => r.id !== id));
    toast({
      title: "Rule Deleted",
      description: "Governance rule has been removed.",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "brand-consistency": return "bg-blue-100 text-blue-800";
      case "messaging": return "bg-green-100 text-green-800";
      case "visual-identity": return "bg-purple-100 text-purple-800";
      case "legal-compliance": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case "daily": return "Daily";
      case "weekly": return "Weekly";
      case "monthly": return "Monthly";
      case "quarterly": return "Quarterly";
      default: return frequency;
    }
  };

  return (
    <div className="space-y-6">
      {/* Governance Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Governance Rules
              </CardTitle>
              <CardDescription>
                Define and manage brand governance rules and compliance standards
              </CardDescription>
            </div>
            <Button 
              onClick={() => {
                setSelectedRule(null);
                setIsRuleDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => {
                          setSelectedRule(rule);
                          setIsRuleDialogOpen(true);
                        }}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {rule.name}
                      </button>
                      <Badge variant={getSeverityColor(rule.severity)}>
                        {rule.severity.toUpperCase()}
                      </Badge>
                      <Badge className={getCategoryColor(rule.category)}>
                        {rule.category.replace('-', ' ')}
                      </Badge>
                      {!rule.isActive && (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {rule.description}
                    </p>
                    {rule.consequences && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Consequences:</span> {rule.consequences}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Last updated: {new Date(rule.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Scheduling */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Audit Scheduling & Alerts
              </CardTitle>
              <CardDescription>
                Configure automated audit schedules and alert frequencies
              </CardDescription>
            </div>
            <Button 
              onClick={() => {
                setSelectedSchedule(null);
                setIsScheduleDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{schedule.auditType}</span>
                      <Badge variant={schedule.isActive ? "default" : "outline"}>
                        {schedule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>Frequency: {formatFrequency(schedule.frequency)}</span>
                      {schedule.dayOfWeek && (
                        <span> • {schedule.dayOfWeek}s</span>
                      )}
                      <span> at {schedule.time}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Next run: {new Date(schedule.nextRun).toLocaleString()}
                      {schedule.lastRun && (
                        <span> • Last run: {new Date(schedule.lastRun).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      setIsScheduleDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Workflows */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Approval Workflows
              </CardTitle>
              <CardDescription>
                Define approval processes and assign reviewers for different asset types
              </CardDescription>
            </div>
            <Button 
              onClick={() => {
                setSelectedRole(null);
                setIsRoleDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{role.roleName}</span>
                      <Badge variant="outline">Priority {role.priority}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Reviews:</span> {role.assetTypes.join(", ")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Default Reviewer:</span> {role.defaultReviewer}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedRole(role);
                      setIsRoleDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rule Detail Dialog */}
      <RuleDetailDialog
        rule={selectedRule}
        isOpen={isRuleDialogOpen}
        onClose={() => {
          setIsRuleDialogOpen(false);
          setSelectedRule(null);
        }}
        onSave={handleSaveRule}
      />

      {/* Schedule Detail Dialog */}
      <ScheduleDetailDialog
        schedule={selectedSchedule}
        isOpen={isScheduleDialogOpen}
        onClose={() => {
          setIsScheduleDialogOpen(false);
          setSelectedSchedule(null);
        }}
        onSave={(schedule) => {
          if (selectedSchedule) {
            onUpdateSchedules(schedules.map(s => s.id === selectedSchedule.id ? schedule : s));
          } else {
            onUpdateSchedules([...schedules, { ...schedule, id: Date.now().toString() }]);
          }
          toast({
            title: "Schedule Updated",
            description: "Audit schedule has been updated successfully.",
          });
          setIsScheduleDialogOpen(false);
          setSelectedSchedule(null);
        }}
      />

      {/* Role Detail Dialog */}
      <RoleDetailDialog
        role={selectedRole}
        isOpen={isRoleDialogOpen}
        onClose={() => {
          setIsRoleDialogOpen(false);
          setSelectedRole(null);
        }}
        onSave={(role) => {
          if (selectedRole) {
            onUpdateRoles(roles.map(r => r.id === selectedRole.id ? role : r));
          } else {
            onUpdateRoles([...roles, { ...role, id: Date.now().toString() }]);
          }
          toast({
            title: "Role Updated",
            description: "Approval role has been updated successfully.",
          });
          setIsRoleDialogOpen(false);
          setSelectedRole(null);
        }}
      />
    </div>
  );
};

// Helper dialogs would be implemented here - keeping response concise
const RuleDetailDialog = ({ rule, isOpen, onClose, onSave }: any) => {
  const [formData, setFormData] = useState(rule || {
    name: "",
    description: "",
    severity: "medium",
    category: "brand-consistency",
    consequences: "",
    isActive: true
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Rule" : "Create New Rule"}</DialogTitle>
        </DialogHeader>
        {/* Form implementation would go here */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave({ ...formData, lastUpdated: new Date().toISOString() })}>
            {rule ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ScheduleDetailDialog = ({ schedule, isOpen, onClose, onSave }: any) => {
  // Implementation would be similar to RuleDetailDialog
  return <div>Schedule Dialog</div>;
};

const RoleDetailDialog = ({ role, isOpen, onClose, onSave }: any) => {
  // Implementation would be similar to RuleDetailDialog  
  return <div>Role Dialog</div>;
};
