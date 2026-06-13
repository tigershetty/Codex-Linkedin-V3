/**
 * fetch-linkedin-saves.mjs
 *
 * Scrapes your LinkedIn saved posts ("My Items") and downloads:
 *   - Post images (JPG/PNG)
 *   - Caption text
 *   - Post URL + author
 *
 * Saves to: infographic-setup/memory/visual-benchmarks/
 *
 * SETUP (run once on your Mac):
 *   npm install playwright
 *   npx playwright install chromium
 *
 * USAGE:
 *   node fetch-linkedin-saves.mjs                              # uses LI_AT_COOKIE env var
 *   node fetch-linkedin-saves.mjs --cookie <li_at value>      # pass cookie directly
 *   node fetch-linkedin-saves.mjs --limit 50 --output ./out   # custom limit and output dir
 *   node fetch-linkedin-saves.mjs --dry-run                   # print what would be saved, no downloads
 *
 * HOW TO GET YOUR li_at COOKIE:
 *   1. Log into LinkedIn in Chrome
 *   2. Open DevTools (F12) → Application → Cookies → linkedin.com
 *   3. Find the cookie named "li_at" and copy its Value
 *   4. Set: export LI_AT_COOKIE="<that value>"
 *
 * OUTPUT:
 *   ./memory/visual-benchmarks/
 *     img-001.jpg
 *     img-002.jpg
 *     ...
 *     index.md   ← post URL + author + caption preview for each image
 */

import { chromium } from 'playwright';
import { mkdir, writeFile, appendFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');

// Parse CLI args
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const has = (flag) => args.includes(flag);

const COOKIE = get('--cookie') || process.env.LI_AT_COOKIE;
const LIMIT = parseInt(get('--limit') || '50', 10);
const OUTPUT_DIR = get('--output') || join(REPO_ROOT, 'infographic-setup', 'memory', 'visual-benchmarks');
const DRY_RUN = has('--dry-run');

if (!COOKIE && !DRY_RUN) {
  console.error('ERROR: No LinkedIn cookie provided.');
  console.error('  Set LI_AT_COOKIE env var, or pass --cookie <value>');
  console.error('  Run with --dry-run to test without a cookie.');
  process.exit(1);
}

async function fetchSavedPosts() {
  if (!DRY_RUN) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Limit: ${LIMIT} posts`);
  console.log(DRY_RUN ? 'DRY RUN — no files will be written.\n' : '');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  });

  // Inject LinkedIn auth cookie
  if (COOKIE) {
    await context.addCookies([{
      name: 'li_at',
      value: COOKIE,
      domain: '.linkedin.com',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    }]);
  }

  const page = await context.newPage();

  console.log('Navigating to LinkedIn saved items...');
  await page.goto('https://www.linkedin.com/my-items/saved-posts/', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Check if we're logged in
  const title = await page.title();
  if (title.includes('LinkedIn') && title.includes('Log In')) {
    console.error('ERROR: Not logged in. Cookie may be expired or invalid.');
    await browser.close();
    process.exit(1);
  }

  await page.waitForTimeout(2000);

  const results = [];
  let scrollAttempts = 0;
  const MAX_SCROLLS = 30;

  while (results.length < LIMIT && scrollAttempts < MAX_SCROLLS) {
    // Extract post cards from current view
    const posts = await page.evaluate(() => {
      const items = [];

      // LinkedIn saved posts use various container structures — try multiple selectors
      const containers = document.querySelectorAll([
        '[data-urn]',
        '.feed-shared-update-v2',
        '.ember-view.occludable-update',
        '.scaffold-finite-scroll__content > div > div'
      ].join(','));

      containers.forEach(el => {
        // Post URL
        const linkEl = el.querySelector('a[href*="/posts/"], a[href*="/feed/update/"]');
        const url = linkEl ? linkEl.href : null;
        if (!url) return;

        // Author
        const authorEl = el.querySelector('.update-components-actor__name, .feed-shared-actor__name, span.visually-hidden');
        const author = authorEl ? authorEl.textContent.trim() : 'Unknown';

        // Caption text
        const captionEl = el.querySelector('.feed-shared-update-v2__description, .update-components-text, [data-test-id="main-feed-activity-card__commentary"]');
        const caption = captionEl ? captionEl.textContent.trim().slice(0, 300) : '';

        // Image URL — look for the main post image (not avatar)
        const imgs = Array.from(el.querySelectorAll('img'));
        const postImg = imgs.find(img => {
          const src = img.src || img.dataset.delayedUrl || '';
          return src.includes('dms.licdn.com') && img.width > 100;
        });
        const imageUrl = postImg ? (postImg.src || postImg.dataset.delayedUrl || '') : null;

        items.push({ url, author, caption, imageUrl });
      });

      return items;
    });

    // Deduplicate by URL
    for (const p of posts) {
      if (!p.url) continue;
      if (results.some(r => r.url === p.url)) continue;
      results.push(p);
      if (results.length >= LIMIT) break;
    }

    console.log(`  Found ${results.length} posts so far...`);

    if (results.length >= LIMIT) break;

    // Scroll down to load more
    await page.evaluate(() => window.scrollBy(0, 1500));
    await page.waitForTimeout(1500);
    scrollAttempts++;
  }

  console.log(`\nTotal posts found: ${results.length}`);

  if (DRY_RUN) {
    results.slice(0, 5).forEach((p, i) => {
      console.log(`\n[${i + 1}] ${p.author}`);
      console.log(`    URL: ${p.url}`);
      console.log(`    Image: ${p.imageUrl || '(no image)'}`);
      console.log(`    Caption: ${p.caption.slice(0, 80)}...`);
    });
    await browser.close();
    return;
  }

  // Write index.md header
  const indexPath = join(OUTPUT_DIR, 'index.md');
  await writeFile(indexPath, `# LinkedIn Saved Posts — Benchmark Library\n**Scraped**: ${new Date().toISOString().split('T')[0]}\n**Count**: ${results.length}\n\n---\n\n`);

  // Download images + write index entries
  let imgCount = 0;
  for (const [i, post] of results.entries()) {
    const num = String(i + 1).padStart(3, '0');

    // Append to index
    await appendFile(indexPath, `## ${num}. ${post.author}\n**URL**: ${post.url}\n**Image**: ${post.imageUrl ? `img-${num}.jpg` : '(no image)'}\n\n> ${post.caption.replace(/\n/g, ' ')}\n\n---\n\n`);

    // Download image if present
    if (post.imageUrl) {
      try {
        const resp = await page.goto(post.imageUrl, { timeout: 15000 });
        const buf = await resp.body();
        await writeFile(join(OUTPUT_DIR, `img-${num}.jpg`), buf);
        imgCount++;
        process.stdout.write(`  Downloaded img-${num}.jpg\r`);
      } catch {
        // Image download failed — skip
      }
      await page.goBack().catch(() => {});
    }
  }

  console.log(`\nDone. ${imgCount} images saved to ${OUTPUT_DIR}`);
  console.log(`Index: ${indexPath}`);
  await browser.close();
}

fetchSavedPosts().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
