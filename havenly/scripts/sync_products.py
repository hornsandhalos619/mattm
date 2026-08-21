#!/usr/bin/env python
"""Sync Product Line store assets into havenly's public/ folder.

Copies each product's mockups + design PNG from
~/HA.OS/productline/store/<slug>/ into <havenly>/public/products/<slug>/
so the static export bakes the images in. Run before `next build`.
"""
import os, shutil, sys

STORE = os.path.expanduser("~/HA.OS/productline/store")
DEST_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "products")

EXTS = (".jpg", ".jpeg", ".png", ".webp")


def main() -> int:
    if not os.path.isdir(STORE):
        # CI (Netlify) has no local store — public/ is committed, so this is fine.
        print("store dir missing:", STORE, "— skipping sync (committed assets will be used)")
        return 0
    n = 0
    for slug in sorted(os.listdir(STORE)):
        src = os.path.join(STORE, slug)
        if not os.path.isdir(src):
            continue
        dst = os.path.join(DEST_ROOT, slug)
        os.makedirs(dst, exist_ok=True)
        for f in os.listdir(src):
            if f.lower().endswith(EXTS):
                shutil.copy2(os.path.join(src, f), os.path.join(dst, f))
                n += 1
        print("synced", slug)
    print(f"done: {n} files -> {os.path.normpath(DEST_ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
