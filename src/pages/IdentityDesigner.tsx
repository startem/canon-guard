import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette, 
  Type, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Save,
  Download,
  Copy,
  Check
} from "lucide-react";

interface ColorToken {
  id: string;
  name: string;
  value: string;
  category: 'Primary' | 'Secondary' | 'Accent' | 'Neutral' | 'Status';
  usage: string;
}

interface TypographyScale {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  usage: string;
}

interface LogoVariant {
  id: string;
  name: string;
  file: string | null;
  type: 'Full Logo' | 'Icon Only' | 'Monochrome' | 'Horizontal' | 'Stacked';
}

const IdentityDesigner = () => {
  const [colorTokens, setColorTokens] = useState<ColorToken[]>([
    { id: '1', name: 'Primary Blue', value: '#2563eb', category: 'Primary', usage: 'Main brand color, primary CTA buttons' },
    { id: '2', name: 'Primary Light', value: '#3b82f6', category: 'Primary', usage: 'Hover states, secondary elements' },
    { id: '3', name: 'Secondary Purple', value: '#7c3aed', category: 'Secondary', usage: 'Accent elements, highlights' },
    { id: '4', name: 'Success Green', value: '#10b981', category: 'Status', usage: 'Success messages, positive indicators' },
    { id: '5', name: 'Warning Orange', value: '#f59e0b', category: 'Status', usage: 'Warning messages, caution indicators' },
    { id: '6', name: 'Error Red', value: '#ef4444', category: 'Status', usage: 'Error messages, destructive actions' },
    { id: '7', name: 'Neutral 900', value: '#1a1a1a', category: 'Neutral', usage: 'Primary text, headings' },
    { id: '8', name: 'Neutral 600', value: '#525252', category: 'Neutral', usage: 'Secondary text, body copy' },
    { id: '9', name: 'Neutral 200', value: '#e5e5e5', category: 'Neutral', usage: 'Borders, dividers' },
    { id: '10', name: 'Neutral 50', value: '#fafafa', category: 'Neutral', usage: 'Background, cards' }
  ]);

  const [typographyScale, setTypographyScale] = useState<TypographyScale[]>([
    { id: '1', name: 'Heading 1', fontFamily: 'Inter', fontSize: '36px', fontWeight: '700', lineHeight: '1.2', usage: 'Page titles, hero headings' },
    { id: '2', name: 'Heading 2', fontFamily: 'Inter', fontSize: '30px', fontWeight: '600', lineHeight: '1.3', usage: 'Section headings' },
    { id: '3', name: 'Heading 3', fontFamily: 'Inter', fontSize: '24px', fontWeight: '600', lineHeight: '1.4', usage: 'Subsection headings' },
    { id: '4', name: 'Body Large', fontFamily: 'Inter', fontSize: '18px', fontWeight: '400', lineHeight: '1.6', usage: 'Large body text, introductions' },
    { id: '5', name: 'Body Regular', fontFamily: 'Inter', fontSize: '16px', fontWeight: '400', lineHeight: '1.5', usage: 'Standard body text' },
    { id: '6', name: 'Body Small', fontFamily: 'Inter', fontSize: '14px', fontWeight: '400', lineHeight: '1.4', usage: 'Captions, labels' },
    { id: '7', name: 'Button Text', fontFamily: 'Inter', fontSize: '16px', fontWeight: '500', lineHeight: '1', usage: 'Button labels, CTAs' }
  ]);

  const [logoVariants, setLogoVariants] = useState<LogoVariant[]>([
    { id: '1', name: 'Primary Logo', file: null, type: 'Full Logo' },
    { id: '2', name: 'Icon Mark', file: null, type: 'Icon Only' },
    { id: '3', name: 'Monochrome', file: null, type: 'Monochrome' }
  ]);

  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  const { toast } = useToast();

  const addColorToken = () => {
    const newToken: ColorToken = {
      id: Date.now().toString(),
      name: 'New Color',
      value: '#000000',
      category: 'Primary',
      usage: 'Describe usage here'
    };
    setColorTokens([...colorTokens, newToken]);
  };

  const updateColorToken = (id: string, field: keyof ColorToken, value: string) => {
    setColorTokens(tokens =>
      tokens.map(token =>
        token.id === id ? { ...token, [field]: value } : token
      )
    );
  };

  const deleteColorToken = (id: string) => {
    setColorTokens(tokens => tokens.filter(token => token.id !== id));
  };

  const copyColorValue = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
    
    toast({
      title: "Color Copied",
      description: `${color} copied to clipboard`,
    });
  };

  const getCategoryColor = (category: ColorToken['category']) => {
    switch (category) {
      case 'Primary': return 'bg-primary text-primary-foreground';
      case 'Secondary': return 'bg-secondary text-secondary-foreground';
      case 'Accent': return 'bg-accent text-accent-foreground';
      case 'Status': return 'bg-success text-success-foreground';
      case 'Neutral': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const addLogoVariant = () => {
    const newVariant: LogoVariant = {
      id: Date.now().toString(),
      name: 'New Logo Variant',
      file: null,
      type: 'Full Logo'
    };
    setLogoVariants([...logoVariants, newVariant]);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Identity Designer
        </h1>
        <p className="text-muted-foreground text-lg">
          Create and manage your brand's visual identity system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Colors Section */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Color Palette</CardTitle>
                    <CardDescription>
                      Define your brand's color system and usage guidelines
                    </CardDescription>
                  </div>
                </div>
                <Button onClick={addColorToken} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Color
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colorTokens.map((token) => (
                  <div key={token.id} className="border rounded-lg overflow-hidden">
                    {/* Color Swatch */}
                    <div 
                      className="h-20 w-full relative cursor-pointer group"
                      style={{ backgroundColor: token.value }}
                      onClick={() => copyColorValue(token.value)}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        {copiedColor === token.value ? (
                          <Check className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <Copy className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                    
                    {/* Color Details */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Input
                          value={token.name}
                          onChange={(e) => updateColorToken(token.id, 'name', e.target.value)}
                          className="text-sm font-medium border-none p-0 h-auto"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => deleteColorToken(token.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Input
                          value={token.value}
                          onChange={(e) => updateColorToken(token.id, 'value', e.target.value)}
                          className="text-xs font-mono h-7"
                        />
                        <Badge className={`text-xs ${getCategoryColor(token.category)}`}>
                          {token.category}
                        </Badge>
                      </div>
                      
                      <Textarea
                        value={token.usage}
                        onChange={(e) => updateColorToken(token.id, 'usage', e.target.value)}
                        placeholder="Usage guidelines..."
                        className="text-xs min-h-[60px] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Typography Section */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Type className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Typography System</CardTitle>
                  <CardDescription>
                    Define your font hierarchy and text styles
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {typographyScale.map((style) => (
                  <div key={style.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Typography Sample */}
                      <div className="space-y-2">
                        <div 
                          style={{
                            fontFamily: style.fontFamily,
                            fontSize: style.fontSize,
                            fontWeight: style.fontWeight,
                            lineHeight: style.lineHeight
                          }}
                        >
                          The quick brown fox
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {style.usage}
                        </p>
                      </div>
                      
                      {/* Typography Controls */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <label className="text-xs text-muted-foreground">Font Family</label>
                          <Input 
                            value={style.fontFamily}
                            className="h-7 text-xs"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Size</label>
                          <Input 
                            value={style.fontSize}
                            className="h-7 text-xs"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Weight</label>
                          <Input 
                            value={style.fontWeight}
                            className="h-7 text-xs"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Line Height</label>
                          <Input 
                            value={style.lineHeight}
                            className="h-7 text-xs"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center pt-4">
                  <Button variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Typography Scale
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logos Section */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Logo Variants</CardTitle>
                    <CardDescription>
                      Upload and manage different versions of your logo
                    </CardDescription>
                  </div>
                </div>
                <Button onClick={addLogoVariant} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Variant
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {logoVariants.map((variant) => (
                  <div key={variant.id} className="border rounded-lg p-4 space-y-3">
                    {/* Upload Area */}
                    <div className="aspect-video bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                      {variant.file ? (
                        <div className="text-center">
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground">Logo uploaded</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground">Click to upload</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Variant Details */}
                    <div className="space-y-2">
                      <Input
                        value={variant.name}
                        className="font-medium text-sm"
                        placeholder="Logo variant name"
                      />
                      <Badge variant="outline" className="text-xs">
                        {variant.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Imagery Section */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-success" />
                </div>
                <div>
                  <CardTitle className="text-xl">Brand Imagery</CardTitle>
                  <CardDescription>
                    Guidelines and assets for brand photography and graphics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Photography Style', 'Iconography', 'Illustrations', 'Graphics'].map((category) => (
                  <div key={category} className="border rounded-lg p-4 text-center">
                    <div className="aspect-square bg-muted/50 rounded-lg mb-3 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="text-sm font-medium">{category}</h4>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card className="shadow-card sticky top-4">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Live Preview</CardTitle>
              </div>
              <CardDescription>
                See your identity system in action
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Color Palette Preview */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Color Palette</h4>
                  <div className="flex gap-1">
                    {colorTokens.slice(0, 6).map((token) => (
                      <div
                        key={token.id}
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: token.value }}
                        title={token.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Typography Preview */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Typography</h4>
                  <div className="space-y-1">
                    <h1 className="text-lg font-bold">Heading Example</h1>
                    <p className="text-sm">Body text example showing the typography system in use.</p>
                    <Button size="sm">Button Text</Button>
                  </div>
                </div>

                {/* Brand Card Preview */}
                <div className="border rounded-lg p-3 bg-gradient-card">
                  <div className="w-8 h-8 bg-primary rounded mb-2"></div>
                  <h3 className="font-semibold text-sm">Brand Name</h3>
                  <p className="text-xs text-muted-foreground">Your tagline here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Export Options</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Design System Guide
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Color Tokens (CSS)
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Logo Package
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Accessibility</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Color Contrast</span>
                  <Badge className="bg-success text-success-foreground">AA</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Font Readability</span>
                  <Badge className="bg-success text-success-foreground">Good</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Logo Clarity</span>
                  <Badge className="bg-warning text-warning-foreground">Review</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Actions */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          All changes saved automatically
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            Preview Identity System
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save & Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IdentityDesigner;