/**
 * Query detail page.
 *
 * @deprecated - Conversations are now shown in the sidebar.
 * This page redirects to /chat for backward compatibility.
 */

import { redirect } from "next/navigation";

export default function QueryDetailPage() {
  // Redirect to chat - conversations are now in the sidebar
  redirect("/chat");
}

export function generateMetadata() {
  return {
    title: "Query | ShopTalk",
    description: "View question and answer details",
  };
}
