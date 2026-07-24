# Render Pilot — Direct HTML/GSAP Workflow (no Gemini prompt)
**Created**: 2026-06-16 · **Branch**: `claude/html-render-pilot` · **Status**: Historical/control-lane reference as of 2026-06-30.
**Current role**: Visual Engine v2 (`visual-engine-v2.md`) is active. GPT Image 2 is the primary creative renderer; this HTML/GSAP workflow remains the backup, comparison, exact-data, and motion lane.
**Why keep it**: The Gemini-prompt step was a lossy translation layer — it reintroduced data hallucination and tool-branded visuals. The same renderer is still valuable when deterministic structure, exact type, or GIF/MP4 output matters.

---

## The historical HTML pipeline (now the control/backup lane)

```
1. TOPIC        pull the episode from ai-for-sc-plan-v2.md (Role / Tool / Use Case / Hook / Visual concept)
2. RENDER BRIEF enrich it into a full brief (ai-for-sc-render-briefs.md schema):
                real data, the bespoke visual concept, the verbatim prompt, a worked example,
                the honest limitation, the closing thesis. THIS is the "more context / dive deeper"
                step — it replaces the Gemini prompt as the bridge.
3. LAYOUT×3     run layout-select → 3 DISTINCT frameworks (3 patterns + 3 hero devices), one per variant.
4. HTML/GSAP    assemble 3 self-contained templates (<ep>-v1/-v2/-v3.html) from the Shetty's component kit
                (renderer/): bright luminous bg, homogeneous palette, large tool logo (AI-for-SC),
                Shetty's Desk logo footer. GSAP available for animation (tool-to-tool flow posts).
5a. STILL       node render.mjs templates/<ep>-vN.html out/<ep>-vN.png   (Playwright → 2160x2700 PNG), ×3
5b. ANIMATED    node render-anim.mjs templates/<ep>-vN-anim.html out/<ep>-vN   (→ .mp4 + .gif) [BUILT]
6. PICK 1       present all 3 renders → user picks one → copy it to the post's visual.png (keep all 3).
7. CAPTION      the LinkedIn caption is written as today (voice files), independent of the visual.
```

> **Historical 3-variant standard (2026-06-28).** Before Visual Engine v2, every post — 101 and AI-for-SC — rendered **3 visually distinct
> concepts** and the user picks one. The 3 must differ from each other in **layout framework AND hero
> device** (three skeletons, not three colour swaps). This is the variety guarantee: no two posts lean on
> the same default, because every post is chosen from a fresh trio. Keep all 3 templates + out PNGs on disk
> (the unused two are the variety log + the seed for future posts on the topic). Under Visual Engine v2, use three HTML variants only when HTML is the chosen final lane or the user explicitly requests coded options.

> **The craft layer (2026-06-28) → `references/premium-visual-craft.md`.** Picking the right framework is
> half the job; rendering it to world-class is the other half. The craft file distils a research sweep
> across SetProduct **Orion**, Visual Capitalist/FT/Economist, McKinsey/BCG/Gartner, and Eric Partaker into
> the Orion design tokens, the house-style rules (title-as-claim · one accent + ghosting · direct labels ·
> source band), the consulting slide-craft, and chart-styling CSS recipes. **Read it before building every
> variant** — `layout-frameworks-intelligence.md` says *which* shape, this says *how to make it premium*.

**Active animation standard:** `references/motion-engine-v1.md` supersedes the
prototype choreography guidance in this historical file. `render-anim.mjs` still
scrubs a paused GSAP timeline frame-by-frame and FFmpeg still produces the MP4
and palette-optimized GIF. The active method starts from an approved
`visual.png`, maps semantic components from that visual's layout, and requires
pixel-identical opening and closing lossless frames.

**No Gemini prompt is produced.** The brand kit is Shetty's Desk only; the AI tool appears solely as its logo.

