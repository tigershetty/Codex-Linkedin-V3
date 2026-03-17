# Infographic Content Engine — Web Application Design

**Date:** 2026-03-07
**Author:** Tiger Shetty
**Status:** Approved

---

## Context

The infographic content engine is a 7-skill Claude Code pipeline that produces weekly LinkedIn supply chain infographics for Shetty's Desk. Currently, the entire workflow runs as local Claude Code conversations with manual file management, manual image generation via Gemini gem, and manual LinkedIn posting.

**The problem:** The workflow is powerful but friction-heavy. It requires running Claude Code locally, managing files manually, and context-switching across Claude, Gemini, LinkedIn, and Excel for analytics.

**The goal:** Turn this into an accessible web product — a dashboard accessible from any device, with scheduled runs, automated image generation, and a streamlined LinkedIn publishing flow. Preserve the two editorial control gates (topic selection + hook selection) that encode Tiger's editorial judgment.

---

## Architecture

### Stack

| Layer | Tool | Rationale |
|---|---|---|
| Source control | GitHub | Auto-deploy hooks to Railway + Vercel |
| Frontend | React (Vite) → Vercel | Lightweight, free tier, auto-deploy |
| Backend | FastAPI (Python) → Railway | Long-running Python processes, ~$5–10/month |
| AI Pipeline | Claude Agent SDK | Anthropic-native, skills map to agents 1:1 |
| Database | Supabase (Postgres) | Free tier, visual editor, survives Railway restarts |
| File storage | Supabase Storage | Free (1GB), stores generated PNGs |
| Scheduler | Database-backed APScheduler | Re-registers from Supabase on startup — survives restarts |
| Image generation | Gemini API (image gen endpoint) | Same quality as Gemini gem, simpler auth than Vertex AI |
| LinkedIn | OAuth (Phase 1: draft → Phase 2: publish) | Developer app + waiting period required |
| Domain | Namecheap + Cloudflare DNS | ~$12–15/year domain, free DNS |

**Total estimated cost:** ~$5–10/month (Railway) + $12/year (domain). Everything else free tier.

### Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           FRONTEND (React / Vercel)          │
│  Dashboard • CG1 picker • CG2 picker        │
│  Run history • Draft preview • Analytics    │
└──────────────────┬──────────────────────────┘
                   │ REST API (CORS configured)
┌──────────────────▼──────────────────────────┐
│          BACKEND (FastAPI / Railway)         │
│                                             │
│  ┌─────────────────────────────────┐        │
│  │   Claude Agent SDK Pipeline      │        │
│  │  Scout → Research → Message →   │        │
│  │  Content → GeminiPrompt →       │        │
│  │  ImageGen → LinkedInDraft       │        │
│  └─────────────────────────────────┘        │
│                                             │
│  APScheduler (DB-backed, weekly cron)       │
│  HTTP Basic Auth (personal use protection)  │
└──────────┬────────────────┬─────────────────┘
           │                │
  ┌────────▼──────┐  ┌──────▼────────┐
  │   Supabase    │  │  Claude API   │
  │  Postgres     │  │  Gemini API   │
  │  Storage      │  │  (image gen)  │
  └───────────────┘  └───────────────┘
                            │
                   ┌────────▼───────┐
                   │ LinkedIn API   │
                   │ (Phase 2)      │
                   └────────────────┘
```

---

## Pipeline State Machine

Each pipeline run moves through these states, persisted in Supabase:

```
IDLE
  ↓ (weekly cron fires — Monday 9am, configurable)
SCOUT_RUNNING      ← ScoutAgent: 10 topic candidates (5 trending + 5 evergreen)
  ↓
CG1_PENDING        ← Dashboard badge + notification: "Pick your topic"
  ↓ (Tiger selects one of 10 cards)
RESEARCH_RUNNING   ← ResearchAgent: citation-grade evidence gathering
  ↓
MESSAGE_RUNNING    ← MessageAgent: story lock + 10 hook options
  ↓
CG2_PENDING        ← Dashboard badge + notification: "Pick your hook"
  ↓ (Tiger selects one of 10 hooks)
CONTENT_RUNNING    ← ContentAgent: Variant A + B + LinkedIn caption
  ↓
PROMPT_RUNNING     ← GeminiPromptAgent: paste-ready prompts (reference only)
  ↓
IMAGE_RUNNING      ← ImageGenAgent: Gemini API → PNG → Supabase Storage
  ↓
DRAFT_READY        ← Full preview: image + caption + LinkedIn draft
  ↓ (Tiger reviews + clicks "Queue for LinkedIn")
LINKEDIN_QUEUED    ← Post staged for publishing
  ↓ (Tiger clicks "Publish")
PUBLISHED
  ↓ (+7 days: analytics reminder notification)
ANALYTICS_PENDING
  ↓ (Tiger enters analytics data)
