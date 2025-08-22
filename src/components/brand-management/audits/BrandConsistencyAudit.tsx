import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Play,
  RefreshCw,
  Download,
  Eye,
  Palette,
  Type,
  Image,
  Globe,
  BarChart3
} from "lucide-react";

export const BrandConsistencyAudit = () => {
  const auditData = {
    overallScore: 92,
    status: "excellent",
    lastRun: "2 hours ago",
    totalAssets: 247,
    compliantAssets: 227,
    issues: 2,
    categories: [
      {
        name: "Logo Usage",
        score: 95,
        status: "excellent",
        compliant: 45,
        total: 47,
        icon: Image,
        issues: ["Incorrect logo placement in 2 email templates"]
      },
      {
        name: "Color Palette", 
        score: 98,
        status: "excellent",
        compliant: 89,
        total: 91,
        icon: Palette,
        issues: ["Off-brand color in social media post #SMP-001"]
      },
      {
        name: "Typography",
        score: 88,
        status: "good",
        compliant: 52,
        total: 59,
        icon: Type,
        issues: ["Non-brand font used in 7 documents", "Incorrect font weights in presentation deck"]
      },
      {
        name: "Digital Assets",
        score: 94,
        status: "excellent", 
        compliant: 41,
        total: 44,
        icon: Globe,
        issues: ["Outdated favicon on subdomain"]
      }
    ]
  };

  const recentFindings = [
    {
      id: "BCF-001",
      type: "Logo Violation",
      severity: "medium",
      description: "Incorrect logo spacing detected in email campaign template",
      asset: "Email Template #ETM-247",
      confidence: 98,
      detected: "1 hour ago"
    },
    {
      id: "BCF-002", 
      type: "Color Inconsistency",
      severity: "low",
      description: "Brand secondary color used instead of primary in CTA button",
      asset: "Landing Page #LP-089",
      confidence: 87,
      detected: "3 hours ago"
    }
  ];

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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Brand Consistency Audit</CardTitle>
                <CardDescription>
                  Comprehensive analysis of brand guidelines compliance across all assets
                </CardDescription>
              </div>
            </div>
            <Badge className={`${getStatusBadge(auditData.status)} text-lg px-4 py-2`}>
              Score: {auditData.overallScore}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.compliantAssets}</div>
              <div className="text-sm text-muted-foreground">Compliant Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{auditData.totalAssets}</div>
              <div className="text-sm text-muted-foreground">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{auditData.issues}</div>
              <div className="text-sm text-muted-foreground">Active Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.lastRun}</div>
              <div className="text-sm text-muted-foreground">Last Audit</div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button variant="hero" onClick={() => window.location.reload()}>
              <Play className="w-4 h-4 mr-2" />
              Run New Audit
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {auditData.categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <Badge className={getStatusBadge(category.status)}>
                    {category.score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Rate</span>
                    <span className="font-medium">{category.compliant}/{category.total} assets</span>
                  </div>
                  <Progress value={category.score} className="h-2" />
                  
                  {category.issues.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Issues Found:</div>
                      {category.issues.map((issue, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="w-3 h-3 text-warning flex-shrink-0" />
                          <span className="text-muted-foreground">{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-3 h-3 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Findings</CardTitle>
          <CardDescription>Latest brand consistency issues detected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFindings.map((finding) => (
              <div key={finding.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{finding.type}</span>
                      <Badge className={getSeverityBadge(finding.severity)}>
                        {finding.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{finding.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span>Asset: {finding.asset}</span>
                      <span>Confidence: {finding.confidence}%</span>
                      <span>Detected: {finding.detected}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-2" />
                    Review
                  </Button>
                  <Button variant="default" size="sm">
                    Fix Issue
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
            <CardDescription>Brand assets by type and compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Email Templates</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">45/47</span>
                  <Progress value={95.7} className="w-24 h-2" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Social Media Posts</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">89/91</span>
                  <Progress value={97.8} className="w-24 h-2" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Marketing Materials</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">52/59</span>
                  <Progress value={88.1} className="w-24 h-2" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Website Pages</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">41/44</span>
                  <Progress value={93.2} className="w-24 h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Priority Matrix</CardTitle>
            <CardDescription>Current issues by severity and impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-destructive/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-sm font-medium">Critical Issues</span>
                </div>
                <Badge variant="destructive">0</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-warning/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span className="text-sm font-medium">High Priority</span>
                </div>
                <Badge className="bg-warning/10 text-warning border-warning/20">2</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">Medium Priority</span>
                </div>
                <Badge variant="secondary">0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Automated suggestions to improve brand consistency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-success/5">
              <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
              <div>
                <div className="font-medium text-success">Excellent Logo Compliance</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your logo usage is 95% compliant. Consider creating automated templates to maintain this standard.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-warning/5">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <div className="font-medium text-warning">Typography Standardization Needed</div>
                <p className="text-sm text-muted-foreground mt-1">
                  7 documents use non-brand fonts. Update style templates and provide font installation guide.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  View Font Guide
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg bg-primary/5">
              <Eye className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-medium text-primary">Monitor Email Templates</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Set up automated monitoring for email template changes to catch compliance issues early.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Setup Monitoring
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};