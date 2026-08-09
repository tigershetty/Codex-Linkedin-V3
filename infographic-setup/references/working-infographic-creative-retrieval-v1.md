# Working Infographic Creative Retrieval v1

**Status:** active retrieval layer for a `build_ready` Working Infographic candidate

## Separate the jobs before choosing a visual

The retrieval is deliberately three-part:

1. **Pierri information mechanisms** — actual visual relationships, density and (where present)
   semantic motion learned from direct asset review.
2. **Top-100 attention and utility mechanisms** — first-frame tension, recognition, visible proof,
   save/send motives, and reader actions learned from Tiger's curated references.
3. **Caption mechanisms** — source-bound opening moves and visual/caption division of labour.

One source can appear in more than one pool, but the production packet must assign roles explicitly.
The output is a short, diversified shelf—not a recipe, content-topic selector, or performance
predictor.

## Why diversity is enforced

Simple keyword ranking repeatedly returns visually similar mechanisms. The retrieval script therefore
uses a small novelty penalty: a second result with the same argument shape or mechanism family is
less likely to displace a different useful shape. This increases creative range without pretending
that an algorithm can judge taste.

## Matching contract

The retrieval does not score every corpus record against loose keywords. It first maps the input to
controlled reader-state, response, cognitive-job and information-relation terms; generic words
such as `the`, `post`, `visual` and `reader` are ignored. A returned shelf also requires one
controlled, scope-bearing **reader-state** match; a generic job or relation cannot infer a topic.
Every returned source record exposes the matched controlled tags and the exact input terms that
produced them.

- `matched` means at least one source record carries a declared matching mechanism.
- `no_match` returns an empty shelf when the query is unrelated or contains no controlled terms.
- `broad_inspiration_fallback` returns an empty shelf when the reader state is unknown, when a
  response is named without a reader state, or when a recognised scoped mechanism has no source
  match. It is intentionally not a disguised random-reference result.

## Command

From `infographic-setup/`:

```bash
node scripts/build-working-infographic-creative-index.mjs

node scripts/retrieve-working-infographic-mechanisms.mjs \
  --reader-state "conflicting dates" \
  --response "practical use" \
  --cognitive-job "diagnose" \
  --relation "conditional decision"
```

Use the returned source IDs in `creative-composition-packet.json`; do not turn its output into a
finished Figma frame without a selected Candidate Card and three semantic routes.
