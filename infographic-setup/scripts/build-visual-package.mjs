#!/usr/bin/env node
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const folders = args.filter((arg) => !arg.startsWith('--'));
const checkOnly = args.includes('--check-only');
const preflightOnly = args.includes('--preflight');
const flagship = args.includes('--flagship');

if (!folders.length || (checkOnly && preflightOnly)) {
  console.error('Usage: node scripts/build-visual-package.mjs data/{week}/{slug} [...] [--flagship] [--check-only | --preflight]');
  process.exit(2);
}

const root = resolve(process.cwd());

function run(script, scriptArgs) {
  const result = spawnSync(process.execPath, [join(root, 'scripts', script), ...scriptArgs], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function field(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`^\\*\\*${escaped}:?\\*\\*\\s*(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

for (const folder of folders) {
  const dir = resolve(root, folder);
  const briefPath = join(dir, 'creative-brief-lite.md');
  const bundlePath = join(dir, 'reference-bundle.json');
  const recombinationPath = join(dir, 'recombination-brief.md');
  const postCardPath = join(dir, 'post-card.md');

  if (!existsSync(dir)) {
    console.error(`Missing package folder: ${folder}`);
    process.exit(1);
  }
  const postCard = existsSync(postCardPath) ? readFileSync(postCardPath, 'utf8') : '';
  const declaredRoute = field(postCard, 'Route') || field(postCard, 'Route class');
  const declaredFlagship = /\bflagship\b|\bbrand[- ]lab\b/i.test(declaredRoute);
  const standardPost = existsSync(postCardPath) && !flagship && !declaredFlagship;
  const activeFlagshipDraft = declaredFlagship
    && Boolean(field(postCard, 'Active visual'))
    && Boolean(field(postCard, 'Active caption'));
  if (!standardPost && !activeFlagshipDraft && !existsSync(briefPath)) {
    console.error(`Missing flagship brief: ${relative(root, briefPath)}`);
    process.exit(1);
  }

  if (standardPost) {
    console.log(`\n== ${folder} ==`);
    console.log('Mode: standard fast post');
    run('audit-visual-package.mjs', [folder]);
    run('audit-fast-post.mjs', [folder]);
    continue;
  }

  // A declared flagship can retain its full genome and historic route tests beside a newly
  // selected native draft. Once the post card names that draft, audit the current reader-facing
  // output and ready reference bundle rather than treating an older renderer brief as active.
  if (activeFlagshipDraft) {
    console.log(`\n== ${folder} ==`);
    console.log('Mode: declared flagship active post-card draft');
    run('audit-visual-package.mjs', [folder, '--flagship']);
    continue;
  }

  const brief = readFileSync(briefPath, 'utf8');
  const genomeMode = existsSync(bundlePath)
    || existsSync(recombinationPath)
    || /^# Creative Brief Lite — Recombination Template/m.test(brief);
  const renderer = field(brief, 'Renderer') || (genomeMode ? '' : 'GPT Image 2');
  const imageRenderer = /gpt\s*image|image model/i.test(renderer) || (!renderer && !genomeMode);

  console.log(`\n== ${folder} ==`);
  console.log(`Mode: ${genomeMode ? 'Creative Genome + recombination' : 'legacy compatibility'}`);
  console.log(`Renderer: ${renderer || 'not declared'}`);

  if (genomeMode) {
    if (!existsSync(bundlePath)) {
      console.error('Creative Genome package is missing reference-bundle.json.');
      process.exit(1);
    }
    let bundle;
    try {
      bundle = JSON.parse(readFileSync(bundlePath, 'utf8'));
    } catch (error) {
      console.error(`Invalid reference-bundle.json: ${error.message}`);
      process.exit(1);
    }
    if (!bundle.creative_bundle_id && bundle.bundle_id) {
      console.warn('WARN reference-bundle.json uses legacy bundle_id; migrate it to creative_bundle_id.');
    }
    if (bundle.status !== 'ready') {
      console.error('Creative Genome build requires reference-bundle.json status=ready.');
      process.exit(1);
    }
    run('validate-reference-bundle.mjs', ['--input', relative(root, bundlePath)]);
  } else {
    console.warn('WARN Legacy compatibility mode. New packages must use reference-bundle.json and recombination-brief.md.');
  }

  if (!checkOnly) {
    if (imageRenderer) {
      run('compile-gpt-image-prompt.mjs', [folder]);
      copyFileSync(
        join(dir, 'gpt-image-2-prompt-compiled.md'),
        join(dir, 'gpt-image-2-prompt.md'),
      );
      console.log('Synced gpt-image-2-prompt.md');
    } else {
      console.log(`Skipped GPT Image prompt compilation for renderer: ${renderer}.`);
    }
    run('compile-creative-packet.mjs', [folder]);
  }

  run('score-creative-director.mjs', [folder, ...(checkOnly ? [] : ['--write'])]);

  if (preflightOnly) {
    console.log('Preflight passed; final visual audit intentionally skipped.');
  } else {
    run('audit-visual-package.mjs', [folder, ...(flagship ? ['--flagship'] : [])]);
  }
}
