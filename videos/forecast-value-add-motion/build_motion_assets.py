from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


PROJECT_DIR = Path(__file__).resolve().parent
REPO_DIR = PROJECT_DIR.parents[1]
SOURCE = REPO_DIR / "infographic-setup/data/2026-W31/forecast-value-add/visual-linkedin.png"
ASSET_DIR = PROJECT_DIR / "assets"
HIGHLIGHT_DIR = ASSET_DIR / "highlights"


COLOR_REGIONS = {
    "actual-trace": {"box": [172, 350, 793, 455], "color": "navy"},
    "adjusted-trace": {"box": [172, 380, 793, 495], "color": "azure"},
    "baseline-trace": {"box": [172, 405, 793, 550], "color": "coral"},
    "baseline-wape": {"box": [372, 659, 472, 722], "color": "coral"},
    "adjusted-wape": {"box": [497, 676, 597, 722], "color": "azure"},
    "fva-result": {"box": [614, 672, 739, 722], "color": "green"},
    "rule-positive": {"box": [313, 826, 468, 943], "color": "green"},
    "rule-negative": {"box": [651, 826, 806, 943], "color": "coral"},
}


OBJECT_REGIONS = {
    "rule-zero": [484, 826, 639, 943],
    "ledger-promotion": [255, 1011, 639, 1064],
    "ledger-customer": [255, 1064, 639, 1122],
    "ledger-no-evidence": [255, 1122, 639, 1172],
    "input-pack": [655, 964, 860, 1210],
}


TRACE_COLORS = {
    "navy": (17, 48, 151),
    "azure": (18, 132, 255),
    "coral": (255, 79, 31),
}


def color_confidence(rgb: np.ndarray, color: str) -> np.ndarray:
    px = rgb.astype(np.float32)
    r, g, b = px[..., 0], px[..., 1], px[..., 2]

    if color == "navy":
        confidence = np.minimum(b - r * 1.18, b - g * 1.02)
        gate = (b > 55) & (b < 180) & (r < 70) & (g < 50) & (confidence > 4)
        gain = 5.0
    elif color == "azure":
        confidence = np.minimum(b - r, b - g)
        gate = (b > 180) & (g > 55) & ((b - g) > 90) & ((b - r) > 120)
        gain = 4.6
    elif color == "coral":
        confidence = np.minimum(r - g * 1.10, r - b * 1.14)
        gate = (r > 145) & (confidence > 7)
        gain = 4.8
    elif color == "green":
        confidence = np.minimum(g - r * 1.05, g - b * 1.02)
        gate = (g > 70) & (confidence > 5)
        gain = 5.0
    else:
        raise ValueError(f"unsupported color: {color}")

    alpha = np.clip(confidence * gain, 0, 235)
    return np.where(gate, alpha, 0).astype(np.uint8)


def color_highlight(
    source_image: Image.Image, source: np.ndarray, spec: dict[str, object]
) -> Image.Image:
    x1, y1, x2, y2 = spec["box"]
    crop = source[y1:y2, x1:x2]
    alpha = Image.fromarray(color_confidence(crop, str(spec["color"])), mode="L")
    alpha = alpha.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    layer = source_image.crop((x1, y1, x2, y2)).convert("RGBA")
    layer = ImageEnhance.Brightness(layer).enhance(1.28)
    layer = ImageEnhance.Color(layer).enhance(1.12)
    layer.putalpha(alpha)
    return layer


def add_source_halo(layer: Image.Image, color: str) -> Image.Image:
    alpha = layer.getchannel("A")
    halo_alpha = alpha.filter(ImageFilter.GaussianBlur(5.0)).point(
        lambda value: min(150, round(value * 0.76))
    )
    red, green, blue = TRACE_COLORS[color]
    halo = Image.new("RGBA", layer.size, (red, green, blue, 0))
    halo.putalpha(halo_alpha)
    halo.alpha_composite(layer)
    return halo


