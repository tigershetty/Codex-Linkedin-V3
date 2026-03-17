# Engagement Workflow Design — LinkedIn Signal Integration
**Date**: 2026-03-01
**Status**: APPROVED — ready for implementation
**Authored by**: Brainstorming session — Tiger Shetty + Claude
**Session context**: Designed to 10x engagement on LinkedIn supply chain infographics
by injecting real-world signal intelligence at the topic selection stage.

---

## Problem Statement

The current pipeline produces world-class content quality but operates with limited
visibility into what the LinkedIn supply chain audience is actively engaging with
*right now*. Three specific gaps were identified:

1. **Topic selection** — Scout scans 6 signal domains from institutional sources but
   has no window into what is actually resonating on LinkedIn this week. The right
   topic at the right moment compounds every downstream stage.

2. **Distribution timing** — No posting time guidance exists anywhere in the pipeline.
   The LinkedIn algorithm weights first-hour engagement heavily. This is unaddressed.

3. **Audience growth** — At a 2-3x/week posting cadence, the feedback loop between
   performance data and topic selection needs to be structurally tight, not ad hoc.

---

## Decisions Made (and Why)

### Decision 1: Inject signal intelligence INTO Scout — not a new skill

**Rejected**: `/pulse` as a standalone upstream skill (Option B).
**Chosen**: LinkedIn Signal Scan embedded as a named subsection inside Scout (Option A
+ Option B concept, zero new commands).

**Why**: A new command adds cognitive overhead every week. Embedding the scan inside
Scout means the intelligence is at the decision point — topic selection — without
requiring a separate invocation the user must remember to run. The `pulse.md` concept
from Option B is preserved as a section within `topic-scout.md`.

### Decision 2: Expand topic menu from 4 to 10 candidates

**From**: 2 Trending + 2 Evergreen = 4 candidates
**To**: 5 Trending + 5 Evergreen = 10 candidates

**Why**: At 2-3x/week posting cadence, a pool of 10 candidates across the week is the
right size. It provides genuine editorial choice without requiring Scout to run per
post. The weekly pool is generated once (typically Monday) and consumed across 2-3
runs during the week.

### Decision 3: Two-depth structure per tier

Full depth (2 per tier) + Signal shortlist (3 per tier) = 10 total.

**Why**: Generating 10 full-depth candidates would double Scout's token budget and
risk quality dilution (weaker candidates to fill quota). The shortlist 3 per tier are
actionable at CG1 and promoted to full depth on demand — one targeted firecrawl
search fills the missing fields before `/research` runs.

### Decision 4: Split the LinkedIn Signal Scan by tier

**Rejected**: Single unified scan (would structurally bias toward Trending topics,
eroding the Evergreen Gold Mine pipeline over time).
**Chosen**: Two parallel scans — one per tier — with different search queries,
different timeframes, and different engagement metrics.

**Why**: Trending engagement = reactions + comments (7-day window). Evergreen
engagement = saves + shares (4-8 week window). A single scan measuring reactions
surfaces only Trending signal and implicitly down-ranks Evergreen candidates at CG1,
destroying the competitive differentiation that comes from the 2+2 balance. The split
preserves equal weight structurally, not just on paper.

### Decision 5: No urgency flags, no 3rd tier

**Rejected**: ⚡ URGENT (72h window) flag on Tier 1 candidates.
**Rejected**: Tier 3 (News/Geopolitics/Policy/Technology) as a separate category.

**Why (urgency flag)**: At 2-3x/week posting cadence, the next post is 2-3 days
away. The cadence itself absorbs timeliness naturally — no flag needed.

**Why (3rd tier)**: News/Geopolitics/Policy/Technology is already covered by the
existing 6 Scout signal domains (Government/Policy, Geopolitics, Industry Events).
These topics are Tier 1 Trending by definition when they happen. A 3rd tier adds
structural complexity at the decision point without adding genuine editorial
distinction.

### Decision 6: Retrospective — no changes

At 2-3x/week cadence, the existing 7-day retrospective → `performance.md` → Scout
scoring loop tightens on its own. By week 3 there will be 6-9 performance records
feeding Scout — more than the current design anticipated. No structural changes
needed.

---

## Architecture — What Changes, What Stays

```
PIPELINE SKELETON (unchanged):
/scout → [CG1] → /research → /message → [CG2] → /content → /gemini-prompt
       → /publish-ready → (publish) → /retrospective

FILES CHANGED:
  infographic-content-engine-v1/
  ├── .claude/skills/scout/SKILL.md          ← Material changes (see Section 2)
  └── .claude/skills/publish-ready/SKILL.md  ← 5-line addition only (see Section 3)

FILES UNCHANGED:
  ├── .claude/skills/research/SKILL.md
  ├── .claude/skills/message/SKILL.md
  ├── .claude/skills/content/SKILL.md
  ├── .claude/skills/gemini-prompt/SKILL.md
  ├── .claude/skills/retrospective/SKILL.md
  ├── references/  (all files unchanged)
  ├── templates/   (all files unchanged)
  └── data/        (structure unchanged)
```

