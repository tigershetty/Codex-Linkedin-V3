#!/usr/bin/env node
/**
 * Builds the searchable, topic-neutral Creative Genome from manually evidenced
 * Top-100 forensic records. Template-assisted candidates are preserved as a
 * review queue, never silently promoted into high-confidence retrieval.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const forensicRoot = resolve(root, 'references/creative-review/top100-forensics');
const outputRoot = resolve(root, 'references/creative-genome');
const jsonPath = resolve(outputRoot, 'top100-creative-genome-v1.json');
const markdownPath = resolve(outputRoot, 'top100-creative-genome-v1.md');

const allRecords = readdirSync(forensicRoot)
  .filter((name) => /^TOP100-\d{3}\.json$/.test(name))
  .sort()
  .map((name) => JSON.parse(readFileSync(resolve(forensicRoot, name), 'utf8')));
const records = allRecords.filter((record) => record.forensic_record_status === 'manual_forensic_review');
const candidates = allRecords.filter((record) => record.forensic_record_status === 'provisional_template_assisted_candidate');

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
  const declared = value(record.recombination?.mechanism_fingerprint?.mechanism_family);
  if (declared) return declared;
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
  schema_version: '2.0.0',
  generated_at: '2026-08-07',
  scope: {
    available_asset_records: allRecords.length,
    manual_forensic_records: records.length,
    provisional_template_candidates: candidates.length,
    source_set: 'Top-100 visual subset of Tiger’s intentionally curated saved-post library',
    usage_boundary: 'High-confidence retrieval includes only asset-hashed manual forensic records. Template-assisted candidates are a review queue, not evidence of visual mechanics, factual support, audience truth, or performance guarantees.',
    visual_status: 'Assets 6, 12 and 75 are absent from the local Top-100 folder. The high-confidence set grows only when a candidate is promoted through manual asset inspection.',
  },
  retrieval_contract: {
    input: ['selected reader state', 'intended response', 'cognitive job', 'claim mode', 'format constraints'],
    output: ['two-to-four manual/evidenced mechanism families', 'specific record IDs for reference bundling', 'editable levers', 'anti-copy boundaries'],
    prohibited_input: ['a preselected topic from the genome'],
    provenance_rule: 'Never retrieve from provisional_template_candidates. Review and promote the underlying asset first.',
  },
  mechanism_families: normalizedFamilies,
  records: records.map((record) => ({
    reference_id: record.reference_id,
    asset_path: record.asset?.path ?? null,
    asset_sha256: record.asset?.sha256 ?? null,
    forensic_record_status: record.forensic_record_status,
    reviewer: value(record.review_method?.reviewer),
    reviewed_at: value(record.review_method?.reviewed_at),
    mechanism_family: familyFor(record),
    mechanism_family_evidence: record.recombination?.mechanism_fingerprint?.mechanism_family_evidence ?? null,
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
  provisional_template_candidates: candidates.map((record) => ({
    reference_id: record.reference_id,
    asset_path: record.asset?.path ?? null,
    asset_sha256: record.asset?.sha256 ?? null,
    status: record.forensic_record_status,
    required_next_step: record.template_assisted_hypotheses?.required_next_step ?? 'Manually inspect the asset before retrieval.',
  })),
};

writeFileSync(jsonPath, `${JSON.stringify(output, null, 2)}\n`);
const md = [
  '# Top-100 Creative Genome',
  '',
  `**Status:** ${records.length} asset-hashed manual forensic record(s); ${candidates.length} template-assisted candidate(s) awaiting manual review.`,
  '',
  'This is a high-confidence creative retrieval index, not a topic engine. Start with a selected reader moment and intended response; use only the manual/evidenced records below to choose how the value should be packaged. Factual claims still require separate support.',
  '',
  'The provisional candidate list is deliberately excluded from mechanism retrieval. It exists only to route the next manual reviews without pretending a profile mapping inspected the asset.',
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
console.log(`Built Top-100 Creative Genome: ${records.length} manual/evidenced records across ${normalizedFamilies.length} mechanism families; ${candidates.length} candidates retained outside retrieval.`);
