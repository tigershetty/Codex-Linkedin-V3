#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import {
  MANIFEST_RELATIVE_PATH,
  SETUP_ROOT,
  readJson,
  sha256,
  stableStringify,
} from './lib/creative-genome.mjs';

const folder = process.argv[2];
const outArgIndex = process.argv.indexOf('--out');
const outName = outArgIndex >= 0 ? process.argv[outArgIndex + 1] : 'gpt-image-2-prompt-compiled.md';

if (!folder || (outArgIndex >= 0 && !outName)) {
  console.error('Usage: node scripts/compile-gpt-image-prompt.mjs data/{week}/{slug} [--out gpt-image-2-prompt-compiled.md]');
  process.exit(2);
}

const root = resolve(process.cwd());
const dir = resolve(root, folder);
const briefPath = join(dir, 'creative-brief-lite.md');
const contentPath = join(dir, 'content-brief-v2.md');
const bundlePath = join(dir, 'reference-bundle.json');
const queryPath = join(dir, 'reference-query.json');
const candidatesPath = join(dir, 'reference-candidates.json');
const recombinationPath = join(dir, 'recombination-brief.md');
const legacyReferencePath = join(dir, 'reference-learning-card.md');
const outPath = join(dir, outName);

if (!existsSync(briefPath)) {
  console.error(`Missing ${briefPath}`);
  process.exit(1);
}

function readIf(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function parseJsonIf(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    console.error(`Invalid JSON in ${path}: ${error.message}`);
    process.exit(1);
  }
}

function field(markdown, label) {
  if (!markdown) return '';
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`^\\*\\*${escaped}:?\\*\\*\\s*(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

function first(...values) {
  return values.find((value) => String(value ?? '').trim()) ?? '';
}

function plain(value) {
  return String(value ?? '').replace(/`/g, '').trim();
}

