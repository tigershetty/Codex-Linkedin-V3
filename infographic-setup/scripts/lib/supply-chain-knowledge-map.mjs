/**
 * Shared contract helpers for a small Supply-Chain Knowledge Map.
 *
 * This is deliberately bounded production infrastructure. It may orient an
 * opportunity lookup, but it cannot select a topic or approve public work.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const KNOWLEDGE_MAP_SCHEMA_VERSION = '1.0.0';
export const MAP_STATUSES = new Set(['draft', 'active', 'archived']);
export const RECORD_STATUSES = new Set(['navigation_only', 'candidate_ready', 'corroborated']);
export const EVIDENCE_STATUSES = new Set(['research_seed', 'source_backed']);
export const SOURCE_STATUSES = new Set(['active', 'superseded', 'unavailable']);
export const SOURCE_BASES = new Set(['source_link', 'documented_method']);
export const EDGE_BASES = new Set(['source_link', 'documented_method', 'hypothesis']);
export const NODE_KINDS = new Set([
  'function', 'role', 'work_object', 'decision', 'tension', 'method', 'metric', 'system', 'event',
]);
export const RELATIONS = new Set([
  'constrains', 'feeds', 'hands_off_to', 'measures', 'trades_off_with', 'validates', 'owns', 'requires',
]);
export const COGNITIVE_JOBS = new Set([
  'recognise', 'orient', 'choose', 'explain', 'diagnose', 'prepare', 'compare',
]);
export const TRUTH_ROUTES = new Set([
  'framework', 'operating_method', 'evidence_display', 'case_or_event', 'hypothesis_or_simulation',
  'tiger_judgment', 'opinion_or_synthesis',
]);
export const RELATIONS_TO_SHOW = new Set([
  'conditional_decision', 'sequence', 'hierarchy', 'trade_off', 'comparison', 'network', 'lookup',
]);
export const VIEW_NAMES = ['narrow', 'deep', 'wide'];

export const text = (value) => (typeof value === 'string' ? value.trim() : '');
export const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
export const isArray = Array.isArray;
export const normalize = (value) => text(value).toLocaleLowerCase('en');

function validIsoDate(value) {
  const date = text(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year, month, day] = date.split('-').map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  return candidate.getUTCFullYear() === year
    && candidate.getUTCMonth() === month - 1
    && candidate.getUTCDate() === day;
}

/**
 * Return capsule defects without deciding whether a source is allowed in a
 * research seed. The branch validator decides that: a source-backed branch
 * needs valid capsules; a research seed can retain incomplete leads.
 */
export function sourceCapsuleErrors(source, cwd = process.cwd()) {
  const capsule = source?.source_capsule;
  const errors = [];
  if (!isObject(capsule)) return ['source_capsule is required'];
  if (!text(capsule.source_locator)) errors.push('source_capsule.source_locator is required');
  if (!validIsoDate(capsule.accessed_on)) errors.push('source_capsule.accessed_on must be a real YYYY-MM-DD date');
  if (!text(capsule.supported_paraphrase)) errors.push('source_capsule.supported_paraphrase is required');

  const evidencePath = text(capsule.evidence_note_path);
  if (!evidencePath) {
    errors.push('source_capsule.evidence_note_path is required');
  } else if (/^(?:https?:|file:)/i.test(evidencePath)) {
    errors.push('source_capsule.evidence_note_path must be a local repository path');
  } else {
    const root = resolve(cwd);
    const resolvedEvidencePath = resolve(root, evidencePath);
    const rootPrefix = root.endsWith('/') ? root : `${root}/`;
    if (resolvedEvidencePath !== root && !resolvedEvidencePath.startsWith(rootPrefix)) {
      errors.push('source_capsule.evidence_note_path must stay inside the current workspace');
    } else if (!existsSync(resolvedEvidencePath)) {
      errors.push(`source_capsule.evidence_note_path does not exist: ${evidencePath}`);
    }
  }
  return errors;
}

export function readKnowledgeMap(input, cwd = process.cwd()) {
  const path = resolve(cwd, input);
  if (!existsSync(path)) throw new Error(`Input does not exist: ${path}`);
  try {
    return { path, map: JSON.parse(readFileSync(path, 'utf8')) };
  } catch (error) {
    throw new Error(`Input is not valid JSON: ${error.message}`);
  }
}

