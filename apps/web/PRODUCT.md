# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Discord server owners and admins running a community that uses these
bots. Two moments of use — a public visitor evaluating the collection (what a
bot does, whether to install it), and a logged-in admin managing the server the
bot already runs in.

Regular members (boosters) never use this web app to do their job: they claim,
rename, recolor, and delete their cosmetic role through Discord slash commands.
They only reach the public pages, if they arrive at all.

## Product Purpose

MythEclipse Bot Collections is one monorepo of Discord bots with a single shared
web home: a public landing page, a per-bot catalogue and legal pages, a public
and an admin dashboard behind Discord login. (The server lookup was removed: it
  answered from a hard-coded demo tenant, so every result it could give was
  invented.)

Success means a server owner can understand what a bot does, install it, and
manage it in one place — and the collection can add the next bot without
standing up another site, login, and admin panel.

## Positioning

One dashboard per server for every bot in the collection. A single-purpose bot
site cannot truthfully copy this: here the collection is the product, so the
next bot extends the same workspace, the same legal registry, and the same
deploy instead of shipping a parallel site.

## Operating Context

- Bots run as separate Discord workers under `apps/`; Booster Role is live, the
  web app is the shared surface in front of the collection.
- Dashboard authentication is Discord OAuth (`identify guilds`). A session is
  issued only when the account holds Administrator or Manage Server in the guild
  named by `DISCORD_GUILD_ID`; the session cookie is HMAC-signed and HttpOnly.
- Deployment: Caddy serves the built SPA from
  `/opt/booster-role/current/apps/web/dist` and proxies `/api/*` to the
  `dcbot-web` systemd unit on `127.0.0.1:4025`. SPA and bot code swap and roll
  back together as one release.
- Local development: `pnpm run web:dev` (Vite, `/api` proxied to
  `127.0.0.1:8787`) plus `pnpm run api:dev`.
- Discord app-directory verification depends on the per-bot legal routes; those
  pages are read by Discord reviewers as the record of what data the bot uses.

## Capabilities and Constraints

Confirmed functionality:

- Landing page: hero, collection grid fed by `/api/public/bots`, public server
  closing call to action.
- Auth: `/api/auth/discord`, `/api/auth/discord/callback`, `/api/auth/session`,
  `/api/auth/logout`.
- Admin dashboard: guild overview (name, member count, booster count, managed
  role count) and a role-safety panel that calls `verifyBoosterRole` from
  `packages/contracts`.
- Legal: `/apps/$slug/privacy` and `/apps/$slug/terms` driven by a per-bot
  registry in `apps/web/src/legal/`. The collection-level answers (support,
  privacy, terms) live in one `#help` section on the landing page; the old
  `/support`, `/privacy` and `/terms` routes redirect there. Superseded: a
  separate collection
  indexes and a public support page.

Constraints:

- The web app never re-implements role-safety rules. `packages/contracts` is the
  single authority shared with the bot; the dashboard renders its verdict.
- Booster-created roles stay cosmetic: no dangerous permissions (Administrator,
  ManageRoles, ManageChannels, BanMembers, KickMembers, MentionEveryone,
  ManageGuild, ManageWebhooks) and no position above the anchor role.
- The public server lookup is removed until there is a real tenant table. It used
  to read a hard-coded demo store
  (`apps/api/src/tenantStore.ts`); real tenant data is not wired yet, and the
  dashboard does not use it.
- The dashboard is admin-only. There is no member-facing account surface.
- The API client uses a same-origin base URL by default, so production needs no
  build-time URL.
- User-facing copy is multilingual: English UI copy today, Indonesian repository
  docs. Which languages the app itself ships, and whether a language switcher
  exists, is undecided.
- Community Guard is a planned second bot with no code yet; nothing on the site
  may present it as shipped.

## Brand Commitments

- Names: MythEclipse Bot Collections for the collection; bots keep their own
  product names (Booster Role, Community Guard) independent of repository layout.
- Voice: plain and technical, no hype. Legal pages must describe exactly what the
  code does, because Discord reviewers read them as the reference.

## Evidence on Hand

- Live site: <https://dcbot.asepharyana.my.id>; live bot: Booster Role (Discord
  application `1504869409687076864`).
- Real copy exists: landing hero and section copy in
  `apps/web/src/routes/landing.tsx`; per-bot legal content in
  `apps/web/src/legal/`.
- Absent, and not to be fabricated: testimonials, customer logos, user or server
  counts, benchmarks, pricing, press. The landing trust strip's
  "COMMUNITIES / CREATORS / FRIENDS / TEAMS" is decorative, not evidence.

## Product Principles

1. The collection is the unit, not the bot: a new bot extends the existing
   dashboard, legal registry, and deploy rather than adding a site.
2. One authority per rule: shared contracts decide role safety for web and bot
   alike; the interface displays the verdict and never re-derives it.
3. Public breadth, admin depth: public pages stay readable without an account;
   anything needing a session sits behind Discord login.
4. Ship the bot and its site as one release, so code and static assets roll back
   together.
5. No claim without evidence: legal and marketing copy describe only what the
   code actually does.
