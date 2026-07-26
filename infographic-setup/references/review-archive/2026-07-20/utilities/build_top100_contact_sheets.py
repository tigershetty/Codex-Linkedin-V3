from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


SOURCE = Path("infographic-setup/references/top 100")
OUTPUT = Path("tmp/top100-contact-sheets")
TILE_WIDTH = 500
TILE_HEIGHT = 640
LABEL_HEIGHT = 42


def source_for(reference: int) -> Path | None:
    matches = sorted(SOURCE.glob(f"{reference}.*"))
    return matches[0] if matches else None


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    font = ImageFont.load_default(size=24)

    for group_start in range(1, 101, 10):
        sheet = Image.new("RGB", (TILE_WIDTH * 5, TILE_HEIGHT * 2), "#d9dde5")
        draw = ImageDraw.Draw(sheet)
        for offset in range(10):
            reference = group_start + offset
            col = offset % 5
            row = offset // 5
            x = col * TILE_WIDTH
            y = row * TILE_HEIGHT
            path = source_for(reference)
            if path:
                with Image.open(path) as opened:
                    opened.seek(0)
                    image = opened.convert("RGB")
                image = ImageOps.contain(
                    image,
                    (TILE_WIDTH - 16, TILE_HEIGHT - LABEL_HEIGHT - 16),
                    Image.Resampling.LANCZOS,
                )
                px = x + (TILE_WIDTH - image.width) // 2
                py = y + LABEL_HEIGHT + (TILE_HEIGHT - LABEL_HEIGHT - image.height) // 2
                sheet.paste(image, (px, py))
            else:
                draw.rectangle((x + 8, y + LABEL_HEIGHT + 8, x + TILE_WIDTH - 8, y + TILE_HEIGHT - 8), fill="#f4f5f8")
                draw.text((x + 24, y + 100), "MISSING", fill="#8b95a8", font=font)
            draw.rectangle((x, y, x + TILE_WIDTH, y + LABEL_HEIGHT), fill="#101a33")
            draw.text((x + 14, y + 8), f"REF {reference}", fill="white", font=font)
        sheet.save(OUTPUT / f"refs-{group_start:03d}-{group_start + 9:03d}.jpg", quality=92)


if __name__ == "__main__":
    main()
