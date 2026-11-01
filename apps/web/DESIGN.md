---
name: MythEclipse Bot Collections
description: One dashboard per server for every bot in the collection.
colors:
  basalt: "#10120f"
  basalt-deep: "#0f120e"
  shale: "#171b15"
  shale-raised: "#1c211a"
  slate: "#293127"
  slate-light: "#3b4738"
  bone: "#f4f1ea"
  mist: "#e1e8dc"
  ash: "#aab1a4"
  ash-soft: "#9ba496"
  signal-lime: "#c6f36b"
  lime-deep: "#a8d94f"
  orbit-blue: "#8ed8ff"
  error-surface: "#241714"
  error-border: "#5d3b33"
  error-text: "#f0b6a5"
  # light ("Day Orchard") overrides the same roles
  light-ground: "#eef1e6"
  light-ground-deep: "#e5e9db"
  light-surface: "#f7f9f1"
  light-surface-raised: "#e9eddf"
  light-line: "#cfd5c4"
  light-line-loud: "#b0b8a2"
  light-ink: "#1a1f16"
  light-ink-soft: "#2c3327"
  light-ink-muted: "#4f574a"
  light-ink-quiet: "#5c6453"
  light-signal: "#3d6606"
typography:
  display:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 6rem)"
    fontWeight: 780
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  display-cta:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4.5rem)"
    fontWeight: 780
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 3.4vw, 3rem)"
    fontWeight: 760
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  subhead:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.6vw, 2.25rem)"
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title-lg:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 750
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  small:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.55
  meta:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.06em"
  micro:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.1em"
  accent:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontWeight: 400
    fontFeature: "italic"
rounded:
  xs: "6px"
  sm: "9px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "22px"
  core: "28px"
  pill: "999px"
spacing:
  "2xs": "0.4rem"
  xs: "0.6rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
  "2xl": "4rem"
  "3xl": "5.5rem"
components:
  button-primary:
    backgroundColor: "{colors.signal-lime}"
    textColor: "{colors.basalt}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.35rem"
  button-primary-hover:
    backgroundColor: "{colors.lime-deep}"
    textColor: "{colors.basalt}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.35rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 0.95rem"
  input-field:
    backgroundColor: "{colors.basalt-deep}"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "0.72rem 0.8rem"
  nav-link:
    textColor: "{colors.ash}"
    typography: "{typography.small}"
  nav-link-hover:
    textColor: "{colors.bone}"
  card:
    backgroundColor: "{colors.shale}"
    textColor: "{colors.mist}"
    rounded: "{rounded.xl}"
    padding: "2rem"
  card-hover:
    backgroundColor: "{colors.shale-raised}"
    textColor: "{colors.mist}"
    rounded: "{rounded.xl}"
    padding: "2rem"
  metric-card:
    backgroundColor: "{colors.shale}"
    textColor: "{colors.bone}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  status-ok:
    textColor: "{colors.signal-lime}"
    typography: "{typography.small}"
  status-fail:
    textColor: "{colors.error-text}"
    typography: "{typography.small}"
  alert-error:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error-text}"
    rounded: "{rounded.md}"
    padding: "0.9rem 1.1rem"
  avatar:
    backgroundColor: "{colors.signal-lime}"
    textColor: "{colors.basalt}"
    rounded: "{rounded.pill}"
    size: "48px"
---

# Design System: MythEclipse Bot Collections

## Overview

**Creative North Star: "The Night Orchard"**

A dark olive ground with lime growing out of it. The surface sits in near black
(`#10120f`) and the only thing that comes up through it is one chartreuse green,
used as growth: the accent on a live status, the fill of the one action that
matters, a link, the "Eclipse" syllable. Nothing else is colored. Everything
else is a step of the same dark, separated by hairlines instead of shadows.

The voice is big and tight. Display type runs to 6rem with tracking pulled to
-0.04em and line-height under 0.96, so a headline reads as mass rather than as a
line of words, and one Instrument Serif italic phrase is set inside it to break
the grotesk — "More capable.", "feel like yours." That pairing is the whole
typographic idea: hard geometry, one soft interruption, self-hosted so it
actually renders.

Density is low and calm. Sections get 5.5rem of air, panels are 20px-rounded
slabs one step lighter than the ground, and no surface casts a shadow. The
composition is structural and restrained: hairline borders and tonal layering
carry the shape, and the lime stays reserved for signal.

**Key Characteristics:**

