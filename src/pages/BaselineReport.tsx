import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { FileText, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBaselines, type DriftPoint } from "@/hooks/useBaselines";
import { useWorkspace } from "@/contexts/WorkspaceContext";

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

export const BaselineReport = () => {
  const { currentClient } = useWorkspace();
  const { currentBaseline, referenceBaseline, drift, getDriftTrend, loading } = useBaselines();
  const [trend, setTrend] = useState<DriftPoint[]>([]);

  useEffect(() => {
    getDriftTrend().then(setTrend);
  }, [getDriftTrend]);

  // Average score per capture day for the drift line
  const trendData = useMemo(() => {
    const byDay: Record<string, { total: number; n: number }> = {};
    trend.forEach((p) => {
      const day = new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      byDay[day] = byDay[day] || { total: 0, n: 0 };
      byDay[day].total += p.score;
      byDay[day].n += 1;
    });
    return Object.entries(byDay).map(([day, v]) => ({ day, score: Math.round(v.total / v.n) }));
  }, [trend]);

  const categoryEntries = currentBaseline ? Object.entries(currentBaseline.category_scores ?? {}) : [];

  const complianceColor = (score: number) =>
    score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";

  if (!currentClient) {
    return (
      <PageShell>
        <PageHeader icon={FileText} eyebrow="Setup" title="Baseline & Drift Report"
          description="Track how your brand health changes against your captured baseline." />
        <Card><CardContent className="py-10 text-center text-muted-foreground">Select a client to view its baseline report.</CardContent></Card>
      </PageShell>
    );
  }

  if (!loading && !currentBaseline) {
    return (
      <PageShell>
        <PageHeader icon={FileText} eyebrow="Setup" title="Baseline & Drift Report"
          description="Track how your brand health changes against your captured baseline." />
        <Card>
          <CardContent className="py-10 text-center space-y-4">
            <p className="text-muted-foreground">No baseline captured yet for this client.</p>
            <Link to="/ingest-baseline"><Button>Capture a Baseline <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  const DriftIcon = drift == null || drift === 0 ? Minus : drift > 0 ? TrendingUp : TrendingDown;
  const driftColor = drift == null || drift === 0 ? "text-muted-foreground" : drift > 0 ? "text-success" : "text-destructive";

  return (
    <PageShell>
      <PageHeader
        icon={FileText}
        eyebrow="Setup"
        title="Baseline & Drift Report"
        description="How your brand health has moved since your reference baseline."
        actions={
          <Link to="/ingest-baseline">
            <Button variant="outline"><TrendingUp className="w-4 h-4 mr-2" />Re-capture Baseline</Button>
          </Link>
        }
      />

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>
            Reference baseline captured {referenceBaseline ? new Date(referenceBaseline.created_at).toLocaleDateString() : "—"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{currentBaseline?.overall_score ?? 0}</div>
              <div className="text-sm text-muted-foreground">Current Health Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-muted-foreground">{referenceBaseline?.overall_score ?? 0}</div>
              <div className="text-sm text-muted-foreground">Baseline Score</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold flex items-center justify-center gap-1 ${driftColor}`}>
                <DriftIcon className="w-6 h-6" />
                {drift == null ? "—" : `${drift > 0 ? "+" : ""}${drift}`}
              </div>
              <div className="text-sm text-muted-foreground">Drift</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-destructive">{currentBaseline?.issues_count ?? 0}</div>
              <div className="text-sm text-muted-foreground">Open Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drift Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" />Drift Trend</CardTitle>
          <CardDescription>Average audit score over time</CardDescription>
        </CardHeader>
        <CardContent>
          {trendData.length > 1 ? (
            <ChartContainer config={{ score: { color: "hsl(var(--primary))" } }} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="driftFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs" width={32} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#driftFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Run audits across multiple dates to see a drift trend line.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score by Audit Category</CardTitle>
          <CardDescription>Latest score per category at baseline capture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryEntries.length === 0 && (
              <p className="text-sm text-muted-foreground">No category scores recorded.</p>
            )}
            {categoryEntries.map(([category, score]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{AUDIT_LABELS[category] ?? category}</div>
                  <div className={`text-sm font-medium ${complianceColor(score)}`}>{score}%</div>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ArrowRight className="w-5 h-5 text-primary" />Recommended Next Steps</CardTitle>
          <CardDescription>Prioritise the lowest-scoring categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryEntries
              .slice()
              .sort((a, b) => a[1] - b[1])
              .slice(0, 4)
              .map(([category, score]) => (
                <div key={category} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{AUDIT_LABELS[category] ?? category}</h4>
                    <Badge variant={score < 60 ? "destructive" : "secondary"} className="text-xs">
                      {score < 60 ? "HIGH" : "MEDIUM"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Currently at {score}%. Review findings and open issues to lift this score.</p>
                  <Link to="/brand-management">
                    <Button variant="outline" size="sm" className="w-full">
                      Review Category <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
};

export default BaselineReport;
