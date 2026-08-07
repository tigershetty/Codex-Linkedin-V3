#!/usr/bin/env node

/**
 * Produce the availability-and-review manifest for the local Pierri corpus.
 *
 * The raw media folder is deliberately out of scope. This script reads only the existing
 * deterministic index and detailed sidecars; it neither reads nor mutates source media.
 */

import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const reviewRoot = path.join(root, 'references', 'creative-review');
const indexPath = path.join(reviewRoot, 'vincent-pierri-corpus-index-v1.json');
const forensicRoot = path.join(reviewRoot, 'pierri-forensics');
const recordsDir = path.join(forensicRoot, 'records');
const outputPath = path.join(forensicRoot, 'asset-manifest-v1.json');

const hash = (value) => createHash('sha256').update(value).digest('hex');
const repoRelative = (value) => path.relative(root, value).replaceAll(path.sep, '/');

const index = JSON.parse(await readFile(indexPath, 'utf8'));
const sidecarNames = (await readdir(recordsDir)).filter((name) => /^PIERRI-\d{3}\.json$/.test(name));
const reviewed = new Map();

for (const name of sidecarNames) {
  const fullPath = path.join(recordsDir, name);
  const record = JSON.parse(await readFile(fullPath, 'utf8'));
  if (reviewed.has(record.asset_id)) {
    throw new Error(`Duplicate sidecars for asset ${record.asset_id}`);
  }
  reviewed.set(record.asset_id, { name, record });
}

const assets = index.records
  .filter((record) => record.asset)
  .map((record) => {
    const sidecar = reviewed.get(record.post_id);
    return {
      asset_id: record.post_id,
      asset_status: 'available_local',
      source_asset: {
        relative_path: record.asset.relative_source_path,
        sha256: record.asset.sha256,
        format: record.asset.format,
        canvas: { width: record.asset.width, height: record.asset.height },
        frame_count: record.asset.frame_count ?? null,
        duration_ms_from_gce: record.asset.duration_ms_from_gce ?? null
      },
      caption_link: {
        status: record.pairing_status,
        association_confidence:
          record.pairing_status === 'known_manual_mismatch'
            ? 'explicitly_not_paired'
            : record.pairing_status === 'asset_only'
              ? 'no_caption_supplied'
              : 'asserted_by_numeric_id_only',
        caption_available: Boolean(record.caption),
        limitation: record.pairing_provenance
      },
      forensic_review: {
        status: sidecar ? 'reviewed_direct_asset' : 'queued_asset_available',
        sidecar_path: sidecar ? repoRelative(path.join(recordsDir, sidecar.name)) : null,
        source_index_status: sidecar ? 'asset_hash_bound' : 'not_yet_inspected'
      }
    };
  })
  .sort((a, b) => a.asset_id - b.asset_id);

const manifest = {
  schema_version: '1.0.0',
  manifest_purpose:
    'Asset availability and direct-review status for the user-supplied Pierri creative-reference corpus; not a performance dataset.',
  source_index: {
    path: repoRelative(indexPath),
    sha256: hash(await readFile(indexPath, 'utf8')),
    raw_source_contract: 'The source index is authoritative for local media metadata; raw media is never changed by this workflow.'
  },
  summary: {
    available_asset_count: assets.length,
    reviewed_direct_asset_count: assets.filter((asset) => asset.forensic_review.status === 'reviewed_direct_asset').length,
    queued_asset_available_count: assets.filter((asset) => asset.forensic_review.status === 'queued_asset_available').length,
    caption_link_status_counts: Object.fromEntries(
      [...new Set(assets.map((asset) => asset.caption_link.status))]
        .sort()
        .map((status) => [status, assets.filter((asset) => asset.caption_link.status === status).length])
    )
  },
  assets
};

await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${repoRelative(outputPath)}: ${manifest.summary.reviewed_direct_asset_count} reviewed, ${manifest.summary.queued_asset_available_count} queued.`);
