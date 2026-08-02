import { CALCULATOR_VERSION, DECISION_CODES, evaluateDecision } from "./decision-engine.mjs?v=20260802-7";
import { COMPATIBILITY_CHECKS, buildSyntheticInput, createBlankInput } from "./fixtures.mjs?v=20260802-7";

const SCENARIOS = [
  { name: "best", label: "Best / earliest" },
  { name: "base", label: "Base / likely" },
  { name: "worst", label: "Worst / latest" },
];

const STATUS_OPTIONS = [
  { value: "unknown", label: "Unknown / not classified" },
  { value: "current", label: "Confirmed current" },
  { value: "uncertain", label: "Uncertain / unreliable" },
  { value: "stale", label: "Stale" },
];

const els = Object.fromEntries(
  [
    "decision-form", "result-panel", "result-banner", "result-label", "result-title", "result-reason",
    "stale-notice", "issues-section", "issues-list", "scenario-section", "scenario-results",
    "exception-result-section", "exception-result-title", "exception-result", "system-result-section", "system-result",
    "warnings-section", "warnings-list", "download-record", "print-result", "synthetic-banner",
    "compatibility-body", "service-scenario-body", "economic-scenario-body", "economic-mode",
    "annual-rate-fields", "exception-requested", "exception-fields", "record-exception",
    "load-green", "load-amber", "load-red", "new-decision",
  ].map((id) => [id, document.getElementById(id)]),
);

let fixtureCases = {};
let lastInput = null;
let lastResult = null;
let resultIsStale = false;
let auditRecordIsDirty = false;
let suppressModelChanges = false;
let loadedSynthetic = false;

function byId(id) {
  return document.getElementById(id);
}

function createOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function populateStatusSelect(select) {
  select.replaceChildren(...STATUS_OPTIONS.map((option) => createOption(option.value, option.label)));
}

function renderCompatibilityInputs() {
  const rows = COMPATIBILITY_CHECKS.map((check) => {
    const row = document.createElement("tr");
    const labelCell = document.createElement("td");
    labelCell.textContent = check.label;
    const inputCell = document.createElement("td");
    const select = document.createElement("select");
    select.id = `compatibility-${check.id}`;
    select.className = "model-input";
    select.setAttribute("aria-label", `${check.label} compatibility status`);
    select.append(
      createOption("unknown", "Unknown / not checked"),
      createOption("pass", "Pass"),
      createOption("fail", "Fail"),
    );
    inputCell.append(select);
    row.append(labelCell, inputCell);
    return row;
  });
  els["compatibility-body"].replaceChildren(...rows);
}

function inputCell(input) {
  const cell = document.createElement("td");
  cell.append(input);
  return cell;
}

function makeInput(id, type, label, attributes = {}) {
  const input = document.createElement("input");
  input.id = id;
  input.type = type;
  input.className = "model-input";
  input.setAttribute("aria-label", label);
  for (const [key, value] of Object.entries(attributes)) {
    input.setAttribute(key, value);
  }
  return input;
}

