import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const LIB_DIR = dirname(fileURLToPath(import.meta.url));

export const SETUP_ROOT = resolve(LIB_DIR, '../..');
export const GENOME_ROOT = resolve(SETUP_ROOT, 'references/creative-genome');
export const SCHEMA_VERSION = '1.0.0';
export const SNAPSHOT_ID = 'creative-genome-2026-08-02-v1';
export const SNAPSHOT_RELATIVE_PATH = `references/creative-genome/snapshots/${SNAPSHOT_ID}.jsonl`;
export const MANIFEST_RELATIVE_PATH = 'references/creative-genome/active-manifest.json';
export const TOP100_ASSET_RELATIVE_ROOT = 'references/top 100';
export const DEFAULT_AUDIT_RELATIVE_ROOT =
  'references/outputs/019fc389-0554-7a43-a8fa-07bd597be61d/linkedin-content-market-fit-audit-2026-08-02';

const INFERENCE_FIELDS = [
  'target_audience',
  'problem_family',
  'job_to_be_done',
  'topic',
  'hook_type',
  'promise',
  'proof_type',
  'lived_experience_signal',
  'emotional_trigger',
  'artifact_type',
  'format',
  'cta',
];

const TIGER_METRIC_FIELDS = [
  'impressions',
  'reactions',
  'comments',
  'reposts',
  'saves',
  'sends',
  'profile_viewers_from_post',
  'followers_gained',
  'social_engagements',
  'public_interactions',
  'reaction_rate',
  'comment_rate',
  'repost_rate',
  'save_rate',
  'send_rate',
  'profile_viewer_rate',
  'follower_conversion',
];

