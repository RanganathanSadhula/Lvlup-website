import { NextResponse } from "next/server";
import { normalisePhone, schoolPackSchema } from "@/lib/validations";
import { dbManager } from "../../../../backend/database/client";
import { defaultDispatcher } from "../../../../backend/notifications/dispatcher";
import { emailTemplates, formatPrincipalSalutation } from "../../../../backend/templates/email-templates";

export const runtime = "nodejs";

/**
 * POST /api/school-pack
 * Handles school registry / partnership callback requests from principals and coordinators.
 * Dynamically registers the school and prepares the personalized Principal Capstone Invitation email.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const parsed = schoolPackSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // Honeypot check: pretend success to protect against automated bots
  if (parsed.data.company) return NextResponse.json({ ok: true });

  const { name, role = "Principal", phone, email, schoolName: rawSchoolName, city: rawCity, schoolCity: rawSchoolCity } = parsed.data;
  const cleanPhone = normalisePhone(phone);

  // Parse school name and city dynamically
  let schoolName = (rawSchoolName || "").trim();
  let city = (rawCity || "").trim();

  if ((!schoolName || !city) && rawSchoolCity) {
    const parts = rawSchoolCity.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      schoolName = schoolName || parts[0] || "";
      city = city || parts.slice(1).join(", ");
    } else if (parts.length === 1) {
      schoolName = schoolName || parts[0] || "";
    }
  }

  // Reject static pre-fills: require actual dynamic school and city
  if (!schoolName || !city) {
    return NextResponse.json(
      {
        error: "Please provide both school name and city.",
        issues: {
          ...(!schoolName ? { schoolName: ["Please enter your school name"] } : {}),
          ...(!city ? { city: ["Please enter your city"] } : {}),
        },
      },
      { status: 422 }
    );
  }

  const leadId = `sch_lead_${Date.now()}`;
  const salutation = formatPrincipalSalutation(name, role);

  // 1. Persist the registered school into the dynamic database layer
  try {
    const slug = `school-${schoolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString().slice(-4)}`;
    const schoolUid = `SCH-${city.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`;

    await dbManager.schools.upsertSchool({
      id: leadId,
      schoolUid,
      officialName: schoolName,
      slug,
      city,
      state: "Maharashtra",
      board: "CBSE",
      labCapacity: 25,
      coordinatorName: name,
      coordinatorPhone: cleanPhone,
      coordinatorEmail: email || undefined,
      partnerCommissionPct: 0,
      status: "PENDING",
      createdAt: new Date(),
    });
  } catch (dbErr: unknown) {
    console.warn("[SchoolRegistry] Warning saving school to DB:", dbErr);
  }

  // 2. Generate the dynamic Principal Outreach Email template
  const principalEmail = emailTemplates.principalOutreach({
    principalName: name,
    schoolName,
    city,
    role,
    replyUrl: `mailto:info@thinkova.ai?subject=${encodeURIComponent(`Pilot Cohort Partnership - ${schoolName}`)}`,
  });

  // 3. Dispatch automated email notification
  let emailDispatched = false;
  let emailError: string | undefined;

  try {
    if (email) {
      // Send the personalized dynamic Principal Outreach email to the registrant
      const primaryRes = await defaultDispatcher.sendEmail({
        to: email,
        subject: principalEmail.subject,
        html: principalEmail.html,
        text: principalEmail.text,
        metadata: { leadId, schoolName, role, phone: cleanPhone, recipientType: "school_lead" },
      });

      if (primaryRes.status === "FAILED") {
        emailDispatched = false;
        emailError = (primaryRes.metadata?.error as string) || "Email dispatch failed";
      } else {
        emailDispatched = true;
      }

      // Also notify ThinkOva partnerships team
      const adminRecipient = process.env.MAIL_SENDER || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@thinkova.ai";
      if (adminRecipient.toLowerCase() !== email.toLowerCase()) {
        await defaultDispatcher.sendEmail({
          to: adminRecipient,
          subject: `[New School Lead] ${salutation} at ${schoolName} requested details`,
          html: `<h3>New School Partnership Callback Request</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Role:</strong> ${role}</p>
<p><strong>School:</strong> ${schoolName}</p>
<p><strong>City:</strong> ${city}</p>
<p><strong>Phone:</strong> ${cleanPhone}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Lead ID:</strong> ${leadId}</p>`,
          text: `New School Lead: ${name} (${role}), ${schoolName}, ${city}. Phone: ${cleanPhone}, Email: ${email}`,
          metadata: { leadId, schoolName, role, phone: cleanPhone, recipientType: "admin_alert" },
        }).catch((err) => console.warn("[SchoolRegistry] Admin alert send non-fatal:", err));
      }
      emailDispatched = true;
    } else {
      // Deliver lead alert to ThinkOva partnerships team
      const adminRecipient = process.env.MAIL_SENDER || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@thinkova.ai";
      await defaultDispatcher.sendEmail({
        to: adminRecipient,
        subject: `[New School Registry] ${salutation} at ${schoolName} requested a callback`,
        html: `<h3>New School Callback Request (No Email Provided)</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Role:</strong> ${role}</p>
<p><strong>School:</strong> ${schoolName}</p>
<p><strong>City:</strong> ${city}</p>
<p><strong>Phone:</strong> ${cleanPhone}</p>
<p><strong>Lead ID:</strong> ${leadId}</p>`,
        text: `New School Callback: ${name} (${role}), ${schoolName}, ${city}. Phone: ${cleanPhone}`,
        metadata: { leadId, schoolName, role, phone: cleanPhone, recipientType: "admin_alert" },
      });
      emailDispatched = true;
    }
  } catch (emailErr: unknown) {
    emailError = emailErr instanceof Error ? emailErr.message : String(emailErr);
    console.error("[SchoolRegistry] Error dispatching notification email:", emailError);
  }

  // 4. Forward to optional external webhook (CRM / Google Sheets / Slack) if configured
  const webhook = process.env.SCHOOL_PACK_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.SCHOOL_PACK_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.SCHOOL_PACK_WEBHOOK_SECRET}` } : {}),
        },
        body: JSON.stringify({
          type: "school_registry_request",
          leadId,
          name,
          role,
          schoolName,
          city,
          phone: cleanPhone,
          email: email || null,
          salutation,
          submittedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(8_000),
      });
    } catch (webhookErr) {
      console.warn("[SchoolRegistry] Webhook delivery failed (non-blocking):", webhookErr);
    }
  }

  return NextResponse.json({
    ok: true,
    leadId,
    salutation,
    schoolName,
    role,
    emailDispatched,
    ...(emailError ? { emailNotice: emailError } : {}),
  });
}