function renderScenarioInputs() {
  const serviceRows = [];
  const economicRows = [];

  for (const scenario of SCENARIOS) {
    const serviceRow = document.createElement("tr");
    const serviceName = document.createElement("td");
    serviceName.className = "scenario-name";
    serviceName.textContent = scenario.label;
    serviceRow.append(
      serviceName,
      inputCell(makeInput(`${scenario.name}-ready-b`, "datetime-local", `${scenario.label} shipment B ready`)),
      inputCell(makeInput(`${scenario.name}-consolidated-dispatch`, "datetime-local", `${scenario.label} first feasible consolidation departure`)),
      inputCell(makeInput(`${scenario.name}-ship-now-transit`, "number", `${scenario.label} ship-now transit days`, { min: "0", step: "0.01", inputmode: "decimal" })),
      inputCell(makeInput(`${scenario.name}-consolidated-transit`, "number", `${scenario.label} consolidated transit days`, { min: "0", step: "0.01", inputmode: "decimal" })),
      inputCell(makeInput(`${scenario.name}-ship-now-handling`, "number", `${scenario.label} ship-now handling days`, { min: "0", step: "0.01", inputmode: "decimal" })),
      inputCell(makeInput(`${scenario.name}-consolidated-handling`, "number", `${scenario.label} consolidated handling days`, { min: "0", step: "0.01", inputmode: "decimal" })),
    );
    serviceRows.push(serviceRow);

    const economicRow = document.createElement("tr");
    const economicName = document.createElement("td");
    economicName.className = "scenario-name";
    economicName.textContent = scenario.label;
    const directCell = inputCell(makeInput(`${scenario.name}-direct-daily`, "number", `${scenario.label} direct incremental cost per held day`, { min: "0", step: "0.01", inputmode: "decimal" }));
    directCell.className = "direct-daily-cell";
    economicRow.append(
      economicName,
      inputCell(makeInput(`${scenario.name}-freight-consolidated`, "number", `${scenario.label} consolidated freight quote`, { min: "0", step: "0.01", inputmode: "decimal" })),
      directCell,
      inputCell(makeInput(`${scenario.name}-one-off`, "number", `${scenario.label} one-off differential cost`, { min: "0", step: "0.01", inputmode: "decimal" })),
      inputCell(makeInput(`${scenario.name}-recovery`, "number", `${scenario.label} recovery, expedite, or shortage cost`, { min: "0", step: "0.01", inputmode: "decimal" })),
    );
    economicRows.push(economicRow);
  }

  els["service-scenario-body"].replaceChildren(...serviceRows);
  els["economic-scenario-body"].replaceChildren(...economicRows);
}

function toLocalInput(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return shifted.toISOString().slice(0, 16);
}

