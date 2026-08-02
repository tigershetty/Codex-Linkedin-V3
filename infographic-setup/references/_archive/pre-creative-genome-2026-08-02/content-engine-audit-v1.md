# Content Engine Audit v1 — Calendar, Research, Topics, Context

**Date:** 2026-06-30  
**Status:** Audit first; rebuild brief next  
**Scope:** `master-calendar.md`, `101-plan.md`, `ai-for-sc-plan-v2.md`, research briefs, source system, analytics, voice docs, and how upstream context feeds visuals.

> **V4 supersession note (2026-07-28):** this audit explains the diagnosis that led to V4. Use
> `v4-audience-growth-operating-system.md` for current cadence and topic admission. In particular,
> the Top-100 is now optional curated-success packaging intelligence, not a mandatory upstream gate
> or a set of proven causal formats.

## Executive Diagnosis

The visual system was not the only problem. It was downstream of a deeper issue:

> The current content engine is a curriculum calendar with a research layer attached. It needs to become an audience-intelligence engine that earns attention by choosing the right problems, then turns those problems into memorable operating models.

The repo has strong pieces:

- a coherent 101 + AI-for-SC weekly structure,
- Tiger's voice DNA,
- a mandatory research-engine spec,
- a source database,
- analytics data,
- Visual Engine v2 for better outputs.

But the upstream engine is not yet world-class because topic selection is mostly pre-planned by supply-chain function, not dynamically chosen from audience demand, current market tension, role pain, performance data, and Tiger's lived authority.

**2026-06-30 historical update:** the Top-100 reference set became an upstream selection input rather than only a mood board. V4 narrows that decision: use it after topic admission when a curated-winner mechanic hypothesis materially improves packaging; do not call the format proven.

## 1. What Is Working

### 1.1 The calendar has discipline

`master-calendar.md` solves drift by separating Run Week from Plan Week. That is good operational design. It gives the pipeline order and prevents the team from rethinking everything every week.

### 1.2 The paired 101 + AI-for-SC structure is strong

The idea that the same weekly theme teaches both:

- the concept, and
- the AI-enabled workflow

is still a good strategic spine. It gives the audience both foundation and application.

### 1.3 The research-engine standard is directionally right

The research-engine spec already asks for:

- reliability tags,
- no invented numbers,
- card-ready facts,
- visual-data candidates,
- honesty ledger,
- tool + method layer for AI-for-SC.

This is the right standard. The issue is not the idea of research-first. The issue is that research is not yet used to decide whether a topic deserves the week.

### 1.4 The analytics contain strong signal

The best-performing posts are not random:

| Signal | Evidence from `analytics-log.csv` |
|---|---|
| Career/role-map posts can explode | `supply-chain-career-map`: 175,045 impressions, 411 saves, +335 followers |
| Strategic mental models travel | `strategic-vs-tactical-vs-operational-planning`: 28,054 impressions, 65 saves |
| Named-company strategic stories travel | `maersk-post`: 56,940 impressions, 62 saves, +114 followers |
| Practical foundational models can work | `safety-stock`: 6,295 impressions, 18 saves, +35 followers |

The audience is telling us what they value: maps, role clarity, strategic mechanisms, operating distinctions, and reusable mental models.

## 2. What Is Missing

### 2.1 No audience segmentation layer

The plans say "experts and non-practitioners" or "any SC role," but they do not define concrete audience jobs.

Missing audience segments:

| Segment | What they want | What they save |
|---|---|---|
| Early-career SC professionals | understand the function, grow faster, avoid looking naive | maps, ladders, frameworks, interview-ready explanations |
| Practitioners in procurement/planning/logistics | solve today’s recurring work friction | templates, workflows, prompts, checklists, decision rules |
| Managers / senior managers | explain trade-offs to leadership | operating models, decision maps, risk/cost narratives |
| Non-SC business peers | understand why SC says no or asks for data | plain-English explainers, analogies, consequence maps |
| AI-curious SC teams | use AI without looking reckless | copy-paste workflows, limits, verification steps |

Right now, the content plan is organized by supply-chain function. It should be organized by **audience pain and audience ambition**, then mapped back to function.

### 2.2 No topic scoring gate

Topics enter the calendar because they fit the function sequence, not because they clear a demand bar.

Missing pre-production score:

