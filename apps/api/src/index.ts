import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";
import { queryRoutes } from "./routes/query";
import { documentsRoutes } from "./routes/documents";
import { localsRoutes } from "./routes/locals";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:8081", "exp://localhost:8081"],
    credentials: true,
  })
);

// Health check
app.get("/", (c) => {
  return c.json({
    name: "shoptalk-api",
    version: "0.0.1",
    status: "healthy",
  });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Routes
app.route("/api/auth", authRoutes);
app.route("/api/user", userRoutes);
app.route("/api/query", queryRoutes);
app.route("/api/documents", documentsRoutes);
app.route("/api/locals", localsRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
