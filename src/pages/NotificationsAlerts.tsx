import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Info,
  CheckCircle,
  Bell,
  Eye,
  Trash2,
  Check,
  AlertOctagon,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useNotifications, NotificationSeverity } from "@/hooks/useNotifications";

const severityIcon = (severity: NotificationSeverity) => {
  switch (severity) {
    case "critical":
      return <AlertOctagon className="h-5 w-5 text-red-600" />;
    case "high":
      return <AlertTriangle className="h-5 w-5 text-orange-600" />;
    case "medium":
      return <Info className="h-5 w-5 text-blue-600" />;
    case "low":
    default:
      return <CheckCircle className="h-5 w-5 text-green-600" />;
  }
};

const severityBadge = (severity: NotificationSeverity): "destructive" | "secondary" | "outline" | "default" => {
  switch (severity) {
    case "critical":
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    default:
      return "outline";
  }
};

export default function NotificationsAlerts() {
  const { notifications, loading, markAsRead, markAllAsRead, remove } = useNotifications();
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    toast({ title: "Marked as read" });
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    toast({ title: "Notification deleted" });
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    toast({ title: "All notifications marked as read" });
  };

  const categories = Array.from(new Set(notifications.map((n) => n.category))).filter(Boolean);

  const filtered = notifications.filter((n) => {
    if (severityFilter !== "all" && n.severity !== severityFilter) return false;
    if (categoryFilter !== "all" && n.category !== categoryFilter) return false;
    if (timeFilter !== "all") {
      const diff = Date.now() - new Date(n.created_at).getTime();
      if (timeFilter === "24h" && diff > 24 * 60 * 60 * 1000) return false;
      if (timeFilter === "7d" && diff > 7 * 24 * 60 * 60 * 1000) return false;
      if (timeFilter === "30d" && diff > 30 * 24 * 60 * 60 * 1000) return false;
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Notifications &amp; Alerts</h1>
              <p className="text-muted-foreground">{unreadCount} unread notifications</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleMarkAll} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Severity:</span>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Category:</span>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Time:</span>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-2/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            filtered.map((n) => (
              <Card key={n.id} className={n.read ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{severityIcon(n.severity)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium truncate">{n.title}</h3>
                        <Badge variant={severityBadge(n.severity)} className="text-xs">
                          {n.severity}
                        </Badge>
                        {n.category && (
                          <Badge variant="outline" className="text-xs">
                            {n.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{n.message}</p>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(n.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(n.id)}
                        disabled={n.read}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(n.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {!loading && filtered.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {notifications.length === 0 ? "You're all caught up" : "No notifications match your filters"}
                </h3>
                <p className="text-muted-foreground">
                  {notifications.length === 0
                    ? "New alerts from audits, issues, and governance will appear here."
                    : "Try adjusting your filters above."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
