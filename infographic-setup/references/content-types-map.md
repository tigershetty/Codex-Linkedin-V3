---
name: content-types-map
description: Master reference for all three content branches — pipelines, voice registers, and when to use each
created: 2026-03-20
updated: 2026-03-20
---

# Content Types Map — Shetty's Desk

Three content branches run through the infographic content engine. Each has a different audience, depth, pipeline, and purpose. All three share the same voice file (`tiger-voice.md`) and write output to `data/{week}/{slug}/`.

---

## 1. Deep Dive

**What it is:** Data-heavy, research-backed infographics for supply chain practitioners. Named companies, financial figures, mechanism chains. The flagship format.

**Audience:** VP Supply Chain, COO, Director of Operations — people who live in this world daily.

**Pipeline:**
```
/scout → /research → /message → CG2 (hook selection) → /content → /gemini-prompt
```

**Pipeline steps:**
1. `/scout` — Topic scouting from trends, news, or user input
2. `/research` — Full evidence ledger (12+ Tier 1/2 sources, data points, named firms)
3. `/message` — Strategic messaging: thesis, hook taxonomy (10 hooks), narrative direction
4. **CG2 — Hook Selection Gate** — User picks 1 of 10 hooks before proceeding
5. `/content` — Full caption (2 narrative variants, 200-350 words, 7-part structure with named bullets + stats)
6. `/gemini-prompt` — Structured prompt for Gemini Infographic Gem to generate the visual

**Voice register:** Technical, industry-grade. Acronyms used freely. Numbers and named firms expected. Still Tiger's voice — not consultant-speak.

**When to use:** When the topic demands evidence, data, and depth. When the audience is practitioners who want substance, not simplification.

**Output files:**
- `data/{week}/{slug}/research.md`
- `data/{week}/{slug}/message.md`
- `data/{week}/{slug}/content.md`
- `data/{week}/{slug}/gemini-prompt.md`

---

## 2. Supply Chain 101

**What it is:** A weekly educational series that breaks down fundamental SC concepts in plain language. Both for experts and non-supply-chain people.

**Audience:** Mixed — SC professionals who want a clean reference + non-practitioners who want to understand SC basics.

**Pipeline:**
```
/101 [topic-number] → hooks + caption + Gemini prompt (single step, no CG2)
```

**Pipeline steps:**
1. Look up topic from `shettys-desk-90-day-plan-v2.docx.md` (24 topics pre-planned with hook directions, visual formats, and caption directions)
2. Generate 10 hooks + LinkedIn caption in one step
3. Generate Gemini prompt for visual
4. User picks/adjusts — no control gate, just review at the end

**Voice register:** Plain language, technical terms explained. Metaphors and relatable examples (coffee journey, dinner party explanations). Series framing ("Welcome back to Supply Chain 101").

**When to use:** When the concept is foundational (what is a supply chain, SC vs logistics, bullwhip effect). When the goal is education and accessibility, not depth.

**Key differences from Deep Dive:**
- No `/scout` or `/research` — the 90-day plan IS the research
- No CG2 hook selection gate — all 10 hooks generated with the caption, user picks at the end
- Simpler vocabulary, shorter captions
- Series framing and numbering (Episode 1, 2, 3...)
- Sign-off: "Follow Poornajith Shetty for more supply chain insights"
- Hashtags include `#SupplyChain101`

**Output files:**
- `data/{week}/{slug}/101-copy.md`
- `data/{week}/{slug}/gemini-prompt.md`

**Topic source:** `shettys-desk-90-day-plan-v2.docx.md` (workspace root) — 24 topics across 12 weeks
**Series tracker:** `data/101-series-tracker.md`

---

## 3. AI for Supply Chain

**What it is:** Content exploring how AI (especially agentic AI) applies to supply chain operations. Bridges Tiger's professional SC expertise with his personal interest in AI tooling.

**Audience:** SC professionals curious about AI applications + AI practitioners interested in SC use cases.

**Pipeline:**
```
/ai-for-sc → (being defined — currently uses adapted deep dive pipeline)
```

**Voice register:** Mix — technical on the AI side, accessible on the SC side. The goal is to make AI applications in SC concrete and practical, not theoretical.

**When to use:** When the topic is specifically about AI tools, automation, or agentic workflows applied to supply chain problems.

**Status:** Newest branch, pipeline still being refined.

**Output files:**
- `data/{week}/{slug}/ai-for-sc-copy.md`

---

## Shared Across All Three

| Component | Location | Purpose |
|---|---|---|
| Voice file | `tiger-voice.md` (workspace root) | Writing style, tone, what to reject — applies to ALL content |
| Hook taxonomy | Defined in `/message` skill | 10 hook types used across all branches |
| Data folder | `data/{week}/{slug}/` | All output organised by week and topic slug |
| Brand anchor | `references/brand-anchor-v1.webp` | Visual reference for Gemini Gem |
| 90-day plan | `shettys-desk-90-day-plan-v2.docx.md` | Topic source for 101 series |
| Visual DNA | `references/infographic-visual-dna.md` | Visual style rules for all infographics |

---

## Decision Tree — Which Branch?

```
Is the topic a fundamental SC concept that needs plain-language explanation?
  → YES → Supply Chain 101

Is the topic about AI/automation applied to supply chain?
  → YES → AI for Supply Chain

Is the topic data-heavy, needs named firms/numbers, targets practitioners?
  → YES → Deep Dive
```
