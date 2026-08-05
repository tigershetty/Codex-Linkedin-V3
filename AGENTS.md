# Shetty's Desk — Audience Growth V4 Workspace

Audience, research, and publishing engine for Tiger Shetty's Shetty's Desk brand. LinkedIn is the
discovery surface, Substack is the depth and relationship surface, and the website is the durable
artifact and product surface.

## Start here

1. Read `infographic-setup/references/v4-audience-growth-operating-system.md`.
2. Choose the route: read infographic-setup/references/fast-post-loop-v1.md for an ordinary
   LinkedIn post, or read infographic-setup/references/creative-genome-recombination-engine-v1.md
   for a flagship.
3. Read `tiger-voice.md`, then `infographic-setup/AGENTS.md` and `infographic-setup/CLAUDE.md`.

The active order is:

```text
saved-post intelligence
  -> fast post loop for ordinary LinkedIn work
     OR full Creative Genome route for a declared flagship
  -> claim-proportionate support
  -> Tiger voice when required
  -> visual, caption, and optional artifact
  -> channel-specific publication
  -> atom-level transfer learning
```

V4 production is gated by the Creative Review Foundation. Before a new V4 post, run
`node scripts/validate-reference-review-foundation.mjs --require-complete` from
`infographic-setup/`. Captions and previews are retrieval signals, not visual review. The first
release after the gate passes is a calibration post; five-post cadence resumes only after its review.

## Repo map

| Path | Status | Purpose |
|---|---|---|
| `infographic-setup/` | **Active** | V4 intelligence, production, distribution, and measurement engine |
| `videos/` | **Active** | Post-specific motion projects after still approval |
| `tiger-voice.md` | **Active** | Voice DNA for all public writing |
| `ui-kit/` | Reference | Reusable interface and animation blocks |
| `docs/` | Reference | Historical design and automation material |
| `_archive/` | Archive | Retired applications and prior projects |

## V4 contract

- Treat every saved post as a positive creative signal. Never re-litigate whether it deserves use.
- Ordinary posts use the 75-minute Fast Post Loop: two to four saved references, three rough
  routes, a 25-minute select-or-kill point, and one active post card. Full retrieval, ten concepts,
  and three developed directions are reserved for flagships.
- Support each claim at the level it requires. Frameworks do not need fabricated outcome data;
  numerical, causal, company, and personal claims need traceable support.
- Never publish internal software fixtures as customer proof or a real outcome.
- Keep LinkedIn valuable on its own. Use Substack and the website only for meaningful added depth or utility.
- Preserve Tiger's voice. Never invent experience, belief, result, conversation, credential, or employer context.

## Cadence

- LinkedIn: five value-dense posts per week.
- LinkedIn commenting: 20-30 minutes of thoughtful manual commenting on publishing days.
- Substack: one flagship every two weeks and three Notes per week.
- Website: artifact-led, only when the destination adds real utility.

## Production lanes

- `/101`: plain-language decision distinctions, frameworks, references, and practical foundations.
- `/ai-for-sc`: role-specific AI workflows with real inputs and outputs, validation, and human ownership.

Neither lane receives a fixed weekly quota. Both draw on Creative Genome intelligence; only a
declared flagship enters the full Genome and Recombination route. Research depth follows the
selected claim mode.

## Active authorities

- Operating system: `infographic-setup/references/v4-audience-growth-operating-system.md`
- Fast production: `infographic-setup/references/fast-post-loop-v1.md`
- V3 repertoire: `infographic-setup/references/v3-creative-repertoire-v1.md` (historical source
  material, not a visual default)
- Creative Genome: `infographic-setup/references/creative-genome-recombination-engine-v1.md`
- Opportunity selection: `infographic-setup/references/creative-opportunity-selection.md`
- Creative production: `infographic-setup/references/creative-engine-v4-recombination.md`
- Visual workflow: `infographic-setup/references/visual-engine-v2.md`
- Provisional signature guardrail: `infographic-setup/references/creative-review/signature-system-v1.md`
- Voice gate: `infographic-setup/references/tiger-source-gate-v1.md`
- Motion: `infographic-setup/references/motion-engine-v1.md`
- Publish handoff: `infographic-setup/references/publish-resource-handoff-v1.md`
- Immutable LinkedIn audit: `infographic-setup/references/outputs/019fc389-0554-7a43-a8fa-07bd597be61d/linkedin-content-market-fit-audit-2026-08-02/`

Top-100 indexes and layout catalogs remain Creative Genome source material. Calendars and `/101`
or `/ai-for-sc` plans are candidate banks. Files under dated archive folders are not active authority.

## Global rules

- Check for existing files before creating new ones.
- Never delete files without explicit approval; move superseded material into a dated archive.
- Never install packages silently.
- Keep generated artifacts traceable to their selected reference shelf or flagship bundle, claim
  support, prompt, and review.
- For a standard image-led post, use an image-engine-native final. Never finish it by pasting HTML,
  SVG, dashboard cards, or title overlays over the rendered scene.
- Operating Studio and Cobalt Grid are historical reference material, not automatic visual defaults.
- Do not automate LinkedIn comments or publish without explicit approval.
- Preserve the active visual named by post-card.md once approved; do not silently treat an older
  visual.png as the selected post.

## Deployment

- Repository: `github.com/tigershetty/Codex-Linkedin-V3`.
- The former Vite/React web app is retired under `_archive/web-app/`.
- LinkedIn auto-posting remains on hold. Draft-post testing must be explicitly resumed by Tiger.
