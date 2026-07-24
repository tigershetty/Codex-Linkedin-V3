from __future__ import annotations

import hashlib
import json
import re
import shutil
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


POST_DIR = Path(__file__).resolve().parent
PACK_DIR = POST_DIR / "resource" / "sop-prework-skills-v1"
DOWNLOAD_DIR = PACK_DIR / "downloads"
PDF_PATH = DOWNLOAD_DIR / "SOP-PREWORK-START-HERE.pdf"
VISUAL_PATH = POST_DIR / "visual.png"
VERSION = "1.2.0"

SKILLS = [
    {
        "name": "prepare-sop-data-readiness",
        "number": "01",
        "title": "Prepare S&OP Data Readiness",
        "handoff": "Trusted exception pack",
        "description": "Reconcile source versions, test comparability, and separate data-quality issues from operating exceptions.",
    },
    {
        "name": "review-sop-portfolio",
        "number": "02",
        "title": "Review S&OP Portfolio",
        "handoff": "Approved portfolio changes",
        "description": "Test launch, phase-out, and lifecycle readiness before proposed changes enter the plan.",
    },
    {
        "name": "build-sop-demand-plan",
        "number": "03",
        "title": "Build S&OP Demand Plan",
        "handoff": "Consensus demand and scenarios",
        "description": "Keep the baseline, evidence, judgment, overrides, and scenarios visible instead of hiding them in one number.",
    },
    {
        "name": "test-sop-supply-feasibility",
        "number": "04",
        "title": "Test S&OP Supply Feasibility",
        "handoff": "Feasible response and options",
        "description": "Test demand scenarios against capacity, materials, inventory, lead time, and response levers.",
    },
    {
        "name": "reconcile-sop-plan",
        "number": "05",
        "title": "Reconcile S&OP Plan",
        "handoff": "Recommendation and decision asks",
        "description": "Integrate the four hand-offs, resolve what can be resolved, and frame the remaining executive choices.",
    },
]

INDIGO = colors.HexColor("#2947D3")
TEAL = colors.HexColor("#0F8A72")
AMBER = colors.HexColor("#D97706")
INK = colors.HexColor("#12213F")
MUTED = colors.HexColor("#5E6B82")
BORDER = colors.HexColor("#D7DFEA")
PALE_INDIGO = colors.HexColor("#EEF3FF")
PALE_TEAL = colors.HexColor("#ECFDF7")
PALE_AMBER = colors.HexColor("#FFF8E8")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def demote_headings(text: str) -> str:
    return re.sub(r"(?m)^(#{1,4})\s", lambda match: "#" + match.group(1) + " ", text.strip())


