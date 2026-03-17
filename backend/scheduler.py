"""
DB-backed APScheduler.
Schedule config is read from Supabase on startup and re-registered on every restart.
This means Railway container restarts don't lose the schedule.
"""

import asyncio
import logging
import os
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore

import db
from pipeline.orchestrator import start_scout

logger = logging.getLogger(__name__)

_scheduler: AsyncIOScheduler | None = None


def get_scheduler() -> AsyncIOScheduler:
    global _scheduler
    if _scheduler is None:
        # Use Supabase Postgres as the job store so jobs survive restarts
        supabase_url = os.environ["SUPABASE_URL"]
        supabase_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

        # Convert Supabase URL to SQLAlchemy format
        # supabase URL: https://project.supabase.co
        # SQLAlchemy needs: postgresql://postgres:password@db.project.supabase.co:5432/postgres
        # Easier: use the DATABASE_URL env var if set, otherwise use SQLite as fallback
        db_url = os.getenv("DATABASE_URL", "sqlite:///./scheduler_jobs.db")

        jobstores = {
            "default": SQLAlchemyJobStore(url=db_url)
        }

        _scheduler = AsyncIOScheduler(jobstores=jobstores)

    return _scheduler


def _get_iso_week() -> str:
    """Return current ISO week string, e.g. '2026-W10'"""
    now = datetime.now()
    year, week, _ = now.isocalendar()
    return f"{year}-W{week:02d}"


async def _weekly_scout_job():
    """Create a new pipeline run and start the Scout stage."""
    week = _get_iso_week()
    logger.info(f"[Scheduler] Weekly scout job firing for week {week}")

    try:
        # Create a new run with a placeholder slug (Scout will discover the real slug)
        run = db.create_run(week=week, slug="pending-topic-selection")
        run_id = run["id"]

        # Update schedule config last_run_at
        config = db.get_schedule_config()
        if config:
            db.update_schedule_config(
                config["cron_expression"],
                config["enabled"]
            )

        # Run Scout in background
        asyncio.create_task(start_scout(run_id))
        logger.info(f"[Scheduler] Scout started for run {run_id} week {week}")

    except Exception as e:
        logger.exception(f"[Scheduler] Weekly scout job failed: {e}")


def start_scheduler():
    """
    Read schedule config from Supabase and register/update cron jobs.
    Called on FastAPI startup.
    """
    scheduler = get_scheduler()

    if not scheduler.running:
        scheduler.start()
        logger.info("[Scheduler] APScheduler started")

    # Read schedule from database
    config = db.get_schedule_config()
    if not config:
        logger.warning("[Scheduler] No schedule config found in database — using default (Monday 9am)")
        cron_expression = os.getenv("DEFAULT_CRON", "0 9 * * 1")
        enabled = True
    else:
        cron_expression = config.get("cron_expression", "0 9 * * 1")
        enabled = config.get("enabled", True)

    # Parse cron fields
    parts = cron_expression.split()
    if len(parts) != 5:
        logger.error(f"[Scheduler] Invalid cron expression: {cron_expression} — using default")
        parts = ["0", "9", "*", "*", "1"]

    minute, hour, day, month, day_of_week = parts

    # Remove existing job if it exists
    existing = scheduler.get_job("weekly_scout")
    if existing:
        existing.remove()

    if enabled:
        scheduler.add_job(
            _weekly_scout_job,
            trigger="cron",
            id="weekly_scout",
            minute=minute,
            hour=hour,
            day=day,
            month=month,
            day_of_week=day_of_week,
            replace_existing=True,
            misfire_grace_time=3600,  # If job fires up to 1hr late, still run it
        )
        logger.info(f"[Scheduler] Weekly scout scheduled: {cron_expression}")
    else:
        logger.info("[Scheduler] Schedule is disabled — no jobs registered")


def stop_scheduler():
    """Called on FastAPI shutdown."""
    global _scheduler
    if _scheduler and _scheduler.running:
        _scheduler.shutdown()
        logger.info("[Scheduler] APScheduler stopped")


def update_schedule(cron_expression: str, enabled: bool):
    """Update the schedule — called from the API when user changes settings."""
    db.update_schedule_config(cron_expression, enabled)
    start_scheduler()  # Re-registers with new config
    logger.info(f"[Scheduler] Schedule updated: {cron_expression} enabled={enabled}")
