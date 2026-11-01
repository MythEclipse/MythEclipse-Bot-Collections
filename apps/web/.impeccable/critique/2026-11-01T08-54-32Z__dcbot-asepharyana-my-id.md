---
target: MythEclipse Bot Collections web app
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
target_identity: "url:https://dcbot.asepharyana.my.id/"
timestamp: 2026-11-01T08-54-32Z
slug: dcbot-asepharyana-my-id
---
⚠️ DEGRADED: single-context (no sub-agent tool exposed; Assessment A only, detector excluded by instruction)

# Design Critique — MythEclipse Bot Collections

**Target:** `https://dcbot.asepharyana.my.id` (reviewed as the built worktree in `apps/web`, served locally; live URL used for drift check)
**Mode:** Persuade (landing) → Operate (dashboard, lookup)
**Context loaded:** `apps/web/PRODUCT.md`, `apps/web/DESIGN.md` ("The Night Orchard")

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading/checking/`● Connected`/`Read from Discord at …` all present; but a failed query prints a bare API string (`Unauthorized`) as the whole collection section, with no retry and no indication of what failed |
| 2 | Match System / Real World | 2 | "Server slug", "workspace", "plan", "Anchor position", "Stored user ID" — none of these are words a Discord server owner uses; the login gate drops into Indonesian mid-sentence |
| 3 | User Control and Freedom | 2 | A lookup result cannot be cleared or dismissed; the verifier has no reset-to-defaults; there is no way back from a wrong slug except retyping |
| 4 | Consistency and Standards | 2 | One destination (`/dashboard`) wears four labels; English UI with an Indonesian gate; `aria-current="page"` on three elements at once, one of them a `/#products` link |
| 5 | Error Prevention | 2 | `required` on the slug field is the only constraint; the verifier accepts any text in every ID field and silently parses junk positions to `0` |
| 6 | Recognition Rather Than Recall | 2 | The visitor must already know a "server slug" that no screen in the product ever shows them; the only example is the dev fixture `demo-server` in a placeholder |
| 7 | Flexibility and Efficiency | 2 | Keyboard path works end to end and Enter submits the lookup; no shortcuts, no bulk, no saved/recent server |
| 8 | Aesthetic and Minimalist Design | 3 | Genuinely restrained — one hue, twelve sizes, hairlines, no shadows. Docked for a 420px abstract orbit carrying two unverifiable claims where product evidence should be |
| 9 | Error Recovery | 2 | "Server not found" names nothing and suggests nothing; auth failures are named (`denied`/`state`/`error`) but in the wrong language |
| 10 | Help and Documentation | 2 | Support page exists and is in the nav, but it is three bullets plus a `mailto:`; zero contextual help on slug, workspace, or any verifier field |
| **Total** | | **22/40** | **Acceptable — significant improvements needed** |

## Design Specificity Verdict

**LLM assessment.** The *system* is authored; the *page* is generic. `DESIGN.md` is unusually disciplined for a project this size — one accent, a five-step olive ladder, twelve type sizes with a stated ramp, hairline-only depth, an explicit "no kicker" rule. Rendered, it holds: 76.8px/780/−0.03em display, 8.55:1 hero lead, 6.76:1 card body, 2px lime focus rings at 3px offset on every control that isn't an input. That is real craft, not a template.

The composition is the problem. Copy-left / abstract-ornament-right hero, a 2-up card grid, a bordered panel with one form, a closing display CTA — delete the words and this is any indie dev-tool landing page from the last three years. The orbit (two rotated ellipse rings around a glowing core, labels "safe by design" / "built to scale") is the single most common abstract hero ornament in the genre, and its two labels are *claims with no evidence* — which directly contradicts PRODUCT.md principle 5, "No claim without evidence". The two cards are two sentences each. Nowhere on the public surface does a visitor see what Booster Role actually does: no role chip, no permission list, no `/boost` command, no verdict. The one artifact that is unmistakably this product — a booster role being checked against a safety contract and coming back "Safe to keep" — is behind a Discord login.

