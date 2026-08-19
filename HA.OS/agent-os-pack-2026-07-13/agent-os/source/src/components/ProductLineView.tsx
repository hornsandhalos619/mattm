"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Loader2, Sparkles, Package, RefreshCw, ExternalLink } from "lucide-react";

const ACCENT = "#d4af37";

interface Product {
  slug: string;
  stage: string;
  status: string;
  ts: number;
  idea?: string;
  title?: string;
  error?: string;
}

const STAGES = ["designer", "artist", "cutout", "mockup", "copywriter", "publisher", "done"];
const MOCKS = ["tee", "hoodie", "mug", "poster"];

function imgUrl(rel: string) {
  return `/api/productline/file?path=${encodeURIComponent(rel)}`;
}

export default function ProductLineView() {
  const [idea, setIdea] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const r = await fetch("/api/productline/board", { cache: "no-store" });
      const d = await r.json();
      if (d.ok) setProducts(d.products ?? []);
    } catch {
      /* server restarting */
    }
  };

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 2500);
    return () => clearInterval(t);
  }, []);

  const anyRunning = products.some((p) => p.status === "running");

  const start = async () => {
    if (!idea.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/productline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim() }),
      });
      const d = await r.json();
      if (!d.ok) setError(d.error ?? "Failed to start");
      else setIdea("");
    } catch (e) {
      setError(String(e));
    }
    setBusy(false);
    setTimeout(refresh, 800);
  };

  return (
    <div style={{ padding: 28, maxWidth: 1200, margin: "0 auto", color: "#e5e5e5" }}>
      <h1 style={{ fontSize: 22, letterSpacing: ".12em", textTransform: "uppercase", color: ACCENT }}>
        Product Line
      </h1>
      <p style={{ opacity: 0.6, fontSize: 13, marginTop: 4 }}>
        Idea → AI design → cutout → mockups (tee / hoodie / mug / poster) → listing copy → published to your store, your site and a Shopify import CSV.
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && start()}
          placeholder="Describe a design idea… e.g. 'halo over crossed horns, neon outline'"
          style={{
            flex: 1, background: "#111214", border: "1px solid #333", borderRadius: 8,
            padding: "10px 14px", color: "#eee", fontSize: 14, outline: "none",
          }}
        />
        <button
          onClick={start}
          disabled={busy || !idea.trim()}
          style={{
            background: busy ? "#555" : ACCENT, color: "#111", border: "none", borderRadius: 8,
            padding: "10px 18px", fontWeight: 700, cursor: busy ? "wait" : "pointer",
            display: "flex", alignItems: "center", gap: 8, fontSize: 14,
          }}
        >
          {busy || anyRunning ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Run the line
        </button>
        <button onClick={refresh} title="Refresh"
          style={{ background: "#1c1d20", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#aaa", cursor: "pointer" }}>
          <RefreshCw size={16} />
        </button>
      </div>
      {error && <p style={{ color: "#f87171", fontSize: 13, marginTop: 8 }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16, marginTop: 24 }}>
        {products.map((p) => {
          const idx = STAGES.indexOf(p.stage);
          const done = p.status === "done";
          const failed = p.status === "error";
          return (
            <div key={p.slug} onClick={() => setOpen(open === p.slug ? null : p.slug)}
              style={{
                background: "#141518", border: `1px solid ${failed ? "#7f1d1d" : done ? "#3f3a26" : "#2a2b2f"}`,
                borderRadius: 12, padding: 16, cursor: "pointer",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: 14 }}>{p.title ?? p.idea ?? p.slug}</strong>
                <Package size={16} style={{ color: ACCENT }} />
              </div>
              <div style={{ fontSize: 12, opacity: 0.55, marginTop: 4 }}>{p.idea}</div>

              {/* stage progress */}
              <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
                {STAGES.map((s, i) => (
                  <div key={s} title={s}
                    style={{
                      flex: 1, height: 5, borderRadius: 3,
                      background: failed && i === idx ? "#dc2626"
                        : done || i < idx ? ACCENT
                        : i === idx ? "#8a7a3a" : "#2a2b2f",
                    }} />
                ))}
              </div>
              <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>
                {failed ? `✗ ${p.error ?? "error"}` : done ? "✓ published" : `● ${p.stage}…`}
              </div>

              {open === p.slug && done && (
                <div style={{ marginTop: 12 }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {MOCKS.map((m) => (
                      <a key={m} href={imgUrl(`products/${p.slug}/mockup_${m}.jpg`)} target="_blank" rel="noreferrer">
                        <img src={imgUrl(`products/${p.slug}/mockup_${m}.jpg`)} alt={m}
                          style={{ width: "100%", borderRadius: 8, border: "1px solid #2a2b2f" }} />
                        <div style={{ fontSize: 11, textAlign: "center", opacity: 0.6, marginTop: 2 }}>
                          {m} <ExternalLink size={10} style={{ display: "inline" }} />
                        </div>
                      </a>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    <a href={imgUrl(`products/${p.slug}/listing.json`)} target="_blank" rel="noreferrer" style={chip}>listing.json</a>
                    <a href={imgUrl(`products/${p.slug}/listing.md`)} target="_blank" rel="noreferrer" style={chip}>listing.md</a>
                    <a href={imgUrl(`products/${p.slug}/shopify_import.csv`)} target="_blank" rel="noreferrer" style={chip}>shopify CSV</a>
                    <a href={imgUrl(`products/${p.slug}/design_cutout.png`)} target="_blank" rel="noreferrer" style={chip}>design PNG</a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {products.length === 0 && (
        <p style={{ opacity: 0.5, marginTop: 30, textAlign: "center" }}>
          No products yet — type an idea above and run the line.
        </p>
      )}
    </div>
  );
}

const chip: CSSProperties = {
  fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid #333",
  color: "#ccc", textDecoration: "none", background: "#1c1d20",
};
