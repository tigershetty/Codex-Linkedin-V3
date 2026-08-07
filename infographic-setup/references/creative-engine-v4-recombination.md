# Creative Engine v4 — Recombination-Led Production

**Date:** 2026-08-02
**Status:** Active production and QA layer
**Upstream authority:** `creative-genome-recombination-engine-v1.md`

## Job

Turn a selected Creative Genome assembly into one clear, original, mobile-readable public asset.
The engine does not choose the topic and does not revalidate the saved references.

## Required inputs

- **Standard post:** a post card, two to four saved references, three rough routes, a selected
  visible proof, claim boundary, and Tiger source note when personal judgment is used.
- **Flagship:** an approved reference bundle, recombination brief, creative seed, three visible
  rough directions, content brief, claim support, and Tiger source note where appropriate.
- `creative-review/signature-system-v2.md` is the active brand authority. The brief must select a
  visual family from the reader tension and mechanism; the Field Guide Notebook is available only
  for a working-reference post that passes its specialist admission test. Operating Studio and
  Cobalt Grid are historical references, never defaults.

## Production flow

1. Confirm one reader promise and the 3/10/30-second contract.
2. Select or hybridise the strongest direction from the visible sprint, not the easiest renderer.
3. Standard: keep the selected route in `post-card.md` and move directly to the native visual and
   complementary caption. Flagship: build `creative-brief-lite.md` from the selected recombination.
4. Use the image engine for a selected image-led social visual. Use HTML/SVG, spreadsheet,
   document, Figma, or another surface only when that separate artifact is the reader value. For a
   Field Guide, use the deterministic Figma master and its review contract; no renderer is the
   creative strategy.
5. Compile the packet and prompt when an image model is used.
6. Review mobile comprehension, utility, originality, brand, claim integrity, and anti-copy boundaries.
7. Add motion only when sequence or change materially improves the argument.

## Visual rules

- Use one deliberate reader response and one primary reading route. A framework, map, table, or
  sequence may use a clear progression instead of a single hero object.
- Make the opening tension visible with the headline covered. A beautiful scene that needs the
  caption to supply its central collision is not a final direction.
- Let support modules explain the hero; do not make every fact a separate card.
- Treat 3D/isometric, flat editorial illustration, charts, diagrams, photographed artifacts, and
  typographic references as equal pattern families. Pick the one that makes the argument clearest.
- When an invisible time, range, queue, capacity, or demand variable is the story, an Operating
  Trace can make it visibly alter the scene. It is an option for an earned story mechanism, never a
  brand requirement or decorative flourish.
- Use the selected visual family and Signature System V2. Show the reader tension
  through a physical or visual mechanism, useful framework, career recognition, industry story, or
  deliberate intrigue that belongs to the selected argument. References contribute information
  architecture and creative atoms, not another creator's brand.
- Use exact official logos only when a named tool or platform is part of the meaning.
- Use third-party icon libraries only for referential UI states; never build the Shetty's Desk logo
  from third-party geometry.
- Use illustration references as method inspiration, not as a copied recurring character or style.
- Keep on-image wording short, exact, and attached to the correct object.
- Do not use HTML or SVG overlays to finish an image-engine-led social visual. If exact labels,
  formulas, or data matter more than the scene, publish a separate precise artifact rather than
  faking a hybrid social image.

## Complementary caption rule

The visual should make the system, distinction, framework, or artifact immediately legible. The
caption should add context, reasoning, application, limitation, or Tiger judgment. Do not narrate
every label already visible on the image.

## Prompt preflight

Before rendering, confirm:

- the selected creative atoms are visible in the plan;
- the image has one stop-scroll object and a clear eye path;
- the useful takeaway is present on the image;
- the image-engine text is short enough to be inspected for legibility, or exact content lives in
  a separate artifact;
- any number or outcome follows the claim contract;
- the anti-copy boundary is explicit;
- where the selected visual uses a threshold, range, or gate, the plan shows input → boundary →
  changed action rather than placing a label beside an inert line;
- where a trace is selected, it visibly changes a physical consequence rather than merely carrying
  colour or decoration;
- the renderer has composition freedom without permission to invent content;
- the selected visual family, signature guardrail, and exact logo plan are defined.

## Output review

Pass only when all are true:

- problem or promise is visible in 3 seconds;
- main idea is understandable in 10 seconds;
- a useful action or reference is available in 30 seconds;
- the image visibly proves the opening tension and has a specific work moment;
- a selected threshold, range, or gate visibly shows input → boundary → changed action;
- the visual and caption are complementary;
- the result can be traced to the standard reference shelf or flagship bundle without looking like
  any one source post;
- the design feels like Shetty's Desk;
- text, formula, relationship, logo, and data integrity are exact;
- factual and personal claims meet their individual support burden;
- the mobile crop preserves the intended reading route.

Hard fails:

- generic card-grid or AI-showroom output;
- a polished rule, calculator, or diagram with no visible work moment or story tension;
- a generic physical scene whose visual object does not prove the headline;
- a labelled threshold, range, or gate that is causally inert;
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

Existing legacy packages retain their historical inputs for reproduction. Standard V4 posts use the
Fast Post Loop and draw on Creative Genome intelligence; declared flagships use the full Creative
Genome route.
