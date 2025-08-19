import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  AlertTriangle,
  Globe,
  Calendar,
  FileText,
  Scale
} from "lucide-react";

interface LegalItem {
  id: string;
  name: string;
  type: 'disclaimer' | 'trademark' | 'copyright' | 'privacy' | 'terms' | 'claim';
  content: string;
  regions: string[];
  products: string[];
  mandatory: boolean;
  placement: string[];
  expiryDate?: string;
  lastReviewed: string;
  approvalStatus: 'approved' | 'pending-review' | 'expired';
  riskLevel: 'low' | 'medium' | 'high';
}

const mockLegalItems: LegalItem[] = [
  {
    id: "1",
    name: "General Disclaimer",
    type: "disclaimer",
    content: "Results may vary. Individual performance depends on proper implementation and usage of our software solutions. TechCorp makes no guarantees regarding specific outcomes or ROI improvements.",
    regions: ["Global"],
    products: ["All Products"],
    mandatory: true,
    placement: ["Website footer", "Sales materials", "Marketing content"],
    lastReviewed: "2024-08-01",
    approvalStatus: "approved",
    riskLevel: "high"
  },
  {
    id: "2",
    name: "TechCorp Trademark",
    type: "trademark",
    content: "TechCorp® is a registered trademark of TechCorp Inc. All rights reserved.",
    regions: ["North America", "Europe"],
    products: ["All Products"],
    mandatory: true,
    placement: ["First mention in documents", "Website footer", "Legal pages"],
    lastReviewed: "2024-07-15",
    approvalStatus: "approved",
    riskLevel: "medium"
  },
  {
    id: "3",
    name: "GDPR Privacy Notice",
    type: "privacy",
    content: "We process your personal data in accordance with GDPR regulations. For full details on how we collect, use, and protect your information, please see our Privacy Policy.",
    regions: ["Europe"],
    products: ["All Products"],
    mandatory: true,
    placement: ["Data collection forms", "Cookie banners", "Privacy pages"],
    lastReviewed: "2024-08-10",
    approvalStatus: "approved",
    riskLevel: "high"
  },
  {
    id: "4",
    name: "Performance Claims",
    type: "claim",
    content: "Based on internal testing and customer case studies. Individual results may vary. Claims verified by third-party audits conducted in Q2 2024.",
    regions: ["Global"],
    products: ["ProAnalytics", "AI Suite"],
    mandatory: false,
    placement: ["Marketing materials", "Sales presentations"],
    expiryDate: "2024-12-31",
    lastReviewed: "2024-08-05",
    approvalStatus: "pending-review",
    riskLevel: "medium"
  },
  {
    id: "5",
    name: "Copyright Notice",
    type: "copyright",
    content: "© 2024 TechCorp Inc. All rights reserved. No part of this publication may be reproduced without written permission.",
    regions: ["Global"],
    products: ["All Products"],
    mandatory: true,
    placement: ["Website footer", "Documents", "Marketing materials"],
    lastReviewed: "2024-01-01",
    approvalStatus: "expired",
    riskLevel: "low"
  }
];

export const LegalCompliance = () => {
  const [selectedItem, setSelectedItem] = useState<LegalItem | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showExpired, setShowExpired] = useState(false);

  const types = ['all', 'disclaimer', 'trademark', 'copyright', 'privacy', 'terms', 'claim'];

  const filteredItems = mockLegalItems.filter(item => {
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    const statusMatch = showExpired || item.approvalStatus !== 'expired';
    return typeMatch && statusMatch;
  });

  const getTypeBadge = (type: string) => {
    const variants = {
      disclaimer: "destructive",
      trademark: "default",
      copyright: "secondary",
      privacy: "outline",
      terms: "outline",
      claim: "warning"
    } as const;
    
    return <Badge variant={variants[type as keyof typeof variants]}>{type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      'pending-review': "secondary",
      expired: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status.replace('-', ' ')}</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: "secondary",
      medium: "secondary",
      high: "destructive"
    } as const;
    
    return <Badge variant={variants[risk as keyof typeof variants]}>{risk} risk</Badge>;
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Legal Items List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Legal Compliance</h2>
            <p className="text-sm text-muted-foreground">
              Manage disclaimers, trademarks, and legal requirements
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Legal Item
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-2">
            {types.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
          <Button
            variant={showExpired ? "default" : "outline"}
            size="sm"
            onClick={() => setShowExpired(!showExpired)}
          >
            Show Expired
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className={`p-6 cursor-pointer transition-brand hover:shadow-card ${
                selectedItem?.id === item.id ? 'bg-primary/5 border-primary/20' : ''
              } ${item.approvalStatus === 'expired' ? 'opacity-75' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      {getTypeBadge(item.type)}
                      {getStatusBadge(item.approvalStatus)}
                      {item.mandatory && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Mandatory
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                  <div className="text-right">
                    {getRiskBadge(item.riskLevel)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Reviewed {item.lastReviewed}</span>
                    {item.expiryDate && (
                      <span className={isExpiringSoon(item.expiryDate) ? 'text-warning' : ''}>
                        Expires {item.expiryDate}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    <span>{item.regions.join(", ")}</span>
                  </div>
                </div>

                {item.expiryDate && isExpiringSoon(item.expiryDate) && (
                  <div className="flex items-center gap-2 p-2 bg-warning/10 border border-warning/20 rounded text-warning text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Expiring in {Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Legal Details</h2>
        
        {selectedItem ? (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{selectedItem.name}</h3>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Legal Content</Label>
                <div className="mt-2 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">{selectedItem.content}</p>
                </div>
              </div>

              <div>
                <Label>Type & Risk Level</Label>
                <div className="flex items-center gap-2 mt-1">
                  {getTypeBadge(selectedItem.type)}
                  {getRiskBadge(selectedItem.riskLevel)}
                  {selectedItem.mandatory && (
                    <Badge variant="destructive" className="text-xs">
                      Mandatory
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <div className="mt-1">
                  {getStatusBadge(selectedItem.approvalStatus)}
                </div>
              </div>

              <div>
                <Label>Regions</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedItem.regions.map(region => (
                    <Badge key={region} variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Products</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedItem.products.map(product => (
                    <Badge key={product} variant="secondary" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Required Placement</Label>
                <div className="space-y-1 mt-2">
                  {selectedItem.placement.map((place, index) => (
                    <div key={index} className="text-sm bg-background/50 px-3 py-2 rounded">
                      • {place}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Last Reviewed</Label>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {selectedItem.lastReviewed}
                  </div>
                </div>
                {selectedItem.expiryDate && (
                  <div>
                    <Label>Expires</Label>
                    <div className={`flex items-center gap-2 mt-1 text-sm ${
                      isExpiringSoon(selectedItem.expiryDate) ? 'text-warning' : 'text-muted-foreground'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      {selectedItem.expiryDate}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" size="sm" className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button variant="hero" size="sm" className="flex-1">
                Save Changes
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              Select a legal item to view details
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};