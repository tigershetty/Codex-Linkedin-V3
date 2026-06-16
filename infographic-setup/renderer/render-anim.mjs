/**
 * render-anim.mjs — deterministic HTML+GSAP → MP4/GIF renderer for Shetty's Desk infographics.
 *
 * Loads a template whose GSAP master timeline is exposed on window.__tl (paused), scrubs it
 * frame-by-frame (so output is pixel-deterministic, not real-time), screenshots #card each
 * frame, then assembles frames into an MP4 (full res) and a GIF (downscaled) via ffmpeg-static.
 *
 * USAGE:
 *   node render-anim.mjs templates/pf7-blueprint-draft-anim.html out/pf7-blueprint-draft
 *   (writes out/pf7-blueprint-draft.mp4 and out/pf7-blueprint-draft.gif)
 */
import { pathToFileURL, fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';
import { execSync, spawnSync } from 'child_process';
import { mkdirSync, rmSync, readdirSync } from 'fs';

const require = createRequire(import.meta.url);
const globalRoot = execSync('npm root -g').toString().trim();
const { chromium } = require(globalRoot + '/playwright');
const ffmpeg = require('ffmpeg-static');

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p) => resolve(__dirname, p);

const args = process.argv.slice(2);
const inp = args[0] || 'templates/pf7-blueprint-draft-anim.html';
const outBase = args[1] || 'out/pf7-blueprint-draft';
const FPS = 25;
const HOLD_S = Number(process.env.HOLD_S ?? 0);  // 0 = seamless loop (timeline fades out itself)
const W = 1080, H = 1350;

const framesDir = r('out/_frames');
rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1, viewport: { width: W, height: H } });
const page = await ctx.newPage();
await page.goto(pathToFileURL(r(inp)).href, { waitUntil: 'networkidle', timeout: 30000 });
try { await page.evaluate(() => document.fonts.ready); } catch {}
await page.waitForFunction(() => window.__ready === true, { timeout: 10000 });

const dur = await page.evaluate(() => window.__dur);
const el = await page.$('#card');
const total = Math.ceil(dur * FPS);
const hold = Math.round(HOLD_S * FPS);
let n = 0;

for (let i = 0; i <= total; i++) {
  const t = Math.min(i / FPS, dur);
  await page.evaluate((tt) => { window.__tl.time(tt); }, t);
  await el.screenshot({ path: `${framesDir}/f_${String(n++).padStart(4, '0')}.png` });
}
// hold the final frame
for (let i = 0; i < hold; i++) {
  await el.screenshot({ path: `${framesDir}/f_${String(n++).padStart(4, '0')}.png` });
}
await browser.close();
console.log(`captured ${n} frames @ ${FPS}fps (anim ${dur.toFixed(2)}s + ${HOLD_S}s hold)`);

const run = (a) => {
  const res = spawnSync(ffmpeg, a, { stdio: 'inherit' });
  if (res.status !== 0) throw new Error('ffmpeg failed: ' + a.join(' '));
};

// MP4 — full res, LinkedIn-friendly
run(['-y', '-framerate', String(FPS), '-i', `${framesDir}/f_%04d.png`,
     '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
     '-vf', 'scale=1080:1350:flags=lanczos', r(outBase + '.mp4')]);

// GIF — downscaled, palette-optimised (matches the reference share format)
const palette = `${framesDir}/palette.png`;
run(['-y', '-i', `${framesDir}/f_%04d.png`, '-vf',
     `fps=20,scale=600:-1:flags=lanczos,palettegen=stats_mode=full`, palette]);
run(['-y', '-framerate', String(FPS), '-i', `${framesDir}/f_%04d.png`, '-i', palette,
     '-lavfi', `fps=20,scale=600:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3`,
     '-loop', '0', r(outBase + '.gif')]);

rmSync(framesDir, { recursive: true, force: true });
console.log('wrote', outBase + '.mp4', 'and', outBase + '.gif');
