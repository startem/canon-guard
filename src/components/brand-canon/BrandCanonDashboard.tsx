import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandProvider, useBrandContext } from "@/hooks/useBrandContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { 
  Building2, 
  Palette, 
  FileText, 
  MessageSquare, 
  Shield, 
  GitBranch,
  Plus,
  Settings,
  History,
  Users,
  Archive
} from "lucide-react";
import { BrandHierarchy } from "./BrandHierarchy";
import { ColorTokens } from "./ColorTokens";
import { MessagingPillars } from "./MessagingPillars";
import { BoilerplateManager } from "./BoilerplateManager";
import { LegalCompliance } from "./LegalCompliance";
import { VersionHistory } from "./VersionHistory";
import { BrandCanonRestore } from "./BrandCanonRestore";

const BrandCanonInner = () => {
  const { currentClient } = useWorkspace();
  const { brands, colorTokens, messagingPillars } = useBrandContext();
  const [ingestionDialogOpen, setIngestionDialogOpen] = useState(false);
  const [activeVersion, setActiveVersion] = useState("v2.1.0");
  const [isDraft, setIsDraft] = useState(false);

  const handleIngestionComplete = (data: any) => {
    console.log("Brand ingestion completed:", data);
    setIngestionDialogOpen(false);
  };

  const handleRestore = (version: any) => {
    console.log("Restoring to version:", version);
    setActiveVersion(version.version);
  };

  const handleCreateBackup = (description: string) => {
    console.log("Creating backup:", description);
  };

  const stats = {
    brands: brands.filter((b) => b.type === "main").length,
    subBrands: brands.filter((b) => b.type === "sub").length,
    pillars: messagingPillars.length,
    colorTokens: colorTokens.length,
    lastUpdated: new Date().toISOString().split("T")[0],
    approvalStatus: currentClient ? "Active" : "No client",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Brand Canon</h1>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  {stats.approvalStatus}
                </Badge>
                <Badge variant="outline">
                  {currentClient?.name ?? "No client selected"}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Define and govern your brand's source of truth
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                Version History
              </Button>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Governance
              </Button>
              <Button variant="hero" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Version
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4 bg-background/50">
              <div className="text-2xl font-bold text-primary">{stats.brands}</div>
              <div className="text-sm text-muted-foreground">Brands</div>
            </Card>
            <Card className="p-4 bg-background/50">
              <div className="text-2xl font-bold text-primary">{stats.subBrands}</div>
              <div className="text-sm text-muted-foreground">Sub-brands</div>
            </Card>
            <Card className="p-4 bg-background/50">
              <div className="text-2xl font-bold text-primary">{stats.pillars}</div>
              <div className="text-sm text-muted-foreground">Messaging Pillars</div>
            </Card>
            <Card className="p-4 bg-background/50">
              <div className="text-2xl font-bold text-primary">{stats.colorTokens}</div>
              <div className="text-sm text-muted-foreground">Design Tokens</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="hierarchy" className="space-y-8">
          <TabsList className="w-full grid grid-cols-7 lg:flex lg:w-auto bg-gradient-card">
            <TabsTrigger value="hierarchy" className="flex items-center gap-2 min-w-[120px]">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hierarchy</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2 min-w-[120px]">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Design</span>
            </TabsTrigger>
            <TabsTrigger value="messaging" className="flex items-center gap-2 min-w-[120px]">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Messaging</span>
            </TabsTrigger>
            <TabsTrigger value="boilerplate" className="flex items-center gap-2 min-w-[120px]">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Boilerplate</span>
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-2 min-w-[120px]">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Legal</span>
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center gap-2 min-w-[120px]">
              <GitBranch className="w-4 h-4" />
              <span className="hidden sm:inline">Versions</span>
            </TabsTrigger>
            <TabsTrigger value="restore" className="flex items-center gap-2 min-w-[120px]">
              <Archive className="w-4 h-4" />
              <span className="hidden sm:inline">Restore</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hierarchy" className="space-y-6">
            <BrandHierarchy />
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <ColorTokens />
          </TabsContent>

          <TabsContent value="messaging" className="space-y-6">
            <MessagingPillars />
          </TabsContent>

          <TabsContent value="boilerplate" className="space-y-6">
            <BoilerplateManager />
          </TabsContent>

          <TabsContent value="legal" className="space-y-6">
            <LegalCompliance />
          </TabsContent>

          <TabsContent value="versions" className="space-y-6">
            <VersionHistory />
          </TabsContent>

          <TabsContent value="restore" className="space-y-6">
            <BrandCanonRestore 
              currentVersion={activeVersion}
              onRestore={handleRestore}
              onCreateBackup={handleCreateBackup}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </BrandProvider>
  );
};