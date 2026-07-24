from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


PROJECT_DIR = Path(__file__).resolve().parent
REPO_DIR = PROJECT_DIR.parents[1]
SOURCE = REPO_DIR / "infographic-setup/data/2026-W32/five-pre-sop-reviews/visual.png"
ASSET_DIR = PROJECT_DIR / "assets"
LAYER_DIR = ASSET_DIR / "layers"


COMPONENTS: dict[str, dict[str, object]] = {
    "review-01": {
        "box": [92, 274, 516, 601],
        "polygon": [
            [44, 18], [348, 0], [412, 46], [424, 235],
            [382, 304], [65, 327], [2, 270], [0, 76],
        ],
    },
    "review-02": {
        "box": [536, 270, 984, 605],
        "polygon": [
            [34, 23], [388, 12], [448, 60], [432, 276],
            [386, 327], [44, 335], [0, 282], [4, 74],
        ],
    },
    "review-03": {
        "box": [88, 598, 406, 996],
        "polygon": [
            [31, 20], [217, 0], [276, 28], [318, 326],
            [271, 389], [52, 398], [0, 341], [4, 77],
        ],
    },
    "review-04": {
        "box": [692, 596, 994, 1000],
        "polygon": [
            [52, 0], [275, 15], [302, 72], [286, 344],
            [240, 397], [47, 404], [0, 345], [8, 75],
        ],
    },
    "review-05": {
        "box": [226, 912, 832, 1145],
        "polygon": [
            [35, 28], [548, 0], [603, 51], [606, 165],
            [554, 224], [49, 233], [0, 180], [0, 75],
        ],
    },
    "executive-table": {
        "box": [326, 514, 762, 876],
        "shape": "rounded",
        "radius": 112,
    },
    "readiness-strip": {
        "box": [240, 1129, 846, 1224],
        "shape": "rounded",
        "radius": 14,
    },
}


def fitted_surface(source: np.ndarray) -> np.ndarray:
    source_float = source.astype(np.float32)
    height, width, _ = source_float.shape
    yy, xx = np.mgrid[0:height, 0:width]
    xn = xx / max(width - 1, 1)
    yn = yy / max(height - 1, 1)
    chroma = np.max(source_float, axis=2) - np.min(source_float, axis=2)
    clean = (np.min(source_float, axis=2) > 182) & (chroma < 46)
    features = np.stack(
        [np.ones_like(xn), xn, yn, xn * yn, xn**2, yn**2], axis=-1
    )
    samples = features[clean]
    if len(samples) < 100:
        raise ValueError("Not enough pale source pixels to fit the motion stage")

    output = np.empty_like(source_float)
    for channel in range(3):
        coefficients, *_ = np.linalg.lstsq(
            samples, source_float[..., channel][clean], rcond=None
        )
        output[..., channel] = features @ coefficients
    return np.clip(output, 220, 255).astype(np.uint8)


def stage_background(source: Image.Image) -> Image.Image:
    width, height = source.size
    plate = Image.fromarray(fitted_surface(np.asarray(source)), mode="RGB")
    draw = ImageDraw.Draw(plate, "RGBA")

    for x in range(0, width + 1, 54):
        draw.line((x, 270, x, 1224), fill=(36, 99, 181, 13), width=1)
    for y in range(284, 1225, 54):
        draw.line((0, y, width, y), fill=(36, 99, 181, 12), width=1)

    vanishing = (540, 405)
    for x in range(-180, width + 181, 90):
        draw.line((vanishing[0], vanishing[1], x, 1224), fill=(30, 88, 165, 11), width=1)

    draw.ellipse((180, 455, 900, 1070), fill=(34, 106, 206, 3))
    draw.ellipse((265, 530, 815, 985), outline=(40, 106, 181, 16), width=2)

    # Keep the authored headline and exact logo/desk props stable while the
    # operating architecture assembles in the central stage.
    header_height = 280
    header = source.crop((0, 0, width, header_height))
    header_mask = Image.new("L", (width, header_height), 255)
    header_pixels = header_mask.load()
    for y in range(270, header_height):
        alpha = round(255 * (header_height - 1 - y) / (header_height - 270))
        for x in range(width):
            header_pixels[x, y] = max(0, alpha)
    plate.paste(header, (0, 0), header_mask)

    footer_top = 1224
    footer = source.crop((0, footer_top, width, height))
    footer_mask = Image.new("L", footer.size, 255)
    footer_pixels = footer_mask.load()
    fade_end = 24
    for y in range(fade_end):
        alpha = round(255 * y / max(fade_end - 1, 1))
        for x in range(width):
            footer_pixels[x, y] = alpha
    plate.paste(footer, (0, footer_top), footer_mask)
    return plate


