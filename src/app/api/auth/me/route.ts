import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth-session";
import { dbManager } from "@/../backend/database/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await dbManager.commerce.getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const students = await dbManager.commerce.getStudentsByParentId(user.id);

    return NextResponse.json({
      authenticated: true,
      user,
      students,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

