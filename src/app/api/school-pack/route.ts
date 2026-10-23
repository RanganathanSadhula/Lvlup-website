import { NextResponse } from "next/server";
import { normalisePhone, schoolPackSchema } from "@/lib/validations";

export const runtime = "nodejs";

/**
 * Receives school-pack requests. Delivery is delegated to a webhook you configure
 * (SCHOOL_PACK_WEBHOOK_URL), so no credentials ever reach the browser.
 * With no webhook configured this responds 503 and the form says so honestly.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schoolPackSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the highlighted fields.", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  // Honeypot filled in: pretend success so bots learn nothing.
  if (parsed.data.company) return NextResponse.json({ ok: true });

  const webhook = process.env.SCHOOL_PACK_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { name, schoolCity, role, phone } = parsed.data;
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SCHOOL_PACK_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.SCHOOL_PACK_WEBHOOK_SECRET}` } : {}),
      },
      body: JSON.stringify({ type: "school_pack_request", name, schoolCity, role, phone: normalisePhone(phone), submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We couldn’t deliver your request. Please try again shortly." }, { status: 502 });
  }
}
