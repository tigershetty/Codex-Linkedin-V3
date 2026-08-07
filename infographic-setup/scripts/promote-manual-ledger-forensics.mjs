#!/usr/bin/env node
/**
 * Promotes only asset-hash-bound, directly inspected Top-100 ledger records
 * into the v2 Top-100 forensic schema.
 *
 * Why this exists:
 * - The canonical 480-post ledger is where direct human visual review occurs.
 * - The Top-100 forensic directory powers high-confidence Creative Genome
 *   retrieval.
 * - A manually reviewed ledger record must not remain stranded as a
 *   provisional forensic candidate, but it also must not inherit the old
 *   template-assisted visual hypotheses.
 *
 * Safety contract:
 * - The script promotes a record only when the ledger and the candidate bind
 *   the exact same local asset path and SHA-256 hash.
 * - It requires ledger reviewer, date, evidence, all creative and visual
 *   anatomy fields, and GIF frame evidence where required.
 * - It writes a schema translation of the direct ledger observations; it does
 *   not invent new visual observations or validate source-post claims.
 * - It never changes an existing manual forensic record. It verifies its
 *   asset binding and leaves it intact.
 *
 * Usage:
 *   node scripts/promote-manual-ledger-forensics.mjs --check
 *   node scripts/promote-manual-ledger-forensics.mjs --write
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const root = process.cwd();
const forensicRoot = resolve(root, 'references/creative-review/top100-forensics');
const ledgerPath = resolve(root, 'references/creative-review/reference-review-ledger.jsonl');
const write = process.argv.includes('--write');
const check = process.argv.includes('--check');

if ((write && check) || (!write && !check)) {
  console.error('Usage: node scripts/promote-manual-ledger-forensics.mjs --check | --write');
  process.exit(2);
}

const SHA256 = /^[a-f0-9]{64}$/;
const CREATIVE_FIELDS = [
  'attention_mechanism',
  'lived_work_moment',
  'reader_payoff',
  'argument_sequence',
  'utility',
  'emotional_trigger',
  'transferable_atoms',
  'anti_copy_boundary',
];
const VISUAL_FIELDS = [
  'composition',
  'hierarchy',
  'eye_path',
  'imagery',
  'typography',
  'layout',
  'pacing',
  'technical_treatment',
  'visual_mechanism',
  'craft_notes',
];

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const list = (value) => Array.isArray(value) ? value : [];
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const normalizedPath = (value) => String(value ?? '').replace(/\\/g, '/');
const quoted = (value) => `“${String(value ?? '').replace(/\s+/g, ' ').trim()}”`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseJsonl(path) {
  return readFileSync(path, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`${relative(root, path)}:${index + 1}: invalid JSON (${error.message})`);
      }
    });
}

function fieldText(record, scope, fields, label) {
  for (const field of fields) {
    assert(nonEmpty(record?.[scope]?.[field]), `${label}: direct manual ledger review is missing ${scope}.${field}`);
  }
}

function candidatePathFor(ledgerRecord) {
  const candidatePath = ledgerRecord.review?.candidate_forensic_path;
  assert(nonEmpty(candidatePath), `${ledgerRecord.reference_id}: manual ledger review lacks candidate_forensic_path`);
  assert(candidatePath.startsWith('references/creative-review/top100-forensics/TOP100-'), `${ledgerRecord.reference_id}: candidate_forensic_path is outside the Top-100 forensic directory`);
  const fullPath = resolve(root, candidatePath);
  assert(fullPath.startsWith(`${forensicRoot}/`), `${ledgerRecord.reference_id}: candidate_forensic_path resolves outside the forensic directory`);
  assert(existsSync(fullPath) && statSync(fullPath).isFile(), `${ledgerRecord.reference_id}: candidate forensic record is missing`);
  return fullPath;
}

function assetBinding(ledgerRecord, candidate, label) {
  const ledgerPaths = list(ledgerRecord.media?.asset_paths).map(normalizedPath);
  const candidatePath = normalizedPath(candidate.asset?.path);
  assert(ledgerPaths.length === 1, `${label}: manual promotion requires exactly one directly reviewed asset path`);
  assert(ledgerPaths[0] === candidatePath, `${label}: ledger asset path and candidate asset path differ`);

  const ledgerHash = ledgerRecord.media?.asset_sha256?.[ledgerPaths[0]];
  const candidateHash = candidate.asset?.sha256;
  assert(SHA256.test(ledgerHash ?? ''), `${label}: ledger asset hash is missing or malformed`);
  assert(SHA256.test(candidateHash ?? ''), `${label}: candidate asset hash is missing or malformed`);
  assert(ledgerHash === candidateHash, `${label}: ledger and candidate asset hashes differ`);

  assert(!candidatePath.startsWith('/') && !candidatePath.startsWith('../'), `${label}: candidate asset path must be repository-relative`);
  const assetPath = resolve(root, candidatePath);
  assert(assetPath.startsWith(`${root}/`) && existsSync(assetPath) && statSync(assetPath).isFile(), `${label}: reviewed asset is unavailable locally`);
  assert(hash(assetPath) === candidateHash, `${label}: declared asset hash does not match local asset`);

  return { assetPath: candidatePath, assetHash: candidateHash };
}

function frameEvidence(ledgerRecord, candidate, assetPath, label) {
  const frames = ledgerRecord.review?.gif_frame_evidence;
  if (candidate.asset?.format !== 'gif') {
    assert(frames === null || frames === undefined || (Array.isArray(frames) && !frames.length), `${label}: static asset cannot carry GIF frame evidence`);
    return [];
  }
  assert(Array.isArray(frames) && frames.length > 0, `${label}: a manually reviewed GIF requires ledger GIF frame evidence`);
  return frames.map((frame, index) => {
    assert(normalizedPath(frame?.asset_path) === assetPath, `${label}: GIF evidence ${index + 1} points to a different asset`);
    assert(Number.isInteger(frame?.frame_index) && frame.frame_index >= 0, `${label}: GIF evidence ${index + 1} lacks a valid frame_index`);
    assert(Number.isFinite(frame?.timestamp_ms) && frame.timestamp_ms >= 0, `${label}: GIF evidence ${index + 1} lacks a valid timestamp_ms`);
    assert(nonEmpty(frame?.observation), `${label}: GIF evidence ${index + 1} lacks an observation`);
    return {
      frame_index: frame.frame_index,
      timestamp_ms: frame.timestamp_ms,
      observation: frame.observation.trim(),
    };
  });
}

function splitObservation(value, separator = /\s*(?:→|->|•)\s*/u) {
  const items = String(value ?? '')
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : [String(value ?? '').trim()].filter(Boolean);
}

