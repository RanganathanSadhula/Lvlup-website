import { beforeEach, describe, expect, it } from "vitest";
import { POST as createOrderHandler } from "../src/app/api/cashfree/order/route";
import { POST as webhookHandler } from "../src/app/api/cashfree/webhook/route";
import { dbManager } from "../backend/database/client";
import { defaultDispatcher } from "../backend/notifications/dispatcher";
import { CronEngine } from "../backend/cron/engine";
import { abandonedCartJob } from "../backend/jobs";
import { seedDynamicTestData } from "./fixtures";

describe("End-to-End Virtual Payment & Automated Email Pipeline", () => {
  beforeEach(async () => {
    await seedDynamicTestData();
    defaultDispatcher.clearOutbox();
    delete process.env.CASHFREE_APP_ID;
    delete process.env.CASHFREE_SECRET_KEY;
  });

  it("1. Creates a virtual payment order and stores user, student, and order in dynamic database", async () => {
    const orderPayload = {
      studentName: "Aarav Sharma",
      parentName: "Priya Sharma",
      parentEmail: "priya.sharma@example.com",
      parentPhone: "9820143210",
      schoolUid: "10245",
      grade: 6,
      paymentPlan: "FULL",
      amountInRupees: 4499,
    };

    const req = new Request("http://localhost:3000/api/cashfree/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const res = await createOrderHandler(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("success");
    expect(data.orderId).toBeDefined();
    expect(data.amount).toBe(4499);
    expect(data.isSimulation).toBe(true);
    expect(data.paymentSessionId).toContain("session_sim_");

    // Check DB state before payment
    const order = await dbManager.commerce.getOrderById(data.orderId);
    expect(order).toBeDefined();
    expect(order?.status).toBe("AWAITING_PAYMENT");
    expect(order?.amountInPaise).toBe(449900);

    const enrollment = await dbManager.commerce.getEnrollmentById(order!.enrollmentId);
    expect(enrollment).toBeDefined();
    expect(enrollment?.status).toBe("PENDING_PAYMENT");

    const user = await dbManager.commerce.getUserById(order!.userId);
    expect(user?.email).toBe("priya.sharma@example.com");
    expect(user?.phone).toBe("9820143210");
  });

  it("2. Completes virtual payment via webhook and automatically generates Enrolment Success email & WhatsApp", async () => {
    // A. Create the virtual order
    const orderReq = new Request("http://localhost:3000/api/cashfree/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: "Rohan Verma",
        parentName: "Suresh Verma",
        parentEmail: "suresh.verma@example.com",
        parentPhone: "9876543211",
        schoolUid: "DPS-PUN-01",
        grade: 7,
        paymentPlan: "FULL",
        amountInRupees: 4499,
      }),
    });

    const orderRes = await createOrderHandler(orderReq);
    expect(orderRes.status).toBe(200);
    const orderData = await orderRes.json();
    const orderId = orderData.orderId;

    // B. Simulate Cashfree Webhook callback: PAYMENT_SUCCESS_WEBHOOK
    const webhookPayload = {
      type: "PAYMENT_SUCCESS_WEBHOOK",
      data: {
        order: {
          order_id: orderId,
          order_amount: 4499,
          order_currency: "INR",
          cf_order_id: `cf_order_${Date.now()}`,
        },
        payment: {
          cf_payment_id: `cf_pay_${Date.now()}`,
          payment_status: "SUCCESS",
          payment_amount: 4499,
          payment_time: new Date().toISOString(),
          payment_method: { upi: { channel: "gpay", upi_id: "suresh@okhdfc" } },
        },
      },
    };

    const webhookReq = new Request("http://localhost:3000/api/cashfree/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    const webhookRes = await webhookHandler(webhookReq);
    expect(webhookRes.status).toBe(200);

    const webhookData = await webhookRes.json();
    expect(webhookData.status).toBe("success");
    expect(webhookData.event).toBe("PAYMENT_CONFIRMED");

    // C. Verify Database status after virtual payment
    const updatedOrder = await dbManager.commerce.getOrderById(orderId);
    expect(updatedOrder?.status).toBe("PAID");

    const updatedEnrollment = await dbManager.commerce.getEnrollmentById(updatedOrder!.enrollmentId);
    expect(updatedEnrollment?.status).toBe("ENROLLED");

    // D. Verify Automated Email Generation
    const emails = defaultDispatcher.getEmailOutbox("suresh.verma@example.com");
    expect(emails.length).toBe(1);

    const email = emails[0]!;
    expect(email.to).toBe("suresh.verma@example.com");
    expect(email.status).toBe("SENT");
    expect(email.subject).toContain("Enrolment Confirmed");
    expect(email.subject).toContain("Rohan Verma");

    // Verify rich contents inside the generated email
    expect(email.html).toContain("Suresh Verma");
    expect(email.html).toContain("Rohan Verma");
    expect(email.html).toContain("Grade 7");
    expect(email.html).toContain("₹4,499");
    expect(email.html).toContain(orderId);

    // E. Verify Automated WhatsApp message generation
    const whatsapps = defaultDispatcher.getWhatsAppOutbox("9876543211");
    expect(whatsapps.length).toBe(1);
    expect(whatsapps[0]!.fallbackText).toContain("Rohan Verma");
    expect(whatsapps[0]!.fallbackText).toContain("Delhi Public School, Pune");
  });

  it("3. Handles virtual payment failure webhook and automatically generates Payment Failure email alert", async () => {
    // A. Create the virtual order
    const orderReq = new Request("http://localhost:3000/api/cashfree/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: "Ananya Iyer",
        parentName: "Karthik Iyer",
        parentEmail: "karthik.iyer@example.com",
        parentPhone: "9820011223",
        schoolUid: "10245",
        grade: 5,
        paymentPlan: "FULL",
        amountInRupees: 4499,
      }),
    });

    const orderRes = await createOrderHandler(orderReq);
    expect(orderRes.status).toBe(200);
    const orderData = await orderRes.json();
    const orderId = orderData.orderId;

    // B. Simulate Cashfree Webhook callback: PAYMENT_FAILED_WEBHOOK
    const failPayload = {
      type: "PAYMENT_FAILED_WEBHOOK",
      data: {
        order: {
          order_id: orderId,
          order_amount: 4499,
        },
        payment: {
          cf_payment_id: `cf_fail_${Date.now()}`,
          payment_status: "FAILED",
          payment_message: "Bank server declined transaction: Insufficient funds or UPI limit exceeded",
        },
      },
    };

    const webhookReq = new Request("http://localhost:3000/api/cashfree/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(failPayload),
    });

    const webhookRes = await webhookHandler(webhookReq);
    expect(webhookRes.status).toBe(200);

    const failData = await webhookRes.json();
    expect(failData.event).toBe("PAYMENT_FAILED");

    // Verify DB updated to FAILED
    const order = await dbManager.commerce.getOrderById(orderId);
    expect(order?.status).toBe("FAILED");
    expect(order?.failureReason).toContain("declined");

    // Verify Automated Payment Failure email alert generated
    const emails = defaultDispatcher.getEmailOutbox("karthik.iyer@example.com");
    expect(emails.length).toBe(1);

    const email = emails[0]!;
    expect(email.subject).toContain("Action Required");
    expect(email.subject).toContain("unsuccessful");
    expect(email.html).toContain("Karthik Iyer");
    expect(email.html).toContain("Ananya Iyer");
    expect(email.html).toContain("Insufficient funds or UPI limit exceeded");
    expect(email.html).toContain(order!.checkoutUrl);
  });

  it("4. Automatically generates Abandoned Cart Recovery email when order is awaiting payment for > 1 hour", async () => {
    // Create an order awaiting payment created 90 minutes ago
    const abandonedOrderId = "ord_abandoned_virtual_90m";
    const userId = "usr_parent_abandoned";
    const studentId = "stu_abandoned";
    const enrollmentId = "enr_abandoned";

    await dbManager.commerce.upsertUser({
      id: userId,
      phone: "+919988776655",
      email: "abandoned.parent@example.com",
      username: "Meera Patel",
      role: "PARENT",
      isPhoneVerified: true,
      isEmailVerified: true,
      consentTimestamp: new Date(),
      createdAt: new Date(),
    });

    await dbManager.commerce.upsertStudent({
      id: studentId,
      parentUserId: userId,
      fullName: "Kabir Patel",
      schoolUid: "DPS-PUN-01",
      currentGrade: 6,
      createdAt: new Date(),
    });

    await dbManager.commerce.upsertEnrollment({
      id: enrollmentId,
      studentId,
      cohortBatchId: "batch_dps_01",
      schoolUid: "DPS-PUN-01",
      paymentPlan: "FULL",
      status: "PENDING_PAYMENT",
      currentLevel: 1,
      enrolledAt: new Date(Date.now() - 90 * 60 * 1000),
      installment2Paid: false,
    });

    await dbManager.commerce.upsertOrder({
      id: abandonedOrderId,
      enrollmentId,
      userId,
      orderType: "FULL_PAYMENT",
      amountInPaise: 449900,
      status: "AWAITING_PAYMENT",
      checkoutUrl: `https://thinkova.ai/enrol/checkout?orderId=${abandonedOrderId}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      createdAt: new Date(Date.now() - 90 * 60 * 1000), // 90 mins ago (> 1 hour)
    });

    // Run the Cron recovery job
    const engine = new CronEngine();
    engine.registerJob(abandonedCartJob);
    await engine.runJobNow("job.abandoned_cart_recovery");

    // Verify recovery email generated
    const emails = defaultDispatcher.getEmailOutbox("abandoned.parent@example.com");
    expect(emails.length).toBe(1);

    const email = emails[0]!;
    expect(email.subject).toContain("Complete Kabir Patel's ThinkOva registration");
    expect(email.html).toContain("Meera Patel");
    expect(email.html).toContain("Kabir Patel");
    expect(email.html).toContain("Delhi Public School, Pune");
    expect(email.html).toContain(abandonedOrderId);
    expect(email.html).toContain("Resume & Complete Enrolment");
  });
});
