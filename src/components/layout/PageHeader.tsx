import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Small uppercase label above the title (e.g. section / breadcrumb context). */
  eyebrow?: string;
  icon?: LucideIcon;
  /** Right-aligned actions (buttons, filters). */
  actions?: ReactNode;
  /** Inline elements rendered next to the title (badges, status pills). */
  meta?: ReactNode;
  className?: string;
}

/**
 * Unified page header: gradient icon tile, display title, description and an
 * actions slot. Gives every interior page the same premium grammar.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-brand ring-1 ring-white/10 sm:flex">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="space-y-1.5">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {meta}
          </div>
          {description && (
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
    </div>
  );
}