import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/layout/SectionCard";
import { StatCard } from "@/components/layout/StatCard";
import { EmptyState } from "@/components/layout/EmptyState";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  CalendarIcon, Heart, ShieldCheck, AlertOctagon, LineChart as LineChartIcon,
  AlertTriangle, ClipboardCheck, BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { CrossFlowLinks } from "@/components/CrossFlowLinks";

const chartConfig = {
  health: { label: "Brand Health", color: "hsl(var(--primary))" },
  compliance: { label: "Compliance", color: "hsl(var(--primary))" },
};

const scoreTone = (score: number) =>
  score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-destructive";

export default function AnalyticsDashboard() {
  const { currentClient } = useWorkspace();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    to: new Date(),
  });

  const {
    healthTrend, complianceByType, issueDistribution, categoryRows, metrics, hasData, loading,
  } = useAnalytics(dateRange);

  const fmtDelta = (d: number | null) =>
    d == null ? undefined : { value: `${d >= 0 ? "+" : ""}${d}%`, direction: d >= 0 ? ("up" as const) : ("down" as const) };

  return (
    <PageShell>
      <PageHeader
        icon={LineChartIcon}
        eyebrow="Analytics"
        title="Analytics Dashboard"
        description={
          currentClient
            ? `Live brand-health metrics for ${currentClient.name}, aggregated from real audits and issues.`
            : "Select a client to see live brand-health metrics."
        }
        actions={
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {`${format(dateRange.from, "MMM d, yyyy")} – ${format(dateRange.to, "MMM d, yyyy")}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => range?.from && range?.to && setDateRange({ from: range.from, to: range.to })}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        }
      />

      {!currentClient ? (
        <EmptyState
          icon={BarChart3}
          title="No client selected"
          description="Choose a client from the workspace switcher to view its analytics."
        />
      ) : loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : !hasData ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No analytics yet"
          description="Run audits for this client to start building live brand-health trends and issue analytics."
          action={
            <Button asChild>
              <Link to="/audit-details/brand-consistency">Go to audits</Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Key metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Brand Health Score"
              value={metrics.overallHealth != null ? `${metrics.overallHealth}%` : "—"}
              icon={Heart}
              tone="primary"
              trend={fmtDelta(metrics.healthDelta)}
              hint="avg across audit types"
            />
            <StatCard
              label="Audits Completed"
              value={String(metrics.totalAudits)}
              icon={ShieldCheck}
              hint="in selected range"
            />
            <StatCard
              label="Resolution Rate"
              value={metrics.resolutionRate != null ? `${metrics.resolutionRate}%` : "—"}
              icon={ClipboardCheck}
              hint="issues resolved or closed"
            />
            <StatCard
              label="Open Issues"
              value={String(metrics.openIssues)}
              icon={AlertOctagon}
              tone={metrics.highPriority > 0 ? "destructive" : "default"}
              trend={metrics.highPriority > 0 ? { value: `${metrics.highPriority} high priority`, direction: "down" } : undefined}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Brand health over time */}
            <SectionCard title="Brand Health Over Time" icon={LineChartIcon} description="Average audit score per month">
              {healthTrend.length >= 2 ? (
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={healthTrend} margin={{ left: -16, right: 8, top: 8 }}>
                      <defs>
                        <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="health" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#healthFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Need audits across at least two months to plot a trend.
                </p>
              )}
            </SectionCard>

            {/* Compliance by type */}
            <SectionCard title="Compliance by Audit Type" icon={ShieldCheck} description="Average score per audit category">
              {complianceByType.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complianceByType} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                      <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis type="category" dataKey="category" width={130} tickLine={false} axisLine={false} fontSize={11} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="compliance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">No scored audits in this range.</p>
              )}
            </SectionCard>

            {/* Issue distribution */}
            <SectionCard title="Open Issues by Severity" icon={AlertTriangle} description="Distribution of unresolved issues">
              {issueDistribution.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={issueDistribution}
                        cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                        paddingAngle={2} dataKey="count"
                        label={({ severity, count }) => `${severity}: ${count}`}
                      >
                        {issueDistribution.map((e) => <Cell key={e.severity} fill={e.color} />)}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">No open issues — everything is resolved.</p>
              )}
            </SectionCard>

            {/* Category breakdown table */}
            <SectionCard title="Category Breakdown" icon={BarChart3} flush contentClassName="px-2 pb-2">
              {categoryRows.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right">Issues</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryRows.map((row) => (
                      <TableRow key={row.category}>
                        <TableCell className="font-medium">{row.category}</TableCell>
                        <TableCell className={cn("text-right font-semibold", scoreTone(row.score))}>{row.score}%</TableCell>
                        <TableCell className="text-right">
                          {row.issues > 0 ? <Badge variant="secondary">{row.issues}</Badge> : <span className="text-muted-foreground">0</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-12 text-center text-sm text-muted-foreground">No category data yet.</p>
              )}
            </SectionCard>
          </div>

          <CrossFlowLinks
            context="analytics"
            relatedLinks={[
              {
                id: "baseline",
                title: "Baseline & Drift Report",
                description: "See how brand health has drifted against the captured baseline.",
                targetRoute: "/baseline-report",
                category: "audit",
                priority: "medium",
                actionType: "analyze",
              },
              {
                id: "issues",
                title: "Work Open Issues",
                description: `${metrics.openIssues} open issue${metrics.openIssues === 1 ? "" : "s"} awaiting resolution.`,
                targetRoute: "/audit-details/brand-consistency",
                category: "issue",
                priority: metrics.highPriority > 0 ? "high" : "low",
                actionType: "resolve",
              },
              {
                id: "governance",
                title: "Governance Rules",
                description: "Tune automated monitoring and approval rules.",
                targetRoute: "/governance-alerts",
                category: "governance",
                priority: "low",
                actionType: "edit",
              },
            ]}
          />
        </>
      )}
    </PageShell>
  );
}
