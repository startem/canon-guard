import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { GlobalNavigation } from "@/components/GlobalNavigation";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <GlobalNavigation />
        
        <main className="flex-1 flex flex-col">
          {/* Global Header */}
          <header className="h-16 flex items-center border-b border-border bg-background px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-foreground">
                Brand Management Platform
              </h1>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}