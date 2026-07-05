import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/layout/SectionCard";
import { StatCard } from "@/components/layout/StatCard";
import { EmptyState } from "@/components/layout/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Users, UserPlus, Shield, Crown, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useTeamManagement, MemberRole, TeamMember } from "@/hooks/useTeamManagement";

const ROLE_META: Record<MemberRole, { label: string; description: string; variant: "default" | "secondary" | "outline" }> = {
  owner: { label: "Owner", description: "Full control, billing, cannot be removed", variant: "default" },
  admin: { label: "Admin", description: "Manage members, clients, and settings", variant: "secondary" },
  editor: { label: "Editor", description: "Create and edit brand data and audits", variant: "outline" },
  viewer: { label: "Viewer", description: "Read-only access", variant: "outline" },
};

const ASSIGNABLE: MemberRole[] = ["admin", "editor", "viewer"];

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

const UserManagementPage = () => {
  const { currentAgency } = useWorkspace();
  const { members, loading, canManage, updateRole, removeMember, inviteMember } = useTeamManagement();
  const { toast } = useToast();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("editor");
  const [inviting, setInviting] = useState(false);
  const [toRemove, setToRemove] = useState<TeamMember | null>(null);

  const handleInvite = async () => {
    setInviting(true);
    const { error } = await inviteMember(inviteEmail.trim(), inviteRole);
    setInviting(false);
    if (error) {
      toast({ title: "Could not invite", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "Invitation sent", description: `${inviteEmail} was added to ${currentAgency?.name ?? "the agency"}.` });
    setInviteEmail("");
    setInviteRole("editor");
    setInviteOpen(false);
  };

  const handleRole = async (member: TeamMember, role: MemberRole) => {
    const { error } = await updateRole(member.id, role);
    if (error) toast({ title: "Role update failed", description: error, variant: "destructive" });
    else toast({ title: "Role updated", description: `${member.full_name} is now ${ROLE_META[role].label}.` });
  };

  const handleRemove = async () => {
    if (!toRemove) return;
    const { error } = await removeMember(toRemove.id);
    if (error) toast({ title: "Remove failed", description: error, variant: "destructive" });
    else toast({ title: "Member removed", description: `${toRemove.full_name} no longer has access.` });
    setToRemove(null);
  };

  const admins = members.filter((m) => m.role === "owner" || m.role === "admin").length;

  return (
    <PageShell>
      <PageHeader
        icon={Users}
        eyebrow="Workspace"
        title="Team & Access"
        description={
          currentAgency
            ? `Manage who can access ${currentAgency.name} and what they can do.`
            : "Manage workspace members and their roles."
        }
        actions={
          canManage ? (
            <Button onClick={() => setInviteOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite member
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Members" value={loading ? "—" : members.length} icon={Users} tone="primary" />
        <StatCard label="Owners & Admins" value={loading ? "—" : admins} icon={Shield} />
        <StatCard label="Your Access" value={canManage ? "Manager" : "Member"} icon={Crown} hint={canManage ? "can invite & manage" : "read/work access"} />
      </div>

      <SectionCard title="Members" icon={Users} flush contentClassName="px-2 pb-2">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No members yet"
            description="Invite teammates to collaborate on brand governance."
            compact
            action={canManage ? <Button onClick={() => setInviteOpen(true)}><UserPlus className="mr-2 h-4 w-4" />Invite member</Button> : undefined}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => {
                const editable = canManage && m.role !== "owner" && !m.is_self;
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {initials(m.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 font-medium">
                            {m.full_name}
                            {m.is_self && <Badge variant="outline" className="text-xs">You</Badge>}
                          </div>
                          <div className="truncate text-sm text-muted-foreground">{m.email || "—"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {editable ? (
                        <Select value={m.role} onValueChange={(v) => handleRole(m, v as MemberRole)}>
                          <SelectTrigger className="w-[130px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ASSIGNABLE.map((r) => (
                              <SelectItem key={r} value={r}>{ROLE_META[r].label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={ROLE_META[m.role].variant} className="capitalize">
                          {m.role === "owner" && <Crown className="mr-1 h-3 w-3" />}
                          {ROLE_META[m.role].label}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(m.joined_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {editable && (
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setToRemove(m)}>
                          <UserX className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
            <DialogDescription>
              They'll get access to {currentAgency?.name ?? "this workspace"}. Existing users are added immediately; new ones receive an email invite.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="teammate@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as MemberRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE.map((r) => (
                    <SelectItem key={r} value={r}>
                      <span className="font-medium">{ROLE_META[r].label}</span>
                      <span className="text-muted-foreground"> — {ROLE_META[r].description}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
              {inviting ? "Sending…" : "Send invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove confirmation */}
      <AlertDialog open={!!toRemove} onOpenChange={(o) => !o && setToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {toRemove?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will immediately lose access to this workspace and all its clients. This can be undone by inviting them again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
};

export default UserManagementPage;