- One hue in play — Signal Lime on a Basalt ground — with no second accent.
- Display type as mass: 780 weight, -0.04em tracking, 0.96 line-height, 6rem cap.
- Two-tone type pairing: Inter Variable plus one Instrument Serif italic phrase.
- Flat surfaces, hairline borders, zero shadow anywhere.
- Generous vertical rhythm (5.5rem sections) against tight horizontal grids.
- No kicker labels: a heading carries its own weight, with no small label above it.

## Colors

A single-accent palette: one lime signal over five steps of dark olive-green
neutral, plus an error family that only appears when something failed.

### Primary

- **Signal Lime** (`#c6f36b`): the only accent. Live state (`● Connected`,
  `● Safe to keep`), the primary button, links, and the brand's "Eclipse"
  syllable. It is a signal, never a surface.
- **Lime Deep** (`#a8d94f`): the hover and pressed step of the primary button.
  The one place the accent is allowed to move.
- **Orbit Blue** (`#8ed8ff`): per-bot accent, injected per card via `--accent`
  from the API payload (Community Guard uses it). Everything outside a product
  card stays lime.

### Neutral

- **Basalt** (`#10120f`): page ground and the ink on lime.
- **Basalt Deep** (`#0f120e`): input wells and result strips, one step below the
  ground so fields read as cut into the page.
- **Shale** (`#171b15`): every raised panel — cards, panels, verifier, session
  bar, metric tiles, legal index cards.
- **Shale Raised** (`#1c211a`): the hover step for a card, one tone closer to the
  reader. Depth comes from this ladder, never from a shadow.
- **Slate** (`#293127`): the default hairline. Section dividers, card borders,
  table rules, footer rule.
- **Slate Light** (`#3b4738`): the louder hairline for interactive edges — input
  borders, the ghost login pill, orbit rings, card hover.
- **Bone** (`#f4f1ea`): body text on dark; also the ink on lime surfaces.
- **Mist** (`#e1e8dc`): emphasized text inside a panel — card taglines, the first
  column of a check table, long-form legal prose, the serif italic.
- **Ash** (`#aab1a4`): secondary text, nav links, form labels, the hero lead.
- **Ash Soft** (`#9ba496`): tertiary text — panel body copy, metric labels, muted
  notes, footer legal line.

### Named Rules

**The One Signal Rule.** Signal Lime covers at most ~10% of any viewport, and
only ever as text, a hairline-adjacent fill, or the single primary button. It
never becomes a section background.

**The Own Hue Rule.** A bot's accent color is read from data (`--accent`) inside
its own card. Never hard-code a bot hue into the stylesheet, and never let it
escape the card.

**The Text Tint Rule.** Every text tone on the dark ladder clears 4.5:1 against
its own background (Ash Soft on Shale is 6.8:1). No gray is borrowed from outside
the palette to make text "quiet"; use a lower step of the same olive.

## Typography

**Display Font:** Inter Variable, self-hosted (`@fontsource-variable/inter`)
**Body Font:** Inter Variable, same face, optical sizing on
**Accent Serif:** Instrument Serif italic, self-hosted
(`@fontsource/instrument-serif`)
**Mono:** `ui-monospace, SFMono-Regular, monospace` for IDs, permission names,
inline code

**Character:** A heavy grotesk squeezed until it reads as architecture, then
interrupted once per composition by a single Instrument Serif italic phrase. The
serif is not a second voice — it is a breath inside the first.

### Hierarchy

- **Display** (780, `clamp(3rem, 6vw, 6rem)`, 0.96, -0.04em): the landing hero.
  Two to four words per line, hard-broken by design.
- **Display CTA** (780, `clamp(2.25rem, 5vw, 4.5rem)`, 0.98, -0.04em): the
  closing call to action.
- **Headline** (760, `clamp(2.25rem, 3.4vw, 3rem)`, 1.05, -0.035em): section
  headings; the dashboard h1 and legal h1 sit on the same step.
- **Subhead** (750, `clamp(1.75rem, 2.6vw, 2.25rem)`, -0.03em): the lookup
  panel, the verifier heading.
- **Title Large** (750, 1.75rem): the guild name on the dashboard.
- **Title** (750, 1.5rem): product card names.
- **Title Small** (750, 1.35rem): panel headings, legal h2.
- **Lead** (400, 1.05rem, 1.6): the paragraph under a display or headline, capped
  at 46ch; legal body copy runs at the same size on a 56ch measure, which renders
  at roughly 70 characters per line in Inter.
