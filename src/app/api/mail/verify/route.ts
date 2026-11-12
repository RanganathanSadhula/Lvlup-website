import { NextResponse } from "next/server";
import { graphMailer } from "../../../../../backend/notifications/graph-mailer";

export const runtime = "nodejs";

/**
 * GET /api/mail/verify & POST /api/mail/verify
 * Tests and verifies Azure AD OAuth2 authentication and Microsoft Graph mailbox connectivity.
 */
export async function GET(request: Request) {
  return handleVerification(request);
}

export async function POST(request: Request) {
  return handleVerification(request);
}

async function handleVerification(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await graphMailer.verifyConnection();

    if (!result.success) {
      return NextResponse.json(
        {
          status: "error",
          message: result.message,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: "ok",
      provider: "Microsoft Graph API",
      message: result.message,
      details: result.details,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to verify Microsoft Graph connectivity",
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}

