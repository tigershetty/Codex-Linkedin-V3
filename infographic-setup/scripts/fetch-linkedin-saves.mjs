/**
 * fetch-linkedin-saves.mjs
 *
 * Scrapes your LinkedIn saved posts and downloads images + captions.
 *
 * SETUP (run once):
 *   npm install playwright
 *   npx playwright install chromium
 *
 * USAGE:
 *   node fetch-linkedin-saves.mjs --cookie <li_at>         # run normally
 *   node fetch-linkedin-saves.mjs --debug                   # save screenshots to debug/
 *   node fetch-linkedin-saves.mjs --limit 30               # collect 30 posts
 *
 * GET YOUR li_at COOKIE:
 *   Chrome → F12 → Application tab → Cookies → linkedin.com → li_at → copy Value
 */

import { chromium } from 'playwright';
import { mkdir, writeFile, appendFile } from 'fs/promises';
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
  console.error('  Get it: Chrome → F12 → Application → Cookies → linkedin.com → li_at → copy Value');
  console.error('  Then:   node fetch-linkedin-saves.mjs --cookie <value>');
  process.exit(1);
}

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchSavedPosts() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  if (DEBUG) await mkdir(DEBUG_DIR, { recursive: true });

  console.log(`Output dir : ${OUTPUT_DIR}`);
  console.log(`Limit      : ${LIMIT} posts`);

  // Always headless — non-headless triggers LinkedIn bot detection
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US'
  });

  // ── Step 1: land on linkedin.com first, THEN set cookie ─────────────────
  // Setting cookies before any navigation sometimes fails. Landing on the
  // domain first ensures the cookie domain is accepted.
  const page = await context.newPage();
  console.log('\nLoading linkedin.com...');
  await page.goto('https://www.linkedin.com/', { waitUntil: 'domcontentloaded', timeout: 20000 });

  await context.addCookies([
    { name: 'li_at', value: COOKIE, domain: '.linkedin.com', path: '/', httpOnly: true, secure: true, sameSite: 'None' },
    { name: 'lang', value: 'v=2&lang=en-us', domain: '.linkedin.com', path: '/' }
  ]);

  // ── Step 2: navigate to saved posts ────────────────────────────────────
  console.log('Navigating to saved posts...');
  await page.goto('https://www.linkedin.com/my-items/saved-posts/', {
    waitUntil: 'domcontentloaded',   // ← NOT networkidle — avoids redirect loops
    timeout: 25000
  });

  // Verify we're logged in
  const url = page.url();
  if (url.includes('login') || url.includes('authwall') || url.includes('checkpoint')) {
    console.error('\nERROR: LinkedIn redirected to login/checkpoint — cookie may be expired.');
    console.error('Get a fresh li_at value from Chrome DevTools and try again.');
    if (DEBUG) await page.screenshot({ path: join(DEBUG_DIR, 'login-redirect.png') });
    await browser.close();
    process.exit(1);
  }

  console.log(`Loaded: ${url}`);

  // Wait for React to render the feed
  await wait(4000);

  if (DEBUG) {
    await page.screenshot({ path: join(DEBUG_DIR, '01-page-load.png'), fullPage: false });
    const html = await page.content();
    await writeFile(join(DEBUG_DIR, '01-page-load.html'), html);

    // Print what we can see
    const debug = await page.evaluate(() => {
      const sel = (s) => document.querySelectorAll(s).length;
      return {
        title: document.title,
        url: location.href,
        counts: {
          '[data-urn]': sel('[data-urn]'),
          '[data-id]': sel('[data-id]'),
          'article': sel('article'),
          'a[href*="/posts/"]': sel('a[href*="/posts/"]'),
          'a[href*="/feed/update/"]': sel('a[href*="/feed/update/"]'),
          'img[src*="licdn.com"]': sel('img[src*="licdn.com"]'),
          '.scaffold-layout__main': sel('.scaffold-layout__main'),
          '.artdeco-list__item': sel('.artdeco-list__item'),
        }
      };
    });
    console.log('\nDEBUG page state:');
    console.log('  Title:', debug.title);
    console.log('  URL:', debug.url);
    console.log('  Element counts:');
    Object.entries(debug.counts).forEach(([k, v]) => console.log(`    ${k}: ${v}`));
  }

  // ── Step 3: scroll and collect post URLs + images ───────────────────────
  const seenUrls = new Set();
  const results = [];
  let staleRounds = 0;

  console.log('\nScrolling and collecting posts...');

  for (let round = 0; round < 50 && results.length < LIMIT; round++) {

    const found = await page.evaluate(() => {
      const items = [];
      const seenHere = new Set();

      // ── Primary: find post cards by URL pattern ─────────────────────────
      // This works regardless of LinkedIn's class name changes.
      // A saved post card always has a link to the original post.
      const postLinks = Array.from(document.querySelectorAll(
        'a[href*="/posts/"], a[href*="/feed/update/"], a[href*="/activity:"]'
      ));

      for (const link of postLinks) {
        const url = link.href?.split('?')[0];
        if (!url || seenHere.has(url)) continue;
        seenHere.add(url);

        // Walk up to the post container
        let container = link;
        for (let i = 0; i < 8; i++) {
          container = container.parentElement;
          if (!container) break;
          // Stop at a sufficiently large container
          if (container.offsetHeight > 80) break;
        }
        if (!container) continue;

        // Author name — any bold/strong near the top of the container
        const authorEl = container.querySelector(
          'span[aria-hidden="true"], strong, [class*="actor__name"], [class*="name--"]'
        );
        const author = authorEl?.textContent?.trim() || 'Unknown';

        // Caption text — look for paragraphs or text containers
        const captionEl = container.querySelector(
          '[class*="commentary"], [class*="description"], [class*="text-view"], p'
        );
        const caption = captionEl?.textContent?.trim()?.slice(0, 300) || '';

        // Image from media.licdn.com (post images, not avatars)
        const imgs = Array.from(container.querySelectorAll('img'));
        const imgEl = imgs.find(img => {
          const src = img.src || '';
          return (src.includes('media.licdn.com') || src.includes('dms.licdn.com')) &&
                 !src.includes('profile-') &&
                 !src.includes('company-') &&
                 img.naturalWidth > 50;
        });
        const imageUrl = imgEl?.src || null;

        items.push({ url, author, caption, imageUrl });
      }

      return items;
    });

    let newThisRound = 0;
    for (const p of found) {
      if (seenUrls.has(p.url)) continue;
      seenUrls.add(p.url);
      results.push(p);
      newThisRound++;
      if (results.length >= LIMIT) break;
    }

    if (newThisRound === 0) {
      staleRounds++;
      if (staleRounds >= 6) {
        console.log('\n  No new posts after 6 scroll attempts — done.');
        break;
      }
    } else {
      staleRounds = 0;
    }

    process.stdout.write(`  Round ${String(round + 1).padStart(2)}: ${results.length} posts found\r`);
    if (results.length >= LIMIT) break;

    // Scroll
    await page.evaluate(() => window.scrollBy(0, 1400));
    await wait(2200);

    // Every 10 rounds, screenshot for debug
    if (DEBUG && round % 10 === 9) {
      await page.screenshot({ path: join(DEBUG_DIR, `scroll-round-${round + 1}.png`), fullPage: false });
    }
  }

  console.log(`\n\nTotal found: ${results.length} posts`);

  if (results.length === 0) {
    console.log('\nNo posts found. Run with --debug to capture screenshots.');
    console.log('Common causes:');
    console.log('  1. Cookie expired — get a fresh li_at from Chrome DevTools');
    console.log('  2. LinkedIn changed their DOM — paste the debug HTML here and the selector will be fixed');
    if (DEBUG) {
      await page.screenshot({ path: join(DEBUG_DIR, 'empty-result.png'), fullPage: true });
      console.log(`  Screenshot saved: ${join(DEBUG_DIR, 'empty-result.png')}`);
    }
    await browser.close();
    return;
  }

  // ── Step 4: write index.md and download images ──────────────────────────
  const indexPath = join(OUTPUT_DIR, 'index.md');
  await writeFile(indexPath,
    `# LinkedIn Saved Posts — Benchmark Library\n` +
    `**Scraped**: ${new Date().toISOString().split('T')[0]}\n` +
    `**Count**: ${results.length}\n\n---\n\n`
  );

  let imgCount = 0;
  for (const [i, post] of results.entries()) {
    const num = String(i + 1).padStart(3, '0');

    await appendFile(indexPath,
      `## ${num}. ${post.author}\n` +
      `**URL**: ${post.url}\n` +
      `**Image**: ${post.imageUrl ? `img-${num}.jpg` : '(text post — no image)'}\n\n` +
      `> ${post.caption.replace(/\n/g, ' ')}\n\n---\n\n`
    );

    if (post.imageUrl) {
      try {
        const resp = await fetch(post.imageUrl, {
          headers: { 'Referer': 'https://www.linkedin.com/', 'User-Agent': 'Mozilla/5.0' },
          signal: AbortSignal.timeout(12000)
        });
        if (resp.ok) {
          const buf = Buffer.from(await resp.arrayBuffer());
          await writeFile(join(OUTPUT_DIR, `img-${num}.jpg`), buf);
          imgCount++;
        }
      } catch { /* skip failed downloads */ }
    }

    process.stdout.write(`  Saved ${i + 1}/${results.length} entries\r`);
  }

  console.log(`\n\nDone.`);
  console.log(`  ${imgCount} images downloaded`);
  console.log(`  ${results.length} captions in index.md`);
  console.log(`  Folder: ${OUTPUT_DIR}`);
  console.log(`\nNext: git add infographic-setup/memory/visual-benchmarks/ && git commit -m "Add saved post benchmarks" && git push`);

  await browser.close();
}

fetchSavedPosts().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
