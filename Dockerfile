FROM node:24-slim

WORKDIR /app

# pnpm comes from the packageManager field (pnpm@10.33.2) via corepack.
RUN corepack enable

# The workspace root has no dependencies of its own any more (the bot moved to
# apps/bot), so the install below only resolves apps/bot. Its package.json must
# therefore be in the image BEFORE that step: copying it afterwards installs
# nothing and the container starts with no tsx and no drizzle-kit. The old
# root-level layout hid this, because the root package WAS the bot.
#
# Manifests first, source after, so the install layer survives source edits.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/bot/package.json ./apps/bot/

# NODE_ENV is still unset here on purpose: the unit runs `db:migrate` and the
# bot through devDependencies (drizzle-kit, tsx), so they are part of the
# payload, not build-time tools.
RUN corepack pnpm install --frozen-lockfile

# Only the bot is copied: nothing in the container runs apps/web, and it is the
# sole consumer of packages/contracts.
COPY apps/bot ./apps/bot

ENV NODE_ENV=production

CMD ["sh", "-c", "pnpm --filter @booster-role/bot db:migrate; pnpm --filter @booster-role/bot dev"]
