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

interface ColorToken {
  id: string;
  name: string;
  description: string;
  hex: string;
  rgb: string;
  cmyk: string;
  usage: string[];
  category: 'primary' | 'secondary' | 'accent' | 'neutral' | 'status';
  accessibility: {
    wcagAA: boolean;
    wcagAAA: boolean;
    contrastRatio: number;
  };
}

interface ColorTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colorToken?: ColorToken;
  onSave: (colorToken: ColorToken) => void;
}

export const ColorTokenDialog = ({ open, onOpenChange, colorToken, onSave }: ColorTokenDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hex: "#000000",
    category: "primary" as 'primary' | 'secondary' | 'accent' | 'neutral' | 'status',
    usage: [] as string[],
    wcagAA: false,
    wcagAAA: false,
    contrastRatio: 1
  });

  const [newUsage, setNewUsage] = useState("");

  useEffect(() => {
    if (colorToken) {
      setFormData({
        name: colorToken.name,
        description: colorToken.description,
        hex: colorToken.hex,
        category: colorToken.category,
        usage: colorToken.usage,
        wcagAA: colorToken.accessibility.wcagAA,
        wcagAAA: colorToken.accessibility.wcagAAA,
        contrastRatio: colorToken.accessibility.contrastRatio
      });
    } else {
      setFormData({
        name: "",
        description: "",
        hex: "#000000",
        category: "primary" as 'primary' | 'secondary' | 'accent' | 'neutral' | 'status',
        usage: [],
        wcagAA: false,
        wcagAAA: false,
        contrastRatio: 1
      });
    }
  }, [colorToken, open]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "rgb(0, 0, 0)";
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToCmyk = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "C:0 M:0 Y:0 K:100";
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    
    const k = 1 - Math.max(r, Math.max(g, b));
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    
    return `C:${Math.round(c * 100)} M:${Math.round(m * 100)} Y:${Math.round(y * 100)} K:${Math.round(k * 100)}`;
  };

  const addUsage = () => {
    if (newUsage.trim() && !formData.usage.includes(newUsage.trim())) {
      setFormData(prev => ({
        ...prev,
        usage: [...prev.usage, newUsage.trim()]
      }));
      setNewUsage("");
    }
  };

  const removeUsage = (usage: string) => {
    setFormData(prev => ({
      ...prev,
      usage: prev.usage.filter(u => u !== usage)
    }));
  };

  const handleSave = () => {
    const newColorToken: ColorToken = {
      id: colorToken?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      hex: formData.hex,
      rgb: hexToRgb(formData.hex),
      cmyk: hexToCmyk(formData.hex),
      usage: formData.usage,
      category: formData.category,
      accessibility: {
        wcagAA: formData.wcagAA,
        wcagAAA: formData.wcagAAA,
        contrastRatio: formData.contrastRatio
      }
    };

    onSave(newColorToken);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {colorToken ? "Edit Color Token" : "Create Color Token"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Primary Blue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="accent">Accent</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color Preview */}
          <div className="space-y-2">
            <Label>Color Preview</Label>
            <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 rounded-lg border shadow-inner"
                style={{ backgroundColor: formData.hex }}
              />
              <div className="space-y-2">
                <Label htmlFor="hex">Hex Color</Label>
                <Input
                  id="hex"
                  type="color"
                  value={formData.hex}
                  onChange={(e) => setFormData(prev => ({ ...prev, hex: e.target.value }))}
                  className="w-20 h-10"
                />
              </div>
              <div className="space-y-1 text-sm">
                <div>RGB: {hexToRgb(formData.hex)}</div>
                <div>CMYK: {hexToCmyk(formData.hex)}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe when and how this color should be used..."
              rows={3}
            />
          </div>

          {/* Usage Guidelines */}
          <div className="space-y-2">
            <Label>Usage Guidelines</Label>
            <div className="flex gap-2">
              <Input
                value={newUsage}
                onChange={(e) => setNewUsage(e.target.value)}
                placeholder="e.g., Primary buttons"
                onKeyPress={(e) => e.key === "Enter" && addUsage()}
              />
              <Button type="button" onClick={addUsage} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.usage.map((usage, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {usage}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeUsage(usage)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          <div className="space-y-4">
            <Label>Accessibility Compliance</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="wcag-aa">WCAG AA Compliant</Label>
                  <p className="text-sm text-muted-foreground">4.5:1 contrast ratio minimum</p>
                </div>
                <Switch
                  id="wcag-aa"
                  checked={formData.wcagAA}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wcagAA: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="wcag-aaa">WCAG AAA Compliant</Label>
                  <p className="text-sm text-muted-foreground">7:1 contrast ratio minimum</p>
                </div>
                <Switch
                  id="wcag-aaa"
                  checked={formData.wcagAAA}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wcagAAA: checked }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contrast">Contrast Ratio</Label>
                <Input
                  id="contrast"
                  type="number"
                  step="0.1"
                  min="1"
                  max="21"
                  value={formData.contrastRatio}
                  onChange={(e) => setFormData(prev => ({ ...prev, contrastRatio: parseFloat(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {colorToken ? "Save Changes" : "Create Token"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};