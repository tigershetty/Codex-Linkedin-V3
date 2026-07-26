# Review Archive - 2026-07-20

## Purpose

This archive preserves the temporary artifacts used during the July 2026 Top-100 reference audit and S&OP resource review. Keep it available for future visual breakdowns, quality comparisons, research tracing, and workflow learning.

These files are review evidence. They are not canonical publishing assets and should not replace the original references, source workbook, or approved resource package.

## Contents

### `utilities/` - 2 files

- `build_top100_contact_sheets.py` creates ten labeled contact sheets from the images in `infographic-setup/references/top 100/`.
- `extract_top100_captions.py` reads `Reference File and Caption.xlsx` and prints the opener, closing lines, and URLs for a selected reference range.

### `top100-contact-sheets/` - 10 files

The files `refs-001-010.jpg` through `refs-091-100.jpg` provide a compact visual index of the Top-100 reference corpus. Each sheet is 2500 x 1280 pixels and contains ten labeled references.

Use these sheets for broad pattern recognition and comparison. Inspect the original reference file before making detailed claims about typography, content, creator attribution, or visual mechanics.

### `pdf-renders/` - 21 files

- `sop-guide/`: five rendered pages from the earlier S&OP guide review.
- `sop-prework-v1-1/`: five rendered pages from one pre-work guide iteration.
- `sop-prework-v1.1.0/`: five rendered pages from the version 1.1.0 iteration.
- `sop-prework-v1.2/`: five rendered pages plus `recheck-2.png` from the version 1.2 review.

These PNGs preserve the page-level visual QA history across successive PDF versions. The approved source package remains under `infographic-setup/data/2026-W32/five-pre-sop-reviews/resource/`.

## Regeneration

From the repository root:

```bash
python3 infographic-setup/references/review-archive/2026-07-20/utilities/build_top100_contact_sheets.py
python3 infographic-setup/references/review-archive/2026-07-20/utilities/extract_top100_captions.py 1 10
```

The scripts are preserved as historical utilities. Their output paths still point to root `tmp/`, keeping regenerated inspection files outside the permanent archive until they are intentionally reviewed and promoted.

Dependencies:

- Pillow for contact-sheet generation.
- openpyxl for caption-workbook extraction.

## Archive Policy

- Preserve these files as historical review evidence.
- Do not use contact sheets instead of original-resolution references for final visual analysis.
- Do not edit archived renders to represent a newer resource version.
- Add a new dated archive when a future review produces evidence worth retaining.