function requireText(errors, value, label) {
  if (!text(value)) errors.push(`${label} is required`);
}

function validateStringArray(errors, value, label, { required = false } = {}) {
  if (value === undefined && !required) return [];
  if (!isArray(value)) {
    errors.push(`${label} must be an array`);
    return [];
  }
  const values = value.map(text);
  if (values.some((item) => !item)) errors.push(`${label} cannot include blank values`);
  const seen = new Set();
  values.filter(Boolean).forEach((item) => {
    if (seen.has(item)) errors.push(`${label} has duplicate value: ${item}`);
    seen.add(item);
  });
  return values.filter(Boolean);
}

function validateSourceRefs(errors, record, label, sourceIds) {
  const refs = validateStringArray(errors, record.source_refs, `${label}.source_refs`, { required: true });
  refs.forEach((sourceId) => {
    if (!sourceIds.has(sourceId)) errors.push(`${label}.source_refs refers to unknown source: ${sourceId}`);
  });
  if (record.evidence_status === 'source_backed' && refs.length === 0) {
    errors.push(`${label}.source_refs needs at least one source for evidence_status=source_backed`);
  }
}

function validateStatusPair(errors, record, label) {
  if (!EVIDENCE_STATUSES.has(record.evidence_status)) errors.push(`${label}.evidence_status is invalid`);
  if (!RECORD_STATUSES.has(record.status)) errors.push(`${label}.status is invalid`);
  if (record.status === 'corroborated' && record.evidence_status !== 'source_backed') {
    errors.push(`${label}.status=corroborated requires evidence_status=source_backed`);
  }
}

function validateSource(source, index, errors, sourceIds) {
  const label = `source_registry[${index}]`;
  if (!isObject(source)) {
    errors.push(`${label} must be an object`);
    return;
  }
  ['source_id', 'citation', 'claim_boundary'].forEach((field) => requireText(errors, source[field], `${label}.${field}`));
  if (!SOURCE_BASES.has(source.basis)) errors.push(`${label}.basis is invalid`);
  if (!SOURCE_STATUSES.has(source.status)) errors.push(`${label}.status is invalid`);
  const sourceId = text(source.source_id);
  if (sourceId) {
    if (sourceIds.has(sourceId)) errors.push(`source_registry has duplicate source_id: ${sourceId}`);
    sourceIds.add(sourceId);
  }
}

function validateSourceBackedCapsules(errors, branch, label, nodeById, edgeById, sourceById) {
  if (branch.evidence_status !== 'source_backed') return;
  const sourceIds = new Set([
    ...branch.source_refs,
    ...branch.node_ids.flatMap((nodeId) => nodeById.get(nodeId)?.source_refs ?? []),
    ...branch.edge_ids.flatMap((edgeId) => edgeById.get(edgeId)?.source_refs ?? []),
  ]);
  if (sourceIds.size === 0) {
    errors.push(`${label} source_backed requires at least one source capsule; set evidence_status=research_seed until source support exists`);
    return;
  }
  sourceIds.forEach((sourceId) => {
    const source = sourceById.get(sourceId);
    if (!source) return;
    const capsuleErrors = sourceCapsuleErrors(source);
    if (capsuleErrors.length) {
      errors.push(`${label} source_backed requires a valid source capsule for ${sourceId}: ${capsuleErrors.join('; ')}. Set evidence_status=research_seed until repaired.`);
    }
  });
}

