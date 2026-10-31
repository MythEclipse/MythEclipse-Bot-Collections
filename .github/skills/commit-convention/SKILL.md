---
name: commit-convention
description: "Create or review Conventional Commits for this pnpm monorepo. Use when preparing bot, web, shared-package, release, or changelog changes."
argument-hint: "Describe the changes to classify"
---

# Commit Convention

Use Conventional Commits:

```text
<type>(optional-scope): <imperative description>
```

Use `feat` for user-visible functionality, `fix` for bug fixes, and
`refactor`, `test`, `docs`, `chore`, `ci`, or `build` when appropriate. Use a
scope that identifies the affected workspace when useful, such as `bot`,
`web`, `contracts`, or `workspace`.
Include a `BREAKING CHANGE:` footer for breaking changes.

Before proposing a commit:

1. Inspect the complete diff.
2. Keep unrelated changes out of the commit.
3. Mention the validation commands that passed.
4. Do not commit or push unless the user explicitly requests it.
5. Treat changes to `packages/contracts` as potentially cross-application
   changes and verify both the bot consumers and web build.
