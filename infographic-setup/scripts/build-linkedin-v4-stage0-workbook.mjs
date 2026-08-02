import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

const parseArgs = (tokens) => {
  const parsed = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === "--help" || token === "-h") {
      parsed.help = true;
      continue;
    }
    if (!token.startsWith("--")) throw new Error(`Unexpected argument: ${token}`);
    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    const value = inlineValue ?? tokens[index + 1];
    if (inlineValue === undefined) index += 1;
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${rawKey}`);
    parsed[rawKey] = value;
  }
  return parsed;
};

const cli = parseArgs(process.argv.slice(2));
const usage = `Usage:
  node infographic-setup/scripts/build-linkedin-v4-stage0-workbook.mjs \\
    --pre-run-workbook <path> \\
    --private-analytics-workbook <path> \\
    --study-dir <path> \\
    --output <path> \\
    --preview-dir <path> \\
    [--artifact-tool-module <path>]

Required:
  --private-analytics-workbook  Native LinkedIn AggregateAnalytics .xlsx used to verify the frozen private baseline.

Safe repository defaults are provided for --pre-run-workbook, --study-dir, and --output.
The preview default is /private/tmp/linkedin-v4-stage0-workbook-previews.`;

if (cli.help) {
  console.log(usage);
  process.exit(0);
}

const defaultStudyRoot = path.join(
  repoRoot,
  "infographic-setup/references/outputs/019f9f5f-70b9-7a02-905c-01042213e908/linkedin-v4-full-study-2026-07-28",
);
const studyRoot = path.resolve(cli["study-dir"] ?? defaultStudyRoot);
const sourceWorkbookPath = path.resolve(
  cli["pre-run-workbook"] ??
    path.join(repoRoot, "infographic-setup/references/outputs/linkedin-v4-stage0-2026-07-27/linkedin-v4-stage0-research-control.xlsx"),
);
if (!cli["private-analytics-workbook"]) throw new Error(`${usage}\n\nMissing required --private-analytics-workbook.`);
const privateAnalyticsWorkbookPath = path.resolve(cli["private-analytics-workbook"]);
const outputPath = path.resolve(cli.output ?? path.join(studyRoot, "linkedin-v4-stage0-research-control-final.xlsx"));
const previewDir = path.resolve(cli["preview-dir"] ?? "/private/tmp/linkedin-v4-stage0-workbook-previews");
const inspectionPath = `${outputPath}.inspect.ndjson`;
const loadArtifactTool = async () => {
  try {
    return await import("@oai/artifact-tool");
  } catch (packageError) {
    if (!cli["artifact-tool-module"]) {
      throw new Error(`Could not load @oai/artifact-tool through the loader-provided node_modules path. Pass the loader-provided module file with --artifact-tool-module <path>. Original error: ${packageError.message}`);
    }
    const explicitModule = path.resolve(cli["artifact-tool-module"]);
    if (!(await exists(explicitModule))) throw new Error(`Artifact-tool module not found: ${explicitModule}`);
    return import(pathToFileURL(explicitModule).href);
  }
};

const sources = {
  inputPlan: path.join(studyRoot, "00-input-plan.json"),
  runIndex: path.join(studyRoot, "01-raw/run-index.json"),
  recoveryLog: path.join(studyRoot, "01-raw/recovery-attempt-log.json"),
  normalized: path.join(studyRoot, "02-normalized/full-normalized.json"),
  creatorEligibility: path.join(studyRoot, "02-normalized/creator-eligibility.csv"),
  top100Resolution: path.join(studyRoot, "02-normalized/top100-resolution.csv"),
  reliabilityRows: path.join(studyRoot, "03-blind/reliability-by-field.csv"),
  reliabilitySummary: path.join(studyRoot, "03-blind/reliability-summary.json"),
  currentMarket: path.join(studyRoot, "04-analysis/current-market-posts.csv"),
  tigerPublic: path.join(studyRoot, "04-analysis/tiger-public-posts.csv"),
  top100Cases: path.join(studyRoot, "04-analysis/top100-cases.csv"),
  matchedControls: path.join(studyRoot, "04-analysis/matched-controls.csv"),
  mechanicEffects: path.join(studyRoot, "04-analysis/mechanic-effects.csv"),
  evidenceMatrix: path.join(studyRoot, "04-analysis/evidence-matrix.csv"),
  scoutQueue: path.join(studyRoot, "04-analysis/scout-queue.csv"),
  analysisSummary: path.join(studyRoot, "04-analysis/summary.json"),
  actorSelectionReview: path.join(studyRoot, "actor-selection-review.md"),
  completionReport: path.join(studyRoot, "stage0-completion-report.md"),
};

const navy = "#13233F";
const cobalt = "#1746D1";
const paleBlue = "#EAF0FF";
const paleGreen = "#EAF7EE";
const paleAmber = "#FFF4D6";
const paleRed = "#FDECEC";
const ink = "#172033";
const muted = "#667085";
const line = "#D8DEE9";
const white = "#FFFFFF";
const greenText = "#176B35";
const amberText = "#8A5A00";
const redText = "#9B1C1C";

const readJson = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const sha256File = async (file) => crypto.createHash("sha256").update(await fs.readFile(file)).digest("hex");
const exists = async (file) => {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
};
const { FileBlob, SpreadsheetFile, Workbook } = await loadArtifactTool();

const csvMatrix = async (file, name) => {
  const text = await fs.readFile(file, "utf8");
  const temp = await Workbook.fromCSV(text, { sheetName: name });
  return temp.worksheets.getItem(name).getUsedRange(true).values;
};

const matrixToObjects = (matrix) => {
  const headers = (matrix[0] ?? []).map((value) => String(value ?? ""));
  return matrix.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? null])));
};

const asNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};
const asBoolean = (value) => value === true || String(value).toLowerCase() === "true";
const median = (values) => {
  const numbers = values.map(asNumber).filter((value) => value !== null).sort((a, b) => a - b);
  if (!numbers.length) return null;
  const middle = Math.floor(numbers.length / 2);
  return numbers.length % 2 ? numbers[middle] : (numbers[middle - 1] + numbers[middle]) / 2;
};
const excelColumn = (index) => {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }
  return label;
};
const safeFileName = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const urlFingerprint = (value) => {
  try {
    const stem = new URL(String(value)).pathname.replace(/^\/posts\//, "");
    return stem.replace(/-(?:activity|share|ugcPost)-\d+-[^/]+$/i, "").toLowerCase();
  } catch {
    return "";
  }
};

const inputPlan = await readJson(sources.inputPlan);
const runIndex = await readJson(sources.runIndex);
const recoveryLog = await readJson(sources.recoveryLog);
const normalized = await readJson(sources.normalized);
const analysisSummary = await readJson(sources.analysisSummary);
const reliabilityAvailable = await exists(sources.reliabilitySummary);
const reliabilitySummary = reliabilityAvailable ? await readJson(sources.reliabilitySummary) : null;
const chargedLimitTerminatedExecutions = runIndex.runs.filter((run) =>
  Number(run.usageTotalUsd ?? 0) > 0 &&
  /free user item limit exceeded|charged[_ -]?limit[_ -]?terminated/i.test(`${run.statusMessage ?? ""} ${run.executionClass ?? ""}`)
).length;
const dataProducingExecutions = runIndex.totals.runCount - chargedLimitTerminatedExecutions;

const creatorEligibilityMatrix = await csvMatrix(sources.creatorEligibility, "CreatorEligibilitySource");
const top100ResolutionMatrix = await csvMatrix(sources.top100Resolution, "Top100ResolutionSource");
const currentMarketMatrix = await csvMatrix(sources.currentMarket, "CurrentMarketSource");
const tigerPublicMatrix = await csvMatrix(sources.tigerPublic, "TigerPublicSource");
const top100CasesMatrix = await csvMatrix(sources.top100Cases, "Top100CasesSource");
const matchedControlsMatrix = await csvMatrix(sources.matchedControls, "MatchedControlsSource");
const mechanicEffectsMatrix = await csvMatrix(sources.mechanicEffects, "MechanicEffectsSource");
const evidenceMatrixSource = await csvMatrix(sources.evidenceMatrix, "EvidenceMatrixSource");
const scoutQueueMatrix = await csvMatrix(sources.scoutQueue, "ScoutQueueSource");
const reliabilityMatrix = reliabilityAvailable
  ? await csvMatrix(sources.reliabilityRows, "ReliabilitySource")
  : [["pass_id", "field", "item_n", "exact_n", "exact_agreement", "gwet_ac1", "category_count", "expected_agreement", "disagreement_pairs"]];

const countMatrixValue = (matrix, field, expected) => {
  const index = matrix[0].indexOf(field);
  if (index < 0) throw new Error(`Expected field ${field} was not found.`);
  return matrix.slice(1).filter((row) => row[index] === expected).length;
};
const assertAllowedMatrixValues = (matrix, field, allowed) => {
  const index = matrix[0].indexOf(field);
  if (index < 0) throw new Error(`Expected field ${field} was not found.`);
  const observed = [...new Set(matrix.slice(1).map((row) => row[index]))];
  const unexpected = observed.filter((value) => !allowed.includes(value));
  if (unexpected.length) throw new Error(`Unexpected ${field} values: ${unexpected.join(", ")}`);
};
assertAllowedMatrixValues(evidenceMatrixSource, "trackAStatus", ["heuristic_peer_signal", "not_observed"]);
assertAllowedMatrixValues(evidenceMatrixSource, "trackBStatus", ["heuristic_top100_signal", "not_observed"]);
assertAllowedMatrixValues(evidenceMatrixSource, "nearPeerStatus", ["heuristic_positive", "not_observed"]);
assertAllowedMatrixValues(evidenceMatrixSource, "classification", ["cross_track_heuristic_signal", "peer_heuristic_signal", "top100_heuristic_signal", "unresolved"]);
assertAllowedMatrixValues(evidenceMatrixSource, "productionTreatment", ["prospective_test_only", "consider_one_variable_peer_test", "inspiration_or_one_variable_test", "do_not_standardize"]);
assertAllowedMatrixValues(scoutQueueMatrix, "screeningTier", ["screen_A", "screen_B"]);
assertAllowedMatrixValues(scoutQueueMatrix, "screeningStatus", ["exploratory_only_failed_reliability_gate"]);
const heuristicCounts = {
  peer: countMatrixValue(evidenceMatrixSource, "classification", "peer_heuristic_signal"),
  top100: countMatrixValue(evidenceMatrixSource, "classification", "top100_heuristic_signal"),
  crossTrack: countMatrixValue(evidenceMatrixSource, "classification", "cross_track_heuristic_signal"),
  unresolved: countMatrixValue(evidenceMatrixSource, "classification", "unresolved"),
  nearPeerPositive: countMatrixValue(evidenceMatrixSource, "nearPeerStatus", "heuristic_positive"),
};
const scoutCounts = {
  screenA: countMatrixValue(scoutQueueMatrix, "screeningTier", "screen_A"),
  failedReliability: countMatrixValue(scoutQueueMatrix, "screeningStatus", "exploratory_only_failed_reliability_gate"),
};
if (scoutCounts.screenA !== analysisSummary.counts.screenACombinations) {
  throw new Error(`Scout Screen-A count does not match summary: ${scoutCounts.screenA} != ${analysisSummary.counts.screenACombinations}`);
}
if (heuristicCounts.crossTrack !== analysisSummary.counts.crossTrackHeuristicSignals) {
  throw new Error(`Cross-track heuristic count does not match summary: ${heuristicCounts.crossTrack} != ${analysisSummary.counts.crossTrackHeuristicSignals}`);
}
if (reliabilityAvailable) {
  if ((reliabilitySummary.provenanceIssues?.length ?? 0) !== 3) throw new Error("Expected three reliability provenance issues.");
  if (!String(reliabilitySummary.decision ?? "").includes("no exact-final-codebook claim")) {
    throw new Error("Reliability decision must prohibit an exact-final-codebook claim.");
  }
}

const creatorEligibility = matrixToObjects(creatorEligibilityMatrix);
const currentMarket = matrixToObjects(currentMarketMatrix);
const tigerPublic = matrixToObjects(tigerPublicMatrix);

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(sourceWorkbookPath));
const privateAnalyticsWorkbook = await SpreadsheetFile.importXlsx(await FileBlob.load(privateAnalyticsWorkbookPath));
const inheritedSheetNames = [
  "Control",
  "Tiger Baseline",
  "Tiger Daily",
  "Tiger Audience",
  "Top100 Identity",
  "Peer Roster",
  "Creator Union",
  "Canary Plan",
  "Scout Queue",
  "Codebook Fields",
  "Run Ledger",
];
const stalePreRunVerdictPattern = /Gate 1\s+BLOCKED|no full run|no full extraction|full extraction is (?:not|un)authorized|schema gate is blocked/i;
const findStalePreRunVerdicts = () => {
  const matches = [];
  for (const sheetName of inheritedSheetNames) {
    const sheet = workbook.worksheets.getItem(sheetName);
    const values = sheet.getUsedRange(false).values;
    for (let rowIndex = 0; rowIndex < values.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < (values[rowIndex] ?? []).length; columnIndex += 1) {
        const value = String(values[rowIndex][columnIndex] ?? "");
        if (stalePreRunVerdictPattern.test(value)) {
          matches.push({ sheet: sheetName, row: rowIndex + 1, column: columnIndex + 1, value });
        }
      }
    }
  }
  return matches;
};
const inheritedStaleVerdicts = findStalePreRunVerdicts();
console.log(`INHERITED_STALE_VERDICTS ${JSON.stringify(inheritedStaleVerdicts)}`);
const privateAnalyticsSha256 = await sha256File(privateAnalyticsWorkbookPath);
const baselineSheet = workbook.worksheets.getItem("Tiger Baseline");
const frozenPrivateSha256 = String(baselineSheet.getRange("B5").values[0][0] ?? "");
if (privateAnalyticsSha256 !== frozenPrivateSha256) {
  throw new Error(`Private analytics SHA-256 does not match the frozen pre-run baseline: ${privateAnalyticsSha256} != ${frozenPrivateSha256}`);
}

const privateOverallImpressions = asNumber(
  privateAnalyticsWorkbook.worksheets.getItem("DISCOVERY").getRange("B2").values[0][0],
);
const frozenOverallImpressions = asNumber(baselineSheet.getRange("B7").values[0][0]);
if (privateOverallImpressions !== frozenOverallImpressions) {
  throw new Error(`Private overall impressions do not match the frozen pre-run baseline: ${privateOverallImpressions} != ${frozenOverallImpressions}`);
}

const privatePostUnion = new Map();
for (const row of privateAnalyticsWorkbook.worksheets.getItem("TOP POSTS").getRange("A4:G53").values) {
  const engagementUrl = String(row[0] ?? "");
  const impressionUrl = String(row[4] ?? "");
  if (engagementUrl) {
    const current = privatePostUnion.get(engagementUrl) ?? [engagementUrl, row[1], null, null];
    current[1] = current[1] ?? row[1];
    current[2] = asNumber(row[2]);
    privatePostUnion.set(engagementUrl, current);
  }
  if (impressionUrl) {
    const current = privatePostUnion.get(impressionUrl) ?? [impressionUrl, row[5], null, null];
    current[1] = current[1] ?? row[5];
    current[3] = asNumber(row[6]);
    privatePostUnion.set(impressionUrl, current);
  }
}
const privateRows = [...privatePostUnion.values()];
const frozenRankedUnion = asNumber(baselineSheet.getRange("B10").values[0][0]);
if (privateRows.length !== frozenRankedUnion) {
  throw new Error(`Private ranked-post union does not match the frozen pre-run baseline: ${privateRows.length} != ${frozenRankedUnion}`);
}

const resetSheet = (name) => {
  const sheet = workbook.worksheets.getItem(name);
  for (const table of [...sheet.tables.items]) table.delete();
  sheet.deleteAllDrawings();
  sheet.freezePanes.unfreeze();
  for (const rule of [...sheet.dataValidations.items]) sheet.dataValidations.clear(rule.sqref);
  sheet.getRange("A1:AZ1000").dataValidation = null;
  const used = sheet.getUsedRange(false);
  try {
    used.unmerge();
  } catch {
    // No merged ranges in this sheet.
  }
  used.clear({ applyTo: "all" });
  sheet.showGridLines = false;
  return sheet;
};

const addSheet = (name) => {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridLines = false;
  return sheet;
};

const control = resetSheet("Control");
const runLedger = resetSheet("Run Ledger");
const scoutSheet = resetSheet("Scout Queue");
const canarySheet = workbook.worksheets.getItem("Canary Plan");
canarySheet.getRange("A1").values = [["Dual-Track Canary — Gate 1 PASSED; actual $0.07605; 32 activity rows / 28 canonical posts"]];
canarySheet.getRange("A2").values = [["Executed result: 32 activities normalized to 28 canonical posts; 4 duplicate/wrapper groups explained; media, quote, and repost handling remediated. Gate 1 PASSED; full extraction authorized and completed."]];
canarySheet.getRange("A2:I2").format = {
  fill: paleGreen,
  font: { name: "Aptos", color: greenText, bold: true, size: 10 },
  wrapText: true,
  verticalAlignment: "center",
};
canarySheet.getRange("A2:I2").format.rowHeight = 30;
canarySheet.getRange("G4:G7").values = [
  ["Start billed $0.00005; post run returned 32 activity rows before canonicalization"],
  ["10 raw / 10 canonical; media preserved and unknown quote values kept null"],
  ["10 raw / 6 canonical; four duplicate/wrapper groups explained and canonical rows selected"],
  ["10 raw / 10 canonical; video/media preserved; quote and repost fields normalized explicitly"],
];
canarySheet.getRange("G4:G7").format.wrapText = true;
const manifestSheet = addSheet("Study Manifest");
const eligibilitySheet = addSheet("Creator Eligibility");
const panelsSheet = addSheet("Current-Market Panels");
const recoverySheet = addSheet("Top100 Recovery");
const outcomeSheet = addSheet("Outcome Join");
const controlsSheet = addSheet("Matched Controls");
const effectsSheet = addSheet("Mechanic Effects");
const matrixSheet = addSheet("Evidence Matrix");
const reliabilitySheet = addSheet("Reliability");
const completionSheet = addSheet("Completion");

const prepareSheet = (sheet, title, subtitle, columnCount, cards = []) => {
  const lastColumn = excelColumn(columnCount - 1);
  sheet.mergeCells(`A1:${lastColumn}1`);
  sheet.getRange("A1").values = [[title]];
  sheet.getRange(`A1:${lastColumn}1`).format = {
    fill: navy,
    font: { name: "Aptos Display", bold: true, color: white, size: 18 },
    verticalAlignment: "center",
  };
  sheet.getRange(`A1:${lastColumn}1`).format.rowHeight = 34;
  sheet.mergeCells(`A3:${lastColumn}4`);
  sheet.getRange("A3").values = [[subtitle]];
  sheet.getRange(`A3:${lastColumn}4`).format = {
    fill: paleBlue,
    font: { name: "Aptos", color: ink, size: 10 },
    wrapText: true,
    verticalAlignment: "center",
  };
  sheet.getRange(`A3:${lastColumn}4`).format.rowHeight = 24;
  if (cards.length) {
    const cardLast = excelColumn(cards.length - 1);
    sheet.getRange(`A6:${cardLast}6`).values = [cards.map((card) => card.label)];
    sheet.getRange(`A6:${cardLast}6`).format = {
      fill: cobalt,
      font: { name: "Aptos", bold: true, color: white, size: 10 },
      wrapText: true,
      horizontalAlignment: "center",
      verticalAlignment: "center",
    };
    sheet.getRange(`A6:${cardLast}6`).format.rowHeight = 36;
    sheet.getRange(`A7:${cardLast}7`).values = [cards.map((card) => (card.formula ? null : card.value))];
    cards.forEach((card, index) => {
      const cell = sheet.getRange(`${excelColumn(index)}7`);
      if (card.formula) cell.formulas = [[card.formula]];
      if (card.numberFormat) cell.format.numberFormat = card.numberFormat;
    });
    sheet.getRange(`A7:${cardLast}7`).format = {
      fill: "#F8FAFF",
      font: { name: "Aptos Display", bold: true, color: navy, size: 14 },
      horizontalAlignment: "center",
      verticalAlignment: "center",
      borders: { preset: "outside", style: "thin", color: line },
    };
    cards.forEach((card, index) => {
      if (card.numberFormat) sheet.getRange(`${excelColumn(index)}7`).format.numberFormat = card.numberFormat;
    });
    sheet.getRange(`A7:${cardLast}7`).format.rowHeight = 28;
  }
};

const addTable = (sheet, headers, rows, tableName, widths, options = {}) => {
  const startRow = options.startRow ?? 10;
  const endRow = startRow + rows.length;
  const lastColumn = excelColumn(headers.length - 1);
  sheet.getRange(`A${startRow}:${lastColumn}${endRow}`).values = [headers, ...rows];
  const table = sheet.tables.add(`A${startRow}:${lastColumn}${endRow}`, true, tableName);
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;
  sheet.getRange(`A${startRow}:${lastColumn}${endRow}`).format.font.name = "Aptos";
  sheet.getRange(`A${startRow}:${lastColumn}${endRow}`).format.font.size = 9;
  sheet.getRange(`A${startRow}:${lastColumn}${startRow}`).format = {
    fill: cobalt,
    font: { name: "Aptos", bold: true, color: white, size: 9 },
    wrapText: true,
    verticalAlignment: "center",
  };
  sheet.getRange(`A${startRow}:${lastColumn}${startRow}`).format.rowHeight = 30;
  sheet.getRange(`A${startRow + 1}:${lastColumn}${endRow}`).format.verticalAlignment = "top";
  for (let index = 0; index < headers.length; index += 1) {
    const column = excelColumn(index);
    sheet.getRange(`${column}:${column}`).format.columnWidth = widths[index] ?? 14;
  }
  for (const index of options.wrapColumns ?? []) {
    const column = excelColumn(index);
    sheet.getRange(`${column}${startRow + 1}:${column}${endRow}`).format.wrapText = true;
  }
  for (const [indexText, format] of Object.entries(options.numberFormats ?? {})) {
    const column = excelColumn(Number(indexText));
    sheet.getRange(`${column}${startRow + 1}:${column}${endRow}`).format.numberFormat = format;
  }
  sheet.freezePanes.freezeRows(startRow);
  if ((options.freezeColumns ?? 0) > 0) sheet.freezePanes.freezeColumns(options.freezeColumns);
  return { table, startRow, endRow, lastColumn };
};

const addStatusFormatting = (range, { green = [], amber = [], red = [] }) => {
  for (const text of green) range.conditionalFormats.add("beginsWith", { text, format: { fill: paleGreen, font: { color: greenText, bold: true } } });
  for (const text of amber) range.conditionalFormats.add("beginsWith", { text, format: { fill: paleAmber, font: { color: amberText, bold: true } } });
  for (const text of red) range.conditionalFormats.add("beginsWith", { text, format: { fill: paleRed, font: { color: redText, bold: true } } });
};

// Final landing sheet.
prepareSheet(
  control,
  "LinkedIn V4 — Stage 0 Final Research Control",
  "Completed control for the 2026-07-28 study. This workbook preserves Tiger, current-market, Top-100, reliability, and scouting as separate evidence layers. Findings nominate prospective V4 tests; they do not prove reach causality or a universal content formula.",
  8,
  [
    { label: "Actor executions", value: runIndex.totals.runCount, numberFormat: "#,##0" },
    { label: "Recorded spend", value: runIndex.totals.spendUsd, numberFormat: "$0.000" },
    { label: "Canonical posts", value: normalized.counts.canonicalPosts, numberFormat: "#,##0" },
    { label: "Cross-track heuristic signals", value: heuristicCounts.crossTrack, numberFormat: "#,##0" },
  ],
);
control.getRange("A10:H10").values = [["Evidence layer", "Observed base", "Primary use", "Decision status", "What it supports", "What it cannot support", "Next action", "Owner boundary"]];
const controlRows = [
  ["Tiger", "58 mature public originals; 50 ranked private joins", "Diagnose our current account", "complete_with_ranked_subset", "Private impression concentration and public-response patterns", "A complete failure census or causal explanation", "Run prospective Day-7/Day-30 tests", "Tiger approves voice, judgment, and publication"],
  ["Current market", "20 radar / 15 decision / 10 strict creators", "Monitor peers and screen mechanics", "directional_only", "Within-creator public-response signals", "Balanced 24-person peer design", "Use radar for discovery; strict for sensitivity", "Codex measures; Tiger decides relevance"],
  ["Top-100", "73 references / 72 cases / 42 quantitative", "Reverse-engineer curated winners", "partial_recovery", "Image and caption hypotheses", "Native-format ranking or market prevalence", "Do not buy the €35 tier for completeness; revisit only if a decision depends on a gap", "No imputation"],
  ["Reliability", reliabilityAvailable ? `28 blind items; two isolated model passes; ${reliabilitySummary.provenanceIssues?.length ?? 0} provenance issues` : "Pending", "Test coding consistency", reliabilityAvailable ? "gate_failed" : "pending", "Where meaning-heavy boundaries need revision", "Human validity, exact-final-codebook provenance, or a frozen taxonomy", "Repair the process prospectively; do not backfill coder files", "Do not force a pass"],
  ["V4 synthesis", `${heuristicCounts.crossTrack} cross-track heuristic signals; ${scoutCounts.screenA} screen_A combinations (exploratory)`, "Choose prospective tests, not rules", "proceed_to_pilot", "A disciplined discovery queue", "Validated topics, causal mechanics, guaranteed reach, leads, or revenue", "Qualify six investigations, then build Week 1 with one declared variable", "Five useful posts; manual thoughtful comments"],
];
control.getRange("A11:H15").values = controlRows;
control.getRange("A10:H15").format.font.name = "Aptos";
control.getRange("A10:H10").format = { fill: cobalt, font: { bold: true, color: white }, wrapText: true };
control.getRange("A11:H15").format = { wrapText: true, verticalAlignment: "top" };
control.getRange("A10:H15").format.borders = { preset: "inside", style: "thin", color: line };
control.getRange("D11:D15").conditionalFormats.add("containsText", { text: "complete", format: { fill: paleGreen, font: { color: greenText, bold: true } } });
control.getRange("D11:D15").conditionalFormats.add("containsText", { text: "proceed", format: { fill: paleGreen, font: { color: greenText, bold: true } } });
control.getRange("D11:D15").conditionalFormats.add("containsText", { text: "directional", format: { fill: paleAmber, font: { color: amberText, bold: true } } });
control.getRange("D11:D15").conditionalFormats.add("containsText", { text: "partial", format: { fill: paleAmber, font: { color: amberText, bold: true } } });
control.getRange("D11:D15").conditionalFormats.add("containsText", { text: "failed", format: { fill: paleRed, font: { color: redText, bold: true } } });
control.getRange("A17:B17").values = [["Decision", "Move into a prospective V4 audience-learning pilot; install no external mechanic as a permanent rule."]];
control.getRange("A17:B17").format = { fill: paleGreen, font: { color: greenText, bold: true }, wrapText: true };
control.mergeCells("B17:H18");
control.getRange("A20:H20").values = [["Color key", "Complete / proceed", null, "Directional / partial", null, "Failed / blocked", null, "Neutral"]];
control.getRange("A20:H20").format.font.bold = true;
control.getRange("B20:C20").format.fill = paleGreen;
control.getRange("D20:E20").format.fill = paleAmber;
control.getRange("F20:G20").format.fill = paleRed;
control.getRange("H20").format.fill = paleBlue;
[24, 20, 28, 22, 30, 31, 32, 28].forEach((width, index) => { control.getRange(`${excelColumn(index)}:${excelColumn(index)}`).format.columnWidth = width; });
control.freezePanes.freezeRows(10);

// Study manifest.
const manifestFiles = [
  ["Input plan", sources.inputPlan, inputPlan.counts.trackACandidateProfiles, "Frozen targets and budget envelope", "complete"],
  ["Run index", sources.runIndex, runIndex.totals.runCount, "Apify run provenance and spend", "complete"],
  ["Normalized corpus", sources.normalized, normalized.counts.canonicalPosts, "Canonical post and activity registry", "validated"],
  ["Creator eligibility", sources.creatorEligibility, creatorEligibility.length, "Coverage and panel membership", "complete"],
  ["Top-100 recovery", sources.top100Resolution, top100ResolutionMatrix.length - 1, "All reference recovery states", "partial"],
  ["Reliability", sources.reliabilitySummary, reliabilityAvailable ? reliabilityMatrix.length - 1 : 0, "Inter-run consistency; not human validity", reliabilityAvailable ? "gate_failed" : "pending"],
  ["Current market", sources.currentMarket, currentMarket.length, "Radar, decision, and strict post registry", "complete"],
  ["Tiger public", sources.tigerPublic, tigerPublic.length, "Mature public originals", "complete"],
  ["Top-100 cases", sources.top100Cases, top100CasesMatrix.length - 1, "Recovered cases and baselines", "partial"],
  ["Matched controls", sources.matchedControls, matchedControlsMatrix.length - 1, "Automated heuristic AH matches", "complete"],
  ["Mechanic effects", sources.mechanicEffects, mechanicEffectsMatrix.length - 1, "Exploratory heuristic effects", "complete"],
  ["Evidence matrix", sources.evidenceMatrix, evidenceMatrixSource.length - 1, "Cross-track classifications", "complete"],
  ["Scout queue", sources.scoutQueue, scoutQueueMatrix.length - 1, "Provisional problem/job/artifact combinations", "complete"],
  ["Actor selection", sources.actorSelectionReview, 5, "Point-in-time Actor comparison and no-upgrade decision", "complete"],
  ["Completion report", sources.completionReport, 1, "Decision summary and V4 operating map", "complete"],
];
const manifestRows = [];
for (const [layer, file, records, purpose, status] of manifestFiles) {
  manifestRows.push([layer, path.relative(studyRoot, file), records, purpose, status, await sha256File(file)]);
}
prepareSheet(manifestSheet, "Study Manifest", "Auditable source registry for the completed Stage-0 package. Hashes protect provenance; record counts describe the row or case level named in each source.", 6, [
  { label: "Key source files", value: manifestRows.length, numberFormat: "#,##0" },
  { label: "Actor executions", value: runIndex.totals.runCount, numberFormat: "#,##0" },
  { label: "Recorded spend", value: runIndex.totals.spendUsd, numberFormat: "$0.000" },
  { label: "Hard stop", value: runIndex.safety.hardStopUsd, numberFormat: "$0.00" },
  { label: "Headroom", formula: "=D7-C7", numberFormat: "$0.000" },
]);
const manifestTable = addTable(manifestSheet, ["Layer", "Relative source", "Records", "Purpose", "Status", "SHA-256"], manifestRows, "FinalStudyManifestTable", [20, 52, 12, 34, 18, 68], { wrapColumns: [1, 3], numberFormats: { 2: "#,##0" }, freezeColumns: 1 });
addStatusFormatting(manifestSheet.getRange(`E11:E${manifestTable.endRow}`), { green: ["complete", "validated"], amber: ["partial", "pending"], red: ["gate_failed"] });

// Creator eligibility registry.
prepareSheet(eligibilitySheet, "Creator Eligibility", "Outcome-blind coverage states for all 30 current-market candidates. Left-censored histories remain unresolved and are never relabelled as failures.", creatorEligibilityMatrix[0].length, [
  { label: "Candidates", value: creatorEligibility.length, numberFormat: "#,##0" },
  { label: "Confirmed", value: analysisSummary.counts.confirmedPassCreators, numberFormat: "#,##0" },
  { label: "Left-censored", value: analysisSummary.counts.leftCensoredCreators, numberFormat: "#,##0" },
  { label: "Observed fail", value: analysisSummary.counts.observedFailCreators, numberFormat: "#,##0" },
  { label: "Missing history", value: analysisSummary.counts.missingHistoryCreators, numberFormat: "#,##0" },
]);
const eligibilityRows = creatorEligibilityMatrix.slice(1).map((row) => row.map((value, index) => {
  if ([4, 6, 7, 10, 11, 12].includes(index)) return asNumber(value);
  if ([8, 24, 25, 26, 27].includes(index)) return asBoolean(value);
  if ([13, 14, 15, 16].includes(index)) return asNumber(value);
  return value;
}));
const eligibilityWidths = [13, 24, 42, 24, 12, 20, 14, 14, 13, 22, 14, 14, 12, 12, 12, 12, 13, 18, 18, 34, 22, 34, 48, 68, 12, 12, 12, 12];
const eligibilityTable = addTable(eligibilitySheet, creatorEligibilityMatrix[0], eligibilityRows, "FinalCreatorEligibilityTable", eligibilityWidths, { wrapColumns: [2, 19, 21, 22], numberFormats: { 4: "#,##0", 9: "yyyy-mm-dd", 13: "0.0%", 14: "0.0%", 15: "0.0%", 16: "0.0%" }, freezeColumns: 2 });
addStatusFormatting(eligibilitySheet.getRange(`R11:R${eligibilityTable.endRow}`), { green: ["confirmed"], amber: ["left_censored"], red: ["observed_fail", "missing_history"] });

// Current-market creator-level panel summary.
const marketByCreator = new Map();
for (const post of currentMarket) {
  const creatorId = String(post.creatorId ?? "");
  if (!marketByCreator.has(creatorId)) {
    marketByCreator.set(creatorId, {
      creatorId,
      creator: post.creator,
      cohort: post.cohort,
      sizeCell: post.sizeCell,
      followerCount: asNumber(post.followerCount),
      posts: [],
    });
  }
  marketByCreator.get(creatorId).posts.push(post);
}
const eligibilityById = new Map(creatorEligibility.map((row) => [String(row.candidateId), row]));
const panelRows = [...marketByCreator.values()].sort((a, b) => String(a.creator).localeCompare(String(b.creator))).map((creator) => {
  const eligible = eligibilityById.get(creator.creatorId) ?? {};
  const formats = new Map();
  creator.posts.forEach((post) => formats.set(post.nativeFormat, (formats.get(post.nativeFormat) ?? 0) + 1));
  const primaryFormat = [...formats.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))[0]?.[0] ?? "";
  return [
    creator.creatorId,
    creator.creator,
    creator.cohort,
    creator.sizeCell,
    creator.followerCount,
    asBoolean(eligible.radarPanel),
    asBoolean(eligible.decisionPanel),
    asBoolean(eligible.strictPanel),
    creator.posts.length,
    creator.posts.filter((post) => asBoolean(post.decisionPanel)).length,
    creator.posts.filter((post) => asBoolean(post.strictPanel)).length,
    median(creator.posts.map((post) => post.publicInteractions)),
    median(creator.posts.map((post) => post.responseRatio)),
    primaryFormat,
    eligible.coverageStatus ?? "",
    eligible.eligibilityStatus ?? "",
  ];
});
prepareSheet(panelsSheet, "Current-Market Panels", "Creator-level registry for the three evidence thresholds. Radar is for discovery, decision is directional, and strict is the provisional peer-effects sensitivity lane.", 16, [
  { label: "Radar creators", value: analysisSummary.counts.radarPanelCreators, numberFormat: "#,##0" },
  { label: "Radar posts", value: analysisSummary.counts.radarPanelPosts, numberFormat: "#,##0" },
  { label: "Decision creators", value: analysisSummary.counts.decisionPanelCreators, numberFormat: "#,##0" },
  { label: "Decision posts", value: analysisSummary.counts.decisionPanelPosts, numberFormat: "#,##0" },
  { label: "Strict creators", value: analysisSummary.counts.strictPanelCreators, numberFormat: "#,##0" },
  { label: "Strict posts", value: analysisSummary.counts.strictPanelPosts, numberFormat: "#,##0" },
]);
const panelsTable = addTable(panelsSheet, ["Creator ID", "Creator", "Cohort", "Size cell", "Followers", "Radar", "Decision", "Strict", "Radar post N", "Decision post N", "Strict post N", "Median public interactions", "Median response ratio", "Primary format", "Coverage state", "Eligibility state"], panelRows, "CurrentMarketPanelsTable", [13, 24, 24, 20, 12, 10, 10, 10, 13, 14, 12, 18, 18, 20, 18, 18], { numberFormats: { 4: "#,##0", 8: "#,##0", 9: "#,##0", 10: "#,##0", 11: "#,##0", 12: "0.00x" }, freezeColumns: 2 });
addStatusFormatting(panelsSheet.getRange(`P11:P${panelsTable.endRow}`), { green: ["confirmed"], amber: ["not_confirmed"], red: [] });

// Top-100 recovery registry.
prepareSheet(recoverySheet, "Top100 Recovery", "All 100 workbook references remain visible. Recovered cases enter the case registry; absent exact URLs and unresolved permalinks are never imputed.", top100ResolutionMatrix[0].length, [
  { label: "References", value: 100, numberFormat: "#,##0" },
  { label: "Recovered refs", value: analysisSummary.counts.top100RecoveredReferences, numberFormat: "#,##0" },
  { label: "Unique cases", value: analysisSummary.counts.top100RecoveredUniqueCases, numberFormat: "#,##0" },
  { label: "Quantitative cases", value: analysisSummary.counts.top100QuantitativeCases, numberFormat: "#,##0" },
  { label: "Missing refs", value: analysisSummary.counts.top100MissingReferences, numberFormat: "#,##0" },
  { label: "Known URL gaps", value: analysisSummary.counts.top100KnownUrlsNotRecovered, numberFormat: "#,##0" },
]);
const recoveryTable = addTable(recoverySheet, top100ResolutionMatrix[0], top100ResolutionMatrix.slice(1).map((row) => [asNumber(row[0]), ...row.slice(1)]), "Top100RecoveryTable", [12, 18, 12, 24, 42, 58, 25, 26, 56], { wrapColumns: [4, 5, 8], numberFormats: { 0: "0" }, freezeColumns: 2 });
addStatusFormatting(recoverySheet.getRange(`H11:H${recoveryTable.endRow}`), { green: ["recovered"], amber: ["exact_url_not_recovered", "unresolved"], red: ["missing"] });

// Run ledger, including the blocked final recovery attempt.
const actorLane = (run) => (run.chargedEventCounts?.profile !== undefined ? "profile" : "post");
const runRows = runIndex.runs.map((run, index) => {
  const inputTargets = run.input?.urls?.length ?? run.input?.targetUrls?.length ?? 0;
  const outputRows = (run.chargedEventCounts?.profile ?? 0) + (run.chargedEventCounts?.post ?? 0);
  return [index + 1, actorLane(run), run.runId, run.actorId, run.status, run.statusMessage ?? "", run.startedAt, run.finishedAt, inputTargets, run.usageTotalUsd, outputRows, run.options?.maxTotalChargeUsd ?? null, run.datasetId, "comments=false; reactions=false; email=false"];
});
runRows.push([
  runRows.length + 1,
  "recovery",
  recoveryLog.runId ?? "",
  recoveryLog.actor,
  "NOT_STARTED",
  recoveryLog.platformError,
  recoveryLog.attemptedAt,
  "",
  recoveryLog.inputCount,
  recoveryLog.amountChargedUsd,
  0,
  recoveryLog.chargeCapUsd,
  recoveryLog.datasetId ?? "",
  "comments=false; reactions=false; email=false",
]);
prepareSheet(runLedger, "Run Ledger", `$${runIndex.totals.spendUsd.toFixed(3)} recorded Apify spend across ${runIndex.totals.runCount} actor executions; ${dataProducingExecutions} data-producing, ${chargedLimitTerminatedExecutions} charged limit-terminated execution. The final 16-URL recovery was refused before run creation and cost $0.`, 14, [
  { label: "Ledger rows", value: runRows.length, numberFormat: "#,##0" },
  { label: "Actor executions", value: runIndex.totals.runCount, numberFormat: "#,##0" },
  { label: "Data-producing", value: dataProducingExecutions, numberFormat: "#,##0" },
  { label: "Recorded spend", value: runIndex.totals.spendUsd, numberFormat: "$0.000" },
  { label: "Hard stop", value: runIndex.safety.hardStopUsd, numberFormat: "$0.00" },
  { label: "Remaining headroom", formula: "=E7-D7", numberFormat: "$0.000" },
]);
const runTable = addTable(runLedger, ["Seq", "Lane", "Run ID", "Actor ID", "Status", "Status message", "Started", "Finished", "Input targets", "Spend USD", "Output rows", "Charge cap USD", "Dataset ID", "Privacy boundary"], runRows, "FinalRunLedgerTable", [8, 12, 22, 22, 16, 28, 22, 22, 13, 13, 13, 15, 22, 36], { wrapColumns: [5, 13], numberFormats: { 0: "0", 6: "yyyy-mm-dd hh:mm", 7: "yyyy-mm-dd hh:mm", 8: "#,##0", 9: "$0.00000", 10: "#,##0", 11: "$0.00000" }, freezeColumns: 2 });
addStatusFormatting(runLedger.getRange(`E11:E${runTable.endRow}`), { green: ["SUCCEEDED"], amber: ["NOT_STARTED"], red: ["FAILED", "ABORTED"] });

// Tiger public/private outcome join.
const privateByFingerprint = new Map(privateRows.map((row) => [urlFingerprint(row[0]), row]));
const outcomeRows = tigerPublic.map((post) => {
  const fingerprint = urlFingerprint(post.canonicalUrl);
  const privateRow = privateByFingerprint.get(fingerprint);
  return [
    post.canonicalPostId,
    post.publishedAt,
    post.canonicalUrl,
    fingerprint,
    post.nativeFormat,
    post.hook,
    post.job,
    post.artifact,
    post.problemFamily,
    asNumber(post.publicInteractions),
    asNumber(post.creatorMedianInteractions),
    asNumber(post.responseRatio),
    privateRow ? asNumber(privateRow[2]) : null,
    privateRow ? asNumber(privateRow[3]) : null,
    privateRow ? privateRow[0] : "",
    privateRow ? "deterministic_ranked_join" : "public_only",
    null,
    null,
  ];
});
const joinedCount = outcomeRows.filter((row) => row[15] === "deterministic_ranked_join").length;
if (joinedCount !== 50) throw new Error(`Tiger outcome join expected 50 rows; observed ${joinedCount}.`);
prepareSheet(outcomeSheet, "Outcome Join", "Tiger's 58 mature public originals joined to the private ranked subset by a deterministic LinkedIn URL slug fingerprint. Missing private rows remain blank—not zero. Top-post share uses the period-wide 331,745 overall impressions from the private export, not the sum of ranked rows.", 18, [
  { label: "Mature public posts", value: outcomeRows.length, numberFormat: "#,##0" },
  { label: "Ranked private joins", value: joinedCount, numberFormat: "#,##0" },
  { label: "Public-only", value: outcomeRows.length - joinedCount, numberFormat: "#,##0" },
  { label: "Median engagements", formula: "=MEDIAN(M11:M68)", numberFormat: "#,##0" },
  { label: "Median impressions", formula: "=MEDIAN(N11:N68)", numberFormat: "#,##0" },
  { label: "Top / period share", formula: "=MAX(N11:N68)/'Tiger Baseline'!B7", numberFormat: "0.0%" },
]);
const outcomeTable = addTable(outcomeSheet, ["Canonical post ID", "Published at", "Public URL", "Deterministic identity key", "Native format", "Hook", "Job", "Artifact", "Problem family", "Public interactions", "Creator median public", "Public response ratio", "Private engagements", "Private impressions", "Private ranked URL", "Join status", "Impression lift vs ranked median", "Engagement lift vs ranked median"], outcomeRows, "TigerOutcomeJoinTable", [24, 22, 55, 46, 20, 10, 10, 12, 14, 16, 18, 18, 18, 18, 55, 24, 22, 22], { wrapColumns: [2, 3, 14], numberFormats: { 1: "yyyy-mm-dd", 9: "#,##0", 10: "#,##0", 11: "0.00x", 12: "#,##0", 13: "#,##0", 16: "0.00x", 17: "0.00x" }, freezeColumns: 2 });
outcomeSheet.getRange("Q11").formulas = [["=IF(N11=\"\",\"\",N11/$E$7)"]];
outcomeSheet.getRange(`Q11:Q${outcomeTable.endRow}`).fillDown();
outcomeSheet.getRange("R11").formulas = [["=IF(M11=\"\",\"\",M11/$D$7)"]];
outcomeSheet.getRange(`R11:R${outcomeTable.endRow}`).fillDown();
outcomeSheet.getRange(`Q11:R${outcomeTable.endRow}`).format.numberFormat = "0.00x";
addStatusFormatting(outcomeSheet.getRange(`P11:P${outcomeTable.endRow}`), { green: ["deterministic_ranked_join"], amber: ["public_only"], red: [] });

// Automated-heuristic matched controls.
prepareSheet(controlsSheet, "Matched Controls — AH Labels", "AH1/AH2/AH3 are automated observable-feature match labels. They are not human Grade A/B/C matches and must not be presented as causal evidence.", matchedControlsMatrix[0].length, [
  { label: "All matches", value: matchedControlsMatrix.length - 1, numberFormat: "#,##0" },
  { label: "Track A", value: analysisSummary.counts.trackAMatches, numberFormat: "#,##0" },
  { label: "Track B", value: analysisSummary.counts.trackBMatches, numberFormat: "#,##0" },
  { label: "Positive outcome delta", formula: "=COUNTIF(J11:J143,\">0\")", numberFormat: "#,##0" },
]);
const matchedRows = matchedControlsMatrix.slice(1).map((row) => row.map((value, index) => ([6, 7, 8, 9].includes(index) ? asNumber(value) : value)));
const matchedTable = addTable(controlsSheet, matchedControlsMatrix[0], matchedRows, "AutomatedMatchedControlsTable", [20, 10, 24, 24, 42, 13, 13, 14, 14, 14, 20], { numberFormats: { 6: "0.0", 7: "0.0000", 8: "0.0000", 9: "0.0000" }, freezeColumns: 2 });
addStatusFormatting(controlsSheet.getRange(`F11:F${matchedTable.endRow}`), { green: ["AH1"], amber: ["AH2"], red: ["AH3"] });
controlsSheet.getRange(`J11:J${matchedTable.endRow}`).conditionalFormats.add("colorScale", { thresholds: ["min", { type: "num", value: 0 }, "max"], colors: ["#F4A3A3", "#FFF4D6", "#8ED1A6"] });

// Mechanic effects.
prepareSheet(effectsSheet, "Mechanic Effects", "Exploratory automated observable-feature effects using within-creator normalization. These rows are discovery-only because the reliability gate failed; they are not validated topics, causal mechanics, or production rules.", mechanicEffectsMatrix[0].length, [
  { label: "Effect rows", value: mechanicEffectsMatrix.length - 1, numberFormat: "#,##0" },
  { label: "Peer heuristic signals", value: heuristicCounts.peer, numberFormat: "#,##0" },
  { label: "Top100 heuristic signals", value: heuristicCounts.top100, numberFormat: "#,##0" },
  { label: "Permanent rules", value: 0, numberFormat: "#,##0" },
]);
const effectsRows = mechanicEffectsMatrix.slice(1).map((row) => row.map((value, index) => ([4, 5, 6, 7, 14, 17].includes(index) ? asNumber(value) : [8, 9, 10, 11, 12, 13, 15].includes(index) ? asNumber(value) : value)));
const effectsTable = addTable(effectsSheet, mechanicEffectsMatrix[0], effectsRows, "MechanicEffectsTable", [22, 16, 12, 8, 10, 10, 12, 16, 18, 22, 18, 13, 13, 20, 14, 24, 16, 14, 16], { numberFormats: { 4: "#,##0", 5: "#,##0", 6: "#,##0", 7: "#,##0", 8: "0.00x", 9: "0.0%", 10: "0.0000", 11: "0.0000", 12: "0.0000", 13: "0.0%", 14: "#,##0", 15: "0.0%", 17: "#,##0" }, freezeColumns: 3 });
addStatusFormatting(effectsSheet.getRange(`Q11:Q${effectsTable.endRow}`), { amber: ["heuristic_peer_signal"], red: ["not_observed"] });
addStatusFormatting(effectsSheet.getRange(`S11:S${effectsTable.endRow}`), { amber: ["heuristic_top100_signal"], red: ["not_observed"] });

// Cross-track evidence matrix.
prepareSheet(matrixSheet, "Evidence Matrix", "Exploratory interpretation of automated observable-feature signals after a failed reliability gate. Classifications and treatments define discovery-only, one-variable prospective use; none is a permanent production rule.", evidenceMatrixSource[0].length, [
  { label: "Mechanics", value: evidenceMatrixSource.length - 1, numberFormat: "#,##0" },
  { label: "Cross-track heuristic", value: heuristicCounts.crossTrack, numberFormat: "#,##0" },
  { label: "Peer heuristic", value: heuristicCounts.peer, numberFormat: "#,##0" },
  { label: "Top100 heuristic", value: heuristicCounts.top100, numberFormat: "#,##0" },
  { label: "Unresolved", value: heuristicCounts.unresolved, numberFormat: "#,##0" },
]);
const evidenceTable = addTable(matrixSheet, evidenceMatrixSource[0], evidenceMatrixSource.slice(1), "CrossTrackEvidenceMatrixTable", [22, 18, 18, 18, 24, 30, 66], { wrapColumns: [5, 6], freezeColumns: 2 });
addStatusFormatting(matrixSheet.getRange(`E11:E${evidenceTable.endRow}`), { amber: ["cross_track_heuristic_signal", "peer_heuristic_signal", "top100_heuristic_signal"], red: ["unresolved"] });

// Provisional Scout Queue.
const scoutEndRow = 10 + (scoutQueueMatrix.length - 1);
prepareSheet(scoutSheet, "Scout Queue", "Discovery-only problem–job–artifact combinations after a failed reliability gate. screen_A is a mechanical research priority, not a validated topic ranking; every row still needs public pain, primary proof, artifact feasibility, and Tiger's source note.", scoutQueueMatrix[0].length, [
  { label: "Signals", value: scoutQueueMatrix.length - 1, numberFormat: "#,##0" },
  { label: "screen_A (exploratory)", value: scoutCounts.screenA, numberFormat: "#,##0" },
  { label: "Radar evidence", formula: `=COUNTIF(G11:G${scoutEndRow},\">0\")`, numberFormat: "#,##0" },
  { label: "Decision evidence", formula: `=COUNTIF(H11:H${scoutEndRow},\">0\")`, numberFormat: "#,##0" },
  { label: "Strict evidence", formula: `=COUNTIF(I11:I${scoutEndRow},\">0\")`, numberFormat: "#,##0" },
  { label: "Tiger evidence", formula: `=COUNTIF(L11:L${scoutEndRow},\">0\")`, numberFormat: "#,##0" },
]);
const scoutRows = scoutQueueMatrix.slice(1).map((row) => row.map((value, index) => (index >= 4 && index <= 13 ? asNumber(value) : value)));
const scoutTable = addTable(scoutSheet, scoutQueueMatrix[0], scoutRows, "FinalScoutQueueTable", [18, 14, 10, 12, 13, 12, 14, 14, 12, 14, 14, 14, 18, 14, 30, 28, 44, 15, 36], { wrapColumns: [14, 15, 16, 18], numberFormats: { 4: "#,##0", 5: "#,##0", 6: "#,##0", 7: "#,##0", 8: "#,##0", 9: "#,##0", 10: "#,##0", 11: "#,##0", 12: "#,##0", 13: "0.00x" }, freezeColumns: 2 });
addStatusFormatting(scoutSheet.getRange(`R11:R${scoutTable.endRow}`), { amber: ["screen_A", "screen_B"] });
addStatusFormatting(scoutSheet.getRange(`S11:S${scoutTable.endRow}`), { red: ["exploratory_only_failed_reliability_gate"] });