| Score dimension | Question |
|---|---|
| Audience pain | Does this solve a problem the reader actually feels? |
| Career leverage | Would knowing this make someone look sharper in a meeting? |
| Save utility | Would someone screenshot/save this for later? |
| Visual shape | Does the topic have a strong diagram hiding inside it? |
| Freshness | Is there a current market/tool/regulatory reason this matters now? |
| Tiger authority | Can Tiger add lived operating perspective, not just definitions? |
| Debate/tension | Is there a real trade-off, misconception, or decision pressure? |

No topic should proceed unless it clears the bar.

### 2.3 The current 101 plan over-indexes on definitions

Many topics are useful but framed as "what is X?"

Examples:

- What is a production plan
- What is RCCP
- What is reorder point
- What is landed cost
- What is VMI

These are fine as educational concepts, but they are not automatically engaging. The stronger framing is usually:

| Current topic | Stronger audience-led frame |
|---|---|
| What is RCCP | The S&OP plan is approved. Can the factory actually build it? |
| What is reorder point | Why you keep stocking out between orders |
| What is landed cost | The supplier quote was cheaper. Why did the total cost go up? |
| What is VMI | Your supplier wants to manage your stock. What are you giving up? |
| What is a production plan | The demand plan says 10,000 units. What does the factory actually do with that? |

The plan already contains some of these questions, but the calendar key still treats the topic as a concept, not a tension.

### 2.4 The AI-for-SC plan is too tool/use-case led

The AI plan usually starts with:

- Role
- Tool
- Use case
- Hook direction
- Visual

That is useful, but the strongest LinkedIn post starts one layer earlier:

> What recurring frustration does this person have at work, and what decision/action changes after reading?

For example:

| Current use case | Missing sharper premise |
|---|---|
| Build a supplier evaluation scorecard in Excel | You have QBR data in three systems and the meeting is tomorrow. How do you turn it into a fair decision? |
| Suggest production sequences to minimise changeover | The schedule is technically feasible but burns capacity through changeovers. What sequence would a planner defend? |
| Build a demand review dashboard | The demand review is full of charts but no narrative. What changed, why, and what decision is needed? |

AI-for-SC should not be "AI can do this task." It should be "this role is stuck at this decision point; here is the AI-assisted workflow that gets them unstuck safely."

### 2.5 Research happens too late

The research-engine runs before writing a post, but the topic plan itself is not research-ranked.

Current pattern:

1. Calendar picks a topic.
2. Research brief supports the topic.
3. Content and visual are built.

World-class pattern:

1. Audience + market scan finds tensions.
2. Research ranks which tensions are real and timely.
3. Calendar selects the strongest topic.
4. Content and visual are built from a research-backed thesis.

The current system validates a chosen topic. It does not yet choose the best topic.

### 2.6 Source rotation exists, but source intelligence is stale

`sources.csv` is useful and broad. `recently-used-sources.md` is stale from 2026-W08. The current source loop does not reflect actual recent research briefs or published posts.

Missing source functions:

- trend radar,
- practitioner pain radar,
- tool capability radar,
- regulatory/geopolitical radar,
- analytics-informed topic memory,
- "sources that produced high-performing posts" tagging.

### 2.7 Analytics are recorded but not operationalized

The analytics log has enough signal to guide the next calendar. But the plan does not appear to use it as a gating input.

Missing feedback questions:

- Which topics created followers, not just impressions?
- Which posts were saved?
- Which hook types drove comments?
- Which formats created profile viewers?
- Which audience segments responded?
- Which posts had high impressions but weak saves, suggesting curiosity without utility?

The highest-performing post, `supply-chain-career-map`, should have triggered an entire "career leverage" content pillar. It did not.

### 2.8 No "originality moat"

A lot of planned posts are structurally common:

- safety stock,
- reorder point,
- S&OP,
- landed cost,
- service level,
- ERP,
- control tower.

These can work, but only if each one has a proprietary angle.

Missing originality sources:

- Tiger's lived manager perspective,
- real operating examples,
- "what breaks in the meeting" detail,
- hidden trade-off,
- career implication,
- what the dashboard does not show,
- where AI fails,
- role-specific decision.

Without this, the post is accurate but interchangeable.

## 3. Root Cause

The source problem is not "bad topics." The source problem is **weak topic qualification**.

Current engine asks:

> What supply-chain concept belongs next in the curriculum?

The rebuilt engine should ask:

> What is the most valuable supply-chain problem, misconception, decision, or career leverage point this audience should understand this week?

That shift changes everything downstream:

- research becomes sharper,
- visuals become argument-led,
- captions become more specific,
- AI workflows become more useful,
- analytics become actionable,
- the calendar becomes adaptive without becoming chaotic.

## 4. What To Improve

### 4.1 Replace the calendar spine with a 3-layer system

Keep `master-calendar.md`, but add a decision layer above it:

| Layer | Purpose |
|---|---|
| Evergreen curriculum | The supply-chain concepts we eventually want to cover |
| Audience demand radar | Current role pains, career questions, tool shifts, market events |
| Weekly editorial board | Scores and selects the best topic pair for the week |

The calendar becomes a candidate bank, not a prison.

### 4.2 Add a topic scorecard

Create `references/topic-selection-scorecard.md`.

Recommended scoring:

| Dimension | Weight |
|---|---:|
| Audience pain / desire | 25 |
| Save utility | 20 |
| Visual potential | 15 |
| Freshness / timing | 15 |
| Tiger authority | 10 |
| Research strength | 10 |
| Series fit | 5 |

Minimum publish threshold: 75/100.  
World-class target: 85+.

### 4.3 Add an audience intelligence file

Create `references/audience-intelligence.md`.

It should define:

- target segments,
- their pains,
- their ambitions,
- what they save,
- what they comment on,
- what they ignore,
- what makes Tiger credible to them,
- examples of winning hooks for each segment.

### 4.4 Add a weekly signal scan

Create `references/weekly-signal-scan-template.md`.

Every week, before selecting topics, scan:

| Signal type | Examples |
|---|---|
| Role pain | planner stuck in S&OP, buyer facing price increase, logistics manager triaging exceptions |
| Market event | tariffs, disruptions, AI tool launches, regulation, logistics capacity shifts |
| Tool shift | Copilot/ChatGPT/Claude/Gemini capability change |
| Analytics | last posts by saves, followers, comments, profile viewers |
| Creator benchmark | what top creators are doing structurally, not what they are talking about |
| Audience questions | comments, DMs, recurring workplace confusion |

### 4.5 Change research briefs from support briefs to thesis briefs

Research should not only answer "what facts support this topic?"

It should answer:

- What is the non-obvious thesis?
- What is the strongest counterargument?
- What would a practitioner disagree with?
- What is the role-specific consequence?
- What is the meeting-room use case?
- What visual structure does the evidence naturally want?

Add these sections to future briefs:

```md
## 0. Topic Qualification
- Audience segment:
- Pain/desire:
- Why now:
- Score:

## 3b. Tension / Trade-off
- What makes this interesting:
- What people get wrong:
- What a practitioner would push back on:

## 3c. Meeting-Room Use
- When would someone use this post at work?
- What decision does it help explain?
```

### 4.6 Build content pillars from performance, not only functions

Recommended pillars:

| Pillar | Why |
|---|---|
| Career leverage maps | Proven by `supply-chain-career-map`; high follower conversion |
| Operating mental models | Proven by strategic/tactical/operational planning, 1PL-5PL, safety stock |
| Decision trade-offs | Strong fit for procurement/planning/logistics managers |
| AI workflow templates | Practical, differentiated if tool limits are honest |
| Company/mechanism deep dives | Proven by Maersk; should return as selective timely posts |
| Finance-for-SC | High leadership relevance; bridges practitioner to manager |
| Failure modes | High save utility; "what kills S&OP", "where forecasts fail", "why QBRs change nothing" |

The monthly function themes can remain, but the weekly post must belong to at least one content pillar.

### 4.7 Rebuild the AI-for-SC premise

For each AI-for-SC post, require:

```md
Role:
Recurring frustration:
Decision/action after reading:
Input data required:
AI workflow:
Verification step:
Boundary / human decision point:
Published-caption value promise:
Reusable artifact:
```

The reusable artifact is crucial. Every AI-for-SC post should leave the reader with one of:

- a prompt,
- a table schema,
- a checklist,
- a calculation model,
- a review script,
- a dashboard layout,
- a meeting narrative.

### 4.8 Add "visual argument" before visual style

Visual Engine v2 will only be as good as the upstream concept.

Before any image prompt, require:

```md
Visual argument:
The reader should understand [claim] because the image shows [structure].
```

If this sentence is weak, the topic/context is weak.