function validateNode(node, index, errors, sourceIds, nodeIds) {
  const label = `nodes[${index}]`;
  if (!isObject(node)) {
    errors.push(`${label} must be an object`);
    return;
  }
  ['node_id', 'label', 'claim_boundary'].forEach((field) => requireText(errors, node[field], `${label}.${field}`));
  if (!NODE_KINDS.has(node.kind)) errors.push(`${label}.kind is invalid`);
  validateStatusPair(errors, node, label);
  validateSourceRefs(errors, node, label, sourceIds);
  ['aliases', 'work_artifacts', 'decision_questions', 'boundaries_and_exceptions', 'evidence_routes', 'creative_retrieval_tags']
    .forEach((field) => validateStringArray(errors, node[field], `${label}.${field}`));
  if (node.reader_contexts !== undefined) {
    if (!isArray(node.reader_contexts)) errors.push(`${label}.reader_contexts must be an array`);
    else node.reader_contexts.forEach((context, contextIndex) => {
      if (!isObject(context) || !text(context.role) || !text(context.moment)) {
        errors.push(`${label}.reader_contexts[${contextIndex}] needs role and moment`);
      }
    });
  }
  if (node.cognitive_jobs !== undefined && (!isArray(node.cognitive_jobs) || node.cognitive_jobs.some((job) => !COGNITIVE_JOBS.has(job)))) {
    errors.push(`${label}.cognitive_jobs contains an invalid value`);
  }
  if (node.truth_routes !== undefined && (!isArray(node.truth_routes) || node.truth_routes.some((route) => !TRUTH_ROUTES.has(route)))) {
    errors.push(`${label}.truth_routes contains an invalid value`);
  }
  const nodeId = text(node.node_id);
  if (nodeId) {
    if (nodeIds.has(nodeId)) errors.push(`nodes has duplicate node_id: ${nodeId}`);
    nodeIds.add(nodeId);
  }
}

function validateEdge(edge, index, errors, sourceIds, nodeIds, edgeIds) {
  const label = `edges[${index}]`;
  if (!isObject(edge)) {
    errors.push(`${label} must be an object`);
    return;
  }
  ['edge_id', 'from_id', 'to_id', 'claim_boundary'].forEach((field) => requireText(errors, edge[field], `${label}.${field}`));
  if (!RELATIONS.has(edge.relation)) errors.push(`${label}.relation is invalid`);
  if (!EDGE_BASES.has(edge.basis)) errors.push(`${label}.basis is invalid`);
  validateStatusPair(errors, edge, label);
  validateSourceRefs(errors, edge, label, sourceIds);
  if (edge.evidence_status === 'source_backed' && edge.basis === 'hypothesis') {
    errors.push(`${label}.basis=hypothesis cannot be source_backed`);
  }
  if (text(edge.from_id) && !nodeIds.has(text(edge.from_id))) errors.push(`${label}.from_id refers to unknown node: ${edge.from_id}`);
  if (text(edge.to_id) && !nodeIds.has(text(edge.to_id))) errors.push(`${label}.to_id refers to unknown node: ${edge.to_id}`);
  if (text(edge.from_id) && text(edge.from_id) === text(edge.to_id)) errors.push(`${label} cannot self-link a node`);
  const edgeId = text(edge.edge_id);
  if (edgeId) {
    if (edgeIds.has(edgeId)) errors.push(`edges has duplicate edge_id: ${edgeId}`);
    edgeIds.add(edgeId);
  }
}

function validateScope(scope, label, errors) {
  if (!isObject(scope)) {
    errors.push(`${label}.scope_window must be an object`);
    return;
  }
  [
    'reader_role', 'reader_moment', 'operating_object_or_signal', 'decision_or_tension',
    'reader_payoff', 'in_scope', 'out_of_scope', 'boundary_or_exception',
  ].forEach((field) => requireText(errors, scope[field], `${label}.scope_window.${field}`));
  if (!COGNITIVE_JOBS.has(scope.cognitive_job)) errors.push(`${label}.scope_window.cognitive_job is invalid`);
  if (!TRUTH_ROUTES.has(scope.truth_route)) errors.push(`${label}.scope_window.truth_route is invalid`);
  if (!RELATIONS_TO_SHOW.has(scope.relation_to_show)) errors.push(`${label}.scope_window.relation_to_show is invalid`);
}

