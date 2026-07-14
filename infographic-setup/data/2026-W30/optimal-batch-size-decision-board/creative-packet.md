# Creative Packet — `optimal-batch-size-decision-board`

**Purpose:** minimal context for GPT Image 2 rendering and output QA. Use this packet instead of reopening the whole calendar, Top-100 workbook, or long planning docs unless the topic itself changes.

## Audience Payoff

- **Reader:** supply planners, production planners, inventory planners, operations managers, and S&OP analysts
- **Job:** make a better decision
- **After reading:** use ChatGPT to turn batch-size math into a planner-reviewable trade-off board before changing the plan or master data
- **Work moment:** production planning review, inventory review, MOQ challenge, master-data change request, or S&OP supply review

## Stop-Scroll And Save Reason

- **Opening claim:** ChatGPT is more useful for batch size when you ask it to build the trade-off board, not just return the EOQ number.
- **Why they stop:** it names a familiar planning trap: a formula can give a neat answer while the real factory decision depends on setup, inventory, capacity, service, and assumptions
- **Save trigger:** formula / decision rule / checklist
- **Reusable artifact:** Production Planning Batch-Size Decision Board
- **Value-density layer:** six useful modules: input pack with real data fields; EOQ formula core; cost-curve trade-off showing setup cost down and holding cost up; three differentiated batch options; trade-off check across changeover load, inventory exposure, capacity fit, and service risk; planner verification strip

## Holy Grail Fit

- **Candidate:** no
- **Fit:** this is a flagship AI-for-SC planning artifact that should feel useful before a batch-size or production-planning review
- **Operating artifact:** a batch-size decision board / EOQ trade-off review pack
- **Meeting moment:** a supply planner is asked whether the batch size should change after demand, setup cost, holding cost, capacity, or service assumptions move
- **Supply-chain scene:** luminous white and pale-blue production-planning desk with small SKU pallets, batch tokens, a factory-line miniature, a calculator-like formula panel, subtle inventory shelf props, and a restrained ChatGPT/OpenAI chip built into the board
- **Content backbone:** EOQ formula, setup/order cost vs holding cost trade-off, current batch vs smaller/larger options, MOQ, shelf life, capacity calendar, service risk, ERP/MES verification, and planner sign-off
- **Module map:** 1 INPUT PACK = compact data tiles for DEMAND RATE, SETUP COST, HOLDING COST, CURRENT BATCH, MOQ; 2 EOQ CORE = large formula plate that draws `EOQ =` followed by a square-root radical over a stacked fraction (`2DS` numerator, `H` denominator), plus variable legend; 3 COST CURVE = tactile curve with SETUP COST DOWN, HOLDING COST UP, TOTAL COST TROUGH; 4 BATCH OPTIONS = three physical lanes: SMALLER BATCH, CURRENT BATCH, LARGER BATCH with distinct batch-token sizes; 5 TRADE-OFF CHECK = four rows for CHANGEOVER LOAD, INVENTORY EXPOSURE, CAPACITY FIT, SERVICE RISK with coral/green status cues; 6 VERIFY = bottom planner strip for MOQ, SHELF LIFE, CAPACITY, SERVICE, PLANNER SIGN-OFF; 7 CHATGPT = small tool chip connected to the formula core, not a headline or endorsement
- **Text lock:** use only the exact heading, subheading, labels, bottom question, and footer; no invented percentages, savings claims, optimization scores, source line, side slogans, or fake system names
- **Logo plan:** reserve a clean lower placard for exact `renderer/assets/logos/shettys-desk-logo-2.png`, centered and slightly lower with safe top/bottom padding; reserve a small transparent/glass ChatGPT tool chip near the formula core with a blank icon slot for deterministic `renderer/assets/logos/openai.svg` overlay; both zones must feel authored into the scene, not pasted on top

## Top-100 Adaptation

