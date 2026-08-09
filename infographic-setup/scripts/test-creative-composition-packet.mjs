#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SETUP_ROOT = resolve(SCRIPT_DIR, '..');
const tempRoot = mkdtempSync(join(tmpdir(), 'creative-composition-packet-'));
const failures = [];
let passed = 0;

function run(args = []) {
  const result = spawnSync(process.execPath, [join(SCRIPT_DIR, 'validate-creative-composition-packet.mjs'), ...args], {
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

function write(path, content) {
  writeFileSync(path, content, 'utf8');
  return path;
}

function writeJson(filename, value) {
  return write(join(tempRoot, filename), `${JSON.stringify(value, null, 2)}\n`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildReadyCandidate(overrides = {}) {
  return {
    schema_version: '1.0.0',
    status: 'build_ready',
    candidate_id: 'RC-COMPOSITION-CONTRACT-001',
    reader_contract: {
      reader: 'Planner preparing an exception discussion.',
      exact_work_moment: 'A committed order needs a defensible availability check before a meeting.',
      reader_language: 'Which condition actually changes the next decision?',
      broad_bridge: 'Anyone defending an operational decision can recognise the need to separate inputs from commitments.',
    },
    problem_signal: {
      observed_problem: 'Documented planning guidance distinguishes source availability from the customer-facing commitment that must be made with it.',
      source_records: [{
        source_id: 'SRC-CONTRACT-001',
        source_type: 'official_guidance',
        location: 'https://example.invalid/official-guidance',
        use: 'Defines the factual boundary for this contract fixture.',
        limitation: 'A test fixture; it makes no public outcome claim.',
      }],
      confidence: 'documented_method',
      unknowns: ['The fixture is not an operational recommendation.'],
    },
    immediate_handle: {
      reader_can_do: 'Prepare a clearer first check.',
      before_after_difference: 'The reader can identify which input belongs to which decision.',
      not_solved: 'It cannot set a company-specific promise date.',
    },
    useful_angle: {
      familiar_version: 'A generic exception checklist.',
      specific_difference: 'A visual object separates the input, decision, and uncertainty it removes.',
      reframe_if_generic: 'Park it if the relation cannot be drawn without generic labels.',
    },
    density_inventory: [
      {
        unit: 'Input state',
        uncertainty_removed: 'What has actually changed.',
        support_route: 'Documented-method fixture.',
        public_status: 'framework_logic',
      },
      {
        unit: 'Decision boundary',
        uncertainty_removed: 'What the reader can decide now.',
        support_route: 'Documented-method fixture.',
        public_status: 'framework_logic',
      },
      {
        unit: 'Known limitation',
        uncertainty_removed: 'What must not be inferred from the visual.',
        support_route: 'Documented-method fixture.',
        public_status: 'framework_logic',
      },
    ],
    claim_route: {
      mode: 'framework',
      public_wording_boundary: 'This fixture demonstrates only a framework relationship, not an outcome.',
      required_support: ['Correct logic and scope check.'],
    },
    market_scan: {
      status: 'lightweight_reviewed',
      finding: 'This fixture has a specific reader moment and a non-generic visual relation.',
      references: ['https://example.invalid/market-scan'],
    },
    decision: {
      outcome: 'build',
      reason: 'The fixture exists only to test a complete build-ready contract.',
      next_step: 'Develop three different low-fidelity direction artifacts.',
    },
    ...overrides,
  };
}

function direction(id, semanticObject, path) {
  return {
    route_id: id,
    semantic_object: semanticObject,
    direction_artifact_path: path,
    spatial_truth: `The ${semanticObject} makes one real relationship visible rather than decorating labels.`,
    first_frame: `A reader sees the ${semanticObject} object before any supporting detail.`,
    reading_route: 'Start with the decision, then follow the relationship to its constraint.',
    density_translation: ['One visual unit removes one named uncertainty.'],
    visual_carries: 'The operational relationship and the immediate reader action.',
    caption_carries: 'The context, scope, and one careful boundary.',
    anti_copy_transformation: 'The route changes the subject, geometry, wording, and source expression.',
    kill_condition: 'Kill if the reader cannot identify the working relationship in one look.',
  };
}

function writeDirectionArtifacts() {
  const variants = [
    ['R-DECISION', 'decision_path'],
    ['R-COMPARE', 'comparison'],
    ['R-DIAGNOSE', 'diagnostic'],
  ];
  return variants.map(([id, semanticObject]) => {
    const path = join(tempRoot, `${id.toLowerCase()}.md`);
    write(path, `# ${id} low-fidelity direction\n\nSemantic object: ${semanticObject}\n\nThis is a deliberately rough object. It shows where the reader starts, which relationship becomes visible, and which uncertainty the visual removes before detailed production begins.\n`);
    return direction(id, semanticObject, path);
  });
}

function canonicalSourceRoles() {
  return {
    information_mechanism: {
      corpus: 'pierri',
      record_id: 'PIERRI-043',
      record_path: 'references/creative-review/pierri-forensics/records/PIERRI-043.json',
      canonical_mechanism_pointer: '/transferable_mechanism/mechanism',
      anti_copy_boundary_pointer: '/anti_copy_boundary',
    },
    attention_or_utility: {
      corpus: 'top100',
      record_id: 'TOP100-001',
      record_path: 'references/creative-review/top100-forensics/TOP100-001.json',
      canonical_mechanism_pointer: '/recombination/transferable_atoms/0',
      anti_copy_boundary_pointer: '/recombination/anti_copy_boundary',
    },
    caption_mechanism: {
      corpus: 'top100',
      record_id: 'TOP100-001',
      record_path: 'references/creative-review/top100-forensics/TOP100-001.json',
      canonical_mechanism_pointer: '/source_context/caption_hook',
      anti_copy_boundary_pointer: '/recombination/anti_copy_boundary',
    },
  };
}

function packet(candidatePath, routes, overrides = {}) {
  return {
    schema_version: '1.0.0',
    status: 'routes_ready',
    packet_id: 'CCP-COMPOSITION-CONTRACT-001',
    candidate_card_path: candidatePath,
    source_roles: canonicalSourceRoles(),
    routes,
    selection: {
      decision: 'pending',
      selected_route_id: null,
      reason: '',
    },
    ...overrides,
  };
}

function expectFailure(result, expression, label) {
  assert(result.status !== 0, `${label} unexpectedly passed.\n${result.output}`);
  assert(expression.test(result.output), `${label} did not report ${expression}.\n${result.output}`);
}

test('loads canonical source fields and accepts three real direction artifacts', () => {
  const candidatePath = writeJson('valid-candidate.json', buildReadyCandidate());
  const packetPath = writeJson('valid-routes.json', packet(candidatePath, writeDirectionArtifacts()));
  const result = run(['--input', packetPath]);
  assert(result.status === 0, result.output);
  assert(/Canonical source roles loaded: .*PIERRI-043.*TOP100-001/.test(result.output), result.output);
});

test('revalidates the referenced candidate in full instead of trusting its status label', () => {
  const invalidCandidate = buildReadyCandidate({
    claim_route: {
      mode: 'framework',
      public_wording_boundary: '',
      required_support: [],
    },
  });
  const candidatePath = writeJson('invalid-candidate.json', invalidCandidate);
  const packetPath = writeJson('invalid-candidate-packet.json', packet(candidatePath, writeDirectionArtifacts()));
  expectFailure(run(['--input', packetPath]), /failed full Resource Candidate Card validation/, 'Invalid build-ready candidate');
});

test('enforces Pierri for information and Top-100 for attention and caption roles', () => {
  const candidatePath = writeJson('role-candidate.json', buildReadyCandidate());
  const invalid = packet(candidatePath, writeDirectionArtifacts());
  invalid.source_roles.attention_or_utility.corpus = 'pierri';
  const packetPath = writeJson('wrong-corpus-packet.json', invalid);
  expectFailure(run(['--input', packetPath]), /attention_or_utility\.corpus must be top100/, 'Wrong attention corpus');
});

test('rejects a Top-100 caption role when its canonical record has no caption context', () => {
  const candidatePath = writeJson('caption-context-candidate.json', buildReadyCandidate());
  const invalid = packet(candidatePath, writeDirectionArtifacts());
  invalid.source_roles.caption_mechanism = {
    corpus: 'top100',
    record_id: 'TOP100-013',
    record_path: 'references/creative-review/top100-forensics/TOP100-013.json',
    canonical_mechanism_pointer: '/source_context/caption_hook',
    anti_copy_boundary_pointer: '/recombination/anti_copy_boundary',
  };
  const packetPath = writeJson('missing-caption-context-packet.json', invalid);
  expectFailure(run(['--input', packetPath]), /requires canonical caption context/, 'Missing canonical caption context');
});

test('rejects copied source text in place of canonical source pointers', () => {
  const candidatePath = writeJson('copied-text-candidate.json', buildReadyCandidate());
  const invalid = packet(candidatePath, writeDirectionArtifacts());
  invalid.source_roles.information_mechanism.mechanism = 'A rewritten source mechanism should not be trusted.';
  const packetPath = writeJson('copied-text-packet.json', invalid);
  expectFailure(run(['--input', packetPath]), /information_mechanism\.mechanism is not allowed/, 'Rewritten source mechanism');
});

test('rejects three poster variants that declare the same semantic object', () => {
  const candidatePath = writeJson('duplicate-object-candidate.json', buildReadyCandidate());
  const routes = writeDirectionArtifacts();
  routes[2].semantic_object = 'comparison';
  const packetPath = writeJson('duplicate-object-packet.json', packet(candidatePath, routes));
  expectFailure(run(['--input', packetPath]), /at least three different semantic objects/, 'Duplicate semantic object');
});

test('requires a selected-route review artifact before valid_ready', () => {
  const candidatePath = writeJson('valid-ready-candidate.json', buildReadyCandidate());
  const routes = writeDirectionArtifacts();
  const missingReview = packet(candidatePath, routes, {
    status: 'valid_ready',
    selection: {
      decision: 'select',
      selected_route_id: 'R-DECISION',
      reason: 'This route makes the reader action visible with the least translation.',
    },
    selected_route_review_path: null,
  });
  const missingReviewPath = writeJson('missing-review-packet.json', missingReview);
  expectFailure(run(['--input', missingReviewPath]), /selected_route_review_path is required/, 'Missing selected-route review');

  const reviewPath = join(tempRoot, 'selected-route-review.md');
  write(reviewPath, '# Selected route review\n\nSelected route: R-DECISION\n\nThe decision path gives the reader a usable first check. It stays separate from the other two objects and has enough actual detail to enter deterministic visual production.\n');
  const validReady = clone(missingReview);
  validReady.selected_route_review_path = reviewPath;
  const validReadyPath = writeJson('valid-ready-packet.json', validReady);
  const result = run(['--input', validReadyPath]);
  assert(result.status === 0, result.output);
  assert(/status=valid_ready/.test(result.output), result.output);
});

rmSync(tempRoot, { recursive: true, force: true });

if (failures.length) {
  process.stdout.write(`\n${failures.length} Creative Composition Packet test(s) failed.\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`\n${passed} Creative Composition Packet tests passed.\n`);
}
