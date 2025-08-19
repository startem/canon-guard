import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorTokenDialog } from "./dialogs/ColorTokenDialog";
import { BrandSelector } from "./BrandSelector";
import { useBrandContext } from "@/hooks/useBrandContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Palette,
  Eye,
  Copy,
  Download
} from "lucide-react";

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

const mockColorTokens: ColorToken[] = [
  {
    id: "1",
    name: "Primary Blue",
    description: "Main brand color for logos, CTAs, and primary elements",
    hex: "#1E40AF",
    rgb: "rgb(30, 64, 175)",
    cmyk: "C:83 M:63 Y:0 K:31",
    usage: ["Logo primary", "CTA buttons", "Primary headings", "Active states"],
    category: "primary",
    accessibility: {
      wcagAA: true,
      wcagAAA: false,
      contrastRatio: 4.8
    }
  },
  {
    id: "2",
    name: "Secondary Purple",
    description: "Secondary brand color for accents and highlights",
    hex: "#7C3AED",
    rgb: "rgb(124, 58, 237)",
    cmyk: "C:48 M:76 Y:0 K:7",
    usage: ["Secondary elements", "Gradients", "Accent highlights"],
    category: "secondary",
    accessibility: {
      wcagAA: true,
      wcagAAA: false,
      contrastRatio: 4.2
    }
  },
  {
    id: "3",
    name: "Success Green",
    description: "Success states and positive messaging",
    hex: "#059669",
    rgb: "rgb(5, 150, 105)",
    cmyk: "C:97 M:0 Y:30 K:41",
    usage: ["Success messages", "Positive metrics", "Confirmation states"],
    category: "status",
    accessibility: {
      wcagAA: true,
      wcagAAA: true,
      contrastRatio: 7.2
    }
  },
  {
    id: "4",
    name: "Warning Orange",
    description: "Warning states and attention-grabbing elements",
    hex: "#D97706",
    rgb: "rgb(217, 119, 6)",
    cmyk: "C:0 M:45 Y:97 K:15",
    usage: ["Warning messages", "Important alerts", "Caution states"],
    category: "status",
    accessibility: {
      wcagAA: true,
      wcagAAA: false,
      contrastRatio: 5.1
    }
  },
  {
    id: "5",
    name: "Neutral Gray",
    description: "Body text and subtle interface elements",
    hex: "#6B7280",
    rgb: "rgb(107, 114, 128)",
    cmyk: "C:16 M:11 Y:0 K:50",
    usage: ["Body text", "Secondary text", "Interface elements"],
    category: "neutral",
    accessibility: {
      wcagAA: true,
      wcagAAA: false,
      contrastRatio: 4.5
    }
  }
];