- **Power format:** PF3 formula card + PF6 decision test/tree + AI workflow card
- **Caption index refs:** refs 5, 7, 25, 51, 70, 76
- **Structure lesson:** borrow Ref 5's complete formula-card utility, Ref 7's decision-model table discipline, Ref 25's metric density, Ref 51 and Ref 70's AI workflow practicality, and Ref 76's structured assessment feel
- **Caption lesson:** open with the practical gap between formula answer and planning decision, then show the AI-assisted artifact the planner can build
- **Craft lesson:** Holy Grail artifact-first premium 3D/isometric scene, but with a fresh architecture: luminous white/pale-blue field, deep navy and bright azure title hierarchy, glass board, precise cost curve, navy/azure option lanes, coral only for risk/exposure, eco-green only for verified/protected flow, and deterministic logo finishing
- **Reference card GPT lesson:** create a premium formula-to-decision artifact where the EOQ math is visible but subordinate to the practical planning trade-off board
- **Visual mechanics:** large formula/test block, variable legend, cost-curve trough, option comparison lanes, interpretation band, verification strip, two-tone title, precise grid, and useful micro-labels

## Creative USP

- **Beats generic because:** most EOQ visuals stop at the formula; this one turns the calculation into a meeting-ready decision artifact with inputs, cost curve, options, trade-offs, and verification
- **Shetty's Desk angle:** it keeps the operational reality visible: the formula starts the conversation, but the planner owns the trade-off between setup, inventory, capacity, and service

## Exact Text

- **Heading:** BATCH SIZE DECISION BOARD
- **Subheading:** Use EOQ as the start, then stress-test the trade-off.
- **Labels:** INPUT PACK | DEMAND RATE | SETUP COST | HOLDING COST | CURRENT BATCH | MOQ | EOQ CORE | EOQ = | 2DS | H | D = demand | S = setup cost | H = holding cost | COST CURVE | SETUP COST DOWN | HOLDING COST UP | TOTAL COST TROUGH | BATCH OPTIONS | SMALLER BATCH | CURRENT BATCH | LARGER BATCH | TRADE-OFF CHECK | CHANGEOVER LOAD | INVENTORY EXPOSURE | CAPACITY FIT | SERVICE RISK | VERIFY | MOQ | SHELF LIFE | CAPACITY | SERVICE | PLANNER SIGN-OFF | CHATGPT
- **Formula notation:** render EOQ as `EOQ =` followed by a square-root radical over a stacked fraction with `2DS` as numerator and `H` as denominator; do not print calculator syntax or bracketed notation instructions.
- **Text placement map:** Title zone at the top with BATCH SIZE in deep navy and DECISION BOARD in bright azure, matching the SC OS / Production Plan title hierarchy without copying their layout. Top-left input zone uses INPUT PACK with DEMAND RATE, SETUP COST, HOLDING COST, CURRENT BATCH, and MOQ as compact data tiles. Center hero uses EOQ CORE and the formula drawn as `EOQ =` followed by a square-root radical over a stacked fraction (`2DS` numerator, `H` denominator), with D = demand, S = setup cost, H = holding cost as the only variable legend. Center-lower curve zone uses COST CURVE with SETUP COST DOWN, HOLDING COST UP, and TOTAL COST TROUGH anchored to the actual lines/trough. Right option zone uses BATCH OPTIONS with SMALLER BATCH, CURRENT BATCH, and LARGER BATCH as three visually different lanes. Trade-off zone uses TRADE-OFF CHECK with CHANGEOVER LOAD, INVENTORY EXPOSURE, CAPACITY FIT, and SERVICE RISK as row labels, not decorative icons. Bottom verification strip uses VERIFY, MOQ, SHELF LIFE, CAPACITY, SERVICE, and PLANNER SIGN-OFF only. CHATGPT appears once in a small integrated tool chip near the EOQ core with a blank inset icon slot for deterministic OpenAI logo overlay. Footer zone uses a clean lower placard that can receive the exact Shetty's Desk logo after post-production.
- **Bottom question:** Which cost is really driving the batch size?
- **Footer:** centered Shetty's Desk logo only; no source line, no review loop, no extra caption text
- **Numbers/data:** sourced formula + conceptual labels; no invented statistics
- **Logo/asset references:** `renderer/assets/logos/shettys-desk-logo-2.png`; `renderer/assets/logos/openai.svg`

