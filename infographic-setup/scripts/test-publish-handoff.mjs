#!/usr/bin/env node

import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const setupRoot = resolve(scriptDir, '..');
const auditScript = resolve(scriptDir, 'audit-publish-handoff.mjs');
const initializerScript = resolve(scriptDir, 'init-post-package.mjs');
const templateText = readFileSync(resolve(setupRoot, 'templates/publish-manifest-template.json'), 'utf8');
const fixtureRoot = mkdtempSync(join(tmpdir(), 'publish-handoff-v2-'));
const fixtureSetup = resolve(fixtureRoot, 'infographic-setup');

const selectedHook = 'A test hook that must remain verbatim.';
const captionFixture = (count) => {
  const hookOptions = Array.from(
    { length: count },
    (_, index) => `${index + 1}. Hook option ${index + 1}${index === 0 ? `: ${selectedHook}` : ''}`,
  ).join('\n');
  return `# Caption\n\n## Selected Hook\n\n${selectedHook}\n\n## Hook Options\n\n${hookOptions}\n\n## Final Approved Caption\n\n${selectedHook}\n\nCaption body.\n`;
};
const pngFixture = (width, height) => {
  const buffer = Buffer.alloc(24);
  Buffer.from('89504e470d0a1a0a', 'hex').copy(buffer, 0);
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
};
const requiredFiles = {
  'linkedin-caption.md': captionFixture(10),
  'visual.png': pngFixture(1080, 1350),
  'visual-linkedin.png': pngFixture(1080, 1350),
  'visual-output-review.md': 'pass',
  'visual-motion.gif': 'gif',
  'visual-motion.mp4': 'mp4',
  'motion-qa.md': 'pass',
  'resource-plan.md': 'approved',
  'post-performance-learning.md': 'planned',
  'START-HERE.pdf': '%PDF fixture',
  'FIELD-GUIDE.md': 'guide',
  'downloads-manifest.json': '{"downloads":[]}',
  'resource-manifest.json': '{}',
};

function readyManifest(week, slug) {
  const manifest = JSON.parse(
    templateText
      .replaceAll('{YYYY-W##}', week)
      .replaceAll('{slug}', slug)
      .replaceAll('{series}', 'AI for Supply Chain'),
  );

  manifest.hooks = {
    file: 'linkedin-caption.md',
    status: 'approved',
    candidateCount: 10,
    selectedHook,
    approvedAt: '2026-07-16',
  };
  manifest.demandProof = {
    status: 'pass',
    audienceReceiptCount: 3,
    sourceTypeCount: 2,
    historicalPriorCount: 3,
    tigerAuthority: 'A documented practitioner pattern.',
    topicScore: 86,
    productionDepth: 'flagship',
    preRenderChallengeStatus: 'pass',
  };
  manifest.caption.status = 'approved';
  manifest.caption.approvedAt = '2026-07-16';
  manifest.visual.status = 'approved';
  manifest.visual.approvedAt = '2026-07-16';
  manifest.visual.width = 1080;
  manifest.visual.height = 1350;
  manifest.motion.status = 'approved';
  manifest.motion.approvedAt = '2026-07-16';
  manifest.postPackage.status = 'approved';
  manifest.postPackage.approvedAt = '2026-07-16';
  manifest.distribution = {
    status: 'ready-for-review',
    firstHourOwner: 'Tiger',
    prePublicationContributorCount: 3,
    followUpAngle: 'Publish the strongest practitioner correction.',
  };
  manifest.resource = {
    required: true,
    decision: 'required',
    status: 'approved',
    plan: 'resource-plan.md',
    version: '1.0.0',
    distribution: 'individual-files',
    instructionPdf: 'START-HERE.pdf',
    guide: 'FIELD-GUIDE.md',
    downloadsManifest: 'downloads-manifest.json',
    manifest: 'resource-manifest.json',
    publicDownloadCount: 7,
    directDownloadNoEmail: true,
    validationStatus: 'passed',
    approvedAt: '2026-07-17',
  };
  manifest.website.status = 'ready';
  manifest.website.articlePath = '/articles/test';
  manifest.website.resourcePath = '/resources/test';
  return manifest;
}

