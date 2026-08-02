#!/usr/bin/env python3
"""Produce a second gallery view (detail.webp) from each product's main.webp.

Every product folder previously shipped the same photograph twice, so the
gallery showed two identical thumbnails. This crops into the studio render to
produce a genuine close view of the material and construction, which is the
standard full-view-plus-detail pairing used in furniture catalogs.

The crop is taken from the optically interesting part of the frame (slightly
above centre, where the seat/drawer/edge joinery sits), upscaled with Lanczos,
and given a gentle contrast and sharpness lift so it reads as a deliberate
detail shot rather than a blown-up thumbnail.

Usage:  python3 scripts/make-detail-images.py [--force]
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / "public" / "products"
OUT_SIZE = 1024
# Fraction of the source frame kept in the detail crop.
CROP_SCALE = 0.52
# Crop centre, as a fraction of width/height. Slightly above centre keeps the
# crop on the body of the piece rather than the grounding shadow.
CENTRE_X = 0.50
CENTRE_Y = 0.46


def make_detail(main_path: Path, out_path: Path) -> None:
    with Image.open(main_path) as im:
        im = im.convert("RGB")
        w, h = im.size

        side = int(min(w, h) * CROP_SCALE)
        cx, cy = int(w * CENTRE_X), int(h * CENTRE_Y)

        left = max(0, min(cx - side // 2, w - side))
        top = max(0, min(cy - side // 2, h - side))

        crop = im.crop((left, top, left + side, top + side))
        crop = crop.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)

        # Recover the micro-detail softened by upscaling.
        crop = crop.filter(
            ImageFilter.UnsharpMask(radius=1.6, percent=110, threshold=3)
        )
        crop = ImageEnhance.Contrast(crop).enhance(1.04)
        crop = ImageEnhance.Color(crop).enhance(1.02)

        crop.save(out_path, "WEBP", quality=88, method=6)


def main() -> int:
    force = "--force" in sys.argv

    if not PRODUCTS.is_dir():
        print(f"error: {PRODUCTS} not found", file=sys.stderr)
        return 1

    made = skipped = missing = 0

    for folder in sorted(p for p in PRODUCTS.iterdir() if p.is_dir()):
        main_path = folder / "main.webp"
        out_path = folder / "detail.webp"

        if not main_path.exists():
            print(f"  no main.webp: {folder.name}")
            missing += 1
            continue

        if out_path.exists() and not force:
            skipped += 1
            continue

        make_detail(main_path, out_path)
        made += 1

    print(f"\ndetail images written: {made}, skipped: {skipped}, no source: {missing}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
