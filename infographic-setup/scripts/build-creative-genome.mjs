#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  DEFAULT_AUDIT_RELATIVE_ROOT,
  MANIFEST_RELATIVE_PATH,
  SCHEMA_VERSION,
  SETUP_ROOT,
  SNAPSHOT_ID,
  SNAPSHOT_RELATIVE_PATH,
  atomicWrite,
  buildCreativeGenome,
  parseCliArgs,
  readCsvObjects,
  readJson,
  readJsonl,
  relativeToSetup,
  requireFile,
  sha256,
  sha256File,
  stableJsonl,
  stableStringify,
  validateCreativeGenome,
} from './lib/creative-genome.mjs';

const EXPECTED_COUNTS = Object.freeze({
  creative_posts: 953,
  saved_positive_signals: 480,
  tiger_performance_records: 60,
  top100_curated_records: 72,
  top100_local_asset_links: 70,
});

const SOURCE_FILENAMES = Object.freeze({
  inferences: 'inferences.jsonl',
  manualOverrides: 'manual-review-overrides.csv',
  posts: 'posts.jsonl',
  provenance: 'provenance.csv',
  savedSnapshot: 'source-snapshots/linkedin-saved-curated-collection.jsonl',
  tigerSnapshot: 'source-snapshots/linkedin-tiger-native-analytics.jsonl',
  validation: 'validation-report.json',
});

function sourcePaths(auditRoot) {
  return Object.fromEntries(
    Object.entries(SOURCE_FILENAMES).map(([key, filename]) => [
      key,
      requireFile(resolve(auditRoot, filename), `Creative Genome source ${key}`),
    ]),
  );
}

function assertImmutableSourceCounts(paths) {
  const validation = readJson(paths.validation);
  const savedRows = readJsonl(paths.savedSnapshot).length;
  const tigerRows = readJsonl(paths.tigerSnapshot).length;

  const checks = [
    ['posts', validation.posts, EXPECTED_COUNTS.creative_posts],
    ['inferences', validation.inferences, EXPECTED_COUNTS.creative_posts],
    ['duplicate record IDs', validation.duplicate_record_ids, 0],
    ['saved snapshot rows', savedRows, EXPECTED_COUNTS.saved_positive_signals],
    ['Tiger snapshot rows', tigerRows, EXPECTED_COUNTS.tiger_performance_records],
    ['validation saved rows', validation.saved_snapshot_rows, EXPECTED_COUNTS.saved_positive_signals],
    ['validation Tiger rows', validation.tiger_snapshot_rows, EXPECTED_COUNTS.tiger_performance_records],
  ];

  const failures = checks
    .filter(([, actual, expected]) => actual !== expected)
    .map(([label, actual, expected]) => `${label}: expected ${expected}, found ${actual}`);

  if (failures.length) {
    throw new Error(`Immutable audit count check failed:\n- ${failures.join('\n- ')}`);
  }
  if (validation.inference_id_set_matches_posts !== true) {
    throw new Error('Immutable audit inference IDs do not match the post ID set.');
  }
}

function buildManifest({ auditRoot, paths, snapshotContent, validation }) {
  return {
    build_contract: {
      deterministic: true,
      record_order: 'reference_id ascending',
      saved_signal_policy: 'Every Tiger-saved post is a positive creative signal.',
      visual_verification_policy:
        'Preview-only or text-derived visual classifications remain heuristic_unverified. Only documented manual lightbox review may be manual_verified.',
    },
    counts: validation.actual,
    schema_version: SCHEMA_VERSION,
    snapshot: {
      id: SNAPSHOT_ID,
      path: SNAPSHOT_RELATIVE_PATH,
      record_schema: 'references/creative-genome/schemas/creative-post.schema.json',
      sha256: sha256(snapshotContent),
    },
    source: {
      collection_date: '2026-08-02',
      files: Object.fromEntries(
        Object.entries(paths)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([key, path]) => [
            key,
            {
              path: relativeToSetup(path),
              sha256: sha256File(path),
            },
          ]),
      ),
      immutable_audit_root: relativeToSetup(auditRoot),
    },
  };
}

function main() {
  const options = parseCliArgs(process.argv.slice(2));
  const auditRoot = resolve(
    SETUP_ROOT,
    options['audit-root'] || DEFAULT_AUDIT_RELATIVE_ROOT,
  );
  const paths = sourcePaths(auditRoot);
  assertImmutableSourceCounts(paths);

  const posts = readJsonl(paths.posts);
  const inferences = readJsonl(paths.inferences);
  const manualOverrides = readCsvObjects(paths.manualOverrides);
  const provenanceRows = readCsvObjects(paths.provenance);

  const records = buildCreativeGenome({
    inferences,
    manualOverrides,
    posts,
    provenanceRows,
  });
  const validation = validateCreativeGenome(records, EXPECTED_COUNTS);
  if (!validation.valid) {
    throw new Error(`Creative Genome validation failed:\n- ${validation.errors.join('\n- ')}`);
  }

  const snapshotContent = stableJsonl(records);
  const manifest = buildManifest({
    auditRoot,
    paths,
    snapshotContent,
    validation,
  });
  const manifestContent = `${stableStringify(manifest, 2)}\n`;

  const snapshotPath = resolve(SETUP_ROOT, SNAPSHOT_RELATIVE_PATH);
  const manifestPath = resolve(SETUP_ROOT, MANIFEST_RELATIVE_PATH);

  if (options.check) {
    const expectedSnapshot = readFileSync(snapshotPath, 'utf8');
    const expectedManifest = readFileSync(manifestPath, 'utf8');
    if (expectedSnapshot !== snapshotContent || expectedManifest !== manifestContent) {
      throw new Error('Generated Creative Genome differs from the checked-in active snapshot.');
    }
  } else {
    atomicWrite(snapshotPath, snapshotContent);
    atomicWrite(manifestPath, manifestContent);
  }

  if (!options.quiet) {
    process.stdout.write(
      [
        `Creative Genome ${options.check ? 'verified' : 'built'}: ${SNAPSHOT_ID}`,
        `records=${validation.actual.creative_posts}`,
        `saved_positive=${validation.actual.saved_positive_signals}`,
        `tiger_performance=${validation.actual.tiger_performance_records}`,
        `top100_curated=${validation.actual.top100_curated_records}`,
        `top100_local_assets=${validation.actual.top100_local_asset_links}`,
        `manual_verified_visuals=${validation.actual.manual_verified_visuals}`,
        `sha256=${manifest.snapshot.sha256}`,
      ].join(' | ') + '\n',
    );
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
