# Product images

Catalog images live in each product slug folder (`main.webp`, `front.webp`).

Studio processing: run `python3 scripts/studioize-product-images.py` to remove
white backgrounds and composite charcoal studio backdrops with soft grounding
shadows. Originals are copied once to `public/products/_originals/` (gitignored).

