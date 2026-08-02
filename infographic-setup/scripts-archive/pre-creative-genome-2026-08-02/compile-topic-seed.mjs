#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { basename, dirname, resolve } from 'path';

const args = process.argv.slice(2);
const query = args.find((arg) => !arg.startsWith('--'));
const outArgIndex = args.indexOf('--out');
const outPath = outArgIndex >= 0 ? args[outArgIndex + 1] : '';

if (!query) {
  console.error('Usage: node scripts/compile-topic-seed.mjs <topic-or-slug> [--out path.md]');
  process.exit(2);
}

const root = resolve(process.cwd());
const calendarPath = resolve(root, 'references/calendar-reference-adaptation-map-v1.md');
const mechanicsPath = resolve(root, 'references/top100-visual-mechanics-index.md');
const captionIndexPath = resolve(root, 'references/top100-caption-index.md');
const visualInventoryPath = resolve(root, 'references/top100-visual-inventory.md');

function read(path) {
  return readFileSync(path, 'utf8');
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[`'’]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCalendar(markdown) {
  let section = '';
  let sectionIndex = 0;
  const rows = [];

  for (const line of markdown.split('\n')) {
    const heading = line.match(/^## (RW\d+ .*)$/);
    if (heading) {
      section = heading[1].trim();
      sectionIndex = 0;
      continue;
    }

    if (!line.startsWith('|') || line.includes('---') || line.includes('| Post | Audience job |')) {
      continue;
    }

    const cols = line.split('|').slice(1, -1).map((col) => col.trim());
    if (cols.length !== 7) continue;

    const post = cols[0].replace(/`/g, '');
    rows.push({
      section,
      slotIndex: sectionIndex,
      post,
      slug: slugify(post),
      audienceJob: cols[1],
      promise: cols[2],
      powerFormat: cols[3],
      captionPattern: cols[4],
      saveTrigger: cols[5],
      visualArgument: cols[6],
    });
    sectionIndex += 1;
  }

  return rows;
}

function parseMechanics(markdown) {
  const rows = [];

  for (const line of markdown.split('\n')) {
    if (!line.startsWith('|') || line.includes('---') || line.includes('| Format |')) continue;
    const cols = line.split('|').slice(1, -1).map((col) => col.trim());
    if (cols.length !== 3) continue;
    rows.push({
      format: cols[0],
      shape: cols[1],
      mechanics: cols[2],
    });
  }

  return rows;
}

function parseMarkdownTable(markdown, minCols) {
  const rows = [];

  for (const line of markdown.split('\n')) {
    if (!line.startsWith('|') || line.includes('---')) continue;
    const cols = line.split('|').slice(1, -1).map((col) => col.trim());
    if (cols.length < minCols) continue;
    rows.push(cols);
  }

  return rows;
}

function parseCaptionIndex(markdown) {
  const rows = [];

  for (const cols of parseMarkdownTable(markdown, 7)) {
    if (cols[0] === 'Ref') continue;
    const ref = Number(cols[0].replace(/[^0-9]/g, ''));
    if (!Number.isFinite(ref)) continue;
    rows.push({
      ref,
      image: cols[1],
      openingType: cols[2],
      opener: cols[3],
      promise: cols[4],
      artifact: cols[5],
      saveTrigger: cols[6],
    });
  }

  return rows;
}

function parseVisualInventory(markdown) {
  const rows = [];

  for (const cols of parseMarkdownTable(markdown, 8)) {
    if (cols[0] === 'Ref') continue;
    const ref = Number(cols[0].replace(/[^0-9]/g, ''));
    if (!Number.isFinite(ref)) continue;
    rows.push({
      ref,
      image: cols[1],
      size: cols[2],
      aspect: cols[3],
      opening: cols[4],
      artifact: cols[5],
      route: cols[6],
      saveTrigger: cols[7],
    });
  }

  return rows;
}

function formatKeys(powerFormat) {
  const keys = [];
  for (const pf of powerFormat.match(/\bPF[1-8]\b/g) || []) keys.push(pf);
  if (/process flow/i.test(powerFormat)) keys.push('Process flow');
  if (/concept metaphor/i.test(powerFormat)) keys.push('Concept metaphor');
  return [...new Set(keys)];
}

