#!/usr/bin/env node
/**
 * Retrieve Top-100 mechanism records by reader condition. It intentionally has
 * no topic argument: opportunity selection precedes creative retrieval.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const get = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] ?? '' : '';
};
const limit = Number(get('--limit') || 8);
const query = {
  reader_state: get('--reader-state'),
  response: get('--response'),
  cognitive_job: get('--cognitive-job'),
};
if (!query.reader_state && !query.response && !query.cognitive_job) {
  console.error('Usage: node scripts/retrieve-top100-creative-mechanisms.mjs --reader-state "choice overload" [--response "practical use"] [--cognitive-job "orient"] [--limit 8]');
  process.exit(2);
}

const tokens = (text) => String(text).toLowerCase().match(/[a-z0-9]+/g) ?? [];
const overlap = (needle, haystack) => {
  const left = new Set(tokens(needle));
  const right = new Set(tokens(haystack));
  return [...left].filter((token) => right.has(token)).length;
};
const genome = JSON.parse(readFileSync(resolve(process.cwd(), 'references/creative-genome/top100-creative-genome-v1.json'), 'utf8'));
const desired = [query.reader_state, query.response, query.cognitive_job].filter(Boolean).join(' ');
const ranked = genome.records
  .map((record) => {
    const score = overlap(query.reader_state, record.reader_states.join(' ')) * 5
      + overlap(query.response, record.social_actions.join(' ')) * 3
      + overlap(query.cognitive_job, record.primary_cognitive_job) * 4
      + overlap(desired, `${record.use_when.join(' ')} ${record.reverse_build_specification}`);
    return { ...record, score };
  })
  .filter((record) => record.score > 0)
  .sort((left, right) => right.score - left.score || left.reference_id.localeCompare(right.reference_id))
  .slice(0, Number.isFinite(limit) && limit > 0 ? limit : 8)
  .map((record) => ({
    reference_id: record.reference_id,
    mechanism_family: record.mechanism_family,
    score: record.score,
    primary_cognitive_job: record.primary_cognitive_job,
    reader_states: record.reader_states,
    use_when: record.use_when,
    do_not_use_when: record.do_not_use_when,
    transferable_atoms: record.transferable_atoms,
    anti_copy_boundary: record.anti_copy_boundary,
  }));

console.log(JSON.stringify({
  query,
  boundary: 'Topic deliberately unselected. Use this result only to assemble original creative routes after a real opportunity is chosen.',
  candidates: ranked,
}, null, 2));
