# Shetty's Desk — LinkedIn-V2 Workspace

LinkedIn supply chain content engine for Tiger Shetty's "Shetty's Desk" brand.
Version-controlled for remote Codex access (web/mobile).

## Repo Map
| Path | Status | Purpose |
|---|---|---|
| `infographic-setup/` | **Active** | The content engine — `/101` + `/ai-for-sc` pipelines, topic plans, voice, data. Start here: `infographic-setup/AGENTS.md` and `infographic-setup/CLAUDE.md` |
| `videos/` | **Active** | Post-specific motion projects for the standard still + motion package. Use `infographic-setup/references/motion-engine-v1.md`; repeat the production system, not a fixed choreography. |
| `ui-kit/` | Reference | Reusable React blocks + animations salvaged from the retired web app |
| `docs/` | Reference | Design specs and automation plans (history) |
| `tiger-voice.md` | **Active** | Master Voice DNA — the authority for ALL written output |
| `voice-interview-plan.md` | Reference | How the Voice DNA was built |
| `test-linkedin-post.sh` | On hold | LinkedIn draft-post test (see below) |
| `_archive/` | Archive | `web-app/` (retired Vite/React + Python app), `eco-mobility/` (prior project) |

## The content engine (where the work happens)
Two active pipelines share one 7-month monthly theme calendar:
- **Supply Chain 101** (`/101`) — Posts 1 + 2 each week, plain-language concepts. Visual: **Visual Engine v2** — ChatGPT / GPT Image 2 is the primary creative renderer; HTML/code-render (`infographic-setup/renderer/`) is the backup and comparison lane. After still approval, **Motion Engine v1** produces the layout-adaptive GIF/MP4 companion unless the motion eligibility gate records a still-only exception.
- **AI for Supply Chain** (`/ai-for-sc`) — Posts 3 + 4 each week, role-based AI use cases. Visual: **Visual Engine v2** — GPT Image 2 first for editorial infographic output, with HTML/code-render retained for exact-data controls and backup PNGs. After still approval, **Motion Engine v1** produces the layout-adaptive GIF/MP4 companion unless the motion eligibility gate records a still-only exception.
- **Deep Dive** — data-heavy research pipeline, **archived** (`infographic-setup/skills-archive/deep-dive/`).

Plans (single sources of truth):
- Master calendar: `infographic-setup/references/master-calendar.md`
- 101 topics: `infographic-setup/references/101-plan.md`
- AI for SC use cases: `infographic-setup/references/ai-for-sc-plan-v2.md`
- Visual workflow: `infographic-setup/references/visual-engine-v2.md`
- Top-100 reference intelligence: `infographic-setup/references/top100-reference-intelligence.md`
- Top-100 caption index: `infographic-setup/references/top100-caption-index.md`
- Calendar reference map: `infographic-setup/references/calendar-reference-adaptation-map-v1.md`
- Creative QA engine: `infographic-setup/references/creative-engine-v3-lean.md`
- Motion workflow: `infographic-setup/references/motion-engine-v1.md`

## Voice DNA
- **File:** `tiger-voice.md` (workspace root) — definitive voice reference across all pipelines.
- **Interview plan:** `voice-interview-plan.md`. Applies to all writing: captions, posts, copy, emails.

## Gemini — Two Separate Uses
1. **Infographic Gem** ("Shetty's Desk — Infographic Engine") — for the archived Deep Dive pipeline. Requires `infographic-setup/references/brand-anchor-v1.webp` upload each session.
2. **General Gemini** — research, image generation, ad-hoc tasks.

## Global Workflow Rules
- Always check for existing files before creating new ones.
- Never delete files without explicit approval.
- Never install packages silently — flag before adding dependencies.

## Deployment
- **Repo:** `github.com/tigershetty/Codex-Linkedin-V3` — version control + remote Codex access.
- **Web app retired** — the Vite/React app and its Vercel/Netlify deploys are no longer maintained (source archived under `_archive/web-app/`). If those deploys are still connected, disconnect them in their dashboards.

## LinkedIn Auto-Posting — On Hold
- **Status:** paused — resume when ready to test.
- **Done:** `.env` holds `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_URN` (confirmed working).
- **Next:** posting script + draft-post test (`lifecycleState: DRAFT`) — deletable from LinkedIn Creator tools.
- **Note:** LinkedIn API has no scheduled posts — draft mode is the clean test path.
