import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useBaselines } from "@/hooks/useBaselines";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Link } from "react-router-dom";
import { Scan, FileText, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

const AUDIT_LABELS: Record<string, string> = {
  "brand-consistency": "Brand Consistency",
  content: "Content",
  "visual-identity": "Visual Identity",
  "brand-perception": "Brand Perception",
  "social-media": "Social Media",
  "legal-compliance": "Legal Compliance",
  "competitor-analysis": "Competitor Analysis",
  "customer-experience": "Customer Experience",
  "digital-asset": "Digital Asset",
  "employee-brand": "Employee Brand",
};

const IngestBaseline = () => {
  const { currentClient } = useWorkspace();
  const { captureBaseline, capturing, currentBaseline } = useBaselines();
  const [snapshot, setSnapshot] = useState(currentBaseline);
  const { toast } = useToast();

  const startScan = async () => {
    const { error, data } = await captureBaseline("Baseline " + new Date().toLocaleDateString());
    if (error) {
      toast({ title: "Cannot capture baseline", description: error, variant: "destructive" });
      return;
    }
    setSnapshot(data);
    toast({
      title: "Baseline Captured",
      description: "A live snapshot of your brand health has been recorded.",
    });
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

  const active = snapshot ?? currentBaseline;
  const categoryEntries = active ? Object.entries(active.category_scores ?? {}) : [];

  return (
    <PageShell className="space-y-8">
      <PageHeader
        icon={Scan}
        eyebrow="Setup"
        title="Ingest & Baseline"
        description="Capture a point-in-time snapshot of your brand health from your latest audits. This baseline is what all future drift is measured against."
      />

      {!currentClient && (
        <Card className="shadow-card border-warning/30">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertCircle className="h-5 w-5 text-warning" />
            <p className="text-sm text-muted-foreground">
              Select or create a client first to capture a baseline.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Scan className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Brand Health Snapshot</CardTitle>
          <CardDescription>
            Aggregates the most recent audit per category into a single baseline score
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <Button
              onClick={startScan}
              disabled={capturing || !currentClient}
              size="lg"
              className="bg-gradient-primary hover:shadow-glow hover:scale-105 transition-glow font-semibold px-12 py-6 text-lg"
            >
              <Scan className="mr-2 h-5 w-5" />
              {capturing ? "Capturing…" : "Capture Baseline"}
            </Button>
            {capturing && <Progress value={66} className="w-full h-2 mt-6" />}
          </div>
        </CardContent>
      </Card>

      {active && (
        <Card className="shadow-card border-success/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-xl">{active.label}</CardTitle>
                <CardDescription>
                  Captured {new Date(active.created_at).toLocaleString()} · {active.audits_count} audit categories
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-card rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Brand Health Score</h3>
                <div className={`text-4xl font-bold ${getHealthScoreColor(active.overall_score)} mb-2`}>
                  {active.overall_score}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getComplianceColor(active.overall_score)}`}
                    style={{ width: `${active.overall_score}%` }}
                  />
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-card rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Findings Recorded</h3>
                <div className="text-3xl font-bold text-primary mb-2">{active.findings_count}</div>
                <p className="text-sm text-muted-foreground">across {active.audits_count} audits</p>
              </div>

              <div className="text-center p-6 bg-gradient-card rounded-lg border">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Open Issues</h3>
                <div className="text-3xl font-bold text-destructive mb-2">{active.issues_count}</div>
                <Badge variant="destructive" className="text-xs">
                  Needs attention
                </Badge>
              </div>
            </div>

            {categoryEntries.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Score by Audit Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categoryEntries.map(([category, score]) => (
                    <div key={category} className="text-center p-4 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        {AUDIT_LABELS[category] ?? category}
                      </h4>
                      <div className={`text-2xl font-bold ${getHealthScoreColor(score)} mb-2`}>{score}%</div>
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
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/baseline-report" className="flex-1">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow hover:scale-105 transition-glow font-semibold w-full"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Baseline & Drift Report
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="flex-1" onClick={startScan} disabled={capturing}>
                <Scan className="mr-2 h-4 w-4" />
                Re-capture
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!active && currentClient && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              No baseline yet
            </CardTitle>
            <CardDescription>
              Run at least one audit for this client, then capture a baseline to start tracking drift.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </PageShell>
  );
};

export default IngestBaseline;
