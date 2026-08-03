#!/usr/bin/env node

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const folder = process.argv[2];

if (!folder) {
  console.error('Usage: node scripts/audit-fast-post.mjs data/{week}/{slug}');
  process.exit(2);
}

const root = resolve(process.cwd());
const dir = resolve(root, folder);
const postCardPath = join(dir, 'post-card.md');

const FLAGSHIP_MARKERS = [
  'reference-query.json',
  'reference-candidates.json',
  'reference-bundle.json',
  'recombination-brief.md',
  'creative-brief-lite.md',
  'content-brief-v2.md',
  'creative-packet.md',
  'creative-readiness-review.md',
  'visual-comparison.md',
  'directions',
  'calculator',
];

function plain(value) {
  return String(value ?? '').replace(/[\u0060"']/g, '').trim();
}

function field(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`^\\*\\*${escaped}:?\\*\\*\\s*(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

function blockField(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const heading = new RegExp(`^\\*\\*${escaped}:?\\*\\*[ \\t]*`, 'm');
  const match = heading.exec(markdown);
  if (!match) return '';
  const remaining = markdown.slice(match.index + match[0].length);
  const nextField = remaining.search(/\n(?=\*\*[^*\n]+\*\*|#)/);
  return (nextField === -1 ? remaining : remaining.slice(0, nextField)).trim();
}

function safeRelativePath(value) {
  const candidate = plain(value);
  if (!candidate || /^(https?:)?\/\//i.test(candidate)) return '';
  const absolute = resolve(dir, candidate);
  const relation = relative(dir, absolute);
  if (!relation || relation === '..' || relation.startsWith('../')) return '';
  return relation;
}

function parseTimestamp(value) {
  const text = plain(value);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(text)) {
    return null;
  }
  const timestamp = Date.parse(text);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function parseRenderPaths(value) {
  return plain(value)
    .split(/[;,\n]+/)
    .map((item) => safeRelativePath(item.replace(/^[-*]\s*/, '')))
    .filter(Boolean);
}

function activePngs(currentDir = dir, prefix = '') {
  if (!existsSync(currentDir)) return [];
  const ignoredDirectories = new Set(['_archive', 'qa']);
  return readdirSync(currentDir, { withFileTypes: true })
    .flatMap((entry) => {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        return ignoredDirectories.has(entry.name) ? [] : activePngs(join(currentDir, entry.name), path);
      }
      return entry.isFile() && extname(entry.name).toLowerCase() === '.png' ? [path] : [];
    })
    .sort();
}

function routeIds(value) {
  const matches = value.matchAll(/(?:^|[\n;])\s*(?:route\s+)?([A-Z])\s*(?=[:.)—-])/gim);
  return [...matches].map((match) => match[1].toUpperCase());
}

function addCheck(checks, name, pass, fix) {
  checks.push({ name, pass: Boolean(pass), fix });
}

if (!existsSync(postCardPath)) {
  console.error('FAIL standard post card exists');
  console.error('     Add post-card.md before running the Fast Post route-lock audit.');
  process.exit(1);
}

const card = readFileSync(postCardPath, 'utf8');
const route = plain(field(card, 'Route'));
const startedAt = parseTimestamp(field(card, 'Started at'));
const selectedAt = parseTimestamp(field(card, 'Selected at'));
const renderBudgetText = plain(field(card, 'Render budget'));
const renderBudget = /^\d+$/.test(renderBudgetText) ? Number.parseInt(renderBudgetText, 10) : null;
const declaredRenderPaths = parseRenderPaths(field(card, 'Render paths'));
const activeVisual = safeRelativePath(field(card, 'Active visual'));
const roughRoutes = blockField(card, 'Three rough routes');
const roughRouteIds = routeIds(roughRoutes);
const uniqueRouteIds = [...new Set(roughRouteIds)];
const actualPngs = activePngs();
const flaggedMarkers = FLAGSHIP_MARKERS.filter((marker) => existsSync(join(dir, marker)));
const selectedWithinThirtyMinutes = startedAt !== null
  && selectedAt !== null
  && selectedAt >= startedAt
  && selectedAt - startedAt <= 30 * 60 * 1000;
const declaredRenderFilesExist = declaredRenderPaths.length > 0
  && declaredRenderPaths.every((path) => {
    const fullPath = join(dir, path);
    return existsSync(fullPath) && statSync(fullPath).isFile() && statSync(fullPath).size > 0;
  });
const listedRenderPngs = new Set(declaredRenderPaths);
const untrackedPngs = actualPngs.filter((path) => !listedRenderPngs.has(path));
const checks = [];

addCheck(
  checks,
  'route lock metadata is complete',
  Boolean(route && startedAt !== null && selectedAt !== null && renderBudget !== null && declaredRenderPaths.length),
  'Add Route, Started at, Selected at, Render budget, and Render paths to post-card.md.',
);
addCheck(
  checks,
  'route lock declares a standard post',
  /^standard(?:\s+fast\s+post)?$/i.test(route),
  'Set Route to standard or standard fast post. Flagship work needs its own declared package.',
);
addCheck(
  checks,
  'selected route was chosen within 30 minutes',
  selectedWithinThirtyMinutes,
  'Use ISO timestamps and select or park within 30 minutes of Started at.',
);
addCheck(
  checks,
  'rough routes are named and capped at three',
  roughRouteIds.length > 0 && roughRouteIds.length <= 3 && uniqueRouteIds.length === roughRouteIds.length,
  'Use one to three named routes (A:, B:, C:) in Three rough routes; four or more routes require a flagship.',
);
addCheck(
  checks,
  'render budget is one or two',
  Number.isInteger(renderBudget) && renderBudget >= 1 && renderBudget <= 2,
  'Set Render budget to 1 or 2. A third render is a new direction, not a standard-post revision.',
);
addCheck(
  checks,
  'render paths resolve and include the active visual',
  declaredRenderFilesExist && Boolean(activeVisual) && declaredRenderPaths.includes(activeVisual),
  'List every local render in Render paths and include the Active visual.',
);
addCheck(
  checks,
  'actual render count stays within budget',
  actualPngs.length > 0
    && actualPngs.length <= 2
    && actualPngs.length <= (renderBudget ?? 0)
    && untrackedPngs.length === 0,
  'Keep at most two non-archived PNG renders, list each in Render paths, and stay within Render budget.',
);
addCheck(
  checks,
  'standard package has no co-located active flagship markers',
  flaggedMarkers.length === 0,
  `Move or archive active flagship files before using the standard route: ${flaggedMarkers.join(', ') || 'none'}.`,
);

let failures = 0;
for (const check of checks) {
  if (check.pass) {
    console.log(`PASS ${check.name}`);
  } else {
    failures += 1;
    console.log(`FAIL ${check.name}`);
    console.log(`     ${check.fix}`);
  }
}

if (failures) {
  console.error(`\n${failures} Fast Post route-lock check(s) failed.`);
  process.exit(1);
}

console.log('\nFast Post route-lock audit passed. This is not publication approval; Tiger approval is still required.');
