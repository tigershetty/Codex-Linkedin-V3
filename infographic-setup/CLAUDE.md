# Shetty's Desk V4 — Operational Map

The active V4 system has two deliberate routes: the Fast Post Loop for ordinary LinkedIn work, and
the full Creative Genome for declared flagships. Claim-proportionate research follows the route,
not the other way around. `/101` and `/ai-for-sc` are production lanes, not upstream strategy.

## Precedence

1. `references/v4-audience-growth-operating-system.md`
2. `references/fast-post-loop-v1.md` for standard LinkedIn work, or
   `references/creative-genome-recombination-engine-v1.md` for a declared flagship
3. `references/creative-opportunity-selection.md`
4. `../tiger-voice.md` and `references/tiger-source-gate-v1.md`
5. `references/creative-engine-v4-recombination.md`
6. downstream visual, motion, resource, and publish specifications

Calendars, topic plans, creator benchmarks, Top-100 indexes, and layout catalogs supply candidates or
source material. Dated archive folders never override active files.

## Stage map

| Stage | Required output |
|---|---|
| Learn | matched-age Tiger outcomes linked to the bundle and atoms used |
| Scan | audience, saved-pattern, evidence, Substack, and timely opportunities |
| Route | choose standard Fast Post Loop or declared flagship before research starts |
| Retrieve | standard: two to four saved references from the current shelf; flagship: 10-15 by fit |
| Recombine | standard: three rough routes and a minute-25 select-or-kill; flagship: creative seed, ten concepts, three visible directions |
| Select | reader, care statement, content mode, useful payoff, channel job, and claim contract |
| Support | only the research depth and Tiger source required by the planned claims |
| Produce | complementary caption, visual, and optional artifact |
| Publish | explicit approval and channel-specific handoff |
| Measure | 24-hour, Day-7, and Day-28 transfer learning |

## Production lanes

| | Supply Chain 101 | AI for Supply Chain |
|---|---|---|
| Job | make a useful distinction, framework, decision, or reference clear | make a role-specific AI workflow understandable and usable |
| Creative source | V3 repertoire and saved-reference shelf; full bundle only for a flagship | same |
| Research | routed by claim mode | current tool facts plus support required by the domain and outcome claims |
| Voice | Tiger source only when personal judgment or authority is used | same |
| Output | caption + approved still; artifact or motion when useful | caption + approved still + resource decision; artifact or motion when useful |

## Core commands

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
node scripts/build-visual-package.mjs data/{week}/{slug}
node scripts/audit-visual-package.mjs data/{week}/{slug}
```

## Data contract

The immutable content-market-fit audit is:

`references/outputs/019fc389-0554-7a43-a8fa-07bd597be61d/linkedin-content-market-fit-audit-2026-08-02/`

The active generated genome is declared by:

`references/creative-genome/active-manifest.json`

Every saved post keeps `positive_creative_signal=true`. Annotation and visual-review status describe
inspection depth only. Tiger outcomes measure transfer, not whether the source deserved to be saved.

## Standard post card

An ordinary LinkedIn post needs only:

- one primary reader and work moment;
- opening tension, visible proof, and useful keep;
- two to four saved references plus anti-copy boundaries;
- three rough routes and a minute-25 select-or-kill;
- one active selected visual (scene-native or Figma-native framework) and caption path;
- a claim boundary and five-reader review.

Use the full Creative Genome contract only for a declared flagship: fresh retrieval, ten concepts,
three developed directions, full assembly, claim ledger, and reason for a Substack or website
continuation.

## Visual contract

`references/creative-review/signature-system-v3.md` is the active guardrail. A framework-led
LinkedIn post may use `references/v5-working-infographic-production-system.md` and a deterministic
Figma visual as its actual final social asset when exact hierarchy and diagram geometry are the
reader value. Field Guide Notebook remains a specialist durable-reference family; use
`references/v5-field-guide-notebook-production-system.md` only when its compact working-reference
contract is the right answer. An editorial framework, map, real material, illustration, spatial
scene, data reference, typographic treatment, or motion sequence must still earn its place through
the reader tension and visual mechanism. Operating Studio and Cobalt Grid remain historical
reference material. The reference bundle contributes mechanisms, not another creator's look.

Reference availability and forensic craft review are different controls. Do not call a record
manually inspected, or use it as high-confidence visual intelligence, without asset-bound review
evidence. A passing availability gate is not a substitute for that evidence.

A selected Field Guide records its specialist admission, visual/caption choreography, and package
manifest alongside the spec. The manifest is the canonical source of record for a linked Figma node
and exact local export/hash; other package files may refer to it but must not introduce or contradict
that metadata. Recorded Figma metadata is not source verification. Run
`validate-field-guide-package.mjs` for the semantic contract and
`audit-field-guide-package.mjs` for package closure. A draft may remain incomplete; a ready Field
Guide cannot.

For a standard image-led post, use the image engine as one coherent final composition. Do not finish
it with HTML, SVG, dashboard, logo, or title overlays.

Choose a separate exact artifact only when precision is the actual reader value:

- image engine for illustration-led editorial composition;
- HTML/SVG for an independent exact worksheet, reference, data view, or interface;
- spreadsheets, documents, or website UI when the artifact itself is the content;
- motion only when sequence, comparison, or change improves the argument.

Premium 3D/isometric treatment is one available family, not a universal flagship requirement.

For a high-density Working Infographic, do not begin with a topic label, a preset layout, or Figma.
First validate a `resource-candidate-card.json` against
`references/resource-candidate-card-v1.md`; then validate a `creative-composition-packet.json`
against `references/creative-composition-packet-v1.md`. The packet must assign Pierri information
structure, Top-100 attention/utility, and caption mechanics distinct roles and develop three
non-isomorphic spatial routes before one route is selected. This is not required for a lighter
Fast Post or a timely observation.

## Claim contract

- Do not demand a company case for a correctly attributed framework.
- Do not publish a descriptive number without source, date, unit, scope, and limitation.
- Do not publish a calculated result without traceable inputs, method, assumptions, and reproduction.
- Do not generalize a named company case beyond its evidence.
- Do not use comparative or causal wording beyond the research design.
- Do not present internal fixtures, demo buttons, or validation screenshots as customer proof.
- Do not invent Tiger experience, judgment, results, or credentials.

## Channel contract

- LinkedIn must deliver the promised value without requiring a click.
- Substack must add depth, not repeat the caption.
- The website must add utility, not expose the internal audit model as the product.
- Direct resources remain no-email and no-account unless Tiger explicitly changes that policy.
- LinkedIn comments remain manual and thoughtful.

## Measurement contract

Record channel metrics separately and link them to:

- `creative_bundle_id`;
- `genome_reference_ids`;
- `creative_element_ids`;
- `content_mode` and `claim_mode`;
- `artifact_type`;
- `transfer_result`, `element_transfer`, and next adaptation.

For high-reach posts, record a small audience-relevance sample of visible new followers and
engagers. It is a diagnostic only: reach remains the early growth objective and the sample may not
automatically block a topic or format.

Do not use the historical `composite_score` as a gate. Do not standardize a mechanism from one
outlier or kill it from one weak adaptation.

## Archived systems

The pre-Creative-Genome authorities are preserved under:

`references/_archive/pre-creative-genome-2026-08-02/`

They may supply historical lessons, but their score-first, optional-reference, fixed-calendar,
synthetic-default, or style-mandate instructions are inactive.
