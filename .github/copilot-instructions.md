# Copilot instructions

This repository contains a Discord bot for managing cosmetic booster roles.
Apply these instructions to all code, tests, documentation, and configuration
changes.

## Engineering baseline

- Use Node.js 24, TypeScript, ESM, and pnpm.
- Keep TypeScript strict and preserve the `tsconfig.json` settings.
- Prefer small, cohesive modules with explicit types and dependency
  boundaries. Follow Clean Code and SOLID principles without introducing
  abstractions that the feature does not need.
- Validate inputs at system boundaries with the existing Zod schemas and
  domain guards. Do not silently coerce invalid input or hide errors with
  broad catches.
- Keep Discord API concerns in `apps/booster-role/src/discord` and Discord role
  operations in the service/repository layer. Keep business rules in
  `apps/booster-role/src/domain` so they
  remain testable without Discord or a database.
- Keep persistence concerns in `apps/booster-role/src/db` and the Drizzle-backed store. Do not
  make domain code depend on Drizzle or Discord types.
- Keep web UI code in `apps/web` and shared, runtime-agnostic contracts in
  `packages/contracts`. Do not duplicate role verification rules in the web
  application.
- Reuse existing errors, logger, interfaces, and helpers before adding new
  ones. Preserve existing behavior unless the change explicitly requires a
  behavior change.

## Repository structure

- `apps/booster-role/src/domain`: eligibility and role-safety rules.
- `apps/booster-role/src/services`: application services, role orchestration, and persistence
  adapters.
- `apps/booster-role/src/discord`: client setup, slash-command registration, interaction
  handling, and Discord-facing schemas.
- `apps/booster-role/src/db`: Drizzle schema, database connection, and migrations.
- `apps/booster-role/src/config`: environment configuration and permission policy.
- `apps/web`: Vite-based verification UI.
- `apps/api`: Hono backend and tenant-scoped HTTP boundary.
- `packages/contracts`: shared verification types and pure checks.
- `apps/booster-role/src/*/*.test.ts`: unit and integration-style tests using Node's test runner
  and `expect`.

Booster roles are cosmetic only. They must be bot-managed, have no elevated
permissions, remain below the configured staff/admin anchor, and never be
usable to claim or modify an unrelated Discord role. Preserve these
permission and ownership boundaries in every role-related change.

## Tests and validation

- Add or update focused tests for every behavior change, especially domain
  guards, ownership checks, eligibility transitions, and Discord interaction
  validation.
- Use the repository's existing test style:
  `import { describe, test } from "node:test"` and `expect` assertions.
- Run the smallest relevant checks, then escalate when needed:

  ```bash
  pnpm test <path>
  pnpm run typecheck
  pnpm run typecheck:all
  pnpm run lint
  ```

- Do not weaken tests, type checking, or linting to make a change pass.
- Do not use live Discord or production databases in tests. Use fakes and
  in-memory test stores following the existing test patterns.

## Database and migrations

- The database is PostgreSQL accessed through Drizzle ORM.
- When `apps/booster-role/src/db/schema.ts` changes, generate a migration with
  `pnpm run db:generate` and review the generated SQL before applying it.
- Never edit an already-applied migration to change history. Add a new
  migration instead.
- Do not expose credentials in source, logs, tests, or documentation. Use
  `.env.example` for names and safe placeholders only.

## Documentation and configuration

- Update `README.md` when setup, commands, environment variables, deployment,
  or user-visible behavior changes.
- Keep CI, release, and container configuration consistent with the code.
- Do not add unrelated full-stack conventions to this TypeScript Discord bot
  and verification web app.
- API endpoints must resolve tenant context before reading or mutating tenant
  data. Never trust a client-provided tenant ID without authorization.
- Public landing routes may expose only explicitly public tenant summaries.
  Admin dashboard routes require authenticated tenant membership.

## Commits and delivery

- Use Conventional Commits:
  `<type>(optional-scope): <imperative description>`.
- Use `feat` for user-visible functionality, `fix` for bug fixes, `test`,
  `refactor`, `docs`, `chore`, `ci`, or `build` as appropriate.
- Keep commits focused and do not mix unrelated cleanup with a feature or fix.
- Before suggesting a commit or push, report the files changed and the
  validation commands that passed. Never push or publish without explicit user
  approval.

These project instructions adapt the engineering practices from
[`kana-best-practice-engineering`](https://github.com/kana-consultant/kana-best-practice-engineering)
to this repository's actual TypeScript, Discord, and PostgreSQL architecture.
