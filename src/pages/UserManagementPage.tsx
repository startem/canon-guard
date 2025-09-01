import { useState } from 'react';
import { UserManagement } from '@/components/UserManagement';
import { DataPersistenceProvider } from '@/hooks/useDataPersistence';

// Mock data - in production this would come from your backend
const initialUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin' as const,
    status: 'active' as const,
    avatar: '',
    phone: '+1 (555) 123-4567',
    department: 'engineering',
    lastActive: '2024-01-15T10:30:00Z',
    permissions: ['brand_read', 'brand_write', 'brand_delete', 'audit_read', 'audit_write', 'audit_run', 'analytics_read', 'analytics_export', 'team_read', 'team_write', 'team_manage', 'settings_read', 'settings_write'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'manager' as const,
    status: 'active' as const,
    avatar: '',
    phone: '+1 (555) 234-5678',
    department: 'marketing',
    lastActive: '2024-01-14T16:45:00Z',
    permissions: ['brand_read', 'brand_write', 'audit_read', 'audit_write', 'audit_run', 'analytics_read', 'analytics_export', 'team_read', 'team_write', 'settings_read'],
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'editor' as const,
    status: 'active' as const,
    avatar: '',
    phone: '+1 (555) 345-6789',
    department: 'design',
    lastActive: '2024-01-13T09:15:00Z',
    permissions: ['brand_read', 'brand_write', 'audit_read', 'analytics_read', 'team_read'],
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'user-4',
    name: 'Sarah Davis',
    email: 'sarah.davis@company.com',
    role: 'viewer' as const,
    status: 'pending' as const,
    avatar: '',
    department: 'product',
    lastActive: '2024-01-12T14:20:00Z',
    permissions: ['brand_read', 'audit_read', 'analytics_read', 'team_read'],
    createdAt: '2024-01-12T00:00:00Z'
  }
];

const initialTeams = [
  {
    id: 'team-1',
    name: 'Brand Management',
    description: 'Core brand management and strategy team',
    members: ['user-1', 'user-2'],
    permissions: ['brand_read', 'brand_write', 'audit_read', 'audit_write', 'audit_run'],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'team-2',
    name: 'Design Team',
    description: 'Visual identity and creative assets team',
    members: ['user-3'],
    permissions: ['brand_read', 'brand_write', 'audit_read'],
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'team-3',
    name: 'Product Team',
    description: 'Product development and user experience team',
    members: ['user-4'],
    permissions: ['brand_read', 'audit_read', 'analytics_read'],
    createdAt: '2024-01-10T00:00:00Z'
  }
];

const UserManagementPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [teams, setTeams] = useState(initialTeams);

  const handleUserUpdate = (updatedUser: any) => {
    setUsers(prev => {
      const existing = prev.find(u => u.id === updatedUser.id);
      if (existing) {
        return prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      } else {
        return [...prev, updatedUser];
      }
    });
  };

  const handleUserDelete = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Also remove from teams
    setTeams(prev => prev.map(team => ({
      ...team,
      members: team.members.filter(memberId => memberId !== userId)
    })));
  };

  const handleTeamUpdate = (updatedTeam: any) => {
    setTeams(prev => {
      const existing = prev.find(t => t.id === updatedTeam.id);
      if (existing) {
        return prev.map(t => t.id === updatedTeam.id ? updatedTeam : t);
      } else {
        return [...prev, updatedTeam];
      }
    });
  };

  const handleTeamDelete = (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  return (
    <DataPersistenceProvider>
      <div className="container mx-auto px-6 py-8">
        <UserManagement
          users={users}
          teams={teams}
          onUserUpdate={handleUserUpdate}
          onUserDelete={handleUserDelete}
          onTeamUpdate={handleTeamUpdate}
          onTeamDelete={handleTeamDelete}
        />
      </div>
    </DataPersistenceProvider>
  );
};

export default UserManagementPage;