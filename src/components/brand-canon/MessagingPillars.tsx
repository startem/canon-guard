import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { PillarDialog } from "./dialogs/PillarDialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare,
  Target,
  Lightbulb,
  Shield,
  Zap,
  Heart,
  TrendingUp
} from "lucide-react";

interface MessagingPillar {
  id: string;
  name: string;
  description: string;
  definition: string;
  examples: string[];
  keywords: string[];
  requiredCoverage: number; // percentage threshold
  currentCoverage: number; // current coverage across assets
  assetTypes: string[]; // where this pillar should appear
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

const initialPillars: MessagingPillar[] = [
  {
    id: "1",
    name: "Innovation",
    description: "Cutting-edge technology and forward-thinking solutions",
    definition: "We lead the industry with breakthrough technologies that solve tomorrow's challenges today. Our innovation drives transformation across every sector we serve.",
    examples: [
      "Revolutionary AI-powered analytics",
      "Next-generation cloud infrastructure",
      "Breakthrough machine learning algorithms"
    ],
    keywords: ["innovative", "cutting-edge", "revolutionary", "breakthrough", "next-generation"],
    requiredCoverage: 80,
    currentCoverage: 85,
    assetTypes: ["website", "sales-deck", "pr-content"],
    priority: "high",
    icon: "lightbulb"
  },
  {
    id: "2",
    name: "Trust & Security",
    description: "Enterprise-grade security and reliability",
    definition: "Security is at the core of everything we build. Our enterprise-grade solutions protect what matters most to your business with industry-leading compliance and reliability.",
    examples: [
      "Bank-level encryption and security",
      "99.9% uptime guarantee",
      "SOC 2 Type II certified infrastructure"
    ],
    keywords: ["secure", "trusted", "reliable", "compliant", "enterprise-grade"],
    requiredCoverage: 70,
    currentCoverage: 92,
    assetTypes: ["website", "sales-deck", "legal-docs"],
    priority: "high",
    icon: "shield"
  },
  {
    id: "3",
    name: "Performance",
    description: "Speed, efficiency, and scalable solutions",
    definition: "Performance isn't just a feature—it's a promise. Our solutions deliver lightning-fast results that scale with your business growth.",
    examples: [
      "10x faster processing speeds",
      "Seamless scalability to millions of users",
      "Real-time analytics and insights"
    ],
    keywords: ["fast", "efficient", "scalable", "performance", "lightning-speed"],
    requiredCoverage: 65,
    currentCoverage: 73,
    assetTypes: ["website", "sales-deck", "product-docs"],
    priority: "medium",
    icon: "zap"
  },
  {
    id: "4",
    name: "Customer Success",
    description: "Dedicated support and partnership approach",
    definition: "Your success is our success. We're not just a vendor—we're your strategic partner, committed to ensuring you achieve your goals with our solutions.",
    examples: [
      "24/7 dedicated support team",
      "Strategic account management",
      "Comprehensive onboarding and training"
    ],
    keywords: ["support", "partnership", "success", "dedicated", "strategic"],
    requiredCoverage: 60,
    currentCoverage: 67,
    assetTypes: ["website", "sales-deck", "customer-content"],
    priority: "medium",
    icon: "heart"
  }
];

const getIcon = (iconName: string) => {
  const icons = {
    lightbulb: Lightbulb,
    shield: Shield,
    zap: Zap,
    heart: Heart,
    target: Target,
    trending: TrendingUp
  };
  const IconComponent = icons[iconName as keyof typeof icons] || MessageSquare;
  return <IconComponent className="w-5 h-5" />;
};

export const MessagingPillars = () => {
  const [pillars, setPillars] = useState<MessagingPillar[]>(initialPillars);
  const [selectedPillar, setSelectedPillar] = useState<MessagingPillar | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState<MessagingPillar | null>(null);
  const { toast } = useToast();

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary"
    } as const;
    
    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>;
  };

  const getCoverageColor = (current: number, required: number) => {
    if (current >= required) return "text-success";
    if (current >= required * 0.8) return "text-secondary";
    return "text-destructive";
  };

  const handleCreatePillar = () => {
    setEditingPillar(null);
    setDialogOpen(true);
  };

  const handleEditPillar = (pillar: MessagingPillar) => {
    setEditingPillar(pillar);
    setDialogOpen(true);
  };

  const handleDeletePillar = (pillarId: string) => {
    setPillars(prev => prev.filter(p => p.id !== pillarId));
    if (selectedPillar?.id === pillarId) {
      setSelectedPillar(null);
    }
    toast({
      title: "Pillar deleted",
      description: "The messaging pillar has been removed."
    });
  };

  const handleSavePillar = (pillarData: Omit<MessagingPillar, 'id' | 'currentCoverage'>) => {
    if (editingPillar) {
      // Update existing pillar
      setPillars(prev => prev.map(p => 
        p.id === editingPillar.id 
          ? { ...pillarData, id: editingPillar.id, currentCoverage: editingPillar.currentCoverage }
          : p
      ));
      toast({
        title: "Pillar updated",
        description: "The messaging pillar has been successfully updated."
      });
    } else {
      // Create new pillar
      const newPillar: MessagingPillar = {
        ...pillarData,
        id: Date.now().toString(),
        currentCoverage: 0
      };
      setPillars(prev => [...prev, newPillar]);
      toast({
        title: "Pillar created",
        description: "The new messaging pillar has been added."
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Pillars List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Messaging Pillars</h2>
          <Button variant="outline" size="sm" onClick={handleCreatePillar}>
            <Plus className="w-4 h-4 mr-2" />
            Add Pillar
          </Button>
        </div>
        
        <div className="grid gap-4">
          {pillars.map((pillar) => (
            <Card 
              key={pillar.id} 
              className={`p-6 cursor-pointer transition-brand hover:shadow-card ${
                selectedPillar?.id === pillar.id ? 'bg-primary/5 border-primary/20' : ''
              }`}
              onClick={() => setSelectedPillar(pillar)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white">
                      {getIcon(pillar.icon)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{pillar.name}</h3>
                      <p className="text-sm text-muted-foreground">{pillar.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(pillar.priority)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coverage Target</span>
                    <span className={`font-medium ${getCoverageColor(pillar.currentCoverage, pillar.requiredCoverage)}`}>
                      {pillar.currentCoverage}% / {pillar.requiredCoverage}%
                    </span>
                  </div>
                  <Progress 
                    value={pillar.currentCoverage} 
                    className="h-2"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {pillar.keywords.slice(0, 4).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {pillar.keywords.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{pillar.keywords.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pillar Details</h2>
        
        {selectedPillar ? (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white">
                  {getIcon(selectedPillar.icon)}
                </div>
                <h3 className="text-lg font-medium">{selectedPillar.name}</h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleEditPillar(selectedPillar)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Definition</Label>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {selectedPillar.definition}
                </p>
              </div>

              <div>
                <Label>Key Examples</Label>
                <div className="space-y-1 mt-2">
                  {selectedPillar.examples.map((example, index) => (
                    <div key={index} className="text-sm bg-muted/50 px-3 py-2 rounded-lg">
                      • {example}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Keywords & Phrases</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedPillar.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Asset Types</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedPillar.assetTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Coverage Requirements</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Required: {selectedPillar.requiredCoverage}%</span>
                    <span className={`font-medium ${getCoverageColor(selectedPillar.currentCoverage, selectedPillar.requiredCoverage)}`}>
                      Current: {selectedPillar.currentCoverage}%
                    </span>
                  </div>
                  <Progress 
                    value={selectedPillar.currentCoverage} 
                    className="h-2"
                  />
                </div>
              </div>

              <div>
                <Label>Priority</Label>
                <div className="mt-1">
                  {getPriorityBadge(selectedPillar.priority)}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleDeletePillar(selectedPillar.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button 
                variant="hero" 
                size="sm" 
                className="flex-1"
                onClick={() => handleEditPillar(selectedPillar)}
              >
                Edit Pillar
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              Select a messaging pillar to view details
            </div>
          </Card>
        )}
      </div>

      <PillarDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pillar={editingPillar}
        onSave={handleSavePillar}
      />
    </div>
  );
};