#!/usr/bin/env node

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'fs';
import { basename, dirname, join, relative, resolve, sep } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const infographicDir = resolve(scriptDir, '..');
const repoDir = resolve(infographicDir, '..');
const dataDir = join(infographicDir, 'data');
const input = process.argv[2];

if (!input) {
  console.error('Usage: node scripts/audit-motion-package.mjs data/{week}/{slug}');
  process.exit(2);
}

const postDir = resolve(infographicDir, input.replace(/^infographic-setup\//, ''));
if (!postDir.startsWith(dataDir + sep)) {
  console.error('Post folder must be inside infographic-setup/data/.');
  process.exit(2);
}

const slug = basename(postDir);
const projectDir = join(repoDir, 'videos', `${slug}-motion`);
const checks = [];

function check(label, pass, fix) {
  checks.push({ label, pass: Boolean(pass), fix });
}

function file(path) {
  return existsSync(path) && statSync(path).isFile();
}

function nonEmpty(path, minimum = 1) {
  return file(path) && statSync(path).size >= minimum;
}

function read(path) {
  return file(path) ? readFileSync(path, 'utf8') : '';
}

function probe(path) {
  if (!file(path)) return null;
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,nb_frames,duration',
    '-show_entries', 'format=duration,size',
    '-of', 'json',
    path,
  ], { encoding: 'utf8' });
  if (result.status !== 0) return null;
  try {
    return JSON.parse(result.stdout);
  } catch {
    return null;
  }
}

const visual = join(postDir, 'visual.png');
const gif = join(postDir, 'visual-motion.gif');
const mp4 = join(postDir, 'visual-motion.mp4');
const qaPath = join(postDir, 'motion-qa.md');
const briefPath = join(projectDir, 'motion-brief.md');
const shotPath = join(projectDir, 'shot-plan.json');
const compositionPath = join(projectDir, 'compositions', 'main.html');

check('approved visual exists', nonEmpty(visual, 1000), 'Promote the approved still to visual.png first.');
check('canonical GIF exists', nonEmpty(gif, 1000), 'Export visual-motion.gif.');
check('canonical MP4 exists', nonEmpty(mp4, 1000), 'Export visual-motion.mp4.');
check('motion QA exists', nonEmpty(qaPath, 100), 'Complete motion-qa.md.');
check('motion brief exists', nonEmpty(briefPath, 100), 'Complete the post-specific motion brief.');
check('shot plan exists', nonEmpty(shotPath, 100), 'Complete shot-plan.json.');
check('composition exists', nonEmpty(compositionPath, 100), 'Author compositions/main.html.');

const builderExists = existsSync(projectDir) && readdirSync(projectDir).some(
  (name) => /^build_motion.*\.(py|mjs|js)$/.test(name),
);
check('motion asset builder exists', builderExists, 'Add a deterministic build_motion* asset script.');

const qa = read(qaPath);
check('frame 0 pixel difference is zero', /Frame 0 pixel difference:\*\*\s*`?0`?/i.test(qa), 'Record a zero frame-0 pixel difference.');
check('final frame pixel difference is zero', /Final frame pixel difference:\*\*\s*`?0`?/i.test(qa), 'Record a zero final-frame pixel difference.');
check('motion QA decision passes', /Status:\*\*\s*pass\b/i.test(qa), 'Resolve motion QA and set Status to pass.');
check('canonical outputs promoted', /Canonical outputs promoted:\*\*\s*yes\b/i.test(qa), 'Promote one canonical GIF/MP4 pair.');

const composition = read(compositionPath);
check('composition locks approved visual', /\.\.\/assets\/visual\.png/.test(composition), 'Use the copied approved visual as the locked base.');
check('composition exposes deterministic timeline', /window\.__tl\s*=/.test(composition) && /window\.__dur\s*=/.test(composition), 'Expose window.__tl and window.__dur.');

let shotValid = false;
try {
  const shot = JSON.parse(read(shotPath));
  shotValid = Number(shot.durationSeconds) > 0 && Array.isArray(shot.beats) && shot.beats.length >= 4;
} catch {}
check('shot plan is valid', shotValid, 'Use valid JSON with durationSeconds and at least four beats.');

const gifProbe = probe(gif);
const mp4Probe = probe(mp4);
check('GIF media probe passes', gifProbe?.streams?.[0]?.width > 0 && Number(gifProbe?.format?.duration) > 0, 'Fix the GIF encoding.');
check('MP4 media probe passes', mp4Probe?.streams?.[0]?.width > 0 && Number(mp4Probe?.format?.duration) > 0, 'Fix the MP4 encoding.');

for (const item of checks) {
  console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.label}`);
  if (!item.pass) console.log(`     ${item.fix}`);
}

const failures = checks.filter((item) => !item.pass);
if (failures.length) {
  console.error(`\n${failures.length} motion package check(s) failed.`);
  process.exit(1);
}

console.log(`\nMotion package audit passed: ${relative(repoDir, postDir)}`);