function fromLocalInput(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function readNumber(id) {
  const value = byId(id).value;
  return value === "" ? "" : Number(value);
}

function setValue(id, value) {
  const element = byId(id);
  if (!element) return;
  if (element.type === "checkbox") {
    element.checked = Boolean(value);
  } else if (element.type === "datetime-local") {
    element.value = toLocalInput(value);
  } else {
    element.value = value ?? "";
  }
}

function writeInput(input) {
  suppressModelChanges = true;

  setValue("evaluation-at", input.meta.evaluationAt);
  setValue("record-id", input.meta.recordId);
  setValue("currency", input.meta.currency);
  for (const check of input.compatibility.checks) {
    setValue(`compatibility-${check.id}`, check.status);
  }

  setValue("needby-status", input.validity.needByStatus);
  setValue("needby-owner", input.validity.needByOwner);
  setValue("needby-confirmed-at", input.validity.needByConfirmedAt);
  setValue("needby-confirmed-kam", input.validity.needByConfirmedByKam);
  setValue("needby-authoritative", input.validity.needByAuthoritative);
  setValue("ready-a-status", input.validity.readyAStatus);
  setValue("ready-a-source", input.validity.readyASource);
  setValue("ready-a-confirmed", input.validity.readyAConfirmed);
  setValue("supplier-status", input.validity.supplierRangeStatus);
  setValue("supplier-source", input.validity.supplierRangeSource);
  setValue("supplier-updated-at", input.validity.supplierRangeUpdatedAt);
  setValue("supplier-credible", input.validity.supplierRangeCredible);
  setValue("transit-status", input.validity.transitStatus);
  setValue("transit-source", input.validity.transitSource);
  setValue("transit-updated-at", input.validity.transitUpdatedAt);
  setValue("quotes-status", input.validity.quotesStatus);
  setValue("quote-source", input.validity.quoteSource);
  setValue("quote-issued-at", input.validity.quoteIssuedAt);
  setValue("quote-valid-through", input.validity.quoteValidThrough);
  setValue("quotes-comparable", input.validity.quotesComparable);

  setValue("need-by-at", input.common.needByAt);
  setValue("ready-a-at", input.common.readyAAt);
  setValue("ship-now-dispatch-at", input.common.shipNowDispatchAt);
  setValue("incoterm", input.common.incoterm);
  setValue("named-place", input.common.namedPlace);
  setValue("quote-currency", input.common.quoteCurrency);
  setValue("freight-a", input.common.freightASeparate);
  setValue("freight-b", input.common.freightBSeparate);

  setValue("economic-mode", input.economics.mode);
  setValue("shipment-a-value", input.economics.shipmentAValue);
  setValue("annual-rate-percent", input.economics.incrementalAnnualRate === "" ? "" : Number(input.economics.incrementalAnnualRate) * 100);
  setValue("annual-assumption", input.economics.annualRateAssumptionConfirmed);
  setValue("minimum-net-value", input.policy.minimumNetValue);
  setValue("date-basis", input.policy.dateBasis);
  setValue("recent-exception-count", input.policy.recentExceptionCount);
  setValue("recurring-threshold", input.policy.recurringExceptionThreshold);

  for (const scenario of input.scenarios) {
    setValue(`${scenario.name}-ready-b`, scenario.readyBAt);
    setValue(`${scenario.name}-consolidated-dispatch`, scenario.consolidatedDispatchAt);
    setValue(`${scenario.name}-ship-now-transit`, scenario.shipNowTransitDays);
    setValue(`${scenario.name}-consolidated-transit`, scenario.consolidatedTransitDays);
    setValue(`${scenario.name}-ship-now-handling`, scenario.shipNowHandlingDays);
    setValue(`${scenario.name}-consolidated-handling`, scenario.consolidatedHandlingDays);
    setValue(`${scenario.name}-freight-consolidated`, scenario.freightConsolidated);
    setValue(`${scenario.name}-direct-daily`, scenario.incrementalDailyCost);
    setValue(`${scenario.name}-one-off`, scenario.oneOffDifferentialCost);
    setValue(`${scenario.name}-recovery`, scenario.recoveryCost);
  }

  setValue("exception-requested", input.exception.requested);
  setValue("kam-name", input.exception.kam.name);
  setValue("kam-status", input.exception.kam.status);
  setValue("purchasing-name", input.exception.purchasingManager.name);
  setValue("purchasing-status", input.exception.purchasingManager.status);
  setValue("exception-decision-at", input.exception.decisionAt);
  setValue("exception-reason", input.exception.reason);

  loadedSynthetic = Boolean(input.meta.synthetic);
  els["synthetic-banner"].hidden = !loadedSynthetic;
  document.body.classList.toggle("synthetic-active", loadedSynthetic);
  toggleEconomicMode();
  toggleExceptionFields();
  suppressModelChanges = false;
  resetResult();
}

function readInput() {
  const mode = byId("economic-mode").value;
  return {
    meta: {
      evaluationAt: fromLocalInput(byId("evaluation-at").value),
      currency: byId("currency").value,
      recordId: byId("record-id").value.trim(),
      synthetic: loadedSynthetic,
      sourceCaseId: loadedSynthetic ? byId("record-id").value.replace(/^SYNTHETIC-/, "") : null,
    },
    compatibility: {
      checks: COMPATIBILITY_CHECKS.map((check) => ({
        ...check,
        status: byId(`compatibility-${check.id}`).value,
      })),
    },
    validity: {
      needByStatus: byId("needby-status").value,
      needByOwner: byId("needby-owner").value.trim(),
      needByConfirmedAt: fromLocalInput(byId("needby-confirmed-at").value),
      needByConfirmedByKam: byId("needby-confirmed-kam").checked,
      needByAuthoritative: byId("needby-authoritative").checked,
      readyAStatus: byId("ready-a-status").value,
      readyASource: byId("ready-a-source").value.trim(),
      readyAConfirmed: byId("ready-a-confirmed").checked,
      supplierRangeStatus: byId("supplier-status").value,
      supplierRangeSource: byId("supplier-source").value.trim(),
      supplierRangeUpdatedAt: fromLocalInput(byId("supplier-updated-at").value),
      supplierRangeCredible: byId("supplier-credible").checked,
      transitStatus: byId("transit-status").value,
      transitSource: byId("transit-source").value.trim(),
      transitUpdatedAt: fromLocalInput(byId("transit-updated-at").value),
      quotesStatus: byId("quotes-status").value,
      quoteSource: byId("quote-source").value.trim(),
      quoteIssuedAt: fromLocalInput(byId("quote-issued-at").value),
      quoteValidThrough: fromLocalInput(byId("quote-valid-through").value),
      quotesComparable: byId("quotes-comparable").checked,
    },
    common: {
      needByAt: fromLocalInput(byId("need-by-at").value),
      readyAAt: fromLocalInput(byId("ready-a-at").value),
      shipNowDispatchAt: fromLocalInput(byId("ship-now-dispatch-at").value),
      freightASeparate: readNumber("freight-a"),
      freightBSeparate: readNumber("freight-b"),
      quoteCurrency: byId("quote-currency").value,
      incoterm: byId("incoterm").value.trim(),
      namedPlace: byId("named-place").value.trim(),
    },
    economics: {
      mode,
      shipmentAValue: readNumber("shipment-a-value"),
      incrementalAnnualRate: readNumber("annual-rate-percent") === "" ? "" : readNumber("annual-rate-percent") / 100,
      annualRateAssumptionConfirmed: byId("annual-assumption").checked,
    },
    policy: {
      minimumNetValue: readNumber("minimum-net-value"),
      dateBasis: byId("date-basis").value,
      recentExceptionCount: readNumber("recent-exception-count"),
      recurringExceptionThreshold: readNumber("recurring-threshold"),
    },
    scenarios: SCENARIOS.map((scenario) => ({
      name: scenario.name,
      readyBAt: fromLocalInput(byId(`${scenario.name}-ready-b`).value),
      consolidatedDispatchAt: fromLocalInput(byId(`${scenario.name}-consolidated-dispatch`).value),
      shipNowTransitDays: readNumber(`${scenario.name}-ship-now-transit`),
      consolidatedTransitDays: readNumber(`${scenario.name}-consolidated-transit`),
      shipNowHandlingDays: readNumber(`${scenario.name}-ship-now-handling`),
      consolidatedHandlingDays: readNumber(`${scenario.name}-consolidated-handling`),
      freightConsolidated: readNumber(`${scenario.name}-freight-consolidated`),
      oneOffDifferentialCost: readNumber(`${scenario.name}-one-off`),
      recoveryCost: readNumber(`${scenario.name}-recovery`),
      incrementalDailyCost: mode === "direct_daily" ? readNumber(`${scenario.name}-direct-daily`) : "",
    })),
    exception: {
      requested: byId("exception-requested").checked,
      kam: { name: byId("kam-name").value.trim(), status: byId("kam-status").value },
      purchasingManager: { name: byId("purchasing-name").value.trim(), status: byId("purchasing-status").value },
      decisionAt: fromLocalInput(byId("exception-decision-at").value),
      reason: byId("exception-reason").value.trim(),
    },
  };
}

function toggleEconomicMode() {
  const annual = byId("economic-mode").value === "annual_rate";
  els["annual-rate-fields"].hidden = !annual;
  document.querySelectorAll(".direct-daily-cell, .direct-daily-heading").forEach((element) => {
    element.hidden = annual;
  });
}

function toggleExceptionFields() {
  els["exception-fields"].hidden = !els["exception-requested"].checked;
}

function clearExceptionRecord() {
  suppressModelChanges = true;
  setValue("exception-requested", false);
  setValue("kam-name", "");
  setValue("kam-status", "pending");
  setValue("purchasing-name", "");
  setValue("purchasing-status", "pending");
  setValue("exception-decision-at", "");
  setValue("exception-reason", "");
  toggleExceptionFields();
  suppressModelChanges = false;
}

function markResultStale() {
  if (suppressModelChanges || !lastResult) return;
  resultIsStale = true;
  auditRecordIsDirty = false;
  clearExceptionRecord();
  els["stale-notice"].textContent = "Operating inputs changed after the last evaluation. Re-evaluate before using or exporting the decision.";
  els["stale-notice"].hidden = false;
  els["download-record"].disabled = true;
  els["print-result"].disabled = true;
}

function markAuditRecordDirty() {
  if (suppressModelChanges || !lastResult || resultIsStale) return;
  auditRecordIsDirty = true;
  els["stale-notice"].textContent = "The joint exception record changed. Select Update exception record before using, printing, or exporting it.";
  els["stale-notice"].hidden = false;
  els["download-record"].disabled = true;
  els["print-result"].disabled = true;
}

function resetResult() {
  lastInput = null;
  lastResult = null;
  resultIsStale = false;
  auditRecordIsDirty = false;
  els["result-panel"].dataset.code = DECISION_CODES.AWAITING;
  els["result-label"].textContent = "AWAITING INPUT";
  els["result-title"].textContent = "Complete the operating inputs, then evaluate";
  els["result-reason"].textContent = "No recommendation has been made.";
  els["stale-notice"].textContent = "Operating inputs changed after the last evaluation. Re-evaluate before using or exporting the decision.";
  els["stale-notice"].hidden = true;
  for (const id of ["issues-section", "scenario-section", "exception-result-section", "system-result-section", "warnings-section"]) {
    els[id].hidden = true;
  }
  els["download-record"].disabled = true;
  els["print-result"].disabled = true;
}

function formatDate(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDays(value, { signed = false } = {}) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "N/A";
  const rounded = Math.round(value * 100) / 100;
  const prefix = signed && rounded > 0 ? "+" : "";
  return `${prefix}${rounded} d`;
}

function formatMoney(value, currency) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function makeTextCell(text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) cell.className = className;
  return cell;
}

