import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Image, FileText, Globe, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuditIssue {
  id: string;
  assetName: string;
  assetType: "Logo" | "Image" | "Document" | "Webpage";
  detectedDate: string;
  issueDescription: string;
  severity: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved";
  assignee?: string;
}

const mockIssues: AuditIssue[] = [
  {
    id: "1",
    assetName: "homepage-hero.jpg",
    assetType: "Image",
    detectedDate: "2024-01-15",
    issueDescription: "Logo placement violates 20px margin guideline",
    severity: "medium",
    status: "open"
  },
  {
    id: "2", 
    assetName: "product-brochure.pdf",
    assetType: "Document",
    detectedDate: "2024-01-14",
    issueDescription: "Secondary brand colors used incorrectly",
    severity: "high",
    status: "in_progress",
    assignee: "Sarah Wilson"
  },
  {
    id: "3",
    assetName: "about-us.html",
    assetType: "Webpage",
    detectedDate: "2024-01-13",
    issueDescription: "Typography hierarchy inconsistent with brand guidelines",
    severity: "low",
    status: "resolved"
  }
];

const auditCategories = {
  "logo-usage": "Logo Usage",
  "color-palette": "Color Palette", 
  "typography": "Typography",
  "digital-assets": "Digital Assets"
};

export default function AuditDetails() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<AuditIssue | null>(null);
  const [issues, setIssues] = useState(mockIssues);

  const categoryName = auditCategories[category as keyof typeof auditCategories] || "Unknown Category";
  const complianceRate = 73;
  const totalAssets = 156;
  const issuesFound = 12;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "default";
      case "in_progress": return "secondary";
      case "open": return "destructive";
      default: return "outline";
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "Image": return <Image className="h-4 w-4" />;
      case "Document": return <FileText className="h-4 w-4" />;
      case "Webpage": return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleAssignIssue = (issueId: string, assignee: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, assignee, status: "in_progress" as const } : issue
    ));
    toast({
      title: "Issue Assigned",
      description: `Issue assigned to ${assignee}`
    });
  };

  const handleStatusChange = (issueId: string, status: "open" | "in_progress" | "resolved") => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, status } : issue
    ));
    toast({
      title: "Status Updated",
      description: `Issue status changed to ${status.replace('_', ' ')}`
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Audits
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{categoryName} Audit Details</h1>
            <p className="text-muted-foreground">Detailed compliance analysis and issue management</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{complianceRate}%</div>
              <p className="text-sm text-muted-foreground">
                {Math.round(totalAssets * complianceRate / 100)} of {totalAssets} assets compliant
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssets}</div>
              <p className="text-sm text-muted-foreground">Assets analyzed in this category</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{issuesFound}</div>
              <p className="text-sm text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Issues Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Detected Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow 
                      key={issue.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getAssetIcon(issue.assetType)}
                          <div>
                            <div className="font-medium">{issue.assetName}</div>
                            <div className="text-sm text-muted-foreground">{issue.assetType}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={issue.issueDescription}>
                          {issue.issueDescription}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(issue.status)}>
                          {issue.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{issue.detectedDate}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Issue Detail Panel */}
          {selectedIssue && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getAssetIcon(selectedIssue.assetType)}
                  Issue Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Asset</h4>
                  <p className="text-sm">{selectedIssue.assetName}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Issue Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedIssue.issueDescription}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Remediation Steps</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Adjust logo positioning to maintain 20px margin</li>
                    <li>• Ensure proper contrast ratios are maintained</li>
                    <li>• Update asset metadata for tracking</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Assign to</label>
                    <Select onValueChange={(value) => handleAssignIssue(selectedIssue.id, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedIssue.assignee || "Select assignee"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                        <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                        <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select 
                      value={selectedIssue.status} 
                      onValueChange={(value: "open" | "in_progress" | "resolved") => 
                        handleStatusChange(selectedIssue.id, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Comments</label>
                    <Textarea placeholder="Add a comment..." className="mt-1" />
                  </div>

                  <Button className="w-full">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}