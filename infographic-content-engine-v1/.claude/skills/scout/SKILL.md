---
name: scout-supply-chain
description: Use when the user runs /scout, asks for topic ideas, or needs the weekly editorial pick for Shetty's Desk. Surfaces 10 supply chain topic candidates (5 Trending + 5 Evergreen).
---

# Scout Skill — Infographic Content Engine v1

## Purpose
Surface 10 supply chain topic candidates each week: 5 Trending (time-sensitive) and 5 Evergreen Gold Mines (timeless operational excellence). Equal weight — no automatic recommendation hierarchy. Editorial pick is a human decision.

## Invoke
```
/scout
```
No arguments. Current date derived automatically.

## Output
```
data/{YYYY-W##}/topic-scout.md
```
One file per week. Re-running `/scout` in the same week overwrites previous output.

---

## LinkedIn Signal Scan

Runs automatically at Scout start — before any signal domain scanning.
Two parallel firecrawl searches execute concurrently (matches concurrency cap of 2).

### Firecrawl Search Calls

```bash
# Search 1 — Trending Signal (reactions + comments, last 7 days)
firecrawl search "supply chain logistics procurement linkedin posts trending 2026" \
  --limit 15 --tbs qdr:w \
  -o "data/{YYYY-W##}/signal-trending.json" --json &

# Search 2 — Evergreen Signal (saves + long-tail, last 4-8 weeks)
firecrawl search "supply chain best performing saved framework benchmark infographic linkedin" \
  --limit 15 --tbs qdr:m \
  -o "data/{YYYY-W##}/signal-evergreen.json" --json &

wait
```

Replace `{YYYY-W##}` with the current ISO week folder before running.
Credit cost: ~2 credits per Scout run.

### Reverse-Engineering Logic

For each result snippet, extract:
- **Hook type**: Stat-Lead / Paradox / Contrarian / Timeline-Shock / Comparison-Gap
- **Opening pattern**: Number-first / Question-first / Assertion-first / Scene-first
- **Topic angle**: Mechanism / Case Study / Benchmark / Framework / Data comparison
- **Engagement driver**: What about this post matched the VP Supply Chain's decision context
- **Gap signal**: What similar posts are NOT covering — open territory to own

### Signal Scan Output (written into topic-scout.md above the topic menu)

```
## LinkedIn Signal Scan — W[##]

### Trending Signals → informs Tier 1
(reactions + comments, last 7 days)

Top performing post patterns this week:
| Pattern | Topic Area | Hook Type | Why it's working |
|---------|------------|-----------|-----------------|
| [reverse-engineered from snippet] | [topic] | [hook type] | [engagement driver] |

Emergent themes: [2-3 topic clusters with traction this week]
Gap opportunity: [what's discussed but not yet visualised as an infographic]

---

### Evergreen Signals → informs Tier 2
(saves + shares, last 4-8 weeks still circulating)

High-save content patterns still circulating:
| Pattern | Topic Area | Format | Why it keeps getting saved |
|---------|------------|--------|--------------------------|
| [reverse-engineered from snippet] | [topic] | [carousel/infographic] | [reuse intent driver] |

Evergreen gap: [under-visualised benchmark or framework with proven save behaviour]
```

---

## CONTROL GATE 1 — Topic Selection (required before /research)

After generating the 10 candidates (5 Trending + 5 Evergreen), Scout PAUSES and presents:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SCOUT COMPLETE — SELECT YOUR TOPIC (10 candidates)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIER 1 — TRENDING (5 candidates)
Informed by: Trending Signal Scan + 6 signal domains

FULL DEPTH — ready for /research immediately:
  1. [slug] — [headline ≤12 words]
     Hook:          "[stat or contrarian claim]"
     Signal match:  [which trending pattern this responds to]
     Why this week: [1 sentence timeliness signal]
     Sources:       [3-5 from sources.csv]
     Novelty delta: [vs. existing slugs in data/]

  2. [slug] — [same format as 1]

SIGNAL SHORTLIST — promoted to full depth on selection:
  3. [slug] — [hook sentence] | Signal: [trending pattern matched]
  4. [slug] — [hook sentence] | Signal: [trending pattern matched]
  5. [slug] — [hook sentence] | Signal: [trending pattern matched]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIER 2 — EVERGREEN GOLD MINES (5 candidates)
Informed by: Evergreen Signal Scan + 5 Gold Mine criteria

FULL DEPTH — ready for /research immediately:
  6. [slug] — [headline ≤12 words]
     Hook:          "[impossible number or contrast]"
     Signal match:  [which evergreen gap this fills]
     Gold mine:     [which of 5 criteria satisfied]
     Sources:       [3-5 from sources.csv]
     Novelty delta: [vs. existing slugs in data/]

  7. [slug] — [same format as 6]

