# AI for Supply Chain — Render Briefs (code-render content layer)
**Created**: 2026-06-15 · **Status**: Active, rolling out month by month
**Purpose**: The *content depth* that lets us code-render every AI-for-SC episode in detail. `ai-for-sc-plan-v2.md` says WHAT each post is (Role/Tool/Use Case/Hook/Visual). This file says exactly what goes ON the canvas — the real numbers, the bespoke visual concept, the prompt, the worked example, the honest limitation, the closing thesis. The renderer (`renderer/`) consumes a brief; one bespoke template per concept.
**Companion**: `renderer/README.md` (how we build), `memory/visual-benchmarks/top100-visual-dna.md` (visual laws).

---

## 0. Two principles this file enforces

### A. Authentic creative freedom per topic (reference image 19)
Ref 19 = Eric Partaker's "Strategy Book in One Page": ~16 sub-topics, each rendered as a **different bespoke visual concept** matched to what it explains — a pyramid for a hierarchy, a loop for a cycle, a wheel for a framework, a skyscraper for "building up." That is the bar. **We never reuse one template across topics.** Each episode gets a visual *metaphor designed for its idea*: cost layers → a stacked column; a bottleneck → a pinched pipe; a payback → a rising arc crossing zero; a risk register → a heat grid. The plan already assigns ~36 distinct concepts (good) — this file gives each the content to be built bespoke.

