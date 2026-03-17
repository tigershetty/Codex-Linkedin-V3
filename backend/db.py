"""
Supabase client wrapper.
Uses the service role key — full database access, bypasses RLS.
Only the backend uses this. The frontend uses the anon key through FastAPI routes.
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(override=True)

_client: Client | None = None


def get_client() -> Client:
    global _client
    if _client is None:
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        _client = create_client(url, key)
    return _client


# ── Pipeline runs ──────────────────────────────────────────────

def create_run(week: str, slug: str) -> dict:
    db = get_client()
    result = db.table("pipeline_runs").insert({
        "week": week,
        "slug": slug,
        "state": "IDLE"
    }).execute()
    return result.data[0]


def get_run(run_id: str) -> dict | None:
    db = get_client()
    result = db.table("pipeline_runs").select("*").eq("id", run_id).single().execute()
    return result.data


def list_runs() -> list[dict]:
    db = get_client()
    result = (
        db.table("pipeline_runs")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


def update_run_state(run_id: str, state: str, **extra_fields) -> dict:
    db = get_client()
    payload = {"state": state, "updated_at": "NOW()", **extra_fields}
    result = db.table("pipeline_runs").update(payload).eq("id", run_id).execute()
    return result.data[0]


def set_run_error(run_id: str, stage: str, error: str):
    update_run_state(run_id, f"{stage}_FAILED", error_message=error)


# ── Stage outputs ──────────────────────────────────────────────

def save_stage_output(run_id: str, stage_name: str, output_md: str, image_url: str | None = None) -> dict:
    db = get_client()
    payload = {
        "run_id": run_id,
        "stage_name": stage_name,
        "output_md": output_md,
    }
    if image_url:
        payload["image_url"] = image_url
    # Upsert — safe to re-run a stage
    result = db.table("stage_outputs").upsert(payload, on_conflict="run_id,stage_name").execute()
    return result.data[0]


def get_stage_output(run_id: str, stage_name: str) -> dict | None:
    db = get_client()
    result = (
        db.table("stage_outputs")
        .select("*")
        .eq("run_id", run_id)
        .eq("stage_name", stage_name)
        .execute()
    )
    return result.data[0] if result.data else None


def get_all_stage_outputs(run_id: str) -> list[dict]:
    db = get_client()
    result = (
        db.table("stage_outputs")
        .select("*")
        .eq("run_id", run_id)
        .order("created_at")
        .execute()
    )
    return result.data


# ── Topic candidates ───────────────────────────────────────────

def save_topic_candidates(run_id: str, candidates: list[dict]):
    db = get_client()
    rows = [{"run_id": run_id, **c} for c in candidates]
    db.table("topic_candidates").insert(rows).execute()


def get_topic_candidates(run_id: str) -> list[dict]:
    db = get_client()
    result = (
        db.table("topic_candidates")
        .select("*")
        .eq("run_id", run_id)
        .order("position")
        .execute()
    )
    return result.data


# ── Hook candidates ────────────────────────────────────────────

def save_hook_candidates(run_id: str, hooks: list[dict]):
    db = get_client()
    rows = [{"run_id": run_id, **h} for h in hooks]
    db.table("hook_candidates").insert(rows).execute()


def get_hook_candidates(run_id: str) -> list[dict]:
    db = get_client()
    result = (
        db.table("hook_candidates")
        .select("*")
        .eq("run_id", run_id)
        .order("position")
        .execute()
    )
    return result.data


# ── Analytics ──────────────────────────────────────────────────

def save_analytics(data: dict) -> dict:
    db = get_client()
    result = db.table("analytics_log").insert(data).execute()
    return result.data[0]


def list_analytics() -> list[dict]:
    db = get_client()
    result = (
        db.table("analytics_log")
        .select("*")
        .order("post_date", desc=True)
        .execute()
    )
    return result.data


# ── Schedule config ────────────────────────────────────────────

def get_schedule_config() -> dict | None:
    db = get_client()
    result = db.table("schedule_config").select("*").limit(1).execute()
    return result.data[0] if result.data else None


def update_schedule_config(cron_expression: str, enabled: bool) -> dict:
    db = get_client()
    config = get_schedule_config()
    payload = {
        "cron_expression": cron_expression,
        "enabled": enabled,
        "updated_at": "NOW()"
    }
    if config:
        result = db.table("schedule_config").update(payload).eq("id", config["id"]).execute()
    else:
        result = db.table("schedule_config").insert(payload).execute()
    return result.data[0]
