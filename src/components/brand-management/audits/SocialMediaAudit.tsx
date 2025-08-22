import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  MessageCircle,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Play,
  RefreshCw,
  Download,
  TrendingUp,
  Users,
  Heart
} from "lucide-react";

export const SocialMediaAudit = () => {
  const auditData = {
    overallScore: 74,
    status: "warning",
    lastRun: "5 mins ago",
    totalFollowers: 125000,
    engagementRate: 4.2,
    brandMentions: 89
  };

  const platforms = [
    {
      name: "Twitter",
      icon: Twitter,
      followers: 45000,
      engagement: 3.8,
      brandCompliance: 68,
      issues: 5
    },
    {
      name: "Instagram", 
      icon: Instagram,
      followers: 62000,
      engagement: 6.2,
      brandCompliance: 82,
      issues: 2
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      followers: 18000,
      engagement: 2.9,
      brandCompliance: 91,
      issues: 1
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Social Media Audit</CardTitle>
                <CardDescription>
                  Social media brand presence and engagement monitoring
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
              <div className="text-2xl font-bold text-primary">{auditData.totalFollowers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{auditData.engagementRate}%</div>
              <div className="text-sm text-muted-foreground">Avg Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.brandMentions}</div>
              <div className="text-sm text-muted-foreground">Brand Mentions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.lastRun}</div>
              <div className="text-sm text-muted-foreground">Last Scan</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Card key={platform.name}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Followers</div>
                      <div className="font-bold text-lg">{platform.followers.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Engagement</div>
                      <div className="font-bold text-lg">{platform.engagement}%</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Brand Compliance</span>
                      <span className="font-medium">{platform.brandCompliance}%</span>
                    </div>
                    <Progress value={platform.brandCompliance} className="h-2" />
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">Issues: </span>
                    <Badge variant={platform.issues > 3 ? "destructive" : "secondary"}>
                      {platform.issues}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};