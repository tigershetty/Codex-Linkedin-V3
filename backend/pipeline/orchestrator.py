"""
Pipeline orchestrator.
Runs pipeline stages in sequence, saves state to Supabase at each step.
Stages pause at control gates (CG1, CG2) and wait for user input via the API.
"""

import asyncio
import logging
from datetime import datetime, UTC

import db
import alerts
from pipeline import scout, research, message, content, gemini_prompt

logger = logging.getLogger(__name__)


async def run_stage(run_id: str, stage_name: str, stage_fn, *args, **kwargs):
    """
    Run a single pipeline stage with error handling and state persistence.
    Sets state to {STAGE}_RUNNING, calls the function, saves output, advances state.
    On error: sets state to {STAGE}_FAILED and sends alert.
    """
    run = db.get_run(run_id)
    if not run:
        raise ValueError(f"Run {run_id} not found")

    running_state = f"{stage_name.upper()}_RUNNING"
    db.update_run_state(run_id, running_state)

    try:
        result = await asyncio.wait_for(
            stage_fn(run_id, run, *args, **kwargs),
            timeout=float(__import__("os").getenv("STAGE_TIMEOUT_SECONDS", "300"))
        )
        return result
    except asyncio.TimeoutError:
        error = f"Stage {stage_name} timed out after {__import__('os').getenv('STAGE_TIMEOUT_SECONDS', '300')} seconds"
        logger.error(f"[Run {run_id}] {error}")
        db.set_run_error(run_id, stage_name.upper(), error)
        alerts.send_stage_failure_alert(run_id, stage_name, error, run.get("week", ""), run.get("slug", ""))
        raise
    except Exception as e:
        error = str(e)
        logger.exception(f"[Run {run_id}] Stage {stage_name} failed: {error}")
        db.set_run_error(run_id, stage_name.upper(), error)
        alerts.send_stage_failure_alert(run_id, stage_name, error, run.get("week", ""), run.get("slug", ""))
        raise


async def start_scout(run_id: str):
    """Stage 0: Run Scout — generates 10 topic candidates, then pauses at CG1."""
    await run_stage(run_id, "scout", scout.run_scout)
    db.update_run_state(run_id, "CG1_PENDING")
    run = db.get_run(run_id)
    alerts.send_gate_notification("CG1", run_id, run.get("week", ""), run.get("slug", ""))
    logger.info(f"[Run {run_id}] Scout complete — waiting at CG1")


async def advance_after_cg1(run_id: str):
    """After user selects a topic at CG1, run Research and Message, then pause at CG2."""
    # Research
    await run_stage(run_id, "research", research.run_research)
    db.update_run_state(run_id, "RESEARCH_COMPLETE")

    # Message (generates 10 hooks)
    await run_stage(run_id, "message", message.run_message)
    db.update_run_state(run_id, "CG2_PENDING")

    run = db.get_run(run_id)
    alerts.send_gate_notification("CG2", run_id, run.get("week", ""), run.get("slug", ""))
    logger.info(f"[Run {run_id}] Message complete — waiting at CG2")


async def advance_after_cg2(run_id: str):
    """After user selects a hook at CG2, run Content and Gemini Prompt."""
    # Content (Variant A + B + LinkedIn caption)
    await run_stage(run_id, "content", content.run_content)
    db.update_run_state(run_id, "CONTENT_COMPLETE")

    # Gemini Prompt (generates paste-ready prompts)
    await run_stage(run_id, "gemini_prompt", gemini_prompt.run_gemini_prompt)

    # Phase 1: image gen is manual — move to DRAFT_READY immediately after prompt
    # (user will generate image in Gemini gem and upload PNG via the dashboard)
    db.update_run_state(run_id, "DRAFT_READY")
    logger.info(f"[Run {run_id}] Pipeline complete — draft ready for review")


async def retry_stage(run_id: str, stage_name: str):
    """Retry a failed stage. Maps stage name to the correct advance function."""
    run = db.get_run(run_id)
    if not run:
        raise ValueError(f"Run {run_id} not found")

    state = run.get("state", "")
    if not state.endswith("_FAILED"):
        raise ValueError(f"Run {run_id} is not in a failed state (state: {state})")

    # Map failed state back to the right function
    if state == "SCOUT_FAILED":
        await start_scout(run_id)
    elif state in ("RESEARCH_FAILED", "MESSAGE_FAILED"):
        await advance_after_cg1(run_id)
    elif state in ("CONTENT_FAILED", "GEMINI_PROMPT_FAILED"):
        await advance_after_cg2(run_id)
    else:
        raise ValueError(f"Don't know how to retry from state: {state}")
