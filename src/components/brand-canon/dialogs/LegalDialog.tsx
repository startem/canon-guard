import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

interface LegalItem {
  id: string;
  name: string;
  type: 'disclaimer' | 'trademark' | 'copyright' | 'privacy' | 'terms' | 'claim';
  content: string;
  regions: string[];
  products: string[];
  mandatory: boolean;
  placement: string[];
  expiryDate?: string;
  lastReviewed: string;
  approvalStatus: 'approved' | 'pending-review' | 'expired';
  riskLevel: 'low' | 'medium' | 'high';
}

interface LegalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  legalItem?: LegalItem | null;
  onSave: (item: Omit<LegalItem, 'id' | 'lastReviewed'>) => void;
}

export const LegalDialog = ({ open, onOpenChange, legalItem, onSave }: LegalDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "disclaimer" as 'disclaimer' | 'trademark' | 'copyright' | 'privacy' | 'terms' | 'claim',
    content: "",
    regions: [] as string[],
    products: [] as string[],
    mandatory: false,
    placement: [] as string[],
    expiryDate: "",
    approvalStatus: "pending-review" as 'approved' | 'pending-review' | 'expired',
    riskLevel: "medium" as 'low' | 'medium' | 'high'
  });

  const [newRegion, setNewRegion] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newPlacement, setNewPlacement] = useState("");

  const commonRegions = ["Global", "North America", "Europe", "APAC", "Latin America", "Middle East", "Africa"];
  const commonProducts = ["All Products", "ProAnalytics", "AI Suite", "Cloud Platform", "Mobile App"];
  const commonPlacements = ["Website footer", "Sales materials", "Marketing content", "Legal pages", "Privacy pages", "Cookie banners", "Data collection forms"];

  useEffect(() => {
    if (legalItem) {
      setFormData({
        name: legalItem.name,
        type: legalItem.type,
        content: legalItem.content,
        regions: legalItem.regions,
        products: legalItem.products,
        mandatory: legalItem.mandatory,
        placement: legalItem.placement,
        expiryDate: legalItem.expiryDate || "",
        approvalStatus: legalItem.approvalStatus,
        riskLevel: legalItem.riskLevel
      });
    } else {
      setFormData({
        name: "",
        type: "disclaimer",
        content: "",
        regions: [],
        products: [],
        mandatory: false,
        placement: [],
        expiryDate: "",
        approvalStatus: "pending-review",
        riskLevel: "medium"
      });
    }
  }, [legalItem, open]);

  const handleSave = () => {
    const cleanedData = {
      ...formData,
      expiryDate: formData.expiryDate || undefined
    };
    onSave(cleanedData);
    onOpenChange(false);
  };

  const addItem = (type: 'regions' | 'products' | 'placement', value: string, setValue: (val: string) => void) => {
    if (value.trim() && !formData[type].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()]
      }));
      setValue("");
    }
  };

  const removeItem = (type: 'regions' | 'products' | 'placement', item: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(i => i !== item)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {legalItem ? "Edit Legal Item" : "Create New Legal Item"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Legal Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., General Disclaimer"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disclaimer">Disclaimer</SelectItem>
                  <SelectItem value="trademark">Trademark</SelectItem>
                  <SelectItem value="copyright">Copyright</SelectItem>
                  <SelectItem value="privacy">Privacy</SelectItem>
                  <SelectItem value="terms">Terms</SelectItem>
                  <SelectItem value="claim">Claim</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="content">Legal Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter the legal text content..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select value={formData.riskLevel} onValueChange={(value: any) => setFormData(prev => ({ ...prev, riskLevel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Approval Status</Label>
              <Select value={formData.approvalStatus} onValueChange={(value: any) => setFormData(prev => ({ ...prev, approvalStatus: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending-review">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="mandatory">Mandatory</Label>
              <p className="text-xs text-muted-foreground">
                Must be included in specified asset types
              </p>
            </div>
            <Switch
              id="mandatory"
              checked={formData.mandatory}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, mandatory: checked }))}
            />
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>

          <div>
            <Label>Regions</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 min-h-[40px] p-2 border rounded-md">
                {formData.regions.map((region) => (
                  <Badge key={region} variant="outline" className="text-xs">
                    {region}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 w-4 h-4"
                      onClick={() => removeItem('regions', region)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={newRegion} onValueChange={setNewRegion}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonRegions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addItem('regions', newRegion, setNewRegion)} variant="outline">Add</Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Products</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 min-h-[40px] p-2 border rounded-md">
                {formData.products.map((product) => (
                  <Badge key={product} variant="secondary" className="text-xs">
                    {product}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 w-4 h-4"
                      onClick={() => removeItem('products', product)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={newProduct} onValueChange={setNewProduct}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonProducts.map(product => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addItem('products', newProduct, setNewProduct)} variant="outline">Add</Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Required Placement</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 min-h-[40px] p-2 border rounded-md">
                {formData.placement.map((place) => (
                  <Badge key={place} variant="outline" className="text-xs">
                    {place}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 w-4 h-4"
                      onClick={() => removeItem('placement', place)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={newPlacement} onValueChange={setNewPlacement}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonPlacements.map(placement => (
                      <SelectItem key={placement} value={placement}>
                        {placement}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => addItem('placement', newPlacement, setNewPlacement)} variant="outline">Add</Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {legalItem ? "Save Changes" : "Create Legal Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};