def standalone_skill(skill: dict[str, str]) -> str:
    source_root = PACK_DIR / "skills" / skill["name"]
    skill_text = (source_root / "SKILL.md").read_text(encoding="utf-8")
    skill_text = skill_text.replace(
        "[assets/input-template.md](assets/input-template.md)",
        "the embedded input template below",
    ).replace(
        "[assets/output-template.md](assets/output-template.md)",
        "the embedded output template below",
    )

    frontmatter_end = skill_text.find("\n---\n", 4)
    note = (
        f"\n> Standalone edition v{VERSION}. This one Markdown file contains the complete method, "
        "input contract, output contract, guardrails, and first-run instructions. Attach it directly "
        "to ChatGPT, Claude, Gemini, Codex, or another approved AI workspace. For native Agent Skill "
        f"installation, save it as `SKILL.md` inside a folder named `{skill['name']}`. No companion "
        "file, bundled dataset, or proprietary tool is required.\n"
    )
    if frontmatter_end >= 0:
        insert_at = frontmatter_end + len("\n---\n")
        skill_text = skill_text[:insert_at] + note + skill_text[insert_at:]
    else:
        skill_text = note.lstrip() + "\n" + skill_text

    project_setup = """

## Use This Skill With Your Project

This skill works independently. Use outputs from earlier S&OP reviews when they exist, or map equivalent evidence from your own project files. Do not assume that another skill has already run.

1. Create governed, read-only copies of the source files for one review cycle. CSV or XLSX exports, planning reports, approved presentations, decision logs, and working documents are valid inputs. Start with one product family, region, or business unit when the full scope is too large.
2. Remove or mask personal, customer-identifying, commercially sensitive, and credential data unless your AI environment and use are explicitly approved.
3. Attach this skill file and the relevant project files to your AI workspace. Do not connect the skill directly to a production system for the first run.
4. Require a source-to-input map before analysis. Your files do not need to use the same column names as the embedded template, but the agent must show which source, field, owner, version, and as-of date satisfies each requirement.
5. Choose a run mode. Use `READINESS` to map evidence and gaps without building the review artifact. Use `BUILD` only when minimum evidence is sufficient.
6. Keep missing fields, conflicting versions, and uncertain assumptions visible. The named business owner reviews the artifact before it becomes a hand-off.

### Required First Output

Before the review artifact, return:

| Requirement | Source file | Field / section | Owner | Version / as of | Status |
|---|---|---|---|---|---|

Then list every missing, stale, conflicting, or unclear input. If a load-bearing requirement is not satisfied, stop in `READINESS` mode and return a readiness-gap list. Do not manufacture a completed artifact.

### First-Run Prompt

> Use this skill with my attached project files. Start in READINESS mode. Create the required source-to-input map, show which file and field satisfies each embedded input, and list anything missing, stale, conflicting, or unclear. Do not invent values or silently resolve conflicts. Move to BUILD mode only when the minimum evidence is sufficient. Then follow the method, return the embedded output contract, and end with the human decisions still required.
"""
    title_match = re.search(r"(?m)^# .+$", skill_text)
    if title_match:
        skill_text = skill_text[: title_match.end()] + project_setup + skill_text[title_match.end() :]
    else:
        skill_text = skill_text + project_setup

    input_text = demote_headings(
        (source_root / "assets" / "input-template.md").read_text(encoding="utf-8")
    )
    output_text = demote_headings(
        (source_root / "assets" / "output-template.md").read_text(encoding="utf-8")
    )
    return (
        skill_text.rstrip()
        + "\n\n---\n\n## Embedded Input Template\n\n"
        + input_text
        + "\n\n---\n\n## Embedded Output Template\n\n"
        + output_text
        + "\n"
    )


def write_download_files() -> None:
    if DOWNLOAD_DIR.exists():
        shutil.rmtree(DOWNLOAD_DIR)
    (DOWNLOAD_DIR / "skills").mkdir(parents=True, exist_ok=True)

    shutil.copy2(PACK_DIR / "FIELD-GUIDE.md", DOWNLOAD_DIR / "SOP-PREWORK-START-HERE.md")

    for skill in SKILLS:
        name = f"{skill['number']}-{skill['name']}.md"
        (DOWNLOAD_DIR / "skills" / name).write_text(
            standalone_skill(skill), encoding="utf-8"
        )

def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=29,
            leading=33,
            textColor=INK,
            spaceAfter=11,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=11.5,
            leading=17,
            textColor=MUTED,
        ),
        "eyebrow": ParagraphStyle(
            "Eyebrow",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=INDIGO,
            spaceAfter=7,
        ),
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=INK,
            spaceAfter=11,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=16,
            textColor=INK,
            spaceBefore=7,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=13.5,
            textColor=INK,
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=10.5,
            textColor=MUTED,
        ),
        "code": ParagraphStyle(
            "Code",
            parent=base["Code"],
            fontName="Courier",
            fontSize=7.4,
            leading=10.5,
            textColor=INK,
            backColor=colors.HexColor("#F8FAFC"),
            borderColor=BORDER,
            borderWidth=0.5,
            borderPadding=8,
            spaceBefore=5,
            spaceAfter=8,
        ),
        "callout": ParagraphStyle(
            "Callout",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=13.5,
            textColor=INK,
        ),
    }


STYLES = make_styles()


def para(text: str, style: str = "body") -> Paragraph:
    return Paragraph(text.replace("&", "&amp;"), STYLES[style])


