#!/usr/bin/env node

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { dirname, basename, join, relative, resolve, sep } from 'path';
import { fileURLToPath } from 'url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const infographicDir = resolve(scriptDir, '..');
const repoDir = resolve(infographicDir, '..');
const dataDir = join(infographicDir, 'data');
const templatesDir = join(infographicDir, 'templates');
const cliArgs = process.argv.slice(2);
const dryRun = cliArgs.includes('--dry-run');
const input = cliArgs.find((arg) => !arg.startsWith('--'));

if (!input) {
  console.error('Usage: node scripts/init-motion-project.mjs data/{week}/{slug} [--dry-run]');
  process.exit(1);
}

const postDir = resolve(infographicDir, input.replace(/^infographic-setup\//, ''));
if (!postDir.startsWith(dataDir + sep)) {
  console.error('Post folder must be inside infographic-setup/data/.');
  process.exit(1);
}

function selectedVisualPath() {
  const postCardPath = join(postDir, 'post-card.md');
  if (!existsSync(postCardPath)) return join(postDir, 'visual.png');
  const card = readFileSync(postCardPath, 'utf8');
  const match = card.match(/^\*\*Active visual:?\*\*\s*(.*)$/m);
  const candidate = match?.[1]?.replace(/`/g, '').trim();
  if (!candidate) {
    console.error(`Active visual is missing from ${postCardPath}`);
    process.exit(1);
  }
  const resolved = resolve(postDir, candidate);
  const relation = relative(postDir, resolved);
  if (relation === '' || relation === '..' || relation.startsWith(`..${sep}`)) {
    console.error(`Active visual must resolve inside the post folder: ${candidate}`);
    process.exit(1);
  }
  return resolved;
}

const visualPath = selectedVisualPath();
if (!existsSync(visualPath)) {
  console.error(`Approved source visual not found: ${visualPath}`);
  process.exit(1);
}

function pngDimensions(path) {
  const buffer = readFileSync(path);
  const signature = buffer.subarray(1, 4).toString('ascii');
  if (signature !== 'PNG') throw new Error('approved source is not a PNG file');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function titleCase(value) {
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function createDir(path) {
  if (dryRun) return;
  mkdirSync(path, { recursive: true });
}

const actions = [];
function writeNew(path, content) {
  if (existsSync(path)) {
    actions.push(`skip existing ${relative(repoDir, path)}`);
    return;
  }
  actions.push(`create ${relative(repoDir, path)}`);
  if (!dryRun) writeFileSync(path, content, 'utf8');
}

function copyNew(source, destination) {
  if (existsSync(destination)) {
    actions.push(`skip existing ${relative(repoDir, destination)}`);
    return;
  }
  actions.push(`copy ${relative(repoDir, source)} -> ${relative(repoDir, destination)}`);
  if (!dryRun) copyFileSync(source, destination);
}

const slug = basename(postDir);
const week = relative(dataDir, postDir).split(sep)[0];
const title = titleCase(slug);
const dimensions = pngDimensions(visualPath);
const projectDir = join(repoDir, 'videos', `${slug}-motion`);

[
  projectDir,
  join(projectDir, 'assets'),
  join(projectDir, 'assets', 'masks'),
  join(projectDir, 'assets', 'covers'),
  join(projectDir, 'assets', 'highlights'),
  join(projectDir, 'compositions'),
  join(projectDir, 'qa'),
].forEach(createDir);

const replaceTokens = (content) => content
  .replaceAll('{Post Title}', title)
  .replaceAll('{week}', week)
  .replaceAll('{slug}', slug)
  .replaceAll('{width}', String(dimensions.width))
  .replaceAll('{height}', String(dimensions.height));

const brief = replaceTokens(
  readFileSync(join(templatesDir, 'motion-brief-template.md'), 'utf8'),
);
writeNew(join(projectDir, 'motion-brief.md'), brief);

const shotPlan = JSON.parse(
  replaceTokens(readFileSync(join(templatesDir, 'motion-shot-plan-template.json'), 'utf8')),
);
shotPlan.project = `${slug}-motion`;
shotPlan.sourceDimensions = dimensions;
writeNew(join(projectDir, 'shot-plan.json'), `${JSON.stringify(shotPlan, null, 2)}\n`);

const composition = replaceTokens(
  readFileSync(join(templatesDir, 'motion-composition-template.html'), 'utf8'),
);
writeNew(join(projectDir, 'compositions', 'main.html'), composition);
copyNew(visualPath, join(projectDir, 'assets', 'visual.png'));

const readme = `# ${title} Motion\n\n` +
  `Source: \`${relative(repoDir, visualPath)}\`\n\n` +
  `Follow \`infographic-setup/references/motion-engine-v1.md\`. ` +
  `The motion brief, component builder, and timeline must be adapted to this visual.\n`;
writeNew(join(projectDir, 'README.md'), readme);

console.log(`${dryRun ? 'Dry run' : 'Motion project initialized'}: videos/${slug}-motion`);
console.log(`Source: ${dimensions.width}x${dimensions.height}`);
actions.forEach((action) => console.log(`- ${action}`));
