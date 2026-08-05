#!/usr/bin/env node
/** Validates the forensic source layer before it is used for Genome retrieval. */
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const directory = resolve(process.cwd(), 'references/creative-review/top100-forensics');
const records = readdirSync(directory)
  .filter((name) => /^TOP100-\d{3}\.json$/.test(name))
  .sort()
  .map((name) => JSON.parse(readFileSync(resolve(directory, name), 'utf8')));
const errors = [];
const expected = new Set(Array.from({ length: 100 }, (_, index) => index + 1).filter((number) => ![6, 12, 75].includes(number)));

if (records.length !== expected.size) errors.push(`Expected ${expected.size} available-asset records, found ${records.length}.`);
for (const record of records) {
  const id = record.reference_id ?? '(unknown)';
  const number = Number(id.replace('TOP100-', ''));
  if (!expected.delete(number)) errors.push(`${id}: unexpected or duplicate record.`);
  if (!/Direct inspection of the local Top-100 asset/.test(record.review_method?.visual_basis ?? '')) errors.push(`${id}: lacks direct visual-inspection basis.`);
  if (record.asset?.status !== 'visually_inspected') errors.push(`${id}: asset is not marked visually inspected.`);
  if (!record.attention_physics?.thumbnail_read_0_3_seconds || !record.attention_physics?.comprehension_3_10_seconds || !record.attention_physics?.value_exchange_10_30_seconds) errors.push(`${id}: missing attention-physics layers.`);
  if (!record.visual_forensics?.composition_and_grid || !Array.isArray(record.visual_forensics?.eye_path) || !record.visual_forensics?.imagery_role || !record.visual_forensics?.typography) errors.push(`${id}: missing visual-forensics fields.`);
  if (!record.content_mechanics?.primary_cognitive_job || !Array.isArray(record.content_mechanics?.argument_sequence) || !record.content_mechanics?.caption_to_visual_choreography) errors.push(`${id}: missing content-mechanics fields.`);
  const fingerprint = record.recombination?.mechanism_fingerprint;
  if (!fingerprint?.reader_state?.length || !fingerprint?.use_when?.length || !fingerprint?.do_not_use_when?.length || !/does not choose|chooses no/i.test(fingerprint.topic_selection_boundary ?? '')) errors.push(`${id}: missing topic-neutral retrieval boundary.`);
  if (!record.recombination?.reverse_build_specification || !record.recombination?.transferable_atoms?.length || !record.recombination?.anti_copy_boundary?.length || !record.recombination?.falsification_question) errors.push(`${id}: missing reverse-construction safeguards.`);
}
if (expected.size) errors.push(`Missing forensic records for available assets: ${[...expected].join(', ')}.`);
if (errors.length) {
  console.error(errors.map((error) => `FAIL ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Top-100 forensic layer valid: ${records.length} directly inspected, topic-neutral creative records.`);
