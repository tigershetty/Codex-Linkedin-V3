# Source-backed supply-chain resource opportunity seeds

**Research date:** 2026-08-07
**Purpose:** seed the V5 knowledge map with defensible working relationships, not choose a post or claim a guaranteed outcome.

## 1. Supplier confirmation is not automatically a customer promise

**Reader work moment:** A buyer receives a changed supplier confirmation after the planner or KAM has discussed a customer date.

**Potential reader outcome:** distinguish the supplier input from the customer promise, then identify what needs checking before the promise changes.

| Source | What it safely contributes | Boundary |
|---|---|---|
| [Oracle Global Order Promising](https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/26b/fascp/overview-of-global-order-promising.html) | A real order-promising system evaluates requested/promise dates against supply, capacity, lead time, sourcing and alternatives. | Oracle functionality is not a universal operating standard. |
| [Oracle availability estimation](https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/26b/fascp/determine-how-order-promising-gets-and-estimates-availability.html) | Expected purchase-order receipts can be excluded from availability calculations when reliability is inadequate. | It does not prescribe a universal reliability threshold. |
| [APQC supplier on-time delivery measure](https://www.apqc.org/what-we-do/benchmarking/open-standards-benchmarking/measures/percentage-supplier-time-delivery) | Supplier OTD is a measurable performance input. | It does not prove that a customer order can still be served. |
| [Delivery-date-setting literature review](https://www.tandfonline.com/doi/full/10.1080/00207543.2022.2057256) | Delivery-date decisions have explicit research literature and depend on context. | The review is ETO-specific. |

**Visual opportunity:** an *evidence-aware promise-control map* that separates requested date, promised date, supply position, freshness/reliability, and recovery options. Organisation-specific escalation rights must be labelled configurable.

**Do not claim:** that a supplier-date workflow reduces late deliveries, that any particular owner must approve exceptions, or that an illustrative date scenario is a real customer case.

## 2. Batch, consolidate, or dispatch?

**Reader work moment:** Purchasing has a MOQ/load incentive, logistics has a consolidation threshold, and planning needs to protect customer service.

**Potential reader outcome:** identify the inputs that distinguish EOQ from a dispatch decision, and see why a bigger batch is not automatically lower total cost.

| Source | What it safely contributes | Boundary |
|---|---|---|
| [MIT EOQ course material](https://ocw.mit.edu/courses/esd-273j-logistics-and-supply-chain-management-fall-2009/resources/mitesd_273jf09_lec02/) | EOQ is an inventory model with explicit assumptions and inputs. | EOQ is not a freight-consolidation or customer-date policy. |
| [TU/e quantity-based consolidation research](https://research.tue.nl/en/publications/a-multi-item-multi-echelon-inventory-system-with-quantity-based-o/) | Consolidation can trade transport/handling cost against inventory and service effects in a multi-item, multi-echelon setting. | Its model does not create a universal batch size. |
| [FHWA freight logistics trade-off framework](https://ops.fhwa.dot.gov/freight/freight_analysis/econ_methods/microecon_frmwk/sec_2.htm) | Freight choices involve explicit logistics trade-offs rather than one transport rate. | Historical examples are not current company benchmarks. |

**Visual opportunity:** a *batch-versus-dispatch decision field* separating demand rate, service constraint, safety stock, consolidation threshold, freight break, and maximum permissible wait. Numerical recommendations require actual inputs and reproducible calculations.

**Do not claim:** that consolidation always saves money, that EOQ chooses dispatch dates, or that one formula fits every product, lane, and network context.

## 3. Which planning exceptions deserve interruption?

**Reader work moment:** A planner has an alert inbox and needs to distinguish an operational signal from an exception requiring an accountable response.

**Potential reader outcome:** build an exception policy that defines trigger, scope, materiality, horizon, owner, recovery action, closure evidence and re-alert condition.

| Source | What it safely contributes | Boundary |
|---|---|---|
| [SAP exception-based planning](https://help.sap.com/docs/SAP_BUSINESS_BYDESIGN/2754875d2d2a403f95e58a41a9c7d6de/2cbc6450722d101496d2ae687ef3c1fb.html) | Exception-based planning can use defined deviations and contextual drill-down. | It is an implementation pattern, not independent outcome evidence. |
| [Oracle plan exceptions](https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/26b/faurp/overview-of-plan-exceptions.html) | Exceptions can be prioritised, investigated and resolved in planning. | Severity and ownership are organisation-specific. |
| [Oracle constrained-plan exceptions](https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/26b/fausp/exceptions-in-a-constrained-supply-plan.html) | Constrained plans expose named exception conditions. | It does not prove alerts improve service or workload. |
| [SAP exception-based release](https://help.sap.com/docs/SAP_SUPPLY_CHAIN_MANAGEMENT/3834c664fddf4fb99bd5e2f8227be9c9/6282efb52aab4e2ea47b6af0f05f25d0.html) | Exception logic can constrain automatic release. | The operational policy remains local. |

**Visual opportunity:** an *exception-policy builder* distinguishing alert, material exception, owner, and closure/re-alert logic. It should not become an alert-priority list without an action model.

**Do not claim:** that exception-based planning reduces workload or improves service without an appropriate documented case or a reader's own measured data.

## Current ranking for the next candidate card

1. **Supplier confirmation versus customer promise** — strongest immediate evidence and clearest reader tension; rebuild from a fresh candidate card, not the rejected poster.
2. **Exception policy** — broad and relatable for planning, with clear native-system behaviours; select the exact reader problem first.
3. **Batch versus dispatch** — technically rich and potentially tool-worthy, but it requires actual inputs or a labelled illustrative scenario before a numerical visual can be useful.

The next step is to add these as source-bound branches in the knowledge map, then build one Resource Candidate Card—not a visual—for the strongest branch.
