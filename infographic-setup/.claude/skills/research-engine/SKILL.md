---
name: research-engine
description: The mandatory research layer that runs FIRST on every /101 and /ai-for-sc topic, before any hook, caption, prompt, or infographic is written. Builds a consultant-grade / academic-publishing-standard, fully-sourced research brief by spawning the research-analyst agent (one, or several in parallel for broad topics), then writes data/{week}/{slug}/research-brief.md. Every downstream stage — the infographic concept, the on-card numbers, the caption, and (for AI for SC) the copy-paste prompt — is built from this brief, so nothing is invented and every figure traces to a named source. Invoke directly with /research-engine [101|ai-for-sc] [topic-slug], or let /101 and /ai-for-sc trigger it automatically as their Step 0.
---

# /research-engine Skill — the depth layer (runs first, every run)

## Why this exists
Shetty's Desk content is only as good as the facts under it. The infographic, the
on-card numbers, the caption and the prompt all need to be **right** — and right to
a standard that survives an expert reading it. This skill guarantees that by making
**verified, sourced research the first step of every post**, not an afterthought.

> **Rule:** No hook, caption, prompt, or render is produced until a
> `research-brief.md` exists for the slug and has cleared the quality gate below.
> "Depth has to be high before we add anything on top of it."
>
> **Topic gate:** before research starts, the topic must have an audience segment
> and score from `references/topic-selection-scorecard.md`. The calendar is a
> candidate library, not automatic permission to build.

## Invoke
```
/research-engine 101 [topic-slug]            → brief for a Supply Chain 101 topic
/research-engine ai-for-sc [use-case-slug]   → brief for an AI for SC use case
```
Auto-triggered as **Step 0** by `/101` and `/ai-for-sc`. If a current
`research-brief.md` already exists for the slug, reuse it (don't re-research)
unless the user asks for a refresh.

## Standard (non-negotiable)
- **Consultant-grade / academic-publishing acceptance.** Every factual claim is
  traceable to a named, reputable source. Every number is verified before use.
- **Reliability tags on every fact:** [High] primary / standards body / vendor docs ·
  [Med] reputable secondary / widely corroborated · [Low] single secondary, directional.
- **No invented numbers.** Unverifiable figures are dropped or labelled illustrative.
  [Med]/[Low] facts get soft attribution downstream ("by one estimate…").
- **Cross-checked against the plan** so the brief doesn't duplicate another episode.

---

## Step 1 — Frame the research questions
Read `references/audience-intelligence.md`,
`references/topic-selection-scorecard.md`, the topic's plan row
(`references/101-plan.md` or `references/ai-for-sc-plan-v2.md`) and the matching
tracker. First write the topic qualification: audience segment, pain/desire,
post promise, why now, Tiger authority, visual argument, and score. Then write
1–3 scoped research questions:
- **101:** one analyst is usually enough — the concept's definition, origin, the
  2–4 hard facts/benchmarks that can sit on the card, and the "so what."
- **AI for SC:** split into **two parallel analysts** — (a) the **tool layer** (what
  the named AI tool can/can't actually do *today*, from vendor docs + the honest
  limit that becomes "when NOT to use AI"), and (b) the **domain/method layer** (the
  real formulae, indices, criteria, weights, benchmarks the workflow depends on).

## Step 2 — Spawn the research-analyst agent(s)
Launch the **research-analyst** subagent (`.claude/agents/research-analyst.md`),
one per scoped question, **in parallel** (multiple Agent calls in one message). Give
each a tight brief and the exclusions (what other episodes already own). The analyst
verifies via WebSearch/WebFetch and returns a structured, reliability-tagged sub-brief.

## Step 3 — Aggregate into the research brief
Merge the analyst returns, de-duplicate, resolve any conflicts (prefer the
higher-reliability source), and write `data/{YYYY-W##}/{slug}/research-brief.md`
using the schema below. Keep card-ready numbers **bold**. Keep the honesty ledger.

## Step 4 — Quality gate (before handing to the pipeline)
- [ ] Audience segment and topic score are present?
- [ ] Topic clears the 75/100 minimum, or the brief explicitly says "reframe/park"?
- [ ] Every on-card / in-caption number has a named source and a reliability tag?
- [ ] No figure stated as fact that the analyst flagged unverifiable?
- [ ] Cross-checked against the plan — no duplication of another episode's angle?
- [ ] A clear "so what" thesis and tension/trade-off the post can be built around?
- [ ] Meeting-room or workflow use is explicit?
- [ ] (AI for SC) tool-capability claims sourced to vendor docs, and the honest
      limit / "when NOT to use" captured?
- [ ] Honesty ledger lists what could not be verified?

Only when this passes does `/101` / `/ai-for-sc` proceed to hooks.

---

## Output schema — `data/{YYYY-W##}/{slug}/research-brief.md`
```markdown
# Research Brief — [topic / slug]
**Pipeline**: [101 | AI for SC] · **Week**: [YYYY-W##] · **Generated**: [date]
**Standard**: consultant-grade, verified, reliability-tagged

## 0. Topic Qualification
- Audience segment:
- Audience pain/desire:
- Post promise:
- Why now:
- Tiger authority:
- Visual argument:
- Topic score:
- Decision: build / reframe / park

## 1. Framing
- The one idea this post teaches (coffee-clarity) · why it matters.

## 2. Verified facts & data
- [fact · number/definition · SOURCE · [reliability]] — mark CARD-READY vs CAPTION-SUPPORT.

## 3. The "so what" (save-worthy thesis)

## 3b. Tension / Trade-off
- What makes this interesting:
- What people get wrong:
- What a practitioner would push back on:

## 3c. Meeting-Room / Workflow Use
- When would someone use this post at work?
- What decision, explanation, or artifact does it support?

## 4. Visual-data candidates
- Which facts become which visual element (axis, tile, bar, delta, sparkline, heatmap).

## 5. Caption support
- The 2–3 authority points, with soft-attribution guidance for [Med]/[Low].

## 6. AI-for-SC only — tool + method layer
- What the tool can do today [reliability] · honest limit → "when NOT to use AI"
- Real method/data (formulae, indices, criteria, weights) the prompt must embed
- Expanded copy-paste prompt seed (data-rich)

## 7. Honesty ledger
- What could NOT be verified; what was dropped or down-weighted, and why.

## Sources
- [titles + links]
```

---

## How downstream stages consume the brief
- **Hooks / caption** lift facts from §2 and §5 (with the soft-attribution guidance).
- **Infographic** builds its on-card numbers and the visual model from §4 — every
  figure on the card comes from the brief, hard-coded.
- **AI-for-SC prompt** is expanded from §6's seed and embeds the real method/data.
- **The honesty line** ("when NOT to use AI" / sourcing caveat) comes from §6/§7.

## Token budget
~6–12K orchestration + the analyst agents' own budgets (run in parallel). The brief
is written once per slug and reused across the run.
