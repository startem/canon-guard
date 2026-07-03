import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Scan,
  Target,
  MessageSquare,
  User,
  Palette,
  Users,
  TrendingUp,
  Shield,
  Search,
  BarChart3,
  Bell,
  Archive,
  ClipboardList,
  Settings,
  Sparkles,
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, group: "Overview" },
  { title: "Ingest & Baseline", url: "/ingest-baseline", icon: Scan, group: "Setup" },
  { title: "Strategy Builder", url: "/strategy-builder", icon: Target, group: "Strategy" },
  { title: "Positioning & Messaging", url: "/positioning-messaging", icon: MessageSquare, group: "Strategy" },
  { title: "Personality & Story", url: "/personality-story", icon: User, group: "Strategy" },
  { title: "Identity Designer", url: "/identity-designer", icon: Palette, group: "Design" },
  { title: "Experience & Operations", url: "/experience-operations", icon: Users, group: "Operations" },
  { title: "Visibility & Growth", url: "/visibility-growth", icon: TrendingUp, group: "Growth" },
  { title: "Governance & Alerts", url: "/governance-alerts", icon: Shield, group: "Management" },
  { title: "Audit Details", url: "/audit-details/visual-identity", icon: Search, group: "Analysis" },
  { title: "Issue Detail", url: "/issue-detail/1", icon: ClipboardList, group: "Analysis" },
  { title: "Analytics Dashboard", url: "/analytics-dashboard", icon: BarChart3, group: "Analytics" },
  { title: "Notifications & Alerts", url: "/notifications-alerts", icon: Bell, group: "Management" },
  { title: "Brand Canon", url: "/brand-canon", icon: Archive, group: "Resources" },
  { title: "User Management", url: "/user-management", icon: Settings, group: "Management" },
];

const groupOrder = ["Overview", "Setup", "Strategy", "Design", "Operations", "Growth", "Analysis", "Analytics", "Management", "Resources"];

const groupedItems = navigationItems.reduce((acc, item) => {
  (acc[item.group] ||= []).push(item);
  return acc;
}, {} as Record<string, typeof navigationItems>);

export function GlobalNavigation() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  const navClasses = (path: string) => {
    const base =
      "group relative w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200";
    return isActive(path)
      ? `${base} bg-gradient-primary text-primary-foreground shadow-glow`
      : `${base} text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`;
  };

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-64"} border-r border-sidebar-border bg-gradient-sidebar`}
      collapsible="icon"
    >
      {/* Brand mark */}
      <div className="p-4 border-b border-sidebar-border/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 shrink-0 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow ring-1 ring-white/10">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <h2 className="font-display font-semibold text-base text-sidebar-foreground tracking-tight">BrandOps</h2>
              <p className="text-[11px] text-sidebar-foreground/55">Brand operations platform</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2 py-2">
        {groupOrder
          .filter((g) => groupedItems[g])
          .map((groupName) => (
            <SidebarGroup key={groupName} className="py-1">
              {!isCollapsed && (
                <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
                  {groupName}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {groupedItems[groupName].map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <NavLink to={item.url} className={navClasses(item.url)}>
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!isCollapsed && <span className="truncate">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
    </Sidebar>
  );
}
