# Shetty's Desk — LinkedIn-V2 Workspace

LinkedIn supply chain content engine for Tiger Shetty's "Shetty's Desk" brand.
Version-controlled for remote Claude Code access (web/mobile).

## Repo Map
| Path | Status | Purpose |
|---|---|---|
| `infographic-setup/` | **Active** | The content engine — `/101` + `/ai-for-sc` pipelines, topic plans, voice, data. Start here: `infographic-setup/CLAUDE.md` |
| `ui-kit/` | Reference | Reusable React blocks + animations salvaged from the retired web app |
| `docs/` | Reference | Design specs and automation plans (history) |
| `tiger-voice.md` | **Active** | Master Voice DNA — the authority for ALL written output |
| `voice-interview-plan.md` | Reference | How the Voice DNA was built |
| `test-linkedin-post.sh` | On hold | LinkedIn draft-post test (see below) |
| `_archive/` | Archive | `web-app/` (retired Vite/React + Python app), `eco-mobility/` (prior project) |

## The content engine (where the work happens)
Two active pipelines share one 7-month monthly theme calendar:
- **Supply Chain 101** (`/101`) — Posts 1 + 2 each week, plain-language concepts. Visual: **ChatGPT (GPT Image 2)**.
- **AI for Supply Chain** (`/ai-for-sc`) — Posts 3 + 4 each week, role-based AI use cases. Visual: **code-render** (`infographic-setup/renderer/`, HTML→PNG/GIF/MP4).
- **Deep Dive** (`/infographic`) — data-heavy research pipeline, **paused**. Visual: Gemini Gem.

Plans (single sources of truth):
- Master calendar: `infographic-setup/references/master-calendar.md`
- 101 topics: `infographic-setup/references/101-plan.md`
- AI for SC use cases: `infographic-setup/references/ai-for-sc-plan-v2.md`

## Voice DNA
- **File:** `tiger-voice.md` (workspace root) — definitive voice reference across all pipelines.
- **Interview plan:** `voice-interview-plan.md`. Applies to all writing: captions, posts, copy, emails.

## Gemini — Two Separate Uses
1. **Infographic Gem** ("Shetty's Desk — Infographic Engine") — Deep Dive only (paused). Requires `infographic-setup/references/brand-anchor-v1.webp` upload each session.
2. **General Gemini** — research, image generation, ad-hoc tasks.

## Global Workflow Rules
- Always check for existing files before creating new ones.
- Never delete files without explicit approval.
- Never install packages silently — flag before adding dependencies.

## Deployment
- **Repo:** `github.com/tigershetty/linkedin-v2` — version control + remote Claude Code access.
- **Web app retired** — the Vite/React app and its Vercel/Netlify deploys are no longer maintained (source archived under `_archive/web-app/`). If those deploys are still connected, disconnect them in their dashboards.

## LinkedIn Auto-Posting — On Hold
- **Status:** paused — resume when ready to test.
- **Done:** `.env` holds `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_URN` (confirmed working).
- **Next:** posting script + draft-post test (`lifecycleState: DRAFT`) — deletable from LinkedIn Creator tools.
- **Note:** LinkedIn API has no scheduled posts — draft mode is the clean test path.
