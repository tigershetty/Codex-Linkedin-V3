#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SETUP_ROOT = resolve(SCRIPT_DIR, '..');
const FIXTURE = join(SCRIPT_DIR, 'fixtures', 'supply-chain-knowledge-map.fixture.json');
const tempRoot = mkdtempSync(join(tmpdir(), 'supply-chain-knowledge-map-'));
let passed = 0;
const failures = [];

function run(script, args = []) {
  const result = spawnSync(process.execPath, [join(SCRIPT_DIR, script), ...args], {
    cwd: SETUP_ROOT,
    encoding: 'utf8',
  });
  if (result.error) throw result.error;
  return { status: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

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

function loadFixture() {
  return JSON.parse(readFileSync(FIXTURE, 'utf8'));
}

function writeFixture(filename, value) {
  const path = join(tempRoot, filename);
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return path;
}

test('small source-backed fixture validates', () => {
  const result = run('validate-supply-chain-knowledge-map.mjs', ['--input', FIXTURE]);
  assert(result.status === 0, result.output);
  assert(/source-backed status is explicit/i.test(result.output), result.output);
});

test('explicit branch returns its declared narrow card', () => {
  const result = run('select-supply-chain-knowledge-map.mjs', [
    '--input', FIXTURE,
    '--branch', 'BR-SCOPE-CHECK',
    '--view', 'narrow',
  ]);
  assert(result.status === 0, result.output);
  const card = JSON.parse(result.output);
  assert(card.view.name === 'narrow', 'Expected narrow view');
  assert(card.nodes.length === 1 && card.nodes[0].node_id === 'N-SIGNAL', 'Selector expanded beyond the declared narrow view');
  assert(card.handoff.status === 'eligible_for_opportunity_selection', 'Expected source-backed opportunity-selection handoff');
  assert(card.handoff.build_ready === false, 'The map selector must not approve a build');
});

test('filters return a declared deep card without automatic topic selection', () => {
  const result = run('select-supply-chain-knowledge-map.mjs', [
    '--input', FIXTURE,
    '--evidence-status', 'source_backed',
    '--cognitive-job', 'explain',
    '--view', 'deep',
  ]);
  assert(result.status === 0, result.output);
  const card = JSON.parse(result.output);
  assert(card.view.name === 'deep', 'Expected deep view');
  assert(card.nodes.length === 2 && card.edges.length === 1, 'Expected only explicitly declared deep relation');
  assert(card.handoff.build_ready === false, 'Selector must not make a build-ready card');
});

test('research seed remains research-only and cannot satisfy source-backed selection', () => {
  const result = run('select-supply-chain-knowledge-map.mjs', [
    '--input', FIXTURE,
    '--branch', 'BR-RESEARCH-SEED',
    '--view', 'wide',
  ]);
  assert(result.status === 0, result.output);
  const card = JSON.parse(result.output);
  assert(card.handoff.status === 'research_only', 'Research seed must be research-only');
  assert(card.handoff.build_ready === false, 'Research seed must never be build-ready');
  const rejected = run('select-supply-chain-knowledge-map.mjs', [
    '--input', FIXTURE,
    '--branch', 'BR-RESEARCH-SEED',
    '--require-source-backed',
  ]);
  assert(rejected.status !== 0, 'Expected research seed to be rejected by --require-source-backed');
  assert(/research_seed/.test(rejected.output), rejected.output);
});

test('source-backed branch cannot conceal a research-seed node', () => {
  const invalid = loadFixture();
  invalid.branches[0].node_ids.push('N-SEED');
  invalid.branches[0].views.wide.node_ids.push('N-SEED');
  const path = writeFixture('invalid-source-backed-branch.json', invalid);
  const result = run('validate-supply-chain-knowledge-map.mjs', ['--input', path]);
  assert(result.status !== 0, 'Expected source-backed branch to reject research-seed node');
  assert(/cannot be source_backed while selected node N-SEED is research_seed/.test(result.output), result.output);
});

test('source-backed branch requires complete source capsules', () => {
  const invalid = loadFixture();
  delete invalid.source_registry[0].source_capsule.supported_paraphrase;
  const path = writeFixture('invalid-source-capsule.json', invalid);
  const result = run('validate-supply-chain-knowledge-map.mjs', ['--input', path]);
  assert(result.status !== 0, 'Expected source-backed branch to reject an incomplete source capsule');
  assert(/source_backed requires a valid source capsule/.test(result.output), result.output);
  assert(/supported_paraphrase is required/.test(result.output), result.output);
});

test('incomplete support can remain explicitly research-only', () => {
  const seed = loadFixture();
  delete seed.source_registry[0].source_capsule.supported_paraphrase;
  seed.branches[0].evidence_status = 'research_seed';
  seed.branches[0].status = 'navigation_only';
  const path = writeFixture('research-seed-incomplete-capsule.json', seed);
  const validation = run('validate-supply-chain-knowledge-map.mjs', ['--input', path]);
  assert(validation.status === 0, validation.output);
  const selected = run('select-supply-chain-knowledge-map.mjs', ['--input', path, '--branch', 'BR-SCOPE-CHECK']);
  assert(selected.status === 0, selected.output);
  const card = JSON.parse(selected.output);
  assert(card.handoff.status === 'research_only', 'Incomplete source support must not emit an opportunity-selection handoff');
  assert(card.handoff.source_capsules.status === 'incomplete_or_invalid', 'Expected capsule defects in research-only handoff');
});

rmSync(tempRoot, { recursive: true, force: true });

if (failures.length) {
  process.stdout.write(`\n${failures.length} Supply-Chain Knowledge Map test(s) failed.\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`\n${passed} Supply-Chain Knowledge Map tests passed.\n`);
}
