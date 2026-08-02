#!/usr/bin/env node

import { resolve } from 'node:path';
import {
  SCHEMA_VERSION,
  SETUP_ROOT,
  atomicWrite,
  normalizeText,
  parseCliArgs,
  readJson,
  requireFile,
  resolveActiveGenome,
  sha256,
  stableStringify,
  tokenize,
  uniqueSorted,
} from './lib/creative-genome.mjs';

const ARRAY_FIELDS = [
  'audience_terms',
  'topic_terms',
  'content_modes',
  'hook_types',
  'visual_structures',
  'artifact_types',
  'ctas',
  'excluded_patterns',
  'source_preferences',
  'eligible_creative_signals',
];

const SOURCE_SIGNAL_MAP = Object.freeze({
  saved_positive: (record) => record.corpus_signals.saved_positive.value,
  stage0_current_market: (record) => record.corpus_signals.stage0_current_market,
  tiger_native_performance: (record) => record.corpus_signals.tiger_native_performance,
  top100_curated_reference: (record) => record.corpus_signals.top100_curated_reference,
});

function validateQuery(query, allowDraft = false) {
  const errors = [];
  if (query.schema_version !== SCHEMA_VERSION) errors.push(`schema_version must be ${SCHEMA_VERSION}`);
  if (!['draft', 'ready'].includes(query.status)) errors.push('status must be draft or ready');
  if (!normalizeText(query.query_id)) errors.push('query_id is required');
  for (const field of ARRAY_FIELDS) {
    if (!Array.isArray(query[field])) errors.push(`${field} must be an array`);
  }
  if (!query.eligible_creative_signals?.length) {
    errors.push('eligible_creative_signals must contain at least one curated source');
  }
  if (!Number.isInteger(query.limit) || query.limit < 10 || query.limit > 15) {
    errors.push('limit must be an integer between 10 and 15');
  }
  if (!Number.isInteger(query.tiger_precedent_limit) || query.tiger_precedent_limit < 0 || query.tiger_precedent_limit > 5) {
    errors.push('tiger_precedent_limit must be an integer between 0 and 5');
  }
  if (new Set(query.source_preferences ?? []).size !== (query.source_preferences ?? []).length) {
    errors.push('source_preferences must not contain duplicates');
  }
  if (new Set(query.eligible_creative_signals ?? []).size !== (query.eligible_creative_signals ?? []).length) {
    errors.push('eligible_creative_signals must not contain duplicates');
  }
  for (const preference of query.source_preferences ?? []) {
    if (!SOURCE_SIGNAL_MAP[preference]) errors.push(`unknown source preference: ${preference}`);
  }
  for (const signal of query.eligible_creative_signals ?? []) {
    if (!['saved_positive', 'top100_curated_reference'].includes(signal)) {
      errors.push(`unknown eligible creative signal: ${signal}`);
    }
  }
  const draftAllowed = allowDraft && query.status === 'draft';
  if (query.status === 'draft' && !allowDraft) {
    errors.push('draft queries require --allow-draft');
  }
  if (!draftAllowed) {
    for (const field of ['content_id', 'reader_decision', 'care_statement']) {
      if (!normalizeText(query[field])) errors.push(`${field} is required`);
    }
    for (const field of ['query_id', 'content_id']) {
      if (/(?:^|[-_])(draft|placeholder|todo|tbd)(?:$|[-_])/i.test(normalizeText(query[field]))) {
        errors.push(`${field} must use a production identifier, not a template placeholder`);
      }
    }
    const fitFields = [
      'audience_terms',
      'topic_terms',
      'content_modes',
      'hook_types',
      'visual_structures',
      'artifact_types',
      'ctas',
    ];
    if (!fitFields.some((field) => query[field]?.length)) {
      errors.push(`at least one fit dimension is required: ${fitFields.join(', ')}`);
    }
  }
  if (errors.length) throw new Error(`Invalid reference query:\n- ${errors.join('\n- ')}`);
}

function annotationValue(record, field) {
  return normalizeText(record.annotations?.[field]?.value);
}

function includesTerm(haystack, term) {
  const normalizedTerm = normalizeText(term).toLocaleLowerCase('en');
  if (!normalizedTerm) return false;
  return normalizeText(haystack).toLocaleLowerCase('en').includes(normalizedTerm);
}