function makeServiceCell(date, slack, gate) {
  const cell = document.createElement("td");
  const dateText = document.createElement("span");
  dateText.textContent = formatDate(date);
  const status = document.createElement("span");
  status.className = `status-word status-word--${gate}`;
  status.textContent = gate === "pass" ? `${formatDays(slack, { signed: true })} · pass` : `${formatDays(slack, { signed: true })} · fail`;
  cell.append(dateText, status);
  return cell;
}

function renderIssues(result) {
  if (!result.issues?.length) {
    els["issues-section"].hidden = true;
    return;
  }
  const items = result.issues.map((item) => {
    const li = document.createElement("li");
    const message = document.createElement("strong");
    message.textContent = item.message;
    const action = document.createElement("div");
    action.textContent = `Next: ${item.action}`;
    li.append(message, action);
    return li;
  });
  els["issues-list"].replaceChildren(...items);
  els["issues-section"].hidden = false;
}

function renderScenarios(result) {
  if (!result.scenarios?.length) {
    els["scenario-section"].hidden = true;
    return;
  }
  const currency = result.policy.currency;
  const rows = result.scenarios.map((scenario) => {
    const row = document.createElement("tr");
    row.append(
      makeTextCell(scenario.name.toUpperCase(), "scenario-name"),
      makeServiceCell(scenario.consolidatedEtaAt, scenario.serviceSlackDays, scenario.serviceGate),
      makeTextCell(formatDays(scenario.serviceSlackDays, { signed: true })),
      makeServiceCell(scenario.shipNowEtaAt, scenario.shipNowServiceSlackDays, scenario.shipNowServiceGate),
      makeTextCell(formatDays(scenario.holdDays)),
      makeTextCell(formatMoney(scenario.freightSaved, currency)),
      makeTextCell(formatMoney(scenario.incrementalNonFreightCost, currency)),
      makeTextCell(formatMoney(scenario.netConsolidationValue, currency)),
      makeTextCell(formatDays(scenario.permittedHoldDays)),
    );
    return row;
  });
  els["scenario-results"].replaceChildren(...rows);
  els["scenario-section"].hidden = false;
}

