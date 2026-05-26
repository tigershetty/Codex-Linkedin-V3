# Shetty's Desk — Pipeline Automation Design
**Status**: Design phase — not yet built
**Last updated**: 2026-05-26
**Session**: Recovered from brainstorming session (38626114), cut off mid-proposal
**Next step**: Resume design with `/superpowers:brainstorming` — pick up at the revised multi-agent proposal

---

## What We're Building

An automated content production system for the Shetty's Desk infographic pipeline, plus a LinkedIn intelligence layer that feeds topic signals into the pipeline automatically.

**Goal**: Reduce all manual friction across every stage of the pipeline. Today every step is human-triggered. The target is one command to run a full week's content, pausing only at the two human control gates where Tiger decides.

---

## Tiger's Answers to Clarifying Questions

- **Primary pain point**: Content production — all stages have friction
- **Specific friction**: All of it — session management across stages, Gemini handoff, hook selection at CG2, caption voice editing
- **LinkedIn scraping goal**: All three
  1. Own post analytics (save rate, engagement, reach per post)
  2. Competitor monitoring (Richard van der Blom, Asmaa Gad, Charlie Hills, other SC creators)
  3. Topic signals for `/scout` — what's being discussed, what gaps exist

---

## Architecture Decision: Multi-Agent Editorial Team

The right model is a **tiered agent team** mapped to pipeline stages — not a single orchestrator calling external APIs.

### Agent Roles

| Agent | Model | Role in Pipeline |
|---|---|---|
| **Advisor** | Opus 4.7 | Control gate reasoning — surfaces why a topic/hook should or shouldn't proceed. Tiger decides, Opus advises. |
| **Generator** | Sonnet | Core content work — research synthesis, hook writing, caption drafting, Gemini prompt construction |
| **Scout** | Haiku | Fast, cheap, repetitive tasks — LinkedIn signal harvesting, file state validation, source checking |

**Why this mapping**: Haiku costs ~1/10th of Opus. Running 100 LinkedIn signal checks through Haiku then surfacing only the top 5 to Sonnet for synthesis is both cheaper and better quality than running everything through one model.

### The Control Gates Stay Human

- **CG1** (topic/angle selection): Opus surfaces reasoning ("this angle has been done 3x this month by competitors"), Tiger decides
- **CG2** (hook selection): Opus evaluates each hook against voice DNA and engagement patterns, Tiger picks
- Everything between CG1 and CG2 runs automatically

---

## Pipeline Map: Before and After

### Current State (fully manual)
```
/scout     → Tiger reads → decides topic
/research  → Tiger reads → edits evidence ledger
/message   → Tiger reads → picks angle
/content   → Tiger reads → edits caption
/gemini-prompt → Tiger copy-pastes to Gemini
```

### Target State (automated with human gates)
```
Haiku harvests LinkedIn signals → writes linkedin-signals.md
           ↓
/run [week] → Opus presents topic options at CG1
           ↓  (Tiger approves)
Sonnet runs /research + /message automatically
           ↓
Opus presents hook options at CG2
           ↓  (Tiger picks hook)
Sonnet runs /content + /gemini-prompt automatically
           ↓
Output: caption file + Gemini prompt file ready
```

---

## LinkedIn Intelligence Layer

**Tool: Apify LinkedIn scraper** (SaaS, no browser automation needed, free tier available)
- Runs on a schedule (weekly or on-demand)
- Outputs to `data/linkedin-signals.md`
- `/scout` reads this file at the start of every session

### What it tracks

**Own analytics** (your posts):
- Save rate per post
- Engagement rate (comments + reactions / impressions)
- Which visual format drove highest saves
- Top-performing hooks (first line)

**Competitor monitoring** (weekly scan of 5–8 creators):
- Post topics and formats
- Engagement benchmarks
- Gaps — topics they haven't covered

**Topic signals** (trending SC content):
- What questions are appearing in comments
- Which topics are getting reshared
- Emerging themes not in the current 31-week plan

---

## What Still Needs to Be Decided

The session was cut off before these questions were answered:

1. **Trigger model**: Does the pipeline run on a command (`/run W22`), a schedule (automated every Monday), or a file drop (drop a brief.md and it starts)?
2. **LinkedIn scraping frequency**: Weekly batch vs. on-demand before each `/scout` run
3. **Apify vs. alternative**: Apify has a LinkedIn scraper but costs ~$5–10/month for light use. Alternative: RSS feeds from LinkedIn (limited) or manual export + script
4. **Where Gemini handoff happens**: Currently Tiger copies the prompt to Gemini manually. Automate this or keep it manual? (Gemini API exists but image gen quality differs from the Gem)

---

## LinkedIn Auto-Posting — Separate Track (On Hold)

Designed separately. Status: paused.

**What's built**:
- `.env` file with `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_URN` (`k7d8ogGaBT`) — confirmed working
- Full posting flow designed: Canva export → `exiftool` metadata strip → post via API → log

**Why on hold**: Waiting to test draft post first (`lifecycleState: DRAFT` — no public exposure, deletable from LinkedIn Creator tools). Resume when ready.

**The 'CR' tag problem**:
LinkedIn auto-tags posts as AI-assisted if Canva's AI features (image enhancer, magic resize, background removal) wrote metadata into the export. Fix: stop using Canva's AI features, or run `exiftool -all= image.png` before posting to strip all AI provenance metadata.

**Next step**: Write `post-to-linkedin.sh` script. Run draft test. Confirm no CR tag after `exiftool` strip.

---

## How to Resume This Work

1. Open a new session in `Claude Nano  test update/`
2. Run `/superpowers:brainstorming`
3. Paste this as context:
   > "I want to continue the pipeline automation design for Shetty's Desk. The design doc is at `docs/automation-design/pipeline-automation-design.md`. We stopped mid-proposal on the multi-agent architecture. Resume from the 'What Still Needs to Be Decided' section."
