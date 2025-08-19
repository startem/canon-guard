import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BarChart, Zap } from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm">
                <Shield className="w-4 h-4" />
                Enterprise Brand Management
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Observe everything your{" "}
                <span className="bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
                  brand
                </span>{" "}
                says and shows
              </h1>
              
              <p className="text-xl text-white/80 leading-relaxed max-w-xl">
                Prove it's consistent, on-brand, and strategically aligned—automatically. 
                AI-powered brand analysis with continuous monitoring and remediation workflows.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="brand" size="xl" className="group">
                Start Your Brand Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                View Demo
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">+40%</div>
                <div className="text-sm text-white/70">Brand Consistency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">&lt;24h</div>
                <div className="text-sm text-white/70">Drift Detection</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">90%</div>
                <div className="text-sm text-white/70">Asset Coverage</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img 
                src={heroImage} 
                alt="Brand Strategy Dashboard Interface" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-6 -left-6 bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-card border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <BarChart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Brand Score</div>
                  <div className="text-xs text-muted-foreground">94% Consistent</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-card border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Real-time</div>
                  <div className="text-xs text-muted-foreground">Auto Analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};