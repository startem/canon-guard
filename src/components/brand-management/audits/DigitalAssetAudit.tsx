import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Globe,
  Play,
  RefreshCw,
  Download
} from "lucide-react";

export const DigitalAssetAudit = () => {
  const auditData = {
    overallScore: 82,
    status: "good",
    lastRun: "1 hour ago",
    websites: 12,
    compliantSites: 10,
    issues: 4
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Digital Asset Audit</CardTitle>
                <CardDescription>
                  Website and digital property brand alignment analysis
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
              <div className="text-2xl font-bold text-primary">{auditData.websites}</div>
              <div className="text-sm text-muted-foreground">Websites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{auditData.compliantSites}</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{auditData.issues}</div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.lastRun}</div>
              <div className="text-sm text-muted-foreground">Last Scan</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};