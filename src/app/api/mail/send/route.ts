import { NextResponse } from "next/server";
import { graphMailer } from "../../../../../backend/notifications/graph-mailer";
import { defaultDispatcher } from "../../../../../backend/notifications/dispatcher";
import {
  emailTemplates,
  type AbandonedCartData,
  type EnrolmentSuccessData,
  type InstallmentReminderData,
  type PaymentFailureData,
  type RefundNotificationData,
  type WeeklyEvaluationEmailData,
  type PrincipalEmailData,
  formatPrincipalSalutation,
} from "../../../../../backend/templates/email-templates";

export const runtime = "nodejs";

export type TemplateType =
  | "principalOutreach"
  | "weeklyEvaluationReport"
  | "enrolmentSuccess"
  | "abandonedCart"
  | "installmentReminder"
  | "paymentFailure"
  | "refundNotification";

interface SendMailRequestBody {
  to?: string;
  subject?: string;
  html?: string;
  text?: string;
  template?: TemplateType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  previewOnly?: boolean;
}

/**
 * GET /api/mail/send
 * Allows testing and inspecting rendered templates in JSON or live HTML preview.
 * E.g.: /api/mail/send?template=principalOutreach&name=Priya+Sharma&school=Delhi+Public+School&format=html
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const template = (searchParams.get("template") || "principalOutreach") as TemplateType;
  const format = searchParams.get("format"); // 'html' or 'json'

  let principalName: string | undefined = (searchParams.get("name") || searchParams.get("principalName")) ?? undefined;
  let schoolName: string | undefined = (searchParams.get("school") || searchParams.get("schoolName")) ?? undefined;
  const role = searchParams.get("role") || "Principal";
  let city: string | undefined = searchParams.get("city") ?? undefined;

  // Dynamically resolve from the latest registered school in database if not explicitly provided
  if (!principalName || !schoolName) {
    try {
      const { dbManager } = await import("../../../../../backend/database/client");
      const activeSchools = await dbManager.schools.listActive(1);
      if (activeSchools && activeSchools.length > 0 && activeSchools[0]) {
        principalName = principalName || activeSchools[0].coordinatorName;
        schoolName = schoolName || activeSchools[0].officialName;
        city = city || activeSchools[0].city;
      }
    } catch {
      // DB lookup fallback
    }
  }

  const finalPrincipalName = principalName || "Principal";
  const finalSchoolName = schoolName || "Partner School";
  const finalCity = city || "";

  let rendered: { subject: string; html: string; text: string };

  switch (template) {
    case "principalOutreach": {
      rendered = emailTemplates.principalOutreach({
        principalName: finalPrincipalName,
        schoolName: finalSchoolName,
        role,
        city: finalCity,
      });
      break;
    }
    case "enrolmentSuccess": {
      rendered = emailTemplates.enrolmentSuccess({
        parentName: "Suresh Verma",
        studentName: "Rohan Verma",
        currentGrade: 7,
        schoolName: finalSchoolName,
        batchSchedule: "Weekly Computer Lab Sessions",
        tutorName: "Lead AI Mentor",
        amountPaid: "₹4,499",
        orderId: `THK-${Date.now().toString().slice(-6)}`,
      });
      break;
    }
    case "abandonedCart": {
      rendered = emailTemplates.abandonedCart({
        parentName: "Meera Patel",
        studentName: "Kabir Patel",
        schoolName: finalSchoolName,
        seatsRemaining: 4,
        checkoutUrl: "https://www.thinkova.ai/#enrol",
        holdExpiresAt: "2 hours",
      });
      break;
    }
    case "weeklyEvaluationReport": {
      rendered = emailTemplates.weeklyEvaluationReport({
        parentName: "Sunita Reddy",
        studentName: "Aarav Reddy",
        schoolName: finalSchoolName,
        levelNumber: 4,
        levelTitle: "Computer Vision & Interactive Web Apps",
        projectCreated: "TrashClassifier: Waste Segregation AI",
        tutorName: "Vikram Nair",
        tutorFeedback: "Aarav showed excellent problem solving in training his vision model on edge cases.",
        reportUrl: "https://www.thinkova.ai/parent/progress/demo",
      });
      break;
    }
    default: {
      rendered = emailTemplates.principalOutreach({
        principalName: finalPrincipalName,
        schoolName: finalSchoolName,
        role,
        city: finalCity,
      });
    }
  }

  if (format === "html") {
    return new Response(rendered.html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.json({
    status: "ok",
    template,
    provider: "Microsoft Graph API",
    salutation: formatPrincipalSalutation(finalPrincipalName, role),
    subject: rendered.subject,
    htmlPreviewUrl: `/api/mail/send?template=${template}&name=${encodeURIComponent(finalPrincipalName)}&school=${encodeURIComponent(finalSchoolName)}&format=html`,
    htmlLength: rendered.html.length,
    text: rendered.text,
    generatedAt: new Date().toISOString(),
  });
}

/**
 * POST /api/mail/send
 * Dispatches an automated email via Microsoft Graph API or tests generation using template rendering.
 */