## Text Placement Discipline

Use each supplied text string only in its intended home from TEXT PLACEMENT MAP. Do not turn allowed labels into standalone side tabs, rail labels, band headers, duplicate badges, repeated workflow labels, or extra navigation. If the layout needs a cue, use symbols, ticks, lines, arrows, empty cells, or icons instead of new words.

## Render Instruction

show a ChatGPT-assisted production-planning batch-size board where EOQ feeds a cost-curve trough and three batch options, then lands on inventory, capacity, service, and planner verification before any system change

## Value Density

six useful modules: input pack with real data fields; EOQ formula core; cost-curve trade-off showing setup cost down and holding cost up; three differentiated batch options; trade-off check across changeover load, inventory exposure, capacity fit, and service risk; planner verification strip

## Logo And Asset Inserts

Use these repo assets as reference/insert inputs during GPT Image 2 iteration: `renderer/assets/logos/shettys-desk-logo-2.png`; `renderer/assets/logos/openai.svg`. For the Shetty's Desk logo, reserve a clean uncluttered footer logo zone that can receive the exact logo asset after generation; do not invent, redraw, clip, box, or approximate the wordmark. When a named AI tool appears in the visual, use the supplied tool logo/symbol asset as a small interface or workflow cue in its intended zone. Keep tool symbols smaller than their text labels. Do not create fake partner/customer/vendor marks.

## Creative Direction

Use GPT Image 2 as the premium creative renderer, not as a dashboard generator. Build one memorable editorial artifact that feels designed, useful, and ownable at LinkedIn feed size. The reader should want to save it because it looks like a practical tool for production planning review, inventory review, MOQ challenge, master-data change request, or S&OP supply review, not because it is decorative.

## Image Engine Intent

Give the image engine room to compose a visually forward editorial object. Prioritize hierarchy, depth, texture, rhythm, and reference-led craft over literal boxes. The structure must remain clear, but the rendering can use high-craft visual micro-detail: grid tension, ledger ticks, structural arrows, callout rails, layered paper depth, exact spacing, subtle technical marks, purposeful empty space, and one striking hero artifact. Make it feel like a world-class saved reference from a specialist creator, not a templated corporate slide.

## Composition Freedom

Do not follow a rigid HTML layout. Keep the exact text locked, but choose the strongest composition for the artifact: asymmetric grid, layered matrix, annotated system object, ranked index, decision loop, formula card, or structural metaphor, whichever best expresses formula-to-trade-off decision board. Make the reference intelligence visible through the composition, not through copied styling.

## Post-Production Plan

reserve a clean lower placard for exact `renderer/assets/logos/shettys-desk-logo-2.png`, centered and slightly lower with safe top/bottom padding; reserve a small transparent/glass ChatGPT tool chip near the formula core with a blank icon slot for deterministic `renderer/assets/logos/openai.svg` overlay; both zones must feel authored into the scene, not pasted on top Text lock note: use only the exact heading, subheading, labels, bottom question, and footer; no invented percentages, savings claims, optimization scores, source line, side slogans, or fake system names Preserve the winning camera angle, 3D/isometric depth, desk props, shadows, and composition during cleanup. Remove only explicitly requested chips, source lines, or footer elements.

## QA Gate

- Feed-size reader instantly sees the dominant shape: formula-to-trade-off decision board
- The visual contains the reusable artifact, not only decoration.
- For Holy Grail candidates, the render must feel comparable in ambition to `data/2026-W28/supply-chain-resilience-os/visual.png`.
- Cleanup must preserve the winning angle, 3D/isometric depth, shadows, desk props, and composition.
- On-image text uses only the exact strings above.
- Text/data integrity must score 5/5 before publish.
- Every creative score must be at least 4/5; world-class target is 5/5.