## What changes vs the current `/ai-for-sc`
| Step | Current | Pilot |
|---|---|---|
| Visual spec | a Gemini prompt block in `ai-for-sc-[slug].md` | a **render brief** in `ai-for-sc-render-briefs.md` |
| Visual output | paste prompt into Gemini, hope numbers survive | deterministic **HTML → PNG** via the renderer |
| Brand | tool identity palette baked into the prompt | **homogeneous Shetty's Desk** palette; tool = logo only |
| Animation | none | **GSAP** in-template (frame today, video later) |

## Merge plan (when the pilot is signed off)
1. Update `CLAUDE.md` (both) — AI-for-SC "Visual" column: `code-render (renderer/) from a render brief`, not Gemini.
2. Repoint the `/ai-for-sc` skill — emit a render brief + build the HTML, stop emitting a Gemini-prompt section.
3. Fold the homogeneous-branding rule into `ai-for-sc-visual-dna.md`; archive the Gemini-prompt scaffolding for AI-for-SC (keep Gemini only as a fallback for illustration/metaphor posts with no load-bearing data).
4. Merge `claude/html-render-pilot` → the working branch.

## Pilot proofs (this branch)
- **Ep01 — Blueprint Draft v2** (enterprise RFQ): `renderer/templates/pf7-blueprint-draft.html` → `out/pf7-blueprint-draft.png`. Real RFQ package (BOM/IATF/PPAP/Incoterms/ESG/Ariba) + TCO-weighted scorecard, benchmarked to APICS SCOR / CIPS / Gartner SRM / SAP Ariba / Carter's 10 Cs. Large Claude logo; Shetty's Desk logo-only footer. The professional-depth + homogeneous-brand standard for the merge.
- **Ep02 — Cost Anatomy** (`pf6-cost-anatomy.html`) — homogeneous, built on the working branch.

---

# 2026-06-16 — Status, learnings & the merge plan

## 1. Where we are (built and working)
The deterministic render stack is real and proven on a flagship piece (PF7, the enterprise RFQ).

| Capability | Script / file | State |
|---|---|---|
| HTML → PNG (still, 2160×2700) | `renderer/render.mjs` | Working |
| HTML + GSAP → MP4 + GIF (animation) | `renderer/render-anim.mjs` | Working |
| Brand kit in code | `:root` tokens in every template (azure/eco/ink/Poppins on white, flat) | Locked |
| Vendored offline deps | `assets/js/gsap.min.js`; global Playwright + `ffmpeg-static` (gitignored) | Working |
| Flagship AI-for-SC template | `templates/pf7-blueprint-draft*.html` (still / unfold / orbit) | Signed-off |
| **101 showcase** | `templates/sc101-planning-fence.html` → `out/sc101-planning-fence.png` | **New — built to test code-render for 101** |

**The thesis, validated:** keeping data + text in code (never in a diffusion model) removes the two failures that made the Gemini output underwhelm — wrong numbers and off-brand visuals. Every bar length, week tick, and label is computed, not painted.

## 2. Key learnings (carry these into every future template)
**Design**
- *Visual IS the concept* beats decoration. PF7 = a scored RFQ as a package + scorecard; SC101 = a planning horizon as a frozen/slushy/liquid timeline. The shape teaches before the words do.
- *Dense, consistent card anatomy* (icon + title + 2–4 lines, repeated) lets the eye learn one card and read the rest instantly. This is what makes a post save-worthy.
- *2–3 colour discipline with semantic accent* — azure = structure, eco-green = the win/the open state, coral = caution/cost only. Never spray colour.
- *A save-worthy thesis line in the footer* is the pin-it payload — treat it as the most important sentence on the canvas.
- Bars must encode the number (PF7 scorecard now fills to the exact weight; bid bars to the exact score).

