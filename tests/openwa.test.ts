import { describe, it, expect } from "vitest";
import { OpenWAClient } from "../backend/notifications/openwa";

describe("OpenWA WhatsApp Gateway Client", () => {
  it("formats Indian phone numbers into valid WhatsApp JIDs", () => {
    const client = new OpenWAClient();
    expect(client.formatChatId("9820143210")).toBe("919820143210@c.us");
    expect(client.formatChatId("+91 98201 43210")).toBe("919820143210@c.us");
    expect(client.formatChatId("919820143210")).toBe("919820143210@c.us");
    expect(client.formatChatId("98765-43210")).toBe("919876543210@c.us");
  });

  it("operates in simulation mode when no live API key is configured", async () => {
    const client = new OpenWAClient();
    expect(client.isConfigured()).toBe(false);

    const result = await client.sendText("9820143210", "Hello parent! ThinkOva orientation starts this Saturday.");
    expect(result.status).toBe("SENT");
    expect(result.isSimulation).toBe(true);
    expect(result.recipientJid).toBe("919820143210@c.us");
    expect(result.messageId).toContain("sim_wa_");
  });

  it("reports simulation status when queried without API credentials", async () => {
    const client = new OpenWAClient();
    const status = await client.getSessionStatus();
    expect(status.status).toBe("SIMULATION");
    expect(status.isSimulation).toBe(true);
    expect(status.sessionId).toBeDefined();
  });
});