So: a visitor can tell this was designed by someone with a point of view, and cannot tell what it is for. The collection's own accent-per-bot mechanism (`--accent` from payload) is the most product-specific idea in the sheet, and it is spent on a 0.8rem status word.

**Deterministic scan.** Not run — excluded by instruction for this assessment. No detector findings are part of this critique, and none of the above is derived from one.

**Visual overlays.** None. No injection was performed, so there is no `[Human]` tab and nothing highlighted in the browser.

## Overall Impression

The visual layer is the strongest thing here and it is not the bottleneck. What is missing is *product proof and one vocabulary*. The site is written in the language of a platform ("workspace", "slug", "plan", "collection") for an audience that thinks in Discord terms ("my server", "boosters", "roles"). Then it asks them to log in through a paragraph in Indonesian. The single biggest opportunity: put the booster-role safety verdict — the real artifact, the thing no generic SaaS hero could show — on the landing page, and let the dashboard be the place where you *act* on it rather than a place where you retype fixtures.

## What's Working

1. **The type system earns its mass.** 780 weight, −0.04em tracking, 0.96 line-height at 76.8px, with exactly one Instrument Serif italic phrase per composition ("More capable.", "feel like yours."). It reads as architecture with one breath in it, and it holds at 390px where the h1 drops to 48px without reflowing into a paragraph.
2. **Contrast is real, not claimed.** Measured on the rendered page: hero lead 8.55:1, section body 7.3:1, card tagline 13.93:1, card body 6.76:1, orbit labels 7.92:1, footer micro-copy 7.3:1. Every text tone on the olive ladder clears AA with room. `DESIGN.md`'s "Text Tint Rule" is true in the browser, which is rare.
3. **The failure copy that exists is written, not generated.** "No bots are published yet. The first one lands here the moment it ships." and the 404's "This page drifted away." are in the product's voice. Someone thought about the empty and missing states.

## Priority Issues

### [P1] The dashboard gate changes language at the highest-stakes moment

- **What**: `/dashboard` signed out renders: h1 "Your workspace." (English) → h2 "Sign in to manage this server" (English) → body "Login memakai Discord dan hanya membuka workspace kalau akunmu punya izin Administrator atau Manage Server di server ini." (Indonesian, informal second person) → button "Continue with Discord" (English). The three OAuth failure messages in `dashboard.tsx` (`authMessages`) are also Indonesian.
- **Why it matters**: This is the one screen where a stranger decides whether to hand over a Discord account. Half the sentence — the half that explains the permission check — is in a language the rest of the product never uses, and the register ("akunmu") is chatty where the rest of the copy is plain-technical. A visitor who reads only English gets a heading, a button, and an unexplained gap. It also breaks the brand's own voice commitment in PRODUCT.md.
- **Fix**: Pick one language for the shipped UI and apply it to `dashboard.tsx`'s `SignIn` + `authMessages` first. If Indonesian is the target, the whole surface needs it (and PRODUCT.md says that is undecided — decide it). If English, rewrite the gate as: "Sign in with Discord. The workspace opens only if your account has Administrator or Manage Server in this server."
- **Suggested command**: `/impeccable clarify`

### [P1] The public lookup asks for a key the product never issues

- **What**: "Find your server workspace." → labelled field "Server slug" → placeholder `demo-server` → button "Check server". Nothing on the site tells a visitor what a slug is or where theirs comes from; the dashboard shows a guild *name* and guild *id*, never a slug. A hit renders `Demo Server / Active · free workspace · 1504869409687076864` — a raw snowflake and a plan tier, with no action attached. A miss renders "Server not found" and nothing else.
- **Why it matters**: The panel's entire premise is recognition, and it demands recall of a value the product never surfaces. `demo-server` is a dev fixture leaking into production copy. The success state is a dead end (what do I do with this?), and the failure state is unrecoverable (typo? not a customer? wrong key?). A server owner leaves with less confidence than before they typed.
- **Fix**: Two honest options. (a) Replace the slug field with the real path — "Sign in with Discord and we'll show the servers you manage", which is what the dashboard already does. (b) If the slug must stay, name it what the user owns ("Server ID or slug"), link to where it is found, keep the last result visible with a "Clear" control, and turn a hit into an action (`Open dashboard →`). Rewrite the miss as "No workspace uses that slug. Check the spelling, or sign in and we'll find your servers."
- **Suggested command**: `/impeccable clarify` then `/impeccable harden`

