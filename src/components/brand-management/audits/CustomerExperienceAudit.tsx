import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart,
  Play,
  RefreshCw,
  Download
} from "lucide-react";

export const CustomerExperienceAudit = () => {
  const auditData = {
    overallScore: 91,
    status: "excellent",
    lastRun: "2 hours ago",
    touchpoints: 28,
    consistentTouchpoints: 25,
    issues: 1
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Customer Experience Audit</CardTitle>
                <CardDescription>
                  Brand touchpoint consistency and customer journey analysis
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
              <div className="text-2xl font-bold text-primary">{auditData.touchpoints}</div>
              <div className="text-sm text-muted-foreground">Touchpoints</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{auditData.consistentTouchpoints}</div>
              <div className="text-sm text-muted-foreground">Consistent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{auditData.issues}</div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.lastRun}</div>
              <div className="text-sm text-muted-foreground">Last Review</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};