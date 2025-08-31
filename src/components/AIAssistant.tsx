import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  title: string;
  description: string;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  generateType: "positioning" | "tagline" | "elevator" | "story";
}

export const AIAssistant = ({ 
  title, 
  description, 
  suggestions, 
  onSelectSuggestion,
  generateType 
}: AIAssistantProps) => {
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generated = getGeneratedContent(generateType);
    setGeneratedContent(generated);
    setIsGenerating(false);
    
    toast({
      title: "Content Generated",
      description: "AI has generated new content based on your brand strategy.",
    });
  };

  const getGeneratedContent = (type: string): string => {
    switch (type) {
      case "positioning":
        return "We empower forward-thinking businesses to build authentic, memorable brand experiences that drive meaningful connections with their audiences. Unlike traditional brand management tools, we provide comprehensive, AI-powered solutions that adapt to your unique brand story and market position.";
      case "tagline":
        return "Authentic Brands. Meaningful Connections.";
      case "elevator":
        return "We help companies transform their brand management from scattered, inconsistent touchpoints into cohesive, powerful experiences that resonate with customers and drive business growth. Our platform combines AI insights with practical tools to ensure every brand interaction reflects your authentic story and values.";
      case "story":
        return "Founded on the belief that every brand has a unique story worth telling, we recognized that too many companies struggle with fragmented brand experiences. We built our platform to bridge the gap between brand strategy and execution, empowering teams to create consistent, authentic connections across every touchpoint. Today, we're helping businesses of all sizes transform how they manage and express their brand identity.";
      default:
        return "Generated content will appear here...";
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: "The suggestion has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const useGenerated = () => {
    if (generatedContent) {
      onSelectSuggestion(generatedContent);
      setGeneratedContent("");
    }
  };

  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Sparkles className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Generate Button */}
        <Button 
          onClick={generateContent}
          disabled={isGenerating}
          className="w-full"
          variant="outline"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </>
          )}
        </Button>

        {/* Generated Content */}
        {generatedContent && (
          <div className="space-y-3">
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="text-sm font-medium text-primary mb-2">AI Generated:</div>
              <div className="text-sm text-foreground leading-relaxed">
                {generatedContent}
              </div>
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  onClick={useGenerated}
                  className="flex-1"
                >
                  Use This Content
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={generateContent}
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Quick Suggestions:</div>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="group relative">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 text-xs p-2 w-full justify-start transition-colors"
                onClick={() => onSelectSuggestion(suggestion)}
              >
                {suggestion}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(suggestion, index);
                }}
              >
                {copiedIndex === index ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};