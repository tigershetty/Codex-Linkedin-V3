#!/usr/bin/env node

/**
 * Create the deterministic, non-destructive shell for a motion experiment.
 *
 * Legacy image-led posts resolve their selected still from post-card.md. Exact
 * Figma Field Guides use an explicit manifest instead, so this initializer
 * never guesses which exported image, Figma node, or motion package is active.
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const infographicDir = resolve(scriptDir, '..');
const repoDir = resolve(infographicDir, '..');
const dataDir = join(infographicDir, 'data');
const templatesDir = join(infographicDir, 'templates');

function usage() {
  return `Usage:
  node scripts/init-motion-project.mjs data/{week}/{slug} [--dry-run]
  node scripts/init-motion-project.mjs --manifest data/_lab/{slug}/field-guide-motion-manifest.json [--dry-run]

The legacy route resolves an approved still from post-card.md. The manifest
route is only for a non-template Figma Field Guide experiment with a selected
local still and verified SHA-256.`;
}

function parseArgs(args) {
  const options = { positional: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--manifest') {
      options.manifest = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--manifest=')) options.manifest = arg.slice('--manifest='.length);
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else options.positional.push(arg);
  }
  return options;
}

function assertInside(parent, candidate, label) {
  const resolved = resolve(candidate);
  const relation = relative(parent, resolved);
  if (relation === '' || relation === '..' || relation.startsWith(`..${sep}`)) {
    throw new Error(`${label} must resolve inside ${relative(repoDir, parent)}/.`);
  }
  return resolved;
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

function selectedVisualPath(postDir) {
  const postCardPath = join(postDir, 'post-card.md');
  if (!existsSync(postCardPath)) return join(postDir, 'visual.png');
  const card = readFileSync(postCardPath, 'utf8');
  const match = card.match(/^\*\*Active visual:?\*\*\s*(.*)$/m);
  const candidate = match?.[1]?.replace(/`/g, '').trim();
  if (!candidate) throw new Error(`Active visual is missing from ${relative(repoDir, postCardPath)}`);
  return assertInside(postDir, resolve(postDir, candidate), `Active visual (${candidate})`);
}

function verifyManifest(manifestPath) {
  const validatorPath = join(scriptDir, 'validate-field-guide-motion-manifest.mjs');
  const result = spawnSync(process.execPath, [validatorPath, '--input', manifestPath, '--verify-files'], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const message = [result.stdout, result.stderr].filter(Boolean).join('\n').trim();
    throw new Error(`Field Guide manifest validation failed:\n${message}`);
  }
}

function loadLegacy(input) {
  const postDir = assertInside(dataDir, resolve(infographicDir, input.replace(/^infographic-setup\//, '')), 'Post folder');
  const visualPath = selectedVisualPath(postDir);
  if (!existsSync(visualPath)) throw new Error(`Approved source visual not found: ${visualPath}`);
  const slug = basename(postDir);
  return {
    route: 'legacy post-card',
    postDir,
    projectDir: join(repoDir, 'videos', `${slug}-motion`),
    visualPath,
    slug,
    week: relative(dataDir, postDir).split(sep)[0],
    title: titleCase(slug),
    sourceRecord: `active path resolved from data/${relative(dataDir, postDir)}/post-card.md`,
    auditCommand: `node scripts/audit-motion-package.mjs data/${relative(dataDir, postDir)}`,
    manifestPath: null,
    package: null,
  };
}

function loadFieldGuideManifest(input) {
  const manifestPath = assertInside(dataDir, resolve(input), 'Field Guide manifest');
  if (!existsSync(manifestPath)) throw new Error(`Field Guide manifest does not exist: ${manifestPath}`);
  verifyManifest(manifestPath);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.status === 'template') {
    throw new Error('The Field Guide motion manifest is a template. Copy it into a real lab package first.');
  }

  const postDir = assertInside(dataDir, resolve(repoDir, manifest.package.data_directory), 'manifest package.data_directory');
  const projectDir = assertInside(join(repoDir, 'videos'), resolve(repoDir, manifest.package.motion_project_directory), 'manifest package.motion_project_directory');
  const visualPath = assertInside(postDir, resolve(repoDir, manifest.source.selected_still), 'manifest source.selected_still');
  if (!existsSync(visualPath)) throw new Error(`Approved Field Guide source still not found: ${visualPath}`);
  const slug = basename(postDir);

  return {
    route: 'Field Guide manifest',
    postDir,
    projectDir,
    visualPath,
    slug,
    week: relative(dataDir, postDir).split(sep)[0],
    title: String(manifest.title).trim(),
    sourceRecord: `Field Guide manifest ${relative(repoDir, manifestPath)}; Figma file ${manifest.source.figma_file_key}, still node ${manifest.source.still_node_id}`,
    auditCommand: `node scripts/audit-motion-package.mjs --manifest ${relative(infographicDir, manifestPath)}`,
    manifestPath,
    package: manifest.package,
  };
}

function createDir(path, dryRun) {
  if (!dryRun) mkdirSync(path, { recursive: true });
}

function relativeForLog(path) {
  return relative(repoDir, path) || '.';
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  if (options.manifest && options.positional.length) {
    throw new Error('Choose either a legacy post folder or --manifest, not both.');
  }
  if (!options.manifest && options.positional.length !== 1) {
    throw new Error(usage());
  }
  if (options.manifest === '') throw new Error('--manifest needs a path.');

  const setup = options.manifest ? loadFieldGuideManifest(options.manifest) : loadLegacy(options.positional[0]);
  const dimensions = pngDimensions(setup.visualPath);
  const projectDir = setup.projectDir;
  const packagePaths = setup.package
    ? {
      brief: assertInside(projectDir, resolve(projectDir, setup.package.motion_brief), 'manifest package.motion_brief'),
      shot: assertInside(projectDir, resolve(projectDir, setup.package.shot_plan), 'manifest package.shot_plan'),
      composition: assertInside(projectDir, resolve(projectDir, setup.package.composition), 'manifest package.composition'),
      assetBuilder: assertInside(projectDir, resolve(projectDir, setup.package.asset_builder), 'manifest package.asset_builder'),
    }
    : {
      brief: join(projectDir, 'motion-brief.md'),
      shot: join(projectDir, 'shot-plan.json'),
      composition: join(projectDir, 'compositions', 'main.html'),
      assetBuilder: join(projectDir, 'build_motion_assets.mjs'),
    };

  const copiedVisualPath = join(projectDir, 'assets', 'visual.png');
  if (existsSync(copiedVisualPath) && !readFileSync(setup.visualPath).equals(readFileSync(copiedVisualPath))) {
    throw new Error(
      `Refusing to reuse a motion project with a different source still: ${relativeForLog(copiedVisualPath)}. ` +
      'Create a new project or deliberately reconcile the approved source before continuing.',
    );
  }

  [
    projectDir,
    join(projectDir, 'assets'),
    join(projectDir, 'assets', 'masks'),
    join(projectDir, 'assets', 'covers'),
    join(projectDir, 'assets', 'highlights'),
    dirname(packagePaths.composition),
    dirname(packagePaths.brief),
    dirname(packagePaths.shot),
    dirname(packagePaths.assetBuilder),
    join(projectDir, 'qa'),
  ].forEach((path) => createDir(path, options.dryRun));

  const actions = [];
  function writeNew(path, content) {
    if (existsSync(path)) {
      actions.push(`skip existing ${relativeForLog(path)}`);
      return;
    }
    actions.push(`create ${relativeForLog(path)}`);
    if (!options.dryRun) writeFileSync(path, content, 'utf8');
  }

  function copyApprovedSource(source, destination) {
    if (existsSync(destination)) {
      const matches = readFileSync(source).equals(readFileSync(destination));
      if (!matches) {
        throw new Error(
          `Refusing to reuse a motion project with a different source still: ${relativeForLog(destination)}. ` +
          'Create a new project or deliberately reconcile the approved source before continuing.',
        );
      }
      actions.push(`verified existing approved source ${relativeForLog(destination)}`);
      return;
    }
    actions.push(`copy ${relativeForLog(source)} -> ${relativeForLog(destination)}`);
    if (!options.dryRun) copyFileSync(source, destination);
  }

  const replaceTokens = (content) => content
    .replaceAll('{Post Title}', setup.title)
    .replaceAll('{week}', setup.week)
    .replaceAll('{slug}', setup.slug)
    .replaceAll('{width}', String(dimensions.width))
    .replaceAll('{height}', String(dimensions.height))
    .replaceAll('{source_record}', setup.sourceRecord)
    .replaceAll('{motion_audit_command}', setup.auditCommand);

  const brief = replaceTokens(readFileSync(join(templatesDir, 'motion-brief-template.md'), 'utf8'));
  writeNew(packagePaths.brief, brief);

  const shotPlan = JSON.parse(
    replaceTokens(readFileSync(join(templatesDir, 'motion-shot-plan-template.json'), 'utf8')),
  );
  shotPlan.project = basename(projectDir);
  shotPlan.sourceDimensions = dimensions;
  writeNew(packagePaths.shot, `${JSON.stringify(shotPlan, null, 2)}\n`);

  const composition = replaceTokens(
    readFileSync(join(templatesDir, 'motion-composition-template.html'), 'utf8'),
  );
  writeNew(packagePaths.composition, composition);
  copyApprovedSource(setup.visualPath, copiedVisualPath);

  const sourceLine = setup.manifestPath
    ? `Manifest: \`${relativeForLog(setup.manifestPath)}\`\n\nSource: \`${relativeForLog(setup.visualPath)}\``
    : `Source: \`${relativeForLog(setup.visualPath)}\``;
  const readme = `# ${setup.title} Motion\n\n${sourceLine}\n\n` +
    `Follow \`infographic-setup/references/motion-engine-v1.md\`. ` +
    `The motion brief, component builder, and timeline must be adapted to this visual.\n`;
  writeNew(join(projectDir, 'README.md'), readme);

  console.log(`${options.dryRun ? 'Dry run' : 'Motion project initialized'} (${setup.route}): ${relativeForLog(projectDir)}`);
  console.log(`Source: ${dimensions.width}x${dimensions.height}`);
  actions.forEach((action) => console.log(`- ${action}`));
}

try {
  main();
} catch (error) {
  console.error(`Motion project initialization failed: ${error.message}`);
  process.exitCode = 1;
}
