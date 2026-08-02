#!/usr/bin/env node

/** Build deterministic, deduplicated Apify inputs for the LinkedIn V4 study. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const identityPath = arg('--identity-map');
const creatorPoolPath = arg('--creator-pool');
const outputPath = arg('--output');
const tigerProfile = normalizeUrl(arg('--tiger-profile', 'https://www.linkedin.com/in/shettys-desk'));
if (!identityPath || !creatorPoolPath || !outputPath) {
  console.error('Usage: node build-linkedin-v4-apify-inputs.mjs --identity-map FILE --creator-pool FILE --output FILE [--tiger-profile URL]');
  process.exit(2);
}

function normalizeUrl(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value.trim());
    if (url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com')) url.hostname = 'www.linkedin.com';
    url.search = '';
    url.hash = '';
    if (/^\/in\//.test(url.pathname)) url.pathname = url.pathname.replace(/\/(?:en|de|fr|es|it|nl|pt|sv|no|da|fi)\/?$/i, '');
    return url.toString().replace(/\/$/, '');
  } catch {
    return value.trim().replace(/[?#].*$/, '').replace(/\/$/, '');
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers, ...body] = rows;
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const identityText = await readFile(resolve(identityPath), 'utf8');
const creatorText = await readFile(resolve(creatorPoolPath), 'utf8');
const identities = JSON.parse(identityText);
const candidates = parseCsv(creatorText);

const trackBProfiles = unique(identities.map((row) => normalizeUrl(row.actual_author_profile_url)));
const trackBExactPosts = unique(identities.map((row) => normalizeUrl(row.exact_post_url)));
const trackAProfiles = unique(candidates.map((row) => normalizeUrl(row.linkedin_profile_url || row.profile_url || row.linkedin_url)));
const allExternalProfiles = unique([...trackAProfiles, ...trackBProfiles]).filter((url) => url !== tigerProfile);
const personalProfiles = unique([...allExternalProfiles, tigerProfile]).filter((url) => url.includes('/in/'));
const companyPages = allExternalProfiles.filter((url) => url.includes('/company/'));

const profileInput = {
  profileScraperMode: 'Profile details no email ($4 per 1k)',
  urls: personalProfiles,
};

const externalPostInput = {
  targetUrls: unique([...allExternalProfiles, ...trackBExactPosts]),
  maxPosts: 30,
  postedLimitDate: '2026-02-15T00:00:00+01:00',
  includeQuotePosts: true,
  includeReposts: true,
  scrapeReactions: false,
  scrapeComments: false,
  contextCountry: 'any',
};

const tigerPostInput = {
  targetUrls: [tigerProfile],
  maxPosts: 120,
  postedLimitDate: '2026-02-15T00:00:00+01:00',
  includeQuotePosts: true,
  includeReposts: true,
  scrapeReactions: false,
  scrapeComments: false,
  contextCountry: 'any',
};

const overlap = trackAProfiles.filter((url) => trackBProfiles.includes(url));
const projected = {
  profileRowsMax: personalProfiles.length,
  externalProfileHistoryRowsMax: allExternalProfiles.length * 30,
  exactReferenceRowsMax: trackBExactPosts.length,
  tigerRowsMax: 120,
};
projected.postRowsMax = projected.externalProfileHistoryRowsMax + projected.exactReferenceRowsMax + projected.tigerRowsMax;
projected.profileCostUsdMax = projected.profileRowsMax * 0.004;
projected.postCostUsdMax = projected.postRowsMax * 0.002;
projected.newSpendUsdMax = projected.profileCostUsdMax + projected.postCostUsdMax;
projected.cumulativeSpendUsdMax = 0.07605 + projected.newSpendUsdMax;

const result = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourceHashes: {
    identityMapSha256: sha256(identityText),
    creatorPoolSha256: sha256(creatorText),
  },
  counts: {
    trackACandidateProfiles: trackAProfiles.length,
    trackBUniqueProfiles: trackBProfiles.length,
    trackBExactPosts: trackBExactPosts.length,
    trackAAndBOverlap: overlap.length,
    allExternalProfiles: allExternalProfiles.length,
    personalProfilesIncludingTiger: personalProfiles.length,
    companyPages: companyPages.length,
  },
  tigerProfile,
  overlap,
  companyPages,
  projected,
  hardStopUsd: 8.25,
  inputs: { profileInput, externalPostInput, tigerPostInput },
};

if (projected.cumulativeSpendUsdMax > result.hardStopUsd) {
  console.error(JSON.stringify({ status: 'BLOCKED_BUDGET', projected, hardStopUsd: result.hardStopUsd }, null, 2));
  process.exit(1);
}

await mkdir(dirname(resolve(outputPath)), { recursive: true });
await writeFile(resolve(outputPath), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ output: resolve(outputPath), counts: result.counts, projected }, null, 2));
