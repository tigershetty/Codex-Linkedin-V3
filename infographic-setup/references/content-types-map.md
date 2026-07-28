---
name: content-types-map
description: Master reference for the content pipelines — when to use each, voice register, visual tool, outputs
updated: 2026-07-28
---

# Content Types Map — Shetty's Desk

Two production pipelines are **active**; one (Deep Dive) is **archived**. All share the master
voice (`tiger-voice.md`) and write to `data/{week}/{slug}/`. V4 selects five weekly LinkedIn
posts before assigning a production lane; the old seven-month calendar is a candidate bank.

---

## 1. Supply Chain 101 — ACTIVE

**What:** Educational lane for accepted supply-chain decisions and foundations in plain language. Its weekly allocation is evidence-led, not fixed.
**Audience:** experts AND non-practitioners.
**Pipeline:** after V4 topic, evidence, and Tiger-source gates, `/101 [topic]` → openings + caption + visual package.
**Visual:** **Visual Engine v2** — GPT Image 2 primary; use Cobalt Grid + selected reference images for style intelligence.
**Voice:** plain language, metaphor-led, series framing. `references/101-voice.md` + `tiger-voice.md`.
**Topic source:** `references/101-plan.md`. **Tracker:** `data/101-series-tracker.md`. **Output:** `101-copy.md`.

---

## 2. AI for Supply Chain — ACTIVE

**What:** Practical AI use cases for specific SC roles. Its weekly allocation and theme are evidence-led, not fixed.
**Audience:** any SC role — the role is set by the use case (purchaser, planner, logistics coordinator, etc.).
**Pipeline:** after V4 topic, evidence, and Tiger-source gates, `/ai-for-sc [week] [use-case-slug]` → openings + caption + visual/resource decision.
**Visual:** **Visual Engine v2** — GPT Image 2 primary for stills; code-render (`renderer/`) for deterministic HTML→PNG/GIF/MP4 backup, exact-data controls, and motion-ready layouts.
**Voice:** practical, copy-paste ready. Loads `tiger-voice.md` + `references/published-voice.md` + `references/101-voice.md`.
**Use-case source:** `references/ai-for-sc-plan-v2.md`. **Visual references:** `references/visual-engine-v2.md` + `references/ai-for-sc-visual-dna.md` + `references/ai-for-sc-creative-intelligence.md` + `references/render-pilot-workflow.md`.
**Tracker:** `data/ai-for-sc-series-tracker.md`. **Output:** `ai-for-sc-[use-case-slug].md` (+ `-pdf.md` if requested).

**Non-negotiables:** hook names role + current limitation (real tool) + AI unlock; every post captures the
boundary / human decision point in the brief; the published caption leads with the tool artifact and workflow value;
when multiple AI-for-SC posts enter one portfolio, vary role, decision, evidence, and tool where that improves audience value.

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
