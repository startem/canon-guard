import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Eye, 
  Trash2, 
  Clock, 
  Filter,
  Check,
  Settings,
  X
} from "lucide-react";

interface Alert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  category: "audit" | "issue" | "governance" | "seo" | "campaign" | "system";
  headline: string;
  description: string;
  source: string;
  timestamp: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  metadata?: {
    issueId?: string;
    auditId?: string;
    campaignId?: string;
    url?: string;
  };
}

interface NotificationFeedProps {
  alerts: Alert[];
  onUpdateAlerts: (alerts: Alert[]) => void;
}

export const NotificationsFeed = ({ alerts, onUpdateAlerts }: NotificationFeedProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const { toast } = useToast();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "error": return <X className="h-5 w-5 text-red-600" />;
      case "info": return <Info className="h-5 w-5 text-blue-600" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning": return "border-orange-200 bg-orange-50";
      case "error": return "border-red-200 bg-red-50";
      case "info": return "border-blue-200 bg-blue-50";
      case "success": return "border-green-200 bg-green-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "audit": return "🔍";
      case "issue": return "⚠️";
      case "governance": return "🛡️";
      case "seo": return "📈";
      case "campaign": return "📢";
      case "system": return "⚙️";
      default: return "📋";
    }
  };

  const handleMarkAsRead = (id: string) => {
    onUpdateAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
    toast({
      title: "Marked as Read",
      description: "Alert has been marked as read",
    });
  };

  const handleMarkAllAsRead = () => {
    onUpdateAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
    toast({
      title: "All Alerts Read",
      description: "All alerts have been marked as read",
    });
  };

  const handleResolve = (id: string) => {
    onUpdateAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Resolved",
      description: "Alert has been resolved and removed",
    });
  };

  const handleIgnore = (id: string) => {
    onUpdateAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: "Alert Ignored",
      description: "Alert has been ignored and removed",
    });
  };

  const handleViewDetails = (alert: Alert) => {
    if (alert.metadata?.issueId) {
      // Navigate to issue detail page
      window.location.href = `/issue-detail/${alert.metadata.issueId}`;
    } else if (alert.metadata?.auditId) {
      // Navigate to audit detail page
      window.location.href = `/audit-details/${alert.metadata.auditId}`;
    } else if (alert.metadata?.url) {
      // Open external URL
      window.open(alert.metadata.url, '_blank');
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (showOnlyUnread && alert.isRead) return false;
    if (categoryFilter !== "all" && alert.category !== categoryFilter) return false;
    if (typeFilter !== "all" && alert.type !== typeFilter) return false;
    if (searchQuery && !alert.headline.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !alert.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const highPriorityCount = alerts.filter(alert => alert.priority === "high" && !alert.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications & Alerts
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} unread
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Stay updated with real-time alerts and notifications across your brand management activities
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{alerts.length}</div>
              <div className="text-sm text-muted-foreground">Total Alerts</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <div className="text-sm text-muted-foreground">Unread</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{highPriorityCount}</div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {alerts.filter(a => a.actionable).length}
              </div>
              <div className="text-sm text-muted-foreground">Actionable</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
                <SelectItem value="issue">Issues</SelectItem>
                <SelectItem value="governance">Governance</SelectItem>
                <SelectItem value="seo">SEO</SelectItem>
                <SelectItem value="campaign">Campaigns</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>

            <button
              onClick={() => setShowOnlyUnread(!showOnlyUnread)}
              className={`px-3 py-1 text-sm border rounded transition-colors ${
                showOnlyUnread 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              Unread Only
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={`transition-all ${!alert.isRead ? "ring-2 ring-primary/20" : "opacity-75"} ${getTypeColor(alert.type)}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-medium truncate ${!alert.isRead ? "font-semibold" : ""}`}>
                      {alert.headline}
                    </h3>
                    <span className="text-lg">{getCategoryIcon(alert.category)}</span>
                    <Badge variant={getPriorityColor(alert.priority)} className="text-xs">
                      {alert.priority.toUpperCase()}
                    </Badge>
                    {alert.actionable && (
                      <Badge variant="outline" className="text-xs">
                        Actionable
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {alert.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{alert.source}</span>
                    <span>•</span>
                    <span>{format(new Date(alert.timestamp), "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {alert.actionable && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetails(alert)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {!alert.isRead && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleResolve(alert.id)}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleIgnore(alert.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAlerts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No alerts found</h3>
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter !== "all" || typeFilter !== "all" || showOnlyUnread
                  ? "Try adjusting your filters or search query."
                  : "You're all caught up! New alerts will appear here."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};