def bullet(text: str, color=TEAL, width=6.29 * inch) -> Table:
    item = Table([["", para(text)]], colWidths=[0.11 * inch, width])
    item.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), color),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (0, 0), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 0),
                ("TOPPADDING", (0, 0), (0, 0), 5),
                ("BOTTOMPADDING", (0, 0), (0, 0), 5),
                ("LEFTPADDING", (1, 0), (1, 0), 8),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (1, 0), (1, 0), 0),
                ("BOTTOMPADDING", (1, 0), (1, 0), 4),
            ]
        )
    )
    return item


def styled_table(rows: list[list[str]], widths: list[float], font_size: float = 7.4) -> Table:
    wrapped: list[list[Paragraph]] = []
    for row_index, row in enumerate(rows):
        row_cells: list[Paragraph] = []
        for value in row:
            style = ParagraphStyle(
                f"Cell-{row_index}",
                parent=STYLES["small"],
                fontName="Helvetica-Bold" if row_index == 0 else "Helvetica",
                fontSize=font_size,
                leading=font_size + 3,
                textColor=INK,
            )
            row_cells.append(Paragraph(str(value).replace("&", "&amp;"), style))
        wrapped.append(row_cells)
    table = Table(wrapped, colWidths=widths, repeatRows=1)
    commands = [
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("BACKGROUND", (0, 0), (-1, 0), PALE_INDIGO),
    ]
    for row_index in range(2, len(rows), 2):
        commands.append(("BACKGROUND", (0, row_index), (-1, row_index), colors.HexColor("#F8FAFC")))
    table.setStyle(TableStyle(commands))
    return table


def callout(label: str, text: str, fill, line) -> Table:
    box = Table([[para(label, "callout"), para(text)]], colWidths=[1.55 * inch, 4.85 * inch])
    box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), fill),
                ("BOX", (0, 0), (-1, -1), 0.7, line),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    return box


def section(label: str, title: str) -> list[Paragraph]:
    return [para(label.upper(), "eyebrow"), para(title, "h1")]


def cover_page(canvas, _doc) -> None:
    canvas.saveState()
    width, height = LETTER
    canvas.setFillColor(PALE_INDIGO)
    canvas.rect(0, height - 0.18 * inch, width, 0.18 * inch, stroke=0, fill=1)
    canvas.setFillColor(TEAL)
    canvas.rect(0, 0, width, 0.12 * inch, stroke=0, fill=1)
    canvas.restoreState()


def page_decor(canvas, doc) -> None:
    canvas.saveState()
    width, height = LETTER
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(0.7 * inch, height - 0.52 * inch, width - 0.7 * inch, height - 0.52 * inch)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.setFillColor(INK)
    canvas.drawString(0.7 * inch, height - 0.38 * inch, "SHETTY'S DESK")
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - 0.7 * inch, height - 0.38 * inch, "S&OP PRE-WORK SKILLS - START HERE")
    canvas.line(0.7 * inch, 0.5 * inch, width - 0.7 * inch, 0.5 * inch)
    canvas.drawString(0.7 * inch, 0.32 * inch, f"Version {VERSION} - July 2026")
    canvas.drawRightString(width - 0.7 * inch, 0.32 * inch, f"Page {doc.page}")
    canvas.restoreState()


