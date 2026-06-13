/**
 * fetch-linkedin-saves.mjs
 *
 * Scrapes your LinkedIn saved posts ("My Items") and downloads images + captions.
 *
 * SETUP (run once):
 *   npm install playwright
 *   npx playwright install chromium
 *
 * USAGE:
 *   node fetch-linkedin-saves.mjs --cookie <li_at>        # run for real
 *   node fetch-linkedin-saves.mjs --debug                  # save screenshot + HTML to debug/
 *   node fetch-linkedin-saves.mjs --limit 30 --output ./out
 *
 * GET YOUR li_at COOKIE:
 *   Chrome → DevTools (F12) → Application → Cookies → linkedin.com → li_at → copy Value
 */

import { chromium } from 'playwright';
import { mkdir, writeFile, appendFile, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const has = (flag) => args.includes(flag);

const COOKIE = get('--cookie') || process.env.LI_AT_COOKIE;
const LIMIT = parseInt(get('--limit') || '50', 10);
const OUTPUT_DIR = get('--output') || join(REPO_ROOT, 'infographic-setup', 'memory', 'visual-benchmarks');
const DEBUG = has('--debug');
const DEBUG_DIR = join(REPO_ROOT, 'infographic-setup', 'scripts', 'debug');

if (!COOKIE) {
  console.error('ERROR: LinkedIn cookie not provided.');
  console.error('  Get it from: Chrome → DevTools → Application → Cookies → linkedin.com → li_at');
  console.error('  Then run: node fetch-linkedin-saves.mjs --cookie <value>');
  console.error('  Or set:   export LI_AT_COOKIE="<value>"');
  process.exit(1);
}

async function fetchSavedPosts() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  if (DEBUG) await mkdir(DEBUG_DIR, { recursive: true });

  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Limit: ${LIMIT} posts`);
  if (DEBUG) console.log('DEBUG mode on — saving screenshots + HTML to:', DEBUG_DIR);

  const browser = await chromium.launch({
    headless: !DEBUG, // show browser window in debug mode so you can see what's happening
    slowMo: DEBUG ? 500 : 0
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  });

  // Set LinkedIn auth cookies
  await context.addCookies([
    { name: 'li_at', value: COOKIE, domain: '.linkedin.com', path: '/', httpOnly: true, secure: true, sameSite: 'None' },
    { name: 'lang', value: 'v=2&lang=en-us', domain: '.linkedin.com', path: '/' }
  ]);

  const page = await context.newPage();

  // ── Navigate to saved posts ──────────────────────────────────────────────
  const SAVED_URL = 'https://www.linkedin.com/my-items/saved-posts/';
  console.log(`\nNavigating to ${SAVED_URL} ...`);
  await page.goto(SAVED_URL, { waitUntil: 'networkidle', timeout: 30000 });

  // Check login status
  const currentUrl = page.url();
  if (currentUrl.includes('login') || currentUrl.includes('authwall')) {
    console.error('\nERROR: Redirected to login page — cookie has expired or is invalid.');
    console.error('Please copy a fresh li_at cookie from Chrome DevTools.');
    await browser.close();
    process.exit(1);
  }

  // Wait for content to appear
  await page.waitForTimeout(3000);

  if (DEBUG) {
    // Save screenshot and page HTML to understand the structure
    const screenshotPath = join(DEBUG_DIR, 'page-initial.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Screenshot saved: ${screenshotPath}`);

    const html = await page.content();
    await writeFile(join(DEBUG_DIR, 'page-initial.html'), html);
    console.log(`HTML saved: ${join(DEBUG_DIR, 'page-initial.html')}`);

    // Print all data-urn attributes to understand LinkedIn's structure
    const urns = await page.evaluate(() => {
      const els = document.querySelectorAll('[data-urn], [data-id], article');
      return Array.from(els).slice(0, 20).map(el => ({
        tag: el.tagName,
        urn: el.dataset.urn || el.dataset.id || '',
        classes: el.className.split(' ').slice(0, 3).join(' '),
        text: el.textContent.trim().slice(0, 80)
      }));
    });
    console.log('\nPage elements with data-urn / data-id / article:');
    urns.forEach(u => console.log(`  [${u.tag}] urn="${u.urn}" class="${u.classes}" text="${u.text}"`));

    // Also check what main selectors resolve to
    const selectors = [
      '.scaffold-layout__main',
      '[data-urn]',
      '.artdeco-list__item',
      '.feed-shared-update-v2',
      'article',
      '[class*="save"]',
      '[class*="item"]',
      '.reusable-search__result-container'
    ];
    console.log('\nSelector counts:');
    for (const sel of selectors) {
      const count = await page.locator(sel).count();
      console.log(`  ${sel}: ${count}`);
    }
  }

  // ── Scroll and collect posts ─────────────────────────────────────────────
  const results = [];
  let lastCount = -1;
  let staleRounds = 0;

  console.log('\nScrolling and collecting posts...');

  for (let round = 0; round < 40 && results.length < LIMIT; round++) {
    // Try every selector strategy LinkedIn might use
    const posts = await page.evaluate(() => {
      const found = [];
      const seen = new Set();

      // Strategy 1: data-urn on feed items
      document.querySelectorAll('[data-urn]').forEach(el => {
        const urn = el.dataset.urn;
        if (!urn || seen.has(urn)) return;
        seen.add(urn);

        const linkEl = el.querySelector('a[href*="/posts/"], a[href*="/feed/update/"], a[href*="/activity"]');
        const url = linkEl?.href;
        if (!url) return;

        const author = el.querySelector(
          '.update-components-actor__name, .feed-shared-actor__name, .actor-name, [class*="actor__name"]'
        )?.textContent?.trim() || 'Unknown';

        const caption = el.querySelector(
          '[class*="commentary"], [class*="description"], .feed-shared-text, .break-words'
        )?.textContent?.trim()?.slice(0, 300) || '';

        const imgs = Array.from(el.querySelectorAll('img'));
        const imgEl = imgs.find(img => {
          const src = img.src || img.dataset.src || img.dataset.delayedUrl || '';
          return (src.includes('media.licdn.com') || src.includes('dms.licdn.com')) &&
                 img.getAttribute('aria-hidden') !== 'true' &&
                 (img.offsetWidth > 100 || img.naturalWidth > 100);
        });
        const imageUrl = imgEl?.src || imgEl?.dataset?.src || imgEl?.dataset?.delayedUrl || null;

        found.push({ url, author, caption, imageUrl, urn });
      });

      // Strategy 2: artdeco list items (saved items page uses a different layout)
      document.querySelectorAll('.artdeco-list__item, .scaffold-finite-scroll__content > *').forEach(el => {
        const linkEl = el.querySelector('a[href*="/posts/"], a[href*="/feed/update/"]');
        const url = linkEl?.href;
        if (!url || seen.has(url)) return;
        seen.add(url);

        const author = el.querySelector('[class*="title"], [class*="name"], strong')?.textContent?.trim() || 'Unknown';
        const caption = el.querySelector('[class*="subtitle"], [class*="description"], p')?.textContent?.trim()?.slice(0, 300) || '';

        const imgs = Array.from(el.querySelectorAll('img'));
        const imgEl = imgs.find(img => img.offsetWidth > 50);
        const imageUrl = imgEl?.src || null;

        found.push({ url, author, caption, imageUrl, urn: url });
      });

      return found;
    });

    // Merge deduplicated results
    for (const p of posts) {
      if (!p.url || results.some(r => r.url === p.url)) continue;
      results.push(p);
      if (results.length >= LIMIT) break;
    }

    if (results.length === lastCount) {
      staleRounds++;
      if (staleRounds >= 5) {
        console.log('  No new posts loading after 5 scroll attempts — stopping.');
        break;
      }
    } else {
      staleRounds = 0;
    }

    lastCount = results.length;
    process.stdout.write(`  Found ${results.length} posts (round ${round + 1})\r`);

    if (results.length >= LIMIT) break;

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 1200));
    await page.waitForTimeout(2000);

    // On first failure round, try clicking "Saved posts" tab explicitly
    if (round === 2 && results.length === 0) {
      console.log('\n  Trying "Saved posts" tab...');
      const savedTab = await page.locator('a:has-text("Saved posts"), button:has-text("Saved posts"), [aria-label*="Saved"]').first();
      if (await savedTab.count() > 0) {
        await savedTab.click();
        await page.waitForTimeout(2000);
      }

      if (DEBUG) {
        await page.screenshot({ path: join(DEBUG_DIR, 'page-after-tab.png'), fullPage: false });
        const html2 = await page.content();
        await writeFile(join(DEBUG_DIR, 'page-after-tab.html'), html2);
        console.log('  Saved post-tab screenshot and HTML.');
      }
    }
  }

  console.log(`\n\nTotal posts found: ${results.length}`);

  if (results.length === 0) {
    console.log('\nNo posts found. Try running with --debug to see screenshots of what the browser sees.');
    console.log('The debug output will be saved to:', DEBUG_DIR);
    await browser.close();
    return;
  }

  // ── Write index and download images ──────────────────────────────────────
  const indexPath = join(OUTPUT_DIR, 'index.md');
  await writeFile(indexPath,
    `# LinkedIn Saved Posts — Benchmark Library\n**Scraped**: ${new Date().toISOString().split('T')[0]}\n**Count**: ${results.length}\n\n---\n\n`
  );

  let imgCount = 0;
  for (const [i, post] of results.entries()) {
    const num = String(i + 1).padStart(3, '0');
    await appendFile(indexPath,
      `## ${num}. ${post.author}\n**URL**: ${post.url}\n**Image**: ${post.imageUrl ? `img-${num}.jpg` : '(no image — text post)'}\n\n> ${post.caption.replace(/\n/g, ' ')}\n\n---\n\n`
    );

    if (post.imageUrl) {
      try {
        const resp = await fetch(post.imageUrl, {
          headers: { 'Referer': 'https://www.linkedin.com/', 'User-Agent': 'Mozilla/5.0' }
        });
        if (resp.ok) {
          const buf = Buffer.from(await resp.arrayBuffer());
          await writeFile(join(OUTPUT_DIR, `img-${num}.jpg`), buf);
          imgCount++;
        }
      } catch {
        // Image download failed silently
      }
    }

    process.stdout.write(`  Saved ${i + 1}/${results.length} posts\r`);
  }

  console.log(`\nDone. ${imgCount} images + ${results.length} captions saved to:`);
  console.log(`  ${OUTPUT_DIR}`);
  console.log(`  Index: ${indexPath}`);
  console.log('\nNext step: git add + commit + push so this session can read them.');

  await browser.close();
}

fetchSavedPosts().catch(err => {
  console.error('\nError:', err.message);
  if (DEBUG) console.error(err.stack);
  process.exit(1);
});
