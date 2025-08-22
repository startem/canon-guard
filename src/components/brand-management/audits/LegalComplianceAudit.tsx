import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield,
  Play,
  RefreshCw,
  Download,
  AlertTriangle
} from "lucide-react";

export const LegalComplianceAudit = () => {
  const auditData = {
    overallScore: 88,
    status: "good", 
    lastRun: "3 hours ago",
    totalChecks: 45,
    compliantItems: 40,
    issues: 2
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Legal Compliance Audit</CardTitle>
                <CardDescription>
                  Trademark, copyright, and legal compliance monitoring
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-4 py-2">
              Score: {auditData.overallScore}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.totalChecks}</div>
              <div className="text-sm text-muted-foreground">Total Checks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{auditData.compliantItems}</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{auditData.issues}</div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.lastRun}</div>
              <div className="text-sm text-muted-foreground">Last Audit</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};