- **Body** (400, 1rem, 1.65): default.
- **Small** (400, 0.9rem): nav links, form labels, muted notes, table cells.
- **Meta** (600, 0.8rem, 0.06em): table headers, footer fine print.
- **Micro** (700, 0.72rem, 0.1em, uppercase): status labels only.

### Named Rules

**The Tight Display Rule.** Type at 2.25rem or larger gets tracking between
-0.03em and -0.04em and a line-height at or below 1.05. Display type with
neutral tracking is off-system.

**The One Italic Rule.** Instrument Serif italic appears at most once per
composition, inside a display or headline. Never in body copy, a label, a
button, or a table.

**The Ramp Rule.** Twelve sizes exist and nothing sits between them: 0.72, 0.8,
0.9, 1, 1.05, 1.35, 1.5, 1.75, 2.25, 3, 4.5, 6rem. A fluid clamp may only
interpolate between two of those steps.

## Layout

A single 1180px container with 2rem gutters, centered, with 5.5rem of vertical
padding per section; below 760px the gutters drop to 1.25rem and the vertical
padding to 3.5rem. Nav, sections, footer, dashboard, and legal all share that
container, so the page has one left edge from top to bottom.

The hero is a 1.05fr / 0.95fr split — copy left, the safety verdict card right,
sitting on the orbit rings — vertically centered in a 560px-minimum band. Section headings use a 1fr / 1fr split so the
heading and its supporting paragraph share a baseline. Product cards flow in an
`auto-fit` grid with a 280px floor, so the collection grows without a new layout
rule. Metric tiles are three-up, verifier fields three-up, and both collapse to
one column at 900px. Legal pages narrow to an 860px page with a 56ch measure.

Rhythm comes in one scale: 0.4 / 0.6 / 1 / 1.5 / 2 / 3 / 4 / 5.5rem. Cards are
padded at 2rem (1.5rem for metric tiles), grids gap at 1rem, and the gap between
a heading block and its grid is 3rem.

## Elevation & Depth

Flat by default, and deliberately so. Depth is tonal, not cast: the page is
Basalt, every raised thing is Shale, and a 1px Slate hairline states the edge.
Cards move one step to Shale Raised on hover instead of lifting a shadow.

### Shadow Vocabulary

Empty. The system ships no `box-shadow` at all: the single lime glow that used to
sit under the orbit core was retired with the core, so elevation is now purely
tonal plus hairline. A glow on a dark ground is also the most generic move in the
current vocabulary — leaving it out is the more specific choice.

### Named Rules

**The Hairline Rule.** Surfaces are separated by a 1px border, never by a
shadow. If a panel needs to feel closer, raise its tone one step toward Shale
Raised rather than adding blur.

## Themes

Two themes ship, both from the same token block: **Night Orchard** (dark, the
default) and **Day Orchard** (light). Nothing about structure, spacing, type, or
component shape changes between them — only the ladder inverts:

| Role | Dark | Light |
|---|---|---|
| Ground | `#10120f` | `#eef1e6` |
| Ground (wells) | `#0f120e` | `#e5e9db` |
| Surface | `#171b15` | `#f7f9f1` |
| Surface raised (hover) | `#1c211a` | `#e9eddf` |
| Hairline | `#293127` | `#cfd5c4` |
| Hairline (loud) | `#3b4738` | `#b0b8a2` |
| Ink | `#f4f1ea` | `#1a1f16` |
| Ink soft | `#e1e8dc` | `#2c3327` |
| Ink muted | `#aab1a4` | `#4f574a` |
| Ink quiet | `#9ba496` | `#5c6453` |
| Accent as text (`--signal`) | `#c6f36b` | `#3d6606` |
| Accent as fill (`--lime`) | `#c6f36b` | `#c6f36b` |
| Ink on a lime fill (`--on-signal`) | `#10120f` | `#10120f` |

The accent splits in two. `--lime` is the *fill* — buttons, the colour swatch,
the selection highlight — and always carries `--on-signal` on top. `--signal` is
the accent as *text*: links, status labels, focus rings, the caret. On paper a
raw lime text sits at 1.3:1, so the light theme deepens `--signal` to `#3d6606`
(6.1:1 on the surface).

A bot's own hue (`--accent`, from the API payload) is chosen for a dark ground.
In the light theme it is mixed toward the ink before it is used as text:
`color-mix(in oklab, var(--accent) 42%, var(--bone))` lands at 5.4:1 (lime) and
6.1:1 (orbit blue) on the surface.

