import { existsSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import {
  SETUP_ROOT,
  atomicWrite,
  readJsonl,
  resolveActiveGenome,
  stableJsonl,
} from './creative-genome.mjs';

export const REVIEW_ROOT = resolve(SETUP_ROOT, 'references/creative-review');
export const REVIEW_LEDGER_PATH = resolve(REVIEW_ROOT, 'reference-review-ledger.jsonl');
export const REVIEW_QUEUE_PATH = resolve(REVIEW_ROOT, 'asset-recovery-queue.jsonl');
export const REVIEW_STATUS_PATH = resolve(REVIEW_ROOT, 'reference-review-status.md');
export const REVIEW_SCHEMA_VERSION = '1.0.0';

export const MEDIA_STATUSES = new Set([
  'available_local',
  'captured_local',
  'needs_authorized_retrieval',
  'explicitly_inaccessible',
]);

export const REVIEW_STATUSES = new Set([
  'pending_media',
  'ready_for_manual_review',
  'manual_reviewed',
  'inaccessible',
]);

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

export function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function relativePath(path) {
  return relative(SETUP_ROOT, path).split('\\').join('/');
}

function sourceAssetPaths(record) {
  return (record.creative_assets?.top100_references ?? [])
    .map((asset) => asset.local_asset_path)
    .filter((assetPath) => typeof assetPath === 'string' && assetPath.trim())
    .filter((assetPath) => {
      const fullPath = resolve(SETUP_ROOT, assetPath);
      return existsSync(fullPath) && statSync(fullPath).isFile() && statSync(fullPath).size > 0;
    })
    .map((assetPath) => relativePath(resolve(SETUP_ROOT, assetPath)));
}

function blankFields(fields) {
  return Object.fromEntries(fields.map((field) => [field, null]));
}

export function baseReviewRecord(record) {
  const localAssetPaths = sourceAssetPaths(record);
  const hasLocalAsset = localAssetPaths.length > 0;
  return {
    schema_version: REVIEW_SCHEMA_VERSION,
    reference_id: record.reference_id,
    source: {
      creator_name: record.creator?.name ?? null,
      creator_profile_url: record.creator?.profile_url ?? null,
      post_url: record.publication?.canonical_url ?? null,
      saved_positive_signal: record.corpus_signals?.saved_positive?.value === true,
    },
    media: {
      status: hasLocalAsset ? 'available_local' : 'needs_authorized_retrieval',
      asset_paths: localAssetPaths,
      availability_note: hasLocalAsset
        ? 'Repository asset available for manual visual review.'
        : 'No local media asset is available. Retrieve only through an authorized, read-only source or mark explicitly inaccessible.',
      checked_at: null,
    },
    review: {
      status: hasLocalAsset ? 'ready_for_manual_review' : 'pending_media',
      reviewed_at: null,
      reviewer: null,
      evidence: null,
      inaccessible_reason: null,
    },
    creative: blankFields(CREATIVE_FIELDS),
    visual: blankFields(VISUAL_FIELDS),
  };
}

function preserveReviewData(base, existing) {
  if (!existing || typeof existing !== 'object') return base;
  return {
    ...base,
    media: { ...base.media, ...(existing.media ?? {}) },
    review: { ...base.review, ...(existing.review ?? {}) },
    creative: { ...base.creative, ...(existing.creative ?? {}) },
    visual: { ...base.visual, ...(existing.visual ?? {}) },
  };
}

export function buildReviewLedger(existingRecords = []) {
  const { records } = resolveActiveGenome();
  const existing = new Map(existingRecords.map((record) => [record.reference_id, record]));
  return records
    .filter((record) => record.corpus_signals?.saved_positive?.value === true)
    .sort((left, right) => left.reference_id.localeCompare(right.reference_id))
    .map((record) => preserveReviewData(baseReviewRecord(record), existing.get(record.reference_id)));
}

function localAssetsExist(paths) {
  return Array.isArray(paths)
    && paths.length > 0
    && paths.every((assetPath) => {
      if (!nonEmpty(assetPath) || assetPath.startsWith('../') || assetPath.startsWith('/')) return false;
      const fullPath = resolve(SETUP_ROOT, assetPath);
      return existsSync(fullPath) && statSync(fullPath).isFile() && statSync(fullPath).size > 0;
    });
}

function allFieldsPresent(record, area, fields) {
  return fields.every((field) => nonEmpty(record[area]?.[field]));
}

export function validateReviewLedger(records, { requireComplete = false } = {}) {
  const errors = [];
  const ids = new Set();
  const counts = {
    total: records.length,
    available_local: 0,
    captured_local: 0,
    needs_authorized_retrieval: 0,
    explicitly_inaccessible: 0,
    pending_media: 0,
    ready_for_manual_review: 0,
    manual_reviewed: 0,
    inaccessible: 0,
  };

  for (const [index, record] of records.entries()) {
    const label = record.reference_id || `row ${index + 1}`;
    if (!nonEmpty(record.reference_id)) errors.push(`${label}: reference_id is required`);
    if (ids.has(record.reference_id)) errors.push(`${label}: duplicate reference_id`);
    ids.add(record.reference_id);
    if (record.schema_version !== REVIEW_SCHEMA_VERSION) errors.push(`${label}: unsupported schema_version`);

    const mediaStatus = record.media?.status;
    const reviewStatus = record.review?.status;
    if (!MEDIA_STATUSES.has(mediaStatus)) errors.push(`${label}: invalid media status`);
    if (!REVIEW_STATUSES.has(reviewStatus)) errors.push(`${label}: invalid review status`);
    if (counts[mediaStatus] !== undefined) counts[mediaStatus] += 1;
    if (counts[reviewStatus] !== undefined) counts[reviewStatus] += 1;

    const hasLocalAssets = localAssetsExist(record.media?.asset_paths);
    if (['available_local', 'captured_local'].includes(mediaStatus) && !hasLocalAssets) {
      errors.push(`${label}: local media status requires one or more existing repository assets`);
    }
    if (mediaStatus === 'explicitly_inaccessible' && !nonEmpty(record.review?.inaccessible_reason)) {
      errors.push(`${label}: explicitly inaccessible media requires an inaccessible_reason`);
    }
    if (mediaStatus === 'needs_authorized_retrieval' && reviewStatus !== 'pending_media') {
      errors.push(`${label}: pending authorized retrieval requires pending_media review status`);
    }
    if (['available_local', 'captured_local'].includes(mediaStatus)
      && !['ready_for_manual_review', 'manual_reviewed'].includes(reviewStatus)) {
      errors.push(`${label}: available local media requires ready_for_manual_review or manual_reviewed status`);
    }
    if (mediaStatus === 'explicitly_inaccessible' && reviewStatus !== 'inaccessible') {
      errors.push(`${label}: explicitly inaccessible media requires inaccessible review status`);
    }
    if (reviewStatus === 'manual_reviewed') {
      if (!['available_local', 'captured_local'].includes(mediaStatus) || !hasLocalAssets) {
        errors.push(`${label}: manual review requires an inspectable local asset`);
      }
      if (!nonEmpty(record.review?.reviewed_at) || !nonEmpty(record.review?.reviewer) || !nonEmpty(record.review?.evidence)) {
        errors.push(`${label}: manual review requires reviewed_at, reviewer, and evidence`);
      }
      if (!allFieldsPresent(record, 'creative', CREATIVE_FIELDS)) {
        errors.push(`${label}: manual review is missing creative anatomy fields`);
      }
      if (!allFieldsPresent(record, 'visual', VISUAL_FIELDS)) {
        errors.push(`${label}: manual review is missing visual craft fields`);
      }
    }
    if (reviewStatus === 'inaccessible' && mediaStatus !== 'explicitly_inaccessible') {
      errors.push(`${label}: inaccessible review status requires explicitly inaccessible media`);
    }
  }

  const expectedIds = new Set(
    resolveActiveGenome().records
      .filter((record) => record.corpus_signals?.saved_positive?.value === true)
      .map((record) => record.reference_id),
  );
  for (const id of ids) {
    if (!expectedIds.has(id)) errors.push(`${id}: not found in the active saved-post corpus`);
  }
  for (const id of expectedIds) {
    if (!ids.has(id)) errors.push(`${id}: missing from the reference-review ledger`);
  }

  if (requireComplete) {
    if (counts.total !== 480) errors.push(`Expected 480 saved reference records, found ${counts.total}`);
    if (counts.pending_media || counts.ready_for_manual_review) {
      errors.push('Foundation is incomplete: every reference must be manually reviewed or explicitly inaccessible.');
    }
    if (counts.manual_reviewed + counts.inaccessible !== counts.total) {
      errors.push('Foundation is incomplete: review statuses do not account for every record.');
    }
  }

  return { counts, errors, valid: errors.length === 0 };
}

export function reviewQueue(records) {
  return records
    .filter((record) => record.review?.status === 'pending_media')
    .map((record) => ({
      reference_id: record.reference_id,
      creator_name: record.source?.creator_name ?? null,
      post_url: record.source?.post_url ?? null,
      action: 'retrieve_media_read_only',
      constraint: 'Use an authorized, read-only source. Store the captured media under references/creative-review/media/{reference_id}/ and update the ledger before visual annotation.',
    }));
}

export function statusMarkdown(validation) {
  const { counts } = validation;
  const usable = counts.manual_reviewed + counts.inaccessible;
  return `# Creative Review Foundation Status\n\n` +
    `**Generated from:** active Creative Genome saved-post set  \n` +
    `**Status:** ${validation.valid && usable === counts.total ? 'ready for calibration' : 'foundation incomplete'}\n\n` +
    `| Measure | Count |\n|---|---:|\n` +
    `| Saved references | ${counts.total} |\n` +
    `| Local assets ready for review | ${counts.available_local + counts.captured_local} |\n` +
    `| Needs authorized read-only retrieval | ${counts.needs_authorized_retrieval} |\n` +
    `| Explicitly inaccessible | ${counts.explicitly_inaccessible} |\n` +
    `| Manually reviewed | ${counts.manual_reviewed} |\n` +
    `| Pending media | ${counts.pending_media} |\n` +
    `| Ready for manual review | ${counts.ready_for_manual_review} |\n` +
    `| Inaccessible | ${counts.inaccessible} |\n\n` +
    `Do not treat preview or caption-derived classifications as visual review. V4 production remains blocked until every record is manually reviewed or explicitly inaccessible.\n`;
}

export function writeReviewFoundation(records) {
  const validation = validateReviewLedger(records);
  atomicWrite(REVIEW_LEDGER_PATH, stableJsonl(records));
  atomicWrite(REVIEW_QUEUE_PATH, stableJsonl(reviewQueue(records)));
  atomicWrite(REVIEW_STATUS_PATH, statusMarkdown(validation));
  return validation;
}

export function readReviewLedger(path = REVIEW_LEDGER_PATH) {
  return existsSync(path) ? readJsonl(path) : [];
}

export function reviewCompleteness(records) {
  return validateReviewLedger(records, { requireComplete: true });
}
