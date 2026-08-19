// HnH storefront product page for havenly.
// Reads ~/havenly/data/products.json which the Product Line bot appends to.
// This is a drop-in file; havenly's app routes decide where it mounts.
import fs from "node:fs";
import path from "node:path";

export interface StoreProduct {
  slug: string;
  title: string;
  description: string;
  price_usd: number;
  tags: string[];
  images: string[];
  published_at?: string;
}

export function readProducts(): StoreProduct[] {
  const f = path.join(process.cwd(), "data", "products.json");
  if (!fs.existsSync(f)) return [];
  try {
    return JSON.parse(fs.readFileSync(f, "utf-8")) as StoreProduct[];
  } catch {
    return [];
  }
}
