"""
Scout stage — Stage 0.
Runs the LinkedIn Signal Scan + generates 10 topic candidates (5 Trending + 5 Evergreen).
Prompts extracted from: infographic-content-engine-v1/.claude/skills/scout/SKILL.md
"""

import json
import logging
import os
from datetime import datetime

import anthropic
from firecrawl import FirecrawlApp

import db

logger = logging.getLogger(__name__)

# Firecrawl client (LinkedIn signal scan)
_firecrawl: FirecrawlApp | None = None


def get_firecrawl() -> FirecrawlApp:
    global _firecrawl
    if _firecrawl is None:
        _firecrawl = FirecrawlApp(api_key=os.environ["FIRECRAWL_API_KEY"])
    return _firecrawl


SCOUT_SYSTEM_PROMPT = """You are the Scout for Shetty's Desk — an infographic content engine producing weekly LinkedIn supply chain content for VP Supply Chain, Director of Operations, and COO personas (decision-makers with P&L accountability managing $100M–$1B inventory or operations).

Your job is to surface 10 supply chain topic candidates: 5 Trending (time-sensitive) and 5 Evergreen Gold Mines (timeless operational excellence). Equal weight — no automatic recommendation hierarchy. Editorial pick is a human decision.

TARGET AUDIENCE: VP Supply Chain, Director of Demand Planning, Director of Operations, COO. They have seen vendor decks. They dismiss content marketing. Topics must have real stakes, real data, and a decision implication.

VOICE: Shetty's Desk. Supply chain intelligence. No buzzwords. No marketing language.

OUTPUT FORMAT: Produce a structured JSON object with this exact schema:
{
  "signal_summary": "3-5 sentence overview of dominant supply chain signals this week",
  "trending_signals": [
    {
      "pattern": "reverse-engineered post pattern",
      "topic_area": "topic area",
      "hook_type": "Stat-Lead | Paradox | Contrarian | Timeline-Shock | Comparison-Gap",
      "why_working": "engagement driver"
    }
  ],
  "evergreen_signals": [
    {
      "pattern": "circulating pattern",
      "topic_area": "topic area",
      "format": "carousel | infographic",
      "why_saved": "reuse intent driver"
    }
  ],
  "candidates": [
    {
      "position": 1,
      "slug": "url-safe-slug",
      "title": "Headline ≤12 words",
      "hook_candidate": "One surprising stat or contrarian claim",
      "message_hypothesis": "One sentence paradox/tension — the same X that made Y possible has made Z impossible/inevitable",
      "trend_type": "trending | evergreen",
      "tier": 1,
      "is_shortlist": false,
      "why_this_week": "what makes this time-sensitive (Tier 1) or gold mine rationale (Tier 2)",
      "sources": "Source 1, Source 2, Source 3",
      "novelty_delta": "This differs from [nearest existing infographic] because..."
    }
  ]
}

Candidates 1-5 are Tier 1 (Trending): positions 1-2 are full-depth, 3-5 are shortlist (is_shortlist: true).
Candidates 6-10 are Tier 2 (Evergreen Gold Mines): positions 6-7 are full-depth, 8-10 are shortlist.

EVERGREEN GOLD MINE CRITERIA (Tier 2 must satisfy at least one):
1. Under-documented excellence — exceptional supply chain performance not widely covered on LinkedIn
2. Manual outperforms tech — low-tech system delivering better performance than modern equivalents
3. Impossible number — throughput/error rate/efficiency figure so extreme it creates genuine disbelief
4. Cross-industry transfer — supply chain principle from unexpected industry/era directly applicable today
5. Company strategic pivot — Fortune 500 where supply chain is CENTRAL to the pivot, with clear mechanism

NOVELTY CHECK: Avoid direct clones of existing infographics. Confirm each candidate is genuinely different."""


