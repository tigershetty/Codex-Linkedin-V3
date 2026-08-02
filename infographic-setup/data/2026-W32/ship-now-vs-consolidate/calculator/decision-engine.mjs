export const CALCULATOR_VERSION = "0.2.0";

const DAY_MS = 24 * 60 * 60 * 1000;
const REQUIRED_SCENARIOS = ["best", "base", "worst"];
const CURRENT = "current";

export const DECISION_CODES = Object.freeze({
  AWAITING: "AWAITING_EVALUATION",
  DATA_STOP: "DATA_STOP",
  SHIP_NOW_COMPATIBILITY: "SHIP_NOW_COMPATIBILITY",
  SHIP_NOW_SERVICE: "SHIP_NOW_SERVICE",
  SHIP_NOW_ECONOMICS: "SHIP_NOW_ECONOMICS",
  CONSOLIDATE_SERVICE: "CONSOLIDATE_SERVICE",
  CONSOLIDATE: "CONSOLIDATE",
  REVIEW: "REVIEW",
  REPLAN: "REPLAN",
});

const ACTIONS = Object.freeze({
  customer_need_by_not_confirmed:
    "KAM confirms one authoritative customer need-by date",
  supplier_latest_ready_date_missing:
    "Purchasing obtains a credible supplier-ready range",
  consolidated_quote_expired:
    "Purchasing obtains a timestamped valid consolidated quote",
});

function finiteNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseInstant(value) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function differenceInDays(startMs, endMs) {
  return (endMs - startMs) / DAY_MS;
}

function addDays(startMs, days) {
  return startMs + days * DAY_MS;
}

function issue(code, message, field, action = "Correct this input and evaluate again") {
  return { code, message, field, action: ACTIONS[code] ?? action };
}

function pushRequiredNumber(issues, value, field, label, { allowZero = true } = {}) {
  const parsed = finiteNumber(value);
  if (parsed === null || parsed < 0 || (!allowZero && parsed === 0)) {
    issues.push(issue("invalid_number", `${label} must be an explicit non-negative number. Blank is not zero.`, field));
    return null;
  }
  return parsed;
}

function pushRequiredInstant(issues, value, field, label, code = "missing_datetime") {
  const parsed = parseInstant(value);
  if (parsed === null) {
    issues.push(issue(code, `${label} is required.`, field));
  }
  return parsed;
}

function dataStop(input, issues, warnings = []) {
  return {
    version: CALCULATOR_VERSION,
    evaluatedAt: input?.meta?.evaluationAt ?? null,
    code: DECISION_CODES.DATA_STOP,
    label: "DATA STOP",
    headline: "Do not newly hold shipment A",
    reason: "One or more decision inputs are missing, stale, uncertain, unreliable, or internally inconsistent.",
    issues,
    requiredActions: [...new Set(issues.map((item) => item.action))],
    warnings,
    scenarios: [],
    escalationRequired: false,
    exceptionRecord: { required: false, status: "not_applicable" },
    systemCorrection: { evaluated: false, flagged: false },
  };
}

function evaluateCompatibility(input) {
  const checks = Array.isArray(input?.compatibility?.checks)
    ? input.compatibility.checks
    : [];
  const failed = checks.filter((check) => check?.status === "fail");
  const unknown = checks.filter((check) => check?.status !== "pass" && check?.status !== "fail");

  if (failed.length > 0) {
    return {
      terminal: {
        version: CALCULATOR_VERSION,
        evaluatedAt: input?.meta?.evaluationAt ?? null,
        code: DECISION_CODES.SHIP_NOW_COMPATIBILITY,
        label: "DO NOT CONSOLIDATE",
        headline: "Compatibility failure blocks consolidation",
        reason: `Compatibility failed: ${failed.map((check) => check.label).join(", ")}. Use the next feasible non-consolidated response, then verify or expedite it against the customer need-by date.`,
        issues: failed.map((check) => issue("compatibility_failed", `${check.label} failed.`, `compatibility.${check.id}`, "Resolve the compatibility failure before considering consolidation")),
        requiredActions: ["Resolve the compatibility failure before considering consolidation"],
        warnings: [],
        scenarios: [],
        escalationRequired: false,
        exceptionRecord: { required: false, status: "not_applicable" },
        systemCorrection: { evaluated: false, flagged: false },
      },
    };
  }

  if (checks.length === 0 || unknown.length > 0) {
    const missing = checks.length === 0
      ? [issue("compatibility_unknown", "Compatibility checks have not been completed.", "compatibility.checks")]
      : unknown.map((check) => issue("compatibility_unknown", `${check.label} is unknown.`, `compatibility.${check.id}`));
    return { issues: missing };
  }

  return { issues: [] };
}

