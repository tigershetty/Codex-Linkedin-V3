#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SETUP_ROOT = resolve(SCRIPT_DIR, '..');
const RETRIEVAL_SCRIPT = join(SCRIPT_DIR, 'retrieve-working-infographic-mechanisms.mjs');
const INDEX_PATH = join(SETUP_ROOT, 'references', 'creative-genome', 'working-infographic-creative-index-v1.json');
const tempRoot = mkdtempSync(join(tmpdir(), 'working-infographic-retrieval-'));
const failures = [];
let passed = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function test(name, callback) {
  try {
    callback();
    passed += 1;
    process.stdout.write(`PASS ${name}\n`);
  } catch (error) {
    failures.push({ name, error });
    process.stdout.write(`FAIL ${name}\n     ${error.message.split('\n')[0]}\n`);
  }
}

function run(name, args) {
  const output = join(tempRoot, `${name}.json`);
  const result = spawnSync(process.execPath, [RETRIEVAL_SCRIPT, ...args, '--output', output], {
    cwd: SETUP_ROOT,
    encoding: 'utf8',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${result.stdout ?? ''}${result.stderr ?? ''}`);
  return JSON.parse(readFileSync(output, 'utf8'));
}

function roleCounts(result) {
  return Object.values(result.composition_roles).reduce((total, records) => total + records.length, 0);
}

test('controlled mechanism query returns explicitly annotated source matches', () => {
  assert(existsSync(INDEX_PATH), `Missing index: ${INDEX_PATH}`);
  const result = run('controlled', [
    '--reader-state', 'conflicting dates',
    '--response', 'practical use',
    '--cognitive-job', 'diagnose',
    '--relation', 'conditional decision',
  ]);
  assert(result.retrieval_status === 'matched', `Expected matched, received ${result.retrieval_status}`);
  assert(result.query_interpretation.matched_terms.length >= 4, 'Expected controlled query terms to be visible');
  assert(roleCounts(result) > 0, 'Expected source records for controlled query');
  Object.values(result.composition_roles).flat().forEach((record) => {
    assert(Array.isArray(record.matched_terms) && record.matched_terms.length > 0, `${record.record_id} lacks matched-term provenance`);
    assert(Array.isArray(record.matched_controlled_tags) && record.matched_controlled_tags.length > 0, `${record.record_id} lacks controlled tags`);
  });
});

test('unrelated query returns no_match with no arbitrary shelf', () => {
  const result = run('unrelated', [
    '--reader-state', 'marine algae bioluminescence',
    '--response', 'orbital espresso',
    '--cognitive-job', 'wander',
    '--relation', 'spiral nebula',
  ]);
  assert(result.retrieval_status === 'no_match', `Expected no_match, received ${result.retrieval_status}`);
  assert(roleCounts(result) === 0, 'Unrelated query must not receive arbitrary source records');
  assert(result.query_interpretation.unmatched_terms.includes('bioluminescence'), 'Expected unrelated terms to remain visible');
});

test('unknown reader state cannot borrow a generic job or relation to return sources', () => {
  const result = run('unknown-reader-state', [
    '--reader-state', 'quantum banana theorem',
    '--response', 'practical use',
    '--cognitive-job', 'diagnose',
    '--relation', 'conditional decision',
  ]);
  assert(result.retrieval_status === 'broad_inspiration_fallback', `Expected broad fallback, received ${result.retrieval_status}`);
  assert(roleCounts(result) === 0, 'An unknown reader state must not receive an arbitrary shelf');
  assert(result.query_interpretation.matched_terms.every((term) => term.field !== 'reader_state'), 'The unknown reader state must not be treated as controlled scope');
  assert(/scope-bearing reader state/i.test(result.fallback?.reason ?? ''), 'Expected explicit scope-bearing-state boundary');
});

test('response-only query returns broad_inspiration_fallback without sources', () => {
  const result = run('broad', ['--response', 'memorable intrigue']);
  assert(result.retrieval_status === 'broad_inspiration_fallback', `Expected broad fallback, received ${result.retrieval_status}`);
  assert(roleCounts(result) === 0, 'Broad fallback must not masquerade as a matched shelf');
  assert(/scope-bearing reader state/i.test(result.fallback?.reason ?? ''), 'Expected explicit fallback reason');
});

rmSync(tempRoot, { recursive: true, force: true });

if (failures.length) {
  process.stdout.write(`\n${failures.length} Working Infographic retrieval test(s) failed.\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`\n${passed} Working Infographic retrieval tests passed.\n`);
}
