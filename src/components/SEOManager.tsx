import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Trash2, 
  Search, 
  Target, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react";

interface Keyword {
  id: string;
  keyword: string;
  type: "primary" | "secondary";
  volume: number;
  difficulty: number;
  position?: number;
  status: "tracking" | "ranking" | "needs-work";
}

interface SEOTask {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  category: "technical" | "content" | "links" | "local";
}

interface SEOManagerProps {
  keywords: Keyword[];
  tasks: SEOTask[];
  onUpdateKeywords: (keywords: Keyword[]) => void;
  onUpdateTasks: (tasks: SEOTask[]) => void;
}

export const SEOManager = ({ keywords, tasks, onUpdateKeywords, onUpdateTasks }: SEOManagerProps) => {
  const [newKeyword, setNewKeyword] = useState("");
  const [keywordType, setKeywordType] = useState<"primary" | "secondary">("primary");
  const [isKeywordDialogOpen, setIsKeywordDialogOpen] = useState(false);
  const { toast } = useToast();

  const addKeyword = () => {
    if (!newKeyword.trim()) return;

    const keyword: Keyword = {
      id: Date.now().toString(),
      keyword: newKeyword.trim(),
      type: keywordType,
      volume: Math.floor(Math.random() * 10000) + 100, // Mock data
      difficulty: Math.floor(Math.random() * 100),
      status: "tracking"
    };

    onUpdateKeywords([...keywords, keyword]);
    setNewKeyword("");
    setIsKeywordDialogOpen(false);
    
    toast({
      title: "Keyword Added",
      description: `"${keyword.keyword}" has been added to your keyword list.`,
    });
  };

  const removeKeyword = (id: string) => {
    onUpdateKeywords(keywords.filter(k => k.id !== id));
    toast({
      title: "Keyword Removed",
      description: "Keyword has been removed from tracking.",
    });
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    onUpdateTasks(updatedTasks);
    
    const task = tasks.find(t => t.id === id);
    toast({
      title: task?.completed ? "Task Reopened" : "Task Completed",
      description: task?.title,
    });
  };

  const getKeywordStatusColor = (status: string) => {
    switch (status) {
      case "ranking": return "default";
      case "tracking": return "secondary";
      case "needs-work": return "destructive";
      default: return "outline";
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

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return "text-green-600";
    if (difficulty < 70) return "text-yellow-600";
    return "text-red-600";
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* SEO Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            SEO Performance Overview
          </CardTitle>
          <CardDescription>
            Track your keyword rankings and SEO optimization progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{keywords.length}</div>
              <div className="text-sm text-muted-foreground">Total Keywords</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {keywords.filter(k => k.status === "ranking").length}
              </div>
              <div className="text-sm text-muted-foreground">Ranking Keywords</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
              <div className="text-sm text-muted-foreground">Completed Tasks</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{Math.round(completionPercentage)}%</div>
              <div className="text-sm text-muted-foreground">SEO Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keyword Manager */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Keyword Tracking</CardTitle>
                <CardDescription>
                  Manage and track your target keywords
                </CardDescription>
              </div>
              <Dialog open={isKeywordDialogOpen} onOpenChange={setIsKeywordDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Keyword
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Keyword</DialogTitle>
                    <DialogDescription>
                      Add a new keyword to track its performance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyword">Keyword</Label>
                      <Input
                        id="keyword"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Enter keyword to track"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        value={keywordType}
                        onChange={(e) => setKeywordType(e.target.value as "primary" | "secondary")}
                        className="w-full p-2 border border-input rounded-md bg-background"
                      >
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsKeywordDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addKeyword}>Add Keyword</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {keywords.map((keyword) => (
                <div key={keyword.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{keyword.keyword}</span>
                      <Badge variant={keyword.type === "primary" ? "default" : "secondary"}>
                        {keyword.type}
                      </Badge>
                      <Badge variant={getKeywordStatusColor(keyword.status)}>
                        {keyword.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Volume: {keyword.volume.toLocaleString()}</span>
                      <span className={getDifficultyColor(keyword.difficulty)}>
                        Difficulty: {keyword.difficulty}%
                      </span>
                      {keyword.position && (
                        <span>Position: #{keyword.position}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKeyword(keyword.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {keywords.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No keywords added yet</p>
                  <p className="text-xs">Add keywords to start tracking</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>SEO Optimization Tasks</CardTitle>
                <CardDescription>
                  Technical and content optimization checklist
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{completedTasks}/{tasks.length} Complete</div>
                <Progress value={completionPercentage} className="w-20 h-2 mt-1" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-start gap-3 p-3 border rounded-lg ${
                    task.completed ? "bg-muted/50 opacity-75" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center ${
                      task.completed 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {task.completed && <CheckCircle className="w-3 h-3" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${task.completed ? "line-through" : ""}`}>
                        {task.title}
                      </span>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No SEO tasks defined</p>
                  <p className="text-xs">Tasks will appear here for optimization</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};