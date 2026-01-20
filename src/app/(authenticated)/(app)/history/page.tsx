/**
 * Query history page.
 *
 * @deprecated - Conversations are now shown in the sidebar.
 * This page redirects to /chat for backward compatibility.
 */

import { redirect } from "next/navigation";

export const metadata = {
  title: "Query History | ShopTalk",
  description: "View your past contract questions and answers",
};

export default function HistoryPage() {
  // Redirect to chat - conversations are now in the sidebar
  redirect("/chat");
}
