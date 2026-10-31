# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This repository contains the working Booster Role Discord bot, its tests,
deployment configuration, a pnpm monorepo web verifier, and GitHub Copilot
project instructions in `.github/copilot-instructions.md`.

## Tech stack

- Node.js 24 + TypeScript - primary runtime (run via tsx) and language for fast Discord bot development.
- discord.js - Discord gateway, slash commands, guild member, and role APIs.
- PostgreSQL + Drizzle ORM - persistent storage for booster role ownership and metadata.
- Vite + TypeScript - web verification app.
- `packages/contracts` - shared verification contracts and pure checks.
- `apps/api` - Hono multi-tenant backend.

## Development commands

- `pnpm install` - install dependencies.
- `pnpm run dev` - run the bot locally.
- `pnpm run web:dev` - run the web verification app locally.
- `pnpm run web:build` - build the web verification app.
- `pnpm run api:dev` - run the Hono API locally.
- `pnpm test` - run tests.
- `pnpm --filter @booster-role/bot test <path>` - run a single bot test file.
- `pnpm run typecheck` / `pnpm run typecheck:all` / `pnpm run lint` - run
  TypeScript validation for the bot or all workspace packages.
- `pnpm run db:generate` / `pnpm run db:migrate` - manage Drizzle migrations.

Bot source and migrations live under `apps/bot`; the root scripts delegate to
that workspace package.

## Architecture

The monorepo contains a Discord bot for assigning custom cosmetic roles to
users who boost the Discord server, plus a web verification app that checks
eligibility, ownership, permissions, and role position using shared contracts.

- Discord event handlers - track boost eligibility changes and remove custom roles when boosting ends.
- Slash commands - let eligible users claim, rename, recolor, or delete their custom cosmetic role.
- Role manager - create roles with no elevated permissions and keep them below staff/admin roles.
- Persistence layer - store user-to-role mappings, guild settings, and boost eligibility state.
- Permission boundary - booster-created roles must stay cosmetic and must not grant moderation, admin, channel, or integration permissions.
- Web verifier - provide a local verification surface without duplicating
  role-safety rules from the bot.