const scenarios = [
  {
    name: 'ready-package-passes',
    expectedExit: 0,
    expectedText: 'READY Post package and resource decision are ready',
    mutate: () => {},
  },
  {
    name: 'still-only-package-passes',
    expectedExit: 0,
    expectedText: 'READY Post package and resource decision are ready',
    mutate: (manifest) => {
      manifest.motion.status = 'still-only';
      manifest.motion.stillOnlyReason = 'A reveal would not improve the reading sequence.';
    },
  },
  {
    name: 'not-warranted-resource-passes',
    expectedExit: 0,
    expectedText: 'READY Post package and resource decision are ready',
    mutate: (manifest) => {
      manifest.resource = {
        required: false,
        decision: 'not-warranted',
        status: 'not-required',
        plan: 'resource-plan.md',
        version: null,
        distribution: 'individual-files',
        instructionPdf: null,
        guide: null,
        downloadsManifest: null,
        manifest: null,
        publicDownloadCount: 0,
        directDownloadNoEmail: true,
        validationStatus: 'not-required',
        approvedAt: null,
      };
      manifest.website.resourcePath = null;
    },
  },
  {
    name: 'hook-count-mismatch-fails',
    expectedExit: 1,
    expectedText: 'FAIL manifest hook count matches the caption file',
    mutate: (manifest) => { manifest.hooks.candidateCount = 9; },
  },
  {
    name: 'nine-hook-file-fails',
    expectedExit: 1,
    expectedText: 'FAIL reviewable hooks include at least 10 candidates',
    files: { 'linkedin-caption.md': captionFixture(9) },
    mutate: (manifest) => { manifest.hooks.candidateCount = 9; },
  },
  {
    name: 'draft-caption-fails',
    expectedExit: 1,
    expectedText: 'FAIL caption is approved',
    mutate: (manifest) => { manifest.caption.status = 'draft'; manifest.caption.approvedAt = null; },
  },
  {
    name: 'missing-linkedin-export-fails',
    expectedExit: 1,
    expectedText: 'FAIL approved visual has a 1080 x 1350 LinkedIn export',
    mutate: (manifest) => { manifest.visual.linkedinExport = null; },
  },
  {
    name: 'wrong-linkedin-export-size-fails',
    expectedExit: 1,
    expectedText: 'FAIL approved visual has a 1080 x 1350 LinkedIn export',
    files: { 'visual-linkedin.png': pngFixture(1200, 1200) },
    mutate: () => {},
  },
  {
    name: 'wrong-canonical-size-fails',
    expectedExit: 1,
    expectedText: 'FAIL approved visual is itself 1080 x 1350',
    files: { 'visual.png': pngFixture(1024, 1536) },
    mutate: () => {},
  },
  {
    name: 'canonical-hash-mismatch-fails',
    expectedExit: 1,
    expectedText: 'FAIL approved canonical and LinkedIn stills are byte-identical',
    files: { 'visual.png': Buffer.concat([pngFixture(1080, 1350), Buffer.from('different')]) },
    mutate: () => {},
  },
  {
    name: 'website-hold-after-eligibility-fails',
    expectedExit: 1,
    expectedText: 'FAIL website hold is only valid before eligibility',
    mutate: (manifest) => { manifest.website.status = 'hold'; },
  },
  {
    name: 'pending-motion-fails',
    expectedExit: 1,
    expectedText: 'FAIL motion gate is complete',
    mutate: (manifest) => { manifest.motion.status = 'pending'; manifest.motion.approvedAt = null; },
  },
  {
    name: 'out-of-sequence-motion-fails',
    expectedExit: 1,
    expectedText: 'FAIL motion is completed after the caption',
    mutate: (manifest) => {
      manifest.caption.approvedAt = '2026-07-17';
      manifest.motion.approvedAt = '2026-07-16';
    },
  },
  {
    name: 'insufficient-demand-receipts-fail',
    expectedExit: 1,
    expectedText: 'FAIL demand proof is complete',
    mutate: (manifest) => { manifest.demandProof.audienceReceiptCount = 2; },
  },
  {
    name: 'flagship-without-challenge-fails',
    expectedExit: 1,
    expectedText: 'FAIL demand proof is complete',
    mutate: (manifest) => { manifest.demandProof.preRenderChallengeStatus = 'pending'; },
  },
  {
    name: 'distribution-without-owner-fails',
    expectedExit: 1,
    expectedText: 'FAIL distribution plan is ready',
    mutate: (manifest) => { manifest.distribution.firstHourOwner = null; },
  },
  {
    name: 'resource-approved-before-post-fails',
    expectedExit: 1,
    expectedText: 'FAIL resource is approved after the post package',
    mutate: (manifest) => { manifest.resource.approvedAt = '2026-07-15'; },
  },
  {
    name: 'missing-performance-learning-file-fails',
    expectedExit: 1,
    expectedText: 'FAIL performance learning file exists',
    mutate: (manifest) => { manifest.performance.file = 'missing-performance-learning.md'; },
  },
  {
    name: 'resource-build-before-approval-passes-draft-audit',
    expectedExit: 0,
    expectedText: 'HOLD Website work remains blocked',
    ready: false,
    mutate: (manifest) => {
      manifest.postPackage.status = 'draft';
      manifest.postPackage.approvedAt = null;
      manifest.resource.status = 'building';
      manifest.resource.validationStatus = 'pending';
      manifest.resource.approvedAt = null;
      manifest.website.status = 'hold';
    },
  },
  {
    name: 'missing-resource-instruction-pdf-fails',
    expectedExit: 1,
    expectedText: 'FAIL approved resource is direct and validated',
    mutate: (manifest) => { manifest.resource.instructionPdf = null; },
  },
  {
    name: 'incomplete-required-resource-fails',
    expectedExit: 1,
    expectedText: 'FAIL resource decision is complete',
    mutate: (manifest) => {
      manifest.resource.status = 'planned';
      manifest.resource.validationStatus = 'pending';
      manifest.resource.approvedAt = null;
    },
  },
];

