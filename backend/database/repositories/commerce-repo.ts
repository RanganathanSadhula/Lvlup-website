import type {
  UserEntity,
  StudentEntity,
  EnrollmentEntity,
  OrderEntity,
  PaymentEntity,
  RefundEntity,
  AssessmentEntity,
} from "../types";
import { PreSchemaValidator } from "../schema/validator";
import { dbRouter, type DatabaseRouter } from "../router/db-router";

export interface OrderWithRelations {
  order: OrderEntity;
  user: UserEntity;
  student: StudentEntity;
  enrollment: EnrollmentEntity;
}

export interface InstallmentDueWithRelations {
  enrollment: EnrollmentEntity;
  student: StudentEntity;
  user: UserEntity;
  batchId: string;
}

export interface RefundWithRelations {
  refund: RefundEntity;
  user: UserEntity;
  student: StudentEntity;
}

export interface AssessmentWithRelations {
  assessment: AssessmentEntity;
  student: StudentEntity;
  user: UserEntity;
}

export interface ICommerceRepository {
  getOrdersAwaitingPayment(thresholdMinutes: number): Promise<OrderWithRelations[]>;
  getInstallmentsDue(daysAhead: number): Promise<InstallmentDueWithRelations[]>;
  getNewlyPaidOrders(): Promise<OrderWithRelations[]>;
  getFailedOrders(): Promise<Array<{ order: OrderEntity; user: UserEntity; student: StudentEntity }>>;
  getPendingRefunds(): Promise<RefundWithRelations[]>;
  getUnsentAssessments(batchId?: string, levelNumber?: number): Promise<AssessmentWithRelations[]>;
  markAlertSent(
    type: "ABANDONED_CART" | "ENROLMENT" | "PAYMENT_FAILURE" | "INSTALLMENT" | "REFUND" | "ASSESSMENT",
    id: string
  ): Promise<void>;
  upsertUser(user: UserEntity): Promise<void>;
  upsertStudent(student: StudentEntity): Promise<void>;
  upsertEnrollment(enrollment: EnrollmentEntity): Promise<void>;
  upsertOrder(order: OrderEntity): Promise<void>;
  upsertRefund(refund: RefundEntity): Promise<void>;
  upsertAssessment(assessment: AssessmentEntity): Promise<void>;
  getOrderById(orderId: string): Promise<OrderEntity | null>;
  getEnrollmentById(enrollmentId: string): Promise<EnrollmentEntity | null>;
  getUserById(userId: string): Promise<UserEntity | null>;
  getStudentById(studentId: string): Promise<StudentEntity | null>;
  upsertPayment(payment: PaymentEntity): Promise<void>;
  updateOrderStatus(orderId: string, status: OrderEntity["status"], failureReason?: string): Promise<void>;
  updateEnrollmentStatus(enrollmentId: string, status: EnrollmentEntity["status"]): Promise<void>;
}

/**
 * Pre-Schema Routed Commerce & Student Repository
 * Manages parent accounts, student profiles, orders, payments, refunds, and assessments
 * across ANY storage system via the universal database router.
 */
export class PreSchemaCommerceRepository implements ICommerceRepository {
  private router: DatabaseRouter;

  constructor(router: DatabaseRouter = dbRouter) {
    this.router = router;
  }

  async getOrdersAwaitingPayment(thresholdMinutes: number): Promise<OrderWithRelations[]> {
    const now = Date.now();
    const thresholdMs = thresholdMinutes * 60 * 1000;
    const orders = await this.router.find<OrderEntity>("orders", { status: "AWAITING_PAYMENT" }, undefined, "commerce");
    const results: OrderWithRelations[] = [];

    for (const order of orders) {
      const createdAtMs = order.createdAt instanceof Date ? order.createdAt.getTime() : new Date(order.createdAt).getTime();
      const ageMs = now - createdAtMs;

      if (ageMs >= thresholdMs && !order.abandonedAlertSentAt) {
        const enrollment = await this.router.get<EnrollmentEntity>("enrollments", order.enrollmentId, "commerce");
        const student = enrollment ? await this.router.get<StudentEntity>("students", enrollment.studentId, "commerce") : null;
        const user = await this.router.get<UserEntity>("users", order.userId, "commerce");

        if (enrollment && student && user) {
          results.push({ order, enrollment, student, user });
        }
      }
    }

    return results;
  }

