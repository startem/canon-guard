import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface MessagingPillar {
  id: string;
  name: string;
  description: string;
  definition: string;
  examples: string[];
  keywords: string[];
  requiredCoverage: number;
  currentCoverage: number;
  assetTypes: string[];
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

interface PillarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pillar?: MessagingPillar | null;
  onSave: (pillar: Omit<MessagingPillar, 'id' | 'currentCoverage'>) => void;
}

export const PillarDialog = ({ open, onOpenChange, pillar, onSave }: PillarDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    definition: "",
    examples: [""],
    keywords: [""],
    requiredCoverage: 70,
    assetTypes: [] as string[],
    priority: "medium" as 'high' | 'medium' | 'low',
    icon: "lightbulb"
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [newExample, setNewExample] = useState("");
  const [newAssetType, setNewAssetType] = useState("");

  const iconOptions = [
    { value: "lightbulb", label: "Lightbulb" },
    { value: "shield", label: "Shield" },
    { value: "zap", label: "Zap" },
    { value: "heart", label: "Heart" },
    { value: "target", label: "Target" },
    { value: "trending", label: "Trending" }
  ];

  const commonAssetTypes = ["website", "sales-deck", "pr-content", "product-docs", "customer-content", "legal-docs"];

  useEffect(() => {
    if (pillar) {
      setFormData({
        name: pillar.name,
        description: pillar.description,
        definition: pillar.definition,
        examples: pillar.examples,
        keywords: pillar.keywords,
        requiredCoverage: pillar.requiredCoverage,
        assetTypes: pillar.assetTypes,
        priority: pillar.priority,
        icon: pillar.icon
      });
    } else {
      setFormData({
        name: "",
        description: "",
        definition: "",
        examples: [""],
        keywords: [""],
        requiredCoverage: 70,
        assetTypes: [],
        priority: "medium",
        icon: "lightbulb"
      });
    }
  }, [pillar, open]);

  const handleSave = () => {
    const cleanedData = {
      ...formData,
      examples: formData.examples.filter(ex => ex.trim() !== ""),
      keywords: formData.keywords.filter(kw => kw.trim() !== ""),
    };
    
    onSave(cleanedData);
    onOpenChange(false);
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addExample = () => {
    if (newExample.trim()) {
      setFormData(prev => ({
        ...prev,
        examples: [...prev.examples, newExample.trim()]
      }));
      setNewExample("");
    }
  };

  const removeExample = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const addAssetType = () => {
    if (newAssetType.trim() && !formData.assetTypes.includes(newAssetType.trim())) {
      setFormData(prev => ({
        ...prev,
        assetTypes: [...prev.assetTypes, newAssetType.trim()]
      }));
      setNewAssetType("");
    }
  };

  const removeAssetType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      assetTypes: prev.assetTypes.filter(t => t !== type)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {pillar ? "Edit Messaging Pillar" : "Create New Messaging Pillar"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Pillar Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Innovation"
              />
            </div>
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Short Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this messaging pillar"
            />
          </div>

          <div>
            <Label htmlFor="definition">Full Definition</Label>
            <Textarea
              id="definition"
              value={formData.definition}
              onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
              placeholder="Complete definition of this messaging pillar..."
              rows={4}
            />
          </div>

          <div>
            <Label>Examples</Label>
            <div className="space-y-2">
              {formData.examples.map((example, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={example}
                    onChange={(e) => {
                      const newExamples = [...formData.examples];
                      newExamples[index] = e.target.value;
                      setFormData(prev => ({ ...prev, examples: newExamples }));
                    }}
                    placeholder="Example usage..."
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeExample(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="Add new example..."
                  onKeyDown={(e) => e.key === 'Enter' && addExample()}
                />
                <Button onClick={addExample} variant="outline">Add</Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Keywords & Phrases</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 min-h-[40px] p-2 border rounded-md">
                {formData.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 w-4 h-4"
                      onClick={() => removeKeyword(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keyword..."
                  onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                />
                <Button onClick={addKeyword} variant="outline">Add</Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Asset Types</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 min-h-[40px] p-2 border rounded-md">
                {formData.assetTypes.map((type) => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 w-4 h-4"
                      onClick={() => removeAssetType(type)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={newAssetType} onValueChange={setNewAssetType}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonAssetTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addAssetType} variant="outline">Add</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="coverage">Required Coverage (%)</Label>
              <Input
                id="coverage"
                type="number"
                min="0"
                max="100"
                value={formData.requiredCoverage}
                onChange={(e) => setFormData(prev => ({ ...prev, requiredCoverage: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {pillar ? "Save Changes" : "Create Pillar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};