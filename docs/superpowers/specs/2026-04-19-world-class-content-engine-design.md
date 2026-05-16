# World-Class Content Engine — Design Spec

**Date:** 2026-04-19
**Author:** Tiger Shetty + Claude
**Status:** Draft — pending user review
**Goal:** 10x engagement, top 10 LinkedIn creator by end of 2026
**Scope:** Three systems — Voice Engine, Gemini Prompt Calibrator, Analytics Intelligence Loop

---

## Context

Shetty's Desk has 28 published posts, two breakout performances (56k and 28k impressions), and a growing audience of supply chain professionals. The content engine has three pipelines (Deep Dive, Supply Chain 101, AI for Supply Chain) with a comprehensive voice DNA system (tiger-voice.md v1.0).

**The problems this design solves:**
1. Voice inconsistency — hooks and captions sometimes sound AI/generic despite having detailed voice rules
2. Gemini image prompts require manual refinement — the pipeline generates drafts that Tiger consistently adjusts before sending
3. No feedback loop — 28 posts of performance data exist but don't inform future content generation
4. No learning mechanism — the system makes the same voice mistakes repeatedly because corrections aren't captured

**What the data shows (28-post analysis):**
- Posting cadence is the #1 performance killer — consecutive-day posts average 232 impressions vs. 5,841 for 3+ day gaps
- Specificity drives breakouts — named companies (Maersk, Red Bull), specific numbers, concrete consequences all correlate with top performance
- Quality conversion is improving — recent posts convert 1.2-1.4% of viewers to saves+followers vs. 0.3% for early posts
- AI for SC series has not found traction — both posts under 250 impressions with generic hooks
- Voice quality and engagement quality appear correlated — the best-performing posts also follow tiger-voice.md most closely

---

## System 1: Voice Engine

### Purpose
Ensure every piece of generated content deploys Tiger's voice correctly during generation, not after. The voice engine is embedded in the generation prompt itself, not a separate validation step. It also learns from Tiger's corrections over time, getting measurably better at sounding like Tiger with each post produced.

### Architecture

#### 1.1 Embedded Voice Enforcement

Every generation skill (`/101`, `/content`, `/ai-for-sc`) loads three files in this priority order:

1. `voice-corrections.md` (highest priority — learned corrections from Tiger's actual edits)
2. `tiger-voice.md` (the voice constitution — v1.0, comprehensive)
3. Pipeline-specific voice file (`101-voice.md`, `published-voice.md`, or `ai-for-sc-voice.md`)

The generation prompt structure requires the LLM to:
- Generate the content (hooks, caption, etc.)
- Self-evaluate each element against the voice rules
- Regenerate any non-compliant elements inline
- Present only compliant output to Tiger

This means Tiger never sees a first draft with em dashes, choppy fragments, or "My take:" — those are caught and fixed before output.

#### 1.2 Correction Memory (self-learning layer 1)

**File:** `infographic-content-engine-v1/references/voice-corrections.md`

**How it works:**
- When Tiger edits a generated hook or caption before publishing, the system captures the correction
- Each correction is stored as a pattern, not just specific text:
  ```
  ## Correction #12 — 2026-04-20
  **Generated:** "My take: resilience isn't overhyped."
  **Tiger changed to:** "If you look at the bigger picture, the push for resilience isn't wrong."
  **Pattern:** Replaced declarative opinion marker with conversational bridge. Softened framing from dismissive to nuanced. Added qualifying context.
  **Rule derived:** When expressing a position on an industry trend, use conversational bridges and acknowledge the valid parts of the opposing view before landing Tiger's position.
  ```
- Corrections accumulate over time — the file grows with each post
- Generation skills load this file FIRST, meaning corrections override general voice rules where they're more specific
- This is the mechanism that stops the system repeating mistakes Tiger has already corrected

**Maintenance:** When voice-corrections.md exceeds 30 entries, the `/voice-review` skill consolidates: similar corrections are merged into single pattern rules, and corrections that have been promoted into tiger-voice.md are archived to `voice-corrections-archive.md`. This keeps the active correction file focused and high-signal.

**Capture mechanism:**
- After each post is published, Tiger provides the final published caption
- The system diffs the generated caption against the published version
- Meaningful changes (not typo fixes) are extracted and stored as correction patterns
- A new `/capture` skill handles this step — Tiger runs `/capture [slug]` with the published text

#### 1.3 Voice Quality Scoring (self-learning layer 2)

**File:** Appended to each post's `analytics.md` or `101-copy.md`

**Metrics scored per post:**

| Metric | What it measures | How it's scored |
|---|---|---|
| Connective tissue density | Instances of "because", "so", "which means", "and then", "essentially" per 100 words | Count / word count * 100 |
| Sentence length variance | Standard deviation of sentence lengths | Higher = more natural rhythm |
| Specificity score | Named companies + specific numbers + concrete consequences + relatable analogies | Count of specificity signals |
| Specificity type | Which forms of specificity are used (company, number, consequence, analogy) | Categorical tag |
| Opinion bridge used | Which of Tiger's 5 approved bridges is used | Categorical — tracks rotation |
| Pattern breakers present | Count of: "And"/"But" openers, parenthetical asides, specific personal details | Count |
| Rejection violations | Any choppy fragments, em dashes, AI slop language, hedging that slipped through | Count (target: 0) |
| Hook type | Which of the 10 hook types was selected | Categorical tag |

This score is computed for every post and stored alongside performance metrics. Over time, this enables correlation analysis: "Do posts with higher voice quality scores also perform better?"

#### 1.4 Voice DNA Evolution (self-learning layer 3)

**Trigger:** Every 10-15 posts (roughly monthly), or on demand via `/voice-review`

**What it does:**
1. Reads all corrections from `voice-corrections.md`
2. Reads voice quality scores + performance correlations
3. Identifies patterns consistent enough to become permanent rules
4. Proposes specific updates to `tiger-voice.md`:
   - New DO/DON'T entries
   - New pattern breakers discovered from successful posts
   - Refined opinion bridges based on what Tiger actually uses
   - Updated rejection patterns based on new AI writing trends
   - New specificity patterns that correlate with engagement
5. Tiger approves or rejects each proposed update
6. Approved updates are merged into tiger-voice.md with a version bump

**What this does NOT do:**
- Does not narrow hook type selection — all 10 types remain available
- Does not bias toward "what performed well" at the expense of experimentation
- Does not override tiger-voice.md without Tiger's explicit approval
- Does not change audience calibration or content type strategy
- Does not eliminate any content format — it makes all formats sound more like Tiger

**The principle:** The voice framework is the constitution. Performance data and corrections refine how well the system executes the constitution. They don't change what the constitution says without Tiger's deliberate approval.

---

## System 2: Gemini Prompt Calibrator

### Purpose
Take pipeline-generated `gemini-prompt.md` output and refine it through 10+ iterations, calibrated against Tiger's stored final prompts and the visual DNA system. The goal is to close the gap between what the pipeline generates and what Tiger would actually send to Gemini.

### Architecture

#### 2.1 Prompt Refinement Pattern Library

**Source data:** All `analytics.md` files with `## Final Gemini Prompt (as used)` sections (currently: Maersk, Zara, Nike, Dabbawalas)

**Extraction process:**
For each post that has both a pipeline `gemini-prompt.md` and a final prompt in `analytics.md`:
- Diff the two versions
- Extract consistent refinement patterns:
  - What Tiger adds (e.g., more specific layout instructions, dimension details, brand color references)
  - What Tiger removes (e.g., overly complex scene descriptions, redundant negative prompts)
  - What Tiger restructures (e.g., reordering sections, simplifying zone descriptions)
- Store as a `prompt-refinement-patterns.md` reference file

This library grows as more final prompts are stored.

#### 2.2 Pre-Refinement Step

Before the iteration loop begins, the system applies all learned refinement patterns to the draft prompt:
- Adds standard elements Tiger always includes (brand anchor reference, dimension spec, style rules)
- Removes elements Tiger always strips out
- Restructures to match Tiger's preferred prompt format
- This produces "Iteration 0" — the calibrated starting point

#### 2.3 10+ Iteration Loop with Gemini Nano Banana Pro 2

**Mechanism:** (Architecture designed — specific iteration method pending Tiger's input on how Gemini Nano Banana Pro 2 loops work)

Each iteration:
1. Sends the prompt to Gemini for generation
2. Evaluates the output against:
   - Visual DNA system (infographic-visual-dna.md) — background color, illustration style, layout
   - Calibration Gate (4-point check: background, text readability, number rendering, section structure)
   - Prompt refinement patterns — does the output match what Tiger's finals produce?
3. Adjusts the prompt based on evaluation findings
4. Sends adjusted prompt for next iteration
5. After 10+ iterations, presents the top 2-3 best outputs with the prompts that produced them

**Storage:** The final selected prompt is stored in the post's `analytics.md` under `## Final Gemini Prompt (as used)`, feeding back into the refinement pattern library for future posts.

#### 2.4 Continuous Calibration

As more final prompts are stored:
- The refinement pattern library grows
- Pre-refinement becomes more accurate (fewer iterations needed to reach quality)
- The system learns Tiger's visual preferences at a prompt level, not just a rule level

---

## System 3: Analytics Intelligence Loop

### Purpose
Continuously read performance data, correlate with content decisions, and feed actionable insights back into the generation pipeline. Not a dashboard — a learning system that makes the next post better informed by every previous post.

### Architecture

#### 3.1 Data Sources

| Source | Location | What it contains |
|---|---|---|
| `scraped_posts.json` | `/Infographic Analytics/Analytics/` | Per-post metrics: impressions, reach, reactions, comments, reposts, saves, profile viewers, followers gained |
| `captions.py` | `/Infographic Analytics/Analytics/` | Full caption text for every post |
| LinkedIn Export Excel files | `/Infographic Analytics/Analytics/Exports/` | Raw LinkedIn analytics per post (demographic breakdowns) |
| Voice quality scores | Per-post files in content engine `data/` | Voice execution metrics from System 1 |
| Hook type + content metadata | Per-post files | Hook type selected, content type (101/Deep Dive/AI for SC), specificity signals |

#### 3.2 Content Intelligence Report

**File:** `infographic-content-engine-v1/references/content-intelligence.md`

**Auto-regenerated** every time new analytics data arrives from the Cowork scraper. Always reflects the latest data.

**What it contains:**

**Section 1 — Performance Patterns (what's working):**
- Hook type vs. quality engagement (saves + followers, not just impressions)
- Specificity type vs. engagement, broken down by content type:
  - For Deep Dive: named company, financial figure, mechanism chain
  - For 101: concrete number, relatable analogy, specific consequence, real-world scenario
  - For AI for SC: named workflow, time saved, specific role
- Word count bands vs. performance
- Posting cadence vs. reach (the consecutive-day penalty)
- Content type vs. audience quality conversion

**Section 2 — Voice Quality Correlations:**
- Voice quality score vs. engagement (from System 1)
- Which voice elements correlate most with saves (the highest-quality engagement signal)
- Correction frequency trends — is the system making fewer mistakes over time?

**Section 3 — Audience Intelligence:**
- Who is engaging: seniority, industry, company size (from LinkedIn export data)
- Which content type attracts which audience segment
- Follower conversion patterns: what makes someone follow vs. just react

**Section 4 — Actionable Recommendations:**
- Specific, numbered recommendations for the next post based on current patterns
- Example: "101 posts with a concrete number in the first sentence average 3.2x more saves than those without. The next 101 hook should open with a specific number."
- Example: "Posts spaced 3+ days apart average 25x more impressions than consecutive-day posts. Do not publish before April 21."
- These recommendations are loaded as context in generation skills — not as hard rules, but as informed defaults

#### 3.3 How Intelligence Feeds Back Into Generation

The generation skills (`/101`, `/content`, `/ai-for-sc`) load `content-intelligence.md` as context alongside voice files. This means:

- When generating hooks, the system knows which specificity types correlate with engagement for this content type
- When structuring captions, the system knows the optimal word count range based on actual data
- When selecting opinion bridges, the system knows which ones Tiger has been using (rotation tracking)
- The system can flag: "You published yesterday. Based on cadence data, posting today will likely reduce reach by ~25x. Recommended next publish date: [date]."

**What this does NOT do:**
- Does not eliminate any hook type or content format
- Does not override voice rules — voice comes first, intelligence informs within voice constraints
- Does not automate publishing decisions — always presents recommendations, Tiger decides
- Does not narrow content strategy — identifies what works but doesn't restrict experimentation

#### 3.4 Continuous Learning

The intelligence report is a living document. As more posts are published and tracked:
- Correlations become more statistically significant
- New patterns emerge (e.g., seasonal effects, audience growth inflection points)
- The system surfaces surprises: "This post violated 3 voice rules but still performed well — investigate why"
- Tiger can query the system ad-hoc: "What's my average save rate for Contrarian hooks in 101?" and get an answer grounded in real data

---

## Integration: How the Three Systems Work Together

```
Content Generation Request (/101, /content, /ai-for-sc)
         |
         v
   Load Context:
   1. voice-corrections.md (correction memory)
   2. tiger-voice.md (voice constitution)
   3. Pipeline voice file (101/deep-dive/ai-for-sc)
   4. content-intelligence.md (analytics insights)
         |
         v
   Generate Content (hooks, caption)
   with embedded voice enforcement
         |
         v
   Output: Voice-compliant hooks + caption
   + Gemini prompt draft
         |
         v
   Gemini Prompt Calibrator:
   Pre-refine using prompt-refinement-patterns.md
   → 10+ iteration loop with Gemini Nano Banana Pro 2
   → Present top renders
         |
         v
   Tiger publishes
         |
         v
   /capture: Tiger provides published caption
   → System diffs generated vs. published
   → Stores corrections in voice-corrections.md
   → Stores final Gemini prompt in analytics.md
         |
         v
   Cowork daily scraper updates scraped_posts.json
         |
         v
   Analytics Intelligence Loop regenerates
   content-intelligence.md with new data
         |
         v
   Next content generation loads updated intelligence
   (cycle repeats — each post makes the next one better)
```

---

## New Files Created

| File | Purpose | Location |
|---|---|---|
| `voice-corrections.md` | Accumulated correction patterns from Tiger's edits | `infographic-content-engine-v1/references/` |
| `prompt-refinement-patterns.md` | Learned Gemini prompt refinement patterns | `infographic-content-engine-v1/references/` |
| `content-intelligence.md` | Auto-generated analytics insights report | `infographic-content-engine-v1/references/` |

## New Skills Created

| Skill | Trigger | Purpose |
|---|---|---|
| `/capture [slug]` | After publishing | Captures corrections between generated and published content |
| `/insights` | On demand or after analytics update | Regenerates the content intelligence report |
| `/voice-review` | Every 10-15 posts or on demand | Proposes voice DNA evolution updates |

## Modified Skills

| Skill | Change |
|---|---|
| `/101` | Loads voice-corrections.md + content-intelligence.md as context. Embedded voice enforcement in generation prompt. Voice quality scoring appended to output. |
| `/content` | Same as above. |
| `/ai-for-sc` | Same as above. |
| `/gemini-prompt` | Integrates prompt calibrator. Pre-refinement step + iteration loop. |

---

## What This System Does NOT Do

- Does not narrow content strategy or eliminate any hook type, format, or content branch
- Does not override tiger-voice.md without Tiger's explicit approval
- Does not automate publishing — always presents, Tiger decides
- Does not replace the Cowork scraper — that continues running daily and feeding data here
- Does not require any new packages or dependencies
- Does not modify the visual DNA or brand anchor system

## Success Metrics

| Metric | Current Baseline | 3-Month Target | 6-Month Target |
|---|---|---|---|
| Average impressions per post | ~3,700 (median ~630) | 5,000+ median | 15,000+ median |
| Save rate | 0.15% average | 0.30%+ | 0.50%+ |
| Follower conversion | 0.35% average | 0.70%+ | 1.00%+ |
| Voice correction frequency | Unknown (no tracking) | <3 corrections per post | <1 correction per post |
| Gemini prompt iterations needed | Manual refinement every time | 10 automated → top 2-3 presented | 5 automated (pre-refinement handles the rest) |
| Posts with 0 comments | 7 of 28 (25%) | <10% | <5% |

---

*Spec version 1.0 — pending Tiger's review and input on Gemini iteration mechanism.*