def pdf_story() -> list:
    story: list = []
    visual = Image(str(VISUAL_PATH), width=2.35 * inch, height=2.9375 * inch)
    cover_copy = [
        para(f"FREE RESOURCE LIBRARY - VERSION {VERSION}", "eyebrow"),
        para("S&OP Pre-Work Skills", "title"),
        para(
            "Five standalone workflows for preparing the evidence, options, and decision asks that executive S&OP should receive.",
            "subtitle",
        ),
        Spacer(1, 0.16 * inch),
        bullet("Download only the files you need. No ZIP, email gate, or account.", width=3.12 * inch),
        bullet("Run the skills on governed copies of your own project files.", width=3.12 * inch),
        bullet("Each skill embeds setup guidance plus its own input and output templates.", width=3.12 * inch),
        bullet("Keep every accountable plan and system decision with a named owner.", width=3.12 * inch),
    ]
    cover = Table([[cover_copy, visual]], colWidths=[3.72 * inch, 2.38 * inch])
    cover.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 20),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.extend([Spacer(1, 0.38 * inch), cover, Spacer(1, 0.32 * inch)])
    meta = Table(
        [[para("1 PDF + 1 MD GUIDE", "callout"), para("5 STANDALONE SKILLS", "callout"), para("0 BUNDLED DATA FILES", "callout")]],
        colWidths=[2.1 * inch, 2.1 * inch, 2.1 * inch],
    )
    meta.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), PALE_INDIGO),
                ("BACKGROUND", (1, 0), (1, 0), PALE_TEAL),
                ("BACKGROUND", (2, 0), (2, 0), PALE_AMBER),
                ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    story.extend([meta, Spacer(1, 0.25 * inch), callout(
        "READ THIS FIRST",
        "These skills prepare review artifacts. They do not approve a forecast, portfolio change, supply response, financial commitment, or system-of-record update.",
        PALE_AMBER,
        AMBER,
    ), PageBreak()])

    story.extend(section("1 - Download map", "Take only the artifact you need"))
    story.append(para(
        "The website shows every file before download. Begin with this PDF, then choose one skill for the review you need. Use all five only when you want to prepare an end-to-end cycle."
    ))
    download_rows = [
        ["Download", "What it contains", "Use it for"],
        ["Start Here PDF / MD", "Setup paths, first run, quality rules, controls", "Understand the method before prompting"],
        ["Five skill files", "Project setup, method, guardrails, and embedded templates", "Run one review or the full chain"],
    ]
    story.extend([
        styled_table(download_rows, [1.55 * inch, 2.75 * inch, 2.1 * inch]),
        Spacer(1, 0.16 * inch),
        para("First safe run", "h2"),
    ])
    for item in [
        "Choose one review and download its standalone skill.",
        "Create governed, read-only copies of the relevant project files; start with a narrow scope when needed.",
        "Attach the skill and project files to ChatGPT, Claude, Gemini, Codex, or another approved AI workspace.",
        "Run READINESS first: require a source-to-input map and preserve every unknown or conflicting value.",
        "Run BUILD only when the minimum evidence is sufficient.",
        "Review the artifact with the named business owner before it becomes the next review's input.",
    ]:
        story.append(bullet(item))
    story.extend([
        Spacer(1, 0.12 * inch),
        para("Suggested first prompt", "h2"),
        para(
            "Use this skill with my attached project files. Start in READINESS mode. Create the required source-to-input map, show which file and field satisfies each embedded input, and list anything missing, stale, conflicting, or unclear. Do not invent values or silently resolve conflicts. Move to BUILD mode only when the minimum evidence is sufficient. Then follow the method, return the embedded output contract, and end with the human decisions still required.",
            "code",
        ),
        PageBreak(),
    ])

    story.extend(section("2 - The review chain", "Five hand-offs before one executive decision"))
    story.append(para(
        "A meeting is not complete because its agenda finished. It is complete when the next review receives evidence it can use without reconstructing the work."
    ))
    skill_rows = [["Review", "What the skill settles", "Required hand-off"]]
    settles = [
        "Source versions, actuals, exceptions, assumptions",
        "Launches, phase-outs, lifecycle decisions",
        "Baseline, evidence, judgment, scenarios",
        "Capacity, materials, inventory, response levers",
        "Gaps, trade-offs, value, recommendation",
    ]
    for skill, settle in zip(SKILLS, settles):
        skill_rows.append([f"{skill['number']} {skill['title'].replace('S&OP ', '')}", settle, skill["handoff"]])
    story.extend([
        styled_table(skill_rows, [1.65 * inch, 2.75 * inch, 2.0 * inch], font_size=7.1),
        Spacer(1, 0.17 * inch),
        callout(
            "EXECUTIVE READINESS",
            "READY = EVIDENCE + OWNER + OPTIONS + ASK. This is a Shetty's Desk operating synthesis, not a quoted industry standard.",
            PALE_TEAL,
            TEAL,
        ),
        Spacer(1, 0.16 * inch),
        para("What each review must avoid", "h2"),
    ])
    for item in [
        "Data: never choose a preferred source silently when versions conflict.",
        "Portfolio: never turn a roadmap date into an approved planning input.",
        "Demand: never hide judgment and overrides inside one consensus number.",
        "Supply: never assume infinite capacity, material, cash, or response time.",
        "Reconciliation: never approve the plan or invent a financial impact.",
    ]:
        story.append(bullet(item, INDIGO))
    story.append(PageBreak())

    story.extend(section("3 - Run one skill", "Give the agent a controlled job"))
    story.append(para(
        "The standalone file contains the workflow and both templates. Keep the prompt short; the skill already carries the method. Your job is to provide governed evidence and challenge the result."
    ))
    run_rows = [
        ["Step", "Action", "Evidence to keep"],
        ["1", "Choose the review and attach its standalone skill.", "Skill filename and version"],
        ["2", "Attach governed copies of the mapped project inputs.", "Source owner, version, as-of date"],
        ["3", "Run READINESS; move to BUILD only when evidence is sufficient.", "Unknowns and conflicting values"],
        ["4", "Review the output against the hand-off gate.", "Owner, next check, option, decision ask"],
        ["5", "Approve, reject, or return the artifact for correction.", "Named human decision and timestamp"],
    ]
    story.extend([
        styled_table(run_rows, [0.5 * inch, 3.35 * inch, 2.55 * inch]),
        Spacer(1, 0.16 * inch),
        para("Replace these fields deliberately", "h2"),
    ])
    for item in [
        "Cycle, horizon, calendar, planning grain, units, and currency.",
        "Source names, owners, versions, timestamps, and approval states.",
        "Thresholds, service priorities, constraints, and response windows.",
        "Decision rights, due points, escalation rules, and system boundaries.",
    ]:
        story.append(bullet(item))
    story.extend([
        Spacer(1, 0.12 * inch),
        callout(
            "DATA SAFETY",
            "Remove or mask personal, customer-identifying, commercially sensitive, and credential data unless the AI environment and use are explicitly approved.",
            PALE_AMBER,
            AMBER,
        ),
        PageBreak(),
    ])

    story.extend(section("4 - Quality and control", "Reject polish without traceability"))
    quality_rows = [
        ["Check", "Pass condition", "Reject when"],
        ["Evidence", "Every load-bearing number names a source and date", "The output invents or silently selects evidence"],
        ["Ownership", "Every exception and assumption has a named owner", "The next team must rediscover accountability"],
        ["Options", "Choices use comparable service, capacity, cash, and risk dimensions", "One preferred answer hides its trade-off"],
        ["Ask", "The decision, owner, and decision window are explicit", "Executives receive a problem with no choice"],
        ["Boundary", "Human approvals and system actions remain visible", "The agent appears to authorize the plan"],
    ]
    story.extend([
        styled_table(quality_rows, [1.05 * inch, 2.75 * inch, 2.6 * inch], font_size=7.0),
        Spacer(1, 0.16 * inch),
        para("Human decision boundary", "h2"),
    ])
    for item in [
        "Data owners approve the trusted source and version.",
        "Portfolio owners approve lifecycle changes.",
        "Commercial and demand owners approve overrides and consensus demand.",
        "Operations, supply, procurement, and finance approve response options and values.",
        "Executives choose the scenario, allocate resources, and commit one plan.",
        "Authorized system owners make every system-of-record change.",
    ]:
        story.append(bullet(item, INDIGO))
    story.extend([
        Spacer(1, 0.12 * inch),
        callout(
            "FINAL TEST",
            "Look at the last executive S&OP discussion that stalled. Was evidence missing, ownership unclear, the options incomparable, or the decision ask undefined? Start with the skill that repairs that hand-off.",
            PALE_INDIGO,
            INDIGO,
        ),
    ])
    return story


