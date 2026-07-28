#!/usr/bin/env node

/**
 * Evidence-first Stage 0 analysis for LinkedIn V4.
 *
 * This deliberately separates deterministic observable-feature coding from
 * human/model interpretation. Automated codes are used for scouting and
 * comparative diagnostics, never presented as causal or reliability-validated.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const normalizedPath = arg('--normalized');
const creatorPoolPath = arg('--creator-pool');
const identityPath = arg('--identity-map');
const outputDir = arg('--output-dir');
if (!normalizedPath || !creatorPoolPath || !identityPath || !outputDir) {
  console.error('Usage: node analyze-linkedin-v4-stage0.mjs --normalized FILE --creator-pool FILE --identity-map FILE --output-dir DIR');
  process.exit(2);
}

const SEED = 'SHETTYS-DESK-V4-PILOT-2026-07-27';
const AUTOMATED_FEATURE_VERSION = 'aofa-2026-07-28-v1';
// The frozen observation window is date-based in Tiger's Europe/Stockholm
// operating timezone. July 14 is included; July 15 is the exclusive boundary.
const WINDOW_START = Date.parse('2026-02-15T00:00:00+01:00');
const WINDOW_END_EXCLUSIVE = Date.parse('2026-07-15T00:00:00+02:00');
const MATURITY_DAYS = 14;

const sha256 = (value) => createHash('sha256').update(String(value)).digest('hex');
const lower = (value) => String(value || '').toLowerCase();
const median = (values) => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const mean = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const round = (value, digits = 4) => Number.isFinite(value) ? Number(value.toFixed(digits)) : null;

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

function activityIdFrom(value) {
  const match = String(value || '').match(/(?:activity[-:]|ugcPost[-:]|urn:li:(?:activity|ugcPost):)(\d{10,})/i);
  return match?.[1] ?? null;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') { row.push(field.replace(/\r$/, '')); if (row.some(Boolean)) rows.push(row); row = []; field = ''; }
    else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [headers, ...body] = rows;
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const string = Array.isArray(value) || typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(string) ? `"${string.replace(/"/g, '""')}"` : string;
}

async function writeCsv(path, rows, columns = null) {
  const headers = columns || [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const text = [headers.join(','), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(','))].join('\n') + '\n';
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text);
}

function isEnglish(text, profileLanguage = null) {
  if (String(profileLanguage || '').toLowerCase().startsWith('en')) return true;
  const sample = lower(text).slice(0, 1500);
  if (!sample) return false;
  const latinShare = (sample.match(/[a-z]/g) || []).length / Math.max(1, (sample.match(/[a-z\p{L}]/gu) || []).length);
  const common = (sample.match(/\b(the|and|to|of|in|for|with|you|your|is|are|this|that|from|how|what|we|our)\b/g) || []).length;
  return latinShare >= 0.85 && common >= 2;
}

const keywordSets = {
  PB1: /\b(forecast|demand plan|supply plan|s&op|ibp|planning horizon|schedule|capacity plan|scenario plan)\b/i,
  PB2: /\b(inventory|safety stock|replenish|stockout|eoq|sku|working capital|service level)\b/i,
  PB3: /\b(logistics|warehouse|transport|freight|shipment|3pl|delivery|route|fulfil|fulfill|last mile)\b/i,
  PB4: /\b(procurement|purchas|sourcing|supplier|rfp|rfq|spend|category management|vendor|contract|should.cost)\b/i,
  PB5: /\b(transformation|erp|sap|operating model|implementation|change management|business central|system migration)\b/i,
  PB6: /\b(ai|copilot|chatgpt|claude|llm|agentic|automation|prompt|rag\b|machine learning)\b/i,
  PB7: /\b(excel|power bi|dashboard|analytics|data model|sql|python|kpi|spreadsheet)\b/i,
  PB8: /\b(lean|kaizen|5s\b|six sigma|value stream|bottleneck|constraint|quality|continuous improvement)\b/i,
  PB9: /\b(leader|career|manager|team|communication|culture|hiring|job|promotion|employee|meeting)\b/i,
  PB10: /\b(marketing|content|linkedin|seo|audience|creator|sales|brand|copywriting|lead generation)\b/i,
  PB11: /\b(strategy|finance|revenue|profit|business model|entrepreneur|startup|investment|pricing)\b/i,
};

function problemFamily(text) {
  const scores = Object.entries(keywordSets).map(([code, regex]) => [code, (String(text).match(new RegExp(regex.source, 'gi')) || []).length]);
  scores.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return scores[0]?.[1] > 0 ? scores[0][0] : 'PB12';
}

function hookType(text) {
  const first = String(text || '').split(/\n/).filter(Boolean).slice(0, 3).join(' ').slice(0, 320);
  if (/(?:[$€£]|\b\d+(?:[.,]\d+)?%|\b\d+x\b|saved? \d+|increased? \d+|reduced? \d+)/i.test(first)) return 'H1';
  if (/\b(pain|problem|mistake|waste|overpay|delay|late|stockout|risk|fail|struggl|still using|too much|too many|broken)\b/i.test(first)) return 'H2';
  if (/\b(not .{0,28} but|myth|wrong|instead|versus|\bvs\.?\b|stop calling|truth about)\b/i.test(first)) return 'H3';
  if (/\b(how to|framework|template|checklist|calculator|workflow|playbook|step.by.step|method|system)\b/i.test(first)) return 'H4';
  if (/^(?:\D{0,25})\d+\s+(?:ways|steps|tools|formulas|kpis|rules|ideas|lessons|prompts|frameworks)|\b(handbook|complete guide|ultimate guide|cheat sheet)\b/i.test(first)) return 'H5';
  if (/\b(i built|i tried|i tested|i learned|we built|my experience|here's what happened)\b/i.test(first)) return 'H6';
  if (/\b(just announced|just launched|today|this week|new release|breaking|latest update|new law|new rule)\b/i.test(first)) return 'H7';
  if (/\?$/.test(first.trim()) || /^(why|how|what|when|where|which|have you|do you)\b/i.test(first.trim())) return 'H8';
  return 'H9';
}

function jobPromised(text, pb) {
  const value = lower(text);
  if (/\b(prevent|avoid|fix|reduce risk|stop|eliminate|recover)\b/.test(value)) return 'J3';
  if (/\b(decide|diagnos|compare|prioriti|choose|evaluate|assess|defend)\b/.test(value)) return 'J2';
  if (/\b(build|create|automate|execute|calculate|generate|produce|implement|step.by.step|how to)\b/.test(value)) return 'J4';
  if (pb === 'PB6' && /\b(safe|govern|adopt|evaluate|use case|capabilit|limit)\b/.test(value)) return 'J6';
  if (pb === 'PB9') return 'J5';
  if (/\b(today|new release|announced|latest|what it means)\b/.test(value)) return 'J7';
  if (/\b(inspir|motivat|community|grateful|proud)\b/.test(value)) return 'J8';
  return value ? 'J1' : 'J0';
}

function primaryProof(text) {
  const value = lower(text);
  if (/\b(i|we|our)\s+(tested|analysed|analyzed|measured|ran|built)|\bour data\b|\bthe result(?:s)?\b/.test(value)) return 'P1';
  if (/\b(study|research|report|survey|benchmark|official data|according to|dataset|paper|journal)\b/.test(value)) return 'P2';
  if (/\b(step 1|input|output|worked example|here's exactly|formula|calculation|before.{0,40}after)\b/.test(value)) return 'P3';
  if (/\b(case study|at [A-Z][a-z]+|company|client|customer)\b/.test(String(text))) return 'P4';
  if (/\b(in my experience|i've seen|after \d+ years|practitioner|what i learned)\b/.test(value)) return 'P5';
  if (/\b(framework|model|principle|rule|matrix|method)\b/.test(value)) return 'P6';
  return 'P0';
}

function primaryArtifact(text) {
  const value = lower(text);
  if (/\b(calculator|generator|dashboard|app|interactive tool|live tool)\b/.test(value)) return 'AR1';
  if (/\b(download|workbook|pdf|zip|dataset|template file|field guide|guide)\b/.test(value)) return 'AR2';
  if (/\b(copy|prompt|script|checklist|schema|sop|standard operating|swipe file)\b/.test(value)) return 'AR3';
  if (/\b(formula|matrix|map|model|cheat sheet|decision rule|framework|scorecard|handbook|kpi)\b/.test(value)) return 'AR4';
  if (/\b(screenshot|demo|example|output|before and after)\b/.test(value)) return 'AR5';
  return 'AR0';
}

function contentClass(text, pb) {
  const value = lower(text);
  if (/\b(i|we)\s+(built|tested|tried|changed)|case study|experiment|here's what happened\b/.test(value)) return 'K4';
  if (/\b(how to|step 1|steps|workflow|tutorial|walkthrough)\b/.test(value)) return 'K1';
  if (/\b(decision|choose|compare|versus|matrix|diagnos|prioriti|scorecard)\b/.test(value)) return 'K2';
  if (/\b(announc|latest|new release|report|data shows|trend|thesis)\b/.test(value)) return 'K5';
  if (pb === 'PB9') return 'K6';
  if (/\b(book a|buy|join us|register|webinar|hiring|apply now|launching)\b/.test(value)) return 'K8';
  if (/\b(grateful|proud|personal reflection|community|inspired)\b/.test(value)) return 'K7';
  return 'K3';
}

function primaryCta(text) {
  const value = lower(text).slice(-700);
  if (/\b(comment|reply)\s+(?:the word\s+)?["'“]?[a-z0-9_-]{2,20}["'”]?\s+(?:and|to|below|for)|\bcomment\s+[A-Z]{2,}\b/.test(String(text).slice(-700))) return 'C4';
  if (/\b(buy|book (?:a )?(?:call|demo)|request a demo|paid|enrol|enroll|apply)\b/.test(value)) return 'C1';
  if (/\b(click|visit|download|subscribe|sign up|register|use the link|link in)\b/.test(value)) return 'C2';
  if (/\b(dm me|message me|email me|connect with me|reach out)\b/.test(value)) return 'C3';
  if (/\b(in your (?:team|work|process|company|operation)|where does your|what happens when)\b.*\?/.test(value)) return 'C5';
  if (/\?/.test(value)) return 'C6';
  if (/\b(follow|save|share|repost|tag|like)\b/.test(value)) return 'C7';
  return 'C0';
}

function observableFeatures(post) {
  const text = post.caption || '';
  const pb = problemFamily(text);
  const value = lower(text);
  const lines = text.split(/\n/).map((line) => line.trim());
  const substantiveLines = lines.filter(Boolean);
  const firstLine = substantiveLines[0] || '';
  const news = /\b(today|this week|just announced|new release|breaking|latest update|new law|new rule)\b/.test(value);
  const promotion = /\b(book a|buy|register|webinar|hiring|apply|launch|giveaway|free for \d+|limited time)\b/.test(value);
  const personalAuthority = /\b(i built|i tested|i learned|my journey|my team|my company|after \d+ years|i'm proud)\b/.test(value);
  const commentGate = primaryCta(text) === 'C4';
  return {
    automatedFeatureVersion: AUTOMATED_FEATURE_VERSION,
    hook: hookType(text),
    job: jobPromised(text, pb),
    proof: primaryProof(text),
    artifact: primaryArtifact(text),
    contentClass: contentClass(text, pb),
    problemFamily: pb,
    cta: primaryCta(text),
    nativeFormat: post.media?.nativeFormat || 'F0_unknown',
    usesNumber: /(?:\b\d+(?:[.,]\d+)?%?|[$€£]\s?\d+)/.test(text),
    usesQuestion: /\?/.test(text),
    operationalInputs: /\b(input|data required|you need|start with|assumption)\b/i.test(text),
    operationalSteps: /\b(step 1|steps|workflow|process|first.{0,20}then|1\.|①)\b/i.test(text),
    operationalOutput: /\b(output|deliverable|result|you get|creates?|produces?|decision)\b/i.test(text),
    operationalValidation: /\b(validate|check|reconcile|tolerance|test|verify|failure condition|source)\b/i.test(text),
    ddNews: news,
    ddPromotion: promotion,
    ddPersonalAuthority: personalAuthority,
    ddCommentGate: commentGate,
    ddEvergreen: !news && !promotion && !commentGate,
    captionChars: text.length,
    captionWords: (text.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu) || []).length,
    lineCount: lines.length,
    paragraphCount: text ? text.split(/\n\s*\n/).filter((part) => part.trim()).length : 0,
    bulletLineCount: substantiveLines.filter((line) => /^(?:[-*•▪◦]|\d+[.)]|[①-⑳])\s*/.test(line)).length,
    questionCount: (text.match(/\?/g) || []).length,
    firstLineChars: firstLine.length,
    firstLineHasQuestion: /\?/.test(firstLine),
    firstLineHasNumber: /(?:\d|[$€£%])/.test(firstLine),
    urlPresent: /https?:\/\/|\blnkd\.in\//i.test(text),
    numericExpressionPresent: /(?:\b\d+(?:[.,]\d+)?%?|[$€£]\s?\d+)/.test(text),
    sourceTermPresent: /\b(source|according to|study|report|survey|benchmark|official data|data shows|research)\b/i.test(text),
    artifactTermPresent: /\b(calculator|template|workbook|checklist|dashboard|decision tree|matrix|scorecard|guide|framework|playbook|formula|prompt|generator|sop)\b/i.test(text),
    endingQuestion: /\?\s*(?:[#\p{L}\p{N}_\s]*$)/u.test(text.trim()),
  };
}

