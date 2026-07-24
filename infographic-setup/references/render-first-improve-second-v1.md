# Demand Lock, Render, Improve v1.1

**Version:** 1.1  
**Date:** 2026-07-20  
**Status:** Active production sequence for Supply Chain 101 and AI for Supply Chain

## Purpose

Do not polish an unproven idea.

First lock the audience tension and argument. Then build enough of the post package to judge the still, writing, and motion as one system without stopping for approval after every draft. Approve the post package before normal resource construction and website work.

Drafts may be incomplete. Canonical and published files may not be inaccurate.

## Pass 0 - Demand And Argument Lock

Use `content-demand-proof-gate-v1.md`.

1. Record at least three dated audience receipts from at least two source types.
2. Compare the closest three Shetty's Desk historical priors by audience job.
3. Name Tiger's authority source.
4. Lock the recognizable tension, belief, evidence, boundary, and decision consequence.
5. Record creator/reference provenance and distinguish visual inference from performance evidence.
6. Score the topic and choose `flagship`, `medium`, `test`, or `park`.
7. For a flagship, test the selected hook, a 150-word argument, and a minimum sketch with relevant reviewers before rendering.

A failed non-compensable gate stops production regardless of the numeric score.

## Pass A - Post Draft Sprint

No intermediate user approval is required inside this pass.

1. **Carrier:** choose the minimum carrier that serves the argument: text, photo, screen evidence, table, diagram, flagship still, or motion.
2. **Visual draft, when warranted:** compile one strong GPT Image 2 prompt and render the candidate at a supported model size.
3. **LinkedIn promotion draft:** convert the selected visual to exact 1080 x 1350 with no content loss, then place the same pixels in `visual.png` and `visual-linkedin.png`.
4. **Writing draft:** produce ten evidence-linked hook architectures and one caption in Tiger's voice.
5. **Motion draft, when warranted:** build a layout-specific treatment only when sequence, comparison, state change, dependency, or decision logic adds meaning.
6. **Resource plan:** record `pending post evidence`, `not warranted`, or an explicit early strategic dependency. Do not automatically build a full resource because it could exist.
7. **Package state:** record unfinished artifacts as `draft` or `ready-for-review`. Never create fake approval timestamps.

The sprint ends when the post package is visible enough to compare, not when each part is polished in isolation.

## Pass B - Integrated Improvement

Review the post package in this order:

1. **Argument alignment:** still, hook, caption, and motion make the same promise without reading one another aloud.
2. **Visual correction:** text, numbers, formulas, visual anchors, logos, brand colors, and 4:5 framing are exact.
3. **Motion-value correction:** motion demonstrates sequence, change, dependency, comparison, or choice. Highlight-only motion fails unless highlighting itself is the teaching mechanism.
4. **Writing correction:** run Tiger voice QA and `skills/stay-human-shetty`; remove explained morals, tidy single-track structure, visual echo, template footprints, cosmetic hook variants, and unsupported authority.
5. **Feed and pause test:** inspect the 4:5 still, representative lossless motion frames, encoded GIF, and first caption lines at LinkedIn size.
6. **Audit:** run visual, motion, and publish-handoff checks. A passing script is evidence only for the conditions it checks.

Return to Pass 0 when the audience, claim, or operating logic changes. Local text, logo, motion, or copy corrections stay in Pass B.

## Pass C - Post Approval

Use one integrated post checkpoint:

1. canonical still or approved non-visual carrier;
2. selected hook and exact caption;
3. motion or recorded still-only / not-required decision;
4. complete post package.

Only explicit user approval changes an artifact from `ready-for-review` to `approved`.

## Pass D - Resource, Website, And Learning

After post approval:

1. record observed resource intent from comments, DMs, clicks, practitioner requests, or a pre-approved strategic objective;
2. score the resource and choose full, lightweight, or not warranted;
3. build and validate the warranted resource;
4. run the website-ready audit and create a Vercel preview;
5. merge only after explicit preview approval;
6. capture 1-hour, 24-hour, and 7-day performance learning.

