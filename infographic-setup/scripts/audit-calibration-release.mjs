#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { readReviewLedger, reviewCompleteness } from './lib/reference-review.mjs';

const folder = process.argv[2];
if (!folder) {
  console.error('Usage: node scripts/audit-calibration-release.mjs data/{week}/{slug}');
  process.exit(2);
}

const postDir = resolve(process.cwd(), folder);
const reviewPath = join(postDir, 'calibration-review.md');
const postCardPath = join(postDir, 'post-card.md');
const checks = [];
const add = (name, pass, fix) => checks.push({ name, pass, fix });
const field = (markdown, label) => markdown.match(new RegExp(`^\\*\\*${label.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}:?\\*\\*\\s*(.*)$`, 'm'))?.[1]?.trim() ?? '';
const filled = (value) => Boolean(value && !/^(todo|tbd|pending|not declared)$/i.test(value));

const foundation = reviewCompleteness(readReviewLedger());
add('creative review foundation is complete', foundation.valid, foundation.errors.join(' ') || 'Complete the reference-review foundation first.');
add('post card exists', existsSync(postCardPath), 'Add the selected post-card.md.');
add('calibration review exists', existsSync(reviewPath), 'Copy templates/calibration-review-template.md to calibration-review.md.');

if (existsSync(reviewPath)) {
  const review = readFileSync(reviewPath, 'utf8');
  for (const label of ['Content ID', 'Three routes reviewed', 'Selected route', 'Active visual', 'Active caption', 'Claim/evidence record', '24h audience relevance sample', 'Transfer decision', 'Five-post cadence decision']) {
    add(`${label} is recorded`, filled(field(review, label)), `Record ${label} in calibration-review.md.`);
  }
  add('cadence decision is explicit', /^(resume|hold)$/i.test(field(review, 'Five-post cadence decision')), 'Set Five-post cadence decision to resume or hold.');
}

let failures = 0;
for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} ${check.name}`);
  if (!check.pass) {
    failures += 1;
    console.log(`     ${check.fix}`);
  }
}
if (failures) process.exit(1);
console.log('V4 calibration release audit passed. Tiger approval and manual publish remain required.');
