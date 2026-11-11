import { NextRequest, NextResponse } from "next/server";
import { dbManager } from "@/../backend/database/client";
import { createSessionToken, setSessionCookie } from "@/lib/auth-session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = String(body.identifier || body.email || body.phone || "").trim();

    if (!identifier) {
      return NextResponse.json({ error: "Please enter your email or mobile number." }, { status: 400 });
    }

    let user = null;
    if (identifier.includes("@")) {
      user = await dbManager.commerce.getUserByEmail(identifier.toLowerCase());
    } else {
      user = await dbManager.commerce.getUserByPhone(identifier);
    }

    // If user does not exist yet, auto-provision demo or new parent for frictionless sign-in
    if (!user) {
      const email = identifier.includes("@") ? identifier.toLowerCase() : `${identifier.replace(/\D/g, "") || "9820011223"}@parent.thinkova.ai`;
      const phone = identifier.includes("@") ? "9820011223" : identifier;
      const emailPrefix = identifier.split("@")[0] || "parent";
      const fullName = identifier.includes("@")
        ? emailPrefix.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : `Parent ${identifier.slice(-4)}`;

      const firstName = fullName.split(" ")[0] || "parent";
      const newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        fullName,
        username: firstName.toLowerCase(),
        email,
        phone,
        role: "PARENT" as const,
        isPhoneVerified: true,
        isEmailVerified: true,
        consentTimestamp: new Date(),
        createdAt: new Date(),
      };

      await dbManager.commerce.upsertUser(newUser);
      user = newUser;
    }

    // Check for saved students
    const students = await dbManager.commerce.getStudentsByParentId(user.id);
    const redirectTo = students.length > 0 ? "/who-is-learning" : "/tell-us-child";

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      fullName: (user as { fullName?: string }).fullName || user.username,
      phone: user.phone,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user,
      students,
      redirectTo,
    });

    setSessionCookie(response, token);
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
