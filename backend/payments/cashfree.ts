import crypto from "crypto";

export interface CashfreeCustomerDetails {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface CashfreeCreateOrderInput {
  orderId: string;
  orderAmount: number; // in INR (e.g. 4999.00 or 2499.00)
  orderCurrency?: string; // defaults to INR
  customer: CashfreeCustomerDetails;
  orderNote?: string;
  returnUrl?: string;
  notifyUrl?: string;
}

export interface CashfreeOrderResult {
  orderId: string;
  cfOrderId: string;
  paymentSessionId: string;
  orderStatus: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED";
  orderAmount: number;
  orderCurrency: string;
  environment: "SANDBOX" | "PRODUCTION" | "SIMULATION";
  isSimulation: boolean;
  checkoutUrl?: string;
}

export interface CashfreeGetOrderResult {
  orderId: string;
  cfOrderId: string;
  orderStatus: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED";
  orderAmount: number;
  orderCurrency: string;
  isSimulation: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw?: any;
}

export class CashfreeClient {
  private simulatedOrders: Map<string, CashfreeOrderResult> = new Map();

  /**
   * Checks whether live credentials have been added to environment
   */
  public isConfigured(): boolean {
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    return Boolean(appId && secretKey && appId.trim().length > 0 && secretKey.trim().length > 0);
  }

  /**
   * Resolves target Cashfree API base endpoint
   */
  public getBaseUrl(): string {
    const env = (process.env.CASHFREE_ENV || "SANDBOX").toUpperCase();
    if (env === "PRODUCTION" || env === "PROD") {
      return "https://api.cashfree.com/pg";
    }
    return "https://sandbox.cashfree.com/pg";
  }

  public getApiVersion(): string {
    return process.env.CASHFREE_API_VERSION || "2023-08-01";
  }

  /**
   * Sanitized summary for diagnostics and monitoring
   */
  public getConfigSummary() {
    const configured = this.isConfigured();
    const env = (process.env.CASHFREE_ENV || "SANDBOX").toUpperCase();
    const appId = process.env.CASHFREE_APP_ID;
    const maskedAppId = appId ? `${appId.slice(0, 4)}...${appId.slice(-4)}` : undefined;

    return {
      configured,
      mode: configured ? env : "SIMULATION",
      environment: env,
      apiVersion: this.getApiVersion(),
      appIdMasked: maskedAppId,
      baseUrl: this.getBaseUrl(),
      instructions: configured
        ? "Cashfree live credentials active."
        : "Operating in dynamic simulation mode. Add CASHFREE_APP_ID and CASHFREE_SECRET_KEY to .env.local to activate live gateway.",
    };
  }

  /**
   * Creates an order with Cashfree.
   * Seamlessly switches between live Cashfree PG API and simulation mode.
   */
  public async createOrder(input: CashfreeCreateOrderInput): Promise<CashfreeOrderResult> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const isProd = (process.env.CASHFREE_ENV || "").toUpperCase() === "PRODUCTION";

    const returnUrl =
      input.returnUrl ||
      (isProd && !siteUrl.startsWith("https://") ? "https://thinkova.ai/enrolled?order_id={order_id}" : `${siteUrl}/enrolled?order_id={order_id}`);
    const notifyUrl = input.notifyUrl || (siteUrl.startsWith("https://") ? `${siteUrl}/api/cashfree/webhook` : (isProd ? "https://thinkova.ai/api/cashfree/webhook" : undefined));

