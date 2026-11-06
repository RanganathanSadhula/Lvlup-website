import { NextResponse } from "next/server";
import { smtpMailer } from "../../../../../backend/notifications/smtp";

export const runtime = "nodejs";

/**
 * GET /api/smtp/verify & POST /api/smtp/verify
 * Tests and verifies the active SMTP server connection credentials and TLS handshake.
 */
export async function GET(request: Request) {
  return handleVerify(request);
}

export async function POST(request: Request) {
  return handleVerify(request);
}

async function handleVerify(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  // If CRON_SECRET is defined, require authorization token
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await smtpMailer.verifyConnection();

  if (!result.success) {
    return NextResponse.json(
      {
        status: "error",
        verified: false,
        message: result.message,
        error: result.error,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    status: "ok",
    verified: true,
    message: result.message,
    timestamp: new Date().toISOString(),
  });
}

