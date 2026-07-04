import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  /** Positive/negative delta note under the value. */
  trend?: { value: string; direction: "up" | "down" | "flat" };
  hint?: string;
  /** Emphasise the value color for the primary/critical metric. */
  tone?: "default" | "primary" | "success" | "warning" | "destructive";
  className?: string;
}

const toneMap: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  hint,
  tone = "default",
  className,
}: StatCardProps) {
  const TrendIcon =
    trend?.direction === "down" ? TrendingDown : trend?.direction === "up" ? TrendingUp : null;
  const trendColor =
    trend?.direction === "down"
      ? "text-destructive"
      : trend?.direction === "up"
        ? "text-success"
        : "text-muted-foreground";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>
      <div className={cn("mt-3 font-display text-3xl font-semibold tracking-tight", toneMap[tone])}>
        {value}
      </div>
      {(trend || hint) && (
        <div className="mt-2 flex items-center gap-1.5 text-sm">
          {trend && TrendIcon && <TrendIcon className={cn("h-4 w-4", trendColor)} />}
          {trend && <span className={trendColor}>{trend.value}</span>}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}
    </Card>
  );
}