// Reliability result or explicit pending placeholder.
const reliabilityDecision = reliabilityAvailable ? reliabilitySummary.decision : "Reliability files were not present when this workbook was built.";
prepareSheet(reliabilitySheet, "Reliability", reliabilityAvailable ? "Two isolated model runs test inter-run consistency only—not human coding validity. Calibration failed and provenance is incomplete, so meaning-heavy taxonomy fields must not be frozen or promoted to decision-grade evidence." : "Reliability output is pending. No meaning-heavy taxonomy may be frozen until the formal gate is available.", reliabilityMatrix[0].length, [
  { label: "Classification", value: reliabilityAvailable ? "model inter-run consistency" : "pending" },
  { label: "Calibration agreement", value: reliabilityAvailable ? reliabilitySummary.calibration.overallExactAgreement : null, numberFormat: "0.0%" },
  { label: "Holdout agreement", value: reliabilityAvailable ? reliabilitySummary.holdout.overallExactAgreement : null, numberFormat: "0.0%" },
  { label: "Formal gate", value: reliabilityAvailable ? (reliabilitySummary.formalGatePass ? "PASS" : "FAIL") : "PENDING" },
  { label: "Provenance issues", value: reliabilityAvailable ? (reliabilitySummary.provenanceIssues?.length ?? 0) : null, numberFormat: "#,##0" },
]);
reliabilitySheet.mergeCells(`A8:${excelColumn(reliabilityMatrix[0].length - 1)}8`);
reliabilitySheet.getRange("A8").values = [[reliabilityDecision]];
reliabilitySheet.getRange(`A8:${excelColumn(reliabilityMatrix[0].length - 1)}8`).format = { fill: reliabilityAvailable && !reliabilitySummary.formalGatePass ? paleRed : paleAmber, font: { color: reliabilityAvailable && !reliabilitySummary.formalGatePass ? redText : amberText, bold: true }, wrapText: true };
const reliabilityRows = reliabilityMatrix.slice(1).map((row) => row.map((value, index) => ([2, 3, 6].includes(index) ? asNumber(value) : [4, 5, 7].includes(index) ? asNumber(value) : value)));
const reliabilityTable = addTable(reliabilitySheet, reliabilityMatrix[0], reliabilityRows.length ? reliabilityRows : [["pending", "all_fields", null, null, null, null, null, null, "No reliability file present"]], "ReliabilityByFieldTable", [32, 26, 10, 10, 18, 13, 14, 20, 68], { numberFormats: { 2: "#,##0", 3: "#,##0", 4: "0.0%", 5: "0.0000", 6: "#,##0", 7: "0.0000" }, wrapColumns: [8], freezeColumns: 2 });
reliabilitySheet.getRange(`E11:E${reliabilityTable.endRow}`).conditionalFormats.add("colorScale", { thresholds: ["min", { type: "num", value: 0.8 }, "max"], colors: ["#F4A3A3", "#FFF4D6", "#8ED1A6"] });

