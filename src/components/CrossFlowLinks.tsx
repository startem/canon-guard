import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  ExternalLink, 
  Target, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Eye,
  Edit
} from "lucide-react";

interface CrossFlowLink {
  id: string;
  title: string;
  description: string;
  targetRoute: string;
  category: "audit" | "issue" | "governance" | "analytics" | "strategy" | "canon";
  priority: "high" | "medium" | "low";
  actionType: "view" | "edit" | "analyze" | "resolve";
  metadata?: {
    count?: number;
    status?: string;
    lastUpdated?: string;
  };
}

interface CrossFlowLinksProps {
  context: "audit" | "issue" | "dashboard" | "governance" | "strategy" | "analytics";
  currentEntityId?: string;
  relatedLinks: CrossFlowLink[];
}

export const CrossFlowLinks = ({ context, currentEntityId, relatedLinks }: CrossFlowLinksProps) => {
  const navigate = useNavigate();

  const getContextIcon = (category: string) => {
    switch (category) {
      case "audit": return <BarChart3 className="w-4 h-4" />;
      case "issue": return <AlertTriangle className="w-4 h-4" />;
      case "governance": return <Settings className="w-4 h-4" />;
      case "analytics": return <BarChart3 className="w-4 h-4" />;
      case "strategy": return <Target className="w-4 h-4" />;
      case "canon": return <CheckCircle className="w-4 h-4" />;
      default: return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "view": return <Eye className="w-4 h-4" />;
      case "edit": return <Edit className="w-4 h-4" />;
      case "analyze": return <BarChart3 className="w-4 h-4" />;
      case "resolve": return <Zap className="w-4 h-4" />;
      default: return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const handleLinkClick = (link: CrossFlowLink) => {
    // Add context parameters to maintain flow state
    const url = currentEntityId 
      ? `${link.targetRoute}?from=${context}&entityId=${currentEntityId}`
      : `${link.targetRoute}?from=${context}`;
    
    navigate(url);
  };

  const getContextTitle = () => {
    switch (context) {
      case "audit": return "Related to Current Audit";
      case "issue": return "Related Issues & Actions";
      case "dashboard": return "Quick Actions";
      case "governance": return "Governance Actions";
      case "strategy": return "Strategy Components";
      default: return "Related Actions";
    }
  };

  if (relatedLinks.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-primary" />
          {getContextTitle()}
        </CardTitle>
        <CardDescription>
          Contextual links and actions related to the current {context}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relatedLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  {getContextIcon(link.category)}
                  {getActionIcon(link.actionType)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{link.title}</h4>
                    <Badge variant={getPriorityColor(link.priority)} className="text-xs">
                      {link.priority}
                    </Badge>
                    {link.metadata?.count && (
                      <Badge variant="outline" className="text-xs">
                        {link.metadata.count}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {link.description}
                  </p>
                  {link.metadata?.lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last updated: {link.metadata.lastUpdated}
                    </p>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLinkClick(link)}
                className="flex items-center gap-2 ml-2"
              >
                {link.actionType === "view" && "View"}
                {link.actionType === "edit" && "Edit"}
                {link.actionType === "analyze" && "Analyze"}
                {link.actionType === "resolve" && "Resolve"}
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
        
        {/* Quick Navigation for Current Context */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {context === "audit" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/analytics-dashboard")}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/governance-alerts")}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Governance
                </Button>
              </>
            )}
            
            {context === "issue" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/?tab=management")}
                  className="flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/notifications-alerts")}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  All Alerts
                </Button>
              </>
            )}
            
            {context === "strategy" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/?tab=canon")}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Brand Canon
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/analytics-dashboard")}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};