# Creative Composition Packet v1

**Status:** active Working Infographic route after a `build_ready` Resource Candidate Card
**Use before:** Figma, a polished caption, image generation, or motion

## The point

The packet prevents a common false choice: three versions of the same poster in different colours.
It makes three source roles explicit, then develops three **non-isomorphic** information objects.
The reader-value decision comes first; the visual route earns its shape from the relationship being
shown.

## Three distinct source jobs

| Job | Source | What it contributes | What it cannot contribute |
|---|---|---|---|
| Information mechanism | Directly reviewed Pierri asset | A way to make a relationship dense, navigable, and reusable | Pierri's visual identity, wording, palette, layout, or performance claims |
| Attention or utility mechanism | Directly reviewed Top-100 asset | An opening tension, recognition trigger, visible proof, or save motive | The topic or factual claim |
| Caption mechanism | Directly reviewed Top-100 record with canonical caption context | A hook move and a division of labour between the post text and visual | A claim that the source post result will transfer |

The three jobs may use different source records. They normally should: one creator's complete post is
not a production template. The packet does **not** copy a source creator's mechanism or anti-copy
text into a new field. It points to the exact canonical record and JSON pointer; the validator loads
the record, checks its asset-bound review status and source hash, and resolves the selected source
field itself.

## Route rules

Every packet develops three routes. They must have different semantic objects, for example:

- a decision path versus a fair comparison;
- a diagnostic field versus a value-driver tree;
- a trade-off spectrum versus a taxonomy;
- a before/after system versus a dependency map.

Different headlines, palettes, card shapes, or icon sets do not make different routes. Each route
must declare what it makes true, what a reader sees at thumbnail size, which micro-units earn its
density, and what the caption uniquely carries. Each also needs a small, distinct low-fidelity
artifact: Markdown direction sketch, SVG, or image/PDF mockup. The artifact must exist and differ
materially from the other two; a third route cannot be a line of text in the packet.

## Select / hybridise / kill

Select the route that makes the reader's problem easier to see and act on. Hybridise only when the
two objects are compatible without producing a noisy collage. Kill the candidate when all three
routes need a disclaimer to avoid a false visual claim.

`route_selected` means a route has been chosen, not that it is ready to build. To mark the packet
`valid_ready`, save one short selected-route review artifact that names the selected route and makes
the reader-value decision explicit. No finished visual may begin until that review and the
source/anti-copy checks pass. `valid_ready` is admission to visual production—not final-visual or
publication approval.

## Command

From `infographic-setup/`:

```bash
node scripts/validate-creative-composition-packet.mjs \
  --input data/{week}/{slug}/creative-composition-packet.json
```

This verifies provenance and structural variety. It is not a taste oracle or publication approval.
