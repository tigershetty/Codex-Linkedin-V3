# Shetty's Desk — Infographic Renderer & Production Playbook
**Created**: 2026-06-15 · **Status**: Active. Read this before building or generating any infographic template.
**Companion doc**: `../memory/visual-benchmarks/top100-visual-dna.md` (the 100-image analysis: 10 laws, 8 power formats, subject→format selector). This file is the *production* layer — how we actually build them.

---

## 0. What this is
A **deterministic HTML → PNG renderer** for Shetty's Desk LinkedIn infographics. We write a self-contained HTML template, and Playwright/Chromium screenshots it at exact pixels. Text and numbers are rendered by code (never hallucinated by an image model), so every output is precise, on-brand, and reproducible.

**Why code-render over Gemini:** structured posts (ladders, hubs, comparisons, KPI/formula cards, tables) need exact numbers, brand-locked layout, and clean geometry. Gemini stays as a fallback only for illustration/metaphor posts where exact data is not load-bearing.

---

## 1. Quick start
```bash
# one-time (per fresh container): browser binary for Playwright
npx playwright install chromium

# render all templates → out/*.png  (run from the renderer/ dir, or pass absolute path)
node render.mjs
# render one
node render.mjs templates/pf1-maturity-ladder.html out/pf1-maturity-ladder.png
```
- Playwright is used via the **global** install (resolved by absolute path inside `render.mjs`) — no repo dependency. `node_modules/` is gitignored.
- Output is `#card` screenshotted at `deviceScaleFactor: 2` → **2160×2700** PNG from a **1080×1350** layout.
- `render.mjs` resolves `templates/` and `out/` relative to itself, so cwd does not matter — but call it with the absolute path if your shell cwd has drifted.

---

## 2. Canvas & format (non-negotiable)
- **4:5 portrait — 1080×1350 baseline** (rendered @2x). This is the measured dominant format of the top-100 corpus (64/97 were exactly 4:5; 85/97 portrait). **Do NOT use 1:1 square** — the old `brand-params.json` 2048² spec is wrong for this genre.
- Extra-tall variant (1080×1600–2060) only for very dense tables.
- Never landscape (crops badly in feed).

---

## 3. Brand system
| Token | Value | Use |
|---|---|---|
| Coral (primary) | `#C15F3C` | accents, labels, the brand line |
| Claude clay | `#D97757` | the official Claude logo fill (lobehub) |
| Cream (base) | `#F4F3EE` | background base |
| Ink | `#191919` | primary text |
| Secondary text | `#5e544c` / grey `#8A857B` | body / muted |
| Caution (semantic) | `#C98A1E` (amber) | the ONE non-coral tone, used only for "watch for / do-not" |
| Level gradient | light coral → deep coral (`#F3E0D6` → `#B45A30` → `#682B11`) | encodes maturity/depth |

**Dramatic background recipe** (v2, 2026-06-15 — DARK THEATRE is now the standard; the warm-cream version was too subtle per Tiger). The look: a deep near-black warm canvas with a single saturated **ember glow** behind the hero element, and a heavy vignette so cards/tiers read like lit exhibits in a darkened gallery. The glow color is **content-adaptive** — it carries the post's meaning (coral for the brand default; the featured tool's identity hue for tool-specific posts, e.g. OpenAI green `#10A37F` on the ChatGPT cost-anatomy post).
```css
/* PF1 / PF5 pattern — coral ember on deep warm black */
.canvas{ background:
  radial-gradient(ellipse 75% 55% at 50% 57%, rgba(193,95,60,.46) 0%, rgba(150,55,22,.20) 46%, transparent 74%), /* ember glow */
  radial-gradient(ellipse 88% 30% at 50% 7%, rgba(255,235,210,.08) 0%, transparent 62%),                         /* top air */
  linear-gradient(180deg, #1E0E08 0%, #150B06 28%, #0E0703 62%, #080502 100%); }                                  /* deep base */
.canvas::after{ content:""; position:absolute; inset:0; pointer-events:none; z-index:9;
  background:radial-gradient(ellipse 98% 90% at 50% 53%, transparent 36%, rgba(0,0,0,.76) 100%); }                 /* heavy vignette */
```
Position the glow's `at X% Y%` directly behind the post's hero (the tier stack, the hub node, the cost column). On dark, **bump card/tier drop shadows to `rgba(0,0,0,.55–.72)`** so they separate from the background. Swap the ember's `rgba(193,95,60,…)` for the post's semantic hue to make the background adapt per concept.

**Color discipline:** semantic over decorative. One hue per category/level, carried consistently. Single-accent coral can't do red/green diagnostics, so encode levels by coral *value* (light→deep) and before/after by muted-grey vs coral. The amber caution tone is the only sanctioned exception. For tool-specific posts rendered in HTML, the featured tool's identity palette is allowed.

---

