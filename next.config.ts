import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/offline",
  },
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    skipWaiting: true,
    runtimeCaching: [
      {
        // Cache API responses (except chat which should never be cached)
        urlPattern: /^\/api\/(?!chat).*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 1 day
          },
          networkTimeoutSeconds: 10,
        },
      },
      {
        // Cache PDFs for longer
        urlPattern: /^\/api\/pdf\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "pdf-cache",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
          },
        },
      },
      {
        // Cache static assets
        urlPattern: /\.(js|css|woff|woff2|png|jpg|jpeg|svg|gif|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  // Empty turbopack config to satisfy Next.js 16 requirement
  turbopack: {},
  // Webpack configuration for react-pdf canvas dependency
  webpack: (config) => {
    // Handle canvas dependency for react-pdf (optional, for annotations)
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default withPWA(nextConfig);
