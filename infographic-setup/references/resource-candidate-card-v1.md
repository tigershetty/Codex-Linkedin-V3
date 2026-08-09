# Resource Candidate Card v1

**Status:** active admission record for a high-density Working Infographic<br>
**Use after:** a broad opportunity has been narrowed into one actual reader moment<br>
**Use before:** Figma, a finished caption, motion, or a visual-route decision

## Why this exists

A strong resource graphic is not a topic written into a layout. It starts with a moment where a
reader has to decide, explain, prepare, diagnose, or compare something. The card makes the
opportunity visible before production begins, so the team can kill a vague idea early without
killing creativity.

It operationalises Pierri's four useful selection prompts—lived tension, immediate handle, useful
angle, and earned density—without converting them into a universal virality score or a veto against
recognition, career, timely, or perspective posts.

## Reader-first contract

The candidate card must answer these questions in plain language:

1. **What is happening at work?** One exact reader and a recognisable moment, not a subject area.
2. **What becomes easier today?** A question, preparation, check, comparison, or explanation that
   changes once the reader has the object.
3. **Why does the detail earn a save?** Each micro-unit removes a named uncertainty; a label that
   merely sounds professional does not count.
4. **What is actually known?** The card distinguishes observed/public material, documented method,
   Tiger-approved judgment, and an explicitly labelled hypothesis.
5. **Why this rather than familiar content?** A lightweight saturation scan tells us whether the
   angle is generic, under-explained, or needs reframing. It is not a demand score.

## Decision outcomes

| Outcome | Meaning | Next action |
|---|---|---|
| `explore` | The work moment is promising, but evidence or detail is incomplete. | Research or source the missing branch; do not make a finished visual. |
| `build` | The reader moment, usable keep, density, claim boundary and route are ready. | Assemble the Creative Composition Packet and develop three semantic routes. |
| `reframe` | The reader value is real, but the current promise/shape is wrong or too broad. | Rewrite the branch, not the palette. |
| `park` | The output would be generic, unsupported, or non-useful. | Preserve the reason and move on. |

## Density is not a word count

Each micro-unit must record the uncertainty it removes. Good units include a date condition, owner,
input, exception, choice, comparison field, calculation assumption, worked example, failure mode,
or decision consequence. A long stack of labels such as “buffer / freight / stock” is not a density
inventory until the visual tells the reader what each changes.

## What the card does not do

- It does not choose a topic automatically.
- It does not prove a market-size, performance, causal, or company claim.
- It does not make Pierri's four filters into a rigid score.
- It does not replace saved-reference retrieval, the opportunity map, Tiger voice, or claim support.
- It does not determine the visual style. That happens in the Composition Packet, after the reader
  value is clear.

## Required handoff

A `build` candidate must create a `creative-composition-packet.json`. When that packet references
this card, the card is run through this validator again in full; a `build_ready` label on its own is
never enough. The packet combines a directly reviewed Pierri information mechanism, a directly
reviewed Top-100 attention/utility mechanism, and a Top-100 caption mechanism with separate jobs;
it then forces three non-isomorphic spatial routes. A Figma working infographic may begin only after
one route has been selected and reviewed.

## Commands

From `infographic-setup/`:

```bash
node scripts/validate-resource-candidate-card.mjs \
  --input data/{week}/{slug}/resource-candidate-card.json
```

The validator checks the record's internal honesty, including the complete build-ready contract. It
does not approve a topic, claim, visual, or publication.
