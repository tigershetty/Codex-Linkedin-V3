#!/usr/bin/env node

/**
 * Evaluate two outcome-blind coding runs.
 *
 * This measures inter-run consistency between two model passes. It is not a
 * human-validity study and it cannot validate visual structure when the blind
 * input contains only a native-format summary.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const itemsPath = arg('--items');
const coderAPath = arg('--coder-a');
const coderBPath = arg('--coder-b');
const codebookPath = arg('--codebook');
const outputDir = arg('--output-dir');
if (!itemsPath || !coderAPath || !coderBPath || !outputDir) {
  console.error('Usage: node evaluate-linkedin-v4-reliability.mjs --items FILE --coder-a FILE --coder-b FILE --output-dir DIR [--codebook FILE]');
  process.exit(2);
}

const FIELDS = [
  'audience_specificity', 'entry_hook', 'job_promised', 'primary_proof',
  'primary_artifact', 'platform_format', 'primary_cta', 'content_class',
  'problem_family', 'OC_INPUTS', 'OC_STEPS', 'OC_OUTPUT', 'OC_VALIDATION',
  'DD_NEWS', 'DD_PROMOTION', 'DD_PERSONAL_AUTHORITY', 'DD_COMMENT_GATE',
  'DD_EVERGREEN',
];
const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const round = (value, digits = 4) => Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
const codeOf = (item, field) => {
  const value = item?.codes?.[field] ?? item?.[field];
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return String(value[0] ?? '').trim();
  if (value && typeof value === 'object') return String(value.code ?? value.value ?? '').trim();
  return '';
};
const csvEscape = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const itemsText = await readFile(resolve(itemsPath), 'utf8');
const coderAText = await readFile(resolve(coderAPath), 'utf8');
const coderBText = await readFile(resolve(coderBPath), 'utf8');
const codebookText = codebookPath ? await readFile(resolve(codebookPath), 'utf8') : null;
const expectedItems = JSON.parse(itemsText);
const coderA = JSON.parse(coderAText);
const coderB = JSON.parse(coderBText);
const aMap = new Map((coderA.items || []).map((item) => [item.blindPostId, item]));
const bMap = new Map((coderB.items || []).map((item) => [item.blindPostId, item]));

const currentItemsSha256 = sha256(itemsText);
const currentCodebookSha256 = codebookText ? sha256(codebookText) : null;
const provenanceIssues = [];
for (const [label, coder] of [['coder_a', coderA], ['coder_b', coderB]]) {
  if (!coder.input_sha256) provenanceIssues.push(`${label}_input_sha_missing`);
  else if (coder.input_sha256 !== currentItemsSha256) provenanceIssues.push(`${label}_input_sha_mismatch`);
  if (currentCodebookSha256) {
    if (!coder.codebook_sha256) provenanceIssues.push(`${label}_codebook_sha_missing`);
    else if (coder.codebook_sha256 !== currentCodebookSha256) provenanceIssues.push(`${label}_codebook_sha_mismatch`);
  }
}

const structuralIssues = [];
for (const expected of expectedItems) {
  const a = aMap.get(expected.blindPostId);
  const b = bMap.get(expected.blindPostId);
  if (!a) structuralIssues.push(`coder_a_missing:${expected.blindPostId}`);
  if (!b) structuralIssues.push(`coder_b_missing:${expected.blindPostId}`);
  for (const [label, item] of [['coder_a', a], ['coder_b', b]]) {
    if (!item) continue;
    if (item.passId && item.passId !== expected.passId) structuralIssues.push(`${label}_pass_mismatch:${expected.blindPostId}`);
    for (const field of FIELDS) if (!codeOf(item, field)) structuralIssues.push(`${label}_missing_field:${expected.blindPostId}:${field}`);
  }
}
for (const id of aMap.keys()) if (!expectedItems.some((item) => item.blindPostId === id)) structuralIssues.push(`coder_a_unexpected:${id}`);
for (const id of bMap.keys()) if (!expectedItems.some((item) => item.blindPostId === id)) structuralIssues.push(`coder_b_unexpected:${id}`);

function gwetAc1(pairs) {
  if (!pairs.length) return { ac1: null, observedAgreement: null, expectedAgreement: null, categoryCount: 0 };
  const categories = [...new Set(pairs.flatMap(([a, b]) => [a, b]))];
  const observedAgreement = pairs.filter(([a, b]) => a === b).length / pairs.length;
  if (categories.length <= 1) return { ac1: null, observedAgreement, expectedAgreement: null, categoryCount: categories.length };
  const totalAssignments = pairs.length * 2;
  const marginals = categories.map((category) => pairs.flatMap(([a, b]) => [a, b]).filter((value) => value === category).length / totalAssignments);
  const expectedAgreement = marginals.reduce((sum, probability) => sum + probability * (1 - probability), 0) / (categories.length - 1);
  const denominator = 1 - expectedAgreement;
  return {
    ac1: denominator === 0 ? null : (observedAgreement - expectedAgreement) / denominator,
    observedAgreement,
    expectedAgreement,
    categoryCount: categories.length,
  };
}

function phaseMetrics(passId) {
  const phaseItems = expectedItems.filter((item) => item.passId === passId);
  const byField = [];
  let agreements = 0;
  let comparisons = 0;
  for (const field of FIELDS) {
    const pairs = phaseItems
      .map((expected) => [codeOf(aMap.get(expected.blindPostId), field), codeOf(bMap.get(expected.blindPostId), field)])
      .filter(([a, b]) => a && b);
    const exactN = pairs.filter(([a, b]) => a === b).length;
    const agreement = pairs.length ? exactN / pairs.length : null;
    const ac = gwetAc1(pairs);
    agreements += exactN;
    comparisons += pairs.length;
    const disagreements = [...new Set(pairs.filter(([a, b]) => a !== b).map(([a, b]) => `${a} <> ${b}`))].join(' | ');
    byField.push({
      passId,
      field,
      itemN: pairs.length,
      exactN,
      exactAgreement: round(agreement),
      gwetAc1: round(ac.ac1),
      categoryCount: ac.categoryCount,
      expectedAgreement: round(ac.expectedAgreement),
      disagreements,
    });
  }
  const overallExactAgreement = comparisons ? agreements / comparisons : null;
  const threshold = passId === 'calibration' ? 0.85 : 0.90;
  const exactFieldsPass = byField.every((row) => row.exactAgreement !== null && row.exactAgreement >= 0.80);
  const ac1FieldsPass = byField.every((row) => row.gwetAc1 === null || row.gwetAc1 >= 0.70);
  const pass = structuralIssues.length === 0
    && overallExactAgreement >= threshold
    && exactFieldsPass
    && ac1FieldsPass;
  return {
    passId,
    itemN: phaseItems.length,
    comparisons,
    overallExactAgreement: round(overallExactAgreement),
    requiredOverallAgreement: threshold,
    minimumFieldAgreement: round(Math.min(...byField.map((row) => row.exactAgreement ?? 0))),
    exactFieldsPass,
    ac1FieldsPass,
    pass,
    byField,
  };
}

const calibration = phaseMetrics('calibration');
const holdout = phaseMetrics('holdout');
const formalGatePass = calibration.pass && holdout.pass;
const result = {
  schemaVersion: 1,
  evaluatedAt: new Date().toISOString(),
  classification: 'model_inter_run_consistency_not_human_validity',
  input: {
    itemsPath: resolve(itemsPath),
    itemsSha256: currentItemsSha256,
    coderAPath: resolve(coderAPath),
    coderASha256: sha256(coderAText),
    coderBPath: resolve(coderBPath),
    coderBSha256: sha256(coderBText),
    codebookPath: codebookPath ? resolve(codebookPath) : null,
    codebookSha256: currentCodebookSha256,
  },
  structuralIssues,
  provenanceIssues,
  calibration: { ...calibration, byField: undefined },
  holdout: { ...holdout, byField: undefined, formalInterpretation: calibration.pass ? 'eligible_for_holdout_gate' : 'descriptive_only_because_calibration_failed' },
  formalGatePass,
  decision: formalGatePass
    ? `Inter-run consistency thresholds passed. This does not establish human validity or visual-structure reliability.${provenanceIssues.length ? ' Reliability provenance is incomplete; no exact-final-codebook claim is permitted.' : ''}`
    : `Do not freeze the meaning-heavy taxonomy. Revise/adjudicate failed fields before using them as decision-grade evidence.${provenanceIssues.length ? ' Reliability provenance is incomplete; no exact-final-codebook claim is permitted.' : ''}`,
  excludedModule: 'Primary visual structure and visual descriptors were not evaluated because the blind input exposed only native-format summaries.',
};

const out = resolve(outputDir);
await mkdir(out, { recursive: true });
const fieldRows = [...calibration.byField, ...holdout.byField];
await writeFile(resolve(out, 'reliability-summary.json'), `${JSON.stringify(result, null, 2)}\n`);
await writeFile(resolve(out, 'reliability-by-field.csv'), [
  ['pass_id', 'field', 'item_n', 'exact_n', 'exact_agreement', 'gwet_ac1', 'category_count', 'expected_agreement', 'disagreement_pairs'].join(','),
  ...fieldRows.map((row) => [row.passId, row.field, row.itemN, row.exactN, row.exactAgreement, row.gwetAc1, row.categoryCount, row.expectedAgreement, row.disagreements].map(csvEscape).join(',')),
].join('\n') + '\n');

const status = formalGatePass ? 'PASS' : 'FAIL';
const markdown = [
  '# LinkedIn V4 Blind-Code Inter-Run Consistency',
  '',
  `**Status:** ${status}`,
  '**Interpretation:** two independent model passes; not human validity',
  `**Structural issues:** ${structuralIssues.length}`,
  `**Provenance issues:** ${provenanceIssues.length}`,
  ...(provenanceIssues.length ? ['', ...provenanceIssues.map((issue) => `- \`${issue}\``)] : []),
  '',
  '| Phase | Items | Overall exact | Required | Lowest field | AC1 fields pass | Result |',
  '|---|---:|---:|---:|---:|---|---|',
  `| Calibration | ${calibration.itemN} | ${(calibration.overallExactAgreement * 100).toFixed(1)}% | 85.0% | ${(calibration.minimumFieldAgreement * 100).toFixed(1)}% | ${calibration.ac1FieldsPass ? 'yes' : 'no'} | ${calibration.pass ? 'PASS' : 'FAIL'} |`,
  `| Holdout | ${holdout.itemN} | ${(holdout.overallExactAgreement * 100).toFixed(1)}% | 90.0% | ${(holdout.minimumFieldAgreement * 100).toFixed(1)}% | ${holdout.ac1FieldsPass ? 'yes' : 'no'} | ${holdout.pass ? 'PASS' : 'FAIL'} |`,
  '',
  '| Phase | Field | Exact agreement | Gwet AC1 | Categories |',
  '|---|---|---:|---:|---:|',
  ...fieldRows.map((row) => `| ${row.passId} | ${row.field} | ${(row.exactAgreement * 100).toFixed(1)}% | ${row.gwetAc1 === null ? 'NA' : row.gwetAc1.toFixed(3)} | ${row.categoryCount} |`),
  '',
  `**Decision:** ${result.decision}`,
  '',
  `**Excluded module:** ${result.excludedModule}`,
  '',
];
await writeFile(resolve(out, 'reliability-report.md'), markdown.join('\n'));
console.log(JSON.stringify(result, null, 2));
if (structuralIssues.length) process.exit(1);
