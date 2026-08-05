# Shetty's Desk — Precision Artifact & Motion Renderer
**Created**: 2026-06-15 · **Status**: Active only for separate exact artifacts, carousels, and approved motion finishing. Read `../references/visual-engine-v2.md` first.
**Active companions**: `../references/creative-genome-recombination-engine-v1.md` (source selection and recombination) · `../references/visual-engine-v2.md` (visual authority) · `../references/creative-review/signature-system-v1.md` (active selection guardrail) · `../references/layout-frameworks-intelligence.md` (optional layout vocabulary) · `../memory/visual-benchmarks/top100-visual-dna.md` (historical Top-100 pattern analysis). This file is the deterministic *production* layer.

---

## 0. What this is
A **deterministic HTML → PNG/GIF/MP4 renderer** for Shetty's Desk LinkedIn infographics. We write a self-contained HTML template, and Playwright/Chromium screenshots it at exact pixels. Text and numbers rendered by code stay precise and reproducible.

**Current role:** the image engine is the primary renderer for a standard creative still. Use this
renderer only for a separate precise artifact, exact-data visual, controlled carousel, or the Motion
Engine v1 finishing lane. It must never add HTML/SVG, dashboard, title, footer, or logo layers over
an image-engine-native standard post.

The 2026-06-21 code-render-primary decision is superseded. Both active pipelines are GPT Image 2-first for creative stills; code render remains a maintained precision tool.

---

## 1. Quick start
```bash
# one-time (per fresh container): browser binary for Playwright
npx playwright install chromium
# If Playwright's CDN is blocked (e.g. sandboxed egress), get Chrome via puppeteer's
# bucket instead, then point the renderer at it (render.mjs/render-anim.mjs honour CHROME_PATH):
#   npx puppeteer browsers install chrome
#   export CHROME_PATH=/root/.cache/puppeteer/chrome/*/chrome-linux64/chrome
# Fonts are self-hosted (assets/fonts.css → assets/fonts/*.woff2) so renders work offline.

# render all templates → out/*.png  (run from the renderer/ dir, or pass absolute path)
node render.mjs
# render one
node render.mjs templates/pf1-maturity-ladder.html out/pf1-maturity-ladder.png

# render the approved EOQ delayed-reveal composition → MP4 + optimized GIF
env W=1003 H=1568 FPS=30 GIF_FPS=20 GIF_W=720 HOLD_S=0 \
  node render-anim.mjs ../../videos/optimal-batch-size-motion/compositions/delayed-reveal.html \
  ../data/2026-W30/optimal-batch-size-decision-board/visual-motion-delayed-reveal-v2

# if Playwright is available from a bundled runtime instead of npm -g
PLAYWRIGHT_NODE_MODULES=/path/to/node_modules node render.mjs templates/x.html out/x.png
```
- Playwright is resolved from `PLAYWRIGHT_NODE_MODULES`, then `NODE_PATH`, then the global install — no repo dependency. `node_modules/` is gitignored.
- Output is `#card` screenshotted at `deviceScaleFactor: 2` → **2160×2700** PNG from a **1080×1350** layout.
- `render.mjs` resolves `templates/` and `out/` relative to itself, so cwd does not matter — but call it with the absolute path if your shell cwd has drifted.

### 1a. Motion poster lane — approved static → GIF/MP4

Use this for picture-first LinkedIn GIFs where the approved visual stays intact.
Read `../references/motion-engine-v1.md` before building. The active pipeline is:

`post-card.md` active visual -> post-specific motion brief -> semantic component map -> masks/covers/highlights -> HTML/SVG/GSAP timeline -> Playwright frames -> FFmpeg MP4 + GIF.

Rules:
- Resolve the approved active visual from `post-card.md` and keep that exact still as the locked
  background. `visual.png` is only a legacy-compatible alias, never the authority.
