from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


PROJECT_DIR = Path(__file__).resolve().parent
REPO_DIR = PROJECT_DIR.parents[1]
SOURCE = REPO_DIR / "infographic-setup/data/2026-W31/demand-sensing-sku-routing/visual.png"
ASSET_DIR = PROJECT_DIR / "assets"
HIGHLIGHT_DIR = ASSET_DIR / "highlights"


OBJECT_REGIONS = {
    "input-history": [36, 370, 275, 422],
    "input-orders": [36, 422, 275, 476],
    "input-promo": [36, 475, 275, 528],
    "input-service": [36, 528, 275, 585],
    "gate-regularity": [521, 496, 696, 549],
    "gate-variability": [521, 549, 696, 603],
    "gate-volume": [521, 603, 696, 655],
    "gate-response": [521, 708, 696, 761],
}

COLOR_REGIONS = {
    "gate-signal": {"box": [521, 655, 696, 708], "color": "green"},
    "sense-route": {"box": [55, 735, 375, 1390], "color": "blue"},
    "monthly-route": {"box": [651, 736, 970, 1391], "color": "blue"},
    "exception-route": {"box": [407, 1040, 618, 1312], "color": "coral"},
}


def fitted_surface(source: np.ndarray) -> np.ndarray:
    crop = source.astype(np.float32)
    height, width, _ = crop.shape
    yy, xx = np.mgrid[0:height, 0:width]
    xn = xx / max(width - 1, 1)
    yn = yy / max(height - 1, 1)
    chroma = np.max(crop, axis=2) - np.min(crop, axis=2)
    clean = (np.min(crop, axis=2) > 165) & (chroma < 52)
    features = np.stack(
        [np.ones_like(xn), xn, yn, xn * yn, xn**2, yn**2], axis=-1
    )
    samples = features[clean]
    if len(samples) < 24:
        clean = np.min(crop, axis=2) > 145
        samples = features[clean]

    output = np.empty_like(crop)
    for channel in range(3):
        coefficients, *_ = np.linalg.lstsq(
            samples, crop[..., channel][clean], rcond=None
        )
        output[..., channel] = features @ coefficients
    return np.clip(output, 145, 255).astype(np.uint8)


def object_highlight(source_image: Image.Image, source: np.ndarray, box: list[int]) -> Image.Image:
    x1, y1, x2, y2 = box
    crop = source[y1:y2, x1:x2]
    fitted = fitted_surface(crop)
    difference = np.linalg.norm(crop.astype(np.float32) - fitted.astype(np.float32), axis=2)
    chroma = np.max(crop, axis=2) - np.min(crop, axis=2)
    gate = (difference > 15) & ((np.min(crop, axis=2) < 230) | (chroma > 16))
    alpha = np.where(gate, np.clip(difference * 4.4, 0, 210), 0).astype(np.uint8)
    mask = Image.fromarray(alpha, mode="L").filter(ImageFilter.MaxFilter(3))
    mask = mask.filter(ImageFilter.GaussianBlur(0.7))
    layer = source_image.crop(tuple(box)).convert("RGBA")
    layer = ImageEnhance.Brightness(layer).enhance(1.18)
    layer = ImageEnhance.Color(layer).enhance(1.08)
    layer.putalpha(mask)
    return layer


def color_confidence(rgb: np.ndarray, color: str) -> np.ndarray:
    px = rgb.astype(np.float32)
    r, g, b = px[..., 0], px[..., 1], px[..., 2]

    if color == "blue":
        confidence = np.maximum(b - r * 1.05, b - g * 0.98)
        gate = (b > 85) & (b > r * 1.06) & (confidence > 5)
        gain = 4.6
    elif color == "green":
        confidence = np.minimum(g - r * 1.03, g - b * 0.96)
        gate = (g > 78) & (confidence > 4)
        gain = 5.2
    elif color == "coral":
        confidence = np.minimum(r - g * 1.10, r - b * 1.12)
        gate = (r > 145) & (confidence > 7)
        gain = 4.8
    else:
        raise ValueError(f"unsupported color: {color}")

    alpha = np.clip(confidence * gain, 0, 235)
    return np.where(gate, alpha, 0).astype(np.uint8)


def color_highlight(source_image: Image.Image, source: np.ndarray, spec: dict) -> Image.Image:
    x1, y1, x2, y2 = spec["box"]
    crop = source[y1:y2, x1:x2]
    alpha = Image.fromarray(color_confidence(crop, spec["color"]), mode="L")
    alpha = alpha.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    layer = source_image.crop((x1, y1, x2, y2)).convert("RGBA")
    layer = ImageEnhance.Brightness(layer).enhance(1.25)
    layer = ImageEnhance.Color(layer).enhance(1.12)
    layer.putalpha(alpha)
    return layer


def contact_sheet(items: list[tuple[str, Image.Image]]) -> Image.Image:
    width = 840
    row_height = 176
    sheet = Image.new("RGB", (width, row_height * len(items)), "#eef6fe")
    draw = ImageDraw.Draw(sheet)
    for index, (name, layer) in enumerate(items):
        top = index * row_height
        draw.text((18, top + 12), name, fill="#071f4e")
        preview = layer.convert("RGBA")
        scale = min(790 / preview.width, 128 / preview.height, 1)
        if scale < 1:
            preview = preview.resize(
                (round(preview.width * scale), round(preview.height * scale)),
                Image.Resampling.LANCZOS,
            )
        sheet.paste(preview, (18, top + 38), preview)
    return sheet


def main() -> None:
    HIGHLIGHT_DIR.mkdir(parents=True, exist_ok=True)
    source_image = Image.open(SOURCE).convert("RGB")
    source = np.asarray(source_image)
    source_image.save(ASSET_DIR / "visual.png")

    manifest: dict[str, dict[str, object]] = {}
    previews: list[tuple[str, Image.Image]] = []

    for name, box in OBJECT_REGIONS.items():
        layer = object_highlight(source_image, source, box)
        layer.save(HIGHLIGHT_DIR / f"{name}.png")
        manifest[name] = {
            "box": box,
            "method": "registered-object-source-highlight",
            "alphaExtrema": list(layer.getchannel("A").getextrema()),
        }
        previews.append((name, layer))

    for name, spec in COLOR_REGIONS.items():
        layer = color_highlight(source_image, source, spec)
        layer.save(HIGHLIGHT_DIR / f"{name}.png")
        manifest[name] = {
            "box": spec["box"],
            "method": f"registered-{spec['color']}-source-highlight",
            "alphaExtrema": list(layer.getchannel("A").getextrema()),
        }
        previews.append((name, layer))

    (ASSET_DIR / "asset-manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    contact_sheet(previews).save(ASSET_DIR / "asset-contact-sheet.png")
    print(f"wrote {len(manifest)} registered motion assets to {ASSET_DIR}")


if __name__ == "__main__":
    main()
