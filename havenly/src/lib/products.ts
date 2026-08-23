// HnH storefront product loader.
// Reads data/products.json which the HA.OS Product Line bot appends to.
import fs from "node:fs";
import path from "node:path";

export interface StoreProduct {
  slug: string;
  title: string;
  description: string;
  price_usd: number;
  tags: string[];
  images: string[];
  design?: string;
  seo_title?: string;
  seo_description?: string;
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

export function getProduct(slug: string): StoreProduct | null {
  return readProducts().find((p) => p.slug === slug) ?? null;
}

export function productImage(slug: string, file: string): string {
  return `/products/${slug}/${file}`;
}
