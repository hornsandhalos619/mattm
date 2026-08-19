import { NextResponse } from "next/server";
import { readBoard } from "@/lib/productline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, products: readBoard() });
}