// Completion and handoff.
const completionRows = [
  ["Collection", "complete", "81 profile result rows; 2,325 activities", "No people-level comments, reactions, or email enrichment", "Preserve raw provenance"],
  ["Spend control", "complete", `$${runIndex.totals.spendUsd.toFixed(3)} recorded Apify spend across ${runIndex.totals.runCount} actor executions; ${dataProducingExecutions} data-producing, ${chargedLimitTerminatedExecutions} charged limit-terminated execution.`, "Final recovery refused before run creation; €35 upgrade declined", "Reopen paid extraction only if a prospective decision depends on the gap"],
  ["Normalization", "complete", `${normalized.counts.canonicalPosts.toLocaleString()} canonical posts; ${normalized.counts.duplicateOrWrapperGroups} duplicate/wrapper groups`, "Schema validation passed", "Use canonical posts for outcomes; activities for provenance"],
  ["Tiger join", "complete_with_ranked_subset", "58 mature public originals; 50 private ranked joins; 8 public-only", "Ranked subset is not a census", "Use Day-7 and Day-30 prospective outcomes"],
  ["Current market", "directional_only", "20 radar / 15 decision / 10 strict creators", "Frozen balanced 24-person quota is infeasible", "Recruit five missing cohort/size candidates before retry"],
  ["Top-100", "partial", "73 references / 72 cases / 42 quantitative", "27 missing references; 71/72 cases are static images", "Use for caption/image hypotheses, not format ranking"],
  ["Reliability", reliabilityAvailable && reliabilitySummary.formalGatePass ? "complete" : "gate_failed", reliabilityAvailable ? `Calibration 89.2%; holdout 89.8%; ${reliabilitySummary.provenanceIssues?.length ?? 0} provenance issues; exact-final-codebook claim prohibited` : "Pending", "Model consistency is not human validity; coder provenance must not be backfilled", "Revise boundaries and provenance capture before a fresh holdout"],
  ["Mechanic synthesis", "prospective_test_only", `${heuristicCounts.peer} peer heuristic signals; ${heuristicCounts.top100} Top100 heuristic signals; ${heuristicCounts.crossTrack} cross-track heuristic signals`, "Failed reliability gate; no causal or decision-grade mechanic", "If used, isolate one observable variable and validate prospectively"],
  ["Scout Queue", "discovery_only", `${scoutCounts.screenA} screen_A combinations; ${scoutCounts.failedReliability}/${scoutQueueMatrix.length - 1} rows flagged exploratory-only after the failed reliability gate`, "Queue is not a validated topic ranking", "Shortlist six with pain, proof, artifact, and Tiger source note"],
  ["V4 decision", "proceed_to_pilot", "Audience-learning system is ready", "No permanent external creator rule", "Build five-post Week-1 portfolio and judge at Day 7/30"],
  ["Owned channels", "data_gap", "Substack and website roles defined", "No historical owned-channel performance in Stage 0", "Instrument future subscriptions, visits, downloads, and usage"],
];
prepareSheet(completionSheet, "Completion", "Final sign-off for Stage 0. The correct decision is to proceed into a prospective audience-learning pilot while preserving the study's sampling, reliability, and outcome limitations.", 5, [
  { label: "Workstreams", value: completionRows.length, numberFormat: "#,##0" },
  { label: "Cross-track heuristic", value: heuristicCounts.crossTrack, numberFormat: "#,##0" },
  { label: "screen_A (exploratory)", value: scoutCounts.screenA, numberFormat: "#,##0" },
  { label: "Decision", value: "PROCEED TO PILOT" },
]);
const completionTable = addTable(completionSheet, ["Workstream", "Status", "Evidence", "Constraint", "Required next action"], completionRows, "Stage0CompletionTable", [22, 24, 52, 52, 58], { wrapColumns: [2, 3, 4], freezeColumns: 1 });
completionSheet.getRange(`B11:B${completionTable.endRow}`).conditionalFormats.add("containsText", { text: "complete", format: { fill: paleGreen, font: { color: greenText, bold: true } } });
completionSheet.getRange(`B11:B${completionTable.endRow}`).conditionalFormats.add("containsText", { text: "proceed", format: { fill: paleGreen, font: { color: greenText, bold: true } } });
completionSheet.getRange(`B11:B${completionTable.endRow}`).conditionalFormats.add("containsText", { text: "ready", format: { fill: paleGreen, font: { color: greenText, bold: true } } });
completionSheet.getRange(`B11:B${completionTable.endRow}`).conditionalFormats.add("containsText", { text: "directional", format: { fill: paleAmber, font: { color: amberText, bold: true } } });
completionSheet.getRange(`B11:B${completionTable.endRow}`).conditionalFormats.add("containsText", { text: "partial", format: { fill: paleAmber, font: { color: amberText, bold: true } } });
completionSheet.getRange(`B11:B${completionTable.endRow}`).conditionalFormats.add("containsText", { text: "gap", format: { fill: paleAmber, font: { color: amberText, bold: true } } });
completionSheet.getRange(`B11:B${completionTable.endRow}`).conditionalFormats.add("containsText", { text: "prospective", format: { fill: paleAmber, font: { color: amberText, bold: true } } });
completionSheet.getRange(`B11:B${completionTable.endRow}`).conditionalFormats.add("containsText", { text: "discovery", format: { fill: paleAmber, font: { color: amberText, bold: true } } });
completionSheet.getRange(`B11:B${completionTable.endRow}`).conditionalFormats.add("containsText", { text: "failed", format: { fill: paleRed, font: { color: redText, bold: true } } });

