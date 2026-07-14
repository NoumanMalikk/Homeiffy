#!/usr/bin/env python3
"""Batch-process product images into dark-studio catalog shots.

Removes white backgrounds (flood-fill / rembg), grades the subject, adds a soft
grounding shadow, and composites onto a charcoal gradient suitable for the
WoodMart-dark Homeiffy storefront.
"""

from __future__ import annotations

import os
import shutil
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

os.environ.setdefault("NUMBA_CACHE_DIR", "/tmp/numba_cache")
os.environ.setdefault("NUMBA_DISABLE_JIT", "1")

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS = ROOT / "public" / "products"
ORIGINALS = PRODUCTS / "_originals"
TARGET = 1024
BG_TOP = np.array([28, 28, 28], dtype=np.float32)
BG_BOTTOM = np.array([12, 12, 12], dtype=np.float32)


def list_webps() -> list[Path]:
    names = {"main.webp", "front.webp", "main-front-default.webp"}
    return sorted(
        p
        for p in PRODUCTS.rglob("*.webp")
        if p.name in names and "_originals" not in p.parts
    )


def backup_once(path: Path) -> Path:
    rel = path.relative_to(PRODUCTS)
    dest = ORIGINALS / rel
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, dest)
        png = path.with_suffix(".png")
        if png.exists():
            shutil.copy2(png, dest.with_suffix(".png"))
    return dest


def charcoal_backdrop(size: int) -> Image.Image:
    y = np.linspace(0, 1, size, dtype=np.float32)[:, None]
    y = np.repeat(y, size, axis=1)
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
    cy, cx = size * 0.58, size * 0.5
    rr = np.sqrt(((yy - cy) / (size * 0.55)) ** 2 + ((xx - cx) / (size * 0.42)) ** 2)
    radial = np.clip(1 - rr, 0, 1) ** 1.6
    mix = y * 0.85 + (1 - radial) * 0.15
    rgb = BG_TOP[None, None, :] * (1 - mix[..., None]) + BG_BOTTOM[None, None, :] * mix[
        ..., None
    ]
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))


def is_flat_illustration(rgb: np.ndarray) -> bool:
    s = rgb[::4, ::4]
    q = (s // 16).astype(np.int16)
    keys = q[:, :, 0] * 10000 + q[:, :, 1] * 100 + q[:, :, 2]
    uniq = len(np.unique(keys))
    gray = s.mean(axis=2)
    edge = (
        np.abs(np.diff(gray, axis=1)).mean() + np.abs(np.diff(gray, axis=0)).mean()
    ) / 2
    return uniq < 220 and edge < 8.0


def white_key_cutout(im: Image.Image) -> Image.Image:
    rgba = im.convert("RGBA")
    arr = np.array(rgba)
    rgb = arr[:, :, :3].astype(np.int16)
    near = (rgb[:, :, 0] > 232) & (rgb[:, :, 1] > 232) & (rgb[:, :, 2] > 232)
    h, w = near.shape
    vis = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        if near[0, x]:
            q.append((0, x))
            vis[0, x] = True
        if near[h - 1, x]:
            q.append((h - 1, x))
            vis[h - 1, x] = True
    for y in range(h):
        if near[y, 0] and not vis[y, 0]:
            q.append((y, 0))
            vis[y, 0] = True
        if near[y, w - 1] and not vis[y, w - 1]:
            q.append((y, w - 1))
            vis[y, w - 1] = True
    while q:
        y, x = q.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and not vis[ny, nx] and near[ny, nx]:
                vis[ny, nx] = True
                q.append((ny, nx))
    alpha = np.where(vis, 0, 255).astype(np.uint8)
    alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(radius=1.2)))
    fringe = near & (~vis)
    alpha = alpha.copy()
    alpha[fringe] = (alpha[fringe] * 0.15).astype(np.uint8)
    out = arr.copy()
    out[:, :, 3] = alpha
    return Image.fromarray(out)


def soft_shadow(alpha: np.ndarray, canvas: int) -> Image.Image:
    shadow = Image.fromarray(((alpha > 20).astype(np.uint8) * 255))
    shadow = shadow.resize((canvas, max(8, int(canvas * 0.22))), Image.Resampling.LANCZOS)
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=30))
    layer = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    sx = (canvas - shadow.width) // 2
    sy = int(canvas * 0.74)
    sh = shadow.point(lambda p: int(p * 0.45))
    rgba = Image.merge(
        "RGBA",
        (
            Image.new("L", shadow.size, 0),
            Image.new("L", shadow.size, 0),
            Image.new("L", shadow.size, 0),
            sh,
        ),
    )
    layer.paste(rgba, (sx, sy), rgba)
    return layer.filter(ImageFilter.GaussianBlur(radius=8))