**New runtime files created by Scout:**
```
data/{YYYY-W##}/
  signal-trending.json    ← firecrawl search output (Trending scan)
  signal-evergreen.json   ← firecrawl search output (Evergreen scan)
  topic-scout.md          ← now contains LinkedIn Signal Scan section + 10-topic pool
```

---

## Section 2: Scout LinkedIn Signal Scan — Full Specification

### Trigger

Runs automatically when `/scout` is invoked. The two firecrawl searches execute in
parallel at Scout start, before signal domain scanning begins.

### Firecrawl Search Calls (2 parallel, matching concurrency cap of 2)

```bash
# Search 1 — Trending Signal
# Metric: reactions + comments | Timeframe: last 7 days
firecrawl search "supply chain logistics procurement linkedin posts trending 2026" \
  --limit 15 --tbs qdr:w \
  -o data/{YYYY-W##}/signal-trending.json --json &

# Search 2 — Evergreen Signal
# Metric: saves + shares (long-tail) | Timeframe: last 4-8 weeks
firecrawl search "supply chain best performing saved framework benchmark infographic linkedin" \
  --limit 15 --tbs qdr:m \
  -o data/{YYYY-W##}/signal-evergreen.json --json &

wait
```

**Credit cost**: ~2 credits per Scout run. At current 434 credits: ~200+ weeks runway.

### Reverse-Engineering Logic

For each result snippet, Scout extracts:
- **Hook type**: Stat-Lead / Paradox / Contrarian / Timeline-Shock / Comparison-Gap
- **Opening pattern**: Number-first / Question-first / Assertion-first / Scene-first
- **Topic angle**: Mechanism / Case Study / Benchmark / Framework / Data comparison
- **Engagement driver**: What about this post matched the VP Supply Chain's decision context
- **Gap signal**: What similar posts are NOT covering — the open territory to own

### New `topic-scout.md` Section (inserted above the topic menu)

```markdown
## LinkedIn Signal Scan — W[##]

### Trending Signals → informs Tier 1
(reactions + comments, last 7 days)

Top performing post patterns this week:
| Pattern | Topic Area | Hook Type | Why it's working |
|---------|------------|-----------|-----------------|
| [reverse-engineered from search snippet] | [topic] | [hook type] | [engagement driver] |

Emergent themes: [2-3 topic clusters with traction this week]
Gap opportunity: [what's discussed but not yet visualised as an infographic]

---

### Evergreen Signals → informs Tier 2
(saves + shares, last 4-8 weeks still circulating)

High-save content patterns still circulating:
| Pattern | Topic Area | Format | Why it keeps getting saved |
|---------|------------|--------|--------------------------|
| [reverse-engineered from search snippet] | [topic] | [carousel/infographic] | [reuse intent driver] |

Evergreen gap: [under-visualised benchmark or framework with proven save behaviour]
```

### Expanded Topic Menu — 10 Candidates at CG1

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIER 1 — TRENDING (5 candidates)
Informed by: Trending Signal Scan + existing 6 signal domains
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FULL DEPTH — ready for /research immediately (2 candidates):

  1. [slug] — [headline ≤12 words]
     Hook:          "[stat or contrarian claim]"
     Signal match:  [which trending pattern this responds to]
     Why this week: [1 sentence timeliness signal]
     Sources:       [3-5 from sources.csv]
     Novelty delta: [vs. existing slugs in data/]

  2. [slug] — [same format as above]

SIGNAL SHORTLIST — promoted to full depth on selection (3 candidates):

  3. [slug] — [hook sentence] | Signal: [trending pattern matched]
  4. [slug] — [hook sentence] | Signal: [trending pattern matched]
  5. [slug] — [hook sentence] | Signal: [trending pattern matched]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIER 2 — EVERGREEN GOLD MINES (5 candidates)
Informed by: Evergreen Signal Scan + existing 5 Gold Mine criteria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FULL DEPTH — ready for /research immediately (2 candidates):

  6. [slug] — [headline ≤12 words]
     Hook:           "[impossible number or contrast]"
     Signal match:   [which evergreen gap this fills]
     Gold mine:      [which of 5 criteria satisfied]
     Sources:        [3-5 from sources.csv]
     Novelty delta:  [vs. existing slugs in data/]

  7. [slug] — [same format as above]

SIGNAL SHORTLIST — promoted to full depth on selection (3 candidates):

  8. [slug] — [hook sentence] | Gold mine: [criteria matched]
  9. [slug] — [hook sentence] | Gold mine: [criteria matched]
 10. [slug] — [hook sentence] | Gold mine: [criteria matched]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Enter 1-10 to select. Shortlist picks (3-5, 8-10) trigger a quick
