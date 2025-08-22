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

  const contentCategories = [
    {
      name: "Blog Posts",
      total: 87,
      compliant: 82,
      score: 94,
      status: "excellent",
      issues: ["Outdated brand voice in 3 posts", "Missing brand keywords in 2 posts"]
    },
    {
      name: "Email Campaigns", 
      total: 156,
      compliant: 142,
      score: 91,
      status: "excellent",
      issues: ["Inconsistent CTA styling in 8 emails", "Wrong tone in 6 campaigns"]
    },
    {
      name: "Social Media Content",
      total: 89,
      compliant: 71,
      score: 80,
      status: "good",
      issues: ["Off-brand hashtags in 12 posts", "Incorrect image filters in 6 posts"]
    },
    {
      name: "Marketing Materials",
      total: 45,
      compliant: 38,
      score: 84,
      status: "good", 
      issues: ["Old logo usage in 4 brochures", "Wrong color palette in 3 flyers"]
    }
  ];

  const recentAnalysis = [
    {
      id: "CA-001",
      title: "Brand Voice Consistency Check",
      content: "Recent blog post about product launch",
      score: 92,
      issues: ["Slightly formal tone instead of conversational"],
      recommendations: ["Use more contractions", "Add personal anecdotes"]
    },
    {
      id: "CA-002", 
      title: "Email Campaign Analysis",
      content: "Weekly newsletter #247",
      score: 87,
      issues: ["Missing brand personality", "Generic subject line"],
      recommendations: ["Add brand-specific terminology", "Use action-oriented language"]
    },
    {
      id: "CA-003",
      title: "Social Media Post Review",
      content: "Instagram story series",
      score: 95,
      issues: [],
      recommendations: ["Maintain current approach", "Consider expanding to other platforms"]
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
          
          <div className="flex gap-3 mt-6">
            <Button variant="hero">
              <Play className="w-4 h-4 mr-2" />
              Run Content Scan
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Analysis
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contentCategories.map((category) => (
          <Card key={category.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge className={getStatusBadge(category.status)}>
                  {category.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Compliance Rate</span>
                  <span className="font-medium">{category.compliant}/{category.total} pieces</span>
                </div>
                <Progress value={category.score} className="h-2" />
                
                {category.issues.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Issues:</div>
                    {category.issues.map((issue, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-3 h-3 text-warning flex-shrink-0" />
                        <span className="text-muted-foreground">{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Content Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content Analysis</CardTitle>
          <CardDescription>Latest content pieces analyzed for brand compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalysis.map((analysis) => (
              <div key={analysis.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{analysis.title}</h4>
                    <p className="text-sm text-muted-foreground">{analysis.content}</p>
                  </div>
                  <Badge className={`${getStatusBadge(analysis.score >= 90 ? "excellent" : analysis.score >= 75 ? "good" : "warning")}`}>
                    {analysis.score}%
                  </Badge>
                </div>
                
                {analysis.issues.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Issues:</div>
                    <div className="space-y-1">
                      {analysis.issues.map((issue, index) => (
                        <div key={index} className="text-sm text-muted-foreground">• {issue}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Recommendations:</div>
                  <div className="space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="text-sm text-success">✓ {rec}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Voice Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">87%</div>
              <Progress value={87} className="mb-2" />
              <p className="text-sm text-muted-foreground">Conversational and authentic tone maintained</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Messaging Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">92%</div>
              <Progress value={92} className="mb-2" />
              <p className="text-sm text-muted-foreground">Key messages align across all content</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Visual Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">89%</div>
              <Progress value={89} className="mb-2" />
              <p className="text-sm text-muted-foreground">Images and graphics follow brand guidelines</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};