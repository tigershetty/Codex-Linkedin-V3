# Publish And Resource Handoff v1

**Version:** 1.0
**Date:** 2026-07-15
**Status:** Active final-stage workflow for Supply Chain 101 and AI for Supply Chain

## Purpose

The post folder is the creative source of truth. The website is a publication surface, not a place to infer missing approvals.

The final handoff runs only after the still and caption have each been explicitly approved.

## Status Sequence

```text
draft -> still approved -> motion complete or still-only -> caption approved
      -> resource complete or not warranted -> website ready
      -> Vercel preview approved -> production merge
```

Never skip a status. A visual approval does not approve the caption, and a caption edit does not approve a production deployment.

## Publish Manifest

Copy `templates/publish-manifest-template.json` to the post folder as `publish-manifest.json`.

Audit the manifest while it is on hold:

```bash
node scripts/audit-publish-handoff.mjs data/{week}/{slug}
```

Before the website handoff, require the ready gate:

```bash
node scripts/audit-publish-handoff.mjs data/{week}/{slug} --ready
```

Hard rules:

- `caption.status` remains `draft` until the user confirms the final text.
- `visual.status` remains `draft` until the user approves the exact canonical still.
- `website.status` cannot become `ready` until both are `approved`.
- Keep the approved caption verbatim in the caption file; do not rewrite it in the website repo.
- Use the canonical still on the article page and preserve its native aspect ratio.
- Use MP4 for website motion when available; retain GIF for LinkedIn.
- Work in the website repo on a `codex/*` branch, verify desktop/mobile, and use Vercel preview before production.

## AI-for-SC Resource Eligibility

Score one point for each:

1. reusable method, skill, workflow, or decision policy;
2. safe synthetic input pack;
3. deterministic script, schema, checklist, or validator;
4. three or more reviewable outputs;
5. useful beginner first run without production access;
6. explicit failure modes and human decision boundary.

Decision:

- `4-6`: resource required;
- `2-3`: lightweight template/checklist only;
- `0-1`: not warranted.

Record the result in `resource-plan.md`.

## Resource Standard

An eligible pack contains:

- direct ZIP download with no email, account, or newsletter gate;
- a four-page branded field guide by default;
- one safe first-run command or equivalent;
- synthetic inputs and completed examples;
- reusable instructions or skill assets;
- deterministic checks and a validation checklist;
- `MANIFEST.json`, version notes, checksums, limitations, and the human decision boundary.

The website resource page should demonstrate the method before the download button, state what is inside, and name the first safe run.

## Final Website Verification

- published article uses the approved title, caption, still, and motion;
- native still ratio is preserved on desktop and mobile;
- MP4 autoplays muted/looped/playsInline and has the still as poster;
- resource route returns the current versioned ZIP with attachment headers;
- extracted ZIP passes its first-run and checksum verification;
- no email or account form blocks the download;
- Vercel preview is inspected before production merge.
