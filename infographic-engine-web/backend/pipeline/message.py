"""
Message stage — Stage 2.
Story lock + generates 10 hook options.
Prompts adapted from: infographic-content-engine-v1/.claude/skills/message/SKILL.md
"""

import json
import logging
import os

import anthropic

import db

logger = logging.getLogger(__name__)

MESSAGE_SYSTEM_PROMPT = """You are the Message architect for Shetty's Desk — a supply chain intelligence content engine.

Your job is to lock the story and generate 10 hook options for the selected topic. The story must be a paradox or tension — never a simple fact statement.

AUDIENCE: VP Supply Chain, COO, Director of Operations. Decision-makers who dismiss content marketing. The hook must be worth 3 seconds of their scroll time.

HOOK TYPES:
- Stat-Lead: Opens with the most counterintuitive number
- Paradox: States a contradiction ("X increased while Y decreased")
- Contrarian: Challenges a widely held belief
- Timeline-Shock: "In [short period], [surprising result]"
- Comparison-Gap: "[A] does X. [B] does Y. The gap has [not changed / grown / shrunk]."

VOICE RULES (Shetty's Desk):
- No em dashes — restructure to periods
- No AI slop: no "leverage", "utilize", "delve", "moreover", "furthermore"
- Short punchy sentences
- Numbers embedded mid-sentence, not appended
- Personal, direct, specific

OUTPUT FORMAT: Produce a JSON object:
{
  "story_lock": {
    "paradox": "One sentence paradox/tension — 'The same X that made Y possible has made Z impossible/inevitable'",
    "viewer_feels": "specific reaction: disbelief | urgency | recognition of a trap | sudden clarity",
    "hero_number": "single most counterintuitive figure — not a range"
  },
  "opening_sentence": "2-3 sentence opening that states the paradox directly",
  "hooks": [
    {"position": 1, "hook_text": "Full hook sentence — Stat-Lead format"},
    {"position": 2, "hook_text": "Full hook sentence — Paradox format"},
    ...10 total hooks...
  ]
}

Generate exactly 10 hooks covering all 5 hook types (2 of each). Each hook is a complete, standalone first sentence."""


async def run_message(run_id: str, run: dict):
    """Run the Message stage — generates story lock + 10 hooks."""
    # Get prior stage outputs for context
    research_output = db.get_stage_output(run_id, "research")
    scout_output = db.get_stage_output(run_id, "scout")

    if not research_output:
        raise ValueError("Research output not found — run research stage first")

    candidates = db.get_topic_candidates(run_id)
    topic_index = run.get("selected_topic_index", 0)
    selected = next((c for c in candidates if c["position"] == topic_index + 1), {})

    logger.info(f"[Message] Starting for run {run_id}")

    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    user_message = f"""Topic: {run.get('slug', '')}
Message hypothesis from Scout: {selected.get('message_hypothesis', '')}

Research findings:
{research_output['output_md'][:4000]}

Lock the story and generate 10 hooks.
Return ONLY the JSON object, no other text."""

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=3000,
        system=MESSAGE_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )

    raw_json = response.content[0].text.strip()
    if raw_json.startswith("```"):
        raw_json = raw_json.split("```")[1]
        if raw_json.startswith("json"):
            raw_json = raw_json[4:]
    raw_json = raw_json.strip()

    message_data = json.loads(raw_json)

    # Save hooks to Supabase
    hooks = message_data.get("hooks", [])
    db.save_hook_candidates(run_id, hooks)

    # Build markdown output
    output_md = _build_message_markdown(run.get("slug", ""), message_data)
    db.save_stage_output(run_id, "message", output_md)

    logger.info(f"[Message] Complete — {len(hooks)} hooks generated")
    return message_data


def _build_message_markdown(slug: str, data: dict) -> str:
    story = data.get("story_lock", {})
    hooks = data.get("hooks", [])

    lines = [
        f"# Message Commit — {slug}",
        "",
        "## Story Lock",
        f"**Paradox:** {story.get('paradox', '')}",
        f"**Viewer feels:** {story.get('viewer_feels', '')}",
        f"**Hero number:** {story.get('hero_number', '')}",
        "",
        "## Opening Sentence",
        data.get("opening_sentence", ""),
        "",
        "## 10 Hook Options",
        "",
    ]

    for h in hooks:
        lines.append(f"{h['position']}. {h['hook_text']}")

    return "\n".join(lines)
