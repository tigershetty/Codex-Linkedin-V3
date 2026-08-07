# Motion Engine V2 — Semantic States for Visual Frameworks

**Status:** active motion authority for a Figma-native Working Infographic. It complements, rather
than deletes, the picture-first route in `motion-engine-v1.md`.

## The rule

Do not animate a flattened infographic and call the moving overlay a story. A framework-led motion
post must move the **authored information object**.

```text
hook state
  → skeletal structure
  → reveal / regroup / compare / trace a named relationship
  → resolved useful reference
  → readable final hold
```

The opening state is allowed to be incomplete. The final held state must match the approved Figma
static export exactly enough to preserve every label, value, relationship, source cue, and boundary.

## Admission

Use this route only when this sentence is true:

> Motion helps because it lets the reader see **[named relationship change]** that the static page
> cannot communicate as clearly.

Valid changes include:

- a path reveals the condition that changes the next decision;
- a comparison rearranges the same inputs to expose a trade-off;
- a layer separates to show dependency or ownership;
- a series of modules builds to reveal order or accumulation;
- a measured value moves across an honestly labelled scale.

Invalid changes include ambient movement, a travelling dot over a permanent poster, random camera
pushes, decorative wipes, and a generic AI-video transformation of exact labels or figures.

## Source and component contract

A motion package records:

```json
{
  "route": "working_infographic_semantic_motion",
  "figma_file_key": "...",
  "figma_node_id": "...",
  "static_export": { "path": "...", "sha256": "..." },
  "semantic_components": [
    { "id": "...", "role": "condition|axis|path|module|comparison|boundary", "beat": 1 }
  ],
  "motion_sentence": "Motion helps because...",
  "states": ["hook", "structure", "change", "resolved"],
  "final_hold_seconds": 1.5
}
```

Components must have names and semantic roles in the Figma master. Generative video may be used only
for an isolated non-text material or scene layer; it may never redraw, distort, or interpolate exact
type, numbers, source notes, decision lines, or operator labels.

## Review

Pass only if:

- the first second earns attention without hiding the topic;
- each beat changes a named source-authored component or relationship;
- a muted viewing still communicates the same core model;
- the final state has a 1.5-second or longer readable hold and equals the approved static export;
- a reader can explain what changed and why after one loop;
- no motion claim is presented as an algorithm or reach promise.

The existing Supply Risk Motion Lab remains evidence that endpoint/source-fidelity controls work. It
is not the creative standard for this route because its overlay-only choreography does not satisfy
the semantic-state rule above.
