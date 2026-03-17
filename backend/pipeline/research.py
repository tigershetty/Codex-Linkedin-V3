"""
Research stage — Stage 1.
Citation-grade evidence gathering for the selected topic.
Prompts adapted from: infographic-content-engine-v1/.claude/skills/research/SKILL.md
"""

import logging
import os

import anthropic

import db

logger = logging.getLogger(__name__)

RESEARCH_SYSTEM_PROMPT = """You are the Research specialist for Shetty's Desk — a supply chain intelligence content engine.

Your job is to gather citation-grade evidence for a specific supply chain topic, producing content that a VP Supply Chain, COO, or Director of Operations would find credible and decision-relevant.

OUTPUT FORMAT: Produce a detailed research markdown document with these sections:

## Research — [slug]

### Evidence Ledger
Ordered by audience impact (most surprising/decision-relevant first). Each piece of evidence must include:
- The specific number or finding
- The source organisation
- Why it matters to a VP Supply Chain decision-maker

### Business Case Mechanisms
The chain of causation (Why → How → Result) for the 2-3 strongest pieces of evidence.
Format: [Cause] → [Mechanism] → [Measurable result]

### Hero Number Candidates
3 specific figures from the evidence ledger, ordered by counterintuitiveness.
The hero number will become the centrepiece of the infographic.

### Source Quality Assessment
Rate each source: Primary (official data) / Secondary (analysis) / Tertiary (commentary)
Flag any sources that require PDF upload.

### Key Tensions
The paradox or tension in this topic that a VP Supply Chain would find thought-provoking.
Format: "The same [X] that made [Y] possible has made [Z] impossible/inevitable."

STANDARDS:
- Every claim must have a specific number or verifiable fact
- No generalisations without data
- Prioritise counterintuitive findings over conventional wisdom
- Audience has seen McKinsey decks — only include evidence that would make them pause"""


async def run_research(run_id: str, run: dict):
    """Run the Research stage for the selected topic."""
    # Get the selected topic
    topic_index = run.get("selected_topic_index")
    if topic_index is None:
        raise ValueError("No topic selected — CG1 not completed")

    candidates = db.get_topic_candidates(run_id)
    if not candidates:
        raise ValueError("No topic candidates found in database")

    selected = next((c for c in candidates if c["position"] == topic_index + 1), None)
    if not selected:
        raise ValueError(f"Topic at position {topic_index + 1} not found")

    # Get scout output for context
    scout_output = db.get_stage_output(run_id, "scout")
    scout_context = scout_output["output_md"] if scout_output else ""

    logger.info(f"[Research] Starting for run {run_id}, topic: {selected['slug']}")

    # Update run slug to the selected topic
    db.update_run_state(run_id, "RESEARCH_RUNNING",
                        slug=selected["slug"])

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    user_message = f"""Research topic: {selected['slug']}
Title: {selected.get('title', '')}
Hook candidate: {selected.get('hook_candidate', '')}
Message hypothesis: {selected.get('message_hypothesis', '')}
Why this week: {selected.get('why_this_week', '')}
Sources to prioritise: {selected.get('sources', '')}

Scout context:
{scout_context[:2000]}

Conduct citation-grade research on this topic. Focus on:
1. The specific numbers and mechanisms behind the hook candidate
2. Evidence that validates or challenges the message hypothesis
3. The strongest counterintuitive finding that could be the hero number

Produce the full research document following the format specified."""

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=6000,
        system=RESEARCH_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )

    output_md = response.content[0].text.strip()
    db.save_stage_output(run_id, "research", output_md)

    logger.info(f"[Research] Complete for run {run_id}")
    return output_md