## 4. Typography
- **Brand font (locked 2026-06-15):** `Poppins` — the Shetty's Desk brand face per `../Brand Kit/brand-tokens.json`. Display/headings `Poppins 800`; labels `600–700`; body `400`; light captions `300`. Loaded via Google Fonts `<link>`; `document.fonts.ready` awaited in `render.mjs`. (Fraunces/Inter were stand-ins and have been removed.)
- For monospace prompt/code blocks (AI-for-SC posts) use `JetBrains Mono`.
- Working sizes that read well at 1080×1350 (from QA): hero/title 57–60px; section/level label 29–30px; card title 22–24px; body/row text 15.5–16.5px; tags/best-for 13–13.5px. Don't go below ~13px at 1080 width.

---

## 5. Icons & logos (how to add)
Three vendored sources under `assets/` (all inlined or referenced locally → deterministic, offline-safe):
- **UI glyphs → Lucide** (`lucide-static`, ISC). Inline the SVG `<path>`s with `stroke="currentColor"`; color via CSS. Vendored in `assets/icons/`.
- **AI brand logos → `@lobehub/icons-static-svg`** (Claude, Claude Code, OpenAI, Gemini, Copilot, Perplexity; `-color` variants carry brand colors). Vendored in `assets/logos/`. The Claude mark fill is `#D97757`.
- **Enterprise SC stack → `../Icons and Logos/`** (SAP, Oracle/NetSuite, Anaplan, Kinaxis, Workday, Dynamics 365, Epicor, Infor, Power BI, Excel, Office suite, Gartner…). The five used in PF5 are normalized into `assets/logos/sc/`.

To regenerate the icon set: `npm install @lobehub/icons-static-svg lucide-static` (in `renderer/`), then copy the SVGs you need into `assets/`. **Logo strips:** wrap each logo in a fixed-size box with `object-fit: contain` so mismatched aspect ratios read as one even row.

---

## 6. The 3D slab technique (the "impact" look)
Flat rounded rectangles read 2D. For real extruded depth (used in PF1):
```css
.tier{ border-radius:26px;
  background:linear-gradient(168deg, <light> 0%, <base> 70%, <deep> 100%);   /* lit top face */
  box-shadow:
    0 5px 0 <s1>, 0 10px 0 <s2>, 0 15px 0 <s3>, 0 20px 0 <s4>,               /* layered darkening edge = thickness */
    0 27px 38px rgba(120,70,40,.28),                                          /* soft cast shadow */
    inset 0 2px 0 rgba(255,255,255,.55); }                                    /* top gloss highlight */
```
`<s1..s4>` darken progressively. Pair with 3D icon orbs (`radial-gradient` + inset highlight). Geometry-heavy shapes (rings, pyramids, hub-spoke, funnels) are exactly why we code-render — clean shapes + exact text.

---

