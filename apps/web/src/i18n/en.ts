/**
 * Source of truth for every user-facing string. `id.ts` must satisfy this
 * shape, so a missing translation is a type error rather than an English
 * sentence leaking into the Indonesian page.
 */
export const en = {
  "nav.primaryLabel": "Primary",
  "nav.bots": "Bots",
  "nav.support": "Support",
  "nav.privacy": "Privacy",
  "nav.terms": "Terms",
  "nav.signIn": "Sign in",
  "nav.language": "Language",
  "nav.theme.toLight": "Switch to light theme",
  "nav.theme.toDark": "Switch to dark theme",
  "brand.tag": "Bot Collections",
  "skip.link": "Skip to content",

  "footer.blurb": "Discord bots by MythEclipse. Each bot has its own terms and privacy policy.",
  "footer.legalLabel": "Legal",
  "footer.copyright": "© {year} MythEclipse",

  "landing.hero.line1": "Your server.",
  "landing.hero.line2": "More capable.",
  "landing.hero.lead": "A small, carefully built collection of Discord bots. One dashboard for every server that runs one.",
  "landing.hero.cta": "Open your dashboard",
  "landing.hero.secondary": "See the collection",

  "proof.result": "Role created — cosmetic, below your staff roles, no permissions.",
  "proof.caption": "What a booster types. The bot creates the role; permissions never leave your staff.",

  "products.heading": "One home for every bot.",
  "products.body": "One bot today. The next one lands here when it is actually ready. Every server gets its own isolated workspace.",
  "products.loading": "Loading the collection…",
  "products.error": "The collection could not be loaded.",
  "products.retry": "Try again",
  "products.empty": "No bots are published yet. The first one lands here the moment it ships.",

  "product.available": "Available now",
  "product.comingSoon": "Coming soon",
  "product.manage": "Manage bot →",


  "cta.line1": "Make your community",
  "cta.line2": "feel like yours.",
  "cta.body": "Sign in with Discord and the workspace opens only if you can manage the server.",
  "cta.button": "Open your dashboard",

  "dash.h1": "Your workspace.",
  "dash.lead": "Live state of the server Booster Role runs in.",
  "dash.checking": "Checking your session…",
  "dash.signIn.heading": "Sign in to manage this server",
  "dash.signIn.body":
    "Signing in uses Discord. The workspace opens only if your account has Administrator or Manage Server in this server.",
  "dash.signIn.button": "Continue with Discord",
  "dash.auth.denied": "That Discord account cannot manage this server, so the workspace stayed closed.",
  "dash.auth.state": "The sign-in took too long or came from another tab. Try again.",
  "dash.auth.error": "Discord rejected the sign-in. Try again in a moment.",
  "dash.signedInAs": "Signed in as",
  "dash.signOut": "Sign out",
  "dash.signingOut": "Signing out…",
  "dash.loadingServer": "Loading the server from Discord…",
  "dash.loadError": "Could not read this server from Discord.",
  "dash.rolesLoading": "Checking the roles the bot created…",
  "dash.rolesError": "Could not read this server's roles from Discord.",
  "dash.retry": "Try again",
  "dash.connected": "● Connected",
  "dash.guild": "Guild {id}",
  "dash.readAt": "Read from Discord at {time}",

  "metric.members": "Members (approx.)",
  "metric.boosters": "Boosters",
  "metric.managedRoles": "Managed roles",

  "roles.heading": "Booster roles in this server",
  "roles.summary": "{safe} of {total} roles pass every safety check.",
  "roles.allSafe": "● All safe",
  "roles.attentionOne": "● 1 needs attention",
  "roles.attention": "● {count} need attention",
  "roles.empty": "No booster has claimed a role yet. The first claim shows up here with its safety verdict.",
  "roles.safe": "● Safe to keep",
  "roles.rejected": "● Would be rejected",
  "roles.member": "Member {id}",

  "check.boosterEligibility": "Booster eligibility",
  "check.roleOwnership": "Role ownership",
  "check.botManaged": "Bot-managed role",
  "check.cosmeticPermissions": "Cosmetic permissions",
  "check.safePosition": "Safe role position",

  "fix.boosterEligibility": "Ask the member to boost again; the bot re-syncs on the next update.",
  "fix.roleOwnership": "Have the member run /booster-role claim again so the stored role matches.",
  "fix.botManaged": "The stored row outlived its role — delete the row and let the member claim a new one.",
  "fix.cosmeticPermissions": "Remove every permission from this role; it should be cosmetic only.",
  "fix.safePosition": "Drag the role below the bot's own role in Server Settings → Roles.",

  "diag.summary": "Diagnostics: judge a role by hand",
  "diag.note":
    "Sample values, not your server's data. This panel runs the same contract the bot uses, so you can see exactly why a role would be rejected.",
  "diag.userId": "Discord user ID",
  "diag.roleId": "Discord role ID",
  "diag.storedUserId": "Stored user ID",
  "diag.storedRoleId": "Stored role ID",
  "diag.rolePosition": "Role position",
  "diag.anchorPosition": "Bot role position",
  "diag.permissions": "Role permissions (comma separated)",
  "diag.permissionsPlaceholder": "ManageRoles, KickMembers",
  "diag.managed": "Role is managed by the bot",
  "diag.eligible": "User is currently boosting",
  "diag.caption": "Safety checks for the values above",
  "diag.check": "Check",
  "diag.detail": "Detail",
  "diag.result": "Result",
  "diag.pass": "Pass",
  "diag.fail": "Fail",
  "diag.region": "Safety checks",

  "support.h1": "Support center",
  "support.intro": "We help server admins keep things moving.",
  "support.body":
    "Tell us what happened and include your server id, the workspace id shown in the dashboard, and the command you used. Never send your bot token or password.",
  "support.before": "Before contacting us",
  "support.before.one": "Confirm the bot is still in the server and its role sits above the roles it manages.",
  "support.before.two":
    "Confirm the member still has the booster eligibility role, otherwise their role is removed on purpose.",
  "support.before.three": "Check the dashboard for the workspace state and the last update time.",
  "support.contact": "Contact",
  "support.emailLabel": "Support email",
  "support.legal": "For how data is handled see each bot's privacy policy; for the rules of use, its terms of service.",

  "legal.privacy": "Privacy",
  "legal.terms": "Terms",
  "legal.updated": "Last updated",
  "legal.effective": "Effective",
  "legal.notFound.title": "Document not found",
  "legal.notFound.subtitle": "No legal document lives at this address.",
  "legal.notFound.body.one": "Pick a bot from the",
  "legal.notFound.body.two": "or",
  "legal.notFound.body.three": "index.",
  "legal.index.privacy.subtitle": "Each bot has its own policy. This page explains the collection around them.",
  "legal.index.terms.subtitle": "Each bot has its own terms. This page explains the collection around them.",
  "legal.index.privacy.body":
    "MythEclipse Bot Collections is a set of Discord bots run by the same developer. Every bot publishes its own privacy policy, because each one requests different Discord intents and stores different data.",
  "legal.index.terms.body":
    "MythEclipse Bot Collections is a set of Discord bots run by the same developer. Every bot publishes its own terms of service, because each one asks for different Discord permissions.",
  "legal.index.bots": "Bots in the collection",
  "legal.index.policy": "Privacy policy",
  "legal.index.termsLink": "Terms of service",
  "legal.index.site": "This website",
  "legal.index.privacy.site":
    "The site you are reading is a static page. It sets no cookies, runs no analytics or tracking scripts, and asks for no account. It calls the collection's own API only to list bots and to load a server dashboard; nothing from that call is shared with a third party.",
  "legal.index.terms.site":
    "The site you are reading is informational. Using it does not grant you access to a bot beyond what Discord itself allows, and the bots may be changed or stopped at any time.",
  "legal.index.contact": "Contact and changes",
  "legal.index.contact.body":
    "Questions about any bot or about the collection: {email}. When a bot's behaviour changes, its own page is updated and the date at the top of that page moves with it.",
  "legal.notice": "",

  "notFound.h1": "This page drifted away.",
  "notFound.body": "The link may be old.",
  "notFound.back": "Back to the landing page"
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;