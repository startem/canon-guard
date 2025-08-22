import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Play, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";

interface AuditType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  score: number;
  status: string;
  description: string;
  issues: number;
  lastRun: string;
}

interface BrandAuditOverviewProps {
  auditTypes: AuditType[];
  executeAudit: (auditId: string) => void;
}

export const BrandAuditOverview = ({ auditTypes, executeAudit }: BrandAuditOverviewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-success";
      case "good": return "text-primary";
      case "warning": return "text-warning";
      case "critical": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent": return "bg-success/10 text-success border-success/20";
      case "good": return "bg-primary/10 text-primary border-primary/20";
      case "warning": return "bg-warning/10 text-warning border-warning/20";
      case "critical": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getTrendIcon = (score: number) => {
    if (score >= 85) return <TrendingUp className="w-4 h-4 text-success" />;
    if (score >= 70) return <Minus className="w-4 h-4 text-warning" />;
    return <TrendingDown className="w-4 h-4 text-destructive" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "good": return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-warning" />;
      case "critical": return <XCircle className="w-5 h-5 text-destructive" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const averageScore = Math.round(auditTypes.reduce((sum, audit) => sum + audit.score, 0) / auditTypes.length);
  const totalIssues = auditTypes.reduce((sum, audit) => sum + audit.issues, 0);
  const criticalAudits = auditTypes.filter(audit => audit.status === "critical").length;
  const excellentAudits = auditTypes.filter(audit => audit.status === "excellent").length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-primary">{averageScore}%</div>
              {getTrendIcon(averageScore)}
            </div>
            <Progress value={averageScore} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-destructive">{totalIssues}</div>
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Across all audits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-destructive">{criticalAudits}</div>
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Excellent Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-success">{excellentAudits}</div>
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Performing well</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auditTypes.map((audit) => {
          const Icon = audit.icon;
          return (
            <Card key={audit.id} className="hover:shadow-brand transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{audit.name}</CardTitle>
                  </div>
                  {getStatusIcon(audit.status)}
                </div>
                <CardDescription className="text-sm">
                  {audit.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Score Display */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span className={`text-2xl font-bold ${getStatusColor(audit.status)}`}>
                        {audit.score}%
                      </span>
                    </div>
                    <Badge className={getStatusBadge(audit.status)}>
                      {audit.status}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <Progress value={audit.score} className="h-2" />

                  {/* Issues and Last Run */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Issues:</span>
                      <Badge 
                        variant={audit.issues > 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {audit.issues}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{audit.lastRun}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => executeAudit(audit.id)}
                  >
                    <Play className="w-3 h-3 mr-2" />
                    Run Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Perform common brand management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" onClick={() => {
              // Run all audits sequentially
              auditTypes.forEach((audit, index) => {
                setTimeout(() => executeAudit(audit.id), index * 500);
              });
            }}>
              <Play className="w-4 h-4 mr-2" />
              Run All Audits
            </Button>
            <Button variant="outline">
              <AlertCircle className="w-4 h-4 mr-2" />
              View Critical Issues
            </Button>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              Configure Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};