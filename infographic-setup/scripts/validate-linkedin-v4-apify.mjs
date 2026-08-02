#!/usr/bin/env node

/** Validate a normalized LinkedIn V4 extraction and fail closed. */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const inputPath = arg('--input');
const reportPath = arg('--report');
if (!inputPath) {
  console.error('Usage: node validate-linkedin-v4-apify.mjs --input FILE [--report FILE]');
  process.exit(2);
}

const data = JSON.parse(await readFile(resolve(inputPath), 'utf8'));
const checks = [];
const check = (id, pass, detail, severity = 'error') => checks.push({ id, pass: Boolean(pass), severity, detail });

const posts = data.canonicalPosts || [];
const activities = data.activities || [];
const profiles = data.profiles || [];

check('schema-v2', data.schemaVersion === 2, `schemaVersion=${data.schemaVersion}`);
check('raw-provenance', (data.provenance?.postFiles?.length || 0) > 0 && data.provenance.postFiles.every((file) => file.sha256), 'Every raw post file has a SHA-256 checksum.');
check('canonical-key-completeness', posts.length > 0 && posts.every((post) => post.canonicalPostId && (post.canonicalActivityId || post.canonicalUrl)), `${posts.filter((post) => !post.canonicalPostId || (!post.canonicalActivityId && !post.canonicalUrl)).length} incomplete keys.`);
check('unique-canonical-keys', new Set(posts.map((post) => post.canonicalPostId)).size === posts.length, `${posts.length} posts; ${new Set(posts.map((post) => post.canonicalPostId)).size} unique keys.`);
check('activity-provenance', activities.length > 0 && activities.every((activity) => activity.rawFile && Number.isInteger(activity.rawIndex)), `${activities.length} activities checked.`);
check('outcomes-not-coerced', posts.every((post) => post.publicInteractions === null || Number.isFinite(post.publicInteractions)), 'Missing outcomes remain null; observed outcomes are numeric.');
check('outcome-arithmetic', posts.every((post) => post.publicInteractions === null || post.publicInteractions === post.reactionCount + post.commentCount + post.repostCount), 'Public interactions equal reactions + comments + reposts.');
check('media-preserved', posts.some((post) => post.media?.images?.length) && posts.some((post) => post.media?.video), 'At least one static/multi-image and one video post are preserved.');
check('media-not-false-default', posts.every((post) => post.media?.observability === 'observed' || post.media?.nativeFormat === null), 'Unknown media is represented as unknown/null.');
check('repost-wrappers-separated', activities.some((activity) => activity.activityKind === 'repost_wrapper') && posts.some((post) => post.hasRepostWrapper), 'Repost wrappers are separate from canonical posts.');
check('canonical-preference', data.dedupeLog.every((row) => {
  const originalObserved = row.actorActivityIds.includes(row.canonicalActivityId);
  return !originalObserved || row.preferredActorActivityId === row.canonicalActivityId;
}), 'When the canonical original row is present, it is preferred over wrappers.');
check('wrapper-only-groups', data.dedupeLog.every((row) => row.canonicalOriginalObserved !== undefined), `${data.dedupeLog.filter((row) => row.canonicalOriginalObserved === false).length} groups contain wrappers only; retained as unresolved originals.`, 'warning');
check('no-silent-conflicts', posts.every((post) => ['captionConflict', 'authorConflict', 'outcomeConflict'].every((field) => typeof post[field] === 'boolean')), 'All conflict flags are explicit.');
check('maturity-labelled', posts.every((post) => ['mature', 'immature', 'unknown'].includes(post.outcomeMaturity)), 'Every post has an outcome maturity label.');
check('chronological-order', posts.every((post, index) => index === 0 || (posts[index - 1].publishedAt || '') <= (post.publishedAt || '')), 'Canonical posts are sorted chronologically.');
check('profile-count', profiles.length > 0, `${profiles.length} profiles normalized.`, 'warning');
check('quote-observability', posts.every((post) => typeof post.isQuote === 'boolean'), `${posts.filter((post) => typeof post.isQuote === 'boolean').length}/${posts.length} quote values explicitly observed.`);
check('quote-format-separated', posts.every((post) => post.isQuote ? post.media?.nativeFormat === 'F7_quote' : post.media?.nativeFormat !== 'F7_quote'), 'Quote delivery is separated from text-only and retains embedded-media subtype.');
check('top100-attribution-separated', posts.every((post) => Array.isArray(post.top100Attribution)), 'Top-100 attribution is stored separately from posting-author fields.');

const errors = checks.filter((item) => !item.pass && item.severity === 'error');
const warnings = checks.filter((item) => !item.pass && item.severity === 'warning');
const report = {
  validatedAt: new Date().toISOString(),
  input: resolve(inputPath),
  status: errors.length ? 'FAIL' : warnings.length ? 'PASS_WITH_WARNINGS' : 'PASS',
  counts: data.counts,
  errorCount: errors.length,
  warningCount: warnings.length,
  checks,
};

const markdown = [
  '# LinkedIn V4 Apify Validation',
  '',
  `**Status:** ${report.status}`,
  `**Errors:** ${errors.length}`,
  `**Warnings:** ${warnings.length}`,
  '',
  '| Check | Result | Severity | Detail |',
  '|---|---|---|---|',
  ...checks.map((item) => `| ${item.id} | ${item.pass ? 'PASS' : 'FAIL'} | ${item.severity} | ${String(item.detail).replace(/\|/g, '\\|')} |`),
  '',
].join('\n');

if (reportPath) await writeFile(resolve(reportPath), markdown);
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
