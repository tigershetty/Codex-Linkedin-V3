# Tiger Source Gate v1

**Version:** 1.0

**Date:** 2026-07-28

**Status:** Active authenticity and provenance control for LinkedIn, Substack, and website publishing

## Purpose

Tiger's voice cannot be created from style rules alone. Every published piece needs a traceable distinction between:

- what Tiger directly said or approved;
- what public evidence supports;
- what Codex inferred or drafted;
- what must remain private.

This gate prevents researched or AI-assisted writing from inventing experience, opinions, results, credentials, or workplace details and then presenting them as Tiger's own.

## Canonical Files

- `tiger-voice.md` defines the stable Voice DNA and hard rules.
- `references/tiger-voice-bank.md` stores only approved beliefs, corrections, authority claims, and sample paths.
- `data/{week}/{slug}/tiger-source.md` records the source and public-use decision for one post or linked content cluster.
- `research-brief.md` remains the source of truth for public facts, numbers, and current product claims.
- `linkedin-caption.md` or the Substack draft contains the final source map and approval record.
- `publish-manifest.json` blocks a schema-v2 handoff until provenance, voice QA, and Tiger approval pass.

## Evidence Classes

| Class | Meaning | Permitted language |
|---|---|---|
| Firsthand experience | Tiger directly did, observed, led, tested, or learned this | First person only when the exact claim maps to an approved source ID |
| Professional judgment | Tiger's interpretation based on his experience or analysis | Attribute as a view, reflection, question, or decision rule |
| Hypothesis | A proposition worth testing that is not yet established | Use uncertainty language and name what evidence would change the view |
| Public fact | A claim supported by public evidence | Trace to `research-brief.md`; do not convert it into personal experience |
| AI-assisted inference | A connection suggested during research or drafting | Treat as unapproved until Tiger accepts, rejects, or reframes it |

## Source Modes

Every published piece uses one mode and records it in `tiger-source.md` and the schema-v2 publish manifest.

1. **`fresh`**: a new voice memo, typed note, live answer, or direct edit from Tiger.
2. **`approved-bank`**: a reusable belief, correction, authority claim, or sample already approved in `tiger-voice-bank.md`.
3. **`research-led`**: the piece begins with public evidence. It may contain a Tiger-approved interpretation, but it cannot claim that Tiger or his team built, used, observed, or achieved something unless a separate approved source supports that claim.

A single fresh weekly source note may support several related LinkedIn posts when each post names the source ID and the specific statement used. A Substack flagship or any piece built around a personal story requires fresh Tiger input.

## Status Sequence

```text
captured -> extracted -> public-use approved -> used in draft
         -> provenance QA passed -> Tiger voice approved
         -> caption approved -> publish handoff
```

Approval is explicit. A useful source is not automatically public-safe, a voice-QA pass is not caption approval, and caption approval does not approve a later rewrite.

## Operating Flow

### 1. Capture

Create `tiger-source.md` from `templates/tiger-source-note-template.md` before drafting a flagship piece. Give every raw input a stable ID such as `TS-20260728-01`.

Capture Tiger's answers to these prompts:

- What caught my attention?
- What are people misunderstanding?
- Where would this fail in practice?
- What would I inspect or decide first?
- Who should own the decision?
- What am I still uncertain about?

Raw audio and private transcripts should remain outside the version-controlled repository by default. The committed source note records the locator, date, format, optional checksum, and only the approved public-safe excerpts needed for the piece.

### 2. Extract And Classify

Preserve Tiger's raw wording separately from the edited interpretation. For every candidate statement, record:

- source ID and exact location;
- evidence class;
- whether it is public-safe;
- which channels may use it;
- whether it is approved verbatim, approved in meaning, restricted, or rejected.

If a statement contains an employer, colleague, supplier, customer, internal system, operating number, result, or confidential process, its default status is `restricted` until Tiger explicitly approves public use.

### 3. Draft

Codex may research, calculate, challenge, structure, and edit. It must not:

- invent a personal anecdote or quote;
- turn a public example into Tiger's lived experience;
- strengthen a tentative view into certainty;
- infer a credential, result, team practice, or employer claim;
- insert restricted operational detail because it makes the post more specific.

If no personal source exists, write the piece as analysis. Specificity should come from the evidence, method, artifact, calculation, or decision boundary rather than invented intimacy.

### 4. Provenance QA

Before voice approval:

- map every first-person experience, result, credential, and employer claim to an approved source ID;
- map public facts and numbers to `research-brief.md`;
- separate Tiger's judgment from sourced fact;
- confirm that the draft preserves uncertainty and failure boundaries;
- remove or generalise restricted workplace details;
- confirm that synthetic data, simulated outcomes, and AI-generated visuals are labelled where relevant.

### 5. Learn From Corrections

After Tiger edits a flagship draft, add no more than three to five high-signal corrections to `tiger-voice-bank.md`. Record the AI wording, Tiger's edit, and why the change matters.

Do not add untouched AI drafts, unapproved suggestions, or one-off corrections to the bank. Promote a pattern into `tiger-voice.md` only after Tiger explicitly confirms it; repeated evidence across three approved samples is the preferred threshold.

## AI-Use Transparency

Use one stable disclosure in the Substack About page or publication footer:

> I use AI to help locate sources, test calculations, build artifacts, and challenge drafts. The practical judgment, claims, and final wording are reviewed and approved by me.

LinkedIn posts do not need to repeat this statement mechanically. Add a post-level disclosure when AI generated a material visual, dataset, simulation, result, or other element whose origin a reader could reasonably misunderstand.

## Pass Criteria

A piece passes only when:

- `tiger-source.md` exists and its public-use decision is complete;
- one source mode is recorded;
- all first-person claims are source-mapped;
- all public facts remain traceable to the research brief;
- the piece includes a Tiger-approved judgment;
- personal or employer detail is explicitly public-safe;
- provenance QA and voice QA both pass;
- Tiger approves the final wording;
- the AI-disclosure decision is recorded;
- the schema-v2 publish manifest records `voice.status: approved`.