- Map components from the actual layout and reading order.
- Use semantic masks for clean color elements, fitted cover plates for object cards, and whole-component reveals for integrated charts or 3D scenes.
- Use source-derived highlights and restrained SVG signals only as support.
- Do not move body text, rewrite labels, or regenerate logos in the motion layer.
- Never animate raw rectangular crops; they carry neighboring pixels, shadows, and background into collisions.
- Inspect the fully cleared/reset state at source resolution before final rendering.
- Require pixel-identical opening and closing lossless frames.
- Export MP4 as the fallback even when the publishing intent is GIF.

For the approved EOQ reference implementation, see:
- `../../videos/optimal-batch-size-motion/README.md`
- `../../videos/optimal-batch-size-motion/build_motion_masks.py`
- `../../videos/optimal-batch-size-motion/compositions/delayed-reveal.html`
- `../../videos/optimal-batch-size-motion/shot-plan-delayed-reveal.json`

Initialize a new post-specific project after the active visual named by `post-card.md` is approved:

```bash
cd ..
node scripts/init-motion-project.mjs data/{week}/{slug}
```

Use `FRAMES_DIR=../../videos/{slug}-motion/qa/frames` with
`KEEP_FRAMES=1` for project-specific QA evidence.

---

## 2. Canvas & format (non-negotiable)
- **4:5 portrait — 1080×1350 baseline** (rendered @2x). This is the measured dominant format of the top-100 corpus (64/97 were exactly 4:5; 85/97 portrait). **Do NOT use 1:1 square** — the old `brand-params.json` 2048² spec is wrong for this genre.
- Extra-tall variant (1080×1600–2060) only for very dense tables.
- Never landscape (crops badly in feed).

---

## 3. Brand system — THE ACTUAL SHETTY'S DESK BRAND KIT (corrected 2026-06-16)
⚠️ **Hard correction.** Earlier templates (PF1/PF5/PF6 + the v1 PF7) used a **coral/terracotta-on-cream** palette. That was WRONG — it took the *logo's* identity colour (terracotta) and mis-used it as the *content* palette, which `brand-tokens.json` explicitly forbids ("the logo layer is terracotta/olive… the content layer is azure/eco-green… don't mix the two palettes"). The real brand is **azure-blue + eco-green, ink-blue text, Poppins, luminous & airy on WHITE, flat-isometric.** PF7 v3 is the corrected reference. **PF1/PF5/PF6 must be rebuilt to this palette.**

| Token | Value | Use |
|---|---|---|
| Azure (primary) | `#2798FB` | the hero brand blue |
| Sky / Royal / Deep / Navy | `#50A9F7` / `#247BE1` / `#215DC3` / `#1939A5` | blue range: structure, bars, headlines, depth |
| **Eco-green (SIGNATURE)** | `#38E6A6` (text-safe `#14B07E`) | the positive / progress / highlight / "the smart choice" — appears on the win in every post |
| Mint | `#8FF3CC` | light end of the eco gradient |
| Coral-pink (negative) | `#E27199` | warning / cost / the inferior option — **sparingly**, the only warm accent |
| Ink / Muted / Line / Tint | `#15315C` / `#5D7599` / `#DCEAF8` / `#E2F0FB` | text / body / borders / card & bg fills |
| Eco gradient (signature) | `linear-gradient(135deg,#8FF3CC,#38E6A6,#2798FB)` | the highlight element |
| Blue gradient | `linear-gradient(135deg,#50A9F7,#215DC3,#1939A5)` | badges, bars, the pin header rule |

**Background — luminous, clean, airy on WHITE** (brand DNA; "no dark or busy backgrounds"):
```css
.canvas{ background:
  radial-gradient(ellipse 50% 38% at 85% 4%, rgba(56,230,166,.16) 0%, transparent 60%),   /* eco glow */
  radial-gradient(ellipse 60% 42% at 6% 30%, rgba(39,152,251,.13) 0%, transparent 58%),    /* azure glow */
  linear-gradient(180deg,#FFFFFF 0%,#F3F9FE 60%,#EAF3FD 100%); }                            /* white → very light blue */
```
Cards = solid `#fff` with a `--line #DCEAF8` hairline + soft blue shadow (`0 20px 44px rgba(33,93,195,.12)`). Generous negative space.

