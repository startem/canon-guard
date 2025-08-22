import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BrandProvider } from "@/hooks/useBrandContext";
import { 
  Monitor, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Search,
  Shield,
  Eye,
  MessageCircle,
  BarChart3,
  Settings,
  FileText,
  Globe,
  Smartphone,
  Heart
} from "lucide-react";
import { BrandAuditOverview } from "./BrandAuditOverview";
import { BrandConsistencyAudit } from "./audits/BrandConsistencyAudit";
import { BrandPerceptionAudit } from "./audits/BrandPerceptionAudit";
import { CompetitorAnalysisAudit } from "./audits/CompetitorAnalysisAudit";
import { SocialMediaAudit } from "./audits/SocialMediaAudit";
import { ContentAudit } from "./audits/ContentAudit";
import { VisualIdentityAudit } from "./audits/VisualIdentityAudit";
import { LegalComplianceAudit } from "./audits/LegalComplianceAudit";
import { DigitalAssetAudit } from "./audits/DigitalAssetAudit";
import { EmployeeBrandAudit } from "./audits/EmployeeBrandAudit";
import { CustomerExperienceAudit } from "./audits/CustomerExperienceAudit";
import { IssueManagement } from "./IssueManagement";
import { BrandReporting } from "./BrandReporting";

export const BrandManagementDashboard = () => {
  const [activeAudit, setActiveAudit] = useState("overview");

  const brandHealthScore = 87;
  const totalIssues = 23;
  const criticalIssues = 3;
  const mentions = 1247;
  const sentimentScore = 78;

  const auditTypes = [
    {
      id: "consistency",
      name: "Brand Consistency",
      icon: Shield,
      score: 92,
      status: "excellent",
      description: "Brand guidelines compliance across all assets",
      issues: 2,
      lastRun: "2 hours ago"
    },
    {
      id: "perception",
      name: "Brand Perception",
      icon: Eye,
      score: 78,
      status: "good",
      description: "Public sentiment and brand perception analysis", 
      issues: 5,
      lastRun: "15 mins ago"
    },
    {
      id: "competitor",
      name: "Competitor Analysis",
      icon: BarChart3,
      score: 85,
      status: "good",
      description: "Competitive landscape and positioning analysis",
      issues: 3,
      lastRun: "1 hour ago"
    },
    {
      id: "social",
      name: "Social Media",
      icon: MessageCircle,
      score: 74,
      status: "warning",
      description: "Social media presence and engagement monitoring",
      issues: 8,
      lastRun: "5 mins ago"
    },
    {
      id: "content",
      name: "Content Audit",
      icon: FileText,
      score: 89,
      status: "excellent",
      description: "Content quality and brand alignment assessment",
      issues: 2,
      lastRun: "30 mins ago"
    },
    {
      id: "visual",
      name: "Visual Identity",
      icon: Eye,
      score: 95,
      status: "excellent",
      description: "Logo usage, colors, and visual consistency check",
      issues: 1,
      lastRun: "45 mins ago"
    },
    {
      id: "legal",
      name: "Legal Compliance",
      icon: Shield,
      score: 88,
      status: "good",
      description: "Trademark, copyright, and legal compliance monitoring",
      issues: 2,
      lastRun: "3 hours ago"
    },
    {
      id: "digital",
      name: "Digital Assets",
      icon: Globe,
      score: 82,
      status: "good",
      description: "Website and digital property brand alignment",
      issues: 4,
      lastRun: "1 hour ago"
    },
    {
      id: "employee",
      name: "Employee Alignment",
      icon: Users,
      score: 76,
      status: "warning",
      description: "Internal brand understanding and usage compliance",
      issues: 6,
      lastRun: "6 hours ago"
    },
    {
      id: "customer",
      name: "Customer Experience",
      icon: Heart,
      score: 91,
      status: "excellent",
      description: "Brand touchpoint consistency analysis",
      issues: 1,
      lastRun: "2 hours ago"
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
    <BrandProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-gradient-card">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">Brand Management Hub</h1>
                  <Badge className={`${getStatusBadge(brandHealthScore >= 90 ? "excellent" : brandHealthScore >= 75 ? "good" : brandHealthScore >= 60 ? "warning" : "critical")}`}>
                    Health Score: {brandHealthScore}%
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Continuous brand monitoring, audits, and management platform
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Audit Settings
                </Button>
                <Button variant="hero" size="sm">
                  <Monitor className="w-4 h-4 mr-2" />
                  Run Full Audit
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <Card className="p-4 bg-background/50">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-primary">{brandHealthScore}%</div>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="text-sm text-muted-foreground">Brand Health</div>
                <Progress value={brandHealthScore} className="mt-2 h-2" />
              </Card>
              <Card className="p-4 bg-background/50">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-destructive">{criticalIssues}</div>
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-sm text-muted-foreground">Critical Issues</div>
              </Card>
              <Card className="p-4 bg-background/50">
                <div className="text-2xl font-bold text-primary">{totalIssues}</div>
                <div className="text-sm text-muted-foreground">Total Issues</div>
              </Card>
              <Card className="p-4 bg-background/50">
                <div className="text-2xl font-bold text-accent">{mentions.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Brand Mentions</div>
              </Card>
              <Card className="p-4 bg-background/50">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-success">{sentimentScore}%</div>
                  <Heart className="w-5 h-5 text-success" />
                </div>
                <div className="text-sm text-muted-foreground">Sentiment Score</div>
                <Progress value={sentimentScore} className="mt-2 h-2" />
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <Tabs value={activeAudit} onValueChange={setActiveAudit} className="space-y-8">
            <TabsList className="w-full grid grid-cols-4 lg:flex lg:w-auto bg-gradient-card">
              <TabsTrigger value="overview" className="flex items-center gap-2 min-w-[120px]">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="audits" className="flex items-center gap-2 min-w-[120px]">
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Audits</span>
              </TabsTrigger>
              <TabsTrigger value="issues" className="flex items-center gap-2 min-w-[120px]">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Issues</span>
              </TabsTrigger>
              <TabsTrigger value="reporting" className="flex items-center gap-2 min-w-[120px]">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <BrandAuditOverview auditTypes={auditTypes} />
            </TabsContent>

            <TabsContent value="audits" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Audit Type Selection */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Audit Types</CardTitle>
                      <CardDescription>Select an audit to view details</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {auditTypes.map((audit) => {
                          const Icon = audit.icon;
                          return (
                            <button
                              key={audit.id}
                              onClick={() => setActiveAudit(`audit-${audit.id}`)}
                              className={`w-full text-left p-4 hover:bg-muted/50 transition-colors border-b last:border-b-0 ${
                                activeAudit === `audit-${audit.id}` ? 'bg-primary/10 border-primary/20' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Icon className="w-5 h-5 text-primary" />
                                  <div>
                                    <div className="font-medium">{audit.name}</div>
                                    <div className="text-sm text-muted-foreground">{audit.lastRun}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-lg font-bold ${getStatusColor(audit.status)}`}>
                                    {audit.score}%
                                  </div>
                                  {audit.issues > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      {audit.issues}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Audit Details */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Audit Details</CardTitle>
                      <CardDescription>
                        Select an audit type from the left to view detailed analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Choose an audit type to view comprehensive analysis and insights</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Individual Audit Content */}
            <TabsContent value="audit-consistency"><BrandConsistencyAudit /></TabsContent>
            <TabsContent value="audit-perception"><BrandPerceptionAudit /></TabsContent>
            <TabsContent value="audit-competitor"><CompetitorAnalysisAudit /></TabsContent>
            <TabsContent value="audit-social"><SocialMediaAudit /></TabsContent>
            <TabsContent value="audit-content"><ContentAudit /></TabsContent>
            <TabsContent value="audit-visual"><VisualIdentityAudit /></TabsContent>
            <TabsContent value="audit-legal"><LegalComplianceAudit /></TabsContent>
            <TabsContent value="audit-digital"><DigitalAssetAudit /></TabsContent>
            <TabsContent value="audit-employee"><EmployeeBrandAudit /></TabsContent>
            <TabsContent value="audit-customer"><CustomerExperienceAudit /></TabsContent>

            <TabsContent value="issues" className="space-y-6">
              <IssueManagement />
            </TabsContent>

            <TabsContent value="reporting" className="space-y-6">
              <BrandReporting />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BrandProvider>
  );
};