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
const writeReport = process.argv.includes('--write');

if (!folder) {
  console.error('Usage: node scripts/score-creative-director.mjs data/{week}/{slug} [--write]');
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

function bundleShapeReady(bundle) {
  if (!bundle || bundle.status !== 'ready') return false;
  if (!isFilled(first(bundle.creative_bundle_id, bundle.bundle_id)) || !isFilled(bundle.selected_direction) || !isFilled(bundle.coherence_rationale)) return false;
  if (!bundle.reader_contract || !allFilled([
    bundle.reader_contract.problem_3s,
    bundle.reader_contract.insight_10s,
    bundle.reader_contract.action_30s,
  ])) return false;
  if (!Array.isArray(bundle.references) || bundle.references.length < 2 || bundle.references.length > 4) return false;
  const roles = new Set(bundle.references.flatMap((reference) => reference.roles ?? []));
  const comprehensionInspected = bundle.references
    .filter((reference) => reference.roles?.includes('comprehension'))
    .every((reference) => ['source_visual_inspected', 'genome_manual_verified'].includes(reference.visual_claim_status));
  const legacyAtomBundle = !bundle.creative_bundle_id && Boolean(bundle.bundle_id);
  const atomsReady = bundle.references.every((reference) => Array.isArray(reference.atoms)
    && reference.atoms.length > 0
    && reference.atoms.every((atom) => legacyAtomBundle && typeof atom === 'string'
      ? isFilled(atom)
      : allFilled([atom?.creative_element_id, atom?.atom_type, atom?.source_mechanism, atom?.adaptation])));
  return comprehensionInspected
    && atomsReady
    && ['attention', 'comprehension', 'utility', 'bridge'].every((role) => roles.has(role))
    && bundle.references.every((reference) => allFilled([
      reference.reference_id,
      reference.anti_copy_boundary,
    ]));
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

function gate(name, pass, fix, note = '') {
  return { name, pass: Boolean(pass), fix, note };
}

if (!has('creative-brief-lite.md')) {
  console.error(`Missing ${file('creative-brief-lite.md')}`);
  process.exit(1);
}

const brief = read('creative-brief-lite.md');
const content = read('content-brief-v2.md');
const recombination = read('recombination-brief.md');
const prompt = first(read('gpt-image-2-prompt-compiled.md'), read('gpt-image-2-prompt.md'));
const parsedBundle = parseJson('reference-bundle.json');
const bundle = parsedBundle.value;
const parsedQuery = parseJson('reference-query.json');
const query = parsedQuery.value;
const parsedCandidates = parseJson('reference-candidates.json');
const candidates = parsedCandidates.value;
const slug = first(field(brief, 'Slug'), basename(dir));
const genomeMode = has('reference-bundle.json')
  || has('recombination-brief.md')
  || /^# Creative Brief Lite — Recombination Template/m.test(brief);
const renderer = first(field(brief, 'Renderer'), genomeMode ? '' : 'GPT Image 2');
const imageRenderer = /gpt\s*image|image model/i.test(renderer) || (!renderer && !genomeMode);
const claimMode = first(field(brief, 'Claim mode'), field(content, 'Claim mode'), bundle?.claim_mode);
const claimModeNormalized = normalizedClaimMode(claimMode);
const simulationMode = /simulation/.test(claimModeNormalized);
const tigerMode = /tiger_(judgment|interpretation)/.test(claimModeNormalized);
const numbersDeclaration = plain(field(brief, 'Numbers/data')).toLowerCase();
const fixturesExcluded = first(
  field(brief, 'Internal test fixtures excluded'),
  field(content, 'Internal fixtures excluded from public proof'),
);
const publicSimulation = field(content, 'Public simulation');
const identityIssues = genomeMode
  ? coherenceIssues(bundle, query, candidates, content, brief, recombination)
  : [];
const conceptStatus = conceptBoardStatus(recombination);
const distinctDirectionCount = directionSignatureCount(recombination);
const promptReady = !imageRenderer || (genomeMode
  ? /CREATIVE ASSEMBLY:/i.test(prompt)
    && /CLAIM INTEGRITY:/i.test(prompt)
    && /TEXT PLACEMENT MAP:/i.test(prompt)
  : (/VISUAL STRUCTURE:/i.test(prompt) && /TEXT LOCK:/i.test(prompt))
    || (/CREATIVE ASSEMBLY:/i.test(prompt)
      && /CLAIM INTEGRITY:/i.test(prompt)
      && /TEXT PLACEMENT MAP:/i.test(prompt)));

const commonGates = [
  gate(
    'Reader contract',
    allFilled([
      field(brief, 'Audience segment'),
      field(brief, 'After reading, they can'),
      field(brief, 'Meeting/task/career moment'),
    ]) && isFilled(first(field(brief, 'Care statement'), field(brief, 'Why this stops the right reader'))),
    'Define the reader, work moment, why they care, and what they can do after reading.',
  ),
  gate(
    'Visual argument',
    allFilled([
      field(brief, 'One-sentence visual move'),
      field(brief, 'Dominant shape/metaphor'),
      field(brief, 'Eye path'),
      field(brief, 'Reusable artifact on image'),
    ]),
    'Define one visual move, one hero, one reading route, and one useful object.',
  ),
  gate(
    'Exact content and assets',
    allFilled([
      field(brief, 'Heading'),
      field(brief, 'Labels'),
      field(brief, 'Text placement map'),
      field(brief, 'Logo/asset references'),
    ]),
    'Lock the heading, labels, placement homes, and exact owned or official assets.',
  ),
  gate(
    'Renderer handoff',
    isFilled(renderer) && promptReady,
    imageRenderer
      ? 'Compile the GPT Image prompt with creative assembly, claim integrity, and exact placement.'
      : 'Declare the renderer and why it carries the selected direction.',
  ),
];

const genomeGates = [
  gate(
    'Retrieval contract files',
    has('reference-query.json')
      && has('reference-candidates.json')
      && !parsedQuery.error
      && !parsedCandidates.error
      && query?.status === 'ready'
      && query?.query_id !== 'RQ-DRAFT',
    parsedQuery.error || parsedCandidates.error
      ? `Repair retrieval JSON: ${parsedQuery.error || parsedCandidates.error}`
      : 'Add a ready, non-template reference-query.json and its generated reference-candidates.json.',
  ),
  gate(
    'Creative Genome bundle',
    !parsedBundle.error && bundleShapeReady(bundle),
    parsedBundle.error
      ? `Repair reference-bundle.json: ${parsedBundle.error}`
      : 'Set the bundle to ready with 2-4 transformed references covering attention, comprehension, utility, and bridge.',
  ),
  gate(
    'Cross-file identity and direction',
    identityIssues.length === 0,
    identityIssues.join('; ') || 'Align the content ID, bundle ID, snapshot, selected direction, and claim mode across the package.',
  ),
  gate(
    'Ten concepts',
    conceptStatus.complete,
    `Use unique indices 1-10, fill all six concept fields, and create at least three dominant-move + atom-combination signatures (found ${conceptStatus.signatures}).`,
  ),
  gate(
    'Three directions',
    ['A', 'B', 'C'].every((letter) => directionComplete(recombination, letter))
      && distinctDirectionCount === 3,
    `Develop complete and genuinely different Directions A, B, and C; visual object + useful object + bridge signatures must be unique (found ${distinctDirectionCount}).`,
  ),
  gate(
    'Selected coherent assembly',
    allFilled([
      first(field(brief, 'Selected direction'), bundle?.selected_direction, field(recombination, 'Selected direction')),
      first(field(brief, 'Coherence rationale'), bundle?.coherence_rationale, field(recombination, 'Coherence rationale')),
    ]),
    'Select one direction and explain how every atom reinforces the same reader promise.',
  ),
];

let claimReady = isFilled(claimMode) && isFilled(field(brief, 'Numbers/data'));
let claimFix = 'Declare the claim mode and numbers/data status.';
if (claimReady && (supportRequired(claimMode) || numbersDeclaration === 'source-backed') && !supportPresent(content, brief)) {
  claimReady = false;
  claimFix = 'Map every load-bearing CL ID to a ledger row with exact status supported.';
}
if (claimReady && tigerMode) {
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
const simulationDeclaration = plain(publicSimulation).toLowerCase();
const simulationSelected = simulationMode
  || simulationDeclaration === 'explicitly selected and visibly labelled'
  || numbersDeclaration === 'explicit-labelled-simulation';
if (claimReady && simulationSelected) {
  const coherentSimulationMode = simulationMode || claimModeNormalized === 'mixed';
  const labelled = simulationDeclaration === 'explicitly selected and visibly labelled'
    && numbersDeclaration === 'explicit-labelled-simulation';
  if (!coherentSimulationMode || !labelled || !/^yes$/i.test(fixturesExcluded.replace(/`/g, '').trim())) {
    claimReady = false;
    claimFix = 'Use simulation_or_hypothesis or mixed, label the simulation in both contracts, and confirm internal fixtures are excluded.';
  }
}

const claimGate = gate('Claim-proportionate support', claimReady, claimFix);
const legacyGates = [
  gate(
    'Legacy creative mechanic',
    allFilled([
      field(brief, 'Opening claim'),
      field(brief, 'Why this stops the right reader'),
      field(brief, 'Save trigger'),
    ]),
    'Complete the opening, stop reason, and save trigger. New work should migrate to a Creative Genome bundle.',
    'Compatibility gate only; it does not certify a Creative Genome recombination.',
  ),
];

const gates = [
  ...(genomeMode ? genomeGates : legacyGates),
  ...commonGates,
  ...(genomeMode ? [claimGate] : []),
];
const misses = gates.filter((item) => !item.pass);
const ready = misses.length === 0;
const warnings = [];
if (!genomeMode) warnings.push('Legacy compatibility mode: the package can continue, but new work must use reference-bundle.json and recombination-brief.md.');
if (!genomeMode && !isFilled(claimMode)) warnings.push('Legacy package has no explicit claim mode; verify any factual, numerical, causal, company, or personal claim manually.');

const report = `# Creative Readiness Review — ${slug}

**Source:** \`${folder}\`
**Mode:** ${genomeMode ? 'Creative Genome + recombination' : 'legacy compatibility'}
**Decision:** ${ready ? 'READY — proceed to render or final-output review' : 'NOT READY — resolve the blocking gates'}

| Gate | Status | Note |
|---|---|---|
${gates.map((item) => `| ${item.name} | ${item.pass ? 'PASS' : 'BLOCK'} | ${item.pass ? (item.note || 'Ready.') : item.fix} |`).join('\n')}

## Blocking Actions

${misses.map((item) => `- **${item.name}:** ${item.fix}`).join('\n') || '- None.'}

## Warnings

${warnings.map((warning) => `- ${warning}`).join('\n') || '- None.'}

## Rule

Readiness is non-numeric. Do not repair a weak direction with adjectives or compensate for an
unsupported claim with visual polish. Change the assembly, reader promise, support route, or renderer.
`;

process.stdout.write(report);

if (writeReport) {
  writeFileSync(file('creative-readiness-review.md'), report, 'utf8');
  console.log(`\nWrote ${folder}/creative-readiness-review.md`);
}

if (!ready) process.exit(1);