function mechanismFamily(record) {
  const text = [
    record.visual?.composition,
    record.visual?.layout,
    record.visual?.visual_mechanism,
    record.creative?.argument_sequence,
  ].join(' ').toLowerCase();

  if (/before[\s/-]*(?:and|&)?\s*after|current[\s/-]+and[\s/-]+changed|transformation/.test(text)) return 'before_after';
  if (/maturity|\blevels?\b|ladder|progression|journey/.test(text)) return 'maturity';
  if (/workflow|step[-\s]?by[-\s]?step|sequence|timeline|roadmap|stage cards?|central spine|numbered stages?/.test(text)) return 'workflow';
  if (/hub|spoke|radial|satellite|central (?:anchor|node|object)|relationship connectors?|network map|system map/.test(text)) return 'system_map';
  if (/comparison|two-column|two column|versus|\bvs\.?\b|contrast/.test(text)) return 'comparison';
  if (/taxonomy|categor(?:y|ies)|branch(?:es)?/.test(text)) return 'taxonomy';
  if (/collection|library|mosaic|catalog(?:ue|)|compendium/.test(text)) return 'collection';
  if (/checklist|field guide|playbook|toolkit|reference visual|reference board/.test(text)) return 'field_guide';
  if (/chart|metric|data[-\s]?visual|graph|landscape/.test(text)) return 'data_landscape';
  if (/metaphor|illustrated scene|unexpected object|visual object/.test(text)) return 'metaphor';
  if (/table|matrix|grid/.test(text)) return 'structured_explainer';
  return 'visual_explainer';
}

