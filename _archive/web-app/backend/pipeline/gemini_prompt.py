"""
Gemini Prompt stage — Stage 4.
Assembles paste-ready prompts for Gemini gem image generation.
Prompts adapted from: infographic-content-engine-v1/.claude/skills/gemini-prompt/SKILL.md
"""

import logging
import os

import anthropic

import db

logger = logging.getLogger(__name__)

# Visual DNA string — from infographic-visual-dna.md (v1, do not modify ad-hoc)
STYLE_DNA_STRING = (
    "Deep ocean blue background (dark marine to cobalt gradient). Soft 3D gradient "
    "illustration style — volumetric rounded objects, lighter gradient on top surfaces, "
    "deeper blue-teal on sides, no hard outlines. Electric cyan highlights on mechanical "
    "elements. Cinematic depth, volumetric light from above. Tiny human figures for "
    "scale. Clean white sans-serif callout text on dark blue background."
)

STANDARD_NEGATIVE_PROMPT = (
    "NEGATIVE: text errors, garbled numbers, illegible text, white background, "
    "grey background, photorealistic elements, maritime theme, ocean, underwater, "
    "oil platform, submarine, cartoon style, cluttered layout, small unreadable "
    "text, low contrast, spec annotations, font names, pixel values"
)

GEMINI_PROMPT_SYSTEM = """You are the Gemini Prompt assembler for Shetty's Desk.

Your job is to transform the content narratives into two paste-ready prompts for a Gemini gem image generator.

Each prompt follows this exact format:
```
Task: Create an infographic image for the summary below (after the rules).

Rules: Use the image attached as a reference on style, aesthetics, colours, and illustration technique. Use a different layout for the structure to elaborate details based on the summary. Do not use any information or text from the attached image — only style. Use it only for inspiration. Aspect ratio 1:1, resolution 2048×2048.

[STYLE DNA STRING — prepended verbatim]

[NARRATIVE SUMMARY — 400-700 words of the variant narrative, adapted for visual scene descriptions]

[NEGATIVE PROMPT BLOCK]
```

For the narrative summary section:
- Translate each story section into a VISUAL SCENE DESCRIPTION
- Describe what objects, people, numbers, and layouts should appear in each zone
- Use the semantic icon vocabulary (green upward arrows = growth, crimson walls = barriers, etc.)
- Choose the correct layout template based on topic type (see layout routing table)
- Rich contextual sentences produce better callout boxes than sparse labels

LAYOUT ROUTING TABLE:
- Company Strategic Pivot → Comparison (three-panel): LEFT Pre-Pivot | CENTER Mechanism | RIGHT New Model
- Before/After → Comparison (two-panel): LEFT Before | RIGHT After
- How-It-Works/Process → Process Flow: STEP 1 → STEP 2 → STEP 3 → OUTCOME
- Mechanism/Root Cause → Hub/Spoke: CENTER HUB + surrounding nodes
- Strategic Framework → Framework 2x2
- Data Story → Statistical: HERO STAT dominant + 3 supporting panels
- Timeline → Timeline: BAND 1 → BAND 2 → BAND 3 → BAND 4
- Contrarian/Myth-Bust → Myth/Reality: LEFT MYTH | RIGHT REALITY

OUTPUT FORMAT: A markdown document with two clearly labelled prompt blocks:

## Gemini Prompt — Variant A (Paradox-Led)
[Full paste-ready prompt for Variant A]

## Gemini Prompt — Variant B (Scene-Led)
[Full paste-ready prompt for Variant B]

## Calibration Check
3-point quality checklist to run after each Gemini render:
- [ ] Background is deep blue (fail = white or grey background appeared)
- [ ] Text is readable and no spec annotations leaked into the image
- [ ] Hero number [X] rendered correctly (fail = digit garbling)"""


async def run_gemini_prompt(run_id: str, run: dict):
    """Run the Gemini Prompt stage — assembles paste-ready Gemini prompts."""
    content_output = db.get_stage_output(run_id, "content")
    message_output = db.get_stage_output(run_id, "message")

    if not content_output:
        raise ValueError("Content output required for Gemini Prompt stage")

    logger.info(f"[GeminiPrompt] Starting for run {run_id}")

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    user_message = f"""Topic: {run.get('slug', '')}

Style DNA String (prepend verbatim to every prompt):
{STYLE_DNA_STRING}

Standard Negative Prompt (append to every prompt):
{STANDARD_NEGATIVE_PROMPT}

Message commit (for hero number and story context):
{message_output['output_md'][:1500] if message_output else ''}

Content (Variant A and B narratives + LinkedIn caption):
{content_output['output_md'][:4000]}

Assemble the two Gemini prompts following the exact format and layout routing rules."""

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=4000,
        system=GEMINI_PROMPT_SYSTEM,
        messages=[{"role": "user", "content": user_message}]
    )

    output_md = response.content[0].text.strip()
    db.save_stage_output(run_id, "gemini_prompt", output_md)

    logger.info(f"[GeminiPrompt] Complete for run {run_id}")
    return output_md
