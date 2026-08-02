#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  MANIFEST_RELATIVE_PATH,
  SETUP_ROOT,
  readJson,
  sha256,
  stableStringify,
} from './lib/creative-genome.mjs';

const folder = process.argv[2];

if (!folder) {
  console.error('Usage: node scripts/audit-visual-package.mjs data/{week}/{slug}');
  process.exit(2);
}

const root = resolve(process.cwd());
const dir = resolve(root, folder);

function file(name) {
  return join(dir, name);
}

function has(name) {
  return existsSync(file(name));
}

function read(name) {
  return has(name) ? readFileSync(file(name), 'utf8') : '';
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

function allFilled(values) {
  return values.every(isFilled);
}

function parseJson(name) {
  if (!has(name)) return { value: null, error: '' };
  try {
    return { value: JSON.parse(read(name)), error: '' };
  } catch (error) {
    return { value: null, error: error.message };
  }
}

function pngDimensions(name) {
  if (!has(name)) return null;
  const buffer = readFileSync(file(name));
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function logoAssetRefsValid(value) {
  const refs = [...String(value ?? '').matchAll(/`([^`]+)`/g)].map((match) => match[1]);
  if (!refs.length) return false;
  return refs.every((ref) => existsSync(resolve(root, ref)) || existsSync(resolve(root, '..', ref)));
}

function htmlControlRequired(brief) {
  return /^\*\*HTML control needed\?\*\*\s*yes\s*$/im.test(brief);
}

function checkboxReviewComplete(review) {
  const boxes = review.match(/^- \[[ xX]\]/gm) ?? [];
  return boxes.length > 0 && boxes.every((box) => /^- \[[xX]\]/.test(box));
}

function conceptBoardStatus(markdown) {
  const section = markdown.match(/## Ten Concepts[\s\S]*?\n(.*?)(?=\n## Three Developed Directions|$)/s)?.[1] ?? '';
  const rows = new Map();
  for (const line of section.split('\n')) {
    if (!/^\|\s*\d{1,2}\s*\|/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    const index = Number(cells[0]);
    if (index < 1 || index > 10 || rows.has(index)) continue;
    rows.set(index, cells.slice(1, 7));
  }
  const complete = rows.size === 10
    && Array.from({ length: 10 }, (_, index) => rows.has(index + 1)).every(Boolean)
    && [...rows.values()].every((cells) => cells.length === 6 && cells.every(isFilled));
  const signatures = new Set(
    [...rows.values()].map((cells) => `${plain(cells[2]).toLowerCase()}|${plain(cells[5]).toLowerCase()}`),
  );
  return { complete: complete && signatures.size >= 3, signatures: signatures.size };
}

function directionValues(markdown, letter) {
  const section = markdown.match(new RegExp(`### Direction ${letter}\\n([\\s\\S]*?)(?=\\n### Direction [A-C]|\\n## Selection|$)`))?.[1] ?? '';
  const required = [
    'Concept',
    'Reader promise',
    'Opening',
    'Visual object and eye path',
    'Useful object',
    'Caption arc',
    'Bridge',
    'Claim modes and support route',
    'Why it is original',
  ];
  return Object.fromEntries(required.map((label) => {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return [label, section.match(new RegExp(`^- ${escaped}:\\s*(.*)$`, 'm'))?.[1] ?? ''];
  }));
}

function directionComplete(markdown, letter) {
  return Object.values(directionValues(markdown, letter)).every(isFilled);
}

function directionSignatureCount(markdown) {
  return new Set(['A', 'B', 'C'].map((letter) => {
    const values = directionValues(markdown, letter);
    return [
      values['Visual object and eye path'],
      values['Useful object'],
      values.Bridge,
      values.Opening,
    ].map((value) => plain(value).toLowerCase()).join('|');
  })).size;
}

function recombinationReviewPasses(review, bundle) {
  const section = review.match(/## Recombination Review\s*\n([\s\S]*?)(?=\n## Integrity|$)/i)?.[1] ?? '';
  const decisions = new Map();
  const elementIds = new Map();
  for (const line of section.split('\n')) {
    if (!/^\|/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => plain(cell));
    const role = cells[0]?.toLowerCase();
    if (['attention', 'comprehension', 'utility', 'bridge'].includes(role)) {
      decisions.set(role, cells.at(-1)?.toLowerCase());
      elementIds.set(role, cells[1]);
    }
  }
  const selectedElementIds = new Set((bundle?.references ?? [])
    .flatMap((reference) => reference.atoms ?? [])
    .filter((atom) => typeof atom === 'object')
    .map((atom) => atom.creative_element_id));
  return ['attention', 'comprehension', 'utility', 'bridge'].every((role) =>
    decisions.get(role) === 'pass' && selectedElementIds.has(elementIds.get(role)),
  );
}

function legacyReviewComplete(review) {
  const section = review.match(/##\s+\d+\.\s+Rendered Asset QA\s*\n([\s\S]*?)(?:\n##\s+\d+\.|$)/i)?.[1] ?? '';
  const boxes = section.match(/^- \[[ xX]\]/gm) ?? [];
  return boxes.length > 0 && boxes.every((box) => /^- \[[xX]\]/.test(box));
}

function publishDecisionReady(review, newReview) {
  const decision = plain(field(review, 'Publish decision')).toLowerCase();
  if (!decision) return false;
  if (newReview) return decision === 'approve';
  return /publish|selected|current best/.test(decision)
    && !/regenerate|revise prompt|use html control/.test(decision);
}

function normalizedClaimMode(value) {
  const normalized = plain(value).toLowerCase().replace(/[ -]/g, '_');
  return ({
    framework: 'editorial_explainer',
    sourced_calculation: 'formula_or_method',
    causal: 'comparative_or_causal',
    tiger_judgment: 'tiger_interpretation',
    simulation: 'simulation_or_hypothesis',
  })[normalized] ?? normalized;
}

function supportRequired(mode) {
  return [
    'sourced_fact',
    'sourced_calculation',
    'documented_case',
    'causal',
    'public_data_analysis',
    'formula_or_method',
    'tool_workflow',
    'comparative_or_causal',
    'mixed',
  ].includes(normalizedClaimMode(mode));
}

function supportPresent(content, brief) {
  const declared = first(field(brief, 'Support ledger / claim IDs'), field(content, 'support_ledger'));
  const declaredIds = [...plain(declared).matchAll(/\bCL-[A-Za-z0-9_-]+\b/g)].map((match) => match[0]);
  const rows = new Map();
  for (const line of content.split('\n')) {
    if (!/^\|/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => plain(cell));
    const id = cells.find((cell) => /^CL-[A-Za-z0-9_-]+$/.test(cell));
    if (!id) continue;
    rows.set(id, cells.at(-1)?.toLowerCase() ?? '');
  }
  const ids = declaredIds.length ? declaredIds : [...rows.keys()];
  return ids.length > 0 && ids.every((id) => rows.get(id) === 'supported');
}

function coherenceIssues(bundle, query, candidates, content, brief, recombination) {
  const issues = [];
  const compare = (label, values, normalize = plain) => {
    if (!allFilled(values)) {
      issues.push(`${label} is missing from one or more required files`);
      return;
    }
    if (new Set(values.map(normalize)).size !== 1) issues.push(`${label} does not match across files`);
  };
  compare('content_id', [
    bundle?.content_id,
    query?.content_id,
    candidates?.content_id,
    field(content, 'Content ID'),
    field(recombination, 'Content ID'),
  ]);
  compare('query_id', [bundle?.query_id, query?.query_id, candidates?.query_id, field(recombination, 'Query ID')]);
  compare('creative_bundle_id', [
    first(bundle?.creative_bundle_id, bundle?.bundle_id),
    field(content, 'creative_bundle_id'),
    field(brief, 'creative_bundle_id'),
  ]);
  compare('snapshot_id', [
    bundle?.snapshot_id,
    candidates?.snapshot_id,
    field(content, 'Genome snapshot'),
    field(recombination, 'Genome snapshot'),
  ]);
  compare('selected_direction', [bundle?.selected_direction, field(brief, 'Selected direction'), field(recombination, 'Selected direction')]);
  compare('claim_mode', [bundle?.claim_mode, field(content, 'Claim mode'), field(brief, 'Claim mode')], normalizedClaimMode);
  const candidateIds = new Set((candidates?.results ?? []).map((result) => result.reference_id));
  const missingReferences = (bundle?.references ?? [])
    .map((reference) => reference.reference_id)
    .filter((referenceId) => !candidateIds.has(referenceId));
  if (missingReferences.length) issues.push(`bundle references are absent from candidates.results: ${missingReferences.join(', ')}`);
  const tigerCandidateIds = new Set((candidates?.tiger_precedents ?? []).map((result) => result.reference_id));
  const missingPrecedents = (bundle?.tiger_precedent_ids ?? [])
    .filter((referenceId) => !tigerCandidateIds.has(referenceId));
  if (missingPrecedents.length) issues.push(`Tiger precedents are absent from candidates.tiger_precedents: ${missingPrecedents.join(', ')}`);
  if (!candidates?.query_contract || typeof candidates.query_contract !== 'object') {
    issues.push('reference-candidates.json is missing query_contract');
  } else if (query && stableStringify(candidates.query_contract, 0) !== stableStringify({
    care_statement: query.care_statement,
    content_modes: query.content_modes,
    reader_decision: query.reader_decision,
  }, 0)) {
    issues.push('reference-candidates.json query_contract does not match reference-query.json');
  }
  const manifest = readJson(resolve(SETUP_ROOT, MANIFEST_RELATIVE_PATH));
  if (query && candidates?.query_sha256 !== sha256(stableStringify(query, 0))) {
    issues.push('reference-candidates.json query_sha256 does not match reference-query.json');
  }
  if (candidates?.snapshot_id !== manifest.snapshot.id) {
    issues.push('reference-candidates.json snapshot_id does not match the active manifest');
  }
  if (candidates?.snapshot_sha256 !== manifest.snapshot.sha256) {
    issues.push('reference-candidates.json snapshot_sha256 does not match the active manifest');
  }
  return issues;
}

function validateBundleExternally() {
  if (!has('reference-bundle.json')) return { pass: false, detail: 'reference-bundle.json is missing' };
  const parsed = parseJson('reference-bundle.json');
  if (parsed.error) return { pass: false, detail: parsed.error };
  if (parsed.value?.status !== 'ready') return { pass: false, detail: 'reference-bundle.json status must be ready' };
  const validator = join(root, 'scripts', 'validate-reference-bundle.mjs');
  if (!existsSync(validator)) return { pass: false, detail: 'bundle validator is missing' };
  const result = spawnSync(process.execPath, [
    validator,
    '--input',
    relative(root, file('reference-bundle.json')),
  ], {
    cwd: root,
    encoding: 'utf8',
  });
  return {
    pass: result.status === 0,
    detail: (result.stderr || result.stdout || '').trim().split('\n').slice(-3).join(' '),
  };
}

function addCheck(checks, name, pass, fix) {
  checks.push({ name, pass: Boolean(pass), fix });
}

const brief = read('creative-brief-lite.md');
const content = read('content-brief-v2.md');
const recombination = read('recombination-brief.md');
const review = read('visual-output-review.md');
const prompt = read('gpt-image-2-prompt.md');
const compiledPrompt = read('gpt-image-2-prompt-compiled.md');
const parsedBundle = parseJson('reference-bundle.json');
const bundle = parsedBundle.value;
const parsedQuery = parseJson('reference-query.json');
const query = parsedQuery.value;
const parsedCandidates = parseJson('reference-candidates.json');
const candidates = parsedCandidates.value;
const genomeMode = has('reference-bundle.json')
  || has('recombination-brief.md')
  || /^# Creative Brief Lite — Recombination Template/m.test(brief);
const renderer = first(field(brief, 'Renderer'), genomeMode ? '' : 'GPT Image 2');
const imageRenderer = /gpt\s*image|image model/i.test(renderer) || (!renderer && !genomeMode);
const newReview = /## Recombination Review|## Integrity/i.test(review);
const requiresHtmlControl = htmlControlRequired(brief);
const maxLinkedInPhotoBytes = 5 * 1024 * 1024;
const visualInfo = pngDimensions('visual.png');
const linkedInInfo = pngDimensions('visual-linkedin.png');
const claimMode = first(field(brief, 'Claim mode'), field(content, 'Claim mode'), bundle?.claim_mode);
const fixturesExcluded = first(
  field(brief, 'Internal test fixtures excluded'),
  field(content, 'Internal fixtures excluded from public proof'),
);
const identityIssues = genomeMode
  ? coherenceIssues(bundle, query, candidates, content, brief, recombination)
  : [];
const conceptStatus = conceptBoardStatus(recombination);
const distinctDirectionCount = directionSignatureCount(recombination);
const checks = [];

addCheck(checks, 'content brief exists', has('content-brief-v2.md'), 'Add content-brief-v2.md from the active Creative Genome template.');
addCheck(checks, 'creative brief exists', has('creative-brief-lite.md'), 'Add creative-brief-lite.md from the active recombination template.');

if (genomeMode) {
  addCheck(
    checks,
    'retrieval contract files exist and parse',
    has('reference-query.json')
      && has('reference-candidates.json')
      && !parsedQuery.error
      && !parsedCandidates.error
      && query?.status === 'ready'
      && query?.query_id !== 'RQ-DRAFT',
    parsedQuery.error || parsedCandidates.error
      ? `Repair retrieval JSON: ${parsedQuery.error || parsedCandidates.error}`
      : 'Add a ready, non-template reference-query.json and its generated reference-candidates.json.',
  );
  const bundleValidation = parsedBundle.error
    ? { pass: false, detail: parsedBundle.error }
    : validateBundleExternally();
  addCheck(
    checks,
    'ready Creative Genome bundle validates',
    bundleValidation.pass,
    `Repair and validate reference-bundle.json. ${bundleValidation.detail}`.trim(),
  );
  addCheck(
    checks,
    'recombination brief exists',
    has('recombination-brief.md'),
    'Add recombination-brief.md with ten concepts, three directions, and the selected assembly.',
  );
  addCheck(
    checks,
    'ten-concept board is complete and varied',
    conceptStatus.complete,
    `Use unique indices 1-10, fill all six concept fields, and create at least three dominant-move + atom-combination signatures (found ${conceptStatus.signatures}).`,
  );
  addCheck(
    checks,
    'three developed directions are complete',
    ['A', 'B', 'C'].every((letter) => directionComplete(recombination, letter))
      && distinctDirectionCount === 3,
    `Complete three genuinely different directions including Bridge; visual object + useful object + bridge signatures must be unique (found ${distinctDirectionCount}).`,
  );
  addCheck(
    checks,
    'cross-file identity and direction match',
    identityIssues.length === 0,
    identityIssues.join('; ') || 'Align the content ID, bundle ID, snapshot, selected direction, and claim mode across the package.',
  );
  addCheck(
    checks,
    'selected direction is coherent',
    allFilled([
      first(field(brief, 'Selected direction'), bundle?.selected_direction, field(recombination, 'Selected direction')),
      first(field(brief, 'Coherence rationale'), bundle?.coherence_rationale, field(recombination, 'Coherence rationale')),
    ]),
    'Name the selected direction and explain why its atoms reinforce one reader promise.',
  );
  addCheck(
    checks,
    'creative brief carries the reader and visual contract',
    allFilled([
      field(brief, 'Audience segment'),
      field(brief, 'Care statement'),
      field(brief, 'One-sentence visual move'),
      field(brief, 'Dominant shape/metaphor'),
      field(brief, 'Eye path'),
      field(brief, 'Reusable artifact on image'),
      field(brief, 'Mobile 3/10/30 plan'),
    ]),
    'Complete the reader contract, one visual argument, one hero, one eye path, one useful object, and the mobile 3/10/30 plan.',
  );
} else {
  addCheck(
    checks,
    'legacy package has a usable creative mechanic',
    allFilled([
      field(brief, 'Opening claim'),
      field(brief, 'Why this stops the right reader'),
      field(brief, 'One-sentence visual move'),
      field(brief, 'Reusable artifact on image'),
    ]),
    'Complete the legacy creative mechanic or migrate the package to a Creative Genome bundle.',
  );
}

addCheck(
  checks,
  'exact content and placement are locked',
  allFilled([
    field(brief, 'Heading'),
    field(brief, 'Labels'),
    field(brief, 'Text placement map'),
  ]),
  'Lock the exact heading, labels, and each string\'s intended placement home.',
);
addCheck(
  checks,
  'owned and official asset paths resolve',
  logoAssetRefsValid(field(brief, 'Logo/asset references')),
  'Use backticked repo paths for the exact Shetty\'s Desk logo and any meaningful official tool assets.',
);
addCheck(checks, 'creative packet exists', has('creative-packet.md'), 'Run node scripts/compile-creative-packet.mjs data/{week}/{slug}.');
addCheck(
  checks,
  'creative packet carries the selected assembly',
  has('creative-packet.md') && (genomeMode
    ? /## Reader Contract/i.test(read('creative-packet.md'))
      && /## Creative Assembly/i.test(read('creative-packet.md'))
      && /## Claim Integrity/i.test(read('creative-packet.md'))
      && /## Production QA/i.test(read('creative-packet.md'))
    : /## Audience Payoff/i.test(read('creative-packet.md'))
      && /## Exact Text/i.test(read('creative-packet.md'))
      && /## QA Gate/i.test(read('creative-packet.md'))
      || /## Reader Contract/i.test(read('creative-packet.md'))
        && /## Creative Assembly/i.test(read('creative-packet.md'))
        && /## Claim Integrity/i.test(read('creative-packet.md'))
        && /## Production QA/i.test(read('creative-packet.md'))),
  'Regenerate creative-packet.md with the active compiler.',
);

if (imageRenderer) {
  addCheck(checks, 'compiled GPT Image prompt exists', has('gpt-image-2-prompt-compiled.md'), 'Run the GPT Image prompt compiler.');
  addCheck(checks, 'canonical GPT Image prompt exists', has('gpt-image-2-prompt.md'), 'Sync the compiled prompt to gpt-image-2-prompt.md.');
  addCheck(
    checks,
    'prompt carries assembly, exact content, claims, and brand',
    genomeMode
      ? /CREATIVE ASSEMBLY:/i.test(prompt)
        && /TEXT PLACEMENT MAP:/i.test(prompt)
        && /CLAIM INTEGRITY:/i.test(prompt)
        && /BRAND AND ASSETS:/i.test(prompt)
      : /REFERENCE INTELLIGENCE:/i.test(prompt)
        && /TEXT PLACEMENT MAP:/i.test(prompt)
        && /TEXT LOCK:/i.test(prompt)
        && /BRAND:/i.test(prompt)
        || /CREATIVE ASSEMBLY:/i.test(prompt)
          && /TEXT PLACEMENT MAP:/i.test(prompt)
          && /CLAIM INTEGRITY:/i.test(prompt)
          && /BRAND AND ASSETS:/i.test(prompt),
    'Regenerate the prompt so creative freedom cannot invent content, claims, or branding.',
  );
  addCheck(
    checks,
    'compiled and canonical prompts match',
    Boolean(prompt) && prompt === compiledPrompt,
    'Sync gpt-image-2-prompt-compiled.md to gpt-image-2-prompt.md before review.',
  );
}

if (genomeMode) {
  let claimReady = isFilled(claimMode) && isFilled(field(brief, 'Numbers/data'));
  let claimFix = 'Declare the claim mode and numbers/data status.';
  const numbersDeclaration = plain(field(brief, 'Numbers/data')).toLowerCase();
  if (claimReady && (supportRequired(claimMode) || numbersDeclaration === 'source-backed') && !supportPresent(content, brief)) {
    claimReady = false;
    claimFix = 'Map every load-bearing CL ID to a ledger row with exact status supported.';
  }
  if (claimReady && /tiger_(judgment|interpretation)/.test(normalizedClaimMode(claimMode))) {
    const tigerSource = first(
      field(content, 'Source file'),
      field(content, 'Approved source IDs'),
      field(content, 'Tiger judgment'),
    );
    if (!isFilled(tigerSource)) {
      claimReady = false;
      claimFix = 'Add approved Tiger source material for the personal judgment or interpretation.';
    }
  }
  const simulationDeclaration = plain(field(content, 'Public simulation')).toLowerCase();
  const normalizedMode = normalizedClaimMode(claimMode);
  const simulationSelected = /simulation/.test(normalizedMode)
    || simulationDeclaration === 'explicitly selected and visibly labelled'
    || numbersDeclaration === 'explicit-labelled-simulation';
  if (claimReady && simulationSelected) {
    const coherentSimulationMode = /simulation/.test(normalizedMode) || normalizedMode === 'mixed';
    const labelled = simulationDeclaration === 'explicitly selected and visibly labelled'
      && numbersDeclaration === 'explicit-labelled-simulation';
    if (!coherentSimulationMode || !labelled) {
      claimReady = false;
      claimFix = 'Use simulation_or_hypothesis or mixed and label the simulation in both the content and visual contracts.';
    }
  }
  addCheck(checks, 'claim burden is met', claimReady, claimFix);
  addCheck(
    checks,
    'internal fixtures are excluded from public proof',
    simulationSelected
      ? /^yes$/i.test(fixturesExcluded.replace(/`/g, '').trim())
      : /^(yes|not applicable)$/i.test(fixturesExcluded.replace(/`/g, '').trim()),
    'Confirm internal fixtures are excluded from public proof, or mark the check not applicable.',
  );
}

addCheck(checks, 'visual output review exists', has('visual-output-review.md'), 'Complete visual-output-review.md against the rendered asset.');
addCheck(
  checks,
  'output review integrity checks are complete',
  newReview ? checkboxReviewComplete(review) : legacyReviewComplete(review),
  newReview
    ? 'Resolve every Integrity and Creative Quality checkbox before approval.'
    : 'Complete every Rendered Asset QA checkbox in the legacy review.',
);
if (newReview) {
  addCheck(
    checks,
    'review identity and 3/10/30 contract match',
    plain(field(review, 'creative_bundle_id')) === plain(first(bundle?.creative_bundle_id, bundle?.bundle_id))
      && allFilled([
        field(review, 'Visible in 3 seconds'),
        field(review, 'Understood in 10 seconds'),
        field(review, 'Useful in 30 seconds'),
      ]),
    'Match the review creative_bundle_id to the bundle and complete the visible/understood/useful 3/10/30 fields.',
  );
  addCheck(
    checks,
    'all recombination decisions pass',
    recombinationReviewPasses(review, bundle),
    'Use selected creative element IDs and set Attention, Comprehension, Utility, and Bridge decisions to exact pass; option text or revise does not pass.',
  );
  addCheck(
    checks,
    'anti-copy review passes',
    field(review, 'Does the output resemble any one source end to end?').replace(/`/g, '').trim().toLowerCase() === 'no'
      && field(review, 'Anti-copy boundary respected').replace(/`/g, '').trim().toLowerCase() === 'yes',
    'Confirm the output does not resemble one source end to end and that each anti-copy boundary is respected.',
  );
}
addCheck(
  checks,
  'publish decision is approved',
  publishDecisionReady(review, newReview),
  newReview
    ? 'Set Publish decision to approve only after every output gate passes.'
    : 'Record a selected or publish-ready legacy decision after asset QA.',
);

addCheck(
  checks,
  'final visual exists and is non-empty',
  has('visual.png') && statSync(file('visual.png')).size > 0,
  'Save the approved canonical still as visual.png.',
);
addCheck(
  checks,
  'final visual is a valid, sufficiently large PNG',
  Boolean(visualInfo && visualInfo.width >= 552 && visualInfo.height >= 276),
  'Export visual.png as a valid PNG at least 552 x 276 pixels.',
);
addCheck(
  checks,
  'final visual meets LinkedIn file-size limit',
  has('visual.png') && statSync(file('visual.png')).size <= maxLinkedInPhotoBytes,
  'Optimize visual.png below 5 MB without changing the approved artwork.',
);
addCheck(
  checks,
  'optional LinkedIn companion is valid',
  !has('visual-linkedin.png') || (
    linkedInInfo?.width === 1080
    && linkedInInfo?.height === 1350
    && statSync(file('visual-linkedin.png')).size <= maxLinkedInPhotoBytes
  ),
  'Export visual-linkedin.png at exactly 1080 x 1350 and below 5 MB.',
);
addCheck(
  checks,
  'required exact-control output exists',
  !requiresHtmlControl || (has('html-control.png') && statSync(file('html-control.png')).size > 0),
  'Create html-control.png when deterministic finishing is explicitly required.',
);
addCheck(
  checks,
  'required exact-control comparison is documented',
  !requiresHtmlControl || (has('visual-comparison.md') && /html-control\.png/i.test(read('visual-comparison.md'))),
  'Document the exact-control comparison in visual-comparison.md.',
);

let failures = 0;
for (const check of checks) {
  if (check.pass) {
    console.log(`PASS ${check.name}`);
  } else {
    failures += 1;
    console.log(`FAIL ${check.name}`);
    console.log(`     ${check.fix}`);
  }
}

if (!genomeMode) {
  console.warn('WARN Legacy compatibility mode: new work must use the Creative Genome bundle and recombination brief.');
}
if (visualInfo) {
  const ratio = visualInfo.width / visualInfo.height;
  if ((ratio < 0.8 || ratio > 3) && !has('visual-linkedin.png')) {
    console.warn(
      `WARN LinkedIn geometry: visual.png is ${visualInfo.width} x ${visualInfo.height}. `
      + 'Preserve the master and add a non-cropping 1080 x 1350 companion before posting.',
    );
  }
}

if (failures) {
  console.error(`\n${failures} visual package check(s) failed.`);
  process.exit(1);
}

console.log('\nVisual package audit passed.');
