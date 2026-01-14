import { createMiddleware } from "hono/factory";
import { verifyToken } from "@clerk/backend";
import type { Env, AuthUser } from "../types";

type Variables = {
  user: AuthUser;
};

export const requireAuth = createMiddleware<{
  Bindings: Env;
  Variables: Variables;
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid authorization header" }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyToken(token, {
      secretKey: c.env.CLERK_SECRET_KEY,
    });

    c.set("user", {
      userId: payload.sub,
      sessionId: payload.sid ?? "",
    });

    await next();
  } catch (error) {
    console.error("Auth error:", error);
    return c.json({ error: "Invalid token" }, 401);
  }
});