let failed = false;

const initializerTemplates = [
  'content-brief-v2-template.md',
  'creative-brief-lite-template.md',
  'linkedin-caption-holy-grail-template.md',
  'resource-plan-template.md',
  'post-performance-learning-template.md',
  'publish-manifest-template.json',
];
const fixtureTemplates = resolve(fixtureSetup, 'templates');
mkdirSync(fixtureTemplates, { recursive: true });
for (const name of initializerTemplates) {
  writeFileSync(
    resolve(fixtureTemplates, name),
    readFileSync(resolve(setupRoot, 'templates', name), 'utf8'),
  );
}

const initializedPath = 'data/2099-W02/initialized-package';
const initializerResult = spawnSync(
  process.execPath,
  [initializerScript, initializedPath, '--series', 'ai-for-sc', '--resource-required'],
  { cwd: fixtureSetup, encoding: 'utf8' },
);
const initializedDir = resolve(fixtureSetup, initializedPath);
const initializedFiles = [
  'content-brief-v2.md',
  'creative-brief-lite.md',
  'linkedin-caption.md',
  'resource-plan.md',
  'post-performance-learning.md',
  'publish-manifest.json',
];
const initializedManifest = initializerResult.status === 0
  ? JSON.parse(readFileSync(resolve(initializedDir, 'publish-manifest.json'), 'utf8'))
  : null;
const initializedAudit = spawnSync(
  process.execPath,
  [auditScript, initializedPath],
  { cwd: fixtureSetup, encoding: 'utf8' },
);
const initializerPassed = initializerResult.status === 0
  && initializedFiles.every((name) => existsSync(resolve(initializedDir, name)))
  && initializedManifest?.schemaVersion === 2
  && initializedManifest?.resource?.required === true
  && initializedAudit.status === 0
  && initializedAudit.stdout.includes('HOLD Website work remains blocked');
console.log(`${initializerPassed ? 'PASS' : 'FAIL'} initializer-creates-valid-held-draft`);
if (!initializerPassed) {
  failed = true;
  console.log(initializerResult.stdout + initializerResult.stderr);
  console.log(initializedAudit.stdout + initializedAudit.stderr);
}

for (const [index, scenario] of scenarios.entries()) {
  const week = '2099-W01';
  const slug = `fixture-${index + 1}`;
  const postDir = resolve(fixtureSetup, 'data', week, slug);
  mkdirSync(postDir, { recursive: true });

  for (const [name, content] of Object.entries(requiredFiles)) {
    writeFileSync(resolve(postDir, name), content);
  }
  for (const [name, content] of Object.entries(scenario.files || {})) {
    writeFileSync(resolve(postDir, name), content);
  }

  const manifest = readyManifest(week, slug);
  scenario.mutate(manifest);
  writeFileSync(resolve(postDir, 'publish-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

  const result = spawnSync(
    process.execPath,
    [auditScript, `data/${week}/${slug}`, ...(scenario.ready === false ? [] : ['--ready'])],
    { cwd: fixtureSetup, encoding: 'utf8' },
  );
  const output = `${result.stdout}\n${result.stderr}`;
  const passed = result.status === scenario.expectedExit && output.includes(scenario.expectedText);
  console.log(`${passed ? 'PASS' : 'FAIL'} ${scenario.name}`);
  if (!passed) {
    failed = true;
    console.log(output.trim());
  }
}

if (failed) {
  console.error('\nPublish handoff regression tests failed.');
  process.exit(1);
}

console.log('\nAll publish handoff regression tests passed.');
