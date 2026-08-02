const DAY_MS = 24 * 60 * 60 * 1000;

export const COMPATIBILITY_CHECKS = Object.freeze([
  { id: "lane", label: "Origin, pickup lane, and destination" },
  { id: "service", label: "Transport mode and service level" },
  { id: "capacity", label: "Weight, cube, and available capacity" },
  { id: "handling", label: "Packaging, loading, and handling requirements" },
  { id: "compliance", label: "Dangerous goods, temperature, customs, and compliance" },
  { id: "documents", label: "Quality, documents, carrier cutoff, and release readiness" },
]);

function addDays(baseIso, day) {
  return new Date(Date.parse(baseIso) + day * DAY_MS).toISOString();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function allCompatibility(status = "pass") {
  return COMPATIBILITY_CHECKS.map((check) => ({ ...check, status }));
}

export function createBlankInput(baseIso = new Date().toISOString()) {
  return {
    meta: {
      evaluationAt: baseIso,
      currency: "EUR",
      recordId: "",
      synthetic: false,
      sourceCaseId: null,
    },
    compatibility: { checks: allCompatibility("unknown") },
    validity: {
      needByStatus: "unknown",
      needByOwner: "",
      needByConfirmedAt: "",
      needByConfirmedByKam: false,
      needByAuthoritative: false,
      readyAStatus: "unknown",
      readyASource: "",
      readyAConfirmed: false,
      supplierRangeStatus: "unknown",
      supplierRangeSource: "",
      supplierRangeUpdatedAt: "",
      supplierRangeCredible: false,
      transitStatus: "unknown",
      transitSource: "",
      transitUpdatedAt: "",
      quotesStatus: "unknown",
      quoteSource: "",
      quoteIssuedAt: "",
      quoteValidThrough: "",
      quotesComparable: false,
    },
    common: {
      needByAt: "",
      readyAAt: "",
      shipNowDispatchAt: "",
      freightASeparate: "",
      freightBSeparate: "",
      quoteCurrency: "EUR",
      incoterm: "",
      namedPlace: "",
    },
    economics: {
      mode: "direct_daily",
      shipmentAValue: "",
      incrementalAnnualRate: "",
      annualRateAssumptionConfirmed: false,
    },
    policy: {
      minimumNetValue: "",
      dateBasis: "elapsed_24h_days",
      recentExceptionCount: "",
      recurringExceptionThreshold: "",
    },
    scenarios: ["best", "base", "worst"].map((name) => ({
      name,
      readyBAt: "",
      consolidatedDispatchAt: "",
      shipNowTransitDays: "",
      consolidatedTransitDays: "",
      shipNowHandlingDays: 0,
      consolidatedHandlingDays: 0,
      freightConsolidated: "",
      oneOffDifferentialCost: "",
      recoveryCost: "",
      incrementalDailyCost: "",
    })),
    exception: {
      requested: false,
      kam: { name: "", status: "pending" },
      purchasingManager: { name: "", status: "pending" },
      decisionAt: "",
      reason: "",
    },
  };
}

export function buildSyntheticInput(fixtureCase, baseIso = "2026-08-03T08:00:00.000Z") {
  if (!fixtureCase || !fixtureCase.id) {
    throw new Error("A named fixture case is required.");
  }

  if (fixtureCase.id === "RED_DATA_STOP") {
    const input = createBlankInput(baseIso);
    input.meta = {
      evaluationAt: baseIso,
      currency: "EUR",
      recordId: "SYNTHETIC-RED",
      synthetic: true,
      sourceCaseId: fixtureCase.id,
    };
    input.compatibility.checks = allCompatibility("pass");
    input.validity = {
      needByStatus: "current",
      needByOwner: "Synthetic KAM",
      needByConfirmedAt: baseIso,
      needByConfirmedByKam: false,
      needByAuthoritative: true,
      readyAStatus: "current",
      readyASource: "Synthetic supplier release notice",
      readyAConfirmed: true,
      supplierRangeStatus: "current",
      supplierRangeSource: "Synthetic supplier contact",
      supplierRangeUpdatedAt: baseIso,
      supplierRangeCredible: true,
      transitStatus: "current",
      transitSource: "Synthetic forwarder",
      transitUpdatedAt: baseIso,
      quotesStatus: "current",
      quoteSource: "SYNTHETIC-QUOTE-RED",
      quoteIssuedAt: addDays(baseIso, -2),
      quoteValidThrough: addDays(baseIso, -1),
      quotesComparable: true,
    };
    input.common = {
      needByAt: addDays(baseIso, 16),
      readyAAt: baseIso,
      shipNowDispatchAt: baseIso,
      freightASeparate: 850,
      freightBSeparate: 700,
      quoteCurrency: "EUR",
      incoterm: "FCA",
      namedPlace: "Synthetic supplier dock",
    };
    input.economics = {
      mode: "annual_rate",
      shipmentAValue: 25000,
      incrementalAnnualRate: 0.24,
      annualRateAssumptionConfirmed: true,
    };
    input.policy.minimumNetValue = 0;
    input.scenarios = [
      { name: "best", day: 2, transit: 7, freight: 1050 },
      { name: "base", day: 5, transit: 9, freight: 1125 },
      { name: "worst", day: null, transit: 11, freight: 1200 },
    ].map((scenario) => ({
      name: scenario.name,
      readyBAt: scenario.day === null ? "" : addDays(baseIso, scenario.day),
      consolidatedDispatchAt: scenario.day === null ? addDays(baseIso, 8) : addDays(baseIso, scenario.day),
      shipNowTransitDays: scenario.transit,
      consolidatedTransitDays: scenario.transit,
      shipNowHandlingDays: 0,
      consolidatedHandlingDays: 0,
      freightConsolidated: scenario.freight,
      oneOffDifferentialCost: 50,
      recoveryCost: 0,
      incrementalDailyCost: "",
    }));
    return input;
  }

  const common = fixtureCase.commonInputs;
  const input = createBlankInput(baseIso);
  input.meta = {
    evaluationAt: baseIso,
    currency: "EUR",
    recordId: `SYNTHETIC-${fixtureCase.id}`,
    synthetic: true,
    sourceCaseId: fixtureCase.id,
  };
  input.compatibility.checks = allCompatibility("pass");
  input.validity = {
    needByStatus: "current",
    needByOwner: "Synthetic KAM",
    needByConfirmedAt: baseIso,
    needByConfirmedByKam: true,
    needByAuthoritative: true,
    readyAStatus: "current",
    readyASource: "Synthetic supplier release notice",
    readyAConfirmed: true,
    supplierRangeStatus: "current",
    supplierRangeSource: "Synthetic supplier contact",
    supplierRangeUpdatedAt: baseIso,
    supplierRangeCredible: true,
    transitStatus: "current",
    transitSource: "Synthetic forwarder",
    transitUpdatedAt: baseIso,
    quotesStatus: "current",
    quoteSource: `SYNTHETIC-QUOTE-${fixtureCase.id}`,
    quoteIssuedAt: addDays(baseIso, -1),
    quoteValidThrough: addDays(baseIso, 30),
    quotesComparable: true,
  };
  input.common = {
    needByAt: addDays(baseIso, common.needByDay),
    readyAAt: baseIso,
    shipNowDispatchAt: baseIso,
    freightASeparate: common.freightASeparate,
    freightBSeparate: common.freightBSeparate,
    quoteCurrency: "EUR",
    incoterm: "FCA",
    namedPlace: "Synthetic supplier dock",
  };
  input.economics = {
    mode: "annual_rate",
    shipmentAValue: common.shipmentAValue,
    incrementalAnnualRate: common.incrementalAnnualWaitRate,
    annualRateAssumptionConfirmed: true,
  };
  input.policy = {
    minimumNetValue: common.minimumNetValue,
    dateBasis: "elapsed_24h_days",
    recentExceptionCount: 0,
    recurringExceptionThreshold: 3,
  };
  input.scenarios = fixtureCase.scenarios.map((scenario) => ({
    name: scenario.name,
    readyBAt: addDays(baseIso, scenario.waitDays),
    consolidatedDispatchAt: addDays(baseIso, scenario.waitDays),
    shipNowTransitDays: scenario.transitDays,
    consolidatedTransitDays: scenario.transitDays,
    shipNowHandlingDays: 0,
    consolidatedHandlingDays: 0,
    freightConsolidated: scenario.freightConsolidated,
    oneOffDifferentialCost: common.incrementalHandling,
    recoveryCost: common.incrementalRecovery,
    incrementalDailyCost: "",
  }));
  return input;
}

export function cloneInput(input) {
  return clone(input);
}