def build_pdf() -> None:
    PDF_PATH.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(PDF_PATH),
        pagesize=LETTER,
        leftMargin=0.72 * inch,
        rightMargin=0.72 * inch,
        topMargin=0.72 * inch,
        bottomMargin=0.68 * inch,
        title="S&OP Pre-Work Skills - Start Here",
        author="Shetty's Desk",
        subject="How-to guide for five standalone S&OP pre-work skills",
    )
    cover_frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="cover")
    body_frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="body")
    doc.addPageTemplates(
        [
            PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_page, autoNextPageTemplate="Body"),
            PageTemplate(id="Body", frames=[body_frame], onPage=page_decor),
        ]
    )
    doc.build(pdf_story())


def public_downloads() -> list[dict[str, object]]:
    records: list[dict[str, object]] = [
        {
            "id": "start-here-pdf",
            "category": "start-here",
            "title": "Start Here - PDF guide",
            "description": "Branded instructions for setup, the safe first run, hand-off quality, and human controls.",
            "path": "downloads/SOP-PREWORK-START-HERE.pdf",
            "downloadName": f"shettys-desk-sop-prework-start-here-v{VERSION}.pdf",
            "contentType": "application/pdf",
        },
        {
            "id": "start-here-markdown",
            "category": "start-here",
            "title": "Start Here - Markdown guide",
            "description": "Accessible text edition of the operating instructions.",
            "path": "downloads/SOP-PREWORK-START-HERE.md",
            "downloadName": f"shettys-desk-sop-prework-start-here-v{VERSION}.md",
            "contentType": "text/markdown; charset=utf-8",
        },
    ]

    for skill in SKILLS:
        filename = f"{skill['number']}-{skill['name']}.md"
        records.append(
            {
                "id": skill["name"],
                "category": "skill",
                "title": f"{skill['number']} - {skill['title']}",
                "description": f"{skill['description']} Produces: {skill['handoff']}.",
                "path": f"downloads/skills/{filename}",
                "downloadName": filename,
                "contentType": "text/markdown; charset=utf-8",
            }
        )

    for record in records:
        path = PACK_DIR / str(record["path"])
        record["bytes"] = path.stat().st_size
        record["sha256"] = digest(path)
    return records


