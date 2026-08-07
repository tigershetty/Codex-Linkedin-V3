#!/usr/bin/env node

/**
 * Audit the closure of a Field Guide package.
 *
 * This is deliberately a local audit. It verifies recorded Figma metadata, local package links,
 * export hashes, and visual/caption choreography. It does not call Figma, decide whether a visual
 * is good, or prove a source claim is true. A draft may be incomplete; a ready package may not.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { basename, isAbsolute, relative, resolve } from 'node:path';

const MANIFEST_STATUSES = new Set(['draft', 'ready']);
const EXPORT_STATUSES = new Set(['not_exported', 'exported']);
const FIGMA_METADATA_STATUSES = new Set(['verified', 'recorded_not_locally_verified']);
const ADMISSION_DECISIONS = new Set(['select', 'repair', 'kill']);
const CHOREOGRAPHY_DECISIONS = new Set(['pass', 'revise']);
const CAPTION_STATUSES = new Set(['draft', 'approved']);
const PUBLICATION_STATUSES = new Set(['draft', 'approved']);
const CLAIM_SOURCE_SCOPES = new Set(['internal_only', 'public_approved', 'source_bound']);

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function list(value) {
  return Array.isArray(value);
}

function usage() {
  return `Usage:
  node scripts/audit-field-guide-package.mjs --input <field-guide-manifest.json>
  node scripts/audit-field-guide-package.mjs <field-guide-manifest.json>

Options:
  --require-ready  Treat every incomplete item as a failure.
  --help           Show this help.

Draft packages may report INCOMPLETE items while the concept and source are still under review.
Ready packages require a verified local export, complete linkage, and no unresolved package items.
`;
}

function parseArgs(args) {
  const options = { positional: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--require-ready') options.requireReady = true;
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

function normalize(value) {
  return String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function pngDimensions(file) {
  const buffer = readFileSync(file);
  const signature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== signature) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function parseJson(file, label) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

function localPath(packageDir, candidate, label) {
  if (!text(candidate)) return { path: null, error: `${label} is missing` };
  if (isAbsolute(candidate)) return { path: null, error: `${label} must be package-relative` };
  const path = resolve(packageDir, candidate);
  const relation = relative(packageDir, path);
  if (relation.startsWith('..') || isAbsolute(relation)) {
    return { path: null, error: `${label} must stay inside the Field Guide package` };
  }
  return { path };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  const input = options.input || options.positional[0];
  if (!input) throw new Error(`Missing input file.\n\n${usage()}`);
  const inputPath = resolve(process.cwd(), input);
  if (!existsSync(inputPath)) throw new Error(`Field Guide manifest not found: ${inputPath}`);

  const manifest = parseJson(inputPath, 'Field Guide manifest');
  if (!object(manifest)) throw new Error('Field Guide manifest must be a JSON object');
  if (manifest.schema_version !== '1.0.0') throw new Error('manifest.schema_version must be 1.0.0');
  if (!MANIFEST_STATUSES.has(manifest.status)) throw new Error('manifest.status must be draft or ready');
  if (!text(manifest.field_guide_id)) throw new Error('manifest.field_guide_id is required');
  if (!object(manifest.package)) throw new Error('manifest.package must be an object');
  if (!object(manifest.figma)) throw new Error('manifest.figma must be an object');
  if (!object(manifest.export)) throw new Error('manifest.export must be an object');
  if (!object(manifest.caption)) throw new Error('manifest.caption must be an object');
  if (!object(manifest.publication)) throw new Error('manifest.publication must be an object');

  const packageDir = resolve(inputPath, '..');
  const entries = [];
  const checked = new Map();
  const add = (status, label, detail) => entries.push({ status, label, detail });
  const isReadyTarget = manifest.status === 'ready' || Boolean(options.requireReady);
  const incomplete = (label, detail) => add(isReadyTarget ? 'FAIL' : 'INCOMPLETE', label, detail);
  const checkPath = (label, candidate, { optional = false } = {}) => {
    const resolved = localPath(packageDir, candidate, label);
    if (resolved.error) {
      if (optional && !text(candidate)) return null;
      incomplete(label, resolved.error);
      return null;
    }
    if (!existsSync(resolved.path)) {
      incomplete(label, `${candidate} does not exist`);
      return null;
    }
    checked.set(label, resolved.path);
    add('PASS', label, candidate);
    return resolved.path;
  };

  const specPath = checkPath('spec file', manifest.package.spec_file);
  let spec;
  if (specPath) {
    try {
      spec = parseJson(specPath, 'Field Guide spec');
      if (spec.field_guide_id !== manifest.field_guide_id) {
        incomplete('spec identity', `spec.field_guide_id ${spec.field_guide_id || '(missing)'} does not match ${manifest.field_guide_id}`);
      } else {
        add('PASS', 'spec identity', manifest.field_guide_id);
      }
      if (manifest.status === 'ready' && spec.status !== 'ready') {
        incomplete('spec readiness', `spec.status is ${spec.status || '(missing)'}`);
      }
    } catch (error) {
      add('FAIL', 'spec JSON', error.message);
    }
  }

  const admissionPath = checkPath('admission record', manifest.package.admission_file);
  if (admissionPath) {
    try {
      const admission = parseJson(admissionPath, 'Field Guide admission record');
      if (admission.field_guide_id !== manifest.field_guide_id) {
        incomplete('admission identity', 'admission field_guide_id does not match the manifest');
      } else if (!ADMISSION_DECISIONS.has(admission.family_choice?.decision)) {
        incomplete('admission decision', 'family_choice.decision must be select, repair, or kill');
      } else if (admission.family_choice.decision !== 'select') {
        incomplete('admission decision', `Field Guide is not selected: ${admission.family_choice.decision}`);
      } else {
        add('PASS', 'admission decision', 'Field Guide selected for this reader promise');
      }
      const filters = admission.resource_filters;
      const density = admission.density_budget;
      const completeFilters = object(filters)
        && ['lived_tension', 'practical_handle', 'useful_angle', 'information_density'].every((key) => text(filters[key]?.answer) && text(filters[key]?.evidence_or_reason));
      if (!completeFilters || !object(density) || !Number.isInteger(density.operating_modules) || density.operating_modules < 3 || density.operating_modules > 7) {
        incomplete('admission quality record', 'record all four resource filters and a 3–7 module density budget');
      } else {
        add('PASS', 'admission quality record', 'four filters and density budget recorded');
      }
    } catch (error) {
      add('FAIL', 'admission JSON', error.message);
    }
  }

  const reviewPath = checkPath('review file', manifest.package.review_file);
  if (reviewPath && !readFileSync(reviewPath, 'utf8').includes(manifest.field_guide_id)) {
    incomplete('review linkage', `review does not name ${manifest.field_guide_id}`);
  } else if (reviewPath) {
    add('PASS', 'review linkage', manifest.field_guide_id);
  }

  const claimPath = checkPath('claim source', manifest.package.claim_source_file);
  if (claimPath && claimPath !== specPath) {
    try {
      const claims = parseJson(claimPath, 'claim source');
      if (!object(claims) || claims.field_guide_id !== manifest.field_guide_id) {
        incomplete('claim linkage', 'claim source does not name the manifest field guide');
      } else {
        add('PASS', 'claim linkage', manifest.field_guide_id);
        const specClaimIds = new Set(list(spec?.claims) ? spec.claims.map((claim) => text(claim?.claim_id)).filter(Boolean) : []);
        const sourceClaims = list(claims.claims) ? claims.claims : [];
        const sourceClaimIds = new Set(sourceClaims.map((claim) => text(claim?.claim_id)).filter(Boolean));
        const missingClaimIds = [...specClaimIds].filter((claimId) => !sourceClaimIds.has(claimId));
        if (missingClaimIds.length) {
          incomplete('claim coverage', `claim source is missing: ${missingClaimIds.join(', ')}`);
        } else if (specClaimIds.size) {
          add('PASS', 'claim coverage', `${specClaimIds.size} spec claim(s) linked in the claim source`);
        }

        const sourceRecords = list(claims.source_records) ? claims.source_records : [];
        const sourceRecordIds = new Set();
        const internalOnlySourceIds = [];
        let sourceRecordProblem = false;
        for (const [index, record] of sourceRecords.entries()) {
          const sourceId = text(record?.source_id);
          if (!sourceId || sourceRecordIds.has(sourceId)) {
            sourceRecordProblem = true;
            continue;
          }
          sourceRecordIds.add(sourceId);
          const sourceFile = localPath(packageDir, record?.record_file, `claim source record ${sourceId}`);
          if (sourceFile.error || !existsSync(sourceFile.path)) {
            sourceRecordProblem = true;
            continue;
          }
          if (!readFileSync(sourceFile.path, 'utf8').includes(sourceId)) sourceRecordProblem = true;
          const scope = text(record?.scope);
          if (!CLAIM_SOURCE_SCOPES.has(scope)) sourceRecordProblem = true;
          if (scope === 'internal_only') internalOnlySourceIds.push(sourceId);
        }
        const referencedSourceIds = new Set(
          sourceClaims.flatMap((claim) => list(claim?.source_ids) ? claim.source_ids.map(text).filter(Boolean) : []),
        );
        const unlinkedClaimIds = sourceClaims
          .filter((claim) => specClaimIds.has(text(claim?.claim_id)))
          .filter((claim) => !list(claim?.source_ids) || claim.source_ids.map(text).filter(Boolean).length === 0)
          .map((claim) => text(claim.claim_id));
        const unresolvedSourceIds = [...referencedSourceIds].filter((sourceId) => !sourceRecordIds.has(sourceId));
        if ((referencedSourceIds.size || unlinkedClaimIds.length) && (!sourceRecords.length || sourceRecordProblem || unresolvedSourceIds.length || unlinkedClaimIds.length)) {
          const detail = unlinkedClaimIds.length
            ? `claim(s) with no source ID: ${unlinkedClaimIds.join(', ')}`
            : unresolvedSourceIds.length
              ? `unresolved source ID(s): ${unresolvedSourceIds.join(', ')}`
              : 'each referenced source ID needs one non-duplicated local record_file, visible ID, and scope';
          incomplete('claim source resolution', detail);
        } else if (referencedSourceIds.size) {
          add('PASS', 'claim source resolution', `${referencedSourceIds.size} referenced source ID(s) resolve to scoped local records`);
        }
        if ((manifest.status === 'ready' || manifest.publication?.status === 'approved') && internalOnlySourceIds.length) {
          incomplete('claim source publication scope', `internal_only source ID(s) cannot support a ready or approved Field Guide: ${internalOnlySourceIds.join(', ')}`);
        }
      }
    } catch {
      if (spec?.truth_class === 'operating_method') {
        incomplete('claim linkage', 'operating_method claim source must be a JSON claim ledger with source IDs and scoped local records');
      } else {
        add('PASS', 'claim linkage', 'non-JSON claim source exists; reviewer must confirm mapping');
      }
    }
  } else if (claimPath && spec) {
    if (spec.truth_class === 'operating_method') {
      incomplete('claim linkage', 'operating_method cannot self-attest only through its own spec; link a separate claim ledger or source record');
    } else {
      add('PASS', 'claim linkage', 'claims are embedded in the validated Field Guide spec');
    }
  }

  checkPath('reference atoms', manifest.package.reference_atoms_file);

  const analyticsPath = checkPath('analytics record', manifest.package.analytics_file);
  if (analyticsPath) {
    const analyticsId = text(manifest.package.analytics_content_id);
    if (!analyticsId) {
      incomplete('analytics linkage', 'analytics_content_id is missing');
    } else if (!readFileSync(analyticsPath, 'utf8').includes(analyticsId)) {
      incomplete('analytics linkage', `analytics file does not contain ${analyticsId}`);
    } else {
      add('PASS', 'analytics linkage', analyticsId);
    }
  }

  const postCardPath = checkPath('post card', manifest.package.post_card_file);
  const captionPath = checkPath('caption file', manifest.caption.file);
  if (!CAPTION_STATUSES.has(manifest.caption.status)) {
    incomplete('caption approval', 'caption.status must be draft or approved');
  } else if (isReadyTarget && manifest.caption.status !== 'approved') {
    incomplete('caption approval', 'ready Field Guide requires an approved caption');
  } else {
    add('PASS', 'caption approval', manifest.caption.status);
  }
  if (!PUBLICATION_STATUSES.has(manifest.publication.status)) {
    incomplete('publication status', 'publication.status must be draft or approved');
  } else if (isReadyTarget && manifest.publication.status !== 'approved') {
    incomplete('publication status', 'ready Field Guide requires approved publication status');
  } else {
    add('PASS', 'publication status', manifest.publication.status);
  }
  const hookPath = checkPath('selected hook file', manifest.caption.selected_hook_file);
  if (hookPath) {
    const hookId = text(manifest.caption.selected_hook_id);
    const hookPattern = hookId && new RegExp(`(^|\\n)\\s*${escapeRegExp(hookId)}[.)]`, 'm');
    if (!hookPattern || !hookPattern.test(readFileSync(hookPath, 'utf8'))) {
      incomplete('selected hook linkage', `hook ${hookId || '(missing)'} is not present in ${manifest.caption.selected_hook_file}`);
    } else {
      add('PASS', 'selected hook linkage', `hook ${hookId}`);
    }
  }

  const figma = manifest.figma;
  const figmaKey = text(figma.file_key);
  const figmaNode = text(figma.node_id);
  const figmaUrl = text(figma.url);
  const figmaStatus = text(figma.metadata_status);
  if (!figmaKey || !figmaNode || !figmaUrl || !text(figma.recorded_version)) {
    incomplete('Figma metadata', 'file_key, node_id, URL, and recorded_version are required');
  } else if (!figmaUrl.includes(`/design/${figmaKey}`) || !normalize(figmaUrl).includes(normalize(figmaNode))) {
    incomplete('Figma metadata', 'Figma URL must agree with file_key and node_id');
  } else if (!FIGMA_METADATA_STATUSES.has(figmaStatus)) {
    incomplete('Figma metadata', 'metadata_status must be verified or recorded_not_locally_verified');
  } else if (figmaStatus !== 'verified') {
    incomplete('Figma metadata', 'metadata is recorded but has not been locally verified against the source');
  } else {
    add('PASS', 'Figma metadata', `${figmaKey} / ${figmaNode}`);
  }

  const exported = manifest.export;
  if (!EXPORT_STATUSES.has(exported.status)) {
    incomplete('exact export', 'export.status must be not_exported or exported');
  } else if (exported.status === 'not_exported') {
    incomplete('exact export', 'no local PNG/PDF export and hash are recorded');
  } else {
    const exportPath = checkPath('exact export file', exported.file);
    const expectedHash = text(exported.sha256).toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(expectedHash)) {
      incomplete('exact export hash', 'sha256 must be a 64-character lowercase hexadecimal digest');
    } else if (exportPath && sha256(exportPath) !== expectedHash) {
      incomplete('exact export hash', 'recorded sha256 does not match the local export');
    } else if (exportPath) {
      add('PASS', 'exact export hash', expectedHash);
    }
    const format = text(exported.format).toLowerCase();
    if (!['png', 'pdf'].includes(format)) {
      incomplete('exact export metadata', 'format must be png or pdf');
    } else if (!Number.isInteger(exported.width) || exported.width <= 0 || !Number.isInteger(exported.height) || exported.height <= 0) {
      incomplete('exact export metadata', 'positive width and height are required');
    } else if (exportPath && format === 'png') {
      const dimensions = pngDimensions(exportPath);
      if (!dimensions || dimensions.width !== exported.width || dimensions.height !== exported.height) {
        incomplete('exact export metadata', 'recorded PNG dimensions do not match the local export');
      } else {
        add('PASS', 'exact export metadata', `${dimensions.width}×${dimensions.height} PNG`);
      }
    } else {
      add('PASS', 'exact export metadata', `${exported.width}×${exported.height} ${format.toUpperCase()}`);
    }
  }

  if (postCardPath && captionPath) {
    const postCard = readFileSync(postCardPath, 'utf8');
    const captionLinked = postCard.includes(basename(captionPath));
    const visualToken = exported.status === 'exported' && text(exported.file) ? basename(exported.file) : figmaNode;
    const visualLinked = visualToken && normalize(postCard).includes(normalize(visualToken));
    if (!captionLinked || !visualLinked) {
      incomplete('selected visual/caption linkage', `post card must name ${visualToken || 'the selected visual'} and ${basename(captionPath)}`);
    } else {
      add('PASS', 'selected visual/caption linkage', `${visualToken} + ${basename(captionPath)}`);
    }
  }

  const choreographyPath = checkPath('visual-copy choreography', manifest.package.choreography_file);
  if (choreographyPath) {
    try {
      const choreography = parseJson(choreographyPath, 'visual-copy choreography');
      if (choreography.field_guide_id !== manifest.field_guide_id) {
        incomplete('choreography identity', 'choreography field_guide_id does not match the manifest');
      }
      const visualUnits = choreography.visual?.core_units;
      const choreographyCaption = choreography.caption;
      const choreographyHook = choreography.hook;
      const reviewDecision = choreography.review?.decision;
      if (!list(visualUnits) || visualUnits.length === 0 || !object(choreographyCaption)) {
        incomplete('choreography contract', 'visual core units and caption role are required');
      } else {
        add('PASS', 'choreography contract', `${visualUnits.length} visual teaching unit(s) recorded`);
        if (text(choreographyCaption.file) !== text(manifest.caption.file)) {
          incomplete('choreography caption linkage', 'choreography.caption.file does not match manifest.caption.file');
        } else {
          add('PASS', 'choreography caption linkage', manifest.caption.file);
        }
        if (!object(choreographyHook)
          || text(choreographyHook.file) !== text(manifest.caption.selected_hook_file)
          || text(choreographyHook.selected_hook_id) !== text(manifest.caption.selected_hook_id)) {
          incomplete('choreography hook linkage', 'choreography hook file or selected ID does not match the manifest');
        } else {
          add('PASS', 'choreography hook linkage', `hook ${manifest.caption.selected_hook_id}`);
        }
        if (captionPath) {
          const captionText = readFileSync(captionPath, 'utf8');
          const caption = normalize(captionText);
          const captionLines = captionText.split(/\r?\n/).map((line) => normalize(line)).filter(Boolean);
          const allowed = new Set(choreographyCaption.allowed_verbatim_unit_ids ?? []);
          const repeats = visualUnits.flatMap((unit) => {
            if (allowed.has(unit.unit_id)) return [];
            const literalRepeat = text(unit.on_visual_text).length >= 12 && caption.includes(normalize(unit.on_visual_text));
            const terms = list(unit.duplicate_check_terms) ? unit.duplicate_check_terms.map(normalize).filter((term) => term.length >= 3) : [];
            const clusterRepeat = terms.length >= 2 && captionLines.some((line) => terms.every((term) => line.includes(term)));
            return literalRepeat || clusterRepeat ? [`${unit.unit_id}: ${unit.on_visual_text}`] : [];
          });
          if (repeats.length) {
            add('WARN', 'visual/caption duplicate warning', `caption repeats ${repeats.join(' | ')}`);
          } else {
            add('PASS', 'visual/caption duplicate warning', 'no unapproved full visual-unit repeats detected');
          }
        }
      }
      if (!CHOREOGRAPHY_DECISIONS.has(reviewDecision)) {
        incomplete('choreography review', 'review.decision must be pass or revise');
      } else if (reviewDecision !== 'pass') {
        incomplete('choreography review', `review is ${reviewDecision}`);
      } else {
        add('PASS', 'choreography review', 'pass');
      }
    } catch (error) {
      add('FAIL', 'choreography JSON', error.message);
    }
  }

  for (const entry of entries) {
    process.stdout.write(`${entry.status} ${entry.label}${entry.detail ? ` — ${entry.detail}` : ''}\n`);
  }
  const failures = entries.filter((entry) => entry.status === 'FAIL').length;
  const incompleteCount = entries.filter((entry) => entry.status === 'INCOMPLETE').length;
  const warnings = entries.filter((entry) => entry.status === 'WARN').length;
  const ready = failures === 0 && incompleteCount === 0 && warnings === 0 && manifest.status === 'ready';
  process.stdout.write(
    `Field Guide package audit: ${manifest.field_guide_id} | status=${manifest.status} | ready=${ready} | failures=${failures} | incomplete=${incompleteCount} | warnings=${warnings}\n`,
  );
  if (failures > 0) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
}
