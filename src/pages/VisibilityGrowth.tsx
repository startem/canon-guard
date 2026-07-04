import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, TrendingUp, BarChart3, Plus, CalendarIcon, CheckCircle, XCircle, Wand2, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SEOAction {
  id: string;
  action: string;
  completed: boolean;
}

interface Campaign {
  id: string;
  title: string;
  channel: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
}

const initialSEOActions: SEOAction[] = [
  { id: '1', action: 'Optimize meta titles and descriptions', completed: true },
  { id: '2', action: 'Improve page load speed', completed: false },
  { id: '3', action: 'Add structured data markup', completed: false },
  { id: '4', action: 'Optimize image alt tags', completed: true },
  { id: '5', action: 'Create XML sitemap', completed: true },
  { id: '6', action: 'Fix broken internal links', completed: false }
];

const initialCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Q1 Product Launch Campaign',
    channel: 'Social Media, Email, PR',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    status: 'completed'
  },
  {
    id: '2',
    title: 'Brand Awareness Initiative',
    channel: 'Content Marketing, Influencer',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-31'),
    status: 'active'
  }
];

export function VisibilityGrowth() {
  const [keywords, setKeywords] = useState('brand management, digital transformation, business strategy');
  const [executeDate, setExecuteDate] = useState<Date>();
  const [seoActions, setSeoActions] = useState<SEOAction[]>(initialSEOActions);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [gaConnected, setGaConnected] = useState(true);
  const [gscConnected, setGscConnected] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    channel: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });
  const { toast } = useToast();

  const handleSEOActionToggle = (actionId: string) => {
    setSeoActions(prev => prev.map(action =>
      action.id === actionId ? { ...action, completed: !action.completed } : action
    ));
  };

  const generateSEOPlan = () => {
    toast({ 
      title: "SEO Plan Generated", 
      description: "AI-powered SEO recommendations have been added to your plan." 
    });
  };

  const generateContentPlan = () => {
    const aiCampaign: Campaign = {
      id: Date.now().toString(),
      title: 'AI-Generated Content Strategy',
      channel: 'Blog, Social Media, Email',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'planning'
    };
    
    setCampaigns(prev => [...prev, aiCampaign]);
    toast({ 
      title: "Content Plan Generated", 
      description: "AI-powered content campaign has been added to your plan." 
    });
  };

  const addCampaign = () => {
    if (!newCampaign.title || !newCampaign.startDate || !newCampaign.endDate) return;
    
    const campaign: Campaign = {
      id: Date.now().toString(),
      title: newCampaign.title,
      channel: newCampaign.channel,
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate,
      status: 'planning'
    };
    
    setCampaigns(prev => [...prev, campaign]);
    setNewCampaign({ title: '', channel: '', startDate: undefined, endDate: undefined });
    setIsDialogOpen(false);
    toast({ title: "Campaign added successfully" });
  };

  const getStatusBadge = (status: Campaign['status']) => {
    const statusConfig = {
      planning: { color: 'bg-blue-500', text: 'Planning' },
      active: { color: 'bg-green-500', text: 'Active' },
      completed: { color: 'bg-gray-500', text: 'Completed' }
    };
    
    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-white hover:${config.color}/90`}>
        {config.text}
      </Badge>
    );
  };

  return (
    <PageShell>
      <PageHeader
        icon={Rocket}
        eyebrow="Growth"
        title="Visibility & Growth"
        description="Plan and execute strategies to increase brand visibility and drive growth."
      />

      <div className="grid gap-6 lg:grid-cols-3">
          {/* SEO Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-primary" />
                <span>SEO Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="keywords">Target Keywords</Label>
                <Textarea
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter target keywords separated by commas"
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Technical SEO Actions</Label>
                <div className="space-y-2 mt-2">
                  {seoActions.map((action) => (
                    <div key={action.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={action.completed}
                        onCheckedChange={() => handleSEOActionToggle(action.id)}
                      />
                      <span className={cn(
                        "text-sm",
                        action.completed ? "line-through text-muted-foreground" : "text-foreground"
                      )}>
                        {action.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Execution Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !executeDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {executeDate ? format(executeDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={executeDate}
                      onSelect={setExecuteDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Button 
                onClick={generateSEOPlan} 
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate SEO Plan
              </Button>
            </CardContent>
          </Card>

          {/* Content & PR Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Content & PR Plan</span>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Campaign</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Campaign Title</Label>
                        <Input
                          id="title"
                          value={newCampaign.title}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter campaign title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="channel">Channel</Label>
                        <Input
                          id="channel"
                          value={newCampaign.channel}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, channel: e.target.value }))}
                          placeholder="e.g., Social Media, Email, PR"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !newCampaign.startDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newCampaign.startDate ? format(newCampaign.startDate, "PPP") : "Start date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={newCampaign.startDate}
                                onSelect={(date) => setNewCampaign(prev => ({ ...prev, startDate: date }))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !newCampaign.endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newCampaign.endDate ? format(newCampaign.endDate, "PPP") : "End date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={newCampaign.endDate}
                                onSelect={(date) => setNewCampaign(prev => ({ ...prev, endDate: date }))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addCampaign} className="bg-primary hover:bg-primary/90">
                        Add Campaign
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{campaign.title}</h4>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{campaign.channel}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(campaign.startDate, "MMM dd")} - {format(campaign.endDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={generateContentPlan} 
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Plan
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Analytics Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Google Analytics 4</Label>
                <div className="flex items-center justify-between mt-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    {gaConnected ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {gaConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={gaConnected ? "outline" : "default"}
                    onClick={() => setGaConnected(!gaConnected)}
                  >
                    {gaConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>Google Search Console</Label>
                <div className="flex items-center justify-between mt-2 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    {gscConnected ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {gscConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={gscConnected ? "outline" : "default"}
                    onClick={() => setGscConnected(!gscConnected)}
                  >
                    {gscConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium text-sm mb-2">Integration Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data Collection</span>
                    <span className={gaConnected ? 'text-green-600' : 'text-red-600'}>
                      {gaConnected ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Search Performance</span>
                    <span className={gscConnected ? 'text-green-600' : 'text-red-600'}>
                      {gscConnected ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Sync</span>
                    <span className="text-muted-foreground">
                      {gaConnected || gscConnected ? '2 hours ago' : 'Never'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}