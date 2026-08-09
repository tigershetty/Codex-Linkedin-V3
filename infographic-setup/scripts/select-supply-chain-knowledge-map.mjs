#!/usr/bin/env node

/**
 * Return one declared narrow, deep, or wide branch card from a validated map.
 *
 * The selector returns only the graph subset explicitly declared by that branch;
 * it never infers more structure or chooses a topic. build_ready remains false.
 */

import {
  EVIDENCE_STATUSES,
  RECORD_STATUSES,
  VIEW_NAMES,
  indexKnowledgeMap,
  normalize,
  readKnowledgeMap,
  selectedSources,
  sourceBackedHandoff,
  validateKnowledgeMap,
} from './lib/supply-chain-knowledge-map.mjs';

function usage() {
  return `Usage:
  node scripts/select-supply-chain-knowledge-map.mjs --input <knowledge-map.json> --branch <branch-id> [--view narrow|deep|wide]
  node scripts/select-supply-chain-knowledge-map.mjs --input <knowledge-map.json> --status <status> --evidence-status <status> [--view narrow|deep|wide]

Filters:
  --branch <id>               Select one declared branch id.
  --status <status>           navigation_only, candidate_ready, or corroborated.
  --evidence-status <status>  research_seed or source_backed.
  --reader-role <text>        Match a declared branch reader role.
  --cognitive-job <job>       Match a declared branch cognitive job.
  --tag <text>                Match a declared creative retrieval tag.
  --view <name>               narrow (default), deep, or wide.
  --require-source-backed     Reject research_seed branches.
  --list                      List matching branch summaries; do not emit a card.
  --help                      Show this help.

The result is an upstream scope lookup. build_ready is always false: even a
source-backed branch with complete source capsules must pass Creative Opportunity
Selection and normal evidence and creative gates.
`;
}

const OPTION_KEYS = {
  input: 'input',
  branch: 'branch',
  status: 'status',
  'evidence-status': 'evidenceStatus',
  'reader-role': 'readerRole',
  'cognitive-job': 'cognitiveJob',
  tag: 'tag',
  view: 'view',
};

function parseArgs(args) {
  const options = { positional: [], view: 'narrow' };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg === '--list') {
      options.list = true;
      continue;
    }
    if (arg === '--require-source-backed') {
      options.requireSourceBacked = true;
      continue;
    }
    if (arg.startsWith('--')) {
      const equalIndex = arg.indexOf('=');
      const optionName = arg.slice(2, equalIndex === -1 ? undefined : equalIndex);
      const optionKey = OPTION_KEYS[optionName];
      if (!optionKey) throw new Error(`Unknown option: ${arg}`);
      const value = equalIndex === -1 ? args[index + 1] : arg.slice(equalIndex + 1);
      if (!value || value.startsWith('--')) throw new Error(`--${optionName} needs a value`);
      options[optionKey] = value;
      if (equalIndex === -1) index += 1;
      continue;
    }
    options.positional.push(arg);
  }
  return options;
}

function branchMatches(branch, options) {
  if (options.branch && branch.branch_id !== options.branch) return false;
  if (options.status && branch.status !== options.status) return false;
  if (options.evidenceStatus && branch.evidence_status !== options.evidenceStatus) return false;
  if (options.readerRole && normalize(branch.scope_window.reader_role) !== normalize(options.readerRole)) return false;
  if (options.cognitiveJob && branch.scope_window.cognitive_job !== options.cognitiveJob) return false;
  if (options.tag && !branch.creative_retrieval_tags.some((tag) => normalize(tag) === normalize(options.tag))) return false;
  return true;
}

function branchSummary(branch) {
  return {
    branch_id: branch.branch_id,
    label: branch.label,
    status: branch.status,
    evidence_status: branch.evidence_status,
    reader_role: branch.scope_window.reader_role,
    cognitive_job: branch.scope_window.cognitive_job,
    retrieval_tags: branch.creative_retrieval_tags,
  };
}

function buildCard(map, branch, viewName) {
  const { sourceById, nodeById, edgeById } = indexKnowledgeMap(map);
  const view = branch.views[viewName];
  const nodes = view.node_ids.map((nodeId) => nodeById.get(nodeId));
  const edges = view.edge_ids.map((edgeId) => edgeById.get(edgeId));
  const sources = selectedSources({ branch, nodes, edges, sourceById });
  return {
    schema_version: '1.0.0',
    card_type: 'supply_chain_knowledge_map_branch_card',
    map: {
      map_id: map.map_id,
      title: map.title,
      status: map.status,
    },
    branch: {
      branch_id: branch.branch_id,
      label: branch.label,
      primary_node_id: branch.primary_node_id,
      status: branch.status,
      evidence_status: branch.evidence_status,
      creative_retrieval_tags: branch.creative_retrieval_tags,
      claim_boundary: branch.claim_boundary,
      last_reviewed: branch.last_reviewed ?? null,
    },
    scope_window: branch.scope_window,
    view: {
      name: viewName,
      label: view.label,
      purpose: view.purpose,
      node_ids: view.node_ids,
      edge_ids: view.edge_ids,
    },
    nodes,
    edges,
    sources,
    handoff: sourceBackedHandoff(branch, sources),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }
  const input = options.input ?? options.positional[0];
  if (!input) throw new Error('Provide --input <knowledge-map.json>.');
  if (!VIEW_NAMES.includes(options.view)) throw new Error('--view must be narrow, deep, or wide');
  if (options.status && !RECORD_STATUSES.has(options.status)) throw new Error('--status is invalid');
  if (options.evidenceStatus && !EVIDENCE_STATUSES.has(options.evidenceStatus)) throw new Error('--evidence-status is invalid');
  const { map } = readKnowledgeMap(input);
  const errors = validateKnowledgeMap(map);
  if (errors.length) {
    throw new Error(`Refusing to select from an invalid map:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  }
  const matches = map.branches.filter((branch) => branchMatches(branch, options));
  if (options.list) {
    process.stdout.write(`${JSON.stringify({ map_id: map.map_id, branches: matches.map(branchSummary) }, null, 2)}\n`);
    return;
  }
  if (matches.length === 0) throw new Error('No branch matches the requested id/filters. Use --list to inspect declared branch ids.');
  if (matches.length > 1) {
    throw new Error(`Filters matched ${matches.length} branches. Add --branch or a tighter filter; the selector will not choose a topic for you.`);
  }
  const [branch] = matches;
  if (options.requireSourceBacked && branch.evidence_status !== 'source_backed') {
    throw new Error(`Branch ${branch.branch_id} is research_seed. It cannot emit a source-backed handoff.`);
  }
  process.stdout.write(`${JSON.stringify(buildCard(map, branch, options.view), null, 2)}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`FAIL ${error.message}\n`);
  process.exitCode = 1;
}
