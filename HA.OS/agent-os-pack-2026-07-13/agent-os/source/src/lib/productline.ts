// Product Line — bot chain that turns an idea into designed, mocked-up,
// listed products. The heavy lifting lives in <root>/botline.py (Python +
// OpenRouter + PIL); the dashboard is a thin client over its state files.

import path from "node:path";
import os from "node:os";
import { existsSync, readFileSync, readdirSync, openSync } from "node:fs";
import { spawn } from "node:child_process";
import { hermesHome } from "./config";

export function productlineRoot(): string {
  const env = process.env.PRODUCTLINE_ROOT;
  if (env) return env;
  // default: ~/HA.OS/productline (outside the pack so updates never wipe it)
  return path.join(os.homedir(), "HA.OS", "productline");
}

export function productsDir(): string {
  return path.join(productlineRoot(), "products");
}

export function pythonBin(): string {
  const win = path.join(hermesHome(), "hermes-agent", "venv", "Scripts", "python.exe");
  if (existsSync(win)) return win;
  const nix = path.join(hermesHome(), "hermes-agent", "venv", "bin", "python");
  if (existsSync(nix)) return nix;
  return "python3";
}

export interface ProductStatus {
  slug: string;
  stage: string;
  status: string;
  ts: number;
  idea?: string;
  title?: string;
  error?: string;
  published?: Record<string, string>;
}

export function readBoard(): ProductStatus[] {
  const dir = productsDir();
  if (!existsSync(dir)) return [];
  const out: ProductStatus[] = [];
  for (const slug of readdirSync(dir)) {
    const sf = path.join(dir, slug, "status.json");
    if (!existsSync(sf)) continue;
    try {
      out.push(JSON.parse(readFileSync(sf, "utf-8")) as ProductStatus);
    } catch {
      /* skip corrupt */
    }
  }
  out.sort((a, b) => b.ts - a.ts);
  return out;
}

export function readListing(slug: string): Record<string, unknown> | null {
  const f = path.join(productsDir(), slug, "listing.json");
  if (!existsSync(f)) return null;
  try {
    return JSON.parse(readFileSync(f, "utf-8"));
  } catch {
    return null;
  }
}

// Fire-and-forget: spawn the bot chain; it writes status.json as it progresses
// so the UI can poll /api/productline/board.
export function spawnRun(idea: string): { ok: boolean; error?: string } {
  const script = path.join(productlineRoot(), "botline.py");
  if (!existsSync(script)) return { ok: false, error: "botline.py not found at " + script };
  const logf = path.join(productlineRoot(), "last_run.log");
  const out = openSync(logf, "w");
  const child = spawn(pythonBin(), [script, "run", idea], {
    detached: true,
    stdio: ["ignore", out, out],
    windowsHide: true,
    env: { ...process.env },
  });
  child.unref();
  return { ok: true };
}

// Only serve files that live inside the productline root (no path escape).
export function safeProductFile(rel: string): string | null {
  const root = productlineRoot();
  const abs = path.normalize(path.join(root, rel));
  if (!abs.startsWith(root + path.sep)) return null;
  if (!existsSync(abs)) return null;
  return abs;
}
