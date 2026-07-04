import { useEffect, useState, useCallback } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon, AlertCircle, Loader2, FileSearch } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAgencyMembers } from "@/hooks/useAgencyMembers";
import type { Issue, IssueSeverity, IssueStatus } from "@/hooks/useIssues";

const severityBadge = (s: string) => {
  switch (s) {
    case "critical":
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

const statusBadge = (s: string) => {
  switch (s) {
    case "open":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "in-progress":
      return "bg-warning/10 text-warning border-warning/20";
    case "resolved":
      return "bg-success/10 text-success border-success/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

const UNASSIGNED = "__unassigned__";

export default function IssueDetail() {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const { members } = useAgencyMembers();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!issueId) return;
    setLoading(true);
    const { data, error } = await supabase.from("issues").select("*").eq("id", issueId).maybeSingle();
    if (error || !data) {
      setNotFound(true);
    } else {
      setIssue(data as Issue);
    }
    setLoading(false);
  }, [issueId]);

  useEffect(() => {
    load();
  }, [load]);

  const patch = async (fields: Partial<Issue>, message: string) => {
    if (!issue) return;
    setSaving(true);
    setIssue((prev) => (prev ? { ...prev, ...fields } : prev));
    const { error } = await supabase.from("issues").update(fields).eq("id", issue.id);
    setSaving(false);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      load();
    } else {
      toast({ title: message });
    }
  };

  const assigneeName = (id: string | null | undefined) =>
    members.find((m) => m.user_id === id)?.full_name ?? null;

  if (loading) {
    return (
      <PageShell maxWidth="5xl">
        <Skeleton className="h-24 w-full mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </PageShell>
    );
  }

  if (notFound || !issue) {
    return (
      <PageShell maxWidth="5xl">
        <PageHeader
          icon={AlertCircle}
          eyebrow="Issue"
          title="Issue not found"
          description="This issue may have been resolved and removed, or you don't have access to it."
          actions={
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          }
        />
      </PageShell>
    );
  }

  const dueDate = issue.due_date ? new Date(issue.due_date) : undefined;

  return (
    <PageShell maxWidth="5xl">
      <PageHeader
        icon={AlertCircle}
        eyebrow={`Issue #${issue.id.slice(0, 8)}`}
        title={issue.title}
        meta={
          <>
            <Badge className={severityBadge(issue.severity)}>{issue.severity}</Badge>
            <Badge className={statusBadge(issue.status)}>{issue.status.replace("-", " ")}</Badge>
            {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </>
        }
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Issues
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {issue.description || "No description provided."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Category</h4>
                  <p className="text-sm text-muted-foreground">{issue.category || "—"}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Detected</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Source</h4>
                  <p className="text-sm text-muted-foreground">
                    {issue.audit_id ? "Automated AI audit" : "Manually created"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Assignee</h4>
                  <p className="text-sm text-muted-foreground">
                    {assigneeName(issue.assignee) ?? "Unassigned"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {issue.audit_id && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSearch className="h-4 w-4" /> Linked Audit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  This issue was auto-generated from an AI brand audit finding.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/audit-details/${issue.category ?? "brand-consistency"}`)}
                >
                  View audit findings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={issue.status}
                  onValueChange={(v: IssueStatus) =>
                    patch({ status: v }, `Status changed to ${v.replace("-", " ")}`)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Severity</label>
                <Select
                  value={issue.severity}
                  onValueChange={(v: IssueSeverity) => patch({ severity: v }, "Severity updated")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Assignee</label>
                <Select
                  value={issue.assignee ?? UNASSIGNED}
                  onValueChange={(v) => {
                    const assignee = v === UNASSIGNED ? null : v;
                    patch(
                      { assignee },
                      assignee ? `Assigned to ${assigneeName(assignee)}` : "Unassigned"
                    );
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                    {members.map((m) => (
                      <SelectItem key={m.user_id} value={m.user_id}>
                        {m.full_name}
                      </SelectItem>
                    ))}
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
                      onSelect={(d) =>
                        patch(
                          { due_date: d ? d.toISOString() : null },
                          d ? `Due ${format(d, "PPP")}` : "Due date cleared"
                        )
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
