import { NextRequest, NextResponse } from "next/server";
import { LIVE_SESSIONS, PAST_RECORDINGS } from "@/data/live-classes";

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("studentId") || "aarav";

  return NextResponse.json({
    success: true,
    studentId,
    nextLiveClass: LIVE_SESSIONS[0],
    upcomingSchedule: LIVE_SESSIONS,
    pastRecordings: PAST_RECORDINGS,
  });
}
