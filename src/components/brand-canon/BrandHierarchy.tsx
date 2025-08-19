import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandDialog } from "./dialogs/BrandDialog";
import { useToast } from "@/components/ui/use-toast";
import BrandFlowNode from "./nodes/BrandFlowNode";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Building2,
  Package,
  Globe,
  AlertTriangle,
  LayoutGrid,
  List
} from "lucide-react";

interface BrandElement {
  messagingPillars: string[];
  colorTokens: string[];
  boilerplates: string[];
  legalItems: string[];
  targetAudiences: string[];
  keyValues: string[];
}

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
  elements?: BrandElement;
  parentId?: string;
  logoUrl?: string;
  brandColors?: string[];
  typography?: string[];
  tone?: string;
  industry?: string;
  website?: string;
  socialChannels?: Record<string, string>;
  brandGuidelines?: string;
}

const initialBrandHierarchy: BrandNode[] = [
  {
    id: "1",
    name: "TechCorp",
    description: "Main corporate brand",
    type: "brand",
    status: "active",
    regions: ["Global"],
    nameVariants: ["TechCorp Inc.", "TC"],
    disallowedNames: ["TechCorp Ltd", "Tech Corp"],
    logoUrl: "https://via.placeholder.com/32x32/6366f1/ffffff?text=TC",
    brandColors: ["#6366f1", "#8b5cf6", "#06b6d4"],
    tone: "professional",
    industry: "technology",
    website: "https://techcorp.com",
    children: [
      {
        id: "2",
        name: "TechCorp Pro",
        description: "Professional services division",
        type: "sub-brand",
        status: "active",
        regions: ["North America", "Europe"],
        nameVariants: ["TC Pro", "TechCorp Professional"],
        parentId: "1",
        brandColors: ["#6366f1", "#1f2937"],
        children: [
          {
            id: "3",
            name: "ProAnalytics",
            description: "Analytics product line",
            type: "product",
            status: "active",
            regions: ["Global"],
            parentId: "2",
            brandColors: ["#06b6d4", "#0891b2"]
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
        disallowedNames: ["TechCorp Light", "TC Lite"],
        parentId: "1",
        brandColors: ["#8b5cf6", "#a855f7"]
      }
    ]
  }
];

// Convert hierarchical data to flow nodes and edges
const createFlowData = (brands: BrandNode[]) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const processNode = (node: BrandNode, x: number, y: number, level: number = 0) => {
    nodes.push({
      id: node.id,
      type: 'brandNode',
      position: { x, y },
      data: {
        ...node,
        hasChildren: (node.children?.length || 0) > 0,
      },
    });

    if (node.children) {
      const childSpacing = 350;
      const startX = x - ((node.children.length - 1) * childSpacing) / 2;
      
      node.children.forEach((child, index) => {
        const childX = startX + (index * childSpacing);
        const childY = y + 200;
        
        processNode(child, childX, childY, level + 1);
        
        edges.push({
          id: `${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'smoothstep',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: {
            strokeWidth: 2,
            stroke: '#6366f1',
          },
        });
      });
    }
  };

  // Process top-level brands
  const brandSpacing = 400;
  const startX = -((brands.length - 1) * brandSpacing) / 2;
  
  brands.forEach((brand, index) => {
    const x = startX + (index * brandSpacing);
    processNode(brand, x, 0);
  });

  return { nodes, edges };
};

const nodeTypes = {
  brandNode: BrandFlowNode as any,
};

export const BrandHierarchy = () => {
  const [brands, setBrands] = useState<BrandNode[]>(initialBrandHierarchy);
  const [viewMode, setViewMode] = useState<'flow' | 'list'>('flow');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["1", "2"]));
  const [selectedNode, setSelectedNode] = useState<BrandNode | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandNode | null>(null);
  const [parentBrand, setParentBrand] = useState<BrandNode | null>(null);
  const { toast } = useToast();

  const { nodes: flowNodes, edges: flowEdges } = createFlowData(brands);
  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Update flow data when brands change
  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createFlowData(brands);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [brands, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Helper function to find a brand by ID in the hierarchy
  const findBrandById = (brandId: string, brandList: BrandNode[] = brands): BrandNode | null => {
    for (const brand of brandList) {
      if (brand.id === brandId) return brand;
      if (brand.children) {
        const found = findBrandById(brandId, brand.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to remove a brand from hierarchy
  const removeBrandFromHierarchy = (brandId: string, brandList: BrandNode[]): BrandNode[] => {
    return brandList.filter(brand => {
      if (brand.id === brandId) return false;
      if (brand.children) {
        brand.children = removeBrandFromHierarchy(brandId, brand.children);
      }
      return true;
    });
  };

  // Helper function to add a brand to hierarchy
  const addBrandToHierarchy = (newBrand: BrandNode, parentId?: string): BrandNode[] => {
    if (!parentId) {
      return [...brands, newBrand];
    }

    const addToParent = (brandList: BrandNode[]): BrandNode[] => {
      return brandList.map(brand => {
        if (brand.id === parentId) {
          return {
            ...brand,
            children: [...(brand.children || []), newBrand]
          };
        }
        if (brand.children) {
          return {
            ...brand,
            children: addToParent(brand.children)
          };
        }
        return brand;
      });
    };

    return addToParent(brands);
  };

  const handleCreateBrand = (parent?: BrandNode) => {
    setParentBrand(parent || null);
    setEditingBrand(null);
    setDialogOpen(true);
  };

  const handleEditBrand = (brandId: string) => {
    const brand = findBrandById(brandId);
    if (brand) {
      setEditingBrand(brand);
      setParentBrand(brand.parentId ? findBrandById(brand.parentId) : null);
      setDialogOpen(true);
    }
  };

  const handleDeleteBrand = (brandId: string) => {
    setBrands(prev => removeBrandFromHierarchy(brandId, prev));
    if (selectedNode?.id === brandId) {
      setSelectedNode(null);
    }
    toast({
      title: "Brand deleted",
      description: "The brand and all its children have been removed."
    });
  };

  const handleSaveBrand = (brandData: Omit<BrandNode, 'id' | 'children'>) => {
    if (editingBrand) {
      // Update existing brand
      const updateBrand = (brandList: BrandNode[]): BrandNode[] => {
        return brandList.map(brand => {
          if (brand.id === editingBrand.id) {
            return { ...brandData, id: editingBrand.id, children: brand.children };
          }
          if (brand.children) {
            return { ...brand, children: updateBrand(brand.children) };
          }
          return brand;
        });
      };
      setBrands(prev => updateBrand(prev));
      toast({
        title: "Brand updated",
        description: "The brand has been successfully updated."
      });
    } else {
      // Create new brand
      const newBrand: BrandNode = {
        ...brandData,
        id: Date.now().toString(),
        children: []
      };
      setBrands(prev => addBrandToHierarchy(newBrand, parentBrand?.id));
      toast({
        title: "Brand created",
        description: "The new brand has been added to the hierarchy."
      });
    }
  };

  const handleAddChild = (parentId: string) => {
    const parent = findBrandById(parentId);
    if (parent) {
      handleCreateBrand(parent);
    }
  };

  // Update node data with action handlers
  React.useEffect(() => {
    setNodes(nodes => 
      nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onEdit: handleEditBrand,
          onDelete: handleDeleteBrand,
          onAddChild: handleAddChild,
        }
      }))
    );
  }, [setNodes]);

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
            {node.logoUrl ? (
              <img src={node.logoUrl} alt={node.name} className="w-6 h-6 rounded" />
            ) : (
              getTypeIcon(node.type)
            )}
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Brand Hierarchy</h2>
          <p className="text-sm text-muted-foreground">
            Organize and manage your brand architecture
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'flow' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('flow')}
              className="h-8 px-3"
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Flow
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleCreateBrand()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(value: string) => setViewMode(value as 'flow' | 'list')}>
        <TabsContent value="flow" className="space-y-4">
          <Card className="h-[600px] p-4">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              className="bg-background"
              minZoom={0.1}
              maxZoom={2}
            >
              <Controls />
              <MiniMap 
                zoomable 
                pannable 
                className="bg-background border border-border rounded-lg"
                nodeColor={(node) => {
                  if (node.type === 'brandNode') {
                    const data = node.data as any;
                    if (data.type === 'brand') return '#6366f1';
                    if (data.type === 'sub-brand') return '#8b5cf6';
                    return '#06b6d4';
                  }
                  return '#6366f1';
                }}
              />
              <Background color="#f1f5f9" gap={20} />
            </ReactFlow>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Hierarchy Tree */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6">
                <div className="space-y-2">
                  {brands.map(node => renderBrandNode(node))}
                </div>
              </Card>
            </div>

            {/* Details Panel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Brand Details</h3>
              
              {selectedNode ? (
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium">{selectedNode.name}</h4>
                    <Button variant="outline" size="sm" onClick={() => handleEditBrand(selectedNode.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getTypeIcon(selectedNode.type)}
                        <span className="capitalize">{selectedNode.type}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedNode.description}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <div className="mt-1">
                        {getStatusBadge(selectedNode.status)}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Regions</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedNode.regions.map(region => (
                          <Badge key={region} variant="outline" className="text-xs">
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedNode.brandColors && selectedNode.brandColors.length > 0 && (
                      <div>
                        <label className="text-sm font-medium">Brand Colors</label>
                        <div className="flex gap-2 mt-2">
                          {selectedNode.brandColors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded border border-white shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedNode.nameVariants && selectedNode.nameVariants.length > 0 && (
                      <div>
                        <label className="text-sm font-medium">Approved Name Variants</label>
                        <div className="space-y-1 mt-2">
                          {selectedNode.nameVariants.map((variant, index) => (
                            <div key={index} className="text-sm bg-success/10 text-success px-2 py-1 rounded">
                              {variant}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedNode.disallowedNames && selectedNode.disallowedNames.length > 0 && (
                      <div>
                        <label className="text-sm font-medium">Disallowed Names</label>
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDeleteBrand(selectedNode.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditBrand(selectedNode.id)}
                    >
                      Edit Brand
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
        </TabsContent>
      </Tabs>

      <BrandDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        brand={editingBrand}
        onSave={handleSaveBrand}
        parentBrand={parentBrand}
      />
    </div>
  );
};