def component_mask(size: tuple[int, int], spec: dict[str, object]) -> Image.Image:
    scale = 4
    hi_size = (size[0] * scale, size[1] * scale)
    mask = Image.new("L", hi_size, 0)
    draw = ImageDraw.Draw(mask)

    if spec.get("shape") == "rounded":
        radius = int(spec.get("radius", 24)) * scale
        draw.rounded_rectangle(
            (3 * scale, 3 * scale, hi_size[0] - 3 * scale, hi_size[1] - 3 * scale),
            radius=radius,
            fill=255,
        )
    else:
        points = [tuple(int(value) * scale for value in point) for point in spec["polygon"]]
        draw.polygon(points, fill=255)

    mask = mask.resize(size, Image.Resampling.LANCZOS)
    return mask.filter(ImageFilter.GaussianBlur(0.7))


def extract_component(source: Image.Image, spec: dict[str, object]) -> Image.Image:
    box = tuple(int(value) for value in spec["box"])
    layer = source.crop(box).convert("RGBA")
    layer.putalpha(component_mask(layer.size, spec))
    return layer


def contact_sheet(items: list[tuple[str, Image.Image]]) -> Image.Image:
    width = 920
    row_height = 205
    sheet = Image.new("RGB", (width, row_height * len(items)), "#eef6fe")
    draw = ImageDraw.Draw(sheet)
    for index, (name, layer) in enumerate(items):
        top = index * row_height
        draw.text((20, top + 14), name, fill="#071f4e")
        preview = layer.convert("RGBA")
        scale = min(870 / preview.width, 150 / preview.height, 1)
        if scale < 1:
            preview = preview.resize(
                (round(preview.width * scale), round(preview.height * scale)),
                Image.Resampling.LANCZOS,
            )
        x = (width - preview.width) // 2
        sheet.paste(preview, (x, top + 42), preview)
    return sheet


def main() -> None:
    LAYER_DIR.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGB")
    if source.size != (1080, 1350):
        raise ValueError(f"Motion source must be 1080 x 1350, got {source.size}")

    source.save(ASSET_DIR / "visual.png")
    stage = stage_background(source)
    stage.save(ASSET_DIR / "stage-background.png", optimize=True)

    manifest: dict[str, dict[str, object]] = {
        "source": {
            "path": str(SOURCE.relative_to(REPO_DIR)),
            "size": list(source.size),
            "method": "locked-canonical-linkedin-master",
        },
        "stage-background": {
            "size": list(stage.size),
            "method": "deterministic-brand-stage-with-locked-header-and-logo",
        },
    }
    previews: list[tuple[str, Image.Image]] = [("stage-background", stage)]

    for name, spec in COMPONENTS.items():
        layer = extract_component(source, spec)
        layer.save(LAYER_DIR / f"{name}.png", optimize=True)
        manifest[name] = {
            "box": spec["box"],
            "method": "source-component-alpha-isolation",
            "alphaExtrema": list(layer.getchannel("A").getextrema()),
        }
        previews.append((name, layer))

    (ASSET_DIR / "asset-manifest-v2.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    contact_sheet(previews).save(ASSET_DIR / "layer-contact-sheet-v2.png")
    print(f"wrote {len(COMPONENTS)} source layers and one clean stage to {ASSET_DIR}")


if __name__ == "__main__":
    main()
