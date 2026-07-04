import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { StrategyProgress } from "@/components/StrategyProgress";
import { 
  MessageSquare, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  Target,
  Megaphone,
  Lightbulb,
  Save
} from "lucide-react";

interface MessagingPillar {
  id: string;
  title: string;
  description: string;
}

const PositioningMessaging = () => {
  const [positioningStatement, setPositioningStatement] = useState("");
  const [tagline, setTagline] = useState("");
  const [elevatorPitch, setElevatorPitch] = useState("");
  const [messagingPillars, setMessagingPillars] = useState<MessagingPillar[]>([
    { id: "1", title: "Innovation Leadership", description: "We lead the market with cutting-edge solutions" },
    { id: "2", title: "Customer-First", description: "Every decision prioritizes customer success" },
    { id: "3", title: "Trust & Reliability", description: "Dependable partner for critical business needs" }
  ]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const generatePositioning = () => {
    const suggestions = [
      "For innovative companies seeking reliable technology solutions, [Brand] is the trusted partner that delivers cutting-edge products with unmatched customer support, unlike competitors who focus solely on features without service excellence.",
      "We empower growing businesses to achieve their potential through intelligent technology that simplifies complex operations while maintaining the human touch that drives real relationships.",
      "In a world of generic solutions, [Brand] stands as the personalized technology partner that understands your unique challenges and crafts tailored innovations for sustainable growth."
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setPositioningStatement(randomSuggestion);
    
    toast({
      title: "Positioning Generated",
      description: "AI has generated a new positioning statement based on your brand analysis.",
    });
  };

  const generateTagline = () => {
    const suggestions = [
      "Innovation Made Personal",
      "Where Technology Meets Trust",
      "Empowering Growth, Enabling Success",
      "Your Vision, Our Innovation",
      "Building Tomorrow, Together"
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setTagline(randomSuggestion);
    
    toast({
      title: "Tagline Generated",
      description: "AI has suggested a new tagline for your brand.",
    });
  };

  const generateElevatorPitch = () => {
    const suggestion = "We solve the technology complexity challenge that growing companies face by providing personalized solutions with hands-on support. Unlike one-size-fits-all competitors, we become an extension of your team, delivering innovations that actually fit your unique business model and growth trajectory.";
    setElevatorPitch(suggestion);
    
    toast({
      title: "Elevator Pitch Generated",
      description: "AI has crafted an elevator pitch based on your positioning.",
    });
  };

  const addPillar = () => {
    const newPillar: MessagingPillar = {
      id: Date.now().toString(),
      title: "New Pillar",
      description: "Add your pillar description here"
    };
    setMessagingPillars([...messagingPillars, newPillar]);
  };

  const updatePillar = (id: string, field: 'title' | 'description', value: string) => {
    setMessagingPillars(pillars => 
      pillars.map(pillar => 
        pillar.id === id ? { ...pillar, [field]: value } : pillar
      )
    );
  };

  const deletePillar = (id: string) => {
    setMessagingPillars(pillars => pillars.filter(pillar => pillar.id !== id));
  };

  const saveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your positioning and messaging have been updated successfully.",
    });
    // Navigate to next step in workflow
    navigate("/personality-story");
  };

  return (
    <div>
      <StrategyProgress />
      <PageShell>
      <PageHeader
        icon={MessageSquare}
        eyebrow="Strategy"
        title="Positioning & Messaging"
        description="Define your brand's market position and core messaging pillars."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Positioning Statement */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Positioning Statement</CardTitle>
                  <CardDescription>
                    Define your unique market position and value proposition
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generatePositioning}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  placeholder="For [target customer] who [need/problem], [brand] is the [category] that [unique benefit]. Unlike [competition], we [key differentiator]."
                  value={positioningStatement}
                  onChange={(e) => setPositioningStatement(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Clear, specific positioning that differentiates your brand</span>
                  <span>{positioningStatement.length}/500</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tagline */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Tagline</CardTitle>
                  <CardDescription>
                    A memorable phrase that captures your brand essence
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateTagline}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Suggest
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <Input
                  placeholder="Enter your brand tagline..."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="text-lg font-medium"
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Keep it short, memorable, and emotionally resonant</span>
                  <span>{tagline.length}/60</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Elevator Pitch */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Elevator Pitch</CardTitle>
                  <CardDescription>
                    A concise explanation of what you do and why it matters
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateElevatorPitch}
                  className="gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Suggest
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  placeholder="In 30 seconds, explain what your company does, who you serve, and what makes you different..."
                  value={elevatorPitch}
                  onChange={(e) => setElevatorPitch(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Should be conversational and take ~30 seconds to say</span>
                  <span>{elevatorPitch.length}/300</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messaging Pillars */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Messaging Pillars</CardTitle>
                    <CardDescription>
                      Core themes that support your positioning
                    </CardDescription>
                  </div>
                </div>
                <Button onClick={addPillar} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Pillar
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {messagingPillars.map((pillar) => (
                  <div key={pillar.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Pillar title..."
                        value={pillar.title}
                        onChange={(e) => updatePillar(pillar.id, 'title', e.target.value)}
                        className="font-medium"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePillar(pillar.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Textarea
                      placeholder="Describe this messaging pillar and how it supports your positioning..."
                      value={pillar.description}
                      onChange={(e) => updatePillar(pillar.id, 'description', e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
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
                <CardTitle className="text-lg">Message Preview</CardTitle>
              </div>
              <CardDescription>
                See how your messaging appears in context
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {/* Website Hero Section Preview */}
                <div className="border rounded-lg p-4 bg-gradient-card">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Website Hero</h4>
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-foreground">
                      {tagline || "Your Tagline Here"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {elevatorPitch.slice(0, 120) || "Your elevator pitch will appear here..."}
                      {elevatorPitch.length > 120 && "..."}
                    </p>
                    <Button size="sm" className="mt-2">Get Started</Button>
                  </div>
                </div>

                {/* Email Signature Preview */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Email Signature</h4>
                  <div className="space-y-1 text-xs">
                    <p className="font-medium">John Smith</p>
                    <p className="text-muted-foreground">Brand Manager</p>
                    <p className="text-muted-foreground">Company Name</p>
                    <p className="text-primary font-medium">
                      {tagline || "Your tagline here"}
                    </p>
                  </div>
                </div>

                {/* Social Media Bio Preview */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Social Media Bio</h4>
                  <p className="text-xs text-muted-foreground">
                    {positioningStatement.slice(0, 100) || "Your positioning statement will appear here..."}
                    {positioningStatement.length > 100 && "..."} 
                    {tagline && ` • ${tagline}`}
                  </p>
                </div>

                {/* Key Messages Summary */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Key Messages</h4>
                  <div className="space-y-2">
                    {messagingPillars.slice(0, 3).map((pillar) => (
                      <div key={pillar.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-xs font-medium">{pillar.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <CardTitle className="text-lg">AI Suggestions</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Improve Your Positioning</h4>
                  <p className="text-xs text-muted-foreground">
                    Consider making your positioning more specific about your target market size and geography.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Strengthen Your Differentiation</h4>
                  <p className="text-xs text-muted-foreground">
                    Your messaging could benefit from more concrete proof points and specific customer outcomes.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tagline Variants</h4>
                  <div className="space-y-1">
                    {["Innovation Made Personal", "Trust Through Technology", "Your Growth Partner"].map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => setTagline(variant)}
                        className="block text-xs text-primary hover:text-primary/80 text-left"
                      >
                        "{variant}"
                      </button>
                    ))}
                  </div>
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
            Preview All Messages
          </Button>
          <Button onClick={saveChanges} className="gap-2">
            <Save className="h-4 w-4" />
            Save & Continue
          </Button>
        </div>
      </div>
      </PageShell>
    </div>
  );
};

export default PositioningMessaging;