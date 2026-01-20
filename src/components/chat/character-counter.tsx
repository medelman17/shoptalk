/**
 * Character counter component for input fields.
 *
 * Shows current count and visual warning when approaching limit.
 */

import { cn } from "@/lib/utils";

interface CharacterCounterProps {
  /** Current character count */
  current: number;
  /** Maximum allowed characters */
  max: number;
  /** Show warning at this percentage (default: 0.8 = 80%) */
  warningThreshold?: number;
  /** Optional class name */
  className?: string;
}

export function CharacterCounter({
  current,
  max,
  warningThreshold = 0.8,
  className,
}: CharacterCounterProps) {
  const percentage = current / max;
  const isWarning = percentage >= warningThreshold;
  const isOverLimit = current > max;

  return (
    <span
      className={cn(
        "text-xs tabular-nums transition-colors",
        isOverLimit
          ? "font-medium text-destructive"
          : isWarning
            ? "text-amber-600 dark:text-amber-400"
            : "text-muted-foreground",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {current}/{max}
    </span>
  );
}

/**
 * Maximum character limit for chat queries.
 */
export const QUERY_MAX_LENGTH = 500;
