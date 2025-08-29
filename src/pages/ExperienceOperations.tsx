import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Globe, Smartphone, Headphones, Package, Calendar, Mail, Store, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Touchpoint {
  id: string;
  name: string;
  icon: any;
  idealExperience: string;
  brandLanguage: string;
  operationalRequirements: string;
  status: 'compliant' | 'needs-attention' | 'non-compliant';
}

const initialTouchpoints: Touchpoint[] = [
  {
    id: '1',
    name: 'Website',
    icon: Globe,
    idealExperience: 'Clean, intuitive navigation with consistent brand messaging and fast load times',
    brandLanguage: 'Professional yet approachable tone, clear value propositions',
    operationalRequirements: 'Page load time < 3 seconds, WCAG AA compliance, mobile-first design',
    status: 'compliant'
  },
  {
    id: '2',
    name: 'Mobile App',
    icon: Smartphone,
    idealExperience: 'Seamless user experience with native performance and intuitive gestures',
    brandLanguage: 'Concise messaging, contextual help, encouraging micro-copy',
    operationalRequirements: 'App store rating > 4.0, crash rate < 0.1%, 99.9% uptime',
    status: 'needs-attention'
  },
  {
    id: '3',
    name: 'Customer Support',
    icon: Headphones,
    idealExperience: 'Empathetic, knowledgeable support with quick resolution times',
    brandLanguage: 'Helpful, patient, solution-oriented communication',
    operationalRequirements: 'Response time < 2 hours, satisfaction score > 90%',
    status: 'compliant'
  },
  {
    id: '4',
    name: 'Packaging',
    icon: Package,
    idealExperience: 'Premium unboxing experience that reflects brand values',
    brandLanguage: 'Clear product information, sustainability messaging',
    operationalRequirements: 'Eco-friendly materials, damage rate < 2%',
    status: 'non-compliant'
  },
  {
    id: '5',
    name: 'Events',
    icon: Calendar,
    idealExperience: 'Memorable brand experiences that create lasting connections',
    brandLanguage: 'Engaging presentations, authentic storytelling',
    operationalRequirements: 'Brand guidelines compliance, post-event NPS > 8',
    status: 'compliant'
  },
  {
    id: '6',
    name: 'Email Marketing',
    icon: Mail,
    idealExperience: 'Personalized, valuable content delivered at optimal timing',
    brandLanguage: 'Conversational tone, clear CTAs, value-driven subject lines',
    operationalRequirements: 'Open rate > 25%, click rate > 3%, unsubscribe < 2%',
    status: 'needs-attention'
  }
];

const statusConfig = {
  compliant: { color: 'bg-green-500', text: 'Compliant', textColor: 'text-green-700' },
  'needs-attention': { color: 'bg-yellow-500', text: 'Needs Attention', textColor: 'text-yellow-700' },
  'non-compliant': { color: 'bg-red-500', text: 'Non-Compliant', textColor: 'text-red-700' }
};

export function ExperienceOperations() {
  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>(initialTouchpoints);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTouchpoint, setEditingTouchpoint] = useState<Touchpoint | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    idealExperience: '',
    brandLanguage: '',
    operationalRequirements: '',
    status: 'compliant' as Touchpoint['status']
  });

  const resetForm = () => {
    setFormData({
      name: '',
      idealExperience: '',
      brandLanguage: '',
      operationalRequirements: '',
      status: 'compliant'
    });
    setEditingTouchpoint(null);
  };

  const handleSave = () => {
    if (editingTouchpoint) {
      setTouchpoints(prev => prev.map(tp => 
        tp.id === editingTouchpoint.id 
          ? { ...tp, ...formData }
          : tp
      ));
      toast({ title: "Touchpoint updated successfully" });
    } else {
      const newTouchpoint: Touchpoint = {
        id: Date.now().toString(),
        icon: Store, // Default icon for new touchpoints
        ...formData
      };
      setTouchpoints(prev => [...prev, newTouchpoint]);
      toast({ title: "Touchpoint added successfully" });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (touchpoint: Touchpoint) => {
    setEditingTouchpoint(touchpoint);
    setFormData({
      name: touchpoint.name,
      idealExperience: touchpoint.idealExperience,
      brandLanguage: touchpoint.brandLanguage,
      operationalRequirements: touchpoint.operationalRequirements,
      status: touchpoint.status
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Experience & Operations</h1>
            <p className="text-muted-foreground mt-2">
              Manage brand experiences across all customer touchpoints
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Touchpoint
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTouchpoint ? 'Edit Touchpoint' : 'Add New Touchpoint'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Touchpoint Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Social Media, In-Store Experience"
                  />
                </div>
                
                <div>
                  <Label htmlFor="idealExperience">Ideal Experience</Label>
                  <Textarea
                    id="idealExperience"
                    value={formData.idealExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, idealExperience: e.target.value }))}
                    placeholder="Describe the ideal customer experience for this touchpoint"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="brandLanguage">Brand Language</Label>
                  <Textarea
                    id="brandLanguage"
                    value={formData.brandLanguage}
                    onChange={(e) => setFormData(prev => ({ ...prev, brandLanguage: e.target.value }))}
                    placeholder="Example phrases, copy tone, and messaging guidelines"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="operationalRequirements">Operational Requirements</Label>
                  <Textarea
                    id="operationalRequirements"
                    value={formData.operationalRequirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, operationalRequirements: e.target.value }))}
                    placeholder="Performance metrics, compliance requirements, operational guidelines"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Compliance Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Touchpoint['status'] }))}
                    className="w-full p-2 border border-input rounded-md bg-background"
                  >
                    <option value="compliant">Compliant</option>
                    <option value="needs-attention">Needs Attention</option>
                    <option value="non-compliant">Non-Compliant</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                  {editingTouchpoint ? 'Update' : 'Add'} Touchpoint
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {touchpoints.map((touchpoint) => {
            const Icon = touchpoint.icon;
            const statusInfo = statusConfig[touchpoint.status];
            
            return (
              <Card key={touchpoint.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{touchpoint.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`${statusInfo.color} text-white hover:${statusInfo.color}/90`}
                      >
                        {statusInfo.text}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(touchpoint)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      Ideal Experience
                    </h4>
                    <p className="text-sm text-foreground">
                      {touchpoint.idealExperience}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      Brand Language
                    </h4>
                    <p className="text-sm text-foreground">
                      {touchpoint.brandLanguage}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      Operational Requirements
                    </h4>
                    <p className="text-sm text-foreground">
                      {touchpoint.operationalRequirements}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}