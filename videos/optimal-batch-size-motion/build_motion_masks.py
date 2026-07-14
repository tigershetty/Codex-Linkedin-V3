from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter


PROJECT_DIR = Path(__file__).resolve().parent
REPO_DIR = PROJECT_DIR.parents[1]
SOURCE = (
    REPO_DIR
    / "infographic-setup/data/2026-W30/optimal-batch-size-decision-board/visual.png"
)
ASSET_DIR = PROJECT_DIR / "assets"
MASK_DIR = ASSET_DIR / "masks"
HIGHLIGHT_DIR = ASSET_DIR / "highlights"
COVER_DIR = ASSET_DIR / "covers"


REGIONS = {
    "formula-blue": {"box": [476, 350, 671, 435], "color": "blue"},
    "curve-blue": {"box": [315, 704, 526, 926], "color": "blue"},
    "curve-red": {"box": [500, 704, 706, 926], "color": "red"},
    "batch-small": {"box": [774, 420, 935, 535], "color": "blue"},
    "batch-current": {"box": [774, 635, 935, 748], "color": "blue"},
    "batch-large": {"box": [770, 846, 936, 985], "color": "blue"},
    "trade-green": {"box": [454, 1037, 730, 1245], "color": "green"},
    "trade-red": {"box": [454, 1037, 730, 1245], "color": "red"},
    "verify-green": {"box": [182, 1292, 778, 1375], "color": "green"},
}


def color_confidence(rgb: np.ndarray, color: str) -> np.ndarray:
    px = rgb.astype(np.float32)
    r, g, b = px[..., 0], px[..., 1], px[..., 2]

    if color == "blue":
        confidence = np.minimum(b - r * 1.12, b - g * 1.02)
        gate = (b > 90) & (confidence > 5)
    elif color == "red":
        confidence = np.minimum(r - g * 1.12, r - b * 1.12)
        gate = (r > 135) & (confidence > 8)
    elif color == "green":
        confidence = np.minimum(g - r * 1.06, g - b * 1.02)
        gate = (g > 82) & (confidence > 4)
    else:
        raise ValueError(f"unsupported color: {color}")

    alpha = np.clip(confidence * 4.2, 0, 255)
    return np.where(gate, alpha, 0).astype(np.uint8)


def build_mask(source: np.ndarray, box: list[int], color: str) -> Image.Image:
    x1, y1, x2, y2 = box
    crop = source[y1:y2, x1:x2]
    alpha = Image.fromarray(color_confidence(crop, color), mode="L")
    alpha = alpha.filter(ImageFilter.MaxFilter(3))
    return alpha.filter(ImageFilter.GaussianBlur(0.55))


def row_background(source: np.ndarray, mask: Image.Image) -> Image.Image:
    alpha = np.asarray(mask)
    height, width = alpha.shape
    output = np.zeros((height, width, 3), dtype=np.uint8)
    light = np.min(source, axis=2) > 168
    global_candidates = source[(alpha < 10) & light]
    global_color = (
        np.median(global_candidates, axis=0)
        if global_candidates.size
        else np.array([235, 244, 250])
    )

    for row in range(height):
        candidates = source[row][(alpha[row] < 10) & light[row]]
        color = np.median(candidates, axis=0) if candidates.size else global_color
        output[row, :, :] = np.clip(color, 0, 255).astype(np.uint8)

    return Image.fromarray(output, mode="RGB").filter(ImageFilter.GaussianBlur(0.8))


def semantic_cover(source: np.ndarray, mask: Image.Image) -> Image.Image:
    plate = row_background(source, mask).convert("RGBA")
    binary = np.where(np.asarray(mask) > 5, 255, 0).astype(np.uint8)
    cover_alpha = (
        Image.fromarray(binary, mode="L")
        .filter(ImageFilter.MaxFilter(7))
        .filter(ImageFilter.GaussianBlur(0.9))
    )
    plate.putalpha(cover_alpha)
    return plate


def panel_cover(source: np.ndarray, box: list[int]) -> Image.Image:
    x1, y1, x2, y2 = box
    crop = source[y1:y2, x1:x2].astype(np.float32)
    height, width, _ = crop.shape
    yy, xx = np.mgrid[0:height, 0:width]
    xn = xx / max(width - 1, 1)
    yn = yy / max(height - 1, 1)

    # Fit the pale glass surface from light, low-chroma source pixels. A fitted
    # surface keeps the card's native lighting without copying object shadows.
    chroma = np.max(crop, axis=2) - np.min(crop, axis=2)
    clean = (np.min(crop, axis=2) > 188) & (chroma < 48)
    features = np.stack(
        [np.ones_like(xn), xn, yn, xn * yn, xn**2, yn**2], axis=-1
    )
    samples = features[clean]
    if len(samples) < 24:
        clean = np.min(crop, axis=2) > 178
        samples = features[clean]

    output = np.empty_like(crop)
    for channel in range(3):
        coefficients, *_ = np.linalg.lstsq(samples, crop[..., channel][clean], rcond=None)
        output[..., channel] = features @ coefficients

    output = np.clip(output, 205, 255).astype(np.uint8)
    plate = Image.fromarray(output, mode="RGB").filter(ImageFilter.GaussianBlur(1.0)).convert("RGBA")
    alpha = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(alpha)
    draw.rounded_rectangle((1, 1, width - 2, height - 2), radius=13, fill=255)
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.2))
    plate.putalpha(alpha)
    return plate


