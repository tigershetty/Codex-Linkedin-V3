#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from 'fs';
import { basename, dirname, resolve, sep } from 'path';
import { createHash } from 'crypto';

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
const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
const approvalTime = (value) => {
  if (!nonEmpty(value)) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};
const onOrAfter = (later, earlier) => {
  const laterTime = approvalTime(later);
  const earlierTime = approvalTime(earlier);
  return laterTime !== null && earlierTime !== null && laterTime >= earlierTime;
};
const localFile = (name) => {
  if (!nonEmpty(name)) return false;
  const filePath = resolve(postDir, name);
  if (!filePath.startsWith(postDir + sep)) return false;
  return existsSync(filePath) && statSync(filePath).isFile() && statSync(filePath).size > 0;
};
const localText = (name) => localFile(name) ? readFileSync(resolve(postDir, name), 'utf8') : '';
const pngDimensions = (name) => {
  if (!localFile(name)) return null;
  const buffer = readFileSync(resolve(postDir, name));
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
};
const sha256 = (name) => localFile(name)
  ? createHash('sha256').update(readFileSync(resolve(postDir, name))).digest('hex')
  : null;
const markdownSection = (text, headingPattern) => {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => headingPattern.test(line));
  if (start < 0) return '';
  const nextHeading = lines.findIndex((line, index) => index > start && /^##\s+/.test(line));
  const end = nextHeading < 0 ? lines.length : nextHeading;
  return lines.slice(start + 1, end).join('\n').trim();
};
const statusIn = (value, allowed) => allowed.includes(value);

const hooksApproved = manifest.hooks?.status === 'approved';
const hooksReviewable = ['ready-for-review', 'approved'].includes(manifest.hooks?.status);
const captionApproved = manifest.caption?.status === 'approved';
const visualApproved = manifest.visual?.status === 'approved';
const motionComplete = ['approved', 'still-only'].includes(manifest.motion?.status);
const motionReviewable = ['ready-for-review', 'approved', 'still-only'].includes(manifest.motion?.status);
const postPackageApproved = manifest.postPackage?.status === 'approved';
const demandProofTracked = manifest.demandProof && typeof manifest.demandProof === 'object';
const demandProofPassed = !demandProofTracked || (
  manifest.demandProof.status === 'pass'
  && Number(manifest.demandProof.audienceReceiptCount) >= 3
  && Number(manifest.demandProof.sourceTypeCount) >= 2
  && Number(manifest.demandProof.historicalPriorCount) >= 3
  && nonEmpty(manifest.demandProof.tigerAuthority)
  && Number(manifest.demandProof.topicScore) >= 75
  && ['flagship', 'medium', 'test'].includes(manifest.demandProof.productionDepth)
  && (
    manifest.demandProof.productionDepth !== 'flagship'
    || manifest.demandProof.preRenderChallengeStatus === 'pass'
  )
);
const distributionTracked = manifest.distribution && typeof manifest.distribution === 'object';
const distributionReady = !distributionTracked || (
  ['ready-for-review', 'approved'].includes(manifest.distribution.status)
  && nonEmpty(manifest.distribution.firstHourOwner)
  && nonEmpty(manifest.distribution.followUpAngle)
);
const resourceRequired = manifest.resource?.required === true;
const resourceApproved = manifest.resource?.status === 'approved';
const resourceReviewable = ['ready-for-review', 'approved'].includes(manifest.resource?.status);
const resourceNotRequired = manifest.resource?.decision === 'not-warranted'
  && manifest.resource?.status === 'not-required'
  && manifest.resource?.validationStatus === 'not-required';
const resourceDistribution = manifest.resource?.distribution
  || (nonEmpty(manifest.resource?.pack) ? 'legacy-archive' : null);
const resourceDeliveryComplete = resourceDistribution === 'individual-files'
  ? localFile(manifest.resource?.instructionPdf)
    && localFile(manifest.resource?.guide)
    && localFile(manifest.resource?.downloadsManifest)
    && localFile(manifest.resource?.manifest)
    && Number(manifest.resource?.publicDownloadCount) >= 3
  : resourceDistribution === 'legacy-archive'
    && localFile(manifest.resource?.pack)
    && localFile(manifest.resource?.instructionPdf)
    && localFile(manifest.resource?.guide)
    && localFile(manifest.resource?.manifest);
