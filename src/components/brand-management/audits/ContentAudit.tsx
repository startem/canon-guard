import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText,
  Play,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const ContentAudit = () => {
  const auditData = {
    overallScore: 89,
    status: "excellent",
    lastRun: "30 mins ago",
    totalContent: 342,
    compliantContent: 305,
    issues: 2
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Content Audit</CardTitle>
                <CardDescription>
                  Content quality and brand alignment assessment
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-success/10 text-success border-success/20 text-lg px-4 py-2">
              Score: {auditData.overallScore}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.totalContent}</div>
              <div className="text-sm text-muted-foreground">Total Content</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{auditData.compliantContent}</div>
              <div className="text-sm text-muted-foreground">Brand Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{auditData.issues}</div>
              <div className="text-sm text-muted-foreground">Issues Found</div>
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