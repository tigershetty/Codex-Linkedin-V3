#!/usr/bin/env node
/**
 * Builds the searchable, topic-neutral Creative Genome from completed Top-100
 * forensic records. The result answers "what creative mechanism fits this
 * reader state?"; it must never decide the topic itself.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const forensicRoot = resolve(root, 'references/creative-review/top100-forensics');
const outputRoot = resolve(root, 'references/creative-genome');
const jsonPath = resolve(outputRoot, 'top100-creative-genome-v1.json');
const markdownPath = resolve(outputRoot, 'top100-creative-genome-v1.md');

const records = readdirSync(forensicRoot)
  .filter((name) => /^TOP100-\d{3}\.json$/.test(name))
  .sort()
  .map((name) => JSON.parse(readFileSync(resolve(forensicRoot, name), 'utf8')));

const value = (candidate) => typeof candidate === 'string' ? candidate.trim() : '';
const list = (candidate) => Array.isArray(candidate) ? candidate.filter((item) => value(item)) : [];
const unique = (items) => [...new Set(items.filter((item) => value(item)))];
const short = (text, max = 180) => text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

const FAMILY_RULES = [
  ['comparison', (grammar) => grammar.some((item) => /equal lanes|comparison schema/i.test(item))],
  ['system_map', (grammar) => grammar.some((item) => /central anchor|relationship connectors|visual zones/i.test(item))],
  ['workflow', (grammar) => grammar.some((item) => /numbered sequence|progress cue|one visible action/i.test(item))],
  ['field_guide', (grammar) => grammar.some((item) => /modular reference blocks|repeated card\/row rule/i.test(item))],
  ['maturity', (grammar) => grammar.some((item) => /levels, rings, stages|capability shift/i.test(item))],
  ['metaphor', (grammar) => grammar.some((item) => /unexpected|surprising metaphor|visual object or scene/i.test(item))],
  ['before_after', (grammar) => grammar.some((item) => /same system shown twice|shared scene or process|current and changed state|visibly bad state/i.test(item))],
  ['product_proof', (grammar) => grammar.some((item) => /tangible object\/interface|benefit modules/i.test(item))],
  ['data_landscape', (grammar) => grammar.some((item) => /category groups|shared legend/i.test(item))],
  ['collection', (grammar) => grammar.some((item) => /collection wall|many small coherent artifacts/i.test(item))],
  ['taxonomy', (grammar) => grammar.some((item) => /category tiles or branches|consistent visual key/i.test(item))],
];

function familyFor(record) {
  const grammar = list(record.recombination?.mechanism_fingerprint?.visual_grammar);
  return FAMILY_RULES.find(([, predicate]) => predicate(grammar))?.[0] ?? 'unclassified';
}

const families = new Map();
for (const record of records) {
  const family = familyFor(record);
  const fingerprint = record.recombination?.mechanism_fingerprint ?? {};
  const current = families.get(family) ?? {
    mechanism_family: family,
    reference_ids: [],
    asset_paths: [],
    cognitive_jobs: [],
    reader_states: [],
    visual_grammars: [],
    information_grammars: [],
    social_actions: [],
    use_when: [],
    do_not_use_when: [],
    transferable_atoms: [],
    anti_copy_boundaries: [],
    reverse_build_specs: [],
  };
  current.reference_ids.push(record.reference_id);
  current.asset_paths.push(record.asset?.path ?? '');
  current.cognitive_jobs.push(value(fingerprint.primary_cognitive_job));
  current.reader_states.push(...list(fingerprint.reader_state));
  current.visual_grammars.push(...list(fingerprint.visual_grammar));
  current.information_grammars.push(...list(fingerprint.information_grammar));
  current.social_actions.push(...list(fingerprint.social_action_mechanics));
  current.use_when.push(...list(fingerprint.use_when));
  current.do_not_use_when.push(...list(fingerprint.do_not_use_when));
  current.transferable_atoms.push(...list(record.recombination?.transferable_atoms));
  current.anti_copy_boundaries.push(...list(record.recombination?.anti_copy_boundary));
  current.reverse_build_specs.push(value(record.recombination?.reverse_build_specification));
  families.set(family, current);
}

const normalizedFamilies = [...families.values()]
  .map((family) => ({
    ...family,
    reference_count: family.reference_ids.length,
    reference_ids: family.reference_ids.sort(),
    asset_paths: unique(family.asset_paths).sort(),
    cognitive_jobs: unique(family.cognitive_jobs),
    reader_states: unique(family.reader_states),
    visual_grammars: unique(family.visual_grammars),
    information_grammars: unique(family.information_grammars),
    social_actions: unique(family.social_actions),
    use_when: unique(family.use_when),
    do_not_use_when: unique(family.do_not_use_when),
    transferable_atoms: unique(family.transferable_atoms),
    anti_copy_boundaries: unique(family.anti_copy_boundaries),
    reverse_build_specs: unique(family.reverse_build_specs),
  }))
  .sort((left, right) => right.reference_count - left.reference_count || left.mechanism_family.localeCompare(right.mechanism_family));

const output = {
  schema_version: '1.0.0',
  generated_at: '2026-08-05',
  scope: {
    complete_forensic_records: records.length,
    source_set: 'Top-100 visual subset of Tiger’s intentionally curated saved-post library',
    usage_boundary: 'Creative retrieval only. This data identifies packaging mechanisms, not topics, factual support, audience truth or performance guarantees.',
    visual_status: 'Every included record has a locally inspected visual asset. Assets 6, 12 and 75 are absent from the local Top-100 folder and have no forensic record.',
  },
  retrieval_contract: {
    input: ['selected reader state', 'intended response', 'cognitive job', 'claim mode', 'format constraints'],
    output: ['two-to-four mechanism families', 'specific record IDs for reference bundling', 'editable levers', 'anti-copy boundaries'],
    prohibited_input: ['a preselected topic from the genome'],
  },
  mechanism_families: normalizedFamilies,
  records: records.map((record) => ({
    reference_id: record.reference_id,
    asset_path: record.asset?.path ?? null,
    mechanism_family: familyFor(record),
    primary_cognitive_job: value(record.recombination?.mechanism_fingerprint?.primary_cognitive_job),
    reader_states: list(record.recombination?.mechanism_fingerprint?.reader_state),
    visual_grammar: list(record.recombination?.mechanism_fingerprint?.visual_grammar),
    use_when: list(record.recombination?.mechanism_fingerprint?.use_when),
    do_not_use_when: list(record.recombination?.mechanism_fingerprint?.do_not_use_when),
    social_actions: list(record.recombination?.mechanism_fingerprint?.social_action_mechanics),
    transferable_atoms: list(record.recombination?.transferable_atoms),
    reverse_build_specification: value(record.recombination?.reverse_build_specification),
    anti_copy_boundary: list(record.recombination?.anti_copy_boundary),
  })),
};

writeFileSync(jsonPath, `${JSON.stringify(output, null, 2)}\n`);
const md = [
  '# Top-100 Creative Genome',
  '',
  `**Status:** ${records.length} locally inspected visual forensic records synthesised on 2026-08-05.`,
  '',
  'This is a creative retrieval index, not a topic engine. Start with a selected reader moment and intended response; use this index to choose how the value should be packaged. Factual claims still require separate support.',
  '',
  '## Retrieval contract',
  '',
  'Bring: reader state, desired response, cognitive job, claim mode and format constraints. Retrieve two to four distinct mechanism families, then borrow only their transferable atoms. Do not ask the genome to choose the subject matter or reproduce a creator’s expression.',
  '',
  '## Mechanism families',
  '',
  '| Family | Records | Reader state it serves | Best used when | Avoid when |',
  '|---|---:|---|---|---|',
  ...normalizedFamilies.map((family) => `| ${family.mechanism_family} | ${family.reference_count} | ${short(family.reader_states.slice(0, 3).join('; '))} | ${short(family.use_when[0] ?? '')} | ${short(family.do_not_use_when[0] ?? '')} |`),
  '',
  '## Family detail',
  '',
  ...normalizedFamilies.flatMap((family) => [
    `### ${family.mechanism_family} (${family.reference_count})`,
    '',
    `**Cognitive job:** ${family.cognitive_jobs.join(' / ')}`,
    '',
    `**Reader states:** ${family.reader_states.join('; ')}`,
    '',
    `**Visual grammar:** ${family.visual_grammars.join('; ')}`,
    '',
    `**Use when:** ${family.use_when.map((item) => `- ${item}`).join('\n')}`,
    '',
    `**Do not use when:** ${family.do_not_use_when.map((item) => `- ${item}`).join('\n')}`,
    '',
    `**Transferable atoms:** ${family.transferable_atoms.map((item) => `- ${item}`).join('\n')}`,
    '',
    `**Reference records:** ${family.reference_ids.join(', ')}`,
    '',
  ]),
  '## Non-negotiable boundary',
  '',
  'A mechanism family may tell us that a comparison, map, field guide, progression, metaphor or transformation would be a strong way to serve a reader. It must not tell us *what* the comparison, map or framework should be about. Opportunity selection, evidence and Tiger’s voice make that decision later.',
  '',
].join('\n');
writeFileSync(markdownPath, md);
console.log(`Built Top-100 Creative Genome: ${records.length} records across ${normalizedFamilies.length} mechanism families.`);
