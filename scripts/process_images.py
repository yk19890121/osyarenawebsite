import os
import re
from pathlib import Path
from PIL import Image

SRC_DIR = Path(r"C:\Users\yhein_6x\OneDrive\デスクトップ\Claude Code\WEBサイト制作練習\サンプル画像\ファッション")
OUT_DIR = Path(r"C:\Users\yhein_6x\OneDrive\デスクトップ\Claude Code\WEBサイト制作練習\assets\img")
OUT_DIR.mkdir(parents=True, exist_ok=True)

files = sorted(SRC_DIR.glob("*.png"))

# group by uuid
groups = {}
pattern = re.compile(r"_([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})_(\d)\.png$")
for f in files:
    m = pattern.search(f.name)
    if not m:
        print("SKIP (no match):", f.name)
        continue
    uuid, idx = m.group(1), int(m.group(2))
    groups.setdefault(uuid, {})[idx] = f

uuids = sorted(groups.keys())
print(f"Found {len(uuids)} looks, {sum(len(v) for v in groups.values())} images total")

manifest = []

for look_i, uuid in enumerate(uuids, start=1):
    variants = groups[uuid]
    look_data = {"look": look_i, "variants": []}
    for var_i in sorted(variants.keys()):
        src = variants[var_i]
        img = Image.open(src).convert("RGB")
        w, h = img.size

        # full size (max width 1600)
        full = img.copy()
        if full.width > 1600:
            ratio = 1600 / full.width
            full = full.resize((1600, int(full.height * ratio)), Image.LANCZOS)
        full_name = f"look-{look_i:02d}-{var_i}.webp"
        full.save(OUT_DIR / full_name, "WEBP", quality=82, method=6)

        # thumb (max width 700)
        thumb = img.copy()
        if thumb.width > 700:
            ratio = 700 / thumb.width
            thumb = thumb.resize((700, int(thumb.height * ratio)), Image.LANCZOS)
        thumb_name = f"look-{look_i:02d}-{var_i}-thumb.webp"
        thumb.save(OUT_DIR / thumb_name, "WEBP", quality=75, method=6)

        # sample average color from top-left corner (background) for placeholder theming
        corner = img.resize((1, 1), Image.LANCZOS)
        rgb = corner.getpixel((0, 0))

        look_data["variants"].append({
            "idx": var_i,
            "full": full_name,
            "thumb": thumb_name,
            "w": w, "h": h,
            "bg": "#%02x%02x%02x" % rgb
        })
        print(f"look {look_i:02d} var {var_i}: {src.name} -> {full_name} / {thumb_name}  bg={('#%02x%02x%02x' % rgb)}")
    manifest.append(look_data)

import json
with open(OUT_DIR / "manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("DONE")
