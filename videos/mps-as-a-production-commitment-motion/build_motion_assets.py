from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


PROJECT_DIR = Path(__file__).resolve().parent
REPO_DIR = PROJECT_DIR.parents[1]
SOURCE = (
    REPO_DIR
    / "infographic-setup/data/2026-W31/mps-as-a-production-commitment/visual.png"
)
ASSET_DIR = PROJECT_DIR / "assets"
MASK_DIR = ASSET_DIR / "masks"
HIGHLIGHT_DIR = ASSET_DIR / "highlights"


REGIONS = {
    "input-demand": {"box": [44, 346, 170, 455], "color": "blue"},
    "input-orders": {"box": [175, 323, 310, 447], "color": "blue"},
    "input-inventory": {"box": [300, 304, 415, 427], "color": "blue"},
    "status-firm-1": {"box": [505, 492, 601, 548], "color": "green", "strict": True},
    "status-firm-2": {"box": [515, 526, 613, 588], "color": "green", "strict": True},
    "status-planned": {"box": [528, 566, 644, 635], "color": "blue", "strict": True},
    "zone-protected": {"box": [218, 798, 399, 968], "color": "green", "strict": True},
    "zone-controlled": {"box": [420, 755, 602, 943], "color": "orange", "strict": True},
    "zone-flexible": {"box": [611, 735, 778, 917], "color": "blue", "strict": True},
    "freeze-control": {"box": [56, 1426, 390, 1525], "color": "green"},
    "firming-control": {"box": [447, 1426, 806, 1525], "color": "orange"},
    "takeaway-blue": {"box": [176, 1640, 790, 1708], "color": "blue"},
}

MODEL_BOXES = {
    "model-capacity": [49, 1081, 286, 1306],
    "model-materials": [336, 1110, 551, 1310],
    "model-orders": [592, 1087, 817, 1308],
}


def color_confidence(rgb: np.ndarray, color: str, strict: bool = False) -> np.ndarray:
    px = rgb.astype(np.float32)
    r, g, b = px[..., 0], px[..., 1], px[..., 2]

    if color == "blue":
        confidence = np.minimum(b - r * 1.10, b - g * 1.02)
        gate = (b > 86) & (confidence > 5)
    elif color == "green":
        confidence = np.minimum(g - r * 1.05, g - b * 1.02)
        gate = (g > 72) & (confidence > 4)
    elif color == "orange":
        confidence = np.minimum(r - g * 1.08, r - b * 1.24)
        gate = (r > 150) & (g > 45) & (confidence > 7)
    else:
        raise ValueError(f"unsupported color: {color}")

    if strict:
        chroma = np.max(px, axis=2) - np.min(px, axis=2)
        # On tinted horizon panels, the background carries the same hue as the
        # label. Keep only the dark, high-chroma authored marks so the reset
        # cannot turn into a visible rectangular patch.
        gate &= (chroma > 70) & (np.min(px, axis=2) < 175) & (confidence > 24)

    alpha = np.clip(confidence * 4.8, 0, 255)
    return np.where(gate, alpha, 0).astype(np.uint8)


def build_mask(
    source: np.ndarray, box: list[int], color: str, strict: bool = False
) -> Image.Image:
    x1, y1, x2, y2 = box
    crop = source[y1:y2, x1:x2]
    alpha = Image.fromarray(color_confidence(crop, color, strict), mode="L")
    alpha = alpha.filter(ImageFilter.MaxFilter(3))
    return alpha.filter(ImageFilter.GaussianBlur(0.55))


def fitted_surface(source: np.ndarray, mask: np.ndarray | None = None) -> np.ndarray:
    crop = source.astype(np.float32)
    height, width, _ = crop.shape
    yy, xx = np.mgrid[0:height, 0:width]
    xn = xx / max(width - 1, 1)
    yn = yy / max(height - 1, 1)
    chroma = np.max(crop, axis=2) - np.min(crop, axis=2)
    clean = (np.min(crop, axis=2) > 174) & (chroma < 48)
    if mask is not None:
        clean &= mask < 10
    features = np.stack(
        [np.ones_like(xn), xn, yn, xn * yn, xn**2, yn**2], axis=-1
    )
    samples = features[clean]
    if len(samples) < 24:
        clean = np.min(crop, axis=2) > 155
        if mask is not None:
            clean &= mask < 10
        samples = features[clean]

    output = np.empty_like(crop)
    for channel in range(3):
        coefficients, *_ = np.linalg.lstsq(
            samples, crop[..., channel][clean], rcond=None
        )
        output[..., channel] = features @ coefficients
    return np.clip(output, 185, 255).astype(np.uint8)


