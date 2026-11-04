import { NextResponse } from "next/server";
import { cashfreeClient } from "../../../../../backend/payments/cashfree";
import { dbManager } from "../../../../../backend/database/client";

export const runtime = "nodejs";

interface CreateCashfreeOrderBody {
  orderId?: string;
  studentName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  schoolUid: string;
  grade?: number;
  paymentPlan?: "FULL" | "INSTALLMENTS";
  orderType?: "FULL_PAYMENT" | "INSTALLMENT_1" | "INSTALLMENT_2";
  amountInRupees?: number;
}

/**
 * POST /api/cashfree/order
 * Initiates an order with Cashfree (or dynamic simulator) and persists order state.
 */
export async function POST(request: Request) {
  let body: CreateCashfreeOrderBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    studentName,
    parentName,
    parentEmail,
    parentPhone,
    schoolUid,
    grade = 6,
    paymentPlan = "FULL",
    orderType = paymentPlan === "INSTALLMENTS" ? "INSTALLMENT_1" : "FULL_PAYMENT",
  } = body;

  if (!parentEmail || !parentPhone || !studentName || !schoolUid) {
    return NextResponse.json(
      { error: "Missing required fields: studentName, parentName, parentEmail, parentPhone, schoolUid" },
      { status: 422 }
    );
  }

  // Determine amount in rupees (FULL: ₹4,999, INSTALLMENT: ₹2,499)
  const defaultAmount = orderType === "FULL_PAYMENT" ? 4999 : 2499;
  const amount = body.amountInRupees || defaultAmount;
  const amountInPaise = Math.round(amount * 100);

  const orderId = body.orderId || `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const userId = `usr_${parentPhone.replace(/\D/g, "")}`;
  const studentId = `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const enrollmentId = `enr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  // 1. Ensure User entity exists in dynamic repository
  let user = await dbManager.commerce.getUserById(userId);
  if (!user) {
    const newUser = {
      id: userId,
      phone: parentPhone,
      email: parentEmail,
      username: parentName,
      role: "PARENT" as const,
      isPhoneVerified: false,
      isEmailVerified: false,
      consentTimestamp: new Date(),
      createdAt: new Date(),
    };
    await dbManager.commerce.upsertUser(newUser);
    user = newUser;
  }

  // 2. Ensure Student entity exists
  const student = {
    id: studentId,
    parentUserId: userId,
    fullName: studentName,
    schoolUid: schoolUid.toUpperCase().trim(),
    currentGrade: grade,
    createdAt: new Date(),
  };
  await dbManager.commerce.upsertStudent(student);

  // 3. Create Enrollment entity
  const enrollment = {
    id: enrollmentId,
    studentId,
    cohortBatchId: `batch_${schoolUid.toLowerCase()}_01`,
    schoolUid: schoolUid.toUpperCase().trim(),
    paymentPlan,
    status: "PENDING_PAYMENT" as const,
    currentLevel: 1,
    enrolledAt: new Date(),
    installment2Paid: false,
  };
  await dbManager.commerce.upsertEnrollment(enrollment);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const checkoutUrl = `${siteUrl}/enrol/checkout?orderId=${encodeURIComponent(orderId)}`;

  // 4. Create Order with Cashfree (or Dynamic Simulation mode)
  try {
    const cfOrder = await cashfreeClient.createOrder({
      orderId,
      orderAmount: amount,
      orderCurrency: "INR",
      customer: {
        customerId: userId,
        customerName: parentName,
        customerEmail: parentEmail,
        customerPhone: parentPhone,
      },
      orderNote: `LvlUp Course Admission - ${schoolUid.toUpperCase()} (${studentName})`,
    });

    // 5. Persist Order in dynamic repository
    await dbManager.commerce.upsertOrder({
      id: orderId,
      enrollmentId,
      userId,
      orderType,
      amountInPaise,
      status: "AWAITING_PAYMENT",
      checkoutUrl,
      expiresAt: new Date(Date.now() + 2 * 3600 * 1000), // 2 hour hold
      createdAt: new Date(),
    });

    return NextResponse.json({
      status: "success",
      orderId: cfOrder.orderId,
      cfOrderId: cfOrder.cfOrderId,
      paymentSessionId: cfOrder.paymentSessionId,
      orderStatus: cfOrder.orderStatus,
      amount: cfOrder.orderAmount,
      currency: cfOrder.orderCurrency,
      environment: cfOrder.environment,
      isSimulation: cfOrder.isSimulation,
      checkoutUrl,
      enrollmentId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}

/**
 * GET /api/cashfree/order?orderId=...
 * Checks order status from Cashfree and dynamic DB
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing required 'orderId' query parameter" }, { status: 422 });
  }

  const dbOrder = await dbManager.commerce.getOrderById(orderId);
  const cfOrder = await cashfreeClient.getOrder(orderId);

  return NextResponse.json({
    status: "ok",
    orderId,
    dbStatus: dbOrder?.status || "NOT_FOUND",
    cashfreeStatus: cfOrder.orderStatus,
    amount: cfOrder.orderAmount,
    currency: cfOrder.orderCurrency,
    isSimulation: cfOrder.isSimulation,
  });
}