function useWhen(family) {
  const humanLabel = family.replace(/_/g, ' ');
  return [
    `The already selected reader moment genuinely benefits from an original ${humanLabel} rather than a generic list.`,
    'The spatial relationship or sequence can make the intended response clearer at a glance.',
    'The visual can carry a truthful promise without needing unsupported outcome claims.',
  ];
}

function doNotUseWhen() {
  return [
    'The spatial relationship does not improve comprehension, recognition or practical use.',
    'A short text post or simpler visual would communicate the value more clearly.',
    'The central claim needs evidence that is unavailable and cannot be honestly labelled as illustrative or unresolved.',
  ];
}

function promotion(record, candidate, assetPath, assetHash, frames) {
  const label = record.reference_id;
  const family = mechanismFamily(record);
  const reviewer = record.review.reviewer.trim();
  const reviewedAt = record.review.reviewed_at.trim();
  const reviewEvidence = record.review.evidence.trim();
  const ledgerCreative = record.creative;
  const ledgerVisual = record.visual;
  const transferableAtoms = splitObservation(ledgerCreative.transferable_atoms);
  const antiCopyBoundary = [
    ...splitObservation(ledgerCreative.anti_copy_boundary),
    'The source creator’s identity, branding, exact copy, visual treatment, figures and proprietary claims are not transferable.',
  ];
  const sourceContext = {
    ...(candidate.source_context ?? {}),
    creator: record.source?.creator_name ?? candidate.source_context?.creator ?? null,
    post_url: record.source?.post_url ?? candidate.source_context?.post_url ?? null,
    ledger_reference_id: record.reference_id,
    ledger_source_boundary: 'Creator and post URL are source-routing metadata. The direct ledger review validates the local visual asset, not source-post performance or factual claims.',
  };

  return {
    schema_version: '2.0.0',
    reference_id: candidate.reference_id,
    forensic_record_status: 'manual_forensic_review',
    review_method: {
      mode: 'manual_asset_review',
      visual_basis: `Direct manual asset inspection recorded in the canonical reference-review ledger for ${record.reference_id}, bound to ${assetPath} at SHA-256 ${assetHash}.`,
      context_basis: `Caption and source-routing context retained from the Top-100 workbook and canonical ledger for ${record.reference_id}; it does not substitute for visual inspection or validate source claims.`,
      boundary: 'This record restructures direct ledger observations into the v2 forensic schema. It does not add a new asset-specific visual observation, validate source-post performance, or treat caption text as visual evidence.',
      reviewer,
      reviewed_at: reviewedAt,
      evidence: reviewEvidence,
    },
    asset: {
      path: assetPath,
      sha256: assetHash,
      status: 'manually_reviewed',
      format: candidate.asset.format,
      manual_review_evidence: {
        asset_sha256: assetHash,
        reviewer,
        reviewed_at: reviewedAt,
        evidence: `${reviewEvidence} Asset hash: ${assetHash}.`,
      },
      frame_evidence: frames,
      inspection_limitations: [
        'This forensic record is bounded by the direct visual observations recorded in the canonical ledger.',
        'Source numerical, causal, company and personal claims remain unverified unless separately sourced.',
        ...(candidate.asset.format === 'gif'
          ? ['Frame evidence records only the inspected frames; it does not infer unobserved animation states.']
          : []),
      ],
    },
    source_context: sourceContext,
    reader_situation: {
      primary_reader: `A reader seeking the practical value described in the inspected record: ${ledgerCreative.reader_payoff}`,
      work_moment: ledgerCreative.lived_work_moment,
      tension: ledgerCreative.emotional_trigger,
      desired_response: 'recognition_understanding_or_practical_use',
      topic_selection_boundary: 'This record does not choose a future topic, domain, factual claim, audience or post angle. It supplies only evidence-bound creative mechanics for an already selected opportunity.',
    },
    attention_physics: {
      thumbnail_read_0_3_seconds: ledgerCreative.attention_mechanism,
      comprehension_3_10_seconds: `The recorded eye path is ${quoted(ledgerVisual.eye_path)}.`,
      value_exchange_10_30_seconds: ledgerCreative.reader_payoff,
      identity_or_curiosity_trigger: ledgerCreative.emotional_trigger,
      promise_proved_by_visual: ledgerVisual.visual_mechanism,
    },
    visual_forensics: {
      asset_specific_observation: ledgerVisual.composition,
      composition_and_grid: ledgerVisual.layout,
      dominant_anchor: `The direct ledger hierarchy identifies the primary anchor as: ${ledgerVisual.hierarchy}`,
      eye_path: splitObservation(ledgerVisual.eye_path),
      information_chunks: splitObservation(ledgerCreative.argument_sequence),
      hierarchy: ledgerVisual.hierarchy,
      typography: ledgerVisual.typography,
      colour_material_and_contrast: ledgerVisual.technical_treatment,
      imagery_role: ledgerVisual.imagery,
      density_and_pacing: ledgerVisual.pacing,
      craft_observations: splitObservation(ledgerVisual.craft_notes),
    },
    content_mechanics: {
      primary_cognitive_job: `Make the inspected reader payoff actionable: ${ledgerCreative.reader_payoff}`,
      claim_mode: 'claim-proportionate; source-post claims remain unverified by this creative record',
      argument_sequence: splitObservation(ledgerCreative.argument_sequence),
      compression_method: `The reviewed visual mechanism is ${quoted(ledgerVisual.visual_mechanism)}. This field is a schema translation of the direct ledger observation, not an independently validated source claim.`,
      reader_payoff: ledgerCreative.reader_payoff,
      save_share_return_motives: splitObservation(ledgerCreative.utility),
      caption_to_visual_choreography: `The visual carries the inspected mechanism ${quoted(ledgerVisual.visual_mechanism)}; any future caption must add source-backed context, limitations and a Tiger-specific point of view without repeating every visual detail.`,
    },
    recombination: {
      mechanism_fingerprint: {
        mechanism_family: family,
        mechanism_family_evidence: {
          derived_from: ['creative.argument_sequence', 'visual.composition', 'visual.layout', 'visual.visual_mechanism'],
          observed_text: [ledgerCreative.argument_sequence, ledgerVisual.composition, ledgerVisual.layout, ledgerVisual.visual_mechanism],
          boundary: 'The family label is a retrieval tag derived from directly inspected ledger fields. It is not a new visual observation and does not select a future topic.',
        },
        primary_cognitive_job: `Make the inspected reader payoff actionable: ${ledgerCreative.reader_payoff}`,
        reader_state: splitObservation(ledgerCreative.lived_work_moment),
        visual_grammar: [ledgerVisual.composition, ledgerVisual.layout, ledgerVisual.visual_mechanism],
        information_grammar: [ledgerCreative.argument_sequence, ledgerCreative.reader_payoff, ledgerCreative.utility],
        social_action_mechanics: splitObservation(ledgerCreative.utility),
        use_when: useWhen(family),
        do_not_use_when: doNotUseWhen(),
        topic_selection_boundary: 'This mechanism does not choose a topic, domain, source, data set, factual claim or post angle. It only describes when an evidence-bound visual grammar may serve an already selected reader moment.',
      },
      transferable_atoms: transferableAtoms,
      reverse_build_specification: `Start only after selecting the reader moment and intended response. Build an original ${family.replace(/_/g, ' ')} whose spatial logic earns the promise, using these directly inspected transferable atoms as constraints rather than content: ${transferableAtoms.join(' ')} Keep relationships semantically meaningful, retain separate support for public claims, and make the visual useful without importing the source’s expression.`,
      editable_levers: ['topic: intentionally unselected', 'reader moment', 'semantic spatial model', 'claim support depth', 'information density', 'caption role', 'format and motion state'],
      required_original_inputs: ['Selected reader moment and intended response', 'Original claim-support material or an explicit illustrative boundary', 'An original semantic object, relationship model or sequence', 'Tiger-specific language and point of view', 'A post-level anti-copy check against the source record'],
      anti_copy_boundary: antiCopyBoundary,
      falsification_question: 'Can a reader identify the working relationship, choice or change from the original visual alone, and can every borrowed mechanic be traced to directly inspected source fields rather than a provisional candidate?',
    },
    provenance: {
      ...(candidate.provenance ?? {}),
      promotion: {
        script: 'scripts/promote-manual-ledger-forensics.mjs',
        source_ledger_reference_id: record.reference_id,
        source_ledger_review_status: record.review.status,
        asset_path: assetPath,
        asset_sha256: assetHash,
        promotion_boundary: 'Only direct ledger observations and asset-bound review provenance were translated into manual forensic fields. Template-assisted hypotheses were excluded.',
      },
    },
  };
}

