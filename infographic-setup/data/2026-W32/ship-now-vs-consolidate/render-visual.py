#!/usr/bin/env python3
"""Deterministic 1080x1350 renderer for The Last Defensible Departure."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFont, ImageOps


HERE = Path(__file__).resolve().parent
SETUP_ROOT = HERE.parents[2]
RENDERER = SETUP_ROOT / "renderer"

W, H = 1080, 1350
PAPER = (240, 235, 222, 255)
PAPER_2 = (230, 224, 206, 255)
INK = (31, 43, 224, 255)
INK_SOFT = (85, 96, 229, 255)
GRID = (31, 43, 224, 25)
FAINT = (31, 43, 224, 46)

NEWSREADER_PATH = RENDERER / "node_modules/@fontsource/newsreader/files/newsreader-latin-400-normal.woff2"
HANKEN_400_PATH = RENDERER / "node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-400-normal.woff2"
HANKEN_600_PATH = RENDERER / "node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-600-normal.woff2"
DM_MONO_PATH = RENDERER / "node_modules/@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2"


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


NEWS_82 = font(NEWSREADER_PATH, 82)
NEWS_44 = font(NEWSREADER_PATH, 44)
NEWS_29 = font(NEWSREADER_PATH, 29)
NEWS_22 = font(NEWSREADER_PATH, 22)
HANKEN_27 = font(HANKEN_400_PATH, 27)
HANKEN_16 = font(HANKEN_600_PATH, 16)
HANKEN_18 = font(HANKEN_600_PATH, 18)
MONO_27 = font(DM_MONO_PATH, 27)
MONO_25 = font(DM_MONO_PATH, 25)
MONO_17 = font(DM_MONO_PATH, 17)
MONO_16 = font(DM_MONO_PATH, 16)
MONO_15 = font(DM_MONO_PATH, 15)
MONO_14 = font(DM_MONO_PATH, 14)
MONO_13 = font(DM_MONO_PATH, 13)
MONO_11 = font(DM_MONO_PATH, 11)
MONO_10 = font(DM_MONO_PATH, 10)
MONO_9 = font(DM_MONO_PATH, 9)


def tracked_width(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, tracking: float) -> float:
    if not text:
        return 0
    return sum(draw.textlength(ch, font=fnt) for ch in text) + tracking * (len(text) - 1)


def tracked_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[float, float],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int, int],
    tracking: float = 1.0,
    anchor: str = "la",
) -> None:
    x, y = xy
    width = tracked_width(draw, text, fnt, tracking)
    if anchor.startswith("r"):
        x -= width
    elif anchor.startswith("m"):
        x -= width / 2
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill, anchor="la")
        x += draw.textlength(ch, font=fnt) + tracking


def draw_stamp(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    text: str,
    dashed: bool = False,
) -> int:
    padding_x = 13
    h = 42
    arrow_text = "→" in text
    if arrow_text:
        left_text, right_text = [part.strip() for part in text.split("→", 1)]
        tw = int(tracked_width(draw, left_text, MONO_15, 0.6)) + 43 + int(tracked_width(draw, right_text, MONO_15, 0.6))
    else:
        tw = int(tracked_width(draw, text, MONO_15, 0.6))
    w = tw + padding_x * 2
    draw.rectangle((x, y, x + w, y + h), fill=PAPER)
    if dashed:
        dash = 7
        for xx in range(x, x + w, dash * 2):
            draw.line((xx, y, min(xx + dash, x + w), y), fill=INK, width=2)
            draw.line((xx, y + h, min(xx + dash, x + w), y + h), fill=INK, width=2)
        for yy in range(y, y + h, dash * 2):
            draw.line((x, yy, x, min(yy + dash, y + h)), fill=INK, width=2)
            draw.line((x + w, yy, x + w, min(yy + dash, y + h)), fill=INK, width=2)
    else:
        draw.rectangle((x, y, x + w, y + h), outline=INK, width=2)
    if arrow_text:
        cursor = x + padding_x
        tracked_text(draw, (cursor, y + 11), left_text, MONO_15, INK, 0.6)
        cursor += tracked_width(draw, left_text, MONO_15, 0.6) + 10
        arrow_y = y + 21
        draw.line((cursor, arrow_y, cursor + 19, arrow_y), fill=INK, width=2)
        draw.line((cursor + 19, arrow_y, cursor + 13, arrow_y - 5), fill=INK, width=2)
        draw.line((cursor + 19, arrow_y, cursor + 13, arrow_y + 5), fill=INK, width=2)
        tracked_text(draw, (cursor + 29, y + 11), right_text, MONO_15, INK, 0.6)
    else:
        tracked_text(draw, (x + padding_x, y + 11), text, MONO_15, INK, 0.6)
    return w


def label(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, width: int | None = None, right: bool = False) -> None:
    lines = text.split("\n")
    text_width = max(int(tracked_width(draw, line, MONO_16, 0.75)) for line in lines)
    w = width or text_width + 12
    h = 26 if len(lines) == 1 else 43
    left = x - w if right else x
    draw.rectangle((left, y, left + w, y + h), fill=PAPER)
    for index, line in enumerate(lines):
        anchor = "ra" if right else "la"
        tx = left + w - 6 if right else left + 6
        tracked_text(draw, (tx, y + 4 + index * 17), line, MONO_16, INK, 0.75, anchor)
    draw.line((left, y + h, left + w, y + h), fill=INK, width=2)


def duotone_hero(source: Path, size: tuple[int, int]) -> Image.Image:
    image = Image.open(source).convert("RGB")
    crop = image.crop((0, 386, image.width, 1018)).resize(size, Image.Resampling.LANCZOS)
    luminance = ImageOps.grayscale(crop)
    # Suppress the cream ground while retaining the generated cobalt line density.
    alpha = luminance.point(lambda value: max(0, min(255, int((235 - value) * 2.35))))
    alpha = ImageEnhance.Contrast(alpha).enhance(1.08)
    ink_layer = Image.new("RGBA", size, INK)
    ink_layer.putalpha(alpha)
    return ink_layer


def draw_ruler(draw: ImageDraw.ImageDraw, x1: int, x2: int, y: int, dashed: bool = False) -> None:
    if dashed:
        for x in range(x1, x2, 22):
            draw.line((x, y, min(x + 12, x2), y), fill=INK, width=5)
    else:
        draw.line((x1, y, x2, y), fill=INK, width=5)
    for x in range(x1, x2 + 1, 23):
        draw.line((x, y, x, y + 10), fill=INK, width=2)
    draw.line((x2, y - 10, x2, y + 28), fill=INK, width=5)


def fit_wordmark(source: Path, max_size: tuple[int, int]) -> Image.Image:
    logo = Image.open(source).convert("RGBA")
    alpha = logo.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        alpha = alpha.crop(bbox)
    alpha.thumbnail(max_size, Image.Resampling.LANCZOS)
    mark = Image.new("RGBA", alpha.size, INK)
    mark.putalpha(alpha)
    return mark


def render(output_path: Path) -> None:
    canvas = Image.new("RGBA", (W, H), PAPER)
    grid_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid_layer)
    for x in range(0, W + 1, 24):
        grid_draw.line((x, 0, x, H), fill=GRID, width=1)
    for y in range(0, H + 1, 24):
        grid_draw.line((0, y, W, y), fill=GRID, width=1)
    canvas = Image.alpha_composite(canvas, grid_layer)
    draw = ImageDraw.Draw(canvas)

    draw.line((48, 46, 1032, 46), fill=INK, width=2)
    draw.line((48, 1304, 1032, 1304), fill=INK, width=2)

    # Compact pixel signature; kept subordinate to the route.
    for row in range(6):
        for col in range(7):
            if (row + col) % 2 == 0:
                draw.rectangle((918 + col * 15, 76 + row * 8, 925 + col * 15, 82 + row * 8), fill=FAINT)

    tracked_text(draw, (72, 69), "C3 / SHIPMENT RELEASE RULE", HANKEN_16, INK, 1.6)
    tracked_text(draw, (1008, 69), "FORMULA + METHOD", HANKEN_16, INK, 1.6, "ra")
    draw.text((72, 103), "THE LAST DEFENSIBLE", font=NEWS_82, fill=INK)
    draw.text((72, 173), "DEPARTURE", font=NEWS_82, fill=INK)
    draw.text((72, 260), "A freight saving does not give a ready shipment permission to wait.", font=HANKEN_27, fill=INK)

    hero = duotone_hero(HERE / "hero-route-switch-v1.png", (1020, 575))
    canvas.alpha_composite(hero, (30, 305))
    draw = ImageDraw.Draw(canvas)

    x = 72
    x += draw_stamp(draw, x, 319, "01 / COMPATIBLE?") + 10
    x += draw_stamp(draw, x, 319, "02 / INPUTS CURRENT?") + 10
    draw_stamp(draw, x, 319, "NO → DATA STOP", dashed=True)

    label(draw, 82, 532, "SHIPMENT A READY")
    label(draw, 548, 480, "SHIP NOW")
    label(draw, 548, 696, "WAIT + CONSOLIDATE")
    label(draw, 1018, 422, "CUSTOMER\nNEED-BY", width=182, right=True)
    draw.rectangle((596, 754, 912, 798), fill=PAPER)
    tracked_text(draw, (604, 760), "TEST BEST / BASE / WORST", MONO_14, INK, 0.65)
    tracked_text(draw, (604, 778), "SENSITIVITY CASES", MONO_14, INK, 0.65)

    # Formula zone.
    draw.rectangle((72, 850, 1008, 1118), fill=(240, 235, 222, 246))
    draw.line((72, 850, 1008, 850), fill=INK, width=2)
    draw.line((72, 1118, 1008, 1118), fill=FAINT, width=1)

    tracked_text(draw, (72, 879), "03 / SERVICE-SAFE HOLD", MONO_14, INK, 0.9)
    tracked_text(draw, (1008, 879), "04 / ECONOMIC BREAK-EVEN HOLD", MONO_14, INK, 0.9, "ra")
    draw_ruler(draw, 72, 454, 922, dashed=False)
    draw_ruler(draw, 626, 1008, 922, dashed=True)
    draw.text((540, 896), "min", font=NEWS_44, fill=INK, anchor="ma")
    tracked_text(draw, (540, 947), "SMALLER LIMIT", MONO_10, INK, 0.45, "ma")
    tracked_text(draw, (540, 961), "GOVERNS", MONO_10, INK, 0.45, "ma")

    # Highlighted formula key.
    key = "PERMITTED HOLD"
    key_width = int(draw.textlength(key, font=MONO_27)) + 14
    draw.rectangle((72, 989, 72 + key_width, 1025), fill=INK)
    draw.text((79, 992), key, font=MONO_27, fill=PAPER)
    formula_x = 72 + key_width + 10
    draw.text((formula_x, 992), "= MIN(SERVICE-SAFE HOLD,", font=MONO_27, fill=INK)
    draw.text((formula_x, 1027), "ECONOMIC BREAK-EVEN HOLD)", font=MONO_27, fill=INK)
    draw.text((72, 1070), "ROBUST LIMIT = SMALLEST PERMITTED HOLD ACROSS CREDIBLE SCENARIOS", font=MONO_17, fill=INK)

    # Decision rail.
    top, bottom = 1140, 1244
    draw.rectangle((72, top, 1008, bottom), fill=(240, 235, 222, 248))
    draw.line((72, top, 1008, top), fill=INK, width=2)
    draw.line((72, bottom, 1008, bottom), fill=INK, width=2)
    col_1 = 72 + 300
    col_2 = col_1 + 330
    draw.line((col_1, top, col_1, bottom), fill=FAINT, width=1)
    draw.line((col_2, top, col_2, bottom), fill=FAINT, width=1)

    tracked_text(draw, (89, 1152), "ANY CREDIBLE SERVICE MISS", HANKEN_18, INK, 0.3)
    draw.text((89, 1191), "SHIP NOW", font=NEWS_29, fill=INK)
    draw.text((390, 1148), "NEITHER OPTION", font=HANKEN_16, fill=INK)
    draw.text((390, 1167), "PROTECTS THE DATE", font=HANKEN_16, fill=INK)
    draw.text((390, 1194), "REPLAN / EXPEDITE", font=NEWS_29, fill=INK)
    tracked_text(draw, (720, 1152), "EXCEPTION", HANKEN_18, INK, 0.3)
    draw.text((720, 1181), "KAM + PURCHASING", font=NEWS_22, fill=INK)
    draw.text((720, 1204), "MANAGER", font=NEWS_22, fill=INK)

    # Footer and exact official wordmark geometry.
    tracked_text(draw, (72, 1257), "BEST / BASE / WORST = SENSITIVITY CASES, NOT PROBABILITIES", MONO_9, INK, 0.3)
    tracked_text(draw, (72, 1272), "SCOPE: TWO COMPATIBLE INBOUND ORDERS + CURRENT COMPARABLE QUOTES · AI-ASSISTED VISUAL", MONO_9, INK, 0.20)
    mark = fit_wordmark(
        SETUP_ROOT / "data/2026-W30/optimal-batch-size-decision-board/shetty-logo2-official-wordmark-only.png",
        (230, 40),
    )
    canvas.alpha_composite(mark, (760, 1252 + (40 - mark.height) // 2))
    draw = ImageDraw.Draw(canvas)
    tracked_text(draw, (1008, 1264), "001", MONO_13, INK, 0.4, "ra")

    rgb = Image.new("RGB", canvas.size, PAPER[:3])
    rgb.paste(canvas, mask=canvas.getchannel("A"))
    rgb.save(output_path, format="PNG", optimize=True)


if __name__ == "__main__":
    destination = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "html-control.png"
    render(destination.resolve())
    print(destination.resolve())
