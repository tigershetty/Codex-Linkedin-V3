#!/usr/bin/env python3
"""Remove a rendered logo from a smooth zone and place the exact asset."""

from __future__ import annotations

import argparse
import colorsys
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


def parse_replace(value: str) -> tuple[Path, tuple[int, int, int, int], tuple[int, int, int, int], str]:
    parts = value.split("|")
    if len(parts) != 10:
        raise argparse.ArgumentTypeError(
            "--replace must be logo|x|y|w|h|mask_x|mask_y|mask_w|mask_h|dark|ink"
        )
    path = Path(parts[0])
    try:
        x, y, w, h, mx, my, mw, mh = (int(part) for part in parts[1:9])
    except ValueError as exc:
        raise argparse.ArgumentTypeError("replace coordinates must be integers") from exc
    mode = parts[9]
    if mode not in {"dark", "ink", "all"}:
        raise argparse.ArgumentTypeError("replace mode must be dark, ink, or all")
    return path, (x, y, w, h), (mx, my, mw, mh), mode


def fit_within(image: Image.Image, width: int, height: int) -> Image.Image:
    alpha_box = image.getchannel("A").getbbox()
    if alpha_box:
        image = image.crop(alpha_box)
    scale = min(width / image.width, height / image.height)
    size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    return image.resize(size, Image.Resampling.LANCZOS)


def smooth_zone(zone: Image.Image) -> Image.Image:
    """Reconstruct a smooth background from narrow left and right edge samples."""
    rgb = zone.convert("RGB")
    left = rgb.crop((0, 0, min(5, rgb.width), rgb.height)).resize((1, rgb.height))
    right = rgb.crop((max(0, rgb.width - 5), 0, rgb.width, rgb.height)).resize((1, rgb.height))
    clean = Image.new("RGB", rgb.size)
    out = clean.load()
    lp = left.load()
    rp = right.load()
    denominator = max(1, rgb.width - 1)
    for y in range(rgb.height):
        for x in range(rgb.width):
            t = x / denominator
            out[x, y] = tuple(round(lp[0, y][channel] * (1 - t) + rp[0, y][channel] * t) for channel in range(3))
    return clean.filter(ImageFilter.GaussianBlur(1.2))


def rendered_ink_mask(zone: Image.Image, mode: str) -> Image.Image:
    if mode == "all":
        return Image.new("L", zone.size, 255)
    rgb = zone.convert("RGB")
    mask = Image.new("L", rgb.size, 0)
    src = rgb.load()
    dst = mask.load()
    for y in range(rgb.height):
        for x in range(rgb.width):
            red, green, blue = src[x, y]
            luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
            saturation = colorsys.rgb_to_hsv(red / 255, green / 255, blue / 255)[1] * 255
            is_ink = luminance < 145 or (mode == "ink" and saturation > 52)
            dst[x, y] = 255 if is_ink else 0
    return mask.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(0.7))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--replace", action="append", required=True, type=parse_replace)
    args = parser.parse_args()

    base = Image.open(args.base).convert("RGBA")
    for logo_path, logo_box, mask_box, mode in args.replace:
        x, y, width, height = logo_box
        mx, my, mask_width, mask_height = mask_box
        zone = base.crop((mx, my, mx + mask_width, my + mask_height))
        clean = smooth_zone(zone)
        mask = rendered_ink_mask(zone, mode)
        cleaned_zone = Image.composite(clean, zone.convert("RGB"), mask).convert("RGBA")
        base.alpha_composite(cleaned_zone, (mx, my))

        logo = fit_within(Image.open(logo_path).convert("RGBA"), width, height)
        ox = x + (width - logo.width) // 2
        oy = y + (height - logo.height) // 2
        base.alpha_composite(logo, (ox, oy))

    args.out.parent.mkdir(parents=True, exist_ok=True)
    base.save(args.out)
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    main()