  async getInstallmentsDue(daysAhead: number): Promise<InstallmentDueWithRelations[]> {
    const now = Date.now();
    const windowMs = daysAhead * 24 * 3600 * 1000;
    const enrollments = await this.router.find<EnrollmentEntity>("enrollments", { paymentPlan: "INSTALLMENTS" }, undefined, "commerce");
    const results: InstallmentDueWithRelations[] = [];

    for (const enr of enrollments) {
      if (!enr.installment2Paid && !enr.installmentReminderSentAt) {
        // Query batch from schools domain via router
        const batch = await this.router.get<{ id: string; level5Date: Date | string }>("batches", enr.cohortBatchId, "schools");
        if (batch) {
          const l5Time = batch.level5Date instanceof Date ? batch.level5Date.getTime() : new Date(batch.level5Date).getTime();
          const diffMs = l5Time - now;

          if (diffMs > 0 && diffMs <= windowMs) {
            const student = await this.router.get<StudentEntity>("students", enr.studentId, "commerce");
            const user = student ? await this.router.get<UserEntity>("users", student.parentUserId, "commerce") : null;

            if (student && user) {
              results.push({ enrollment: enr, student, user, batchId: batch.id });
            }
          }
        }
      }
    }

    return results;
  }

  async getNewlyPaidOrders(): Promise<OrderWithRelations[]> {
    const orders = await this.router.find<OrderEntity>("orders", { status: "PAID" }, undefined, "commerce");
    const results: OrderWithRelations[] = [];

    for (const order of orders) {
      if (!order.enrolmentNotificationSentAt) {
        const enrollment = await this.router.get<EnrollmentEntity>("enrollments", order.enrollmentId, "commerce");
        const student = enrollment ? await this.router.get<StudentEntity>("students", enrollment.studentId, "commerce") : null;
        const user = student ? await this.router.get<UserEntity>("users", student.parentUserId, "commerce") : null;

        if (enrollment && student && user) {
          results.push({ order, enrollment, student, user });
        }
      }
    }

    return results;
  }

  async getFailedOrders(): Promise<Array<{ order: OrderEntity; user: UserEntity; student: StudentEntity }>> {
    const orders = await this.router.find<OrderEntity>("orders", { status: "FAILED" }, undefined, "commerce");
    const results: Array<{ order: OrderEntity; user: UserEntity; student: StudentEntity }> = [];

    for (const order of orders) {
      if (!order.failureAlertSentAt) {
        const enrollment = await this.router.get<EnrollmentEntity>("enrollments", order.enrollmentId, "commerce");
        const student = enrollment ? await this.router.get<StudentEntity>("students", enrollment.studentId, "commerce") : null;
        const user = student ? await this.router.get<UserEntity>("users", student.parentUserId, "commerce") : null;

        if (student && user) {
          results.push({ order, user, student });
        }
      }
    }

    return results;
  }

  async getPendingRefunds(): Promise<RefundWithRelations[]> {
    const refunds = await this.router.find<RefundEntity>("refunds", { status: "INITIATED" }, undefined, "commerce");
    const results: RefundWithRelations[] = [];

    for (const refund of refunds) {
      if (!refund.refundAlertSentAt) {
        const enrollment = await this.router.get<EnrollmentEntity>("enrollments", refund.enrollmentId, "commerce");
        const student = enrollment ? await this.router.get<StudentEntity>("students", enrollment.studentId, "commerce") : null;
        const user = student ? await this.router.get<UserEntity>("users", student.parentUserId, "commerce") : null;

        if (student && user) {
          results.push({ refund, user, student });
        }
      }
    }

    return results;
  }

  async getUnsentAssessments(batchId?: string, levelNumber?: number): Promise<AssessmentWithRelations[]> {
    const filter: Record<string, unknown> = {};
    if (batchId) filter.cohortBatchId = batchId;
    if (levelNumber) filter.levelNumber = levelNumber;

    const assessments = await this.router.find<AssessmentEntity>("assessments", filter, undefined, "commerce");
    const results: AssessmentWithRelations[] = [];

    for (const ass of assessments) {
      if (!ass.reportSentAt) {
        const student = await this.router.get<StudentEntity>("students", ass.studentId, "commerce");
        const user = student ? await this.router.get<UserEntity>("users", student.parentUserId, "commerce") : null;

        if (student && user) {
          results.push({ assessment: ass, student, user });
        }
      }
    }

    return results;
  }