export const ColorTokens = () => {
  const { colorTokens, selectedBrandId, addColorToken, updateColorToken, deleteColorToken, getItemsByBrand } = useBrandContext();
  const [selectedToken, setSelectedToken] = useState<ColorToken | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingToken, setEditingToken] = useState<ColorToken | undefined>(undefined);
  const { toast } = useToast();

  // Define categories constant
  const categories = ['all', 'primary', 'secondary', 'accent', 'neutral', 'status'];

  // Filter tokens by selected brand and category
  const brandFilteredTokens = getItemsByBrand(colorTokens, selectedBrandId || undefined);
  const filteredTokens = selectedCategory === 'all' 
    ? brandFilteredTokens 
    : brandFilteredTokens.filter(token => token.category === selectedCategory);

  const getCategoryBadge = (category: string) => {
    const variants = {
      primary: "default",
      secondary: "secondary",
      accent: "outline",
      neutral: "secondary",
      status: "destructive"
    } as const;
    
    return <Badge variant={variants[category as keyof typeof variants]}>{category}</Badge>;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${text} has been copied to your clipboard.`,
    });
  };

  const handleCreateToken = () => {
    setEditingToken(undefined);
    setDialogOpen(true);
  };

  const handleEditToken = (token: ColorToken) => {
    setEditingToken(token);
    setDialogOpen(true);
  };

  const handleDeleteToken = (tokenId: string) => {
    deleteColorToken(tokenId);
    if (selectedToken?.id === tokenId) {
      setSelectedToken(null);
    }
    toast({
      title: "Color token deleted",
      description: "The color token has been removed from the palette.",
    });
  };

  const handleSaveToken = (token: ColorToken) => {
    if (editingToken) {
      updateColorToken(token);
      toast({
        title: "Color token updated",
        description: "The color token has been successfully updated.",
      });
    } else {
      addColorToken(token);
      toast({
        title: "Color token created",
        description: "A new color token has been added to the palette.",
      });
    }
  };

  const exportPalette = () => {
    const paletteData = {
      name: "Brand Color Palette",
      version: "1.0.0",
      exported: new Date().toISOString(),
      brandId: selectedBrandId,
      colors: brandFilteredTokens.map(token => ({
        name: token.name,
        hex: token.hex,
        rgb: token.rgb,
        cmyk: token.cmyk,
        category: token.category,
        usage: token.usage,
        accessibility: token.accessibility
      }))
    };

    const dataStr = JSON.stringify(paletteData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `brand-palette-${selectedBrandId || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Palette exported",
      description: "Your color palette has been exported as JSON.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Brand Selector */}
      <BrandSelector />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Color Tokens</h2>
          <p className="text-sm text-muted-foreground">
            Brand color palette with accessibility guidelines
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportPalette}>
            <Download className="w-4 h-4 mr-2" />
            Export Palette
          </Button>
          <Button variant="outline" size="sm" onClick={handleCreateToken}>
            <Plus className="w-4 h-4 mr-2" />
            Add Color
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Color Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTokens.map((token) => (
          <Card 
            key={token.id} 
            className="p-6 cursor-pointer transition-brand hover:shadow-card"
            onClick={() => setSelectedToken(token)}
          >
            <div className="space-y-4">
              {/* Color Swatch */}
              <div className="space-y-3">
                <div 
                  className="w-full h-24 rounded-lg border shadow-inner"
                  style={{ backgroundColor: token.hex }}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{token.name}</h3>
                    <p className="text-sm text-muted-foreground">{token.hex}</p>
                  </div>
                  {getCategoryBadge(token.category)}
                </div>
              </div>

              {/* Color Values */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">HEX</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">{token.hex}</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(token.hex); }}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">RGB</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-xs">{token.rgb}</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(token.rgb); }}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="space-y-2">
                <Label className="text-xs">Accessibility</Label>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={token.accessibility.wcagAA ? "default" : "destructive"}
                    className="text-xs"
                  >
                    WCAG AA {token.accessibility.wcagAA ? "✓" : "✗"}
                  </Badge>
                  <Badge 
                    variant={token.accessibility.wcagAAA ? "default" : "secondary"}
                    className="text-xs"
                  >
                    WCAG AAA {token.accessibility.wcagAAA ? "✓" : "✗"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Contrast ratio: {token.accessibility.contrastRatio}:1
                </p>
              </div>

              {/* Usage */}
              <div className="space-y-2">
                <Label className="text-xs">Usage</Label>
                <div className="flex flex-wrap gap-1">
                  {token.usage.slice(0, 2).map((use, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {use}
                    </Badge>
                  ))}
                  {token.usage.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{token.usage.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Modal/Panel would go here when selectedToken is set */}
      {selectedToken && (
        <Card className="mt-6 p-6 bg-gradient-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedToken.name}</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditToken(selectedToken)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Token
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteToken(selectedToken.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          
          <p className="text-muted-foreground mb-4">{selectedToken.description}</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Complete Usage Guidelines</Label>
              <div className="space-y-1 mt-2">
                {selectedToken.usage.map((use, index) => (
                  <div key={index} className="text-sm bg-background/50 px-3 py-2 rounded">
                    • {use}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Color Values</Label>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-sm">HEX:</span>
                  <code className="text-sm">{selectedToken.hex}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">RGB:</span>
                  <code className="text-sm">{selectedToken.rgb}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">CMYK:</span>
                  <code className="text-sm">{selectedToken.cmyk}</code>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <ColorTokenDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        colorToken={editingToken}
        onSave={handleSaveToken}
      />
    </div>
  );
};