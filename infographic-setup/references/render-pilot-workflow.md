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
3. HTML/GSAP    assemble a self-contained template from the Shetty's component kit (renderer/):
                bright luminous bg, constant coral thread, homogeneous palette, large tool logo,
                Shetty's Desk logo footer. GSAP available for animation (tool-to-tool flow posts).
4a. STILL       node render.mjs templates/<ep>.html out/<ep>.png   (Playwright → 2160x2700 PNG)
4b. ANIMATED    node render-anim.mjs templates/<ep>-anim.html out/<ep>   (→ <ep>.mp4 + <ep>.gif) [BUILT]
5. CAPTION      the LinkedIn caption is written as today (voice files), independent of the visual.
```

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
- Light surfaces use **Logo 4 (mono-olive)**; the white-wordmark logo is invisible on white.

## 3. The two-mode animation system (use sparingly, on purpose)
- **Unfold** (`*-anim.html`) — elements reveal in sequence; use only when the *sequence carries meaning* (a workflow assembling, a hand-off). Seamless loop via an in-timeline fade-out.
- **Ambient orbit** (`*-path.html`) — the card stays fully static and readable while a small Claude mark drifts a dotted route **in the clear margins only** (never over content), now a calm **60s loop**. Use when you want motion to stop the scroll without the content moving.
- A still PNG remains the default. Animation is opt-in per episode, declared in the render brief.

## 4. The 101 question — DECIDED: 101 stays prompt-based, image tool → ChatGPT (GPT Image 2)
We explored code-render for 101 (`sc101-planning-fence*.html` — a cheat-sheet, a river-of-time metaphor, and an isometric concept piece). They proved code-render *can* do 101, but the **decision is a hard pass**: 101 keeps its existing `/101` flow exactly as-is, and the only change is the image tool — **Gemini → ChatGPT (GPT Image 2)**. The code-render explorations are parked in `renderer/templates/sc101-*` as reference, not wired into the flow. Rationale: 101 is an illustrative concept post (one big visual + a brief explanation), well served by a strong image-gen prompt; the dense, data-exact code-render advantage is what AI-for-SC needs, not 101.

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
