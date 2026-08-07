#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const reviewRoot = path.join(root, 'references', 'creative-review');
const forensicRoot = path.join(reviewRoot, 'pierri-forensics');
const recordsDir = path.join(forensicRoot, 'records');
const indexPath = path.join(reviewRoot, 'vincent-pierri-corpus-index-v1.json');
const manifestPath = path.join(forensicRoot, 'asset-manifest-v1.json');

const failures = [];
const requireFields = (value, fields, label) => {
  for (const field of fields) {
    if (value?.[field] === undefined || value?.[field] === null || value?.[field] === '') {
      failures.push(`${label}: missing ${field}`);
    }
  }
};
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const indexText = await readFile(indexPath, 'utf8');
const index = JSON.parse(indexText);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const indexAssets = new Map(index.records.filter((record) => record.asset).map((record) => [record.post_id, record]));

if (manifest.schema_version !== '1.0.0') failures.push('manifest: unsupported schema_version');
if (manifest.source_index?.sha256 !== sha256(indexText)) failures.push('manifest: source index hash is stale');
if (manifest.assets?.length !== indexAssets.size) failures.push(`manifest: expected ${indexAssets.size} assets, found ${manifest.assets?.length ?? 0}`);

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

console.log(`Pierri forensics valid: ${manifest.summary.reviewed_direct_asset_count}/${manifest.summary.available_asset_count} assets directly reviewed; ${manifest.summary.queued_asset_available_count} explicitly queued.`);