**Technical gotchas (already cost us a render each — don't repeat)**
- Bar fills must be `display:block` — an inline `<span>` ignores width/height and renders an empty track.
- `overflow:hidden` on a container clips any child that sticks out (e.g. fence flags); lift such elements to a non-clipped parent. CSS `opacity` on a parent also caps a child's opacity.
- Always invoke the renderer with an **absolute path** — the shell cwd drifts and `node render.mjs` then fails.
- Light surfaces: **SC 101 footers use Logo 2** (`assets/logos/shettys-desk-logo-2.png`, the **dark-wordmark** lockup made for light backgrounds) — it carries the "Shetty's Desk" wordmark, so the footer needs **no separate text label**. ⚠ **Logo 1 is the white-wordmark lockup; it is invisible on white — never use it on the cards.** (Logo 4 is the mono-olive alternative.)

## 2b. Supplier-quote learnings (2026-06-21 — the new visual standard)
Carry these into every future 101 + AI-for-SC template. The exemplar is `templates/sc101-quote-iso-towers.html`.

**Composition modes — choose deliberately per topic (NEW, the big unlock):**
- **Mode A — Hero-dominant / integrated.** One complex thing → let the hero own **60–70% of the canvas** and push the supporting detail *into and around* it instead of spawning separate blocks: leader-line annotations pinned to a point on the hero, in-place data labels on each element, anchored micro-viz (a tiny rating row beside each object), an embedded value axis/legend, a zoom inset. Use for a single mechanism / "how X works" / one object with many facets. **Guardrail:** only works on a strict anchor grid with leader lines — pinned, lined annotations read as consulting-grade; loose floating text is the "text all over the place" failure Tiger rejects.
- **Mode B — Layered multi-block.** Comparison / ranking / multiple independent data cuts → a 3D hero + 2–3 supporting elements, each a clean element. The supplier-quote post is Mode B: **4-layer composition** = gestalt (3D hero) + precision (scorecard) + proportion (part-to-whole bar) + narration (side callouts). Fill whitespace with *information*, not decoration.
- Default decision: single object/concept → A; comparing separate things → B.

**Genuine 3D — JS-computed clip-path isometry (use this, NOT CSS 3D transforms):**
- CSS 3D transforms (`rotateX/Y`, `translateZ`, `preserve-3d`) proved fragile — flattened layers, walls firing below the floor, footplate gaps. **Abandoned.** Use deterministic 2D isometry computed in JS and drawn with `clip-path` polygons.
- Projection: `iso(u,v) = [OX + (u−v)*a, OY + (u+v)*b]`; a world height `h` maps to screen-y minus `h`. Each iso prism = base diamond + left wall + right wall (parallelogram `clip-path`s) + top-cap diamond. Light model: **top cap lightest, left wall mid, right wall darkest** (shade the base hex by +/− amounts).
- A stacked tower = N iso bands, each band height ∝ its value; total tower height ∝ total value (this is benchmark #43 stacked column rendered in real depth).

**Multi-element from the 200-pattern library:** a single still can combine benchmarks — stacked-criterion towers (#43) + Harvey-ball scorecard (#106, `conic-gradient(color 0 X%, #E6F0FA X% 100%)`) + part-to-whole share bar (#44) + isotype/badges + side callouts. Reserve unused patterns (radar #74, slope #71, tornado #109, bullet #75) for later posts in the same topic so the feed shows range.

**Footer standard (corrected):** a full-width gradient **footrule** sits ABOVE the foot row (`margin-top:auto` pushes it to the bottom) — never a divider drawn *over* the logo/text. Foot row (SC 101) = **Shetty's Desk Logo 2** (dark-wordmark lockup, ~74px, carries the wordmark so no separate text label) on the LEFT + **"Poornajith Shetty"** signature on the RIGHT. (AI-for-SC uses the same footrule + signature; its right side may carry the closing thesis instead.) (Tighten outer card padding and rescale the hero to fill the reclaimed space; "use the space, don't frame it with border.")

**Technical gotchas added this round:**
- `inset:'auto'` is shorthand for top/right/bottom/left — set it **before** `left`/`top` or it wipes them (caused the grey-blob "all shadows stacked at origin" bug).
- `clip-path` clips `box-shadow` — use `filter:drop-shadow()` for depth on clipped shapes.
- A CSS grid divider must be a real grid item (`el.style.gridColumn='1/5'`), not a class on an inner div — otherwise the row shifts a column.

## 3. Motion system - superseded by Motion Engine v1

The old unfold/ambient-orbit split is retained as historical context only. The
active system is layout-adaptive and picture-first:

- the still remains the default and canonical artifact,
- motion eligibility is assessed after still approval; production starts after hook and caption approval,
- choreography follows the visual's own archetype and reading order,
- semantic masks or source-fitted covers replace raw crop animation,
- body text and logos stay locked,
- the complete visual opens and closes the loop.

Use `references/motion-engine-v1.md` and the templates it names.

> **Superseded by Visual Engine v2 (2026-06-30).** This file is no longer the primary still-image playbook. Use it when the HTML renderer is the chosen final lane, when exact data needs a deterministic control, or when motion/GIF/MP4 output is required. Read `visual-engine-v2.md` before writing any GPT Image 2 prompt.

## 4. The 101 question — SUPERSEDED 2026-06-30: GPT Image 2 primary, HTML control lane
The 2026-06-21 decision made 101 code-render primary after several strong HTML proofs. That decision is now superseded. The current approach is:

- GPT Image 2 leads creative rendering for new 101 stills.
- HTML/code-render stays alive as the comparison and backup lane.
- Use HTML first only when exact numbers, dense charts, or deterministic type/layout control are more important than generative editorial range.
- Preserve previous code-render templates as reusable controls and fallback seeds, not as the default creative bottleneck.

Difference vs AI-for-SC: 101 carries **no AI-tool logo** (101 has no tool mark), uses the accessible 101 register, and leans on the `layout-frameworks-intelligence.md` 200-pattern selector + the composition-mode choice (hero-dominant integrated vs layered multi-block) rather than the 50-format Hero-Number system.

## 5. Historical merge plan — renderer as a maintained control lane
**Scope now:** both active pipelines may use the renderer as backup/control. Deep Dive stays archived.

1. **Land the branch.** Merge `claude/html-render-pilot` → working branch → `main`. The renderer (`renderer/`, templates, assets, scripts) ships with it.
2. **Repoint `/ai-for-sc`.** Replace the Gemini-prompt section with two steps:
   - a **render brief** (real data, the bespoke visual concept, the verbatim on-canvas prompt, a worked example, the honest limitation, the thesis), and
   - **build + render** the HTML (`render.mjs`, plus `render-anim.mjs` if the brief asks for motion).
   Output per episode: `ai-for-sc-[slug].md` (hooks + caption + render brief) **+** `out/[slug].png` (and `.mp4/.gif` if animated).
3. **Grow a template kit, not a parametriser.** PF7 is archetype #1 (package + scorecard + prompt). Each episode gets a *bespoke concept on the same homogeneous brand frame* — reuse the component CSS, design the concept fresh.
4. **Update both `CLAUDE.md`s.** AI-for-SC "Visual" column → `code-render (renderer/) from a render brief`. Archive the Gemini-prompt scaffolding for AI-for-SC (keep it for 101/Deep Dive).
5. **Publishing unchanged.** The caption is still written from the voice files; the render is just a deterministic PNG/MP4 instead of a pasted prompt.

## 6. How to pilot the next AI-for-SC episode
1. Pull the next episode from `references/ai-for-sc-plan-v2.md` (Role / Tool / Use Case / Hook / Visual concept).
2. Write its **render brief** (the dive-deeper step that replaces the Gemini prompt).
3. Build the HTML from the component kit — one bespoke concept, brand frame intact, the tool present only as its logo + woven into the heading.
4. Render the still; add an animation mode only if the sequence or ambient motion earns it.
5. QA against the learnings checklist in §2; write the caption from `tiger-voice.md` + voice refs.
6. Commit to the pilot branch, review, then fold into the merge.
