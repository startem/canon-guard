import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users,
  Play,
  RefreshCw,
  Download
} from "lucide-react";

export const EmployeeBrandAudit = () => {
  const auditData = {
    overallScore: 76,
    status: "warning",
    lastRun: "6 hours ago",
    employees: 245,
    trainedEmployees: 186,
    issues: 6
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Employee Brand Alignment Audit</CardTitle>
                <CardDescription>
                  Internal brand understanding and usage compliance
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-warning/10 text-warning border-warning/20 text-lg px-4 py-2">
              Score: {auditData.overallScore}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.employees}</div>
              <div className="text-sm text-muted-foreground">Total Employees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{auditData.trainedEmployees}</div>
              <div className="text-sm text-muted-foreground">Brand Trained</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{auditData.issues}</div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.lastRun}</div>
              <div className="text-sm text-muted-foreground">Last Survey</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};