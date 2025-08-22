import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Play,
  RefreshCw,
  Download,
  Target,
  Users,
  DollarSign,
  Award
} from "lucide-react";

export const CompetitorAnalysisAudit = () => {
  const auditData = {
    overallScore: 85,
    status: "good",
    lastRun: "1 hour ago",
    competitorsTracked: 8,
    marketPosition: 2,
    brandStrength: 78
  };

  const competitors = [
    {
      name: "CompetitorCorp",
      marketShare: 32,
      brandStrength: 85,
      trend: -3.2,
      similarity: 68,
      threats: ["Similar messaging", "Price competition"]
    },
    {
      name: "RivalBrand Inc",
      marketShare: 28,
      brandStrength: 72,
      trend: 5.7,
      similarity: 45,
      threats: ["Product innovation"]
    },
    {
      name: "MarketLeader Ltd",
      marketShare: 45,
      brandStrength: 92,
      trend: 1.2,
      similarity: 23,
      threats: ["Market dominance", "Brand recognition"]
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Competitor Analysis Audit</CardTitle>
                <CardDescription>
                  Competitive landscape monitoring and brand positioning analysis
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
              <div className="text-2xl font-bold text-primary">{auditData.competitorsTracked}</div>
              <div className="text-sm text-muted-foreground">Competitors Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">#{auditData.marketPosition}</div>
              <div className="text-sm text-muted-foreground">Market Position</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{auditData.brandStrength}%</div>
              <div className="text-sm text-muted-foreground">Brand Strength</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{auditData.lastRun}</div>
              <div className="text-sm text-muted-foreground">Last Analysis</div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button variant="hero">
              <Play className="w-4 h-4 mr-2" />
              Run Analysis
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {competitors.map((competitor) => (
          <Card key={competitor.name}>
            <CardHeader>
              <CardTitle className="text-lg">{competitor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Market Share</div>
                    <div className="font-bold text-lg">{competitor.marketShare}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Brand Strength</div>
                    <div className="font-bold text-lg">{competitor.brandStrength}%</div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Brand Similarity</span>
                    <span className="font-medium">{competitor.similarity}%</span>
                  </div>
                  <Progress value={competitor.similarity} className="h-2" />
                </div>

                {competitor.threats.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Key Threats:</div>
                    {competitor.threats.map((threat, index) => (
                      <div key={index} className="text-xs text-muted-foreground">• {threat}</div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};