const resourceComplete = resourceRequired ? resourceApproved : resourceNotRequired;
const websiteEligible = postPackageApproved;
const websiteReady = postPackageApproved
  && demandProofPassed
  && distributionReady
  && hooksApproved
  && captionApproved
  && visualApproved
  && motionComplete
  && resourceComplete;
const hookFileText = localText(manifest.hooks?.file);
const hookOptionsText = markdownSection(hookFileText, /^## Hook Options\s*$/);
const detectedHookCount = (hookOptionsText.match(/^\s*\d+\.\s+/gm) || []).length;
const finalCaptionText = markdownSection(
  hookFileText,
  /^## (?:Final Approved Caption|Final Caption(?:\s+[—-]\s+Awaiting Explicit Approval)?)\s*$/,
);
const linkedInExportInfo = pngDimensions(manifest.visual?.linkedinExport);
const maxLinkedInPhotoBytes = 5 * 1024 * 1024;

check('schema version is 2', manifest.schemaVersion === 2, 'Use templates/publish-manifest-template.json.');
check('manifest week matches its folder', manifest.week === basename(dirname(postDir)), 'Match manifest.week to the data week folder.');
check('manifest slug matches its folder', manifest.slug === basename(postDir), 'Match manifest.slug to the post folder name.');
check('hook status is valid', statusIn(manifest.hooks?.status, ['draft', 'ready-for-review', 'approved']), 'Use draft, ready-for-review, or approved.');
check('caption status is valid', statusIn(manifest.caption?.status, ['draft', 'ready-for-review', 'approved']), 'Use draft, ready-for-review, or approved.');
check('visual status is valid', statusIn(manifest.visual?.status, ['draft', 'ready-for-review', 'approved']), 'Use draft, ready-for-review, or approved.');
check('motion status is valid', statusIn(manifest.motion?.status, ['pending', 'ready-for-review', 'approved', 'still-only']), 'Use pending, ready-for-review, approved, or still-only.');
check('post package status is valid', statusIn(manifest.postPackage?.status, ['draft', 'ready-for-review', 'approved']), 'Use draft, ready-for-review, or approved.');
check('resource status is valid', statusIn(manifest.resource?.status, ['planned', 'building', 'ready-for-review', 'approved', 'not-required']), 'Use planned, building, ready-for-review, approved, or not-required.');
check('website status is valid', statusIn(manifest.website?.status, ['hold', 'eligible', 'ready']), 'Use hold, eligible, or ready.');
check(
  'demand-proof status is valid',
  !demandProofTracked || statusIn(manifest.demandProof?.status, ['pending', 'pass', 'reframe', 'park']),
  'Use pending, pass, reframe, or park.'
);
check(
  'distribution status is valid',
  !distributionTracked || statusIn(manifest.distribution?.status, ['draft', 'ready-for-review', 'approved']),
  'Use draft, ready-for-review, or approved.'
);
check('caption file exists', localFile(manifest.caption?.file), 'Save the caption file named in the manifest.');
check('hook file exists', localFile(manifest.hooks?.file), 'Save the hook candidates in the file named in the manifest.');
check('resource plan exists', localFile(manifest.resource?.plan), 'Complete resource-plan.md before handoff.');
check(
  'performance learning file exists',
  !manifest.performance?.file || localFile(manifest.performance.file),
  'Create post-performance-learning.md from the template when initializing the package.'
);

check(
  'reviewable hooks include at least 10 candidates',
  !hooksReviewable || detectedHookCount >= 10,
  'Generate at least 10 engineered hook candidates before approval.'
);
check(
  'manifest hook count matches the caption file',
  !hooksReviewable || manifest.hooks?.candidateCount === detectedHookCount,
  'Set hooks.candidateCount to the number of candidates under Hook Options.'
);
check('approved hooks name the selected hook', !hooksApproved || nonEmpty(manifest.hooks?.selectedHook), 'Record the selected hook verbatim.');
check('approved hooks have an approval timestamp', !hooksApproved || approvalTime(manifest.hooks?.approvedAt) !== null, 'Record explicit hook approval time.');
check(
  'selected hook is present in the caption file',
  !hooksApproved || hookFileText.includes(manifest.hooks.selectedHook),
  'Keep the selected hook verbatim in the approved caption file.'
);
check('approved caption has an approval timestamp', !captionApproved || approvalTime(manifest.caption?.approvedAt) !== null, 'Record explicit caption approval time.');
check('approved caption section is not empty', !captionApproved || nonEmpty(finalCaptionText), 'Save the final caption in its approved section.');
check(
  'selected hook opens the approved caption verbatim',
  !captionApproved || !hooksApproved || finalCaptionText.startsWith(manifest.hooks.selectedHook),
  'Use the selected hook as the first line of the final approved caption.'
);

check('approved visual exists', !visualApproved || localFile(manifest.visual?.file), 'Promote the exact approved still to visual.png.');
check('approved visual has completed QA', !visualApproved || localFile(manifest.visual?.qa), 'Complete the visual output review.');
check('approved visual has dimensions', !visualApproved || manifest.visual?.width > 0 && manifest.visual?.height > 0, 'Record canonical still dimensions.');
check('approved visual has an approval timestamp', !visualApproved || approvalTime(manifest.visual?.approvedAt) !== null, 'Record explicit still approval time.');
check(
  'approved visual has a 1080 x 1350 LinkedIn export',
  !visualApproved || (
    linkedInExportInfo?.width === 1080
    && linkedInExportInfo?.height === 1350
    && statSync(resolve(postDir, manifest.visual.linkedinExport)).size <= maxLinkedInPhotoBytes
  ),
  'Run scripts/export-linkedin-still.py and record visual-linkedin.png in visual.linkedinExport before still approval.'
);
check(
  'approved visual is itself 1080 x 1350',
  !visualApproved || (
    pngDimensions(manifest.visual?.file)?.width === 1080
    && pngDimensions(manifest.visual?.file)?.height === 1350
  ),
  'Keep model-native renders as candidates and promote exact 1080 x 1350 artwork to visual.png.'
);
check(
  'approved canonical and LinkedIn stills are byte-identical',
  !visualApproved || (
    sha256(manifest.visual?.file) !== null
    && sha256(manifest.visual?.file) === sha256(manifest.visual?.linkedinExport)
  ),
  'Write the same exact PNG bytes to visual.png and visual-linkedin.png.'
);

check('reviewable motion has GIF', !motionReviewable || manifest.motion?.status === 'still-only' || localFile(manifest.motion?.gif), 'Export the reviewable LinkedIn GIF.');
check('reviewable motion has MP4', !motionReviewable || manifest.motion?.status === 'still-only' || localFile(manifest.motion?.mp4), 'Export the reviewable website MP4.');
check('reviewable motion has completed QA', !motionReviewable || manifest.motion?.status === 'still-only' || localFile(manifest.motion?.qa), 'Complete motion QA before review.');
check('completed motion has an approval timestamp', !motionComplete || approvalTime(manifest.motion?.approvedAt) !== null, 'Record motion or still-only approval time.');
check('still-only motion records the exception', manifest.motion?.status !== 'still-only' || nonEmpty(manifest.motion?.stillOnlyReason), 'Record why motion does not improve the argument.');

check(
  'approved post package has every post component',
  !postPackageApproved || hooksApproved && captionApproved && visualApproved && motionComplete,
  'Approve hooks, caption, still, and motion before approving the post package.'
);
check('approved post package has an approval timestamp', !postPackageApproved || approvalTime(manifest.postPackage?.approvedAt) !== null, 'Record explicit post-package approval time.');

check(
  'required resource has a build decision',
  !resourceRequired || ['required', 'lightweight'].includes(manifest.resource?.decision),
  'Set resource.decision to required or lightweight.'
);
check(
  'reviewable resource is direct and validated',
  !resourceReviewable || (
    manifest.resource?.directDownloadNoEmail === true
    && manifest.resource?.validationStatus === 'passed'
    && nonEmpty(manifest.resource?.version)
    && resourceDeliveryComplete
  ),
  'Complete and validate the instruction PDF plus transparent individual-download library before review.'
);
check(
  'approved resource is direct and validated',
  !resourceApproved || (
    manifest.resource?.directDownloadNoEmail === true
    && manifest.resource?.validationStatus === 'passed'
    && nonEmpty(manifest.resource?.version)
    && resourceDeliveryComplete
    && approvalTime(manifest.resource?.approvedAt) !== null
  ),
  'Complete the versioned instruction PDF, individual downloads, manifests, and validation.'
);
check(
  'non-required resource records a final decision',
  resourceRequired || manifest.resource?.decision === 'pending' || resourceNotRequired,
  'Use pending while evaluating, or not-warranted with not-required statuses.'
);

check(
  'eligible website has an approved post package',
  !['eligible', 'ready'].includes(manifest.website?.status) || websiteEligible,
  'Keep website.status on hold until the complete post package is approved.'
);
check(
  'website hold is only valid before eligibility',
  manifest.website?.status !== 'hold' || !websiteEligible,
  'Move website.status to eligible after the complete post package is approved.'
);
check(
  'ready website has a complete post and resource decision',
  manifest.website?.status !== 'ready' || websiteReady,
  'Keep website.status eligible until the post package and required resource pass.'
);
check('ready website names the article path', manifest.website?.status !== 'ready' || nonEmpty(manifest.website?.articlePath), 'Record the website article route.');
check('ready required resource names its route', manifest.website?.status !== 'ready' || !resourceRequired || nonEmpty(manifest.website?.resourcePath), 'Record the website resource route.');

check('hooks are approved after the visual', !hooksApproved || !visualApproved || onOrAfter(manifest.hooks?.approvedAt, manifest.visual?.approvedAt), 'Approve the canonical still before the hooks.');
check('caption is approved after the hook', !captionApproved || !hooksApproved || onOrAfter(manifest.caption?.approvedAt, manifest.hooks?.approvedAt), 'Approve the selected hook before the caption.');
check('motion is completed after the caption', !motionComplete || !captionApproved || onOrAfter(manifest.motion?.approvedAt, manifest.caption?.approvedAt), 'Complete motion after the caption is approved.');
check('resource is approved after the post package', !resourceApproved || !postPackageApproved || onOrAfter(manifest.resource?.approvedAt, manifest.postPackage?.approvedAt), 'Approve the post package before approving the validated resource.');

if (requireReady) {
  check('demand proof is complete', demandProofPassed, 'Record 3 audience receipts, 2 source types, 3 historical priors, Tiger authority, a 75+ score, production depth, and a flagship challenge pass.');
  check('distribution plan is ready', distributionReady, 'Record the first-hour owner and seven-day follow-up angle before website readiness.');
  check('hooks are approved', hooksApproved, 'Record the selected hook and explicit approval.');
  check('caption is approved', captionApproved, 'Record explicit caption approval.');
  check('visual is approved', visualApproved, 'Record explicit still approval.');
  check('motion gate is complete', motionComplete, 'Approve motion or record a still-only exception.');
  check('post package is approved', postPackageApproved, 'Approve the complete integrated post package.');
  check('resource decision is complete', resourceComplete, 'Approve the required resource or record not-warranted.');
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

if (manifest.website?.status === 'ready') {
  console.log('\nREADY Post package and resource decision are ready for the website handoff.');
} else if (websiteEligible) {
  console.log(resourceComplete
    ? '\nELIGIBLE The approved package may be implemented on the website; set ready after routes and downloads are verified.'
    : '\nELIGIBLE The post package is approved; complete the resource decision before website readiness.');
} else {
  console.log('\nHOLD Website work remains blocked until the integrated post package is explicitly approved.');
}
