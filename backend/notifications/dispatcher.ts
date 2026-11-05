import { smtpMailer } from "./smtp";
import { openwaClient } from "./openwa";

/**
 * Unified Dispatcher & Outbox Ledger for Emails and WhatsApp Messages
 */

export interface DispatchedEmail {
  id: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  sentAt: Date;
  status: "SENT" | "FAILED";
  metadata?: Record<string, unknown>;
}

export interface DispatchedWhatsApp {
  id: string;
  to: string;
  templateName: string;
  fallbackText: string;
  components?: unknown[];
  sentAt: Date;
  status: "SENT" | "FAILED";
  metadata?: Record<string, unknown>;
}

export class NotificationDispatcher {
  private emailOutbox: DispatchedEmail[] = [];
  private whatsAppOutbox: DispatchedWhatsApp[] = [];
  private maxOutboxSize = 200;

  /**
   * Dispatches an email and stores it in the outbox ledger
   */
  public async sendEmail(payload: {
    to: string;
    subject: string;
    html: string;
    text: string;
    metadata?: Record<string, unknown>;
  }): Promise<DispatchedEmail> {
    const record: DispatchedEmail = {
      id: `em_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      sentAt: new Date(),
      status: "SENT",
      metadata: payload.metadata,
    };

    // 1. Prioritize SMTP automation if configured:
    if (smtpMailer.isConfigured()) {
      try {
        const info = await smtpMailer.sendMail({
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        });

        record.metadata = {
          ...record.metadata,
          transport: "SMTP",
          messageId: info.messageId,
          response: info.response,
          deliveredLive: true,
        };
        console.info(`[Dispatcher] Live email dispatched via SMTP to ${payload.to} (MessageID: ${info.messageId})`);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(`[Dispatcher] SMTP dispatch error to ${payload.to}:`, errorMsg);
        record.status = "FAILED";
        record.metadata = { ...record.metadata, transport: "SMTP", error: errorMsg };
      }
    } else if (process.env.RESEND_API_KEY) {
      // 2. Fallback to Resend HTTP API if configured:
      try {
        const fromAddress = process.env.RESEND_FROM_EMAIL || "Thinkova <info@thinkova.ai>";
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromAddress,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`[Dispatcher] Resend API error (${res.status}): ${errText}`);
          record.status = "FAILED";
          record.metadata = { ...record.metadata, transport: "RESEND", providerError: errText, statusCode: res.status };
        } else {
          const resData = (await res.json()) as { id?: string };
          record.metadata = { ...record.metadata, transport: "RESEND", resendId: resData?.id, deliveredLive: true };
          console.info(`[Dispatcher] Live email dispatched via Resend to ${payload.to} (ID: ${resData?.id})`);
        }
      } catch (err) {
        console.error(`[Dispatcher] Network error sending live email via Resend:`, err);
        record.status = "FAILED";
      }
    } else {
      record.metadata = { ...record.metadata, deliveredLive: false, mode: "SIMULATED_OUTBOX" };
    }

    this.emailOutbox.unshift(record);
    if (this.emailOutbox.length > this.maxOutboxSize) {
      this.emailOutbox.pop();
    }

    return record;
  }

  /**
   * Dispatches a WhatsApp message and stores it in the outbox ledger
   */
  public async sendWhatsApp(payload: {
    to: string;
    templateName: string;
    fallbackText: string;
    components?: unknown[];
    metadata?: Record<string, unknown>;
  }): Promise<DispatchedWhatsApp> {
    const record: DispatchedWhatsApp = {
      id: `wa_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      to: payload.to,
      templateName: payload.templateName,
      fallbackText: payload.fallbackText,
      components: payload.components,
      sentAt: new Date(),
      status: "SENT",
      metadata: payload.metadata,
    };

    // 1. Prioritize self-hosted OpenWA gateway if configured:
    if (openwaClient.isConfigured()) {
      try {
        const waResult = await openwaClient.sendText(payload.to, payload.fallbackText);
        record.metadata = {
          ...record.metadata,
          transport: "OPENWA",
          messageId: waResult.messageId,
          recipientJid: waResult.recipientJid,
          deliveredLive: !waResult.isSimulation,
        };
        if (waResult.status === "FAILED") {
          record.status = "FAILED";
          record.metadata.error = waResult.error;
        } else {
          console.info(`[Dispatcher] Live WhatsApp dispatched via OpenWA to ${payload.to}`);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(`[Dispatcher] OpenWA dispatch error to ${payload.to}:`, errorMsg);
        record.status = "FAILED";
        record.metadata = { ...record.metadata, transport: "OPENWA", error: errorMsg };
      }
    } else if (process.env.WATI_API_ENDPOINT && process.env.WATI_BEARER_TOKEN) {
      // 2. Fallback to external WhatsApp provider (WATI/Interakt) if configured:
      try {
        await fetch(`${process.env.WATI_API_ENDPOINT}/api/v1/sendTemplateMessage`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WATI_BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            whatsappNumber: payload.to,
            template_name: payload.templateName,
            broadcast_name: "thinkova_notification",
          }),
        });
      } catch (err) {
        console.error(`[Dispatcher] Failed to dispatch live WhatsApp via WATI:`, err);
      }
    } else {
      record.metadata = { ...record.metadata, deliveredLive: false, mode: "SIMULATED_OUTBOX" };
    }

    this.whatsAppOutbox.unshift(record);
    if (this.whatsAppOutbox.length > this.maxOutboxSize) {
      this.whatsAppOutbox.pop();
    }

    return record;
  }

  public getEmailOutbox(recipient?: string): DispatchedEmail[] {
    if (recipient) {
      return this.emailOutbox.filter((e) => e.to.toLowerCase() === recipient.toLowerCase());
    }
    return [...this.emailOutbox];
  }

  public getWhatsAppOutbox(phone?: string): DispatchedWhatsApp[] {
    if (phone) {
      return this.whatsAppOutbox.filter((w) => w.to === phone);
    }
    return [...this.whatsAppOutbox];
  }

  public clearOutbox(): void {
    this.emailOutbox = [];
    this.whatsAppOutbox = [];
  }
}

export const defaultDispatcher = new NotificationDispatcher();