export function ensureDirectory(path) {
  mkdirSync(path, { recursive: true });
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function readJsonl(path) {
  const source = readFileSync(path, 'utf8');
  if (!source.trim()) return [];
  return source
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid JSONL at ${path}:${index + 1}: ${error.message}`);
      }
    });
}

export function parseCsv(source) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n') {
      row.push(cell.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (quoted) throw new Error('Unterminated quoted CSV field');
  if (cell.length || row.length) {
    row.push(cell.replace(/\r$/, ''));
    rows.push(row);
  }

  return rows;
}

export function readCsvObjects(path) {
  const rows = parseCsv(readFileSync(path, 'utf8'));
  if (!rows.length) return [];
  const [header, ...body] = rows;
  return body
    .filter((row) => row.some((value) => value !== ''))
    .map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? ''])));
}

export function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortDeep(value[key])]),
    );
  }
  return value;
}

export function stableStringify(value, space = 2) {
  return JSON.stringify(sortDeep(value), null, space);
}

export function stableJsonl(records) {
  return `${records.map((record) => stableStringify(record, 0)).join('\n')}\n`;
}

export function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

export function sha256File(path) {
  return sha256(readFileSync(path));
}

export function atomicWrite(path, content) {
  ensureDirectory(dirname(path));
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, content);
  renameSync(temporary, path);
}

export function relativeToSetup(path) {
  return relative(SETUP_ROOT, path).split('\\').join('/');
}

export function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

export function tokenize(...values) {
  return normalizeText(values.flat(Infinity).join(' '))
    .toLocaleLowerCase('en')
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2);
}

export function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value !== '' && value !== null && value !== undefined))].sort();
}

function annotation(value, inference, manualOverride) {
  const normalized = normalizeText(manualOverride?.manual_value ?? value);
  if (!normalized) {
    return {
      basis: 'not_observed',
      status: 'not_observed',
      value: null,
    };
  }

  if (manualOverride) {
    return {
      basis: 'manual_review',
      confidence: normalizeText(manualOverride.confidence) || null,
      evidence: normalizeText(manualOverride.manual_evidence) || null,
      reviewed_at: normalizeText(manualOverride.reviewed_at) || null,
      status: 'manual_reviewed',
      value: normalized,
    };
  }

  return {
    basis: normalizeText(inference?.inference_method) || 'audit_inference',
    confidence: normalizeText(inference?.inference_confidence) || null,
    evidence_limit: normalizeText(inference?.evidence_limit) || null,
    status: 'heuristic_unverified',
    value: normalized,
  };
}

function visualAnnotation(post, inference, manualOverride) {
  const value = normalizeText(manualOverride?.manual_value ?? inference?.visual_structure);
  const manualEvidence = normalizeText(manualOverride?.manual_evidence);
  const hasLightboxEvidence = Boolean(manualOverride && /lightbox\s+(showed|review|inspection)/i.test(manualEvidence));
  const previewObserved = /preview/i.test(normalizeText(post.visual_observed));
  const inspectionLevel = hasLightboxEvidence
    ? 'manual_lightbox'
    : previewObserved
      ? 'preview_only'
      : 'not_inspected';

  return {
    basis: hasLightboxEvidence
      ? 'manual_lightbox_review'
      : normalizeText(inference?.inference_method) || 'audit_inference',
    confidence: manualOverride
      ? normalizeText(manualOverride.confidence) || null
      : normalizeText(inference?.inference_confidence) || null,
    evidence: manualEvidence || null,
    evidence_limit: hasLightboxEvidence
      ? null
      : 'A preview or text-derived classification cannot verify detailed visual mechanics.',
    inspection_level: inspectionLevel,
    status: hasLightboxEvidence
      ? 'manual_verified'
      : value
        ? 'heuristic_unverified'
        : 'not_observed',
    value: value || null,
  };
}

function buildOverrideIndex(rows) {
  const index = new Map();
  for (const row of rows) {
    if (!index.has(row.record_id)) index.set(row.record_id, new Map());
    index.get(row.record_id).set(row.field, row);
  }
  return index;
}

function top100AssetIndex() {
  const assetRoot = resolve(SETUP_ROOT, TOP100_ASSET_RELATIVE_ROOT);
  if (!existsSync(assetRoot)) return new Map();
  return new Map(
    readdirSync(assetRoot)
      .map((filename) => {
        const match = filename.match(/^(\d+)'?\.(?:gif|jpe?g|png|webp)$/i);
        return match
          ? [Number(match[1]), `${TOP100_ASSET_RELATIVE_ROOT}/${filename}`]
          : null;
      })
      .filter(Boolean)
      .sort(([left], [right]) => left - right),
  );
}

function buildTop100ReferenceIndex(rows) {
  const index = new Map();
  for (const row of rows) {
    if (row.source_type !== 'repository_top100_reference') continue;
    const match = normalizeText(row.observation_scope).match(/Curated-success reference\s+(\d+)/i);
    if (!match) continue;
    if (!index.has(row.record_id)) index.set(row.record_id, new Set());
    index.get(row.record_id).add(Number(match[1]));
  }
  return index;
}

function creativeAssets(recordId, top100ReferenceIndex, assetIndex) {
  const referenceNumbers = [...(top100ReferenceIndex.get(recordId) ?? [])].sort(
    (left, right) => left - right,
  );
  return {
    top100_references: referenceNumbers.map((referenceNumber) => ({
      caption_index_path: 'references/top100-caption-index.md',
      local_asset_path: assetIndex.get(referenceNumber) ?? null,
      reference_number: referenceNumber,
      visual_inspection_required: true,
    })),
  };
}

function tigerPerformance(post) {
  if (!post.source_memberships.includes('tiger_live_native_analytics')) return null;
  return {
    captured_at: normalizeText(post.collection_timestamp) || null,
    metrics: Object.fromEntries(TIGER_METRIC_FIELDS.map((field) => [field, post[field] ?? null])),
    observation_status: 'observed_native_analytics',
  };
}

export function buildCreativeGenome({ posts, inferences, manualOverrides, provenanceRows = [] }) {
  const inferenceIndex = new Map(inferences.map((row) => [row.record_id, row]));
  const overrideIndex = buildOverrideIndex(manualOverrides);
  const top100ReferenceIndex = buildTop100ReferenceIndex(provenanceRows);
  const assetIndex = top100AssetIndex();

  return [...posts]
    .sort((left, right) => left.record_id.localeCompare(right.record_id))
    .map((post) => {
      const inference = inferenceIndex.get(post.record_id);
      if (!inference) throw new Error(`Missing inference row for ${post.record_id}`);
      const overrides = overrideIndex.get(post.record_id) ?? new Map();
      const annotations = Object.fromEntries(
        INFERENCE_FIELDS.map((field) => [
          field,
          annotation(inference[field], inference, overrides.get(field)),
        ]),
      );
      annotations.visual_structure = visualAnnotation(
        post,
        inference,
        overrides.get('visual_structure'),
      );

      const memberships = uniqueSorted(post.source_memberships ?? []);
      return {
        annotations,
        creative_assets: creativeAssets(post.record_id, top100ReferenceIndex, assetIndex),
        corpus_signals: {
          saved_positive: {
            basis: memberships.includes('saved_curated_collection')
              ? 'tiger_intentional_save'
              : null,
            value: memberships.includes('saved_curated_collection'),
          },
          stage0_current_market: memberships.includes('stage0_current_market'),
          tiger_native_performance: memberships.includes('tiger_live_native_analytics'),
          top100_curated_reference: memberships.includes('top100_reference_library'),
        },
        creator: {
          name: normalizeText(post.author) || null,
          profile_url: normalizeText(post.author_profile_url) || null,
        },
        observed: {
          caption: post.caption_observed || null,
          hook: post.hook_observed || null,
          missing_fields: uniqueSorted(post.missing_fields ?? []),
          native_format_code: normalizeText(post.native_format_code) || null,
          observation_confidence: normalizeText(post.observation_confidence) || null,
          visual_observation: normalizeText(post.visual_observed) || null,
        },
        performance: tigerPerformance(post),
        provenance: {
          collected_at: normalizeText(post.collection_timestamp) || null,
          provenance_ids: uniqueSorted(post.provenance_ids ?? []),
          source_memberships: memberships,
        },
        publication: {
          activity_id: normalizeText(post.activity_id) || null,
          canonical_url: normalizeText(post.canonical_url) || null,
          observed_at: normalizeText(post.published_at_observed) || null,
          inferred_at: normalizeText(post.published_at_inferred_from_activity_id) || null,
          relative_age_observed: normalizeText(post.relative_age_observed) || null,
        },
        reference_id: post.record_id,
        schema_version: SCHEMA_VERSION,
      };
    });
}

export function validateCreativeGenome(records, expected = {}) {
  const errors = [];
  const ids = new Set();
  let savedPositive = 0;
  let tigerPerformanceCount = 0;
  let manualVerifiedVisuals = 0;
  let top100CuratedRecords = 0;
  let top100LocalAssetLinks = 0;

  for (const [index, record] of records.entries()) {
    const label = record.reference_id || `row ${index + 1}`;
    if (!record.reference_id) errors.push(`${label}: missing reference_id`);
    if (ids.has(record.reference_id)) errors.push(`${label}: duplicate reference_id`);
    ids.add(record.reference_id);

    if (record.corpus_signals?.saved_positive?.value) {
      savedPositive += 1;
      if (record.corpus_signals.saved_positive.basis !== 'tiger_intentional_save') {
        errors.push(`${label}: saved positive signal has the wrong basis`);
      }
    }

    if (record.performance) tigerPerformanceCount += 1;
    if (record.corpus_signals?.top100_curated_reference) top100CuratedRecords += 1;
    top100LocalAssetLinks += (record.creative_assets?.top100_references ?? []).filter(
      (asset) => asset.local_asset_path,
    ).length;

    const visual = record.annotations?.visual_structure;
    if (!visual) {
      errors.push(`${label}: missing visual annotation`);
    } else {
      if (visual.status === 'manual_verified') manualVerifiedVisuals += 1;
      if (visual.inspection_level === 'preview_only' && visual.status === 'manual_verified') {
        errors.push(`${label}: preview-only visual detail cannot be marked verified`);
      }
      if (visual.status === 'manual_verified' && visual.inspection_level !== 'manual_lightbox') {
        errors.push(`${label}: verified visual detail lacks manual lightbox inspection`);
      }
    }
  }

  const actual = {
    creative_posts: records.length,
    manual_verified_visuals: manualVerifiedVisuals,
    saved_positive_signals: savedPositive,
    tiger_performance_records: tigerPerformanceCount,
    top100_curated_records: top100CuratedRecords,
    top100_local_asset_links: top100LocalAssetLinks,
  };

  for (const [field, count] of Object.entries(expected)) {
    if (count !== undefined && actual[field] !== count) {
      errors.push(`Expected ${field}=${count}, found ${actual[field]}`);
    }
  }

  return { actual, errors, valid: errors.length === 0 };
}

export function resolveActiveGenome() {
  const manifestPath = resolve(SETUP_ROOT, MANIFEST_RELATIVE_PATH);
  if (!existsSync(manifestPath)) {
    throw new Error(`Active Creative Genome manifest not found: ${manifestPath}`);
  }
  const manifest = readJson(manifestPath);
  const snapshotPath = resolve(SETUP_ROOT, manifest.snapshot.path);
  if (!existsSync(snapshotPath)) {
    throw new Error(`Active Creative Genome snapshot not found: ${snapshotPath}`);
  }
  const content = readFileSync(snapshotPath);
  const digest = sha256(content);
  if (digest !== manifest.snapshot.sha256) {
    throw new Error(
      `Creative Genome snapshot hash mismatch: expected ${manifest.snapshot.sha256}, found ${digest}`,
    );
  }
  return {
    manifest,
    manifestPath,
    records: readJsonl(snapshotPath),
    snapshotPath,
  };
}

export function parseCliArgs(argv) {
  const options = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      options._.push(arg);
      continue;
    }
    const key = arg.slice(2);
    const next = argv[index + 1];
    if (next !== undefined && !next.startsWith('--')) {
      options[key] = next;
      index += 1;
    } else {
      options[key] = true;
    }
  }
  return options;
}

export function requireFile(path, label) {
  if (!existsSync(path)) throw new Error(`${label} not found: ${path}`);
  return path;
}
