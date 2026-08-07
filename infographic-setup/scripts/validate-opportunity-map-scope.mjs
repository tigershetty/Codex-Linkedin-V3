#!/usr/bin/env node

/**
 * Validate a bounded Supply-Chain Opportunity Map scope window.
 *
 * This intentionally validates only a selected scope window, not a large expertise
 * taxonomy. It cannot select a topic, prove a supply-chain claim, or approve a post.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const STARTING_PATHS = new Set(['problem_led', 'pattern_led', 'evidence_led', 'timely_led']);
const NODE_KINDS = new Set([
  'function', 'role', 'work_object', 'decision', 'tension', 'method', 'metric', 'system', 'event',
]);
const RELATIONS = new Set([
  'constrains', 'feeds', 'hands_off_to', 'measures', 'trades_off_with', 'validates', 'owns', 'requires',
]);
const EDGE_BASES = new Set(['source_link', 'documented_method', 'hypothesis']);
const COGNITIVE_JOBS = new Set(['recognise', 'orient', 'choose', 'explain', 'diagnose', 'prepare', 'compare']);
const TRUTH_ROUTES = new Set([
  'framework', 'operating_method', 'evidence_display', 'case_or_event', 'hypothesis_or_simulation',
  'tiger_judgment', 'opinion_or_synthesis',
]);
const RELATIONS_TO_SHOW = new Set([
  'conditional_decision', 'sequence', 'hierarchy', 'trade_off', 'comparison', 'network', 'lookup', 'none',
]);
const ROUTE_CANDIDATES = new Set(['fast_post_loop', 'field_guide_candidate', 'flagship_candidate', 'park']);

function usage() {
  return `Usage:
  node scripts/validate-opportunity-map-scope.mjs --input <scope-window.json>
  node scripts/validate-opportunity-map-scope.mjs <scope-window.json>

Options:
  --allow-draft  Validate a blank or in-progress scope window.
  --help         Show this help.

This checks a bounded scope-window record only. It does not select a topic, prove a claim,
or replace Creative Opportunity Selection, Fast Post, or Field Guide admission.
`;
}

function parseArgs(args) {
  const options = { positional: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--allow-draft') options.allowDraft = true;
    else if (arg === '--input') {
      options.input = args[index + 1];
      index += 1;
    } else if (arg.startsWith('--input=')) options.input = arg.slice('--input='.length);
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else options.positional.push(arg);
  }
  return options;
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function array(value) {
  return Array.isArray(value);
}

function requiredText(errors, value, label) {
  if (!text(value)) errors.push(`${label} is required`);
}

function readyId(value) {
  const candidate = text(value);
  return Boolean(candidate) && !/(?:^|[-_])(draft|placeholder|todo|tbd)(?:$|[-_])/i.test(candidate);
}

function validateNode(node, index, errors) {
  const label = `selected_nodes[${index}]`;
  if (!object(node)) {
    errors.push(`${label} must be an object`);
    return '';
  }
  requiredText(errors, node.node_id, `${label}.node_id`);
  requiredText(errors, node.label, `${label}.label`);
  if (!NODE_KINDS.has(node.kind)) errors.push(`${label}.kind is invalid`);
  return text(node.node_id);
}

function validateEdge(edge, index, nodeIds, errors) {
  const label = `selected_edges[${index}]`;
  if (!object(edge)) {
    errors.push(`${label} must be an object`);
    return;
  }
  requiredText(errors, edge.from_id, `${label}.from_id`);
  requiredText(errors, edge.to_id, `${label}.to_id`);
  if (!RELATIONS.has(edge.relation)) errors.push(`${label}.relation is invalid`);
  if (!EDGE_BASES.has(edge.basis)) errors.push(`${label}.basis is invalid`);
  if (text(edge.from_id) && !nodeIds.has(edge.from_id)) errors.push(`${label}.from_id must refer to a selected node`);
  if (text(edge.to_id) && !nodeIds.has(edge.to_id)) errors.push(`${label}.to_id must refer to a selected node`);
  if (text(edge.from_id) && edge.from_id === edge.to_id) errors.push(`${label} cannot self-link a node`);
}

function validateScopeWindow(scope, errors, ready) {
  if (!object(scope)) {
    errors.push('scope_window must be an object');
    return;
  }
  if (ready) {
    [
      'reader_role', 'reader_moment', 'operating_object_or_signal', 'decision_or_tension',
      'reader_payoff', 'in_scope', 'out_of_scope',
    ].forEach((field) => requiredText(errors, scope[field], `scope_window.${field}`));
  }
  if (!COGNITIVE_JOBS.has(scope.cognitive_job)) errors.push('scope_window.cognitive_job is invalid');
  if (!TRUTH_ROUTES.has(scope.truth_route)) errors.push('scope_window.truth_route is invalid');
  if (!RELATIONS_TO_SHOW.has(scope.relation_to_show)) errors.push('scope_window.relation_to_show is invalid');
  if (ready && scope.relation_to_show === 'none') {
    errors.push('scope_window.relation_to_show cannot be none in a ready scope window');
  }
}

function validateHandoff(handoff, errors, ready) {
  if (!object(handoff)) {
    errors.push('creative_handoff must be an object');
    return;
  }
  if (!ROUTE_CANDIDATES.has(handoff.route_candidate)) errors.push('creative_handoff.route_candidate is invalid');
  if (ready) {
    requiredText(errors, handoff.reason, 'creative_handoff.reason');
    requiredText(errors, handoff.anti_copy_boundary, 'creative_handoff.anti_copy_boundary');
    if (!array(handoff.reference_query_tags) || handoff.reference_query_tags.length === 0
      || handoff.reference_query_tags.some((tag) => !text(tag))) {
      errors.push('creative_handoff.reference_query_tags needs at least one non-empty tag');
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  const input = options.input ?? options.positional[0];
  if (!input) throw new Error('Provide --input <scope-window.json>.');
  const path = resolve(process.cwd(), input);
  if (!existsSync(path)) throw new Error(`Input does not exist: ${path}`);

  let record;
  try {
    record = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`Input is not valid JSON: ${error.message}`);
  }

  const errors = [];
  if (!object(record)) errors.push('root must be an object');
  if (record.schema_version !== '1.0.0') errors.push('schema_version must be 1.0.0');
  if (!['draft', 'ready'].includes(record.status)) errors.push('status must be draft or ready');
  if (record.status === 'draft' && !options.allowDraft) {
    errors.push('draft input requires --allow-draft');
  }
  const ready = record.status === 'ready';
  if (ready && !readyId(record.scope_id)) {
    errors.push('scope_id must be a non-placeholder value in a ready scope window');
  }
  if (!STARTING_PATHS.has(record.starting_path)) errors.push('starting_path is invalid');

  const nodeIds = new Set();
  if (!array(record.selected_nodes)) {
    errors.push('selected_nodes must be an array');
  } else {
    if (ready && record.selected_nodes.length === 0) errors.push('ready scope needs at least one selected node');
    record.selected_nodes.forEach((node, index) => {
      const nodeId = validateNode(node, index, errors);
      if (nodeId) {
        if (nodeIds.has(nodeId)) errors.push(`selected_nodes contains duplicate node_id: ${nodeId}`);
        nodeIds.add(nodeId);
      }
    });
  }
  if (!array(record.selected_edges)) {
    errors.push('selected_edges must be an array');
  } else {
    record.selected_edges.forEach((edge, index) => validateEdge(edge, index, nodeIds, errors));
  }

  validateScopeWindow(record.scope_window, errors, ready);
  validateHandoff(record.creative_handoff, errors, ready);

  if (ready && record.creative_handoff?.route_candidate === 'field_guide_candidate'
    && record.scope_window?.relation_to_show === 'none') {
    errors.push('Field Guide candidate must identify a real relation to show');
  }
  if (ready && record.scope_window?.relation_to_show === 'network' && record.selected_edges?.length === 0) {
    errors.push('A network relation needs at least one selected edge; do not imply a network from a node list');
  }

  if (errors.length) {
    errors.forEach((error) => console.error(`FAIL ${error}`));
    process.exitCode = 1;
    return;
  }
  console.log(`Supply-Chain Opportunity Map scope valid: ${record.scope_id || '[draft]'} | status=${record.status}`);
  console.log('This is scope hygiene, not topic approval, claim verification, or publication approval.');
}

try {
  main();
} catch (error) {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
}
