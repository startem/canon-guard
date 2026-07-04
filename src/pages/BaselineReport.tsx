import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

export const BaselineReport = () => {
  const assetInventory = [
    { category: "Logos", scanned: 147, compliant: 89, issues: 58 },
    { category: "Colors", scanned: 234, compliant: 156, issues: 78 },
    { category: "Typography", scanned: 89, compliant: 67, issues: 22 },
    { category: "Messaging", scanned: 45, compliant: 23, issues: 22 },
    { category: "Images", scanned: 312, compliant: 289, issues: 23 }
  ];

  const criticalIssues = [
    {
      id: 1,
      title: "Logo usage violations in marketing materials",
      category: "Visual Identity",
      severity: "high",
      count: 23,
      auditLink: "/audit-details/visual-identity"
    },
    {
      id: 2,
      title: "Inconsistent color usage across web properties",
      category: "Visual Identity", 
      severity: "medium",
      count: 15,
      auditLink: "/audit-details/visual-identity"
    },
    {
      id: 3,
      title: "Typography inconsistencies in digital assets",
      category: "Visual Identity",
      severity: "medium", 
      count: 12,
      auditLink: "/audit-details/visual-identity"
    },
    {
      id: 4,
      title: "Brand messaging inconsistencies",
      category: "Content Audit",
      severity: "high",
      count: 18,
      auditLink: "/audit-details/content-audit"
    }
  ];

  const nextSteps = [
    {
      title: "Typography Consistency",
      description: "Standardize font usage across all touchpoints",
      action: "Fix Typography Issues",
      link: "/identity-designer",
      priority: "high"
    },
    {
      title: "Color Usage Compliance", 
      description: "Ensure brand colors are used correctly",
      action: "Review Color Palette",
      link: "/identity-designer",
      priority: "high"
    },
    {
      title: "Logo Placement Guidelines",
      description: "Update logo usage in marketing materials", 
      action: "View Logo Guidelines",
      link: "/audit-details/visual-identity",
      priority: "medium"
    },
    {
      title: "Messaging Alignment",
      description: "Align all messaging with brand voice",
      action: "Review Messaging",
      link: "/positioning-messaging",
      priority: "medium"
    }
  ];

  const getComplianceColor = (compliant: number, total: number) => {
    const percentage = (compliant / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary"; 
      case "low": return "outline";
      default: return "outline";
    }
  };

  return (
    <PageShell>
      {/* Header */}
      <PageHeader
        icon={FileText}
        eyebrow="Setup"
        title="Baseline Report"
        description="Complete analysis of your brand assets and compliance status."
        actions={
          <>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </>
        }
      />

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>
            Overall brand compliance and asset inventory overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">827</div>
              <div className="text-sm text-muted-foreground">Total Assets Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">624</div>
              <div className="text-sm text-muted-foreground">Compliant Assets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">203</div>
              <div className="text-sm text-muted-foreground">Issues Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">75%</div>
              <div className="text-sm text-muted-foreground">Overall Compliance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Inventory & Compliance</CardTitle>
          <CardDescription>
            Breakdown of scanned assets by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assetInventory.map((asset) => {
              const compliancePercentage = (asset.compliant / asset.scanned) * 100;
              return (
                <div key={asset.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{asset.category}</div>
                    <div className="text-sm text-muted-foreground">
                      {asset.compliant}/{asset.scanned} compliant ({Math.round(compliancePercentage)}%)
                    </div>
                  </div>
                  <Progress value={compliancePercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{asset.scanned} scanned</span>
                    <span className={getComplianceColor(asset.compliant, asset.scanned)}>
                      {asset.issues} issues
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Critical Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Critical Issues
          </CardTitle>
          <CardDescription>
            High-priority issues requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{issue.title}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(issue.severity)} className="text-xs">
                      {issue.severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {issue.count} instances found
                    </span>
                  </div>
                </div>
                <Link to={issue.auditLink}>
                  <Button variant="outline" size="sm">
                    View Details
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            Recommended Next Steps
          </CardTitle>
          <CardDescription>
            Actionable recommendations to improve brand compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextSteps.map((step, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{step.title}</h4>
                  <Badge variant={getPriorityColor(step.priority)} className="text-xs">
                    {step.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                <Link to={step.link}>
                  <Button variant="outline" size="sm" className="w-full">
                    {step.action}
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};