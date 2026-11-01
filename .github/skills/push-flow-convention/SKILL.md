---
name: push-flow-convention
description: "Prepare a safe local-to-remote push flow for this pnpm monorepo. Use when the user asks to push, release, inspect CI, or troubleshoot a failed bot or web build."
argument-hint: "Describe the branch or release operation"
---

# Push Flow Convention

Never force-push, rewrite history, retag, or publish without explicit approval.

1. Check the current branch, worktree, upstream, and recent commits.
2. Review the diff and run the relevant workspace checks:
   `pnpm test`, `pnpm run typecheck:all`, and
   `pnpm run web:build` when the web or shared contracts changed.
3. Use a Conventional Commit and keep the change focused.
4. Push only after the user explicitly approves the exact branch and commit.
5. For release failures, inspect the workflow run with `gh run list` and
   `gh run view <run-id> --log-failed`; fix forward with a normal commit.

This project uses semantic-release. Do not manually choose or retag versions.
The root package is the workspace orchestrator; the deployed Discord bot is
`@mytheclipse/booster-role`. Do not assume every workspace package is independently
released or deployed.
