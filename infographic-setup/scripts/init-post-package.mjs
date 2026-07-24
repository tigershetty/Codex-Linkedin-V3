#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, sep } from 'path';

const input = process.argv[2];
const seriesFlagIndex = process.argv.indexOf('--series');
const seriesFlag = seriesFlagIndex >= 0 ? process.argv[seriesFlagIndex + 1] : null;
const resourceRequired = process.argv.includes('--resource-required');
const dryRun = process.argv.includes('--dry-run');

const seriesNames = {
  'ai-for-sc': 'AI for Supply Chain',
  sc101: 'Supply Chain 101',
};

if (!input || !seriesFlag || !seriesNames[seriesFlag]) {
  console.error('Usage: node scripts/init-post-package.mjs data/{YYYY-W##}/{slug} --series ai-for-sc|sc101 [--resource-required] [--dry-run]');
  process.exit(2);
}

const cwd = resolve(process.cwd());
const root = existsSync(resolve(cwd, 'infographic-setup', 'data'))
  ? resolve(cwd, 'infographic-setup')
  : cwd;
const normalizedInput = input.replace(/^infographic-setup\//, '');
const match = normalizedInput.match(/^data\/(\d{4}-W\d{2})\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);

if (!match) {
  console.error('Post path must match data/{YYYY-W##}/{lowercase-kebab-slug}.');
  process.exit(2);
}

const [, week, slug] = match;
const dataRoot = resolve(root, 'data');
const postDir = resolve(root, normalizedInput);

if (!postDir.startsWith(dataRoot + sep)) {
  console.error('Post folder must be inside infographic-setup/data/.');
  process.exit(2);
}

const series = seriesNames[seriesFlag];
const templateDir = resolve(root, 'templates');
const replacements = {
  '{YYYY-W##}': week,
  '{slug}': slug,
  '{series}': series,
  '{selected_hook}': '',
  '{caption}': '',
  '{shorter_caption}': '',
  '{word_count}': '0',
};

const renderTemplate = (templateName) => {
  let content = readFileSync(resolve(templateDir, templateName), 'utf8');
  for (const [token, value] of Object.entries(replacements)) {
    content = content.replaceAll(token, value);
  }
  return content;
};

const files = [
  ['content-brief-v2-template.md', 'content-brief-v2.md'],
  ['creative-brief-lite-template.md', 'creative-brief-lite.md'],
  ['linkedin-caption-holy-grail-template.md', 'linkedin-caption.md'],
  ['resource-plan-template.md', 'resource-plan.md'],
  ['post-performance-learning-template.md', 'post-performance-learning.md'],
];

const plannedFiles = files.map(([, destination]) => destination).concat('publish-manifest.json');
const existingFiles = plannedFiles.filter((name) => existsSync(resolve(postDir, name)));
const renderedFiles = files.map(([templateName, destination]) => [destination, renderTemplate(templateName)]);
const manifest = JSON.parse(renderTemplate('publish-manifest-template.json'));
manifest.resource.required = resourceRequired;
manifest.resource.decision = resourceRequired ? 'required' : 'pending';

if (existingFiles.length) {
  console.error('Refusing to overwrite existing post-package files:');
  for (const name of existingFiles) console.error('  - ' + name);
  process.exit(1);
}

if (dryRun) {
  console.log('DRY RUN Post package would be initialized at ' + postDir);
  for (const name of plannedFiles) console.log('  + ' + name);
  console.log('Series: ' + series);
  console.log('Resource required: ' + (resourceRequired ? 'yes' : 'no'));
  process.exit(0);
}

mkdirSync(postDir, { recursive: true });

for (const [destination, content] of renderedFiles) {
  writeFileSync(resolve(postDir, destination), content);
}

writeFileSync(resolve(postDir, 'publish-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log('Initialized post-first package at ' + postDir);
for (const name of plannedFiles) console.log('  + ' + name);
console.log('Series: ' + series);
console.log('Resource required: ' + (resourceRequired ? 'yes' : 'no'));
console.log('Website status: hold');
