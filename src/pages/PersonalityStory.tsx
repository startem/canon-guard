import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Sparkles, 
  BookOpen, 
  Heart,
  Zap,
  Star,
  Shield,
  Users,
  Globe,
  Target,
  Save
} from "lucide-react";

interface PersonalityTrait {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: boolean;
}

interface VoiceTone {
  value: string;
  label: string;
  description: string;
  example: string;
}

const voiceToneOptions: VoiceTone[] = [
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm, approachable, and conversational",
    example: "We're excited to help you succeed! Let's work together to find the perfect solution."
  },
  {
    value: "professional",
    label: "Professional",
    description: "Polished, authoritative, and business-focused",
    example: "Our enterprise solutions deliver measurable results for organizations seeking operational excellence."
  },
  {
    value: "innovative",
    label: "Innovative",
    description: "Forward-thinking, creative, and tech-savvy",
    example: "We're pushing boundaries and reimagining what's possible in your industry."
  },
  {
    value: "trustworthy",
    label: "Trustworthy",
    description: "Reliable, transparent, and dependable",
    example: "You can count on us to deliver on our promises, every time."
  },
  {
    value: "whimsical",
    label: "Whimsical",
    description: "Playful, creative, and lighthearted",
    example: "Ready to sprinkle some magic on your business? Let's make amazing things happen!"
  }
];

const personalityTraitOptions: PersonalityTrait[] = [
  { id: "innovative", label: "Innovative", icon: Zap, selected: false },
  { id: "friendly", label: "Friendly", icon: Heart, selected: false },
  { id: "professional", label: "Professional", icon: Star, selected: false },
  { id: "trustworthy", label: "Trustworthy", icon: Shield, selected: false },
  { id: "collaborative", label: "Collaborative", icon: Users, selected: false },
  { id: "global", label: "Global", icon: Globe, selected: false },
  { id: "results-driven", label: "Results-Driven", icon: Target, selected: false },
  { id: "authentic", label: "Authentic", icon: User, selected: false }
];

