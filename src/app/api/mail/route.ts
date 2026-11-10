import { NextResponse } from "next/server";
import { graphMailer } from "../../../../backend/notifications/graph-mailer";

export const runtime = "nodejs";

/**
 * GET /api/mail
 * Returns current Microsoft Graph API email service configuration status and telemetry.
 */
export async function GET() {
  const summary = graphMailer.getConfigSummary();

  return NextResponse.json({
    status: "ok",
    service: "ThinkOva Microsoft Graph API Mailer",
    timestamp: new Date().toISOString(),
    config: summary,
    instructions: summary.configured
      ? "Microsoft Graph API is configured and ready. Call POST /api/mail/verify to test Azure AD OAuth2 token or POST /api/mail/send to dispatch."
      : "Microsoft Graph is not configured. Add AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, and MAIL_SENDER to .env.local",
  });
}

