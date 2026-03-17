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

## Notes
- All active content work runs from `infographic-content-engine-v1/`
- Web/product work runs from `infographic-engine-web/` and `Frontend/`
