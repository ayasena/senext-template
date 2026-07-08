import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { auth } from "@/lib/auth";
import { authOpenAPI } from "@/lib/auth/openapi";
import { authGuard, authModule } from "@/modules/auth";
import { userModule } from "@/modules/user";
import { env as clientEnv } from "@/env/client";

const app = new Elysia({ name: "api", prefix: "/api" })
  .use(
    cors({
      origin: clientEnv.NEXT_PUBLIC_APP_URL,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  )
  .use(
    openapi({
      path: "/reference",
      provider: "scalar",
      documentation: {
        info: {
          title: "Senext API",
          version: "1.0.0",
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "User", description: "User management" },
        ],
        components: await authOpenAPI.components,
        paths: await authOpenAPI.getPaths("/api/auth"),
      },
    }),
  )
  .mount(auth.handler)
  .use(authGuard)
  .use(authModule)
  .use(userModule)
  .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }));

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const PATCH = app.fetch;
export const DELETE = app.fetch;
export const OPTIONS = app.fetch;

export type App = typeof app;
