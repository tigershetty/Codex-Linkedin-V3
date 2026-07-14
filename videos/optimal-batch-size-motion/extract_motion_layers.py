from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent
POST_DIR = REPO / "infographic-setup/data/2026-W30/optimal-batch-size-decision-board"
MAP_PATH = POST_DIR / "motion-map.json"
ASSET_DIR = ROOT / "optimal-batch-size-motion/assets"
LAYER_DIR = ASSET_DIR / "layers"


def crop_layer(source: Image.Image, box: list[int], out_path: Path) -> None:
    x1, y1, x2, y2 = box
    crop = source.crop((x1, y1, x2, y2))
    crop.save(out_path)


def main() -> None:
    motion_map = json.loads(MAP_PATH.read_text())
    source = Image.open(POST_DIR / motion_map["source"]).convert("RGBA")

    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    LAYER_DIR.mkdir(parents=True, exist_ok=True)
    source.save(ASSET_DIR / "visual.png")

    layers = motion_map["layers"]
    for key in ["formula", "costCurve", "tradeOffCheck", "verifyStrip", "brandPlacard"]:
      crop_layer(source, layers[key]["box"], LAYER_DIR / f"{key}.png")

    for option in layers["batchOptions"]:
      crop_layer(source, option["box"], LAYER_DIR / f"{option['name']}.png")

    print(f"wrote layers to {LAYER_DIR}")


if __name__ == "__main__":
    main()
