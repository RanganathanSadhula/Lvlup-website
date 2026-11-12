import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";

export interface AzureGraphConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  sender: string;
}

export interface EmailRecipient {
  emailAddress: {
    address: string;
    name?: string;
  };
}

export type RecipientInput = string | EmailRecipient;

export interface GraphSendMailOptions {
  to: RecipientInput | RecipientInput[];
  subject: string;
  html?: string;
  text?: string;
  htmlContent?: string;
  textContent?: string;
  cc?: RecipientInput | RecipientInput[];
  bcc?: RecipientInput | RecipientInput[];
  replyTo?: RecipientInput | RecipientInput[];
  saveToSentItems?: boolean;
  headers?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface GraphSendMailResult {
  success: boolean;
  messageId: string;
  sender: string;
  sentAt: Date;
  recipientCount: number;
  transport: "MICROSOFT_GRAPH";
  error?: string;
}

/**
 * Pre-checks and validates an email address against standard RFC format.
 */
export function validateEmailAddress(email: string): boolean {
  const trimmed = (email || "").trim();
  if (!trimmed || trimmed.length > 254) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(
    trimmed
  );
}

/**
 * Normalizes string, comma-delimited strings, or arrays into Microsoft Graph EmailRecipient objects.
 */
export function normalizeRecipients(
  input: RecipientInput | RecipientInput[] | undefined
): EmailRecipient[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.flatMap((item) => {
      if (typeof item === "string") {
        return item
          .split(",")
          .map((s) => s.trim())
          .filter(validateEmailAddress)
          .map((address) => ({ emailAddress: { address } }));
      }
      if (item && item.emailAddress && validateEmailAddress(item.emailAddress.address)) {
        return [item];
      }
      return [];
    });
  }

  if (typeof input === "string") {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(validateEmailAddress)
      .map((address) => ({ emailAddress: { address } }));
  }

  return [];
}

/**
 * Re-frames and builds the Microsoft Graph sendMail JSON payload.
 */
export function buildGraphMailPayload(options: GraphSendMailOptions) {
  const toRecipients = normalizeRecipients(options.to);
  if (toRecipients.length === 0) {
    throw new Error("Invalid or empty recipient email address(es).");
  }

  const html = options.html || options.htmlContent || "";
  const text = options.text || options.textContent || "";
  const bodyContent = html || text || "<p></p>";
  const contentType: "HTML" | "Text" = html ? "HTML" : "Text";

  // Normalize subject: remove invalid CRLF/newlines that could cause header manipulation
  const cleanSubject = (options.subject || "").replace(/[\r\n]+/g, " ").trim();

  const ccRecipients = normalizeRecipients(options.cc);
  const bccRecipients = normalizeRecipients(options.bcc);
  const replyTo = normalizeRecipients(options.replyTo);

  const payload: {
    message: {
      subject: string;
      body: {
        contentType: "HTML" | "Text";
        content: string;
      };
      toRecipients: EmailRecipient[];
      ccRecipients?: EmailRecipient[];
      bccRecipients?: EmailRecipient[];
      replyTo?: EmailRecipient[];
      internetMessageHeaders?: Array<{ name: string; value: string }>;
    };
    saveToSentItems: boolean;
  } = {
    message: {
      subject: cleanSubject,
      body: {
        contentType,
        content: bodyContent,
      },
      toRecipients,
    },
    saveToSentItems: options.saveToSentItems ?? true,
  };

  if (ccRecipients.length > 0) payload.message.ccRecipients = ccRecipients;
  if (bccRecipients.length > 0) payload.message.bccRecipients = bccRecipients;
  if (replyTo.length > 0) payload.message.replyTo = replyTo;

  if (options.headers && Object.keys(options.headers).length > 0) {
    payload.message.internetMessageHeaders = Object.entries(options.headers).map(
      ([name, value]) => ({ name, value: String(value) })
    );
  }

  return payload;
}

/**
 * Microsoft Graph Mailer Client
 * Connects via Azure OAuth2 Client Secret Credential and manages Microsoft Graph email delivery.
 */
export class MicrosoftGraphMailer {
  private client: Client | null = null;
  private credential: ClientSecretCredential | null = null;
  private cachedConfigKey: string = "";