function isFilled(value) {
  const text = String(value ?? '').trim();
  const unquoted = text.replace(/`/g, '').trim();
  return Boolean(unquoted)
    && !/^\{[^}]+\}$/.test(unquoted)
    && !/`[^`]+`\s*\/\s*`[^`]+`/.test(text)
    && !/^(todo|tbd|not declared|draft \/ ready)$/i.test(unquoted);
}

function canonicalClaimMode(value) {
  const normalized = plain(value).toLowerCase().replace(/[ -]/g, '_');
  return ({
    framework: 'editorial_explainer',
    sourced_calculation: 'formula_or_method',
    causal: 'comparative_or_causal',
    tiger_judgment: 'tiger_interpretation',
    simulation: 'simulation_or_hypothesis',
  })[normalized] ?? normalized;
}

function assertGenomeCoherence(bundle, query, candidates, content, brief, recombination) {
  if (!bundle) return;
  const errors = [];
  if (bundle.status !== 'ready') errors.push('reference-bundle.json status must be ready before compilation');
  if (query?.status !== 'ready') errors.push('reference-query.json status must be ready before compilation');
  if (query?.query_id === 'RQ-DRAFT') errors.push('reference-query.json must replace the template query_id RQ-DRAFT');
  const compare = (label, values, normalize = plain) => {
    if (!values.every(isFilled)) {
      errors.push(`${label} is missing from one or more required files`);
      return;
    }
    if (new Set(values.map(normalize)).size !== 1) errors.push(`${label} does not match across files`);
  };
  compare('content_id', [
    bundle.content_id,
    query?.content_id,
    candidates?.content_id,
    field(content, 'Content ID'),
    field(recombination, 'Content ID'),
  ]);
  compare('query_id', [bundle.query_id, query?.query_id, candidates?.query_id, field(recombination, 'Query ID')]);
  compare('creative_bundle_id', [
    first(bundle.creative_bundle_id, bundle.bundle_id),
    field(content, 'creative_bundle_id'),
    field(brief, 'creative_bundle_id'),
  ]);
  compare('snapshot_id', [
    bundle.snapshot_id,
    candidates?.snapshot_id,
    field(content, 'Genome snapshot'),
    field(recombination, 'Genome snapshot'),
  ]);
  compare('selected_direction', [bundle.selected_direction, field(brief, 'Selected direction'), field(recombination, 'Selected direction')]);
  compare('claim_mode', [bundle.claim_mode, field(content, 'Claim mode'), field(brief, 'Claim mode')], canonicalClaimMode);
  const candidateIds = new Set((candidates?.results ?? []).map((result) => result.reference_id));
  const missingReferences = (bundle.references ?? [])
    .map((reference) => reference.reference_id)
    .filter((referenceId) => !candidateIds.has(referenceId));
  if (missingReferences.length) errors.push(`bundle references are absent from candidates.results: ${missingReferences.join(', ')}`);
  const tigerCandidateIds = new Set((candidates?.tiger_precedents ?? []).map((result) => result.reference_id));
  const missingPrecedents = (bundle.tiger_precedent_ids ?? [])
    .filter((referenceId) => !tigerCandidateIds.has(referenceId));
  if (missingPrecedents.length) errors.push(`Tiger precedents are absent from candidates.tiger_precedents: ${missingPrecedents.join(', ')}`);
  if (!candidates?.query_contract || typeof candidates.query_contract !== 'object') {
    errors.push('reference-candidates.json is missing query_contract');
  } else if (query && stableStringify(candidates.query_contract, 0) !== stableStringify({
    care_statement: query.care_statement,
    content_modes: query.content_modes,
    reader_decision: query.reader_decision,
  }, 0)) {
    errors.push('reference-candidates.json query_contract does not match reference-query.json');
  }
  if (bundle.creative_bundle_id) {
    const atoms = (bundle.references ?? []).flatMap((reference) => reference.atoms ?? []);
    if (!atoms.length || atoms.some((atom) => typeof atom !== 'object'
      || !allFilledAtom(atom))) {
      errors.push('canonical bundles require structured creative atoms with ID, type, source mechanism, and adaptation');
    }
  }
  const manifest = readJson(resolve(SETUP_ROOT, MANIFEST_RELATIVE_PATH));
  if (query && candidates?.query_sha256 !== sha256(stableStringify(query, 0))) {
    errors.push('reference-candidates.json query_sha256 does not match reference-query.json');
  }
  if (candidates?.snapshot_id !== manifest.snapshot.id) {
    errors.push('reference-candidates.json snapshot_id does not match the active manifest');
  }
  if (candidates?.snapshot_sha256 !== manifest.snapshot.sha256) {
    errors.push('reference-candidates.json snapshot_sha256 does not match the active manifest');
  }
  if (errors.length) {
    console.error(`Creative package coherence failed:\n- ${errors.join('\n- ')}`);
    process.exit(1);
  }
  if (!bundle.creative_bundle_id && bundle.bundle_id) {
    console.warn('WARN reference-bundle.json uses legacy bundle_id; migrate it to creative_bundle_id.');
  }
}

function allFilledAtom(atom) {
  return [atom.creative_element_id, atom.atom_type, atom.source_mechanism, atom.adaptation].every(isFilled);
}

function splitList(value) {
  return String(value ?? '')
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

function requireValue(label, value) {
  if (!isFilled(value)) {
    console.error(`Missing required creative brief field: ${label}`);
    process.exit(1);
  }
}

function sentence(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function bundleAssembly(bundle) {
  if (!bundle?.references?.length) return '';
  return bundle.references.map((reference) => {
    const roles = reference.roles?.join(', ') || 'unspecified role';
    const atoms = reference.atoms?.map((atom) => {
      if (typeof atom === 'string') return atom;
      return `${atom.creative_element_id} [${atom.atom_type}] ${atom.source_mechanism} -> ${atom.adaptation}`;
    }).join('; ') || 'atom not named';
    const inspection = reference.visual_claim_status || 'inspection status not declared';
    return `- ${roles}: ${reference.reference_id} -> ${atoms}. Visual inspection: ${inspection}`;
  }).join('\n');
}

function bundleBoundaries(bundle) {
  if (!bundle?.references?.length) return '';
  return bundle.references
    .map((reference) => `- ${reference.reference_id}: ${reference.anti_copy_boundary || 'Do not reproduce the source end to end.'}`)
    .join('\n');
}

const brief = readIf(briefPath);
const content = readIf(contentPath);
const recombination = readIf(recombinationPath);
const legacyReference = readIf(legacyReferencePath);
const bundle = parseJsonIf(bundlePath);
const query = parseJsonIf(queryPath);
const candidates = parseJsonIf(candidatesPath);
assertGenomeCoherence(bundle, query, candidates, content, brief, recombination);
const slug = first(field(brief, 'Slug'), basename(dir));

const readerContract = bundle?.reader_contract ?? {};
const data = {
  week: field(brief, 'Week'),
  slug,
  lane: first(field(brief, 'Production lane'), field(brief, 'Series')),
  bundleId: first(field(brief, 'creative_bundle_id'), bundle?.creative_bundle_id, bundle?.bundle_id),
  audienceSegment: field(brief, 'Audience segment'),
  audienceJob: field(brief, 'Audience job'),
  afterReading: field(brief, 'After reading, they can'),
  moment: field(brief, 'Meeting/task/career moment'),
  careStatement: first(field(brief, 'Care statement'), field(content, 'Care statement')),
  selectedDirection: first(
    field(brief, 'Selected direction'),
    bundle?.selected_direction,
    field(recombination, 'Selected direction'),
  ),
  coherence: first(
    field(brief, 'Coherence rationale'),
    bundle?.coherence_rationale,
    field(recombination, 'Coherence rationale'),
  ),
  attentionAtom: field(brief, 'Attention atom'),
  comprehensionAtom: field(brief, 'Comprehension atom'),
  utilityAtom: field(brief, 'Utility atom'),
  bridgeAtom: field(brief, 'Bridge atom'),
  antiCopy: field(brief, 'Anti-copy boundary'),
  openingClaim: first(field(brief, 'Opening claim'), readerContract.problem_3s),
  stopReason: field(brief, 'Why this stops the right reader'),
  action30: first(field(brief, 'Useful action in 30 seconds'), readerContract.action_30s),
  visualMove: field(brief, 'One-sentence visual move'),
  metaphor: field(brief, 'Dominant shape/metaphor'),
  eyePath: field(brief, 'Eye path'),
  artifact: field(brief, 'Reusable artifact on image'),
  valueDensity: field(brief, 'Value-density layer'),
  mobilePlan: field(brief, 'Mobile 3/10/30 plan'),
  heading: field(brief, 'Heading'),
  subheading: field(brief, 'Subheading'),
  labels: field(brief, 'Labels'),
  textPlacementMap: field(brief, 'Text placement map'),
  bottomQuestion: field(brief, 'Bottom question'),
  footer: field(brief, 'Footer/chrome'),
  claimMode: first(field(brief, 'Claim mode'), field(content, 'Claim mode'), bundle?.claim_mode),
  supportLedger: first(field(brief, 'Support ledger / claim IDs'), field(content, 'support_ledger')),
  numbers: field(brief, 'Numbers/data'),
  fixturesExcluded: first(
    field(brief, 'Internal test fixtures excluded'),
    field(content, 'Internal fixtures excluded from public proof'),
  ),
  brandExpression: first(field(brief, 'Visual family selected'), 'explicitly selected visual family'),
  brandFrame: first(field(brief, 'Signature guardrail'), 'references/creative-review/signature-system-v3.md'),
  brandDirection: first(
    field(brief, 'Brand direction'),
    'Product-grade clarity: derive material, type treatment, palette and density from the explicitly selected visual family, reader tension, and signature guardrail. Do not inherit a legacy palette or scene treatment by default.',
  ),
  logoPlan: field(brief, 'Logo plan'),
  logoAssets: field(brief, 'Logo/asset references'),
  officialAssets: field(brief, 'Official tool assets, if meaningful'),
  renderer: first(field(brief, 'Renderer'), 'GPT Image 2'),
  compositionFreedom: field(brief, 'Composition freedom'),
  deterministicFinish: field(brief, 'Deterministic finishing required'),
};

[
  ['Audience segment', data.audienceSegment],
  ['After reading, they can', data.afterReading],
  ['One-sentence visual move', data.visualMove],
  ['Heading', data.heading],
  ['Labels', data.labels],
  ['Text placement map', data.textPlacementMap],
  ['Logo/asset references', data.logoAssets],
].forEach(([label, value]) => requireValue(label, value));

const labels = splitList(data.labels);
const labelLines = labels.map((label) => `- "${label}"`).join('\n');
const assembly = bundleAssembly(bundle) || [
  data.attentionAtom && `- Attention: ${data.attentionAtom}`,
  data.comprehensionAtom && `- Comprehension: ${data.comprehensionAtom}`,
  data.utilityAtom && `- Utility: ${data.utilityAtom}`,
  data.bridgeAtom && `- Bridge: ${data.bridgeAtom}`,
].filter(Boolean).join('\n') || '- Legacy package: use the declared reference mechanic without copying its composition.';
const boundaries = bundleBoundaries(bundle)
  || (data.antiCopy ? `- ${data.antiCopy}` : '')
  || (field(legacyReference, 'What to avoid copying') ? `- ${field(legacyReference, 'What to avoid copying')}` : '- Do not reproduce a source post end to end.');
const legacyBlock = !bundle && legacyReference
  ? `\nLEGACY REFERENCE FALLBACK:\n- Visual mechanics: ${first(field(legacyReference, 'Visual mechanics to borrow'), 'not declared')}\n- Adaptation: ${first(field(legacyReference, 'Supply-chain translation'), field(legacyReference, 'Reference lesson for GPT Image 2'), 'not declared')}\n`
  : '';

const prompt = `# GPT Image 2 Prompt — ${data.slug}

**Compiled by:** \`scripts/compile-gpt-image-prompt.mjs\`
**Week:** ${data.week}
**Production lane:** ${data.lane}
**Creative bundle:** ${data.bundleId || (bundle ? first(bundle.creative_bundle_id, bundle.bundle_id) : 'legacy fallback')}
**Selected direction:** ${data.selectedDirection || 'declared in the creative brief'}

## Prompt

TASK:
Create an original editorial LinkedIn visual for Shetty's Desk. Preserve the selected creative
direction and exact meaning; use the renderer for composition, not for inventing facts or copy.

READER AND PAYOFF:
- Reader: ${data.audienceSegment}
- Work moment: ${data.moment || 'the declared supply-chain workflow'}
- Job: ${data.audienceJob || 'use the visual in a real decision'}
- Why they care: ${data.careStatement || data.stopReason || data.openingClaim}
- After reading: ${data.afterReading}

READER CONTRACT:
- 3 seconds: ${first(readerContract.problem_3s, data.openingClaim, data.metaphor)}
- 10 seconds: ${first(readerContract.insight_10s, data.coherence, data.visualMove)}
- 30 seconds: ${first(readerContract.action_30s, data.action30, data.artifact)}

CREATIVE ASSEMBLY:
${assembly}

COHERENCE:
${data.coherence || 'Every selected mechanism must reinforce one reader promise and one visual argument.'}

ANTI-COPY BOUNDARIES:
${boundaries}
${legacyBlock}
VISUAL ARGUMENT:
${data.visualMove}
- Dominant object: ${data.metaphor || 'one clear hero object'}
- Eye path: ${data.eyePath || 'hero -> explanation -> useful action'}
- Useful object: ${data.artifact || data.action30 || 'the declared reader action'}
- Supporting detail: ${data.valueDensity || 'Only details that improve comprehension or use.'}
- Mobile contract: ${data.mobilePlan || 'Promise at 3 seconds, insight at 10 seconds, useful action at 30 seconds.'}

CONTENT — EXACT STRINGS:
- Heading: "${data.heading}"
${data.subheading ? `- Subheading: "${data.subheading}"\n` : ''}- Labels:
${labelLines}
${data.bottomQuestion ? `- Bottom question: "${data.bottomQuestion}"\n` : ''}${data.footer ? `- Footer/chrome: "${data.footer}"\n` : ''}
TEXT PLACEMENT MAP:
${data.textPlacementMap}

TEXT LOCK:
Render only the supplied public-facing strings, with exact spelling and casing, in their assigned
homes. Use lines, shapes, spacing, symbols, or approved icons for additional navigation. Keep every
label legible in a mobile LinkedIn feed.

CLAIM INTEGRITY:
- Claim mode: ${data.claimMode || 'not declared'}
- Support ledger / claim IDs: ${data.supportLedger || 'not required for a purely editorial or framework claim; otherwise missing'}
- Numbers/data: ${data.numbers || 'none declared'}
- Internal fixtures excluded from public proof: ${data.fixturesExcluded || 'not declared'}
Use only supported facts, formulas, relationships, outcomes, and first-person authority. If a public
simulation was selected, label it visibly and do not present it as an observed result.

BRAND AND ASSETS:
- Brand expression: ${data.brandExpression}
- Brand frame: ${data.brandFrame}
- Brand direction: ${data.brandDirection}
- Logo plan: ${data.logoPlan || 'Reserve one clean zone for the exact Shetty\'s Desk logo asset.'}
- Owned assets: ${data.logoAssets}
${data.officialAssets ? `- Official tool assets: ${data.officialAssets}\n` : ''}Use the selected visual family and signature guardrail as the identity system. References contribute
mechanisms and structure, not another creator's brand. Use the exact logo asset; do not redraw it.

COMPOSITION FREEDOM:
${data.compositionFreedom || 'Choose the clearest original arrangement for the selected direction while preserving one deliberate reader response, one reading route, and the exact content.'}
Selected renderer: ${data.renderer}. Deterministic finishing: ${data.deterministicFinish || 'use when exact text, logos, formulas, or geometry need correction'}.

HARD RISKS TO AVOID:
Copied end-to-end composition, generic card-grid output, several competing heroes, invented words or
numbers, model-redrawn logos, incorrect formulas or relationships, and decoration without a reader job.
`;

writeFileSync(outPath, prompt, 'utf8');
console.log(`Wrote ${outPath.replace(`${root}/`, '')}`);
