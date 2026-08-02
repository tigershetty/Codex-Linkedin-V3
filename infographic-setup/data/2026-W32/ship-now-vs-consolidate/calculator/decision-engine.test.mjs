import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { DECISION_CODES, evaluateDecision } from "./decision-engine.mjs";
import { buildSyntheticInput, cloneInput } from "./fixtures.mjs";

const fixtureUrl = new URL("../decision-model-test-cases.json", import.meta.url);
const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
const cases = Object.fromEntries(fixture.cases.map((item) => [item.id, item]));
const DAY_MS = 24 * 60 * 60 * 1000;

function approx(actual, expected, tolerance = 0.011) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≈ ${expected}`);
}

function plusDays(iso, days) {
  return new Date(Date.parse(iso) + days * DAY_MS).toISOString();
}

test("green fixture reproduces the validated calculations and consolidates", () => {
  const input = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  const result = evaluateDecision(input);

  assert.equal(result.code, DECISION_CODES.CONSOLIDATE);
  assert.equal(result.scenarios.length, 3);
  result.scenarios.forEach((scenario, index) => {
    const expected = cases.GREEN_CONSOLIDATE.scenarios[index];
    approx(scenario.freightSaved, expected.freightSaved);
    approx(scenario.incrementalWaitCost, expected.incrementalWaitCost);
    approx(scenario.netConsolidationValue, expected.netConsolidationValue);
    approx(scenario.serviceSlackDays, expected.serviceSlackDays);
    approx(scenario.economicBreakEvenHoldDays, expected.economicBreakEvenWaitDays);
  });
  approx(Math.min(...result.scenarios.map((scenario) => scenario.permittedHoldDays)), 6);
});

test("amber fixture keeps positive economics visible but defaults to ship now", () => {
  const input = buildSyntheticInput(cases.AMBER_SERVICE_ESCALATION);
  const result = evaluateDecision(input);

  assert.equal(result.code, DECISION_CODES.SHIP_NOW_SERVICE);
  assert.equal(result.escalationRequired, true);
  assert.equal(result.exceptionRecord.status, "not_requested");
  const worst = result.scenarios.find((scenario) => scenario.name === "worst");
  approx(worst.serviceSlackDays, -3);
  approx(worst.netConsolidationValue, 168.49);
});

test("red fixture returns data stop with the three source-of-truth corrective actions", () => {
  const input = buildSyntheticInput(cases.RED_DATA_STOP);
  const result = evaluateDecision(input);

  assert.equal(result.code, DECISION_CODES.DATA_STOP);
  for (const action of cases.RED_DATA_STOP.expected.requiredActions) {
    assert.ok(result.requiredActions.includes(action), action);
  }
  assert.equal(result.scenarios.length, 0);
});

test("ETA exactly equal to need-by passes; one minute late fails", () => {
  const exact = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  exact.common.needByAt = exact.scenarios[2].consolidatedDispatchAt;
  exact.common.needByAt = plusDays(exact.common.needByAt, exact.scenarios[2].consolidatedTransitDays);
  let result = evaluateDecision(exact);
  assert.equal(result.scenarios[2].serviceSlackDays, 0);
  assert.equal(result.code, DECISION_CODES.CONSOLIDATE);

  const late = cloneInput(exact);
  late.common.needByAt = new Date(Date.parse(late.common.needByAt) - 60_000).toISOString();
  result = evaluateDecision(late);
  assert.equal(result.code, DECISION_CODES.SHIP_NOW_SERVICE);
  assert.ok(result.scenarios[2].serviceSlackDays < 0);
});

test("compatibility fail blocks consolidation; compatibility unknown is data stop", () => {
  const failed = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  failed.compatibility.checks[2].status = "fail";
  assert.equal(evaluateDecision(failed).code, DECISION_CODES.SHIP_NOW_COMPATIBILITY);

  const unknown = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  unknown.compatibility.checks[2].status = "unknown";
  assert.equal(evaluateDecision(unknown).code, DECISION_CODES.DATA_STOP);
});

test("invalid ranges, dispatch before readiness, and missing worst date stop false precision", () => {
  const missing = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  missing.scenarios[2].readyBAt = "";
  let result = evaluateDecision(missing);
  assert.equal(result.code, DECISION_CODES.DATA_STOP);
  assert.ok(result.issues.some((item) => item.code === "supplier_latest_ready_date_missing"));

  const unordered = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  unordered.scenarios[0].readyBAt = plusDays(unordered.meta.evaluationAt, 6);
  unordered.scenarios[0].consolidatedDispatchAt = plusDays(unordered.meta.evaluationAt, 6);
  result = evaluateDecision(unordered);
  assert.equal(result.code, DECISION_CODES.DATA_STOP);
  assert.ok(result.issues.some((item) => item.code === "invalid_scenario_order"));

  const earlyDispatch = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  earlyDispatch.scenarios[1].consolidatedDispatchAt = plusDays(earlyDispatch.meta.evaluationAt, 1);
  result = evaluateDecision(earlyDispatch);
  assert.equal(result.code, DECISION_CODES.DATA_STOP);
  assert.ok(result.issues.some((item) => item.code === "dispatch_before_b_ready"));
});

test("expired quotes and quotes expiring before dispatch are blocked", () => {
  const expired = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  expired.validity.quoteValidThrough = plusDays(expired.meta.evaluationAt, -1);
  let result = evaluateDecision(expired);
  assert.equal(result.code, DECISION_CODES.DATA_STOP);
  assert.ok(result.issues.some((item) => item.code === "consolidated_quote_expired"));

  const short = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  short.validity.quoteValidThrough = plusDays(short.meta.evaluationAt, 3);
  result = evaluateDecision(short);
  assert.equal(result.code, DECISION_CODES.DATA_STOP);
  assert.ok(result.issues.some((item) => item.code === "quote_expires_before_dispatch"));
});

test("direct zero daily cost uses the service limit and does not fabricate break-even", () => {
  const input = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  input.economics = { mode: "direct_daily" };
  input.scenarios.forEach((scenario) => {
    scenario.incrementalDailyCost = 0;
  });
  const result = evaluateDecision(input);

  assert.equal(result.code, DECISION_CODES.CONSOLIDATE);
  assert.equal(result.scenarios[0].economicBreakEvenHoldDays, null);
  assert.equal(result.scenarios[0].permittedHoldDays, result.scenarios[0].latestSafeHoldDays);
});

test("economic outcomes return ship now when all fail and review when they disagree", () => {
  const allFail = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  allFail.scenarios.forEach((scenario) => {
    scenario.freightConsolidated = 1440;
  });
  assert.equal(evaluateDecision(allFail).code, DECISION_CODES.SHIP_NOW_ECONOMICS);

  const mixed = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  mixed.scenarios[0].freightConsolidated = 900;
  mixed.scenarios[1].freightConsolidated = 1400;
  mixed.scenarios[2].freightConsolidated = 1440;
  assert.equal(evaluateDecision(mixed).code, DECISION_CODES.REVIEW);
});

test("net value exactly equal to M does not authorize automatic consolidation", () => {
  const input = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  const baseline = evaluateDecision(input);
  input.policy.minimumNetValue = baseline.scenarios[2].netConsolidationValue;
  const result = evaluateDecision(input);
  assert.equal(result.code, DECISION_CODES.REVIEW);
});

test("one approval never unlocks an exception; both complete approvals record it", () => {
  const input = buildSyntheticInput(cases.AMBER_SERVICE_ESCALATION);
  const recordedAt = plusDays(input.meta.evaluationAt, 0.02);
  input.exception = {
    requested: true,
    kam: { name: "Synthetic KAM", status: "approve" },
    purchasingManager: { name: "Synthetic Purchasing Manager", status: "pending" },
    decisionAt: input.meta.evaluationAt,
    reason: "Synthetic test only",
  };
  let result = evaluateDecision(input, { recordedAt });
  assert.equal(result.exceptionRecord.status, "incomplete");
  assert.equal(result.exceptionRecord.authorized, false);

  input.exception.purchasingManager.status = "approve";
  input.exception.decisionAt = plusDays(input.meta.evaluationAt, 0.01);
  result = evaluateDecision(input, { recordedAt });
  assert.equal(result.code, DECISION_CODES.SHIP_NOW_SERVICE);
  assert.equal(result.exceptionRecord.status, "joint_exception_recorded");
  assert.equal(result.exceptionRecord.authorized, true);

  input.exception.decisionAt = plusDays(input.meta.evaluationAt, -0.01);
  result = evaluateDecision(input, { recordedAt });
  assert.equal(result.exceptionRecord.status, "incomplete");
  assert.equal(result.exceptionRecord.authorized, false);
});

test("when both options are certainly late the tool returns replan, not a cheaper miss", () => {
  const input = buildSyntheticInput(cases.AMBER_SERVICE_ESCALATION);
  input.common.needByAt = plusDays(input.meta.evaluationAt, 5);
  const result = evaluateDecision(input);
  assert.equal(result.code, DECISION_CODES.REPLAN);
  assert.equal(result.escalationRequired, true);
  assert.equal(result.operationalEscalation.status, "joint_response_required");
  assert.equal(result.exceptionRecord.required, false);
});

test("negative costs, currency mismatch, and future source timestamps are rejected", () => {
  const negative = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  negative.scenarios[0].recoveryCost = -1;
  assert.equal(evaluateDecision(negative).code, DECISION_CODES.DATA_STOP);

  const currency = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  currency.common.quoteCurrency = "USD";
  assert.ok(evaluateDecision(currency).issues.some((item) => item.code === "currency_mismatch"));

  const future = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  future.validity.needByConfirmedAt = plusDays(future.meta.evaluationAt, 1);
  assert.ok(evaluateDecision(future).issues.some((item) => item.code === "future_timestamp"));
});

test("held time uses actual consolidation departure rather than B readiness", () => {
  const input = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  input.scenarios[1].consolidatedDispatchAt = plusDays(input.scenarios[1].readyBAt, 1);
  input.scenarios[2].consolidatedDispatchAt = plusDays(input.scenarios[2].readyBAt, 1);
  const result = evaluateDecision(input);
  assert.equal(result.code, DECISION_CODES.CONSOLIDATE);
  approx(result.scenarios[1].supplierWaitDays, 3);
  approx(result.scenarios[1].holdDays, 4);
  assert.ok(result.scenarios[1].incrementalWaitCost > cases.GREEN_CONSOLIDATE.scenarios[1].incrementalWaitCost);
});

test("service feasibility selects consolidation before economics when ship-now is not robust", () => {
  const input = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  input.scenarios.forEach((scenario, index) => {
    scenario.shipNowTransitDays = 30 + index;
    scenario.freightConsolidated = 1440;
  });

  const result = evaluateDecision(input);
  assert.equal(result.code, DECISION_CODES.CONSOLIDATE_SERVICE);
  assert.ok(result.scenarios.every((scenario) => scenario.serviceGate === "pass"));
  assert.ok(result.scenarios.some((scenario) => scenario.shipNowServiceGate === "fail"));
  assert.ok(result.scenarios.every((scenario) => scenario.netConsolidationValue <= input.policy.minimumNetValue));
});

test("one credible late case for each option triggers replan even when other cases pass", () => {
  const input = buildSyntheticInput(cases.AMBER_SERVICE_ESCALATION);
  input.scenarios[2].shipNowTransitDays += 20;

  const result = evaluateDecision(input);
  assert.equal(result.code, DECISION_CODES.REPLAN);
  assert.ok(result.scenarios.some((scenario) => scenario.serviceGate === "pass"));
  assert.ok(result.scenarios.some((scenario) => scenario.serviceGate === "fail"));
  assert.ok(result.scenarios.some((scenario) => scenario.shipNowServiceGate === "pass"));
  assert.ok(result.scenarios.some((scenario) => scenario.shipNowServiceGate === "fail"));
  assert.equal(result.operationalEscalation.required, true);
});

test("elapsed ship-now and consolidation departures stop the calculation", () => {
  const shipNowElapsed = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  shipNowElapsed.common.readyAAt = plusDays(shipNowElapsed.meta.evaluationAt, -2);
  shipNowElapsed.common.shipNowDispatchAt = plusDays(shipNowElapsed.meta.evaluationAt, -1);
  let result = evaluateDecision(shipNowElapsed);
  assert.equal(result.code, DECISION_CODES.DATA_STOP);
  assert.ok(result.issues.some((item) => item.code === "ship_now_departure_elapsed"));

  const consolidationElapsed = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  consolidationElapsed.common.readyAAt = plusDays(consolidationElapsed.meta.evaluationAt, -3);
  consolidationElapsed.scenarios[0].readyBAt = plusDays(consolidationElapsed.meta.evaluationAt, -2);
  consolidationElapsed.scenarios[0].consolidatedDispatchAt = plusDays(consolidationElapsed.meta.evaluationAt, -1);
  result = evaluateDecision(consolidationElapsed);
  assert.equal(result.code, DECISION_CODES.DATA_STOP);
  assert.ok(result.issues.some((item) => item.code === "consolidation_departure_elapsed"));
});

test("exception decisions after the actual recording time are never authorized", () => {
  const input = buildSyntheticInput(cases.AMBER_SERVICE_ESCALATION);
  const recordedAt = plusDays(input.meta.evaluationAt, 0.01);
  input.exception = {
    requested: true,
    kam: { name: "Synthetic KAM", status: "approve" },
    purchasingManager: { name: "Synthetic Purchasing Manager", status: "approve" },
    decisionAt: plusDays(input.meta.evaluationAt, 0.02),
    reason: "Synthetic test only",
  };

  let result = evaluateDecision(input, { recordedAt });
  assert.equal(result.exceptionRecord.status, "incomplete");
  assert.equal(result.exceptionRecord.authorized, false);

  input.exception.decisionAt = plusDays(input.meta.evaluationAt, 0.005);
  result = evaluateDecision(input, { recordedAt });
  assert.equal(result.exceptionRecord.status, "joint_exception_recorded");
  assert.equal(result.exceptionRecord.recordedAt, recordedAt);
});

test("no economic headroom at zero hold yields zero permitted hold", () => {
  const input = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
  input.scenarios.forEach((scenario) => {
    scenario.freightConsolidated = 1450;
  });

  const result = evaluateDecision(input);
  assert.equal(result.code, DECISION_CODES.SHIP_NOW_ECONOMICS);
  assert.ok(result.scenarios.every((scenario) => scenario.economicBreakEvenHoldDays === 0));
  assert.ok(result.scenarios.every((scenario) => scenario.permittedHoldDays === 0));
});

test("every required source and owner field is a hard audit gate", () => {
  const fields = [
    "needByOwner",
    "readyASource",
    "supplierRangeSource",
    "transitSource",
    "quoteSource",
  ];

  for (const field of fields) {
    const input = buildSyntheticInput(cases.GREEN_CONSOLIDATE);
    input.validity[field] = "";
    const result = evaluateDecision(input);
    assert.equal(result.code, DECISION_CODES.DATA_STOP, field);
    assert.ok(result.issues.some((item) => item.code === "source_missing" && item.field === `validity.${field}`), field);
  }
});
