import type {
  UserEntity,
  StudentEntity,
  EnrollmentEntity,
  OrderEntity,
  PaymentEntity,
  RefundEntity,
  AssessmentEntity,
  CourseProgressEntity,
  LearningStateAnalysisEntity,
} from "../types";
import { PreSchemaValidator } from "../schema/validator";
import { dbRouter, type DatabaseRouter } from "../router/db-router";
import { notificationDispatcher } from "../../notifications/dispatcher";

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
  getUserByEmail(email: string): Promise<UserEntity | null>;
  getUserByPhone(phone: string): Promise<UserEntity | null>;
  getStudentById(studentId: string): Promise<StudentEntity | null>;
  getStudentsByParentId(parentUserId: string): Promise<StudentEntity[]>;
  getEnrollmentsByStudentId(studentId: string): Promise<EnrollmentEntity[]>;
  deleteStudent(studentId: string): Promise<void>;
  upsertPayment(payment: PaymentEntity): Promise<void>;
  updateOrderStatus(orderId: string, status: OrderEntity["status"], failureReason?: string): Promise<void>;
  updateEnrollmentStatus(enrollmentId: string, status: EnrollmentEntity["status"]): Promise<void>;
  getCourseProgressByStudent(studentId: string, courseId?: string): Promise<CourseProgressEntity | null>;
  upsertCourseProgress(progress: Partial<CourseProgressEntity>): Promise<CourseProgressEntity>;
  getLearningAnalysis(studentId: string): Promise<LearningStateAnalysisEntity | null>;
  saveLearningAnalysis(analysis: Partial<LearningStateAnalysisEntity>): Promise<LearningStateAnalysisEntity>;
  enrollAndInitializeLearning(payload: {
    studentId: string;
    courseId: string;
    courseTitle: string;
    trackId: string;
    parentUserId: string;
    paymentPlan: "FULL" | "INSTALLMENTS";
    amountInRupees: number;
  }): Promise<{
    enrollment: EnrollmentEntity;
    progress: CourseProgressEntity;
    analysis: LearningStateAnalysisEntity;
    learningPortalUrl: string;
  }>;
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

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const list = await this.router.find<UserEntity>("users", { email: email.toLowerCase().trim() }, undefined, "commerce");
    return list.length > 0 && list[0] ? list[0] : null;
  }

  async getUserByPhone(phone: string): Promise<UserEntity | null> {
    const list = await this.router.find<UserEntity>("users", { phone: phone.trim() }, undefined, "commerce");
    return list.length > 0 && list[0] ? list[0] : null;
  }

  async getStudentById(studentId: string): Promise<StudentEntity | null> {
    return await this.router.get<StudentEntity>("students", studentId, "commerce");
  }

  async getStudentsByParentId(parentUserId: string): Promise<StudentEntity[]> {
    return await this.router.find<StudentEntity>("students", { parentUserId }, undefined, "commerce");
  }

  async getEnrollmentsByStudentId(studentId: string): Promise<EnrollmentEntity[]> {
    return await this.router.find<EnrollmentEntity>("enrollments", { studentId }, undefined, "commerce");
  }

  async deleteStudent(studentId: string): Promise<void> {
    await this.router.delete("students", studentId, "commerce");
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

  async getCourseProgressByStudent(studentId: string, courseId?: string): Promise<CourseProgressEntity | null> {
    const filter: Record<string, unknown> = { studentId };
    if (courseId) filter.courseId = courseId;
    const list = await this.router.find<CourseProgressEntity>("course_progress", filter, undefined, "commerce");
    return list.length > 0 && list[0] ? list[0] : null;
  }

  async upsertCourseProgress(progress: Partial<CourseProgressEntity>): Promise<CourseProgressEntity> {
    const valid = PreSchemaValidator.normalizeCourseProgress(progress);
    await this.router.upsert("course_progress", valid, "commerce");
    return valid;
  }

  async getLearningAnalysis(studentId: string): Promise<LearningStateAnalysisEntity | null> {
    const list = await this.router.find<LearningStateAnalysisEntity>("learning_analysis", { studentId }, undefined, "commerce");
    return list.length > 0 && list[0] ? list[0] : null;
  }

  async saveLearningAnalysis(analysis: Partial<LearningStateAnalysisEntity>): Promise<LearningStateAnalysisEntity> {
    const valid = PreSchemaValidator.normalizeLearningAnalysis(analysis);
    await this.router.upsert("learning_analysis", valid, "commerce");
    return valid;
  }

  async enrollAndInitializeLearning(payload: {
    studentId: string;
    courseId: string;
    courseTitle: string;
    trackId: string;
    parentUserId: string;
    paymentPlan: "FULL" | "INSTALLMENTS";
    amountInRupees: number;
  }): Promise<{
    enrollment: EnrollmentEntity;
    progress: CourseProgressEntity;
    analysis: LearningStateAnalysisEntity;
    learningPortalUrl: string;
  }> {
    const student = await this.getStudentById(payload.studentId);
    const parent = await this.getUserById(payload.parentUserId);

    const enrollmentId = `enr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const enrollment = PreSchemaValidator.normalizeEnrollment({
      id: enrollmentId,
      studentId: payload.studentId,
      cohortBatchId: `batch_${payload.trackId}_pune`,
      schoolUid: student?.schoolUid || "PUNE_CAMPUS",
      paymentPlan: payload.paymentPlan,
      status: "ENROLLED",
      currentLevel: 1,
      enrolledAt: new Date(),
    });
    await this.upsertEnrollment(enrollment);

    // Initial Milestones for Course
    const defaultMilestones = [
      {
        id: "m_1",
        weekNumber: 1,
        title: "Lab Orientation & Circuit / Prompt Setup",
        summary: "Introduction to hardware kit and bot development environment.",
        completed: true,
        completedAt: new Date(),
        score: 95,
        tutorNote: "Quick start! Completed lab safety orientation.",
      },
      {
        id: "m_2",
        weekNumber: 2,
        title: "Sensory Input & Conversation Flow Nodes",
        summary: "Wiring input transducers or programming branching response logic.",
        completed: false,
      },
      {
        id: "m_3",
        weekNumber: 3,
        title: "Autonomous Decision Rules & Feedback Loops",
        summary: "State machine logic and ultrasonic/agent error handling.",
        completed: false,
      },
      {
        id: "m_4",
        weekNumber: 4,
        title: "Telemetry & Multi-Turn State Retention",
        summary: "Variables, persistent memory, and live telemetry readout.",
        completed: false,
      },
      {
        id: "m_5",
        weekNumber: 5,
        title: "Fail-Safe Hardening & Stress Testing",
        summary: "Boundary testing, obstacle recovery, and edge-case prompt guards.",
        completed: false,
      },
      {
        id: "m_6",
        weekNumber: 6,
        title: "School Demo Day Presentation & Live Defense",
        summary: "Showcase working robot/agent live in front of tutors and parents.",
        completed: false,
      },
    ];

    const progressId = `prog_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const progress = await this.upsertCourseProgress({
      id: progressId,
      studentId: payload.studentId,
      courseId: payload.courseId,
      courseTitle: payload.courseTitle,
      trackId: payload.trackId,
      enrollmentId: enrollment.id,
      parentUserId: payload.parentUserId,
      status: "ACTIVE",
      currentWeek: 1,
      totalWeeks: 6,
      frequencyPerWeek: 1,
      frequencyLabel: "1 live in-school lab/week + 90 min guided sandbox",
      completedMinutes: 90,
      totalEstimatedMinutes: 540,
      lengthLeftMinutes: 450,
      completionPercentage: 17,
      persona: payload.trackId === "robotics" ? "BUILDER" : payload.trackId === "ai" ? "LOGICIAN" : "CREATOR",
      milestones: defaultMilestones,
      streakDays: 1,
      lastActiveAt: new Date(),
      nextSessionAt: new Date(Date.now() + 7 * 86400000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const analysis = await this.saveLearningAnalysis({
      id: `an_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      studentId: payload.studentId,
      courseId: payload.courseId,
      persona: progress.persona,
      frequencyScore: 95,
      completionVelocity: 1.15,
      lengthLeftWeeks: 5,
      projectedDemoDay: new Date(Date.now() + 35 * 86400000),
      followRoute: "STANDARD",
      strengths: ["Interactive testing", "Consistent attendance"],
      areasOfGrowth: ["Multi-turn memory retention"],
      recommendedNextTrack: payload.trackId === "ai" ? "robotics" : "ai",
      parentReportPill: "Enrolment confirmed · Lab access active",
      analyzedAt: new Date(),
    });

    const studentName = student?.fullName || "Student";
    const learningPortalUrl = `/learning/${payload.studentId}?course=${encodeURIComponent(payload.courseId)}`;

    // Dispatch Automations (OpenWA & Microsoft Graph)
    if (parent?.phone) {
      const cleanPhone = parent.phone.replace(/\D/g, "");
      await notificationDispatcher.sendWhatsApp({
        to: cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone,
        templateName: "enrolment_confirmed_and_lab_opened",
        fallbackText: `🎉 ThinkOva Enrolment Confirmed! ${studentName} is officially enrolled in ${payload.courseTitle}. Weekly school lab starts next batch. Student learning portal is now open: http://localhost:3000${learningPortalUrl}`,
        metadata: { studentId: payload.studentId, courseId: payload.courseId, enrollmentId: enrollment.id },
      });
    }

    if (parent?.email) {
      await notificationDispatcher.sendEmail({
        to: parent.email,
        subject: `🎉 Enrolment Confirmed: ${studentName} in ThinkOva ${payload.courseTitle}`,
        text: `Hello ${parent.fullName || "Parent"},\n\nWe are thrilled to confirm ${studentName}'s enrolment in ${payload.courseTitle}.\n\nSchool Lab: In-school weekly sessions\nKits: All equipment provided at school\nStudent Learning Portal: http://localhost:3000${learningPortalUrl}\n\nWarm regards,\nThinkOva Academic Team`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0B0C0F;">
            <h2 style="color: #FF6026;">🎉 Enrolment Confirmed!</h2>
            <p>Dear <strong>${parent.fullName || "Parent"}</strong>,</p>
            <p>We are thrilled to confirm that <strong>${studentName}</strong> is enrolled in <strong>${payload.courseTitle}</strong>.</p>
            <div style="background: #F8F7F4; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <p style="margin: 4px 0;"><strong>Track:</strong> ${payload.courseTitle}</p>
              <p style="margin: 4px 0;"><strong>Weekly Lab:</strong> 90 mins/week with certified tutor</p>
              <p style="margin: 4px 0;"><strong>Kits & Materials:</strong> Included and provided at school</p>
              <p style="margin: 4px 0;"><strong>Tuition Plan:</strong> ${payload.paymentPlan === "FULL" ? "Paid in Full" : "Part 1 Confirmed"}</p>
            </div>
            <p>
              <a href="http://localhost:3000${learningPortalUrl}" style="background: #FF6026; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Launch Learning Portal & Lab &rarr;
              </a>
            </p>
            <p style="font-size: 12px; color: #667085; margin-top: 24px;">ThinkOva STEM & AI Labs · Partner Schools</p>
          </div>
        `,
        metadata: { studentId: payload.studentId, courseId: payload.courseId },
      });
    }

    return {
      enrollment,
      progress,
      analysis,
      learningPortalUrl,
    };
  }
}