### [P1] The landing page never shows a bot

- **What**: The hero's right half is a 420px abstract orbit with two labels — "safe by design", "built to scale" — that assert quality and demonstrate nothing. The collection section is two 550×242 cards of two sentences each. No role, no permission list, no command, no dashboard view, no verdict anywhere on the public surface.
- **Why it matters**: A Persuade surface has to make the product legible before it asks for a login. Right now the only concrete claim a visitor can evaluate is "Cosmetic roles that respect your server", and the proof of it lives behind Discord OAuth. The ornament is the most expensive real estate on the page and it is spending it on adjectives — which also violates the project's own "no claim without evidence" principle.
- **Fix**: Replace the orbit's two labels with the product's actual artifact: a small role card — `✦ Booster Role · #c6f36b · position 4 · ManageRoles ✗ · KickMembers ✗` — under a `● Safe to keep` status chip, i.e. the verifier's verdict, rendered as a still. Keep the rings if you love them; let the artifact sit at their centre instead of a `✦`. On the Booster Role card, add the one line that makes it concrete: what a booster types, and what they get.
- **Suggested command**: `/impeccable bolder`

### [P1] The dashboard's main panel is a developer test harness wearing product clothes

- **What**: Below the three metric tiles, `RoleVerifier` renders nine text inputs (Discord user ID, Discord role ID, **Stored user ID**, **Stored role ID**, Role position, Anchor position, comma-separated permissions) and two checkboxes, all pre-filled with fixtures (`100000000000000001`, `100000000000000002`, positions `4`/`10`), then a Pass/Fail table.
- **Why it matters**: This is the contract's test fixture exposed as the product's second half. A server admin has no idea what "Stored user ID" or "Anchor position" mean, cannot obtain the values, and cannot act on the outcome — the panel answers a question nobody asked, in vocabulary from `packages/contracts`. It doubles the dashboard's control count (11 controls in one view) and buries the only thing the admin came for. The engineering idea behind it is excellent — one authority for the rule, rendered not re-derived — but the surface is aimed at the person who wrote it.
- **Fix**: Point the same contract at real data: pick a managed role from the guild, run `verifyBoosterRole` against it, show the verdict plus the failing check and the one action that fixes it ("This role has ManageRoles — remove it"). Keep the manual field grid behind a "Diagnostics" disclosure for the developer, or drop it. The verdict chip (`● Safe to keep` / `● Would be rejected`) is the right component; it just needs a real subject.
- **Suggested command**: `/impeccable distill` then `/impeccable shape`

### [P2] Four labels for one destination, and the phone loses the nav

- **What**: `/dashboard` is reached as "Admin login ↗" (nav), "Manage a server" (hero primary), "Manage bot →" (card), and "Open your dashboard →" (closing CTA). At 390px, `display:none` removes Bots, Support, Privacy, and Terms, leaving only the login pill — no menu, no drawer, no replacement.
- **Why it matters**: Four names for one place makes a visitor wonder whether they differ; the hero's "Manage a server" reads as an action, the nav's "Admin login" reads as a role, and both land on the same auth wall. On mobile the legal and support pages — the pages Discord reviewers read, per PRODUCT.md — are reachable only by scrolling to the footer. The four labels also compete inside a single viewport as four separate decisions.
- **Fix**: One primary verb for the destination ("Sign in" or "Open dashboard"), with the nav entry as the quiet version of it. On mobile, either keep Bots + Support + the login pill and move Privacy/Terms to the footer only (a deliberate rule), or ship a disclosure menu; do not silently delete four of five links.
- **Suggested command**: `/impeccable adapt` then `/impeccable clarify`

## Persona Red Flags

