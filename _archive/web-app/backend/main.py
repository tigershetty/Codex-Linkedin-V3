"""
Infographic Engine Web — FastAPI Backend
Handles pipeline orchestration, scheduling, and API routes.
"""

import asyncio
import logging
import os
import secrets
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks, UploadFile, File, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from dotenv import load_dotenv

import db
import alerts
import scheduler as sched_module
from pipeline.orchestrator import advance_after_cg1, advance_after_cg2, retry_stage
from pipeline.chat import stream_chat

load_dotenv(override=True)

# ── Logging ──────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s"
)
logger = logging.getLogger(__name__)

# ── Sentry (error tracking) ───────────────────────────────────

sentry_dsn = os.getenv("SENTRY_DSN", "")
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        traces_sample_rate=0.1,
    )
    logger.info("Sentry initialized")

# ── FastAPI app lifecycle ──────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Infographic Engine backend...")
    sched_module.start_scheduler()
    yield
    logger.info("Shutting down...")
    sched_module.stop_scheduler()


app = FastAPI(
    title="Infographic Engine API",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────
# Allow requests from the React frontend (Vercel) and local development

frontend_urls = os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")
frontend_urls = [url.strip() for url in frontend_urls if url.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── HTTP Basic Auth ────────────────────────────────────────────

security = HTTPBasic()

def require_auth(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify HTTP Basic Auth credentials. Protects all endpoints."""
    expected_username = os.environ.get("BASIC_AUTH_USERNAME", "tiger")
    expected_password = os.environ.get("BASIC_AUTH_PASSWORD", "changeme")

    # Use constant-time comparison to prevent timing attacks
    username_ok = secrets.compare_digest(
        credentials.username.encode("utf8"),
        expected_username.encode("utf8")
    )
    password_ok = secrets.compare_digest(
        credentials.password.encode("utf8"),
        expected_password.encode("utf8")
    )

    if not (username_ok and password_ok):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


# ── Health check (public — used by UptimeRobot) ───────────────

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "infographic-engine"}


# ── Pipeline runs ──────────────────────────────────────────────

@app.get("/runs", dependencies=[Depends(require_auth)])
def list_runs():
    """List all pipeline runs, newest first."""
    return db.list_runs()


@app.get("/runs/{run_id}", dependencies=[Depends(require_auth)])
def get_run(run_id: str):
    """Get a single run with all stage outputs."""
    run = db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    outputs = db.get_all_stage_outputs(run_id)
    candidates = db.get_topic_candidates(run_id)
    hooks = db.get_hook_candidates(run_id)

    return {
        **run,
        "stage_outputs": outputs,
        "topic_candidates": candidates,
        "hook_candidates": hooks,
    }


class CreateRunRequest(BaseModel):
    week: str  # e.g. "2026-W10"


@app.post("/runs", dependencies=[Depends(require_auth)])
def create_run(request: CreateRunRequest, background_tasks: BackgroundTasks):
    """Manually trigger a new pipeline run (creates run + starts Scout)."""
    run = db.create_run(week=request.week, slug="pending-topic-selection")
    background_tasks.add_task(
        asyncio.run,
        __import__("pipeline.orchestrator", fromlist=["start_scout"]).start_scout(run["id"])
    )
    return run


class SelectTopicRequest(BaseModel):
    topic_index: int  # 0-9 (position - 1)


@app.post("/runs/{run_id}/select-topic", dependencies=[Depends(require_auth)])
def select_topic(run_id: str, request: SelectTopicRequest, background_tasks: BackgroundTasks):
    """CG1: User selects a topic. Triggers Research + Message stages."""
    run = db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    if run["state"] != "CG1_PENDING":
        raise HTTPException(status_code=400, detail=f"Run is not at CG1 (state: {run['state']})")

    # Validate topic_index
    candidates = db.get_topic_candidates(run_id)
    if request.topic_index < 0 or request.topic_index >= len(candidates):
        raise HTTPException(status_code=400, detail="Invalid topic index")

    # Save selection + kick off next stages
    db.update_run_state(run_id, "RESEARCH_QUEUED", selected_topic_index=request.topic_index)
    background_tasks.add_task(
        asyncio.run,
        advance_after_cg1(run_id)
    )

    return {"status": "ok", "selected_topic_index": request.topic_index}


class SelectHookRequest(BaseModel):
    hook_index: int  # 0-9 (position - 1)


@app.post("/runs/{run_id}/select-hook", dependencies=[Depends(require_auth)])
def select_hook(run_id: str, request: SelectHookRequest, background_tasks: BackgroundTasks):
    """CG2: User selects a hook. Triggers Content + Gemini Prompt stages."""
    run = db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    if run["state"] != "CG2_PENDING":
        raise HTTPException(status_code=400, detail=f"Run is not at CG2 (state: {run['state']})")

    hooks = db.get_hook_candidates(run_id)
    if request.hook_index < 0 or request.hook_index >= len(hooks):
        raise HTTPException(status_code=400, detail="Invalid hook index")

    db.update_run_state(run_id, "CONTENT_QUEUED", selected_hook_index=request.hook_index)
    background_tasks.add_task(
        asyncio.run,
        advance_after_cg2(run_id)
    )

    return {"status": "ok", "selected_hook_index": request.hook_index}


@app.post("/runs/{run_id}/upload-image", dependencies=[Depends(require_auth)])
async def upload_image(run_id: str, file: UploadFile = File(...)):
    """
    Phase 1: User uploads the PNG generated in Gemini gem.
    Stores in Supabase Storage and saves URL to stage_outputs.
    """
    run = db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    if run["state"] not in ("DRAFT_READY", "LINKEDIN_QUEUED"):
        raise HTTPException(status_code=400, detail="Run must be in DRAFT_READY state to upload image")

    # Upload to Supabase Storage
    supabase = db.get_client()
    image_data = await file.read()
    storage_path = f"{run['week']}/{run['slug']}/infographic.png"

    supabase.storage.from_("infographics").upload(
        storage_path,
        image_data,
        file_options={"content-type": "image/png", "upsert": "true"}
    )

    # Get public URL
    url_response = supabase.storage.from_("infographics").get_public_url(storage_path)
    image_url = url_response

    # Save to stage_outputs
    existing = db.get_stage_output(run_id, "image")
    if existing:
        db.save_stage_output(run_id, "image", existing.get("output_md", ""), image_url=image_url)
    else:
        db.save_stage_output(run_id, "image", "", image_url=image_url)

    return {"status": "ok", "image_url": image_url}


class QueueLinkedInRequest(BaseModel):
    pass


@app.post("/runs/{run_id}/queue-linkedin", dependencies=[Depends(require_auth)])
def queue_linkedin(run_id: str):
    """Stage LinkedIn post for publishing."""
    run = db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    if run["state"] != "DRAFT_READY":
        raise HTTPException(status_code=400, detail="Run must be DRAFT_READY to queue")
    db.update_run_state(run_id, "LINKEDIN_QUEUED")
    return {"status": "ok"}


@app.post("/runs/{run_id}/retry", dependencies=[Depends(require_auth)])
def retry(run_id: str, background_tasks: BackgroundTasks):
    """Retry a failed stage."""
    run = db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    background_tasks.add_task(asyncio.run, retry_stage(run_id, run["state"]))
    return {"status": "retrying", "from_state": run["state"]}


# ── Analytics ──────────────────────────────────────────────────

@app.get("/analytics", dependencies=[Depends(require_auth)])
def list_analytics():
    return db.list_analytics()


class AnalyticsInput(BaseModel):
    run_id: str | None = None
    week: str
    slug: str
    post_date: str
    post_url: str | None = None
    impressions: int
    members_reached: int
    profile_viewers: int = 0
    followers_gained: int = 0
    reactions: int
    comments: int
    reposts: int
    saves: int
    sends: int = 0


@app.post("/analytics", dependencies=[Depends(require_auth)])
def add_analytics(data: AnalyticsInput):
    """Add analytics for a published post."""
    # Calculate metrics
    mr = data.members_reached or 1  # avoid division by zero
    engagement_rate = (data.reactions + data.comments + data.reposts + data.saves) / mr
    reach_efficiency = mr / (data.impressions or 1)
    save_rate = data.saves / mr
    follower_conversion = data.followers_gained / mr
    # Composite: weighted sum (saves + reposts carry higher weight)
    composite = (
        data.reactions * 1 +
        data.comments * 2 +
        data.reposts * 3 +
        data.saves * 5
    ) / mr * 100

    payload = {
        **data.model_dump(),
        "engagement_rate": round(engagement_rate, 4),
        "reach_efficiency": round(reach_efficiency, 4),
        "save_rate": round(save_rate, 4),
        "follower_conversion": round(follower_conversion, 4),
        "composite_score": round(composite, 4),
    }

    result = db.save_analytics(payload)

    # Update run state if run_id provided
    if data.run_id:
        db.update_run_state(data.run_id, "COMPLETE")

    return result


# ── Chat ───────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str   # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]  # full conversation history including the new user message


@app.post("/runs/{run_id}/chat", dependencies=[Depends(require_auth)])
async def chat(run_id: str, request: ChatRequest):
    """
    Stream a chat response for the given run.
    Accepts the full conversation history (frontend is stateless).
    Returns an SSE stream: 'data: <token>\n\n' ... 'data: [DONE]\n\n'
    """
    run = db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    # Convert Pydantic models to plain dicts for the anthropic SDK
    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    return StreamingResponse(
        stream_chat(run_id, messages),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",   # disable Nginx buffering if behind proxy
        }
    )


# ── Schedule ───────────────────────────────────────────────────

@app.get("/schedule", dependencies=[Depends(require_auth)])
def get_schedule():
    config = db.get_schedule_config()
    if not config:
        return {"cron_expression": "0 9 * * 1", "enabled": True}
    return config


class UpdateScheduleRequest(BaseModel):
    cron_expression: str
    enabled: bool


@app.put("/schedule", dependencies=[Depends(require_auth)])
def update_schedule(request: UpdateScheduleRequest):
    sched_module.update_schedule(request.cron_expression, request.enabled)
    return db.get_schedule_config()
