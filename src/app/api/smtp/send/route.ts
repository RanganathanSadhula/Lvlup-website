import { NextResponse } from "next/server";
import { smtpMailer } from "../../../../../backend/notifications/smtp";
import { defaultDispatcher } from "../../../../../backend/notifications/dispatcher";
import { emailTemplates } from "../../../../../backend/templates/email-templates";
import type {
  AbandonedCartData,
  EnrolmentSuccessData,
  InstallmentReminderData,
  PaymentFailureData,
  RefundNotificationData,
  WeeklyEvaluationEmailData,
} from "../../../../../backend/templates/email-templates";

export const runtime = "nodejs";

type TemplateType =
  | "weeklyEvaluationReport"
  | "enrolmentSuccess"
  | "abandonedCart"
  | "installmentReminder"
  | "paymentFailure"
  | "refundNotification";

interface SendMailRequestBody {
  to: string;
  subject?: string;
  html?: string;
  text?: string;
  template?: TemplateType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

/**
 * POST /api/smtp/send
 * Dispatches an automated email via SMTP using either raw content or template rendering.
 */
export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SendMailRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { to, template, data } = body;

  if (!to || typeof to !== "string" || !to.includes("@")) {
    return NextResponse.json({ error: "Missing or invalid 'to' recipient email address" }, { status: 422 });
  }

  let subject = body.subject;
  let html = body.html;
  let text = body.text;

  // If a template is requested, render using brand-consistent email templates
  if (template) {
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: `Missing required 'data' object for template '${template}'` },
        { status: 422 }
      );
    }

    switch (template) {
      case "weeklyEvaluationReport": {
        const rendered = emailTemplates.weeklyEvaluationReport(data as WeeklyEvaluationEmailData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "enrolmentSuccess": {
        const rendered = emailTemplates.enrolmentSuccess(data as EnrolmentSuccessData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "abandonedCart": {
        const rendered = emailTemplates.abandonedCart(data as AbandonedCartData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "installmentReminder": {
        const rendered = emailTemplates.installmentReminder(data as InstallmentReminderData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "paymentFailure": {
        const rendered = emailTemplates.paymentFailure(data as PaymentFailureData);
        subject = subject || rendered.subject;
        html = rendered.html;
        text = rendered.text;
        break;
      }
      case "refundNotification": {
        const rendered = emailTemplates.refundNotification(data as RefundNotificationData);
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

  try {
    // If SMTP is configured, send directly via SMTP
    if (smtpMailer.isConfigured()) {
      const result = await smtpMailer.sendMail({
        to,
        subject,
        html,
        text,
      });

      // Also record in dispatcher outbox for auditing
      await defaultDispatcher.sendEmail({
        to,
        subject,
        html,
        text: text || "",
        metadata: { directSmtpSend: true, messageId: result.messageId, template },
      });

      return NextResponse.json({
        status: "success",
        transport: "SMTP",
        messageId: result.messageId,
        to,
        subject,
        sentAt: new Date().toISOString(),
      });
    }

    // If SMTP is not yet configured, record in outbox ledger and return simulation note
    const outboxRecord = await defaultDispatcher.sendEmail({
      to,
      subject,
      html,
      text: text || "",
      metadata: { directSmtpSend: true, template },
    });

    return NextResponse.json({
      status: "queued_simulated",
      transport: "OUTBOX_LEDGER",
      note: "SMTP credentials not defined in environment. Email saved to in-memory audit ledger. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD in .env.local to send live.",
      outboxRecordId: outboxRecord.id,
      to,
      subject,
      sentAt: outboxRecord.sentAt,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to dispatch email via SMTP",
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}

