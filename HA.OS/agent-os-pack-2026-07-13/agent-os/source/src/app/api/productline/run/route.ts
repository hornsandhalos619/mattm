import { NextResponse } from "next/server";
import { spawnRun } from "@/lib/productline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const data = (await req.json().catch(() => null)) as { idea?: string } | null;
  const idea = (data?.idea ?? "").trim();
  if (!idea) return NextResponse.json({ ok: false, error: "Missing idea" }, { status: 400 });
  const r = spawnRun(idea);
  if (!r.ok) return NextResponse.json(r, { status: 500 });
  return NextResponse.json({ ok: true, started: true });
}
