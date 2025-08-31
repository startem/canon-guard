import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Edit, 
  Eye, 
  Users, 
  Target,
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  channels: string[];
  startDate: Date;
  endDate: Date;
  assignedTo: string;
  status: "planning" | "active" | "completed" | "paused";
  budget?: number;
  reach?: number;
  engagement?: number;
}

interface CampaignDetailModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Campaign) => void;
}

const availableChannels = [
  "Social Media",
  "Email Marketing", 
  "Content Marketing",
  "Paid Advertising",
  "PR & Media",
  "Events",
  "Influencer Marketing",
  "SEO",
  "PPC"
];

const teamMembers = [
  { id: "sarah-jones", name: "Sarah Jones", role: "Marketing Lead" },
  { id: "mike-wilson", name: "Mike Wilson", role: "Content Manager" },
  { id: "lisa-chen", name: "Lisa Chen", role: "Social Media Manager" },
  { id: "john-smith", name: "John Smith", role: "Brand Manager" }
];

export const CampaignDetailModal = ({ campaign, isOpen, onClose, onSave }: CampaignDetailModalProps) => {
  const [formData, setFormData] = useState<Campaign>(
    campaign || {
      id: "",
      title: "",
      description: "",
      channels: [],
      startDate: new Date(),
      endDate: new Date(),
      assignedTo: "",
      status: "planning"
    }
  );

  const { toast } = useToast();

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: campaign ? "Campaign Updated" : "Campaign Created",
      description: `${formData.title} has been ${campaign ? "updated" : "created"} successfully.`,
    });
    onClose();
  };

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "secondary";
      case "active": return "default";
      case "completed": return "default";
      case "paused": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning": return <Clock className="w-4 h-4" />;
      case "active": return <TrendingUp className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "paused": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            {campaign ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
          <DialogDescription>
            {campaign ? "Update campaign details and settings" : "Create a new marketing campaign"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter campaign title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: any) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the campaign objectives and strategy"
              rows={4}
            />
          </div>

          <Separator />

          {/* Dates and Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.startDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && setFormData({...formData, startDate: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.endDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && setFormData({...formData, endDate: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select 
                value={formData.assignedTo} 
                onValueChange={(value) => setFormData({...formData, assignedTo: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Channels */}
          <div className="space-y-3">
            <Label>Marketing Channels</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableChannels.map((channel) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => handleChannelToggle(channel)}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    formData.channels.includes(channel)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted"
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Select the marketing channels this campaign will use
            </p>
          </div>

          {/* Optional Performance Metrics */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ""}
                onChange={(e) => setFormData({...formData, budget: Number(e.target.value) || undefined})}
                placeholder="Campaign budget"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reach">Target Reach</Label>
              <Input
                id="reach"
                type="number"
                value={formData.reach || ""}
                onChange={(e) => setFormData({...formData, reach: Number(e.target.value) || undefined})}
                placeholder="Target audience reach"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engagement">Target Engagement Rate (%)</Label>
              <Input
                id="engagement"
                type="number"
                value={formData.engagement || ""}
                onChange={(e) => setFormData({...formData, engagement: Number(e.target.value) || undefined})}
                placeholder="Target engagement rate"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {campaign ? "Update Campaign" : "Create Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};