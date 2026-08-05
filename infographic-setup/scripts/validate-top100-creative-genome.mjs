#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const genome = JSON.parse(readFileSync(resolve(root, 'references/creative-genome/top100-creative-genome-v1.json'), 'utf8'));
const errors = [];
if (genome.scope?.complete_forensic_records !== 97) errors.push(`Expected 97 forensic records, found ${genome.scope?.complete_forensic_records ?? 'none'}.`);
if (genome.records?.length !== 97) errors.push(`Expected 97 indexed records, found ${genome.records?.length ?? 'none'}.`);
if (genome.records?.some((record) => record.mechanism_family === 'unclassified')) errors.push('Every forensic record must have a mechanism family.');
for (const record of genome.records ?? []) {
  if (!record.reference_id || !record.primary_cognitive_job || !record.reader_states?.length || !record.use_when?.length || !record.do_not_use_when?.length) {
    errors.push(`${record.reference_id ?? '(unknown)'} is missing required retrieval fields.`);
  }
  if (record.use_when?.some((item) => /topic|supply.chain|procurement|planning|logistics/i.test(item))) {
    errors.push(`${record.reference_id} has topic-bearing retrieval conditions.`);
  }
}
if (errors.length) {
  console.error(errors.map((error) => `FAIL ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Top-100 Creative Genome valid: ${genome.records.length} records across ${genome.mechanism_families.length} topic-neutral mechanism families.`);