function validateView(view, viewName, label, errors, nodeIds, edgeIds, branchNodes, branchEdges) {
  const viewLabel = `${label}.views.${viewName}`;
  if (!isObject(view)) {
    errors.push(`${viewLabel} must be an object`);
    return { nodes: new Set(), edges: new Set() };
  }
  ['label', 'purpose'].forEach((field) => requireText(errors, view[field], `${viewLabel}.${field}`));
  const viewNodes = validateStringArray(errors, view.node_ids, `${viewLabel}.node_ids`, { required: true });
  const viewEdges = validateStringArray(errors, view.edge_ids, `${viewLabel}.edge_ids`, { required: true });
  if (viewNodes.length === 0) errors.push(`${viewLabel}.node_ids needs at least one node`);
  viewNodes.forEach((nodeId) => {
    if (!nodeIds.has(nodeId)) errors.push(`${viewLabel}.node_ids refers to unknown node: ${nodeId}`);
    if (!branchNodes.has(nodeId)) errors.push(`${viewLabel}.node_ids must stay within its declared branch: ${nodeId}`);
  });
  viewEdges.forEach((edgeId) => {
    if (!edgeIds.has(edgeId)) errors.push(`${viewLabel}.edge_ids refers to unknown edge: ${edgeId}`);
    if (!branchEdges.has(edgeId)) errors.push(`${viewLabel}.edge_ids must stay within its declared branch: ${edgeId}`);
  });
  return { nodes: new Set(viewNodes), edges: new Set(viewEdges) };
}

function hasAll(errors, smaller, larger, label) {
  smaller.forEach((id) => {
    if (!larger.has(id)) errors.push(`${label} must include ${id} from the preceding view`);
  });
}

function validateBranch(branch, index, errors, sourceIds, nodeIds, edgeIds, nodeById, edgeById, sourceById, branchIds) {
  const label = `branches[${index}]`;
  if (!isObject(branch)) {
    errors.push(`${label} must be an object`);
    return;
  }
  ['branch_id', 'label', 'primary_node_id', 'claim_boundary'].forEach((field) => requireText(errors, branch[field], `${label}.${field}`));
  validateStatusPair(errors, branch, label);
  validateSourceRefs(errors, branch, label, sourceIds);
  validateScope(branch.scope_window, label, errors);
  const tags = validateStringArray(errors, branch.creative_retrieval_tags, `${label}.creative_retrieval_tags`, { required: true });
  if (tags.length === 0) errors.push(`${label}.creative_retrieval_tags needs at least one retrieval tag`);
  const memberNodeIds = validateStringArray(errors, branch.node_ids, `${label}.node_ids`, { required: true });
  const memberEdgeIds = validateStringArray(errors, branch.edge_ids, `${label}.edge_ids`, { required: true });
  if (memberNodeIds.length === 0) errors.push(`${label}.node_ids needs at least one node`);
  const branchNodes = new Set(memberNodeIds);
  const branchEdges = new Set(memberEdgeIds);
  memberNodeIds.forEach((nodeId) => {
    if (!nodeIds.has(nodeId)) errors.push(`${label}.node_ids refers to unknown node: ${nodeId}`);
  });
  memberEdgeIds.forEach((edgeId) => {
    if (!edgeIds.has(edgeId)) errors.push(`${label}.edge_ids refers to unknown edge: ${edgeId}`);
    const edge = edgeById.get(edgeId);
    if (edge && (!branchNodes.has(edge.from_id) || !branchNodes.has(edge.to_id))) {
      errors.push(`${label}.edge_ids edge ${edgeId} must keep both endpoints inside branch.node_ids`);
    }
  });
  if (!branchNodes.has(text(branch.primary_node_id))) errors.push(`${label}.primary_node_id must be one of branch.node_ids`);
  if (branch.evidence_status === 'source_backed') {
    memberNodeIds.forEach((nodeId) => {
      if (nodeById.get(nodeId)?.evidence_status !== 'source_backed') {
        errors.push(`${label} cannot be source_backed while selected node ${nodeId} is research_seed`);
      }
    });
    memberEdgeIds.forEach((edgeId) => {
      if (edgeById.get(edgeId)?.evidence_status !== 'source_backed') {
        errors.push(`${label} cannot be source_backed while selected edge ${edgeId} is research_seed`);
      }
    });
    validateSourceBackedCapsules(errors, branch, label, nodeById, edgeById, sourceById);
  }
  if (!isObject(branch.views)) {
    errors.push(`${label}.views must be an object`);
  } else {
    const narrow = validateView(branch.views.narrow, 'narrow', label, errors, nodeIds, edgeIds, branchNodes, branchEdges);
    const deep = validateView(branch.views.deep, 'deep', label, errors, nodeIds, edgeIds, branchNodes, branchEdges);
    const wide = validateView(branch.views.wide, 'wide', label, errors, nodeIds, edgeIds, branchNodes, branchEdges);
    if (!narrow.nodes.has(text(branch.primary_node_id))) errors.push(`${label}.views.narrow must contain primary_node_id`);
    hasAll(errors, narrow.nodes, deep.nodes, `${label}.views.deep.node_ids`);
    hasAll(errors, deep.nodes, wide.nodes, `${label}.views.wide.node_ids`);
    hasAll(errors, narrow.edges, deep.edges, `${label}.views.deep.edge_ids`);
    hasAll(errors, deep.edges, wide.edges, `${label}.views.wide.edge_ids`);
  }
  const branchId = text(branch.branch_id);
  if (branchId) {
    if (branchIds.has(branchId)) errors.push(`branches has duplicate branch_id: ${branchId}`);
    branchIds.add(branchId);
  }
}

