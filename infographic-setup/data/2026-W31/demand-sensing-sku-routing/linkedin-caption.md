# LinkedIn Caption - Demand Sensing SKU Routing

**Status:** approved by user on 2026-07-16
**Series:** AI for Supply Chain
**Episode:** Ep15
**Tool:** Claude
**Companion resource:** Demand Sensing Router Pack v1.2.0

## Selected Hook

A faster forecast cycle can create more planner activity without creating a better decision.

## Hook Options

1. **Selected / decision quality:** A faster forecast cycle can create more planner activity without creating a better decision.
2. **Misdiagnosis:** A volatile SKU does not automatically need demand sensing. It needs evidence that a fresher signal can still change a decision.
3. **Decision window:** If a demand signal arrives after the response window closes, faster forecasting is just faster reporting.
4. **Operating question:** The first demand-sensing question is not "which model?" It is "which SKU, which signal, which decision, and by when?"
5. **Portfolio policy:** Most SKU portfolios should not run on one forecast cadence. The hard part is proving which items earn a different one.
6. **Artifact first:** Claude is more useful in demand planning when it builds the routing board, change log, and exception pack, not another forecast summary.
7. **Three-lane model:** Three lanes are more honest than two: sense frequently, plan monthly, or send the item to special-method review.
8. **Method persistence:** If Claude needs the routing rules explained every week, you have a conversation, but you do not yet have an operating workflow.
9. **Trust gate:** If Claude cannot explain why a SKU changed lanes, the routing board is not ready for planner review.
10. **Meeting payoff:** What would change if your demand review started with only the SKUs that moved, failed a check, or still had an open decision?

## Final Caption QA

- [x] Final text is saved verbatim from the user's approval.
- [x] Hook leads with a practical planning distinction, not an AI feature.
- [x] The three routing lanes and their operating logic are explicit.
- [x] The worker split, rejection gate, and five review artifacts are visible.
- [x] Planner ownership of method, cadence, master data, and system changes is explicit.
- [x] The direct resource CTA uses the final production path.
- [x] No email, account, or newsletter gate is implied.

## Final Approved Caption

A faster forecast cycle can create more planner activity without creating a better decision.

You can use Claude to build it, to test whether a fresh signal exists, whether the response window is still open, and whether an operating decision can actually move.

For each SKU-location, the workflow reads demand history alongside recent order, POS, promotion, inventory, lead-time, service, lifecycle, and planner context. It then tests regularity, variability, volume and value, signal freshness, and the remaining response window.

From there, it recommends one of three lanes:
• SENSE FREQUENTLY when a fresh signal can still change replenishment, deployment, allocation, or production
• PLAN MONTHLY when the baseline cadence still fits the decision horizon
• SPECIAL METHOD / REVIEW when intermittent demand, lifecycle status, or weak evidence makes the choice less straightforward

Claude becomes useful here because the method does not need to be reconstructed in every conversation.

One worker profiles the demand, one applies the routing policy. A third tries to reject the recommendation when evidence is missing, stale, conflicting, or disconnected from an open decision.

The result is not another forecast summary. It is a review package:
• the current routing board
• a route-change log showing what moved and why
• data-quality and validation exceptions
• a demand-review brief focused on the decisions still open
• a run manifest showing which evidence and policy produced the output

The planner still approves the method, cadence, master data, and every system-of-record change. But the meeting can start with the SKUs that changed lanes, failed a check, or still have a decision worth discussing.

I have packaged the complete workflow with a four-page field guide, synthetic sample data, completed outputs, the reusable skill, and a one-command safe first run.

Download the free Demand Sensing Router Pack here - https://shettysdesk.vercel.app/resources/demand-sensing-router

---

Follow [**Poornajith Shetty**](https://www.linkedin.com/feed/#) and [**Shetty's Desk**](https://www.linkedin.com/feed/#) for more supply chain insights.