### B. Homogeneous Shetty's Desk branding — the standout consistency
Locked 2026-06-15 (Tiger). Every post, regardless of which AI tool it features, uses the **same Shetty's Desk palette** so the feed reads as one body of work:
- **Palette = coral + warm neutrals only.** Coral `#C15F3C` is the brand thread (eyebrow, the one popped hero phrase, the hero's framing element, the footer rule + closing thesis) AND the single data highlight (the one element that carries the point). Warm stone/taupe for structural/secondary. Amber `#C98A1E` only for the "watch for" caution line. **No tool colours** (no OpenAI green, no Claude clay as a fill).
- **The tool is signalled ONLY by a small monochrome icon chip** ("BUILT WITH · [Tool]", top-right, ink). Identical treatment every post — swap glyph + name. No "Powered by" (reads as sponsorship).
- Bright, luminous background (warm cream + coral sunrise bloom). Shetty's Desk logo anchors the footer.
- **Future:** when a post shows a hand-off *from one tool to the next*, we can animate that flow (export an MP4/GIF alongside the PNG). Parked until single images are dialled in.

---

## 1. The Render-Brief schema (every episode fills this)

```
EP / WEEK / ROLE / TOOL / USE CASE        — from the plan
VISUAL CONCEPT — the bespoke metaphor + how it is structured (the ref-19 anchor)
HOOK           — the caption's verbatim opening line (Decision-Pressure, Stat-Lead, etc.)
HERO STATEMENT — the big on-image headline; one phrase popped in coral (eye-first)
SUB / HEADING  — one line that frames the value
DATA BLOCKS    — the REAL content the concept renders: layers / rows / steps / nodes,
                 with actual example numbers (never placeholders on the canvas)
INSIGHT        — the takeaway the visual proves (the "so what")
WORKED EXAMPLE — one tangible number that makes it concrete ($ / % / time)
PROMPT         — the verbatim 20-30 word copy-paste prompt (the paste-it payload)
WATCH FOR      — the honest limitation (mandatory trust signal; amber)
THESIS         — the closing coral footer line (the pin-it payload)
```

A brief is "render-ready" when a builder could open the renderer and place every element without inventing a single number.

---

## 2. Visual-concept catalogue (build each once, reuse the *concept*, never the post)

~36 concepts across 64 episodes. Group them so each is designed once as a bespoke module, then filled per topic. (Count = times it appears in the plan.)

| Concept | Eps | One-line of the metaphor |
|---|---|---|
| Dashboard Preview (×10) | 05,12,18,34,38,45,48,56,58,64 | a real-looking KPI sheet; **vary the metric set per topic** so the 10 don't twin |
| Cost Anatomy | 02 | proportional stacked cost column; the movable layer pops *(built — PF6)* |
| Formula Tree | 14,24,42 | inputs → calc node → output, drawn as a tree |
| Option Scoreboard | 08,30,33 | 3 options as columns, criteria as rows, winner highlighted |
| Before/After Split | 16,52 | a hard vertical split, naive vs improved |
| Executive Brief | 17,53,61 | a one-page memo render with a hero number |
| The Bottleneck | 19,36 | a pinched pipe; flow chokes at the constraint |
| Diverging Paths / Crossroads | 20,37,62,63 | one node forking into 3 costed routes |
| Working Capital Bridge | 50,54 | a waterfall of cash freed, step by step |
| Network Map | 10,32 | hub + nodes, risk/spend encoded by size/coral |
| Spend Distribution | 07,35 | Pareto/treemap of where the money goes |
| Warehouse Zone Map | 27,29 | a top-down rack grid, golden zone highlighted |
| Playbook Page | 39,47 | a numbered response card |
| The Blind Spot | 41,46 | a clean system with one dark gap called out |
| Prompt Card | 57,59 | the prompt(s) themselves as the hero artifact |
| Blueprint Draft | 01 | an architect's sheet of a document + scoring matrix |
| Clause Reveal | 03 | a contract with risk clauses lifted out |
| Signal Scan | 04,60 | radar/scan surfacing signals from noise |
| Negotiation Table | 06 | their argument vs your counter, side by side |
| Supplier Risk Card | 09 | a scored profile card |
| Forecast Anatomy | 11 | a demand line split into trend/season/noise |
| Production Queue | 13 | a resequenced run strip, changeover time saved |
| Parallel Tracks | 15 | two planning lanes (sensing vs monthly) |
| Variance Zone | 21 | actual vs forecast band, the gap shaded |
| Correlation Map | 22 | leading signals lined up against demand |
| Inventory Stack | 23 | layered stock with aged params flagged |
| Disruption Timeline | 25 | week-by-week stock falling to a stockout |
| Segmentation Matrix | 26 | 2×2 variability vs volume quadrants |
| Tracker Sheet | 28 | reorder calendar, triggers highlighted |
| Stress Test Model | 40 | a plan bent by two shocks, recovery curve |
| Control Tower View | 44 | triage board, exceptions by priority |
| Cost Lever | 49 | a lever turning a problem into an annual number |
| Waterfall Bar | 51 | consolidation savings, bar by bar |
| Payback Arc | 55 | cumulative savings arc crossing the zero line |
| Triage Funnel | 31 | 90 min of noise funnelled to 20 min of action |

Rule for the ×N concepts: same skeleton, **different data + a different accented insight** each time, so two Dashboard Previews never look like the same post.

---

## 3. Worked briefs — Month 1 / W21 (the demonstrated standard)

### Ep01 — Blueprint Draft · W21 · Purchaser · Claude · RFQ with weighted scoring matrix
- **VISUAL CONCEPT:** an architect's **blueprint sheet** of an RFQ — a titled document skeleton on the left (5 stamped sections), and a **weighted scoring matrix** on the right (criteria rows, weight column, a worked supplier score). Coral = the weight column + the winning total. The "draft" feel: thin ruled grid, corner title block, a coral "REV. A" stamp.
- **HOOK:** "It takes most buyers a full afternoon to draft an RFQ. The scoring matrix is the part they skip, and it is the part that matters."
- **HERO:** "One brief in. **A scored RFQ out.**"
- **HEADING:** The RFQ that ranks suppliers before a single reply lands.
- **DATA BLOCKS:**
  - RFQ skeleton (5 stamped sections): 1 Scope & volumes · 2 Technical specs · 3 Commercial terms · 4 Evaluation criteria · 5 Timeline & submission.
  - Weighted scoring matrix (weights sum to 100): Price **35%** · Quality & compliance **25%** · Lead time **20%** · Service & support **10%** · Sustainability **10%**.
- **INSIGHT:** The weights are the strategy. Set them before you see a single quote, so the decision is made on your priorities, not the slickest proposal.
- **WORKED EXAMPLE:** Supplier B wins at **8.1 / 10** weighted — not Supplier A's headline low price (7.4), because lead time and compliance carried the weighting.
- **PROMPT:** "Draft an RFQ for [category]. Include scope, technical specs, commercial terms, and a weighted evaluation matrix with [criteria + weights]. Output the scoring table I can send to [n] suppliers."
- **WATCH FOR:** Claude drafts the structure fast. You own the weights, they encode your strategy, so never ship the default split.
- **THESIS:** The RFQ should score suppliers before they reply.

### Ep02 — Cost Anatomy · W21 · Category Manager · ChatGPT · Should-cost model  ✅ BUILT
- Rendered: `renderer/templates/pf6-cost-anatomy.html` → `out/pf6-cost-anatomy.png`. This brief is the reference implementation of the schema above.
- **VISUAL CONCEPT:** proportional stacked cost column (Raw 40 / Labour 20 / Overhead 18 / Margin 22); the negotiable margin layer pops coral; right = "set by the market 78%" vs "set by a choice 22%"; full-width worked-example strip; copy-paste prompt; amber watch-for; coral-thread footer.
- **HERO:** "4 layers. **1 you can move.**" · **WORKED EXAMPLE:** $4.20 quoted → $0.92 negotiable / $3.28 fixed · **THESIS:** "Walk in knowing their number before they show you theirs."

---

## 4. Rollout

- **Done:** schema, principle, concept catalogue, W21 briefs (Ep01 drafted, Ep02 built).
- **Next:** fill briefs month by month — Month 1 remainder (Ep03–Ep10), then Months 2–7 (Ep11–Ep64), each at the depth above. Build the bespoke concept module the first time each concept appears; reuse the module (new data) thereafter.
- **Sync:** fold the homogeneous-branding rule (§0B) into `ai-for-sc-visual-dna.md` so the `/ai-for-sc` skill stops emitting tool-coloured Gemini prompts and instead emits a render brief in the §1 schema.
