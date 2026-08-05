# Publish And Resource Handoff v1

**Version:** 2.1
**Date:** 2026-08-02
**Status:** Active final-stage workflow for V4 releases

## Purpose

The post folder is the creative source of truth. The website is a publication surface, not a place to infer missing approvals.

The final handoff runs only after the required provenance, voice, still, and caption gates have
cleared. Record `not required` when a research-led piece uses no Tiger authority or when the selected
claim mode needs no separate research file.

Before the first V4 release, the Creative Review Foundation must pass
`node scripts/validate-reference-review-foundation.mjs --require-complete`. That first release is a
calibration post and must pass `node scripts/audit-calibration-release.mjs data/{week}/{slug}` before
five-post cadence resumes.

## Route scope

**Standard LinkedIn-only post:** the handoff is complete when the approved `post-card.md`, active
visual, approved caption, five-reader review, and planned analytics record agree. Do not create a
publish manifest, resource package, website article, or motion project merely to satisfy this file.

**Flagship, resource, or website handoff:** use the complete manifest and channel gates below. It
must retain the full Creative Genome provenance and any support ledger needed for its public claims.

## Standard LinkedIn-only sequence

```text
post card -> claim boundary and required source/support -> visual and caption draft
      -> five-reader review -> Tiger caption approval + exact still approval
      -> manual LinkedIn publish -> analytics
```

Motion, a resource, a website article, a manifest, and Vercel are not stages in this route. Add one
only if a deliberate expansion earns its own value.

## Flagship, resource, or website sequence

```text
creative bundle -> claim contract -> required support/source -> draft -> provenance QA
      -> Tiger voice approved -> caption approved -> still approved
      -> optional approved motion -> resource complete or not warranted -> website ready
      -> Vercel preview approved -> production merge
```

Never skip a relevant status. A source is not automatically public-safe, voice approval does not
approve later wording changes, visual approval does not approve the caption, and a caption edit does
not approve a production deployment.

## Publish Manifest

For a flagship, resource, or website handoff, copy
`templates/publish-manifest-template.json` to the post folder as `publish-manifest.json`. Assign the
stable `contentId`, shared `parentSlug`, channel, and series before drafting. New manifests use schema
version 2 and the voice block. Existing schema-version-1 manifests remain valid as legacy records,
but they do not provide the V4 provenance gate.

Audit the manifest while it is on hold:

```bash
node scripts/audit-publish-handoff.mjs data/{week}/{slug}
```

Before the website handoff, require the ready gate:

```bash
node scripts/audit-publish-handoff.mjs data/{week}/{slug} --ready
```

Hard rules:

- New post folders contain `tiger-source.md` only when personal judgment, experience, result,
  employer context, or first-person authority is used.
- Every new flagship/resource/website manifest records a non-empty `creative_bundle_id`, its `genome_reference_ids`,
  `creative_element_ids`, a
  `claim_mode`, a `support_ledger`, and a `transfer_result` state.
- The creative bundle is the accepted packaging input. The `support_ledger` governs factual,
  numerical, causal, company-outcome, simulation, and first-person claims separately.
- For schema-version-2 handoffs, `voice.provenanceStatus`, `voice.qaStatus`, and `voice.status` must all be `approved` before the website can become `ready`.
- Record `voice.aiDisclosure` as `profile/footer`, `post-level`, or `not-required`; never leave the disclosure decision implicit.
- Every first-person experience, result, credential, team-practice, and employer claim maps to an approved source ID.
- Public facts and numbers remain traceable to the support ledger, `support-note.md`, or
  `research-brief.md` as required; company-outcome and causal
  claims carry the stronger support required by those claim modes; research must not be
  rewritten as Tiger's lived experience.
- A public simulation is allowed only when `claim_mode` is `simulation_or_hypothesis` or `mixed`, the
  caption and visual label it clearly, and the support ledger states what it does not prove.
- Internal calculation or software fixtures are allowed, but their paths are recorded separately
  and `excluded_from_public_proof` remains `true`.
- Restricted workplace detail requires explicit public-use approval.
- `caption.status` remains `draft` until the user confirms the final text.
- `visual.status` remains `draft` until the user approves the exact canonical still.
- `website.status` cannot become `ready` until voice, caption, and visual are `approved`.
- Keep the approved caption verbatim in the caption file; do not rewrite it in the website repo.
- Use the canonical still on the article page and preserve its native aspect ratio.
- Use MP4 for website motion when available; retain GIF for LinkedIn.
- Work in the website repo on a `codex/*` branch, verify desktop/mobile, and use Vercel preview before production.

## Resource Decision

Build a resource only when the destination adds material utility beyond the LinkedIn post **and**
the tension has repeated or its enduring use is clear. Decide
with these questions, without a numeric threshold:

1. What real task can the reader complete or inspect with it?
2. Does a downloadable or interactive surface improve that task beyond the on-platform explanation?
3. Can the first use begin safely with public/licensed inputs, blank reader input, an explicitly
   labelled simulation, or no data?
4. What validation and human decision boundary does the task require?
5. What is the smallest useful package: a one-page reference, template, workbook, calculator,
   workflow pack, dashboard, or interactive tool?

Record `full resource`, `lightweight resource`, or `not warranted` with the reason in
`resource-plan.md`. A post does not fail because no resource is warranted.

## Resource Standard

An eligible pack contains only what its reader job requires, including:

- direct ZIP download with no email, account, or newsletter gate;
- a concise explanation or field guide sized to the task;
- one safe first use or equivalent;
- public or licensed inputs, a blank user-input mode, or an explicitly labelled simulation when simulation itself is the chosen content mode;
- reusable instructions or working assets when they add value;
- the checks and validation appropriate to the method;
- version, limitations, provenance, and the human decision boundary in a form proportionate to the package.

The website resource page should demonstrate the method before the download button, state what is inside, and name the first safe run.

## Final Channel Verification

### Substack

- stable AI-use transparency appears in the Substack About page or publication footer, with
  post-level disclosure where an explicit simulation or materially AI-generated element could be misunderstood.

### Website

- schema-version-2 voice provenance and QA have passed;
- published article uses the approved title, caption, still, and motion;
- native still ratio is preserved on desktop and mobile;
- MP4 autoplays muted/looped/playsInline and has the still as poster;
- resource route returns the current versioned ZIP with attachment headers;
- extracted ZIP passes its first-run and checksum verification;
- no email or account form blocks the download;
- Vercel preview is inspected before production merge.
