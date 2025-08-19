import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Calendar, 
  User, 
  FileText, 
  ArrowRight,
  Download,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface VersionChange {
  section: string;
  type: 'added' | 'modified' | 'removed';
  description: string;
}

interface BrandVersion {
  id: string;
  version: string;
  status: 'current' | 'archived' | 'draft';
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  changelog: string;
  changes: VersionChange[];
  tags: string[];
  rollbackAvailable: boolean;
}

const mockVersions: BrandVersion[] = [
  {
    id: "1",
    version: "v2.1.0",
    status: "current",
    createdBy: "Sarah Johnson",
    createdAt: "2024-08-15",
    approvedBy: "Mike Chen",
    approvedAt: "2024-08-16",
    changelog: "Updated messaging pillars and added new color tokens for product launch",
    changes: [
      {
        section: "Messaging Pillars",
        type: "modified",
        description: "Updated Innovation pillar definition to include AI emphasis"
      },
      {
        section: "Color Tokens",
        type: "added",
        description: "Added 3 new accent colors for product differentiation"
      },
      {
        section: "Boilerplate",
        type: "modified",
        description: "Refreshed company short description with latest metrics"
      }
    ],
    tags: ["Product Launch", "Q3 2024"],
    rollbackAvailable: true
  },
  {
    id: "2",
    version: "v2.0.5",
    status: "archived",
    createdBy: "David Kim",
    createdAt: "2024-07-28",
    approvedBy: "Sarah Johnson",
    approvedAt: "2024-07-30",
    changelog: "Legal compliance updates for GDPR and trademark refresh",
    changes: [
      {
        section: "Legal Compliance",
        type: "modified",
        description: "Updated GDPR privacy notice with new data processing guidelines"
      },
      {
        section: "Brand Hierarchy",
        type: "modified",
        description: "Updated trademark symbols for European markets"
      }
    ],
    tags: ["Legal Update", "Compliance"],
    rollbackAvailable: true
  },
  {
    id: "3",
    version: "v2.0.0",
    status: "archived",
    createdBy: "Alex Thompson",
    createdAt: "2024-06-15",
    approvedBy: "Mike Chen",
    approvedAt: "2024-06-20",
    changelog: "Major brand refresh with new visual identity and messaging framework",
    changes: [
      {
        section: "Brand Hierarchy",
        type: "added",
        description: "Added TechCorp Pro sub-brand with complete naming guidelines"
      },
      {
        section: "Color Tokens",
        type: "modified",
        description: "Complete color palette refresh with new primary and secondary colors"
      },
      {
        section: "Messaging Pillars",
        type: "added",
        description: "Introduced 4 new messaging pillars replacing legacy framework"
      },
      {
        section: "Boilerplate",
        type: "modified",
        description: "Complete rewrite of all company descriptions and value propositions"
      }
    ],
    tags: ["Major Update", "Brand Refresh", "Q2 2024"],
    rollbackAvailable: false
  },
  {
    id: "4",
    version: "v1.8.2",
    status: "draft",
    createdBy: "Lisa Park",
    createdAt: "2024-08-18",
    changelog: "Draft updates for upcoming regional expansion",
    changes: [
      {
        section: "Brand Hierarchy",
        type: "added",
        description: "Added regional variants for APAC markets"
      },
      {
        section: "Legal Compliance",
        type: "added",
        description: "New compliance requirements for Singapore and Japan"
      }
    ],
    tags: ["Draft", "APAC Expansion"],
    rollbackAvailable: false
  }
];

export const VersionHistory = () => {
  const [selectedVersion, setSelectedVersion] = useState<BrandVersion | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  const toggleExpanded = (versionId: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      current: "default",
      archived: "secondary",
      draft: "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getChangeTypeBadge = (type: string) => {
    const variants = {
      added: "default",
      modified: "secondary",
      removed: "destructive"
    } as const;
    
    return <Badge variant={variants[type as keyof typeof variants]} className="text-xs">{type}</Badge>;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Version Timeline */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Version History</h2>
            <p className="text-sm text-muted-foreground">
              Track changes and manage brand canon versions
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
        </div>
        
        <div className="space-y-4">
          {mockVersions.map((version, index) => (
            <Card key={version.id} className="p-6">
              <div className="space-y-4">
                {/* Version Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {version.version.replace('v', '').split('.')[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{version.version}</h3>
                        {getStatusBadge(version.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {version.createdBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {version.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleExpanded(version.id)}
                    >
                      {expandedVersions.has(version.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {version.rollbackAvailable && version.status !== 'current' && (
                      <Button variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>

                {/* Changelog */}
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {version.changelog}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {version.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Approval Info */}
                {version.approvedBy && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground p-3 bg-success/5 rounded-lg border border-success/20">
                    <span>Approved by {version.approvedBy} on {version.approvedAt}</span>
                  </div>
                )}

                {/* Expanded Changes */}
                {expandedVersions.has(version.id) && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium text-sm">Changes in this version:</h4>
                    <div className="space-y-2">
                      {version.changes.map((change, changeIndex) => (
                        <div key={changeIndex} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2 min-w-0">
                            {getChangeTypeBadge(change.type)}
                            <span className="text-sm font-medium">{change.section}</span>
                          </div>
                          <p className="text-sm text-muted-foreground flex-1">
                            {change.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline connector */}
                {index < mockVersions.length - 1 && (
                  <div className="flex justify-center pt-4">
                    <div className="w-px h-4 bg-border"></div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Version Compare/Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Version Details</h2>
        
        <Card className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-white mb-4">
              <GitBranch className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Version Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select versions to compare changes or view detailed history
            </p>
          </div>

          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Eye className="w-4 h-4 mr-2" />
              Compare Versions
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Current
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <GitBranch className="w-4 h-4 mr-2" />
              Create Branch
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Versions:</span>
              <span className="font-medium">{mockVersions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active Drafts:</span>
              <span className="font-medium">{mockVersions.filter(v => v.status === 'draft').length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Update:</span>
              <span className="font-medium">{mockVersions[0].createdAt}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};