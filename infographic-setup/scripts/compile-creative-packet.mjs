#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { basename, join, resolve } from 'path';

const folder = process.argv[2];
const outArgIndex = process.argv.indexOf('--out');
const outName = outArgIndex >= 0 ? process.argv[outArgIndex + 1] : 'creative-packet.md';

if (!folder) {
  console.error('Usage: node scripts/compile-creative-packet.mjs data/{week}/{slug} [--out creative-packet.md]');
  process.exit(2);
}

const root = resolve(process.cwd());
const dir = resolve(root, folder);
const briefPath = join(dir, 'creative-brief-lite.md');
const refPath = join(dir, 'reference-learning-card.md');
const promptPath = join(dir, 'gpt-image-2-prompt.md');
const outPath = join(dir, outName);

if (!existsSync(briefPath)) {
  console.error(`Missing ${briefPath}`);
  process.exit(1);
}

function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function field(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

function section(markdown, title) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`^${escaped}\\n([\\s\\S]*?)(?:\\n\\n[A-Z][A-Z /-]+:\\n|$)`, 'm'));
  return match ? match[1].trim() : '';
}

const brief = read(briefPath);
const ref = read(refPath);
const prompt = read(promptPath);

const slug = field(brief, 'Slug') || basename(dir);
const labels = field(brief, 'Labels')
  .split(';')
  .map((item) => item.trim())
  .filter(Boolean);

const packet = `# Creative Packet — ${slug}

**Purpose:** minimal context for GPT Image 2 rendering and output QA. Use this packet instead of reopening the whole calendar, Top-100 workbook, or long planning docs unless the topic itself changes.

## Audience Payoff

- **Reader:** ${field(brief, 'Audience segment')}
- **Job:** ${field(brief, 'Audience job')}
- **After reading:** ${field(brief, 'After reading, they can')}
- **Work moment:** ${field(brief, 'Meeting/task/career moment')}

## Stop-Scroll And Save Reason

- **Opening claim:** ${field(brief, 'Opening claim')}
- **Why they stop:** ${field(brief, 'Why this stops the right reader')}
- **Save trigger:** ${field(brief, 'Save trigger')}
- **Reusable artifact:** ${field(brief, 'Reusable artifact on image')}
- **Value-density layer:** ${field(brief, 'Value-density layer')}

## Holy Grail Fit

- **Candidate:** ${field(brief, 'Holy Grail candidate?') || 'no'}
- **Fit:** ${field(brief, 'Holy Grail fit')}
- **Operating artifact:** ${field(brief, 'Operating artifact')}
- **Meeting moment:** ${field(brief, 'Meeting moment')}
- **Supply-chain scene:** ${field(brief, 'Supply-chain scene')}
- **Content backbone:** ${field(brief, 'Content backbone')}
- **Module map:** ${field(brief, 'Module map')}
- **Text lock:** ${field(brief, 'Text lock')}
- **Logo plan:** ${field(brief, 'Logo plan')}

## Top-100 Adaptation

- **Power format:** ${field(brief, 'Power format')}
- **Caption index refs:** ${field(brief, 'Caption index ref')}
- **Structure lesson:** ${field(brief, 'Structure reference lesson')}
- **Caption lesson:** ${field(brief, 'Caption promise lesson')}
- **Craft lesson:** ${field(brief, 'Craft/brand lesson')}
- **Reference card GPT lesson:** ${field(ref, 'Reference lesson for GPT Image 2') || 'See reference-learning-card.md'}
- **Visual mechanics:** ${field(ref, 'Visual mechanics to borrow') || 'See top100-visual-mechanics-index.md'}

## Creative USP

- **Beats generic because:** ${field(brief, 'Why this beats a generic LinkedIn infographic')}
- **Shetty's Desk angle:** ${field(brief, "Why this is Shetty's Desk")}

## Exact Text

- **Heading:** ${field(brief, 'Heading')}
- **Subheading:** ${field(brief, 'Subheading')}
- **Labels:** ${labels.join(' | ')}
- **Text placement map:** ${field(brief, 'Text placement map')}
- **Bottom question:** ${field(brief, 'Bottom question')}
- **Footer:** ${field(brief, 'Footer/chrome')}
- **Numbers/data:** ${field(brief, 'Numbers/data')}
- **Logo/asset references:** ${field(brief, 'Logo/asset references')}

## Text Placement Discipline

${section(prompt, 'TEXT PLACEMENT RULE:') || 'Use each supplied text string only in its intended home. Use symbols, ticks, lines, arrows, empty cells, or icons instead of inventing labels.'}

## Render Instruction

${section(prompt, 'VISUAL STRUCTURE:') || field(brief, 'One-sentence visual move')}

## Value Density

${section(prompt, 'VALUE-DENSITY LAYER:') || field(brief, 'Value-density layer')}

## Logo And Asset Inserts

${section(prompt, 'LOGO / ASSET INSERTS:') || field(brief, 'Logo/asset references')}

## Creative Direction

${section(prompt, 'CREATIVE DIRECTION:') || 'Use the image engine as a premium editorial renderer, while preserving exact text and the reusable artifact.'}

## Image Engine Intent

${section(prompt, 'IMAGE ENGINE INTENT:') || 'Give GPT Image 2 room to compose a visually forward editorial object while preserving the exact text and dominant artifact.'}

## Composition Freedom

${section(prompt, 'COMPOSITION FREEDOM:') || 'Do not follow a rigid HTML layout. Keep exact text locked, but let the renderer choose the strongest composition for the artifact.'}

## Post-Production Plan

${section(prompt, 'POST-PRODUCTION PLAN:') || field(brief, 'Logo plan') || 'Preserve the winning image. Change only explicitly requested cleanup elements.'}

## QA Gate

- Feed-size reader instantly sees the dominant shape: ${field(brief, 'Dominant shape/metaphor')}
- The visual contains the reusable artifact, not only decoration.
- For Holy Grail candidates, the render must feel comparable in ambition to \`data/2026-W28/supply-chain-resilience-os/visual.png\`.
- Cleanup must preserve the winning angle, 3D/isometric depth, shadows, desk props, and composition.
- On-image text uses only the exact strings above.
- Text/data integrity must score 5/5 before publish.
- Every creative score must be at least 4/5; world-class target is 5/5.
`;

writeFileSync(outPath, packet, 'utf8');
console.log(`Wrote ${outPath.replace(root + '/', '')}`);