const PersonalityStory = () => {
  const [personalityTraits, setPersonalityTraits] = useState<PersonalityTrait[]>(
    personalityTraitOptions.map(trait => 
      ["innovative", "trustworthy", "professional"].includes(trait.id) 
        ? { ...trait, selected: true }
        : trait
    )
  );
  
  const [selectedVoiceTone, setSelectedVoiceTone] = useState<string>("professional");
  const [brandStory, setBrandStory] = useState("");
  
  const { toast } = useToast();

  const togglePersonalityTrait = (traitId: string) => {
    setPersonalityTraits(traits =>
      traits.map(trait =>
        trait.id === traitId ? { ...trait, selected: !trait.selected } : trait
      )
    );
  };

  const getSelectedTone = (): VoiceTone | undefined => {
    return voiceToneOptions.find(tone => tone.value === selectedVoiceTone);
  };

  const generateBrandStory = () => {
    const selectedTraits = personalityTraits.filter(trait => trait.selected);
    const tone = getSelectedTone();
    
    const storyTemplates = [
      `Our journey began with a simple belief: that ${selectedTraits[0]?.label.toLowerCase() || "great"} solutions should be accessible to everyone. Founded by a team of industry veterans who saw the gap between complex technology and real business needs, we set out to bridge that divide.

What started as a small team with big dreams has grown into a ${tone?.label.toLowerCase() || "focused"} organization that serves clients across multiple industries. Our ${selectedTraits.map(t => t.label.toLowerCase()).join(", ")} approach has helped hundreds of companies transform their operations and achieve sustainable growth.

Today, we continue to innovate while staying true to our core values. Every decision we make is guided by our commitment to delivering exceptional value and building lasting partnerships with our clients.`,
      
      `The story of our company is really the story of the challenges our founders faced in their previous roles. They witnessed firsthand how outdated systems and processes held back talented teams and promising businesses.

Determined to create something better, they assembled a diverse group of experts who shared a common vision: to build solutions that are both powerful and ${tone?.label.toLowerCase() || "accessible"}. Our ${selectedTraits.map(t => t.label.toLowerCase()).join(" and ")} culture became the foundation for everything we do.

From our first client to our latest product launch, we've remained focused on one thing: helping businesses unlock their true potential through thoughtful innovation and genuine partnership.`
    ];

    const randomStory = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
    setBrandStory(randomStory);

    toast({
      title: "Brand Story Generated",
      description: "AI has crafted a brand story based on your personality traits and voice.",
    });
  };

  const saveChanges = () => {
    toast({
      title: "Brand Personality Saved",
      description: "Your brand personality and story have been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Brand Personality & Story
        </h1>
        <p className="text-muted-foreground text-lg">
          Define your brand's character, voice, and narrative to create authentic connections
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personality Traits */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Personality Traits</CardTitle>
                  <CardDescription>
                    Select the traits that best represent your brand's character
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {personalityTraits.map((trait) => {
                  const IconComponent = trait.icon;
                  return (
                    <button
                      key={trait.id}
                      onClick={() => togglePersonalityTrait(trait.id)}
                      className={`
                        flex items-center gap-2 p-3 rounded-lg border transition-all
                        ${trait.selected 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
                      `}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm font-medium">{trait.label}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Selected traits:</span>
                  <div className="flex flex-wrap gap-1">
                    {personalityTraits
                      .filter(trait => trait.selected)
                      .map(trait => (
                        <Badge key={trait.id} variant="secondary" className="text-xs">
                          {trait.label}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice & Tone */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Voice & Tone</CardTitle>
                  <CardDescription>
                    Choose how your brand communicates with its audience
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedVoiceTone} onValueChange={setSelectedVoiceTone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your brand voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceToneOptions.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{tone.label}</span>
                          <span className="text-xs text-muted-foreground">{tone.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {getSelectedTone() && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Tone Example:</h4>
                    <p className="text-sm text-muted-foreground italic">
                      "{getSelectedTone()?.example}"
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Brand Story */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">Brand Story</CardTitle>
                  <CardDescription>
                    Tell the narrative that connects your brand to your audience
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateBrandStory}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Story
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  placeholder="Tell your brand's story... How did you start? What drives you? What challenges do you solve? What impact do you want to have?"
                  value={brandStory}
                  onChange={(e) => setBrandStory(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>A compelling story creates emotional connections with your audience</span>
                  <span>{brandStory.length}/1000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions Panel */}
        <div className="space-y-6">
          <Card className="shadow-card sticky top-4">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <CardTitle className="text-lg">Personality Insights</CardTitle>
              </div>
              <CardDescription>
                AI suggestions based on your selections
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Your Brand Archetype</h4>
                  <p className="text-xs text-muted-foreground">
                    Based on your selected traits, your brand aligns with the "Expert" archetype - 
                    trusted, knowledgeable, and focused on delivering quality solutions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Communication Style</h4>
                  <p className="text-xs text-muted-foreground">
                    Your {getSelectedTone()?.label.toLowerCase()} tone works well with your personality traits. 
                    Consider emphasizing expertise while maintaining approachability.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Story Themes</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-xs">Problem-solving origins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-xs">Customer success focus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-xs">Innovation journey</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Tone Examples</CardTitle>
              <CardDescription>
                See how different tones affect your messaging
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {voiceToneOptions.slice(0, 3).map((tone) => (
                  <div key={tone.value} className={`p-3 rounded-lg border ${
                    tone.value === selectedVoiceTone ? 'border-primary bg-primary/5' : 'border-border'
                  }`}>
                    <h4 className="text-sm font-medium mb-1">{tone.label}</h4>
                    <p className="text-xs text-muted-foreground">{tone.example}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Brand Consistency</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Personality alignment</span>
                  <Badge className="bg-success text-success-foreground">Strong</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice consistency</span>
                  <Badge className="bg-success text-success-foreground">Good</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Story completeness</span>
                  <Badge className="bg-warning text-warning-foreground">Needs work</Badge>
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
            Preview Brand Voice
          </Button>
          <Button onClick={saveChanges} className="gap-2">
            <Save className="h-4 w-4" />
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalityStory;