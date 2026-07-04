import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowRight, ArrowLeft, Building2, Globe, Target, TrendingUp, CheckCircle, Upload, X, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const industries = [
  "Technology", "Healthcare", "Finance", "Retail", "Manufacturing", 
  "Education", "Real Estate", "Food & Beverage", "Automotive", "Other"
];

const regions = [
  "North America", "Europe", "Asia Pacific", "Latin America", 
  "Middle East", "Africa", "Australia"
];

const languages = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese",
  "Chinese", "Japanese", "Korean", "Arabic", "Russian"
];

const goals = [
  "Brand Refresh", "New Product Launch", "Market Expansion", "Digital Transformation",
  "Crisis Management", "Competitive Positioning", "Customer Experience", "Internal Alignment"
];

// Schema for each step
const step1Schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Please select an industry"),
  mission: z.string().min(10, "Mission should be at least 10 characters")
});

const step2Schema = z.object({
  websiteUrls: z.array(z.string().url("Please enter valid URLs")),
  documents: z.array(z.string())
});

const step3Schema = z.object({
  competitors: z.array(z.string().min(1)),
  targetRegions: z.array(z.string()),
  targetLanguages: z.array(z.string())
});

const step4Schema = z.object({
  brandHealthScore: z.number().min(1).max(100),
  shareOfVoice: z.number().min(1).max(100),
  otherMetrics: z.string().optional()
});

const step5Schema = z.object({
  primaryGoals: z.array(z.string()).min(1, "Select at least one primary goal"),
  secondaryGoals: z.array(z.string())
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;
type Step5Data = z.infer<typeof step5Schema>;

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [onboardingData, setOnboardingData] = useState({
    step1: {} as Step1Data,
    step2: { websiteUrls: [""], documents: [] } as Step2Data,
    step3: { competitors: [""], targetRegions: [], targetLanguages: [] } as Step3Data,
    step4: { brandHealthScore: 75, shareOfVoice: 50 } as Step4Data,
    step5: { primaryGoals: [], secondaryGoals: [] } as Step5Data
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleStepComplete = (stepNumber: number, data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [`step${stepNumber}`]: data
    }));

    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps(prev => [...prev, stepNumber]);
    }

    if (stepNumber < totalSteps) {
      setCurrentStep(stepNumber + 1);
    } else {
      // Complete onboarding
      toast({
        title: "Onboarding Complete!",
        description: "Welcome to your Brand Management Platform. Let's start building your brand strategy."
      });
      navigate("/");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <PageShell maxWidth="5xl">
        {/* Progress Header */}
        <div className="space-y-4">
          <PageHeader
            icon={Rocket}
            eyebrow="Setup"
            title="Brand Onboarding"
            description="Let's set up your brand management platform."
            meta={
              <Badge variant="secondary" className="text-sm">
                Step {currentStep} of {totalSteps}
              </Badge>
            }
          />
          <Progress value={progress} className="w-full h-2" />
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <Step1 
            data={onboardingData.step1}
            onComplete={(data) => handleStepComplete(1, data)}
            onBack={handleBack}
          />
        )}
        {currentStep === 2 && (
          <Step2 
            data={onboardingData.step2}
            onComplete={(data) => handleStepComplete(2, data)}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <Step3 
            data={onboardingData.step3}
            onComplete={(data) => handleStepComplete(3, data)}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && (
          <Step4 
            data={onboardingData.step4}
            onComplete={(data) => handleStepComplete(4, data)}
            onBack={handleBack}
          />
        )}
        {currentStep === 5 && (
          <Step5 
            data={onboardingData.step5}
            onComplete={(data) => handleStepComplete(5, data)}
            onBack={handleBack}
          />
        )}
    </PageShell>
  );
};

