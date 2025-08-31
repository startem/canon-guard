import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, Plus, Edit3, Save, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { StrategyProgress } from '@/components/StrategyProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface StrategyPillar {
  id: string;
  title: string;
  description: string;
}

const BrandStrategyBuilder: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [strategy, setStrategy] = useState({
    purpose: '',
    vision: '',
    mission: '',
    pillars: [] as StrategyPillar[]
  });

  const [editingPillar, setEditingPillar] = useState<StrategyPillar | null>(null);
  const [newPillarTitle, setNewPillarTitle] = useState('');
  const [newPillarDescription, setNewPillarDescription] = useState('');

  const aiSuggestions = {
    purpose: [
      "To empower businesses through innovative technology solutions",
      "To create meaningful connections between brands and customers",
      "To transform the way people experience digital products"
    ],
    vision: [
      "To be the leading platform for brand management excellence",
      "A world where every brand tells its authentic story",
      "To revolutionize how companies build lasting relationships"
    ],
    mission: [
      "We help organizations build authentic, consistent brand experiences",
      "Delivering comprehensive brand management tools for modern businesses",
      "Enabling companies to create and maintain powerful brand identities"
    ],
    pillars: [
      { title: "Innovation", description: "We constantly push boundaries and embrace new technologies" },
      { title: "Authenticity", description: "We believe in genuine, transparent brand communications" },
      { title: "Excellence", description: "We deliver exceptional quality in everything we do" },
      { title: "Customer Focus", description: "Our customers' success drives everything we do" }
    ]
  };

  const handleSavePillar = () => {
    if (!newPillarTitle.trim() || !newPillarDescription.trim()) return;

    const pillar: StrategyPillar = {
      id: editingPillar?.id || Date.now().toString(),
      title: newPillarTitle,
      description: newPillarDescription
    };

    if (editingPillar) {
      setStrategy(prev => ({
        ...prev,
        pillars: prev.pillars.map(p => p.id === editingPillar.id ? pillar : p)
      }));
    } else {
      setStrategy(prev => ({
        ...prev,
        pillars: [...prev.pillars, pillar]
      }));
    }

    setNewPillarTitle('');
    setNewPillarDescription('');
    setEditingPillar(null);
  };

  const handleEditPillar = (pillar: StrategyPillar) => {
    setEditingPillar(pillar);
    setNewPillarTitle(pillar.title);
    setNewPillarDescription(pillar.description);
  };

  const handleDeletePillar = (id: string) => {
    setStrategy(prev => ({
      ...prev,
      pillars: prev.pillars.filter(p => p.id !== id)
    }));
  };

  const handleSaveStrategy = () => {
    toast({
      title: "Strategy Saved",
      description: "Your brand strategy has been successfully updated.",
    });
    // Navigate to next step
    navigate("/positioning-messaging");
  };

  const useSuggestion = (field: keyof typeof strategy, suggestion: string) => {
    setStrategy(prev => ({ ...prev, [field]: suggestion }));
  };

  const addSuggestedPillar = (pillar: { title: string; description: string }) => {
    const newPillar: StrategyPillar = {
      id: Date.now().toString(),
      title: pillar.title,
      description: pillar.description
    };
    setStrategy(prev => ({
      ...prev,
      pillars: [...prev.pillars, newPillar]
    }));
  };

  return (
    <div>
      <StrategyProgress />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Brand Strategy Builder</h1>
              <p className="text-muted-foreground">Define your core brand strategy and messaging pillars</p>
            </div>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Strategy Definition */}
          <div className="lg:col-span-2 space-y-6">
            {/* Purpose */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Brand Purpose</CardTitle>
                <CardDescription>Why does your brand exist? What is its fundamental reason for being?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your brand purpose..."
                  value={strategy.purpose}
                  onChange={(e) => setStrategy(prev => ({ ...prev, purpose: e.target.value }))}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Brand Vision</CardTitle>
                <CardDescription>What future do you want to create? Where is your brand heading?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your brand vision..."
                  value={strategy.vision}
                  onChange={(e) => setStrategy(prev => ({ ...prev, vision: e.target.value }))}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Brand Mission</CardTitle>
                <CardDescription>How will you achieve your vision? What do you do day-to-day?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your brand mission..."
                  value={strategy.mission}
                  onChange={(e) => setStrategy(prev => ({ ...prev, mission: e.target.value }))}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Strategic Pillars */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary flex items-center justify-between">
                  Strategic Pillars
                  <Button 
                    onClick={() => {
                      setEditingPillar(null);
                      setNewPillarTitle('');
                      setNewPillarDescription('');
                    }}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pillar
                  </Button>
                </CardTitle>
                <CardDescription>Define the key pillars that support your brand strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {strategy.pillars.map((pillar) => (
                  <div key={pillar.id} className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary">{pillar.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPillar(pillar)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeletePillar(pillar.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add/Edit Pillar Form */}
                {(editingPillar || newPillarTitle || newPillarDescription) && (
                  <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="pillar-title">Pillar Title</Label>
                        <Input
                          id="pillar-title"
                          placeholder="e.g., Innovation, Quality, Customer Focus"
                          value={newPillarTitle}
                          onChange={(e) => setNewPillarTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pillar-description">Pillar Description</Label>
                        <Textarea
                          id="pillar-description"
                          placeholder="Describe what this pillar means for your brand..."
                          value={newPillarDescription}
                          onChange={(e) => setNewPillarDescription(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSavePillar} size="sm" className="bg-primary hover:bg-primary/90">
                          <Save className="h-4 w-4 mr-2" />
                          Save Pillar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingPillar(null);
                            setNewPillarTitle('');
                            setNewPillarDescription('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Suggestions */}
          <div className="space-y-6">
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Lightbulb className="h-5 w-5" />
                  AI Suggestions
                </CardTitle>
                <CardDescription>Click any suggestion to use it as a starting point</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Purpose Suggestions */}
                <div>
                  <Label className="text-sm font-medium text-primary">Purpose Ideas</Label>
                  <div className="space-y-2 mt-2">
                    {aiSuggestions.purpose.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 text-xs p-2 w-full justify-start"
                        onClick={() => useSuggestion('purpose', suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Vision Suggestions */}
                <div>
                  <Label className="text-sm font-medium text-primary">Vision Ideas</Label>
                  <div className="space-y-2 mt-2">
                    {aiSuggestions.vision.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 text-xs p-2 w-full justify-start"
                        onClick={() => useSuggestion('vision', suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Mission Suggestions */}
                <div>
                  <Label className="text-sm font-medium text-primary">Mission Ideas</Label>
                  <div className="space-y-2 mt-2">
                    {aiSuggestions.mission.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 text-xs p-2 w-full justify-start"
                        onClick={() => useSuggestion('mission', suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pillar Suggestions */}
                <div>
                  <Label className="text-sm font-medium text-primary">Pillar Ideas</Label>
                  <div className="space-y-2 mt-2">
                    {aiSuggestions.pillars.map((pillar, index) => (
                      <div
                        key={index}
                        className="p-3 border border-border/50 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
                        onClick={() => addSuggestedPillar(pillar)}
                      >
                        <div className="font-medium text-sm text-primary">{pillar.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{pillar.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Actions */}
        <Card className="shadow-card">
          <CardContent className="flex justify-between items-center p-6">
            <p className="text-sm text-muted-foreground">
              Your strategy will be used across all brand management tools
            </p>
            <div className="flex gap-3">
              <Button variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSaveStrategy} className="bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Save Strategy
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default BrandStrategyBuilder;