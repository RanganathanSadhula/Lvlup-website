import { NextResponse } from "next/server";
import { smtpMailer } from "../../../../backend/notifications/smtp";

export const runtime = "nodejs";

/**
 * GET /api/smtp
 * Returns current SMTP service configuration summary and status.
 */
export async function GET() {
  const summary = smtpMailer.getConfigSummary();

  return NextResponse.json({
    status: "ok",
    service: "ThinkOva SMTP Automation Mailer",
    timestamp: new Date().toISOString(),
    config: summary,
    instructions: summary.configured
      ? "SMTP is configured and ready. Call POST /api/smtp/verify to test handshake or POST /api/smtp/send to dispatch."
      : "SMTP is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD to .env.local",
  });
}

