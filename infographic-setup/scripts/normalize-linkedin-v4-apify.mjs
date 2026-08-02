#!/usr/bin/env node

/**
 * Normalize the LinkedIn V4 Apify extraction without discarding provenance.
 *
 * The Harvest post Actor can return both an original LinkedIn activity and a
 * later repost wrapper for the same canonical post URL. These are not summed.
 * The script emits one canonical content record plus a separate activity
 * registry so repost cadence can be excluded without losing the raw event.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const rawPostsPath = arg('--raw-posts');
const rawProfilesPath = arg('--raw-profiles');
const identityPath = arg('--identity-map');
const manifestPath = arg('--manifest');
const outputPath = arg('--output');
const asOf = arg('--as-of', new Date().toISOString().slice(0, 10));

if (!rawPostsPath || !outputPath) {
  console.error('Usage: node normalize-linkedin-v4-apify.mjs --raw-posts PATH --output FILE [--raw-profiles PATH] [--identity-map FILE] [--manifest FILE] [--as-of YYYY-MM-DD]');
  process.exit(2);
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const cleanText = (value) => typeof value === 'string' ? value.trim() : '';
const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null);
const numberOrNull = (value) => Number.isFinite(Number(value)) ? Number(value) : null;

function normalizeUrl(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com')) url.hostname = 'www.linkedin.com';
    url.search = '';
    url.hash = '';
    if (/^\/in\//.test(url.pathname)) url.pathname = url.pathname.replace(/\/(?:en|de|fr|es|it|nl|pt|sv|no|da|fi)\/?$/i, '');
    return url.toString().replace(/\/$/, '');
  } catch {
    return value.trim().replace(/[?#].*$/, '').replace(/\/$/, '');
  }
}

function activityIdFrom(value) {
  const text = cleanText(value);
  const match = text.match(/(?:activity[-:]|urn:li:activity:)(\d{10,})/i);
  return match?.[1] ?? null;
}

function actorActivityId(row) {
  return cleanText(firstDefined(row.id, row.entityId)) || null;
}

function canonicalActivityId(row) {
  return activityIdFrom(row.linkedinUrl)
    || cleanText(row.engagement?.id)
    || activityIdFrom(row.shareLinkedinUrl)
    || actorActivityId(row);
}

function compactProfileUrl(row) {
  return normalizeUrl(row.author?.linkedinUrl || row.originalQuery?.url || row.linkedinUrl);
}

function targetUrl(row) {
  return normalizeUrl(row.query?.targetUrl || row.originalQuery?.url);
}

function targetKey(row) {
  return targetUrl(row) || row.author?.publicIdentifier || row.publicIdentifier || 'unknown-target';
}

function timestampOf(row) {
  const raw = firstDefined(row.postedAt?.timestamp, row.repostedAt?.timestamp);
  const numeric = Number(raw);
  if (Number.isFinite(numeric)) return numeric;
  const parsed = Date.parse(firstDefined(row.postedAt?.date, row.repostedAt?.date));
  return Number.isFinite(parsed) ? parsed : null;
}

function isRepostWrapper(row) {
  const header = cleanText(row.header?.text).toLowerCase();
  return Boolean(row.repostedBy || row.repostedAt || row.repost || header.includes('reposted this'));
}

function isQuoteRow(row) {
  if (row.quotePost || row.quotedPost || row.quote) return true;
  if (row.repost && typeof row.repost === 'object' && cleanText(row.content)) return true;
  return null;
}

function mediaFrom(row) {
  const fieldsFrom = (value) => {
    const images = Array.isArray(value?.postImages) ? value.postImages : [];
    const document = value?.document ?? null;
    const video = value?.postVideo ?? null;
    const article = value?.article ?? null;
    const hasAnyMediaField = Boolean(value) && (
      Object.hasOwn(value, 'postImages')
      || Object.hasOwn(value, 'document')
      || Object.hasOwn(value, 'postVideo')
      || Object.hasOwn(value, 'article')
    );
    let nativeFormat = null;
    if (document) nativeFormat = 'F4_document';
    else if (video) nativeFormat = 'F5_video';
    else if (images.length > 1) nativeFormat = 'F3_multi_image';
    else if (images.length === 1) nativeFormat = 'F2_static_image';
    else if (article) nativeFormat = 'F6_link_article';
    else if (hasAnyMediaField) nativeFormat = 'F1_text_only';
    return { observability: hasAnyMediaField ? 'observed' : 'unknown', nativeFormat, images, document, video, article };
  };

  const direct = fieldsFrom(row);
  const quote = isQuoteRow(row) === true;
  const embedded = quote && row.repost && typeof row.repost === 'object' ? fieldsFrom(row.repost) : null;

  return {
    ...direct,
    // A quote is an independent LinkedIn delivery type. Keep the embedded
    // attachment as a subtype instead of silently classifying the quote as
    // text-only when its own top-level media fields are empty.
    nativeFormat: quote ? 'F7_quote' : direct.nativeFormat,
    embeddedNativeFormat: embedded?.nativeFormat ?? null,
    embeddedMedia: embedded,
  };
}

function outcomeFromGroup(rows) {
  const field = (name) => {
    const values = rows
      .map((row) => numberOrNull(row.engagement?.[name]))
      .filter((value) => value !== null);
    const unique = [...new Set(values)];
    return { value: unique.length === 1 ? unique[0] : null, conflict: unique.length > 1, observed: unique.length > 0 };
  };
  const reactions = field('likes');
  const comments = field('comments');
  const reposts = field('shares');
  const complete = reactions.value !== null && comments.value !== null && reposts.value !== null;
  return {
    reactionCount: reactions.value,
    commentCount: comments.value,
    repostCount: reposts.value,
    publicInteractions: complete ? reactions.value + comments.value + reposts.value : null,
    outcomeComplete: complete,
    conflict: reactions.conflict || comments.conflict || reposts.conflict,
  };
}

async function filesUnder(path) {
  const absolute = resolve(path);
  const info = await stat(absolute);
  if (info.isFile()) return [absolute];
  const entries = await readdir(absolute, { withFileTypes: true });
  const nested = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const child = resolve(absolute, entry.name);
    if (entry.isDirectory()) nested.push(...await filesUnder(child));
    else if (extname(entry.name).toLowerCase() === '.json' || entry.name.endsWith('.jsonl')) nested.push(child);
  }
  return nested;
}

async function loadRows(path, rowFilter = () => true) {
  if (!path) return { rows: [], files: [] };
  const files = await filesUnder(path);
  const rows = [];
  const provenance = [];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const parsed = file.endsWith('.jsonl')
      ? text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
      : JSON.parse(text);
    const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed.items) ? parsed.items : [];
    items.forEach((item, index) => {
      if (item && typeof item === 'object' && rowFilter(item)) rows.push({ ...item, __rawFile: file, __rawIndex: index });
    });
    const includedItemCount = items.filter((item) => item && typeof item === 'object' && rowFilter(item)).length;
    if (includedItemCount) provenance.push({ path: file, sha256: sha256(text), itemCount: includedItemCount });
  }
  return { rows, files: provenance };
}

function buildIdentityIndex(identityRows) {
  const index = new Map();
  for (const row of identityRows) {
    const url = normalizeUrl(row.exact_post_url);
    const id = activityIdFrom(url);
    const keys = [url, id].filter(Boolean);
    for (const key of keys) {
      if (!index.has(key)) index.set(key, []);
      index.get(key).push({
        referenceId: row.reference_id,
        postingAuthor: row.actual_posting_author ?? null,
        postingAuthorProfileUrl: normalizeUrl(row.actual_author_profile_url),
        creditedCreator: row.credited_source_creator ?? null,
        visualOwner: row.visual_owner_or_org ?? null,
        transferClass: row.transfer_class ?? null,
        confidence: row.confidence ?? null,
      });
    }
  }
  return index;
}

const postLoad = await loadRows(rawPostsPath, (row) => Boolean(row.postedAt || row.query || row.engagement || row.shareUrn || row.content));
const profileLoad = await loadRows(rawProfilesPath, (row) => Boolean(row.originalQuery || row.followerCount !== undefined || row.publicIdentifier));
const identityRows = identityPath ? JSON.parse(await readFile(identityPath, 'utf8')) : [];
const identityIndex = buildIdentityIndex(Array.isArray(identityRows) ? identityRows : []);
const manifest = manifestPath ? JSON.parse(await readFile(manifestPath, 'utf8')) : {};

const postGroups = new Map();
for (const row of postLoad.rows) {
  const id = canonicalActivityId(row);
  const url = normalizeUrl(row.linkedinUrl);
  const key = id || url || `unresolved:${row.__rawFile}:${row.__rawIndex}`;
  if (!postGroups.has(key)) postGroups.set(key, []);
  postGroups.get(key).push(row);
}

const canonicalPosts = [];
const activities = [];
const dedupeLog = [];

for (const [key, rows] of [...postGroups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const canonicalId = canonicalActivityId(rows[0]);
  const canonicalUrl = normalizeUrl(rows.find((row) => normalizeUrl(row.linkedinUrl))?.linkedinUrl);
  const preferred = rows.find((row) => actorActivityId(row) === canonicalId)
    || [...rows].sort((a, b) => {
      const completenessA = Object.keys(a).length;
      const completenessB = Object.keys(b).length;
      if (completenessA !== completenessB) return completenessB - completenessA;
      return `${a.__rawFile}:${String(a.__rawIndex).padStart(8, '0')}`.localeCompare(`${b.__rawFile}:${String(b.__rawIndex).padStart(8, '0')}`);
    })[0];
  const outcomes = outcomeFromGroup(rows);
  const captions = [...new Set(rows.map((row) => cleanText(row.content)).filter(Boolean))];
  const authors = [...new Set(rows.map((row) => cleanText(row.author?.publicIdentifier || row.author?.name)).filter(Boolean))];
  const mediaCandidates = rows.map((row) => mediaFrom(row));
  const media = mediaCandidates.find((entry) => entry.nativeFormat) || mediaCandidates[0] || mediaFrom({});
  const publishedAtMs = timestampOf(preferred);
  const ageDays = publishedAtMs === null ? null : Math.floor((Date.parse(`${asOf}T23:59:59Z`) - publishedAtMs) / 86400000);
  const attributions = identityIndex.get(canonicalId) || identityIndex.get(canonicalUrl) || [];
  const rawRefs = rows.map((row) => ({
    file: row.__rawFile,
    index: row.__rawIndex,
    actorActivityId: actorActivityId(row),
    targetUrl: targetUrl(row),
    repostWrapper: isRepostWrapper(row),
  }));

  canonicalPosts.push({
    canonicalPostId: canonicalId ? `LI-${canonicalId}` : `LI-${sha256(canonicalUrl || key).slice(0, 16)}`,
    canonicalActivityId: canonicalId,
    canonicalUrl,
    authorName: preferred.author?.name ?? null,
    authorPublicIdentifier: preferred.author?.publicIdentifier ?? null,
    authorProfileUrl: compactProfileUrl(preferred),
    publishedAt: publishedAtMs === null ? null : new Date(publishedAtMs).toISOString(),
    ageDays,
    outcomeMaturity: ageDays === null ? 'unknown' : ageDays >= 14 ? 'mature' : 'immature',
    caption: captions.length === 1 ? captions[0] : captions[0] ?? null,
    captionSha256: captions[0] ? sha256(captions[0]) : null,
    captionConflict: captions.length > 1,
    authorConflict: authors.length > 1,
    outcomeConflict: outcomes.conflict,
    ...outcomes,
    media,
    isCanonicalOriginal: actorActivityId(preferred) === canonicalId,
    hasRepostWrapper: rows.some(isRepostWrapper),
    isQuote: rows.some((row) => isQuoteRow(row) === true),
    top100Attribution: attributions,
    rawRowRefs: rawRefs,
    rawRowCount: rows.length,
  });

  for (const row of rows) {
    const actorId = actorActivityId(row);
    const repost = isRepostWrapper(row);
    activities.push({
      activityId: actorId ? `LI-ACT-${actorId}` : `LI-ACT-${sha256(`${row.__rawFile}:${row.__rawIndex}`).slice(0, 16)}`,
      actorActivityId: actorId,
      canonicalActivityId: canonicalId,
      canonicalPostId: canonicalId ? `LI-${canonicalId}` : null,
      targetUrl: targetUrl(row),
      targetKey: targetKey(row),
      activityKind: repost ? 'repost_wrapper' : actorId === canonicalId ? 'original' : 'unresolved',
      isRepost: repost,
      isQuote: isQuoteRow(row) === true,
      activityAt: timestampOf(row) === null ? null : new Date(timestampOf(row)).toISOString(),
      postingAuthorName: row.author?.name ?? null,
      postingAuthorPublicIdentifier: row.author?.publicIdentifier ?? null,
      repostedByName: row.repostedBy?.name ?? null,
      repostedByPublicIdentifier: row.repostedBy?.publicIdentifier ?? null,
      rawFile: row.__rawFile,
      rawIndex: row.__rawIndex,
    });
  }

  if (rows.length > 1) {
    dedupeLog.push({
      canonicalActivityId: canonicalId,
      canonicalUrl,
      rawRowCount: rows.length,
      actorActivityIds: rows.map(actorActivityId),
      repostWrapperCount: rows.filter(isRepostWrapper).length,
      preferredActorActivityId: actorActivityId(preferred),
      canonicalOriginalObserved: rows.some((row) => actorActivityId(row) === canonicalId),
      captionConflict: captions.length > 1,
      authorConflict: authors.length > 1,
      outcomeConflict: outcomes.conflict,
    });
  }
}

canonicalPosts.sort((a, b) => (a.publishedAt || '').localeCompare(b.publishedAt || '') || (a.canonicalPostId || '').localeCompare(b.canonicalPostId || ''));
activities.sort((a, b) => (a.activityAt || '').localeCompare(b.activityAt || '') || a.activityId.localeCompare(b.activityId));

const profiles = profileLoad.rows.map((row) => ({
  profileUrl: normalizeUrl(row.linkedinUrl || row.originalQuery?.url),
  publicIdentifier: row.publicIdentifier ?? null,
  name: [row.firstName, row.lastName].filter(Boolean).join(' ') || null,
  followerCount: numberOrNull(row.followerCount),
  connectionsCount: numberOrNull(row.connectionsCount),
  headline: row.headline ?? null,
  location: row.location?.linkedinText ?? null,
  primaryLanguage: row.primaryLocale?.language ?? null,
  entityType: 'person',
  rawFile: row.__rawFile,
  rawIndex: row.__rawIndex,
}));

const creatorYield = new Map();
for (const activity of activities) {
  const key = activity.targetKey;
  const current = creatorYield.get(key) || { targetKey: key, rawActivities: 0, originalActivities: 0, repostWrappers: 0, canonicalPostIds: new Set() };
  current.rawActivities += 1;
  if (activity.activityKind === 'original') current.originalActivities += 1;
  if (activity.activityKind === 'repost_wrapper') current.repostWrappers += 1;
  if (activity.canonicalPostId) current.canonicalPostIds.add(activity.canonicalPostId);
  creatorYield.set(key, current);
}

const creatorYields = [...creatorYield.values()].map((row) => ({
  targetKey: row.targetKey,
  rawActivities: row.rawActivities,
  uniqueCanonicalPosts: row.canonicalPostIds.size,
  originalActivities: row.originalActivities,
  repostWrappers: row.repostWrappers,
  uniqueYieldRate: row.rawActivities ? row.canonicalPostIds.size / row.rawActivities : null,
}));

const normalized = {
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  asOf,
  studyManifest: manifest,
  provenance: {
    postFiles: postLoad.files,
    profileFiles: profileLoad.files,
    identityMap: identityPath ? { path: resolve(identityPath), sha256: sha256(await readFile(identityPath, 'utf8')) } : null,
  },
  counts: {
    rawPostRows: postLoad.rows.length,
    canonicalPosts: canonicalPosts.length,
    activityRows: activities.length,
    profiles: profiles.length,
    duplicateOrWrapperGroups: dedupeLog.length,
  },
  profiles,
  canonicalPosts,
  activities,
  creatorYields,
  dedupeLog,
};

await mkdir(dirname(resolve(outputPath)), { recursive: true });
await writeFile(resolve(outputPath), `${JSON.stringify(normalized, null, 2)}\n`);
console.log(JSON.stringify({ output: resolve(outputPath), counts: normalized.counts }, null, 2));
