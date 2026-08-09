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

The Creative Review Foundation controls when Top-100 material may be treated as high-confidence
forensic visual intelligence. Run
`node scripts/validate-reference-review-foundation.mjs --require-complete` from
`infographic-setup/` before declaring the foundation complete, restarting the V4 five-post cadence,
or using its unreviewed records as a calibration basis. Captions and previews are retrieval signals,
not visual review. The gate does **not** block an internal design lab or a post whose selected
references already carry separate evidence-bound review; it blocks false certainty about the wider
collection.

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
- Supply-chain scope control: `infographic-setup/references/supply-chain-opportunity-map-v1.md`
- Opportunity selection: `infographic-setup/references/creative-opportunity-selection.md`
- Creative production: `infographic-setup/references/creative-engine-v4-recombination.md`
- Visual workflow: `infographic-setup/references/visual-engine-v2.md`
- Signature authority: `infographic-setup/references/creative-review/signature-system-v3.md`
- Framework-led social visual route: `infographic-setup/references/v5-working-infographic-production-system.md`
- Working Infographic candidate gate: `infographic-setup/references/resource-candidate-card-v1.md`
- Working Infographic route development: `infographic-setup/references/creative-composition-packet-v1.md`
- Source-backed opportunity branches: `infographic-setup/references/creative-genome/supply-chain-knowledge-map-v1.json`
- Field Guide specialist route: `infographic-setup/references/v5-field-guide-notebook-production-system.md`
- Voice gate: `infographic-setup/references/tiger-source-gate-v1.md`
- Motion: `infographic-setup/references/motion-engine-v1.md` for picture-first work;
  `infographic-setup/references/motion-engine-v2-semantic-states.md` for Figma-native frameworks
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
- A selected high-density Visual Framework or Field Guide uses a deterministic Figma master as the
  actual LinkedIn visual; do not ask an image model to typeset dense material. Keep normal
  scene-led posts image-native.
- Do not start a high-density Working Infographic from a broad topic or a visual template. It first
  needs a `build_ready` Resource Candidate Card and a valid Creative Composition Packet with three
  non-isomorphic semantic routes. This is a reader-value and originality control, not a score or a
  restriction on lighter posts.
- Operating Studio and Cobalt Grid are historical reference material, not automatic visual defaults.
- Do not automate LinkedIn comments or publish without explicit approval.
- Preserve the active visual named by post-card.md once approved; do not silently treat an older
  visual.png as the selected post.

## Deployment

- Repository: `github.com/tigershetty/Codex-Linkedin-V3`.
- The former Vite/React web app is retired under `_archive/web-app/`.
- LinkedIn auto-posting remains on hold. Draft-post testing must be explicitly resumed by Tiger.