  async markAlertSent(
    type: "ABANDONED_CART" | "ENROLMENT" | "PAYMENT_FAILURE" | "INSTALLMENT" | "REFUND" | "ASSESSMENT",
    id: string
  ): Promise<void> {
    const now = new Date();
    switch (type) {
      case "ABANDONED_CART": {
        await this.router.update<OrderEntity>("orders", id, { abandonedAlertSentAt: now }, "commerce");
        break;
      }
      case "ENROLMENT": {
        await this.router.update<OrderEntity>("orders", id, { enrolmentNotificationSentAt: now }, "commerce");
        break;
      }
      case "PAYMENT_FAILURE": {
        await this.router.update<OrderEntity>("orders", id, { failureAlertSentAt: now }, "commerce");
        break;
      }
      case "INSTALLMENT": {
        await this.router.update<EnrollmentEntity>("enrollments", id, { installmentReminderSentAt: now }, "commerce");
        break;
      }
      case "REFUND": {
        await this.router.update<RefundEntity>("refunds", id, { refundAlertSentAt: now }, "commerce");
        break;
      }
      case "ASSESSMENT": {
        await this.router.update<AssessmentEntity>("assessments", id, { reportSentAt: now }, "commerce");
        break;
      }
    }
  }

  async upsertUser(user: UserEntity): Promise<void> {
    const valid = PreSchemaValidator.normalizeUser(user);
    await this.router.upsert("users", valid, "commerce");
  }

  async upsertStudent(student: StudentEntity): Promise<void> {
    const valid = PreSchemaValidator.normalizeStudent(student);
    await this.router.upsert("students", valid, "commerce");
  }

  async upsertEnrollment(enrollment: EnrollmentEntity): Promise<void> {
    const valid = PreSchemaValidator.normalizeEnrollment(enrollment);
    await this.router.upsert("enrollments", valid, "commerce");
  }

  async upsertOrder(order: OrderEntity): Promise<void> {
    const valid = PreSchemaValidator.normalizeOrder(order);
    await this.router.upsert("orders", valid, "commerce");
  }

  async upsertRefund(refund: RefundEntity): Promise<void> {
    const valid = PreSchemaValidator.normalizeRefund(refund);
    await this.router.upsert("refunds", valid, "commerce");
  }

  async upsertAssessment(assessment: AssessmentEntity): Promise<void> {
    const valid = PreSchemaValidator.normalizeAssessment(assessment);
    await this.router.upsert("assessments", valid, "commerce");
  }

  async getOrderById(orderId: string): Promise<OrderEntity | null> {
    return await this.router.get<OrderEntity>("orders", orderId, "commerce");
  }

  async getEnrollmentById(enrollmentId: string): Promise<EnrollmentEntity | null> {
    return await this.router.get<EnrollmentEntity>("enrollments", enrollmentId, "commerce");
  }

  async getUserById(userId: string): Promise<UserEntity | null> {
    return await this.router.get<UserEntity>("users", userId, "commerce");
  }

  async getStudentById(studentId: string): Promise<StudentEntity | null> {
    return await this.router.get<StudentEntity>("students", studentId, "commerce");
  }

  async upsertPayment(payment: PaymentEntity): Promise<void> {
    const valid = PreSchemaValidator.normalizePayment(payment);
    await this.router.upsert("payments", valid, "commerce");
  }

  async updateOrderStatus(orderId: string, status: OrderEntity["status"], failureReason?: string): Promise<void> {
    const partial: Partial<OrderEntity> = { status };
    if (failureReason) partial.failureReason = failureReason;
    await this.router.update("orders", orderId, partial, "commerce");
  }

  async updateEnrollmentStatus(enrollmentId: string, status: EnrollmentEntity["status"]): Promise<void> {
    await this.router.update<EnrollmentEntity>("enrollments", enrollmentId, { status }, "commerce");
  }
}