## 5. What Can Be Removed or De-Emphasized

Do not delete without approval, but de-emphasize:

| Item | Action |
|---|---|
| Old Gemini prompt template in `101-plan.md` | Keep as deprecated archive only |
| Function-only calendar rigidity | Keep sequence as candidate bank, not mandatory weekly order |
| "What is X" topic labels | Rewrite as tension/question headlines |
| Source rotation log as-is | Replace with live signal/source intelligence |
| AI use cases that only show tool capability | Rebuild around role frustration and reusable artifact |
| Analytics as passive archive | Promote to weekly editorial input |
| Visual format selected in topic plan | Defer until research defines the argument |

## 6. New Production Flow

Recommended weekly flow:

```text
1. Signal scan
   - analytics
   - current market/tool changes
   - audience questions
   - creator pattern benchmark

2. Topic shortlist
   - 6 candidates: 2 evergreen, 2 role-pain, 1 timely, 1 career/leadership

3. Topic scoring
   - score with audience pain, save utility, visual potential, freshness, Tiger authority, research strength

4. Research thesis brief
   - prove the topic deserves attention
   - identify non-obvious thesis, tension, counterargument, meeting-room use

5. Content brief
   - hook direction
   - audience segment
   - post promise
   - reusable takeaway

6. Visual brief
   - visual argument
   - reference selection
   - GPT Image 2 prompt
   - HTML control only if needed

7. Publish + learn
   - record analytics
   - score topic category, hook, visual structure, saves, follower conversion
   - feed the next signal scan
```

## 7. Rebuild Priority

### Phase 1 — Audit-to-System Conversion

Create:

- `audience-intelligence.md`
- `topic-selection-scorecard.md`
- `weekly-signal-scan-template.md`
- `content-brief-v2-template.md`
- updated `research-engine` schema

### Phase 2 — Re-score the next 8 weeks

Do not blindly continue RW03-RW10. Re-score every upcoming topic against:

- audience segment,
- save utility,
- career/meeting-room use,
- research strength,
- visual argument.

Replace or reframe weak topics.

### Phase 3 — Build the first "world-class" week

One week should include:

- one career/operating map,
- one decision trade-off,
- one AI workflow artifact,
- one timely/current signal or company mechanism.

Not four curriculum cards.

### Phase 4 — Analytics loop

Update analytics records so every post has:

- real slug,
- content pillar,
- audience segment,
- topic score,
- hook type,
- visual structure,
- save rate,
- follower conversion,
- qualitative read.

## 8. What "Mastery" Means Here

World-class LinkedIn creators do not win because they post more. They win because their content has:

1. a clear audience,
2. repeated topic-market fit,
3. a recognizable point of view,
4. a high-density promise,
5. a reusable takeaway,
6. a feedback loop,
7. a format that makes the idea easy to remember.

For Shetty's Desk, that means every post should answer:

> Why would a supply-chain professional save this, share this, or follow Tiger because of it?

If the answer is only "because it explains a concept," the topic is not ready.

## 9. Immediate Verdict

The current calendar should not be thrown away. It should be demoted from **source of truth** to **candidate library**.

The new source of truth should be:

1. audience intelligence,
2. weekly signal scan,
3. topic score,
4. research thesis,
5. content brief,
6. visual argument.

That is the upstream rebuild required for Visual Engine v2 to consistently produce output that is not only beautiful, but worth caring about.

## External Benchmark Notes

Current LinkedIn/platform and creator benchmarks point toward the same operating principles:

- professional relevance and expertise matter more than generic reach,
- topic credibility and niche authority matter,
- comments/saves/follower conversion are better learning signals than likes alone,
- B2B thought leadership works when it gives decision-makers useful, differentiated thinking rather than generic educational content,
- strong creators repeatedly mine a narrow audience problem space and package it into memorable frameworks.

Sources to keep in the benchmark set:

- LinkedIn feed-ranking / professional relevance research: https://arxiv.org/abs/2602.12354
- Business Insider reporting on LinkedIn's professional-knowledge feed shift: https://www.businessinsider.com/linkedin-news-feed-showing-old-posts-algorithm-change-2025-7
- LinkedIn/Edelman B2B thought-leadership reports: search and refresh before final benchmark doc
- Current supply-chain trend scans from Gartner, ASCM, Deloitte, McKinsey, Microsoft, OpenAI, and major logistics/procurement trade sources
