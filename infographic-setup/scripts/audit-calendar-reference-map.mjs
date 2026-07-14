#!/usr/bin/env node
import { readFileSync } from 'fs';
import { resolve } from 'path';

const mapPath = process.argv[2] || 'references/calendar-reference-adaptation-map-v1.md';
const expectedCount = Number(process.env.EXPECTED_TOPIC_COUNT || 40);
const root = resolve(process.cwd());
const markdown = readFileSync(resolve(root, mapPath), 'utf8');

const allowedJobs = new Set([
  'Avoid a mistake',
  'Make a better decision',
  'Save time',
  'Explain clearly',
  'Look sharper at work',
]);

const artifactRe = /\b(test|checklist|formula|map|prompt|template|rule|card|tree|grid|table|reference|profile|dashboard|audit|tracker|calendar|curve|ranking|question set|explainer|narrative|list)\b/i;
const formatRe = /\b(PF[1-8]|Process flow|Concept metaphor)\b/i;

let section = '';
const rows = [];

for (const line of markdown.split('\n')) {
  const heading = line.match(/^## (RW\d+ .*)$/);
  if (heading) {
    section = heading[1].trim();
    continue;
  }

  if (!line.startsWith('|') || line.includes('---') || line.includes('| Post | Audience job |')) {
    continue;
  }

  const cols = line.split('|').slice(1, -1).map((col) => col.trim());
  if (cols.length !== 7) continue;

  rows.push({
    section,
    post: cols[0].replace(/`/g, ''),
    audienceJob: cols[1],
    promise: cols[2],
    powerFormat: cols[3],
    captionPattern: cols[4],
    saveTrigger: cols[5],
    visualArgument: cols[6],
  });
}

const failures = [];
const formatCounts = new Map();
const sectionCounts = new Map();

function wordCount(value) {
  return value.split(/\s+/).filter(Boolean).length;
}

for (const row of rows) {
  sectionCounts.set(row.section, (sectionCounts.get(row.section) || 0) + 1);
  formatCounts.set(row.powerFormat, (formatCounts.get(row.powerFormat) || 0) + 1);

  if (!row.section) failures.push([row.post, 'missing RW section']);
  if (!row.post) failures.push([row.post || '(blank)', 'missing post name']);
  if (!allowedJobs.has(row.audienceJob)) failures.push([row.post, `unexpected audience job: ${row.audienceJob}`]);
  if (wordCount(row.promise) < 5) failures.push([row.post, 'reference-proven promise is too thin']);
  if (!formatRe.test(row.powerFormat)) failures.push([row.post, `unrecognized power format: ${row.powerFormat}`]);
  if (wordCount(row.captionPattern) < 2) failures.push([row.post, 'caption pattern is too thin']);
  if (!artifactRe.test(row.saveTrigger)) failures.push([row.post, `save trigger lacks artifact language: ${row.saveTrigger}`]);
  if (wordCount(row.visualArgument) < 6) failures.push([row.post, 'visual argument is too thin']);
}

console.log(`Calendar reference rows: ${rows.length}`);
console.log(`Expected rows: ${expectedCount}`);
console.log('');

console.log('Rows by section:');
for (const [name, count] of sectionCounts) {
  console.log(`- ${name}: ${count}`);
}

console.log('');
console.log('Power format usage:');
for (const [format, count] of [...formatCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`- ${format}: ${count}`);
}

if (rows.length !== expectedCount) {
  failures.push(['calendar', `expected ${expectedCount} topic rows, found ${rows.length}`]);
}

for (const [name, count] of sectionCounts) {
  if (count !== 4) failures.push([name, `expected 4 topics, found ${count}`]);
}

if (failures.length) {
  console.error('');
  console.error('Calendar reference audit failed:');
  for (const [post, issue] of failures) {
    console.error(`- ${post}: ${issue}`);
  }
  process.exit(1);
}

console.log('');
console.log('Calendar reference audit passed.');
