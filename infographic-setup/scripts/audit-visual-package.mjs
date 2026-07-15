#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';

const folder = process.argv[2];

if (!folder) {
  console.error('Usage: node scripts/audit-visual-package.mjs data/{week}/{slug}');
  process.exit(2);
}

const root = resolve(process.cwd());
const dir = resolve(root, folder);

function file(path) {
  return join(dir, path);
}

function read(path) {
  return readFileSync(file(path), 'utf8');
}

function has(path) {
  return existsSync(file(path));
}

function pngDimensions(path) {
  if (!has(path)) return null;
  const buffer = readFileSync(file(path));
  const signature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== signature) {
    return null;
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function contains(path, needle) {
  return has(path) && read(path).includes(needle);
}

function field(path, label) {
  if (!has(path)) return '';
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = read(path).match(new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

function filled(path, label) {
  const value = field(path, label);
  return Boolean(value) && !value.includes('{') && value.toLowerCase() !== 'todo';
}

function captionIndexCited() {
  const value = field('creative-brief-lite.md', 'Caption index ref');
  return /\brefs?\b/i.test(value) && /\d/.test(value);
}

function saveTriggerValid() {
  const value = field('creative-brief-lite.md', 'Save trigger').toLowerCase();
  return /\b(test|checklist|formula|map|prompt|template|decision rule|framework|reference card)\b/.test(value);
}

function logoAssetRefsValid() {
  const value = field('creative-brief-lite.md', 'Logo/asset references');
  if (!value) return false;

  const refs = [...value.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
  if (!refs.length) return false;

  return refs.every(
    (ref) => existsSync(resolve(root, ref)) || existsSync(resolve(root, '..', ref))
  );
}

function htmlControlRequired() {
  if (!has('creative-brief-lite.md')) return false;
  const brief = read('creative-brief-lite.md');
  return /^\*\*HTML control needed\?\*\*\s*yes\s*$/im.test(brief);
}

function reviewScores() {
  if (!has('visual-output-review.md')) return {};
  const scores = {};
  const re = /^\|\s*([^|]+?)\s*\|\s*([0-5](?:\.\d+)?)\s*\|/gm;
  const markdown = read('visual-output-review.md');
  let match;

  while ((match = re.exec(markdown))) {
    scores[match[1].trim()] = Number(match[2]);
  }

  return scores;
}

function scoreAtLeast(label, min) {
  const score = reviewScores()[label];
  return Number.isFinite(score) && score >= min;
}

function hardFailBoxesChecked() {
  if (!has('visual-output-review.md')) return false;
  const markdown = read('visual-output-review.md');
  return !/^- \[ \]/m.test(markdown) && /^- \[x\]/m.test(markdown);
}

function renderedAssetQaPresent() {
  if (!has('visual-output-review.md')) return false;
  const markdown = read('visual-output-review.md');
  return /##\s+\d+\.\s+Rendered Asset QA/i.test(markdown);
}

function renderedAssetQaChecked() {
  if (!renderedAssetQaPresent()) return false;
  const markdown = read('visual-output-review.md');
  const section = markdown.match(/##\s+\d+\.\s+Rendered Asset QA\s*\n([\s\S]*?)(?:\n##\s+\d+\.|$)/i)?.[1] || '';
  return /^- \[x\]/m.test(section) && !/^- \[ \]/m.test(section);
}

function publishDecisionReady() {
  const value = field('visual-output-review.md', 'Publish decision').toLowerCase();
  return Boolean(value) && /publish|selected|current best/.test(value) && !/regenerate|revise prompt|use html control/.test(value);
}

const requiresHtmlControl = htmlControlRequired();
const visualInfo = pngDimensions('visual.png');
const linkedInInfo = pngDimensions('visual-linkedin.png');
const maxLinkedInPhotoBytes = 5 * 1024 * 1024;
const reviewDimensions = [
  'Stop-scroll clarity',
  'Save utility',
  'Reference adaptation',
  "Shetty's Desk originality",
  'Visual argument',
  'Brand ownership',
  'Mobile readability',
];

const checks = [
  {
    name: 'content brief exists',
    pass: has('content-brief-v2.md'),
    fix: 'Add content-brief-v2.md from templates/content-brief-v2-template.md.',
  },
  {
    name: 'content brief has top-100 reference fit',
    pass: contains('content-brief-v2.md', 'Top-100 Reference Fit'),
    fix: 'Add the reference-proven promise, power format, save trigger, and originality layer.',
  },
  {
    name: 'reference learning card exists',
    pass: has('reference-learning-card.md'),
    fix: 'Add reference-learning-card.md from templates/reference-learning-card-template.md.',
  },
  {
    name: 'reference card has visual mechanics',
    pass: filled('reference-learning-card.md', 'Visual mechanics to borrow'),
    fix: 'Add concrete image-layout mechanics from the selected Top-100 reference images.',
  },
  {
    name: 'creative brief exists',
    pass: has('creative-brief-lite.md'),
    fix: 'Add creative-brief-lite.md from templates/creative-brief-lite-template.md.',
  },
  {
    name: 'creative brief cites caption index',
    pass: captionIndexCited(),
    fix: 'Add concrete top100-caption-index.md reference numbers to creative-brief-lite.md, such as refs 5, 70, and 87.',
  },
  {
    name: 'creative brief has audience payoff',
    pass: ['Audience segment', 'Audience job', 'After reading, they can', 'Meeting/task/career moment'].every((label) => filled('creative-brief-lite.md', label)),
    fix: 'Define who this helps, what job it serves, what they can do after reading, and the real work moment.',
  },
  {
    name: 'creative brief has stop-scroll promise',
    pass: ['Opening claim', 'Why this stops the right reader'].every((label) => filled('creative-brief-lite.md', label)) && saveTriggerValid(),
    fix: 'Add a specific opening claim, reader-recognition reason, and concrete save trigger.',
  },
  {
    name: 'creative brief has reference intelligence',
    pass: ['Power format', 'Structure reference lesson', 'Caption promise lesson', 'Craft/brand lesson'].every((label) => filled('creative-brief-lite.md', label)),
    fix: 'Define the Top-100 power format, structure lesson, caption promise lesson, and craft lesson.',
  },
  {
    name: 'creative brief has visual artifact and USP',
    pass: ['One-sentence visual move', 'Dominant shape/metaphor', 'Reusable artifact on image', 'Value-density layer', 'Why this beats a generic LinkedIn infographic', "Why this is Shetty's Desk"].every((label) => filled('creative-brief-lite.md', label)),
    fix: 'Define the visual move, dominant shape, reusable artifact, value-density layer, generic-creator beat, and Shetty-specific angle.',
  },
  {
    name: 'creative brief has logo asset references',
    pass: logoAssetRefsValid(),
    fix: 'Add Logo/asset references with backticked repo paths, including a Shetty logo and any named tool/platform logo assets.',
  },
  {
    name: 'creative brief has text placement map',
    pass: filled('creative-brief-lite.md', 'Text placement map') && /\b(title|matrix|loop|pillar|workflow|bottom|footer|zone|strip|module)\b/i.test(field('creative-brief-lite.md', 'Text placement map')),
    fix: 'Add a text placement map that assigns exact strings to their intended homes and blocks duplicate labels.',
  },
  {
    name: 'GPT Image 2 prompt exists',
    pass: has('gpt-image-2-prompt.md'),
    fix: 'Add gpt-image-2-prompt.md.',
  },
  {
    name: 'compiled GPT Image 2 prompt exists',
    pass: has('gpt-image-2-prompt-compiled.md'),
    fix: 'Run node scripts/compile-gpt-image-prompt.mjs data/{week}/{slug}.',
  },
  {
    name: 'prompt has reference intelligence',
    pass: contains('gpt-image-2-prompt.md', 'REFERENCE INTELLIGENCE'),
    fix: 'Add structure, caption promise, and craft reference lessons to the prompt.',
  },
  {
    name: 'prompt has creative USP',
    pass: contains('gpt-image-2-prompt.md', 'CREATIVE USP'),
    fix: 'State why this beats a generic LinkedIn infographic.',
  },
  {
    name: 'prompt gives GPT Image 2 composition freedom',
    pass: contains('gpt-image-2-prompt.md', 'IMAGE ENGINE INTENT') && contains('gpt-image-2-prompt.md', 'COMPOSITION FREEDOM') && contains('gpt-image-2-prompt.md', 'VALUE-DENSITY LAYER') && contains('gpt-image-2-prompt.md', 'premium creative renderer'),
    fix: 'Add image-engine intent, composition-freedom, and value-density blocks so GPT Image 2 can render a premium editorial artifact instead of a rigid dashboard spec.',
  },
  {
    name: 'prompt has logo and asset insert instructions',
    pass: contains('gpt-image-2-prompt.md', 'LOGO / ASSET INSERTS') && contains('gpt-image-2-prompt.md', 'Shetty') && contains('gpt-image-2-prompt.md', 'reference/insert inputs'),
    fix: 'Add logo/asset insert instructions to the GPT Image 2 prompt.',
  },
  {
    name: 'prompt has stop-scroll test',
    pass: contains('gpt-image-2-prompt.md', 'STOP-SCROLL TEST'),
    fix: 'State what the reader sees at feed size and why they save it.',
  },
  {
    name: 'prompt has text lock and hard risks',
    pass: contains('gpt-image-2-prompt.md', 'TEXT LOCK') && contains('gpt-image-2-prompt.md', 'TEXT PLACEMENT MAP') && contains('gpt-image-2-prompt.md', 'TEXT PLACEMENT RULE') && contains('gpt-image-2-prompt.md', 'exact casing') && contains('gpt-image-2-prompt.md', 'rail labels') && contains('gpt-image-2-prompt.md', 'HARD RISKS TO AVOID'),
    fix: 'Add exact text discipline, text-placement control, casing control, rail-label control, and a short hard-risk block to the GPT Image 2 prompt.',
  },
  {
    name: 'creative packet exists',
    pass: has('creative-packet.md'),
    fix: 'Run node scripts/compile-creative-packet.mjs data/{week}/{slug}.',
  },
  {
    name: 'creative packet is lean render context',
    pass: contains('creative-packet.md', 'Audience Payoff') && contains('creative-packet.md', 'Top-100 Adaptation') && contains('creative-packet.md', 'Exact Text') && contains('creative-packet.md', 'Text Placement Discipline') && contains('creative-packet.md', 'Value Density') && contains('creative-packet.md', 'Logo And Asset Inserts') && contains('creative-packet.md', 'Creative Direction') && contains('creative-packet.md', 'Image Engine Intent') && contains('creative-packet.md', 'Composition Freedom') && contains('creative-packet.md', 'QA Gate'),
    fix: 'Regenerate creative-packet.md so rendering can use a compact context handoff.',
  },
  {
    name: 'visual comparison exists',
    pass: has('visual-comparison.md'),
    fix: 'Add visual-comparison.md from templates/visual-comparison-template.md.',
  },
  {
    name: 'visual output review exists',
    pass: has('visual-output-review.md'),
    fix: 'Add visual-output-review.md from templates/visual-output-review-template.md.',
  },
  {
    name: 'visual output review has rendered asset QA',
    pass: renderedAssetQaPresent(),
    fix: 'Add the Rendered Asset QA section from templates/visual-output-review-template.md.',
  },
  {
    name: 'final visual exists and is non-empty',
    pass: has('visual.png') && statSync(file('visual.png')).size > 0,
    fix: 'Save selected final output as visual.png.',
  },
  {
    name: 'final visual meets LinkedIn file-size limit',
    pass: has('visual.png') && statSync(file('visual.png')).size <= maxLinkedInPhotoBytes,
    fix: 'Optimize visual.png below 5 MB without changing the approved artwork.',
  },
  {
    name: 'final visual has sufficient source resolution',
    pass: visualInfo && visualInfo.width >= 552 && visualInfo.height >= 276,
    fix: 'Export a source visual at least 552 x 276 pixels.',
  },
  {
    name: 'optional LinkedIn companion is 1080 x 1350',
    pass: !has('visual-linkedin.png') || (
      linkedInInfo?.width === 1080
      && linkedInInfo?.height === 1350
      && statSync(file('visual-linkedin.png')).size <= maxLinkedInPhotoBytes
    ),
    fix: 'Export visual-linkedin.png at exactly 1080 x 1350 and below 5 MB.',
  },
  {
    name: 'output review clears creative score floor',
    pass: reviewDimensions.every((label) => scoreAtLeast(label, 4)),
    fix: 'Revise/regenerate until every creative score is at least 4/5.',
  },
  {
    name: 'output review clears text/data integrity floor',
    pass: scoreAtLeast('Text/data integrity', 5),
    fix: 'Fix text, labels, or data implications until Text/data integrity is 5/5.',
  },
  {
    name: 'output review hard-fail boxes checked',
    pass: hardFailBoxesChecked(),
    fix: 'Complete the hard-fail checklist and resolve any unchecked item.',
  },
  {
    name: 'output review rendered asset QA passes',
    pass: renderedAssetQaChecked(),
    fix: 'Resolve rendered text, logo, placement, mobile readability, and visual/data contradiction issues before publish.',
  },
  {
    name: 'output review publish decision is ready',
    pass: publishDecisionReady(),
    fix: 'Set a clear publish/selected decision only after the review gate passes.',
  },
  {
    name: 'required HTML control exists',
    pass: !requiresHtmlControl || (has('html-control.png') && statSync(file('html-control.png')).size > 0),
    fix: 'Render the deterministic HTML backup and copy it into the post folder as html-control.png.',
  },
  {
    name: 'required HTML control is documented',
    pass: !requiresHtmlControl || contains('visual-comparison.md', 'html-control.png'),
    fix: 'Document the HTML control lane in visual-comparison.md.',
  },
];

let failures = 0;

for (const check of checks) {
  if (check.pass) {
    console.log(`PASS ${check.name}`);
  } else {
    failures += 1;
    console.log(`FAIL ${check.name}`);
    console.log(`     ${check.fix}`);
  }
}

if (visualInfo) {
  const ratio = visualInfo.width / visualInfo.height;
  if ((ratio < 0.8 || ratio > 3) && !has('visual-linkedin.png')) {
    console.warn(
      `WARN LinkedIn organic geometry: visual.png is ${visualInfo.width} x ${visualInfo.height} `
      + '(outside 3:1 to 4:5). Preserve the master and add a non-cropping 1080 x 1350 '
      + 'visual-linkedin.png before posting.'
    );
  }
}

if (failures) {
  console.error(`\n${failures} visual package check(s) failed.`);
  process.exit(1);
}

console.log('\nVisual package audit passed.');
