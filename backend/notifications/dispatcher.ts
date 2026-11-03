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

    // If external mail provider (e.g. Resend, SES) is configured, invoke it here:
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Thinkova <info@thinkova.ai>",
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
          }),
        });
      } catch (err) {
        console.error(`[Dispatcher] Failed to send live email via Resend:`, err);
      }
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

    // If external WhatsApp provider (e.g. WATI, Interakt) is configured, invoke it here:
    if (process.env.WATI_API_ENDPOINT && process.env.WATI_BEARER_TOKEN) {
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
            broadcast_name: "lvlup_notification",
          }),
        });
      } catch (err) {
        console.error(`[Dispatcher] Failed to dispatch live WhatsApp via WATI:`, err);
      }
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