function overlapScore(haystack, terms, weight, label) {
  const matches = uniqueSorted(terms.filter((term) => includesTerm(haystack, term)));
  return {
    dimensions: matches.length ? [`${label}:${matches.join('|')}`] : [],
    score: matches.length * weight,
  };
}

function scoreRecord(record, query) {
  let score = 0;
  const dimensions = [];

  for (const preference of query.source_preferences) {
    if (SOURCE_SIGNAL_MAP[preference](record)) {
      score += preference === 'saved_positive' ? 8 : 4;
      dimensions.push(`source:${preference}`);
    }
  }

  const audience = overlapScore(
    `${annotationValue(record, 'target_audience')} ${record.observed.caption ?? ''}`,
    query.audience_terms,
    5,
    'audience',
  );
  const topic = overlapScore(
    [
      annotationValue(record, 'topic'),
      annotationValue(record, 'problem_family'),
      annotationValue(record, 'job_to_be_done'),
      record.observed.caption,
      record.observed.hook,
    ].join(' '),
    query.topic_terms,
    5,
    'topic',
  );
  const hook = overlapScore(
    annotationValue(record, 'hook_type'),
    query.hook_types,
    4,
    'hook',
  );
  const visual = overlapScore(
    annotationValue(record, 'visual_structure'),
    query.visual_structures,
    3,
    'visual',
  );
  const artifact = overlapScore(
    annotationValue(record, 'artifact_type'),
    query.artifact_types,
    4,
    'artifact',
  );
  const cta = overlapScore(annotationValue(record, 'cta'), query.ctas, 2, 'cta');
  const mode = overlapScore(
    `${annotationValue(record, 'artifact_type')} ${annotationValue(record, 'proof_type')} ${annotationValue(record, 'format')}`,
    query.content_modes,
    3,
    'content_mode',
  );

  for (const result of [audience, topic, hook, visual, artifact, cta, mode]) {
    score += result.score;
    dimensions.push(...result.dimensions);
  }

  const queryTokens = new Set(tokenize(
    query.reader_decision,
    query.care_statement,
    query.audience_terms,
    query.topic_terms,
    query.content_modes,
  ));
  const recordTokens = new Set(
    tokenize(
      record.observed.hook,
      record.observed.caption,
      annotationValue(record, 'promise'),
      annotationValue(record, 'topic'),
    ),
  );
  const tokenMatches = [...queryTokens].filter((token) => recordTokens.has(token)).sort();
  if (tokenMatches.length) {
    score += Math.min(tokenMatches.length, 10);
    dimensions.push(`token_overlap:${tokenMatches.slice(0, 10).join('|')}`);
  }

  const excluded = uniqueSorted(
    query.excluded_patterns.filter((term) => includesTerm(
      `${record.observed.hook ?? ''} ${record.observed.caption ?? ''} ${annotationValue(record, 'visual_structure')}`,
      term,
    )),
  );
  if (excluded.length) {
    score -= excluded.length * 12;
    dimensions.push(`excluded_pattern:${excluded.join('|')}`);
  }

  return { dimensions: uniqueSorted(dimensions), score };
}

function resultView(record, retrieval) {
  const visual = record.annotations.visual_structure;
  return {
    annotations: {
      artifact_type: record.annotations.artifact_type,
      cta: record.annotations.cta,
      format: record.annotations.format,
      hook_type: record.annotations.hook_type,
      job_to_be_done: record.annotations.job_to_be_done,
      problem_family: record.annotations.problem_family,
      promise: record.annotations.promise,
      proof_type: record.annotations.proof_type,
      target_audience: record.annotations.target_audience,
      topic: record.annotations.topic,
      visual_structure: visual,
    },
    canonical_url: record.publication.canonical_url,
    creative_assets: record.creative_assets,
    creator: record.creator.name,
    observed_hook: record.observed.hook,
    observed_caption_excerpt: normalizeText(record.observed.caption).slice(0, 600) || null,
    positive_signals: {
      saved_positive: record.corpus_signals.saved_positive.value,
      tiger_native_performance: record.corpus_signals.tiger_native_performance,
      top100_curated_reference: record.corpus_signals.top100_curated_reference,
    },
    reference_id: record.reference_id,
    retrieval_matches: retrieval.dimensions,
    retrieval_score: retrieval.score,
    diversity_signature: [
      annotationValue(record, 'hook_type'),
      annotationValue(record, 'visual_structure'),
      annotationValue(record, 'artifact_type'),
    ].join(' | '),
    visual_use_guardrail:
      visual.status === 'manual_verified'
        ? 'Detailed visual structure was manually verified from lightbox review.'
        : 'Treat visual structure as a retrieval hint until the source visual is inspected.',
  };
}

