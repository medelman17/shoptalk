import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { InstallPrompt } from "@/components/pwa";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopTalk - AI-Powered Contract Retrieval",
  description: "Conversational AI assistant for union contract questions",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ShopTalk",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* iOS splash screens and icons */}
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
          <link
            rel="apple-touch-startup-image"
            href="/icons/icon-512.png"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <InstallPrompt />
        </body>
      </html>
    </ClerkProvider>
  );
}
