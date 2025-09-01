import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  FileText, 
  Users, 
  Palette, 
  BarChart3, 
  Shield, 
  Archive, 
  Plus,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon = FileText, 
  title, 
  description, 
  action, 
  secondaryAction,
  className = ""
}: EmptyStateProps) => (
  <Card className={`border-dashed ${className}`}>
    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
      <Icon className="w-16 h-16 text-muted-foreground/50 mb-6" />
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-8 max-w-md">{description}</p>
      <div className="flex gap-3">
        {action && (
          <Button 
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {action.label}
          </Button>
        )}
        {secondaryAction && (
          <Button 
            onClick={secondaryAction.onClick}
            variant="outline"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

// Predefined Empty States
export const NoDataEmptyState = ({ type = 'items', onCreate }: { type?: string; onCreate?: () => void }) => (
  <EmptyState
    icon={FileText}
    title={`No ${type} found`}
    description={`You haven't created any ${type} yet. Get started by creating your first one.`}
    action={onCreate ? {
      label: `Create ${type.slice(0, -1)}`,
      onClick: onCreate
    } : undefined}
  />
);

export const SearchEmptyState = ({ searchTerm, onClear }: { searchTerm: string; onClear: () => void }) => (
  <EmptyState
    icon={Search}
    title="No results found"
    description={`No items match your search "${searchTerm}". Try adjusting your search terms or clearing filters.`}
    action={{
      label: 'Clear search',
      onClick: onClear,
      variant: 'outline'
    }}
  />
);

export const FilterEmptyState = ({ onClearFilters }: { onClearFilters: () => void }) => (
  <EmptyState
    icon={Filter}
    title="No items match your filters"
    description="Try adjusting your filter criteria to see more results."
    action={{
      label: 'Clear filters',
      onClick: onClearFilters,
      variant: 'outline'
    }}
  />
);

export const ErrorEmptyState = ({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void 
}) => (
  <EmptyState
    icon={AlertCircle}
    title="Something went wrong"
    description={error}
    action={onRetry ? {
      label: 'Try again',
      onClick: onRetry
    } : undefined}
  />
);

export const SuccessEmptyState = ({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description: string; 
  action?: { label: string; onClick: () => void } 
}) => (
  <EmptyState
    icon={CheckCircle2}
    title={title}
    description={description}
    action={action}
  />
);

// Domain-specific empty states
export const BrandEmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <EmptyState
    icon={Palette}
    title="No brands configured"
    description="Set up your first brand to start managing your brand identity and assets."
    action={{
      label: 'Create brand',
      onClick: onCreate
    }}
  />
);

export const CampaignEmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <EmptyState
    icon={BarChart3}
    title="No campaigns active"
    description="Launch your first marketing campaign to start driving brand visibility and growth."
    action={{
      label: 'Create campaign',
      onClick: onCreate
    }}
  />
);

export const AuditEmptyState = ({ onRun }: { onRun: () => void }) => (
  <EmptyState
    icon={Shield}
    title="No audits run yet"
    description="Run your first brand audit to identify opportunities and maintain consistency."
    action={{
      label: 'Run audit',
      onClick: onRun
    }}
  />
);

export const IssueEmptyState = () => (
  <EmptyState
    icon={CheckCircle2}
    title="All clear!"
    description="No issues found. Your brand is performing well and maintaining consistency across all touchpoints."
  />
);

export const TouchpointEmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <EmptyState
    icon={Users}
    title="No touchpoints defined"
    description="Define your customer touchpoints to monitor and optimize brand experiences."
    action={{
      label: 'Add touchpoint',
      onClick: onCreate
    }}
  />
);

export const ReportEmptyState = ({ onGenerate }: { onGenerate: () => void }) => (
  <EmptyState
    icon={BarChart3}
    title="No reports generated"
    description="Generate your first brand report to track performance and insights."
    action={{
      label: 'Generate report',
      onClick: onGenerate
    }}
  />
);

export const ArchiveEmptyState = ({ onRestore }: { onRestore?: () => void }) => (
  <EmptyState
    icon={Archive}
    title="Archive is empty"
    description="No archived items found. Items you archive will appear here for easy restoration."
    action={onRestore ? {
      label: 'Restore from backup',
      onClick: onRestore,
      variant: 'outline'
    } : undefined}
  />
);

export const TeamEmptyState = ({ onInvite }: { onInvite: () => void }) => (
  <EmptyState
    icon={Users}
    title="No team members"
    description="Invite team members to collaborate on brand management and maintain consistency."
    action={{
      label: 'Invite team member',
      onClick: onInvite
    }}
  />
);