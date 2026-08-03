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
const outName = outArgIndex >= 0 ? process.argv[outArgIndex + 1] : 'creative-packet.md';

if (!folder || (outArgIndex >= 0 && !outName)) {
  console.error('Usage: node scripts/compile-creative-packet.mjs data/{week}/{slug} [--out creative-packet.md]');
  process.exit(2);
}

const root = resolve(process.cwd());
const dir = resolve(root, folder);
const paths = {
  brief: join(dir, 'creative-brief-lite.md'),
  content: join(dir, 'content-brief-v2.md'),
  bundle: join(dir, 'reference-bundle.json'),
  query: join(dir, 'reference-query.json'),
  candidates: join(dir, 'reference-candidates.json'),
  recombination: join(dir, 'recombination-brief.md'),
  legacyReference: join(dir, 'reference-learning-card.md'),
  prompt: join(dir, 'gpt-image-2-prompt.md'),
  out: join(dir, outName),
};

if (!existsSync(paths.brief)) {
  console.error(`Missing ${paths.brief}`);
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

function value(value, fallback = 'not declared') {
  return String(value ?? '').trim() || fallback;
}

function selectedAtoms(bundle, brief) {
  if (bundle?.references?.length) {
    return bundle.references.map((reference) => {
      const roles = reference.roles?.join(', ') || 'unspecified';
      const atoms = reference.atoms?.map((atom) => {
        if (typeof atom === 'string') return atom;
        return `${atom.creative_element_id} [${atom.atom_type}]\n    - Source mechanism: ${atom.source_mechanism}\n    - Transformation: ${atom.adaptation}`;
      }).join('\n  - ') || 'not named';
      return `- **${roles}:** ${reference.reference_id}\n  - ${atoms}\n  - Visual inspection: ${value(reference.visual_claim_status)}${reference.visual_inspection_note ? ` — ${reference.visual_inspection_note}` : ''}\n  - Anti-copy boundary: ${value(reference.anti_copy_boundary)}`;
    }).join('\n');
  }

  const legacyAtoms = [
    ['Attention', field(brief, 'Attention atom')],
    ['Comprehension', field(brief, 'Comprehension atom')],
    ['Utility', field(brief, 'Utility atom')],
    ['Bridge', field(brief, 'Bridge atom')],
  ].filter(([, atom]) => atom);
  return legacyAtoms.length
    ? legacyAtoms.map(([role, atom]) => `- **${role}:** ${atom}`).join('\n')
    : '- Legacy reference package: use the declared mechanic and learning card as a compatibility fallback.';
}

const brief = readIf(paths.brief);
const content = readIf(paths.content);
const recombination = readIf(paths.recombination);
const legacyReference = readIf(paths.legacyReference);
const bundle = parseJsonIf(paths.bundle);
const query = parseJsonIf(paths.query);
const candidates = parseJsonIf(paths.candidates);
assertGenomeCoherence(bundle, query, candidates, content, brief, recombination);
const readerContract = bundle?.reader_contract ?? {};
const slug = first(field(brief, 'Slug'), basename(dir));
const selectedDirection = first(
  field(brief, 'Selected direction'),
  bundle?.selected_direction,
  field(recombination, 'Selected direction'),
);
const coherence = first(
  field(brief, 'Coherence rationale'),
  bundle?.coherence_rationale,
  field(recombination, 'Coherence rationale'),
);
const claimMode = first(field(brief, 'Claim mode'), field(content, 'Claim mode'), bundle?.claim_mode);
const supportLedger = first(field(brief, 'Support ledger / claim IDs'), field(content, 'support_ledger'));
const renderer = first(field(brief, 'Renderer'), 'not declared');
const labels = field(brief, 'Labels')
  .split(';')
  .map((item) => item.trim())
  .filter(Boolean);

const sources = [
  existsSync(paths.bundle) && '`reference-bundle.json`',
  existsSync(paths.query) && '`reference-query.json`',
  existsSync(paths.candidates) && '`reference-candidates.json`',
  existsSync(paths.recombination) && '`recombination-brief.md`',
  existsSync(paths.content) && '`content-brief-v2.md`',
  '`creative-brief-lite.md`',
  !bundle && existsSync(paths.legacyReference) && '`reference-learning-card.md` (legacy fallback)',
].filter(Boolean).join(', ');

const legacySection = !bundle && legacyReference
  ? `\n## Legacy Reference Fallback\n\n- **Visual mechanics:** ${value(field(legacyReference, 'Visual mechanics to borrow'))}\n- **Adaptation:** ${value(first(field(legacyReference, 'Supply-chain translation'), field(legacyReference, 'Reference lesson for GPT Image 2')))}\n- **Do not copy:** ${value(field(legacyReference, 'What to avoid copying'))}\n`
  : '';

const packet = `# Creative Packet — ${slug}

**Purpose:** compact production context for the selected direction. It does not replace the reference
bundle, support ledger, or output review.

**Sources:** ${sources}
**Creative bundle:** ${value(first(field(brief, 'creative_bundle_id'), bundle?.creative_bundle_id, bundle?.bundle_id), bundle ? 'bundle ID missing' : 'legacy fallback')}
**Selected direction:** ${value(selectedDirection)}

## Reader Contract

- **Reader:** ${value(field(brief, 'Audience segment'))}
- **Job:** ${value(field(brief, 'Audience job'))}
- **Work moment:** ${value(field(brief, 'Meeting/task/career moment'))}
- **Why they care:** ${value(first(field(brief, 'Care statement'), field(content, 'Care statement'), field(brief, 'Why this stops the right reader')))}
- **3 seconds:** ${value(first(readerContract.problem_3s, field(brief, 'Opening claim')))}
- **10 seconds:** ${value(first(readerContract.insight_10s, coherence, field(brief, 'One-sentence visual move')))}
- **30 seconds:** ${value(first(readerContract.action_30s, field(brief, 'Useful action in 30 seconds'), field(brief, 'Reusable artifact on image')))}

## Creative Assembly

${selectedAtoms(bundle, brief)}

- **Coherence:** ${value(coherence)}
- **Tiger precedent:** ${value(first(field(brief, 'Tiger precedent'), bundle?.tiger_precedent_ids?.join(', ')), 'none selected')}

## Visual Argument

- **Move:** ${value(field(brief, 'One-sentence visual move'))}
- **Hero:** ${value(field(brief, 'Dominant shape/metaphor'))}
- **Eye path:** ${value(field(brief, 'Eye path'))}
- **Useful object:** ${value(field(brief, 'Reusable artifact on image'))}
- **Supporting detail:** ${value(field(brief, 'Value-density layer'))}
- **Mobile 3/10/30:** ${value(field(brief, 'Mobile 3/10/30 plan'))}
- **Caption adds:** ${value(first(field(brief, 'Caption adds'), field(content, 'What the caption adds to the visual')))}

## Claim Integrity

- **Claim mode:** ${value(claimMode)}
- **Support ledger / claim IDs:** ${value(supportLedger, 'not required for a purely editorial or framework claim; otherwise missing')}
- **Numbers/data:** ${value(field(brief, 'Numbers/data'))}
- **Internal fixtures excluded:** ${value(first(field(brief, 'Internal test fixtures excluded'), field(content, 'Internal fixtures excluded from public proof')))}
- **Public simulation:** ${value(field(content, 'Public simulation'), 'not used')}

## Exact Content

- **Heading:** ${value(field(brief, 'Heading'))}
- **Subheading:** ${value(field(brief, 'Subheading'), 'none')}
- **Labels:** ${labels.length ? labels.join(' | ') : 'not declared'}
- **Placement map:** ${value(field(brief, 'Text placement map'))}
- **Bottom question:** ${value(field(brief, 'Bottom question'), 'none')}
- **Footer/chrome:** ${value(field(brief, 'Footer/chrome'), 'none')}

## Brand, Assets, And Renderer

- **Brand expression:** ${value(field(brief, 'Brand expression'), 'Shetty\'s Desk Operating Studio')}
- **Brand frame:** ${value(field(brief, 'Brand frame'), 'references/brand-kits/shettys-desk-operating-studio/FRAME.md')}
- **Brand direction:** ${value(field(brief, 'Brand direction'), 'luminous white/pale-blue operating world; semantic blue, green, and coral; controlled non-photorealistic depth')}
- **Logo plan:** ${value(field(brief, 'Logo plan'))}
- **Assets:** ${value(field(brief, 'Logo/asset references'))}
- **Official tool assets:** ${value(field(brief, 'Official tool assets, if meaningful'), 'none')}
- **Renderer:** ${renderer}
- **Why this renderer:** ${value(field(brief, 'Why this renderer'))}
- **Composition freedom:** ${value(field(brief, 'Composition freedom'))}
- **Deterministic finishing:** ${value(field(brief, 'Deterministic finishing required'))}
${legacySection}
## Production QA

- One reader promise, one dominant message, one hero, and one primary reading route.
- Selected atoms are visible, transformed, and coherent; the output does not resemble one source end to end.
- The useful object is legible without opening the caption.
- Exact text, logos, formulas, relationships, and data survive mobile output.
- Every load-bearing claim meets its declared support burden.
- The caption adds context, reasoning, application, limitation, or judgment instead of reading the image aloud.
`;

writeFileSync(paths.out, packet, 'utf8');
console.log(`Wrote ${paths.out.replace(`${root}/`, '')}`);
