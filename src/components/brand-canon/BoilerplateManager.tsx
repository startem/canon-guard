import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Copy,
  Globe,
  Users
} from "lucide-react";

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

const mockBoilerplates: BoilerplateItem[] = [
  {
    id: "1",
    name: "Company Short Description",
    type: "short",
    content: "TechCorp is the leading provider of AI-powered business solutions that help enterprises transform their operations through intelligent automation and data-driven insights.",
    version: "v2.1",
    regions: ["Global"],
    audiences: ["B2B", "Enterprise"],
    lastUpdated: "2024-08-15",
    approvalStatus: "approved",
    characterCount: 168,
    usageGuidelines: "Use for website headers, social media bios, and elevator pitches. Maximum 200 characters."
  },
  {
    id: "2",
    name: "Company Long Description",
    type: "long",
    content: "TechCorp revolutionizes how businesses operate through cutting-edge artificial intelligence and machine learning solutions. Founded in 2018, we've helped over 500 enterprise clients streamline their operations, reduce costs by an average of 35%, and accelerate their digital transformation journey. Our comprehensive suite of AI-powered tools includes predictive analytics, intelligent automation, and real-time business intelligence platforms that scale with your organization's growth.",
    version: "v2.0",
    regions: ["Global"],
    audiences: ["B2B", "Enterprise", "Investors"],
    lastUpdated: "2024-08-10",
    approvalStatus: "approved",
    characterCount: 584,
    usageGuidelines: "Use for About Us pages, press releases, and detailed company overviews. Ideal for contexts requiring comprehensive company background."
  },
  {
    id: "3",
    name: "Mission Statement",
    type: "mission",
    content: "To empower businesses worldwide with intelligent technology solutions that drive sustainable growth and operational excellence.",
    version: "v1.5",
    regions: ["Global"],
    audiences: ["All"],
    lastUpdated: "2024-07-20",
    approvalStatus: "approved",
    characterCount: 134,
    usageGuidelines: "Use in company materials, presentations, and corporate communications. Should appear consistently across all branded content."
  },
  {
    id: "4",
    name: "Primary Value Proposition",
    type: "value-prop",
    content: "Transform your business operations with AI solutions that deliver measurable results in 90 days or less.",
    version: "v1.8",
    regions: ["North America", "Europe"],
    audiences: ["B2B", "Decision Makers"],
    lastUpdated: "2024-08-12",
    approvalStatus: "pending",
    characterCount: 115,
    usageGuidelines: "Use in sales materials, landing pages, and marketing campaigns. Focus on speed and measurable outcomes."
  }
];

export const BoilerplateManager = () => {
  const [selectedBoilerplate, setSelectedBoilerplate] = useState<BoilerplateItem | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);

  const types = ['all', 'short', 'long', 'mission', 'vision', 'value-prop'];

  const filteredBoilerplates = selectedType === 'all' 
    ? mockBoilerplates 
    : mockBoilerplates.filter(item => item.type === selectedType);

  const getTypeBadge = (type: string) => {
    const variants = {
      short: "default",
      long: "secondary",
      mission: "outline",
      vision: "outline",
      'value-prop': "destructive"
    } as const;
    
    return <Badge variant={variants[type as keyof typeof variants]}>{type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      pending: "secondary",
      draft: "secondary"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Boilerplate List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Boilerplate Content</h2>
            <p className="text-sm text-muted-foreground">
              Standardized copy for consistent messaging
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Boilerplate
          </Button>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
              className="capitalize"
            >
              {type === 'value-prop' ? 'Value Prop' : type}
            </Button>
          ))}
        </div>
        
        <div className="space-y-4">
          {filteredBoilerplates.map((item) => (
            <Card 
              key={item.id} 
              className={`p-6 cursor-pointer transition-brand hover:shadow-card ${
                selectedBoilerplate?.id === item.id ? 'bg-primary/5 border-primary/20' : ''
              }`}
              onClick={() => setSelectedBoilerplate(item)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      {getTypeBadge(item.type)}
                      {getStatusBadge(item.approvalStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.content}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(item.content); }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{item.characterCount} characters</span>
                    <span>v{item.version}</span>
                    <span>Updated {item.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    <span>{item.regions.join(", ")}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Content Details</h2>
        
        {selectedBoilerplate ? (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{selectedBoilerplate.name}</h3>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Content</Label>
                <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">{selectedBoilerplate.content}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span>{selectedBoilerplate.characterCount} characters</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(selectedBoilerplate.content)}
                    className="h-6 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <Label>Type & Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  {getTypeBadge(selectedBoilerplate.type)}
                  {getStatusBadge(selectedBoilerplate.approvalStatus)}
                </div>
              </div>

              <div>
                <Label>Version</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedBoilerplate.version} • Last updated {selectedBoilerplate.lastUpdated}
                </p>
              </div>

              <div>
                <Label>Regions</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedBoilerplate.regions.map(region => (
                    <Badge key={region} variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Target Audiences</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedBoilerplate.audiences.map(audience => (
                    <Badge key={audience} variant="secondary" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Usage Guidelines</Label>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {selectedBoilerplate.usageGuidelines}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" size="sm" className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button variant="hero" size="sm" className="flex-1">
                Save Changes
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              Select boilerplate content to view details
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};