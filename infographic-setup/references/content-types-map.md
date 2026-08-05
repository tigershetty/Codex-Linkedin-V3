---
name: content-types-map
description: Master reference for the content pipelines — when to use each, voice register, visual tool, outputs
updated: 2026-08-02
---

# Content Types Map — Historical Lane Reference

> **V4 reset notice:** `/101` and `/ai-for-sc` are candidate banks, not active skills or routing
> commands. Start with `opportunity-desk`, then use `creative-direction`, `release-editor`, and
> `audience-transfer` as appropriate.

---

## 1. Supply Chain 101 — ACTIVE

**What:** Educational lane for accepted supply-chain decisions and foundations in plain language. Its weekly allocation is evidence-led, not fixed.
**Audience:** experts AND non-practitioners.
**Pipeline:** Standard: Fast Post Loop (2–4 saved references → 3 rough routes → select/kill → one
native post). Flagship: Creative Genome retrieval → ten concepts → three developed directions →
selected content and claim mode → `/101 [topic]`.
**Visual:** **Visual Engine v2.2** — select GPT Image 2, HTML/SVG, spreadsheet, document, or website UI after the creative direction.
**Voice:** plain language, metaphor-led, series framing. `references/101-voice.md` + `tiger-voice.md`.
**Topic source:** `references/101-plan.md`. **Tracker:** `data/101-series-tracker.md`. **Output:** `101-copy.md`.

---

## 2. AI for Supply Chain — ACTIVE

**What:** Practical AI use cases for specific SC roles. Its weekly allocation and theme are evidence-led, not fixed.
**Audience:** any SC role — the role is set by the use case (purchaser, planner, logistics coordinator, etc.).
**Pipeline:** Standard: Fast Post Loop (2–4 saved references → 3 rough routes → select/kill → one
native post). Flagship: Creative Genome retrieval → ten concepts → three developed directions →
selected workflow and claim mode → `/ai-for-sc [week] [use-case-slug]`.
**Visual:** **Visual Engine v2.2** — choose the renderer after the argument; use deterministic surfaces when exact data, text, or interaction carries the value.
**Voice:** practical, copy-paste ready. Loads `tiger-voice.md` + `references/published-voice.md` + `references/101-voice.md`.
**Use-case source:** `references/ai-for-sc-plan-v2.md`. **Creative source:** `references/creative-genome-recombination-engine-v1.md`. **Visual workflow:** `references/visual-engine-v2.md`.
**Tracker:** `data/ai-for-sc-series-tracker.md`. **Output:** `ai-for-sc-[use-case-slug].md` (+ `-pdf.md` if requested).

**Non-negotiables:** make the role, work moment, input, output, validation, and human owner legible
somewhere in the package. Let the selected Creative Genome direction decide whether the opening leads
with the problem, distinction, workflow, artifact, case, or current product change. When multiple
AI-for-SC posts enter one portfolio, vary role and decision where that improves audience value.

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

Every flagship, resource, or website-bound content package records:

- `creative_bundle_id`, `genome_reference_ids`, and `creative_element_ids` for the accepted hook, promise, structure, visual,
  save-trigger, and CTA mechanics being adapted;
- `claim_mode` and a `support_ledger` whose burden matches each load-bearing claim;
- `transfer_result` after the matched Tiger performance and artifact-use checkpoint;
- any explicit public `simulation` as a visibly labelled content mode, never a default example;
- internal test fixtures separately, with an explicit exclusion from public proof.

A standard LinkedIn-only post records its selected saved-reference shelf, three rough routes, claim
boundary, active visual, caption, five-reader review, and analytics in its post folder. It does not
need a full Genome bundle or website manifest just because it belongs to an active lane.

## Decision Tree
```
Foundational SC concept, plain language?          → Supply Chain 101 (/101)
A specific SC role using AI for a real task?      → AI for Supply Chain (/ai-for-sc)
Data-heavy, named firms/numbers, senior audience? → Deep Dive (archived)
```
