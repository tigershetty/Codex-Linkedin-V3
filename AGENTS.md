# Shetty's Desk — Audience Growth V4 Workspace

Audience, research, and publishing engine for Tiger Shetty's "Shetty's Desk" brand.
LinkedIn is the discovery surface, Substack is the depth and relationship surface, and
the website is the durable artifact and product surface. Version-controlled for remote
Codex access (web/mobile).

## Repo Map
| Path | Status | Purpose |
|---|---|---|
| `infographic-setup/` | **Active** | The V4 audience-growth engine plus the `/101` and `/ai-for-sc` production lanes. Start with `infographic-setup/references/v4-audience-growth-operating-system.md`, then read `infographic-setup/AGENTS.md` and `infographic-setup/CLAUDE.md`. |
| `videos/` | **Active** | Post-specific motion projects for the standard still + motion package. Use `infographic-setup/references/motion-engine-v1.md`; repeat the production system, not a fixed choreography. |
| `ui-kit/` | Reference | Reusable React blocks + animations salvaged from the retired web app |
| `docs/` | Reference | Design specs and automation plans (history) |
| `tiger-voice.md` | **Active** | Master Voice DNA — the authority for ALL written output |
| `voice-interview-plan.md` | Reference | How the Voice DNA was built |
| `test-linkedin-post.sh` | On hold | LinkedIn draft-post test (see below) |
| `_archive/` | Archive | `web-app/` (retired Vite/React + Python app), `eco-mobility/` (prior project) |

## The audience-growth engine (where the work happens)

The canonical upstream system is `infographic-setup/references/v4-audience-growth-operating-system.md`.
It selects audience problems, evidence, artifacts, channel roles, and experiments before a
production lane is chosen.

The six-week V4 pilot uses:

- **LinkedIn:** five value-dense posts per week plus 20–30 minutes of thoughtful manual commenting on publishing days.
- **Substack:** one flagship issue every two weeks plus three Notes per week.
- **Website:** artifact-led publication when a calculator, workbook, dashboard, guide, decision board, or validated workflow adds real utility.

Two production lanes remain active, but neither receives an automatic weekly quota:

- **Supply Chain 101** (`/101`) — plain-language decision distinctions and practical foundations. Visual: **Visual Engine v2** — ChatGPT / GPT Image 2 is the primary creative renderer; HTML/code-render (`infographic-setup/renderer/`) is the backup and comparison lane. After still approval, **Motion Engine v1** produces the layout-adaptive GIF/MP4 companion unless the motion eligibility gate records a still-only exception.
- **AI for Supply Chain** (`/ai-for-sc`) — role-specific AI workflows with explicit inputs, artifacts, validation, and human ownership. Visual: **Visual Engine v2** — GPT Image 2 first for editorial infographic output, with HTML/code-render retained for exact-data controls and backup PNGs. After still approval, **Motion Engine v1** produces the layout-adaptive GIF/MP4 companion unless the motion eligibility gate records a still-only exception.
- **Final publish stage** — after explicit still and caption approval, use `infographic-setup/references/publish-resource-handoff-v1.md`. AI-for-SC posts also pass a resource eligibility gate; qualified packs are direct-download, no-email resources with a compact branded field guide, safe sample run, completed outputs, and validation.
- **Deep Dive** — data-heavy research pipeline, **archived** (`infographic-setup/skills-archive/deep-dive/`).

Canonical operating system and supporting plans:
- V4 operating system: `infographic-setup/references/v4-audience-growth-operating-system.md`
- Master calendar: `infographic-setup/references/master-calendar.md`
- 101 topics: `infographic-setup/references/101-plan.md`
- AI for SC use cases: `infographic-setup/references/ai-for-sc-plan-v2.md`
- Visual workflow: `infographic-setup/references/visual-engine-v2.md`
- Top-100 reference intelligence: `infographic-setup/references/top100-reference-intelligence.md`
- Top-100 caption index: `infographic-setup/references/top100-caption-index.md`
- Calendar reference map: `infographic-setup/references/calendar-reference-adaptation-map-v1.md`
- Creative QA engine: `infographic-setup/references/creative-engine-v3-lean.md`
- AI execution surfaces: `infographic-setup/references/ai-work-surfaces-benchmark-2026-07.md`
- AI education workflow: `infographic-setup/references/ai-creator-education-growth-playbook.md`
- LinkedIn creator benchmark: `infographic-setup/references/linkedin-creator-benchmark-50-2026.md`
- Motion workflow: `infographic-setup/references/motion-engine-v1.md`
- Publish/resource handoff: `infographic-setup/references/publish-resource-handoff-v1.md`
- Publish asset specification: `infographic-setup/references/publish-asset-spec-v1.md`

## Voice DNA
- **File:** `tiger-voice.md` (workspace root) — definitive voice reference across all pipelines.
- **Interview plan:** `voice-interview-plan.md`. Applies to all writing: captions, posts, copy, emails.
- **V4 source gate:** use `infographic-setup/references/tiger-source-gate-v1.md`. Research may find and structure the idea, but no flagship caption or Substack issue is final until Tiger supplies or approves the stance, failure boundary, first check, human owner, and uncertainty. Never invent a personal anecdote, result, conversation, or belief.

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