def model_highlight(
    source_image: Image.Image, source: np.ndarray, box: list[int]
) -> Image.Image:
    x1, y1, x2, y2 = box
    crop = source[y1:y2, x1:x2]
    fitted = fitted_surface(crop)
    height, width, _ = crop.shape

    difference = np.linalg.norm(crop.astype(np.float32) - fitted.astype(np.float32), axis=2)
    chroma = np.max(crop, axis=2) - np.min(crop, axis=2)
    object_gate = (difference > 17) & ((np.min(crop, axis=2) < 220) | (chroma > 20))
    object_alpha = np.where(object_gate, np.clip(difference * 4.8, 0, 210), 0).astype(np.uint8)
    object_mask = Image.fromarray(object_alpha, mode="L").filter(
        ImageFilter.MaxFilter(3)
    ).filter(ImageFilter.GaussianBlur(0.7))
    highlight = source_image.crop(tuple(box)).convert("RGBA")
    highlight = ImageEnhance.Brightness(highlight).enhance(1.16)
    highlight = ImageEnhance.Color(highlight).enhance(1.05)
    highlight.putalpha(object_mask)
    return highlight


def contact_sheet(items: list[tuple[str, Image.Image]]) -> Image.Image:
    width = 760
    row_height = 180
    sheet = Image.new("RGB", (width, row_height * len(items)), "#eef6fe")
    draw = ImageDraw.Draw(sheet)
    for index, (name, layer) in enumerate(items):
        top = index * row_height
        draw.text((18, top + 12), name, fill="#071f4e")
        preview = layer.convert("RGBA")
        scale = min(700 / preview.width, 132 / preview.height, 1)
        if scale < 1:
            preview = preview.resize(
                (round(preview.width * scale), round(preview.height * scale)),
                Image.Resampling.LANCZOS,
            )
        sheet.paste(preview, (18, top + 38), preview)
    return sheet


def main() -> None:
    MASK_DIR.mkdir(parents=True, exist_ok=True)
    HIGHLIGHT_DIR.mkdir(parents=True, exist_ok=True)

    source_image = Image.open(SOURCE).convert("RGB")
    source = np.asarray(source_image)
    source_image.save(ASSET_DIR / "visual.png")

    manifest: dict[str, dict[str, object]] = {}
    previews: list[tuple[str, Image.Image]] = []

    for name, spec in REGIONS.items():
        box = spec["box"]
        mask = build_mask(source, box, spec["color"], spec.get("strict", False))
        mask.save(MASK_DIR / f"{name}.png")
        x1, y1, x2, y2 = box
        highlight = source_image.crop(tuple(box)).convert("RGBA")
        highlight = ImageEnhance.Brightness(highlight).enhance(1.22)
        highlight = ImageEnhance.Color(highlight).enhance(1.08)
        highlight.putalpha(mask)
        highlight.save(HIGHLIGHT_DIR / f"{name}.png")
        manifest[name] = {
            "box": box,
            "color": spec["color"],
            "alphaExtrema": list(mask.getextrema()),
            "nonZeroPixels": int(np.count_nonzero(np.asarray(mask))),
        }
        previews.append((f"mask: {name}", mask))

    for name, box in MODEL_BOXES.items():
        highlight = model_highlight(source_image, source, box)
        highlight.save(HIGHLIGHT_DIR / f"{name}.png")
        manifest[name] = {"box": box, "method": "registered-source-highlight-only"}
        previews.append((f"highlight: {name}", highlight))

    (ASSET_DIR / "asset-manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    contact_sheet(previews).save(ASSET_DIR / "asset-contact-sheet.png")
    print(f"wrote {len(manifest)} motion assets to {ASSET_DIR}")


if __name__ == "__main__":
    main()
