/**
 * Reusable error display component.
 *
 * Shows consistent error UI with type-specific icons, messages,
 * and recovery actions.
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppError, ErrorType } from "@/lib/errors";
import {
  AlertCircleIcon,
  WifiOffIcon,
  ClockIcon,
  SearchXIcon,
  AlertTriangleIcon,
  LockIcon,
  FileQuestionIcon,
  ShieldXIcon,
  RefreshCwIcon,
  LogInIcon,
} from "lucide-react";

interface ErrorDisplayProps {
  error: AppError;
  className?: string;
  /** Compact mode for inline display */
  compact?: boolean;
}

/**
 * Get the appropriate icon for an error type.
 */
function getErrorIcon(type: ErrorType) {
  switch (type) {
    case "network":
      return WifiOffIcon;
    case "rate-limit":
      return ClockIcon;
    case "no-results":
      return SearchXIcon;
    case "validation":
      return AlertTriangleIcon;
    case "auth":
      return LockIcon;
    case "not-found":
      return FileQuestionIcon;
    case "forbidden":
      return ShieldXIcon;
    case "generic":
    default:
      return AlertCircleIcon;
  }
}

/**
 * Format time remaining for rate limit errors.
 */
function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
}

export function ErrorDisplay({ error, className, compact = false }: ErrorDisplayProps) {
  const [retryCountdown, setRetryCountdown] = useState(error.retryAfter ?? 0);

  // Countdown timer for rate limit errors
  useEffect(() => {
    if (!error.retryAfter || error.retryAfter <= 0) return;

    setRetryCountdown(error.retryAfter);

    const interval = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [error.retryAfter]);

  const Icon = getErrorIcon(error.type);
  const canRetry = error.onRetry && (error.type !== "rate-limit" || retryCountdown === 0);
  const showLogin = error.type === "auth";

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3",
          className
        )}
      >
        <Icon className="h-5 w-5 shrink-0 text-destructive" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-destructive truncate">{error.message}</p>
        </div>
        {canRetry && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={error.onRetry}
            className="shrink-0 text-destructive hover:bg-destructive/20 hover:text-destructive"
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-destructive/50 bg-destructive/10 p-4",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/20">
          <Icon className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-destructive">{error.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>

          {error.type === "rate-limit" && retryCountdown > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              You can try again in{" "}
              <span className="font-medium">{formatTimeRemaining(retryCountdown)}</span>
            </p>
          )}

          {(canRetry || showLogin) && (
            <div className="mt-4 flex items-center gap-2">
              {canRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={error.onRetry}
                  className="border-destructive/50 hover:bg-destructive/20"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  <span>Try Again</span>
                </Button>
              )}
              {showLogin && (
                <Button variant="outline" size="sm" asChild>
                  <a href="/sign-in">
                    <LogInIcon className="h-4 w-4" />
                    <span>Sign In</span>
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
