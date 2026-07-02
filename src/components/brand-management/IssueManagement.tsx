import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  XCircle,
  AlertCircle,
  Info,
  Search,
  Clock,
  User,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { useIssues, IssueSeverity } from "@/hooks/useIssues";

export const IssueManagement = () => {
  const navigate = useNavigate();
  const { issues, loading, clientId, updateStatus } = useIssues();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("severity");
  const [searchQuery, setSearchQuery] = useState("");

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "medium":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "low":
        return <Info className="w-4 h-4 text-primary" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "in-progress":
        return "bg-warning/10 text-warning border-warning/20";
      case "resolved":
        return "bg-success/10 text-success border-success/20";
      case "closed":
        return "bg-muted/10 text-muted-foreground border-muted/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesFilter = filter === "all" || issue.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.category ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const severityOrder: Record<IssueSeverity, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case "severity":
        return severityOrder[b.severity] - severityOrder[a.severity];
      case "created":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  const issueStats = {
    total: issues.length,
    critical: issues.filter((i) => i.severity === "critical").length,
    high: issues.filter((i) => i.severity === "high").length,
    open: issues.filter((i) => i.status === "open").length,
    inProgress: issues.filter((i) => i.status === "in-progress").length,
  };

  const handleResolve = async (id: string) => {
    await updateStatus(id, "resolved");
    toast({ title: "Issue resolved" });
  };

  const handleStart = async (id: string) => {
    await updateStatus(id, "in-progress");
    toast({ title: "Issue moved to in progress" });
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">{issueStats.total}</div>
          <div className="text-sm text-muted-foreground">Total Issues</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-destructive">{issueStats.critical}</div>
          <div className="text-sm text-muted-foreground">Critical</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-destructive">{issueStats.high}</div>
          <div className="text-sm text-muted-foreground">High Priority</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-warning">{issueStats.open}</div>
          <div className="text-sm text-muted-foreground">Open</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-warning">{issueStats.inProgress}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Management</CardTitle>
          <CardDescription>Track and resolve brand compliance issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Issues</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="severity">Severity</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Issues List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedIssues.map((issue) => (
                <Card key={issue.id} className="hover:shadow-brand transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getSeverityIcon(issue.severity)}
                          <h3 className="font-semibold text-lg">{issue.title}</h3>
                          <Badge className={getSeverityBadge(issue.severity)}>{issue.severity}</Badge>
                          <Badge className={getStatusBadge(issue.status)}>
                            {issue.status.replace("-", " ")}
                          </Badge>
                        </div>

                        {issue.description && (
                          <p className="text-muted-foreground mb-4">{issue.description}</p>
                        )}

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          {issue.category && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Category:</span>
                              <span>{issue.category}</span>
                            </div>
                          )}
                          {issue.assignee && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>Assigned</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/issue-detail/${issue.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        {issue.status === "open" && (
                          <Button variant="default" size="sm" onClick={() => handleStart(issue.id)}>
                            Start
                          </Button>
                        )}
                        {issue.status === "in-progress" && (
                          <Button variant="default" size="sm" onClick={() => handleResolve(issue.id)}>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sortedIssues.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {!clientId
                      ? "Select a client to view its issues."
                      : issues.length === 0
                      ? "No issues yet. Issues are created automatically when audits detect problems."
                      : "No issues found matching your criteria."}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