// Step 1: Company Information
const Step1 = ({ data, onComplete, onBack }: {
  data: Step1Data;
  onComplete: (data: Step1Data) => void;
  onBack: () => void;
}) => {
  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: data
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <CardTitle>Company Information</CardTitle>
        </div>
        <CardDescription>
          Tell us about your company and mission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onComplete)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mission Statement</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your company's mission and core purpose..."
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack} disabled>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Step 2: Assets & Documents
const Step2 = ({ data, onComplete, onBack }: {
  data: Step2Data;
  onComplete: (data: Step2Data) => void;
  onBack: () => void;
}) => {
  const [websiteUrls, setWebsiteUrls] = useState(data.websiteUrls || [""]);
  const [documents, setDocuments] = useState(data.documents || []);

  const addWebsiteUrl = () => {
    setWebsiteUrls([...websiteUrls, ""]);
  };

  const removeWebsiteUrl = (index: number) => {
    const updated = websiteUrls.filter((_, i) => i !== index);
    setWebsiteUrls(updated);
  };

  const updateWebsiteUrl = (index: number, value: string) => {
    const updated = [...websiteUrls];
    updated[index] = value;
    setWebsiteUrls(updated);
  };

  const handleSubmit = () => {
    const validUrls = websiteUrls.filter(url => url.trim() !== "");
    onComplete({
      websiteUrls: validUrls,
      documents
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <CardTitle>Assets & Brand Documents</CardTitle>
        </div>
        <CardDescription>
          Help us understand your current brand presence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Website URLs</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Add your main website and any related domains
          </p>
          {websiteUrls.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={url}
                onChange={(e) => updateWebsiteUrl(index, e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
              {websiteUrls.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeWebsiteUrl(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addWebsiteUrl}>
            Add Another URL
          </Button>
        </div>

        <div>
          <Label className="text-base font-medium">Brand Documents</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Upload existing brand guidelines, logos, and style documents
          </p>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOC, JPG, PNG up to 10MB each
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="button" onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 3: Market Context
const Step3 = ({ data, onComplete, onBack }: {
  data: Step3Data;
  onComplete: (data: Step3Data) => void;
  onBack: () => void;
}) => {
  const [competitors, setCompetitors] = useState(data.competitors || [""]);
  const [selectedRegions, setSelectedRegions] = useState(data.targetRegions || []);
  const [selectedLanguages, setSelectedLanguages] = useState(data.targetLanguages || []);

  const addCompetitor = () => {
    setCompetitors([...competitors, ""]);
  };

  const removeCompetitor = (index: number) => {
    const updated = competitors.filter((_, i) => i !== index);
    setCompetitors(updated);
  };

  const updateCompetitor = (index: number, value: string) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleSubmit = () => {
    const validCompetitors = competitors.filter(comp => comp.trim() !== "");
    onComplete({
      competitors: validCompetitors,
      targetRegions: selectedRegions,
      targetLanguages: selectedLanguages
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <CardTitle>Market Context</CardTitle>
        </div>
        <CardDescription>
          Define your competitive landscape and target markets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Key Competitors</Label>
          <p className="text-sm text-muted-foreground mb-3">
            List your main competitors for brand monitoring
          </p>
          {competitors.map((competitor, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={competitor}
                onChange={(e) => updateCompetitor(index, e.target.value)}
                placeholder="Competitor name"
              />
              {competitors.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeCompetitor(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addCompetitor}>
            Add Competitor
          </Button>
        </div>

        <div>
          <Label className="text-base font-medium">Target Regions</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Select the geographic markets you operate in
          </p>
          <div className="grid grid-cols-2 gap-2">
            {regions.map((region) => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox
                  id={region}
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={() => toggleRegion(region)}
                />
                <Label htmlFor={region} className="text-sm">
                  {region}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Target Languages</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Select languages for brand monitoring and content analysis
          </p>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={language}
                  checked={selectedLanguages.includes(language)}
                  onCheckedChange={() => toggleLanguage(language)}
                />
                <Label htmlFor={language} className="text-sm">
                  {language}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="button" onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Step 4: Success Metrics
const Step4 = ({ data, onComplete, onBack }: {
  data: Step4Data;
  onComplete: (data: Step4Data) => void;
  onBack: () => void;
}) => {
  const form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: data
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <CardTitle>Success Metrics</CardTitle>
        </div>
        <CardDescription>
          Define your target goals and key performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onComplete)} className="space-y-6">
            <FormField
              control={form.control}
              name="brandHealthScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Brand Health Score (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    What brand health score would you like to achieve?
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shareOfVoice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Share of Voice (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    What percentage of market conversation would you like to capture?
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherMetrics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Success Metrics (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe any other KPIs or success metrics important to your brand..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Step 5: Goals & Objectives
const Step5 = ({ data, onComplete, onBack }: {
  data: Step5Data;
  onComplete: (data: Step5Data) => void;
  onBack: () => void;
}) => {
  const [primaryGoals, setPrimaryGoals] = useState(data.primaryGoals || []);
  const [secondaryGoals, setSecondaryGoals] = useState(data.secondaryGoals || []);

  const togglePrimaryGoal = (goal: string) => {
    setPrimaryGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const toggleSecondaryGoal = (goal: string) => {
    setSecondaryGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleSubmit = () => {
    if (primaryGoals.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one primary goal.",
        variant: "destructive"
      });
      return;
    }

    onComplete({
      primaryGoals,
      secondaryGoals
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          <CardTitle>Goals & Objectives</CardTitle>
        </div>
        <CardDescription>
          Select your primary and secondary brand management goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Primary Goals</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Choose your main brand objectives (select multiple)
          </p>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => (
              <div key={goal}>
                <Button
                  type="button"
                  variant={primaryGoals.includes(goal) ? "default" : "outline"}
                  className="w-full h-auto p-3 text-left justify-start"
                  onClick={() => togglePrimaryGoal(goal)}
                >
                  {goal}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Secondary Goals (Optional)</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Select additional objectives to support your primary goals
          </p>
          <div className="grid grid-cols-2 gap-3">
            {goals.filter(goal => !primaryGoals.includes(goal)).map((goal) => (
              <div key={goal}>
                <Button
                  type="button"
                  variant={secondaryGoals.includes(goal) ? "secondary" : "outline"}
                  className="w-full h-auto p-3 text-left justify-start"
                  onClick={() => toggleSecondaryGoal(goal)}
                >
                  {goal}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button type="button" onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Complete Setup
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingWizard;