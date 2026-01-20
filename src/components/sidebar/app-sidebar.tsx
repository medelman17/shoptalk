"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon, MessageCircle } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { NavUser } from "./nav-user";
import { ConversationList } from "./conversation-list";

interface Conversation {
  id: string;
  title: string | null;
  updated_at: string;
}

interface AppSidebarProps {
  conversations: Conversation[];
}

export function AppSidebar({ conversations: initialConversations }: AppSidebarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [conversations, setConversations] = useState(initialConversations);

  const handleNewChat = useCallback(() => {
    startTransition(() => {
      router.push("/chat");
    });
  }, [router]);

  const handleDeleteConversation = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      // Remove from local state
      setConversations((prev) => prev.filter((c) => c.id !== id));

      // Refresh the page to update server state
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      throw error;
    }
  }, [router]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/chat">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <MessageCircle className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ShopTalk</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Contract Q&A
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Button
          onClick={handleNewChat}
          disabled={isPending}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <PlusIcon className="size-4" />
          <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
        </Button>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <ConversationList
          conversations={conversations}
          onDeleteConversation={handleDeleteConversation}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
