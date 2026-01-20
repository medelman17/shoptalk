/**
 * Navigation back button component.
 *
 * Uses router history when available, falls back to a specified href.
 */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

interface BackButtonProps extends Omit<ComponentProps<typeof Button>, "onClick" | "children"> {
  /** Fallback href if no history available */
  fallbackHref?: string;
  /** Custom label (default: "Back") */
  label?: string;
}

export function BackButton({
  fallbackHref = "/",
  label = "Back",
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn("gap-2", className)}
      {...props}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
}
