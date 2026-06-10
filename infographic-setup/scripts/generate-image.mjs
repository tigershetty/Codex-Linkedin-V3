#!/usr/bin/env node
/**
 * generate-image.mjs
 * Dual-engine image generation: Gemini Flash or gpt-image-1
 *
 * Usage:
 *   node generate-image.mjs \
 *     --prompt path/to/prompt.txt \
 *     --engine gemini|openai \
 *     --output path/to/output.png \
 *     [--reference path/to/brand-anchor.webp] \
 *     [--dry-run]
 *
 * Required env vars: GEMINI_API_KEY or OPENAI_API_KEY (depending on engine)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Argument parsing ─────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      parsed[key] = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
    }
  }
  return parsed;
}

const args = parseArgs();
const DRY_RUN = args['dry-run'] === true || args['dry-run'] === 'true';

function require_arg(name) {
  if (!args[name]) {
    console.error(`Missing required argument: --${name}`);
    process.exit(1);
  }
  return args[name];
}

const promptPath = require_arg('prompt');
const engine = require_arg('engine');
const outputPath = require_arg('output');
const referencePath = args['reference'] || null;

if (!['gemini', 'openai'].includes(engine)) {
  console.error(`Invalid engine: ${engine}. Must be 'gemini' or 'openai'.`);
  process.exit(1);
}

// ── Load prompt ──────────────────────────────────────────────────────────────

const promptText = readFileSync(resolve(promptPath), 'utf8').trim();
console.log(`Prompt loaded: ${promptPath} (${promptText.length} chars)`);

// ── Reference image (base64) ─────────────────────────────────────────────────

function loadReferenceImage(path) {
  if (!path || !existsSync(path)) return null;
  const data = readFileSync(resolve(path));
  const ext = path.split('.').pop().toLowerCase();
  const mimeTypes = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
  return { base64: data.toString('base64'), mimeType: mimeTypes[ext] || 'image/png' };
}

const referenceImage = loadReferenceImage(referencePath);
if (referenceImage) console.log(`Reference image loaded: ${referencePath}`);

// ── Gemini Flash image generation ────────────────────────────────────────────

async function generateWithGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

  // Model: gemini-2.0-flash-preview-image-generation
  // Verify current model name at: https://ai.google.dev/api/generate-content
  const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.0-flash-preview-image-generation';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const parts = [];

  if (referenceImage) {
    parts.push({
      inline_data: {
        mime_type: referenceImage.mimeType,
        data: referenceImage.base64
      }
    });
  }

  parts.push({ text: promptText });

  const body = {
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      // Image output configuration
    }
  };

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Would POST to:', url);
    console.log('[DRY RUN] Request body (truncated):');
    const preview = JSON.parse(JSON.stringify(body));
    if (preview.contents[0].parts[0]?.inline_data) {
      preview.contents[0].parts[0].inline_data.data = '[base64 truncated]';
    }
    console.log(JSON.stringify(preview, null, 2));
    return;
  }

  console.log(`Calling Gemini API (model: ${model})...`);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Gemini API error ${res.status}:`, err);
    process.exit(1);
  }

  const data = await res.json();

  // Extract image from response
  const imagePart = data.candidates?.[0]?.content?.parts?.find(p => p.inline_data);
  if (!imagePart) {
    console.error('No image in Gemini response. Full response:');
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const imageBuffer = Buffer.from(imagePart.inline_data.data, 'base64');
  writeFileSync(resolve(outputPath), imageBuffer);
  console.log(`Image saved: ${outputPath}`);
}

// ── OpenAI gpt-image-1 generation ────────────────────────────────────────────

async function generateWithOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { console.error('OPENAI_API_KEY not set'); process.exit(1); }

  const url = 'https://api.openai.com/v1/images/generations';

  const body = {
    model: 'gpt-image-1',
    prompt: promptText,
    n: 1,
    size: '1024x1024',  // gpt-image-1 max; upscale to 2048x2048 post-generation if needed
    quality: 'high',
    output_format: 'png'
  };

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Would POST to:', url);
    console.log('[DRY RUN] Request body:');
    console.log(JSON.stringify(body, null, 2));
    if (referenceImage) console.log('[DRY RUN] Note: reference image not supported in generations endpoint — include style description in prompt instead');
    return;
  }

  console.log('Calling OpenAI Images API (model: gpt-image-1)...');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`OpenAI API error ${res.status}:`, err);
    process.exit(1);
  }

  const data = await res.json();
  const imageItem = data.data?.[0];
  if (!imageItem) { console.error('No image data in OpenAI response'); process.exit(1); }

  let imageBuffer;
  if (imageItem.b64_json) {
    imageBuffer = Buffer.from(imageItem.b64_json, 'base64');
  } else if (imageItem.url) {
    // Download from URL
    const imgRes = await fetch(imageItem.url);
    imageBuffer = Buffer.from(await imgRes.arrayBuffer());
  } else {
    console.error('Unexpected OpenAI response format'); process.exit(1);
  }

  writeFileSync(resolve(outputPath), imageBuffer);
  console.log(`Image saved: ${outputPath}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log(`\ngenerate-image.mjs | engine: ${engine} | ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
console.log(`Output: ${outputPath}\n`);

if (engine === 'gemini') {
  await generateWithGemini();
} else {
  await generateWithOpenAI();
}
