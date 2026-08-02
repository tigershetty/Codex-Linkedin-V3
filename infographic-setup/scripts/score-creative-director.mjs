#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { basename, join, resolve } from 'path';

const folder = process.argv[2];
const writeReport = process.argv.includes('--write');

if (!folder) {
  console.error('Usage: node scripts/score-creative-director.mjs data/{week}/{slug} [--write]');
  process.exit(2);
}

const root = resolve(process.cwd());
const dir = resolve(root, folder);

function file(name) {
  return join(dir, name);
}

function has(name) {
  return existsSync(file(name));
}

function read(name) {
  return readFileSync(file(name), 'utf8');
}

function field(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*(.*)$`, 'm');
  const match = markdown.match(re);
  return match ? match[1].trim() : '';
}

function wordCount(value) {
  return (value.match(/[A-Za-z0-9]+/g) || []).length;
}

function hasAny(value, words) {
  const text = value.toLowerCase();
  return words.some((word) => text.includes(word));
}

function countRefs(value) {
  return new Set((value.match(/\b\d{1,3}\b/g) || []).map(Number)).size;
}

function scoreDimension(name, checks) {
  const earned = checks.reduce((sum, check) => sum + (check.pass ? check.points : 0), 0);
  const possible = checks.reduce((sum, check) => sum + check.points, 0);
  const score = Math.round((earned / possible) * 20);
  return {
    name,
    score,
    checks,
    misses: checks.filter((check) => !check.pass).map((check) => check.fix),
  };
}

if (!has('creative-brief-lite.md')) {
  console.error(`Missing ${file('creative-brief-lite.md')}`);
  process.exit(1);
}

const brief = read('creative-brief-lite.md');
const ref = has('reference-learning-card.md') ? read('reference-learning-card.md') : '';
const prompt = has('gpt-image-2-prompt.md') ? read('gpt-image-2-prompt.md') : '';
const slug = field(brief, 'Slug') || basename(dir);

const audienceSegment = field(brief, 'Audience segment');
const audienceJob = field(brief, 'Audience job');
const afterReading = field(brief, 'After reading, they can');
const moment = field(brief, 'Meeting/task/career moment');
const openingClaim = field(brief, 'Opening claim');
const stopReason = field(brief, 'Why this stops the right reader');
const saveTrigger = field(brief, 'Save trigger');
const artifact = field(brief, 'Reusable artifact on image');
const holyGrailCandidate = field(brief, 'Holy Grail candidate?');
const holyGrailFit = field(brief, 'Holy Grail fit');
const referenceMode = field(brief, 'Reference mode');
const mechanicSource = field(brief, 'Evidence/mechanic source');
const powerFormat = field(brief, 'Power format');
const structureLesson = field(brief, 'Structure reference lesson');
const captionLesson = field(brief, 'Caption promise lesson');
const craftLesson = field(brief, 'Craft/brand lesson');
const captionIndex = field(brief, 'Caption index ref');
const genericBeat = field(brief, 'Why this beats a generic LinkedIn infographic');
const shettyBeat = field(brief, "Why this is Shetty's Desk");
const visualMove = field(brief, 'One-sentence visual move');
const labels = field(brief, 'Labels');
const textPlacementMap = field(brief, 'Text placement map');
const isHolyGrail = /^yes\b/i.test(holyGrailCandidate) || Boolean(holyGrailFit);
const usesTop100 = /top[- ]?100/i.test(referenceMode)
  || (!referenceMode && countRefs(captionIndex) >= 1 && !/not used|none|n\/a/i.test(captionIndex));

const referenceMechanics = field(ref, 'Visual mechanics to borrow');
const referencePromptLesson = field(ref, 'Reference lesson for GPT Image 2');
const whatToBorrow = field(ref, 'What to borrow');
const whatToAvoid = field(ref, 'What to avoid copying');
const supplyChainTranslation = field(ref, 'Supply-chain translation');

const domainWords = [
  'supplier',
  'vendor',
  'procurement',
  'purchasing',
  'review',
  'scorecard',
  'score',
  'metric',
  'planning',
  'forecast',
  'inventory',
  'capacity',
  'sourcing',
  'demand',
  'production',
  's&op',
  'sku',
  'replenishment',
  'warehouse',
  'logistics',
  'resilience',
  'disruption',
  'incident',
  'recovery',
  'response',
  'operating',
  'executive',
  'ai',
  'claude',
  'copilot',
];

const artifactWords = [
  'test',
  'checklist',
  'formula',
  'map',
  'prompt',
  'template',
  'decision rule',
  'framework',
  'matrix',
  'index',
  'loop',
  'curve',
  'card',
  'operating system',
  'field manual',
  'playbook',
  'review artifact',
  'os',
];

const tensionWords = [
  'not',
  'wrong',
  'fails',
  'failure',
  'risk',
  'stop',
  'spike',
  'nothing',
  'which',
  'why',
  'can',
  '?',
];

const dimensions = [
  scoreDimension('Audience payoff', [
    {
      points: 5,
      pass: wordCount(audienceSegment) >= 3 && hasAny(audienceSegment, domainWords),
      fix: 'Make the audience segment concrete and domain-specific.',
    },
    {
      points: 5,
      pass: wordCount(audienceJob) >= 2 && !/explain clearly$/i.test(audienceJob.trim()),
      fix: 'Use a specific reader job beyond a generic explain-clearly task.',
    },
    {
      points: 5,
      pass: wordCount(afterReading) >= 8 && hasAny(afterReading, domainWords),
      fix: 'Make the after-reading payoff a practical supply-chain action.',
    },
    {
      points: 5,
      pass: moment.split(',').filter((item) => wordCount(item) >= 2).length >= 2,
      fix: 'Name at least two concrete meetings, tasks, or workflow moments.',
    },
  ]),
  scoreDimension('Stop-scroll tension', [
    {
      points: 5,
      pass: wordCount(openingClaim) >= 5 && !/^what is\b/i.test(openingClaim),
      fix: 'Use a sharper opening claim than a definition-style headline.',
    },
    {
      points: 5,
      pass: hasAny(openingClaim, tensionWords),
      fix: 'Add visible tension, contradiction, risk, or a question to the opening claim.',
    },
    {
      points: 5,
      pass: wordCount(stopReason) >= 12 && hasAny(stopReason, domainWords),
      fix: 'Tie the stop-scroll reason to a recognizable supply-chain pain.',
    },
    {
      points: 5,
      pass: wordCount(visualMove) >= 12 && hasAny(visualMove, domainWords),
      fix: 'Make the visual move explain a real operating problem, not a generic layout.',
    },
  ]),
  scoreDimension('Save utility', [
    {
      points: 5,
      pass: hasAny(`${saveTrigger} ${artifact}`, artifactWords),
      fix: 'Name a reusable artifact such as a test, matrix, loop, checklist, formula, or decision rule.',
    },
    {
      points: 5,
      pass: wordCount(artifact) >= 3 && hasAny(artifact, domainWords),
      fix: 'Make the reusable artifact specific to the topic, not just "template" or "checklist."',
    },
    {
      points: 5,
      pass: wordCount(labels) >= 3 && labels.split(';').filter(Boolean).length <= 40 && wordCount(textPlacementMap) >= 10,
      fix: 'Use enough exact labels to make the artifact useful, keep the set controlled, then map every label to an intended placement home.',
    },
    {
      points: 5,
      pass: /Bottom question:\s*"/.test(prompt) || field(brief, 'Bottom question') || isHolyGrail,
      fix: 'Add a bottom question, or mark the post as a Holy Grail operating artifact with a clean logo/footer plan.',
    },
  ]),
  scoreDimension('Evidence/mechanic adaptation', [
    {
      points: 5,
      pass: usesTop100 ? countRefs(captionIndex) >= 1 : wordCount(referenceMode) >= 1 && wordCount(mechanicSource) >= 1,
      fix: usesTop100
        ? 'Cite at least one exact Top-100 caption index reference.'
        : 'Declare the non-Top-100 reference mode and its Tiger, peer, public-pain, primary-source, timely, or artifact mechanic.',
    },
    {
      points: 5,
      pass: usesTop100
        ? wordCount(referenceMechanics) >= 16 && hasAny(referenceMechanics, ['row', 'grid', 'map', 'loop', 'formula', 'card', 'legend', 'strip', 'rail', 'schema'])
        : wordCount(powerFormat) >= 1 && wordCount(structureLesson) >= 8,
      fix: usesTop100
        ? 'Extract concrete visual mechanics from the selected reference image.'
        : 'Translate the accepted evidence or operating artifact into a concrete power format and structure mechanic.',
    },
    {
      points: 5,
      pass: usesTop100 ? wordCount(referencePromptLesson) >= 8 : wordCount(captionLesson) >= 8,
      fix: usesTop100
        ? 'Add a GPT Image 2 lesson that tells the renderer what to make dominant.'
        : 'State the audience promise the non-Top-100 evidence/artifact mechanic must make legible.',
    },
    {
      points: 5,
      pass: usesTop100
        ? wordCount(whatToBorrow) >= 6 && wordCount(whatToAvoid) >= 6 && wordCount(supplyChainTranslation) >= 8
        : wordCount(craftLesson) >= 6 && wordCount(genericBeat) >= 10 && wordCount(shettyBeat) >= 10,
      fix: usesTop100
        ? 'Clarify what to borrow, what not to copy, and how the reference translates to supply chain.'
        : 'Define the craft lesson and make the artifact clearly better than generic content and specific to Shetty\'s Desk.',
    },
  ]),
  scoreDimension('Creative USP and renderer leverage', [
    {
      points: 5,
      pass: wordCount(genericBeat) >= 10 && !/generic linkedin infographic/i.test(genericBeat),
      fix: 'Make the generic-beating claim specific, not just a restatement of the field label.',
    },
    {
      points: 5,
      pass: wordCount(shettyBeat) >= 10 && hasAny(shettyBeat, domainWords),
      fix: 'Make the Shetty angle practitioner-specific and domain-grounded.',
    },
    {
      points: 5,
      pass: /IMAGE ENGINE INTENT:|CREATIVE DIRECTION:/i.test(prompt) && /premium creative renderer/i.test(prompt),
      fix: 'Use a prompt that explicitly lets GPT Image 2 act as a premium creative renderer.',
    },
    {
      points: 5,
      pass: /TEXT LOCK:/i.test(prompt) && /TEXT PLACEMENT MAP:/i.test(prompt) && /TEXT PLACEMENT RULE:/i.test(prompt),
      fix: 'Keep exact-text discipline and a per-label placement map in the prompt so creative freedom does not corrupt labels.',
    },
  ]),
];

const total = dimensions.reduce((sum, item) => sum + item.score, 0);
const failingDimensions = dimensions.filter((item) => item.score < 16);
const pass = total >= 85 && failingDimensions.length === 0;

const report = `# Creative Director Score — ${slug}

**Source:** \`${folder}\`  
**Threshold:** 85/100 and every dimension at least 16/20  
**Score:** ${total}/100  
**Decision:** ${pass ? 'PASS — ready for render/review' : 'FAIL — revise before render'}

| Dimension | Score |
|---|---:|
${dimensions.map((item) => `| ${item.name} | ${item.score}/20 |`).join('\n')}

## Misses

${dimensions.flatMap((item) => item.misses.map((miss) => `- **${item.name}:** ${miss}`)).join('\n') || '- None.'}

## Creative Director Rule

Do not fix a weak score by adding adjectives. Change the audience payoff, reference lesson, visual artifact, or exact on-image structure.
`;

process.stdout.write(report);

if (writeReport) {
  writeFileSync(file('creative-director-score.md'), report, 'utf8');
  console.log(`\nWrote ${folder}/creative-director-score.md`);
}

if (!pass) {
  process.exit(1);
}
