#!/usr/bin/env node
/**
 * verify-sources.mjs — verify the source URLs in a reference doc via Firecrawl.
 *
 * WHY: this sandbox's egress is GitHub+npm only, so most source URLs in
 * references/layout-frameworks-intelligence.md cannot be fetched directly.
 * Firecrawl crawls SERVER-SIDE, so once `api.firecrawl.dev` is allowlisted and a
 * FIRECRAWL_API_KEY is set, this script verifies every URL and flips ○ -> ✅.
 *
 * USAGE:
 *   node scripts/verify-sources.mjs                 # dry-run: list URLs, write a report
 *   node scripts/verify-sources.mjs --apply         # also flip ○ -> ✅ in the doc for verified URLs
 *   FILE=references/other.md node scripts/verify-sources.mjs
 *
 * REQUIRES (in a fresh, configured session):
 *   - env FIRECRAWL_API_KEY=fc-...
 *   - api.firecrawl.dev allowlisted in the environment's network egress settings
 * Without the key it prints setup instructions and the URL inventory, then exits 0.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');                       // infographic-setup/
const FILE = process.env.FILE || 'references/layout-frameworks-intelligence.md';
const filePath = resolve(root, FILE);
const apply = process.argv.includes('--apply');
const KEY = process.env.FIRECRAWL_API_KEY;
const API = 'https://api.firecrawl.dev/v1/scrape';

const raw = readFileSync(filePath, 'utf8');

// --- extract unique URLs (strip trailing punctuation) ---
const urlRe = /https?:\/\/[^\s)\]<>"'`]+/g;
const seen = new Set();
const urls = [];
for (const m of raw.matchAll(urlRe)) {
  let u = m[0].replace(/[.,;:·•]+$/, '');
  if (!seen.has(u)) { seen.add(u); urls.push(u); }
}
console.log(`Found ${urls.length} unique URLs in ${FILE}`);

if (!KEY) {
  console.log(`
⚠️  FIRECRAWL_API_KEY is not set and/or api.firecrawl.dev is not reachable.
   To run the real verification:
     1. Add FIRECRAWL_API_KEY=fc-... to the environment (secret / env var).
     2. Allowlist  api.firecrawl.dev  in the environment's network egress settings.
     3. Start a NEW Claude Code session (env + egress apply on a fresh container).
     4. Re-run:  node scripts/verify-sources.mjs --apply
   URLs that would be verified:`);
  urls.forEach((u, i) => console.log(`   ${String(i + 1).padStart(3)}. ${u}`));
  process.exit(0);
}

// --- verify each URL through Firecrawl (server-side fetch) ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function scrape(url, tries = 2) {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true, timeout: 25000 }),
    });
    if (res.status === 429 && tries > 0) { await sleep(6000); return scrape(url, tries - 1); }
    const j = await res.json().catch(() => ({}));
    const md = j?.data?.metadata || {};
    const status = md.statusCode ?? (res.ok ? 200 : res.status);
    const ok = (j?.success === true) && status >= 200 && status < 400;
    return { ok, status, title: (md.title || '').trim().slice(0, 90), error: j?.error || md.error || '' };
  } catch (e) {
    return { ok: false, status: 0, title: '', error: String(e.message || e) };
  }
}

const results = [];
for (const [i, u] of urls.entries()) {
  process.stdout.write(`[${i + 1}/${urls.length}] ${u} ... `);
  const r = await scrape(u);
  results.push({ url: u, ...r });
  console.log(r.ok ? `✅ ${r.status} ${r.title}` : `✗ ${r.status} ${r.error}`);
  await sleep(1200); // be gentle on rate limits
}

const okSet = new Set(results.filter((r) => r.ok).map((r) => r.url));
const nOk = okSet.size;

// --- write a verification report ---
const reportPath = resolve(root, 'references/source-verification-report.md');
const today = new Date().toISOString().slice(0, 10);
const report = [
  `# Source Verification Report`,
  `Generated ${today} via Firecrawl (\`scripts/verify-sources.mjs\`) against \`${FILE}\`.`,
  `Verified ${nOk}/${urls.length} URLs.`,
  ``,
  `| # | Status | HTTP | Title | URL |`,
  `|---|---|---|---|---|`,
  ...results.map((r, i) =>
    `| ${i + 1} | ${r.ok ? '✅' : '✗'} | ${r.status || '-'} | ${(r.title || r.error || '').replace(/\|/g, '/').slice(0, 70)} | ${r.url} |`),
  ``,
].join('\n');
writeFileSync(reportPath, report);
console.log(`\nReport → references/source-verification-report.md (${nOk}/${urls.length} verified)`);

// --- optionally flip ○ -> ✅ for verified URLs, pairing each ○ with the URL that follows it on its line ---
if (apply) {
  const lines = raw.split('\n');
  let flips = 0;
  for (let li = 0; li < lines.length; li++) {
    let line = lines[li];
    if (!line.includes('○')) continue;
    const lineUrls = [...line.matchAll(urlRe)].map((m) => ({ u: m[0].replace(/[.,;:·•]+$/, ''), idx: m.index }));
    if (!lineUrls.length) continue;
    let cursor = 0, out = line, shift = 0;
    for (const { u, idx } of lineUrls) {
      const seg = line.slice(cursor, idx);
      const rel = seg.lastIndexOf('○');
      if (rel !== -1 && okSet.has(u)) {
        const abs = cursor + rel + shift;
        out = out.slice(0, abs) + '✅' + out.slice(abs + 1);
        flips++;
      }
      cursor = idx + u.length;
    }
    lines[li] = out;
  }
  if (flips) {
    writeFileSync(filePath, lines.join('\n'));
    console.log(`Applied: flipped ${flips} ○ -> ✅ in ${FILE}`);
  } else {
    console.log(`Applied: no ○ markers paired with verified URLs (nothing to flip).`);
  }
}
