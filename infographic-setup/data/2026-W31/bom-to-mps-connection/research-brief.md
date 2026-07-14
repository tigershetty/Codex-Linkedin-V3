# Research Brief - BOM To MPS Connection

**Pipeline:** 101  
**Week:** 2026-W31  
**Generated:** 2026-07-13  
**Standard:** consultant-grade, verified, reliability-tagged

## 0. Topic Qualification

- **Audience segment:** production planners, supply planners, material planners, buyers, operations managers, and early-career supply-chain professionals.
- **Audience pain/desire:** people understand the MPS and BOM separately but often cannot explain how a finished-good commitment becomes time-phased component requirements.
- **Post promise:** show the complete bridge from one MPS line through BOM explosion, netting, lead-time offset, and planned supply proposals.
- **Why now:** this follows the MPS commitment post and reveals what that commitment triggers below the finished-good level.
- **Tiger authority:** translate planning terminology into the operational questions teams ask after a finished-good quantity or date changes.
- **Visual argument:** one finished pump assembly separates into its physical components while the MPS quantity multiplies through the BOM; an MRP rail then nets inventory and scheduled receipts before moving requirements backward through lead time.
- **Reference-proven promise:** show how one finished-good commitment becomes many material and timing decisions.
- **Power format:** PF8 anatomy + worked-example process flow.
- **Save trigger:** MPS-to-materials explosion map.
- **Topic score:** **88/100**.
  - Audience pain/desire: 22/25
  - Save utility: 19/20
  - Visual potential: 15/15
  - Freshness/timing: 10/15
  - Tiger authority: 9/10
  - Research strength: 8/10
  - Series fit: 5/5
- **Decision:** build.

## 1. Framing

A BOM and an MPS answer different questions. The BOM defines what each unit of a
product contains. The MPS defines which finished item is planned, how many are
needed, and when. MRP is the calculation layer that connects them: it explodes
the product structure, nets the gross need against available supply, offsets the
remaining need by lead time, and creates planned supply recommendations.

The non-obvious point is that multiplying MPS quantity by BOM usage is only the
first step. The planning answer also depends on active BOM versions, on-hand
inventory, scheduled receipts, lead times, lot-sizing rules, and other item
parameters.

## 2. Verified Facts And Data

1. **A BOM is a formally structured list of the components in a product or assembly, including component quantity and unit of measure.** SAP documents this definition and identifies BOM data as an input to MRP and material provision. This is **CARD-READY**. [High]

2. **A BOM defines the components required to produce a product.** Microsoft notes that components may be raw materials, semi-finished products, ingredients, and in some cases services. BOM versions can be constrained by period, quantity, site, dimensions, and other criteria. This is **CAPTION-SUPPORT** and supports the active-version integrity rule. [High]

3. **MRP calculates net requirements by evaluating the master schedule, bills of material, scheduled receipts, on-hand inventory, lead times, and order modifiers.** Oracle then describes the output as recommendations to release or reschedule orders based on net material requirements. This is **CARD-READY**. [High]

4. **Gross-to-net explosion translates assembly requirements into component requirements while accounting for existing inventories and scheduled receipts.** Oracle states that the process determines component quantities and due dates needed to satisfy the assembly requirement. This is **CARD-READY**. [High]

5. **Component due dates are offset from assembly due dates by lead time.** Oracle documents time-phasing as part of gross-to-net explosion. This is **CARD-READY** as a principle, not as one universal week offset. [High]

6. **BOM explosion creates dependent requirements for the assemblies and components needed to produce the product.** SAP documents that explosion and dependent-requirement determination occur within MRP during the planning run. This is **CARD-READY**. [High]

7. **Demand explosion creates demand for each BOM line item and can carry site or warehouse context.** Microsoft documents this in its master-planning BOM-version scenario. This is **CAPTION-SUPPORT**. [High]

8. **Planned supply is a recommendation until it is approved, released, or firmed according to the operating system and configuration.** Oracle calls the planning outputs recommendations; Microsoft notes that master planning creates planned production orders and that manual changes require a new planning run before related material requirements are reflected. Use `PLANNED SUPPLY`, not `PURCHASE ORDER CREATED`, in the visual. [High]

9. **Illustrative worked example for the card:** an MPS line for `P-100 PUMP ASSEMBLY`, `50 UNITS`, `DUE WK 6`; BOM usage of `1 HOUSING`, `1 MOTOR MODULE`, `2 BEARINGS`, and `4 FASTENERS` per finished unit creates gross requirements of `50`, `50`, `100`, and `200`. For the bearing line, `100 GROSS - 20 ON HAND - 30 SCHEDULED RECEIPT = 50 NET`. These figures are arithmetic teaching examples, not sourced benchmarks. [Illustrative]

## 3. The So What

One finished-good change does not stay at the finished-good level. It can change
dependent demand across several BOM levels, alter the date components are needed,
and create or reschedule planned supply. That is why a seemingly small MPS edit
can become a much larger material-planning conversation.

The useful artifact is a three-stage map:

- **MPS:** how many finished goods and when.
- **BOM:** what each finished unit requires.
- **MRP:** what remains to make or buy, and when it is needed.

## 3b. Tension / Trade-Off

- **What makes this interesting:** a clean multiplication produces gross component demand, but the actual supply recommendation depends on inventory, incoming supply, timing, and planning rules.
- **What people get wrong:** the BOM is described as telling the factory what to make, or MPS + BOM are said to generate purchase orders directly.
- **What a practitioner would push back on:** real BOMs may be multi-level, versioned, site-specific, affected by yield/scrap, and governed by lot sizing and calendars. The visual must say `ILLUSTRATIVE EXAMPLE` and teach the principle without pretending to reproduce one ERP's full logic.
- **Critical distinction:** BOM explosion creates gross dependent requirements; netting and time-phasing turn those requirements into planned supply recommendations.

## 3c. Meeting-Room / Workflow Use

- **Use moment:** production review, material shortage review, master-schedule change, engineering-change discussion, or buyer/planner handoff.
- **Decision supported:** whether a proposed finished-good quantity/date change can be accepted after checking component availability and timing.
- **Questions the artifact enables:** Which finished item changed? Which BOM version applies? What is the gross component impact? What supply is already available or due in? Which net requirements and release dates change?

## 4. Visual-Data Candidates

### Primary artifact

`MPS-TO-MATERIALS EXPLOSION MAP`

Use a large exploded industrial pump assembly as the central hero. A compact MPS
ticket enters the hero from above, and four component trays carry both per-unit
usage and gross requirement:

```text
MPS COMMITMENT
P-100 PUMP ASSEMBLY | 50 UNITS | DUE WK 6

HOUSING       1 PER UNIT -> 50 REQUIRED
MOTOR MODULE  1 PER UNIT -> 50 REQUIRED
BEARINGS      2 PER UNIT -> 100 REQUIRED
FASTENERS     4 PER UNIT -> 200 REQUIRED
```

### Worked netting line

```text
BEARINGS
100 GROSS - 20 ON HAND - 30 SCHEDULED RECEIPT = 50 NET
```

### Time-phasing rail

```text
PLANNED RELEASE -> COMPONENT NEED -> FINISHED GOOD DUE
```

Use backward arrows or a reversed timeline to show that planning works backward
from the finished-good requirement. Do not assign a universal number of lead-time
weeks.

### Bottom distinction

```text
BOM = WHAT EACH UNIT NEEDS
MPS = HOW MANY + WHEN
MRP = WHAT TO MAKE OR BUY + WHEN
```

## 5. Caption Support

- Open with the hidden multiplication: one MPS line can become many component requirements.
- Correct the familiar oversimplification: the BOM supplies structure, the MPS supplies quantity and timing, and MRP joins them with inventory and lead time.
- Use the bearing netting example to show why gross need is not the same as the planned order quantity.
- End with the planning question: when one MPS line changes, how quickly can the team see every component and release-date impact?

## 6. Not Applicable - 101 Post

No AI tool claim is required. This is a foundational production-planning post.

## 7. Honesty Ledger

- No claim that every MPS change triggers a fixed number of component decisions.
- No claim that MPS + BOM directly create actual purchase orders or work orders.
- The pump, quantities, component usage, inventory, receipt, and week are illustrative.
- The visual omits lot sizing, yield/scrap, safety stock, work calendars, capacity constraints, sourcing rules, and multi-level version logic from the arithmetic example; these remain planning inputs, not card claims.
- ERP terminology differs. The visual uses the general term `PLANNED SUPPLY`.

## Sources

- [SAP - Bill of Material definition](https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/18ee18df146f46e9a7738186eebceaa7/f56eb953495bb44ce10000000a174cb4.html) - component structure, quantity, unit of measure, and planning uses. [High]
- [Microsoft Learn - Bills of materials and formulas](https://learn.microsoft.com/en-us/dynamics365/supply-chain/production-control/bill-of-material-bom) - BOM components, versions, validity, and planning context. [High]
- [Oracle - Overview of Material Requirements Planning](https://docs.oracle.com/cd/E26401_01/doc.122/e48795/T478564T478850.htm) - MRP inputs, gross-to-net explosion, lead-time offset, and planning recommendations. [High]
- [Oracle - Gross to Net Explosion](https://docs.oracle.com/cd/A60725_05/html/comnls/us/mrp/grossovr.htm) - assembly-to-component translation, inventory/receipt netting, and due-date offset. [High]
- [SAP - BOM Explosion and Determining Dependent Requirements](https://help.sap.com/docs/SAP_ERP/85d3fce10e264972a0155c8b46ecf93b/d2abce5314894208e10000000a174cb4.html) - dependent requirements inside the MRP planning run. [High]
- [Microsoft Learn - Explosion of a BOM version](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/master-plan-explosion-bom-version) - demand generated for BOM lines with site/warehouse context. [High]
- [Microsoft Learn - Production planning](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/production-planning) - planned production orders, BOM requirements, explosion analysis, and replanning behavior. [High]

