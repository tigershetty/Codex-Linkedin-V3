#!/usr/bin/env node

import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectPierriMediaFile, sha256 } from './lib/pierri-forensics-media.mjs';

const usage = `Usage: node scripts/validate-pierri-forensics.mjs [--require-source-media]

Validates the committed Pierri source index, manifest, and forensic sidecars.

Options:
  --require-source-media  Require the original ignored raw media corpus and verify each
                          source file's hash, format, canvas, GIF frame count, duration,
                          and sampled timestamps.
  --help, -h              Show this help.

Without --require-source-media, raw-media verification is deliberately skipped so a clean
clone can validate the committed forensic record without pretending ignored source media is present.`;
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(usage);
  process.exit(0);
}
const unknownArgs = args.filter((arg) => arg !== '--require-source-media');
if (unknownArgs.length) {
  console.error(`Unknown option(s): ${unknownArgs.join(', ')}`);
  console.error(usage);
  process.exit(2);
}
const requireSourceMedia = args.includes('--require-source-media');

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const reviewRoot = path.join(root, 'references', 'creative-review');
const forensicRoot = path.join(reviewRoot, 'pierri-forensics');
const recordsDir = path.join(forensicRoot, 'records');
const indexPath = path.join(reviewRoot, 'vincent-pierri-corpus-index-v1.json');
const manifestPath = path.join(forensicRoot, 'asset-manifest-v1.json');
const repoRoot = path.resolve(root, '..');

const failures = [];
const requireFields = (value, fields, label) => {
  for (const field of fields) {
    if (value?.[field] === undefined || value?.[field] === null || value?.[field] === '') {
      failures.push(`${label}: missing ${field}`);
    }
  }
};
const indexText = await readFile(indexPath, 'utf8');
const index = JSON.parse(indexText);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const indexAssets = new Map(index.records.filter((record) => record.asset).map((record) => [record.post_id, record]));

function rawAssetPath(relativePath, label) {
  if (typeof relativePath !== 'string' || !relativePath) {
    failures.push(`${label}: missing raw source path`);
    return null;
  }
  const absolute = path.resolve(repoRoot, relativePath);
  const relativeToRepo = path.relative(repoRoot, absolute);
  if (relativeToRepo.startsWith('..') || path.isAbsolute(relativeToRepo)) {
    failures.push(`${label}: raw source path escapes repository`);
    return null;
  }
  return absolute;
}

function equalCanvas(actual, expected) {
  return actual?.width === expected?.width && actual?.height === expected?.height;
}

const inspectedRawAssets = new Map();
const rawSourceAvailability = new Map();
for (const source of indexAssets.values()) {
  const absolute = rawAssetPath(source.asset?.relative_source_path, `source index asset ${source.post_id}`);
  if (!absolute) {
    rawSourceAvailability.set(source.post_id, { absolute: null, available: false });
    continue;
  }
  try {
    await access(absolute);
    rawSourceAvailability.set(source.post_id, { absolute, available: true });
  } catch {
    rawSourceAvailability.set(source.post_id, { absolute, available: false });
  }
}

async function actualAsset(source, label) {
  if (inspectedRawAssets.has(source.post_id)) return inspectedRawAssets.get(source.post_id);
  const location = rawSourceAvailability.get(source.post_id);
  if (!location?.available) return null;
  try {
    const result = await inspectPierriMediaFile(location.absolute);
    inspectedRawAssets.set(source.post_id, result);
    return result;
  } catch (error) {
    failures.push(`${label}: could not inspect raw source asset (${error.message})`);
    return null;
  }
}

function verifyIndexAgainstRaw(source, actual, label) {
  if (!actual) return;
  if (source.asset.sha256 !== actual.sha256) failures.push(`${label}: source-index hash does not match raw local asset`);
  if (source.asset.format !== actual.format) failures.push(`${label}: source-index format does not match raw local asset`);
  if (!equalCanvas(actual.canvas, { width: source.asset.width, height: source.asset.height })) {
    failures.push(`${label}: source-index canvas does not match raw local asset`);
  }
  if (actual.format === 'gif') {
    if (source.asset.frame_count !== actual.frame_count) failures.push(`${label}: source-index GIF frame count does not match raw local asset`);
    if (source.asset.duration_ms_from_gce !== actual.duration_ms_from_gce) failures.push(`${label}: source-index GIF duration does not match raw local asset`);
  } else if (
    (source.asset.frame_count !== undefined && source.asset.frame_count !== null)
    || (source.asset.duration_ms_from_gce !== undefined && source.asset.duration_ms_from_gce !== null)
  ) {
    failures.push(`${label}: static source-index asset must not carry GIF frame metadata`);
  }
}

