import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { X, Plus, Palette, Type, FileText, Users, Globe, Building2 } from "lucide-react";

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

interface BrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: BrandNode | null;
  onSave: (brand: Omit<BrandNode, 'id' | 'children'>) => void;
  parentBrand?: BrandNode | null;
}

export const BrandDialog = ({ open, onOpenChange, brand, onSave, parentBrand }: BrandDialogProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<Omit<BrandNode, 'id' | 'children'>>({
    name: "",
    description: "",
    type: "brand",
    status: "draft",
    regions: [],
    nameVariants: [],
    disallowedNames: [],
    parentId: parentBrand?.id,
    logoUrl: "",
    brandColors: [],
    typography: [],
    tone: "",
    industry: "",
    website: "",
    socialChannels: {},
    brandGuidelines: "",
    elements: {
      messagingPillars: [],
      colorTokens: [],
      boilerplates: [],
      legalItems: [],
      targetAudiences: [],
      keyValues: []
    }
  });

  const [newItem, setNewItem] = useState("");
  const [newColor, setNewColor] = useState("#000000");

  useEffect(() => {
    if (brand && open) {
      setFormData({
        name: brand.name,
        description: brand.description,
        type: brand.type,
        status: brand.status,
        regions: brand.regions,
        nameVariants: brand.nameVariants || [],
        disallowedNames: brand.disallowedNames || [],
        parentId: brand.parentId,
        logoUrl: brand.logoUrl || "",
        brandColors: brand.brandColors || [],
        typography: brand.typography || [],
        tone: brand.tone || "",
        industry: brand.industry || "",
        website: brand.website || "",
        socialChannels: brand.socialChannels || {},
        brandGuidelines: brand.brandGuidelines || "",
        elements: brand.elements || {
          messagingPillars: [],
          colorTokens: [],
          boilerplates: [],
          legalItems: [],
          targetAudiences: [],
          keyValues: []
        }
      });
    } else if (!brand && open) {
      setFormData({
        name: "",
        description: "",
        type: parentBrand ? "sub-brand" : "brand",
        status: "draft",
        regions: parentBrand?.regions || [],
        nameVariants: [],
        disallowedNames: [],
        parentId: parentBrand?.id,
        logoUrl: "",
        brandColors: [],
        typography: [],
        tone: "",
        industry: "",
        website: "",
        socialChannels: {},
        brandGuidelines: "",
        elements: {
          messagingPillars: [],
          colorTokens: [],
          boilerplates: [],
          legalItems: [],
          targetAudiences: [],
          keyValues: []
        }
      });
    }
  }, [brand, open, parentBrand]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const addToArray = (field: keyof typeof formData, value: string) => {
    if (value.trim() && Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
      setNewItem("");
    }
  };

  const removeFromArray = (field: keyof typeof formData, index: number) => {
    if (Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index)
      }));
    }
  };

  const addColor = () => {
    if (newColor && !formData.brandColors?.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        brandColors: [...(prev.brandColors || []), newColor]
      }));
      setNewColor("#000000");
    }
  };

  const addElementToCategory = (category: keyof BrandElement, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        elements: {
          ...prev.elements!,
          [category]: [...prev.elements![category], value.trim()]
        }
      }));
      setNewItem("");
    }
  };

  const removeElementFromCategory = (category: keyof BrandElement, index: number) => {
    setFormData(prev => ({
      ...prev,
      elements: {
        ...prev.elements!,
        [category]: prev.elements![category].filter((_, i) => i !== index)
      }
    }));
  };

  const commonRegions = ["Global", "North America", "Europe", "APAC", "Latin America", "Middle East", "Africa"];
  const toneOptions = ["Professional", "Friendly", "Innovative", "Authoritative", "Playful", "Trustworthy"];
  const industryOptions = ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Education", "Government"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {brand ? "Edit Brand" : "Create New Brand"}
            {parentBrand && (
              <Badge variant="outline" className="ml-2">
                Under {parentBrand.name}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="branding">Brand Identity</TabsTrigger>
            <TabsTrigger value="elements">Brand Elements</TabsTrigger>
            <TabsTrigger value="naming">Naming Rules</TabsTrigger>
            <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <Label htmlFor="type">Brand Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand">Main Brand</SelectItem>
                    <SelectItem value="sub-brand">Sub-Brand</SelectItem>
                    <SelectItem value="product">Product Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the brand"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map(industry => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Regions</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1 min-h-[40px] p-2 border rounded-md">
                  {formData.regions.map((region, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {region}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 w-4 h-4"
                        onClick={() => removeFromArray('regions', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select value="" onValueChange={(value) => addToArray('regions', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add region" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonRegions.filter(region => !formData.regions.includes(region)).map(region => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tone">Brand Tone</Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map(tone => (
                    <SelectItem key={tone} value={tone.toLowerCase()}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Brand Colors</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                  {formData.brandColors?.map((color, index) => (
                    <div key={index} className="flex items-center gap-1 p-1 border rounded">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
                      <span className="text-xs">{color}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 w-4 h-4"
                        onClick={() => removeFromArray('brandColors', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-10 h-10 border rounded"
                  />
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                  <Button onClick={addColor} variant="outline">Add</Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Typography</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1 min-h-[40px] p-2 border rounded-md">
                  {formData.typography?.map((font, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {font}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 w-4 h-4"
                        onClick={() => removeFromArray('typography', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Font family name"
                    onKeyDown={(e) => e.key === 'Enter' && addToArray('typography', newItem)}
                  />
                  <Button onClick={() => addToArray('typography', newItem)} variant="outline">Add</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="elements" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {[
                { key: 'messagingPillars', label: 'Messaging Pillars', icon: FileText },
                { key: 'colorTokens', label: 'Color Tokens', icon: Palette },
                { key: 'boilerplates', label: 'Boilerplates', icon: FileText },
                { key: 'legalItems', label: 'Legal Items', icon: FileText },
                { key: 'targetAudiences', label: 'Target Audiences', icon: Users },
                { key: 'keyValues', label: 'Key Values', icon: Globe }
              ].map(({ key, label, icon: Icon }) => (
                <Card key={key} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4" />
                    <Label>{label}</Label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1 min-h-[60px] p-2 border rounded-md">
                      {formData.elements?.[key as keyof BrandElement]?.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0 w-4 h-4"
                            onClick={() => removeElementFromCategory(key as keyof BrandElement, index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder={`Add ${label.toLowerCase()}`}
                        onKeyDown={(e) => e.key === 'Enter' && addElementToCategory(key as keyof BrandElement, newItem)}
                      />
                      <Button onClick={() => addElementToCategory(key as keyof BrandElement, newItem)} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="naming" className="space-y-6">
            <div>
              <Label>Approved Name Variants</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1 min-h-[40px] p-2 border rounded-md">
                  {formData.nameVariants?.map((variant, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {variant}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 w-4 h-4"
                        onClick={() => removeFromArray('nameVariants', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add approved name variant"
                    onKeyDown={(e) => e.key === 'Enter' && addToArray('nameVariants', newItem)}
                  />
                  <Button onClick={() => addToArray('nameVariants', newItem)} variant="outline">Add</Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Disallowed Names</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1 min-h-[40px] p-2 border rounded-md">
                  {formData.disallowedNames?.map((name, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0 w-4 h-4"
                        onClick={() => removeFromArray('disallowedNames', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add disallowed name"
                    onKeyDown={(e) => e.key === 'Enter' && addToArray('disallowedNames', newItem)}
                  />
                  <Button onClick={() => addToArray('disallowedNames', newItem)} variant="outline">Add</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guidelines" className="space-y-6">
            <div>
              <Label htmlFor="brandGuidelines">Brand Guidelines</Label>
              <Textarea
                id="brandGuidelines"
                value={formData.brandGuidelines}
                onChange={(e) => setFormData(prev => ({ ...prev, brandGuidelines: e.target.value }))}
                placeholder="Enter comprehensive brand guidelines..."
                rows={10}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Social Media Channels</Label>
                <div className="space-y-2">
                  {['twitter', 'linkedin', 'facebook', 'instagram'].map(platform => (
                    <div key={platform} className="flex gap-2">
                      <Label className="w-20 capitalize text-sm">{platform}:</Label>
                      <Input
                        value={formData.socialChannels?.[platform] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          socialChannels: {
                            ...prev.socialChannels,
                            [platform]: e.target.value
                          }
                        }))}
                        placeholder={`@${platform}handle`}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {brand ? "Update Brand" : "Create Brand"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};