def make_contact_sheet(items: list[tuple[str, Image.Image]]) -> Image.Image:
    width = 760
    row_height = 178
    sheet = Image.new("RGB", (width, row_height * len(items)), "#edf5fd")
    draw = ImageDraw.Draw(sheet)
    for index, (name, mask) in enumerate(items):
        top = index * row_height
        draw.text((18, top + 14), name, fill="#071f4e")
        preview = Image.new("RGBA", mask.size, (0, 0, 0, 0))
        preview.paste((0, 109, 255, 255), mask=mask)
        max_w, max_h = 690, 128
        scale = min(max_w / preview.width, max_h / preview.height, 1)
        if scale < 1:
            preview = preview.resize(
                (round(preview.width * scale), round(preview.height * scale)),
                Image.Resampling.LANCZOS,
            )
        sheet.alpha_composite(preview, (18, top + 42)) if sheet.mode == "RGBA" else sheet.paste(
            preview, (18, top + 42), preview
        )
    return sheet


def main() -> None:
    MASK_DIR.mkdir(parents=True, exist_ok=True)
    HIGHLIGHT_DIR.mkdir(parents=True, exist_ok=True)
    COVER_DIR.mkdir(parents=True, exist_ok=True)
    source_image = Image.open(SOURCE).convert("RGB")
    source = np.asarray(source_image)
    source_image.save(ASSET_DIR / "visual.png")

    manifest: dict[str, dict[str, object]] = {}
    previews: list[tuple[str, Image.Image]] = []
    for name, spec in REGIONS.items():
        mask = build_mask(source, spec["box"], spec["color"])
        mask.save(MASK_DIR / f"{name}.png")
        x1, y1, x2, y2 = spec["box"]
        highlight = source_image.crop((x1, y1, x2, y2)).convert("RGBA")
        highlight = ImageEnhance.Color(highlight).enhance(1.08)
        highlight = ImageEnhance.Brightness(highlight).enhance(1.22)
        highlight.putalpha(mask)
        highlight.save(HIGHLIGHT_DIR / f"{name}.png")
        if name not in {"batch-small", "batch-current", "batch-large"}:
            crop_source = source[y1:y2, x1:x2]
            semantic_cover(crop_source, mask).save(COVER_DIR / f"{name}.png")
        manifest[name] = {
            "box": spec["box"],
            "color": spec["color"],
            "alphaExtrema": list(mask.getextrema()),
            "nonZeroPixels": int(np.count_nonzero(np.asarray(mask))),
        }
        previews.append((name, mask))

    trade_mask = ImageChops.lighter(
        Image.open(MASK_DIR / "trade-green.png").convert("L"),
        Image.open(MASK_DIR / "trade-red.png").convert("L"),
    )
    trade_box = REGIONS["trade-green"]["box"]
    tx1, ty1, tx2, ty2 = trade_box
    semantic_cover(source[ty1:ty2, tx1:tx2], trade_mask).save(COVER_DIR / "trade-all.png")

    curve_total_box = [315, 704, 706, 926]
    cx1, cy1, cx2, cy2 = curve_total_box
    curve_total_mask = Image.new("L", (cx2 - cx1, cy2 - cy1), 0)
    curve_draw = ImageDraw.Draw(curve_total_mask)
    curve_points = [
        (320, 829), (344, 847), (372, 865), (402, 883),
        (433, 896), (468, 902), (503, 905), (540, 903),
        (577, 895), (612, 881), (648, 864), (688, 846),
    ]
    curve_draw.line(
        [(x - cx1, y - cy1) for x, y in curve_points],
        fill=255,
        width=14,
        joint="curve",
    )
    curve_total_mask = curve_total_mask.filter(ImageFilter.GaussianBlur(1.0))
    curve_total_crop = source_image.crop(tuple(curve_total_box)).convert("RGBA")
    curve_total_highlight = ImageEnhance.Brightness(curve_total_crop).enhance(1.24)
    curve_total_highlight.putalpha(curve_total_mask)
    curve_total_highlight.save(HIGHLIGHT_DIR / "curve-total.png")
    semantic_cover(
        source[cy1:cy2, cx1:cx2], curve_total_mask
    ).save(COVER_DIR / "curve-total.png")

    total_label_box = [450, 772, 560, 824]
    lx1, ly1, lx2, ly2 = total_label_box
    total_label_mask = Image.new("L", (lx2 - lx1, ly2 - ly1), 255)
    semantic_cover(
        source[ly1:ly2, lx1:lx2], total_label_mask
    ).save(COVER_DIR / "total-cost-label.png")

    batch_cover_boxes = {
        "batch-small-plate": [758, 392, 974, 546],
        "batch-current-plate": [758, 606, 974, 758],
        "batch-large-plate": [754, 817, 974, 989],
    }
    for name, box in batch_cover_boxes.items():
        panel_cover(source, box).save(COVER_DIR / f"{name}.png")

    panel_cover(source, [278, 703, 716, 966]).save(COVER_DIR / "curve-panel-plate.png")

    (ASSET_DIR / "mask-manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    make_contact_sheet(previews).save(ASSET_DIR / "mask-contact-sheet.png")
    print(f"wrote {len(previews)} semantic masks to {MASK_DIR}")


if __name__ == "__main__":
    main()