SIGNAL SHORTLIST — promoted to full depth on selection:
  8. [slug] — [hook sentence] | Gold mine: [criteria matched]
  9. [slug] — [hook sentence] | Gold mine: [criteria matched]
 10. [slug] — [hook sentence] | Gold mine: [criteria matched]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Enter 1-10 to select. Shortlist picks (3-5, 8-10) trigger a
60-second top-up before /research runs. Equal weight — your pick.
Add optional context: "I want to focus on [angle / company / data]"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

After the user enters their selection:
- **Full-depth picks (1-2, 6-7)**: Scout immediately presents a Message Hypothesis for confirmation.
- **Shortlist picks (3-5, 8-10)**: See Shortlist Promotion section below — top-up runs first, then Message Hypothesis follows.

### Shortlist Promotion (fires when user selects 3-5 or 8-10)

When a shortlist candidate is selected, Scout runs one targeted search before
proceeding to Message Hypothesis. This fills the missing full-depth fields.

```bash
# Replace [topic-slug] with the selected candidate slug
firecrawl search "[topic-slug] supply chain linkedin analysis sources data" \
  --limit 10 --tbs qdr:m \
  -o "data/{YYYY-W##}/signal-shortlist-[topic-slug].json" --json
```

Using the search results, fill the missing fields inline:
- `Sources:` — 3-5 relevant sources from sources.csv cross-referenced with results
- `Novelty delta:` — confirm not a clone of existing slugs in data/
- `Why this week:` (Tier 1) or `Gold mine rationale:` (Tier 2) — 1 sentence

Once filled, present to the user as:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SHORTLIST TOP-UP COMPLETE — [slug]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sources confirmed: [3-5 sources]
Novelty delta:     [vs. existing slugs — clear / flagged]
[Why this week / Gold mine]: [1 sentence]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Then proceed immediately to Message Hypothesis confirmation.

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ONE MORE THING — CONFIRM STORY HYPOTHESIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on the scout data for [slug]:

