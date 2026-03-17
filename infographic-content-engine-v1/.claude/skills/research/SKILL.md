---
name: research-topic
description: Use when the user runs /research [slug]. Requires a selected topic slug from scout. Produces citation-grade research, evidence ledger, and hook candidates.
---

# Research Skill — Infographic Content Engine v1

## Purpose
Transform a selected topic into citation-grade research: quantified evidence, business cases, source ledger, spatial visualization guidance, and a 48-Hour Replay Prompt — all in one consolidated `research.md` ready for the `/copy` skill.

## Invoke
```
/research [topic-slug]
```

## Prerequisites
`data/{week}/topic-scout.md` must exist with a **Selected Topic** entry.

## Output
```
data/{YYYY-W##}/{topic-slug}/research.md
```

---

## Output Structure

### research.md Sections (in order)

**1. Story in 30 Seconds**
Elevator pitch of the infographic thesis (3 sentences max). Must answer: What's the core tension? Who proved what? What should the reader do differently?

**2. Core Tension**
```
wrong_assumption: [Common belief that's costing them]
cost_of_inaction: [Quantified consequence of not changing]
decision_shift: [Specific behavior that needs to change]
```

**3. Topic Type + Layout Signal**
Classify the topic type for routing to the Infographic Layout Library:
```
topic_type: [Company Strategic Pivot / Comparison / Process / Framework / Case Study / Data / Timeline / Mechanism / Editorial / Multi-proof / Geographic / Dual Narrative / Benchmarking / Contrarian / Maturity]
recommended_layout: [Layout name from references/infographic-layout-library.md]
layout_rationale: [1 sentence: why this layout fits this specific story]
illustration_style: [Style A (Maersk Dense) / Style B (Ecomobility Minimal)]
```

