from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "infographic-setup/data/2026-W30/optimal-batch-size-decision-board/visual.png"
OUT_DIR = Path(__file__).resolve().parent / "renders"
OUT_GIF = OUT_DIR / "visual-motion.gif"

WIDTH = 720
FPS = 10
DURATION_S = 6.0
FRAME_COUNT = int(FPS * DURATION_S)
FRAME_MS = int(1000 / FPS)


def ease_in_out(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return 0.5 - 0.5 * math.cos(math.pi * x)


def pulse(t: float, start: float, end: float) -> float:
    if t < start or t > end:
        return 0.0
    p = (t - start) / (end - start)
    return math.sin(math.pi * p)


def plateau(t: float, start: float, rise_end: float, fall_start: float, end: float) -> float:
    if t < start or t > end:
        return 0.0
    if t < rise_end:
        return ease_in_out((t - start) / (rise_end - start))
    if t > fall_start:
        return 1.0 - ease_in_out((t - fall_start) / (end - fall_start))
    return 1.0


def line_point(points: list[tuple[float, float]], p: float) -> tuple[float, float]:
    if p <= 0:
        return points[0]
    if p >= 1:
        return points[-1]
    lengths: list[float] = []
    total = 0.0
    for a, b in zip(points, points[1:]):
        seg = math.dist(a, b)
        lengths.append(seg)
        total += seg
    target = p * total
    walked = 0.0
    for idx, seg in enumerate(lengths):
        if walked + seg >= target:
            q = (target - walked) / seg
            ax, ay = points[idx]
            bx, by = points[idx + 1]
            return (ax + (bx - ax) * q, ay + (by - ay) * q)
        walked += seg
    return points[-1]


def draw_soft_rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: tuple[int, int, int, int], width: int = 4) -> None:
    for i in range(width):
        alpha = max(0, color[3] - i * 32)
        draw.rounded_rectangle(
            (box[0] - i, box[1] - i, box[2] + i, box[3] + i),
            radius=14 + i,
            outline=(color[0], color[1], color[2], alpha),
            width=2,
        )


