#!/usr/bin/env python3
"""Build a deterministic, provenance-preserving index of the supplied Pierri corpus.

This script deliberately does not alter the source workbook or media directory. It records
numeric-ID associations as asserted-by-ID only: the supplied workbook contains no original
post URL, date, or media-linkage field, and at least one inspected record is a known mismatch.

Usage:
  python3 build-vincent-pierri-corpus-index.py
  python3 build-vincent-pierri-corpus-index.py --source /path/to/source --output /path/to/index.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import struct
import zipfile
from collections import Counter
from pathlib import Path
from statistics import median
from typing import Any
from xml.etree import ElementTree as ET


SPREADSHEET_NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
CELL_REF_RE = re.compile(r"^([A-Z]+)(\d+)$")
MEDIA_SUFFIXES = {".gif", ".jpeg", ".jpg"}

# This is a manual-review exception, not an inference from the workbook. It prevents downstream
# consumers from silently pairing asset 2 with caption 2 simply because their filenames match.
KNOWN_PAIRING_WARNINGS = {
    2: (
        "Manual visual inspection found that asset 2 and workbook caption 2 describe different "
        "pieces. Treat this record as a known mismatch unless original post provenance resolves it."
    )
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def gif_metadata(path: Path) -> dict[str, Any]:
    """Read GIF dimensions, frame count, and GCE delay duration with stdlib only."""

    data = path.read_bytes()
    if len(data) < 13 or data[:6] not in (b"GIF87a", b"GIF89a"):
        raise ValueError(f"Not a supported GIF: {path}")

    width, height = struct.unpack_from("<HH", data, 6)
    packed = data[10]
    position = 13
    if packed & 0b10000000:
        position += 3 * (2 ** ((packed & 0b00000111) + 1))

    frame_count = 0
    duration_ms = 0
    pending_delay_ms = 0

    def skip_sub_blocks(offset: int) -> int:
        while offset < len(data):
            block_size = data[offset]
            offset += 1
            if block_size == 0:
                return offset
            offset += block_size
        return offset

    while position < len(data):
        marker = data[position]
        position += 1

        if marker == 0x3B:  # trailer
            break
        if marker == 0x21:  # extension
            if position >= len(data):
                break
            label = data[position]
            position += 1
            if label == 0xF9 and position + 5 <= len(data):  # graphics control extension
                block_size = data[position]
                position += 1
                if block_size == 4 and position + 5 <= len(data):
                    # Packed field, delay (hundredths), transparent index, block terminator.
                    delay_centiseconds = struct.unpack_from("<H", data, position + 1)[0]
                    pending_delay_ms = delay_centiseconds * 10
                    position += 5
                else:
                    position = skip_sub_blocks(position)
            else:
                position = skip_sub_blocks(position)
            continue
        if marker != 0x2C:  # not an image descriptor; tolerate malformed extension-like data
            continue
        if position + 9 > len(data):
            break

        image_packed = data[position + 8]
        position += 9
        if image_packed & 0b10000000:
            position += 3 * (2 ** ((image_packed & 0b00000111) + 1))
        if position >= len(data):
            break
        position += 1  # LZW minimum code size
        position = skip_sub_blocks(position)
        frame_count += 1
        duration_ms += pending_delay_ms
        pending_delay_ms = 0

    return {
        "format": "gif",
        "width": width,
        "height": height,
        "frame_count": frame_count,
        "duration_ms_from_gce": duration_ms,
    }


def jpeg_metadata(path: Path) -> dict[str, Any]:
    """Read JPEG dimensions using SOF markers without an image-processing dependency."""

    data = path.read_bytes()
    if not data.startswith(b"\xff\xd8"):
        raise ValueError(f"Not a supported JPEG: {path}")

    position = 2
    sof_markers = {
        0xC0,
        0xC1,
        0xC2,
        0xC3,
        0xC5,
        0xC6,
        0xC7,
        0xC9,
        0xCA,
        0xCB,
        0xCD,
        0xCE,
        0xCF,
    }
    while position < len(data):
        while position < len(data) and data[position] != 0xFF:
            position += 1
        while position < len(data) and data[position] == 0xFF:
            position += 1
        if position >= len(data):
            break
        marker = data[position]
        position += 1
        if marker in {0xD8, 0xD9} or 0xD0 <= marker <= 0xD7:
            continue
        if position + 2 > len(data):
            break
        segment_length = struct.unpack_from(">H", data, position)[0]
        if segment_length < 2 or position + segment_length > len(data):
            break
        if marker in sof_markers and segment_length >= 8:
            height, width = struct.unpack_from(">HH", data, position + 3)
            return {"format": "jpeg", "width": width, "height": height}
        position += segment_length
    raise ValueError(f"Could not find JPEG dimensions: {path}")


def media_metadata(path: Path) -> dict[str, Any]:
    if path.suffix.lower() == ".gif":
        metadata = gif_metadata(path)
    else:
        metadata = jpeg_metadata(path)
    metadata.update(
        {
            "filename": path.name,
            "relative_source_path": path.name,
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
        }
    )
    return metadata


def shared_strings(archive: zipfile.ZipFile) -> list[str]:
    root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    strings: list[str] = []
    for item in root.findall(f"{SPREADSHEET_NS}si"):
        strings.append("".join(node.text or "" for node in item.iter(f"{SPREADSHEET_NS}t")))
    return strings


def cell_value(cell: ET.Element, strings: list[str]) -> str | int | float | None:
    cell_type = cell.attrib.get("t")
    value_node = cell.find(f"{SPREADSHEET_NS}v")
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.iter(f"{SPREADSHEET_NS}t"))
    if value_node is None or value_node.text is None:
        return None
    raw = value_node.text
    if cell_type == "s":
        return strings[int(raw)]
    if cell_type == "b":
        return raw == "1"
    try:
        number = float(raw)
    except ValueError:
        return raw
    return int(number) if number.is_integer() else number


def workbook_cells(workbook: Path) -> dict[int, dict[str, Any]]:
    with zipfile.ZipFile(workbook) as archive:
        strings = shared_strings(archive)
        sheet = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))

    rows: dict[int, dict[str, Any]] = {}
    for cell in sheet.iter(f"{SPREADSHEET_NS}c"):
        reference = cell.attrib.get("r", "")
        match = CELL_REF_RE.match(reference)
        if not match:
            continue
        column, row_number = match.groups()
        rows.setdefault(int(row_number), {})[column] = cell_value(cell, strings)
    return rows


def word_count(value: str | None) -> int | None:
    if not value:
        return None
    return len(re.findall(r"\b[\w’'-]+\b", value))


def numeric_asset_id(path: Path) -> int:
    return int(path.stem)


def relative_to_repo(path: Path, repo_root: Path) -> str:
    return path.relative_to(repo_root).as_posix()


def build_index(source: Path, output: Path, repo_root: Path) -> dict[str, Any]:
    workbook = source / "Vincent Pierri.xlsx"
    if not workbook.is_file():
        raise FileNotFoundError(f"Expected workbook not found: {workbook}")

    assets: dict[int, dict[str, Any]] = {}
    for path in sorted(
        (candidate for candidate in source.iterdir() if candidate.suffix.lower() in MEDIA_SUFFIXES),
        key=numeric_asset_id,
    ):
        asset_id = numeric_asset_id(path)
        metadata = media_metadata(path)
        metadata["relative_source_path"] = relative_to_repo(path, repo_root)
        assets[asset_id] = metadata

    rows = workbook_cells(workbook)
    indexed_rows = []
    unlinked_cells = []
    for row_number, row in sorted(rows.items()):
        maybe_id = row.get("A")
        if isinstance(maybe_id, int) and maybe_id > 0:
            indexed_rows.append((row_number, maybe_id, row))
            for column, value in sorted(row.items()):
                if column not in {"A", "B", "C"} and value not in (None, ""):
                    unlinked_cells.append(
                        {
                            "cell": f"{column}{row_number}",
                            "value": value,
                            "status": "unlinked_source_note_on_indexed_row",
                        }
                    )
        else:
            for column, value in sorted(row.items()):
                if value not in (None, ""):
                    unlinked_cells.append(
                        {"cell": f"{column}{row_number}", "value": value, "status": "unlinked_source_note"}
                    )

    workbook_ids = sorted({post_id for _, post_id, _ in indexed_rows})
    records: list[dict[str, Any]] = []
    captions_by_id: dict[int, str] = {}
    for row_number, post_id, row in indexed_rows:
        caption = row.get("B") if isinstance(row.get("B"), str) and row.get("B").strip() else None
        creator = row.get("C") if isinstance(row.get("C"), str) and row.get("C").strip() else None
        if caption:
            captions_by_id[post_id] = caption
        asset = assets.get(post_id)
        warning = KNOWN_PAIRING_WARNINGS.get(post_id)
        if asset and caption and warning:
            pairing_status = "known_manual_mismatch"
        elif asset and caption:
            pairing_status = "asserted_by_numeric_id"
        elif asset:
            pairing_status = "asset_only"
        elif caption:
            pairing_status = "caption_only"
        else:
            pairing_status = "source_row_without_caption_or_asset"
        records.append(
            {
                "post_id": post_id,
                "workbook_row": row_number,
                "creator": creator,
                "caption": caption,
                "caption_word_count": word_count(caption),
                "asset": asset,
                "pairing_status": pairing_status,
                "pairing_warning": warning,
                "pairing_provenance": (
                    "The source provides matching numeric IDs only. It does not provide an original post URL, "
                    "date, media link, or an explicit asset-to-caption key."
                ),
            }
        )

    workbook_id_set = set(workbook_ids)
    for asset_id, asset in sorted(assets.items()):
        if asset_id in workbook_id_set:
            continue
        records.append(
            {
                "post_id": asset_id,
                "workbook_row": None,
                "creator": None,
                "caption": None,
                "caption_word_count": None,
                "asset": asset,
                "pairing_status": "asset_only_no_workbook_row",
                "pairing_warning": None,
                "pairing_provenance": "No row with this numeric ID exists in the supplied workbook.",
            }
        )

    records.sort(key=lambda record: record["post_id"])
    gif_assets = [asset for asset in assets.values() if asset["format"] == "gif"]
    jpeg_assets = [asset for asset in assets.values() if asset["format"] == "jpeg"]
    gif_durations = [asset["duration_ms_from_gce"] for asset in gif_assets]
    gif_frames = [asset["frame_count"] for asset in gif_assets]
    dimension_counts = Counter(f"{asset['width']}x{asset['height']}" for asset in assets.values())
    caption_word_counts = [word_count(caption) for caption in captions_by_id.values()]
    pairing_counts = Counter(record["pairing_status"] for record in records)

    index = {
        "schema_version": "1.0.0",
        "index_purpose": "Internal creative-reference provenance and retrieval aid; not a performance dataset.",
        "source": {
            "workbook": relative_to_repo(workbook, repo_root),
            "media_directory": relative_to_repo(source, repo_root),
            "source_preservation": "The raw user-supplied source is read only by this script.",
        },
        "known_limitations": [
            "The workbook has no original LinkedIn URLs, dates, native metrics, or explicit media-to-caption links.",
            "Matching numeric IDs are asserted-by-ID only, never verified post provenance.",
            "Asset 2 is a known manual visual/caption mismatch and must not be auto-paired.",
            "GIF duration is the sum of Graphics Control Extension delays; actual social-platform playback may differ.",
            "This corpus is a curated creative-reference set, not a random sample or causal performance study.",
        ],
        "summary": {
            "workbook_numeric_id_count": len(workbook_ids),
            "workbook_id_min": min(workbook_ids) if workbook_ids else None,
            "workbook_id_max": max(workbook_ids) if workbook_ids else None,
            "caption_count": len(captions_by_id),
            "asset_count": len(assets),
            "gif_count": len(gif_assets),
            "jpeg_count": len(jpeg_assets),
            "asset_ids_missing_within_media_range": [
                identifier
                for identifier in range(min(assets), max(assets) + 1)
                if identifier not in assets
            ],
            "pairing_status_counts": dict(sorted(pairing_counts.items())),
            "dimension_counts": dict(sorted(dimension_counts.items())),
            "gif_motion_metadata": {
                "frame_count_min": min(gif_frames) if gif_frames else None,
                "frame_count_median": median(gif_frames) if gif_frames else None,
                "frame_count_max": max(gif_frames) if gif_frames else None,
                "duration_ms_min": min(gif_durations) if gif_durations else None,
                "duration_ms_median": median(gif_durations) if gif_durations else None,
                "duration_ms_max": max(gif_durations) if gif_durations else None,
                "duration_method": "Sum of GIF Graphics Control Extension frame delays.",
            },
            "caption_word_count": {
                "min": min(caption_word_counts) if caption_word_counts else None,
                "median": median(caption_word_counts) if caption_word_counts else None,
                "max": max(caption_word_counts) if caption_word_counts else None,
                "method": "Regex token count; only captions present in the supplied workbook.",
            },
        },
        "unlinked_workbook_cells": unlinked_cells,
        "records": records,
    }

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return index


def parse_args() -> argparse.Namespace:
    repo_root = Path(__file__).resolve().parents[3]
    default_source = repo_root / "infographic-setup/references/Vincent Pierri Reference"
    default_output = Path(__file__).resolve().with_name("vincent-pierri-corpus-index-v1.json")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=default_source)
    parser.add_argument("--output", type=Path, default=default_output)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    repo_root = Path(__file__).resolve().parents[3]
    index = build_index(args.source.resolve(), args.output.resolve(), repo_root)
    summary = index["summary"]
    print(
        "Indexed "
        f"{summary['asset_count']} assets ({summary['gif_count']} GIF, {summary['jpeg_count']} JPEG) and "
        f"{summary['caption_count']} captions -> {args.output}"
    )


if __name__ == "__main__":
    main()
