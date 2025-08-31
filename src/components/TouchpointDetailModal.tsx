import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  Edit, 
  Upload, 
  FileText, 
  Image, 
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TouchpointAsset {
  id: string;
  name: string;
  type: "image" | "document" | "video";
  url: string;
  uploadedAt: string;
}

interface TouchpointDetailProps {
  touchpoint: {
    id: string;
    name: string;
    icon: any;
    idealExperience: string;
    brandLanguage: string;
    operationalRequirements: string;
    status: "compliant" | "needs-attention" | "non-compliant";
    assets?: TouchpointAsset[];
    lastUpdated?: string;
    assignedTo?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const TouchpointDetailModal = ({ touchpoint, isOpen, onClose, onSave }: TouchpointDetailProps) => {
  const [formData, setFormData] = useState(touchpoint);
  const [assets, setAssets] = useState<TouchpointAsset[]>(touchpoint.assets || []);
  const { toast } = useToast();

  const statusConfig = {
    'compliant': {
      color: 'default',
      text: 'Compliant',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    'needs-attention': {
      color: 'secondary',
      text: 'Needs Attention', 
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    'non-compliant': {
      color: 'destructive',
      text: 'Non-Compliant',
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200'
    }
  };

  const handleSave = () => {
    onSave({ ...formData, assets });
    toast({
      title: "Touchpoint Updated",
      description: `${formData.name} has been updated successfully.`,
    });
    onClose();
  };

  const handleAssetUpload = () => {
    // Simulate asset upload
    const newAsset: TouchpointAsset = {
      id: Date.now().toString(),
      name: "example-asset.jpg",
      type: "image",
      url: "/placeholder-image.jpg",
      uploadedAt: new Date().toISOString()
    };
    setAssets([...assets, newAsset]);
    
    toast({
      title: "Asset Uploaded",
      description: "Asset has been added to this touchpoint.",
    });
  };

  const removeAsset = (assetId: string) => {
    setAssets(assets.filter(asset => asset.id !== assetId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'needs-attention': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'non-compliant': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <touchpoint.icon className="w-6 h-6 text-primary" />
            {formData.name} Details
          </DialogTitle>
          <DialogDescription>
            Manage this touchpoint's experience, brand language, and operational requirements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className={`p-4 rounded-lg ${statusConfig[formData.status].bgColor} ${statusConfig[formData.status].borderColor} border`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(formData.status)}
                <span className="font-medium">Current Status</span>
              </div>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="needs-attention">Needs Attention</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Touchpoint Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({...formData, assignedTo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-smith">John Smith (Brand Manager)</SelectItem>
                  <SelectItem value="sarah-jones">Sarah Jones (Marketing Lead)</SelectItem>
                  <SelectItem value="mike-wilson">Mike Wilson (Design Director)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Experience Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idealExperience">Ideal Experience</Label>
              <Textarea
                id="idealExperience"
                placeholder="Describe the ideal brand experience for this touchpoint..."
                value={formData.idealExperience}
                onChange={(e) => setFormData({...formData, idealExperience: e.target.value})}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Define what the perfect customer experience should look and feel like at this touchpoint.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandLanguage">Brand Language & Messaging</Label>
              <Textarea
                id="brandLanguage"
                placeholder="Define the tone, voice, and key messages for this touchpoint..."
                value={formData.brandLanguage}
                onChange={(e) => setFormData({...formData, brandLanguage: e.target.value})}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Specify the tone of voice, key messages, and language guidelines specific to this touchpoint.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operationalRequirements">Operational Requirements</Label>
              <Textarea
                id="operationalRequirements"
                placeholder="List the operational requirements, processes, and standards..."
                value={formData.operationalRequirements}
                onChange={(e) => setFormData({...formData, operationalRequirements: e.target.value})}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Document the operational processes, standards, and requirements needed to maintain brand consistency.
              </p>
            </div>
          </div>

          <Separator />

          {/* Assets Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Example Assets</h4>
                <p className="text-sm text-muted-foreground">Upload screenshots, documents, or examples for this touchpoint</p>
              </div>
              <Button onClick={handleAssetUpload} size="sm" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Asset
              </Button>
            </div>

            {assets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getAssetIcon(asset.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(asset.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeAsset(asset.id)}>
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No assets uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};