import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { CalendarIcon, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { InteractiveChart } from "@/components/InteractiveChart";
import { CrossFlowLinks } from "@/components/CrossFlowLinks";

const brandHealthData = [
  { month: "Jan", health: 78 },
  { month: "Feb", health: 82 },
  { month: "Mar", health: 79 },
  { month: "Apr", health: 85 },
  { month: "May", health: 88 },
  { month: "Jun", health: 91 }
];

const sentimentData = [
  { week: "Week 1", positive: 65, neutral: 25, negative: 10 },
  { week: "Week 2", positive: 70, neutral: 20, negative: 10 },
  { week: "Week 3", positive: 68, neutral: 22, negative: 10 },
  { week: "Week 4", positive: 75, neutral: 18, negative: 7 }
];

const complianceData = [
  { category: "Logo Usage", compliance: 89 },
  { category: "Color Palette", compliance: 76 },
  { category: "Typography", compliance: 83 },
  { category: "Digital Assets", compliance: 71 },
  { category: "Messaging", compliance: 92 }
];

const issueDistribution = [
  { severity: "High", count: 12, color: "#ef4444" },
  { severity: "Medium", count: 28, color: "#f59e0b" },
  { severity: "Low", count: 45, color: "#10b981" }
];

const topMentions = [
  { url: "example.com/homepage", mentions: 145, sentiment: "positive" },
  { url: "example.com/products", mentions: 89, sentiment: "positive" },
  { url: "example.com/about", mentions: 67, sentiment: "neutral" },
  { url: "example.com/contact", mentions: 34, sentiment: "positive" },
  { url: "example.com/blog", mentions: 28, sentiment: "neutral" }
];

const chartConfig = {
  health: { color: "hsl(var(--primary))" },
  positive: { color: "hsl(142, 76%, 36%)" },
  neutral: { color: "hsl(47, 96%, 53%)" },
  negative: { color: "hsl(0, 84%, 60%)" },
  compliance: { color: "hsl(var(--primary))" }
};

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date()
  });
  const [region, setRegion] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("main");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Brand performance metrics and insights</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to 
                    ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                    : "Select date range"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => range?.from && range?.to && setDateRange({from: range.from, to: range.to})}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="na">North America</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
                <SelectItem value="apac">APAC</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Brand</SelectItem>
                <SelectItem value="sub1">Sub-brand A</SelectItem>
                <SelectItem value="sub2">Sub-brand B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Brand Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">91%</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">+3% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sentiment Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Positive sentiment</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span className="text-orange-600">-2% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">85</div>
              <div className="flex items-center gap-1 text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-orange-600">12 high priority</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Brand Health Over Time - Interactive */}
          <InteractiveChart
            title="Brand Health Over Time"
            description="Interactive brand health score tracking with contextual details"
            data={brandHealthData.map(item => ({
              timestamp: `2024-${item.month}-01`,
              value: item.health,
              metadata: {
                category: "analytics",
                source: "brand-health",
                details: `Brand health score for ${item.month}`
              }
            }))}
            type="line"
            metric="Brand Health Score"
            showTrend={true}
            interactive={true}
            crossFlowEnabled={true}
          />

          {/* Sentiment Analysis - Interactive */}
          <InteractiveChart
            title="Sentiment Analysis"
            description="Weekly sentiment tracking with detailed breakdown"
            data={sentimentData.map(item => ({
              timestamp: `2024-01-${item.week.replace('Week ', '')}`,
              value: item.positive,
              metadata: {
                category: "analytics", 
                source: "sentiment",
                details: `${item.positive}% positive, ${item.neutral}% neutral, ${item.negative}% negative`
              }
            }))}
            type="bar"
            metric="Positive Sentiment %"
            showTrend={true}
            interactive={true}
            crossFlowEnabled={true}
          />

          {/* Compliance Rates - Interactive */}
          <InteractiveChart
            title="Audit Compliance Rates"
            description="Compliance tracking across different audit categories"
            data={complianceData.map(item => ({
              timestamp: "2024-01-15",
              value: item.compliance,
              metadata: {
                category: "audit",
                source: item.category.toLowerCase().replace(' ', '-'),
                details: `${item.category} compliance rate`
              }
            }))}
            type="bar"
            metric="Compliance Rate %"
            showTrend={false}
            interactive={true}
            crossFlowEnabled={true}
          />

          {/* Issue Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Issue Distribution by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ severity, count }) => `${severity}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {issueDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Cross-Flow Links */}
        <CrossFlowLinks
          context="analytics"
          relatedLinks={[
            {
              id: "audit-1",
              title: "Brand Consistency Audit", 
              description: "Recent compliance issues detected in digital assets",
              targetRoute: "/audit-details/brand-consistency",
              category: "audit",
              priority: "high",
              actionType: "analyze",
              metadata: { count: 12, status: "active", lastUpdated: "2 hours ago" }
            },
            {
              id: "issue-1",
              title: "Logo Usage Violations",
              description: "Multiple instances of incorrect logo usage found",
              targetRoute: "/issue-detail/logo-violations", 
              category: "issue",
              priority: "medium",
              actionType: "resolve",
              metadata: { count: 8, status: "open", lastUpdated: "4 hours ago" }
            },
            {
              id: "governance-1",
              title: "Update Governance Rules",
              description: "Configure automated monitoring for new compliance metrics",
              targetRoute: "/governance-alerts",
              category: "governance",
              priority: "low",
              actionType: "edit",
              metadata: { lastUpdated: "1 day ago" }
            }
          ]}
        />

        {/* Top Brand Mentions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 URLs with Brand Mentions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Mentions</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topMentions.map((mention, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{mention.url}</TableCell>
                    <TableCell>{mention.mentions}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {mention.sentiment === "positive" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        )}
                        <span className="capitalize">{mention.sentiment}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}