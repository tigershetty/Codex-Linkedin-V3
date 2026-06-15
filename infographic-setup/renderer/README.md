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

**Dramatic background recipe** (v3, 2026-06-15 — **BRIGHT & LUMINOUS is the standard**). History: warm-cream v1 was too subtle; we tried a dark-theatre v2; Tiger's call is **bright** — and it matches the actual brand DNA (`brand-tokens.json`: "luminous, clean and airy, optimistic"). The look: a warm airy cream base with one large **saturated sunrise bloom** behind the hero plus a softer secondary warm glow — dramatic via *luminosity*, not darkness. PF1/PF5 (dark) are now legacy; rebuild them bright when next touched.
```css
.canvas{ background:
  radial-gradient(ellipse 64% 46% at 26% 26%, rgba(217,119,87,.34) 0%, rgba(217,119,87,.12) 42%, transparent 72%), /* coral sunrise bloom */
  radial-gradient(ellipse 58% 46% at 88% 64%, rgba(255,201,135,.30) 0%, transparent 66%),                          /* warm secondary glow */
  radial-gradient(ellipse 120% 90% at 50% 22%, #FFFFFF 0%, #FCF7EF 44%, #F4EBDC 100%); }                            /* luminous warm base */
.canvas::after{ content:""; position:absolute; inset:0; pointer-events:none; z-index:9;
  background:radial-gradient(ellipse 110% 96% at 50% 42%, transparent 72%, rgba(150,95,55,.10) 100%); }             /* faint warm edge, keeps it bright */
```
Cards on bright = white/cream (`rgba(255,255,255,.78)`) with a warm hairline border and a soft warm shadow (`0 16px 40px rgba(150,90,55,.14)`). Use ONE deliberate dark element per post for contrast/rhythm (e.g. the "worked example" card) — never a dark whole-canvas. Move the bloom's `at X% Y%` behind the post's hero.

### 3a. The Shetty's Desk signature — the CONSTANT CORAL THREAD (locked 2026-06-15)
This is what makes a post recognizably ours **beyond the logo** (Tiger's pick). The brand has exactly one constant: **coral is always present, in the same places, no matter what colour the content or tool brings.** The coral thread = the **eyebrow label**, the **one popped phrase in the hero line**, the **hero's framing element** (e.g. the "QUOTED PRICE · 100%" brace), and the **footer** (rule + handle + closing thesis). These are *always* `--coral #C15F3C`.

**Two-job colour rule** (locked 2026-06-15 — HOMOGENEOUS, tool-agnostic):
- **Coral = the brand thread AND the single data highlight.** Constant on every post. It marks both the brand furniture (eyebrow, hero pop, brace, footer) and the one element that carries the point (the negotiable margin layer, the "22%"). Single-accent discipline = the most "designed not generated" look.
- **Warm neutrals** (stone/taupe) for structural/secondary content; **amber `#C98A1E`** only for the "watch for / caution" line.
- **NO tool colours.** Every post uses the same Shetty's Desk palette regardless of which AI tool it features — that homogeneity is the standout (a ChatGPT post and a Claude post look like the same studio made them).
- **The tool is signalled ONLY by a small monochrome icon chip** ("BUILT WITH · [Tool]", top-right, ink, identical treatment every time — swap glyph + name). Tool logos via `@lobehub/icons-static-svg` rendered in `currentColor` ink, never the tool's brand colour. **No "Powered by [tool]"** — it reads as sponsorship.

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
8. **More whitespace + bigger type reads more premium** than cramming. Bigger blocks, fewer words per line. BUT (Law 10) — premium ≠ empty.
9. **Footer = the coral-thread sign-off** (Tiger's call, 2026-06-15): a thin coral rule + Shetty's Desk logo + handle (left) + a one-line **closing thesis in coral** (right) = the pin-it payload. No heavy black bar.
10. **Fill the canvas — dead whitespace is a QA failure** (Tiger, 2026-06-15). "Generous but never empty." If a zone is hollow, add *genuinely valuable* content (a worked example with real numbers, an extra insight card, the closing thesis) until the layout reaches the edges with balanced negative space. The goal is the "this is amazing / I should save this" density, not crowding.
11. **Tool logo adapts to available whitespace.** Don't fix its size — grow/place the featured tool's mark into whatever corner room a given layout leaves (PF6: ~74px in the open top-right). It scales with the post, it doesn't dictate the post.
12. **Add maximum *valuable* context.** Every post should clear the screenshot-and-use-it bar: a copy-paste prompt block (AI-for-SC), a real worked example, the structural-vs-movable verdict — context that makes someone keep it, on top of looking unmistakably Shetty's Desk.

---

## 8. The reference templates
- **`templates/pf1-maturity-ladder.html`** — Power Format **PF1 Maturity Ladder** (reconstruction of corpus ref #71). Inverted 3D stacked pyramid, deepening coral, "START HERE" arrow descending into depth, per-layer "You/It" annotations. Self-location hook: "most planners never leave the first one." **⚠ LEGACY DARK bg — rebuild bright + add the coral-thread footer when next touched.** Claude mark top-right; Shetty's Desk logo bottom-left.
- **`templates/pf5-radial-hub.html`** — Power Format **PF5 Radial Hub** (ref #97). Central Claude-logo orb = engine, six feature cards each with a "BEST FOR:" tag, two grounded use-case cards + one amber "Watch for" honesty card, "Plugs into your stack" logo strip. **⚠ LEGACY DARK bg — rebuild bright when next touched.**
- **`templates/pf6-cost-anatomy.html`** — **PF6 Cost Anatomy** (AI-for-SC Ep28, *Should-Cost Model*, Category Manager × ChatGPT). **The reference build for the current bright system** — first AI-for-SC post rendered from a real published-ready caption. Proportional **stacked cost column** (Raw 40 / Labour 20 / Overhead 18 / Margin 22) where only the negotiable margin layer carries the tool hue (OpenAI green); right column = "set by the market 78%" vs "set by a choice 22%" + a dark **worked-example card** ($4.20 unit → $0.92 you can move / $3.28 fixed, the one deliberate dark element); full-width **copy-paste prompt block**; coral "watch for" honesty line; coral-thread footer (rule + logo + handle + closing thesis). Bright luminous bg; constant coral thread; tool mark sized into the top-right whitespace; **no "Powered by".**

**Logo convention**: the *featured AI tool's* mark sits in the **hero corner** (top-right), sized to the corner's whitespace (Law 11), as a *capability* signal — never a "Powered by" line. The **Shetty's Desk logo anchors the footer** as part of the coral-thread sign-off. Tool logos via `@lobehub/icons-static-svg` (`claude`, `openai` — `currentColor`, tint to the tool hue).

**Build philosophy — design system, NOT parametrization** (Tiger, 2026-06-15): do **not** turn these into `{{token}}` fill-in templates — that makes every post in a format look identical, which Tiger explicitly rejects. Instead treat the repo as a **kit-of-parts**: reusable brand components (coral-thread header/footer, stat treatment, bright background recipe, 3D slab, prompt block, card anatomy, icon/logo system) that get assembled into a **fresh concept fitted to each topic** (cost → stacked column; maturity → ladder; risk → radar; flow → pipeline). *Parametrize the brand (constant), bespoke the concept (per topic).* The source Gemini-prompt files can be rewritten as structured **HTML render briefs** per post.

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
