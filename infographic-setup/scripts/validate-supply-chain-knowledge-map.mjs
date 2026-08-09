#!/usr/bin/env node

/**
 * Validate a small Supply-Chain Knowledge Map data contract.
 *
 * This checks graph scope and provenance only. It cannot select a topic, prove a
 * claim, approve a visual, or approve publication.
 */

import { readKnowledgeMap, validateKnowledgeMap } from './lib/supply-chain-knowledge-map.mjs';

function usage() {
  return `Usage:
  node scripts/validate-supply-chain-knowledge-map.mjs --input <knowledge-map.json>
  node scripts/validate-supply-chain-knowledge-map.mjs <knowledge-map.json>

A source_backed branch cannot contain a research_seed node or edge and every
selected source must have a valid source capsule. Passing this validator does
not approve a topic, claim, visual, or publication.
`;
}

function parseArgs(args) {
  const options = { positional: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--input') {
      options.input = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--input=')) {
      options.input = arg.slice('--input='.length);
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      options.positional.push(arg);
    }
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }
  const input = options.input ?? options.positional[0];
  if (!input) throw new Error('Provide --input <knowledge-map.json>.');
  const { path, map } = readKnowledgeMap(input);
  const errors = validateKnowledgeMap(map);
  if (errors.length) {
    errors.forEach((error) => process.stderr.write(`FAIL ${error}\n`));
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`Supply-Chain Knowledge Map valid: ${map.map_id} | status=${map.status}\n`);
  process.stdout.write(`Records: ${map.nodes.length} nodes | ${map.edges.length} edges | ${map.branches.length} branches | source-backed status is explicit.\n`);
  process.stdout.write(`Validated ${path}. This is a scope/provenance check, not topic or publication approval.\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`FAIL ${error.message}\n`);
  process.exitCode = 1;
}
