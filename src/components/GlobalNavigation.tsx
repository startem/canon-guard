import { useState } from "react";
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
  SidebarTrigger,
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
  FileText,
  BarChart3,
  Bell,
  Archive,
  ClipboardList,
  Settings
} from "lucide-react";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    group: "Overview"
  },
  { 
    title: "Ingest & Baseline", 
    url: "/ingest-baseline", 
    icon: Scan,
    group: "Setup"
  },
  { 
    title: "Strategy Builder", 
    url: "/strategy-builder", 
    icon: Target,
    group: "Strategy"
  },
  { 
    title: "Positioning & Messaging", 
    url: "/positioning-messaging", 
    icon: MessageSquare,
    group: "Strategy"
  },
  { 
    title: "Personality & Story", 
    url: "/personality-story", 
    icon: User,
    group: "Strategy"
  },
  { 
    title: "Identity Designer", 
    url: "/identity-designer", 
    icon: Palette,
    group: "Design"
  },
  { 
    title: "Experience & Operations", 
    url: "/experience-operations", 
    icon: Users,
    group: "Operations"
  },
  { 
    title: "Visibility & Growth", 
    url: "/visibility-growth", 
    icon: TrendingUp,
    group: "Growth"
  },
  { 
    title: "Governance & Alerts", 
    url: "/governance-alerts", 
    icon: Shield,
    group: "Management"
  },
  { 
    title: "Audit Details", 
    url: "/audit-details", 
    icon: Search,
    group: "Analysis"
  },
  { 
    title: "Issues", 
    url: "/issues", 
    icon: ClipboardList,
    group: "Analysis"
  },
  { 
    title: "Reports", 
    url: "/reports", 
    icon: FileText,
    group: "Analytics"
  },
  { 
    title: "Analytics Dashboard", 
    url: "/analytics", 
    icon: BarChart3,
    group: "Analytics"
  },
  { 
    title: "Notifications", 
    url: "/notifications", 
    icon: Bell,
    group: "Management"
  },
  { 
    title: "Brand Canon", 
    url: "/brand-canon", 
    icon: Archive,
    group: "Resources"
  }
];

const groupedItems = navigationItems.reduce((acc, item) => {
  if (!acc[item.group]) {
    acc[item.group] = [];
  }
  acc[item.group].push(item);
  return acc;
}, {} as Record<string, typeof navigationItems>);

export function GlobalNavigation() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const baseClasses = "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-brand";
    
    if (isActive(path)) {
      return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
    }
    
    return baseClasses;
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Brand Management</h2>
              <p className="text-xs text-sidebar-foreground/60">Platform</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
                {groupName}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClasses(item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
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