# Render Pilot — Direct HTML/GSAP Workflow (no Gemini prompt)
**Created**: 2026-06-16 · **Branch**: `claude/html-render-pilot` · **Status**: Pilot, to merge into the main workflow once validated.
**Why**: The Gemini-prompt step is a lossy translation layer — it reintroduces data hallucination and tool-branded (off-brand) visuals, the exact problems the code renderer exists to remove. This pilot removes it and renders Shetty's Desk infographics directly from a render brief.

---

## The new pipeline (replaces topic → caption → Gemini prompt → paste)

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

> **The 3-variant standard (2026-06-28).** Every post — 101 and AI-for-SC — renders **3 visually distinct
> concepts** and the user picks one. The 3 must differ from each other in **layout framework AND hero
> device** (three skeletons, not three colour swaps). This is the variety guarantee: no two posts lean on
> the same default, because every post is chosen from a fresh trio. Keep all 3 templates + out PNGs on disk
> (the unused two are the variety log + the seed for future posts on the topic).

**Animation pipeline (built 2026-06-16).** The `-anim.html` variant adds GSAP: a paused master
timeline exposed on `window.__tl` that reveals the elements in sequence (header → stat → blocks
unfold one by one → bars grow → timeline nodes light up). `render-anim.mjs` **scrubs the timeline
frame-by-frame** (`tl.time(t)` per frame, then screenshot `#card`) so the output is pixel-deterministic,
not a real-time capture — then `ffmpeg-static` assembles the frames into a full-res **MP4** (LinkedIn
video) and a downscaled palette-optimised **GIF**. Proof: `out/pf7-blueprint-draft.mp4` / `.gif`
(~4s unfold + 1.6s hold, 25fps). Deps live in the gitignored `node_modules` (`npm i gsap ffmpeg-static`);
GSAP is vendored to `assets/js/gsap.min.js` for offline render. Reserve animation for posts where
sequence carries meaning (a workflow unfolding, a tool-to-tool hand-off); a still PNG stays the default.

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

## 3. The two-mode animation system (use sparingly, on purpose)
- **Unfold** (`*-anim.html`) — elements reveal in sequence; use only when the *sequence carries meaning* (a workflow assembling, a hand-off). Seamless loop via an in-timeline fade-out.
- **Ambient orbit** (`*-path.html`) — the card stays fully static and readable while a small Claude mark drifts a dotted route **in the clear margins only** (never over content), now a calm **60s loop**. Use when you want motion to stop the scroll without the content moving.
- A still PNG remains the default. Animation is opt-in per episode, declared in the render brief.

## 4. The 101 question — REVISED 2026-06-21: 101 is now CODE-RENDER PRIMARY, ChatGPT (GPT Image 2) = backup
**Supersedes the earlier "hard pass."** After perfecting the supplier-quote still (`sc101-quote-iso-towers.html`) to a consulting-grade standard — genuine 3D isometric towers + a Harvey-ball scorecard + a part-to-whole share bar + side callouts, all on the homogeneous Shetty's Desk frame — the code-render advantage proved just as decisive for 101 as for AI-for-SC: exact numbers, locked brand, real 3D depth, and the information density that makes a post save-worthy. **Decision: `/101` builds its infographic in `renderer/` (HTML→PNG) as the default**; the ChatGPT (GPT Image 2) prompt is retained in `101-copy.md` as the **backup** path (illustration fallback for a purely metaphorical concept post with no load-bearing structure). The earlier rationale (101 = "one big illustrative visual") was too narrow: 101 concepts argue a *shape* (a comparison, a funnel, a hierarchy) that code-render makes precisely, and the brand anchor was never as on-brand as the coded azure/eco system on white.

Difference vs AI-for-SC: 101 carries **no AI-tool logo** (101 has no tool mark), uses the accessible 101 register, and leans on the `layout-frameworks-intelligence.md` 200-pattern selector + the composition-mode choice (hero-dominant integrated vs layered multi-block) rather than the 50-format Hero-Number system.

## 5. Merge plan — bring the renderer into the main AI-for-SC flow
**Scope of this merge: AI for Supply Chain only.** (101 → ChatGPT GPT Image 2 prompt, unchanged flow otherwise; Deep Dive stays on the Gemini Gem. Both already wired in the skills + CLAUDE.md.)

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
