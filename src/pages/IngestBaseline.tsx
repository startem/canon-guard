import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Scan, FileText, Image, Globe, CheckCircle, AlertCircle } from "lucide-react";

interface ScanStats {
  pages: { scanned: number; total: number };
  pdfs: { scanned: number; total: number };
  images: { scanned: number; total: number };
  socialPosts: { scanned: number; total: number };
}

interface BaselineResults {
  compliantAssets: number;
  totalAssets: number;
  brandHealthScore: number;
  complianceByCategory: {
    logo: number;
    colors: number;
    typography: number;
    messaging: number;
  };
}

const IngestBaseline = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanStats, setScanStats] = useState<ScanStats>({
    pages: { scanned: 0, total: 500 },
    pdfs: { scanned: 0, total: 20 },
    images: { scanned: 0, total: 200 },
    socialPosts: { scanned: 0, total: 150 }
  });
  
  const [baselineResults, setBaselineResults] = useState<BaselineResults>({
    compliantAssets: 0,
    totalAssets: 0,
    brandHealthScore: 0,
    complianceByCategory: {
      logo: 0,
      colors: 0,
      typography: 0,
      messaging: 0
    }
  });

  const { toast } = useToast();

  const startScan = async () => {
    setIsScanning(true);
    setScanComplete(false);
    
    // Simulate scanning process
    const scanDuration = 5000; // 5 seconds
    const intervals = 50;
    const stepTime = scanDuration / intervals;
    
    for (let i = 0; i <= intervals; i++) {
      await new Promise(resolve => setTimeout(resolve, stepTime));
      
      const progress = i / intervals;
      
      setScanStats({
        pages: { scanned: Math.floor(500 * progress), total: 500 },
        pdfs: { scanned: Math.floor(20 * progress), total: 20 },
        images: { scanned: Math.floor(200 * progress), total: 200 },
        socialPosts: { scanned: Math.floor(150 * progress), total: 150 }
      });
    }
    
    // Generate baseline results
    setBaselineResults({
      compliantAssets: 652,
      totalAssets: 870,
      brandHealthScore: 78,
      complianceByCategory: {
        logo: 85,
        colors: 72,
        typography: 68,
        messaging: 82
      }
    });
    
    setIsScanning(false);
    setScanComplete(true);
    
    toast({
      title: "Baseline Scan Complete",
      description: "Your brand assets have been analyzed and baseline metrics calculated.",
    });
  };

  const getTotalProgress = () => {
    const totalAssets = scanStats.pages.total + scanStats.pdfs.total + scanStats.images.total + scanStats.socialPosts.total;
    const scannedAssets = scanStats.pages.scanned + scanStats.pdfs.scanned + scanStats.images.scanned + scanStats.socialPosts.scanned;
    return (scannedAssets / totalAssets) * 100;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 80) return "bg-success";
    if (rate >= 60) return "bg-warning"; 
    return "bg-destructive";
  };

  return (
    <PageShell className="space-y-8">
      <PageHeader
        icon={Scan}
        eyebrow="Setup"
        title="Ingest & Baseline"
        description="Scan your existing brand assets and run a baseline audit to establish your current brand health metrics."
      />

      {/* Primary Scan Card */}
      <Card className="shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Scan className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Brand Asset Scanner</CardTitle>
          <CardDescription>
            Discover and analyze all your brand touchpoints across digital and traditional channels
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isScanning && !scanComplete && (
            <div className="text-center">
              <Button
                onClick={startScan}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow hover:scale-105 transition-glow font-semibold px-12 py-6 text-lg"
              >
                <Scan className="mr-2 h-5 w-5" />
                Start Comprehensive Scan
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Scanning Assets...</h3>
                <Progress value={getTotalProgress()} className="w-full h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  {Math.round(getTotalProgress())}% Complete
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Web Pages</p>
                  <p className="text-2xl font-bold text-primary">
                    {scanStats.pages.scanned}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    / {scanStats.pages.total}
                  </p>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-secondary" />
                  <p className="text-sm font-medium">PDFs</p>
                  <p className="text-2xl font-bold text-secondary">
                    {scanStats.pdfs.scanned}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    / {scanStats.pdfs.total}
                  </p>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Image className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <p className="text-sm font-medium">Images</p>
                  <p className="text-2xl font-bold text-accent">
                    {scanStats.images.scanned}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    / {scanStats.images.total}
                  </p>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p className="text-sm font-medium">Social Posts</p>
                  <p className="text-2xl font-bold text-success">
                    {scanStats.socialPosts.scanned}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    / {scanStats.socialPosts.total}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Baseline Results Summary */}
      {scanComplete && (
        <Card className="shadow-card border-success/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-xl">Baseline Analysis Complete</CardTitle>
                <CardDescription>
                  Your brand health baseline has been established
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Overall Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-card rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Asset Compliance
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-success">
                    {baselineResults.compliantAssets}
                  </span>
                  <span className="text-lg text-muted-foreground">
                    / {baselineResults.totalAssets}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {Math.round((baselineResults.compliantAssets / baselineResults.totalAssets) * 100)}% Compliant
                </p>
              </div>

              <div className="text-center p-6 bg-gradient-card rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Brand Health Score
                </h3>
                <div className={`text-4xl font-bold ${getHealthScoreColor(baselineResults.brandHealthScore)} mb-2`}>
                  {baselineResults.brandHealthScore}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getComplianceColor(baselineResults.brandHealthScore)}`}
                    style={{ width: `${baselineResults.brandHealthScore}%` }}
                  />
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-card rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Critical Issues
                </h3>
                <div className="text-3xl font-bold text-destructive mb-2">
                  23
                </div>
                <Badge variant="destructive" className="text-xs">
                  High Priority
                </Badge>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Compliance by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(baselineResults.complianceByCategory).map(([category, score]) => (
                  <div key={category} className="text-center p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground capitalize mb-2">
                      {category}
                    </h4>
                    <div className={`text-2xl font-bold ${getHealthScoreColor(score)} mb-2`}>
                      {score}%
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${getComplianceColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/baseline-report" className="flex-1">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow hover:scale-105 transition-glow font-semibold w-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Baseline Report
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={startScan}
              >
                <Scan className="mr-2 h-4 w-4" />
                Re-scan Assets
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {scanComplete && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Recommended Next Steps
            </CardTitle>
            <CardDescription>
              Based on your baseline audit, here's what we recommend focusing on first
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Badge variant="destructive">High Priority</Badge>
                <div className="flex-1">
                  <h4 className="font-medium">Typography Consistency</h4>
                  <p className="text-sm text-muted-foreground">
                    32% of assets use non-standard fonts. Update brand guidelines.
                  </p>
                </div>
                <Button variant="outline" size="sm">Fix Issues</Button>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Badge className="bg-warning text-warning-foreground">Medium Priority</Badge>
                <div className="flex-1">
                  <h4 className="font-medium">Color Usage</h4>
                  <p className="text-sm text-muted-foreground">
                    28% of assets don't follow color palette guidelines.
                  </p>
                </div>
                <Button variant="outline" size="sm">Review Colors</Button>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Badge className="bg-success text-success-foreground">Low Priority</Badge>
                <div className="flex-1">
                  <h4 className="font-medium">Logo Placement</h4>
                  <p className="text-sm text-muted-foreground">
                    Good compliance rate. Minor adjustments needed.
                  </p>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IngestBaseline;