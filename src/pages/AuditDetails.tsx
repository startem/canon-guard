import { useEffect, useState, useCallback } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/layout/EmptyState";
import { ArrowLeft, ClipboardCheck, History } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { AuditRecord, AuditFinding } from "@/hooks/useAuditRunner";

const AUDIT_LABELS: Record<string, string> = {
  "brand-consistency": "Brand Consistency",
  content: "Content",
  "visual-identity": "Visual Identity",
  "brand-perception": "Brand Perception",
  "social-media": "Social Media",
  "legal-compliance": "Legal Compliance",
  "competitor-analysis": "Competitor Analysis",
  "customer-experience": "Customer Experience",
  "digital-asset": "Digital Asset",
  "employee-brand": "Employee Brand Alignment",
};

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

export default function AuditDetails() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { currentClient } = useWorkspace();
  const clientId = currentClient?.id ?? null;

  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = AUDIT_LABELS[category ?? ""] ?? "Brand";

  const loadAudits = useCallback(async () => {
    if (!clientId || !category) {
      setAudits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("audits")
      .select("*")
      .eq("client_id", clientId)
      .eq("type", category)
      .order("created_at", { ascending: false });
    const list = (data ?? []) as AuditRecord[];
    setAudits(list);
    setSelectedId((prev) => (prev && list.some((a) => a.id === prev) ? prev : list[0]?.id ?? null));
    setLoading(false);
  }, [clientId, category]);

  useEffect(() => {
    loadAudits();
  }, [loadAudits]);

  useEffect(() => {
    if (!selectedId) {
      setFindings([]);
      return;
    }
    supabase
      .from("audit_findings")
      .select("*")
      .eq("audit_id", selectedId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setFindings((data ?? []) as AuditFinding[]));
  }, [selectedId]);

  const updateFindingStatus = async (id: string, status: string) => {
    setFindings((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));
    const { error } = await supabase.from("audit_findings").update({ status }).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else toast({ title: `Finding marked ${status}` });
  };

  const selected = audits.find((a) => a.id === selectedId) ?? null;
  const openFindings = findings.filter((f) => f.status === "open").length;

  return (
    <PageShell>
      <PageHeader
        icon={ClipboardCheck}
        eyebrow="Analysis"
        title={`${categoryName} Audit Details`}
        description={
          currentClient
            ? `Audit history and findings for ${currentClient.name}.`
            : "Detailed compliance analysis and issue management."
        }
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : !clientId ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Select a client"
          description="Choose a client from the switcher to view its audit history and findings."
        />
      ) : audits.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No audits run yet"
          description={`Run a ${categoryName} audit from the dashboard to see findings and history here.`}
          action={<Button onClick={() => navigate("/")}>Go to dashboard</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Latest Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{selected?.score ?? "—"}%</div>
                <p className="text-sm text-muted-foreground">
                  {selected ? new Date(selected.created_at).toLocaleDateString() : ""}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{audits.length}</div>
                <p className="text-sm text-muted-foreground">Audits in this category</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Open Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{openFindings}</div>
                <p className="text-sm text-muted-foreground">In selected run</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Findings</CardTitle>
                {selected?.summary && (
                  <p className="text-sm text-muted-foreground pt-1">{selected.summary}</p>
                )}
              </CardHeader>
              <CardContent>
                {findings.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No findings recorded in this run — the material was fully on brand.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Finding</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {findings.map((f) => (
                        <TableRow key={f.id}>
                          <TableCell className="max-w-md">
                            <div className="font-medium">{f.title}</div>
                            {f.recommendation && (
                              <div className="text-sm text-muted-foreground mt-1">
                                Fix: {f.recommendation}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={severityBadge(f.severity)}>{f.severity}</Badge>
                          </TableCell>
                          <TableCell>
                            <Select value={f.status} onValueChange={(v) => updateFindingStatus(f.id, v)}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-4 w-4" /> Audit History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {audits.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      a.id === selectedId
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{a.score ?? "—"}%</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{a.title}</div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </PageShell>
  );
}
