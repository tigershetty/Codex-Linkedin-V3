#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const genome = JSON.parse(readFileSync(resolve(root, 'references/creative-genome/top100-creative-genome-v1.json'), 'utf8'));
const errors = [];
const SHA256 = /^[a-f0-9]{64}$/;
const manual = genome.scope?.manual_forensic_records;
const candidates = genome.scope?.provisional_template_candidates;
const available = genome.scope?.available_asset_records;

if (genome.schema_version !== '2.0.0') errors.push(`Expected Creative Genome schema 2.0.0, found ${genome.schema_version ?? 'none'}.`);
if (!Number.isInteger(available) || !Number.isInteger(manual) || !Number.isInteger(candidates) || available !== manual + candidates) {
  errors.push('Creative Genome scope must account for every available asset as either manual/evidenced or provisional.');
}
if (genome.records?.length !== manual) errors.push(`Expected ${manual ?? 'declared'} manual/evidenced indexed records, found ${genome.records?.length ?? 'none'}.`);
if (genome.provisional_template_candidates?.length !== candidates) errors.push(`Expected ${candidates ?? 'declared'} provisional candidates, found ${genome.provisional_template_candidates?.length ?? 'none'}.`);
if (!/Never retrieve from provisional_template_candidates/i.test(genome.retrieval_contract?.provenance_rule ?? '')) {
  errors.push('Creative Genome must explicitly prohibit retrieval from provisional candidates.');
}
if (genome.records?.some((record) => record.mechanism_family === 'unclassified')) errors.push('Every manual forensic record must have a mechanism family.');
for (const record of genome.records ?? []) {
  if (!record.reference_id || !record.primary_cognitive_job || !record.reader_states?.length || !record.use_when?.length || !record.do_not_use_when?.length) {
    errors.push(`${record.reference_id ?? '(unknown)'} is missing required retrieval fields.`);
  }
  if (!record.asset_path || !SHA256.test(record.asset_sha256 ?? '') || record.forensic_record_status !== 'manual_forensic_review'
    || !record.reviewer || Number.isNaN(Date.parse(record.reviewed_at ?? ''))) {
    errors.push(`${record.reference_id ?? '(unknown)'} is missing asset-bound manual-review provenance.`);
  }
  if (record.use_when?.some((item) => /topic|supply.chain|procurement|planning|logistics/i.test(item))) {
    errors.push(`${record.reference_id} has topic-bearing retrieval conditions.`);
  }
}
const familyRecordIds = (genome.mechanism_families ?? []).flatMap((family) => family.reference_ids ?? []);
if (familyRecordIds.length !== manual || new Set(familyRecordIds).size !== manual) {
  errors.push('Mechanism-family coverage must account for every manual/evidenced retrieval record exactly once.');
}
for (const candidate of genome.provisional_template_candidates ?? []) {
  if (candidate.status !== 'provisional_template_assisted_candidate' || !candidate.reference_id || !candidate.asset_path || !candidate.asset_sha256) {
    errors.push(`${candidate.reference_id ?? '(unknown)'} is not a valid provenance-bound provisional candidate.`);
  }
}
if (errors.length) {
  console.error(errors.map((error) => `FAIL ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Top-100 Creative Genome valid: ${manual} manual/evidenced retrieval record(s) across ${genome.mechanism_families.length} mechanism families; ${candidates} provisional candidate(s) remain outside retrieval.`);