function verifySidecarAgainstRaw(record, actual, label) {
  if (!actual) return;
  if (record.source_asset?.sha256 !== actual.sha256) failures.push(`${label}: sidecar hash does not match raw local asset`);
  if (record.source_asset?.format !== actual.format) failures.push(`${label}: sidecar format does not match raw local asset`);
  if (!equalCanvas(actual.canvas, record.source_asset?.canvas)) failures.push(`${label}: sidecar canvas does not match raw local asset`);

  const samples = record.inspection?.motion_sampling?.sampled_positions_ms;
  if (actual.format === 'gif') {
    if (record.motion?.source_metadata?.frame_count !== actual.frame_count) {
      failures.push(`${label}: sidecar GIF frame count does not match raw local asset`);
    }
    if (record.motion?.source_metadata?.duration_ms_from_gce !== actual.duration_ms_from_gce) {
      failures.push(`${label}: sidecar GIF duration does not match raw local asset`);
    }
    if (Array.isArray(samples)) {
      for (const [index, sample] of samples.entries()) {
        if (!Number.isFinite(sample) || sample < 0 || sample >= actual.duration_ms_from_gce) {
          failures.push(`${label}: GIF sample ${index + 1} at ${sample}ms is outside the raw source cycle [0, ${actual.duration_ms_from_gce})`);
        }
      }
    }
  } else {
    if (record.motion?.source_metadata?.frame_count !== null || record.motion?.source_metadata?.duration_ms_from_gce !== null) {
      failures.push(`${label}: static sidecar must not carry GIF frame metadata`);
    }
    if (Array.isArray(samples) && samples.length) failures.push(`${label}: static sidecar must not carry motion samples`);
  }
}

if (manifest.schema_version !== '1.0.0') failures.push('manifest: unsupported schema_version');
if (manifest.source_index?.sha256 !== sha256(indexText)) failures.push('manifest: source index hash is stale');
if (manifest.assets?.length !== indexAssets.size) failures.push(`manifest: expected ${indexAssets.size} assets, found ${manifest.assets?.length ?? 0}`);

const unavailableRawAssets = [...rawSourceAvailability.entries()]
  .filter(([, location]) => !location.available)
  .map(([assetId]) => assetId);
if (requireSourceMedia) {
  if (unavailableRawAssets.length) {
    const examples = unavailableRawAssets.slice(0, 8).join(', ');
    const remainder = unavailableRawAssets.length > 8 ? ', …' : '';
    failures.push(
      `raw source corpus: --require-source-media needs all ${indexAssets.size} indexed files, but ${unavailableRawAssets.length} are unavailable (asset IDs: ${examples}${remainder})`
    );
  }
  for (const source of indexAssets.values()) {
    const actual = await actualAsset(source, `source index asset ${source.post_id}`);
    verifyIndexAgainstRaw(source, actual, `source index asset ${source.post_id}`);
  }
}

const seen = new Set();
for (const asset of manifest.assets ?? []) {
  const source = indexAssets.get(asset.asset_id);
  if (!source) {
    failures.push(`manifest asset ${asset.asset_id}: absent from source index`);
    continue;
  }
  if (seen.has(asset.asset_id)) failures.push(`manifest asset ${asset.asset_id}: duplicate`);
  seen.add(asset.asset_id);
  requireFields(asset, ['asset_id', 'asset_status', 'source_asset', 'caption_link', 'forensic_review'], `manifest asset ${asset.asset_id}`);
  if (asset.asset_status !== 'available_local') failures.push(`manifest asset ${asset.asset_id}: invalid availability`);
  if (asset.source_asset?.sha256 !== source.asset.sha256) failures.push(`manifest asset ${asset.asset_id}: source hash mismatch`);
  if (requireSourceMedia) {
    const actual = inspectedRawAssets.get(asset.asset_id) ?? await actualAsset(source, `manifest asset ${asset.asset_id}`);
    if (actual) {
      if (asset.source_asset?.sha256 !== actual.sha256) failures.push(`manifest asset ${asset.asset_id}: raw source hash mismatch`);
      if (asset.source_asset?.format !== actual.format) failures.push(`manifest asset ${asset.asset_id}: raw source format mismatch`);
      if (!equalCanvas(actual.canvas, asset.source_asset?.canvas)) failures.push(`manifest asset ${asset.asset_id}: raw source canvas mismatch`);
      if (actual.format === 'gif') {
        if (asset.source_asset?.frame_count !== actual.frame_count) failures.push(`manifest asset ${asset.asset_id}: raw GIF frame count mismatch`);
        if (asset.source_asset?.duration_ms_from_gce !== actual.duration_ms_from_gce) failures.push(`manifest asset ${asset.asset_id}: raw GIF duration mismatch`);
      }
    }
  }
  if (asset.caption_link?.status !== source.pairing_status) failures.push(`manifest asset ${asset.asset_id}: caption-link status mismatch`);
  if (asset.caption_link?.association_confidence === 'verified_post_pair') failures.push(`manifest asset ${asset.asset_id}: cannot claim verified post pairing`);
  const reviewed = asset.forensic_review?.status === 'reviewed_direct_asset';
  if (!['reviewed_direct_asset', 'queued_asset_available'].includes(asset.forensic_review?.status)) {
    failures.push(`manifest asset ${asset.asset_id}: invalid forensic status`);
  }
  if (reviewed && !asset.forensic_review?.sidecar_path) failures.push(`manifest asset ${asset.asset_id}: reviewed without sidecar path`);
  if (!reviewed && asset.forensic_review?.sidecar_path) failures.push(`manifest asset ${asset.asset_id}: queued asset must not claim sidecar`);
}

