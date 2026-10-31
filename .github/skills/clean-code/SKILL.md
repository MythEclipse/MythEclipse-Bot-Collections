---
name: clean-code
description: "Apply Clean Code, SOLID, Clean Architecture, and testable design practices when writing, refactoring, reviewing, or testing TypeScript in this pnpm monorepo, Discord bot, web verifier, or shared contracts."
argument-hint: "Describe the code or change to improve"
---

# Clean Code for the Monorepo

Use this skill for non-trivial implementation, refactoring, code review, and
test changes across the bot, web app, and shared packages.

## Procedure

1. Read the surrounding module, its callers, package boundary, and tests before
   editing.
2. Keep bot domain rules in `apps/bot/src/domain`, Discord integration in
   `apps/bot/src/discord`, persistence adapters in `apps/bot/src/services` or
   `apps/bot/src/db`, web UI in `apps/web`,
   and runtime-agnostic shared contracts in `packages/contracts`.
3. Keep functions focused on one responsibility. Prefer explicit names,
   narrow interfaces, early validation, and dependency injection over hidden
   global state.
4. Preserve error information. Use the repository's typed errors and logger;
   do not add broad catches, silent fallbacks, or `as any` casts.
5. Add focused tests for changed behavior and boundary cases.
6. Run the smallest relevant test plus typechecks for every affected package.
   For web changes, also run `pnpm run web:build`.

Avoid speculative abstractions, unrelated formatting changes, duplicated
verification logic in `apps/web`, and changes that make shared contracts
depend directly on Discord, Drizzle, or browser APIs.
