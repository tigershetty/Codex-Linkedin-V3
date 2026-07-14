from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


PROJECT_DIR = Path(__file__).resolve().parent
REPO_DIR = PROJECT_DIR.parents[1]
SOURCE = REPO_DIR / "infographic-setup/data/2026-W31/bom-to-mps-connection/visual.png"
ASSET_DIR = PROJECT_DIR / "assets"
HIGHLIGHT_DIR = ASSET_DIR / "highlights"


SEMANTIC_REGIONS = {
    "mps-ticket": {"box": [281, 151, 569, 348], "color": "blue"},
    "bom-label": {"box": [300, 368, 550, 421], "color": "blue"},
    "net-on-hand": {"box": [236, 1035, 397, 1189], "color": "green"},
    "net-receipt": {"box": [437, 1035, 601, 1189], "color": "green"},
    "net-result": {"box": [640, 1035, 813, 1191], "color": "red"},
    "supply-make": {"box": [61, 1427, 289, 1535], "color": "blue"},
    "supply-buy": {"box": [286, 1427, 548, 1535], "color": "blue"},
    "supply-reschedule": {"box": [545, 1427, 790, 1535], "color": "blue"},
    "dist-bom": {"box": [27, 1551, 293, 1636], "color": "blue"},
    "dist-mps": {"box": [292, 1551, 542, 1636], "color": "blue"},
    "dist-mrp": {"box": [540, 1551, 818, 1636], "color": "blue"},
}

OBJECT_REGIONS = {
    "tray-housing": [10, 722, 216, 994],
    "tray-motor": [238, 722, 450, 994],
    "tray-bearings": [454, 722, 637, 994],
    "tray-fasteners": [652, 722, 836, 994],
    "net-gross": [35, 1028, 219, 1192],
}


def color_confidence(rgb: np.ndarray, color: str) -> np.ndarray:
    px = rgb.astype(np.float32)
    r, g, b = px[..., 0], px[..., 1], px[..., 2]

    if color == "blue":
        confidence = np.minimum(b - r * 1.08, b - g * 1.01)
        gate = (b > 82) & (confidence > 5)
    elif color == "green":
        confidence = np.minimum(g - r * 1.06, g - b * 1.02)
        gate = (g > 68) & (confidence > 5)
    elif color == "red":
        confidence = np.minimum(r - g * 1.13, r - b * 1.14)
        gate = (r > 145) & (confidence > 8)
    else:
        raise ValueError(f"unsupported color: {color}")

    alpha = np.clip(confidence * 4.8, 0, 255)
    return np.where(gate, alpha, 0).astype(np.uint8)


def semantic_highlight(source_image: Image.Image, source: np.ndarray, spec: dict) -> Image.Image:
    box = spec["box"]
    x1, y1, x2, y2 = box
    crop = source[y1:y2, x1:x2]
    alpha = Image.fromarray(color_confidence(crop, spec["color"]), mode="L")
    alpha = alpha.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    layer = source_image.crop(tuple(box)).convert("RGBA")
    layer = ImageEnhance.Brightness(layer).enhance(1.24)
    layer = ImageEnhance.Color(layer).enhance(1.10)
    layer.putalpha(alpha)
    return layer


def fitted_surface(source: np.ndarray) -> np.ndarray:
    crop = source.astype(np.float32)
    height, width, _ = crop.shape
    yy, xx = np.mgrid[0:height, 0:width]
    xn = xx / max(width - 1, 1)
    yn = yy / max(height - 1, 1)
    chroma = np.max(crop, axis=2) - np.min(crop, axis=2)
    clean = (np.min(crop, axis=2) > 178) & (chroma < 48)
    features = np.stack(
        [np.ones_like(xn), xn, yn, xn * yn, xn**2, yn**2], axis=-1
    )
    samples = features[clean]
    if len(samples) < 24:
        clean = np.min(crop, axis=2) > 160
        samples = features[clean]

    output = np.empty_like(crop)
    for channel in range(3):
        coefficients, *_ = np.linalg.lstsq(
            samples, crop[..., channel][clean], rcond=None
        )
        output[..., channel] = features @ coefficients
    return np.clip(output, 180, 255).astype(np.uint8)


def object_highlight(source_image: Image.Image, source: np.ndarray, box: list[int]) -> Image.Image:
    x1, y1, x2, y2 = box
    crop = source[y1:y2, x1:x2]
    fitted = fitted_surface(crop)
    difference = np.linalg.norm(crop.astype(np.float32) - fitted.astype(np.float32), axis=2)
    chroma = np.max(crop, axis=2) - np.min(crop, axis=2)
    gate = (difference > 16) & ((np.min(crop, axis=2) < 225) | (chroma > 18))
    alpha = np.where(gate, np.clip(difference * 4.2, 0, 215), 0).astype(np.uint8)
    mask = Image.fromarray(alpha, mode="L").filter(ImageFilter.MaxFilter(3))
    mask = mask.filter(ImageFilter.GaussianBlur(0.7))
    layer = source_image.crop(tuple(box)).convert("RGBA")
    layer = ImageEnhance.Brightness(layer).enhance(1.16)
    layer = ImageEnhance.Color(layer).enhance(1.06)
    layer.putalpha(mask)
    return layer


def contact_sheet(items: list[tuple[str, Image.Image]]) -> Image.Image:
    width = 780
    row_height = 178
    sheet = Image.new("RGB", (width, row_height * len(items)), "#eef6fe")
    draw = ImageDraw.Draw(sheet)
    for index, (name, layer) in enumerate(items):
        top = index * row_height
        draw.text((18, top + 12), name, fill="#071f4e")
        preview = layer.convert("RGBA")
        scale = min(730 / preview.width, 130 / preview.height, 1)
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

    for name, spec in SEMANTIC_REGIONS.items():
        layer = semantic_highlight(source_image, source, spec)
        layer.save(HIGHLIGHT_DIR / f"{name}.png")
        manifest[name] = {
            "box": spec["box"],
            "method": f"registered-{spec['color']}-source-highlight",
            "alphaExtrema": list(layer.getchannel("A").getextrema()),
        }
        previews.append((name, layer))

    for name, box in OBJECT_REGIONS.items():
        layer = object_highlight(source_image, source, box)
        layer.save(HIGHLIGHT_DIR / f"{name}.png")
        manifest[name] = {"box": box, "method": "registered-object-source-highlight"}
        previews.append((name, layer))

    (ASSET_DIR / "asset-manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    contact_sheet(previews).save(ASSET_DIR / "asset-contact-sheet.png")
    print(f"wrote {len(manifest)} registered motion assets to {ASSET_DIR}")


if __name__ == "__main__":
    main()
