import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  XCircle, 
  AlertCircle,
  Info,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle2,
  Eye,
  MessageSquare,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  auditType: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  mentions: number;
  sentimentImpact: number;
}

export const IssueManagement = () => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("severity");
  const [searchQuery, setSearchQuery] = useState("");

  const issues: Issue[] = [
    {
      id: "ISS-001",
      title: "Inconsistent logo usage on social media",
      description: "Old logo version detected in 15+ recent social media posts",
      severity: "critical",
      status: "open",
      auditType: "Visual Identity",
      assignee: "Sarah Chen",
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T10:00:00Z",
      mentions: 47,
      sentimentImpact: -12
    },
    {
      id: "ISS-002", 
      title: "Brand voice inconsistency in email campaigns",
      description: "Formal tone used instead of conversational brand voice",
      severity: "high",
      status: "in-progress",
      auditType: "Content Audit",
      assignee: "Mike Johnson",
      createdAt: "2024-01-19T14:30:00Z",
      updatedAt: "2024-01-20T09:15:00Z",
      mentions: 23,
      sentimentImpact: -8
    },
    {
      id: "ISS-003",
      title: "Competitor using similar messaging",
      description: "XYZ Corp adopted messaging similar to our core positioning",
      severity: "medium",
      status: "open",
      auditType: "Competitor Analysis",
      assignee: "Lisa Wong",
      createdAt: "2024-01-19T11:00:00Z",
      updatedAt: "2024-01-19T11:00:00Z",
      mentions: 89,
      sentimentImpact: -5
    },
    {
      id: "ISS-004",
      title: "Negative sentiment spike on Twitter",
      description: "15% increase in negative mentions following product launch",
      severity: "high",
      status: "open",
      auditType: "Brand Perception",
      createdAt: "2024-01-18T16:45:00Z",
      updatedAt: "2024-01-20T08:30:00Z",
      mentions: 156,
      sentimentImpact: -18
    },
    {
      id: "ISS-005",
      title: "Outdated brand guidelines in employee handbook",
      description: "Internal documentation contains deprecated brand elements",
      severity: "medium",
      status: "resolved",
      auditType: "Employee Alignment",
      assignee: "Tom Davis",
      createdAt: "2024-01-17T09:00:00Z",
      updatedAt: "2024-01-19T17:00:00Z",
      mentions: 0,
      sentimentImpact: 0
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <XCircle className="w-4 h-4 text-destructive" />;
      case "high": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "medium": return <AlertCircle className="w-4 h-4 text-warning" />;
      case "low": return <Info className="w-4 h-4 text-primary" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive/10 text-destructive border-destructive/20";
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return "bg-destructive/10 text-destructive border-destructive/20";
      case "in-progress": return "bg-warning/10 text-warning border-warning/20";
      case "resolved": return "bg-success/10 text-success border-success/20";
      case "closed": return "bg-muted/10 text-muted-foreground border-muted/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesFilter = filter === "all" || issue.status === filter;
    const matchesSearch = searchQuery === "" || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.auditType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case "severity":
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "mentions":
        return b.mentions - a.mentions;
      default:
        return 0;
    }
  });

  const issueStats = {
    total: issues.length,
    critical: issues.filter(i => i.severity === "critical").length,
    high: issues.filter(i => i.severity === "high").length,
    open: issues.filter(i => i.status === "open").length,
    inProgress: issues.filter(i => i.status === "in-progress").length
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
                <SelectItem value="mentions">Mentions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Issues List */}
          <div className="space-y-4">
            {sortedIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-brand transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getSeverityIcon(issue.severity)}
                        <h3 className="font-semibold text-lg">{issue.title}</h3>
                        <Badge className={getSeverityBadge(issue.severity)}>
                          {issue.severity}
                        </Badge>
                        <Badge className={getStatusBadge(issue.status)}>
                          {issue.status.replace("-", " ")}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{issue.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Audit:</span>
                          <span>{issue.auditType}</span>
                        </div>
                        {issue.assignee && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{issue.assignee}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                        {issue.mentions > 0 && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{issue.mentions} mentions</span>
                          </div>
                        )}
                        {issue.sentimentImpact !== 0 && (
                          <div className="flex items-center gap-1">
                            {issue.sentimentImpact < 0 ? (
                              <ArrowDown className="w-4 h-4 text-destructive" />
                            ) : (
                              <ArrowUp className="w-4 h-4 text-success" />
                            )}
                            <span className={issue.sentimentImpact < 0 ? "text-destructive" : "text-success"}>
                              {Math.abs(issue.sentimentImpact)}% sentiment
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {issue.status === "open" && (
                        <Button variant="default" size="sm">
                          Assign
                        </Button>
                      )}
                      {issue.status === "in-progress" && (
                        <Button variant="default" size="sm">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedIssues.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No issues found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};