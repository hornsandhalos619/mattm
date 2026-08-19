#!/usr/bin/env python
"""HA.OS Product Line — bot chain backend.

Bots in the line:
  1. designer    : LLM turns an idea into a brand-consistent design prompt
  2. artist      : OpenRouter image model generates the artwork
  3. cutout      : PIL removes the flat background -> transparent PNG
  4. mockup      : PIL composites the design onto tee / hoodie / mug / poster
  5. copywriter  : LLM writes title, description, tags, price
  6. publisher   : writes listing.json/.md, storefront page, shopify import CSV

State per product:  <ROOT>/products/<slug>/status.json
Run one product:    python botline.py run "<idea>"
List products:      python botline.py board
Serve is done by the HA.OS portal tab (or `python botline.py serve` for dev).
"""
import os, re, sys, json, time, base64, io, csv, shutil, subprocess, urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
PRODUCTS = os.path.join(ROOT, "products")
STORE = os.path.join(ROOT, "store")          # local storefront (served by portal)
HAVENLY = os.path.expanduser("~/havenly")    # user's own Next.js shop site

IMG_MODEL = os.environ.get("BOTLINE_IMG_MODEL", "google/gemini-3.1-flash-image")
TXT_MODEL = os.environ.get("BOTLINE_TXT_MODEL", "google/gemini-3.1-flash-lite")
OR_BASE = "https://openrouter.ai/api/v1"

BRAND_STYLE = ("bold streetwear emblem, flat vector illustration, high contrast, "
               "limited palette of gold #d4af37, crimson #8a0303 and off-white on a "
               "SOLID PURE BLACK background, centered composition, clean edges, no text")


def api_key():
    for envp in (os.path.expanduser("~/.hermes/.env"),
                 os.path.join(os.environ.get("LOCALAPPDATA", ""), "hermes", ".env")):
        try:
            for line in open(envp, encoding="utf-8"):
                if line.startswith("OPENROUTER_API_KEY="):
                    return line.strip().split("=", 1)[1]
        except OSError:
            pass
    raise SystemExit("NO_KEY: set OPENROUTER_API_KEY in ~/.hermes/.env")


