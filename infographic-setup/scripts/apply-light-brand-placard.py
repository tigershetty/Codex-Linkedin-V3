#!/usr/bin/env python3
"""Replace one raster placard while preserving the rest of the source image."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


SCALE = 4


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", (size[0] * SCALE, size[1] * SCALE), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle(
        (0, 0, size[0] * SCALE - 1, size[1] * SCALE - 1),
        radius=radius * SCALE,
        fill=255,
    )
    return mask.resize(size, Image.Resampling.LANCZOS)


def vertical_gradient(
    size: tuple[int, int], top: tuple[int, int, int, int], bottom: tuple[int, int, int, int]
) -> Image.Image:
    width, height = size
    gradient = Image.new("RGBA", size)
    pixels = gradient.load()
    for y in range(height):
        amount = y / max(height - 1, 1)
        color = tuple(round(a + (b - a) * amount) for a, b in zip(top, bottom))
        for x in range(width):
            pixels[x, y] = color
    return gradient


def draw_bolt(canvas: Image.Image, center: tuple[int, int], radius: int) -> None:
    x, y = center
    draw = ImageDraw.Draw(canvas)
    rings = (
        (radius + 2, (10, 42, 84, 90)),
        (radius + 1, (63, 112, 166, 255)),
        (radius, (220, 232, 244, 255)),
        (radius - 2, (136, 158, 180, 255)),
        (radius - 4, (240, 247, 252, 255)),
    )
    for ring_radius, fill in rings:
        draw.ellipse(
            (x - ring_radius, y - ring_radius, x + ring_radius, y + ring_radius),
            fill=fill,
        )
    draw.arc((x - radius + 2, y - radius + 2, x + radius - 2, y + radius - 2), 205, 345, fill=(255, 255, 255, 220), width=1)


def build_placard(size: tuple[int, int], logo_path: Path) -> Image.Image:
    width, height = size
    radius = max(9, round(height * 0.16))
    placard = Image.new("RGBA", size, (0, 0, 0, 0))

    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (2, 5, width - 3, height - 1),
        radius=radius,
        fill=(4, 34, 78, 105),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(5))
    placard.alpha_composite(shadow)

    plate_box = (2, 1, width - 3, height - 5)
    plate_size = (plate_box[2] - plate_box[0] + 1, plate_box[3] - plate_box[1] + 1)
    plate = vertical_gradient(plate_size, (255, 255, 255, 255), (230, 237, 245, 255))
    plate.putalpha(rounded_mask(plate_size, radius))
    placard.alpha_composite(plate, (plate_box[0], plate_box[1]))

    draw = ImageDraw.Draw(placard)
    draw.rounded_rectangle(plate_box, radius=radius, outline=(73, 138, 222, 255), width=2)
    draw.rounded_rectangle(
        (5, 4, width - 6, height - 8),
        radius=max(radius - 3, 5),
        outline=(255, 255, 255, 225),
        width=1,
    )
    draw.line((radius + 6, height - 6, width - radius - 7, height - 6), fill=(20, 99, 238, 165), width=2)

    bolt_radius = max(5, round(height * 0.09))
    bolt_x = 24
    bolt_y = 20
    for center in (
        (bolt_x, bolt_y),
        (width - bolt_x - 1, bolt_y),
        (bolt_x, height - bolt_y - 3),
        (width - bolt_x - 1, height - bolt_y - 3),
    ):
        draw_bolt(placard, center, bolt_radius)

    logo = Image.open(logo_path).convert("RGBA")
    alpha_box = logo.getchannel("A").getbbox()
    if alpha_box:
        logo = logo.crop(alpha_box)
    max_logo_height = max(1, height - 20)
    max_logo_width = round(width * 0.17)
    ratio = min(max_logo_width / logo.width, max_logo_height / logo.height)
    logo = logo.resize(
        (max(1, round(logo.width * ratio)), max(1, round(logo.height * ratio))),
        Image.Resampling.LANCZOS,
    )
    placard.alpha_composite(
        logo,
        ((width - logo.width) // 2, (height - logo.height) // 2 - 1),
    )
    return placard


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--logo", type=Path, required=True)
    parser.add_argument("--box", type=int, nargs=4, metavar=("X", "Y", "W", "H"), required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    source = Image.open(args.input).convert("RGBA")
    x, y, width, height = args.box
    placard = build_placard((width, height), args.logo)
    source.alpha_composite(placard, (x, y))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    source.convert("RGB").save(args.output, quality=100)


if __name__ == "__main__":
    main()