COMPLETE
```

### Failure Handling

Each stage writes its output to Supabase **before** marking state as complete. If a stage fails:
- State set to `{STAGE}_FAILED`
- Error message stored in Supabase
- Dashboard shows Retry button
- Only the failed stage re-runs — prior outputs preserved

### Concurrency

Multiple runs can exist simultaneously (different topics, same week). Each run has its own `id`, `week`, and `slug`. The scheduler creates one run per week automatically; additional runs can be triggered manually.

---

## Data Model (Supabase)

```sql
-- One row per pipeline run
pipeline_runs (
  id UUID PRIMARY KEY,
  week TEXT,                -- e.g. "2026-W10"
  slug TEXT,                -- e.g. "hormuz-supply-chain-shock"
  state TEXT,               -- IDLE | SCOUT_RUNNING | CG1_PENDING | ...
  selected_topic_index INT, -- CG1 selection (0-9)
  selected_hook_index INT,  -- CG2 selection (0-9)
  linkedin_post_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Markdown output of each pipeline stage
stage_outputs (
  id UUID PRIMARY KEY,
  run_id UUID REFERENCES pipeline_runs,
  stage_name TEXT,          -- scout | research | message | content | prompt | image
  output_md TEXT,           -- full markdown content
  image_url TEXT,           -- populated for image stage
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- 10 topic candidates from Scout stage
topic_candidates (
  id UUID PRIMARY KEY,
  run_id UUID REFERENCES pipeline_runs,
  position INT,             -- 1-10
  title TEXT,
  message_hypothesis TEXT,
  trend_type TEXT           -- trending | evergreen
)

-- 10 hook options from Message stage
hook_candidates (
  id UUID PRIMARY KEY,
  run_id UUID REFERENCES pipeline_runs,
  position INT,             -- 1-10
  hook_text TEXT
)

-- Post-publish analytics (replaces analytics-log.csv)
analytics_log (
  id UUID PRIMARY KEY,
  run_id UUID REFERENCES pipeline_runs,
  impressions INT,
  members_reached INT,
  profile_viewers INT,
  followers_gained INT,
  reactions INT,
  comments INT,
  reposts INT,
  saves INT,
  sends INT,
  engagement_rate DECIMAL,
  reach_efficiency DECIMAL,
  save_rate DECIMAL,
  follower_conversion DECIMAL,
  composite_score DECIMAL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
)

-- Schedule configuration (re-registered on backend startup)
schedule_config (
  id UUID PRIMARY KEY,
  cron_expression TEXT DEFAULT '0 9 * * 1', -- Monday 9am
  enabled BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMPTZ
)
```

---

## Frontend Views

### 1. Run Timeline (Home)
- List of all pipeline runs, sorted by week descending
- Each run shows: week, slug, state badge (color-coded), key metric if published
- Runs in `CG1_PENDING` or `CG2_PENDING` show prominent "Action Required" badge

### 2. CG1 — Topic Selection
- Grid of 10 topic cards (5 trending, 5 evergreen)
- Each card: title, message hypothesis, trend type, VP-relevance score
- Click to select → triggers Research stage

### 3. CG2 — Hook Selection
- List of 10 hook options (numbered)
- Each hook displayed as a readable text block
- Click to select → triggers Content stage

### 4. Draft Preview
- Left: generated infographic (PNG thumbnail, download button)
- Right: LinkedIn caption (copy button), post preview
- Action: "Queue for LinkedIn" button

### 5. Analytics Dashboard
- Table of all published posts with metrics
- Sortable by composite score, impressions, engagement rate

---

## Key Engineering Decisions

1. **HTTP Basic Auth** on all FastAPI routes — one-line protection against unauthorized access
2. **CORS middleware** configured with exact Vercel domain before first deploy
3. **Database-backed APScheduler** — reads schedule from Supabase on startup, re-registers cron jobs
4. **Stage timeout** of 5 minutes per Agent SDK stage — prevents runaway Railway compute costs
5. **Idempotent stages** — re-running a stage overwrites its output in Supabase (safe to retry)
6. **Image gen system prompt** — Gemini API called with brand-anchor-v1.webp as style reference + visual DNA rules from `references/infographic-visual-dna.md` replicated as prompt

---

## Build Phases

### Phase 1 — MVP
1. FastAPI backend project scaffold + Supabase connection
2. Claude Agent SDK pipeline (7 agent classes)
3. Gemini API image generation integration
4. Supabase schema migration
5. React dashboard: Run timeline + CG1 + CG2 + Draft views
6. Railway + Vercel deployment with HTTP Basic Auth + CORS
7. Cloudflare DNS pointing Namecheap domain to Vercel

### Phase 2 — Enhancement
1. LinkedIn OAuth + one-click publish
2. Analytics auto-capture (LinkedIn API data pull)
3. Push/email notifications for CG1, CG2, analytics reminders
4. Custom scheduling UI (change day/time from dashboard)
5. Analytics graphs

---

## Verification Plan

1. **Unit:** Each agent class runs locally and produces expected markdown output
2. **Integration:** Full pipeline run (IDLE → COMPLETE) in staging environment with real Claude API
3. **UI:** All 5 dashboard views render correctly, CG1/CG2 selections advance state correctly
4. **Deployment:** Railway backend responds at Railway URL, Vercel frontend calls Railway API without CORS errors
5. **Auth:** Unauthenticated requests return 401
6. **Scheduling:** APScheduler fires on configured schedule, new run created in Supabase
7. **Failure recovery:** Artificially fail a stage, confirm state is `{STAGE}_FAILED`, confirm Retry restores run