**Jordan (First-Timer, server owner who has never used a bot dashboard).** Hero asks him to "Manage a server" before telling him what managing means; he clicks, meets a sign-in card whose explanation is in Indonesian. He scrolls back, finds "Find your server workspace", is asked for a "Server slug" he has never seen — the placeholder `demo-server` is his only hint, and it looks like a real example, so he types it and gets "Demo Server / Active · free workspace · 1504869409687076864", a number that means nothing to him. He cannot tell whether he succeeded. Abandons at the lookup.

**Alex (Power User, runs three servers).** Wants the guild list. Gets one guild, because `DISCORD_GUILD_ID` names a single guild — the dashboard's own premise ("One dashboard for every server") is unreachable from the UI. No server switcher, no shortcuts, no bulk. He does find the verifier interesting for four seconds, then realises it wants him to type snowflakes he would have to fetch from Discord by hand, with a fake `100000000000000001` already in the box. He leaves to use the slash commands directly.

**Sam (Accessibility-dependent, keyboard + screen reader).** Strong start: skip link, `#main`, one `h1`, `h2`/`h3` in order, `aria-current` present, contrast 6.7:1+, 2px lime focus rings at 3px offset on every link and button. Then: the three form inputs (`.field input`, `.admin-form input`, `.verifier-grid input`) set `outline: none` and signal focus only by moving a 1px border from `#3b4738` to `#c6f36b` — a 1px change on a 1px edge, under the WCAG 2.4.11 area threshold, and invisible to anyone with reduced contrast sensitivity. Screen readers also get three `aria-current="page"` announcements on the landing page (header brand, the `/#products` link, footer brand) and none at all on `/apps/booster-role/privacy`.

## Minor Observations

- **Title emoji**: `<title>` is "🐴 MythEclipse Bot Collection — Discord bots for better communities". A horse has nothing to do with an eclipse, and the browser tab is the only place the brand appears as a favicon-less string.
- **Singular/plural drift**: `Bot Collection` in the wordmark tag and `<title>`, `Bot Collections` in the product name and legal pages.
- **`aria-current` overreach**: three elements claim to be the current page on `/`; one of them (`Bots` → `/#products`) is a fragment link, and per-bot legal pages have no active nav item at all.
- **Raw API strings as UI copy**: when `/api/public/bots` fails, the collection section renders `Unauthorized` as its entire content — the message the API happened to return, no retry, no framing. Same pattern for the dashboard overview.
- **"Ask about the waitlist →"** on Community Guard links to `/support`, which never mentions a waitlist — it is three pre-flight bullets and a `mailto:`. The label promises a queue that does not exist.
- **Measure drift**: `DESIGN.md` claims a 66ch legal measure; the rendered article is 699px at 16.8px ≈ 83ch.
- **Verifier IDs are unlabelled as fake**: `100000000000000001` reads as real data to anyone who does not know it is a fixture.
- **Deployed build is behind the worktree**: the live URL still ships five eyebrow kickers ("MYTHECLIPSE BOT COLLECTION", "THE COLLECTION", "PUBLIC LOOKUP", "READY WHEN YOU ARE"), a decorative trust strip ("COMMUNITIES / CREATORS / FRIENDS / TEAMS"), "Explore the bots ↓", and "All rights reserved" — all removed in the uncommitted tree, and the kickers contradict the sheet's own "no kicker" rule. Anything shipped from the current commit still carries them.
- **Orbit labels are `aria-hidden`**: the hero's decorative wrapper hides "safe by design" / "built to scale" from assistive tech, so the only two claim-bearing words in the hero are invisible to screen readers — and are the least defensible words on the page anyway.

## Questions to Consider

- If the orbit disappeared entirely and the space held a real booster role with a `● Safe to keep` verdict, would the page lose anything?
- What is "workspace" doing in a product whose users say "server"? Would "your server" survive everywhere it appears?
- The verifier already knows how to judge a role. Why is it asking an admin to type IDs instead of judging the roles the bot already manages?
- If the dashboard could only show one thing, would it be three member counts or one verdict with a fix button?