## 7. Layout laws (learned this session)
1. **3-zone vertical:** title (2 lines, one word coral-popped, + credibility sub) / body / [footer optional]. Body never touches edges.
2. **Repeated per-cell schema** is the #1 "designed not generated" tell: anchor (number/icon) → bold label → one-line gloss → optional tag (Use For / Best For / Limitation / Result).
3. **Side annotations need their own rail.** Never let margin text sit under a full-width block (this caused the "text behind the first block" bug). Use a CSS grid per row: `[left-rail | centered block | right-rail]`, so annotations align to their block automatically.
4. **One clean text block per layer** beats scattered callouts. PF1 uses a parallel "You ___ / It ___" line per level — it doubles as the progression story.
5. **Keep rows single-line.** Narrow blocks wrap text and overflow. Use a gentle taper (e.g. 100→89→78→67%) and a wide enough column; shorten copy before shrinking type.
6. **Budget the vertical.** Removing the footer frees ~56px. Confirm the last block clears the bottom; the 3D cast shadow may overflow into bottom whitespace (fine).
7. **Fill cards with flex.** Hollow card bottoms look unfinished — `display:flex;flex-direction:column` + `margin-top:auto` on the closing element (e.g. a Result box) anchors it to the bottom.
8. **More whitespace + bigger type reads more premium** than cramming. Bigger blocks, fewer words per line.
9. **Footer:** the heavy black bar was removed (Tiger's call, 2026-06-15). Default = no footer bar. (Sign-off/handle standard: TBD — see open questions.)

---

## 8. The reference templates
- **`templates/pf1-maturity-ladder.html`** — Power Format **PF1 Maturity Ladder** (reconstruction of corpus ref #71). Inverted 3D stacked pyramid, deepening coral, "START HERE" arrow descending into depth, per-layer "You/It" annotations. Self-location hook: "most planners never leave the first one." Dark theatre bg; **Claude mark top-right** (it's AI-branded content), **Shetty's Desk logo bottom-left supplement**.
- **`templates/pf5-radial-hub.html`** — Power Format **PF5 Radial Hub** (ref #97). Central Claude-logo orb = engine (deep-space bloom behind it), six feature cards each with a "BEST FOR:" tag, two grounded use-case cards + one amber "Watch for" honesty card, "Plugs into your stack" logo strip. Shetty's Desk logo bottom-left.
- **`templates/pf6-cost-anatomy.html`** — Power Format **PF6 Cost Anatomy** (AI-for-SC Ep28, *Should-Cost Model*, Category Manager × ChatGPT). **First end-to-end AI-for-SC pilot rendered from a real published-ready caption.** A proportional **stacked cost column** (Raw 40 / Labour 20 / Overhead 18 / Margin 22) where the one negotiable layer (margin) glows OpenAI green; right panel splits "set by the market 78%" vs "set by a choice 22%"; a monospace **copy-paste prompt block** (the AI-for-SC paste-it payload); a coral "watch for" honesty line. **Content-adaptive background**: emerald ember (not coral) because the tool is ChatGPT. Tool mark glows top-right; "Powered by ChatGPT" + Shetty's Desk logo in the footer.

**Logo convention** (established this session): the *featured AI tool's* mark sits in the **hero corner** (top-right); the **Shetty's Desk logo is a small bottom corner supplement**, never competing with content (matches benchmark rule P10/R… "branding only in footer"). Tool logos via `@lobehub/icons-static-svg` (`claude`, `openai` — `currentColor`, recolor to the tool hue). These are proven, hand-built outputs; next step is to parametrize into `{{token}}` templates the pipeline can fill (see open items).

---

## 9. Visual-QA checklist (run on every render)
- [ ] 4:5 (1080×1350); nothing clipped at the bottom edge
- [ ] One eye-first hero (title / number / shape)
- [ ] Every cell follows the same micro-schema
- [ ] No row text wrapping unintentionally; no orphaned single words
- [ ] Side annotations in their rail, not under a block; aligned to their block
- [ ] Color is semantic (coral depth for levels; amber only for caution)
- [ ] No hollow card bottoms (flex-fill); balanced whitespace
- [ ] Real icons (Lucide) + real logos (lobehub/SC set), no placeholder glyphs
- [ ] Background has the warm-gradient + glow + vignette
- [ ] No typos; numbers real; no em dashes
- [ ] Legible at mobile feed size (title + hero), dense detail OK as save-to-zoom

---

## 10. Session changelog (2026-06-14 → 06-15)
1. Analyzed 95/96 of the top-100 corpus (9 vision agents) → `top100-visual-dna.md`.
2. Measured canvas formats → switched target to **4:5 1080×1350** (corpus is 66% 4:5).
3. Built deterministic renderer (`render.mjs`, Playwright global-by-path).
4. Built **PF1** (maturity ladder) and **PF5** (radial hub) as coral-on-cream templates.
5. Added true **3D extruded slabs** + lit gradients + 3D icon orbs.
6. Integrated **Lucide** glyphs + **@lobehub/icons** (official Claude logo) + the **SC logo set** ("Plugs into your stack" strip).
7. Fixed "text-behind-first-block": introduced **left/right rails**; replaced jumbled callouts with **one per-layer text block**.
8. Fixed row-wrap/overflow with a gentler taper + wider column.
9. **Removed the black footer bars**; bumped type sizes for readability; flex-filled use-case cards; normalized the logo strip.
10. Added the **dramatic background** (warm gradient + coral hero glow + vignette).

---

## 11. Open items / TODO
- [ ] **Brand fonts** — replace Fraunces/Inter stand-ins (the last ~5% to pixel-final).
- [ ] **Footer/sign-off standard** — confirm: no footer at all, or a minimal cream handle? (`tiger-voice` hard rule currently says no "Shetty's Desk" sign-off on the image.)
- [ ] **Background drama level** — confirm warm-dramatic is the standard (vs a bolder dark variant for some posts).
- [ ] **Parametrize** PF1 + PF5 into `{{token}}` templates + a small data schema so `/autopilot` can fill any topic.
- [ ] **Build next formats** from the power-format shortlist: Comparison/Versus (ref #33), KPI/Formula Card (ref #5), Cheat-Sheet Grid (ref #70), Decision Tree (ref #54).
- [ ] Wire the **subject→format selector** + this QA checklist into the pipeline's visual-spec/visual-QA steps.
- [ ] Update `brand-params.json` canvas dims (2048² → 4:5) to match.

---

## 12. How to build a NEW template
1. Pick the power format from the subject→format selector in `top100-visual-dna.md`.
2. Copy the nearest reference template (`pf1`/`pf5`) as a starting skeleton.
3. Apply: 4:5 canvas + dramatic background; 3-zone structure; repeated per-cell schema; coral/semantic color; Lucide icons + relevant logos; 3D where geometry helps.
4. `node render.mjs templates/<new>.html out/<new>.png`, then run the §9 QA checklist by reading the PNG.
5. Iterate on the render (max ~2 passes), commit template + PNG.
