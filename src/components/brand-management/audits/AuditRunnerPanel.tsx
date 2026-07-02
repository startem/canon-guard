import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import {
  Play,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Sparkles,
} from "lucide-react";
import { useAuditRunner, AuditFinding } from "@/hooks/useAuditRunner";
import { formatDistanceToNow } from "date-fns";

const severityMeta = (severity: string) => {
  switch (severity) {
    case "critical":
      return { icon: XCircle, cls: "bg-destructive/10 text-destructive border-destructive/20" };
    case "high":
      return { icon: AlertTriangle, cls: "bg-destructive/10 text-destructive border-destructive/20" };
    case "medium":
      return { icon: AlertCircle, cls: "bg-warning/10 text-warning border-warning/20" };
    default:
      return { icon: Info, cls: "bg-primary/10 text-primary border-primary/20" };
  }
};

const scoreColor = (score: number) =>
  score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";

interface Props {
  auditType: string;
  title: string;
  description: string;
  placeholder?: string;
}

export const AuditRunnerPanel = ({ auditType, title, description, placeholder }: Props) => {
  const { latestAudit, findings, loading, running, error, clientId, runAudit } =
    useAuditRunner(auditType);
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  const handleRun = async () => {
    const res = await runAudit({ content, url });
    if (res.ok) {
      toast({ title: "Audit complete", description: "Results updated from the latest run." });
      setContent("");
      setUrl("");
    } else {
      toast({ title: "Audit failed", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Run panel */}
      <Card className="bg-gradient-glow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-primary" />
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!clientId && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No client selected</AlertTitle>
              <AlertDescription>
                Choose a client in the top navigation to run a real audit against its Brand Canon.
              </AlertDescription>
            </Alert>
          )}
          <div>
            <label className="text-sm font-medium mb-1 block">Content to audit</label>
            <Textarea
              placeholder={placeholder ?? "Paste the copy, asset description, or material to audit against the brand canon…"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              disabled={running || !clientId}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Reference URL (optional)</label>
            <Input
              placeholder="https://example.com/page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={running || !clientId}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="hero" onClick={handleRun} disabled={running || !clientId || (!content && !url)}>
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running AI audit…
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run AI Audit
                </>
              )}
            </Button>
            {latestAudit?.completed_at && (
              <span className="text-sm text-muted-foreground">
                Last run {formatDistanceToNow(new Date(latestAudit.completed_at), { addSuffix: true })}
              </span>
            )}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Latest results */}
      {loading ? (
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : latestAudit ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Latest Result</CardTitle>
                  <CardDescription>{latestAudit.summary}</CardDescription>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${scoreColor(latestAudit.score ?? 0)}`}>
                    {latestAudit.score ?? 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">Alignment score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={latestAudit.score ?? 0} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Findings
                <Badge variant="secondary">{findings.length}</Badge>
              </CardTitle>
              <CardDescription>AI-detected issues measured against the brand canon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {findings.length === 0 ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  No issues detected in the latest run.
                </div>
              ) : (
                findings.map((f: AuditFinding) => {
                  const meta = severityMeta(f.severity);
                  const Icon = meta.icon;
                  return (
                    <div key={f.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{f.title}</span>
                        <Badge className={meta.cls}>{f.severity}</Badge>
                        {f.category && <Badge variant="outline">{f.category}</Badge>}
                      </div>
                      {f.description && (
                        <p className="text-sm text-muted-foreground mb-2">{f.description}</p>
                      )}
                      {f.recommendation && (
                        <p className="text-sm">
                          <span className="font-medium">Recommendation: </span>
                          {f.recommendation}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No audits run yet</h3>
            <p className="text-muted-foreground">
              Paste content above and run your first AI audit for this client.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
