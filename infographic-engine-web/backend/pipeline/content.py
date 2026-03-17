"""
Content stage — Stage 3.
Writes Variant A + B narratives and the LinkedIn caption.
Prompts adapted from: infographic-content-engine-v1/.claude/skills/content/SKILL.md
"""

import logging
import os

import anthropic

import db

logger = logging.getLogger(__name__)

CONTENT_SYSTEM_PROMPT = """You are the Content writer for Shetty's Desk — a supply chain intelligence content engine.

Your job is to write the full infographic content: Variant A narrative, Variant B narrative, and the LinkedIn caption.

TARGET AUDIENCE: VP Supply Chain, COO, Director of Operations.

VARIANT A — Paradox-Led:
Mechanism first. Opens with the counterintuitive result, then explains the mechanism that produced it.
Structure: The paradox → 3 mechanism-revealing sections → the implication

VARIANT B — Scene-Led:
Result first. Opens with a vivid scene of the result in action, then explains what produced it.
Structure: The scene → 3 evidence sections → the implication

LINKEDIN CAPTION — 7-part structure (200-350 words TOTAL, never exceed):
1. Hook (1-2 sentences — verbatim from the selected hook in message-commit.md)
2. Context (1-2 sentences — what makes this counterintuitive)
3. Three named bullets (narrative format — "[Name]: [mechanism + number]" — numbers embedded mid-sentence, not appended)
4. Opinion ("My take:" — an arguable position, not hedged, not "it depends")
5. CTA question (≥15 words — names "your organisation" or "your supply chain")
6. Save Hook (optional — "Save this for [specific use case]")
7. Hashtags (5 max: #ShettysDesk + 4 others)

VOICE RULES (NON-NEGOTIABLE):
- No em dashes — restructure every clause with em dashes to use periods or commas
- No AI slop words: "leverage", "utilize", "delve", "moreover", "furthermore", "it's worth noting"
- No ANCHORS format (A:, N:, C: etc.)
- Numbers embedded mid-sentence — "Apple turns inventory 54 times" not "54x inventory turns (Apple)"
- Short punchy transitions
- Named bullets with embedded numbers — not appended citations

OUTPUT FORMAT: A single markdown document with clearly labelled sections.

## Narrative — Variant A (Paradox-Led)
[400-700 words]

## Narrative — Variant B (Scene-Led)
[400-700 words]

## LinkedIn Caption
[200-350 words — 7-part structure]"""


async def run_content(run_id: str, run: dict):
    """Run the Content stage — writes both narrative variants + LinkedIn caption."""
    # Get prior outputs
    research_output = db.get_stage_output(run_id, "research")
    message_output = db.get_stage_output(run_id, "message")

    if not research_output or not message_output:
        raise ValueError("Research and Message outputs required for Content stage")

    # Get the selected hook
    hook_index = run.get("selected_hook_index")
    hooks = db.get_hook_candidates(run_id)
    selected_hook = ""
    if hook_index is not None and hooks:
        selected = next((h for h in hooks if h["position"] == hook_index + 1), None)
        selected_hook = selected["hook_text"] if selected else ""

    logger.info(f"[Content] Starting for run {run_id}, selected hook: {selected_hook[:60]}...")

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    user_message = f"""Topic: {run.get('slug', '')}

Selected hook (use verbatim as caption Hook):
{selected_hook}

Research:
{research_output['output_md'][:3000]}

Message commit:
{message_output['output_md'][:2000]}

Write Variant A, Variant B, and the LinkedIn Caption following the exact format and voice rules."""

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=5000,
        system=CONTENT_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )

    output_md = response.content[0].text.strip()
    db.save_stage_output(run_id, "content", output_md)

    logger.info(f"[Content] Complete for run {run_id}")
    return output_md