async def run_scout(run_id: str, run: dict):
    """
    Run the Scout stage:
    1. LinkedIn Signal Scan via Firecrawl
    2. Claude API call to generate 10 topic candidates
    3. Save candidates to Supabase
    4. Save markdown output to stage_outputs
    """
    week = run["week"]
    logger.info(f"[Scout] Starting for run {run_id}, week {week}")

    # ── Step 1: LinkedIn Signal Scan ──────────────────────────
    trending_snippets = []
    evergreen_snippets = []

    try:
        fc = get_firecrawl()

        # Search 1: Trending (last 7 days)
        trending_results = fc.search(
            "supply chain logistics procurement linkedin posts trending 2026",
            limit=15
        )
        trending_snippets = [r.get("description", "") for r in (trending_results or [])]

        # Search 2: Evergreen (last 4-8 weeks)
        evergreen_results = fc.search(
            "supply chain best performing saved framework benchmark infographic linkedin",
            limit=15
        )
        evergreen_snippets = [r.get("description", "") for r in (evergreen_results or [])]

        logger.info(f"[Scout] LinkedIn scan: {len(trending_snippets)} trending + {len(evergreen_snippets)} evergreen snippets")

    except Exception as e:
        logger.warning(f"[Scout] LinkedIn scan failed (continuing without signal data): {e}")
        trending_snippets = ["Signal scan unavailable — use general supply chain knowledge"]
        evergreen_snippets = ["Signal scan unavailable — use general supply chain knowledge"]

    # ── Step 2: Claude API call ────────────────────────────────
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    user_message = f"""Today's date: {datetime.now().strftime('%Y-%m-%d')} (Week: {week})

LinkedIn Signal Scan Results:

TRENDING SIGNALS (last 7 days):
{chr(10).join(f'- {s}' for s in trending_snippets[:10] if s)}

EVERGREEN SIGNALS (last 4-8 weeks):
{chr(10).join(f'- {s}' for s in evergreen_snippets[:10] if s)}

Generate 10 topic candidates as JSON following the exact schema specified. Ensure:
- Exactly 5 Tier 1 (positions 1-5, trending) and 5 Tier 2 (positions 6-10, evergreen)
- positions 1-2 and 6-7 are full-depth (is_shortlist: false)
- positions 3-5 and 8-10 are shortlist (is_shortlist: true)
- All candidates span at least 3 signal domains
- At least 1 geopolitics signal and 1 government/policy signal
- Each message_hypothesis uses paradox/tension format
- Return ONLY the JSON object, no other text"""

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=8192,
        system=SCOUT_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )

    raw_json = response.content[0].text.strip()

    # Strip markdown code fences if Claude wrapped the JSON
    if raw_json.startswith("```"):
        raw_json = raw_json.split("```")[1]
        if raw_json.startswith("json"):
            raw_json = raw_json[4:]
    raw_json = raw_json.strip()

    scout_data = json.loads(raw_json)

    # ── Step 3: Save candidates to Supabase ───────────────────
    candidates = scout_data.get("candidates", [])
    db.save_topic_candidates(run_id, candidates)

    # ── Step 4: Build markdown output + save ──────────────────
    md_output = _build_scout_markdown(week, scout_data, candidates)
    db.save_stage_output(run_id, "scout", md_output)

    logger.info(f"[Scout] Complete — {len(candidates)} candidates saved")
    return scout_data


def _build_scout_markdown(week: str, data: dict, candidates: list) -> str:
    """Convert scout JSON data to the familiar markdown format."""
    lines = [
        f"# Topic Scout — {week}",
        "",
        "## LinkedIn Signal Scan",
        "",
        f"**Signal Summary:** {data.get('signal_summary', '')}",
        "",
        "### Trending Signals",
        "| Pattern | Topic Area | Hook Type | Why it's working |",
        "|---------|------------|-----------|------------------|",
    ]

    for ts in data.get("trending_signals", []):
        lines.append(f"| {ts.get('pattern','')} | {ts.get('topic_area','')} | {ts.get('hook_type','')} | {ts.get('why_working','')} |")

    lines += [
        "",
        "### Evergreen Signals",
        "| Pattern | Topic Area | Format | Why it keeps getting saved |",
        "|---------|------------|--------|---------------------------|",
    ]

    for es in data.get("evergreen_signals", []):
        lines.append(f"| {es.get('pattern','')} | {es.get('topic_area','')} | {es.get('format','')} | {es.get('why_saved','')} |")

    lines += ["", "---", "", "## Candidates", ""]

    tier1 = [c for c in candidates if c.get("tier") == 1]
    tier2 = [c for c in candidates if c.get("tier") == 2]

    lines.append("### Tier 1 — Trending (5 candidates)")
    for c in tier1:
        tag = " [SHORTLIST]" if c.get("is_shortlist") else ""
        lines += [
            f"",
            f"**{c['position']}. {c['slug']}**{tag} — {c.get('title', '')}",
            f"- Hook: {c.get('hook_candidate', '')}",
            f"- Why this week: {c.get('why_this_week', '')}",
            f"- Sources: {c.get('sources', '')}",
            f"- Novelty delta: {c.get('novelty_delta', '')}",
        ]

    lines += ["", "### Tier 2 — Evergreen Gold Mines (5 candidates)"]
    for c in tier2:
        tag = " [SHORTLIST]" if c.get("is_shortlist") else ""
        lines += [
            f"",
            f"**{c['position']}. {c['slug']}**{tag} — {c.get('title', '')}",
            f"- Hook: {c.get('hook_candidate', '')}",
            f"- Gold mine rationale: {c.get('why_this_week', '')}",
            f"- Sources: {c.get('sources', '')}",
            f"- Novelty delta: {c.get('novelty_delta', '')}",
        ]

    return "\n".join(lines)
