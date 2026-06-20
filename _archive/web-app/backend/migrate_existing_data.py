"""
One-time migration script: imports existing data/ directory into Supabase.
Run once after Supabase schema is set up:

    python migrate_existing_data.py

Reads: infographic-content-engine-v1/data/
Writes: Supabase pipeline_runs, stage_outputs, analytics_log tables
"""

import os
import csv
import sys
from pathlib import Path
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()

# Path to the existing data directory
DATA_DIR = Path(__file__).parent.parent.parent / "infographic-content-engine-v1" / "data"

# Known stage file names
STAGE_FILES = {
    "topic-scout.md": None,         # week-level, not slug-level
    "research.md": "research",
    "message-commit.md": "message",
    "content.md": "content",
    "gemini-prompt.md": "gemini_prompt",
    "analytics.md": "analytics_imported",
}


def migrate():
    import db  # noqa — import after path is set

    print(f"Reading data from: {DATA_DIR}")
    if not DATA_DIR.exists():
        print(f"ERROR: {DATA_DIR} does not exist. Check the path.")
        sys.exit(1)

    runs_created = 0
    stages_imported = 0
    analytics_imported = 0

    # ── Migrate analytics-log.csv ────────────────────────────
    analytics_csv = DATA_DIR / "analytics-log.csv"
    if analytics_csv.exists():
        print(f"\nMigrating analytics-log.csv...")
        with open(analytics_csv, newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    mr = int(row.get("members_reached") or 1) or 1
                    reactions = int(row.get("reactions") or 0)
                    saves = int(row.get("saves") or 0)
                    reposts = int(row.get("reposts") or 0)
                    comments = int(row.get("comments") or 0)
                    impressions = int(row.get("impressions") or 1) or 1

                    engagement_rate = (reactions + comments + reposts + saves) / mr
                    reach_efficiency = mr / impressions
                    save_rate = saves / mr
                    composite = (reactions + comments * 2 + reposts * 3 + saves * 5) / mr * 100

                    db.save_analytics({
                        "week": row.get("week", ""),
                        "slug": row.get("slug", ""),
                        "post_date": row.get("post_date") or None,
                        "post_url": row.get("post_url") or None,
                        "impressions": impressions,
                        "members_reached": mr,
                        "reactions": reactions,
                        "comments": comments,
                        "reposts": reposts,
                        "saves": saves,
                        "engagement_rate": round(engagement_rate, 4),
                        "reach_efficiency": round(reach_efficiency, 4),
                        "save_rate": round(save_rate, 4),
                        "follower_conversion": 0,
                        "composite_score": round(composite, 4),
                    })
                    analytics_imported += 1
                    print(f"  ✓ Analytics: {row.get('week')}/{row.get('slug')}")
                except Exception as e:
                    print(f"  ✗ Analytics row error: {e} — row: {row}")

    # ── Migrate data/{week}/{slug}/ directories ──────────────
    for week_dir in sorted(DATA_DIR.iterdir()):
        if not week_dir.is_dir() or not week_dir.name.startswith("20"):
            continue

        week = week_dir.name
        print(f"\nProcessing week: {week}")

        for slug_dir in sorted(week_dir.iterdir()):
            if not slug_dir.is_dir():
                continue

            slug = slug_dir.name
            print(f"  Processing: {slug}")

            # Create a pipeline run record for this historical entry
            try:
                run = db.create_run(week=week, slug=slug)
                run_id = run["id"]

                # Mark as COMPLETE (historical data is all done)
                db.update_run_state(run_id, "COMPLETE")
                runs_created += 1

                # Import each stage file
                for filename, stage_name in STAGE_FILES.items():
                    if stage_name is None:
                        continue  # skip topic-scout.md (week-level)

                    stage_file = slug_dir / filename
                    if stage_file.exists():
                        content = stage_file.read_text(encoding="utf-8")
                        db.save_stage_output(run_id, stage_name, content)
                        stages_imported += 1
                        print(f"    ✓ {filename} → {stage_name}")
                    else:
                        print(f"    - {filename} not found (skipped)")

            except Exception as e:
                print(f"  ✗ Error importing {week}/{slug}: {e}")

    print(f"\n{'='*50}")
    print(f"Migration complete!")
    print(f"  Runs created:      {runs_created}")
    print(f"  Stages imported:   {stages_imported}")
    print(f"  Analytics rows:    {analytics_imported}")
    print(f"{'='*50}")
    print("\nYour historical data is now in Supabase.")
    print("Open your Supabase dashboard to verify: supabase.com → Table Editor")


if __name__ == "__main__":
    migrate()