def add_glow(frame: Image.Image, mask: Image.Image, color: tuple[int, int, int], strength: float) -> None:
    if strength <= 0:
        return
    blur = mask.filter(ImageFilter.GaussianBlur(radius=16))
    glow = Image.new("RGBA", frame.size, (*color, int(120 * strength)))
    frame.alpha_composite(Image.composite(glow, Image.new("RGBA", frame.size, (0, 0, 0, 0)), blur))


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGBA")
    height = round(source.height * WIDTH / source.width)
    base = source.resize((WIDTH, height), Image.Resampling.LANCZOS)

    scale = WIDTH / source.width

    # Original-image coordinate boxes. These are deliberately broad and soft so the
    # motion guides attention without redrawing or compromising approved text.
    formula_box = tuple(round(v * scale) for v in (304, 333, 697, 454))
    cost_box = tuple(round(v * scale) for v in (281, 671, 732, 984))
    trade_box = tuple(round(v * scale) for v in (184, 1010, 778, 1262))
    verify_box = tuple(round(v * scale) for v in (172, 1281, 835, 1417))
    option_boxes = [
        tuple(round(v * scale) for v in (763, 354, 987, 557)),
        tuple(round(v * scale) for v in (763, 576, 987, 776)),
        tuple(round(v * scale) for v in (763, 789, 987, 1008)),
    ]
    shetty_box = tuple(round(v * scale) for v in (355, 1413, 679, 1490))

    curve_points = [
        (round(x * scale), round(y * scale))
        for x, y in [(318, 708), (395, 825), (507, 905), (610, 874), (694, 730)]
    ]

    font_path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
    font = ImageFont.truetype(font_path, round(24 * scale))

    frames: list[Image.Image] = []
    for i in range(FRAME_COUNT):
        t = i / (FRAME_COUNT - 1)
        frame = base.copy()
        overlay = Image.new("RGBA", frame.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        # A barely visible global light sweep creates life while preserving the
        # picture-first read.
        sweep_x = int((-0.2 + 1.4 * t) * WIDTH)
        for k in range(-24, 25):
            alpha = max(0, 18 - abs(k) // 2)
            draw.line((sweep_x + k, 0, sweep_x + k - 170, height), fill=(255, 255, 255, alpha), width=1)

        # Formula moment.
        f = pulse(t, 0.08, 0.30)
        if f:
            mask = Image.new("L", frame.size, 0)
            md = ImageDraw.Draw(mask)
            md.rounded_rectangle(formula_box, radius=16, fill=int(190 * f))
            add_glow(frame, mask, (0, 109, 255), f)
            draw_soft_rect(draw, formula_box, (0, 109, 255, int(235 * f)), width=5)
            root_start = (round(480 * scale), round(376 * scale))
            root_mid = (round(520 * scale), round(403 * scale))
            root_end = (round(661 * scale), round(368 * scale))
            draw.line((root_start, root_mid, root_end), fill=(0, 94, 210, int(255 * f)), width=max(3, round(5 * scale)), joint="curve")

        # Cost-curve guided read.
        c = plateau(t, 0.22, 0.30, 0.62, 0.70)
        if c:
            draw_soft_rect(draw, cost_box, (0, 109, 255, int(180 * c)), width=3)
            progress = ease_in_out(min(1.0, max(0.0, (t - 0.28) / 0.32)))
            px, py = line_point(curve_points, progress)
            draw.ellipse((px - 9, py - 9, px + 9, py + 9), fill=(255, 255, 255, int(230 * c)))
            draw.ellipse((px - 6, py - 6, px + 6, py + 6), fill=(0, 109, 255, int(255 * c)))

        # Batch option decision ladder.
        for idx, box in enumerate(option_boxes):
            o = pulse(t, 0.42 + idx * 0.085, 0.62 + idx * 0.085)
            if o:
                draw_soft_rect(draw, box, (0, 109, 255, int(210 * o)), width=4)
                cx = (box[0] + box[2]) // 2
                cy = box[1] + round(42 * scale)
                label = ["SMALLER", "CURRENT", "LARGER"][idx]
                tw = draw.textlength(label, font=font)
                pad_x = round(12 * scale)
                pad_y = round(6 * scale)
                draw.rounded_rectangle(
                    (cx - tw / 2 - pad_x, cy - 15 * scale, cx + tw / 2 + pad_x, cy + 16 * scale),
                    radius=round(10 * scale),
                    fill=(4, 35, 79, int(205 * o)),
                )
                draw.text((cx - tw / 2, cy - 13 * scale), label, font=font, fill=(255, 255, 255, int(255 * o)))

        # Trade-off table and verify strip.
        tr = pulse(t, 0.66, 0.86)
        if tr:
            draw_soft_rect(draw, trade_box, (0, 109, 255, int(170 * tr)), width=3)
            for y in [1077, 1130, 1182, 1232]:
                y_scaled = round(y * scale)
                draw.line(
                    (round(464 * scale), y_scaled, round((464 + 210 * tr) * scale), y_scaled),
                    fill=(44, 169, 80, int(220 * tr)),
                    width=max(2, round(3 * scale)),
                )
        v = pulse(t, 0.78, 0.98)
        if v:
            draw_soft_rect(draw, verify_box, (44, 169, 80, int(175 * v)), width=3)
            for x in [224, 344, 475, 606, 739]:
                cx = round(x * scale)
                cy = round(1336 * scale)
                r = round((17 + 8 * v) * scale)
                draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(44, 169, 80, int(210 * v)), width=max(2, round(4 * scale)))

        # Final brand pulse, tiny and polished.
        b = pulse(t, 0.88, 1.0)
        if b:
            draw_soft_rect(draw, shetty_box, (0, 109, 255, int(140 * b)), width=3)

        frame.alpha_composite(overlay)
        frames.append(frame.convert("P", palette=Image.Palette.ADAPTIVE, colors=160))

    frames[0].save(
        OUT_GIF,
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_MS,
        loop=0,
        optimize=True,
        disposal=2,
    )
    print(OUT_GIF)


if __name__ == "__main__":
    main()
