import { NextResponse } from "next/server";
import { cashfreeClient } from "../../../../backend/payments/cashfree";

export const runtime = "nodejs";

/**
 * GET /api/cashfree
 * Returns the current Cashfree payment gateway status, environment, and simulation mode.
 */
export async function GET() {
  const summary = cashfreeClient.getConfigSummary();

  return NextResponse.json({
    status: "ok",
    service: "ThinkOva Cashfree Payment Gateway Adapter",
    timestamp: new Date().toISOString(),
    config: summary,
  });
}