const staleVerdictsAfterRewrite = findStalePreRunVerdicts();
if (staleVerdictsAfterRewrite.length) {
  throw new Error(`Stale pre-run verdicts remain after final-workbook rewrite: ${JSON.stringify(staleVerdictsAfterRewrite)}`);
}

// Global text alignment and source notes.
for (const sheet of [control, canarySheet, manifestSheet, eligibilitySheet, panelsSheet, recoverySheet, runLedger, outcomeSheet, controlsSheet, effectsSheet, matrixSheet, scoutSheet, reliabilitySheet, completionSheet]) {
  const used = sheet.getUsedRange(false);
  used.format.font.name = "Aptos";
  used.format.font.color = ink;
  sheet.getRange("A1").format.font.color = white;
  sheet.getRange("A1").format.font.name = "Aptos Display";
}

await fs.mkdir(previewDir, { recursive: true });
await fs.mkdir(path.dirname(outputPath), { recursive: true });

const keyInspections = [];
const inspectionRecords = [];
const decodeInspection = (ndjson) => ndjson
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
for (const [sheetName, range] of [
  ["Control", "A1:H20"],
  ["Study Manifest", "A1:F18"],
  ["Current-Market Panels", "A1:P20"],
  ["Outcome Join", "A1:R18"],
  ["Mechanic Effects", "A1:S15"],
  ["Reliability", "A1:I18"],
  ["Completion", "A1:E22"],
]) {
  const inspected = await workbook.inspect({
    kind: "table",
    range: `${sheetName}!${range}`,
    include: "values,formulas",
    tableMaxRows: 22,
    tableMaxCols: 20,
    tableMaxCellChars: 100,
    maxChars: 9000,
  });
  keyInspections.push(`### ${sheetName} ${range}\n${inspected.ndjson}`);
  inspectionRecords.push({
    kind: "table",
    sheet: sheetName,
    range,
    inspectedAt: new Date().toISOString(),
    result: decodeInspection(inspected.ndjson),
  });
}
const formulaErrors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
  maxChars: 12000,
});
keyInspections.push(`### Formula error scan\n${formulaErrors.ndjson}`);
inspectionRecords.push({
  kind: "formula_error_scan",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  inspectedAt: new Date().toISOString(),
  result: decodeInspection(formulaErrors.ndjson),
});
await fs.writeFile(path.join(previewDir, "inspection.txt"), keyInspections.join("\n\n"));

