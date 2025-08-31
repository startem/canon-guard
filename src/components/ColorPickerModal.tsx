import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export interface ColorToken {
  id: string;
  name: string;
  value: string;
  category: "Primary" | "Secondary" | "Accent" | "Neutral" | "Status";
  usage: string;
}

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (colorToken: Omit<ColorToken, "id">) => void;
  editingColor?: ColorToken | null;
}

export const ColorPickerModal = ({ isOpen, onClose, onSave, editingColor }: ColorPickerModalProps) => {
  const [name, setName] = useState(editingColor?.name || "");
  const [value, setValue] = useState(editingColor?.value || "#3B82F6");
  const [category, setCategory] = useState<ColorToken["category"]>(editingColor?.category || "Primary");
  const [usage, setUsage] = useState(editingColor?.usage || "");

  const handleSave = () => {
    if (!name.trim() || !value.trim()) return;
    
    onSave({
      name,
      value,
      category,
      usage
    });
    
    // Reset form
    setName("");
    setValue("#3B82F6");
    setCategory("Primary");
    setUsage("");
    onClose();
  };

  const handleClose = () => {
    setName(editingColor?.name || "");
    setValue(editingColor?.value || "#3B82F6");
    setCategory(editingColor?.category || "Primary");
    setUsage(editingColor?.usage || "");
    onClose();
  };

  const presetColors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
    "#06B6D4", "#F97316", "#84CC16", "#EC4899", "#6B7280"
  ];

  const getCategoryColor = (cat: ColorToken["category"]) => {
    switch (cat) {
      case "Primary": return "bg-blue-100 text-blue-800";
      case "Secondary": return "bg-purple-100 text-purple-800";
      case "Accent": return "bg-green-100 text-green-800";
      case "Neutral": return "bg-gray-100 text-gray-800";
      case "Status": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingColor ? "Edit Color Token" : "Add Color Token"}
          </DialogTitle>
          <DialogDescription>
            {editingColor 
              ? "Update the color token details below."
              : "Create a new color token for your design system."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Color Name */}
          <div className="space-y-2">
            <Label htmlFor="color-name">Token Name</Label>
            <Input
              id="color-name"
              placeholder="e.g., Primary Blue, Success Green"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Color Value */}
          <div className="space-y-2">
            <Label htmlFor="color-value">Color Value</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="color-value"
                  type="color"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-16 h-10 border rounded cursor-pointer"
                />
                <Input
                  placeholder="#3B82F6"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="pl-20"
                />
              </div>
            </div>
            
            {/* Preset Colors */}
            <div className="flex flex-wrap gap-2 mt-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => setValue(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value: ColorToken["category"]) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary">Primary</SelectItem>
                <SelectItem value="Secondary">Secondary</SelectItem>
                <SelectItem value="Accent">Accent</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={getCategoryColor(category)}>{category}</Badge>
          </div>

          {/* Usage Notes */}
          <div className="space-y-2">
            <Label htmlFor="usage">Usage Notes</Label>
            <Textarea
              id="usage"
              placeholder="e.g., Use for primary buttons, headlines, and key brand elements"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Color Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-4 border rounded-lg" style={{ backgroundColor: value }}>
              <div className="text-white text-sm font-medium drop-shadow">
                {name || "Color Name"}
              </div>
              <div className="text-white text-xs opacity-90 drop-shadow">
                {value}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || !value.trim()}>
            {editingColor ? "Update Color" : "Add Color"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};