def http_json(url, payload, timeout=180):
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode(),
        headers={"Authorization": "Bearer " + api_key(),
                 "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def slugify(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return (s or "product")[:48] + "-" + time.strftime("%y%m%d-%H%M%S")


def set_stage(pdir, slug, stage, status="running", extra=None):
    st = {"slug": slug, "stage": stage, "status": status, "ts": int(time.time())}
    sf = os.path.join(pdir, "status.json")
    prev = {}
    if os.path.exists(sf):
        try: prev = json.load(open(sf, encoding="utf-8"))
        except OSError: pass
    prev.update(st)
    if extra: prev.update(extra)
    json.dump(prev, open(sf, "w", encoding="utf-8"), indent=2)
    return prev


# ---------------------------------------------------------------- bots

def bot_designer(idea):
    r = http_json(OR_BASE + "/chat/completions", {
        "model": TXT_MODEL,
        "messages": [
            {"role": "system", "content": "You are a print designer for a streetwear brand "
             "called Horns & Halos (duality theme: angel halo + devil horns). Reply with ONLY "
             "a single vivid image prompt, 40-70 words, no quotes."},
            {"role": "user", "content": f"Product idea: {idea}\nBrand style: {BRAND_STYLE}"}],
        "max_tokens": 200})
    return r["choices"][0]["message"]["content"].strip()


def bot_artist(prompt, out_png):
    r = http_json(OR_BASE + "/images/generations", {
        "model": IMG_MODEL, "n": 1, "prompt": prompt +
        " Background must be solid pure black (#000000), nothing else in frame."})
    item = r["data"][0]
    b64 = item.get("b64_json")
    if not b64 and item.get("url", "").startswith("data:"):
        b64 = item["url"].split(",", 1)[1]
    if not b64:
        raise RuntimeError("artist: no b64 image in response")
    open(out_png, "wb").write(base64.b64decode(b64))
    return out_png


def bot_cutout(src_png, out_png):
    """Remove the flat background (corner colour) -> transparent PNG."""
    from PIL import Image
    im = Image.open(src_png).convert("RGBA")
    px = im.load()
    w, h = im.size
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg = max(set(corners), key=corners.count)
    tol = 42
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if abs(r - bg[0]) <= tol and abs(g - bg[1]) <= tol and abs(b - bg[2]) <= tol:
                px[x, y] = (r, g, b, 0)
    im.save(out_png)
    return out_png


TEMPLATES = {
    "tee":    dict(body=(52, 52, 60),  size=(1000, 1000), box=(330, 300, 670, 640)),
    "hoodie": dict(body=(30, 34, 44),  size=(1000, 1000), box=(330, 330, 670, 670)),
    "mug":    dict(body=(238, 236, 230), size=(1000, 1000), box=(330, 380, 670, 700)),
    "poster": dict(body=(24, 24, 28),  size=(800, 1000),  box=(120, 160, 680, 720)),
}


def _draw_template(kind, t):
    from PIL import Image, ImageDraw
    W, H = t["size"]
    im = Image.new("RGBA", (W, H), (16, 16, 20, 255))
    d = ImageDraw.Draw(im)
    if kind == "tee":
        d.rounded_rectangle([210, 140, 790, 910], 40, fill=t["body"] + (255,))
        d.rounded_rectangle([140, 140, 330, 430], 30, fill=t["body"] + (255,))
        d.rounded_rectangle([670, 140, 860, 430], 30, fill=t["body"] + (255,))
        d.arc([430, 120, 570, 240], 0, 180, fill=(20, 20, 24, 255), width=14)
    elif kind == "hoodie":
        d.rounded_rectangle([210, 200, 790, 910], 40, fill=t["body"] + (255,))
        d.rounded_rectangle([140, 200, 330, 500], 30, fill=t["body"] + (255,))
        d.rounded_rectangle([670, 200, 860, 500], 30, fill=t["body"] + (255,))
        d.ellipse([360, 90, 640, 300], fill=(22, 26, 36, 255))          # hood
        d.rounded_rectangle([380, 640, 620, 830], 24, fill=(22, 26, 36, 255))  # pocket
    elif kind == "mug":
        d.rounded_rectangle([300, 330, 700, 760], 26, fill=t["body"] + (255,))
        d.ellipse([660, 430, 810, 660], outline=t["body"] + (255,), width=34)  # handle
        d.ellipse([300, 310, 700, 380], fill=(250, 248, 242, 255))     # rim
    else:  # poster
        d.rectangle([60, 60, W - 60, H - 60], fill=(245, 243, 238, 255))
        d.rectangle([90, 90, W - 90, H - 90], outline=(20, 20, 24, 255), width=4)
    return im


def bot_mockup(design_png, pdir):
    from PIL import Image
    design = Image.open(design_png).convert("RGBA")
    made = []
    for kind, t in TEMPLATES.items():
        base = _draw_template(kind, t)
        x1, y1, x2, y2 = t["box"]
        bw, bh = x2 - x1, y2 - y1
        dw, dh = design.size
        sc = min(bw / dw, bh / dh)
        d2 = design.resize((max(1, int(dw * sc)), max(1, int(dh * sc))), Image.LANCZOS)
        base.alpha_composite(d2, (x1 + (bw - d2.width) // 2, y1 + (bh - d2.height) // 2))
        out = os.path.join(pdir, f"mockup_{kind}.jpg")
        base.convert("RGB").save(out, quality=92)
        made.append(out)
    return made


def bot_copywriter(idea, slug):
    r = http_json(OR_BASE + "/chat/completions", {
        "model": TXT_MODEL,
        "messages": [
            {"role": "system", "content": "You write e-commerce listings. Reply with STRICT JSON only: "
             '{"title": str(<=70 chars), "description": str(2-3 sentences), "tags": [8-12 short strings], '
             '"price_usd": number, "seo_title": str(<=60), "seo_description": str(<=155)}'},
            {"role": "user", "content": f"Design idea: {idea}. Brand: Horns & Halos streetwear."}],
        "max_tokens": 500, "response_format": {"type": "json_object"}})
    txt = r["choices"][0]["message"]["content"]
    return json.loads(txt)


def bot_publish(pdir, slug, listing, mockups):
    listing["slug"] = slug
    listing["images"] = [os.path.basename(m) for m in mockups]
    listing["design"] = "design_cutout.png"
    listing["published_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    json.dump(listing, open(os.path.join(pdir, "listing.json"), "w", encoding="utf-8"), indent=2)
    md = (f"# {listing['title']}\n\n{listing['description']}\n\n"
          f"**Price:** ${listing['price_usd']}  \n**Tags:** {', '.join(listing['tags'])}\n")
    open(os.path.join(pdir, "listing.md"), "w", encoding="utf-8").write(md)

    # 1) local storefront copy (portal serves /store)
    sdir = os.path.join(STORE, slug)
    os.makedirs(sdir, exist_ok=True)
    for f in os.listdir(pdir):
        if f.endswith((".jpg", ".png", ".json", ".md")):
            shutil.copy2(os.path.join(pdir, f), os.path.join(sdir, f))

    # 2) user's own site (havenly Next.js) — drop a data file it can import
    hdir = os.path.join(HAVENLY, "data")
    os.makedirs(hdir, exist_ok=True)
    idx = os.path.join(hdir, "products.json")
    arr = []
    if os.path.exists(idx):
        try: arr = json.load(open(idx, encoding="utf-8"))
        except OSError: pass
    arr = [p for p in arr if p.get("slug") != slug] + [listing]
    json.dump(arr, open(idx, "w", encoding="utf-8"), indent=2)

    # 3) shopping sites — Shopify bulk-import CSV (works with no API key)
    csv_path = os.path.join(pdir, "shopify_import.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["Handle", "Title", "Body (HTML)", "Vendor", "Tags", "Published",
                    "Variant Price", "Image Src"])
        w.writerow([slug, listing["title"], f"<p>{listing['description']}</p>",
                    "Horns & Halos", ", ".join(listing["tags"]), "TRUE",
                    listing["price_usd"], f"/store/{slug}/mockup_tee.jpg"])
    return {"store": sdir, "havenly": idx, "shopify_csv": csv_path}


def run_product(idea):
    slug = slugify(idea)
    pdir = os.path.join(PRODUCTS, slug)
    os.makedirs(pdir, exist_ok=True)
    set_stage(pdir, slug, "designer", extra={"idea": idea})
    try:
        prompt = bot_designer(idea)
        open(os.path.join(pdir, "design_prompt.txt"), "w", encoding="utf-8").write(prompt)
        set_stage(pdir, slug, "artist")
        raw = bot_artist(prompt, os.path.join(pdir, "design_raw.png"))
        set_stage(pdir, slug, "cutout")
        cut = bot_cutout(raw, os.path.join(pdir, "design_cutout.png"))
        set_stage(pdir, slug, "mockup")
        mockups = bot_mockup(cut, pdir)
        set_stage(pdir, slug, "copywriter")
        listing = bot_copywriter(idea, slug)
        set_stage(pdir, slug, "publisher")
        pubs = bot_publish(pdir, slug, listing, mockups)
        set_stage(pdir, slug, "done", status="done",
                  extra={"title": listing.get("title"), "published": pubs})
        print(json.dumps({"ok": True, "slug": slug, "title": listing.get("title")}))
        return slug
    except Exception as e:
        set_stage(pdir, slug, "error", status="error", extra={"error": str(e)})
        print(json.dumps({"ok": False, "slug": slug, "error": str(e)}))
        return None


def board():
    out = []
    if os.path.isdir(PRODUCTS):
        for slug in sorted(os.listdir(PRODUCTS), reverse=True):
            sf = os.path.join(PRODUCTS, slug, "status.json")
            if os.path.exists(sf):
                try: out.append(json.load(open(sf, encoding="utf-8")))
                except OSError: pass
    print(json.dumps(out, indent=1))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "board"
    if cmd == "run":
        run_product(" ".join(sys.argv[2:]) or "halo and horns emblem")
    elif cmd == "board":
        board()
    else:
        print("usage: botline.py [run <idea> | board]")