function evaluateExceptionRecord(exception, exceptionRequired, evaluationMs, recordedAtMs) {
  if (!exceptionRequired) {
    return { required: false, status: "not_required", authorized: false };
  }

  if (!exception?.requested) {
    return {
      required: true,
      status: "not_requested",
      authorized: false,
      message: "The calculated default remains ship now. A joint consolidation exception has not been requested.",
    };
  }

  const kam = exception.kam ?? {};
  const purchasing = exception.purchasingManager ?? {};
  const decisionMs = parseInstant(exception.decisionAt);
  const completeIdentity = Boolean(kam.name?.trim() && purchasing.name?.trim());
  const completeReason = Boolean(exception.reason?.trim());
  const decisionTimeValid = decisionMs !== null
    && evaluationMs !== null
    && recordedAtMs !== null
    && decisionMs >= evaluationMs
    && decisionMs <= recordedAtMs;
  const bothApproved = kam.status === "approve" && purchasing.status === "approve";
  const anyRejected = kam.status === "reject" || purchasing.status === "reject";

  if (!completeIdentity || !completeReason || !decisionTimeValid) {
    return {
      required: true,
      status: "incomplete",
      authorized: false,
      message: "Waiting is not authorized. Both named owners, a reason, and a decision time between evaluation and recording are required.",
      owners: { kam, purchasingManager: purchasing },
    };
  }

  const auditFields = {
    decisionAt: exception.decisionAt,
    recordedAt: new Date(recordedAtMs).toISOString(),
    reason: exception.reason.trim(),
    owners: { kam, purchasingManager: purchasing },
  };

  if (anyRejected) {
    return {
      required: true,
      status: "rejected",
      authorized: false,
      message: "At least one required owner rejected the exception. The calculated default remains ship now.",
      ...auditFields,
    };
  }

  if (bothApproved) {
    return {
      required: true,
      status: "joint_exception_recorded",
      authorized: true,
      message: "Both owners recorded a manual exception. The service risk remains visible and has not been relabelled as safe.",
      ...auditFields,
    };
  }

  return {
    required: true,
    status: "incomplete",
    authorized: false,
    message: "Waiting is not authorized. Both named owners, an explicit approval, a decision time, and a reason are required.",
    owners: { kam, purchasingManager: purchasing },
  };
}

function evaluateSystemCorrection(policy) {
  const count = finiteNumber(policy?.recentExceptionCount);
  const threshold = finiteNumber(policy?.recurringExceptionThreshold);

  if (count === null && threshold === null) {
    return {
      evaluated: false,
      flagged: false,
      message: "Recurring-exception policy was not evaluated; no hidden threshold was assumed.",
    };
  }

  if (count === null || threshold === null || count < 0 || threshold <= 0) {
    return {
      evaluated: false,
      flagged: false,
      message: "Enter both a non-negative exception count and a threshold above zero to evaluate recurrence.",
    };
  }

  const flagged = count >= threshold;
  return {
    evaluated: true,
    flagged,
    count,
    threshold,
    message: flagged
      ? "Recurring exceptions reached the declared threshold. Review the rule, supplier reliability, customer-date process, or freight setup."
      : "Recurring exceptions remain below the declared threshold.",
  };
}

function validateCurrentStatus(issues, status, field, label) {
  if (status !== CURRENT) {
    issues.push(issue("input_not_current", `${label} is ${status || "not classified"}; it must be explicitly marked current.`, field));
  }
}

function validateScenarioOrder(issues, scenarios, key, label) {
  const values = scenarios.map((scenario) => parseInstant(scenario[key]));
  if (values.some((value) => value === null)) return;
  if (!(values[0] <= values[1] && values[1] <= values[2])) {
    issues.push(issue("invalid_scenario_order", `${label} must be ordered best ≤ base ≤ worst.`, `scenarios.${key}`));
  }
}