export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SendMailRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { to, template, data, previewOnly } = body;

  let subject = body.subject;
  let html = body.html;
  let text = body.text;

  // Render template if requested
  if (template) {
    const templateData = data || {};

    switch (template) {
      case "principalOutreach": {
        const rendered = emailTemplates.principalOutreach(templateData as PrincipalEmailData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "weeklyEvaluationReport": {
        const rendered = emailTemplates.weeklyEvaluationReport(templateData as WeeklyEvaluationEmailData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "enrolmentSuccess": {
        const rendered = emailTemplates.enrolmentSuccess(templateData as EnrolmentSuccessData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "abandonedCart": {
        const rendered = emailTemplates.abandonedCart(templateData as AbandonedCartData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "installmentReminder": {
        const rendered = emailTemplates.installmentReminder(templateData as InstallmentReminderData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "paymentFailure": {
        const rendered = emailTemplates.paymentFailure(templateData as PaymentFailureData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "refundNotification": {
        const rendered = emailTemplates.refundNotification(templateData as RefundNotificationData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      default:
        return NextResponse.json({ error: `Unsupported template name: '${template}'` }, { status: 422 });
    }
  }

  if (!subject || !html) {
    return NextResponse.json(
      { error: "Must provide either ('template' and 'data') or ('subject' and 'html')" },
      { status: 422 }
    );
  }

  // If testing / preview only, return the rendered email without sending
  if (previewOnly) {
    return NextResponse.json({
      status: "rendered_success",
      provider: "Microsoft Graph API",
      template: template || "custom",
      subject,
      htmlLength: html.length,
      textLength: text?.length || 0,
      text,
      html,
    });
  }

  const targetTo = to || process.env.MAIL_SENDER || "info@thinkova.ai";

  try {
    if (graphMailer.isConfigured()) {
      const result = await graphMailer.sendEmail({
        to: targetTo,
        subject,
        html,
        text,
      });

      await defaultDispatcher.sendEmail({
        to: targetTo,
        subject,
        html,
        text: text || "",
        metadata: { directGraphSend: true, messageId: result.messageId, template },
      });

      return NextResponse.json({
        status: "success",
        transport: "MICROSOFT_GRAPH",
        messageId: result.messageId,
        sender: result.sender,
        to: targetTo,
        subject,
        sentAt: result.sentAt.toISOString(),
      });
    }

    // Dynamic fallback when Microsoft Graph credentials are not yet defined in .env
    const outboxRecord = await defaultDispatcher.sendEmail({
      to: targetTo,
      subject,
      html,
      text: text || "",
      metadata: { directGraphSend: true, template },
    });

    return NextResponse.json({
      status: "queued_simulated",
      transport: "OUTBOX_LEDGER",
      provider: "Microsoft Graph API",
      note: "Microsoft Graph credentials not defined in environment. Email saved to in-memory audit ledger. Set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET in .env.local to send live.",
      outboxRecordId: outboxRecord.id,
      to: targetTo,
      subject,
      sentAt: outboxRecord.sentAt,
      generated: true,
      htmlLength: html.length,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { status: "error", message: "Failed to dispatch email via Microsoft Graph", error: errorMsg },
      { status: 500 }
    );
  }
}

