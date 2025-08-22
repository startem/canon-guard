import { useState } from "react";
import { BrandCanonDashboard } from "@/components/brand-canon/BrandCanonDashboard";
import { BrandManagementDashboard } from "@/components/brand-management/BrandManagementDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Monitor } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="management" className="w-full">
        {/* Navigation Header */}
        <div className="border-b border-border bg-gradient-card sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <TabsList className="w-full grid grid-cols-2 lg:flex lg:w-auto bg-gradient-card">
              <TabsTrigger value="management" className="flex items-center gap-2 min-w-[200px]">
                <Monitor className="w-4 h-4" />
                <span>Brand Management Hub</span>
              </TabsTrigger>
              <TabsTrigger value="canon" className="flex items-center gap-2 min-w-[200px]">
                <Building2 className="w-4 h-4" />
                <span>Brand Canon</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Content */}
        <TabsContent value="management" className="m-0">
          <BrandManagementDashboard />
        </TabsContent>
        
        <TabsContent value="canon" className="m-0">
          <BrandCanonDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
