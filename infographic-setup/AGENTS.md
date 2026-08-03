# Infographic Setup — Active V4 Instructions

This folder is the active Shetty's Desk creative-intelligence and content-production engine.

## Session start

1. Read `references/v4-audience-growth-operating-system.md`.
2. Read `references/creative-genome-recombination-engine-v1.md`.
3. Read `../tiger-voice.md` and `references/tiger-source-gate-v1.md`.
4. Inspect the current week and active slug in `data/`.
5. Identify the current stage: signal scan, retrieval, recombination, support, production,
   distribution, or measurement.
6. Use `references/creative-opportunity-selection.md` before moving a direction into production.
7. Use `references/creative-engine-v4-recombination.md` and `references/visual-engine-v2.md` before
   building or judging a visual.

## Mandatory order for new major content

```text
reference-query.json
  -> 10-15 saved reference candidates
  -> reference-bundle.json
  -> creative seed + 10 concepts
  -> at least 3 distinct visible direction tiles
  -> forced select / hybridise / kill gate
  -> selected content mode and claim contract
  -> proportionate research and Tiger source
  -> complementary visual + caption + optional artifact
  -> publication and transfer learning
```

Use:

```bash
node scripts/build-creative-genome.mjs
node scripts/retrieve-creative-references.mjs \
  --query data/{week}/{slug}/reference-query.json \
  --output data/{week}/{slug}/reference-candidates.json
node scripts/compile-recombination-brief.mjs \
  --candidates data/{week}/{slug}/reference-candidates.json \
  --output data/{week}/{slug}/recombination-brief.md
node scripts/validate-reference-bundle.mjs \
  --input data/{week}/{slug}/reference-bundle.json
```

All saved posts are positive creative signals. Do not add a reference-validity gate, a numeric topic
threshold, or a record justifying why a particular Top-100 source was skipped. Top-100 local images
and caption indexes are richer inputs to the larger saved-post genome.

## Claim support

Evidence burden follows the claim:

- frameworks, checklists, and workflows: correct logic, attribution, scope, and boundary;
- Tiger recommendations: approved source and clear judgment framing;
- numbers and formulas: source, units, assumptions, and reproducibility;
- company outcomes: documented case and case-specific limitation;
- causal or comparative language: evidence capable of supporting that wording;
- current AI/tool claims: current official sources and a real run or documented deployment when an
  outcome is shown;
- simulation: explicit and labelled, never a default substitute for proof.

Internal fixtures may test software. They cannot become public proof or a public numeric hook.

## Current production system

- Visual creative: `references/creative-engine-v4-recombination.md`.
- Renderer choice: GPT Image 2, HTML/SVG, spreadsheet, document, or another surface according to the
  selected direction and exactness needed.
- Default brand authority: `references/brand-kits/shettys-desk-operating-studio/FRAME.md`.
- Cobalt Grid is a deliberate secondary editorial expression, never the unexamined default.
- Visual review: `templates/visual-output-review-template.md`.
- Motion after still approval: `references/motion-engine-v1.md`.
- Publish/resource handoff: `references/publish-resource-handoff-v1.md`.

Treat 3D/isometric, flat illustration, diagram, chart, photographed artifact, typographic reference,
and interactive tool as equal creative families. Do not make renderer or style choice before the
argument is selected.

## Cadence

- Five standalone-value LinkedIn posts per week.
- 20-30 minutes of thoughtful manual LinkedIn comments on publishing days.
- One Substack flagship every two weeks and three Notes per week.
- Website output only when it adds material utility.

## Production lanes

- `/101`: accessible supply-chain explanations, decisions, frameworks, and references.
- `/ai-for-sc`: role-specific AI workflows with visible input, output, validation, and ownership.

The calendars and lane plans are candidate banks. Neither lane receives an automatic quota and
neither bypasses creative retrieval.

## Package files

New major packages should contain:

```text
reference-query.json
reference-candidates.json
reference-bundle.json
recombination-brief.md
creative-seed.md
directions/                     # three rough, visibly distinct directions before final production
content-brief-v2.md
research-brief.md              # only when the claim route requires it
tiger-source.md                # when Tiger authority is used
creative-brief-lite.md
caption or copy file
visual.png
visual-output-review.md
analytics.md
```

## Rules

- Never invent facts, numbers, outcomes, personal authority, or customer proof.
- Never copy a source creator's wording, subject, branding, artwork, or distinctive expression.
- Keep one reader promise and one primary reading route.
- Ensure the problem or promise is visible in 3 seconds, the idea in 10, and useful action in 30.
- Make caption and visual complementary.
- Run `templates/creative-direction-sprint-template.md` before full production. Do not use a
  calculator, research dossier, or polished caption as a substitute for a compelling public story.
- Use exact owned and official logos; do not use third-party icon geometry to rebuild the brand.
- Never infer caption approval from visual approval.
- Never delete superseded files; move them to a dated archive with a reason.