Story: [one sentence paradox/tension derived from the topic's hook candidate]
Viewer feels: [specific reaction]
Hero number: [single figure from the hook candidate]

Press Enter to confirm, or type a revised hypothesis.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The confirmed or revised hypothesis is saved to `topic-scout.md` under **Message Hypothesis** and passed to /message (runs after /research).

---

## Output Structure

### topic-scout.md Sections (in order)

**0. LinkedIn Signal Scan** (new — generated from firecrawl results)
Two tables: Trending Signals (last 7 days) and Evergreen Signals (last 4-8 weeks).
Each table reverse-engineers post patterns: hook type, topic angle, engagement driver.
Gap opportunity identified for each tier. Written above the topic menu.

**1. Signal Summary**
3-5 sentence overview of dominant supply chain signals this week. What is shaping boardroom conversations? What changed in the last 7-14 days?

**2. Candidate Topics (5 Trending + 5 Evergreen — equal weight)**

**Tier 1 — Trending (5 candidates: 2 full depth + 3 shortlist)**
Each includes:
- `slug` — URL-safe identifier
- **Headline concept** — Working title ≤12 words
- **Hook candidate** — One surprising stat or contrarian claim
- **Topic type** — (from layout routing table)
- **Why this week** — What makes it time-sensitive right now (specific event, data release, or decision window)
- **Key sources** — 3-5 specific organisations from `data/sources.csv`
- **Novelty delta** — "This differs from [nearest existing infographic] because..."

**Tier 2 — Evergreen Gold Mines (5 candidates: 2 full depth + 3 shortlist)**
Each includes:
- `slug` — URL-safe identifier
- **Headline concept** — Working title ≤12 words
- **Hook candidate** — The surprising number or contrast that earns attention
- **Topic type** — (from layout routing table)
- **Gold mine criteria** — Which of the 5 criteria this topic satisfies (see Evergreen criteria below)
- **Key sources** — 3-5 specific organisations or publications
- **Novelty delta** — Confirms not previously covered
- **Why it's a gold mine** — 1 sentence: what makes it under-exploited on LinkedIn

No ⭐ RECOMMENDED marker. All 10 candidates are equal. The weekly editorial pick is made by the user at Control Gate 1.

**3. Novelty Check Summary**
- Lists existing infographics in `data/` (all slugs)
- Confirms all 10 candidates clear the novelty bar
- Notes if any candidate closely mirrors a prior topic

**4. Performance Context (if data available)**
If `data/*/performance.md` files exist:
- List the top 3 performing topics by saves + reposts
- Note which topic types and signal domains generated highest engagement
- Apply this to candidate ranking: "Company Strategic Pivot topics averaged 38 saves in last 4 weeks — up-ranked."

**5. Selected Topic + Message Hypothesis** (filled immediately after Control Gate 1)
```
## Selected Topic
Selected: [slug]
Optional context: [user-provided direction or blank]

## Message Hypothesis
Story: [one sentence paradox/tension — "The same X that made Y possible has made Z impossible/inevitable"]
Viewer feels: [specific reaction: disbelief / urgency / recognition of a trap / sudden clarity on a decision]
Hero number: [single figure from scout data that makes the story undeniable — not a range]

Next step: /research [slug]
```

---

## Signal Domains Scanned (6 domains)

| Domain | What It Covers | Primary Sources |
|--------|----------------|-----------------|
| **Government / Policy** | Trade policy, tariffs, sanctions, legislation, regulations, executive orders | Supply Chain Dive, ISM PMI, EU Commission |
| **Geopolitics** | Conflicts, diplomatic shifts, friend-shoring pressures, border controls | McKinsey, BCG, FT, Bloomberg |
| **Business / Corporate** | Corporate decisions, earnings surprises, M&A, bankruptcies, pivots, restructurings | SEC filings, earnings calls, WSJ, McKinsey/BCG case studies |
| **Academia / Research** | New studies, WEF/McKinsey/Gartner reports, peer-reviewed findings, policy papers | MIT CTL, CSCMP, academic journals, Deloitte |
| **Industry Events** | Natural disasters, port strikes, factory disruptions, technology breakthroughs | Supply Chain Dive, Port of Malmö, Supply Chain Digest |
| **Company Strategic Pivots** *(NEW)* | Fortune 500+ companies where supply chain is central to a pivot/failure/success with a clear mechanism | SEC 10-K filings, FT/Bloomberg/WSJ strategy coverage, McKinsey/BCG company case studies, LinkedIn exec posts |

---

## Company Strategic Pivot Signal Domain (6th Domain — Special Rules)

**Qualifying criteria** (all 3 must be true):
1. Fortune 500 or widely-recognized company name — brand recognition is the scroll-stopper
2. Supply chain is CENTRAL to the pivot/failure/success — not background context
3. There is a **clear mechanism** (WHY the strategy worked/failed) that readers can extract and apply

**Examples that qualify:**
- Maersk: ocean-to-integrated-logistics pivot (completed, measurable)
- Nike: DTC pivot → channel abandonment → 50-60% stock decline → rebuilding
- Amazon: dark warehouse / robotics-first fulfillment model
- Walmart: Mexico nearshoring + distribution network investment
- Zara/Inditex: proximity manufacturing as strategic moat
- Boeing: supply chain risk concentration failure (737 MAX)
- Apple: diversification from China (ongoing, measurable)

**4th "So What?" filter question** (for Company Pivot candidates only):
"Does this company's pivot change a supply chain decision that a VP Supply Chain is facing RIGHT NOW or in the next 90 days?"

**Company Pivot signal sources to scan:**
- SEC 10-K filings and earnings call transcripts
- FT, Bloomberg, WSJ business strategy coverage
- McKinsey/BCG company transformation case studies
- LinkedIn posts from company executives/investors discussing strategy

---

## Evergreen Gold Mine Criteria (Tier 2)

A topic qualifies as an Evergreen Gold Mine if it satisfies at least one of these:

1. **Under-documented excellence** — Organisation with exceptional supply chain performance that has not been widely covered on LinkedIn (e.g., Dabbawala, Vanguard logistics, hospital supply chains)
2. **Manual outperforms tech** — Historical or low-tech system that delivers better performance than modern tech equivalents (e.g., Dabbawala vs. UberEats error rates)
3. **Impossible number** — A throughput, error rate, delivery speed, or efficiency figure so extreme it creates genuine disbelief (e.g., 1-in-16-million error rate)
4. **Cross-industry transfer** — A supply chain principle from an unexpected industry or era that directly applies to the VP Supply Chain's current decisions
5. **Unseen benchmark** — Academic study, industry benchmark, or institutional report with a finding most practitioners have not seen visualised on LinkedIn

**Tier 2 search approach**: In addition to scanning current news signals, explicitly search for:
- Historical case studies in logistics, manufacturing, healthcare, military, and food systems
- MIT CTL, CSCMP, and academic sources for counterintuitive performance benchmarks
- Operations management textbooks and Harvard Business Review case archives for gold-standard cases
- LinkedIn search for "supply chain" + "surprising" / "unexpected" / "outperforms" to find emerging evergreen narratives

**Balance target**: Over any 4-week rolling window, at least 2 Tier 2 topics should have been selected. Track in `data/recently-used-sources.md`.

## Source Routing by Signal Type

| Signal Type | Primary Sources (from data/sources.csv) |
|---|---|
| Real-time news/disruptions | Supply Chain Dive (id:17), Supply Chain Digest (id:19), ISM PMI (id:10) |
| Strategic analysis | McKinsey (id:2), BCG (id:3), Deloitte (id:4), SCMR (id:16) |
| Academic / evidence | MIT CTL (id:5), CSCMP (id:8), JSCM (id:11), Penn State (id:6) |
| Company pivots | SEC filings, FT/Bloomberg, McKinsey/BCG cases |
| Nordic / EU angle | Nordic consultancies (id:30-37), EU Commission (id:29), Port of Malmö (id:28) |
| Sustainability | ZLC (id:7), Brightlands (id:25), EU Commission (id:29), BCG (id:3) |

**Recently-used-sources tracking**: Read `data/recently-used-sources.md` before selecting recommended sources. De-prioritize organizations cited in 3+ consecutive posts. Prefer fresh sources from `data/sources.csv` that have not been used recently.

---

## Source Accessibility Check

Before recommending a source, check `data/sources.csv` `claude_readable` column:
- `Yes` = Claude can read directly. Recommend freely.
- `Partial` = Some content readable. Recommend open-access content only.
- `No (PDF required)` = User must provide PDF. Flag this: "Source requires PDF upload — Tier 1 evidence if you have access."

---

## Quality Contracts

### Hard Requirements
- Exactly 10 candidates (not 9, not 11)
- Every candidate has all required fields
- All 10 candidates clear the novelty bar vs. existing infographics AND benchmark carousels
- Exactly 5 Tier 1 (Trending) candidates (2 full depth + 3 shortlist) and exactly 5 Tier 2 (Evergreen Gold Mine) candidates (2 full depth + 3 shortlist)
- Signals reflect the actual current date — no stale news
- Control Gate 1 screen is presented before writing anything to topic-scout.md

### Quality Standards (Claude judgment)
- At least one candidate from a Geopolitics signal
- At least one candidate from a Government/Policy signal
- Candidates span at least 3 of the 6 signal domains
- Exactly 5 Tier 1 (Trending) candidates and exactly 5 Tier 2 (Evergreen Gold Mine) candidates
- Each Tier 2 candidate explicitly states which gold mine criterion it satisfies
- No ⭐ RECOMMENDED marker — equal weight enforced
- Audience impact rationale speaks directly to VP Supply Chain / COO / Director of Operations persona
- Hook candidates follow stat-led or contrarian format

### Novelty Bar
- Not a direct clone of any prior infographic slug in `data/`
- Not same company + same thesis as any existing infographic
- Not same framing/angle with no new insight
- Temporal shift alone (3+ years) counts as valid delta only if data is substantially updated

---

## Self-Validation Checklist

Before presenting Control Gate 1:

- [ ] Exactly 10 candidates (5 Tier 1 + 5 Tier 2)?
- [ ] All required fields present for every candidate?
- [ ] Novelty delta written for each candidate?
- [ ] Candidates span at least 3 signal domains?
- [ ] At least one Geopolitics and one Government/Policy signal?
- [ ] Exactly 5 Tier 1 candidates (2 full depth + 3 shortlist)?
- [ ] Exactly 5 Tier 2 candidates (2 full depth + 3 shortlist)?
- [ ] No ⭐ RECOMMENDED marker used — all 10 candidates equal weight?
- [ ] Signal Summary reflects current date and actual recent events?
- [ ] Novelty Check Summary lists existing infographics and confirms no clones?
- [ ] Performance context applied (if data/*/performance.md files exist)?
- [ ] recently-used-sources.md checked (no organization over-represented)?

- [ ] signal-trending.json written to data/{week}/?
- [ ] signal-evergreen.json written to data/{week}/?
- [ ] LinkedIn Signal Scan section present in topic-scout.md?
- [ ] Trending Signals table: ≥3 post patterns reverse-engineered?
- [ ] Evergreen Signals table: ≥2 circulating patterns identified?
- [ ] Gap opportunity identified for each tier?
- [ ] Signal match field populated for all full-depth candidates (1-2, 6-7)?
- [ ] Message Hypothesis filled with all 3 fields after topic selection?
- [ ] Story uses paradox/tension format ("same X that Y has made Z")?
- [ ] Hero number is a single specific figure, not a range?

**If any checkbox fails**: Revise before presenting Control Gate 1.

---

## Target Audience

VP Supply Chain, Director of Demand Planning, Director of Operations, COO. Decision-makers with P&L accountability managing $100M-$1B inventory or operations. They have seen vendor decks. They dismiss content marketing. Topics must have real stakes, real data, and a decision implication.

---

## Token Budget

~8-12K tokens per run. Signal scan synthesis adds ~2-3K over baseline. Full candidates (1-2, 6-7) are same depth as prior 4-candidate format. Shortlist candidates (3-5, 8-10) are 1 line each — minimal token cost. Load `data/sources.csv` headers only for routing. Scan `data/` folder for existing slugs (novelty check). Read `data/recently-used-sources.md` if it exists. Read performance.md files from last 4 weeks if they exist.
