import { createReadStream } from "node:fs";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { Readable } from "node:stream";
import { safeProductFile } from "@/lib/productline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Serves product artifacts (mockups, designs, listings) from ~/HA.OS/productline.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const rel = url.searchParams.get("path");
  if (!rel) return new Response("missing path", { status: 400 });
  const abs = safeProductFile(rel);
  if (!abs) return new Response("not found", { status: 404 });

  const mime = abs.endsWith(".png") ? "image/png"
    : abs.endsWith(".jpg") ? "image/jpeg"
    : abs.endsWith(".json") ? "application/json"
    : abs.endsWith(".md") ? "text/markdown; charset=utf-8"
    : abs.endsWith(".csv") ? "text/csv; charset=utf-8"
    : "application/octet-stream";

  const stream = createReadStream(abs);
  const web = Readable.toWeb(stream) as unknown as NodeReadableStream<Uint8Array>;
  return new Response(web as unknown as ReadableStream, {
    headers: { "Content-Type": mime, "Cache-Control": "no-store" },
  });
}
