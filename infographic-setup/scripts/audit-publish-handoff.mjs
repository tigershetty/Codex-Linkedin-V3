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
const schemaVersion = manifest.schemaVersion;
const supportedSchema = schemaVersion === 1 || schemaVersion === 2;
const v4ReadyRequired = schemaVersion === 2
  && (requireReady || manifest.website?.status === 'ready');
const voiceReadyRequired = v4ReadyRequired;
const sourceModes = new Set(['fresh', 'approved-bank', 'research-led']);
const disclosureModes = new Set(['profile/footer', 'post-level', 'not-required']);
const transferStates = new Set(['pending', 'transferred', 'unclear', 'did_not_transfer']);
const claimModes = new Set([
  'documented_case',
  'public_data_analysis',
  'formula_or_method',
  'tool_workflow',
  'tiger_interpretation',
  'editorial_explainer',
  'sourced_fact',
  'comparative_or_causal',
  'simulation_or_hypothesis',
  'mixed',
]);
const supportRequiredClaimModes = new Set([
  'documented_case',
  'public_data_analysis',
  'formula_or_method',
  'tool_workflow',
  'sourced_fact',
  'comparative_or_causal',
  'mixed',
]);
const productionId = (value, prefix) => {
  const normalized = String(value ?? '').trim();
  return Boolean(normalized)
    && (!prefix || (Array.isArray(prefix)
      ? prefix.some((candidate) => normalized.startsWith(candidate))
      : normalized.startsWith(prefix)))
    && !/[{}]/.test(normalized)
    && !/(?:^|[-_:])(draft|placeholder|pending|todo|tbd)(?:$|[-_:])/i.test(normalized);
};
const uniqueProductionIds = (values, prefix) => Array.isArray(values)
  && values.length > 0
  && new Set(values).size === values.length
  && values.every((value) => productionId(value, prefix));

check('schema version is supported', supportedSchema, 'Use schema version 1 for legacy posts or the current schema-version-2 template.');
check('caption file exists', localFile(manifest.caption?.file), 'Save the caption file named in the manifest.');
check('approved visual exists', manifest.visual?.status !== 'approved' || localFile(manifest.visual?.file), 'Set visual.file to the approved active still path.');
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
if (voiceReadyRequired) {
  check(
    'ready handoff has the required Tiger source file',
    manifest.voice?.sourceMode === 'research-led' || localFile(manifest.voice?.sourceFile),
    'For fresh or approved-bank voice, create tiger-source.md and record it in the voice block. Use research-led only when no personal authority is claimed.'
  );
  check(
    'ready handoff has a valid voice source mode',
    sourceModes.has(manifest.voice?.sourceMode),
    'Set voice.sourceMode to fresh, approved-bank, or research-led.'
  );
  check(
    'ready handoff has approved provenance',
    manifest.voice?.provenanceStatus === 'approved',
    'Map personal claims to approved Tiger source IDs and public facts to the applicable support ledger or file.'
  );
  check(
    'ready handoff has approved voice QA',
    manifest.voice?.qaStatus === 'approved',
    'Complete the voice and authenticity QA before handoff.'
  );
  check(
    'ready handoff has explicit Tiger voice approval',
    manifest.voice?.status === 'approved' && Boolean(manifest.voice?.approvedAt),
    'Record explicit Tiger voice approval and its approval time.'
  );
  check(
    'ready handoff has an AI-disclosure decision',
    disclosureModes.has(manifest.voice?.aiDisclosure),
    'Set voice.aiDisclosure to profile/footer, post-level, or not-required after reviewing the material used.'
  );
}
check(
  'full resource is direct and validated',
  !['required', 'full resource'].includes(manifest.resource?.decision) || (
    manifest.resource?.directDownloadNoEmail === true
    && manifest.resource?.validationStatus === 'passed'
    && Boolean(manifest.resource?.version)
    && Boolean(manifest.resource?.pack)
  ),
  'Complete the versioned direct-download pack and its proportionate validation before website handoff.'
);

if (v4ReadyRequired) {
  check(
    'ready handoff has a production content ID',
    productionId(manifest.contentId, 'linkedin:'),
    'Replace the manifest contentId placeholder with the stable published-package ID.'
  );
  check(
    'ready handoff has a production creative bundle ID',
    productionId(manifest.intelligence?.creative_bundle_id, 'CB-'),
    'Record the exact ready Creative Genome bundle ID in intelligence.creative_bundle_id.'
  );
  check(
    'ready handoff records curated genome references',
    uniqueProductionIds(manifest.intelligence?.genome_reference_ids, ['LI-', 'TEXT-']),
    'Record the unique LI- or TEXT- reference IDs used by the approved creative bundle.'
  );
  check(
    'ready handoff records creative elements',
    uniqueProductionIds(manifest.intelligence?.creative_element_ids, 'CE-'),
    'Record the unique CE- element IDs that reached the public package.'
  );
  check(
    'ready handoff has a valid transfer state',
    transferStates.has(manifest.intelligence?.transfer_result),
    'Set transfer_result to pending before publication, then update it through the analytics checkpoints.'
  );
  check(
    'ready handoff has a selected claim mode',
    claimModes.has(manifest.claims?.claim_mode),
    'Replace the pending claim mode with the package claim mode.'
  );

  const supportLedger = manifest.claims?.support_ledger;
  check(
    'ready handoff has a valid support ledger',
    Array.isArray(supportLedger),
    'Keep support_ledger as an array; use an empty array only when no load-bearing public claims require a row.'
  );
  if (Array.isArray(supportLedger)) {
    check(
      'all declared public claims are supported',
      (!supportRequiredClaimModes.has(manifest.claims?.claim_mode) || supportLedger.length > 0)
      && supportLedger.every((row) => (
        productionId(row?.claim_id, 'CL-')
        && Boolean(String(row?.claim ?? '').trim())
        && claimModes.has(row?.claim_mode)
        && Array.isArray(row?.support_source_ids)
        && row.support_source_ids.length > 0
        && row.status === 'supported'
      )),
      'Remove claims that will not be published, or give every remaining CL- row an exact claim mode, support source IDs, and status supported.'
    );
  }

  const simulation = manifest.claims?.public_simulation;
  check(
    'public simulation declaration is safe',
    simulation?.present !== true || (
      ['simulation_or_hypothesis', 'mixed'].includes(manifest.claims?.claim_mode)
      && Boolean(String(simulation?.label ?? '').trim())
      && Boolean(String(simulation?.limitation ?? '').trim())
    ),
    'For a public simulation, select simulation_or_hypothesis or mixed and record the exact public label and limitation.'
  );

  const fixtures = manifest.claims?.internal_test_fixtures;
  check(
    'internal fixtures are excluded from public proof',
    fixtures?.excluded_from_public_proof === true
      && (fixtures?.present !== true || (Array.isArray(fixtures?.paths) && fixtures.paths.length > 0)),
    'Keep excluded_from_public_proof true and list fixture paths whenever internal test fixtures are present.'
  );
}

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
  console.log('\nHOLD Handoff is internally valid but waiting for explicit approvals.');
} else if (schemaVersion === 2 && manifest.voice?.status !== 'approved') {
  console.log('\nHOLD Handoff is internally valid but waiting for explicit voice approval.');
} else {
  console.log('\nPublish handoff is ready.');
}