function renderWarnings(result) {
  if (!result.warnings?.length) {
    els["warnings-section"].hidden = true;
    return;
  }
  const items = result.warnings.map((warning) => {
    const li = document.createElement("li");
    li.textContent = warning;
    return li;
  });
  els["warnings-list"].replaceChildren(...items);
  els["warnings-section"].hidden = false;
}

function renderResult(input, result) {
  lastInput = input;
  lastResult = result;
  resultIsStale = false;
  auditRecordIsDirty = false;
  els["result-panel"].dataset.code = result.code;
  els["result-label"].textContent = result.label;
  els["result-title"].textContent = result.headline;
  els["result-reason"].textContent = result.reason;
  els["stale-notice"].hidden = true;

  renderIssues(result);
  renderScenarios(result);
  renderWarnings(result);

  if (result.operationalEscalation?.required) {
    els["exception-result-title"].textContent = "Joint operational escalation";
    els["exception-result"].textContent = result.operationalEscalation.message;
    els["exception-result-section"].hidden = false;
  } else if (result.exceptionRecord?.required) {
    els["exception-result-title"].textContent = "Exception status";
    els["exception-result"].textContent = result.exceptionRecord.message;
    els["exception-result-section"].hidden = false;
  } else {
    els["exception-result-section"].hidden = true;
  }

  if (result.systemCorrection) {
    els["system-result"].textContent = result.systemCorrection.message;
    els["system-result-section"].hidden = false;
  } else {
    els["system-result-section"].hidden = true;
  }

  els["download-record"].disabled = false;
  els["print-result"].disabled = false;
}

