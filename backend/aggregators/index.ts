import type { PreAggregatorResult } from "../cron/types";
import type {
  AbandonedCartRecord,
  EnrolmentSuccessRecord,
  InstallmentDueRecord,
  PaymentFailureRecord,
  PreAggregatorCollection,
  RefundRecord,
  WeeklyAssessmentRecord,
} from "./types";
import { dbManager } from "../database/client";

function formatPaiseToRupees(amountInPaise: number): string {
  const rupees = Math.round(amountInPaise / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thinkova.ai";

export const preAggregators: PreAggregatorCollection = {
  /**
   * Pre-aggregates abandoned carts (> thresholdMinutes old without payment and no alert sent)
   */
  abandonedCarts: async (thresholdMinutes: number = 60): Promise<PreAggregatorResult<AbandonedCartRecord>> => {
    const rawOrders = await dbManager.commerce.getOrdersAwaitingPayment(thresholdMinutes);
    const records: AbandonedCartRecord[] = [];

    for (const item of rawOrders) {
      const school = await dbManager.schools.findByUid(item.student.schoolUid);
      const batch = await dbManager.schools.getBatch(item.enrollment.cohortBatchId);

      const maxCap = batch?.maxCapacity ?? 25;
      const confirmed = batch?.confirmedStudentsCount ?? 0;
      const seatsRemaining = Math.max(0, maxCap - confirmed);

      records.push({
        orderId: item.order.id,
        parentName: item.user.username || item.user.email,
        parentEmail: item.user.email,
        parentPhone: item.user.phone,
        studentName: item.student.fullName,
        schoolName: school?.officialName || item.student.schoolUid,
        seatsRemaining,
        checkoutUrl: item.order.checkoutUrl || `${siteUrl}/enrol/checkout?orderId=${item.order.id}`,
        holdExpiresAt: item.order.expiresAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: item.order.createdAt,
      });
    }

    return {
      data: records,
      count: records.length,
      metadata: { thresholdMinutes, queryExecutedAt: new Date().toISOString() },
    };
  },

  /**
   * Pre-aggregates students due for Installment 2 within daysAhead of Level 5
   */
  installmentDues: async (daysAhead: number = 3): Promise<PreAggregatorResult<InstallmentDueRecord>> => {
    const rawInstallments = await dbManager.commerce.getInstallmentsDue(daysAhead);
    const records: InstallmentDueRecord[] = [];

    for (const item of rawInstallments) {
      const school = await dbManager.schools.findByUid(item.student.schoolUid);
      const batch = await dbManager.schools.getBatch(item.batchId);

      const dueDate = batch?.level5Date
        ? batch.level5Date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Upcoming Level 5";

      records.push({
        enrollmentId: item.enrollment.id,
        batchId: item.batchId,
        parentName: item.user.username || item.user.email,
        parentEmail: item.user.email,
        parentPhone: item.user.phone,
        studentName: item.student.fullName,
        schoolName: school?.officialName || item.student.schoolUid,
        installmentAmount: "₹2,499",
        dueDate,
        levelStartName: "Think like an agent designer",
        paymentUrl: `${siteUrl}/parent/payments?enrollmentId=${item.enrollment.id}`,
      });
    }

    return {
      data: records,
      count: records.length,
      metadata: { daysAhead, queryExecutedAt: new Date().toISOString() },
    };
  },

  /**
   * Pre-aggregates newly confirmed enrolments ready for school roster sync & welcome email
   */
  enrolmentSuccess: async (): Promise<PreAggregatorResult<EnrolmentSuccessRecord>> => {
    const rawPaid = await dbManager.commerce.getNewlyPaidOrders();
    const records: EnrolmentSuccessRecord[] = [];

    for (const item of rawPaid) {
      const school = await dbManager.schools.findByUid(item.student.schoolUid);
      const batch = await dbManager.schools.getBatch(item.enrollment.cohortBatchId);
      const tutor = batch?.tutorId ? await dbManager.schools.getTutor(batch.tutorId) : null;

      const batchSchedule = batch
        ? `${batch.dayOfWeek}s ${batch.startTime} – ${batch.endTime}`
        : "School Computer Lab Session";

      records.push({
        parentName: item.user.username || item.user.email,
        parentEmail: item.user.email,
        parentPhone: item.user.phone,
        studentName: item.student.fullName,
        currentGrade: item.student.currentGrade,
        schoolName: school?.officialName || item.student.schoolUid,
        schoolUid: item.student.schoolUid,
        batchSchedule,
        tutorName: tutor?.fullName || "Assigned LvlUp Tutor",
        amountPaid: formatPaiseToRupees(item.order.amountInPaise),
        orderId: item.order.id,
      });
    }

    return {
      data: records,
      count: records.length,
      metadata: { queryExecutedAt: new Date().toISOString() },
    };
  },

  /**
   * Pre-aggregates payment failure records requiring immediate notification
   */
  paymentFailures: async (): Promise<PreAggregatorResult<PaymentFailureRecord>> => {
    const rawFailed = await dbManager.commerce.getFailedOrders();
    const records: PaymentFailureRecord[] = [];

    for (const item of rawFailed) {
      records.push({
        orderId: item.order.id,
        parentName: item.user.username || item.user.email,
        parentEmail: item.user.email,
        parentPhone: item.user.phone,
        studentName: item.student.fullName,
        amount: formatPaiseToRupees(item.order.amountInPaise),
        failureReason: item.order.failureReason || "Transaction declined or gateway timeout",
        retryUrl: item.order.checkoutUrl || `${siteUrl}/enrol/checkout?orderId=${item.order.id}`,
      });
    }

    return {
      data: records,
      count: records.length,
      metadata: { queryExecutedAt: new Date().toISOString() },
    };
  },

  /**
   * Pre-aggregates pending refunds requiring client notification & bank tracking
   */
  pendingRefunds: async (): Promise<PreAggregatorResult<RefundRecord>> => {
    const rawRefunds = await dbManager.commerce.getPendingRefunds();
    const records: RefundRecord[] = [];

    for (const item of rawRefunds) {
      records.push({
        refundId: item.refund.id,
        parentName: item.user.username || item.user.email,
        parentEmail: item.user.email,
        parentPhone: item.user.phone,
        studentName: item.student.fullName,
        refundAmount: formatPaiseToRupees(item.refund.amountInPaise),
        refundReference: item.refund.gatewayRefundId || item.refund.id,
        reason: item.refund.reason,
        initiatedBy: item.refund.initiatedBy,
        estimatedCreditDays: item.refund.estimatedCreditDays || "5–7 business days",
      });
    }

    return {
      data: records,
      count: records.length,
      metadata: { queryExecutedAt: new Date().toISOString() },
    };
  },

  /**
   * Pre-aggregates weekly student assessments for automated Email & WhatsApp progress dispatch
   */
  weeklyAssessments: async (
    batchId?: string,
    levelNumber?: number
  ): Promise<PreAggregatorResult<WeeklyAssessmentRecord>> => {
    const rawAssessments = await dbManager.commerce.getUnsentAssessments(batchId, levelNumber);
    const records: WeeklyAssessmentRecord[] = [];

    for (const item of rawAssessments) {
      const batch = await dbManager.schools.getBatch(item.assessment.cohortBatchId);
      const school = await dbManager.schools.findByUid(item.student.schoolUid);
      const tutor = batch ? await dbManager.schools.getTutor(batch.tutorId) : undefined;

      records.push({
        assessmentId: item.assessment.id,
        studentId: item.student.id,
        batchId: item.assessment.cohortBatchId,
        schoolUid: item.student.schoolUid,
        schoolName: school?.officialName || "Thinkova Partner School",
        parentName: item.user.username || item.user.email,
        parentPhone: item.user.phone,
        parentEmail: item.user.email,
        studentName: item.student.fullName,
        levelNumber: item.assessment.levelNumber,
        levelTitle: item.assessment.levelTitle,
        projectCreated: item.assessment.projectTitle,
        tutorName: tutor?.fullName,
        tutorFeedback: item.assessment.tutorFeedback,
        reportUrl: item.assessment.projectArtifactUrl || `${siteUrl}/parent/progress/${item.student.id}?level=${item.assessment.levelNumber}`,
      });
    }

    return {
      data: records,
      count: records.length,
      metadata: { batchId, levelNumber, queryExecutedAt: new Date().toISOString() },
    };
  },
};
