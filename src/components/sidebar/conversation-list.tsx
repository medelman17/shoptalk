"use client";

import { useMemo } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ConversationItem } from "./conversation-item";

interface Conversation {
  id: string;
  title: string | null;
  updated_at: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  onDeleteConversation?: (id: string) => Promise<void>;
}

type DateGroup = "today" | "yesterday" | "previous7Days" | "older";

interface GroupedConversations {
  today: Conversation[];
  yesterday: Conversation[];
  previous7Days: Conversation[];
  older: Conversation[];
}

function getDateGroup(dateString: string): DateGroup {
  const date = new Date(dateString);
  const now = new Date();

  // Reset time to start of day for comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const conversationDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (conversationDate >= today) {
    return "today";
  } else if (conversationDate >= yesterday) {
    return "yesterday";
  } else if (conversationDate >= sevenDaysAgo) {
    return "previous7Days";
  }
  return "older";
}

function groupConversations(
  conversations: Conversation[]
): GroupedConversations {
  const groups: GroupedConversations = {
    today: [],
    yesterday: [],
    previous7Days: [],
    older: [],
  };

  for (const conversation of conversations) {
    const group = getDateGroup(conversation.updated_at);
    groups[group].push(conversation);
  }

  return groups;
}

const groupLabels: Record<DateGroup, string> = {
  today: "Today",
  yesterday: "Yesterday",
  previous7Days: "Previous 7 Days",
  older: "Older",
};

export function ConversationList({
  conversations,
  onDeleteConversation,
}: ConversationListProps) {
  const groupedConversations = useMemo(
    () => groupConversations(conversations),
    [conversations]
  );

  const groups: DateGroup[] = ["today", "yesterday", "previous7Days", "older"];

  // Check if there are any conversations
  const hasConversations = conversations.length > 0;

  if (!hasConversations) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 py-8 text-center text-sm text-muted-foreground">
            <p>No conversations yet</p>
            <p className="mt-1 text-xs">
              Start a new chat to ask about your contract
            </p>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      {groups.map((group) => {
        const groupConvos = groupedConversations[group];
        if (groupConvos.length === 0) return null;

        return (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{groupLabels[group]}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupConvos.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    id={conversation.id}
                    title={conversation.title}
                    onDelete={onDeleteConversation}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
}