function evaluateCurrentInput() {
  const input = readInput();
  const result = evaluateDecision(input, { recordedAt: new Date().toISOString() });
  renderResult(input, result);
  return result;
}

function decisionRecord() {
  return {
    schemaVersion: 1,
    calculatorVersion: CALCULATOR_VERSION,
    exportedAt: new Date().toISOString(),
    warning: loadedSynthetic
      ? "Synthetic example: invented values for logic testing only; not a business result."
      : "Decision aid only. Human owners remain accountable for the release decision and any system-of-record change.",
    input: lastInput,
    result: lastResult,
    humanDecisionBoundary: {
      customerCommitmentOwner: "KAM",
      freightDecisionOwner: "Purchasing Manager",
      serviceExceptionRequiresBoth: true,
      autonomousRelease: false,
      erpOrTmsUpdate: false,
    },
  };
}

function downloadRecord() {
  if (!lastResult || resultIsStale || auditRecordIsDirty) return;
  const record = decisionRecord();
  const blob = new Blob([`${JSON.stringify(record, null, 2)}\n`], { type: "application/json" });
  const link = document.createElement("a");
  const id = (lastInput.meta.recordId || "decision").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  link.href = URL.createObjectURL(blob);
  link.download = `ship-now-vs-consolidate-${id || "decision"}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

async function loadFixture(caseId) {
  const fixtureCase = fixtureCases[caseId];
  if (!fixtureCase) return;
  const input = buildSyntheticInput(fixtureCase, new Date().toISOString());
  writeInput(input);
  document.querySelector("#decision-form").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function initializeFixtures() {
  const response = await fetch("../decision-model-test-cases.json");
  if (!response.ok) throw new Error(`Fixture fetch failed: ${response.status}`);
  const fixture = await response.json();
  fixtureCases = Object.fromEntries(fixture.cases.map((item) => [item.id, item]));
  for (const id of ["load-green", "load-amber", "load-red"]) els[id].disabled = false;
}

function initialize() {
  renderCompatibilityInputs();
  renderScenarioInputs();
  for (const id of ["needby-status", "ready-a-status", "supplier-status", "transit-status", "quotes-status"]) {
    populateStatusSelect(byId(id));
  }

  document.addEventListener("input", (event) => {
    if (event.target.classList.contains("model-input")) markResultStale();
    if (event.target.classList.contains("audit-input")) markAuditRecordDirty();
  });
  document.addEventListener("change", (event) => {
    if (event.target.classList.contains("model-input")) markResultStale();
    if (event.target.classList.contains("audit-input")) markAuditRecordDirty();
    if (event.target.id === "economic-mode") toggleEconomicMode();
    if (event.target.id === "exception-requested") {
      toggleExceptionFields();
      if (event.target.checked && !byId("exception-decision-at").value) {
        setValue("exception-decision-at", new Date().toISOString());
      }
    }
  });

  els["decision-form"].addEventListener("submit", (event) => {
    event.preventDefault();
    evaluateCurrentInput();
  });
  els["record-exception"].addEventListener("click", () => {
    if (!lastResult || resultIsStale) {
      els["stale-notice"].hidden = false;
      byId("evaluate-button").focus();
      return;
    }
    evaluateCurrentInput();
  });
  els["download-record"].addEventListener("click", downloadRecord);
  els["print-result"].addEventListener("click", () => {
    if (lastResult && !resultIsStale && !auditRecordIsDirty) window.print();
  });
  els["load-green"].addEventListener("click", () => loadFixture("GREEN_CONSOLIDATE"));
  els["load-amber"].addEventListener("click", () => loadFixture("AMBER_SERVICE_ESCALATION"));
  els["load-red"].addEventListener("click", () => loadFixture("RED_DATA_STOP"));
  els["new-decision"].addEventListener("click", () => {
    writeInput(createBlankInput(new Date().toISOString()));
  });

  for (const id of ["load-green", "load-amber", "load-red"]) els[id].disabled = true;
  writeInput(createBlankInput(new Date().toISOString()));
  initializeFixtures().catch(() => {
    for (const id of ["load-green", "load-amber", "load-red"]) els[id].title = "Synthetic fixtures could not be loaded. Use a local web server instead of opening the file directly.";
  });
}

initialize();
