#!/usr/bin/env python3
"""Generate favicon.ico from DreamHaven brand colors."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "favicon.ico"

NIGHT_INK = (37, 42, 52, 255)
CLOUD_CREAM = (246, 241, 233, 255)
PALE_OAK = (201, 183, 156, 255)


def draw_monogram(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    radius = max(2, size // 8)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=NIGHT_INK)

    pad = size * 0.14
    inner = size - pad * 2

    # D - doorway pillar + bowl
    d_w = inner * 0.38
    x0, y0 = pad, pad
    draw.rectangle((x0, y0, x0 + d_w * 0.28, y0 + inner), fill=CLOUD_CREAM)
    draw.pieslice(
        (x0 + d_w * 0.05, y0, x0 + d_w, y0 + inner),
        start=270,
        end=90,
        fill=CLOUD_CREAM,
    )
    draw.rectangle(
        (x0 + d_w * 0.38, y0 + inner * 0.12, x0 + d_w * 0.72, y0 + inner * 0.88),
        fill=NIGHT_INK,
    )

    # H - furniture plane
    hx = pad + inner * 0.48
    leg = inner * 0.16
    draw.rectangle((hx, y0, hx + leg, y0 + inner), fill=CLOUD_CREAM)
    draw.rectangle(
        (hx + leg * 0.2, y0 + inner * 0.42, hx + inner * 0.48, y0 + inner * 0.54),
        fill=CLOUD_CREAM,
    )
    draw.rectangle(
        (hx + inner * 0.32, y0, hx + inner * 0.32 + leg, y0 + inner),
        fill=CLOUD_CREAM,
    )

    # Interior plane accent
    draw.rectangle(
        (x0 + d_w * 0.32, y0 + inner * 0.58, hx + leg * 0.5, y0 + inner * 0.64),
        fill=PALE_OAK,
    )

    return img


def main() -> None:
    sizes = [16, 32, 48]
    images = [draw_monogram(s) for s in sizes]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    images[0].save(
        OUT,
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=images[1:],
    )
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