def centerline_points(
    source: np.ndarray, spec: dict[str, object], start_x: int = 350, step: int = 15
) -> list[list[int]]:
    x1, y1, x2, y2 = spec["box"]
    mask = color_confidence(source[y1:y2, x1:x2], str(spec["color"]))
    points: list[list[int]] = []
    for global_x in range(max(start_x, x1), x2, step):
        local_x = global_x - x1
        candidates: list[int] = []
        for offset in range(-3, 4):
            x = local_x + offset
            if 0 <= x < mask.shape[1]:
                candidates.extend(np.where(mask[:, x] > 70)[0].tolist())
        if candidates:
            points.append([global_x, int(np.median(candidates)) + y1])
    return points


def fitted_surface(source: np.ndarray) -> np.ndarray:
    crop = source.astype(np.float32)
    height, width, _ = crop.shape
    yy, xx = np.mgrid[0:height, 0:width]
    xn = xx / max(width - 1, 1)
    yn = yy / max(height - 1, 1)
    chroma = np.max(crop, axis=2) - np.min(crop, axis=2)
    clean = (np.min(crop, axis=2) > 170) & (chroma < 46)
    features = np.stack(
        [np.ones_like(xn), xn, yn, xn * yn, xn**2, yn**2], axis=-1
    )
    samples = features[clean]
    if len(samples) < 24:
        clean = np.min(crop, axis=2) > 150
        samples = features[clean]

    output = np.empty_like(crop)
    for channel in range(3):
        coefficients, *_ = np.linalg.lstsq(
            samples, crop[..., channel][clean], rcond=None
        )
        output[..., channel] = features @ coefficients
    return np.clip(output, 150, 255).astype(np.uint8)


def object_highlight(
    source_image: Image.Image, source: np.ndarray, box: list[int]
) -> Image.Image:
    x1, y1, x2, y2 = box
    crop = source[y1:y2, x1:x2]
    fitted = fitted_surface(crop)
    difference = np.linalg.norm(
        crop.astype(np.float32) - fitted.astype(np.float32), axis=2
    )
    chroma = np.max(crop, axis=2) - np.min(crop, axis=2)
    gate = (difference > 15) & ((np.min(crop, axis=2) < 230) | (chroma > 15))
    alpha = np.where(gate, np.clip(difference * 4.2, 0, 210), 0).astype(np.uint8)
    mask = Image.fromarray(alpha, mode="L").filter(ImageFilter.MaxFilter(3))
    mask = mask.filter(ImageFilter.GaussianBlur(0.7))
    layer = source_image.crop(tuple(box)).convert("RGBA")
    layer = ImageEnhance.Brightness(layer).enhance(1.18)
    layer = ImageEnhance.Color(layer).enhance(1.06)
    layer.putalpha(mask)
    return layer


def contact_sheet(items: list[tuple[str, Image.Image]]) -> Image.Image:
    width = 860
    row_height = 176
    sheet = Image.new("RGB", (width, row_height * len(items)), "#eef6fe")
    draw = ImageDraw.Draw(sheet)
    for index, (name, layer) in enumerate(items):
        top = index * row_height
        draw.text((18, top + 12), name, fill="#071f4e")
        preview = layer.convert("RGBA")
        scale = min(810 / preview.width, 128 / preview.height, 1)
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

    for name, spec in COLOR_REGIONS.items():
        layer = color_highlight(source_image, source, spec)
        if name.endswith("-trace"):
            layer = add_source_halo(layer, str(spec["color"]))
        layer.save(HIGHLIGHT_DIR / f"{name}.png")
        manifest[name] = {
            "box": spec["box"],
            "method": f"registered-{spec['color']}-source-highlight",
            "alphaExtrema": list(layer.getchannel("A").getextrema()),
        }
        if name.endswith("-trace"):
            manifest[name]["centerline"] = centerline_points(source, spec)
        previews.append((name, layer))

    for name, box in OBJECT_REGIONS.items():
        layer = object_highlight(source_image, source, box)
        layer.save(HIGHLIGHT_DIR / f"{name}.png")
        manifest[name] = {
            "box": box,
            "method": "registered-object-source-highlight",
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