const allSheetNames = [
  "Control",
  "Tiger Baseline",
  "Tiger Daily",
  "Tiger Audience",
  "Top100 Identity",
  "Peer Roster",
  "Creator Union",
  "Canary Plan",
  "Scout Queue",
  "Codebook Fields",
  "Run Ledger",
  "Study Manifest",
  "Creator Eligibility",
  "Current-Market Panels",
  "Top100 Recovery",
  "Outcome Join",
  "Matched Controls",
  "Mechanic Effects",
  "Evidence Matrix",
  "Reliability",
  "Completion",
];
for (const sheetName of allSheetNames) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 0.65, format: "png" });
  await fs.writeFile(path.join(previewDir, `${safeFileName(sheetName)}.png`), new Uint8Array(await preview.arrayBuffer()));
  console.log(`RENDERED ${sheetName}`);
}

const outputBlob = await SpreadsheetFile.exportXlsx(workbook);
await outputBlob.save(outputPath);
await fs.writeFile(inspectionPath, `${inspectionRecords.map((record) => JSON.stringify(record)).join("\n")}\n`);
console.log(`EXPORTED ${outputPath}`);
console.log(`PREVIEWS ${previewDir}`);
console.log(`INSPECTION ${inspectionPath}`);
console.log(`TIGER_JOIN ${joinedCount}/${outcomeRows.length}`);
console.log(`SHEETS_RENDERED ${allSheetNames.length}`);
