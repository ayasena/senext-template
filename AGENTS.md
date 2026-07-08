# AGENTS.md — senext-template

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS v4**
- **ElysiaJS** inside `app/api/[[...slugs]]/route.ts` — the Elysia `app` is exported for Eden Treaty
- **pnpm** (package manager), **PostCSS** (`@tailwindcss/postcss`)
- React Email via `@react-email/components` + `react-email`
- `@t3-oss/env-nextjs` + Zod for env validation at build time (imported in `next.config.ts`)

## Path alias

`@/*` maps to project root (standard Next.js tsconfig).

## Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Next.js dev server |
| `pnpm dev:otel` | Next.js dev server with OpenTelemetry preload |
| `pnpm build` | Next.js production build |
| `pnpm start` | Next.js production server |
| `pnpm lint` | ESLint (flat config, next/core-web-vitals + typescript) |
| `pnpm email` | `email dev --dir ./emails` — react-email dev server |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Apply Drizzle migrations |
| `pnpm db:studio` | Launch Drizzle Studio |

## Environment

- Required: `NEXT_PUBLIC_APP_URL` (client), `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (server)
- Optional: `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`
- Validated via `env/client.ts` and `env/server.ts` at build time
- `.env*` files are gitignored; `.env.example` is committed via `!.env.example`
- `DATABASE_URL=file:./local.db` for local libSQL/dev; copy `.env.example` → `.env.local`

## API pattern (ElysiaJS + Next.js)

- `app/api/[[...slugs]]/route.ts` creates an Elysia instance (`prefix: "/api"`) with CORS, OpenAPI (Scalar at `/api/reference`), Better Auth, and app modules.
- `lib/eden.ts` provides a type-safe Eden Treaty client (server-side: direct treaty, client-side: fetch via `NEXT_PUBLIC_APP_URL`).

## Modules

- `modules/auth/` — auth guard macro (`{ auth: true }` on routes), sign-up, sign-in, sign-out, `/me` endpoints
- `modules/user/` — user profile CRUD (requires `{ auth: true }`)

## Database

- **Drizzle ORM + libSQL** (SQLite-compatible, local file via `DATABASE_URL=file:./local.db`)
- Schema in `lib/db/schema.ts` (user, session, account, verification tables)
- Better Auth adapter: `drizzleAdapter` with `provider: 'sqlite'`
- Run `pnpm db:generate` after schema changes, then `pnpm db:migrate`

## Authentication (Better Auth)

- `lib/auth/index.ts` — better-auth instance with email/password + Drizzle adapter
- Mounted via `.mount(auth.handler)` at `/api/auth/*`
- OpenAPI docs extracted via `lib/auth/openapi.ts` and merged into Elysia's docs
- Use `{ auth: true }` macro to protect routes (injects `user` and `session` into context)

## OpenTelemetry

- Preloaded via `bunfig.toml` → `lib/otel/instrumentation.ts`
- Starts dev with `pnpm dev:otel` (or normal `pnpm dev` without tracing)
- Exports to OTLP HTTP endpoint (default: `http://localhost:4318/v1/traces`)

## ElysiaJS skill

A comprehensive ElysiaJS skill is available at `.agents/skills/elysiajs/SKILL.md` (routing, validation, plugins, integrations, patterns). Use `skill("elysiajs")` to load it.

## Code style

- ESLint flat config (`eslint.config.mjs`) — no Prettier configured.
- Tailwind v4 uses `@theme inline` directive for custom design tokens in `app/globals.css`.
