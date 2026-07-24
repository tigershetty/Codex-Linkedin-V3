# Quality Reset Audit v2 - Five Pre-S&OP Reviews

**Date:** 2026-07-19  
**Scope:** resolution, visual promotion, motion value, writing originality, resource value, and production order

## 1. Why The Wrong Resolution Recurred

### Root cause

The workflow treated `visual.png` as the model-native master and `visual-linkedin.png` as a later publishing export. GPT Image 2 could produce a strong 1024 x 1536 portrait, so the visual looked finished even though the canonical file was not 4:5. The previous audit enforced the secondary export but did not reject a non-4:5 `visual.png`.

### Correction

- GPT Image 2 candidates remain descriptive model-native files.
- Prompts keep all meaningful content inside a centered 1024 x 1280 safe area.
- `export-linkedin-still.py --mode safe-crop` promotes one exact 1080 x 1350 PNG.
- The same bytes are written to `visual.png` and `visual-linkedin.png`.
- The visual and publish audits now reject a non-1080 x 1350 canonical still or a hash mismatch.

### Current proof

- `visual.png`: 1080 x 1350
- `visual-linkedin.png`: 1080 x 1350
- both SHA-256: `33d4c13d6b948caa8f4d0fea499324815112fe1a638f6e1893766670da391198`

## 2. Why The Earlier Motion Felt Low Value

### Root cause

The flattened PNG was treated as an untouchable background with broad highlights above it. That preserved source fidelity but confused fidelity with value. There was no required statement of what motion taught, no complete source-layer model, and no audit that distinguished movement from communication.

### Correction

- Seven complete source-authored modules are isolated with shaped alpha masks.
- A clean architectural stage holds the exact headline and brand lockup.
- Five reviews assemble in operating order and send named hand-offs to the center.
- Executive S&OP appears only after all inputs exist.
- The readiness equation resolves last.
- The motion audit now requires a value statement, explicit value score, and multiple meaningful motion layers.

### Current proof

- lossless frames 0, 300, 330, and 360 have zero pixel difference from `visual.png`;
- final MP4: 1080 x 1350, 30 fps, 12.03 seconds;
- final GIF: 720 x 900, 18 fps, 12.06 seconds, 217 frames;
- both lossless and encoded-GIF contact sheets were inspected.

## 3. Why The Writing Sounded Monotonous

### Root cause

The draft repeatedly used one polished explainer shape: thesis, ordered list, explicit moral, diagnostic question. Hook options varied vocabulary more than structure. The caption also echoed too much of the visual, which made it complete but unsurprising.

### Correction

- `skills/stay-human-shetty` adds structural checks derived from the supplied Stay Human framework.
- Ten hooks now use ten different entry architectures.
- The draft enters through a meeting scene, moves backward to the missing hand-offs, keeps a legitimate trade-off unresolved, and stops before explaining its own moral.
- The check is used as an editing lens; it is not presented as a validated LinkedIn AI detector.

### Current state

The improved hooks and caption are `ready-for-review`, not approved. Final selection is deferred until the user returns to writing.

## 4. Why Resource Scope Needed A Separate Gate

### Root cause

The earlier workflow treated the resource as another post-draft component. That made a complete-looking bundle easy to build before the post argument and audience value were settled, and encouraged unnecessary sample files and archive packaging.

### Correction

- Resource eligibility is scored during topic packaging, but construction normally follows post-package approval and observed demand or an explicit strategic reason.
- This post has an approved post package and a user-directed strategic reason for the resource.
- Every downloadable skill is self-contained, maps the reader's governed files to an explicit input contract, returns readiness gaps when evidence is insufficient, and retains a human decision boundary.
- The public contract is one instruction PDF, one Markdown guide, five skill files, and zero bundled data files.

### Current proof

The v1.2.0 public library contains exactly seven direct downloads: one instruction PDF, its Markdown companion, and five official-validator-passing standalone skills. Bundled data, completed examples, installers, and ZIP delivery are omitted. Internal manifests and checksums validate the seven-file public inventory.

## 5. New Production Order

The active sequence is now:

1. demand lock: prove the audience problem and argument;
2. post draft: build the exact 4:5 still, ten hooks, caption, and meaningful motion;
3. integrated improvement and post approval;
4. resource decision and construction after demand or strategic need is recorded;
5. resource approval, website implementation, and preview approval.

The governing reference is `references/render-first-improve-second-v1.md`.

## 6. Remaining Approval

- Visual, hooks, final caption, motion, and the post package are approved.
- Resource v1.2.0 is built, audited, and `ready-for-review`.
- The website is `eligible`; it must not become `ready` until the revised resource is explicitly approved.