## Resolution contract

For new portrait renders:

1. render the GPT Image 2 candidate at `1024x1536`;
2. keep every meaningful element inside the centered `1024x1280` safe area;
3. use the top and bottom 128 pixels for expendable atmosphere only;
4. center-crop the safe composition to 4:5 and resize once to 1080 x 1350;
5. promote the exact same pixels to `visual.png` and `visual-linkedin.png`;
6. keep the native model render under a descriptive candidate filename.

The canonical still pair must be exactly 1080 x 1350, byte-identical, and below 5 MB.

## Motion contract

Before authoring motion, complete:

> Motion adds value beyond the still by showing [sequence, dependency, comparison, state change, or decision logic].

Then:

- isolate complete source-authored objects or reconstruct deterministic vector/data layers;
- move those layers with the composition, not above it as unrelated decoration;
- keep approved text and logos source-locked;
- design one clear beat hierarchy and a generous final reading hold;
- open and close on the exact canonical still;
- require zero pixel difference on opening and restored lossless frames;
- inspect the palette-converted GIF separately.

Decorative pulses, rings, glows, and sweeps do not satisfy the value contract by themselves.

## Writing contract

Every draft includes ten genuinely different, evidence-linked hook architectures. The final writing pass must:

- make the source of Tiger's insight visible;
- add context or reasoning beyond the visual;
- preserve uncertainty and real operating tension;
- avoid habitual `This is where`, `For me`, five-step explainer shapes, and self-explained morals;
- source every statistic, case, authority claim, and current product capability;
- leave a useful practitioner question rather than generic agreement bait.

## Resource contract

Score each post from 0 to 6:

1. reusable method, skill, workflow, or decision policy;
2. safe first-run path using governed copies of the reader's own files;
3. deterministic schema, checklist, skill, validator, or explicit instruction contract;
4. reviewable expected outputs;
5. useful first run without production access;
6. explicit failure modes and human decision boundary.

A score of 4/6 makes a resource eligible, not mandatory. Build depth also requires observed demand or an explicit strategic reason.

For the current bring-your-own-project lane:

- publish direct individual downloads with no email, account, or ZIP gate;
- include one branded instruction PDF, one Markdown guide, and five self-contained skill files when that is the approved package;
- omit synthetic data unless a future resource specifically requires and approves it;
- return readiness gaps instead of fabricating a completed artifact when evidence is insufficient;
- publish visible descriptions, file types, sizes, manifests, and checksums.

## Required evidence

| Requirement | Evidence |
|---|---|
| demand and authority | receipts, historical priors, Tiger authority, topic score |
| reference provenance | creator, source, observed response, classification, confidence |
| exact LinkedIn still | dimensions, hash equality, visual audit |
| correct visual content | tight crops, output review, text/data integrity 5/5 |
| meaningful motion | motion brief, source layer map, representative frames, encoded GIF sheet |
| human writing | ten evidence-linked hook architectures, structural audit, voice QA |
| warranted resource | demand/strategy evidence, instruction PDF, Markdown guide, standalone files, manifest, checksums |
| learning | 1-hour, 24-hour, and 7-day performance record |
| final readiness | explicit approvals plus `audit-publish-handoff --ready` |

## Standard commands

```bash
node scripts/build-visual-package.mjs data/{week}/{slug}
node scripts/audit-visual-package.mjs data/{week}/{slug}
node scripts/audit-motion-package.mjs data/{week}/{slug}
node scripts/audit-resource-package.mjs data/{week}/{slug}
node scripts/audit-publish-handoff.mjs data/{week}/{slug}
node scripts/audit-publish-handoff.mjs data/{week}/{slug} --ready
```

Run post-specific resource builders and validators only after the resource decision authorizes construction.

