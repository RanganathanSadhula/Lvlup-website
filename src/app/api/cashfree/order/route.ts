import { NextResponse } from "next/server";
import { cashfreeClient } from "../../../../../backend/payments/cashfree";
import { dbManager } from "../../../../../backend/database/client";
import { defaultDispatcher } from "../../../../../backend/notifications/dispatcher";
import { emailTemplates } from "../../../../../backend/templates/email-templates";
import { whatsappTemplates } from "../../../../../backend/templates/whatsapp-templates";

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
  autoConfirm?: boolean;
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

  // 2.5 Ensure School and Batch exist dynamically
  const school = await dbManager.schools.findByUid(schoolUid);
  if (!school) {
    await dbManager.schools.upsertSchool({
      id: `sch_${schoolUid.toLowerCase()}`,
      schoolUid: schoolUid.toUpperCase().trim(),
      officialName: `Partner School (${schoolUid.toUpperCase().trim()})`,
      slug: `school-${schoolUid.toLowerCase().trim()}`,
      city: process.env.NEXT_PUBLIC_CONTACT_CITY || "Pune",
      state: "Maharashtra",
      board: "CBSE",
      labCapacity: 25,
      partnerCommissionPct: 0,
      status: "ACTIVE",
      createdAt: new Date(),
    });
  }

  const batchId = `batch_${schoolUid.toLowerCase()}_01`;
  const existingBatch = await dbManager.schools.getBatch(batchId);
  if (!existingBatch) {
    await dbManager.schools.upsertBatch({
      id: batchId,
      schoolId: `sch_${schoolUid.toLowerCase()}`,
      tutorId: "tutor_lead_01",
      batchCode: `BATCH-${schoolUid.toUpperCase().trim()}-01`,
      gradeLevels: [grade],
      dayOfWeek: "Saturday",
      startTime: "10:00",
      endTime: "11:30",
      maxCapacity: 25,
      confirmedStudentsCount: 1,
      startDate: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      level5Date: new Date(Date.now() + 35 * 24 * 3600 * 1000),
      demoDayDate: new Date(Date.now() + 56 * 24 * 3600 * 1000),
      status: "UPCOMING",
      createdAt: new Date(),
    });
  }

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

  // 4. Create Cashfree Gateway Order
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
      orderNote: `ThinkOva Course Admission - ${schoolUid.toUpperCase()} (${studentName})`,
    });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const checkoutUrl =
      cfOrder.paymentSessionId && cfOrder.environment === "SANDBOX"
        ? `https://sandbox.cashfree.com/pg/orders/${cfOrder.orderId}`
        : `${origin}/enrolled?orderRef=${cfOrder.orderId}&childName=${encodeURIComponent(
            studentName
          )}&parentEmail=${encodeURIComponent(parentEmail)}&school=${encodeURIComponent(
            schoolUid
          )}&plan=${paymentPlan === "INSTALLMENTS" ? "parts" : "full"}`;

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

    // When autoConfirm is requested (e.g. from the website enrolment form in demo mode),
    // auto-complete virtual payment and immediately dispatch confirmation email (SMTP) & WhatsApp (OpenWA)!
    if (body.autoConfirm === true) {
      await dbManager.commerce.updateOrderStatus(cfOrder.orderId, "PAID");
      await dbManager.commerce.updateEnrollmentStatus(enrollmentId, "ENROLLED");

      await dbManager.commerce.upsertPayment({
        id: `pay_${Date.now()}_sim`,
        orderId: cfOrder.orderId,
        gateway: "CASHFREE",
        gatewayOrderId: cfOrder.orderId,
        gatewayPaymentId: `cf_pay_sim_${Date.now()}`,
        paymentMethod: "UPI",
        amountInPaise,
        status: "SUCCESS",
        paidAt: new Date(),
      });

      const email = emailTemplates.enrolmentSuccess({
        parentName: user?.username || parentName || "Parent",
        studentName: student.fullName,
        currentGrade: student.currentGrade,
        schoolName: student.schoolUid,
        batchSchedule: "Weekly Computer Lab Sessions",
        tutorName: "Lead AI Mentor",
        amountPaid: `₹${amount.toLocaleString("en-IN")}`,
        orderId: cfOrder.orderId,
      });

      await defaultDispatcher.sendEmail({
        to: parentEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
        metadata: { orderId: cfOrder.orderId, type: "ENROLMENT_RECEIPT" },
      });

      const wa = whatsappTemplates.enrolmentConfirmed({
        parentPhone,
        parentName: user?.username || parentName || "Parent",
        studentName: student.fullName,
        schoolName: student.schoolUid,
        grade: student.currentGrade,
        orderId: cfOrder.orderId,
        amountPaid: `₹${amount.toLocaleString("en-IN")}`,
        startDate: "the upcoming Saturday batch",
      });

      await defaultDispatcher.sendWhatsApp({
        to: parentPhone,
        templateName: "thinkova_enrolment_confirmed",
        fallbackText: wa.fallbackText,
        metadata: { orderId: cfOrder.orderId, type: "ENROLMENT_RECEIPT" },
      });
    }

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
