import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Remove inner padding when the child manages its own (e.g. tables). */
  flush?: boolean;
}

/**
 * Titled content block with an elevated surface and a consistent header row.
 * The building block for every page's work areas.
 */
export function SectionCard({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className,
  contentClassName,
  flush,
}: SectionCardProps) {
  const hasHeader = title || description || actions;
  return (
    <Card className={cn("overflow-hidden shadow-card", className)}>
      {hasHeader && (
        <div className="flex flex-col gap-3 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div className="space-y-0.5">
              {title && (
                <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h2>
              )}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!flush && "p-5", contentClassName)}>{children}</div>
    </Card>
  );
}