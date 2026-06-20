-- ============================================================
-- Infographic Engine Web — Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- One row per pipeline run (one week + topic slug)
CREATE TABLE pipeline_runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week          TEXT NOT NULL,           -- e.g. '2026-W10'
  slug          TEXT NOT NULL,           -- e.g. 'hormuz-supply-chain-shock'
  state         TEXT NOT NULL DEFAULT 'IDLE',
  -- States: IDLE | SCOUT_RUNNING | CG1_PENDING | RESEARCH_RUNNING |
  --         MESSAGE_RUNNING | CG2_PENDING | CONTENT_RUNNING |
  --         PROMPT_RUNNING | IMAGE_RUNNING | DRAFT_READY |
  --         LINKEDIN_QUEUED | PUBLISHED | ANALYTICS_PENDING | COMPLETE |
  --         {STAGE}_FAILED
  selected_topic_index  INT,             -- CG1 pick (0-9)
  selected_hook_index   INT,             -- CG2 pick (0-9)
  error_message         TEXT,            -- set on _FAILED states
  linkedin_post_url     TEXT,
  published_at          TIMESTAMPTZ,
  user_id               TEXT DEFAULT 'tiger',  -- ready for multi-user Phase 3
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Markdown output of each pipeline stage
CREATE TABLE stage_outputs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id      UUID NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
  stage_name  TEXT NOT NULL,   -- scout|research|message|content|gemini_prompt|image
  output_md   TEXT,            -- full markdown content
  image_url   TEXT,            -- populated for image stage (Supabase Storage URL)
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(run_id, stage_name)   -- one output per stage per run
);

-- 10 topic candidates from Scout stage
CREATE TABLE topic_candidates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id              UUID NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
  position            INT NOT NULL,     -- 1-10
  slug                TEXT NOT NULL,
  title               TEXT NOT NULL,
  hook_candidate      TEXT NOT NULL,
  message_hypothesis  TEXT,
  why_this_week       TEXT,
  trend_type          TEXT,             -- 'trending' | 'evergreen'
  tier                INT,              -- 1 or 2
  is_shortlist        BOOLEAN DEFAULT FALSE,
  sources             TEXT,             -- comma-separated source names
  novelty_delta       TEXT
);

-- 10 hook options from Message stage
CREATE TABLE hook_candidates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id      UUID NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
  position    INT NOT NULL,    -- 1-10
  hook_text   TEXT NOT NULL
);

-- Post-publish analytics (replaces analytics-log.csv)
CREATE TABLE analytics_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id              UUID REFERENCES pipeline_runs(id),
  week                TEXT,            -- for imported historical data
  slug                TEXT,
  post_date           DATE,
  post_url            TEXT,
  impressions         INT,
  members_reached     INT,
  profile_viewers     INT,
  followers_gained    INT,
  reactions           INT,
  comments            INT,
  reposts             INT,
  saves               INT,
  sends               INT,
  engagement_rate     DECIMAL(10, 4),
  reach_efficiency    DECIMAL(10, 4),
  save_rate           DECIMAL(10, 4),
  follower_conversion DECIMAL(10, 4),
  composite_score     DECIMAL(10, 4),
  recorded_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule configuration (re-registered on backend startup)
CREATE TABLE schedule_config (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cron_expression TEXT NOT NULL DEFAULT '0 9 * * 1',  -- Monday 9am
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  timezone        TEXT NOT NULL DEFAULT 'UTC',
  last_run_at     TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default schedule
INSERT INTO schedule_config (cron_expression, enabled)
VALUES ('0 9 * * 1', TRUE);

-- ============================================================
-- Row Level Security (RLS) — REQUIRED for security
-- Without this, your Supabase anon key exposes all data
-- ============================================================

ALTER TABLE pipeline_runs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_outputs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hook_candidates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_log    ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_config  ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role (backend) can access all tables
-- The frontend uses the anon key — these policies block direct anon access
-- Frontend data goes through the FastAPI backend (service role key)

CREATE POLICY "Service role only" ON pipeline_runs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON stage_outputs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON topic_candidates
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON hook_candidates
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON analytics_log
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON schedule_config
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX idx_pipeline_runs_week  ON pipeline_runs(week);
CREATE INDEX idx_pipeline_runs_state ON pipeline_runs(state);
CREATE INDEX idx_stage_outputs_run   ON stage_outputs(run_id);
CREATE INDEX idx_analytics_week      ON analytics_log(week);
