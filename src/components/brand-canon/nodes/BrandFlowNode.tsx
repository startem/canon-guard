import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Package, 
  Globe, 
  AlertTriangle, 
  Plus,
  Edit,
  Trash2
} from "lucide-react";

interface BrandNodeData {
  id: string;
  name: string;
  description: string;
  type: 'brand' | 'sub-brand' | 'product';
  status: 'active' | 'deprecated' | 'draft';
  regions: string[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddChild?: (parentId: string) => void;
  hasChildren?: boolean;
  logoUrl?: string;
  brandColors?: string[];
}

const BrandFlowNode = ({ data, selected }: NodeProps) => {
  // Safely cast data with proper type checking
  const brandData = (data as unknown) as BrandNodeData;

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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      deprecated: "destructive",
      draft: "secondary"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]} className="text-xs">{status}</Badge>;
  };

  const getNodeBackground = () => {
    if (brandData.type === 'brand') return 'bg-gradient-to-br from-primary/10 to-primary/5';
    if (brandData.type === 'sub-brand') return 'bg-gradient-to-br from-secondary/10 to-secondary/5';
    return 'bg-gradient-to-br from-accent/10 to-accent/5';
  };

  const getBorderColor = () => {
    if (selected) return 'border-primary';
    if (brandData.status === 'deprecated') return 'border-destructive/20';
    if (brandData.status === 'draft') return 'border-secondary/20';
    return 'border-border';
  };

  return (
    <Card className={`w-72 p-4 ${getNodeBackground()} ${getBorderColor()} transition-brand hover:shadow-card`}>
      {brandData.type !== 'brand' && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-primary border-2 border-white"
        />
      )}

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {brandData.logoUrl ? (
              <img src={brandData.logoUrl} alt={brandData.name} className="w-6 h-6 rounded" />
            ) : (
              <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center text-white text-xs">
                {getTypeIcon(brandData.type)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-sm">{brandData.name}</h3>
              <p className="text-xs text-muted-foreground capitalize">{brandData.type}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {brandData.status === 'deprecated' && (
              <AlertTriangle className="w-3 h-3 text-destructive" />
            )}
            {getStatusBadge(brandData.status)}
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">
          {brandData.description}
        </p>

        {brandData.brandColors && brandData.brandColors.length > 0 && (
          <div className="flex gap-1">
            {brandData.brandColors.slice(0, 4).map((color: string, index: number) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {brandData.brandColors.length > 4 && (
              <div className="w-4 h-4 rounded-full bg-muted border border-white shadow-sm flex items-center justify-center text-xs">
                +{brandData.brandColors.length - 4}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {brandData.regions?.slice(0, 2).map((region: string) => (
            <Badge key={region} variant="outline" className="text-xs px-1 py-0">
              {region}
            </Badge>
          ))}
          {brandData.regions && brandData.regions.length > 2 && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              +{brandData.regions.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                brandData.onEdit?.(brandData.id);
              }}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                brandData.onDelete?.(brandData.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
          
          {brandData.type !== 'product' && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={(e) => {
                e.stopPropagation();
                brandData.onAddChild?.(brandData.id);
              }}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add {brandData.type === 'brand' ? 'Sub-brand' : 'Product'}
            </Button>
          )}
        </div>
      </div>

      {brandData.type !== 'product' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-primary border-2 border-white"
        />
      )}
    </Card>
  );
};

export default memo(BrandFlowNode);