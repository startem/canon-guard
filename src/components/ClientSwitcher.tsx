import { useState } from "react";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ChevronsUpDown, Plus, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ClientSwitcher() {
  const { clients, currentClient, setCurrentClientId, currentAgency, refreshClients } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!currentAgency || !name.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("clients")
      .insert({ agency_id: currentAgency.id, name: name.trim(), industry, website })
      .select("id")
      .single();
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Added client "${name}"`);
    setName(""); setIndustry(""); setWebsite("");
    setOpen(false);
    await refreshClients();
    if (data?.id) setCurrentClientId(data.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 min-w-[180px] justify-between">
            <span className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{currentClient?.name ?? "Select client"}</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 bg-popover z-50">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {currentAgency?.name ?? "Workspace"} · Clients
          </DropdownMenuLabel>
          {clients.length === 0 && (
            <div className="px-2 py-3 text-sm text-muted-foreground">No clients yet.</div>
          )}
          {clients.map((c) => (
            <DropdownMenuItem key={c.id} onClick={() => setCurrentClientId(c.id)} className="gap-2">
              <Check className={`h-4 w-4 ${currentClient?.id === c.id ? "opacity-100" : "opacity-0"}`} />
              <span className="truncate">{c.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)} className="gap-2 text-primary">
            <Plus className="h-4 w-4" /> Add client
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new client brand</DialogTitle>
            <DialogDescription>Create a brand workspace to manage and audit.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="c-name">Client name</Label>
              <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-industry">Industry</Label>
              <Input id="c-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="SaaS" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-web">Website</Label>
              <Input id="c-web" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://acme.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving || !name.trim()}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}