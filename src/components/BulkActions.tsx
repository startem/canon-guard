import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, Trash2, Edit, Download, Archive, Send, Check, X } from 'lucide-react';

interface BulkAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'secondary' | 'outline';
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationDescription?: string;
}

interface BulkActionsProps {
  selectedItems: any[];
  totalItems: number;
  onSelectAll: (selected: boolean) => void;
  onClearSelection: () => void;
  actions: BulkAction[];
  onActionExecute: (actionId: string, selectedItems: any[]) => Promise<void>;
  className?: string;
}

export const BulkActions = ({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  actions,
  onActionExecute,
  className = ""
}: BulkActionsProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<BulkAction | null>(null);
  const { toast } = useToast();

  const selectedCount = selectedItems.length;
  const isAllSelected = selectedCount === totalItems && totalItems > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalItems;

  const handleActionClick = async (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setConfirmAction(action);
      return;
    }

    await executeAction(action);
  };

  const executeAction = async (action: BulkAction) => {
    if (selectedCount === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to perform this action.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(action.id);
    try {
      await onActionExecute(action.id, selectedItems);
      toast({
        title: "Action completed",
        description: `${action.label} completed successfully for ${selectedCount} items.`
      });
      onClearSelection();
    } catch (error) {
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "An error occurred while performing the action.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(null);
      setConfirmAction(null);
    }
  };

  const handleConfirmedAction = () => {
    if (confirmAction) {
      executeAction(confirmAction);
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <>
      <div className={`flex items-center justify-between p-4 bg-muted/50 border rounded-lg ${className}`}>
        <div className="flex items-center gap-4">
          {/* Select All Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              ref={(el: HTMLButtonElement | null) => {
                if (el) (el as any).indeterminate = isIndeterminate;
              }}
              onCheckedChange={(checked) => onSelectAll(checked as boolean)}
            />
            <span className="text-sm font-medium">
              {selectedCount > 0 ? (
                <>
                  {selectedCount} of {totalItems} selected
                </>
              ) : (
                <>Select all {totalItems} items</>
              )}
            </span>
          </div>

          {/* Selected Count Badge */}
          {selectedCount > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              {selectedCount} selected
            </Badge>
          )}
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <>
              {/* Quick Actions */}
              {actions.slice(0, 2).map(action => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={() => handleActionClick(action)}
                    disabled={isLoading !== null}
                    className="flex items-center gap-2"
                  >
                    {isLoading === action.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    {action.label}
                  </Button>
                );
              })}

              {/* More Actions Dropdown */}
              {actions.length > 2 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      More
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {actions.slice(2).map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <DropdownMenuItem
                          key={action.id}
                          onClick={() => handleActionClick(action)}
                          disabled={isLoading !== null}
                          className={action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
                        >
                          {isLoading === action.id ? (
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          ) : (
                            <Icon className="mr-2 h-4 w-4" />
                          )}
                          {action.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <DropdownMenuSeparator />

              {/* Clear Selection */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.confirmationTitle || `Confirm ${confirmAction?.label}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.confirmationDescription || 
                `Are you sure you want to ${confirmAction?.label.toLowerCase()} ${selectedCount} selected items? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading !== null}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedAction}
              disabled={isLoading !== null}
              className={confirmAction?.variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : null}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};