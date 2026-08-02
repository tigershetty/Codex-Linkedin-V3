#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SETUP_ROOT = resolve(SCRIPT_DIR, '..');
const GENOME_ROOT = join(SETUP_ROOT, 'references', 'creative-genome');
const MANIFEST_PATH = join(GENOME_ROOT, 'active-manifest.json');
const VISUAL_REVIEW_TEMPLATE = join(
  SETUP_ROOT,
  'templates',
  'visual-output-review-template.md',
);

const tempRoot = mkdtempSync(join(tmpdir(), 'creative-genome-workflow-'));
const failures = [];
let passed = 0;

function runCli(script, args = [], cwd = SETUP_ROOT) {
  const result = spawnSync(process.execPath, [join(SCRIPT_DIR, script), ...args], {
    cwd,
    encoding: 'utf8',
  });
  if (result.error) throw result.error;
  return {
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`,
    status: result.status,
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertSuccess(result, context) {
  assert(
    result.status === 0,
    `${context} exited ${result.status}.\n${result.output}`,
  );
}

function assertFailure(result, expected, context) {
  assert(
    result.status !== 0,
    `${context} unexpectedly passed.\n${result.output}`,
  );
  const patterns = Array.isArray(expected) ? expected : [expected];
  for (const pattern of patterns) {
    assert(
      pattern.test(result.output),
      `${context} did not report ${pattern}.\n${result.output}`,
    );
  }
}

function test(name, callback) {
  try {
    callback();
    passed += 1;
    process.stdout.write(`PASS ${name}\n`);
  } catch (error) {
    failures.push({ name, error });
    process.stdout.write(`FAIL ${name}\n`);
    process.stdout.write(`     ${error.message.split('\n')[0]}\n`);
  }
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readyQuery(overrides = {}) {
  return {
    schema_version: '1.0.0',
    status: 'ready',
    query_id: 'Q-CONTRACT-TEST-001',
    content_id: 'contract-test-content',
    reader_decision: 'Choose the first planning check before escalating an exception.',
    care_statement: 'A clearer first check prevents avoidable rework.',
    audience_terms: ['planner', 'supply chain'],
    topic_terms: ['planning', 'inventory'],
    content_modes: ['framework', 'workflow'],
    hook_types: [],
    visual_structures: [],
    artifact_types: [],
    ctas: [],
    excluded_patterns: [],
    source_preferences: ['saved_positive', 'top100_curated_reference'],
    eligible_creative_signals: ['saved_positive', 'top100_curated_reference'],
    limit: 10,
    tiger_precedent_limit: 2,
    ...overrides,
  };
}

function draftQuery(overrides = {}) {
  return readyQuery({
    status: 'draft',
    content_id: '',
    reader_decision: '',
    care_statement: '',
    audience_terms: [],
    topic_terms: [],
    content_modes: [],
    source_preferences: ['saved_positive'],
    eligible_creative_signals: ['saved_positive'],
    tiger_precedent_limit: 0,
    ...overrides,
  });
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
const snapshotPath = resolve(SETUP_ROOT, manifest.snapshot.path);
const records = readFileSync(snapshotPath, 'utf8')
  .trim()
  .split('\n')
  .map((line) => JSON.parse(line));
const isCurated = (record) => record.corpus_signals.saved_positive.value
  || record.corpus_signals.top100_curated_reference;
const curatedNonTiger = records.filter(
  (record) => isCurated(record) && !record.corpus_signals.tiger_native_performance,
);
const uncurated = records.find(
  (record) => !isCurated(record) && !record.corpus_signals.tiger_native_performance,
);
const tigerNative = records.find(
  (record) => record.corpus_signals.tiger_native_performance,
);
const savedTextReference = records.find(
  (record) => record.reference_id.startsWith('TEXT-')
    && record.corpus_signals.saved_positive.value,
);

assert(curatedNonTiger.length >= 3, 'The active genome needs at least three curated non-Tiger records.');
assert(uncurated, 'The active genome needs at least one non-curated record for the negative test.');
assert(tigerNative, 'The active genome needs at least one Tiger native-performance record.');
assert(savedTextReference, 'The active genome needs a saved-positive TEXT reference.');

function creativeReference(record, roles, index, visualClaimStatus = 'source_visual_inspected') {
  return {
    reference_id: record.reference_id,
    roles,
    atoms: [
      {
        creative_element_id: `CE-CONTRACT-${index}`,
        atom_type: roles.includes('comprehension') ? 'visual' : 'attention',
        source_mechanism: `Mechanism ${index}`,
        adaptation: `Original adaptation ${index}`,
      },
    ],
    anti_copy_boundary: `Do not reuse source ${index} end to end.`,
    visual_claim_status: visualClaimStatus,
    visual_inspection_note: visualClaimStatus === 'source_visual_inspected'
      ? `Contract-test inspection note ${index}.`
      : null,
  };
}

function readyBundle(overrides = {}) {
  return {
    schema_version: '1.0.0',
    creative_bundle_id: 'CB-CONTRACT-001',
    query_id: 'Q-CONTRACT-TEST-001',
    content_id: 'contract-test-content',
    snapshot_id: manifest.snapshot.id,
    status: 'ready',
    claim_mode: 'editorial_explainer',
    reader_contract: {
      problem_3s: 'The exception is visible.',
      insight_10s: 'The first check is clear.',
      action_30s: 'The reader can apply the check.',
    },
    selected_direction: 'Direction A',
    coherence_rationale: 'Every atom reinforces the same first-check decision.',
    tiger_precedent_ids: [tigerNative.reference_id],
    references: [
      creativeReference(curatedNonTiger[0], ['attention', 'utility', 'bridge'], 1),
      creativeReference(curatedNonTiger[1], ['comprehension'], 2),
    ],
    ...overrides,
  };
}

function validateBundle(bundle, filename, extraArgs = []) {
  const path = join(tempRoot, filename);
  writeJson(path, bundle);
  return runCli('validate-reference-bundle.mjs', ['--input', path, ...extraArgs]);
}

function conceptRows(indices) {
  return indices.map((index, position) => {
    const family = position % 3;
    return `| ${index} | Concept ${position + 1} | Tension ${position + 1} | Move ${family + 1} | framework | Payoff ${position + 1} | CE-${family + 1} + CE-${position + 10} |`;
  }).join('\n');
}

function directionSection(letter, suffix = letter) {
  return `### Direction ${letter}

- Concept: Concept ${suffix}
- Reader promise: Promise ${suffix}
- Opening: Opening ${suffix}
- Visual object and eye path: Visual ${suffix}
- Useful object: Utility ${suffix}
- Caption arc: Caption ${suffix}
- Bridge: Bridge ${suffix}
- Claim modes and support route: editorial_explainer; correctness review
- Why it is original: Original transformation ${suffix}`;
}

function recombinationBrief(indices, directionSuffixes = ['A', 'B', 'C']) {
  return `# Recombination Brief — contract test

## Ten Concepts

| # | Concept name | Reader tension | Dominant creative move | Content mode | Useful payoff | Reference atoms combined |
|---:|---|---|---|---|---|---|
${conceptRows(indices)}

## Three Developed Directions

${directionSection('A', directionSuffixes[0])}

${directionSection('B', directionSuffixes[1])}

${directionSection('C', directionSuffixes[2])}

## Selection

**Selected direction:** Direction A
**Coherence rationale:** One promise and one reading route.
`;
}

function readinessPackage(name, { concepts, directions, claimMode, supportStatus } = {}) {
  const dir = join(tempRoot, name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'creative-brief-lite.md'),
    `# Creative Brief Lite — Recombination Template

**Slug:** ${name}
**Claim mode:** ${claimMode ?? 'editorial_explainer'}
**Numbers/data:** ${claimMode ? 'load-bearing claim present' : 'none'}
**Support ledger / claim IDs:** ${claimMode ? 'CL-CONTRACT-001' : 'none'}
`,
    'utf8',
  );
  writeFileSync(
    join(dir, 'content-brief-v2.md'),
    `# Content Brief

**support_ledger:** ${claimMode ? 'CL-CONTRACT-001' : 'none'}

| Claim ID | Claim | Support | Status |
|---|---|---|---|
| CL-CONTRACT-001 | A load-bearing claim | Pending source | ${supportStatus ?? 'pending'} |
`,
    'utf8',
  );
  writeFileSync(
    join(dir, 'recombination-brief.md'),
    recombinationBrief(
      concepts ?? Array.from({ length: 10 }, (_, index) => index + 1),
      directions ?? ['A', 'B', 'C'],
    ),
    'utf8',
  );
  return dir;
}

test('checked-in Creative Genome rebuild is deterministic', () => {
  const first = runCli('build-creative-genome.mjs', ['--check']);
  const second = runCli('build-creative-genome.mjs', ['--check']);
  assertSuccess(first, 'first Creative Genome --check');
  assertSuccess(second, 'second Creative Genome --check');
  assert(first.output === second.output, 'Creative Genome --check output changed between runs.');
});

test('ready retrieval is deterministic and returns curated signals', () => {
  const queryPath = join(tempRoot, 'ready-query.json');
  const firstPath = join(tempRoot, 'retrieval-first.json');
  const secondPath = join(tempRoot, 'retrieval-second.json');
  writeJson(queryPath, readyQuery());
  const first = runCli('retrieve-creative-references.mjs', [
    '--query', queryPath,
    '--output', firstPath,
  ]);
  const second = runCli('retrieve-creative-references.mjs', [
    '--query', queryPath,
    '--output', secondPath,
  ]);
  assertSuccess(first, 'first reference retrieval');
  assertSuccess(second, 'second reference retrieval');
  assert(
    readFileSync(firstPath).equals(readFileSync(secondPath)),
    'Reference retrieval bytes changed between identical runs.',
  );
  const result = JSON.parse(readFileSync(firstPath, 'utf8'));
  assert(result.result_count === 10, `Expected 10 results, found ${result.result_count}.`);
  assert(
    result.results.every((record) => record.positive_signals.saved_positive
      || record.positive_signals.top100_curated_reference),
    'Retrieval returned a non-curated creative signal.',
  );
  assert(
    result.tiger_precedents.every((record) => record.positive_signals.tiger_native_performance),
    'Retrieval returned a non-Tiger precedent.',
  );
});

test('draft query requires the explicit allow flag', () => {
  const path = join(tempRoot, 'draft-query.json');
  writeJson(path, draftQuery());
  assertFailure(
    runCli('retrieve-creative-references.mjs', ['--query', path]),
    /draft queries require --allow-draft/i,
    'draft query without --allow-draft',
  );
  assertSuccess(
    runCli('retrieve-creative-references.mjs', ['--query', path, '--allow-draft']),
    'draft query with --allow-draft',
  );
});

test('query rejects duplicate source lists and Tiger precedent limits above five', () => {
  const duplicatePath = join(tempRoot, 'duplicate-source-query.json');
  writeJson(duplicatePath, readyQuery({
    source_preferences: ['saved_positive', 'saved_positive'],
    eligible_creative_signals: ['saved_positive', 'saved_positive'],
  }));
  assertFailure(
    runCli('retrieve-creative-references.mjs', ['--query', duplicatePath]),
    [/source_preferences must not contain duplicates/i, /eligible_creative_signals must not contain duplicates/i],
    'query with duplicate source lists',
  );

  const capPath = join(tempRoot, 'tiger-cap-query.json');
  writeJson(capPath, readyQuery({ tiger_precedent_limit: 6 }));
  assertFailure(
    runCli('retrieve-creative-references.mjs', ['--query', capPath]),
    /tiger_precedent_limit must be an integer between 0 and 5/i,
    'query above the Tiger precedent cap',
  );
});

test('ready query rejects a draft-like production identity', () => {
  const path = join(tempRoot, 'placeholder-ready-query.json');
  writeJson(path, readyQuery({ query_id: 'RQ-DRAFT' }));
  assertFailure(
    runCli('retrieve-creative-references.mjs', ['--query', path]),
    /query_id must use a production identifier, not a template placeholder/i,
    'ready query with RQ-DRAFT identity',
  );
});

test('a complete curated bundle with a separate Tiger precedent passes', () => {
  assertSuccess(
    validateBundle(readyBundle(), 'valid-bundle.json'),
    'valid ready reference bundle',
  );
});

test('a saved-positive TEXT reference is valid in a ready bundle', () => {
  const bundle = readyBundle({
    references: [
      creativeReference(savedTextReference, ['attention', 'utility', 'bridge'], 31),
      creativeReference(curatedNonTiger[1], ['comprehension'], 32),
    ],
  });
  assertSuccess(
    validateBundle(bundle, 'saved-text-reference-bundle.json'),
    'ready bundle with a saved-positive TEXT reference',
  );
});

test('draft bundle and ready identity contracts are enforced', () => {
  const draft = readyBundle({ status: 'draft' });
  assertFailure(
    validateBundle(draft, 'draft-bundle.json'),
    /draft bundles require --allow-draft/i,
    'draft bundle without --allow-draft',
  );
  assertSuccess(
    validateBundle(draft, 'draft-bundle-allowed.json', ['--allow-draft']),
    'draft bundle with --allow-draft',
  );

  const blankIds = readyBundle({
    creative_bundle_id: '',
    query_id: '',
    content_id: '',
  });
  assertFailure(
    validateBundle(blankIds, 'blank-ready-ids.json'),
    [
      /creative_bundle_id is required for a ready bundle/i,
      /query_id is required for a ready bundle/i,
      /content_id is required for a ready bundle/i,
    ],
    'ready bundle with blank identity fields',
  );

  assertFailure(
    validateBundle(
      readyBundle({ creative_bundle_id: 'CB-DRAFT' }),
      'placeholder-ready-bundle.json',
    ),
    /creative_bundle_id must use a production identifier, not a template placeholder/i,
    'ready bundle with CB-DRAFT identity',
  );
});

test('non-curated creative references are rejected', () => {
  const bundle = readyBundle();
  bundle.references[0] = creativeReference(
    uncurated,
    ['attention', 'utility', 'bridge'],
    11,
  );
  assertFailure(
    validateBundle(bundle, 'non-curated-bundle.json'),
    /must be a Tiger-saved or Top-100 curated creative reference/i,
    'bundle with a non-curated creative reference',
  );
});

test('ready comprehension atoms require inspected source visuals', () => {
  const bundle = readyBundle();
  bundle.references[1] = creativeReference(
    curatedNonTiger[1],
    ['comprehension'],
    12,
    'pending_inspection',
  );
  assertFailure(
    validateBundle(bundle, 'uninspected-comprehension.json'),
    /fills comprehension but its source visual has not been inspected/i,
    'ready comprehension bundle without visual inspection',
  );
});

test('Tiger precedents must be native, unique, and separate', () => {
  assertFailure(
    validateBundle(
      readyBundle({ tiger_precedent_ids: [curatedNonTiger[2].reference_id] }),
      'non-native-tiger-precedent.json',
    ),
    /is not a Tiger native-performance record/i,
    'non-native Tiger precedent',
  );

  assertFailure(
    validateBundle(
      readyBundle({ tiger_precedent_ids: [tigerNative.reference_id, tigerNative.reference_id] }),
      'duplicate-tiger-precedent.json',
    ),
    /Tiger precedent .* is duplicated/i,
    'duplicate Tiger precedent',
  );

  const overlap = readyBundle({
    references: [
      creativeReference(tigerNative, ['attention', 'utility', 'bridge'], 21),
      creativeReference(curatedNonTiger[1], ['comprehension'], 22),
    ],
    tiger_precedent_ids: [tigerNative.reference_id],
  });
  assertFailure(
    validateBundle(overlap, 'overlapping-tiger-precedent.json'),
    /must remain separate from curated creative references/i,
    'Tiger precedent reused as a creative reference',
  );
});

test('readiness rejects incomplete and duplicate ten-concept boards', () => {
  const incomplete = readinessPackage('incomplete-concepts', {
    concepts: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  });
  assertFailure(
    runCli('score-creative-director.mjs', [incomplete]),
    /\| Ten concepts \| BLOCK \|/i,
    'incomplete ten-concept board',
  );

  const duplicate = readinessPackage('duplicate-concepts', {
    concepts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 9],
  });
  assertFailure(
    runCli('score-creative-director.mjs', [duplicate]),
    /\| Ten concepts \| BLOCK \|/i,
    'duplicate ten-concept board',
  );
});

test('readiness rejects duplicate developed-direction signatures', () => {
  const duplicateDirections = readinessPackage('duplicate-directions', {
    directions: ['same', 'same', 'same'],
  });
  assertFailure(
    runCli('score-creative-director.mjs', [duplicateDirections]),
    /\| Three directions \| BLOCK \|/i,
    'duplicate developed-direction signatures',
  );
});

test('claim support accepts only exact supported ledger rows', () => {
  for (const status of ['pending', 'remove']) {
    const unsupported = readinessPackage(`unsupported-claim-${status}`, {
      claimMode: 'formula_or_method',
      supportStatus: status,
    });
    assertFailure(
      runCli('score-creative-director.mjs', [unsupported]),
      /\| Claim-proportionate support \| BLOCK \|/i,
      `claim ledger with status ${status}`,
    );
  }

  const supported = readinessPackage('supported-claim', {
    claimMode: 'formula_or_method',
    supportStatus: 'supported',
  });
  const result = runCli('score-creative-director.mjs', [supported]);
  assert(
    /\| Claim-proportionate support \| PASS \|/i.test(result.output),
    `Exact supported status did not pass the claim gate.\n${result.output}`,
  );
});

test('visual audit rejects an untouched output-review decision', () => {
  const dir = join(tempRoot, 'untouched-output-review');
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'creative-brief-lite.md'),
    '# Creative Brief Lite — Recombination Template\n',
    'utf8',
  );
  writeFileSync(
    join(dir, 'visual-output-review.md'),
    readFileSync(VISUAL_REVIEW_TEMPLATE, 'utf8'),
    'utf8',
  );
  assertFailure(
    runCli('audit-visual-package.mjs', [dir]),
    [
      /FAIL all recombination decisions pass/i,
      /FAIL publish decision is approved/i,
    ],
    'untouched visual-output review',
  );
});

test('ready publish handoff rejects an untouched V4 manifest', () => {
  const publishRoot = join(tempRoot, 'publish-handoff');
  const postDir = join(publishRoot, 'data', '2026-W31', 'untouched-manifest');
  mkdirSync(postDir, { recursive: true });
  writeFileSync(
    join(postDir, 'publish-manifest.json'),
    readFileSync(join(SETUP_ROOT, 'templates', 'publish-manifest-template.json'), 'utf8'),
    'utf8',
  );
  assertFailure(
    runCli(
      'audit-publish-handoff.mjs',
      ['data/2026-W31/untouched-manifest', '--ready'],
      publishRoot,
    ),
    [
      /FAIL ready handoff has a production creative bundle ID/i,
      /FAIL ready handoff records curated genome references/i,
      /FAIL ready handoff records creative elements/i,
      /FAIL ready handoff has a selected claim mode/i,
      /FAIL all declared public claims are supported/i,
    ],
    'untouched schema-version-2 publish manifest',
  );
});

rmSync(tempRoot, { force: true, recursive: true });

if (failures.length) {
  process.stderr.write(`\n${failures.length} of ${passed + failures.length} Creative Genome workflow tests failed.\n`);
  for (const failure of failures) {
    process.stderr.write(`\n--- ${failure.name} ---\n${failure.error.stack || failure.error.message}\n`);
  }
  process.exitCode = 1;
} else {
  process.stdout.write(`\nCreative Genome workflow tests passed: ${passed}.\n`);
}