/** Return every contract error, so a caller can correct the graph in one pass. */
export function validateKnowledgeMap(map) {
  const errors = [];
  if (!isObject(map)) return ['root must be an object'];
  if (map.schema_version !== KNOWLEDGE_MAP_SCHEMA_VERSION) errors.push(`schema_version must be ${KNOWLEDGE_MAP_SCHEMA_VERSION}`);
  ['map_id', 'title'].forEach((field) => requireText(errors, map[field], field));
  if (!MAP_STATUSES.has(map.status)) errors.push('status must be draft, active, or archived');
  ['source_registry', 'nodes', 'edges', 'branches'].forEach((field) => {
    if (!isArray(map[field])) errors.push(`${field} must be an array`);
  });
  const sourceIds = new Set();
  if (isArray(map.source_registry)) map.source_registry.forEach((source, index) => validateSource(source, index, errors, sourceIds));
  const sourceById = new Map((map.source_registry ?? []).filter(isObject).map((source) => [source.source_id, source]));
  const nodeIds = new Set();
  if (isArray(map.nodes)) map.nodes.forEach((node, index) => validateNode(node, index, errors, sourceIds, nodeIds));
  const nodeById = new Map((map.nodes ?? []).filter(isObject).map((node) => [node.node_id, node]));
  const edgeIds = new Set();
  if (isArray(map.edges)) map.edges.forEach((edge, index) => validateEdge(edge, index, errors, sourceIds, nodeIds, edgeIds));
  const edgeById = new Map((map.edges ?? []).filter(isObject).map((edge) => [edge.edge_id, edge]));
  const branchIds = new Set();
  if (isArray(map.branches)) {
    map.branches.forEach((branch, index) => validateBranch(
      branch, index, errors, sourceIds, nodeIds, edgeIds, nodeById, edgeById, sourceById, branchIds,
    ));
  }
  return errors;
}

export function indexKnowledgeMap(map) {
  return {
    sourceById: new Map(map.source_registry.map((source) => [source.source_id, source])),
    nodeById: new Map(map.nodes.map((node) => [node.node_id, node])),
    edgeById: new Map(map.edges.map((edge) => [edge.edge_id, edge])),
  };
}

export function sourceBackedHandoff(branch, sources = []) {
  const capsuleDefects = sources.flatMap((source) => sourceCapsuleErrors(source).map((error) => ({
    source_id: source.source_id,
    error,
  })));
  const sourceBackedCandidate = capsuleDefects.length === 0
    && branch.evidence_status === 'source_backed'
    && ['candidate_ready', 'corroborated'].includes(branch.status);
  return {
    build_ready: false,
    status: sourceBackedCandidate ? 'eligible_for_opportunity_selection' : 'research_only',
    source_capsules: {
      status: capsuleDefects.length === 0 ? 'valid' : 'incomplete_or_invalid',
      defects: capsuleDefects,
    },
    reason: sourceBackedCandidate
      ? 'This source-backed scope may enter Creative Opportunity Selection. The map still cannot approve a topic, claim, visual, or publication.'
      : 'This branch remains research-only because it is a research seed or its selected sources lack valid source capsules. It cannot be sent forward as a build-ready scope.',
  };
}

export function selectedSources({ branch, nodes, edges, sourceById }) {
  const sourceIds = [...new Set([
    ...branch.source_refs,
    ...nodes.flatMap((node) => node.source_refs),
    ...edges.flatMap((edge) => edge.source_refs),
  ])];
  return sourceIds.map((sourceId) => sourceById.get(sourceId)).filter(Boolean);
}