top-up (~1 credit, ~60 seconds) before /research runs.
Equal weight — editorial pick is yours.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Shortlist Promotion Flow

When a shortlist candidate (3-5 or 8-10) is selected at CG1:

1. Scout runs one targeted firecrawl search on that specific slug/topic (~1 credit)
2. Fills missing full-depth fields: sources, novelty delta, timeliness/gold-mine rationale
3. Writes completed candidate to `topic-scout.md` under Selected Topic
4. Proceeds to Message Hypothesis confirmation
5. Hands to `/research` as normal — no user-visible interruption

### Token Budget Impact

```
CURRENT:  ~5-8K tokens per Scout run
NEW:      ~8-12K tokens per Scout run
DRIVER:   Signal scan synthesis + 10 candidates (vs. 4) at mixed depth
VERDICT:  Acceptable. Full candidates (1-2, 6-7) are same depth as before.
          Shortlist candidates are 1 line each — minimal token cost.
```

### Weekly Cadence — Pool Consumption

```
MONDAY:    /scout → generates 10-topic pool → topic-scout.md written
ACROSS WEEK (2-3 runs):
  Run 1:   Pick topic from pool → full pipeline → publish
  Run 2:   Pick different topic from pool → full pipeline → publish
  Run 3:   Pick third topic (if needed) → full pipeline → publish

Pool exhaustion: rare at 2-3x/week (7 candidates remain after 3 picks).
If pool is exhausted or signal feels stale mid-week: re-run /scout.
Re-running /scout overwrites topic-scout.md (existing behaviour, unchanged).
```

### Updated Scout Self-Validation Checklist (additions only)

```
ADDITIONS TO EXISTING CHECKLIST:
- [ ] signal-trending.json written to data/{week}/?
- [ ] signal-evergreen.json written to data/{week}/?
- [ ] LinkedIn Signal Scan section present in topic-scout.md?
- [ ] Trending Signals table: ≥3 post patterns reverse-engineered?
- [ ] Evergreen Signals table: ≥2 circulating patterns identified?
- [ ] Gap opportunity identified for each tier?
- [ ] Signal match field populated for all full-depth candidates?
- [ ] Exactly 5 Tier 1 candidates (2 full + 3 shortlist)?
- [ ] Exactly 5 Tier 2 candidates (2 full + 3 shortlist)?
```

---

## Section 3: Publish-Ready — Distribution Timing Block

**Change**: One block appended to the existing PUBLISH-READY checklist. Nothing else.

```
DISTRIBUTION TIMING (supply chain VP / COO / Director audience)
  Best days:    Tuesday, Wednesday, Thursday
  Best window:  7–9am audience local time
  Golden hour:  First 60 min drives algorithm weighting.
                Be available to respond to early comments immediately after posting.
  Replay:       Post the 48-Hour Replay Prompt from research.md at ~48h after publish.
```

Appended after the existing `LINKEDIN POST STEPS` block. Before the `RETROSPECTIVE REMINDER`.

---

## What This Does NOT Change

- All existing voice rules (no em dashes, no AI slop, ANCHORS structure)
- `/research`, `/message`, `/content`, `/gemini-prompt` skills — untouched
- All reference files (brand-anchor, gemini-gem-standard, visual-dna, layout-library)
- All templates
- `sources.csv` and `recently-used-sources.md` tracking logic
- Retrospective skill — unchanged
- Brand anchor upload protocol
- Calibration Gate (2-point check: blue background + readable text)
- Novelty bar (no direct clone of existing slugs)

---

## Success Criteria

After 4 weeks of production at 2-3x/week cadence:

- [ ] Topic selection demonstrably reflects LinkedIn signal patterns (Signal match field
      is populated and traceable to actual post performance)
- [ ] At least 1 Evergreen Gold Mine published per week (2+2 balance maintained across
      the expanded 5+5 pool — signal scan not biasing toward Trending only)
- [ ] Shortlist promotion works end-to-end without user friction (60s or less top-up)
- [ ] Distribution timing is followed and engagement in first 60 min improves vs.
      baseline (measure via retrospective: reactions at 1h vs. total reactions)
- [ ] firecrawl credit consumption stays ≤6 credits/week for signal scanning
- [ ] Scout token budget stays under 12K tokens per run

---

## Implementation Scope

Two skill files to modify:

| File | Change type | Estimated effort |
|------|-------------|-----------------|
| `.claude/skills/scout/SKILL.md` | Material — add Signal Scan section, expand topic menu format, update self-validation checklist | Medium |
| `.claude/skills/publish-ready/SKILL.md` | Minimal — append 5-line Distribution Timing block | Trivial |
