"""
Email alerting — sends you a notification when a pipeline stage fails.
Uses Gmail App Password (SMTP). Configure in .env file.
"""

import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv(override=True)
logger = logging.getLogger(__name__)


def send_stage_failure_alert(run_id: str, stage: str, error: str, week: str = "", slug: str = ""):
    """Send an email alert when a pipeline stage fails."""
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USERNAME", "")
    smtp_pass = os.getenv("SMTP_PASSWORD", "")
    alert_email = os.getenv("ALERT_EMAIL", "")

    if not all([smtp_user, smtp_pass, alert_email]):
        logger.warning("Email alerts not configured — skipping alert for stage failure.")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[Infographic Engine] {stage} stage FAILED — {week}/{slug}"
        msg["From"] = smtp_user
        msg["To"] = alert_email

        body = f"""
Pipeline stage failed and needs your attention.

Week:     {week}
Slug:     {slug}
Stage:    {stage}
Run ID:   {run_id}

Error:
{error}

What to do:
1. Open your dashboard and find this run
2. Click "Retry" to re-run the failed stage
3. If retry fails again, check Sentry for the full stack trace

Dashboard: {os.getenv('FRONTEND_URL', '').split(',')[0]}/runs/{run_id}
        """.strip()

        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, alert_email, msg.as_string())

        logger.info(f"Alert email sent for {stage} failure on run {run_id}")

    except Exception as e:
        # Never let alerting failures crash the main application
        logger.error(f"Failed to send alert email: {e}")


def send_gate_notification(gate: str, run_id: str, week: str, slug: str):
    """Notify you when a control gate is waiting for your input."""
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USERNAME", "")
    smtp_pass = os.getenv("SMTP_PASSWORD", "")
    alert_email = os.getenv("ALERT_EMAIL", "")

    if not all([smtp_user, smtp_pass, alert_email]):
        return

    gate_labels = {
        "CG1": "Choose your topic for this week",
        "CG2": "Choose your hook — research and message are ready",
        "ANALYTICS": "Analytics data ready to enter (7 days post-publish)",
    }
    label = gate_labels.get(gate, gate)
    dashboard_url = os.getenv("FRONTEND_URL", "").split(",")[0]

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[Infographic Engine] {gate}: {label}"
        msg["From"] = smtp_user
        msg["To"] = alert_email

        body = f"""
Your input is needed to continue the pipeline.

Action:  {label}
Week:    {week}
Slug:    {slug}
Run ID:  {run_id}

Open your dashboard:
{dashboard_url}/runs/{run_id}
        """.strip()

        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, alert_email, msg.as_string())

    except Exception as e:
        logger.error(f"Failed to send gate notification: {e}")
