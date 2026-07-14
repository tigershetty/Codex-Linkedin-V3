/**
 * render.mjs — deterministic HTML→PNG renderer for Shetty's Desk infographic templates.
 *
 * Renders a 4:5 (1080x1350) template's #card element at 2x (→ 2160x2700 PNG).
 *
 * USAGE:
 *   NODE_PATH=$(npm root -g) node render.mjs                         # renders the two pilot templates
 *   NODE_PATH=$(npm root -g) node render.mjs templates/x.html out/x.png
 */
import { fileURLToPath } from 'url';
import { dirname, extname, relative, resolve } from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';
import { createServer } from 'http';
import { readFile } from 'fs/promises';

const require = createRequire(import.meta.url);

function loadPlaywright() {
  const roots = [
    process.env.PLAYWRIGHT_NODE_MODULES,
    ...(process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : []),
  ].filter(Boolean);

  try {
    roots.push(execSync('npm root -g').toString().trim());
  } catch {}

  for (const root of roots) {
    try {
      return require(root + '/playwright');
    } catch {}
  }

  return require('playwright');
}

const { chromium } = loadPlaywright();

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(__dirname, p);

const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

async function startStaticServer(root) {
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      const filePath = resolve(root, pathname.slice(1) || 'index.html');
      const rel = relative(root, filePath);
      if (rel.startsWith('..') || rel.includes('..')) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      const buf = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
      res.end(buf);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
  const { port } = server.address();
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolveClose) => server.close(resolveClose)),
  };
}

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
const staticServer = await startStaticServer(__dirname);

try {
  for (const [inp, outp] of jobs) {
    const url = /^https?:\/\//.test(inp) ? inp : `${staticServer.baseUrl}/${inp}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    try { await page.evaluate(() => document.fonts.ready); } catch {}
    await page.waitForFunction(
      () => window.__THREE_MATRIX_READY || !document.querySelector('#three-scene'),
      null,
      { timeout: 3000 },
    ).catch(() => {});
    await page.waitForTimeout(300);
    const el = await page.$('#card');
    await el.screenshot({ path: r(outp) });
    console.log('rendered', outp);
  }
} finally {
  await staticServer.close();
}

await browser.close();
