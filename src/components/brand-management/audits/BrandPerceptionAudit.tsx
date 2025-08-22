import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  MessageCircle,
  Heart,
  Frown,
  Meh,
  Smile,
  Play,
  RefreshCw,
  Download,
  Twitter,
  Facebook,
  Linkedin,
  Instagram
} from "lucide-react";

export const BrandPerceptionAudit = () => {
  const auditData = {
    overallScore: 78,
    status: "good",
    lastRun: "15 mins ago",
    totalMentions: 1247,
    positiveSentiment: 65,
    negativeSentiment: 23,
    neutralSentiment: 12,
    sentimentTrend: 5.2
  };

  const platforms = [
    {
      name: "Twitter",
      icon: Twitter,
      mentions: 456,
      sentiment: 72,
      trend: 8.5,
      engagement: 3420
    },
    {
      name: "Facebook",
      icon: Facebook,
      mentions: 298,
      sentiment: 81,
      trend: -2.3,
      engagement: 1890
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      mentions: 234,
      sentiment: 85,
      trend: 12.1,
      engagement: 2100
    },
    {
      name: "Instagram", 
      icon: Instagram,
      mentions: 189,
      sentiment: 68,
      trend: -5.7,
      engagement: 4560
    }
  ];

  const recentMentions = [
    {
      id: "MEN-001",
      platform: "Twitter",
      text: "Just tried @BrandName's new product - absolutely loving the design and quality! 🔥",
      sentiment: "positive",
      reach: 1200,
      engagement: 89,
      timestamp: "2 minutes ago"
    },
    {
      id: "MEN-002",
      platform: "LinkedIn",
      text: "Impressive brand consistency from @BrandName across all touchpoints. Great example of strategic branding.",
      sentiment: "positive", 
      reach: 850,
      engagement: 45,
      timestamp: "15 minutes ago"
    },
    {
      id: "MEN-003",
      platform: "Facebook",
      text: "Had an issue with customer service, but @BrandName team resolved it quickly. Good recovery!",
      sentiment: "neutral",
      reach: 320,
      engagement: 12,
      timestamp: "1 hour ago"
    }
  ];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <Smile className="w-4 h-4 text-success" />;
      case "negative": return <Frown className="w-4 h-4 text-destructive" />;
      default: return <Meh className="w-4 h-4 text-warning" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-success/10 text-success border-success/20";
      case "negative": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-warning/10 text-warning border-warning/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Brand Perception Audit</CardTitle>
                <CardDescription>
                  Real-time sentiment analysis and brand perception monitoring
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
              <div className="text-2xl font-bold text-primary">{auditData.totalMentions}</div>
              <div className="text-sm text-muted-foreground">Total Mentions</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="text-2xl font-bold text-success">{auditData.positiveSentiment}%</div>
                <Smile className="w-5 h-5 text-success" />
              </div>
              <div className="text-sm text-muted-foreground">Positive Sentiment</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="text-2xl font-bold text-destructive">{auditData.negativeSentiment}%</div>
                <Frown className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-sm text-muted-foreground">Negative Sentiment</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="text-2xl font-bold text-success">+{auditData.sentimentTrend}%</div>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="text-sm text-muted-foreground">Trend (7d)</div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button variant="hero">
              <Play className="w-4 h-4 mr-2" />
              Run New Analysis
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

      {/* Sentiment Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
          <CardDescription>Overall brand sentiment across all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-success" />
                  <span>Positive</span>
                </div>
                <span className="font-medium">{auditData.positiveSentiment}%</span>
              </div>
              <Progress value={auditData.positiveSentiment} className="h-2 bg-success/20 [&>div]:bg-success" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Meh className="w-4 h-4 text-warning" />
                  <span>Neutral</span>
                </div>
                <span className="font-medium">{auditData.neutralSentiment}%</span>
              </div>
              <Progress value={auditData.neutralSentiment} className="h-2 bg-warning/20 [&>div]:bg-warning" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Frown className="w-4 h-4 text-destructive" />
                  <span>Negative</span>
                </div>
                <span className="font-medium">{auditData.negativeSentiment}%</span>
              </div>
              <Progress value={auditData.negativeSentiment} className="h-2 bg-destructive/20 [&>div]:bg-destructive" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const isPositiveTrend = platform.trend > 0;
          return (
            <Card key={platform.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    {isPositiveTrend ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${isPositiveTrend ? 'text-success' : 'text-destructive'}`}>
                      {Math.abs(platform.trend)}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Mentions</div>
                      <div className="font-bold text-lg">{platform.mentions}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Engagement</div>
                      <div className="font-bold text-lg">{platform.engagement.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Sentiment Score</span>
                      <span className="font-medium">{platform.sentiment}%</span>
                    </div>
                    <Progress value={platform.sentiment} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Mentions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Mentions</CardTitle>
          <CardDescription>Latest brand mentions across all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMentions.map((mention) => (
              <div key={mention.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span className="font-medium">{mention.platform}</span>
                    <Badge className={getSentimentBadge(mention.sentiment)}>
                      {getSentimentIcon(mention.sentiment)}
                      <span className="ml-1 capitalize">{mention.sentiment}</span>
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{mention.timestamp}</span>
                </div>
                
                <p className="text-sm">{mention.text}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Reach: {mention.reach.toLocaleString()}</span>
                  <span>Engagement: {mention.engagement}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};