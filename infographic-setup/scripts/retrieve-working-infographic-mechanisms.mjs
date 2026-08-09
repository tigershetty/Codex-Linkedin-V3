#!/usr/bin/env node
/**
 * Retrieve a short, diverse three-role shelf for a Working Infographic.
 *
 * It selects reusable creative mechanisms by reader condition and relation;
 * it deliberately never accepts a topic argument or makes a topic decision.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const get = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] ?? '' : '';
};
const query = {
  reader_state: get('--reader-state'),
  response: get('--response'),
  cognitive_job: get('--cognitive-job'),
  relation: get('--relation'),
};
const requestedLimit = Number(get('--limit') || 3);
const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(6, requestedLimit)) : 3;
const output = get('--output');

const GENERIC_STOP_TERMS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'by', 'content', 'for', 'from', 'how', 'i', 'in', 'is',
  'it', 'of', 'on', 'or', 'post', 'reader', 'state', 'the', 'this', 'to', 'visual', 'we', 'with',
]);

const CONTROLLED_QUERY_VOCABULARY = {
  reader_state: [
    {
      controlled_tag: 'date_conflict',
      phrases: ['conflicting dates', 'date conflict', 'supplier confirmation', 'customer promise', 'promise risk', 'supplier date'],
      retrieval_tags: ['conditional_decision', 'comparison', 'diagnose', 'prepare'],
    },
    {
      controlled_tag: 'batch_dispatch_trade_off',
      phrases: ['batch size', 'batch dispatch', 'consolidation', 'freight', 'moq', 'shipment'],
      retrieval_tags: ['trade_off', 'comparison', 'choose'],
    },
    {
      controlled_tag: 'exception_triage',
      phrases: ['planning exception', 'alert fatigue', 'exception policy', 'triage', 'exception'],
      retrieval_tags: ['sequence', 'hierarchy', 'diagnose', 'prepare'],
    },
  ],
  response: [
    { controlled_tag: 'recognition', phrases: ['recognition', 'recognise', 'recognize', 'relatable'], retrieval_tags: ['recognise'] },
    { controlled_tag: 'understanding', phrases: ['understanding', 'understand', 'clarity', 'explain'], retrieval_tags: ['explain', 'orient'] },
    { controlled_tag: 'practical_use', phrases: ['practical use', 'practical', 'actionable', 'apply'], retrieval_tags: ['practical_use', 'prepare', 'choose'] },
    { controlled_tag: 'memorable_intrigue', phrases: ['memorable intrigue', 'intrigue', 'surprise'], retrieval_tags: ['memorable_intrigue'] },
  ],
  cognitive_job: [
    { controlled_tag: 'recognise', phrases: ['recognise', 'recognize', 'recognition'], retrieval_tags: ['recognise'] },
    { controlled_tag: 'orient', phrases: ['orient', 'orientation'], retrieval_tags: ['orient'] },
    { controlled_tag: 'choose', phrases: ['choose', 'choice', 'select'], retrieval_tags: ['choose'] },
    { controlled_tag: 'explain', phrases: ['explain', 'explanation'], retrieval_tags: ['explain'] },
    { controlled_tag: 'diagnose', phrases: ['diagnose', 'diagnosis', 'diagnostic'], retrieval_tags: ['diagnose'] },
    { controlled_tag: 'prepare', phrases: ['prepare', 'preparation'], retrieval_tags: ['prepare'] },
    { controlled_tag: 'compare', phrases: ['compare', 'comparison'], retrieval_tags: ['compare'] },
  ],
  relation: [
    { controlled_tag: 'conditional_decision', phrases: ['conditional decision', 'decision condition'], retrieval_tags: ['conditional_decision'] },
    { controlled_tag: 'sequence', phrases: ['sequence', 'process', 'workflow'], retrieval_tags: ['sequence'] },
    { controlled_tag: 'hierarchy', phrases: ['hierarchy', 'priority'], retrieval_tags: ['hierarchy'] },
    { controlled_tag: 'trade_off', phrases: ['trade off', 'tradeoff'], retrieval_tags: ['trade_off'] },
    { controlled_tag: 'comparison', phrases: ['comparison', 'compare'], retrieval_tags: ['comparison'] },
    { controlled_tag: 'network', phrases: ['network', 'system map'], retrieval_tags: ['network'] },
    { controlled_tag: 'lookup', phrases: ['lookup', 'reference'], retrieval_tags: ['lookup'] },
  ],
};

const RECORD_TAG_RULES = [
  { tag: 'conditional_decision', phrases: ['decision', 'choose', 'select', 'criteria', 'condition'] },
  { tag: 'sequence', phrases: ['sequence', 'step', 'process', 'workflow', 'progression', 'journey', 'phase', 'route'] },
  { tag: 'hierarchy', phrases: ['hierarchy', 'priority', 'tier', 'level', 'rank'] },
  { tag: 'trade_off', phrases: ['trade off', 'tradeoff', 'economics', 'balance', 'versus'] },
  { tag: 'comparison', phrases: ['compare', 'comparison', 'matrix', 'difference', 'versus', 'criteria'] },
  { tag: 'network', phrases: ['network', 'system', 'interdependent', 'hub', 'spoke', 'connection', 'branch'] },
  { tag: 'lookup', phrases: ['reference', 'catalogue', 'atlas', 'index', 'browse', 'library'] },
  { tag: 'recognise', phrases: ['recognise', 'recognition', 'relatable', 'lived'] },
  { tag: 'orient', phrases: ['orient', 'orientation', 'scan', 'browse', 'locate', 'map'] },
  { tag: 'choose', phrases: ['choose', 'choice', 'select', 'selection', 'decision'] },
  { tag: 'explain', phrases: ['explain', 'explanation', 'understand', 'clarify'] },
  { tag: 'diagnose', phrases: ['diagnose', 'diagnostic', 'inspect', 'check', 'risk'] },
  { tag: 'prepare', phrases: ['prepare', 'plan', 'action', 'checklist', 'next action'] },
  { tag: 'compare', phrases: ['compare', 'comparison', 'matrix', 'trade off', 'versus'] },
  { tag: 'practical_use', phrases: ['action', 'checklist', 'reference', 'tool', 'apply', 'working', 'operating', 'utility', 'revisit'] },
  { tag: 'memorable_intrigue', phrases: ['intrigue', 'surprise', 'unexpected', 'curiosity', 'novel'] },
];

function usage() {
  return `Usage:\n  node scripts/retrieve-working-infographic-mechanisms.mjs --reader-state \"conflicting dates\" [--response \"practical use\"] [--cognitive-job \"diagnose\"] [--relation \"conditional decision\"] [--limit 3] [--output result.json]\n\nThe input describes a reader condition and relation, not a preselected topic. Run build-working-infographic-creative-index.mjs first.\n`;
}

function tokens(value) {
  return String(value ?? '').toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function normalizedTerms(value) {
  return tokens(value).filter((term) => !GENERIC_STOP_TERMS.has(term));
}

function phraseTerms(value) {
  return normalizedTerms(value).join(' ');
}

function includesPhrase(haystack, phrase) {
  const normalizedHaystack = ` ${phraseTerms(haystack)} `;
  const normalizedPhrase = ` ${phraseTerms(phrase)} `;
  return normalizedPhrase.trim().length > 0 && normalizedHaystack.includes(normalizedPhrase);
}

function analyseQueryField(field, rawValue) {
  const raw = String(rawValue ?? '');
  const rawTerms = tokens(raw);
  const ignored_generic_terms = rawTerms.filter((term) => GENERIC_STOP_TERMS.has(term));
  const meaningfulTerms = rawTerms.filter((term) => !GENERIC_STOP_TERMS.has(term));
  const matches = [];
  const matchedTokens = new Set();
  for (const entry of CONTROLLED_QUERY_VOCABULARY[field] ?? []) {
    const matchedPhrase = entry.phrases.find((phrase) => includesPhrase(raw, phrase));
    if (!matchedPhrase) continue;
    tokens(matchedPhrase).forEach((term) => matchedTokens.add(term));
    matches.push({
      field,
      input_term: raw.trim(),
      matched_phrase: matchedPhrase,
      controlled_tag: entry.controlled_tag,
      retrieval_tags: entry.retrieval_tags,
    });
  }
  return {
    field,
    input: raw.trim(),
    matches,
    ignored_generic_terms,
    unmatched_terms: meaningfulTerms.filter((term) => !matchedTokens.has(term)),
  };
}

function analyseQuery(queryValue) {
  const fields = Object.entries(queryValue).map(([field, value]) => analyseQueryField(field, value));
  const matched_terms = fields.flatMap((field) => field.matches);
  const retrievalTermMatches = new Map();
  matched_terms.forEach((match) => {
    match.retrieval_tags.forEach((tag) => {
      if (!retrievalTermMatches.has(tag)) retrievalTermMatches.set(tag, []);
      retrievalTermMatches.get(tag).push({
        field: match.field,
        input_term: match.input_term,
        matched_phrase: match.matched_phrase,
        controlled_tag: match.controlled_tag,
      });
    });
  });
  return {
    fields,
    matched_terms,
    ignored_generic_terms: [...new Set(fields.flatMap((field) => field.ignored_generic_terms))],
    unmatched_terms: [...new Set(fields.flatMap((field) => field.unmatched_terms))],
    retrievalTermMatches,
  };
}

function recordText(record, role) {
  if (role === 'information') {
    return [record.argument_shape, record.reader_job, record.mechanism, record.use_condition, record.motion_job].join(' ');
  }
  if (role === 'attention') {
    return [
      ...(record.reader_states ?? []), record.primary_cognitive_job, record.attention_mechanism,
      record.visible_proof, record.utility, ...(record.social_actions ?? []), record.visual_anchor,
    ].join(' ');
  }
  return [record.opening_move, record.visual_caption_division].join(' ');
}

function recordControlledTags(record, role) {
  const haystack = recordText(record, role);
  return RECORD_TAG_RULES
    .filter((rule) => rule.phrases.some((phrase) => includesPhrase(haystack, phrase)))
    .map((rule) => rule.tag);
}

function matchRecord(record, role, retrievalTermMatches) {
  const tags = recordControlledTags(record, role);
  const matchedTags = tags.filter((tag) => retrievalTermMatches.has(tag));
  if (!matchedTags.length) return null;
  return {
    ...record,
    matched_controlled_tags: matchedTags,
    matched_terms: matchedTags.flatMap((tag) => retrievalTermMatches.get(tag).map((term) => ({
      ...term,
      retrieval_tag: tag,
    }))),
    _base_score: matchedTags.length * 10,
    _novelty_text: role === 'information'
      ? `${record.argument_shape} ${record.mechanism}`
      : role === 'attention'
        ? `${record.mechanism_family} ${record.attention_mechanism} ${record.visible_proof}`
        : `${record.opening_move} ${record.visual_caption_division}`,
  };
}

function similarity(left, right) {
  const a = new Set(tokens(left));
  const b = new Set(tokens(right));
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / new Set([...a, ...b]).size;
}

function parse() {
  if (args.includes('--help') || args.includes('-h')) return { help: true };
  if (!Object.values(query).some(Boolean)) throw new Error('Provide at least one reader condition: --reader-state, --response, --cognitive-job, or --relation.');
  return { help: false };
}

function noveltySelect(records, count, family) {
  const candidates = records.map((record) => ({ ...record, selected: false }));
  const selected = [];
  while (selected.length < count && candidates.some((candidate) => !candidate.selected)) {
    let best = null;
    for (const candidate of candidates) {
      if (candidate.selected) continue;
      const sameFamily = selected.filter((item) => family(item) === family(candidate)).length;
      const maxSimilarity = selected.length
        ? Math.max(...selected.map((item) => similarity(candidate._novelty_text, item._novelty_text)))
        : 0;
      const adjusted = candidate._base_score - (sameFamily * 2.5) - (maxSimilarity * 2);
      if (!best || adjusted > best._adjusted_score || (adjusted === best._adjusted_score && candidate.record_id.localeCompare(best.record_id) < 0)) {
        best = { ...candidate, _adjusted_score: adjusted };
      }
    }
    if (!best) break;
    candidates.find((candidate) => candidate.record_id === best.record_id).selected = true;
    selected.push(best);
  }
  return selected.map(({ selected, _novelty_text, _base_score, _adjusted_score, ...record }) => ({
    ...record,
    retrieval_score: _base_score,
    diversity_adjusted_score: _adjusted_score,
  }));
}

function selectMatchedShelf(records, role, count, retrievalTermMatches, family) {
  const candidates = records
    .map((record) => matchRecord(record, role, retrievalTermMatches))
    .filter(Boolean);
  return noveltySelect(candidates, count, family);
}

function emptyCompositionRoles() {
  return {
    information_mechanisms: [],
    attention_or_utility: [],
    caption_mechanisms: [],
  };
}

function main() {
  const options = parse();
  if (options.help) {
    console.log(usage());
    return;
  }
  const indexPath = resolve(process.cwd(), 'references/creative-genome/working-infographic-creative-index-v1.json');
  if (!existsSync(indexPath)) throw new Error('Working Infographic Creative Index is missing. Run node scripts/build-working-infographic-creative-index.mjs first.');
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const analysis = analyseQuery(query);
  const hasControlledMatch = analysis.retrievalTermMatches.size > 0;
  const hasScopeBearingReaderState = analysis.fields
    .find((field) => field.field === 'reader_state')?.matches.length > 0;
  const composition_roles = hasControlledMatch && hasScopeBearingReaderState
    ? {
      information_mechanisms: selectMatchedShelf(
        index.source_roles.information_mechanisms,
        'information',
        limit,
        analysis.retrievalTermMatches,
        (record) => record.argument_shape,
      ),
      attention_or_utility: selectMatchedShelf(
        index.source_roles.attention_or_utility,
        'attention',
        limit,
        analysis.retrievalTermMatches,
        (record) => record.mechanism_family,
      ),
      caption_mechanisms: selectMatchedShelf(
        index.source_roles.caption_mechanisms,
        'caption',
        limit,
        analysis.retrievalTermMatches,
        (record) => record.record_id,
      ),
    }
    : emptyCompositionRoles();
  const matchedRecordCount = Object.values(composition_roles).reduce((total, records) => total + records.length, 0);
  const retrieval_status = !hasControlledMatch
    ? 'no_match'
    : !hasScopeBearingReaderState || matchedRecordCount === 0
      ? 'broad_inspiration_fallback'
      : 'matched';

  const result = {
    query,
    retrieval_status,
    query_interpretation: {
      matched_terms: analysis.matched_terms,
      matched_retrieval_tags: [...analysis.retrievalTermMatches.keys()],
      ignored_generic_terms: analysis.ignored_generic_terms,
      unmatched_terms: analysis.unmatched_terms,
    },
    boundary: 'This is a creative shelf, not a topic selector, claim source, performance predictor, or visual recipe. Use only records with their stated anti-copy and caption-association boundaries.',
    composition_roles,
    fallback: retrieval_status === 'broad_inspiration_fallback'
      ? {
        reason: hasScopeBearingReaderState
          ? 'The query maps to a recognised controlled intent, but no source record carries that requested mechanism. No arbitrary reference shelf was returned.'
          : 'The query lacks a controlled, scope-bearing reader state. Other recognised terms cannot be used to infer a topic or return an arbitrary reference shelf.',
        next_step: 'Choose a controlled reader state before adding a response, cognitive job, or information relation.',
      }
      : null,
    next_step: retrieval_status === 'matched'
      ? 'Assign one item from each non-empty role to a Creative Composition Packet. Develop three semantic objects whose truth claims differ before selecting a visual route.'
      : retrieval_status === 'broad_inspiration_fallback'
        ? 'Refine the query; the fallback deliberately does not masquerade as a source match.'
        : 'No controlled terms matched. Reframe with a supported reader state, response, cognitive job, or relation; generic words are intentionally ignored.',
  };
  const serialised = `${JSON.stringify(result, null, 2)}\n`;
  if (output) {
    writeFileSync(resolve(process.cwd(), output), serialised);
    console.log(`Wrote Working Infographic mechanism shelf: ${output}`);
  } else {
    console.log(serialised);
  }
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