function selectDiverse(ranked, limit) {
  const selected = [];
  const selectedIds = new Set();
  const creatorCounts = new Map();
  const signatureCounts = new Map();

  for (const candidate of ranked) {
    const creator = normalizeText(candidate.record.creator.name) || 'unknown';
    const signature = [
      annotationValue(candidate.record, 'hook_type'),
      annotationValue(candidate.record, 'visual_structure'),
      annotationValue(candidate.record, 'artifact_type'),
    ].join('|');
    if ((creatorCounts.get(creator) ?? 0) >= 2) continue;
    if ((signatureCounts.get(signature) ?? 0) >= 3) continue;
    selected.push(candidate);
    selectedIds.add(candidate.record.reference_id);
    creatorCounts.set(creator, (creatorCounts.get(creator) ?? 0) + 1);
    signatureCounts.set(signature, (signatureCounts.get(signature) ?? 0) + 1);
    if (selected.length === limit) return selected;
  }

  for (const candidate of ranked) {
    if (selectedIds.has(candidate.record.reference_id)) continue;
    selected.push(candidate);
    if (selected.length === limit) break;
  }
  return selected;
}

function main() {
  const options = parseCliArgs(process.argv.slice(2));
  if (!options.query) {
    throw new Error('Usage: retrieve-creative-references.mjs --query <reference-query.json> [--output <results.json>]');
  }

  const queryPath = requireFile(resolve(process.cwd(), options.query), 'Reference query');
  const query = readJson(queryPath);
  validateQuery(query, Boolean(options['allow-draft']));
  const { manifest, records } = resolveActiveGenome();

  const eligible = records.filter((record) =>
    query.eligible_creative_signals.some((signal) => SOURCE_SIGNAL_MAP[signal](record)),
  );
  const rankedPool = eligible
    .map((record) => ({ record, retrieval: scoreRecord(record, query) }))
    .sort(
      (left, right) =>
        right.retrieval.score - left.retrieval.score ||
        left.record.reference_id.localeCompare(right.record.reference_id),
    );
  const ranked = selectDiverse(rankedPool, query.limit)
    .map(({ record, retrieval }) => resultView(record, retrieval));

  const tigerQuery = {
    ...query,
    source_preferences: [...new Set([...query.source_preferences, 'tiger_native_performance'])],
  };
  const tigerPrecedents = records
    .filter((record) => record.corpus_signals.tiger_native_performance)
    .map((record) => ({ record, retrieval: scoreRecord(record, tigerQuery) }))
    .sort(
      (left, right) =>
        right.retrieval.score - left.retrieval.score ||
        left.record.reference_id.localeCompare(right.record.reference_id),
    )
    .slice(0, query.tiger_precedent_limit)
    .map(({ record, retrieval }) => resultView(record, retrieval));

  const output = {
    $schema: 'references/creative-genome/schemas/reference-candidates.schema.json',
    content_id: query.content_id,
    query_id: query.query_id,
    query_contract: {
      care_statement: query.care_statement,
      content_modes: query.content_modes,
      reader_decision: query.reader_decision,
    },
    query_sha256: sha256(stableStringify(query, 0)),
    result_count: ranked.length,
    results: ranked,
    tiger_precedents: tigerPrecedents,
    schema_version: SCHEMA_VERSION,
    snapshot_id: manifest.snapshot.id,
    snapshot_sha256: manifest.snapshot.sha256,
  };
  const content = `${stableStringify(output, 2)}\n`;

  if (options.output) {
    atomicWrite(resolve(process.cwd(), options.output), content);
  } else {
    process.stdout.write(content);
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
