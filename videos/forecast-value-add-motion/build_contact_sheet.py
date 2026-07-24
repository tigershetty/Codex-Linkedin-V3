from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw


FRAME_TIMES = [0, 0.5, 1.0, 1.6, 2.3, 3.0, 3.7, 4.3, 4.9, 5.6, 6.3, 7.0, 9.0]


def pixel_difference(left: Image.Image, right: Image.Image) -> tuple[int, int]:
    difference = ImageChops.difference(left.convert("RGB"), right.convert("RGB"))
    pixels = np.asarray(difference)
    return int(np.sum(pixels)), int(np.count_nonzero(np.any(pixels != 0, axis=2)))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frames", type=Path, required=True)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--fps", type=int, default=10)
    parser.add_argument(
        "--times",
        help="Comma-separated frame times in seconds. Defaults to the original QA cadence.",
    )
    parser.add_argument("--columns", type=int, default=3)
    parser.add_argument("--cell-width", type=int, default=360)
    parser.add_argument(
        "--index-base",
        type=int,
        default=0,
        help="Add this offset to frame filenames; ffmpeg-decoded GIFs commonly start at 1.",
    )
    args = parser.parse_args()

    source = Image.open(args.source).convert("RGB")
    frame_times = (
        [float(value.strip()) for value in args.times.split(",") if value.strip()]
        if args.times
        else FRAME_TIMES
    )
    if not frame_times:
        raise ValueError("At least one frame time is required")

    cell_width = args.cell_width
    cell_height = round(cell_width * source.height / source.width)
    columns = args.columns
    frame_ids = [round(time * args.fps) for time in frame_times]
    rows = (len(frame_ids) + columns - 1) // columns
    sheet = Image.new("RGB", (cell_width * columns, cell_height * rows), "#e8f0f8")
    draw = ImageDraw.Draw(sheet)

    differences: dict[int, tuple[int, int]] = {}
    for index, (time, frame_id) in enumerate(zip(frame_times, frame_ids, strict=True)):
        stored_frame_id = frame_id + args.index_base
        frame_path = args.frames / f"f_{stored_frame_id:04d}.png"
        frame = Image.open(frame_path).convert("RGB")
        comparison_source = source
        if comparison_source.size != frame.size:
            comparison_source = comparison_source.resize(frame.size, Image.Resampling.LANCZOS)
        differences[frame_id] = pixel_difference(comparison_source, frame)
        frame.thumbnail((cell_width, cell_height), Image.Resampling.LANCZOS)
        x = (index % columns) * cell_width
        y = (index // columns) * cell_height
        sheet.paste(frame, (x, y))
        draw.rectangle((x, y, x + 112, y + 28), fill="#ffffff")
        draw.text((x + 8, y + 7), f"frame {frame_id} / {time:.1f}s", fill="#041f4e")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(args.out)
    for frame_id, (channel_delta, changed_pixels) in differences.items():
        print(f"frame {frame_id}: channel_delta={channel_delta}, changed_pixels={changed_pixels}")


if __name__ == "__main__":
    main()
