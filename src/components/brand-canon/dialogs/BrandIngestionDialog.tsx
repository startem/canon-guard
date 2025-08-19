import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  FileText, 
  Image, 
  Video, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram,
  Upload,
  Link,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface BrandIngestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIngest: (data: any) => void;
}

export const BrandIngestionDialog = ({ open, onOpenChange, onIngest }: BrandIngestionDialogProps) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  
  const [manualData, setManualData] = useState({
    companyName: "",
    industry: "",
    description: "",
    values: "",
    mission: "",
    vision: "",
    targetAudience: "",
    keyMessages: "",
    tone: "",
    colors: "",
    fonts: "",
    logos: "",
    guidelines: ""
  });

  const [urlData, setUrlData] = useState({
    websiteUrl: "",
    socialUrls: [] as string[],
    documentUrls: [] as string[],
    extractTypes: ["text", "images", "colors", "fonts"] as string[]
  });

  const [fileData, setFileData] = useState({
    files: [] as File[],
    extractTypes: ["text", "images", "colors", "fonts"] as string[]
  });

  const handleManualIngest = () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setResults([
            { type: "messaging-pillar", name: "Brand Values", status: "extracted" },
            { type: "boilerplate", name: "Company Description", status: "extracted" },
            { type: "color-token", name: "Primary Colors", status: "extracted" }
          ]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      onIngest({
        type: "manual",
        data: manualData,
        results: results
      });
    }, 2500);
  };

  const handleUrlIngest = () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate URL processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setResults([
            { type: "website-content", url: urlData.websiteUrl, status: "analyzed" },
            { type: "color-palette", count: 8, status: "extracted" },
            { type: "typography", count: 3, status: "extracted" },
            { type: "messaging", count: 12, status: "extracted" }
          ]);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    setTimeout(() => {
      onIngest({
        type: "url",
        data: urlData,
        results: results
      });
    }, 3000);
  };

  const handleFileIngest = () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate file processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setResults([
            { type: "brand-guidelines", files: fileData.files.length, status: "processed" },
            { type: "assets", count: 25, status: "extracted" },
            { type: "colors", count: 12, status: "extracted" }
          ]);
          return 100;
        }
        return prev + 8;
      });
    }, 180);

    setTimeout(() => {
      onIngest({
        type: "file",
        data: fileData,
        results: results
      });
    }, 2200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Brand Information Ingestion</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="website">Website & Social</TabsTrigger>
            <TabsTrigger value="files">Files & Documents</TabsTrigger>
            <TabsTrigger value="ai">AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={manualData.companyName}
                  onChange={(e) => setManualData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="TechCorp Inc."
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={manualData.industry}
                  onChange={(e) => setManualData(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="Technology, SaaS, etc."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={manualData.description}
                onChange={(e) => setManualData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your company..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  value={manualData.mission}
                  onChange={(e) => setManualData(prev => ({ ...prev, mission: e.target.value }))}
                  placeholder="Your company's mission..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="vision">Vision Statement</Label>
                <Textarea
                  id="vision"
                  value={manualData.vision}
                  onChange={(e) => setManualData(prev => ({ ...prev, vision: e.target.value }))}
                  placeholder="Your company's vision..."
                  rows={2}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="values">Core Values</Label>
              <Textarea
                id="values"
                value={manualData.values}
                onChange={(e) => setManualData(prev => ({ ...prev, values: e.target.value }))}
                placeholder="List your core values, separated by commas..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="keyMessages">Key Messages</Label>
              <Textarea
                id="keyMessages"
                value={manualData.keyMessages}
                onChange={(e) => setManualData(prev => ({ ...prev, keyMessages: e.target.value }))}
                placeholder="Your main brand messages..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tone">Brand Tone</Label>
                <Select value={manualData.tone} onValueChange={(value) => setManualData(prev => ({ ...prev, tone: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="innovative">Innovative</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="trustworthy">Trustworthy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={manualData.targetAudience}
                  onChange={(e) => setManualData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="Enterprise, SMB, B2C, etc."
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="website" className="space-y-6">
            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="websiteUrl"
                  value={urlData.websiteUrl}
                  onChange={(e) => setUrlData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  placeholder="https://your-website.com"
                />
                <Button variant="outline" size="icon">
                  <Globe className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Social Media Channels</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex gap-2">
                  <Twitter className="w-5 h-5 text-muted-foreground mt-2" />
                  <Input placeholder="Twitter/X URL" />
                </div>
                <div className="flex gap-2">
                  <Linkedin className="w-5 h-5 text-muted-foreground mt-2" />
                  <Input placeholder="LinkedIn URL" />
                </div>
                <div className="flex gap-2">
                  <Facebook className="w-5 h-5 text-muted-foreground mt-2" />
                  <Input placeholder="Facebook URL" />
                </div>
                <div className="flex gap-2">
                  <Instagram className="w-5 h-5 text-muted-foreground mt-2" />
                  <Input placeholder="Instagram URL" />
                </div>
              </div>
            </div>

            <div>
              <Label>Content to Extract</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["text", "images", "colors", "fonts", "layout", "messaging"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={type}
                      checked={urlData.extractTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUrlData(prev => ({
                            ...prev,
                            extractTypes: [...prev.extractTypes, type]
                          }));
                        } else {
                          setUrlData(prev => ({
                            ...prev,
                            extractTypes: prev.extractTypes.filter(t => t !== type)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={type} className="capitalize">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">What we'll analyze:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Brand colors and visual identity</li>
                <li>• Typography and font usage</li>
                <li>• Messaging and tone of voice</li>
                <li>• Logo and brand asset variations</li>
                <li>• Content themes and topics</li>
                <li>• Social media presence and engagement</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <div>
              <Label>Upload Brand Documents</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Drop files here or click to upload</p>
                  <p className="text-xs text-muted-foreground">
                    Support: PDF, DOC, PPT, PNG, JPG, AI, EPS, SVG
                  </p>
                </div>
                <Button variant="outline" className="mt-4">
                  Select Files
                </Button>
              </div>
            </div>

            <div>
              <Label>Supported Document Types</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Brand Guidelines</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <Image className="w-4 h-4" />
                  <span className="text-sm">Logo Files</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Style Guides</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <Video className="w-4 h-4" />
                  <span className="text-sm">Brand Videos</span>
                </div>
              </div>
            </div>

            <div>
              <Label>AI Processing Options</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Extract Colors", "Analyze Typography", "Parse Guidelines", "Identify Assets", "Extract Text", "Detect Patterns"].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <input type="checkbox" id={option} defaultChecked />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center text-white mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Brand Analysis</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Let our AI analyze your existing brand presence across all channels and automatically extract brand elements.
              </p>
              
              <div className="space-y-4">
                <Button className="w-full">
                  Start Comprehensive Analysis
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  <p>AI will analyze:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-left">
                    <div>• Website content & design</div>
                    <div>• Social media presence</div>
                    <div>• Marketing materials</div>
                    <div>• Competitor analysis</div>
                    <div>• Industry standards</div>
                    <div>• Brand consistency</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing brand information...</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <Label>Extraction Results</Label>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-success/10 rounded">
                  <span className="text-sm">{result.name || result.type}</span>
                  <Badge variant="default" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (activeTab === "manual") handleManualIngest();
              else if (activeTab === "website") handleUrlIngest();
              else if (activeTab === "files") handleFileIngest();
            }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Start Ingestion"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};