#!/usr/bin/env python3
"""Promote a portrait candidate to an exact 1080 x 1350 LinkedIn still."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter


TARGET_SIZE = (1080, 1350)
GROUND = Image.new("RGB", TARGET_SIZE, "#F7FBFF")


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    scale = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def fit(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    scale = min(size[0] / image.width, size[1] / image.height)
    return image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )


def safe_crop(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Center-crop a prompt-safe candidate to 4:5, then resize once."""
    target_ratio = size[0] / size[1]
    source_ratio = image.width / image.height
    if source_ratio > target_ratio:
        crop_width = round(image.height * target_ratio)
        left = (image.width - crop_width) // 2
        cropped = image.crop((left, 0, left + crop_width, image.height))
    else:
        crop_height = round(image.width / target_ratio)
        top = (image.height - crop_height) // 2
        cropped = image.crop((0, top, image.width, top + crop_height))
    return cropped.resize(size, Image.Resampling.LANCZOS)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument(
        "--canonical",
        type=Path,
        help="Optional visual.png destination. Receives the exact same bytes as --out.",
    )
    parser.add_argument(
        "--mode",
        choices=("safe-crop", "legacy-fit"),
        default="safe-crop",
        help="Use prompt-safe center cropping for new work; legacy-fit preserves old tall masters.",
    )
    parser.add_argument(
        "--edge-feather",
        type=int,
        default=10,
        help="Horizontal source-edge blend in pixels after fitting",
    )
    args = parser.parse_args()

    source = Image.open(args.input).convert("RGB")

    if args.mode == "safe-crop":
        output = safe_crop(source, TARGET_SIZE)
    else:
        # Legacy recovery: preserve the full tall artifact on a quiet branded
        # field when no prompt-safe 4:5 source can be regenerated.
        background = cover(source, TARGET_SIZE).filter(ImageFilter.GaussianBlur(42))
        background = ImageEnhance.Color(background).enhance(0.35)
        canvas = Image.blend(background, GROUND, 0.88).convert("RGBA")
        foreground = fit(source, TARGET_SIZE).convert("RGBA")
        x = (TARGET_SIZE[0] - foreground.width) // 2
        y = (TARGET_SIZE[1] - foreground.height) // 2

        mask = Image.new("L", foreground.size, 255)
        feather = max(0, min(args.edge_feather, foreground.width // 3))
        if feather:
            pixels = mask.load()
            for offset in range(feather):
                alpha = round(255 * (offset + 1) / feather)
                for row in range(mask.height):
                    pixels[offset, row] = alpha
                    pixels[mask.width - offset - 1, row] = alpha

        canvas.paste(foreground, (x, y), mask)
        output = canvas.convert("RGB")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    output.save(args.out, format="PNG", optimize=True)
    if args.canonical:
        args.canonical.parent.mkdir(parents=True, exist_ok=True)
        args.canonical.write_bytes(args.out.read_bytes())
    destinations = f" and {args.canonical}" if args.canonical else ""
    print(
        f"Wrote {args.out}{destinations} at {TARGET_SIZE[0]} x {TARGET_SIZE[1]} "
        f"using {args.mode}"
    )


if __name__ == "__main__":
    main()
