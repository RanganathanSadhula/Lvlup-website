import { NextRequest, NextResponse } from "next/server";
import { dbManager } from "@/../backend/database/client";
import { notificationDispatcher } from "@/../backend/notifications/dispatcher";
import { createSessionToken, setSessionCookie } from "@/lib/auth-session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Supports raw Google credential token or parsed profile payload
    let email = String(body.email || "").toLowerCase().trim();
    let name = String(body.name || body.fullName || "").trim();
    const picture = body.picture || body.avatarUrl;

    // Fallback default for simulated Google OAuth flow in development/testing
    if (!email) {
      email = "google.parent@thinkova.ai";
      name = "Priya Sharma";
    }

    if (!name) {
      const emailPrefix = email.split("@")[0] || "parent";
      name = emailPrefix.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }

    let isNewUser = false;
    let existingUser = await dbManager.commerce.getUserByEmail(email);
    let user = existingUser;

    if (!user) {
      isNewUser = true;
      const userId = `usr_g_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const firstName = name.split(" ")[0] || "parent";
      const newUser = {
        id: userId,
        fullName: name,
        username: firstName.toLowerCase() + Math.floor(Math.random() * 899 + 100),
        email,
        phone: body.phone || "9819922334",
        role: "PARENT" as const,
        isPhoneVerified: true,
        isEmailVerified: true,
        consentTimestamp: new Date(),
        createdAt: new Date(),
      };

      await dbManager.commerce.upsertUser(newUser);
      user = newUser;

      // Trigger signup notification automation
      try {
        await notificationDispatcher.sendEmail({
          to: email,
          subject: `Welcome to ThinkOva, ${name}! Set up your child's profile`,
          text: `Hi ${name},\n\nYour ThinkOva parent account has been created via Google Sign-In.\nAdd your child's details at https://thinkova.ai/tell-us-child to customize their learning tracks.`,
          html: `
            <div style="font-family: sans-serif; padding: 24px; background: #F4F3EE; border-radius: 12px; max-width: 600px;">
              <h2 style="color: #0B0C0F;">Welcome to ThinkOva via Google, ${name}!</h2>
              <p style="color: #5A5F6B;">Your account is ready. Add your student profile to explore CBSE-aligned practical tracks in Robotics, AI, IoT, and Game Design.</p>
              <div style="margin: 20px 0;">
                <a href="https://thinkova.ai/tell-us-child" style="background: #FF6B2C; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold;">
                  Tell us about your child &rarr;
                </a>
              </div>
            </div>
          `,
          metadata: { userId: user.id, provider: "GOOGLE" },
        });
      } catch (err) {
        console.warn("[Google Auth] Automation non-fatal notice:", err);
      }
    }

    // Check saved students
    const students = await dbManager.commerce.getStudentsByParentId(user.id);
    const redirectTo = students.length > 0 ? "/who-is-learning" : "/tell-us-child";

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      fullName: (user as { fullName?: string }).fullName || name,
      phone: user.phone,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      isNewUser,
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
