# Claude Nano — Workspace

## Projects
| Project | Entry point | Status | Purpose |
|---|---|---|---|
| `infographic-content-engine-v1/` | `/infographic` | Active | Weekly LinkedIn infographic pipeline for Shetty's Desk |
| `infographic-video-engine/` | `npm run dev` | Active | Remotion video compositions for Shetty's Desk |
| `infographic-engine-web/` | — | In development | Web app version of the infographic engine |
| `Frontend/` | — | In development | Frontend work (Vercel/Supabase) |
| `Eco Mobility/` | — | Reference only | Prior project, reference use only |
| `Trial - Outputs/` | — | Archive | Past output experiments |

## Folder Map
```
Claude Nano /
  infographic-content-engine-v1/   ← active pipeline (skills, data, references)
  infographic-video-engine/         ← Remotion video compositions
  infographic-engine-web/           ← web product build
  Frontend/                         ← frontend projects
  Eco Mobility/                     ← reference
  Trial - Outputs/                  ← archive
  .claude/                          ← firecrawl cache, settings
  .firecrawl/                       ← gemini-research cache
```

## Gemini — Two Separate Uses
1. **Infographic Gem** ("Shetty's Desk — Infographic Engine") — structured pipeline use, configured at gemini.google.com. Requires `brand-anchor-v1.webp` upload each session.
2. **General Gemini** — research, image generation, and ad-hoc tasks outside the infographic pipeline.

## Global Workflow Rules
- Always check for existing files before creating new ones
- Never delete files without explicit approval
- Never install packages silently — flag before adding dependencies
- Brand anchor image lives at: `infographic-content-engine-v1/references/brand-anchor-v1.webp`

## Voice DNA
- **File:** `tiger-voice.md` (workspace root)
- **Version:** 0.2 (Sessions 1-4 partial complete)
- **Interview plan:** `voice-interview-plan.md` (workspace root)
- **Status:** Session 5 remaining (Red Flags, Writing Mechanics, Aesthetic Crimes) → then compile to v1.0
- **Applies to:** All writing output across all projects — captions, posts, copy, emails, presentations
- **Method:** Ruben Hassid's Taste Interviewer — 100 questions across 7 categories

## Content Types — Three Branches

| Branch | Pipeline | When to Use | Voice Register |
|---|---|---|---|
| **Deep Dive** | `/scout → /research → /message → /content → /gemini-prompt` | Data-heavy, case-study infographics for SC practitioners | Technical, industry-grade, numbers-heavy |
| **Supply Chain 101** | `/101 [topic]` (single step — hooks + caption + Gemini prompt) | Weekly educational series, plain-language SC concepts | Simplified, relatable, no jargon |
| **AI for Supply Chain** | `/ai-for-sc` | AI applications in supply chain operations | Mix — technical on AI, accessible on SC |

### Key Differences
- **Deep Dive** uses full research pipeline with evidence ledger, 12+ sources, CG2 hook selection gate
- **Supply Chain 101** skips research — topics come from `shettys-desk-90-day-plan-v2.docx.md`, no CG2 gate, generate all hooks + caption in one step
- **AI for Supply Chain** is the newest branch, still being defined
- All three share the same voice file (`tiger-voice.md`), hook taxonomy, and `data/{week}/` folder structure

### Series Tracker
- 101 series progress tracked in `infographic-content-engine-v1/data/101-series-tracker.md`
- 90-day topic plan: `shettys-desk-90-day-plan-v2.docx.md` (workspace root)

## Deployment
- **Repo:** `github.com/tigershetty/Linkedin-content-engine-Info`
- **Vercel:** Root directory set to `infographic-engine-web/frontend` (Vite + React app)
- **Purpose:** Version control + iOS access via Claude Code web + web app deployment

## Notes
- All active content work runs from `infographic-content-engine-v1/`
- Web/product work runs from `infographic-engine-web/` and `Frontend/`
