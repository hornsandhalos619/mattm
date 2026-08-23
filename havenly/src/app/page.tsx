import { readProducts, productImage } from "@/lib/products";

export default function StoreHome() {
  const products = readProducts();

  return (
    <div>
      <p className="text-center text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-10">
        The Collection — {products.length} design{products.length === 1 ? "" : "s"} fresh from the line
      </p>

      {products.length === 0 ? (
        <p className="text-center text-neutral-500 py-24">
          Nothing on the racks yet. Run the Product Line to forge the first piece.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <a
              key={p.slug}
              href={`/product/${p.slug}`}
              className="group block border border-[#1d1d20] hover:border-[#d4af3766] rounded-xl overflow-hidden bg-[#0c0c0e] transition-colors"
            >
              <div className="aspect-square overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={productImage(p.slug, p.images?.[0] ?? "mockup_tee.jpg")}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h2 className="text-sm font-medium text-neutral-100 leading-snug">
                  {p.title}
                </h2>
                <p className="mt-1 text-[#d4af37] font-semibold">
                  ${p.price_usd.toFixed(2)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(p.tags ?? []).slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] uppercase tracking-wider text-neutral-500 border border-[#26262a] rounded px-1.5 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
