import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MicrosoftGraphMailer } from "../backend/notifications/graph-mailer";
import { NotificationDispatcher } from "../backend/notifications/dispatcher";

describe("Email Automation & Microsoft Graph Service", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("1. Reports not configured when environment variables are missing", () => {
    delete process.env.AZURE_TENANT_ID;
    delete process.env.AZURE_CLIENT_ID;
    delete process.env.AZURE_CLIENT_SECRET;

    const mailer = new MicrosoftGraphMailer();
    expect(mailer.isConfigured()).toBe(false);
    expect(mailer.getConfig()).toBeNull();

    const summary = mailer.getConfigSummary();
    expect(summary.configured).toBe(false);
  });

  it("2. Parses Microsoft Graph config correctly and masks secrets in summary", () => {
    process.env.AZURE_TENANT_ID = "00000000-1111-2222-3333-444444444444";
    process.env.AZURE_CLIENT_ID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    process.env.AZURE_CLIENT_SECRET = "secret_password_123";
    process.env.MAIL_SENDER = "info@thinkova.ai";

    const mailer = new MicrosoftGraphMailer();
    expect(mailer.isConfigured()).toBe(true);

    const cfg = mailer.getConfig();
    expect(cfg?.tenantId).toBe("00000000-1111-2222-3333-444444444444");
    expect(cfg?.clientId).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    expect(cfg?.sender).toBe("info@thinkova.ai");

    const summary = mailer.getConfigSummary();
    expect(summary.configured).toBe(true);
    expect(summary.sender).toBe("info@thinkova.ai");
    expect(JSON.stringify(summary)).not.toContain("secret_password_123");
  });

  it("3. Verifies connection handling when unconfigured or invalid", async () => {
    delete process.env.AZURE_TENANT_ID;
    const mailer = new MicrosoftGraphMailer();
    const result = await mailer.verifyConnection();

    expect(result.success).toBe(false);
    expect(result.message).toContain("Microsoft Graph API credentials not configured");
  });

  it("4. Sends email and returns messageId using Graph Client", async () => {
    process.env.AZURE_TENANT_ID = "00000000-1111-2222-3333-444444444444";
    process.env.AZURE_CLIENT_ID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    process.env.AZURE_CLIENT_SECRET = "secret_app_password";
    process.env.MAIL_SENDER = "info@thinkova.ai";

    const mailer = new MicrosoftGraphMailer();
    const mockPost = vi.fn().mockResolvedValue({});
    const mockApi = vi.fn().mockReturnValue({ post: mockPost });

    vi.spyOn(mailer, "getClient").mockReturnValue({
      api: mockApi,
    } as unknown as ReturnType<typeof mailer.getClient>);

    const result = await mailer.sendEmail({
      to: "parent@example.com",
      subject: "Welcome to ThinkOva",
      html: "<p>Welcome to ThinkOva!</p>",
    });

    expect(result.success).toBe(true);
    expect(result.transport).toBe("MICROSOFT_GRAPH");
    expect(result.messageId).toContain("@thinkova.ai");
    expect(mockApi).toHaveBeenCalledWith("/users/info@thinkova.ai/sendMail");
    expect(mockPost).toHaveBeenCalled();
  });

  it("5. NotificationDispatcher automatically routes emails via Microsoft Graph when configured", async () => {
    process.env.AZURE_TENANT_ID = "00000000-1111-2222-3333-444444444444";
    process.env.AZURE_CLIENT_ID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    process.env.AZURE_CLIENT_SECRET = "secret_app_password";
    process.env.MAIL_SENDER = "info@thinkova.ai";

    const { graphMailer } = await import("../backend/notifications/graph-mailer");
    vi.spyOn(graphMailer, "sendEmail").mockResolvedValue({
      success: true,
      messageId: "<graph-dispatched-101@thinkova.ai>",
      sender: "info@thinkova.ai",
      sentAt: new Date(),
      recipientCount: 1,
      transport: "MICROSOFT_GRAPH",
    });

    const dispatcher = new NotificationDispatcher();
    const emailRecord = await dispatcher.sendEmail({
      to: "sandeep@example.com",
      subject: "Milestone Complete",
      html: "<p>Milestone 3 Done</p>",
      text: "Milestone 3 Done",
    });

    expect(emailRecord.status).toBe("SENT");
    expect(emailRecord.metadata?.transport).toBe("MICROSOFT_GRAPH");
    expect(emailRecord.metadata?.messageId).toBe("<graph-dispatched-101@thinkova.ai>");
    expect(dispatcher.getEmailOutbox().length).toBe(1);
  });

  it("6. Generates dynamic Principal Outreach email template from school registry data", async () => {
    const { emailTemplates, formatPrincipalSalutation } = await import("../backend/templates/email-templates");

    // Salutation formatting tests
    expect(formatPrincipalSalutation("Priya Sharma", "Principal")).toBe("Dear Principal Sharma,");
    expect(formatPrincipalSalutation("Dr. Anita Desai", "Principal")).toBe("Dear Principal Dr. Anita Desai,");
    expect(formatPrincipalSalutation("Sunil Mehta", "Vice Principal")).toBe("Dear Vice Principal Mehta,");
    expect(formatPrincipalSalutation("Principal Priya Sharma")).toBe("Dear Principal Priya Sharma,");
    expect(formatPrincipalSalutation("", "Principal")).toBe("Dear Principal,");

    // Email rendering with dynamic registry data
    const email = emailTemplates.principalOutreach({
      principalName: "Priya Sharma",
      schoolName: "Delhi Public School, Pune",
      city: "Pune",
      role: "Principal",
      siteUrl: "https://www.thinkova.ai",
    });

    expect(email.subject).toContain("Delhi Public School, Pune");
    expect(email.html).toContain("Dear Principal Sharma,");
    expect(email.html).toContain("Delhi Public School, Pune");
    expect(email.html).toContain("https://www.thinkova.ai/images/email/principal-hero-student.png");
    expect(email.html).toContain("https://www.thinkova.ai/images/email/principal-case-study.jpg");
    expect(email.html).toContain("https://www.thinkova.ai/images/email/principal-generative-ai-girl.png");
    expect(email.html).toContain("Traditional thinking &rarr; Innovation thinking");
    expect(email.html).toContain("PILOT BATCHES THIS TERM");
    expect(email.html).toContain("Sumit Sharma");
    expect(email.html).toContain("+91 96066 26152");

    // Plain text version has same dynamic values
    expect(email.text).toContain("Dear Principal Sharma,");
    expect(email.text).toContain("Delhi Public School, Pune");
    expect(email.text).toContain("Junior Innovators (Grades 5–8)");
  });
});
