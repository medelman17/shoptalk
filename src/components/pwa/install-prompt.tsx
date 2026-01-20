/**
 * PWA install prompt component.
 *
 * Shows a banner encouraging users to install the app after they've
 * made a few queries.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { XIcon, DownloadIcon, ShareIcon } from "lucide-react";
import { usePwaInstall } from "./use-pwa-install";
import {
  shouldShowInstallPrompt,
  hasUserDismissedPrompt,
  dismissInstallPrompt,
} from "@/lib/pwa/query-counter";
import { cn } from "@/lib/utils";

interface InstallPromptProps {
  className?: string;
}

export function InstallPrompt({ className }: InstallPromptProps) {
  const { canInstall, isInstalled, isIOS, install } = usePwaInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  // Use lazy initialization to read from localStorage only once
  const [isDismissed, setIsDismissed] = useState(() => {
    // This runs only on initial render (client-side)
    if (typeof window === "undefined") return false;
    return hasUserDismissedPrompt();
  });
  const [hasMounted, setHasMounted] = useState(false);

  // Mark component as mounted (for hydration safety)
  // Use requestAnimationFrame to avoid synchronous setState warning
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setHasMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Derive visibility from state - no need for separate visibility state
  // Only show after mount to avoid hydration issues
  const isVisible = hasMounted &&
    !isDismissed &&
    !isInstalled &&
    shouldShowInstallPrompt() &&
    (canInstall || isIOS);

  const handleInstall = useCallback(async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    const success = await install();
    if (success) {
      setIsDismissed(true);
    }
  }, [isIOS, install]);

  const handleDismiss = useCallback(() => {
    dismissInstallPrompt();
    setIsDismissed(true);
    setShowIOSInstructions(false);
  }, []);

  if (!isVisible) return null;

  // iOS instructions modal
  if (showIOSInstructions) {
    return (
      <div
        className={cn(
          "fixed inset-x-4 bottom-4 z-50 rounded-lg border bg-card p-4 shadow-lg md:inset-x-auto md:bottom-6 md:right-6 md:max-w-sm",
          className
        )}
      >
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted"
          aria-label="Dismiss"
        >
          <XIcon className="h-4 w-4" />
        </button>

        <h3 className="mb-3 pr-6 font-semibold">Install ShopTalk</h3>

        <ol className="mb-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              1
            </span>
            <span>
              Tap the <ShareIcon className="inline h-4 w-4" /> Share button in
              your browser
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              2
            </span>
            <span>Scroll down and tap &quot;Add to Home Screen&quot;</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              3
            </span>
            <span>Tap &quot;Add&quot; in the top right corner</span>
          </li>
        </ol>

        <Button variant="outline" onClick={handleDismiss} className="w-full">
          Got it
        </Button>
      </div>
    );
  }

  // Standard install prompt
  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 z-50 flex items-center gap-4 rounded-lg border bg-card p-4 shadow-lg md:inset-x-auto md:bottom-6 md:right-6 md:max-w-sm",
        className
      )}
    >
      <div className="flex-1">
        <p className="font-medium">Install ShopTalk</p>
        <p className="text-sm text-muted-foreground">
          Quick access to your contract info
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" onClick={handleDismiss}>
          <XIcon className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleInstall}>
          <DownloadIcon className="h-4 w-4" />
          <span>Install</span>
        </Button>
      </div>
    </div>
  );
}
