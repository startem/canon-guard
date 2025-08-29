import { useState } from "react";
import { BrandManagementDashboard } from "@/components/brand-management/BrandManagementDashboard";
import { BrandCanonDashboard } from "@/components/brand-canon/BrandCanonDashboard";
import { BrandProvider } from "@/hooks/useBrandContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building2, Monitor, Settings, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="management" className="w-full">
        {/* Navigation Header */}
        <div className="border-b border-border bg-gradient-card sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <TabsList className="grid grid-cols-2 lg:flex lg:w-auto bg-gradient-card">
                <TabsTrigger value="management" className="flex items-center gap-2 min-w-[200px]">
                  <Monitor className="w-4 h-4" />
                  <span>Brand Management Hub</span>
                </TabsTrigger>
                <TabsTrigger value="canon" className="flex items-center gap-2 min-w-[200px]">
                  <Building2 className="w-4 h-4" />
                  <span>Brand Canon</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/onboarding")}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Setup Wizard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/strategy-builder")}
                  className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
                >
                  <Target className="w-4 h-4" />
                  Strategy Builder
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <TabsContent value="management" className="m-0">
          <BrandManagementDashboard />
        </TabsContent>
        
        <TabsContent value="canon" className="m-0">
          <BrandProvider>
            <BrandCanonDashboard />
          </BrandProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
