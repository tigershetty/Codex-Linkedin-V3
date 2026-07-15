#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from 'fs';
import { resolve, sep } from 'path';

const input = process.argv[2];
const requireReady = process.argv.includes('--ready');

if (!input) {
  console.error('Usage: node scripts/audit-publish-handoff.mjs data/{week}/{slug} [--ready]');
  process.exit(2);
}

const cwd = resolve(process.cwd());
const root = existsSync(resolve(cwd, 'infographic-setup', 'data'))
  ? resolve(cwd, 'infographic-setup')
  : cwd;
const dataRoot = resolve(root, 'data');
const postDir = resolve(root, input.replace(/^infographic-setup\//, ''));

if (!postDir.startsWith(dataRoot + sep)) {
  console.error('Post folder must be inside infographic-setup/data/.');
  process.exit(2);
}

const manifestPath = resolve(postDir, 'publish-manifest.json');
if (!existsSync(manifestPath)) {
  console.error('FAIL publish-manifest.json is missing.');
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (error) {
  console.error('FAIL publish-manifest.json is invalid: ' + error.message);
  process.exit(1);
}

const checks = [];
const check = (label, pass, fix) => checks.push({ label, pass: Boolean(pass), fix });
const localFile = (name) => Boolean(name)
  && existsSync(resolve(postDir, name))
  && statSync(resolve(postDir, name)).size > 0;

check('schema version is 1', manifest.schemaVersion === 1, 'Use templates/publish-manifest-template.json.');
check('caption file exists', localFile(manifest.caption?.file), 'Save the caption file named in the manifest.');
check('approved visual exists', manifest.visual?.status !== 'approved' || localFile(manifest.visual?.file), 'Promote the approved still to visual.png.');
check('approved motion has GIF', manifest.motion?.status !== 'approved' || localFile(manifest.motion?.gif), 'Export the approved GIF or change motion status.');
check('approved motion has MP4', manifest.motion?.status !== 'approved' || localFile(manifest.motion?.mp4), 'Export the MP4 website master or change motion status.');
check(
  'ready website has approved caption',
  manifest.website?.status !== 'ready' || manifest.caption?.status === 'approved',
  'Keep website.status on hold until the caption is explicitly approved.'
);
check(
  'ready website has approved visual',
  manifest.website?.status !== 'ready' || manifest.visual?.status === 'approved',
  'Keep website.status on hold until the still is explicitly approved.'
);
check(
  'required resource is direct and validated',
  manifest.resource?.decision !== 'required' || (
    manifest.resource?.directDownloadNoEmail === true
    && manifest.resource?.validationStatus === 'passed'
    && Boolean(manifest.resource?.version)
    && Boolean(manifest.resource?.pack)
    && Boolean(manifest.resource?.guide)
  ),
  'Complete the versioned direct-download pack, guide, and validation before website handoff.'
);

if (requireReady) {
  check('caption is approved', manifest.caption?.status === 'approved', 'Record explicit user approval.');
  check('visual is approved', manifest.visual?.status === 'approved', 'Record explicit user approval.');
  check('website handoff is ready', manifest.website?.status === 'ready', 'Move website.status to ready only after every gate passes.');
}

for (const item of checks) {
  console.log((item.pass ? 'PASS ' : 'FAIL ') + item.label);
  if (!item.pass) console.log('     ' + item.fix);
}

const failures = checks.filter((item) => !item.pass);
if (failures.length) {
  console.error('\n' + failures.length + ' publish handoff check(s) failed.');
  process.exit(1);
}

if (manifest.caption?.status !== 'approved' || manifest.website?.status !== 'ready') {
  console.log('\nHOLD Handoff is internally valid but waiting for explicit caption approval.');
} else {
  console.log('\nPublish handoff is ready.');
}
