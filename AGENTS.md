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
| `pnpm build` | Next.js production build |
| `pnpm start` | Next.js production server |
| `pnpm lint` | ESLint (flat config, next/core-web-vitals + typescript) |
| `pnpm email` | `email dev --dir ./emails` — react-email dev server |

## Environment

- Required: `NEXT_PUBLIC_APP_URL` (client), `DATABASE_URL` (server)
- Validated via `env/client.ts` and `env/server.ts` at build time
- `.env*` files are gitignored; `.env.example` is committed via `!.env.example`

## API pattern (ElysiaJS + Next.js)

- `app/api/[[...slugs]]/route.ts` creates an Elysia instance (`prefix: "/api"`) and exports `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS` as `app.fetch`.
- `lib/eden.ts` provides a type-safe Eden Treaty client (server-side: direct treaty, client-side: fetch via `NEXT_PUBLIC_APP_URL`).

## ElysiaJS skill

A comprehensive ElysiaJS skill is available at `.agents/skills/elysiajs/SKILL.md` (routing, validation, plugins, integrations, patterns). Use `skill("elysiajs")` to load it.

## Code style

- ESLint flat config (`eslint.config.mjs`) — no Prettier configured.
- Tailwind v4 uses `@theme inline` directive for custom design tokens in `app/globals.css`.
