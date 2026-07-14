# AI for Supply Chain — Demand Review To Sequence Board

**Role:** S&OP Analyst working with a Production Planner  
**Tool:** Claude  
**Use case:** Turn a demand review dashboard into planner-verifiable sequence options that may reduce unnecessary changeover.

## Practical Workflow

1. Pull forecast vs actual by product family.
2. Add open orders, current plan, material notes, due dates, service priority, and planner comments.
3. Add known line constraints and changeover rules.
4. Ask Claude to produce a demand-to-sequence review board.
5. Review affected families, constraint checks, changeover risk, and 2-3 sequence options.
6. Validate materials, capacity, tooling, quality rules, frozen schedule windows, ERP/MES feasibility, and customer promise impact before any schedule change.

## Boundary / Human Decision Point

Claude structures the meeting artifact. The planner challenges the output, validates constraints, and translates the approved decision into ERP/MES.

## Output Files

- `linkedin-caption.md`
- `research-brief.md`
- `creative-brief-lite.md`
- `gpt-image-2-prompt.md`
- `visual.png`
