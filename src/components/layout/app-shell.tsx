"use client";

import { Suspense, type ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PdfPanelProvider } from "@/contexts/pdf-panel-context";
import { AppSidebar } from "@/components/sidebar";
import { SplitViewContainer } from "./split-view-container";

interface Conversation {
  id: string;
  title: string | null;
  updated_at: string;
}

interface AppShellProps {
  children: ReactNode;
  conversations: Conversation[];
}

export function AppShell({ children, conversations }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar conversations={conversations} />
      <SidebarInset>
        <PdfPanelProvider>
          <Suspense fallback={<div className="flex h-full flex-1 flex-col">{children}</div>}>
            <SplitViewContainer>{children}</SplitViewContainer>
          </Suspense>
        </PdfPanelProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
