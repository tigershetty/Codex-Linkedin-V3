# Field Guide Notebook — Figma Master Contract v1

**Figma source:** [Shetty's Desk — Field Guide Notebook V5 Production](https://www.figma.com/design/lAiBPFCz9FDuM74CN5chDd)

This is the deterministic source for exact, type-heavy Field Guide Notebook outputs. It is not a
new default layout, a component library for general product UI, or permission to turn every post
into a worksheet.

## Current source state — 2026-08-07

| Page | Status | Purpose |
|---|---|---|
| `00 — Start Here` | built and reviewed | explains the grammar: recognisable behaviour, variable argument |
| `01 — Foundations` | built and reviewed | colour roles, type ramp, semantic-shape rule |
| `02 — Component / Module` | built and reviewed | `Check`, `Decision`, and `Evidence` variants |
| `03 — Component / Field Note` | built and reviewed | `Boundary` and `Exception` variants |
| `04 — Component / Action` | built and reviewed | a visible working move, never a promotional CTA |
| `05 — Pilot / Cross-functional Map` | built and reviewed | editable 1080 × 1350 Handoff Atlas pilot |
| `06 — Motion Lab / Supply Risk` | built and locally export-verified | exact 1080 × 1350 source for the internal signal-path motion experiment; not publication approved |

The connected Figma plan was upgraded to Professional on 2026-08-07. Every current component and
the pilot have been visibly inspected in the master. The source remains a draft design authority:
Tiger must approve an exact visual and caption before it becomes a LinkedIn release.

**Verified pilot:** [Cross-functional Translator Map](https://www.figma.com/design/lAiBPFCz9FDuM74CN5chDd?node-id=27-2)

**Verified internal lab:** [Before You Escalate a Supply Risk](https://www.figma.com/design/lAiBPFCz9FDuM74CN5chDd?node-id=37-3). The connected API does not expose Figma version-history writes, so source verification is recorded through the inspected node, local exact export, and SHA-256 in the lab manifest rather than a claimed Figma version stamp.

## Master anatomy

The public 4:5 frame must have this order:

1. reader moment + promise;
2. one semantic spatial argument selected from `field-guide-spec.json`;
3. three to seven modules;
4. boundary / exception / source cue where required;
5. concrete next action.

Use the local `FG /` variables and text styles. The visual language is warm paper, deep ink, cobalt
proof signal, and state colours only when their meaning is present. Fraunces carries the promise;
IBM Plex Sans/Mono carries working detail. Do not substitute a Pierri-like pastel box system,
handwriting, or decorative motion.

## Required local components

Create only after a selected spec requires them:

| Component | Variants / job |
|---|---|
| `FG / Module` | `Check`, `Decision`, `Evidence`; one independent reader action per module |
| `FG / Field Note` | `Boundary`, `Exception`; prevents false certainty |
| `FG / Action` | one visible next move, not a promotional CTA |

Components are content-bearing ingredients, not a universal card grid. If the selected spatial model
is a map, curve, comparison, or timeline, build the semantic shape first and use components only
where they make the reading route clearer.

## Layer naming and export

Name authored layers by role: `Promise`, `Spine`, `Module / {id}`, `Boundary`, `Source`, `Action`.
Before export, use `validate-field-guide-package.mjs`, then the Field Guide review template. Export a
verified still before considering motion. For every Field Guide, also create
`field-guide-manifest.json`: record the Figma file key, node ID, source URL, reviewed version, and
whether that metadata has been locally verified. Once exported, record the local file, dimensions,
format, and SHA-256. A URL alone is a recorded pointer, not proof that the current source or export
was inspected. If motion passes its explicit eligibility sentence, preserve the still as opening and
closing frame and animate one state/path only.
