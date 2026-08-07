#!/usr/bin/env node
/**
 * Validates Top-100 forensic provenance before records can feed Creative Genome
 * retrieval. A template-assisted candidate is useful for routing a future
 * review, but it is not a manual visual review and must never be upgraded by
 * the generator alone.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const root = process.cwd();
const directory = resolve(root, 'references/creative-review/top100-forensics');
const records = readdirSync(directory)
  .filter((name) => /^TOP100-\d{3}\.json$/.test(name))
  .sort()
  .map((name) => JSON.parse(readFileSync(resolve(directory, name), 'utf8')));
const errors = [];
const expected = new Set(Array.from({ length: 100 }, (_, index) => index + 1).filter((number) => ![6, 12, 75].includes(number)));
const MANUAL_STATUS = 'manual_forensic_review';
const CANDIDATE_STATUS = 'provisional_template_assisted_candidate';
const SHA256 = /^[a-f0-9]{64}$/;

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const validDate = (value) => nonEmpty(value) && !Number.isNaN(Date.parse(value));
const hashFile = (assetPath) => createHash('sha256').update(readFileSync(assetPath)).digest('hex');
const list = (value) => Array.isArray(value) ? value : [];

function localAsset(record, label) {
  const assetPath = record.asset?.path;
  if (!nonEmpty(assetPath) || assetPath.startsWith('/') || assetPath.startsWith('../')) {
    errors.push(`${label}: asset.path must be a repository-relative path.`);
    return null;
  }
  const fullPath = resolve(root, assetPath);
  if (!existsSync(fullPath) || !statSync(fullPath).isFile()) {
    errors.push(`${label}: asset.path does not resolve to a local file.`);
    return null;
  }
  if (relative(root, fullPath).startsWith('../')) {
    errors.push(`${label}: asset.path resolves outside the setup root.`);
    return null;
  }
  return fullPath;
}

function validateAssetIntegrity(record, label) {
  const fullPath = localAsset(record, label);
  const declaredHash = record.asset?.sha256;
  if (!SHA256.test(declaredHash ?? '')) {
    errors.push(`${label}: asset.sha256 must be a SHA-256 digest.`);
  } else if (fullPath && hashFile(fullPath) !== declaredHash) {
    errors.push(`${label}: asset.sha256 does not match the local asset.`);
  }
  if (!['single_image', 'gif'].includes(record.asset?.format)) {
    errors.push(`${label}: asset.format must be single_image or gif.`);
  }
  return fullPath;
}

function validateManualFrameEvidence(record, label) {
  if (record.asset?.format !== 'gif') return;
  const frames = list(record.asset?.frame_evidence);
  if (!frames.length) {
    errors.push(`${label}: a manually reviewed GIF requires frame_evidence.`);
    return;
  }
  for (const [index, frame] of frames.entries()) {
    if (!Number.isInteger(frame?.frame_index) || frame.frame_index < 0
      || !Number.isFinite(frame?.timestamp_ms) || frame.timestamp_ms < 0
      || !nonEmpty(frame?.observation)) {
      errors.push(`${label}: GIF frame evidence ${index + 1} requires frame_index, timestamp_ms, and observation.`);
    }
  }
}

function validateManualRecord(record, label) {
  if (record.schema_version !== '2.0.0') errors.push(`${label}: manual forensic records must use schema_version 2.0.0.`);
  if (record.review_method?.mode !== 'manual_asset_review') errors.push(`${label}: manual forensic record requires review_method.mode=manual_asset_review.`);
  if (record.template_assisted_hypotheses !== undefined) errors.push(`${label}: manual forensic record must not retain template_assisted_hypotheses.`);
  if (!nonEmpty(record.review_method?.visual_basis) || !nonEmpty(record.review_method?.context_basis)) {
    errors.push(`${label}: manual forensic record requires visual_basis and context_basis.`);
  }
  if (!nonEmpty(record.review_method?.reviewer) || !validDate(record.review_method?.reviewed_at) || !nonEmpty(record.review_method?.evidence)) {
    errors.push(`${label}: manual forensic record requires reviewer, valid reviewed_at, and evidence.`);
  }
  if (record.asset?.status !== 'manually_reviewed') errors.push(`${label}: manual forensic record requires asset.status=manually_reviewed.`);
  validateAssetIntegrity(record, label);
  const evidence = record.asset?.manual_review_evidence;
  if (!evidence || evidence.asset_sha256 !== record.asset?.sha256
    || evidence.reviewer !== record.review_method?.reviewer
    || evidence.reviewed_at !== record.review_method?.reviewed_at
    || !nonEmpty(evidence.reviewer) || !validDate(evidence.reviewed_at) || !nonEmpty(evidence.evidence)) {
    errors.push(`${label}: manual forensic record requires asset-bound reviewer/date/evidence that names the declared asset hash.`);
  }
  validateManualFrameEvidence(record, label);

  if (!record.attention_physics?.thumbnail_read_0_3_seconds || !record.attention_physics?.comprehension_3_10_seconds || !record.attention_physics?.value_exchange_10_30_seconds) {
    errors.push(`${label}: missing attention-physics layers.`);
  }
  if (!record.visual_forensics?.composition_and_grid || !Array.isArray(record.visual_forensics?.eye_path) || !record.visual_forensics?.imagery_role || !record.visual_forensics?.typography) {
    errors.push(`${label}: missing visual-forensics fields.`);
  }
  if (!record.content_mechanics?.primary_cognitive_job || !Array.isArray(record.content_mechanics?.argument_sequence) || !record.content_mechanics?.caption_to_visual_choreography) {
    errors.push(`${label}: missing content-mechanics fields.`);
  }
  const fingerprint = record.recombination?.mechanism_fingerprint;
  if (!fingerprint?.reader_state?.length || !fingerprint?.use_when?.length || !fingerprint?.do_not_use_when?.length || !/does not choose|chooses no/i.test(fingerprint.topic_selection_boundary ?? '')) {
    errors.push(`${label}: missing topic-neutral retrieval boundary.`);
  }
  if (!record.recombination?.reverse_build_specification || !record.recombination?.transferable_atoms?.length || !record.recombination?.anti_copy_boundary?.length || !record.recombination?.falsification_question) {
    errors.push(`${label}: missing reverse-construction safeguards.`);
  }
  const promotion = record.provenance?.promotion;
  if (promotion) {
    if (promotion.script !== 'scripts/promote-manual-ledger-forensics.mjs'
      || !nonEmpty(promotion.source_ledger_reference_id)
      || promotion.asset_path !== record.asset?.path
      || promotion.asset_sha256 !== record.asset?.sha256
      || !/template-assisted hypotheses were excluded/i.test(promotion.promotion_boundary ?? '')) {
      errors.push(`${label}: promoted manual record has incomplete ledger-promotion provenance.`);
    }
  }
}

function validateCandidateRecord(record, label) {
  if (record.schema_version !== '2.0.0') errors.push(`${label}: provisional candidates must use schema_version 2.0.0.`);
  if (record.review_method?.mode !== 'template_assisted_candidate') errors.push(`${label}: provisional candidate requires review_method.mode=template_assisted_candidate.`);
  if (!validDate(record.review_method?.generated_at) || !nonEmpty(record.review_method?.visual_basis) || !nonEmpty(record.review_method?.boundary)) {
    errors.push(`${label}: provisional candidate lacks generation provenance or its inspection boundary.`);
  }
  if (record.review_method?.reviewer !== null || record.review_method?.reviewed_at !== null || record.review_method?.evidence !== null) {
    errors.push(`${label}: provisional candidate cannot carry reviewer, reviewed_at, or manual evidence.`);
  }
  if (/direct\s+(visual\s+)?inspection|visually\s+inspected|first[-\s]?frame\s+reviewed/i.test(record.review_method?.visual_basis ?? '')) {
    errors.push(`${label}: provisional candidate contains a false direct-inspection claim.`);
  }
  if (record.asset?.status !== 'available_for_manual_review') errors.push(`${label}: provisional candidate requires asset.status=available_for_manual_review.`);
  validateAssetIntegrity(record, label);
  if (record.asset?.manual_review_evidence !== null || list(record.asset?.frame_evidence).length) {
    errors.push(`${label}: provisional candidate cannot contain manual review or GIF-frame evidence.`);
  }
  const hypothesis = record.template_assisted_hypotheses;
  if (!hypothesis || !nonEmpty(hypothesis.profile_name) || !nonEmpty(hypothesis.candidate_visual_mechanism)
    || !nonEmpty(hypothesis.required_next_step) || !/manual/i.test(hypothesis.required_next_step)) {
    errors.push(`${label}: provisional candidate requires explicit template hypotheses and a manual-review next step.`);
  }
  for (const key of ['attention_physics', 'visual_forensics', 'content_mechanics', 'recombination']) {
    if (record[key] !== undefined) errors.push(`${label}: provisional candidate must not carry unlabelled ${key} as manual forensic evidence.`);
  }
}

const counts = { manual_forensic_review: 0, provisional_template_assisted_candidate: 0 };
if (records.length !== expected.size) errors.push(`Expected ${expected.size} available-asset records, found ${records.length}.`);
for (const record of records) {
  const id = record.reference_id ?? '(unknown)';
  const number = Number(id.replace('TOP100-', ''));
  if (!expected.delete(number)) errors.push(`${id}: unexpected or duplicate record.`);
  if (record.forensic_record_status === MANUAL_STATUS) {
    counts.manual_forensic_review += 1;
    validateManualRecord(record, id);
  } else if (record.forensic_record_status === CANDIDATE_STATUS) {
    counts.provisional_template_assisted_candidate += 1;
    validateCandidateRecord(record, id);
  } else {
    errors.push(`${id}: forensic_record_status must be ${MANUAL_STATUS} or ${CANDIDATE_STATUS}.`);
  }
}
if (expected.size) errors.push(`Missing forensic records for available assets: ${[...expected].join(', ')}.`);
if (errors.length) {
  console.error(errors.map((error) => `FAIL ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Top-100 forensic provenance valid: ${counts.manual_forensic_review} manual/evidenced record(s); ${counts.provisional_template_assisted_candidate} template-assisted candidate(s) awaiting review.`);