**The Two Theme Rule.** Every colour is a token; every token has a light value.
A component that looks wrong in one theme is a missing token, not a second
stylesheet.

**The No Flash Rule.** Theme and language are resolved by an inline script in
`index.html` before the first paint, from `localStorage` and then the OS
preference. React reads the resolved values back off `<html>`; it never decides
twice.

## Language

Two locales ship: English (`en`) and Indonesian (`id`). `en.ts` is the source of
truth and `id.ts` must satisfy its type, so a missing translation is a compile
error rather than an English sentence leaking into an Indonesian page.

- **Detection:** `localStorage` first, then `navigator.language` (`id*` → `id`),
  then English. The choice is stored under `mytheclipse.locale`.
- **Switcher:** a two-button segmented control in the nav, `aria-pressed` on the
  active one, labelled by the current locale.
- **Contract strings:** the rule engine's check labels are mapped to locale keys
  in one table; an unknown label renders untranslated instead of getting the
  wrong advice.
- **Legal bodies** ship in English only — they are the binding text. A translated
  page shows a notice saying so, rather than a half-translated policy.

## Shapes

Actions are pills (999px). Panels are soft slabs — 20px for cards, the role
rows, and the diagnostics disclosure, 22px for the lookup panel, 18px for the
admin form, 16px for metric tiles and legal index cards, 12px for alerts and the
session bar, 9px for fields and result strips. Inline `code` sits at 6px. The
recurring silhouette is the circle: pill buttons, the round login pill, the round
avatar, the colour swatch on the verdict card, and the two rotated ellipse rings
behind it. There are no hard 0-radius corners and no double borders.

## Components

Structural and restrained throughout: a component's shape comes from its
hairline border and its tonal step, not from weight or shadow. Every control
carries hover, focus-visible, active, disabled, loading, and error behaviour.

### Buttons

- **Shape:** fully rounded pill (`999px`), no border on the primary.
- **Primary:** Signal Lime fill, Basalt text, `0.8rem 1.35rem` padding, weight
  700. The only saturated block in the system.
- **Hover:** Lime Deep. **Active:** 1px down-translate. **Disabled:** Slate fill
  with Ash text and `cursor: not-allowed`.
- **Ghost / Login:** transparent fill, 1px Slate Light border, Bone text; hover
  flips border and text to Signal Lime.
- **Text link:** Signal Lime, no underline until hover, which draws a 1px lime
  underline.
- **Focus:** every control shows a 2px Signal Lime outline at 3px offset. There
  are no `outline: none` overrides anywhere in the sheet.

### Chips

- **Status label** (`● Connected`, `● Safe to keep`, `Available now`): Signal
  Lime, 0.72rem, weight 700, 0.1em tracking, uppercase, preceded by a literal
  bullet. Failure flips the same element to Error Text — the shape never changes,
  only the hue.
- **No kicker chips.** There is no small label above a heading; that role was
  removed from the system.

### Cards / Containers

- **Corner Style:** 20px (`xl`); metric tiles 16px.
- **Background:** Shale on Basalt; Shale Raised on hover.
- **Border:** 1px Slate; Slate Light on hover and around field-bearing panels.
- **Shadow Strategy:** none — see Elevation & Depth.
- **Internal Padding:** 2rem (metric tiles 1.5rem).
- **Product card:** name and status share a baseline row at the top, tagline in
  Mist, description in Ash Soft, and the "Manage bot →" link pinned to the
  bottom in the bot's own accent. No icon slot.

### Inputs / Fields

- **Style:** Basalt Deep well, 1px Slate Light border, 9px radius, Bone text,
  lime caret. Labels are Ash at 0.9rem above the field.
- **Hover:** border lifts to Ash. **Focus:** border goes Signal Lime *and* the
  2px lime outline at 2px offset stays on — a 1px border change alone is below
  the WCAG 2.4.11 focus-area threshold, so fields get the same ring as buttons.
- **Checkbox:** `accent-color` Signal Lime at 1.05rem, label horizontal in Mist.
- **Error:** not attached to fields; a full-width `form-error` alert (Error
  Surface, Error Border, Error Text, 12px radius) sits under the form and names
  the problem in the API's own words.

### Navigation

- **Style:** one row inside the 1180px container, 1.5rem vertical padding,
  wordmark left, five links right. Links are Ash at 0.9rem, hover to Bone, and
  the current page is marked with `aria-current="page"` in Bone.