function lowValueActivity(text) {
  const value = lower(text);
  const low = /\b(we're hiring|job opening|apply now|join our team|event|conference|webinar|booth|register now|company announcement|excited to announce|proud to announce|sponsored)\b/.test(value);
  const method = /\b(how to|framework|steps|checklist|data|analysis|lesson|decision|example|formula|workflow)\b/.test(value);
  return low && !method;
}

function sizeCell(followers) {
  if (!Number.isFinite(followers)) return 'unknown';
  if (followers >= 500 && followers <= 5000) return 'near_500_5k';
  if (followers > 5000 && followers <= 20000) return 'growing_5k_20k';
  if (followers > 20000) return 'established_20k_plus';
  return 'below_500';
}

function relevantToCohort(pb, cohort, text) {
  const allowed = {
    planning_logistics: new Set(['PB1', 'PB2', 'PB3', 'PB5']),
    purchasing_procurement: new Set(['PB4', 'PB5']),
    implementation_adjacent: new Set(['PB5', 'PB6', 'PB7', 'PB8']),
  }[cohort] || new Set();
  if (allowed.has(pb)) return true;
  const fit = {
    planning_logistics: /\b(supply chain|operations|planning|inventory|logistics|forecast|fulfil|fulfill)\b/i,
    purchasing_procurement: /\b(procurement|purchas|supplier|sourcing|spend|vendor|contract)\b/i,
    implementation_adjacent: /\b(ai|excel|power bi|erp|copilot|automation|lean|kaizen|process improvement|data)\b/i,
  }[cohort];
  return Boolean(fit?.test(text || ''));
}

function isoWeek(dateString) {
  const date = new Date(dateString);
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return `${target.getUTCFullYear()}-W${String(Math.ceil((((target - yearStart) / 86400000) + 1) / 7)).padStart(2, '0')}`;
}

function midrankPercentiles(rows) {
  const sorted = [...rows].sort((a, b) => a.publicInteractions - b.publicInteractions || a.canonicalPostId.localeCompare(b.canonicalPostId));
  let index = 0;
  while (index < sorted.length) {
    let end = index;
    while (end + 1 < sorted.length && sorted[end + 1].publicInteractions === sorted[index].publicInteractions) end += 1;
    const midrank = (index + end + 2) / 2;
    const percentile = (midrank - 0.5) / sorted.length;
    for (let cursor = index; cursor <= end; cursor += 1) sorted[cursor].creatorPercentile = percentile;
    index = end + 1;
  }
}

function addNormalizedOutcomes(rows) {
  const byCreator = new Map();
  for (const row of rows) {
    if (!byCreator.has(row.creatorId)) byCreator.set(row.creatorId, []);
    byCreator.get(row.creatorId).push(row);
  }
  for (const creatorRows of byCreator.values()) {
    const interactions = creatorRows.map((row) => row.publicInteractions).filter(Number.isFinite);
    const creatorMedian = median(interactions);
    for (const row of creatorRows) {
      row.creatorMedianInteractions = creatorMedian;
      row.responseRatio = Number.isFinite(row.publicInteractions) && Number.isFinite(creatorMedian) ? (1 + row.publicInteractions) / (1 + creatorMedian) : null;
      row.logResponseLift = Number.isFinite(row.publicInteractions) && Number.isFinite(creatorMedian) ? Math.log1p(row.publicInteractions) - Math.log1p(creatorMedian) : null;
    }
    midrankPercentiles(creatorRows.filter((row) => Number.isFinite(row.publicInteractions)));
  }
}

function matchControl(caseRow, candidates, track) {
  const windows = track === 'A'
    ? [
        ['AH1', 60, (row) => row.nativeFormat === caseRow.nativeFormat && row.contentClass === caseRow.contentClass && row.problemFamily === caseRow.problemFamily],
        ['AH2', 60, (row) => row.nativeFormat === caseRow.nativeFormat && row.contentClass === caseRow.contentClass],
        ['AH3', 120, (row) => row.nativeFormat === caseRow.nativeFormat],
      ]
    : [
        ['AH1', 120, (row) => row.nativeFormat === caseRow.nativeFormat && row.contentClass === caseRow.contentClass && row.problemFamily === caseRow.problemFamily],
        ['AH2', 120, (row) => row.nativeFormat === caseRow.nativeFormat && row.contentClass === caseRow.contentClass],
        ['AH3', 120, (row) => row.nativeFormat === caseRow.nativeFormat],
      ];
  for (const [grade, maxDays, predicate] of windows) {
    const matches = candidates
      .filter((row) => row.canonicalPostId !== caseRow.canonicalPostId && predicate(row))
      .map((row) => ({ row, gap: Math.abs(Date.parse(row.publishedAt) - Date.parse(caseRow.publishedAt)) / 86400000 }))
      .filter((entry) => entry.gap <= maxDays)
      .sort((a, b) => a.gap - b.gap || sha256(`${SEED}|${caseRow.canonicalPostId}|${a.row.canonicalPostId}`).localeCompare(sha256(`${SEED}|${caseRow.canonicalPostId}|${b.row.canonicalPostId}`)));
    if (matches.length) return { grade, controls: matches.slice(0, 2) };
  }
  return { grade: 'unmatched', controls: [] };
}

function bootstrapMedian(values, iterations = 3000) {
  if (!values.length) return [null, null];
  let seed = Number.parseInt(sha256(`${SEED}|${values.join('|')}`).slice(0, 8), 16) >>> 0;
  const random = () => {
    seed += 0x6D2B79F5;
    let value = seed;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
  const stats = [];
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const sample = Array.from({ length: values.length }, () => values[Math.floor(random() * values.length)]);
    stats.push(median(sample));
  }
  stats.sort((a, b) => a - b);
  return [stats[Math.floor(stats.length * 0.025)], stats[Math.floor(stats.length * 0.975)]];
}

const normalized = JSON.parse(await readFile(resolve(normalizedPath), 'utf8'));
const candidateRows = parseCsv(await readFile(resolve(creatorPoolPath), 'utf8'));
const identities = JSON.parse(await readFile(resolve(identityPath), 'utf8'));
const postsById = new Map(normalized.canonicalPosts.map((post) => [post.canonicalPostId, post]));

const profileGroups = new Map();
for (const profile of normalized.profiles) {
  const url = normalizeUrl(profile.profileUrl);
  if (!url) continue;
  if (!profileGroups.has(url)) profileGroups.set(url, []);
  profileGroups.get(url).push(profile);
}
const profileByUrl = new Map([...profileGroups.entries()].map(([url, rows]) => [url, rows.find((row) => Number.isFinite(row.followerCount)) || rows[0]]));

const activitiesByTarget = new Map();
for (const activity of normalized.activities) {
  const key = normalizeUrl(activity.targetKey || activity.targetUrl);
  if (!key) continue;
  if (!activitiesByTarget.has(key)) activitiesByTarget.set(key, []);
  activitiesByTarget.get(key).push(activity);
}

function historyForTarget(profileUrl) {
  const key = normalizeUrl(profileUrl);
  const activities = activitiesByTarget.get(key) || [];
  const seen = new Set();
  const rows = [];
  for (const activity of activities) {
    if (activity.activityKind !== 'original' || !activity.canonicalPostId || seen.has(activity.canonicalPostId)) continue;
    const post = postsById.get(activity.canonicalPostId);
    if (!post || !post.isCanonicalOriginal) continue;
    seen.add(activity.canonicalPostId);
    rows.push(post);
  }
  return rows;
}

const candidateDiagnostics = [];
for (const candidate of candidateRows) {
  const profileUrl = normalizeUrl(candidate.profile_url);
  const profile = profileByUrl.get(profileUrl);
  const history = historyForTarget(profileUrl);
  const fetchedActivities = activitiesByTarget.get(profileUrl) || [];
  const fetchedActivityTimes = fetchedActivities.map((activity) => Date.parse(activity.activityAt)).filter(Number.isFinite);
  const earliestFetchedActivityAt = fetchedActivityTimes.length ? new Date(Math.min(...fetchedActivityTimes)).toISOString() : null;
  const hitThirtyPostCap = fetchedActivities.length >= 30;
  const fixedWindow = history.filter((post) => {
    const timestamp = Date.parse(post.publishedAt);
    return timestamp >= WINDOW_START
      && timestamp < WINDOW_END_EXCLUSIVE
      && (post.outcomeMaturity === 'mature' || post.ageDays >= MATURITY_DAYS)
      && post.caption
      && post.outcomeComplete;
  });
  const english = fixedWindow.filter((post) => isEnglish(post.caption, profile?.primaryLanguage));
  const relevant = english.filter((post) => relevantToCohort(problemFamily(post.caption), candidate.cohort, post.caption));
  const lowValue = english.filter((post) => lowValueActivity(post.caption));
  const weeks = new Set(english.map((post) => isoWeek(post.publishedAt)));
  const followerCount = Number(profile?.followerCount);
  const normalizedSizeCell = sizeCell(followerCount);
  const mediaRate = english.length ? english.filter((post) => post.media?.observability === 'observed').length / english.length : 0;
  const englishShare = fixedWindow.length ? english.length / fixedWindow.length : 0;
  const relevantShare = english.length ? relevant.length / english.length : 0;
  const lowValueShare = english.length ? lowValue.length / english.length : 1;
  const profileResolved = Boolean(profile && Number.isFinite(followerCount));
  const thresholdPass = profileResolved
    && !['below_500', 'unknown'].includes(normalizedSizeCell)
    && english.length >= 20
    && weeks.size >= 8;
  const leftCensored = !thresholdPass
    && fetchedActivities.length > 0
    && hitThirtyPostCap
    && Number.isFinite(Math.min(...fetchedActivityTimes))
    && Math.min(...fetchedActivityTimes) > WINDOW_START;
  let coverageStatus = 'observed_fail';
  if (!profileResolved) coverageStatus = 'profile_unresolved';
  else if (fetchedActivities.length === 0) coverageStatus = 'missing_history';
  else if (thresholdPass) coverageStatus = 'confirmed_pass';
  else if (leftCensored) coverageStatus = 'left_censored';

  const thresholdReasons = [];
  if (!profileResolved) thresholdReasons.push('profile_unresolved');
  if (normalizedSizeCell === 'below_500' || normalizedSizeCell === 'unknown') thresholdReasons.push('outside_size_cells');
  if (english.length < 20) thresholdReasons.push('fewer_than_20_mature_originals_observed');
  if (weeks.size < 8) thresholdReasons.push('fewer_than_8_weeks_observed');
  const contentReviewFlags = [];
  if (englishShare < 0.8) contentReviewFlags.push('english_share_below_80pct');
  if (relevantShare < 0.5) contentReviewFlags.push('heuristic_subject_relevance_below_50pct');
  if (lowValueShare > 0.5) contentReviewFlags.push('heuristic_low_value_share_above_50pct');
  if (mediaRate < 0.8) contentReviewFlags.push('media_retrieval_below_80pct');
  candidateDiagnostics.push({
    candidateId: candidate.candidate_id,
    creator: candidate.creator,
    profileUrl,
    cohort: candidate.cohort,
    followerCount: Number.isFinite(followerCount) ? followerCount : null,
    normalizedSizeCell,
    rawOriginalHistoryCount: history.length,
    fetchedActivityCount: fetchedActivities.length,
    hitThirtyPostCap,
    earliestFetchedActivityAt,
    matureWindowCount: fixedWindow.length,
    eligibleOriginalCount: english.length,
    distinctWeeks: weeks.size,
    englishShare: round(englishShare),
    relevantShare: round(relevantShare),
    lowValueShare: round(lowValueShare),
    mediaRetrievalRate: round(mediaRate),
    coverageStatus,
    eligibilityStatus: coverageStatus === 'confirmed_pass' ? 'eligible' : 'not_confirmed',
    thresholdReason: thresholdReasons.join('|'),
    contentReviewStatus: contentReviewFlags.length ? 'manual_review_required' : 'no_heuristic_flag',
    contentReviewFlags: contentReviewFlags.join('|'),
    eligibilityNote: coverageStatus === 'left_censored'
      ? 'Thirty-activity retrieval cap ended after the window start; missing earlier history could change eligibility.'
      : coverageStatus === 'missing_history'
        ? 'Profile resolved but the post-history query returned no activities.'
        : coverageStatus === 'confirmed_pass'
          ? 'Mechanical cadence gate passed. Heuristic topic labels are diagnostics, not exclusion evidence.'
          : 'Observed history did not meet the frozen cadence gate and was not left-censored.',
    selectionHash: sha256(`${SEED}|${candidate.candidate_id}`),
    radarPanel: english.length >= 10 && weeks.size >= 4,
    decisionPanel: english.length >= 15 && weeks.size >= 6,
    strictPanel: coverageStatus === 'confirmed_pass',
    selectedTrackA: false,
  });
}

const quotas = { near_500_5k: 4, growing_5k_20k: 2, established_20k_plus: 2 };
for (const cohort of ['planning_logistics', 'purchasing_procurement', 'implementation_adjacent']) {
  for (const [cell, quota] of Object.entries(quotas)) {
    const eligible = candidateDiagnostics.filter((row) => row.cohort === cohort && row.normalizedSizeCell === cell && row.coverageStatus === 'confirmed_pass').sort((a, b) => a.selectionHash.localeCompare(b.selectionHash));
    eligible.slice(0, quota).forEach((row) => { row.selectedTrackA = true; });
  }
}

const selectedProfiles = new Set(candidateDiagnostics.filter((row) => row.selectedTrackA).map((row) => row.profileUrl));
const currentMarketPosts = [];
for (const creator of candidateDiagnostics.filter((row) => row.radarPanel)) {
  for (const post of historyForTarget(creator.profileUrl)) {
    const timestamp = Date.parse(post.publishedAt);
    if (timestamp < WINDOW_START || timestamp >= WINDOW_END_EXCLUSIVE || (post.outcomeMaturity !== 'mature' && post.ageDays < MATURITY_DAYS) || !post.caption || !post.outcomeComplete) continue;
    if (!isEnglish(post.caption, profileByUrl.get(creator.profileUrl)?.primaryLanguage)) continue;
    currentMarketPosts.push({
      canonicalPostId: post.canonicalPostId,
      canonicalUrl: post.canonicalUrl,
      creatorId: creator.candidateId,
      creator: creator.creator,
      creatorProfileUrl: creator.profileUrl,
      cohort: creator.cohort,
      sizeCell: creator.normalizedSizeCell,
      followerCount: creator.followerCount,
      publishedAt: post.publishedAt,
      publicInteractions: post.publicInteractions,
      radarPanel: creator.radarPanel,
      decisionPanel: creator.decisionPanel,
      strictPanel: creator.strictPanel,
      ...observableFeatures(post),
    });
  }
}
addNormalizedOutcomes(currentMarketPosts);
currentMarketPosts.forEach((row) => {
  row.heuristicSignalFlag = row.creatorPercentile >= 0.75 && row.responseRatio >= 1.5;
  row.strongestPanel = row.strictPanel ? 'strict' : row.decisionPanel ? 'decision' : 'radar';
});
const trackAPosts = [];
for (const creator of candidateDiagnostics.filter((row) => row.selectedTrackA)) {
  for (const post of historyForTarget(creator.profileUrl)) {
    const timestamp = Date.parse(post.publishedAt);
    if (timestamp < WINDOW_START || timestamp >= WINDOW_END_EXCLUSIVE || (post.outcomeMaturity !== 'mature' && post.ageDays < MATURITY_DAYS) || !post.caption || !post.outcomeComplete) continue;
    if (!isEnglish(post.caption, profileByUrl.get(creator.profileUrl)?.primaryLanguage)) continue;
    trackAPosts.push({
      canonicalPostId: post.canonicalPostId,
      canonicalUrl: post.canonicalUrl,
      creatorId: creator.candidateId,
      creator: creator.creator,
      creatorProfileUrl: creator.profileUrl,
      cohort: creator.cohort,
      sizeCell: creator.normalizedSizeCell,
      followerCount: creator.followerCount,
      publishedAt: post.publishedAt,
      postAgeDays: post.ageDays,
      reactionCount: post.reactionCount,
      commentCount: post.commentCount,
      repostCount: post.repostCount,
      publicInteractions: post.publicInteractions,
      ...observableFeatures(post),
    });
  }
}
addNormalizedOutcomes(trackAPosts);
trackAPosts.forEach((row) => { row.winnerFlag = row.creatorPercentile >= 0.75 && row.responseRatio >= 1.5; });

const tigerUrl = normalizeUrl('https://www.linkedin.com/in/shettys-desk');
const tigerPosts = historyForTarget(tigerUrl)
  .filter((post) => Date.parse(post.publishedAt) >= WINDOW_START && Date.parse(post.publishedAt) < WINDOW_END_EXCLUSIVE && (post.outcomeMaturity === 'mature' || post.ageDays >= MATURITY_DAYS) && post.caption && post.outcomeComplete)
  .map((post) => ({
    canonicalPostId: post.canonicalPostId,
    canonicalUrl: post.canonicalUrl,
    creatorId: 'TIGER',
    creator: 'Poornajith Shetty',
    creatorProfileUrl: tigerUrl,
    cohort: 'tiger',
    sizeCell: sizeCell(Number(profileByUrl.get(tigerUrl)?.followerCount)),
    followerCount: Number(profileByUrl.get(tigerUrl)?.followerCount) || null,
    publishedAt: post.publishedAt,
    postAgeDays: post.ageDays,
    reactionCount: post.reactionCount,
    commentCount: post.commentCount,
    repostCount: post.repostCount,
    publicInteractions: post.publicInteractions,
    ...observableFeatures(post),
  }));
addNormalizedOutcomes(tigerPosts);

const top100CaseMap = new Map();
for (const identity of identities) {
  const canonicalUrl = normalizeUrl(identity.exact_post_url);
  const activityId = activityIdFrom(canonicalUrl);
  if (!canonicalUrl || !activityId) continue;
  const post = postsById.get(`LI-${activityId}`);
  if (!post) continue;
  if (!top100CaseMap.has(post.canonicalPostId)) top100CaseMap.set(post.canonicalPostId, { post, identities: [] });
  top100CaseMap.get(post.canonicalPostId).identities.push(identity);
}

const top100Cases = [];
for (const { post, identities: caseIdentities } of top100CaseMap.values()) {
  const identity = caseIdentities[0];
  const authorProfileUrl = normalizeUrl(identity.actual_author_profile_url || post.authorProfileUrl);
  const baseline = historyForTarget(authorProfileUrl)
    .filter((candidate) => candidate.canonicalPostId !== post.canonicalPostId && candidate.caption && candidate.outcomeComplete && candidate.ageDays >= MATURITY_DAYS)
    .map((candidate) => ({
      canonicalPostId: candidate.canonicalPostId,
      canonicalUrl: candidate.canonicalUrl,
      creatorId: authorProfileUrl || post.authorPublicIdentifier || post.authorName,
      creator: post.authorName,
      publishedAt: candidate.publishedAt,
      publicInteractions: candidate.publicInteractions,
      ...observableFeatures(candidate),
    }));
  addNormalizedOutcomes(baseline);
  const caseFeatures = observableFeatures(post);
  const authorMedian = median(baseline.map((row) => row.publicInteractions));
  const caseRow = {
    canonicalPostId: post.canonicalPostId,
    canonicalUrl: post.canonicalUrl,
    referenceIds: caseIdentities.map((row) => row.reference_id).join('|'),
    creatorId: authorProfileUrl || post.authorPublicIdentifier || post.authorName,
    creator: post.authorName,
    creatorProfileUrl: authorProfileUrl,
    publishedAt: post.publishedAt,
    postAgeDays: post.ageDays,
    publicInteractions: post.publicInteractions,
    creatorBaselineN: baseline.length,
    creatorMedianInteractions: authorMedian,
    responseRatio: Number.isFinite(post.publicInteractions) && Number.isFinite(authorMedian) ? (1 + post.publicInteractions) / (1 + authorMedian) : null,
    logResponseLift: Number.isFinite(post.publicInteractions) && Number.isFinite(authorMedian) ? Math.log1p(post.publicInteractions) - Math.log1p(authorMedian) : null,
    maturityStatus: post.ageDays >= MATURITY_DAYS ? 'mature' : 'immature',
    quantitativeStatus: baseline.length >= 10 && post.ageDays >= MATURITY_DAYS && post.outcomeComplete ? 'quantitative' : 'descriptive_only',
    ...caseFeatures,
    __baseline: baseline,
  };
  top100Cases.push(caseRow);
}

const recoveredReferenceIds = new Set(
  top100Cases.flatMap((row) => String(row.referenceIds || '').split('|').filter(Boolean).map(Number)),
);
const top100Resolution = identities.map((identity) => {
  const activityId = activityIdFrom(normalizeUrl(identity.exact_post_url));
  const canonicalPostId = activityId ? `LI-${activityId}` : null;
  const recovered = recoveredReferenceIds.has(Number(identity.reference_id));
  return {
    referenceId: identity.reference_id,
    resolutionStatus: identity.resolution_status || null,
    confidence: identity.confidence || null,
    postingAuthor: identity.actual_posting_author || null,
    authorProfileUrl: normalizeUrl(identity.actual_author_profile_url),
    exactPostUrl: normalizeUrl(identity.exact_post_url),
    canonicalPostId,
    corpusStatus: recovered
      ? 'recovered'
      : identity.exact_post_url
        ? 'exact_url_not_recovered'
        : identity.resolution_status === 'unavailable'
          ? 'source_unavailable'
          : 'exact_url_unresolved',
    recoveryNote: recovered
      ? 'Canonical post and public outcomes are present in the normalized corpus.'
      : identity.exact_post_url
        ? 'Exact URL is known but the post Actor did not return the row; final retry was blocked by the account monthly usage hard limit.'
        : 'No exact permalink was available without guessing.',
  };
});

const trackAMatches = [];
for (const winner of trackAPosts.filter((row) => row.winnerFlag)) {
  const candidates = trackAPosts.filter((row) => row.creatorId === winner.creatorId && !row.winnerFlag);
  const match = matchControl(winner, candidates, 'A');
  for (const entry of match.controls) {
    trackAMatches.push({
      matchId: `MA-${sha256(`${winner.canonicalPostId}|${entry.row.canonicalPostId}`).slice(0, 12)}`,
      track: 'A', casePostId: winner.canonicalPostId, controlPostId: entry.row.canonicalPostId,
      creatorId: winner.creatorId, matchGrade: match.grade, dateGapDays: round(entry.gap, 1),
      caseLogLift: round(winner.logResponseLift), controlLogLift: round(entry.row.logResponseLift), outcomeDelta: round(winner.logResponseLift - entry.row.logResponseLift),
    });
  }
}

const trackBMatches = [];
for (const caseRow of top100Cases.filter((row) => row.quantitativeStatus === 'quantitative')) {
  const match = matchControl(caseRow, caseRow.__baseline, 'B');
  for (const entry of match.controls) {
    trackBMatches.push({
      matchId: `MB-${sha256(`${caseRow.canonicalPostId}|${entry.row.canonicalPostId}`).slice(0, 12)}`,
      track: 'B', casePostId: caseRow.canonicalPostId, controlPostId: entry.row.canonicalPostId,
      creatorId: caseRow.creatorId, caseReferenceIds: caseRow.referenceIds, matchGrade: match.grade, dateGapDays: round(entry.gap, 1),
      caseLogLift: round(caseRow.logResponseLift), controlLogLift: round(entry.row.logResponseLift), outcomeDelta: round(caseRow.logResponseLift - entry.row.logResponseLift),
    });
  }
}

const featureFields = ['hook', 'job', 'proof', 'artifact', 'contentClass', 'problemFamily', 'cta', 'nativeFormat'];
const mechanicEffects = [];
for (const field of featureFields) {
  const values = [...new Set(trackAPosts.map((row) => row[field]).filter(Boolean))].sort();
  for (const code of values) {
    const creatorEffects = [];
    const creators = [...new Set(trackAPosts.map((row) => row.creatorId))];
    for (const creatorId of creators) {
      const rows = trackAPosts.filter((row) => row.creatorId === creatorId);
      const present = rows.filter((row) => row[field] === code).map((row) => row.logResponseLift);
      const absent = rows.filter((row) => row[field] !== code).map((row) => row.logResponseLift);
      if (present.length >= 2 && absent.length >= 2) creatorEffects.push({ creatorId, effect: median(present) - median(absent), sizeCell: rows[0].sizeCell });
    }
    const presentRows = trackAPosts.filter((row) => row[field] === code);
    const effects = creatorEffects.map((row) => row.effect);
    const [ciLow, ciHigh] = bootstrapMedian(effects);
    const pairRows = [];
  for (const match of trackAMatches.filter((row) => ['AH1', 'AH2'].includes(row.matchGrade))) {
      const caseRow = trackAPosts.find((row) => row.canonicalPostId === match.casePostId);
      const controlRow = trackAPosts.find((row) => row.canonicalPostId === match.controlPostId);
      if (!caseRow || !controlRow || caseRow[field] === controlRow[field]) continue;
      pairRows.push(caseRow[field] === code ? 1 : controlRow[field] === code ? -1 : 0);
    }
    const discordant = pairRows.filter((value) => value !== 0);
    const positivePairShare = discordant.length ? discordant.filter((value) => value > 0).length / discordant.length : null;
    mechanicEffects.push({
      mechanicId: `${field}:${code}`,
      fieldName: field,
      codeValue: code,
      track: 'A',
      postN: presentRows.length,
      creatorN: new Set(presentRows.map((row) => row.creatorId)).size,
      sizeStrataN: new Set(presentRows.map((row) => row.sizeCell)).size,
      nearPeerCreatorN: new Set(presentRows.filter((row) => row.sizeCell === 'near_500_5k').map((row) => row.creatorId)).size,
      medianResponseRatio: round(median(presentRows.map((row) => row.responseRatio))),
      aboveCreatorMedianShare: round(mean(presentRows.map((row) => row.responseRatio > 1 ? 1 : 0))),
      creatorWeightedEffect: round(median(effects)),
      ciLow: round(ciLow),
      ciHigh: round(ciHigh),
      positiveCreatorShare: round(mean(effects.map((effect) => effect > 0 ? 1 : 0))),
      matchedPairN: discordant.length,
      positiveFeatureContrastShare: round(positivePairShare),
      trackAStatus: presentRows.length >= 8 && new Set(presentRows.map((row) => row.creatorId)).size >= 3 && new Set(presentRows.map((row) => row.sizeCell)).size >= 2 && presentRows.some((row) => row.sizeCell === 'near_500_5k') && median(presentRows.map((row) => row.responseRatio)) >= 1.35 && mean(presentRows.map((row) => row.responseRatio > 1 ? 1 : 0)) > 0.55 && discordant.length >= 5 && positivePairShare >= 0.60 ? 'heuristic_peer_signal' : 'not_observed',
    });
  }
}

const bMechanics = [];
for (const field of featureFields) {
  const codes = [...new Set(top100Cases.map((row) => row[field]).filter(Boolean))];
  for (const code of codes) {
    const pairSigns = [];
    const cases = new Set();
    const creators = new Set();
    for (const match of trackBMatches.filter((row) => ['AH1', 'AH2'].includes(row.matchGrade))) {
      const caseRow = top100Cases.find((row) => row.canonicalPostId === match.casePostId);
      const controlRow = caseRow?.__baseline.find((row) => row.canonicalPostId === match.controlPostId);
      if (!caseRow || !controlRow || caseRow[field] === controlRow[field]) continue;
      if (caseRow[field] === code) pairSigns.push(1);
      else if (controlRow[field] === code) pairSigns.push(-1);
      else continue;
      cases.add(caseRow.canonicalPostId);
      creators.add(caseRow.creatorId);
    }
    const positiveShare = pairSigns.length ? pairSigns.filter((value) => value > 0).length / pairSigns.length : null;
    bMechanics.push({
      mechanicId: `${field}:${code}`,
      fieldName: field,
      codeValue: code,
      track: 'B',
      uniqueCaseN: cases.size,
      creatorN: creators.size,
      matchedPairN: pairSigns.length,
      positiveFeatureContrastShare: round(positiveShare),
      trackBStatus: cases.size >= 5 && creators.size >= 3 && pairSigns.length >= 5 && positiveShare >= 0.60 ? 'heuristic_top100_signal' : 'not_observed',
    });
  }
}

const evidenceMatrix = [];
for (const effect of mechanicEffects) {
  const b = bMechanics.find((row) => row.mechanicId === effect.mechanicId);
  const nearRows = trackAPosts.filter((row) => row.sizeCell === 'near_500_5k');
  const nearPresent = nearRows.filter((row) => row[effect.fieldName] === effect.codeValue).map((row) => row.logResponseLift);
  const nearPositive = nearPresent.length >= 3 && median(nearPresent) > 0;
  const crossTrackSignal = effect.trackAStatus === 'heuristic_peer_signal' && b?.trackBStatus === 'heuristic_top100_signal' && nearPositive;
  evidenceMatrix.push({
    mechanicId: effect.mechanicId,
    trackAStatus: effect.trackAStatus,
    trackBStatus: b?.trackBStatus || 'not_observed',
    nearPeerStatus: nearPositive ? 'heuristic_positive' : 'not_observed',
    classification: crossTrackSignal ? 'cross_track_heuristic_signal' : effect.trackAStatus === 'heuristic_peer_signal' ? 'peer_heuristic_signal' : b?.trackBStatus === 'heuristic_top100_signal' ? 'top100_heuristic_signal' : 'unresolved',
    productionTreatment: crossTrackSignal ? 'prospective_test_only' : effect.trackAStatus === 'heuristic_peer_signal' ? 'consider_one_variable_peer_test' : b?.trackBStatus === 'heuristic_top100_signal' ? 'inspiration_or_one_variable_test' : 'do_not_standardize',
    limitation: 'Exploratory automated observable-feature screen after a failed reliability gate; observational public interactions; no reach, saves, or causal attribution.',
  });
}

const scoutMap = new Map();
const scoutSources = [
  ...currentMarketPosts.filter((row) => row.heuristicSignalFlag).map((row) => ({ ...row, source: 'current_market_signal', weight: row.strictPanel ? 2 : row.decisionPanel ? 1.5 : 1 })),
  ...top100Cases.filter((row) => row.quantitativeStatus === 'quantitative' && row.responseRatio >= 1.5).map((row) => ({ ...row, source: 'top100_signal', weight: 2 })),
  ...tigerPosts.filter((row) => row.responseRatio >= 1.5).map((row) => ({ ...row, source: 'tiger_signal', weight: 1 })),
];
for (const row of scoutSources) {
  const key = `${row.problemFamily}|${row.job}|${row.artifact}`;
  const current = scoutMap.get(key) || { problemFamily: row.problemFamily, job: row.job, artifact: row.artifact, sourcePosts: 0, creators: new Set(), radarSignals: 0, decisionSignals: 0, strictSignals: 0, top100Signals: 0, tigerSignals: 0, interactionLift: [] };
  current.sourcePosts += 1;
  current.creators.add(row.creatorId);
  if (row.source === 'current_market_signal') {
    current.radarSignals += 1;
    if (row.decisionPanel) current.decisionSignals += 1;
    if (row.strictPanel) current.strictSignals += 1;
  }
  if (row.source === 'top100_signal') current.top100Signals += 1;
  if (row.source === 'tiger_signal') current.tigerSignals += 1;
  if (Number.isFinite(row.responseRatio)) current.interactionLift.push(row.responseRatio);
  scoutMap.set(key, current);
}
const scoutQueue = [...scoutMap.values()].map((row) => {
  const publicProofPath = ['PB1', 'PB2', 'PB3', 'PB4', 'PB7', 'PB8'].includes(row.problemFamily) ? 'public_dataset_formula_or_standard' : 'documented_case_or_research';
  const artifactPath = ({ AR0: 'build_decision_reference', AR1: 'interactive_tool', AR2: 'downloadable_workbook', AR3: 'copyable_operating_asset', AR4: 'decision_reference', AR5: 'worked_example' })[row.artifact] || 'decision_reference';
  const independentLayers = [row.radarSignals > 0, row.top100Signals > 0, row.tigerSignals > 0].filter(Boolean).length;
  const screenA = row.creators.size >= 2 && row.sourcePosts >= 2 && independentLayers >= 2;
  return {
    scoutId: `SQ-${sha256(`${row.problemFamily}|${row.job}|${row.artifact}`).slice(0, 10)}`,
    problemFamily: row.problemFamily,
    job: row.job,
    artifact: row.artifact,
    sourcePosts: row.sourcePosts,
    creatorN: row.creators.size,
    radarSignals: row.radarSignals,
    decisionSignals: row.decisionSignals,
    strictSignals: row.strictSignals,
    trackASignals: row.strictSignals,
    top100Signals: row.top100Signals,
    tigerSignals: row.tigerSignals,
    independentEvidenceLayers: independentLayers,
    medianResponseRatio: round(median(row.interactionLift)),
    publicProofPath,
    artifactPath,
    validationCheck: 'worked_example_plus_reconciliation_or_failure_condition',
    screeningTier: screenA ? 'screen_A' : 'screen_B',
    screeningStatus: 'exploratory_only_failed_reliability_gate',
  };
}).sort((a, b) => a.screeningTier.localeCompare(b.screeningTier) || b.creatorN - a.creatorN || b.sourcePosts - a.sourcePosts);

const blindPool = [
  ...trackAPosts.map((row) => ({ ...row, blindSource: 'track_a' })),
  ...tigerPosts.map((row) => ({ ...row, blindSource: 'tiger' })),
  ...top100Cases.map((row) => ({ ...row, blindSource: 'top100' })),
];
const uniqueBlind = [...new Map(blindPool.map((row) => [row.canonicalPostId, row])).values()]
  .sort((a, b) => sha256(`${SEED}|blind|${a.canonicalPostId}`).localeCompare(sha256(`${SEED}|blind|${b.canonicalPostId}`)));
const blindQuotas = { track_a: 10, tiger: 9, top100: 9 };
const blindSample = [];
for (const [source, count] of Object.entries(blindQuotas)) blindSample.push(...uniqueBlind.filter((row) => row.blindSource === source).slice(0, count));
blindSample.sort((a, b) => sha256(`${SEED}|order|${a.canonicalPostId}`).localeCompare(sha256(`${SEED}|order|${b.canonicalPostId}`)));
const blindItems = blindSample.map((row, index) => ({
  blindPostId: `BP-${sha256(`${SEED}|${row.canonicalPostId}`).slice(0, 12)}`,
  passId: index < 16 ? 'calibration' : 'holdout',
  caption: postsById.get(row.canonicalPostId)?.caption || null,
  mediaSummary: row.nativeFormat || 'F0_unknown',
  codingInstruction: 'Code with linkedin-v4-stage0-codebook-v1.md. Outcomes, creator, track, follower count, and case status are hidden.',
}));

const out = resolve(outputDir);
await mkdir(resolve(out, '02-normalized'), { recursive: true });
await mkdir(resolve(out, '03-blind'), { recursive: true });
await mkdir(resolve(out, '04-analysis'), { recursive: true });

await writeCsv(resolve(out, '02-normalized', 'creator-eligibility.csv'), candidateDiagnostics);
await writeCsv(resolve(out, '02-normalized', 'top100-resolution.csv'), top100Resolution);
await writeCsv(resolve(out, '04-analysis', 'current-market-posts.csv'), currentMarketPosts);
await writeCsv(resolve(out, '04-analysis', 'track-a-posts.csv'), trackAPosts);
await writeCsv(resolve(out, '04-analysis', 'tiger-public-posts.csv'), tigerPosts);
await writeCsv(resolve(out, '04-analysis', 'top100-cases.csv'), top100Cases.map(({ __baseline, ...row }) => row));
await writeCsv(resolve(out, '04-analysis', 'matched-controls.csv'), [...trackAMatches, ...trackBMatches]);
await writeCsv(resolve(out, '04-analysis', 'mechanic-effects.csv'), [...mechanicEffects, ...bMechanics]);
await writeCsv(resolve(out, '04-analysis', 'evidence-matrix.csv'), evidenceMatrix);
await writeCsv(resolve(out, '04-analysis', 'scout-queue.csv'), scoutQueue);
await writeFile(resolve(out, '03-blind', 'coding-items.json'), `${JSON.stringify(blindItems, null, 2)}\n`);

const summary = {
  generatedAt: new Date().toISOString(),
  method: 'Automated Observable Feature Analysis plus within-creator normalization; the separate reliability pass completed and failed, so meaning-heavy codes remain exploratory.',
  automatedFeatureVersion: AUTOMATED_FEATURE_VERSION,
  counts: {
    candidateCreators: candidateDiagnostics.length,
    eligibleCreators: candidateDiagnostics.filter((row) => row.eligibilityStatus === 'eligible').length,
    confirmedPassCreators: candidateDiagnostics.filter((row) => row.coverageStatus === 'confirmed_pass').length,
    leftCensoredCreators: candidateDiagnostics.filter((row) => row.coverageStatus === 'left_censored').length,
    observedFailCreators: candidateDiagnostics.filter((row) => row.coverageStatus === 'observed_fail').length,
    missingHistoryCreators: candidateDiagnostics.filter((row) => row.coverageStatus === 'missing_history').length,
    radarPanelCreators: candidateDiagnostics.filter((row) => row.radarPanel).length,
    radarPanelPosts: currentMarketPosts.filter((row) => row.radarPanel).length,
    decisionPanelCreators: candidateDiagnostics.filter((row) => row.decisionPanel).length,
    decisionPanelPosts: currentMarketPosts.filter((row) => row.decisionPanel).length,
    strictPanelCreators: candidateDiagnostics.filter((row) => row.strictPanel).length,
    strictPanelPosts: currentMarketPosts.filter((row) => row.strictPanel).length,
    selectedTrackACreators: candidateDiagnostics.filter((row) => row.selectedTrackA).length,
    selectedNearPeers: candidateDiagnostics.filter((row) => row.selectedTrackA && row.normalizedSizeCell === 'near_500_5k').length,
    selectedGrowing: candidateDiagnostics.filter((row) => row.selectedTrackA && row.normalizedSizeCell === 'growing_5k_20k').length,
    selectedEstablished: candidateDiagnostics.filter((row) => row.selectedTrackA && row.normalizedSizeCell === 'established_20k_plus').length,
    trackAPosts: trackAPosts.length,
    trackAWinners: trackAPosts.filter((row) => row.winnerFlag).length,
    tigerMaturePosts: tigerPosts.length,
    top100RecoveredReferences: recoveredReferenceIds.size,
    top100RecoveredUniqueCases: top100Cases.length,
    top100MissingReferences: top100Resolution.filter((row) => row.corpusStatus !== 'recovered').length,
    top100KnownUrlsNotRecovered: top100Resolution.filter((row) => row.corpusStatus === 'exact_url_not_recovered').length,
    top100QuantitativeCases: top100Cases.filter((row) => row.quantitativeStatus === 'quantitative').length,
    trackAMatches: trackAMatches.length,
    trackBMatches: trackBMatches.length,
    crossTrackHeuristicSignals: evidenceMatrix.filter((row) => row.classification === 'cross_track_heuristic_signal').length,
    screenACombinations: scoutQueue.filter((row) => row.screeningTier === 'screen_A').length,
  },
  trackAFeasibility: {
    frozenTargetCreators: 24,
    confirmedPassCreators: candidateDiagnostics.filter((row) => row.coverageStatus === 'confirmed_pass').length,
    maximumPossibleQuotaFillFromCurrentPool: ['planning_logistics', 'purchasing_procurement', 'implementation_adjacent']
      .flatMap((cohort) => Object.entries(quotas).map(([cell, quota]) => Math.min(
        quota,
        candidateDiagnostics.filter((row) => row.cohort === cohort
          && row.normalizedSizeCell === cell
          && ['confirmed_pass', 'left_censored', 'missing_history'].includes(row.coverageStatus)).length,
      )))
      .reduce((sum, value) => sum + value, 0),
    conclusion: 'The frozen 12-near, 6-growing, 6-established design is infeasible with this candidate pool and a 30-activity retrieval cap. Do not backfill by lowering the gates or relabel left-censored histories as failures.',
  },
  selectedCreators: candidateDiagnostics.filter((row) => row.selectedTrackA).map((row) => ({ candidateId: row.candidateId, creator: row.creator, cohort: row.cohort, sizeCell: row.normalizedSizeCell, eligiblePosts: row.eligibleOriginalCount })),
  heuristicEvidenceSignals: evidenceMatrix.filter((row) => row.classification !== 'unresolved').slice(0, 20),
  exploratoryScoutRows: scoutQueue.slice(0, 20),
  limitations: [
    'Public interactions are not impressions, reach, saves, followers gained, clicks, downloads, leads, or revenue.',
    'The reliability pass completed and failed; automated meaning-heavy codes remain exploratory screening labels.',
    'Thirty-activity retrieval caps left-censor some creator histories; these records are unresolved rather than failed.',
    'Top-100 is a curated-success sample; unresolved and old cases remain descriptive.',
    'A final exact-URL recovery attempt was blocked by the Apify account monthly usage hard limit after $5.066 of recorded study spend across 31 Actor executions.',
    'Current follower counts are used only for strata, never as historical engagement denominators.',
    'Causal claims are prohibited; outputs nominate V4 tests rather than universal rules.',
  ],
};
await writeFile(resolve(out, '04-analysis', 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);

console.log(JSON.stringify(summary, null, 2));