function matchingMechanics(powerFormat, mechanicsRows) {
  const keys = formatKeys(powerFormat);
  const matches = [];

  for (const key of keys) {
    const found = mechanicsRows.find((row) => row.format.startsWith(key));
    if (found) matches.push(found);
  }

  return matches;
}

function keywordSet(value) {
  const stop = new Set([
    'and', 'for', 'the', 'with', 'from', 'into', 'what', 'when', 'which', 'that',
    'this', 'your', 'their', 'they', 'can', 'does', 'will', 'why', 'how', 'are',
    'you', 'use', 'using', 'supply', 'chain',
  ]);
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stop.has(word))
  );
}

function overlappingKeywords(a, b) {
  const first = keywordSet(a);
  const second = keywordSet(b);
  let count = 0;
  for (const word of first) {
    if (second.has(word)) count += 1;
  }
  return count;
}

function artifactWords(value) {
  return [
    'checklist',
    'formula',
    'framework',
    'map',
    'prompt',
    'template',
    'decision rule',
    'reference card',
    'matrix',
    'index',
    'test',
  ].filter((word) => value.toLowerCase().includes(word));
}

function domainTerms(row) {
  const haystack = `${row.section} ${row.post} ${row.audienceJob} ${row.promise} ${row.visualArgument}`.toLowerCase();
  const families = [
    ['supplier', ['supplier', 'procurement', 'sourcing', 'vendor', 'rfq', 'contract']],
    ['procurement', ['procurement', 'sourcing', 'supplier', 'vendor', 'spend', 'contract', 'rfq']],
    ['forecast', ['forecast', 'demand', 'planning', 's&op', 'inventory']],
    ['demand', ['demand', 'forecast', 'planning', 'inventory', 's&op']],
    ['production', ['production', 'capacity', 'mps', 'bom', 'plant', 'lean']],
    ['capacity', ['capacity', 'production', 'plant', 'bottleneck', 'lean']],
    ['inventory', ['inventory', 'stock', 'sku', 'replenishment', 'safety stock', 'warehouse']],
    ['stock', ['inventory', 'stock', 'sku', 'replenishment', 'safety stock', 'warehouse']],
    ['sku', ['inventory', 'stock', 'sku', 'replenishment', 'warehouse']],
    ['ai', ['ai', 'claude', 'copilot', 'agentic', 'workflow', 'automation']],
  ];
  const terms = new Set(['supply chain']);

  for (const [trigger, values] of families) {
    if (haystack.includes(trigger)) {
      for (const value of values) terms.add(value);
    }
  }

  return [...terms];
}

function genericCreatorPenalty(haystack) {
  return /\blinkedin\b|content|creator|writers?|followers?|impressions?|viral|algorithm|outbound|growth|posting/.test(haystack);
}

