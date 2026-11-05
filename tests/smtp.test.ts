import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SmtpMailer } from "../backend/notifications/smtp";
import { NotificationDispatcher } from "../backend/notifications/dispatcher";
import nodemailer from "nodemailer";

describe("SMTP Mailer & Dispatcher Automation", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("1. Reports not configured when environment variables are missing", () => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;

    const mailer = new SmtpMailer();
    expect(mailer.isConfigured()).toBe(false);
    expect(mailer.getConfig()).toBeNull();

    const summary = mailer.getConfigSummary();
    expect(summary.configured).toBe(false);
  });

  it("2. Parses SMTP config correctly and masks username in summary", () => {
    process.env.SMTP_HOST = "smtp.zoho.com";
    process.env.SMTP_PORT = "465";
    process.env.SMTP_USER = "info@thinkova.ai";
    process.env.SMTP_PASSWORD = "secret_password_123";
    process.env.SMTP_FROM = "ThinkOva AI <info@thinkova.ai>";

    const mailer = new SmtpMailer();
    expect(mailer.isConfigured()).toBe(true);

    const cfg = mailer.getConfig();
    expect(cfg?.host).toBe("smtp.zoho.com");
    expect(cfg?.port).toBe(465);
    expect(cfg?.secure).toBe(true);
    expect(cfg?.from).toBe("ThinkOva AI <info@thinkova.ai>");

    const summary = mailer.getConfigSummary();
    expect(summary.configured).toBe(true);
    expect(summary.user).toBe("in***@thinkova.ai");
    expect(summary.user).not.toContain("secret_password_123");
  });

  it("3. Verifies connection handshake against mock transporter", async () => {
    process.env.SMTP_HOST = "smtp.zoho.com";
    process.env.SMTP_USER = "info@thinkova.ai";
    process.env.SMTP_PASSWORD = "secret_app_password";

    const mockVerify = vi.fn().mockResolvedValue(true);
    vi.spyOn(nodemailer, "createTransport").mockReturnValue({
      verify: mockVerify,
    } as unknown as ReturnType<typeof nodemailer.createTransport>);

    const mailer = new SmtpMailer();
    const result = await mailer.verifyConnection();

    expect(result.success).toBe(true);
    expect(result.message).toContain("SMTP connection established");
    expect(mockVerify).toHaveBeenCalled();
  });

  it("4. Sends email and returns messageId using transporter.sendMail", async () => {
    process.env.SMTP_HOST = "smtp.zoho.com";
    process.env.SMTP_USER = "info@thinkova.ai";
    process.env.SMTP_PASSWORD = "secret_app_password";

    const mockSendMail = vi.fn().mockResolvedValue({
      messageId: "<test-smtp-msg-01@thinkova.ai>",
      response: "250 2.0.0 OK: message queued",
    });

    vi.spyOn(nodemailer, "createTransport").mockReturnValue({
      sendMail: mockSendMail,
    } as unknown as ReturnType<typeof nodemailer.createTransport>);

    const mailer = new SmtpMailer();
    const result = await mailer.sendMail({
      to: "parent@example.com",
      subject: "Welcome to ThinkOva",
      html: "<p>Welcome to ThinkOva!</p>",
    });

    expect(result.messageId).toBe("<test-smtp-msg-01@thinkova.ai>");
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "parent@example.com",
        subject: "Welcome to ThinkOva",
        html: "<p>Welcome to ThinkOva!</p>",
      })
    );
  });

  it("5. NotificationDispatcher automatically routes emails via SMTP when configured", async () => {
    process.env.SMTP_HOST = "smtp.zoho.com";
    process.env.SMTP_USER = "info@thinkova.ai";
    process.env.SMTP_PASSWORD = "secret_app_password";

    const mockSendMail = vi.fn().mockResolvedValue({
      messageId: "<smtp-dispatched-101@thinkova.ai>",
      response: "250 OK",
    });

    vi.spyOn(nodemailer, "createTransport").mockReturnValue({
      sendMail: mockSendMail,
    } as unknown as ReturnType<typeof nodemailer.createTransport>);

    const dispatcher = new NotificationDispatcher();
    const emailRecord = await dispatcher.sendEmail({
      to: "sandeep@example.com",
      subject: "Milestone Complete",
      html: "<p>Milestone 3 Done</p>",
      text: "Milestone 3 Done",
    });

    expect(emailRecord.status).toBe("SENT");
    expect(emailRecord.metadata?.transport).toBe("SMTP");
    expect(emailRecord.metadata?.messageId).toBe("<smtp-dispatched-101@thinkova.ai>");
    expect(dispatcher.getEmailOutbox().length).toBe(1);
  });
});

