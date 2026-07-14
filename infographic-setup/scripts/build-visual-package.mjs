#!/usr/bin/env node
import { copyFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { spawnSync } from 'child_process';

const folders = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const checkOnly = process.argv.includes('--check-only');

if (!folders.length) {
  console.error('Usage: node scripts/build-visual-package.mjs data/{week}/{slug} [...] [--check-only]');
  process.exit(2);
}

const root = resolve(process.cwd());

function run(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

for (const folder of folders) {
  const dir = resolve(root, folder);

  if (!existsSync(dir)) {
    console.error(`Missing package folder: ${folder}`);
    process.exit(1);
  }

  console.log(`\n== ${folder} ==`);

  if (!checkOnly) {
    run(['scripts/compile-gpt-image-prompt.mjs', folder]);
    copyFileSync(
      join(dir, 'gpt-image-2-prompt-compiled.md'),
      join(dir, 'gpt-image-2-prompt.md'),
    );
    console.log('Synced gpt-image-2-prompt.md');
    run(['scripts/compile-creative-packet.mjs', folder]);
  }

  run(['scripts/score-creative-director.mjs', folder, ...(checkOnly ? [] : ['--write'])]);
  run(['scripts/audit-visual-package.mjs', folder]);
}