assert(existsSync(ledgerPath), `Missing canonical reference-review ledger: ${ledgerPath}`);
assert(existsSync(forensicRoot), `Missing Top-100 forensic directory: ${forensicRoot}`);

const ledger = parseJsonl(ledgerPath);
const manualLedgerRecords = ledger.filter((record) => record.review?.status === 'manual_reviewed');
const stats = {
  manual_ledger_records: manualLedgerRecords.length,
  promoted: 0,
  already_manual_verified: 0,
  skipped_unlinked: 0,
};
const writes = [];

for (const ledgerRecord of manualLedgerRecords) {
  const label = ledgerRecord.reference_id ?? '(unknown ledger record)';
  assert(ledgerRecord.review?.review_kind === 'manual_asset_review', `${label}: manual ledger status requires review_kind=manual_asset_review`);
  assert(nonEmpty(ledgerRecord.review?.reviewer), `${label}: manual ledger review is missing reviewer`);
  assert(nonEmpty(ledgerRecord.review?.reviewed_at) && !Number.isNaN(Date.parse(ledgerRecord.review.reviewed_at)), `${label}: manual ledger review is missing a valid reviewed_at`);
  assert(nonEmpty(ledgerRecord.review?.evidence), `${label}: manual ledger review is missing evidence`);
  fieldText(ledgerRecord, 'creative', CREATIVE_FIELDS, label);
  fieldText(ledgerRecord, 'visual', VISUAL_FIELDS, label);

  if (!nonEmpty(ledgerRecord.review?.candidate_forensic_path)) {
    stats.skipped_unlinked += 1;
    continue;
  }
  const candidatePath = candidatePathFor(ledgerRecord);
  const candidate = JSON.parse(readFileSync(candidatePath, 'utf8'));
  const binding = assetBinding(ledgerRecord, candidate, label);
  const frames = frameEvidence(ledgerRecord, candidate, binding.assetPath, label);

  if (candidate.forensic_record_status === 'manual_forensic_review') {
    assert(candidate.asset?.status === 'manually_reviewed', `${label}: existing manual forensic record has the wrong asset status`);
    stats.already_manual_verified += 1;
    continue;
  }
  assert(candidate.forensic_record_status === 'provisional_template_assisted_candidate', `${label}: candidate is neither provisional nor manual`);
  const promoted = promotion(ledgerRecord, candidate, binding.assetPath, binding.assetHash, frames);
  writes.push({ path: candidatePath, value: `${JSON.stringify(promoted, null, 2)}\n` });
  stats.promoted += 1;
}

if (write) {
  for (const item of writes) writeFileSync(item.path, item.value);
}

console.log(`${write ? 'Promoted' : 'Validated'} Top-100 ledger-to-forensic records: ${stats.promoted} ${write ? 'written' : 'ready to write'}, ${stats.already_manual_verified} existing manual record(s) verified, ${stats.skipped_unlinked} unlinked manual ledger record(s) skipped, from ${stats.manual_ledger_records} manual ledger record(s).`);
