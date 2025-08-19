import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBrandContext } from "@/hooks/useBrandContext";
import { Building2, ChevronDown } from "lucide-react";

export const BrandSelector = () => {
  const { brands, selectedBrandId, setSelectedBrand } = useBrandContext();
  const [showAll, setShowAll] = useState(false);

  const selectedBrand = brands.find(b => b.id === selectedBrandId);
  const mainBrands = brands.filter(b => b.type === 'main');
  const subBrands = brands.filter(b => b.type === 'sub');

  const getSubBrands = (parentId: string) => {
    return subBrands.filter(b => b.parentId === parentId);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-card border border-border/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-primary" />
        <span className="font-medium">Active Brand:</span>
      </div>
      
      <Select value={selectedBrandId || "all"} onValueChange={(value) => setSelectedBrand(value === "all" ? null : value)}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a brand...">
            {selectedBrand ? (
              <div className="flex items-center gap-2">
                <Badge variant={selectedBrand.type === 'main' ? 'default' : 'secondary'} className="text-xs">
                  {selectedBrand.type}
                </Badge>
                {selectedBrand.name}
              </div>
            ) : (
              "All Brands"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">All</Badge>
              All Brands
            </div>
          </SelectItem>
          
          {mainBrands.map((brand) => (
            <div key={brand.id}>
              <SelectItem value={brand.id}>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">Main</Badge>
                  {brand.name}
                </div>
              </SelectItem>
              
              {getSubBrands(brand.id).map((subBrand) => (
                <SelectItem key={subBrand.id} value={subBrand.id}>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="secondary" className="text-xs">Sub</Badge>
                    {subBrand.name}
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
          
          {/* Orphaned sub-brands (no parent) */}
          {subBrands.filter(b => !b.parentId || !brands.find(parent => parent.id === b.parentId)).map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Sub</Badge>
                {brand.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedBrand && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {selectedBrand.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {selectedBrand.description}
          </span>
        </div>
      )}
    </div>
  );
};