**4. Evidence Ledger**
| ID | Finding | Source [S##] | Context | So What | Viz Opportunity |
|---|---|---|---|---|---|

Minimum 15 data points, ordered by audience impact.

**Viz Opportunity column format** (spatial zones, not slides):
Use spatial zone type descriptions:
- "Hub/Spoke — central mechanism with 4 radiating consequence nodes"
- "Comparison split — left: before state (#ef4444) / right: after state (#10b981)"
- "Hero stat — oversized number at 50% canvas width with annotation arrow"
- "Evidence Band — label + data + source tag, equal weight with 3 peer bands"

**5. Decision Ledger**
| Claim ID | Evidence | So What | Decision | Action | Source IDs |

Maps every claim to a decision implication. Minimum 5 rows.

**6. Business Cases**
For Company Strategic Pivot topics:
- **Anchor Case (BC-###)**: Company | Pre-pivot state → Trigger → Structural Move → Economic Consequence → Decision Implication | Evidence [S##]
- **Counter Case (BC-###)**: Company taking opposite approach | same format
- **Supporting Cases (optional)**: same format

For other topics:
- Anchor Case: Organization that executed the change successfully
- Counter Case: Organization that did not change and paid the cost

**7. Source Index**
| ID | Organisation | Year | Tier | URL | Confidence | Claude-Readable |

Build from `data/sources.csv`. Assign [S##] identifiers. Note accessibility: "Mostly Open — Claude-readable" / "Paywalled — PDF required."

**8. Hook Candidates**
- Candidate A (Stakes-Led): [consequence + audience + specific number + urgency]
- Candidate B (Stat-Led): [surprising number + context + contrarian implication]
- Candidate C (Contrarian): [common belief challenged + alternative path with evidence]

All 3 must contain a specific number. No rhetorical questions.

**9. Debate Points**
2+ areas of genuine disagreement in the literature or practitioner community. Used for the 48-Hour Replay Prompt (see below).

**10. Benchmark Analog**
Prior similar infographic or carousel in the V3 data (check `data/` folder) + novelty delta: "This topic differs from [benchmark] because..."

**11. 48-Hour Replay Prompt** *(new in v1)*
Pre-drafted for use 48 hours after post publication, when algorithm re-weighting opportunity peaks:
```
REPLAY PROMPT (post at 48 hours):
"[The most interesting debate point from section 9, phrased as an open question]

[2-3 sentence extension of the most interesting comment thread from the post — leave blank now, fill in at 48h]

[Open question directing back to the audience: 'What has your experience shown on this?']"
```
This re-enters the post into active feed consideration when organic reach typically falls near zero.

---

## Citation Standards

- Minimum 12 sources total
- Minimum 8 sources from Tier 1 or Tier 2 (per `data/sources.csv` `tier` column)
- Minimum 15 data points in Evidence Ledger
- 100% [S##] linkage — every claim in the Evidence Ledger has a source ID
- Mechanism chain present: trigger → structural move → economic consequence → decision implication
- No Tier 3 sources without triangulation (must be corroborated by Tier 1 or 2 source)

---

## Source Accessibility Protocol

Check `data/sources.csv` `claude_readable` column before citing:

| Accessibility | Action |
|---|---|
| `Yes` | Cite freely. Claude reads directly. |
| `Partial` | Cite only publicly accessible content. Flag: "Open-access section only." |
| `No (PDF required)` | Flag in Source Index: "⚠️ Paywalled — user must provide PDF for full access." Add to source index with confidence "Low (abstract only)" unless PDF is provided. |

**Nordic/EU angle**: If topic has Nordic or EU relevance, actively include at least 1 source from Nordic consultancies (id:30-37) or EU Commission (id:29). This is a unique angle absent from most competitor content.

---

## Quality Contracts

### Hard Requirements
- Story in 30 Seconds answers all 3 questions
- Topic Type + Layout Signal section complete with all 4 fields
- Evidence Ledger: ≥15 data points, all with Viz Opportunity in spatial zone format
- Source Index: ≥12 sources, ≥8 Tier 1/2, all with [S##] IDs
- Hook Candidates: all 3 present, all contain specific numbers
- 48-Hour Replay Prompt present (even if partially blank)
- Mechanism chain traceable: trigger → move → consequence → implication

### Quality Standards (Claude judgment)
- Every Viz Opportunity describes a spatial zone, not a slide
- Business Case mechanism is specific: names exact action, exact financial figure, exact timeframe
- Debate Points are genuine (not manufactured) — sourced from different publications disagreeing
- Hook Candidate A would stop a VP Supply Chain mid-scroll

---

## Self-Validation Checklist

Before outputting research.md:

- [ ] Story in 30 Seconds: 3 sentences, answers What/Who/What-to-do?
- [ ] Core Tension: all 3 fields filled, cost_of_inaction is quantified?
- [ ] Topic type and layout classified with rationale?
- [ ] Evidence Ledger: ≥15 rows, Viz Opportunity in spatial zone format?
- [ ] Source Index: ≥12 sources, ≥8 Tier 1/2, accessibility noted?
- [ ] All [S##] IDs used in Evidence Ledger linked to Source Index?
- [ ] Business Cases: anchor + counter, mechanism chain complete?
- [ ] Hook Candidates: all 3 present, all have specific numbers, none rhetorical?
- [ ] Debate Points: 2+ genuine disagreements?
- [ ] 48-Hour Replay Prompt drafted?

**If any checkbox fails**: Revise before outputting.

---

## Target Audience

VP Supply Chain, Director of Demand Planning, COO. They have read McKinsey, BCG, and Gartner. Research must clear the bar set by those publications. Vague claims without quantification are rejected. Every business case must name the company, the decision, and the financial consequence.

---

## Token Budget

~15-25K tokens per run. Load `data/sources.csv` for source tier routing. Read topic-scout.md for selected topic and optional context. Access web search for current data from open sources. Do not load layout library or visual DNA in full — reference them by name only in the Layout Signal section.
