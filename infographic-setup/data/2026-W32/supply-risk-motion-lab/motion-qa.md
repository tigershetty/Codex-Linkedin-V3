# Motion QA — Before You Escalate a Supply Risk

**Package:** `FG-SUPPLY-RISK-MOTION-LAB-V1` (internal draft; not approved for publication)<br>
**Source:** `field-guide-motion-manifest.json` → Figma `lAiBPFCz9FDuM74CN5chDd`, node `37:3`<br>
**Approved local still:** `visual.png`<br>
**Source SHA-256:** `6d93e3bf2f8c790bc88664e97d6852fe7ebf585f3325cc553d71fb9fa63304b8`<br>
**GIF:** `visual-motion.gif`<br>
**MP4:** `visual-motion.mp4`<br>
**Composition:** `videos/supply-risk-motion-lab-motion/compositions/main.html`<br>
**Date:** `2026-08-07`

## 1. Motion Contract

**Why motion earns its place:**

> Motion helps because the reader needs to see one illustrative risk signal pass through the four
> ordered checks before it becomes a joint exception.

**Boundaries:** The signal is illustrative. It does not represent a named supplier, customer,
recovery result, freight decision, or deployed workflow. The motion is a comprehension experiment,
not a performance claim about video, GIFs, LinkedIn reach, or engagement.

**Major beats:** complete still → date reliability → customer exposure → recovery check → joint
exception → complete still.

## 2. Source-Fidelity Gate

- [x] The approved local Figma export is copied unchanged to `assets/visual.png`.
- [x] Complete visual is the versioned opening proof frame (`qa/opening-source-frame.png`).
- [x] Complete visual is the versioned closing proof frame (`qa/final-source-frame.png`).
- [x] Body text, questions, source notes, rules, arrows, and marks remain locked.
- [x] No crop, cover, inpainting, reconstructed background, or generated visual is used.
- [x] SVG signal/highlight stays on original gate rules and arrow corridors only.

Raw-RGBA verification command:

```bash
node scripts/verify-motion-endpoints.mjs \
  --source data/2026-W32/supply-risk-motion-lab/visual.png \
  --first ../videos/supply-risk-motion-lab-motion/qa/opening-source-frame.png \
  --final ../videos/supply-risk-motion-lab-motion/qa/final-source-frame.png \
  --sha256 6d93e3bf2f8c790bc88664e97d6852fe7ebf585f3325cc553d71fb9fa63304b8 --json
```

| Check | Result |
|---|---|
| Source SHA-256 | matches manifest |
| Source dimensions | `1080 × 1350` |
| Opening changed pixels / channels / max delta | `0 / 0 / 0` |
| Closing changed pixels / channels / max delta | `0 / 0 / 0` |

## 3. Reproducibility Gate

- [x] `motion-overlay-geometry.json` is the versioned source for every overlay segment, its Figma
  node IDs, canvas coordinates, timing, and communication job.
- [x] `build_motion_assets.mjs --check` confirms the source SHA, geometry, semantic-region binding,
  generated geometry module, and asset manifest are current.
- [x] `qa/render-provenance.json` binds the rendered GIF/MP4 to the current source, geometry,
  generated module, composition, retained endpoints, and render settings.
- [x] `audit-motion-package.mjs --manifest ...` verifies both generated-geometry use and render
  provenance freshness before passing the package.

## 4. Transition Review

- [x] Frame 0, all four gate beats, and the final hold were inspected through
  `videos/supply-risk-motion-lab-motion/qa/contact-sheet.png`.
- [x] A source-resolution recovery frame (`f_0120.png`) was inspected: the dot sits on the blue
  gate rule and does not cover copy.
- [x] A source-resolution handoff frame (`f_0047.png`) was inspected: the dot sits in the existing
  right-arrow corridor and does not cover copy.
- [x] The source still remains fully usable when motion is paused or unavailable.

**Correction made:** reduced the treatment to source-aligned rule traces and a single six-pixel dot.
No panel, text, or arrow was separately animated.

## 5. Reader And Feed QA

| Dimension | Internal review evidence |
|---|---|
| Noticeability | Deliberately restrained: this is a reading aid, not a stop-scroll or engagement claim. |
| Reading order | One signal advances through the four visible gates in the Field Guide order. |
| Source fidelity | Raw-RGBA opening and closing endpoints are pixel-identical to the approved still. |
| Layout fit | Accents occupy only existing rules and arrows. |
| Restraint | No text, panel, logo, or source geometry moves. |
| Technical finish | Local render and media checks pass; publishing-format choice has not been tested in-feed. |
| Pause readability | Every paused frame retains the complete Field Guide underneath. |

**Pass bar:** exact endpoint fidelity; no hard visual defect; internal Lab only. No score is a prediction of reach, comprehension, or engagement.

## 6. Media Specs

| Output | Dimensions | FPS | Duration | Frames | Size |
|---|---:|---:|---:|---:|---:|
| GIF | `720 × 900` | `20` | `6.55s` | `131` | `157,013 bytes` |
| MP4 | `1080 × 1350` | `30` | `6.53s` | `196` | `101,480 bytes` |

- [x] GIF used palette generation and palette use.
- [x] MP4 preserves the full source dimensions.
- [x] The complete, motion-free final hold is `1.2s`.
- [x] The `1.2s` hold is part of the `6.5s` composition; the renderer adds `0s` after it.
- [x] Representative contact sheet inspected.

## 7. Decision

**Status:** pass<br>
**Canonical outputs promoted:** yes<br>
**Publication status:** internal draft — no LinkedIn publishing decision has been made.<br>
**Remaining concern:** the sparse trace correctly protects the Field Guide, but its actual
in-feed noticeability and GIF-versus-MP4 suitability remain untested for this account.<br>
**Reusable learning:** exact Field Guides can use a single source-registered signal to explain an
ordered dependency without moving copy or inventing a result.

Run from `infographic-setup/`:

```bash
node scripts/audit-motion-package.mjs \
  --manifest data/2026-W32/supply-risk-motion-lab/field-guide-motion-manifest.json
```
