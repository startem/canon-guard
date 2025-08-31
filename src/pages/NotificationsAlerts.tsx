import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Bell, 
  Clock, 
  Settings, 
  Eye,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "warning" | "info" | "success";
  category: "audit" | "issue" | "governance";
  headline: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  isSnoozed: boolean;
  snoozeUntil?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    category: "audit",
    headline: "Brand Health Dropped Below Threshold",
    description: "Overall brand health score decreased to 73%, falling below the 75% alert threshold.",
    timestamp: "2024-01-16T10:30:00Z",
    isRead: false,
    isSnoozed: false
  },
  {
    id: "2",
    type: "info",
    category: "issue",
    headline: "New Brand Issue Detected",
    description: "Logo placement issue found on homepage requiring immediate attention.",
    timestamp: "2024-01-16T09:15:00Z",
    isRead: false,
    isSnoozed: false
  },
  {
    id: "3",
    type: "success",
    category: "governance",
    headline: "Approval Workflow Completed",
    description: "Marketing campaign assets have been approved and are ready for deployment.",
    timestamp: "2024-01-15T16:45:00Z",
    isRead: true,
    isSnoozed: false
  },
  {
    id: "4",
    type: "warning",
    category: "audit",
    headline: "Multiple Color Violations Detected",
    description: "15 assets found using incorrect brand colors across digital properties.",
    timestamp: "2024-01-15T14:20:00Z",
    isRead: false,
    isSnoozed: true,
    snoozeUntil: "2024-01-17T09:00:00Z"
  }
];

interface NotificationSettings {
  emailAlerts: boolean;
  inAppAlerts: boolean;
  auditAlerts: boolean;
  issueAlerts: boolean;
  governanceAlerts: boolean;
}

export default function NotificationsAlerts() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailAlerts: true,
    inAppAlerts: true,
    auditAlerts: true,
    issueAlerts: true,
    governanceAlerts: true
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "info": return <Info className="h-5 w-5 text-blue-600" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning": return "secondary";
      case "info": return "outline";
      case "success": return "default";
      default: return "outline";
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
    toast({
      title: "Marked as Read",
      description: "Notification marked as read"
    });
  };

  const handleSnooze = (id: string, duration: string) => {
    const snoozeUntil = new Date();
    switch (duration) {
      case "1h":
        snoozeUntil.setHours(snoozeUntil.getHours() + 1);
        break;
      case "3h":
        snoozeUntil.setHours(snoozeUntil.getHours() + 3);
        break;
      case "1d":
        snoozeUntil.setDate(snoozeUntil.getDate() + 1);
        break;
    }

    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { 
        ...notif, 
        isSnoozed: true, 
        snoozeUntil: snoozeUntil.toISOString() 
      } : notif
    ));

    toast({
      title: "Notification Snoozed",
      description: `Snoozed for ${duration}`
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification Deleted",
      description: "Notification has been removed"
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    if (severityFilter !== "all" && notif.type !== severityFilter) return false;
    if (categoryFilter !== "all" && notif.category !== categoryFilter) return false;
    
    if (timeFilter !== "all") {
      const notifDate = new Date(notif.timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - notifDate.getTime();
      
      switch (timeFilter) {
        case "24h":
          if (timeDiff > 24 * 60 * 60 * 1000) return false;
          break;
        case "7d":
          if (timeDiff > 7 * 24 * 60 * 60 * 1000) return false;
          break;
        case "30d":
          if (timeDiff > 30 * 24 * 60 * 60 * 1000) return false;
          break;
      }
    }
    
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Notifications & Alerts</h1>
              <p className="text-muted-foreground">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>

          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Notification Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Notification Delivery</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <Switch
                        id="email-alerts"
                        checked={settings.emailAlerts}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, emailAlerts: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="in-app-alerts">In-App Alerts</Label>
                      <Switch
                        id="in-app-alerts"
                        checked={settings.inAppAlerts}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, inAppAlerts: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">Alert Categories</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="audit-alerts">Audit Alerts</Label>
                      <Switch
                        id="audit-alerts"
                        checked={settings.auditAlerts}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, auditAlerts: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="issue-alerts">Issue Alerts</Label>
                      <Switch
                        id="issue-alerts"
                        checked={settings.issueAlerts}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, issueAlerts: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="governance-alerts">Governance Alerts</Label>
                      <Switch
                        id="governance-alerts"
                        checked={settings.governanceAlerts}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, governanceAlerts: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setShowSettings(false)}>
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Severity:</Label>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm">Category:</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="issue">Issue</SelectItem>
                    <SelectItem value="governance">Governance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm">Time:</Label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[120px]">
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

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`${notification.isRead ? 'opacity-60' : ''} ${notification.isSnoozed ? 'border-orange-200' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium truncate">{notification.headline}</h3>
                      <Badge variant={getTypeColor(notification.type)} className="text-xs">
                        {notification.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {notification.category}
                      </Badge>
                      {notification.isSnoozed && (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Snoozed
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.description}
                    </p>
                    
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(notification.timestamp), "MMM d, yyyy 'at' h:mm a")}
                      {notification.snoozeUntil && (
                        <span className="ml-2">
                          • Snoozed until {format(new Date(notification.snoozeUntil), "MMM d, h:mm a")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={notification.isRead}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Select onValueChange={(duration) => handleSnooze(notification.id, duration)}>
                      <SelectTrigger className="w-8 h-8 p-0 border-none bg-transparent hover:bg-accent">
                        <Clock className="h-4 w-4" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">Snooze 1 hour</SelectItem>
                        <SelectItem value="3h">Snooze 3 hours</SelectItem>
                        <SelectItem value="1d">Snooze 1 day</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredNotifications.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or check back later for new alerts.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}