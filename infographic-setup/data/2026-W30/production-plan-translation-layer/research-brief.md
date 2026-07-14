# Research Brief — Production Plan Translation Layer

**Slug:** `production-plan-translation-layer`  
**Series:** Supply Chain 101  
**Status:** sourced concept brief for caption and visual

## Research Question

How should a Supply Chain 101 post explain the production plan in a way that helps readers distinguish demand input, constraint planning, production commitment, and detailed scheduling?

## Source Backbone

1. **Microsoft Learn — Master planning home page**  
   URL: https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/master-planning-home-page  
   Useful facts:
   - Master planning helps determine and balance future raw-material and capacity needs against goals.
   - It checks what raw materials and capacities are available and what will be required to complete production.
   - Planning uses that information to calculate requirements and generate planned orders.
   - Forecast planning supports longer-term planning of materials and capacity, while master planning is more short-term and current-order based.

2. **Microsoft Learn — Production process overview**  
   URL: https://learn.microsoft.com/en-us/dynamics365/supply-chain/production-control/production-process-overview  
   Useful facts:
   - The production lifecycle begins with a production order, batch order, or kanban and ends with a finished item ready for a customer or the next production phase.
   - Production orders are based on bills of materials and routes.
   - Production orders can be created from demand signals, including firmed planned orders, sales orders, pegged supply signals, and empty kanbans.
   - Scheduling can be rough operations scheduling or detailed job scheduling with dates, times, and assigned resources.
   - Release happens when the schedule is finished and material is available to be picked or prepared.

## Practical Interpretation

Production planning sits between the demand conversation and the factory execution conversation.

The demand side provides the pull:
- expected volume,
- order pressure,
- forecast changes,
- customer commitments,
- timing requirements.

The factory side introduces the constraints:
- available capacity,
- materials and components,
- labor and skills,
- tooling and line availability,
- routes and changeovers,
- quality or release readiness.

The production plan is the translation layer. It does not simply repeat the forecast. It decides what the factory should commit to build across a planning horizon after constraints are checked.

The detailed factory schedule is more granular. It decides what runs on which resource, in which sequence, and at what time.

## Non-Obvious Thesis

Most cross-functional planning conflict appears when people skip the translation layer.

Commercial teams ask for units. Demand planning provides the signal. Finance sees the revenue implication. Operations has to answer with capacity, materials, labor, sequence, and timing.

That is why a production plan is not just a schedule. It is the operating commitment created after demand is filtered through factory physics.

## Integrity Rules For This Post

- Do not invent statistics or benchmark percentages.
- Keep the on-image content conceptual and process-based.
- Separate production plan from detailed schedule.
- Avoid implying that demand always becomes production automatically.
- Make capacity, materials, labor, and changeover constraints visible as separate checks.