const files = (await readdir(recordsDir)).filter((name) => /^PIERRI-\d{3}\.json$/.test(name));
const sidecarIds = new Set();
for (const name of files) {
  const absolute = path.join(recordsDir, name);
  const record = JSON.parse(await readFile(absolute, 'utf8'));
  const source = indexAssets.get(record.asset_id);
  const prefixId = Number(name.match(/\d{3}/)[0]);
  if (record.asset_id !== prefixId) failures.push(`${name}: filename and asset_id differ`);
  if (sidecarIds.has(record.asset_id)) failures.push(`${name}: duplicate asset sidecar`);
  sidecarIds.add(record.asset_id);
  if (!source) {
    failures.push(`${name}: asset absent from source index`);
    continue;
  }
  requireFields(record, ['schema_version', 'corpus_id', 'asset_id', 'review_status', 'source_asset', 'caption_link', 'inspection', 'visual_anatomy', 'motion', 'transferable_mechanism', 'anti_copy_boundary', 'claim_boundary'], name);
  if (record.schema_version !== '1.0.0') failures.push(`${name}: unsupported schema_version`);
  if (record.corpus_id !== 'vincent-pierri-local-reference') failures.push(`${name}: wrong corpus_id`);
  if (record.review_status !== 'reviewed_direct_asset') failures.push(`${name}: not marked direct asset review`);
  if (record.source_asset?.sha256 !== source.asset.sha256) failures.push(`${name}: source asset hash mismatch`);
  if (record.source_asset?.relative_path !== source.asset.relative_source_path) failures.push(`${name}: source asset path mismatch`);
  if (requireSourceMedia) {
    const actual = inspectedRawAssets.get(record.asset_id) ?? await actualAsset(source, name);
    verifySidecarAgainstRaw(record, actual, name);
  }
  if (record.caption_link?.status !== source.pairing_status) failures.push(`${name}: caption link mismatch`);
  if (record.caption_link?.association_confidence === 'verified_post_pair') failures.push(`${name}: cannot claim verified caption pairing`);
  if (record.claim_boundary?.public_claim_status === 'performance_verified') failures.push(`${name}: cannot claim performance verification`);
  requireFields(record.visual_anatomy, ['title', 'layout', 'reading_order', 'typography', 'colour', 'surface', 'modules', 'density'], `${name}.visual_anatomy`);
  requireFields(record.transferable_mechanism, ['reader_job', 'argument_shape', 'mechanism', 'use_condition'], `${name}.transferable_mechanism`);
  if (source.asset.format === 'gif') {
    if (record.motion?.mode !== 'gif_sampled') failures.push(`${name}: GIF requires gif_sampled motion review`);
    if (!Array.isArray(record.inspection?.motion_sampling?.sampled_positions_ms) || record.inspection.motion_sampling.sampled_positions_ms.length < 3) {
      failures.push(`${name}: GIF requires at least three sampled positions`);
    }
  } else if (record.motion?.mode !== 'static') {
    failures.push(`${name}: JPEG must use static motion mode`);
  }
}

for (const asset of manifest.assets ?? []) {
  const isReviewed = asset.forensic_review?.status === 'reviewed_direct_asset';
  if (isReviewed !== sidecarIds.has(asset.asset_id)) {
    failures.push(`manifest asset ${asset.asset_id}: sidecar/review state disagreement`);
  }
  if (isReviewed && asset.forensic_review.sidecar_path) {
    try {
      await access(path.join(root, asset.forensic_review.sidecar_path));
    } catch {
      failures.push(`manifest asset ${asset.asset_id}: sidecar path does not exist`);
    }
  }
}

if (failures.length) {
  console.error(`Pierri forensics validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const baseSummary = `Pierri forensics valid: ${manifest.summary.reviewed_direct_asset_count}/${manifest.summary.available_asset_count} assets directly reviewed; ${manifest.summary.queued_asset_available_count} explicitly queued.`;
if (requireSourceMedia) {
  console.log(`${baseSummary} Raw-media verification passed for all ${indexAssets.size} indexed source files.`);
} else if (unavailableRawAssets.length) {
  console.log(`${baseSummary} Raw-media verification skipped: ${unavailableRawAssets.length}/${indexAssets.size} ignored source file(s) are unavailable in this checkout. Run with --require-source-media only where the original user-supplied corpus is present.`);
} else {
  console.log(`${baseSummary} Raw-media verification skipped: all ${indexAssets.size} source paths are present, but no raw bytes were inspected. Run with --require-source-media for hash/frame verification.`);
}
