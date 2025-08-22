import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Eye,
  Play,
  RefreshCw,
  Download,
  Palette,
  Image
} from "lucide-react";

export const VisualIdentityAudit = () => {
  const auditData = {
    overallScore: 95,
    status: "excellent",
    lastRun: "45 mins ago",
    visualAssets: 156,
    compliantAssets: 148,
    issues: 1
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Visual Identity Audit</CardTitle>
                <CardDescription>
                  Logo usage, colors, and visual consistency analysis
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
              <div className="text-2xl font-bold text-primary">{auditData.visualAssets}</div>
              <div className="text-sm text-muted-foreground">Visual Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{auditData.compliantAssets}</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{auditData.issues}</div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.lastRun}</div>
              <div className="text-sm text-muted-foreground">Last Check</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};