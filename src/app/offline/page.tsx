/**
 * Offline fallback page.
 *
 * Displayed when the user is offline and tries to access a non-cached page.
 */

import { WifiOffIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Offline | ShopTalk",
  description: "You appear to be offline",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <WifiOffIcon className="h-10 w-10 text-muted-foreground" />
        </div>

        {/* Title */}
        <h1 className="mb-2 text-2xl font-bold">You&apos;re Offline</h1>

        {/* Description */}
        <p className="mb-6 text-muted-foreground">
          ShopTalk needs an internet connection to search your contract
          documents and provide answers. Please check your connection and try
          again.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <RefreshCwIcon className="h-4 w-4" />
              <span>Try Again</span>
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground">
            Your recent questions are saved and will be available when you
            reconnect.
          </p>
        </div>
      </div>
    </div>
  );
}
