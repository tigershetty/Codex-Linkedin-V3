# Shetty's Desk V4 — Operational Map

The active V4 system is Creative Genome first, recombination second, and claim-proportionate research
third. `/101` and `/ai-for-sc` are production lanes, not upstream strategy.

## Precedence

1. `references/v4-audience-growth-operating-system.md`
2. `references/creative-genome-recombination-engine-v1.md`
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
| Retrieve | 10-15 saved references selected by fit, not a quality score |
| Recombine | creative seed, ten concepts, three distinct visible direction tiles, and a forced selection |
| Select | reader, care statement, content mode, useful payoff, channel job, and claim contract |
| Support | only the research depth and Tiger source required by the planned claims |
| Produce | complementary caption, visual, and optional artifact |
| Publish | explicit approval and channel-specific handoff |
| Measure | 24-hour, Day-7, and Day-28 transfer learning |

## Production lanes

| | Supply Chain 101 | AI for Supply Chain |
|---|---|---|
| Job | make a useful distinction, framework, decision, or reference clear | make a role-specific AI workflow understandable and usable |
| Creative source | Creative Genome bundle | Creative Genome bundle |
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

## Creative brief contract

Every new major post needs:

- one primary reader and work moment;
- one care statement and one standalone LinkedIn payoff;
- a coherent attention, comprehension, utility, and bridge assembly;
- ten concepts before narrowing;
- at least three genuinely different directions;
- one selected content mode;
- a claim ledger with support appropriate to each claim;
- an anti-copy boundary;
- a reason for any Substack or website continuation.

## Visual contract

Shetty's Desk Operating Studio is the default brand authority. It makes a real work collision
concrete through a luminous operating scene, semantic colour, and a useful visual model. Cobalt
Grid is an explicit secondary editorial choice. The reference bundle contributes creative
mechanics, not another creator's look. One dominant object and one reading route beat a dense
internal model dump.

Choose the renderer after the creative direction:

- GPT Image 2 for illustration-led editorial composition;
- HTML/SVG for exact text, data, geometry, or interface control;
- spreadsheets, documents, or website UI when the artifact itself is the content;
- motion only when sequence, comparison, or change improves the argument.

Premium 3D/isometric treatment is one available family, not a universal flagship requirement.

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

Do not use the historical `composite_score` as a gate. Do not standardize a mechanism from one
outlier or kill it from one weak adaptation.

## Archived systems

The pre-Creative-Genome authorities are preserved under:

`references/_archive/pre-creative-genome-2026-08-02/`

They may supply historical lessons, but their score-first, optional-reference, fixed-calendar,
synthetic-default, or style-mandate instructions are inactive.
