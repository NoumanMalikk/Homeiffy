#!/usr/bin/env python3
"""Install a product photograph into the catalog.

Takes any source image (JPG, PNG, WEBP), converts it to the catalog's dark
studio format, writes `main.webp`, generates the matching `detail.webp`, and
tells you to regenerate the catalog so the gallery picks it up.

Usage:
    python3 scripts/add-product-photo.py <product-slug> <path/to/photo.jpg>

    # every product still waiting on photography
    python3 scripts/add-product-photo.py --list

After adding photos, run:
    python3 scripts/make-detail-images.py
"""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / "public" / "products"
CATALOG = ROOT / "src" / "data" / "products.ts"
TARGET = 1024


def pending_slugs() -> list[str]:
    text = CATALOG.read_text()
    out = []
    for block in text.split("defineProduct({")[1:]:
        if "type: 'placeholder'" in block:
            match = re.search(r"slug: '([^']+)'", block)
            if match:
                out.append(match.group(1))
    return out


def all_slugs() -> set[str]:
    return set(re.findall(r"slug: '([^']+)'", CATALOG.read_text()))


def install(slug: str, source: Path) -> int:
    if slug not in all_slugs():
        print(f"error: '{slug}' is not a product slug in the catalog")
        return 1

    if not source.is_file():
        print(f"error: no such file: {source}")
        return 1

    folder = PRODUCTS / slug
    folder.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as im:
        im = im.convert("RGB")
        width, height = im.size
        side = min(width, height)
        im = im.crop((
            (width - side) // 2,
            (height - side) // 2,
            (width - side) // 2 + side,
            (height - side) // 2 + side,
        ))
        im = im.resize((TARGET, TARGET), Image.LANCZOS)
        im.save(folder / "main.webp", "WEBP", quality=90, method=6)

    print(f"wrote {folder / 'main.webp'}")

    detail_script = ROOT / "scripts" / "make-detail-images.py"
    subprocess.run([sys.executable, str(detail_script)], check=False)

    print(
        "\nNow regenerate the catalog so the gallery picks up the new files:\n"
        "  the imageGallery for each product is built from the files on disk."
    )
    return 0


def main() -> int:
    args = sys.argv[1:]

    if not args or args[0] in {"-h", "--help"}:
        print(__doc__)
        return 0

    if args[0] == "--list":
        pending = pending_slugs()
        if not pending:
            print("Every product has photography on file.")
            return 0
        print(f"{len(pending)} product(s) awaiting photography:\n")
        for slug in pending:
            print(f"  {slug}")
        print("\nAdd one with:")
        print("  python3 scripts/add-product-photo.py <slug> <photo.jpg>")
        return 0

    if len(args) != 2:
        print(__doc__)
        return 1

    return install(args[0], Path(args[1]).expanduser())


if __name__ == "__main__":
    raise SystemExit(main())
