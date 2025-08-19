import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface BoilerplateItem {
  id: string;
  name: string;
  type: 'short' | 'long' | 'mission' | 'vision' | 'value-prop';
  content: string;
  version: string;
  regions: string[];
  audiences: string[];
  lastUpdated: string;
  approvalStatus: 'approved' | 'pending' | 'draft';
  characterCount: number;
  usageGuidelines: string;
}

interface BoilerplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boilerplate?: BoilerplateItem | null;
  onSave: (boilerplate: Omit<BoilerplateItem, 'id' | 'lastUpdated' | 'characterCount'>) => void;
}

export const BoilerplateDialog = ({ open, onOpenChange, boilerplate, onSave }: BoilerplateDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "short" as 'short' | 'long' | 'mission' | 'vision' | 'value-prop',
    content: "",
    version: "v1.0",
    regions: [] as string[],
    audiences: [] as string[],
    approvalStatus: "draft" as 'approved' | 'pending' | 'draft',
    usageGuidelines: ""
  });

  const [newRegion, setNewRegion] = useState("");
  const [newAudience, setNewAudience] = useState("");

  const commonRegions = ["Global", "North America", "Europe", "APAC", "Latin America", "Middle East", "Africa"];
  const commonAudiences = ["B2B", "B2C", "Enterprise", "SMB", "Investors", "Press", "Partners", "Employees"];

  useEffect(() => {
    if (boilerplate) {
      setFormData({
        name: boilerplate.name,
        type: boilerplate.type,
        content: boilerplate.content,
        version: boilerplate.version,
        regions: boilerplate.regions,
        audiences: boilerplate.audiences,
        approvalStatus: boilerplate.approvalStatus,
        usageGuidelines: boilerplate.usageGuidelines
      });
    } else {
      setFormData({
        name: "",
        type: "short",
        content: "",
        version: "v1.0",
        regions: [],
        audiences: [],
        approvalStatus: "draft",
        usageGuidelines: ""
      });
    }
  }, [boilerplate, open]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const addRegion = () => {
    if (newRegion.trim() && !formData.regions.includes(newRegion.trim())) {
      setFormData(prev => ({
        ...prev,
        regions: [...prev.regions, newRegion.trim()]
      }));
      setNewRegion("");
    }
  };

  const removeRegion = (region: string) => {
    setFormData(prev => ({
      ...prev,
      regions: prev.regions.filter(r => r !== region)
    }));
  };

  const addAudience = () => {
    if (newAudience.trim() && !formData.audiences.includes(newAudience.trim())) {
      setFormData(prev => ({
        ...prev,
        audiences: [...prev.audiences, newAudience.trim()]
      }));
      setNewAudience("");
    }
  };

  const removeAudience = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      audiences: prev.audiences.filter(a => a !== audience)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {boilerplate ? "Edit Boilerplate Content" : "Create New Boilerplate"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Content Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Company Short Description"
              />
            </div>
            <div>
              <Label htmlFor="type">Content Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short Description</SelectItem>
                  <SelectItem value="long">Long Description</SelectItem>
                  <SelectItem value="mission">Mission Statement</SelectItem>
                  <SelectItem value="vision">Vision Statement</SelectItem>
                  <SelectItem value="value-prop">Value Proposition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter the boilerplate content..."
              rows={6}
            />
            <div className="text-xs text-muted-foreground mt-1">
              Character count: {formData.content.length}
            </div>
          </div>

          <div>
            <Label htmlFor="guidelines">Usage Guidelines</Label>
            <Textarea
              id="guidelines"
              value={formData.usageGuidelines}
              onChange={(e) => setFormData(prev => ({ ...prev, usageGuidelines: e.target.value }))}
              placeholder="Guidelines for when and how to use this content..."
              rows={3}
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
                      onClick={() => removeRegion(region)}
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
                <Button onClick={addRegion} variant="outline">Add</Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Target Audiences</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 min-h-[40px] p-2 border rounded-md">
                {formData.audiences.map((audience) => (
                  <Badge key={audience} variant="secondary" className="text-xs">
                    {audience}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 w-4 h-4"
                      onClick={() => removeAudience(audience)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={newAudience} onValueChange={setNewAudience}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonAudiences.map(audience => (
                      <SelectItem key={audience} value={audience}>
                        {audience}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addAudience} variant="outline">Add</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="v1.0"
              />
            </div>
            <div>
              <Label htmlFor="status">Approval Status</Label>
              <Select value={formData.approvalStatus} onValueChange={(value: any) => setFormData(prev => ({ ...prev, approvalStatus: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {boilerplate ? "Save Changes" : "Create Boilerplate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};