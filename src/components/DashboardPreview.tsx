import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Globe,
  BarChart3,
  Eye
} from "lucide-react";

const brandHealth = {
  overall: 92,
  positioning: 95,
  architecture: 89,
  messaging: 94,
  compliance: 87
};

const recentFindings = [
  {
    id: 1,
    type: "Brand Architecture",
    severity: "high",
    title: "Legacy brand name used in PR release",
    asset: "press-release-q3-2024.pdf",
    status: "assigned",
    confidence: 0.94
  },
  {
    id: 2,
    type: "Messaging Pillars",
    severity: "medium",
    title: "Innovation pillar missing from homepage",
    asset: "homepage",
    status: "in-progress",
    confidence: 0.87
  },
  {
    id: 3,
    type: "Legal Compliance",
    severity: "low",
    title: "Trademark symbol missing in footer",
    asset: "contact-page",
    status: "resolved",
    confidence: 0.91
  }
];

const assetCoverage = [
  { type: "Web Pages", total: 47, analyzed: 45, score: 89 },
  { type: "Sales Decks", total: 12, analyzed: 12, score: 94 },
  { type: "PR Content", total: 23, analyzed: 21, score: 86 },
  { type: "Legal Docs", total: 8, analyzed: 8, score: 97 }
];

export const DashboardPreview = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Real-Time Brand Health Dashboard
          </h2>
          <p className="text-xl text-muted-foreground">
            Get instant insights into your brand consistency with comprehensive analytics,
            issue tracking, and remediation workflows.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Brand Health Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-gradient-card shadow-card border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Brand Health Overview</h3>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% this week
                </Badge>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{brandHealth.overall}</div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold mb-1">{brandHealth.positioning}</div>
                  <div className="text-xs text-muted-foreground">Positioning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold mb-1">{brandHealth.architecture}</div>
                  <div className="text-xs text-muted-foreground">Architecture</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold mb-1">{brandHealth.messaging}</div>
                  <div className="text-xs text-muted-foreground">Messaging</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Brand Compliance</span>
                  <span className="font-medium">{brandHealth.compliance}%</span>
                </div>
                <Progress value={brandHealth.compliance} className="h-2" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Findings</h3>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {recentFindings.map((finding) => (
                  <div key={finding.id} className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{finding.title}</span>
                        <Badge 
                          variant={finding.severity === 'high' ? 'destructive' : finding.severity === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {finding.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {finding.asset} • {finding.type} • {Math.round(finding.confidence * 100)}% confidence
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {finding.status === 'resolved' ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : finding.status === 'in-progress' ? (
                        <Clock className="w-4 h-4 text-warning" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card shadow-card border-0">
              <h3 className="text-lg font-semibold mb-4">Asset Coverage</h3>
              <div className="space-y-4">
                {assetCoverage.map((asset, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{asset.type}</span>
                      <span className="text-muted-foreground">{asset.analyzed}/{asset.total}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Score: {asset.score}%</span>
                    </div>
                    <Progress value={(asset.analyzed / asset.total) * 100} className="h-1" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-primary text-white shadow-glow border-0">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Ready to Get Started?</h4>
                  <p className="text-sm text-white/80 mb-4">
                    Start monitoring your brand consistency today with our comprehensive analysis platform.
                  </p>
                  <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90">
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};