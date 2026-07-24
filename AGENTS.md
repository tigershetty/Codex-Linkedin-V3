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
- **Supply Chain 101** (`/101`) — The calendar proposes the first two weekly candidates, but `content-demand-proof-gate-v1.md` decides what earns production. Visual: **Visual Engine v2** — ChatGPT / GPT Image 2 is the primary creative renderer; HTML/code-render (`infographic-setup/renderer/`) is the backup and comparison lane.
- **AI for Supply Chain** (`/ai-for-sc`) — The calendar proposes role-based AI candidates. GPT Image 2 leads editorial infographic output, with HTML/code-render retained for exact-data controls. Current capability claims require official product sources and a documented real input/output/control story.
- **Final publish stage** — prove demand, approve the still + writing + motion post package, then score and build a resource when observed demand or strategic need warrants it. Use `infographic-setup/references/publish-resource-handoff-v2.md`.
- **Deep Dive** — data-heavy research pipeline, **archived** (`infographic-setup/skills-archive/deep-dive/`).

Plans (single sources of truth):
- Master calendar: `infographic-setup/references/master-calendar.md`
- 101 topics: `infographic-setup/references/101-plan.md`
- AI for SC use cases: `infographic-setup/references/ai-for-sc-plan-v2.md`
- Visual workflow: `infographic-setup/references/visual-engine-v2.md`
- Top-100 reference intelligence: `infographic-setup/references/top100-reference-intelligence.md`
- Top-100 creator attribution: `infographic-setup/references/top100-creator-attribution-and-audit-2026-07.md`
- Top-100 caption index: `infographic-setup/references/top100-caption-index.md`
- Demand-proof gate: `infographic-setup/references/content-demand-proof-gate-v1.md`
- Engagement reset audit: `infographic-setup/references/shettys-desk-engagement-reset-audit-2026-07.md`
- Calendar reference map: `infographic-setup/references/calendar-reference-adaptation-map-v1.md`
- Creative QA engine: `infographic-setup/references/creative-engine-v3-lean.md`
- AI execution surfaces: `infographic-setup/references/ai-work-surfaces-benchmark-2026-07.md`
- AI education workflow: `infographic-setup/references/ai-creator-education-growth-playbook.md`
- LinkedIn creator benchmark: `infographic-setup/references/linkedin-creator-benchmark-50-2026.md`
- Motion workflow: `infographic-setup/references/motion-engine-v1.md`
- Render-first workflow: `infographic-setup/references/render-first-improve-second-v1.md`
- Publish/resource handoff: `infographic-setup/references/publish-resource-handoff-v2.md`
- Resource package audit: `infographic-setup/scripts/audit-resource-package.mjs`
- Publish asset specification: `infographic-setup/references/publish-asset-spec-v1.md`

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
- Every new post must promote the exact same 1080 x 1350 pixels to `visual.png` and `visual-linkedin.png`; both stay below 5 MB and must be byte-identical. Keep model-native renders under descriptive candidate filenames. Use the non-cropping fit treatment only for legacy recovery.

## Deployment
- **Repo:** `github.com/tigershetty/Codex-Linkedin-V3` — version control + remote Codex access.
- **Web app retired** — the Vite/React app and its Vercel/Netlify deploys are no longer maintained (source archived under `_archive/web-app/`). If those deploys are still connected, disconnect them in their dashboards.

## LinkedIn Auto-Posting — On Hold
- **Status:** paused — resume when ready to test.
- **Done:** `.env` holds `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_URN` (confirmed working).
- **Next:** posting script + draft-post test (`lifecycleState: DRAFT`) — deletable from LinkedIn Creator tools.
- **Note:** LinkedIn API has no scheduled posts — draft mode is the clean test path.