function referenceCandidates(row, captions, visuals) {
  const byRef = new Map();
  for (const caption of captions) byRef.set(caption.ref, { ...caption });
  for (const visual of visuals) byRef.set(visual.ref, { ...byRef.get(visual.ref), ...visual });

  const keys = formatKeys(row.powerFormat);
  const wantedArtifacts = new Set([
    ...artifactWords(row.saveTrigger),
    ...artifactWords(row.captionPattern),
    ...artifactWords(row.powerFormat),
  ]);
  const topicText = `${row.post} ${row.audienceJob} ${row.promise} ${row.visualArgument}`;
  const wantedDomainTerms = domainTerms(row);

  return [...byRef.values()]
    .filter((item) => item.ref && item.image && !item.image.includes('no local image'))
    .map((item) => {
      const haystack = `${item.route || ''} ${item.artifact || ''} ${item.openingType || ''} ${item.opener || item.opening || ''} ${item.promise || ''} ${item.saveTrigger || ''}`.toLowerCase();
      let score = 0;
      const reasons = [];

      for (const key of keys) {
        const normalized = key.toLowerCase().replace(/\s*\/.*$/, '');
        if (haystack.includes(key.toLowerCase()) || haystack.includes(normalized)) {
          score += 6;
          reasons.push(`format match: ${key}`);
        }
      }

      for (const artifact of wantedArtifacts) {
        if (haystack.includes(artifact)) {
          score += 3;
          reasons.push(`artifact match: ${artifact}`);
        }
      }

      const topicOverlap = overlappingKeywords(topicText, haystack);
      if (topicOverlap > 0) {
        score += Math.min(topicOverlap, 4);
        reasons.push(`topic language overlap: ${topicOverlap}`);
      }

      const domainHits = wantedDomainTerms.filter((term) => haystack.includes(term));
      if (domainHits.length) {
        score += Math.min(domainHits.length * 3, 9);
        reasons.push(`domain fit: ${domainHits.slice(0, 3).join(', ')}`);
      } else if (genericCreatorPenalty(haystack)) {
        score -= 5;
        reasons.push('penalty: generic creator-growth reference');
      }

      if (/save|repost|comment|use|follow|which one|what.+challenge/i.test(item.saveTrigger || '')) {
        score += 1;
        reasons.push('clear caption action');
      }

      if (/4:5|1024:1536|1080x1350|1200x1500|1280x1600/.test(`${item.aspect || ''} ${item.size || ''}`)) {
        score += 1;
        reasons.push('LinkedIn portrait fit');
      }

      return { ...item, score, reasons };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.ref - b.ref)
    .slice(0, 5);
}

function audienceSegment(row) {
  const haystack = `${row.section} ${row.post}`.toLowerCase();
  if (haystack.includes('flexibility') || haystack.includes('demand spike') || haystack.includes('allocation')) return 'supply planners, category managers, procurement managers';
  if (haystack.includes('procurement') || haystack.includes('supplier')) return 'procurement managers, category managers, supply-chain managers';
  if (haystack.includes('demand') || haystack.includes('forecast')) return 'demand planners, S&OP analysts, supply planners';
  if (haystack.includes('production') || haystack.includes('capacity') || haystack.includes('mps') || haystack.includes('bom')) return 'production planners, supply planners, operations managers';
  if (haystack.includes('inventory') || haystack.includes('sku') || haystack.includes('replenishment')) return 'supply planners, inventory managers, finance partners';
  return 'supply-chain managers, planners, and operators';
}

function series(row) {
  return row.slotIndex >= 2 ? 'AI for Supply Chain' : 'Supply Chain 101';
}

function titleCase(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function openingClaim(row) {
  const seeWhy = row.promise.match(/^See why (.+)$/i);
  if (seeWhy) {
    return `Why ${seeWhy[1].replace(/\.$/, '')}`;
  }

  if (/see which/i.test(row.promise)) {
    return row.promise.replace(/^See which/i, 'Which').replace(/\.$/, '') + '?';
  }

  if (/know what/i.test(row.promise)) {
    return row.promise.replace(/^Know what/i, 'What').replace(/\.$/, '') + '?';
  }

  if (/know which/i.test(row.promise)) {
    return row.promise.replace(/^Know which/i, 'Which').replace(/\.$/, '') + '?';
  }

  const findWhether = row.promise.match(/^Find whether (.+?) improves (.+)$/i);
  if (findWhether) {
    return `Did ${findWhether[1]} improve ${findWhether[2].replace(/\.$/, '')}?`;
  }

  if (/find whether/i.test(row.promise)) {
    return row.promise.replace(/^Find whether/i, 'Does').replace(/\.$/, '') + '?';
  }

  if (/find the/i.test(row.promise)) {
    return row.promise.replace(/^Find the/i, 'Find the').replace(/\.$/, '');
  }

  return titleCase(row.slug);
}

const calendarRows = parseCalendar(read(calendarPath));
const mechanicsRows = parseMechanics(read(mechanicsPath));
const captionRows = existsSync(captionIndexPath) ? parseCaptionIndex(read(captionIndexPath)) : [];
const visualRows = existsSync(visualInventoryPath) ? parseVisualInventory(read(visualInventoryPath)) : [];
const querySlug = slugify(query);
const row = calendarRows.find((item) => item.slug === querySlug || item.post.toLowerCase() === query.toLowerCase());

if (!row) {
  console.error(`No topic found for "${query}".`);
  console.error('Try one of:');
  for (const item of calendarRows.slice(0, 12)) console.error(`- ${item.post}`);
  process.exit(1);
}

const mechanics = matchingMechanics(row.powerFormat, mechanicsRows);
const mechanicsText = mechanics.length
  ? mechanics.map((item) => `${item.format}: ${item.mechanics}`).join(' / ')
  : 'Select one visual mechanics seed from top100-visual-mechanics-index.md.';
const stopShape = mechanics.length
  ? mechanics.map((item) => item.shape).join(' + ')
  : row.powerFormat;
const candidates = referenceCandidates(row, captionRows, visualRows);
const candidateText = candidates.length
  ? candidates.map((item) => {
      const image = item.image || `ref ${item.ref}`;
      const opener = item.opener || item.opening || 'No opener captured';
      const route = item.route || 'route needs manual inspection';
      const artifact = item.artifact || 'artifact needs manual inspection';
      const why = item.reasons.slice(0, 3).join('; ');
      return `- **Ref ${item.ref}:** ${image} — ${route}; artifact: ${artifact}; opener: "${opener}"; why: ${why}.`;
    }).join('\n')
  : '- No automatic shortlist found. Open `references/top100-contact-sheet.html` and choose 3 refs manually.';

const output = `# Topic Creative Seed — ${row.slug}

**Source:** \`references/calendar-reference-adaptation-map-v1.md\`  
**Run week:** ${row.section}  
**Topic:** ${row.post}  
**Suggested series:** ${series(row)}  

## Audience Value

**Audience segment:** ${audienceSegment(row)}  
**Audience job:** ${row.audienceJob.toLowerCase()}  
**After reading, they can:** ${row.promise.charAt(0).toLowerCase()}${row.promise.slice(1)}.  
**Meeting/task/career moment:** use in the next review, planning meeting, working session, or exception discussion tied to this topic.

## Stop-Scroll Promise

**Opening claim:** ${openingClaim(row)}  
**Why this stops the right reader:** it turns a familiar supply-chain problem into a visible ${stopShape} they can use at work.  
**Save trigger:** ${row.saveTrigger}

## Reference Intelligence

**Power format:** ${row.powerFormat}  
**Structure reference lesson:** ${row.visualArgument}.  
**Caption promise lesson:** ${row.captionPattern}; promise a practical artifact, not a definition.  
**Caption index ref:** start with the shortlisted refs below, then choose the best 1-3 exact refs from \`top100-caption-index.md\`.  
**Craft/brand lesson:** use Cobalt Grid restraint with one dominant artifact, exact text placement, and reference-led micro-detail.
**Visual mechanics seed:** ${mechanicsText}

### Reference Shortlist From Top-100 Images + Captions

**Sources:** \`top100-visual-inventory.md\` + \`top100-caption-index.md\`  
${candidateText}

**How to use the shortlist:** open the candidate images in \`references/top 100/\`, inspect them visually, and fill one \`reference-learning-card.md\` with the mechanics you are actually adapting.

## Visual Argument

**One-sentence visual move:** Show ${row.visualArgument}.  
**Dominant shape/metaphor:** ${stopShape}  
**Eye path:** headline -> dominant artifact -> proof/check section -> bottom save/use question  
**Reusable artifact on image:** ${row.saveTrigger}

## Creative USP

**Why this beats a generic LinkedIn infographic:** it gives the reader a usable ${row.saveTrigger}, not a decorative explanation of ${row.post}.  
**Why this is Shetty's Desk:** it translates the concept into practical operating judgment for real supply-chain work.

## Next Step

Use this seed to fill \`creative-brief-lite.md\`, then run:

\`\`\`bash
node scripts/build-visual-package.mjs data/{week}/${row.slug}
\`\`\`
`;

if (outPath) {
  const resolvedOut = resolve(root, outPath);
  if (!existsSync(dirname(resolvedOut))) {
    console.error(`Output directory does not exist: ${dirname(resolvedOut)}`);
    process.exit(1);
  }
  writeFileSync(resolvedOut, output, 'utf8');
  console.log(`Wrote ${resolvedOut.replace(root + '/', '')}`);
} else {
  process.stdout.write(output);
}
