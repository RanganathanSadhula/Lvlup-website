import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CashfreeClient } from "../backend/payments/cashfree";
import { dbManager } from "../backend/database/client";
import { defaultDispatcher } from "../backend/notifications/dispatcher";
import { seedDynamicTestData } from "./fixtures";
import crypto from "crypto";

describe("Cashfree Payment Gateway Integration", () => {
  const originalEnv = { ...process.env };

  beforeEach(async () => {
    process.env = { ...originalEnv };
    delete process.env.CASHFREE_APP_ID;
    delete process.env.CASHFREE_SECRET_KEY;
    await seedDynamicTestData();
    defaultDispatcher.clearOutbox();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("1. Starts in Dynamic Simulation mode when credentials are not yet defined", () => {
    const client = new CashfreeClient();
    expect(client.isConfigured()).toBe(false);

    const summary = client.getConfigSummary();
    expect(summary.configured).toBe(false);
    expect(summary.mode).toBe("SIMULATION");
    expect(summary.instructions).toContain("dynamic simulation mode");
  });

  it("2. Creates a simulated Cashfree order with valid paymentSessionId", async () => {
    const client = new CashfreeClient();
    const order = await client.createOrder({
      orderId: "ord_cf_test_1",
      orderAmount: 4999,
      customer: {
        customerId: "usr_parent_01",
        customerName: "Sandeep Verma",
        customerEmail: "sandeep@example.com",
        customerPhone: "+919876543210",
      },
    });

    expect(order.orderId).toBe("ord_cf_test_1");
    expect(order.orderAmount).toBe(4999);
    expect(order.orderStatus).toBe("ACTIVE");
    expect(order.isSimulation).toBe(true);
    expect(order.paymentSessionId).toContain("session_sim_");
    expect(order.cfOrderId).toContain("cf_sim_");

    // Order status lookup
    const status = await client.getOrder("ord_cf_test_1");
    expect(status.orderStatus).toBe("ACTIVE");
    expect(status.orderAmount).toBe(4999);
  });

  it("3. Automatically switches to Live Cashfree API when credentials are provided", async () => {
    process.env.CASHFREE_APP_ID = "CF_APP_TEST_123456";
    process.env.CASHFREE_SECRET_KEY = "cf_sec_key_abcdef123456";
    process.env.CASHFREE_ENV = "SANDBOX";

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        order_id: "ord_live_99",
        cf_order_id: 887766,
        order_status: "ACTIVE",
        order_amount: 4999.0,
        order_currency: "INR",
        payment_session_id: "session_live_real_xyz",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const client = new CashfreeClient();
    expect(client.isConfigured()).toBe(true);

    const summary = client.getConfigSummary();
    expect(summary.configured).toBe(true);
    expect(summary.mode).toBe("SANDBOX");
    expect(summary.baseUrl).toBe("https://sandbox.cashfree.com/pg");

    const order = await client.createOrder({
      orderId: "ord_live_99",
      orderAmount: 4999,
      customer: {
        customerId: "usr_parent_01",
        customerName: "Sandeep Verma",
        customerEmail: "sandeep@example.com",
        customerPhone: "+919876543210",
      },
    });

    expect(order.isSimulation).toBe(false);
    expect(order.orderId).toBe("ord_live_99");
    expect(order.cfOrderId).toBe("887766");
    expect(order.paymentSessionId).toBe("session_live_real_xyz");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://sandbox.cashfree.com/pg/orders",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-client-id": "CF_APP_TEST_123456",
          "x-client-secret": "cf_sec_key_abcdef123456",
        }),
      })
    );
  });

  it("4. Verifies HMAC-SHA256 signature accurately and rejects tampered data", () => {
    const secret = "test_cashfree_secret_key";
    process.env.CASHFREE_SECRET_KEY = secret;
    const client = new CashfreeClient();

    const timestamp = "1730700000";
    const rawBody = JSON.stringify({ type: "PAYMENT_SUCCESS_WEBHOOK", data: { order_id: "ord_101" } });

    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}${rawBody}`)
      .digest("base64");

    expect(client.verifyWebhookSignature(validSignature, rawBody, timestamp)).toBe(true);

    // Tampered payload
    const tamperedBody = JSON.stringify({ type: "PAYMENT_SUCCESS_WEBHOOK", data: { order_id: "ord_HACKED" } });
    expect(client.verifyWebhookSignature(validSignature, tamperedBody, timestamp)).toBe(false);
  });

  it("5. Updates order, payment, and enrollment status in dynamic DB", async () => {
    // 1. Create order
    const orderId = "ord_flow_test_1";
    await dbManager.commerce.upsertOrder({
      id: orderId,
      enrollmentId: "enr_01",
      userId: "usr_parent_01",
      orderType: "FULL_PAYMENT",
      amountInPaise: 499900,
      status: "AWAITING_PAYMENT",
      checkoutUrl: `https://thinkova.ai/checkout?orderId=${orderId}`,
      expiresAt: new Date(Date.now() + 3600000),
      createdAt: new Date(),
    });

    // 2. Simulate payment success update
    await dbManager.commerce.updateOrderStatus(orderId, "PAID");
    await dbManager.commerce.updateEnrollmentStatus("enr_01", "ENROLLED");
    await dbManager.commerce.upsertPayment({
      id: "pay_test_01",
      orderId,
      gateway: "CASHFREE",
      gatewayOrderId: "cf_order_99",
      gatewayPaymentId: "cf_pay_888",
      paymentMethod: "UPI",
      amountInPaise: 499900,
      status: "SUCCESS",
      paidAt: new Date(),
    });

    // Verify DB state
    const order = await dbManager.commerce.getOrderById(orderId);
    expect(order?.status).toBe("PAID");

    const enrollment = await dbManager.commerce.getEnrollmentById("enr_01");
    expect(enrollment?.status).toBe("ENROLLED");
  });
});

