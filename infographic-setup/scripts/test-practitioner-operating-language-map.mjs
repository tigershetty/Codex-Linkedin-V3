#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SETUP_ROOT = resolve(SCRIPT_DIR, '..');
const FIXTURE = join(SCRIPT_DIR, 'fixtures', 'practitioner-operating-language-map.fixture.json');
const tempRoot = mkdtempSync(join(tmpdir(), 'practitioner-operating-language-map-'));
let passed = 0;
const failures = [];

function run(args = []) {
  const result = spawnSync(process.execPath, [join(SCRIPT_DIR, 'validate-practitioner-operating-language-map.mjs'), ...args], {
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

test('source-linked cross-vendor fixture validates with its inline audit', () => {
  const result = run(['--input', FIXTURE]);
  assert(result.status === 0, result.output);
  assert(/Optional final-copy audit valid and linked to the map/.test(result.output), result.output);
});

test('ready map rejects an observed phrase without native-language evidence', () => {
  const invalid = loadFixture();
  invalid.phrases[0].source_refs = ['SRC-SAP-RESCHEDULE'];
  const path = writeFixture('missing-native-phrase-evidence.json', invalid);
  const result = run(['--input', path]);
  assert(result.status !== 0, 'Expected invalid native phrase evidence to fail');
  assert(/observed_practitioner_phrase needs a native-language source/.test(result.output), result.output);
});

test('ready map rejects a source record without role, work, and system context', () => {
  const invalid = loadFixture();
  invalid.source_registry[1].context.system_context = '';
  const path = writeFixture('missing-source-context.json', invalid);
  const result = run(['--input', path]);
  assert(result.status !== 0, 'Expected missing source context to fail');
  assert(/source_registry\[1\]\.context\.system_context is required/.test(result.output), result.output);
});

test('ready map rejects a missing non-equivalence boundary', () => {
  const invalid = loadFixture();
  invalid.terms[0].non_equivalences = [];
  const path = writeFixture('missing-non-equivalence.json', invalid);
  const result = run(['--input', path]);
  assert(result.status !== 0, 'Expected missing non-equivalence to fail');
  assert(/non_equivalences needs at least one boundary/.test(result.output), result.output);
});

test('passed copy audit cannot retain an unmapped technical term', () => {
  const invalid = loadFixture();
  invalid.final_copy_audit.surfaces[0].unmapped_technical_terms = ['firmed receipt'];
  const path = writeFixture('unmapped-copy-term.json', invalid);
  const result = run(['--input', path]);
  assert(result.status !== 0, 'Expected passing audit with unmapped term to fail');
  assert(/pass cannot retain unmapped_technical_terms/.test(result.output), result.output);
});

test('external audit rejects vendor-specific wording without a named variant and system context', () => {
  const map = loadFixture();
  delete map.final_copy_audit;
  map.terms[0].context_mode = 'vendor_specific';
  map.terms[0].variants = [map.terms[0].variants[0]];
  map.scope.system_scope.mode = 'vendor_specific';
  map.scope.system_scope.systems = [map.scope.system_scope.systems[0]];
  const audit = {
    "map_id": map.map_id,
    "status": "pass",
    "reviewed_at": "2026-08-09",
    "reviewer": "Editorial QA",
    "surfaces": [
      {
        "surface_id": "SURFACE-EXTERNAL-01",
        "surface_type": "caption",
        "exact_copy": "The system says reschedule in.",
        "term_uses": [
          {
            "term_id": "TERM-RESCHEDULE-IN",
            "rendered_as": "reschedule in",
            "system_context_shown": false
          }
        ],
        "unmapped_technical_terms": [],
        "unresolved_non_equivalences": [],
        "false_universality_flags": []
      }
    ],
    "decision_note": "Deliberately invalid vendor-specific audit."
  };
  const mapPath = writeFixture('vendor-specific-map.json', map);
  const auditPath = writeFixture('vendor-specific-audit.json', audit);
  const result = run(['--input', mapPath, '--final-copy-audit', auditPath]);
  assert(result.status !== 0, 'Expected vendor-specific unlabelled term to fail');
  assert(/must name a variant for a vendor_specific term/.test(result.output), result.output);
});

const draftTemplate = {
  "$schema": "../references/creative-genome/schemas/practitioner-operating-language-map.schema.json",
  "schema_version": "1.0.0",
  "status": "draft",
  "map_id": "",
  "scope": {
    "primary_role": "",
    "exact_work_moment": "",
    "artifact": "",
    "trigger": "",
    "decision": "",
    "consequence": "",
    "system_scope": { "mode": "generic", "systems": [], "wording_boundary": "" },
    "source_refs": []
  },
  "source_registry": [],
  "phrases": [],
  "terms": [],
  "claim_boundary": { "public_wording_boundary": "", "does_not_establish": "", "source_refs": [] }
};

test('blank draft validates only with --allow-draft', () => {
  const path = writeFixture('draft-map.json', draftTemplate);
  const rejected = run(['--input', path]);
  assert(rejected.status !== 0, 'Expected draft map to require explicit allow-draft');
  assert(/draft input requires --allow-draft/.test(rejected.output), rejected.output);
  const allowed = run(['--input', path, '--allow-draft']);
  assert(allowed.status === 0, allowed.output);
});

rmSync(tempRoot, { recursive: true, force: true });

if (failures.length) {
  process.stdout.write(`\n${failures.length} Practitioner Operating Language Map test(s) failed.\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`\n${passed} Practitioner Operating Language Map tests passed.\n`);
}
