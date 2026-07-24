#!/usr/bin/env node

import { createHash } from 'crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { basename, dirname, relative, resolve, sep } from 'path';
import { spawnSync } from 'child_process';

const input = process.argv[2];

if (!input) {
  console.error('Usage: node scripts/audit-resource-package.mjs data/{week}/{slug}');
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

const checks = [];
const check = (label, pass, fix) => checks.push({ label, pass: Boolean(pass), fix });
const file = (path) => Boolean(path) && existsSync(path) && statSync(path).isFile() && statSync(path).size > 0;
const local = (name) => {
  if (typeof name !== 'string' || !name.trim()) return null;
  const path = resolve(postDir, name);
  return path.startsWith(postDir + sep) ? path : null;
};
const parseJson = (path) => {
  if (!file(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
};
const sha256 = (path) => file(path)
  ? createHash('sha256').update(readFileSync(path)).digest('hex')
  : null;
const walkFiles = (rootPath) => {
  if (!rootPath || !existsSync(rootPath)) return [];
  const paths = [];
  for (const entry of readdirSync(rootPath, { withFileTypes: true })) {
    const path = resolve(rootPath, entry.name);
    if (entry.isDirectory()) paths.push(...walkFiles(path));
    else if (entry.isFile()) paths.push(path);
  }
  return paths;
};

const publishPath = resolve(postDir, 'publish-manifest.json');
const publish = parseJson(publishPath);
check('publish manifest exists and is valid', publish !== null, 'Add a valid publish-manifest.json.');

if (!publish) {
  for (const item of checks) console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.label}`);
  process.exit(1);
}

const resource = publish.resource || {};
const required = resource.required === true;

if (!required) {
  const complete = resource.decision === 'not-warranted'
    && resource.status === 'not-required'
    && resource.validationStatus === 'not-required';
  check(
    'non-required resource has a documented final decision',
    complete,
    'Record not-warranted / not-required / not-required, or mark the resource as required.',
  );
} else {
  const planPath = local(resource.plan);
  const instructionPdfPath = local(resource.instructionPdf);
  const guidePath = local(resource.guide);
  const downloadsManifestPath = local(resource.downloadsManifest);
  const packageManifestPath = local(resource.manifest);
  const downloadsManifest = parseJson(downloadsManifestPath);
  const packageManifest = parseJson(packageManifestPath);
  const packageRoot = packageManifestPath ? dirname(packageManifestPath) : null;
  const packageContentsPath = packageRoot ? resolve(packageRoot, 'PACKAGE-CONTENTS.md') : null;
  const checksumPath = packageRoot ? resolve(packageRoot, 'checksums.sha256') : null;

  check('resource decision is required or lightweight', ['required', 'lightweight'].includes(resource.decision), 'Set resource.decision to required or lightweight.');
  check('resource is ready for review or approved', ['ready-for-review', 'approved'].includes(resource.status), 'Finish the library and use ready-for-review before approval.');
  check('resource validation status passed', resource.validationStatus === 'passed', 'Run the resource validator and record passed.');
  check('resource is a direct no-email download', resource.directDownloadNoEmail === true, 'Keep every download direct and free of email/account gates.');
  check('resource version is recorded', typeof resource.version === 'string' && resource.version.length > 0, 'Record a semantic resource version.');
  check('resource uses individual-file distribution', resource.distribution === 'individual-files', 'Use distribution: individual-files. ZIP delivery is legacy-only.');
  check('resource plan exists', file(planPath), 'Complete resource-plan.md.');
  check('resource plan clears eligibility floor', file(planPath) && /\*\*Score:\*\*\s*`?[4-6]\/6/i.test(readFileSync(planPath, 'utf8')), 'Score at least 4/6 or record a not-warranted decision.');
  check('instruction PDF exists', file(instructionPdfPath) && instructionPdfPath.endsWith('.pdf'), 'Add the branded how-to PDF named in resource.instructionPdf.');
  check('Markdown guide exists', file(guidePath) && guidePath.endsWith('.md'), 'Add the accessible Markdown companion named in resource.guide.');
  check('downloads manifest exists and is valid', downloadsManifest !== null, 'Add a valid transparent downloads manifest.');
  check('package manifest exists and is valid', packageManifest !== null, 'Include a valid machine-readable source manifest.');
  check('package contents map exists', file(packageContentsPath), 'Include PACKAGE-CONTENTS.md beside the source manifest.');
  check('checksums file exists', file(checksumPath), 'Include checksums.sha256 beside the source manifest.');

  if (file(guidePath)) {
    const guide = readFileSync(guidePath, 'utf8');
    check('guide defines a first-run path', /first.run|start with your own project|start here/i.test(guide), 'Explain how the reader starts safely with the resource.');
    check('guide defines human control', /human control|human review|accountable business decisions|human decision/i.test(guide), 'Explain what the agent prepares and what people approve.');
  }

  if (file(instructionPdfPath)) {
    const header = readFileSync(instructionPdfPath).subarray(0, 4).toString('ascii');
    check('instruction guide has a PDF header', header === '%PDF', 'Regenerate the instruction guide as a valid PDF.');
    const result = spawnSync('pdfinfo', [instructionPdfPath], { encoding: 'utf8' });
    const pages = Number(result.stdout.match(/^Pages:\s+(\d+)/m)?.[1] || 0);
    check('instruction PDF media check passes', result.status === 0 && pages >= 1, 'Fix the PDF until pdfinfo can read at least one page.');
  }

  if (downloadsManifest && packageRoot) {
    const downloads = Array.isArray(downloadsManifest.downloads) ? downloadsManifest.downloads : [];
    const packageShape = downloadsManifest.packageShape || {};
    const expectedGuides = Number(packageShape.instructionPdf || 0) + Number(packageShape.markdownGuide || 0);
    const expectedSkills = Number(packageShape.standaloneSkills || 0);
    const expectedDownloads = expectedGuides + expectedSkills;
    check('download manifest uses individual files', downloadsManifest.distribution === 'individual-files', 'Set distribution to individual-files in downloads-manifest.json.');
    check('download manifest is direct and no-email', downloadsManifest.directDownloadNoEmail === true, 'Keep the public library direct and no-email.');
    check('download manifest requires the reader own data', downloadsManifest.bringYourOwnData === true, 'Set bringYourOwnData to true.');
    check('download manifest bundles no data files', Number(downloadsManifest.bundledDataFiles) === 0, 'Set bundledDataFiles to 0 and remove data files from the public library.');
    check('download count matches the manifest', Number(downloadsManifest.downloadCount) === downloads.length, 'Set downloadCount to the exact number of public files.');
    check('publish manifest download count matches', Number(resource.publicDownloadCount) === downloads.length, 'Set resource.publicDownloadCount to the exact number of public files.');
    check('download manifest declares its public package shape', expectedDownloads > 0, 'Declare instructionPdf, markdownGuide, and standaloneSkills in packageShape.');
    check('public file count matches the declared package shape', expectedDownloads > 0 && downloads.length === expectedDownloads, 'Make the public files match packageShape exactly.');
    check('public guide count matches the declared package shape', downloads.filter((item) => item.category === 'start-here').length === expectedGuides, 'List exactly the declared PDF and Markdown guide files.');
    check('public skill count matches the declared package shape', downloads.filter((item) => item.category === 'skill').length === expectedSkills, 'List exactly the declared number of standalone skills.');

    const instructionRelative = instructionPdfPath
      ? relative(packageRoot, instructionPdfPath).split(sep).join('/')
      : null;
    const guideRelative = guidePath
      ? relative(packageRoot, guidePath).split(sep).join('/')
      : null;
    check('instruction PDF is a named public download', downloads.some((item) => item.path === instructionRelative), 'List the instruction PDF in downloads-manifest.json.');
    check('Markdown guide is a named public download', downloads.some((item) => item.path === guideRelative), 'List the Markdown guide in downloads-manifest.json.');
    check('public library contains no ZIP', downloads.every((item) => typeof item.path === 'string' && !item.path.endsWith('.zip')), 'Expose readable individual files, not an archive.');
    check('public downloads are PDF or Markdown only', downloads.every((item) => typeof item.path === 'string' && /\.(pdf|md)$/i.test(item.path)), 'Public downloads may contain only the instruction PDF and Markdown files.');

    const downloadsRoot = resolve(packageRoot, 'downloads');
    const publicFiles = walkFiles(downloadsRoot);
    check('downloads directory matches the declared package shape', expectedDownloads > 0 && publicFiles.length === expectedDownloads, 'Remove extra public files so the directory matches packageShape.');
    check('downloads directory contains no bundled data', publicFiles.every((path) => !/\.(csv|tsv|xls|xlsx|parquet|jsonl)$/i.test(path)), 'Remove bundled datasets; readers bring governed copies of their own project files.');

    for (const item of downloads) {
      const publicPath = typeof item.path === 'string' ? resolve(packageRoot, item.path) : null;
      const safePath = publicPath && publicPath.startsWith(packageRoot + sep);
      const label = item.id || item.title || '(unnamed)';
      check(`download ${label} exists`, safePath && file(publicPath), 'Create every file listed in the downloads manifest.');
      check(`download ${label} names a content type`, typeof item.contentType === 'string' && item.contentType.length > 0, 'Record a content type for every download.');
      check(`download ${label} byte count matches`, safePath && file(publicPath) && Number(item.bytes) === statSync(publicPath).size, 'Regenerate the download manifest after file changes.');
      check(`download ${label} checksum matches`, safePath && file(publicPath) && item.sha256 === sha256(publicPath), 'Regenerate the download manifest after file changes.');

      if (item.category === 'skill' && safePath && file(publicPath)) {
        const skillText = readFileSync(publicPath, 'utf8');
        check(`skill download ${label} is self-contained`, [
          'Use This Skill With Your Project',
          'This skill works independently',
          'READINESS',
          'BUILD',
          'Required First Output',
          'First-Run Prompt',
          'source-to-input map',
          'readiness-gap',
          'Embedded Input Template',
          'Embedded Output Template',
          'HUMAN REVIEW REQUIRED',
        ].every((phrase) => skillText.includes(phrase)), 'Embed setup, source mapping, insufficient-evidence behavior, input, output, and human-review instructions in each public skill file.');
      }
    }
  }

  if (packageManifest && packageRoot) {
    const skills = Array.isArray(packageManifest.skills) ? packageManifest.skills : [];
    check('package manifest uses individual distribution', packageManifest.distribution === 'individual-files', 'Record individual-files in the source manifest.');
    check('package manifest names a first-run guide', typeof packageManifest.safeFirstRun === 'string' && packageManifest.safeFirstRun.length > 0, 'Record safeFirstRun in the package manifest.');
    check('package contains one or more native skills', skills.length >= 1, 'Include at least one reusable native skill.');

    for (const skill of skills) {
      const skillRoot = typeof skill.path === 'string' ? resolve(packageRoot, skill.path) : null;
      const safeRoot = skillRoot && skillRoot.startsWith(packageRoot + sep);
      check(`skill ${skill.name || '(unnamed)'} has SKILL.md`, safeRoot && file(resolve(skillRoot, 'SKILL.md')), 'Include the native skill definition.');
      check(`skill ${skill.name || '(unnamed)'} has an input template`, safeRoot && file(resolve(skillRoot, 'assets', 'input-template.md')), 'Include assets/input-template.md.');
      check(`skill ${skill.name || '(unnamed)'} has an output template`, safeRoot && file(resolve(skillRoot, 'assets', 'output-template.md')), 'Include assets/output-template.md.');
      const standalone = typeof skill.standaloneDownload === 'string'
        ? resolve(packageRoot, skill.standaloneDownload)
        : null;
      check(`skill ${skill.name || '(unnamed)'} has a public standalone file`, standalone && standalone.startsWith(packageRoot + sep) && file(standalone), 'Name the public standalone skill download.');
    }
  }

  if (file(checksumPath)) {
    const result = spawnSync(
      'shasum',
      ['-a', '256', '-c', basename(checksumPath)],
      { cwd: packageRoot, encoding: 'utf8' },
    );
    check('package checksums verify', result.status === 0, 'Regenerate checksums after any resource file changes.');
  }
}

for (const item of checks) {
  console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.label}`);
  if (!item.pass) console.log(`     ${item.fix}`);
}

const failures = checks.filter((item) => !item.pass);
if (failures.length) {
  console.error(`\n${failures.length} resource package check(s) failed.`);
  process.exit(1);
}

console.log(`\nResource package audit passed: ${input}`);
