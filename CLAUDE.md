# Shetty's Desk — LinkedIn-V2 Workspace

## Projects
| Project | Entry point | Status | Purpose |
|---|---|---|---|
| `infographic-setup/` | `/infographic` | Active | Weekly LinkedIn infographic pipeline for Shetty's Desk |
| `infographic-engine-web/` | `npm run dev` | In development | Web app version of the infographic engine (Vercel deployment) |
| `Eco Mobility/` | — | Reference only | Prior project, reference use only |

## Folder Map
```
LinkedIn-V2/
  infographic-setup/           ← active pipeline (skills, data, references, voice)
  infographic-engine-web/      ← web product build (frontend + backend)
  Eco Mobility/                ← reference
  .claude/                     ← settings
  tiger-voice.md               ← master voice DNA
  voice-interview-plan.md      ← voice interview reference
```

## Visual Tooling by Flow (updated 2026-06-16)
- **Supply Chain 101** → **ChatGPT (GPT Image 2)** prompt. Attach `brand-anchor-v1.webp` in ChatGPT for style. (Was Gemini; only the image tool changed — the rest of the `/101` flow is unchanged.)
- **AI for Supply Chain** → **code-render** (`infographic-setup/renderer/`): deterministic HTML→PNG/GIF/MP4 from a render brief. No AI-image prompt. (Was a Gemini prompt; now built and rendered in code.)
- **Deep Dive (paused)** → **Gemini Infographic Gem** ("Shetty's Desk — Infographic Engine") at gemini.google.com; requires `brand-anchor-v1.webp` upload each session.
- **General Gemini** — research and ad-hoc tasks outside the infographic pipeline.

## Global Workflow Rules
- Always check for existing files before creating new ones
- Never delete files without explicit approval
- Never install packages silently — flag before adding dependencies
- Brand anchor image lives at: `infographic-setup/references/brand-anchor-v1.webp`

## Voice DNA
- **File:** `tiger-voice.md` (workspace root)
- **Version:** 1.0 (All 5 sessions complete)
- **Interview plan:** `voice-interview-plan.md` (workspace root)
- **Status:** Complete — definitive voice reference across all projects
- **Applies to:** All writing output across all projects — captions, posts, copy, emails, presentations
- **Method:** Ruben Hassid's Taste Interviewer — 100 questions across 7 categories

## Content Types — Three Branches

| Branch | Pipeline | When to Use | Voice Register |
|---|---|---|---|
| **Deep Dive** | `/scout → /research → /message → /content → /gemini-prompt` | Data-heavy, case-study infographics for SC practitioners | Technical, industry-grade, numbers-heavy |
| **Supply Chain 101** | `/101 [topic-number]` (single step) | Weekly educational series, plain-language SC concepts | Simplified, relatable, no jargon |
| **AI for Supply Chain** | `/ai-for-sc [week]` (two posts per week) | AI workflows for specific SC roles — procurement, planning, logistics | Role-specific, tool-specific, copy-paste ready |

### Key Differences
- **Deep Dive** uses full research pipeline with evidence ledger, 12+ sources, CG2 hook selection gate
- **Supply Chain 101** skips research — topics pre-defined in `infographic-setup/references/101-plan.md` (W21–W52)
- **AI for Supply Chain** skips research — use cases pre-defined in `infographic-setup/references/ai-for-sc-plan-v2.md` (W21–W52)
- All three share the same voice file (`tiger-voice.md`), hook taxonomy, and `data/{week}/` folder structure

### Master Calendar
- Both series (101 and AI for SC) run on the same 7-month monthly theme calendar
- Calendar overview: `infographic-setup/references/master-calendar.md`
- 101 full plan: `infographic-setup/references/101-plan.md`
- AI for SC full plan: `infographic-setup/references/ai-for-sc-plan-v2.md`

### Series Trackers
- 101 series: `infographic-setup/data/101-series-tracker.md`
- AI for SC series: `infographic-setup/data/ai-for-sc-series-tracker.md`

## Deployment
- **Repo:** `github.com/tigershetty/linkedin-v2`
- **Vercel:** Root directory set to `infographic-engine-web/frontend` (Vite + React app)
- **Purpose:** Version control + remote Claude Code access + web app deployment

## LinkedIn Auto-Posting — On Hold
- **Status:** Paused — resume when ready to test
- **What's done:** `.env` created with `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_URN` (`k7d8ogGaBT`) confirmed working
- **Next step:** Write posting script and do a draft post test (`lifecycleState: DRAFT`) — no public exposure, deletable from LinkedIn Creator tools
- **Note:** LinkedIn API does not support scheduled posts — draft mode is the clean test approach
