/**
 * render.mjs — deterministic HTML→PNG renderer for Shetty's Desk infographic templates.
 *
 * Renders a 4:5 (1080x1350) template's #card element at 2x (→ 2160x2700 PNG).
 *
 * USAGE:
 *   NODE_PATH=$(npm root -g) node render.mjs                         # renders the two pilot templates
 *   NODE_PATH=$(npm root -g) node render.mjs templates/x.html out/x.png
 */
import { pathToFileURL, fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';

// Resolve the globally-installed playwright by absolute path (no repo dependency added).
const require = createRequire(import.meta.url);
const globalRoot = execSync('npm root -g').toString().trim();
const { chromium } = require(globalRoot + '/playwright');

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(__dirname, p);

const args = process.argv.slice(2);
const jobs = args.length >= 2
  ? [[args[0], args[1]]]
  : [
      ['templates/pf1-maturity-ladder.html', 'out/pf1-maturity-ladder.png'],
      ['templates/pf5-radial-hub.html', 'out/pf5-radial-hub.png'],
    ];

const launchOpts = process.env.CHROME_PATH
  ? { executablePath: process.env.CHROME_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage'] }
  : {};
const browser = await chromium.launch(launchOpts);
const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 1080, height: 1350 } });
const page = await ctx.newPage();

for (const [inp, outp] of jobs) {
  await page.goto(pathToFileURL(r(inp)).href, { waitUntil: 'networkidle', timeout: 30000 });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await page.waitForTimeout(300);
  const el = await page.$('#card');
  await el.screenshot({ path: r(outp) });
  console.log('rendered', outp);
}

await browser.close();
