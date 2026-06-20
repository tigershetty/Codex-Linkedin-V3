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
**Visual:** **ChatGPT (GPT Image 2)** — attach `brand-anchor-v1.webp` for style.
**Voice:** plain language, metaphor-led, series framing. `references/101-voice.md` + `tiger-voice.md`.
**Topic source:** `references/101-plan.md`. **Tracker:** `data/101-series-tracker.md`. **Output:** `101-copy.md`.

---

## 2. AI for Supply Chain — ACTIVE

**What:** Practical AI use cases for specific SC roles. Posts 3 + 4 of each week, same weekly theme.
**Audience:** any SC role — the role is set by the use case (purchaser, planner, logistics coordinator, etc.).
**Pipeline:** `/ai-for-sc [week] [use-case-slug]` → hooks + caption + render brief (+ optional PDF).
**Visual:** **code-render** (`renderer/`) — deterministic HTML→PNG/GIF/MP4, no AI-image prompt.
**Voice:** practical, copy-paste ready. Loads `tiger-voice.md` + `references/published-voice.md` + `references/101-voice.md`.
**Use-case source:** `references/ai-for-sc-plan-v2.md`. **Visual references:** `references/ai-for-sc-visual-dna.md` + `references/ai-for-sc-creative-intelligence.md` + `references/render-pilot-workflow.md`.
**Tracker:** `data/ai-for-sc-series-tracker.md`. **Output:** `ai-for-sc-[use-case-slug].md` (+ `-pdf.md` if requested).

**Non-negotiables:** hook names role + current limitation (real tool) + AI unlock; every post has a
"When NOT to use AI" sentence; two posts/week use two different roles + two different AI tools.

---

## 3. Deep Dive — PAUSED

**What:** data-heavy, research-backed infographics for senior practitioners.
**Pipeline:** `/scout → /research → /message → CG2 → /content → /gemini-prompt`.
**Visual:** Gemini Infographic Gem (requires `brand-anchor-v1.webp` upload each session).
**Voice anchor:** `references/published-voice.md` (also loaded by AI for SC).
**Status:** paused — skills and references remain in place; resume when ready.

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
Data-heavy, named firms/numbers, senior audience? → Deep Dive (paused)
```