def fit_subject(cutout: Image.Image, canvas: int, margin: float = 0.10) -> Image.Image:
    cutout = cutout.convert("RGBA")
    alpha = np.array(cutout.split()[-1])
    ys, xs = np.where(alpha > 12)
    if len(xs) == 0:
        return Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    cropped = cutout.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    bw, bh = cropped.size
    avail = int(canvas * (1 - 2 * margin))
    scale = min(avail / bw, avail / bh)
    nw, nh = max(1, int(bw * scale)), max(1, int(bh * scale))
    cropped = cropped.resize((nw, nh), Image.Resampling.LANCZOS)
    out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    ox = (canvas - nw) // 2
    oy = int((canvas - nh) * 0.40)
    out.paste(cropped, (ox, oy), cropped)
    return out


def grade(rgba: Image.Image, flat: bool) -> Image.Image:
    r, g, b, a = rgba.split()
    rgb = Image.merge("RGB", (r, g, b))
    if flat:
        w, h = rgb.size
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        light = 0.88 + 0.22 * ((1 - yy / h) * 0.6 + (xx / w) * 0.25)
        arr = np.asarray(rgb).astype(np.float32) * light[..., None]
        mask = np.array(a) > 20
        noise = np.random.default_rng(7).normal(0, 4.5, arr.shape)
        arr[mask] = np.clip(arr[mask] + noise[mask], 0, 255)
        rgb = Image.fromarray(arr.astype(np.uint8))
        rgb = ImageEnhance.Contrast(rgb).enhance(1.1)
        rgb = ImageEnhance.Color(rgb).enhance(1.08)
    else:
        rgb = ImageEnhance.Contrast(rgb).enhance(1.12)
        rgb = ImageEnhance.Color(rgb).enhance(1.05)
        rgb = ImageEnhance.Sharpness(rgb).enhance(1.12)
    r2, g2, b2 = rgb.split()
    return Image.merge("RGBA", (r2, g2, b2, a))


def process_one(path: Path) -> str:
    orig = backup_once(path)
    # Prefer untouched original when available
    source_path = orig if orig.exists() else path
    src = Image.open(source_path).convert("RGBA")
    if max(src.size) != TARGET:
        src = src.resize((TARGET, TARGET), Image.Resampling.LANCZOS)

    rgb = np.array(src.convert("RGB"))
    flat = is_flat_illustration(rgb)
    # Prefer white-key for white-studio / icon assets (safer than rembg on flats)
    if flat or ((rgb[0, 0] > 240).all() and (rgb[0, -1] > 240).all()):
        cut = white_key_cutout(src)
        method = "white-key"
    else:
        from rembg import new_session, remove

        cut = remove(src, session=new_session("u2net"))
        method = "rembg"

    subject = fit_subject(cut, TARGET)
    subject = grade(subject, flat=flat)
    alpha = np.array(subject.split()[-1])
    shadow = soft_shadow(alpha, TARGET)
    backdrop = charcoal_backdrop(TARGET).convert("RGBA")
    composed = Image.alpha_composite(
        Image.alpha_composite(backdrop, shadow), subject
    ).convert("RGB")

    composed.save(path, "WEBP", quality=90, method=6)
    png = path.with_suffix(".png")
    if png.exists() or (ORIGINALS / path.relative_to(PRODUCTS)).with_suffix(".png").exists():
        composed.save(png, "PNG", optimize=True)
    return f"{method} {path.relative_to(PRODUCTS)}"


def main() -> None:
    queue = list_webps()
    print(f"Processing {len(queue)} product images…")
    ok = 0
    for i, path in enumerate(queue, 1):
        try:
            msg = process_one(path)
            ok += 1
            print(f"[{i}/{len(queue)}] {msg}")
        except Exception as exc:  # noqa: BLE001
            print(f"[{i}/{len(queue)}] FAIL {path}: {exc}")
    print(f"Done. {ok}/{len(queue)} succeeded. Originals in {ORIGINALS}")


if __name__ == "__main__":
    main()