### 3a. The Shetty's Desk signature (corrected)
The brand's own signature element (per the kit) is **the eco-green→azure gradient on the "win"** + the **pin header** (number/topic badge → UPPERCASE title → thin azure rule fading right) + the **mixed-weight stat callout** (huge 800 number beside small 300 uppercase caption). Recognition comes from the *blue-and-green isometric system on white*, not a coral thread.

**Colour semantics (do not break — from `brand-tokens.json`):**
- **Blue** = the system / structure / neutral subject (titles, bars, badges, the pin rule).
- **Eco-green** = positive / progress / the recommended choice / the highlighted win. Put it on the one element that is the good outcome (e.g. the winning supplier, the TCO lead row).
- **Coral-pink** = negative / cost / the inferior option / caution — used sparingly.
- **Tool colour rule:** the content stays in the Shetty's palette; the **AI tool appears only as its logo** (large, in its own mark colour — e.g. Claude clay `#D97757`). The tool never recolours the content.

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

## 6b. Genuine 3D (isometric) + composition modes (2026-06-21, the supplier-quote standard)
The §6 slab technique fakes depth with stacked box-shadows. For a **true 3D object** (towers, prisms, stacked stages) use **JS-computed clip-path isometry** — deterministic and far more robust than CSS 3D transforms.