- **Wordmark:** "Myth" in Bone plus "Eclipse" in Signal Lime, weight 780,
  tracking -0.04em, with a 0.72rem uppercase "Bot Collections" tag in Ash Soft.
  Inline, not flex — the two syllables must read as one word. It appears twice:
  as a link in the header, as plain text in the footer.
- **Tools:** a language segmented control (`EN` / `ID`, `aria-pressed`) and a
  44px theme toggle (☀ / ☾, `aria-label` naming the theme it switches to) sit
  right of the links.
- **Wrapping:** the row wraps instead of overflowing, at any width — the same
  rule covers a 320px phone and a 200% text zoom. Below 900px the four text
  links hide (they repeat in the footer) and the tools stay.
- **Mobile (≤760px):** the four text links hide; the ghost login pill stays.

### Signature: The Command

The landing hero's ornament is the product's own invocation, not a picture of
one: a Shale card carrying `/booster-role claim`, the two options a booster
fills in (`name`, `color` with its swatch), the result line — cosmetic, below
staff, no permissions — and a caption saying the bot makes the role and
permissions never leave staff.

Behind it, two 1px Slate Light ellipse rings (330×180 and 250×330) counter-rotate
on a 26s / 34s loop and are disabled under `prefers-reduced-motion`.

The card replaces the abstract orbit core and its two claim labels ("safe by
design", "built to scale"), and it deliberately carries no numbers: no role
count, no position, no member name. Anything that looks like data on the landing
page has to be data the page actually has.

### Role Safety List

The dashboard's main panel. One row per role the bot created, judged by
`verifyBoosterRole` from `@mytheclipse/contracts` — never re-derived in the web
layer. Each row carries the role name, a `● Safe to keep` / `● Would be rejected`
status, the member ID, and, when a check fails, the failing label with its detail
and the one action that fixes it. Failing rows take the Error Border hairline;
nothing else about the shape changes.

### Diagnostics Disclosure

A `<details>` panel holding the contract playground (six fields, two checkboxes,
a captioned check table). Closed by default, because an admin came for the
verdict, not the fixtures. Its copy says the values are samples. Tables inside a
scroll container sit in a `role="region"` with `tabIndex={0}`, so the columns
past the fold are reachable by keyboard.

### Breadcrumb

Legal detail pages open with a 0.9rem Ash Soft line — `Privacy / Booster Role` —
linking back to the index. It replaces the `aria-current` gymnastics a nav can't
do for a nested route.

## Do's and Don'ts

### Do:

- **Do** keep every surface on the Basalt → Shale → Shale Raised ladder, and
  state edges with a 1px Slate hairline.
- **Do** reserve Signal Lime for live status, the primary action, links, and the
  "Eclipse" syllable.
- **Do** keep display type at 780 weight with -0.03em to -0.04em tracking and a
  line-height at or below 1.05.
- **Do** break a headline with exactly one Instrument Serif italic phrase when
  the composition has a hero or CTA.
- **Do** read a bot's accent from `--accent` data inside its card.
- **Do** theme the browser's own surfaces: lime selection, lime caret, thin
  scrollbar in Slate Light that turns lime on hover, 3px underline offset, and
  `font-variant-numeric: tabular-nums` on every figure and date.
- **Do** give every interactive element hover, focus-visible, active, and
  disabled states before shipping it.
- **Do** let a heading carry its own weight, and start the section with the
  heading.
- **Do** show the product's real output (a role, a verdict, a command) instead of
  an abstract ornament that asserts quality.

### Don't:

- **Don't** introduce a third theme, a light surface outside the Day Orchard
  ladder, or a hard-coded colour anywhere outside the token block. Two themes
  ship; both are the same system with the ladder inverted.
- **Don't** fill a section or card with Signal Lime; it is a signal, not a
  surface.
- **Don't** put a kicker, eyebrow, or small label above a heading.
- **Don't** add a second sans-serif, a third decorative hue, or a serif anywhere
  outside the one italic phrase.
- **Don't** paint the accent on text in the light theme without mixing it toward
  the ink — the raw bot hue is chosen for a dark ground.
- **Don't** add a shadow to anything. There is no glow left in the system, and
  depth is a tone step plus a hairline.
- **Don't** put a table in a scroll container without `role="region"` and
  `tabIndex={0}`; keyboard users cannot reach the overflow otherwise.
- **Don't** use `rounded-full` on panels or 0-radius on actions; pills are for
  actions and circles, 16–22px is for containers.
- **Don't** invent a size between the twelve ramp steps, or a color outside the
  token block.