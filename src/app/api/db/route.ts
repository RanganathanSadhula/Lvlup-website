import { NextResponse } from "next/server";
import { dbManager } from "../../../../backend/database/client";

export const runtime = "nodejs";

/**
 * GET /api/db
 * Returns health, driver connection, and stabilized entity counts of the database layer.
 */
export async function GET() {
  const status = dbManager.getDatabaseStatus();

  return NextResponse.json({
    status: "ok",
    service: "ThinkOva Database Management Layer",
    timestamp: new Date().toISOString(),
    database: status,
  });
}