def write_download_manifest() -> None:
    payload = {
        "schemaVersion": 1,
        "resource": "sop-prework-skills",
        "displayName": "S&OP Pre-Work Skills",
        "version": VERSION,
        "distribution": "individual-files",
        "directDownloadNoEmail": True,
        "bringYourOwnData": True,
        "bundledDataFiles": 0,
        "packageShape": {
            "instructionPdf": 1,
            "markdownGuide": 1,
            "standaloneSkills": 5,
        },
        "instructionPdf": "downloads/SOP-PREWORK-START-HERE.pdf",
        "downloadCount": 7,
        "downloads": public_downloads(),
    }
    (PACK_DIR / "downloads-manifest.json").write_text(
        json.dumps(payload, indent=2) + "\n", encoding="utf-8"
    )


def package_files(*, include_generated: bool) -> list[Path]:
    excluded = set() if include_generated else {"manifest.json", "checksums.sha256"}
    return sorted(
        path
        for path in PACK_DIR.rglob("*")
        if path.is_file() and path.name not in excluded
    )


def write_package_manifest() -> None:
    files = package_files(include_generated=False)
    payload = {
        "schemaVersion": 2,
        "name": "sop-prework-skills-library",
        "displayName": "S&OP Pre-Work Skills Library",
        "version": VERSION,
        "distribution": "individual-files",
        "directDownloadNoEmail": True,
        "bringYourOwnData": True,
        "bundledDataFiles": 0,
        "instructionPdf": "downloads/SOP-PREWORK-START-HERE.pdf",
        "downloadsManifest": "downloads-manifest.json",
        "safeFirstRun": "downloads/SOP-PREWORK-START-HERE.pdf",
        "readFirst": "downloads/SOP-PREWORK-START-HERE.pdf",
        "skills": [
            {
                "name": skill["name"],
                "handoff": skill["handoff"],
                "path": f"skills/{skill['name']}",
                "standaloneDownload": f"downloads/skills/{skill['number']}-{skill['name']}.md",
            }
            for skill in SKILLS
        ],
        "files": [
            {
                "path": str(path.relative_to(PACK_DIR)),
                "bytes": path.stat().st_size,
                "sha256": digest(path),
            }
            for path in files
        ],
    }
    (PACK_DIR / "manifest.json").write_text(
        json.dumps(payload, indent=2) + "\n", encoding="utf-8"
    )


