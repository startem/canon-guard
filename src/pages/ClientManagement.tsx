import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace, Client } from "@/contexts/WorkspaceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Building2, Plus, Pencil, Trash2, Loader2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FormState {
  name: string;
  industry: string;
  website: string;
  description: string;
}

const empty: FormState = { name: "", industry: "", website: "", description: "" };

export default function ClientManagement() {
  const { clients, currentClient, currentAgency, setCurrentClientId, refreshClients } = useWorkspace();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setDialogOpen(true);
  };

  const openEdit = (c: Client) => {
    setEditing(c);
    setForm({
      name: c.name,
      industry: c.industry ?? "",
      website: c.website ?? "",
      description: c.description ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !currentAgency) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      industry: form.industry.trim() || null,
      website: form.website.trim() || null,
      description: form.description.trim() || null,
    };
    if (editing) {
      const { error } = await supabase.from("clients").update(payload).eq("id", editing.id);
      setSaving(false);
      if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
      toast({ title: "Client updated" });
    } else {
      const { data, error } = await supabase
        .from("clients")
        .insert({ ...payload, agency_id: currentAgency.id, status: "active" })
        .select("id")
        .single();
      setSaving(false);
      if (error) return toast({ title: "Create failed", description: error.message, variant: "destructive" });
      toast({ title: `Added ${payload.name}` });
      if (data?.id) setCurrentClientId(data.id);
    }
    setDialogOpen(false);
    await refreshClients();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("clients").delete().eq("id", deleteTarget.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else toast({ title: `Deleted ${deleteTarget.name}` });
    setDeleteTarget(null);
    await refreshClients();
  };

  return (
    <PageShell>
      <PageHeader
        icon={Building2}
        eyebrow="Workspace"
        title="Clients"
        description={`Manage the client brands in ${currentAgency?.name ?? "your agency"}.`}
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add client
          </Button>
        }
      />

      {clients.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No clients yet"
          description="Add your first client brand to start building its Brand Canon and running audits."
          action={<Button onClick={openCreate}>Add client</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => (
            <Card key={c.id} className="hover:shadow-brand transition-all">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {c.name}
                        {currentClient?.id === c.id && (
                          <Badge variant="secondary" className="gap-1">
                            <Check className="h-3 w-3" /> Active
                          </Badge>
                        )}
                      </div>
                      {c.industry && <div className="text-xs text-muted-foreground">{c.industry}</div>}
                    </div>
                  </div>
                </div>
                {c.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                )}
                {c.website && (
                  <a
                    href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline block truncate"
                  >
                    {c.website}
                  </a>
                )}
                <div className="flex items-center gap-2 pt-2">
                  {currentClient?.id !== c.id && (
                    <Button variant="outline" size="sm" onClick={() => setCurrentClientId(c.id)}>
                      Switch to
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => openEdit(c)} className="gap-1">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(c)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit client" : "Add a new client"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update this brand's details." : "Create a brand workspace to manage and audit."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cm-name">Client name</Label>
              <Input id="cm-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cm-industry">Industry</Label>
              <Input id="cm-industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="SaaS" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cm-web">Website</Label>
              <Input id="cm-web" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://acme.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cm-desc">Description</Label>
              <Textarea id="cm-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What does this brand do?" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editing ? "Save changes" : "Create client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the client and its Brand Canon, audits, and issues. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}
