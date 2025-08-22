import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Mail
} from "lucide-react";

export const BrandReporting = () => {
  const reports = [
    {
      id: "RPT-001",
      name: "Weekly Brand Health Report",
      description: "Comprehensive weekly analysis of all brand metrics",
      schedule: "Every Monday",
      lastGenerated: "2 days ago",
      status: "active"
    },
    {
      id: "RPT-002", 
      name: "Monthly Competitor Analysis",
      description: "In-depth competitor tracking and market positioning",
      schedule: "1st of each month",
      lastGenerated: "1 week ago", 
      status: "active"
    },
    {
      id: "RPT-003",
      name: "Quarterly Brand Audit Summary",
      description: "Executive summary of all brand audit results",
      schedule: "Quarterly",
      lastGenerated: "2 months ago",
      status: "pending"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Brand Reporting Dashboard</CardTitle>
          <CardDescription>
            Generate and schedule comprehensive brand reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{report.name}</CardTitle>
                <Badge variant={report.status === "active" ? "default" : "secondary"}>
                  {report.status}
                </Badge>
              </div>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm">
                  <div className="text-muted-foreground mb-1">Schedule:</div>
                  <div className="font-medium">{report.schedule}</div>
                </div>
                
                <div className="text-sm">
                  <div className="text-muted-foreground mb-1">Last Generated:</div>
                  <div className="font-medium">{report.lastGenerated}</div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-3 h-3 mr-2" />
                    Download
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    <Mail className="w-3 h-3 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};