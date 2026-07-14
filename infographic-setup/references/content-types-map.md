---
name: content-types-map
description: Master reference for the content pipelines — when to use each, voice register, visual tool, outputs
updated: 2026-06-20
---

# Content Types Map — Shetty's Desk

Two pipelines are **active**; one (Deep Dive) is **paused**. All share the master voice
(`tiger-voice.md`) and write to `data/{week}/{slug}/`. The two active pipelines run on one
shared 7-month calendar — see `references/master-calendar.md`.

---

## 1. Supply Chain 101 — ACTIVE

**What:** Weekly educational series breaking down SC fundamentals in plain language. Posts 1 + 2 of each week.
**Audience:** experts AND non-practitioners.
**Pipeline:** `/101 [topic]` → 10 hooks + caption + image prompt (single step, no gates).
**Visual:** **Visual Engine v2** — GPT Image 2 primary; use Cobalt Grid + selected reference images for style intelligence.
**Voice:** plain language, metaphor-led, series framing. `references/101-voice.md` + `tiger-voice.md`.
**Topic source:** `references/101-plan.md`. **Tracker:** `data/101-series-tracker.md`. **Output:** `101-copy.md`.

---

## 2. AI for Supply Chain — ACTIVE

**What:** Practical AI use cases for specific SC roles. Posts 3 + 4 of each week, same weekly theme.
**Audience:** any SC role — the role is set by the use case (purchaser, planner, logistics coordinator, etc.).
**Pipeline:** `/ai-for-sc [week] [use-case-slug]` → hooks + caption + render brief (+ optional PDF).
**Visual:** **Visual Engine v2** — GPT Image 2 primary for stills; code-render (`renderer/`) for deterministic HTML→PNG/GIF/MP4 backup, exact-data controls, and motion-ready layouts.
**Voice:** practical, copy-paste ready. Loads `tiger-voice.md` + `references/published-voice.md` + `references/101-voice.md`.
**Use-case source:** `references/ai-for-sc-plan-v2.md`. **Visual references:** `references/visual-engine-v2.md` + `references/ai-for-sc-visual-dna.md` + `references/ai-for-sc-creative-intelligence.md` + `references/render-pilot-workflow.md`.
**Tracker:** `data/ai-for-sc-series-tracker.md`. **Output:** `ai-for-sc-[use-case-slug].md` (+ `-pdf.md` if requested).

**Non-negotiables:** hook names role + current limitation (real tool) + AI unlock; every post captures the
boundary / human decision point in the brief; the published caption leads with the tool artifact and workflow value;
two posts/week use two different roles + two different AI tools.

---

## 3. Deep Dive — ARCHIVED

Data-heavy, research-backed infographics for senior practitioners. The pipeline (8 skills +
deep-dive-only references) is archived under `skills-archive/deep-dive/`. Voice anchor
`references/published-voice.md` stays active (AI for SC uses it). Resume: see `skills-archive/deep-dive/README.md`.

---

## Shared
| Component | Location | Purpose |
|---|---|---|
| Master voice | `tiger-voice.md` (workspace root) | Writing style, tone, what to reject — all content |
| Master calendar | `references/master-calendar.md` | 7-month theme calendar, both active series aligned |
| Data folder | `data/{week}/{slug}/` | All output by week and slug |

## Decision Tree
```
Foundational SC concept, plain language?          → Supply Chain 101 (/101)
A specific SC role using AI for a real task?      → AI for Supply Chain (/ai-for-sc)
Data-heavy, named firms/numbers, senior audience? → Deep Dive (archived)
```