function validateNumericScenarioOrder(issues, scenarios, key, label) {
  const values = scenarios.map((scenario) => finiteNumber(scenario[key]));
  if (values.some((value) => value === null)) return;
  if (!(values[0] <= values[1] && values[1] <= values[2])) {
    issues.push(issue("invalid_scenario_order", `${label} must be ordered best ≤ base ≤ worst.`, `scenarios.${key}`));
  }
}

export function evaluateDecision(input, { recordedAt = new Date().toISOString() } = {}) {
  const compatibility = evaluateCompatibility(input);
  if (compatibility.terminal) return compatibility.terminal;

  const issues = [...compatibility.issues];
  const warnings = [];
  const meta = input?.meta ?? {};
  const validity = input?.validity ?? {};
  const common = input?.common ?? {};
  const economics = input?.economics ?? {};
  const policy = input?.policy ?? {};
  const recordedAtMs = parseInstant(recordedAt);

  const evaluationMs = pushRequiredInstant(issues, meta.evaluationAt, "meta.evaluationAt", "Evaluation date and time");
  const needByMs = pushRequiredInstant(issues, common.needByAt, "common.needByAt", "Customer need-by date and time");
  const readyAMs = pushRequiredInstant(issues, common.readyAAt, "common.readyAAt", "Shipment A ready date and time");
  const shipNowDispatchMs = pushRequiredInstant(issues, common.shipNowDispatchAt, "common.shipNowDispatchAt", "Ship-now dispatch date and time");
  const needByConfirmedMs = pushRequiredInstant(issues, validity.needByConfirmedAt, "validity.needByConfirmedAt", "KAM confirmation date and time");
  const supplierUpdatedMs = pushRequiredInstant(issues, validity.supplierRangeUpdatedAt, "validity.supplierRangeUpdatedAt", "Supplier range update date and time");
  const transitUpdatedMs = pushRequiredInstant(issues, validity.transitUpdatedAt, "validity.transitUpdatedAt", "Transit range update date and time");
  const quoteIssuedMs = pushRequiredInstant(issues, validity.quoteIssuedAt, "validity.quoteIssuedAt", "Quote issue date and time");
  const quoteValidThroughMs = pushRequiredInstant(issues, validity.quoteValidThrough, "validity.quoteValidThrough", "Quote valid-through date and time");

  validateCurrentStatus(issues, validity.needByStatus, "validity.needByStatus", "Customer commitment");
  validateCurrentStatus(issues, validity.readyAStatus, "validity.readyAStatus", "Shipment A readiness");
  validateCurrentStatus(issues, validity.supplierRangeStatus, "validity.supplierRangeStatus", "Supplier ready range");
  validateCurrentStatus(issues, validity.transitStatus, "validity.transitStatus", "Transit range");
  validateCurrentStatus(issues, validity.quotesStatus, "validity.quotesStatus", "Freight quotes");

  for (const [value, field, label] of [
    [validity.needByOwner, "validity.needByOwner", "KAM / customer-commitment owner"],
    [validity.readyASource, "validity.readyASource", "Shipment A readiness source"],
    [validity.supplierRangeSource, "validity.supplierRangeSource", "Supplier-ready range source"],
    [validity.transitSource, "validity.transitSource", "Transit range source"],
    [validity.quoteSource, "validity.quoteSource", "Freight quote reference or source"],
  ]) {
    if (!value?.trim()) {
      issues.push(issue("source_missing", `${label} is required for the audit trail.`, field, "Record who supplied or owns this input"));
    }
  }

  if (!validity.needByConfirmedByKam || !validity.needByAuthoritative) {
    issues.push(issue("customer_need_by_not_confirmed", "The customer need-by is not both KAM-confirmed and authoritative for the affected demand.", "validity.needByConfirmedByKam"));
  }
  if (!validity.readyAConfirmed) {
    issues.push(issue("shipment_a_not_confirmed", "Shipment A readiness is not confirmed.", "validity.readyAConfirmed", "Purchasing confirms shipment A is released and ready"));
  }
  if (!validity.supplierRangeCredible) {
    issues.push(issue("supplier_range_unreliable", "The supplier-ready range is not acknowledged as credible.", "validity.supplierRangeCredible", "Purchasing obtains or documents a credible supplier-ready range"));
  }
  if (!validity.quotesComparable) {
    issues.push(issue("quotes_not_comparable", "The freight quotes are not confirmed as comparable in scope, lane, service, currency, and surcharges.", "validity.quotesComparable", "Purchasing obtains comparable separate and consolidated quotes"));
  }
  if (!common.incoterm?.trim() || !common.namedPlace?.trim()) {
    issues.push(issue("incoterm_missing", "Incoterm and named place are required; the calculator will not infer ownership or capital exposure from them.", "common.incoterm"));
  }
  if (!meta.currency || !common.quoteCurrency || meta.currency !== common.quoteCurrency) {
    issues.push(issue("currency_mismatch", "Calculator and quote currencies must be explicit and identical.", "common.quoteCurrency"));
  }

  const futureStamped = [
    [needByConfirmedMs, "KAM confirmation"],
    [supplierUpdatedMs, "Supplier update"],
    [transitUpdatedMs, "Transit update"],
    [quoteIssuedMs, "Quote issue"],
  ];
  if (evaluationMs !== null) {
    for (const [stamp, label] of futureStamped) {
      if (stamp !== null && stamp > evaluationMs) {
        issues.push(issue("future_timestamp", `${label} cannot be later than the evaluation time.`, "validity.timestamps"));
      }
    }
  }

  if (readyAMs !== null && shipNowDispatchMs !== null && shipNowDispatchMs < readyAMs) {
    issues.push(issue("ship_now_before_ready", "Ship-now dispatch cannot be earlier than shipment A readiness.", "common.shipNowDispatchAt"));
  }
  if (evaluationMs !== null && shipNowDispatchMs !== null && shipNowDispatchMs < evaluationMs) {
    issues.push(issue("ship_now_departure_elapsed", "Ship-now departure is earlier than the evaluation time and is no longer feasible.", "common.shipNowDispatchAt", "Enter the next feasible ship-now departure"));
  }

  const freightA = pushRequiredNumber(issues, common.freightASeparate, "common.freightASeparate", "Freight cost for A separately");
  const freightB = pushRequiredNumber(issues, common.freightBSeparate, "common.freightBSeparate", "Freight cost for B separately");
  const minimumNetValue = pushRequiredNumber(issues, policy.minimumNetValue, "policy.minimumNetValue", "Minimum worthwhile net saving");

  if (!Array.isArray(input?.scenarios) || input.scenarios.length !== 3) {
    issues.push(issue("scenario_set_incomplete", "Exactly three sensitivity scenarios—best, base, and worst—are required.", "scenarios"));
  }

  const scenarioMap = new Map((input?.scenarios ?? []).map((scenario) => [scenario.name, scenario]));
  const scenarios = REQUIRED_SCENARIOS.map((name) => scenarioMap.get(name)).filter(Boolean);
  if (scenarios.length !== 3) {
    issues.push(issue("scenario_set_incomplete", "Best, base, and worst scenario names are required exactly once.", "scenarios"));
  }

  let dailyCostFromAnnualRate = null;
  if (economics.mode === "annual_rate") {
    const shipmentValue = pushRequiredNumber(issues, economics.shipmentAValue, "economics.shipmentAValue", "Shipment A value");
    const annualRate = pushRequiredNumber(issues, economics.incrementalAnnualRate, "economics.incrementalAnnualRate", "Incremental annual wait rate");
    if (!economics.annualRateAssumptionConfirmed) {
      issues.push(issue("annual_rate_assumption_unconfirmed", "The annual-rate shortcut is blocked until the user confirms that holding A creates incremental cost versus shipping now.", "economics.annualRateAssumptionConfirmed"));
    }
    if (shipmentValue !== null && annualRate !== null) {
      dailyCostFromAnnualRate = (shipmentValue * annualRate) / 365;
    }
  } else if (economics.mode !== "direct_daily") {
    issues.push(issue("economic_mode_missing", "Choose one economic mode: direct daily differential cost or explicitly confirmed annual-rate shortcut.", "economics.mode"));
  }

  const prepared = [];
  if (scenarios.length === 3) {
    for (const scenario of scenarios) {
      const prefix = `scenarios.${scenario.name}`;
      const readyBMs = pushRequiredInstant(
        issues,
        scenario.readyBAt,
        `${prefix}.readyBAt`,
        `${scenario.name} supplier-ready date and time`,
        scenario.name === "worst" ? "supplier_latest_ready_date_missing" : "missing_datetime",
      );
      const consolidatedDispatchMs = pushRequiredInstant(issues, scenario.consolidatedDispatchAt, `${prefix}.consolidatedDispatchAt`, `${scenario.name} consolidation departure`);
      const shipNowTransitDays = pushRequiredNumber(issues, scenario.shipNowTransitDays, `${prefix}.shipNowTransitDays`, `${scenario.name} ship-now transit days`);
      const consolidatedTransitDays = pushRequiredNumber(issues, scenario.consolidatedTransitDays, `${prefix}.consolidatedTransitDays`, `${scenario.name} consolidated transit days`);
      const shipNowHandlingDays = pushRequiredNumber(issues, scenario.shipNowHandlingDays, `${prefix}.shipNowHandlingDays`, `${scenario.name} ship-now handling/buffer days`);
      const consolidatedHandlingDays = pushRequiredNumber(issues, scenario.consolidatedHandlingDays, `${prefix}.consolidatedHandlingDays`, `${scenario.name} consolidated handling/buffer days`);
      const freightConsolidated = pushRequiredNumber(issues, scenario.freightConsolidated, `${prefix}.freightConsolidated`, `${scenario.name} consolidated freight quote`);
      const oneOffDifferentialCost = pushRequiredNumber(issues, scenario.oneOffDifferentialCost, `${prefix}.oneOffDifferentialCost`, `${scenario.name} one-off differential cost`);
      const recoveryCost = pushRequiredNumber(issues, scenario.recoveryCost, `${prefix}.recoveryCost`, `${scenario.name} recovery/expedite/shortage consequence`);
      let incrementalDailyCost = dailyCostFromAnnualRate;
      if (economics.mode === "direct_daily") {
        incrementalDailyCost = pushRequiredNumber(issues, scenario.incrementalDailyCost, `${prefix}.incrementalDailyCost`, `${scenario.name} incremental daily cost`);
      }

      if (readyAMs !== null && readyBMs !== null && readyBMs < readyAMs) {
        issues.push(issue("supplier_ready_before_a", `${scenario.name} supplier-ready date for B cannot be earlier than A readiness in this two-PO release decision.`, `${prefix}.readyBAt`));
      }
      if (readyBMs !== null && consolidatedDispatchMs !== null && consolidatedDispatchMs < readyBMs) {
        issues.push(issue("dispatch_before_b_ready", `${scenario.name} consolidation departure is earlier than shipment B readiness.`, `${prefix}.consolidatedDispatchAt`));
      }
      if (readyAMs !== null && consolidatedDispatchMs !== null && consolidatedDispatchMs < readyAMs) {
        issues.push(issue("dispatch_before_a_ready", `${scenario.name} consolidation departure is earlier than shipment A readiness.`, `${prefix}.consolidatedDispatchAt`));
      }
      if (evaluationMs !== null && consolidatedDispatchMs !== null && consolidatedDispatchMs < evaluationMs) {
        issues.push(issue("consolidation_departure_elapsed", `${scenario.name} consolidation departure is earlier than the evaluation time and is no longer feasible.`, `${prefix}.consolidatedDispatchAt`, "Enter the next feasible consolidation departure"));
      }

      prepared.push({
        source: scenario,
        readyBMs,
        consolidatedDispatchMs,
        shipNowTransitDays,
        consolidatedTransitDays,
        shipNowHandlingDays,
        consolidatedHandlingDays,
        freightConsolidated,
        oneOffDifferentialCost,
        recoveryCost,
        incrementalDailyCost,
      });
    }

    validateScenarioOrder(issues, scenarios, "readyBAt", "Supplier B readiness");
    validateScenarioOrder(issues, scenarios, "consolidatedDispatchAt", "Consolidation departure");
    validateNumericScenarioOrder(issues, scenarios, "shipNowTransitDays", "Ship-now transit");
    validateNumericScenarioOrder(issues, scenarios, "consolidatedTransitDays", "Consolidated transit");
  }

  if (evaluationMs !== null && quoteValidThroughMs !== null && quoteValidThroughMs < evaluationMs) {
    issues.push(issue("consolidated_quote_expired", "The freight quote is already expired at the evaluation time.", "validity.quoteValidThrough"));
  }
  const latestDispatchMs = prepared.reduce((latest, scenario) => Math.max(latest, scenario.consolidatedDispatchMs ?? -Infinity), -Infinity);
  if (
    quoteValidThroughMs !== null
    && evaluationMs !== null
    && quoteValidThroughMs >= evaluationMs
    && Number.isFinite(latestDispatchMs)
    && quoteValidThroughMs < latestDispatchMs
  ) {
    issues.push(issue("quote_expires_before_dispatch", "The quote expires before at least one credible consolidation departure.", "validity.quoteValidThrough", "Obtain a quote valid through the latest credible departure or narrow the scenario range"));
  }

  if (issues.length > 0) return dataStop(input, issues, warnings);

  const calculatedScenarios = prepared.map((scenario) => {
    const holdDays = differenceInDays(readyAMs, scenario.consolidatedDispatchMs);
    const supplierWaitDays = differenceInDays(readyAMs, scenario.readyBMs);
    const consolidatedEtaMs = addDays(
      scenario.consolidatedDispatchMs,
      scenario.consolidatedHandlingDays + scenario.consolidatedTransitDays,
    );
    const shipNowEtaMs = addDays(
      shipNowDispatchMs,
      scenario.shipNowHandlingDays + scenario.shipNowTransitDays,
    );
    const serviceSlackDays = differenceInDays(consolidatedEtaMs, needByMs);
    const shipNowServiceSlackDays = differenceInDays(shipNowEtaMs, needByMs);
    const freightSaved = freightA + freightB - scenario.freightConsolidated;
    const incrementalWaitCost = scenario.incrementalDailyCost * holdDays;
    const incrementalNonFreightCost = incrementalWaitCost + scenario.oneOffDifferentialCost + scenario.recoveryCost;
    const netConsolidationValue = freightSaved - incrementalNonFreightCost;
    const breakEvenNumerator = freightSaved - scenario.oneOffDifferentialCost - scenario.recoveryCost - minimumNetValue;
    const economicBreakEvenHoldDays = breakEvenNumerator <= 0
      ? 0
      : scenario.incrementalDailyCost > 0
        ? breakEvenNumerator / scenario.incrementalDailyCost
        : null;
    const latestSafeDispatchMs = addDays(needByMs, -(scenario.consolidatedHandlingDays + scenario.consolidatedTransitDays));
    const latestSafeHoldDays = differenceInDays(readyAMs, latestSafeDispatchMs);
    const permittedHoldDays = Math.max(
      0,
      economicBreakEvenHoldDays === null
        ? latestSafeHoldDays
        : Math.min(economicBreakEvenHoldDays, latestSafeHoldDays),
    );

    return {
      name: scenario.source.name,
      supplierReadyAt: scenario.source.readyBAt,
      consolidatedDispatchAt: scenario.source.consolidatedDispatchAt,
      supplierWaitDays,
      holdDays,
      shipNowEtaAt: new Date(shipNowEtaMs).toISOString(),
      consolidatedEtaAt: new Date(consolidatedEtaMs).toISOString(),
      shipNowServiceSlackDays,
      serviceSlackDays,
      shipNowServiceGate: shipNowServiceSlackDays >= 0 ? "pass" : "fail",
      serviceGate: serviceSlackDays >= 0 ? "pass" : "fail",
      freightSaved,
      incrementalDailyCost: scenario.incrementalDailyCost,
      incrementalWaitCost,
      oneOffDifferentialCost: scenario.oneOffDifferentialCost,
      recoveryCost: scenario.recoveryCost,
      incrementalNonFreightCost,
      netConsolidationValue,
      economicBreakEvenHoldDays,
      latestSafeHoldDays,
      permittedHoldDays,
      quoteValidThrough: validity.quoteValidThrough,
    };
  });

  const worstConsolidationSlack = Math.min(...calculatedScenarios.map((scenario) => scenario.serviceSlackDays));
  const worstShipNowSlack = Math.min(...calculatedScenarios.map((scenario) => scenario.shipNowServiceSlackDays));
  const consolidationRobust = worstConsolidationSlack >= 0;
  const shipNowRobust = worstShipNowSlack >= 0;
  const allEconomicsPass = calculatedScenarios.every((scenario) => scenario.netConsolidationValue > minimumNetValue);
  const allEconomicsFail = calculatedScenarios.every((scenario) => scenario.netConsolidationValue <= minimumNetValue);

  let code;
  let label;
  let headline;
  let reason;
  let escalationRequired = false;

  if (!consolidationRobust && !shipNowRobust) {
    code = DECISION_CODES.REPLAN;
    label = "REPLAN / EXPEDITE";
    headline = "Neither option protects the customer date across every credible scenario";
    reason = "Do not choose a cheaper miss. KAM and Purchasing Manager must jointly replan or expedite and manage the customer response.";
    escalationRequired = true;
  } else if (!consolidationRobust) {
    code = DECISION_CODES.SHIP_NOW_SERVICE;
    label = "SHIP NOW";
    headline = "Default: ship now. Waiting requires a joint exception";
    reason = "At least one credible consolidation scenario misses the customer need-by date. Economics are informational only because the service gate failed.";
    escalationRequired = true;
  } else if (!shipNowRobust) {
    code = DECISION_CODES.CONSOLIDATE_SERVICE;
    label = "CONSOLIDATE";
    headline = "Consolidate: it is the only option that protects the customer date across all credible scenarios";
    reason = "Customer service takes precedence. Ship-now misses in at least one credible scenario, while consolidation remains service-safe; economics are informational.";
  } else if (allEconomicsPass) {
    code = DECISION_CODES.CONSOLIDATE;
    label = "CONSOLIDATE";
    headline = "All credible scenarios protect the customer date and clear the economic threshold";
    reason = "Consolidation is supported while the quote and operating inputs remain current.";
  } else if (allEconomicsFail) {
    code = DECISION_CODES.SHIP_NOW_ECONOMICS;
    label = "SHIP NOW";
    headline = "The saving is not sufficient across the credible scenarios";
    reason = "Customer service is safe, but consolidation does not exceed the declared minimum worthwhile net saving.";
  } else {
    code = DECISION_CODES.REVIEW;
    label = "REVIEW";
    headline = "Service is safe, but the economic scenarios disagree";
    reason = "Refresh the quote, narrow the uncertainty, or revisit the declared economic threshold before holding shipment A.";
  }

  if (calculatedScenarios.some((scenario) => scenario.economicBreakEvenHoldDays === null)) {
    warnings.push("Economic break-even is not applicable where daily cost is zero and positive economic headroom remains; the service limit applies.");
  }
  if (calculatedScenarios.some((scenario) => scenario.economicBreakEvenHoldDays === 0)) {
    warnings.push("Permitted hold is zero where consolidation does not clear the economic threshold even before additional daily hold cost.");
  }
  warnings.push("Best, base, and worst are sensitivity cases, not probabilities. No expected value was calculated.");
  warnings.push("Freight for B shipping separately is treated as one current comparable estimate across the scenarios. Refresh it or extend the model when that price is materially volatile.");
  if (economics.mode === "annual_rate") {
    warnings.push("The annual-rate shortcut is used only because the user explicitly confirmed that the cost is incremental versus shipping now.");
  }

  const exceptionRequired = code === DECISION_CODES.SHIP_NOW_SERVICE;
  const exceptionRecord = evaluateExceptionRecord(input?.exception, exceptionRequired, evaluationMs, recordedAtMs);
  const operationalEscalation = code === DECISION_CODES.REPLAN
    ? {
        required: true,
        status: "joint_response_required",
        owners: ["KAM", "Purchasing Manager"],
        message: "Joint KAM + Purchasing Manager response required: replan, expedite, and manage the customer commitment. This is not permission to consolidate.",
      }
    : { required: false, status: "not_required" };
  const systemCorrection = evaluateSystemCorrection(policy);

  return {
    version: CALCULATOR_VERSION,
    evaluatedAt: meta.evaluationAt,
    code,
    label,
    headline,
    reason,
    issues: [],
    requiredActions: [],
    warnings,
    scenarios: calculatedScenarios,
    escalationRequired,
    exceptionRecord,
    operationalEscalation,
    systemCorrection,
    policy: {
      minimumNetValue,
      currency: meta.currency,
      dateBasis: policy.dateBasis,
    },
  };
}

export const _internal = Object.freeze({
  DAY_MS,
  addDays,
  differenceInDays,
  finiteNumber,
  parseInstant,
});
