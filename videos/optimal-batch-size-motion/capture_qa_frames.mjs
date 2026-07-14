import { createRequire } from 'module';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';


const require = createRequire(import.meta.url);
const { chromium } = require('../../infographic-setup/renderer/node_modules/playwright');
const projectDir = dirname(fileURLToPath(import.meta.url));
const composition = resolve(projectDir, 'compositions/index.html');
const outputDir = resolve(projectDir, 'qa');
const times = [0, 0.85, 2.10, 3.16, 3.72, 4.72, 5.98, 7.35];

mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  deviceScaleFactor: 1,
  viewport: { width: 1003, height: 1568 },
});
const page = await context.newPage();
await page.goto(pathToFileURL(composition).href, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__ready === true);
const card = await page.$('#card');

for (const time of times) {
  await page.evaluate((value) => { window.__tl.time(value); }, time);
  const label = time.toFixed(2).replace('.', '-');
  await card.screenshot({ path: resolve(outputDir, `frame-${label}.png`) });
}

await browser.close();
console.log(`captured ${times.length} QA frames in ${outputDir}`);