    if (!this.isConfigured()) {
      // Dynamic Simulation Mode (for testing before credentials arrive)
      const simulatedResult: CashfreeOrderResult = {
        orderId: input.orderId,
        cfOrderId: `cf_sim_${Date.now()}`,
        paymentSessionId: `session_sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        orderStatus: "ACTIVE",
        orderAmount: input.orderAmount,
        orderCurrency: input.orderCurrency || "INR",
        environment: "SIMULATION",
        isSimulation: true,
        checkoutUrl: `${siteUrl}/enrol/checkout?orderId=${encodeURIComponent(input.orderId)}&simulated=true`,
      };

      this.simulatedOrders.set(input.orderId, simulatedResult);
      console.info(
        `[Cashfree] Created simulated order '${input.orderId}' for ₹${input.orderAmount}. (Add credentials to switch to live PG)`
      );
      return simulatedResult;
    }

    // Live Cashfree PG Orders API v2023-08-01
    const url = `${this.getBaseUrl()}/orders`;
    const payload = {
      order_id: input.orderId,
      order_amount: input.orderAmount,
      order_currency: input.orderCurrency || "INR",
      customer_details: {
        customer_id: input.customer.customerId,
        customer_name: input.customer.customerName,
        customer_email: input.customer.customerEmail,
        customer_phone: input.customer.customerPhone.replace(/^\+91/, "").replace(/\D/g, ""),
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: notifyUrl,
        payment_methods: "upi,cc,dc,nb",
      },
      order_note: input.orderNote || "ThinkOva AI Program Admission",
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-version": this.getApiVersion(),
        "x-client-id": process.env.CASHFREE_APP_ID || "",
        "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Cashfree] Failed to create order (${res.status}): ${errText}`);
      throw new Error(`Cashfree Order Creation Failed (${res.status}): ${errText}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;


    return {
      orderId: data.order_id,
      cfOrderId: String(data.cf_order_id),
      paymentSessionId: data.payment_session_id,
      orderStatus: data.order_status || "ACTIVE",
      orderAmount: data.order_amount,
      orderCurrency: data.order_currency || "INR",
      environment: isProd ? "PRODUCTION" : "SANDBOX",
      isSimulation: false,
    };
  }

  /**
   * Retrieves order status from Cashfree or simulation store
   */
  public async getOrder(orderId: string): Promise<CashfreeGetOrderResult> {
    if (!this.isConfigured()) {
      const sim = this.simulatedOrders.get(orderId);
      if (!sim) {
        return {
          orderId,
          cfOrderId: `cf_sim_${orderId}`,
          orderStatus: "ACTIVE",
          orderAmount: 4999,
          orderCurrency: "INR",
          isSimulation: true,
        };
      }
      return {
        orderId: sim.orderId,
        cfOrderId: sim.cfOrderId,
        orderStatus: sim.orderStatus,
        orderAmount: sim.orderAmount,
        orderCurrency: sim.orderCurrency,
        isSimulation: true,
      };
    }

    const url = `${this.getBaseUrl()}/orders/${encodeURIComponent(orderId)}`;
    const res = await fetch(url, {
      headers: {
        "x-api-version": this.getApiVersion(),
        "x-client-id": process.env.CASHFREE_APP_ID || "",
        "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cashfree Get Order Failed (${res.status}): ${errText}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;
    return {
      orderId: data.order_id,
      cfOrderId: String(data.cf_order_id),
      orderStatus: data.order_status,
      orderAmount: data.order_amount,
      orderCurrency: data.order_currency,
      isSimulation: false,
      raw: data,
    };
  }

  /**
   * Verifies Cashfree webhook signature using HMAC-SHA256
   */
  public verifyWebhookSignature(signature: string, rawBody: string, timestamp: string): boolean {
    const secret = process.env.CASHFREE_SECRET_KEY;
    if (!secret) {
      // In simulation mode, accept simulated webhook pings
      return true;
    }

    try {
      const signatureData = `${timestamp}${rawBody}`;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(signatureData)
        .digest("base64");

      const expectedBuf = Buffer.from(expectedSignature, "base64");
      const actualBuf = Buffer.from(signature, "base64");

      if (expectedBuf.length !== actualBuf.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuf, actualBuf);
    } catch (err) {
      console.error("[Cashfree] Signature verification exception:", err);
      return false;
    }
  }

  /**
   * Helper to mark a simulated order as paid (for testing complete flow without real money)
   */
  public markSimulatedOrderPaid(orderId: string): boolean {
    const order = this.simulatedOrders.get(orderId);
    if (order) {
      order.orderStatus = "PAID";
      return true;
    }
    return false;
  }
}

export const cashfreeClient = new CashfreeClient();

