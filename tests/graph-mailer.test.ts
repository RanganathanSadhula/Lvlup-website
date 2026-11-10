import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MicrosoftGraphMailer,
  sendEmail,
  validateEmailAddress,
  normalizeRecipients,
  buildGraphMailPayload,
} from "../backend/notifications/graph-mailer";
import { NotificationDispatcher } from "../backend/notifications/dispatcher";

describe("Microsoft Graph Mailer & Dispatcher Automation", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  // 1. Configuration Detection & Validation
  it("1. Reports not configured when Azure environment variables are missing", () => {
    delete process.env.AZURE_TENANT_ID;
    delete process.env.AZURE_CLIENT_ID;
    delete process.env.AZURE_CLIENT_SECRET;

    const mailer = new MicrosoftGraphMailer();
    expect(mailer.isConfigured()).toBe(false);
    expect(mailer.getConfig()).toBeNull();

    const summary = mailer.getConfigSummary();
    expect(summary.configured).toBe(false);
    expect(summary.provider).toBe("Microsoft Graph API");
  });

  it("2. Parses Azure OAuth2 config correctly and masks secrets in summary", () => {
    process.env.AZURE_TENANT_ID = "00000000-1111-2222-3333-444444444444";
    process.env.AZURE_CLIENT_ID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    process.env.AZURE_CLIENT_SECRET = "super_secret_azure_client_secret_value";
    process.env.MAIL_SENDER = "info@thinkova.ai";

    const mailer = new MicrosoftGraphMailer();
    expect(mailer.isConfigured()).toBe(true);

    const cfg = mailer.getConfig();
    expect(cfg?.tenantId).toBe("00000000-1111-2222-3333-444444444444");
    expect(cfg?.clientId).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    expect(cfg?.sender).toBe("info@thinkova.ai");

    const summary = mailer.getConfigSummary();
    expect(summary.configured).toBe(true);
    expect(summary.tenantIdPrefix).toBe("00000000...");
    expect(summary.clientIdPrefix).toBe("aaaaaaaa...");
    expect(summary.sender).toBe("info@thinkova.ai");
    // Ensure secret is never exposed
    expect(JSON.stringify(summary)).not.toContain("super_secret_azure_client_secret_value");
  });

  // 2. Pre-checking Acceptors & Recipient Normalization
  describe("Pre-checking Acceptors & Normalizers", () => {
    it("validates RFC email addresses correctly", () => {
      expect(validateEmailAddress("principal@school.edu")).toBe(true);
      expect(validateEmailAddress("parent.kumar+test@gmail.com")).toBe(true);
      expect(validateEmailAddress("invalid-email-without-at")).toBe(false);
      expect(validateEmailAddress("")).toBe(false);
      expect(validateEmailAddress("missing-domain@.com")).toBe(false);
    });

    it("normalizes single string, comma-separated strings, and arrays into Graph format", () => {
      // Single email
      expect(normalizeRecipients("principal@dps.edu")).toEqual([
        { emailAddress: { address: "principal@dps.edu" } },
      ]);

      // Comma separated
      expect(normalizeRecipients("a@thinkova.ai, b@thinkova.ai, invalid-email")).toEqual([
        { emailAddress: { address: "a@thinkova.ai" } },
        { emailAddress: { address: "b@thinkova.ai" } },
      ]);

      // Array with objects and strings
      expect(
        normalizeRecipients([
          "c@thinkova.ai",
          { emailAddress: { address: "d@thinkova.ai", name: "Coordinator" } },
        ])
      ).toEqual([
        { emailAddress: { address: "c@thinkova.ai" } },
        { emailAddress: { address: "d@thinkova.ai", name: "Coordinator" } },
      ]);
    });

    it("throws clear validation error when recipients are missing or invalid", () => {
      expect(() =>
        buildGraphMailPayload({
          to: "invalid-email-address",
          subject: "Test",
          html: "<p>Hello</p>",
        })
      ).toThrow("Invalid or empty recipient email address(es)");
    });
  });

  // 3. Re-framers & Graph API Payload Setup
  describe("Re-framers & Payload Builder", () => {
    it("builds compliant Microsoft Graph sendMail payload", () => {
      const payload = buildGraphMailPayload({
        to: "principal@dps-pune.edu",
        subject: "Innovation & Capstone Program\n\r",
        html: "<h1>Welcome</h1><p>Eight-week program</p>",
        text: "Welcome: Eight-week program",
        cc: "coordinator@dps-pune.edu",
        replyTo: "partnerships@thinkova.ai",
        saveToSentItems: true,
      });

      expect(payload.saveToSentItems).toBe(true);
      // Strips newlines from subject
      expect(payload.message.subject).toBe("Innovation & Capstone Program");
      expect(payload.message.body.contentType).toBe("HTML");
      expect(payload.message.body.content).toContain("Eight-week program");
      expect(payload.message.toRecipients).toEqual([
        { emailAddress: { address: "principal@dps-pune.edu" } },
      ]);
      expect(payload.message.ccRecipients).toEqual([
        { emailAddress: { address: "coordinator@dps-pune.edu" } },
      ]);
      expect(payload.message.replyTo).toEqual([
        { emailAddress: { address: "partnerships@thinkova.ai" } },
      ]);
    });
  });

  // 4. Live & Mocked Send Execution
  it("3. Sends email via Microsoft Graph API client post endpoint", async () => {
    process.env.AZURE_TENANT_ID = "tenant-123";
    process.env.AZURE_CLIENT_ID = "client-456";
    process.env.AZURE_CLIENT_SECRET = "secret-789";
    process.env.MAIL_SENDER = "info@thinkova.ai";

    const mailer = new MicrosoftGraphMailer();
    const mockPost = vi.fn().mockResolvedValue({});
    const mockApi = vi.fn().mockReturnValue({ post: mockPost });

    vi.spyOn(mailer, "getClient").mockReturnValue({
      api: mockApi,
    } as unknown as ReturnType<typeof mailer.getClient>);

    const result = await mailer.sendEmail({
      to: "principal@bishop-school.edu",
      subject: "Pilot Cohort Exploration",
      htmlContent: "<p>Let's plan demo day</p>",
    });

    expect(result.success).toBe(true);
    expect(result.transport).toBe("MICROSOFT_GRAPH");
    expect(result.sender).toBe("info@thinkova.ai");
    expect(result.messageId).toContain("@thinkova.ai");
    expect(mockApi).toHaveBeenCalledWith("/users/info@thinkova.ai/sendMail");
    expect(mockPost).toHaveBeenCalled();
  });

  // 5. Standalone Functional Helper
  it("4. sendEmail helper function dispatches correctly", async () => {
    process.env.AZURE_TENANT_ID = "tenant-123";
    process.env.AZURE_CLIENT_ID = "client-456";
    process.env.AZURE_CLIENT_SECRET = "secret-789";
    process.env.MAIL_SENDER = "info@thinkova.ai";

    const { graphMailer } = await import("../backend/notifications/graph-mailer");
    const mockSend = vi.fn().mockResolvedValue({
      success: true,
      messageId: "<graph-test-123@thinkova.ai>",
      sender: "info@thinkova.ai",
      sentAt: new Date(),
      recipientCount: 1,
      transport: "MICROSOFT_GRAPH" as const,
    });
    vi.spyOn(graphMailer, "sendEmail").mockImplementation(mockSend);

    const res = await sendEmail({
      to: "test-recipient@example.com",
      subject: "Test automated email from Thinkova",
      htmlContent: "<h3>Hello!</h3><p>Graph API email delivery is working.</p>",
    });

    expect(res.success).toBe(true);
    expect(res.messageId).toBe("<graph-test-123@thinkova.ai>");
  });

  // 6. NotificationDispatcher Integration
  it("5. NotificationDispatcher automatically routes emails via Microsoft Graph API", async () => {
    process.env.AZURE_TENANT_ID = "tenant-123";
    process.env.AZURE_CLIENT_ID = "client-456";
    process.env.AZURE_CLIENT_SECRET = "secret-789";
    process.env.MAIL_SENDER = "info@thinkova.ai";

    const { graphMailer } = await import("../backend/notifications/graph-mailer");
    vi.spyOn(graphMailer, "sendEmail").mockResolvedValue({
      success: true,
      messageId: "<graph-dispatched-777@thinkova.ai>",
      sender: "info@thinkova.ai",
      sentAt: new Date(),
      recipientCount: 1,
      transport: "MICROSOFT_GRAPH",
    });

    const dispatcher = new NotificationDispatcher();
    const emailRecord = await dispatcher.sendEmail({
      to: "sandeep@example.com",
      subject: "Milestone 4 Complete",
      html: "<p>Milestone 4 Verified</p>",
      text: "Milestone 4 Verified",
    });

    expect(emailRecord.status).toBe("SENT");
    expect(emailRecord.metadata?.transport).toBe("MICROSOFT_GRAPH");
    expect(emailRecord.metadata?.messageId).toBe("<graph-dispatched-777@thinkova.ai>");
    expect(emailRecord.metadata?.sender).toBe("info@thinkova.ai");
    expect(dispatcher.getEmailOutbox().length).toBe(1);
  });
});

