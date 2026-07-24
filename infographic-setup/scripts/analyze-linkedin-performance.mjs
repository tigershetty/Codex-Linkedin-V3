#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const cwd = resolve(process.cwd());
const defaultPath = existsSync(resolve(cwd, 'infographic-setup', 'data', 'analytics-log.csv'))
  ? resolve(cwd, 'infographic-setup', 'data', 'analytics-log.csv')
  : resolve(cwd, 'data', 'analytics-log.csv');
const csvPath = resolve(process.argv[2] || defaultPath);

if (!existsSync(csvPath)) {
  console.error('Analytics CSV not found: ' + csvPath);
  process.exit(1);
}

const parseCsv = (text) => {
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
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
};

const rows = parseCsv(readFileSync(csvPath, 'utf8')).filter((row) => row.some(Boolean));
const headers = rows.shift();
const number = (value) => Number(value || 0);
const posts = rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])))
  .map((post) => ({
    ...post,
    impressions: number(post.impressions),
    reactions: number(post.reactions),
    comments: number(post.comments),
    reposts: number(post.reposts),
    saves: number(post.saves),
    followers_gained: number(post.followers_gained),
    interactions: number(post.reactions) + number(post.comments) + number(post.reposts) + number(post.saves),
  }))
  .sort((a, b) => b.post_date.localeCompare(a.post_date));

const median = (values) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const format = (value) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
const summarize = (label, cohort) => ({
  label,
  count: cohort.length,
  impressions: median(cohort.map((post) => post.impressions)),
  interactions: median(cohort.map((post) => post.interactions)),
  low: cohort.filter((post) => post.interactions <= 10).length,
});

const cohorts = [
  summarize('All logged posts', posts),
  summarize('Last 10 posts', posts.slice(0, 10)),
  summarize('Since 2026-05-25', posts.filter((post) => post.post_date >= '2026-05-25')),
  summarize('March-April 2026', posts.filter((post) => post.post_date >= '2026-03-01' && post.post_date <= '2026-04-30')),
  summarize('Deep dives', posts.filter((post) => post.content_type === 'deep-dive')),
  summarize('Tagged Supply Chain 101', posts.filter((post) => post.content_type === '101')),
];

console.log('| Cohort | Posts | Median impressions | Median interactions | <=10 interactions |');
console.log('|---|---:|---:|---:|---:|');
for (const cohort of cohorts) {
  console.log(`| ${cohort.label} | ${cohort.count} | ${format(cohort.impressions)} | ${format(cohort.interactions)} | ${cohort.low}/${cohort.count} |`);
}

const totalImpressions = posts.reduce((sum, post) => sum + post.impressions, 0);
const totalInteractions = posts.reduce((sum, post) => sum + post.interactions, 0);
console.log('\n| Top posts | Impression share | Interaction share |');
console.log('|---:|---:|---:|');
for (const count of [1, 3, 5, 10]) {
  const top = [...posts].sort((a, b) => b.impressions - a.impressions).slice(0, count);
  const impressionShare = top.reduce((sum, post) => sum + post.impressions, 0) / totalImpressions * 100;
  const interactionShare = top.reduce((sum, post) => sum + post.interactions, 0) / totalInteractions * 100;
  console.log(`| ${count} | ${format(impressionShare)}% | ${format(interactionShare)}% |`);
}

console.log('\n| Date | Slug | Impressions | Interactions | Saves | Followers |');
console.log('|---|---|---:|---:|---:|---:|');
for (const post of [...posts].sort((a, b) => b.impressions - a.impressions).slice(0, 10)) {
  console.log(`| ${post.post_date} | ${post.slug} | ${format(post.impressions)} | ${format(post.interactions)} | ${format(post.saves)} | ${format(post.followers_gained)} |`);
}

