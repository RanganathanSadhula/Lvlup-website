import { NextRequest, NextResponse } from "next/server";
import { dbManager } from "@/../backend/database/client";
import { notificationDispatcher } from "@/../backend/notifications/dispatcher";
import { createSessionToken, setSessionCookie } from "@/lib/auth-session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").toLowerCase().trim();
    const phone = String(body.phone || "").trim();
    const whatsappUpdates = Boolean(body.whatsappUpdates ?? true);

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
    }

    // Check if user already exists
    const existing = await dbManager.commerce.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in instead." },
        { status: 409 }
      );
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const username = (fullName.split(" ")[0] || "parent").toLowerCase() + Math.floor(Math.random() * 899 + 100);
    const user = {
      id: userId,
      fullName,
      username,
      email,
      phone,
      role: "PARENT" as const,
      isPhoneVerified: true,
      isEmailVerified: true,
      consentTimestamp: new Date(),
      createdAt: new Date(),
    };

    // Save to dynamic database layer
    await dbManager.commerce.upsertUser(user);

    // Automation: Dispatch welcome email & optional WhatsApp confirmation
    try {
      await notificationDispatcher.sendEmail({
        to: email,
        subject: `Welcome to ThinkOva, ${fullName}! Set up your child's profile`,
        text: `Hello ${fullName},\n\nThank you for creating your parent account at ThinkOva. The next step is to tell us about your child so we can tailor their learning track.\n\nVisit: https://thinkova.ai/tell-us-child\n\nWarm regards,\nThe ThinkOva Team`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0B0C0F; background: #F4F3EE; border-radius: 16px;">
            <div style="background: #0B0C0F; padding: 20px 24px; border-radius: 12px; margin-bottom: 24px; text-align: left;">
              <span style="font-size: 22px; font-weight: bold; color: #FFFFFF; letter-spacing: -0.5px;">Think<span style="color: #FF6B2C;">Ova</span></span>
            </div>
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #0B0C0F;">Welcome to ThinkOva, ${fullName}!</h1>
            <p style="font-size: 15px; line-height: 24px; color: #5A5F6B; margin-bottom: 20px;">
              Your parent account has been created successfully. Now, let's set up your child's learning profile to customize course tracks and tutor support.
            </p>
            <div style="margin: 28px 0;">
              <a href="https://thinkova.ai/tell-us-child" style="background: #FF6B2C; color: #ffffff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
                Tell us about your child &rarr;
              </a>
            </div>
            <p style="font-size: 12px; color: #8F94A0; margin-top: 32px; border-top: 1px solid #E3E1D9; pt: 16px;">
              ThinkOva Education · Practical STEM, AI & Robotics for Grades 5–11.
            </p>
          </div>
        `,
        metadata: { userId, event: "PARENT_SIGNUP" },
      });

      if (whatsappUpdates) {
        await notificationDispatcher.sendWhatsApp({
          to: phone,
          templateName: "welcome_parent_orientation",
          fallbackText: `Hi ${fullName}, welcome to ThinkOva! We'll send your child's weekly milestone reports and batch timings here. Add your child's details at thinkova.ai/tell-us-child to begin.`,
          metadata: { userId, event: "PARENT_SIGNUP" },
        });
      }
    } catch (dispatchErr) {
      console.warn("[Auth Signup] Notification dispatch non-fatal warning:", dispatchErr);
    }

    // Issue session token
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user,
      redirectTo: "/tell-us-child",
    });

    setSessionCookie(response, token);
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
