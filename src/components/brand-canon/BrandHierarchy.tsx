import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Building2,
  Package,
  Globe,
  AlertTriangle
} from "lucide-react";

interface BrandNode {
  id: string;
  name: string;
  description: string;
  type: 'brand' | 'sub-brand' | 'product';
  status: 'active' | 'deprecated' | 'draft';
  regions: string[];
  children?: BrandNode[];
  nameVariants?: string[];
  disallowedNames?: string[];
}

const mockBrandHierarchy: BrandNode[] = [
  {
    id: "1",
    name: "TechCorp",
    description: "Main corporate brand",
    type: "brand",
    status: "active",
    regions: ["Global"],
    nameVariants: ["TechCorp Inc.", "TC"],
    disallowedNames: ["TechCorp Ltd", "Tech Corp"],
    children: [
      {
        id: "2",
        name: "TechCorp Pro",
        description: "Professional services division",
        type: "sub-brand",
        status: "active",
        regions: ["North America", "Europe"],
        nameVariants: ["TC Pro", "TechCorp Professional"],
        children: [
          {
            id: "3",
            name: "ProAnalytics",
            description: "Analytics product line",
            type: "product",
            status: "active",
            regions: ["Global"]
          }
        ]
      },
      {
        id: "4",
        name: "TechCorp Lite",
        description: "Consumer products",
        type: "sub-brand",
        status: "deprecated",
        regions: ["Global"],
        disallowedNames: ["TechCorp Light", "TC Lite"]
      }
    ]
  }
];

export const BrandHierarchy = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1", "2"]));
  const [selectedNode, setSelectedNode] = useState<BrandNode | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      deprecated: "destructive",
      draft: "secondary"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'brand':
        return <Building2 className="w-4 h-4" />;
      case 'sub-brand':
        return <Package className="w-4 h-4" />;
      case 'product':
        return <Globe className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const renderBrandNode = (node: BrandNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="space-y-2">
        <div 
          className={`flex items-center gap-3 p-3 rounded-lg border transition-brand cursor-pointer hover:shadow-card ${
            selectedNode?.id === node.id ? 'bg-primary/5 border-primary/20' : 'bg-background hover:bg-muted/50'
          }`}
          style={{ marginLeft: `${level * 24}px` }}
          onClick={() => setSelectedNode(node)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }}
              className="p-1 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}
          
          <div className="flex items-center gap-2">
            {getTypeIcon(node.type)}
            <span className="font-medium">{node.name}</span>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            {node.status === 'deprecated' && (
              <AlertTriangle className="w-4 h-4 text-destructive" />
            )}
            {getStatusBadge(node.status)}
            <span className="text-xs text-muted-foreground">
              {node.regions.join(", ")}
            </span>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderBrandNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Hierarchy Tree */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Brand Hierarchy</h2>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        </div>
        
        <Card className="p-6">
          <div className="space-y-2">
            {mockBrandHierarchy.map(node => renderBrandNode(node))}
          </div>
        </Card>
      </div>

      {/* Details Panel */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Brand Details</h2>
        
        {selectedNode ? (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{selectedNode.name}</h3>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <div className="flex items-center gap-2 mt-1">
                  {getTypeIcon(selectedNode.type)}
                  <span className="capitalize">{selectedNode.type}</span>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedNode.description}
                </p>
              </div>

              <div>
                <Label>Status</Label>
                <div className="mt-1">
                  {getStatusBadge(selectedNode.status)}
                </div>
              </div>

              <div>
                <Label>Regions</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedNode.regions.map(region => (
                    <Badge key={region} variant="outline" className="text-xs">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedNode.nameVariants && (
                <div>
                  <Label>Approved Name Variants</Label>
                  <div className="space-y-1 mt-2">
                    {selectedNode.nameVariants.map((variant, index) => (
                      <div key={index} className="text-sm bg-success/10 text-success px-2 py-1 rounded">
                        {variant}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.disallowedNames && (
                <div>
                  <Label>Disallowed Names</Label>
                  <div className="space-y-1 mt-2">
                    {selectedNode.disallowedNames.map((name, index) => (
                      <div key={index} className="text-sm bg-destructive/10 text-destructive px-2 py-1 rounded">
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" size="sm" className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button variant="hero" size="sm" className="flex-1">
                Save Changes
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              Select a brand from the hierarchy to view details
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};