  public getConfig(): AzureGraphConfig | null {
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;
    const sender =
      process.env.MAIL_SENDER ||
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
      "info@thinkova.ai";

    if (!tenantId || !clientId || !clientSecret) {
      return null;
    }

    return { tenantId, clientId, clientSecret, sender };
  }

  public isConfigured(): boolean {
    return this.getConfig() !== null;
  }

  public getConfigSummary() {
    const cfg = this.getConfig();
    const defaultSender =
      process.env.MAIL_SENDER ||
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
      "info@thinkova.ai";

    if (!cfg) {
      return {
        configured: false,
        provider: "Microsoft Graph API",
        sender: defaultSender,
        instructions:
          "Define AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET in .env.local to enable live delivery.",
      };
    }

    return {
      configured: true,
      provider: "Microsoft Graph API",
      tenantIdPrefix: `${cfg.tenantId.slice(0, 8)}...`,
      clientIdPrefix: `${cfg.clientId.slice(0, 8)}...`,
      sender: cfg.sender,
    };
  }

  public getClient(): Client {
    const cfg = this.getConfig();
    if (!cfg) {
      throw new Error(
        "Microsoft Graph API is not configured. Missing AZURE_TENANT_ID, AZURE_CLIENT_ID, or AZURE_CLIENT_SECRET in environment."
      );
    }

    const configKey = `${cfg.tenantId}:${cfg.clientId}:${cfg.clientSecret}`;
    if (!this.client || this.cachedConfigKey !== configKey) {
      this.credential = new ClientSecretCredential(
        cfg.tenantId,
        cfg.clientId,
        cfg.clientSecret
      );

      const authProvider = new TokenCredentialAuthenticationProvider(this.credential, {
        scopes: ["https://graph.microsoft.com/.default"],
      });

      this.client = Client.initWithMiddleware({ authProvider });
      this.cachedConfigKey = configKey;
    }

    return this.client;
  }

  public async sendEmail(options: GraphSendMailOptions): Promise<GraphSendMailResult> {
    const cfg = this.getConfig();
    if (!cfg) {
      throw new Error(
        "Microsoft Graph API is not configured. Set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET in .env.local"
      );
    }

    const payload = buildGraphMailPayload(options);
    const client = this.getClient();
    const sender = cfg.sender;

    await client
      .api(`/users/${sender}/sendMail`)
      .post(payload);

    const domain = sender.split("@")[1] || "thinkova.ai";
    const messageId = `<graph-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@${domain}>`;

    return {
      success: true,
      messageId,
      sender,
      sentAt: new Date(),
      recipientCount: payload.message.toRecipients.length,
      transport: "MICROSOFT_GRAPH",
    };
  }

  public async verifyConnection(): Promise<{
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  }> {
    const cfg = this.getConfig();
    if (!cfg) {
      return {
        success: false,
        message:
          "Microsoft Graph API credentials not configured. Please define AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET in .env.local.",
      };
    }

    try {
      if (!this.credential) {
        this.credential = new ClientSecretCredential(
          cfg.tenantId,
          cfg.clientId,
          cfg.clientSecret
        );
      }

      const token = await this.credential.getToken("https://graph.microsoft.com/.default");
      if (!token || !token.token) {
        throw new Error("Azure AD returned empty OAuth2 token response.");
      }

      return {
        success: true,
        message: `Azure AD authentication verified successfully for tenant ${cfg.tenantId.slice(0, 8)}... (Mailbox: ${cfg.sender})`,
        details: {
          sender: cfg.sender,
          tokenExpiresOn: new Date(token.expiresOnTimestamp).toISOString(),
        },
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Azure AD authentication failed: ${errorMsg}`,
      };
    }
  }
}

export const graphMailer = new MicrosoftGraphMailer();

/**
 * Functional helper: sendEmail({ to, subject, htmlContent })
 */
export async function sendEmail({
  to,
  subject,
  htmlContent,
  textContent,
  ...rest
}: {
  to: string | string[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  [key: string]: unknown;
}): Promise<GraphSendMailResult> {
  return graphMailer.sendEmail({
    to,
    subject,
    html: htmlContent,
    text: textContent,
    ...rest,
  });
}