def write_checksums() -> None:
    files = [
        path
        for path in package_files(include_generated=True)
        if path.name != "checksums.sha256"
    ]
    lines = [f"{digest(path)}  {path.relative_to(PACK_DIR)}" for path in files]
    (PACK_DIR / "checksums.sha256").write_text("\n".join(lines) + "\n", encoding="utf-8")


def validate() -> None:
    errors: list[str] = []
    required = [
        PACK_DIR / "FIELD-GUIDE.md",
        PACK_DIR / "PACKAGE-CONTENTS.md",
        PACK_DIR / "downloads-manifest.json",
        PDF_PATH,
        DOWNLOAD_DIR / "SOP-PREWORK-START-HERE.md",
    ]
    required.extend(DOWNLOAD_DIR / "skills" / f"{skill['number']}-{skill['name']}.md" for skill in SKILLS)
    for path in required:
        if not path.is_file() or path.stat().st_size < 100:
            errors.append(f"missing or empty resource file: {path.relative_to(PACK_DIR)}")

    for skill in SKILLS:
        root = PACK_DIR / "skills" / skill["name"]
        for relative in ["SKILL.md", "agents/openai.yaml", "assets/input-template.md", "assets/output-template.md"]:
            path = root / relative
            if not path.is_file() or path.stat().st_size < 80:
                errors.append(f"missing or empty native skill file: {path.relative_to(PACK_DIR)}")

    manifest_path = PACK_DIR / "downloads-manifest.json"
    if manifest_path.is_file():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        downloads = manifest.get("downloads", [])
        if manifest.get("distribution") != "individual-files":
            errors.append("public distribution must be individual-files")
        if len(downloads) != 7:
            errors.append(f"expected 7 public downloads, found {len(downloads)}")
        categories = [item.get("category") for item in downloads]
        if categories.count("start-here") != 2 or categories.count("skill") != 5:
            errors.append("public downloads must contain exactly 2 guides and 5 skills")
        if manifest.get("bringYourOwnData") is not True or manifest.get("bundledDataFiles") != 0:
            errors.append("public manifest must declare bring-your-own-data with zero bundled data files")
        for item in downloads:
            path = PACK_DIR / item.get("path", "")
            if not path.is_file():
                errors.append(f"download is missing: {item.get('path')}")
                continue
            if path.suffix == ".zip":
                errors.append(f"public download cannot be a ZIP: {item.get('path')}")
            if item.get("sha256") != digest(path):
                errors.append(f"download checksum mismatch: {item.get('path')}")

    public_files = sorted(path for path in DOWNLOAD_DIR.rglob("*") if path.is_file())
    if len(public_files) != 7:
        errors.append(f"downloads directory must contain exactly 7 files, found {len(public_files)}")
    disallowed_data_suffixes = {".csv", ".tsv", ".xls", ".xlsx", ".parquet", ".jsonl"}
    for path in public_files:
        if path.suffix.lower() not in {".md", ".pdf"}:
            errors.append(f"public download must be PDF or Markdown: {path.relative_to(PACK_DIR)}")
        if path.suffix.lower() in disallowed_data_suffixes:
            errors.append(f"bundled data file is not allowed: {path.relative_to(PACK_DIR)}")

    if PDF_PATH.is_file() and not PDF_PATH.read_bytes().startswith(b"%PDF"):
        errors.append("instruction guide is not a valid PDF file")

    if errors:
        raise ValueError("Resource library validation failed:\n- " + "\n- ".join(errors))


def build() -> None:
    write_download_files()
    build_pdf()
    write_download_manifest()
    write_package_manifest()
    write_checksums()
    validate()
    print(f"Built 7 individual downloads in {DOWNLOAD_DIR}")
    print(f"Instruction PDF: {PDF_PATH}")


if __name__ == "__main__":
    build()
