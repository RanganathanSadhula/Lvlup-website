import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  replyTo?: string;
}

export class SmtpMailer {
  private transporter: Transporter | null = null;
  private currentConfigKey: string = "";

  /**
   * Retrieves active SMTP configuration from environment variables
   */
  public getConfig(): SmtpConfig | null {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      return null;
    }

    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const from = process.env.SMTP_FROM || `ThinkOva <${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@thinkova.ai"}>`;
    const replyTo = process.env.SMTP_REPLY_TO || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@thinkova.ai";

    return { host, port, secure, user, pass, from, replyTo };
  }

  public isConfigured(): boolean {
    return this.getConfig() !== null;
  }

  /**
   * Returns a sanitized summary of current SMTP settings for monitoring
   */
  public getConfigSummary() {
    const cfg = this.getConfig();
    if (!cfg) {
      return { configured: false };
    }

    const [username, domain] = cfg.user.split("@");
    const maskedUser = domain
      ? `${username ? username.slice(0, 2) : ""}***@${domain}`
      : `${cfg.user.slice(0, 2)}***`;

    return {
      configured: true,
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      user: maskedUser,
      from: cfg.from,
      replyTo: cfg.replyTo,
    };
  }

  /**
   * Returns or creates a connection-pooled Nodemailer transporter
   */
  public getTransporter(): Transporter {
    const cfg = this.getConfig();
    if (!cfg) {
      throw new Error(
        "SMTP is not configured. Please define SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in .env.local"
      );
    }

    const configKey = `${cfg.host}:${cfg.port}:${cfg.user}:${cfg.secure}`;
    if (!this.transporter || this.currentConfigKey !== configKey) {
      this.transporter = nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        auth: {
          user: cfg.user,
          pass: cfg.pass,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 10, // max 10 emails/second
      });
      this.currentConfigKey = configKey;
    }

    return this.transporter;
  }

  /**
   * Verifies SMTP server handshake and credentials
   */
  public async verifyConnection(): Promise<{ success: boolean; message: string; error?: string }> {
    const cfg = this.getConfig();
    if (!cfg) {
      return {
        success: false,
        message: "SMTP is not configured. Missing SMTP_HOST, SMTP_USER, or SMTP_PASSWORD in environment.",
      };
    }

    try {
      const transporter = this.getTransporter();
      await transporter.verify();
      return {
        success: true,
        message: `SMTP connection established successfully to ${cfg.host}:${cfg.port}`,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `SMTP connection failed to ${cfg.host}:${cfg.port}`,
        error: errorMsg,
      };
    }
  }

  /**
   * Dispatches an email through SMTP
   */
  public async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
  }): Promise<{ messageId: string; response: string }> {
    const cfg = this.getConfig();
    if (!cfg) {
      throw new Error("SMTP is not configured.");
    }

    const transporter = this.getTransporter();
    const info = await transporter.sendMail({
      from: options.from || cfg.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]+>/g, " ").trim(),
      replyTo: options.replyTo || cfg.replyTo,
    });

    return {
      messageId: info.messageId || `smtp-${Date.now()}`,
      response: info.response || "OK",
    };
  }
}

export const smtpMailer = new SmtpMailer();

