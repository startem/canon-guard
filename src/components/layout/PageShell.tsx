import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  /** Constrain the content width. Defaults to a comfortable reading/workspace width. */
  maxWidth?: "5xl" | "6xl" | "7xl" | "full";
}

const maxWidthMap: Record<NonNullable<PageShellProps["maxWidth"]>, string> = {
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-none",
};

/**
 * Consistent page container: shared horizontal padding, vertical rhythm and
 * max-width so every route feels like one product.
 */
export function PageShell({ children, className, maxWidth = "7xl" }: PageShellProps) {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className={cn("mx-auto w-full space-y-6 sm:space-y-8", maxWidthMap[maxWidth], className)}>
        {children}
      </div>
    </div>
  );
}