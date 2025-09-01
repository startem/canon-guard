import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Phone, 
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Settings,
  Eye,
  UserCheck
} from 'lucide-react';
import { SearchAndFilter } from './SearchAndFilter';
import { BulkActions } from './BulkActions';
import { EmptyState, TeamEmptyState } from './EmptyStates';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  phone?: string;
  department?: string;
  lastActive: string;
  permissions: string[];
  createdAt: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
  permissions: string[];
  createdAt: string;
}

interface UserManagementProps {
  users: User[];
  teams: Team[];
  onUserUpdate: (user: User) => void;
  onUserDelete: (userId: string) => void;
  onTeamUpdate: (team: Team) => void;
  onTeamDelete: (teamId: string) => void;
}

const roles = [
  { value: 'admin', label: 'Administrator', description: 'Full access to all features' },
  { value: 'manager', label: 'Manager', description: 'Manage teams and content' },
  { value: 'editor', label: 'Editor', description: 'Create and edit content' },
  { value: 'viewer', label: 'Viewer', description: 'View-only access' }
];

const permissions = [
  'brand_read', 'brand_write', 'brand_delete',
  'audit_read', 'audit_write', 'audit_run',
  'analytics_read', 'analytics_export',
  'team_read', 'team_write', 'team_manage',
  'settings_read', 'settings_write'
];

export const UserManagement = ({
  users,
  teams,
  onUserUpdate,
  onUserDelete,
  onTeamUpdate,
  onTeamDelete
}: UserManagementProps) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>(teams);
  const [activeTab, setActiveTab] = useState('users');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const { toast } = useToast();

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(filteredUsers);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSelect = (user: User, selected: boolean) => {
    if (selected) {
      setSelectedUsers(prev => [...prev, user]);
    } else {
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  const handleBulkAction = async (actionId: string, selectedItems: User[]) => {
    switch (actionId) {
      case 'deactivate':
        selectedItems.forEach(user => {
          onUserUpdate({ ...user, status: 'inactive' });
        });
        break;
      case 'activate':
        selectedItems.forEach(user => {
          onUserUpdate({ ...user, status: 'active' });
        });
        break;
      case 'delete':
        selectedItems.forEach(user => {
          onUserDelete(user.id);
        });
        break;
      case 'export':
        // Export functionality
        console.log('Exporting users:', selectedItems);
        break;
    }
  };

  const handleInviteUser = (inviteData: any) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: inviteData.name,
      email: inviteData.email,
      role: inviteData.role,
      status: 'pending',
      phone: inviteData.phone,
      department: inviteData.department,
      lastActive: new Date().toISOString(),
      permissions: getPermissionsByRole(inviteData.role),
      createdAt: new Date().toISOString()
    };
    
    onUserUpdate(newUser);
    setShowInviteDialog(false);
    toast({
      title: "User invited",
      description: `Invitation sent to ${inviteData.email}`
    });
  };

  const getPermissionsByRole = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return permissions;
      case 'manager':
        return permissions.filter(p => !p.includes('delete'));
      case 'editor':
        return permissions.filter(p => p.includes('read') || p.includes('write'));
      case 'viewer':
        return permissions.filter(p => p.includes('read'));
      default:
        return [];
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'editor': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const bulkActions = [
    {
      id: 'activate',
      label: 'Activate',
      icon: Unlock,
      variant: 'default' as const
    },
    {
      id: 'deactivate',
      label: 'Deactivate',
      icon: Lock,
      variant: 'secondary' as const,
      requiresConfirmation: true
    },
    {
      id: 'export',
      label: 'Export',
      icon: Eye,
      variant: 'outline' as const
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive' as const,
      requiresConfirmation: true,
      confirmationTitle: 'Delete Users',
      confirmationDescription: 'This will permanently delete the selected users and all their data.'
    }
  ];

  const userFilterConfigs = [
    {
      key: 'role',
      label: 'Role',
      type: 'select' as const,
      options: roles.map(r => ({ label: r.label, value: r.value }))
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' }
      ]
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select' as const,
      options: [
        { label: 'Marketing', value: 'marketing' },
        { label: 'Design', value: 'design' },
        { label: 'Product', value: 'product' },
        { label: 'Engineering', value: 'engineering' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User & Team Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, permissions, and team assignments
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowTeamDialog(true)} variant="outline">
                <Users className="w-4 h-4 mr-2" />
                New Team
              </Button>
              <Button onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users ({users.length})
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Teams ({teams.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {users.length > 0 ? (
            <>
              <SearchAndFilter
                data={users}
                searchKeys={['name', 'email', 'department']}
                filterConfigs={userFilterConfigs}
                onFilteredData={setFilteredUsers}
                placeholder="Search users..."
              />

              <BulkActions
                selectedItems={selectedUsers}
                totalItems={filteredUsers.length}
                onSelectAll={handleSelectAll}
                onClearSelection={() => setSelectedUsers([])}
                actions={bulkActions}
                onActionExecute={handleBulkAction}
              />

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedUsers.some(u => u.id === user.id)}
                              onChange={(e) => handleUserSelect(user, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(user.lastActive).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="w-4 h-4 mr-2" />
                                  Permissions
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => onUserDelete(user.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <TeamEmptyState onInvite={() => setShowInviteDialog(true)} />
          )}
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.map((team) => (
                <Card key={team.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {team.name}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingTeam(team)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Team
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onTeamDelete(team.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardTitle>
                    <CardDescription>{team.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Members</label>
                        <div className="text-lg font-semibold">{team.members.length}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Permissions</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {team.permissions.slice(0, 3).map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))}
                          {team.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{team.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No teams created"
              description="Create teams to organize users and manage permissions efficiently."
              action={{
                label: 'Create team',
                onClick: () => setShowTeamDialog(true)
              }}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Invite User Dialog */}
      <InviteUserDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onInvite={handleInviteUser}
      />

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={() => setEditingUser(null)}
          onSave={(updatedUser) => {
            onUserUpdate(updatedUser);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

// Invite User Dialog Component
interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (data: any) => void;
}

const InviteUserDialog = ({ open, onOpenChange, onInvite }: InviteUserDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer',
    phone: '',
    department: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
    setFormData({ name: '', email: '', role: 'viewer', phone: '', department: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
          <DialogDescription>
            Send an invitation to join your brand management platform
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit User Dialog Component
interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: User) => void;
}

const EditUserDialog = ({ user, open, onOpenChange, onSave }: EditUserDialogProps) => {
  const [formData, setFormData] = useState(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Select value={formData.department || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border rounded-md">
              {permissions.map(permission => (
                <div key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`perm-${permission}`}
                    checked={formData.permissions.includes(permission)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          permissions: [...prev.permissions, permission] 
                        }));
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          permissions: prev.permissions.filter(p => p !== permission) 
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={`perm-${permission}`} className="text-sm">
                    {permission.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <UserCheck className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};