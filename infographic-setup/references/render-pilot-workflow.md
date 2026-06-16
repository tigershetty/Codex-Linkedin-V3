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
4. RENDER       node render.mjs templates/<ep>.html out/<ep>.png   (Playwright → 2160x2700 PNG)
                [future] GSAP timeline → MP4/GIF for animated posts.
5. CAPTION      the LinkedIn caption is written as today (voice files), independent of the visual.
```

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
