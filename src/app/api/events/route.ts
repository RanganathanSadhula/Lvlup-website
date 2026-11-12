import { NextRequest, NextResponse } from "next/server";
import { FEATURED_HACKATHON, EVENTS_LIST, AVAILABLE_CLASSMATES } from "@/data/events-data";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") || "all";

    let filteredEvents = EVENTS_LIST;
    if (category !== "all") {
      filteredEvents = EVENTS_LIST.filter((e) => e.categoryKey === category);
    }

    return NextResponse.json({
      success: true,
      featured: FEATURED_HACKATHON,
      events: filteredEvents,
      classmates: AVAILABLE_CLASSMATES,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = String(body.action || "").trim();

    if (action === "register_team") {
      const teamName = String(body.teamName || "School Innovation Squad").trim();
      const members = body.members || [];
      return NextResponse.json({
        success: true,
        message: `Team "${teamName}" registered successfully for Build for your school! Tutor will verify your project scope.`,
        registeredAt: new Date().toISOString(),
        membersCount: members.length,
      });
    }

    if (action === "invite_classmate") {
      const studentName = String(body.studentName || "").trim();
      return NextResponse.json({
        success: true,
        message: `Invite dispatched to ${studentName}. They will receive a notification in their student portal.`,
      });
    }

    if (action === "calendar" || action === "remind" || action === "invite_family") {
      const eventId = String(body.eventId || "");
      return NextResponse.json({
        success: true,
        message: "Preference saved successfully.",
        eventId,
      });
    }

    return NextResponse.json({ success: true, message: "Action recorded" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

