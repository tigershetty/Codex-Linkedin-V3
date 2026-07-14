#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { basename, join, resolve } from 'path';

const folder = process.argv[2];
const outArgIndex = process.argv.indexOf('--out');
const outName = outArgIndex >= 0 ? process.argv[outArgIndex + 1] : 'gpt-image-2-prompt-compiled.md';

if (!folder) {
  console.error('Usage: node scripts/compile-gpt-image-prompt.mjs data/{week}/{slug} [--out gpt-image-2-prompt.md]');
  process.exit(2);
}

const root = resolve(process.cwd());
const dir = resolve(root, folder);
const briefPath = join(dir, 'creative-brief-lite.md');
const refPath = join(dir, 'reference-learning-card.md');
const outPath = join(dir, outName);

if (!existsSync(briefPath)) {
  console.error(`Missing ${briefPath}`);
  process.exit(1);
}

function read(path) {
  return readFileSync(path, 'utf8');
}

function field(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*(.*)$`, 'm');
  const match = markdown.match(re);
  return match ? match[1].trim() : '';
}

function splitList(value) {
  return value
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

function stripTrailingPeriod(value) {
  return value.replace(/[.。]+$/u, '');
}

function sentence(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function requireField(obj, key) {
  if (!obj[key]) {
    console.error(`Missing required creative brief field: ${key}`);
    process.exit(1);
  }
}

const brief = read(briefPath);
const ref = existsSync(refPath) ? read(refPath) : '';

const data = {
  week: field(brief, 'Week'),
  slug: field(brief, 'Slug') || basename(dir),
  series: field(brief, 'Series'),
  audienceSegment: field(brief, 'Audience segment'),
  audienceJob: field(brief, 'Audience job'),
  afterReading: field(brief, 'After reading, they can'),
  moment: field(brief, 'Meeting/task/career moment'),
  openingClaim: field(brief, 'Opening claim'),
  stopReason: field(brief, 'Why this stops the right reader'),
  saveTrigger: field(brief, 'Save trigger'),
  powerFormat: field(brief, 'Power format'),
  structureLesson: field(brief, 'Structure reference lesson'),
  captionLesson: field(brief, 'Caption promise lesson'),
  captionIndex: field(brief, 'Caption index ref'),
  craftLesson: field(brief, 'Craft/brand lesson'),
  visualMove: field(brief, 'One-sentence visual move'),
  metaphor: field(brief, 'Dominant shape/metaphor'),
  eyePath: field(brief, 'Eye path'),
  artifact: field(brief, 'Reusable artifact on image'),
  valueDensity: field(brief, 'Value-density layer'),
  holyGrailCandidate: field(brief, 'Holy Grail candidate?'),
  holyGrailFit: field(brief, 'Holy Grail fit'),
  operatingArtifact: field(brief, 'Operating artifact'),
  meetingMoment: field(brief, 'Meeting moment'),
  supplyChainScene: field(brief, 'Supply-chain scene'),
  contentBackbone: field(brief, 'Content backbone'),
  moduleMap: field(brief, 'Module map'),
  textLock: field(brief, 'Text lock'),
  logoPlan: field(brief, 'Logo plan'),
  heading: field(brief, 'Heading'),
  subheading: field(brief, 'Subheading'),
  labels: field(brief, 'Labels'),
  textPlacementMap: field(brief, 'Text placement map'),
  bottomQuestion: field(brief, 'Bottom question'),
  footer: field(brief, 'Footer/chrome'),
  numbers: field(brief, 'Numbers/data'),
  logoAssets: field(brief, 'Logo/asset references'),
  genericBeat: field(brief, 'Why this beats a generic LinkedIn infographic'),
  shettyBeat: field(brief, "Why this is Shetty's Desk"),
};

[
  'audienceSegment',
  'audienceJob',
  'afterReading',
  'openingClaim',
  'saveTrigger',
  'powerFormat',
  'visualMove',
  'metaphor',
  'valueDensity',
  'heading',
  'subheading',
  'labels',
  'textPlacementMap',
  'logoAssets',
  'genericBeat',
  'shettyBeat',
].forEach((key) => requireField(data, key));

const refPromptLesson = field(ref, 'Reference lesson for GPT Image 2');
const refVisualMechanics = field(ref, 'Visual mechanics to borrow');
const refCaptionLesson = field(ref, 'Reference lesson for caption');

const labels = splitList(data.labels);
const labelLines = labels.length
  ? labels.map((label) => `  - "${label}"`).join('\n')
  : '  - [labels missing]';

const isHolyGrail = /^yes\b/i.test(data.holyGrailCandidate) || Boolean(data.holyGrailFit);
const holyGrailBlock = isHolyGrail
  ? `
HOLY GRAIL CALIBER:
Use \`data/2026-W28/supply-chain-resilience-os/visual.png\` as the quality bar: a premium one-page operating artifact staged in a clean 3D/isometric supply-chain scene. Do not copy that topic or layout exactly. Match the level of clarity, depth, usefulness, dimensional polish, and brand authorship.
Holy Grail fit: ${data.holyGrailFit || '[missing]'}

ARTIFACT-FIRST DIRECTION:
The artifact is the hero. The surrounding 3D scene supports the topic and adds credibility, but it must not steal attention from the operating tool.
Operating artifact: ${data.operatingArtifact || data.artifact || '[missing]'}
Meeting moment: ${data.meetingMoment || data.moment || '[missing]'}
Supply-chain scene: ${data.supplyChainScene || '[missing]'}
Content backbone: ${data.contentBackbone || '[missing]'}

MODULE MAP:
${data.moduleMap || '[missing: list 5-9 modules and the distinct visual metaphor for each]'}

POST-PRODUCTION PLAN:
${data.logoPlan || "Reserve a clean logo zone for the exact Shetty's Desk logo."} ${data.textLock ? `Text lock note: ${data.textLock}` : ''} Preserve the winning camera angle, 3D/isometric depth, desk props, shadows, and composition during cleanup. Remove only explicitly requested chips, source lines, or footer elements.
`
  : '';

const prompt = `# GPT Image 2 Prompt — ${data.slug}

**Compiled by:** \`scripts/compile-gpt-image-prompt.mjs\`  
**Week:** ${data.week}  
**Series:** ${data.series}  
**Source brief:** \`creative-brief-lite.md\`  
**Reference card:** \`reference-learning-card.md\`  

## Prompt

TASK:
Create a world-class editorial LinkedIn infographic for Shetty's Desk.
${holyGrailBlock}

AUDIENCE VALUE:
This is for ${data.audienceSegment}. They are trying to ${data.audienceJob}. After reading, they can ${stripTrailingPeriod(data.afterReading)}.
Moment of use: ${stripTrailingPeriod(data.moment || 'a real supply-chain meeting or workflow')}.

REFERENCE INTELLIGENCE:
- Structure: ${data.powerFormat} -> ${data.structureLesson}
- Caption promise: ${data.captionIndex || 'top-100 caption index'} -> ${data.captionLesson}
- Craft: Cobalt Grid brand frame -> ${data.craftLesson}
${refPromptLesson ? `- Reference card lesson: ${refPromptLesson}` : ''}
${refVisualMechanics ? `- Visual mechanics: ${refVisualMechanics}` : ''}
${refCaptionLesson ? `- Caption lesson: ${refCaptionLesson}` : ''}

CREATIVE USP:
${sentence(data.genericBeat)}
This is Shetty's Desk because ${stripTrailingPeriod(data.shettyBeat)}.

STOP-SCROLL TEST:
At feed size, the reader should see ${data.metaphor} and think: "${data.stopReason}"

VISUAL STRUCTURE:
${data.visualMove}
Eye path: ${data.eyePath}
Reusable artifact: ${data.artifact}.

VALUE-DENSITY LAYER:
${data.valueDensity}

CREATIVE DIRECTION:
Use GPT Image 2 as the premium creative renderer, not as a dashboard generator. Build one memorable editorial artifact that feels designed, useful, and ownable at LinkedIn feed size. The reader should want to save it because it looks like a practical tool for ${stripTrailingPeriod(data.moment || 'a real supply-chain workflow')}, not because it is decorative.

IMAGE ENGINE INTENT:
Give the image engine room to compose a visually forward editorial object. Prioritize hierarchy, depth, texture, rhythm, and reference-led craft over literal boxes. The structure must remain clear, but the rendering can use high-craft visual micro-detail: grid tension, ledger ticks, structural arrows, callout rails, layered paper depth, exact spacing, subtle technical marks, purposeful empty space, and one striking hero artifact. Make it feel like a world-class saved reference from a specialist creator, not a templated corporate slide.

COMPOSITION FREEDOM:
Do not follow a rigid HTML layout. Keep the exact text locked, but choose the strongest composition for the artifact: asymmetric grid, layered matrix, annotated system object, ranked index, decision loop, formula card, or structural metaphor, whichever best expresses ${data.metaphor}. Make the reference intelligence visible through the composition, not through copied styling.

CONTENT:
- Heading: "${data.heading}"
- Subheading: "${data.subheading}"
- Labels:
${labelLines}
${data.bottomQuestion ? `- Bottom question: "${data.bottomQuestion}"\n` : ''}- Footer/chrome: "${data.footer}"

LOGO / ASSET INSERTS:
Use these repo assets as reference/insert inputs during GPT Image 2 iteration: ${data.logoAssets}. For the Shetty's Desk logo, reserve a clean uncluttered footer logo zone that can receive the exact logo asset after generation; do not invent, redraw, clip, box, or approximate the wordmark. When a named AI tool appears in the visual, use the supplied tool logo/symbol asset as a small interface or workflow cue in its intended zone. Keep tool symbols smaller than their text labels. Do not create fake partner/customer/vendor marks.

TEXT PLACEMENT MAP:
${data.textPlacementMap}

TEXT LOCK:
Only render the text strings listed in CONTENT, with exact casing. Do not add extra section headers, rail labels, tab labels, slogans, captions, internal labels, framework names, abbreviations, codes, or explanatory questions. Do not repeat workflow words as separate side tabs or band headers. The reusable artifact should be communicated through the visual structure and the supplied labels, not by inventing new words.

TEXT PLACEMENT RULE:
Use each supplied text string only in its intended home from TEXT PLACEMENT MAP. Do not turn allowed labels into standalone side tabs, rail labels, band headers, duplicate badges, repeated workflow labels, or extra navigation. If the layout needs a cue, use symbols, ticks, lines, arrows, empty cells, or icons instead of new words.

BRAND:
Warm cream paper, electric cobalt ink, visible grid discipline, editorial serif headline, restrained sans labels, mono technical chrome, flat structural depth. The design should feel like a premium two-color editorial supply-chain reference card, not a corporate dashboard.

INTEGRITY:
Numbers/data status: ${data.numbers}. Use only the supplied text. If the heading includes a conceptual number, keep that number exactly as written and do not invent any other statistics. Make labels large enough to survive LinkedIn mobile feed size. If space is tight, move labels outside the structure as callout tags instead of cramping them inside decorative elements.

HARD RISKS TO AVOID:
Misspelled text, wrong casing, invented section labels, invented statistics, generic card grid, decorative icons that overpower labels, or a visual that looks useful but does not contain a reusable artifact.
`;

writeFileSync(outPath, prompt, 'utf8');
console.log(`Wrote ${outPath.replace(root + '/', '')}`);
