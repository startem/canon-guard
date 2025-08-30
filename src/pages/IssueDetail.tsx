import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, Paperclip, Send, AlertTriangle, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  auditSource: string;
  reportedBy: string;
  dateDetected: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved";
  assignee?: string;
  dueDate?: Date;
  relatedAssets: string[];
  comments: Comment[];
}

const mockIssue: Issue = {
  id: "ISS-001",
  title: "Logo placement violates brand guidelines",
  description: "The company logo on the homepage hero section does not maintain the required 20px margin from other elements, which violates our brand positioning guidelines.",
  auditSource: "Visual Identity Audit",
  reportedBy: "Brand Audit System",
  dateDetected: "2024-01-15",
  priority: "medium",
  status: "open",
  relatedAssets: ["homepage-hero.jpg", "mobile-hero.jpg", "tablet-hero.jpg"],
  comments: [
    {
      id: "1",
      author: "Sarah Wilson",
      content: "I've reviewed the assets and confirmed the spacing issue. The logo needs to be repositioned to maintain proper brand guidelines.",
      timestamp: "2024-01-16T10:30:00Z"
    },
    {
      id: "2", 
      author: "Mike Chen",
      content: "Can we also check if this affects other marketing materials? Want to ensure consistency across all touchpoints.",
      timestamp: "2024-01-16T14:15:00Z"
    }
  ]
};

export default function IssueDetail() {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue>(mockIssue);
  const [newComment, setNewComment] = useState("");
  const [dueDate, setDueDate] = useState<Date>();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "default";
      case "in_progress": return "secondary";
      case "open": return "destructive";
      default: return "outline";
    }
  };

  const handleStatusChange = (newStatus: "open" | "in_progress" | "resolved") => {
    setIssue(prev => ({ ...prev, status: newStatus }));
    toast({
      title: "Status Updated",
      description: `Issue status changed to ${newStatus.replace('_', ' ')}`
    });
  };

  const handleAssigneeChange = (assignee: string) => {
    setIssue(prev => ({ ...prev, assignee }));
    toast({
      title: "Issue Assigned",
      description: `Issue assigned to ${assignee}`
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: "Current User",
      content: newComment,
      timestamp: new Date().toISOString()
    };

    setIssue(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));
    setNewComment("");
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the issue"
    });
  };

  const handleDueDateChange = (date: Date | undefined) => {
    setDueDate(date);
    setIssue(prev => ({ ...prev, dueDate: date }));
    if (date) {
      toast({
        title: "Due Date Set",
        description: `Due date set to ${format(date, "PPP")}`
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Issues
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{issue.title}</h1>
              <Badge variant={getPriorityColor(issue.priority)}>
                {issue.priority} priority
              </Badge>
              <Badge variant={getStatusColor(issue.status)}>
                {issue.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Issue #{issue.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Details */}
            <Card>
              <CardHeader>
                <CardTitle>Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Audit Source</h4>
                    <p className="text-sm text-muted-foreground">{issue.auditSource}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Reported By</h4>
                    <p className="text-sm text-muted-foreground">{issue.reportedBy}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Date Detected</h4>
                    <p className="text-sm text-muted-foreground">{issue.dateDetected}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Priority</h4>
                    <Badge variant={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Assets */}
            <Card>
              <CardHeader>
                <CardTitle>Related Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {issue.relatedAssets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium">{asset}</span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Thread */}
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Comments */}
                <div className="space-y-4">
                  {issue.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comment.timestamp), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="border-t pt-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={handleAddComment}>
                          <Send className="h-4 w-4 mr-1" />
                          Comment
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                          Attach
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={issue.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Assignee</label>
                  <Select value={issue.assignee || ""} onValueChange={handleAssigneeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                      <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                      <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Set due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={handleDueDateChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full mb-2">Save Changes</Button>
                  <Button variant="outline" className="w-full">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
