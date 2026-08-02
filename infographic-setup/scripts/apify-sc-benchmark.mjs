/**
 * apify-sc-benchmark.mjs
 *
 * Uses the Apify REST API (no MCP connector needed) to scrape PUBLIC LinkedIn
 * content for competitive benchmarking — top SC creator posts, hashtag content,
 * and infographic reference posts.
 *
 * NOTE: Apify cannot access your private saved posts (those require your session).
 * Saved-post refreshes use the approved read-only collection procedure documented with the
 * Creative Genome. The former direct-cookie collector is preserved in scripts-archive.
 * Use this script for: public profile posts, hashtag searches, competitor analysis.
 *
 * SETUP:
 *   Set APIFY_API_TOKEN env var (get from apify.com → Settings → Integrations)
 *
 * USAGE:
 *   node apify-sc-benchmark.mjs --mode hashtag --query "SupplyChain" --limit 20
 *   node apify-sc-benchmark.mjs --mode profile --url https://www.linkedin.com/in/martijn-lofvers/
 *   node apify-sc-benchmark.mjs --mode hashtag --query "Procurement" --limit 50 --output ./out
 *   node apify-sc-benchmark.mjs --dry-run    # prints the API request, no execution
 *
 * MODES:
 *   hashtag   → scrape recent posts under a hashtag (SC benchmark posts)
 *   profile   → scrape a specific creator's posts (competitor analysis)
 *
 * OUTPUT:
 *   ./memory/visual-benchmarks/apify-{mode}-{date}/
 *     img-001.jpg  (if post has image)
 *     index.md     (post URL + author + caption)
 *
 * GOOD ACTORS TO USE (from apify.com/store):
 *   - 'curious_coder/linkedin-post-scraper'  → hashtag or profile posts
 *   - 'apify/linkedin-profile-scraper'       → profile info + recent posts
 */

import { mkdir, writeFile, appendFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const has = (flag) => args.includes(flag);

const TOKEN = process.env.APIFY_API_TOKEN;
const MODE = get('--mode') || 'hashtag';
const QUERY = get('--query') || 'SupplyChain';
const PROFILE_URL = get('--url') || '';
const LIMIT = parseInt(get('--limit') || '20', 10);
const DRY_RUN = has('--dry-run');
const DATE_SLUG = new Date().toISOString().split('T')[0];
const OUTPUT_DIR = get('--output') || join(REPO_ROOT, 'infographic-setup', 'memory', 'visual-benchmarks', `apify-${MODE}-${DATE_SLUG}`);

// Actor to use (change this if you have a preferred actor)
const ACTOR_ID = 'curious_coder~linkedin-post-scraper';
const APIFY_BASE = 'https://api.apify.com/v2';

function buildInput() {
  if (MODE === 'hashtag') {
    return {
      hashtags: [QUERY.replace(/^#/, '')],
      resultsLimit: LIMIT,
      scrapePostContent: true
    };
  }
  if (MODE === 'profile') {
    return {
      profileUrls: [PROFILE_URL],
      resultsLimit: LIMIT,
      scrapePostContent: true
    };
  }
  throw new Error(`Unknown mode: ${MODE}. Use 'hashtag' or 'profile'.`);
}

async function runActor(input) {
  const runUrl = `${APIFY_BASE}/acts/${encodeURIComponent(ACTOR_ID)}/runs?token=${TOKEN}`;

  if (DRY_RUN) {
    console.log('DRY RUN — would POST to:', runUrl);
    console.log('Input:', JSON.stringify(input, null, 2));
    return null;
  }

  const res = await fetch(runUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Apify run failed: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.data;
}

async function waitForRun(runId) {
  const pollUrl = `${APIFY_BASE}/actor-runs/${runId}?token=${TOKEN}`;
  let status = 'RUNNING';
  let attempts = 0;

  while (['RUNNING', 'READY'].includes(status) && attempts < 60) {
    await new Promise(r => setTimeout(r, 5000));
    const res = await fetch(pollUrl);
    const data = await res.json();
    status = data.data?.status;
    process.stdout.write(`  Status: ${status}\r`);
    attempts++;
  }

  console.log(`\nRun finished with status: ${status}`);
  return status === 'SUCCEEDED';
}

async function getResults(datasetId) {
  const url = `${APIFY_BASE}/datasets/${datasetId}/items?token=${TOKEN}&limit=${LIMIT}`;
  const res = await fetch(url);
  const items = await res.json();
  return items;
}

async function downloadImage(url, path) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(path, buf);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!TOKEN && !DRY_RUN) {
    console.error('ERROR: APIFY_API_TOKEN not set.');
    console.error('  Get your token from: apify.com → Settings → Integrations');
    console.error('  Then: export APIFY_API_TOKEN="apify_api_xxxx..."');
    process.exit(1);
  }

  const input = buildInput();
  console.log(`Mode: ${MODE} | Query: ${QUERY || PROFILE_URL} | Limit: ${LIMIT}`);

  const run = await runActor(input);
  if (!run) return; // dry run

  console.log(`Run started: ${run.id}`);
  const succeeded = await waitForRun(run.id);

  if (!succeeded) {
    console.error('Run did not succeed. Check Apify console for details.');
    process.exit(1);
  }

  const items = await getResults(run.defaultDatasetId);
  console.log(`Retrieved ${items.length} posts`);

  await mkdir(OUTPUT_DIR, { recursive: true });
  const indexPath = join(OUTPUT_DIR, 'index.md');
  await writeFile(indexPath, `# Apify LinkedIn Scrape — ${MODE}: ${QUERY || PROFILE_URL}\n**Date**: ${DATE_SLUG}\n**Count**: ${items.length}\n\n---\n\n`);

  let imgCount = 0;
  for (const [i, item] of items.entries()) {
    const num = String(i + 1).padStart(3, '0');
    const url = item.postUrl || item.url || '';
    const author = item.authorName || item.author || 'Unknown';
    const caption = (item.text || item.content || item.description || '').slice(0, 300).replace(/\n/g, ' ');
    const imageUrl = item.image || item.imageUrl || item.media?.image || '';

    await appendFile(indexPath, `## ${num}. ${author}\n**URL**: ${url}\n**Image**: ${imageUrl ? `img-${num}.jpg` : '(no image)'}\n\n> ${caption}\n\n---\n\n`);

    if (imageUrl) {
      const saved = await downloadImage(imageUrl, join(OUTPUT_DIR, `img-${num}.jpg`));
      if (saved) imgCount++;
    }

    process.stdout.write(`  Processed ${i + 1}/${items.length}\r`);
  }

  console.log(`\nDone. ${imgCount} images downloaded to ${OUTPUT_DIR}`);
  console.log(`Index: ${indexPath}`);
  console.log('\nTo add these to the benchmark library, commit the output folder and run /pulse to analyse.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
