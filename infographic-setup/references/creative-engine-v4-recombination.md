# Creative Engine v4 — Recombination-Led Production

**Date:** 2026-08-02
**Status:** Active production and QA layer
**Upstream authority:** `creative-genome-recombination-engine-v1.md`

## Job

Turn a selected Creative Genome assembly into one clear, original, mobile-readable public asset.
The engine does not choose the topic and does not revalidate the saved references.

## Required inputs

- approved `reference-bundle.json`;
- completed `recombination-brief.md` with ten concepts and three developed directions;
- `content-brief-v2.md` with reader, content mode, claim contract, and channel job;
- claim support appropriate to the statements being made;
- Tiger source note when personal judgment or first-person authority is used;
- `references/brand-kits/cobalt-grid/FRAME.md` as the brand authority.

## Production flow

1. Confirm one reader promise and the 3/10/30-second contract.
2. Select the strongest direction, not the easiest renderer.
3. Build `creative-brief-lite.md` from the selected recombination.
4. Choose GPT Image 2, HTML/SVG, spreadsheet, document, or another surface based on the idea and
   exactness required. No renderer is the creative strategy.
5. Compile the packet and prompt when an image model is used.
6. Review mobile comprehension, utility, originality, brand, claim integrity, and anti-copy boundaries.
7. Add motion only when sequence or change materially improves the argument.

## Visual rules

- Use one dominant object and one primary reading route.
- Let support modules explain the hero; do not make every fact a separate card.
- Treat 3D/isometric, flat editorial illustration, charts, diagrams, photographed artifacts, and
  typographic references as equal pattern families. Pick the one that makes the argument clearest.
- Use Cobalt Grid colours, typography, spacing, and logo system. References contribute information
  architecture and creative atoms, not another creator's brand.
- Use exact official logos only when a named tool or platform is part of the meaning.
- Use third-party icon libraries only for referential UI states; never build the Shetty's Desk logo
  from third-party geometry.
- Use illustration references as method inspiration, not as a copied recurring character or style.
- Keep on-image wording short, exact, and attached to the correct object.

## Complementary caption rule

The visual should make the system, distinction, framework, or artifact immediately legible. The
caption should add context, reasoning, application, limitation, or Tiger judgment. Do not narrate
every label already visible on the image.

## Prompt preflight

Before rendering, confirm:

- the selected creative atoms are visible in the plan;
- the image has one stop-scroll object and a clear eye path;
- the useful takeaway is present on the image;
- exact text has one intended home;
- any number or outcome follows the claim contract;
- the anti-copy boundary is explicit;
- the renderer has composition freedom without permission to invent content;
- the Cobalt Grid brand and exact logo plan are defined.

## Output review

Pass only when all are true:

- problem or promise is visible in 3 seconds;
- main idea is understandable in 10 seconds;
- a useful action or reference is available in 30 seconds;
- the visual and caption are complementary;
- the result can be traced to the bundle without looking like any one source post;
- the design feels like Shetty's Desk;
- text, formula, relationship, logo, and data integrity are exact;
- factual and personal claims meet their individual support burden;
- the mobile crop preserves the intended reading route.

Hard fails:

- generic card-grid or AI-showroom output;
- copied wording, composition, character, or branding;
- invented number, outcome, customer proof, or personal authority;
- a visual that requires the caption to explain what it is;
- several competing messages or reading routes;
- reference atoms listed in the brief but absent from the output;
- decoration that does not improve comprehension, utility, or identity.

## Commands

```bash
node scripts/validate-reference-bundle.mjs \
  --input data/{week}/{slug}/reference-bundle.json
node scripts/build-visual-package.mjs data/{week}/{slug}
node scripts/audit-visual-package.mjs data/{week}/{slug}
```

Existing legacy packages retain their historical inputs for reproduction. All new V4 work uses the
Creative Genome route.
