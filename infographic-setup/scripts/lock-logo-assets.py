#!/usr/bin/env python3
"""Overlay exact logo/image assets onto a generated PNG.

Use this after GPT Image 2 reserves a logo area but before treating an image as
publish-ready. It keeps the generative composition while making brand marks
deterministic.
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Optional

from PIL import Image, ImageColor, ImageDraw


def parse_overlay(value: str) -> tuple[Path, int, int, int, int, Optional[str]]:
    parts = value.split("|")
    if len(parts) not in (5, 6):
        raise argparse.ArgumentTypeError(
            "--overlay must be path|x|y|w|h or path|x|y|w|h|cover"
        )

    path = Path(parts[0])
    try:
      x, y, w, h = (int(part) for part in parts[1:5])
    except ValueError as exc:
        raise argparse.ArgumentTypeError("overlay x/y/w/h must be integers") from exc

    cover = parts[5] if len(parts) == 6 and parts[5] else None
    return path, x, y, w, h, cover


def fit_within(image: Image.Image, width: int, height: int) -> Image.Image:
    scale = min(width / image.width, height / image.height)
    target = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    return image.resize(target, Image.Resampling.LANCZOS)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", required=True, type=Path, help="Generated base PNG")
    parser.add_argument("--out", required=True, type=Path, help="Output PNG")
    parser.add_argument(
        "--overlay",
        action="append",
        required=True,
        type=parse_overlay,
        help="Overlay spec: path|x|y|w|h or path|x|y|w|h|cover",
    )
    args = parser.parse_args()

    base = Image.open(args.base).convert("RGBA")

    for path, x, y, w, h, cover in args.overlay:
        logo = Image.open(path).convert("RGBA")

        if cover:
            draw = ImageDraw.Draw(base)
            draw.rectangle([x, y, x + w, y + h], fill=ImageColor.getcolor(cover, "RGBA"))

        fitted = fit_within(logo, w, h)
        ox = x + (w - fitted.width) // 2
        oy = y + (h - fitted.height) // 2
        base.alpha_composite(fitted, (ox, oy))

    args.out.parent.mkdir(parents=True, exist_ok=True)
    base.save(args.out)
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    main()
