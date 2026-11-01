---
name: booster-role-engineering
description: "Develop or review this pnpm monorepo's Discord bot, web verification app, and shared contracts involving Discord events, slash commands, booster eligibility, cosmetic roles, ownership, permissions, Drizzle persistence, or PostgreSQL."
argument-hint: "Describe the booster-role feature or issue"
---

# Booster Role Engineering

Use this skill for changes to the bot's domain, Discord handlers, role
services, stores, schema, web verification UI, shared contracts, or related
tests.

## Boundaries

- `apps/booster-role/src/domain` contains pure eligibility and role-safety rules.
- `apps/booster-role/src/discord` contains Discord client, command registration, interaction
  parsing, and Discord-facing schemas.
- `apps/booster-role/src/services` coordinates role operations and persistence adapters.
- `apps/booster-role/src/db` contains Drizzle schema, connection, and migrations.
- `apps/booster-role/src/config` contains environment and permission policy.
- `apps/web` contains the Vite verification UI and should remain an adapter
  over shared verification logic.
- `apps/api` contains Hono HTTP routes and tenant authorization boundaries.
- `packages/contracts` contains runtime-agnostic verification types and pure
  checks shared by the bot-facing tooling and web app.

## Monorepo workflow

- Keep workspace dependencies declared with `workspace:*`.
- Do not import browser APIs into `packages/contracts`.
- Do not duplicate role verification checks in `apps/web`; import them from
  `@mytheclipse/contracts`.
- Every API read/write must be tenant-scoped and authorized before accessing
  tenant records.
- Keep the root workspace scripts stable while the deployed bot entrypoint
  lives in `apps/booster-role`.

## Safety invariants

- A booster role is bot-managed and cosmetic only.
- It has no elevated permissions.
- It stays below the configured staff/admin anchor.
- A user may modify or delete only their own stored role.
- A user without the configured eligibility role cannot claim a role.
- Never allow an existing unrelated Discord role to be claimed.

Validate untrusted command input at the boundary with the existing Zod schemas
and enforce ownership and permission rules again in the service/domain layer.
Use fakes or in-memory stores in tests; never use production Discord or
database credentials.

When changing `apps/booster-role/src/db/schema.ts`, generate and review a new Drizzle migration
with `pnpm run db:generate`. Never rewrite an applied migration. Run focused
tests, `pnpm run typecheck`, the web typecheck, and `pnpm run web:build` when
the affected change crosses package boundaries.
