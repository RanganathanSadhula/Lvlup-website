/**
 * OpenWA (Open-Source WhatsApp API Gateway) Client Singleton
 * Connects LvlUp to self-hosted OpenWA instance for free automated WhatsApp messaging.
 */

export interface OpenWASendResult {
  messageId: string;
  status: "SENT" | "PENDING" | "FAILED";
  recipientJid: string;
  isSimulation: boolean;
  error?: string;
}

export interface OpenWASessionStatus {
  sessionId: string;
  status: "CONNECTED" | "QR_READY" | "DISCONNECTED" | "STARTING" | "SIMULATION";
  phone?: string;
  isSimulation: boolean;
}

export class OpenWAClient {
  private baseUrl: string;
  private apiKey: string;
  private sessionId: string;
  private resolvedSessionId?: string;

  constructor() {
    this.baseUrl = (process.env.OPENWA_API_URL || "http://localhost:2785/api").replace(/\/$/, "");
    this.apiKey = process.env.OPENWA_API_KEY || "";
    this.sessionId = process.env.OPENWA_SESSION_ID || "thinkova-notifications";
  }

  /**
   * Automatically resolves session UUID from friendly name (e.g. "lvlup-notifications")
   */
  public async getActiveSessionId(): Promise<string> {
    if (this.resolvedSessionId) return this.resolvedSessionId;

    try {
      const res = await fetch(`${this.baseUrl}/sessions`, {
        headers: { "X-API-Key": this.apiKey },
      });
      if (res.ok) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sessions: any[] = await res.json();
        const found =
          sessions.find((s) => s.id === this.sessionId || s.name === this.sessionId) ||
          sessions.find((s) => s.status === "ready" || s.status === "connected") ||
          sessions[0];
        if (found) {
          this.resolvedSessionId = found.id;
          return found.id;
        }
      }
    } catch {
      // Fallback to configured sessionId
    }

    return this.sessionId;
  }

  /**
   * Returns true when real OpenWA API credentials are configured.
   */
  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Formats Indian mobile numbers to WhatsApp JID format:
   * E.g. "+91 98201 43210" or "9820143210" -> "919820143210@c.us"
   */
  public formatChatId(phone: string): string {
    let digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
      digits = `91${digits}`;
    }
    return `${digits}@c.us`;
  }

  /**
   * Dispatches text message via OpenWA REST API or Dynamic Simulation.
   */
  public async sendText(phone: string, text: string): Promise<OpenWASendResult> {
    const chatId = this.formatChatId(phone);

    if (!this.isConfigured()) {
      // Dynamic Simulation Mode (for testing without Docker container running)
      console.info(`[OpenWA] [SIMULATION] Message dispatched to ${chatId}: "${text.slice(0, 50)}…"`);
      return {
        messageId: `sim_wa_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        status: "SENT",
        recipientJid: chatId,
        isSimulation: true,
      };
    }

    const targetSessionId = await this.getActiveSessionId();
    const url = `${this.baseUrl}/sessions/${encodeURIComponent(targetSessionId)}/messages/send-text`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify({ chatId, text }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`OpenWA HTTP ${res.status}: ${errText}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await res.json().catch(() => ({}));
      return {
        messageId: data?.id || data?.messageId || `wa_${Date.now()}`,
        status: "SENT",
        recipientJid: chatId,
        isSimulation: false,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[OpenWA] Failed to dispatch text to ${chatId}:`, message);
      return {
        messageId: "",
        status: "FAILED",
        recipientJid: chatId,
        isSimulation: false,
        error: message,
      };
    }
  }

  /**
   * Dispatches media or document attachment (e.g. PDF curriculum or student milestone report).
   */
  public async sendMedia(
    phone: string,
    mediaUrl: string,
    filename: string,
    caption?: string
  ): Promise<OpenWASendResult> {
    const chatId = this.formatChatId(phone);

    if (!this.isConfigured()) {
      console.info(`[OpenWA] [SIMULATION] Document dispatched (${filename}) to ${chatId}`);
      return {
        messageId: `sim_media_${Date.now()}`,
        status: "SENT",
        recipientJid: chatId,
        isSimulation: true,
      };
    }

    const targetSessionId = await this.getActiveSessionId();
    const url = `${this.baseUrl}/sessions/${encodeURIComponent(targetSessionId)}/messages/send-media`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify({
          chatId,
          mediaUrl,
          filename,
          caption: caption || filename,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`OpenWA HTTP ${res.status}: ${errText}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await res.json().catch(() => ({}));
      return {
        messageId: data?.id || `wa_media_${Date.now()}`,
        status: "SENT",
        recipientJid: chatId,
        isSimulation: false,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        messageId: "",
        status: "FAILED",
        recipientJid: chatId,
        isSimulation: false,
        error: message,
      };
    }
  }

  /**
   * Retrieves active WhatsApp session health and connection status.
   */
  public async getSessionStatus(): Promise<OpenWASessionStatus> {
    if (!this.isConfigured()) {
      return {
        sessionId: this.sessionId,
        status: "SIMULATION",
        isSimulation: true,
      };
    }

    const targetSessionId = await this.getActiveSessionId();
    const url = `${this.baseUrl}/sessions/${encodeURIComponent(targetSessionId)}`;
    try {
      const res = await fetch(url, {
        headers: { "X-API-Key": this.apiKey },
      });
      if (!res.ok) {
        return { sessionId: this.sessionId, status: "DISCONNECTED", isSimulation: false };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await res.json();
      return {
        sessionId: this.sessionId,
        status: data?.status || "CONNECTED",
        phone: data?.phone,
        isSimulation: false,
      };
    } catch {
      return { sessionId: this.sessionId, status: "DISCONNECTED", isSimulation: false };
    }
  }
}

export const openwaClient = new OpenWAClient();