**Do NOT use CSS 3D transforms** (`rotateX/Y`, `translateZ`, `preserve-3d`). They proved fragile here — layers flatten without `preserve-3d`, walls fire below the floor with the wrong rotation sign, square footplates leave gaps. Compute the isometry in JS instead:
```js
// world (u,v) on the ground plane, height h upward → screen (x,y)
const iso = (u,v) => [OX + (u-v)*a, OY + (u+v)*b];   // a≈half-tile-w, b≈a/2
// a prism = base diamond + LEFT wall + RIGHT wall (clip-path parallelograms) + TOP cap diamond
// light: top cap lightest, left wall mid, right wall darkest (shade base hex by +/− amount)
```
A stacked tower = N iso bands, each height ∝ its value (benchmark #43 in real depth). Pair with `conic-gradient` **Harvey balls** (`conic-gradient(c 0 X%, #E6F0FA X% 100%)`) for the precise scorecard behind the heights.

**Composition modes — pick deliberately per topic:**
- **Mode A — hero-dominant / integrated.** One complex thing → the hero owns **60–70% of the canvas**; supporting detail is pushed *into* it (leader-line annotations pinned to the object, in-place data labels, anchored micro-viz, embedded axis/legend, zoom inset). For a single mechanism / "how X works." **Guardrail:** strict anchor grid + leader lines only — loose floating text is a fail.
- **Mode B — layered multi-block.** Comparison / multiple data cuts → 3D hero + 2–3 clean supporting elements. The **4-layer** pattern: gestalt (3D hero) + precision (scorecard) + proportion (part-to-whole bar) + narration (side callouts). **Fill whitespace with information, not decoration.**

**isometry gotchas (cost a render each):** `inset:'auto'` is shorthand for top/right/bottom/left — set it *before* `left`/`top` or it wipes them; `clip-path` clips `box-shadow` (use `filter:drop-shadow()`); a CSS-grid divider must be a real grid item (`gridColumn:'1/5'`), not a class on an inner div.

---

## 7. Historical precision-artifact layout notes (not standard-post guidance)

These observations apply only after a precision artifact, controlled carousel, or code-rendered
motion composition has been deliberately selected. A standard Fast Post Loop does not use these
layout laws, footer conventions, multi-block schemas, or HTML template mechanics.
1. **Optional 3-zone vertical:** title / body / [footer optional] can be useful for a selected
   precision artifact. Body never touches edges.
2. **Repeated per-cell schema** is the #1 "designed not generated" tell: anchor (number/icon) → bold label → one-line gloss → optional tag (Use For / Best For / Limitation / Result).
3. **Side annotations need their own rail.** Never let margin text sit under a full-width block (this caused the "text behind the first block" bug). Use a CSS grid per row: `[left-rail | centered block | right-rail]`, so annotations align to their block automatically.
4. **One clean text block per layer** beats scattered callouts. PF1 uses a parallel "You ___ / It ___" line per level — it doubles as the progression story.
5. **Keep rows single-line.** Narrow blocks wrap text and overflow. Use a gentle taper (e.g. 100→89→78→67%) and a wide enough column; shorten copy before shrinking type.
6. **Budget the vertical.** Removing the footer frees ~56px. Confirm the last block clears the bottom; the 3D cast shadow may overflow into bottom whitespace (fine).
7. **Fill cards with flex.** Hollow card bottoms look unfinished — `display:flex;flex-direction:column` + `margin-top:auto` on the closing element (e.g. a Result box) anchors it to the bottom.
8. **More whitespace + bigger type reads more premium** than cramming. Bigger blocks, fewer words per line. BUT (Law 10) — premium ≠ empty.
9. **Footer = the sign-off rule** (Tiger's call, 2026-06-15; mechanics corrected 2026-06-21; logo corrected 2026-06-21): a thin full-width gradient **rule that sits ABOVE the foot row** (`margin-top:auto` pushes the block to the bottom) — **never a divider drawn over the logo/text** (that overlap was an explicit reject). **SC 101 foot row** = **Shetty's Desk Logo 2** (`assets/logos/shettys-desk-logo-2.png`, the **dark-wordmark** lockup made for light backgrounds, ~74px) on the LEFT — it carries the "Shetty's Desk" wordmark, so there is **no separate text label** — and the **"Poornajith Shetty" signature** on the RIGHT. ⚠ **Logo 1 is the white-wordmark lockup for dark backgrounds — invisible on white; do not use it on the cards.** AI-for-SC keeps the same footrule + signature footer; its RIGHT side may instead carry the one-line **closing thesis**. No heavy black bar.
10. **Fill the canvas — dead whitespace is a QA failure** (Tiger, 2026-06-15). "Generous but never empty." If a zone is hollow, add *genuinely valuable* content (a worked example with real numbers, an extra insight card, the closing thesis) until the layout reaches the edges with balanced negative space. The goal is the "this is amazing / I should save this" density, not crowding.
11. **Tool logo adapts to available whitespace.** Don't fix its size — grow/place the featured tool's mark into whatever corner room a given layout leaves (PF6: ~74px in the open top-right). It scales with the post, it doesn't dictate the post.
12. **Add maximum *valuable* context.** Every post should clear the screenshot-and-use-it bar: a copy-paste prompt block (AI-for-SC), a real worked example, the structural-vs-movable verdict — context that makes someone keep it, on top of looking unmistakably Shetty's Desk.

---

## 8. The reference templates
- **`templates/pf1-maturity-ladder.html`** — Power Format **PF1 Maturity Ladder** (reconstruction of corpus ref #71). Inverted 3D stacked pyramid, deepening coral, "START HERE" arrow descending into depth, per-layer "You/It" annotations. Self-location hook: "most planners never leave the first one." **⚠ LEGACY DARK bg — rebuild bright + add the coral-thread footer when next touched.** Claude mark top-right; Shetty's Desk logo bottom-left.
- **`templates/pf5-radial-hub.html`** — Power Format **PF5 Radial Hub** (ref #97). Central Claude-logo orb = engine, six feature cards each with a "BEST FOR:" tag, two grounded use-case cards + one amber "Watch for" honesty card, "Plugs into your stack" logo strip. **⚠ LEGACY DARK bg — rebuild bright when next touched.**
- **`templates/pf6-cost-anatomy.html`** — **PF6 Cost Anatomy** (AI-for-SC Ep28, *Should-Cost Model*, Category Manager × ChatGPT). **The reference build for the current bright system** — first AI-for-SC post rendered from a real published-ready caption. Proportional **stacked cost column** (Raw 40 / Labour 20 / Overhead 18 / Margin 22) where only the negotiable margin layer carries the tool hue (OpenAI green); right column = "set by the market 78%" vs "set by a choice 22%" + a dark **worked-example card** ($4.20 unit → $0.92 you can move / $3.28 fixed, the one deliberate dark element); full-width **copy-paste prompt block**; coral "watch for" honesty line; coral-thread footer (rule + logo + handle + closing thesis). Bright luminous bg; constant coral thread; tool mark sized into the top-right whitespace; **no "Powered by".**

- **`templates/sc101-quote-iso-towers.html`** — **the 101 visual standard (2026-06-21), "How to compare supplier quotes."** Mode-B 4-layer composition: a genuine-3D **isometric stacked-criterion tower** per supplier (height = total value, §6b JS clip-path isometry) + floating price tags / crowned best-value badge + two side callouts + a **Harvey-ball scorecard** (5 criteria × 3 suppliers, `conic-gradient` pie-fills) + a **part-to-whole "share of total value" bar**. No AI-tool logo (101). Tightened padding; footrule-above-row footer — **Shetty's Desk Logo 2** (dark-wordmark lockup) on the left + **"Poornajith Shetty"** signature on the right. This is the reference for the higher 101 + AI-for-SC visual bar: real 3D + multi-element information density on the homogeneous brand frame.

**Logo convention**: the *featured AI tool's* mark sits in the **hero corner** (top-right), sized to the corner's whitespace (Law 11), as a *capability* signal — never a "Powered by" line (AI-for-SC only — **101 carries no tool mark**). The **Shetty's Desk logo anchors the footer** as part of the sign-off. Tool logos via `@lobehub/icons-static-svg` (`claude`, `openai` — `currentColor`, tint to the tool hue).

**Build philosophy — design system, NOT parametrization** (Tiger, 2026-06-15): do **not** turn these into `{{token}}` fill-in templates — that makes every selected precision artifact in a format look identical, which Tiger explicitly rejects. Instead treat the repo as a **kit-of-parts**: reusable brand components (coral-thread header/footer, stat treatment, bright background recipe, 3D slab, prompt block, card anatomy, icon/logo system) that get assembled into a **fresh precision concept fitted to each topic** (cost → stacked column; maturity → ladder; risk → radar; flow → pipeline). *Parametrize the brand (constant), bespoke the concept (per topic).* The source Gemini-prompt files can be rewritten as structured **HTML render briefs** per post.

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

## 12. How to build a new precision template

> **Historical three-variant rule (2026-06-28):** this applies only when a chosen precision artifact
> needs three code-rendered structure tests. It is superseded for ordinary LinkedIn posts by the Fast
> Post Loop: three rough prompt cards, select or kill at minute 25, then one native final. Do not
> build three HTML templates or promote a selected file to `visual.png` for a standard post.

1. Pick **3 distinct** power formats from the subject→format selector in `top100-visual-dna.md`.
2. Copy the nearest reference template per variant (`sc101-quote-iso-towers`/`pf6`/`pf7`) as a starting skeleton.
3. Apply: 4:5 canvas + dramatic background; 3-zone structure; repeated per-cell schema; coral/semantic color; Lucide icons + relevant logos; 3D where geometry helps. Each variant = a different skeleton.
4. `node render.mjs templates/<slug>-vN.html out/<slug>-vN.png` for each, then run the §9 QA checklist by reading each PNG.
5. Iterate on each render (max ~2 passes), commit the 3 templates + 3 PNGs.
