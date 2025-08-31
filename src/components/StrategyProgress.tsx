import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const strategySteps = [
  {
    id: 1,
    title: "Strategy Builder",
    path: "/strategy-builder",
    description: "Define brand purpose and vision"
  },
  {
    id: 2, 
    title: "Positioning & Messaging",
    path: "/positioning-messaging",
    description: "Craft positioning and key messages"
  },
  {
    id: 3,
    title: "Personality & Story", 
    path: "/personality-story",
    description: "Define brand personality and narrative"
  },
  {
    id: 4,
    title: "Identity Designer",
    path: "/identity-designer", 
    description: "Create visual identity system"
  }
];

export const StrategyProgress = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Mock completion status - in real app this would come from state/API
  const completedSteps = ["/strategy-builder"];
  const currentStepIndex = strategySteps.findIndex(step => step.path === currentPath);
  
  const getStepStatus = (step: typeof strategySteps[0], index: number) => {
    if (completedSteps.includes(step.path)) return "completed";
    if (step.path === currentPath) return "current";
    if (index < currentStepIndex) return "completed";
    return "upcoming";
  };

  return (
    <div className="bg-background border-b border-border p-4 mb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Brand Strategy Workflow</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Complete each step to build your comprehensive brand strategy
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Step {Math.max(currentStepIndex + 1, 1)} of {strategySteps.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {strategySteps.map((step, index) => {
            const status = getStepStatus(step, index);
            const isLast = index === strategySteps.length - 1;
            
            return (
              <div key={step.id} className="flex items-center gap-2 min-w-0">
                <Link 
                  to={step.path}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all min-w-0 ${
                    status === "current" 
                      ? "bg-primary/10 border-primary text-primary" 
                      : status === "completed"
                      ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className={`w-5 h-5 ${
                        status === "current" ? "text-primary" : "text-muted-foreground"
                      }`} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      status === "current" ? "text-primary" : ""
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {step.description}
                    </div>
                  </div>
                </Link>
                
                {!isLast && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};