import type { MetadataRoute } from "next";

/**
 * Web App Manifest for PWA functionality.
 *
 * Defines app metadata for installation on mobile devices and desktops.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShopTalk - Contract Q&A",
    short_name: "ShopTalk",
    description:
      "AI-powered assistant for UPS Teamsters to understand their union contracts",
    start_url: "/chat",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    orientation: "portrait-primary",
    categories: ["productivity", "utilities", "reference"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/chat.png",
        sizes: "1170x2532",
        type: "image/png",
        label: "Contract Q&A Chat",
      },
    ],
    shortcuts: [
      {
        name: "New Question",
        url: "/chat",
        description: "Ask a new contract question",
      },
      {
        name: "History",
        url: "/history",
        description: "View past questions",
      },
    ],
  };
}
