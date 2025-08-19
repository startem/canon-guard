import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Shield, 
  BarChart3, 
  GitBranch, 
  AlertTriangle, 
  Users,
  FileText,
  Zap,
  Target
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "AI + RAG Analysis",
    description: "Intelligent analysis of positioning, value props, brand architecture, and messaging pillars with citations and evidence.",
    badge: "Core Feature",
    badgeVariant: "default" as const
  },
  {
    icon: Shield,
    title: "Brand Canon Management",
    description: "Versioned source of truth for names, lockups, boilerplate, messaging pillars, and legal lines with governance workflows.",
    badge: "Enterprise",
    badgeVariant: "secondary" as const
  },
  {
    icon: BarChart3,
    title: "Baseline & Drift Detection",
    description: "Create snapshots of brand health, track changes over time, and measure consistency improvements automatically.",
    badge: "Analytics",
    badgeVariant: "outline" as const
  },
  {
    icon: GitBranch,
    title: "Multi-Asset Ingestion",
    description: "Crawl websites, analyze PDFs/PPTX, monitor PR content, and connect to drive systems for comprehensive coverage.",
    badge: "Integration",
    badgeVariant: "secondary" as const
  },
  {
    icon: AlertTriangle,
    title: "Issue Management",
    description: "Automated issue detection with severity scoring, assignment workflows, and integration with Jira/Asana for remediation.",
    badge: "Workflow",
    badgeVariant: "destructive" as const
  },
  {
    icon: Users,
    title: "Multi-Brand Portfolios",
    description: "Support complex brand hierarchies with sub-brands, regional variants, and role-based access controls.",
    badge: "Enterprise",
    badgeVariant: "secondary" as const
  }
];

const metrics = [
  {
    icon: Target,
    value: "+40%",
    label: "Brand Consistency Improvement",
    description: "Average uplift in on-brand compliance scores"
  },
  {
    icon: Zap,
    value: "<24h",
    label: "Drift Detection Speed",
    description: "Median time from change to detection"
  },
  {
    icon: FileText,
    value: "90%",
    label: "Asset Coverage",
    description: "Tier-1 assets monitored automatically"
  },
  {
    icon: Shield,
    value: "0.85",
    label: "Precision Score",
    description: "Accuracy for critical brand violations"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-6">
            Complete Brand Strategy & Architecture Platform
          </h2>
          <p className="text-xl text-muted-foreground">
            From ingestion to remediation, maintain perfect brand consistency across all your assets 
            with AI-powered analysis and automated workflows.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-card transition-brand bg-gradient-card border-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant={feature.badgeVariant} className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Metrics */}
        <div className="bg-gradient-card rounded-2xl p-8 shadow-card">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Proven Results</h3>
            <p className="text-muted-foreground">
              Measurable improvements in brand consistency and operational efficiency
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
                  <metric.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary">{metric.value}</div>
                <div className="font-semibold">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};