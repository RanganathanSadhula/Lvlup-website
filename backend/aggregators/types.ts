import type {
  AbandonedCartData,
  EnrolmentSuccessData,
  InstallmentReminderData,
  PaymentFailureData,
  RefundNotificationData,
} from "../templates/email-templates";
import type { WhatsAppWeeklyAssessmentPayload } from "../templates/whatsapp-templates";
import type { PreAggregatorResult } from "../cron/types";

export interface AbandonedCartRecord extends AbandonedCartData {
  orderId: string;
  parentEmail: string;
  parentPhone: string;
  createdAt: Date;
}

export interface InstallmentDueRecord extends InstallmentReminderData {
  enrollmentId: string;
  parentEmail: string;
  parentPhone: string;
  batchId: string;
}

export interface EnrolmentSuccessRecord extends EnrolmentSuccessData {
  parentEmail: string;
  parentPhone: string;
  schoolUid: string;
}

export interface PaymentFailureRecord extends PaymentFailureData {
  orderId: string;
  parentEmail: string;
  parentPhone: string;
}

export interface RefundRecord extends RefundNotificationData {
  refundId: string;
  parentEmail: string;
  parentPhone: string;
}

export interface WeeklyAssessmentRecord extends WhatsAppWeeklyAssessmentPayload {
  assessmentId: string;
  studentId: string;
  batchId: string;
  schoolUid: string;
  schoolName: string;
  parentEmail: string;
  tutorName?: string;
}

export interface PreAggregatorCollection {
  abandonedCarts: (thresholdMinutes?: number) => Promise<PreAggregatorResult<AbandonedCartRecord>>;
  installmentDues: (daysAhead?: number) => Promise<PreAggregatorResult<InstallmentDueRecord>>;
  enrolmentSuccess: () => Promise<PreAggregatorResult<EnrolmentSuccessRecord>>;
  paymentFailures: () => Promise<PreAggregatorResult<PaymentFailureRecord>>;
  pendingRefunds: () => Promise<PreAggregatorResult<RefundRecord>>;
  weeklyAssessments: (batchId?: string, levelNumber?: number) => Promise<PreAggregatorResult<WeeklyAssessmentRecord>>;
}

