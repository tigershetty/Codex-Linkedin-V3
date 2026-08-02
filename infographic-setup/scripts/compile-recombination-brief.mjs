#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function escapeCell(value) {
  return String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\s+/g, ' ')
    .trim();
}

function args(argv) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      result._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      result[key] = next;
      index += 1;
    } else {
      result[key] = true;
    }
  }
  return result;
}

function annotation(result, field) {
  return result.annotations?.[field]?.value ?? '';
}

function candidateRows(results) {
  return results.map((result) => {
    const mechanics = [
      annotation(result, 'hook_type'),
      annotation(result, 'visual_structure'),
      annotation(result, 'artifact_type'),
      annotation(result, 'cta'),
    ].filter(Boolean).join('; ');
    const assets = (result.creative_assets?.top100_references ?? [])
      .map((asset) => asset.local_asset_path ?? `Top-100 ref ${asset.reference_number}`)
      .join('; ');
    const source = result.canonical_url ? `[open](${result.canonical_url})` : '';
    const context = result.annotations?.promise?.value || result.observed_caption_excerpt || result.annotations?.job_to_be_done?.value || '';
    return `| ${escapeCell(result.reference_id)} | ${escapeCell(result.creator)} | ${source} | ${escapeCell(result.observed_hook)} | ${escapeCell(context)} | ${escapeCell(mechanics)} | ${escapeCell(assets)} | ${result.retrieval_score} | ${escapeCell(result.visual_use_guardrail)} |`;
  }).join('\n');
}

const options = args(process.argv.slice(2));
const candidatesPath = resolve(process.cwd(), options.candidates ?? options._[0] ?? '');
if (!options.candidates && !options._[0]) {
  process.stderr.write('Usage: node scripts/compile-recombination-brief.mjs --candidates <reference-candidates.json> --output <recombination-brief.md>\n');
  process.exit(2);
}
if (!existsSync(candidatesPath)) {
  process.stderr.write(`Missing candidates file: ${candidatesPath}\n`);
  process.exit(1);
}

const candidates = JSON.parse(readFileSync(candidatesPath, 'utf8'));
const outputPath = resolve(
  process.cwd(),
  options.output ?? `${dirname(candidatesPath)}/recombination-brief.md`,
);

const conceptRows = Array.from({ length: 10 }, (_, index) =>
  `| ${index + 1} |  |  |  |  |  |  |`,
).join('\n');

const brief = `# Recombination Brief — ${candidates.content_id || candidates.query_id}

**Content ID:** ${candidates.content_id ?? ''}
**Query ID:** ${candidates.query_id ?? ''}
**Query SHA-256:** ${candidates.query_sha256 ?? ''}
**Genome snapshot:** ${candidates.snapshot_id ?? ''}
**Genome snapshot SHA-256:** ${candidates.snapshot_sha256 ?? ''}
**Primary reader and work moment:** ${candidates.query_contract?.reader_decision ?? ''}
**Care statement:** ${candidates.query_contract?.care_statement ?? ''}
**Possible content modes:** ${(candidates.query_contract?.content_modes ?? []).join(', ')}

## Curated Reference Shortlist

| Reference ID | Creator | Source | Observed hook | Promise / argument context | First-pass mechanics | Local asset | Fit score | Visual guardrail |
|---|---|---|---|---|---|---|---:|---|
${candidateRows(candidates.results ?? [])}

## Tiger Transfer Precedents

| Reference ID | Observed hook | First-pass mechanics | Fit score |
|---|---|---|---:|
${(candidates.tiger_precedents ?? []).map((result) => `| ${escapeCell(result.reference_id)} | ${escapeCell(result.observed_hook)} | ${escapeCell([annotation(result, 'hook_type'), annotation(result, 'artifact_type')].filter(Boolean).join('; '))} | ${result.retrieval_score} |`).join('\n') || '|  |  |  |  |'}

Inspect the actual image before selecting a comprehension atom. A preview flag is not a verified
visual annotation.

## Creative Atoms

| Reference ID | Creative element IDs | Attention atom | Argument atom | Visual atom | Utility atom | Bridge atom | Anti-copy boundary |
|---|---|---|---|---|---|---|---|
|  | CE-... |  |  |  |  |  |  |

## Ten Concepts

Change the argument, visual object, utility, or bridge. Headline-only variants do not count.

| # | Concept name | Reader tension | Dominant creative move | Content mode | Useful payoff | Reference atoms combined |
|---:|---|---|---|---|---|---|
${conceptRows}

## Three Developed Directions

Use three genuinely different families. Utility, visual idea, and narrative are a useful default,
not a quota.

### Direction A

- Concept:
- Reader promise:
- Opening:
- Visual object and eye path:
- Useful object:
- Caption arc:
- Bridge:
- Claim modes and support route:
- Why it is original:

### Direction B

- Concept:
- Reader promise:
- Opening:
- Visual object and eye path:
- Useful object:
- Caption arc:
- Bridge:
- Claim modes and support route:
- Why it is original:

### Direction C

- Concept:
- Reader promise:
- Opening:
- Visual object and eye path:
- Useful object:
- Caption arc:
- Bridge:
- Claim modes and support route:
- Why it is original:

## Selection

**Selected direction:**
**Why it wins:**
**3-second problem / promise:**
**10-second insight:**
**30-second useful action:**
**Coherence rationale:**
**What the caption adds:**
**What the visual provides:**

## Reference Bundle Handoff

**reference-bundle.json status:** draft / ready
**Attention reference:**
**Comprehension reference:**
**Utility reference:**
**Bridge reference:**
**Tiger precedents:**
**Source visual inspection notes:**
`;

writeFileSync(outputPath, brief, 'utf8');
process.stdout.write(`Wrote ${outputPath}\n`);
