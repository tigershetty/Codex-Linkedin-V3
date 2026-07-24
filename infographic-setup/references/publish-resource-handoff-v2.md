# Post Package, Resource, And Website Handoff v2

**Version:** 2.2  
**Date:** 2026-07-20  
**Status:** Active for Supply Chain 101 and AI for Supply Chain

## Purpose

The post folder is the creative source of truth. Prove the audience tension first, build and approve the post package, then decide how much resource construction the observed demand or strategic need earns.

Read `render-first-improve-second-v1.md` first. The website is a publication surface; it must never infer a hook, rewrite a caption, substitute a visual, or expose an unfinished resource.

## Canonical Sequence

```text
PASS 0 - DEMAND AND ARGUMENT LOCK
audience receipts + historical priors + Tiger authority
-> topic score
-> hook + 150-word argument + minimum sketch
-> practitioner challenge
-> production-depth decision

PASS A - POST DRAFT SPRINT
approved argument
-> GPT Image 2 candidate
-> exact 1080 x 1350 still pair
-> 10 hooks + caption draft
-> meaningful motion draft or still-only rationale

PASS B - INTEGRATED IMPROVEMENT
argument alignment
-> visual/text/logo/resolution correction
-> motion-value and overlap correction
-> Tiger voice + structural human-writing correction
-> package audits

PASS C - POST PACKAGE APPROVAL
still + writing + motion approved
-> complete post package approved

PASS D - RESOURCE AND WEBSITE
observed demand or strategic resource need recorded
-> resource score and construction depth
-> resource build + validation or not-warranted decision
-> website ready audit
-> Vercel preview approved
-> production merge approved
```

No draft artifact receives an approval timestamp. Technical validation and user approval remain separate facts.

## Package States

Use these states where the manifest surface supports them:

| State | Meaning |
|---|---|
| `draft` | Work exists and may still change during the sprint. |
| `ready-for-review` | The artifact is built and internally audited; explicit approval is pending. |
| `approved` | The user explicitly approved this exact artifact. |
| `still-only` | The user approved a documented reason to omit motion. |
| `not-required` | The eligibility decision proves no resource is warranted. |

Only `approved`, `still-only`, and `not-required` are publish decisions.

## Website States

| State | Meaning |
|---|---|
| `hold` | The integrated post package is still draft or in review. No website work. |
| `eligible` | The post package is approved; finish any required resource validation before handoff. |
| `ready` | The approved post package and resource decision have passed. Website work may begin. |

## Initialize A Post Package

```bash
node scripts/init-post-package.mjs data/{YYYY-W##}/{slug} \
  --series ai-for-sc \
  --resource-required
```

Use `--series sc101` for Supply Chain 101. Omit `--resource-required` unless a resource is already an explicit strategic dependency; the default decision is pending post evidence. Add `--dry-run` to inspect the files without writing them. The initializer refuses to overwrite an existing package.

## Draft Sprint Contract

### Visual

- GPT Image 2 portrait candidates use a supported native size, normally 1024 x 1536.
- Every meaningful element stays inside the centered 1024 x 1280 content-safe area.
- `visual.png` and `visual-linkedin.png` contain the same exact 1080 x 1350 pixels for new posts.
- Model-native renders remain descriptive candidate files and never masquerade as canonical.
- `visual-output-review.md` may be completed before approval and must distinguish corrections from approval.

### Hooks And Caption

- Keep at least ten structurally different hook candidates in `linkedin-caption.md`.
- Run Tiger voice QA and `skills/stay-human-shetty` during the improvement pass.
- Keep the selected draft hook in the manifest, but leave status `draft` and `approvedAt: null` until explicit approval.
- Visual approval never implies writing approval.

### Motion

- Motion may begin once the selected exact 4:5 draft still exists.
- `ready-for-review` requires the canonical GIF, website MP4, completed motion QA, and a motion-value statement.
- Motion must add sequence, dependency, comparison, state change, or decision logic. Highlight-only decoration fails.
- Opening and restored lossless frames must be pixel-identical to `visual.png`.
- `approved` or `still-only` still requires explicit final approval.

### Resource

Create `resource-plan.md` with every package, but normally leave the decision `pending post evidence` during the post sprint. Score and construct the resource after the post package is approved and audience demand or an explicit strategic reason is recorded.

Early resource construction is allowed only when the post cannot be evaluated without the actual working method, or when the website/resource launch is an approved strategic objective. Record the dependency, owner, and reason. Production convenience is not a reason.

For a required resource, include:

- transparent, versioned individual downloads with no email or account gate;
- a branded how-to or instruction PDF plus an accessible Markdown edition;
- a visible file-by-file download manifest with title, purpose, type, size, and checksum;
- a safe first-run path using governed copies of the reader's own files, with a source-to-input map before analysis;
- reusable self-contained methods, skills, scripts, schemas, or templates with explicit output contracts;
- a manifest, checksums, and deterministic validation;
- limitations, failure modes, and human decision boundaries.

Do not bundle synthetic or sample data when the resource is designed for the reader's own project. In that lane, every skill must return readiness gaps instead of manufacturing an answer when minimum evidence is missing.

Do not publish a ZIP by default. Archive delivery is legacy-only and requires an explicit reason in `resource-plan.md`.

Use `ready-for-review` after validation and keep `approvedAt: null`. A resource cannot be published before the post package is approved.

When no resource is warranted, record `decision: not-warranted`, `status: not-required`, and `validationStatus: not-required` with evidence in `resource-plan.md`.

## Post Approval And Resource Contract

Approve the post package first:

1. approve the exact still;
2. approve the selected hook and exact caption;
3. approve motion or the still-only exception;
4. approve the complete post package.

After approval, record resource demand evidence and then:

1. approve the validated resource, lightweight resource, or not-warranted decision;
2. run the website-ready audit;
3. approve the Vercel preview before production.

`postPackage.status` may become `approved` only when every required post component is complete. `approvedAt` values record explicit approvals, not file creation or audit time.

## Audit Commands

Audit while the package is in progress:

```bash
node scripts/audit-visual-package.mjs data/{week}/{slug}
node scripts/audit-motion-package.mjs data/{week}/{slug}
node scripts/audit-resource-package.mjs data/{week}/{slug}
node scripts/audit-publish-handoff.mjs data/{week}/{slug}
```

Require website readiness:

```bash
node scripts/audit-publish-handoff.mjs data/{week}/{slug} --ready
```

The ready audit fails when approvals are missing, the canonical still pair is not exact 4:5, motion is incomplete, a required resource is unvalidated, or website status is promoted early. The 1-hour, 24-hour, and 7-day learning record is not required before the initial website handoff, but it is required before the post becomes a performance prior for a future topic.

## Website Handoff

After the ready audit passes:

1. work in `tigershetty/shettys-desk-site` on a `codex/*` branch;
2. copy the approved caption verbatim;
3. preserve the exact 1080 x 1350 still;
4. use the approved still as the MP4 poster;
5. add the article and required resource in the same handoff;
6. show every individual download with its purpose, file type, and size;
7. verify mobile, desktop, accessibility, links, media, PDF rendering, and every download response;
8. push to a Vercel preview;
9. merge to `main` only after explicit preview approval.

GIF remains the LinkedIn motion asset. MP4 remains the website motion asset.
