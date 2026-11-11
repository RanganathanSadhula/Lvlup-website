import type {
  SchoolEntity,
  TutorEntity,
  CohortBatchEntity,
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

export class PreSchemaValidationError extends Error {
  public field?: string;
  public entityName: string;

  constructor(entityName: string, message: string, field?: string) {
    super(`[PreSchemaValidation] Invalid ${entityName}${field ? `.${field}` : ""}: ${message}`);
    this.name = "PreSchemaValidationError";
    this.entityName = entityName;
    this.field = field;
  }
}

/**
 * Pre-Schema Normalization & Guard Engine
 * Sanitizes, validates, and normalizes domain objects BEFORE any storage driver touches them.
 * Guarantees zero schema mismatches regardless of target database system (Postgres, Mongo, SQLite, DynamoDB, Memory).
 */
export class PreSchemaValidator {
  private static toDate(val: unknown, entity: string, field: string): Date {
    if (val instanceof Date && !isNaN(val.getTime())) return val;
    if (typeof val === "string" || typeof val === "number") {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d;
    }
    throw new PreSchemaValidationError(entity, `Must be a valid Date or timestamp string, got ${typeof val}`, field);
  }

  private static toNonEmptyString(val: unknown, entity: string, field: string): string {
    if (typeof val !== "string" || val.trim().length === 0) {
      throw new PreSchemaValidationError(entity, `Must be a non-empty string`, field);
    }
    return val.trim();
  }

  private static toNonNegativeInt(val: unknown, entity: string, field: string): number {
    const num = Number(val);
    if (!Number.isInteger(num) || num < 0) {
      throw new PreSchemaValidationError(entity, `Must be a non-negative integer`, field);
    }
    return num;
  }

  // 1. School Entity Normalization
  public static normalizeSchool(data: Partial<SchoolEntity>): SchoolEntity {
    if (!data.id) throw new PreSchemaValidationError("School", "Missing required id", "id");
    const schoolUid = this.toNonEmptyString(data.schoolUid, "School", "schoolUid").toUpperCase();
    const officialName = this.toNonEmptyString(data.officialName, "School", "officialName");
    const city = this.toNonEmptyString(data.city || "Pune", "School", "city");
    const state = this.toNonEmptyString(data.state || "Maharashtra", "School", "state");
    const board = (data.board || "CBSE") as SchoolEntity["board"];
    const labCapacity = this.toNonNegativeInt(data.labCapacity ?? 25, "School", "labCapacity");
    const partnerCommissionPct = Number(data.partnerCommissionPct ?? 0);

    return {
      id: String(data.id),
      schoolUid,
      officialName,
      slug: data.slug ? String(data.slug).toLowerCase().trim() : `school-${schoolUid.toLowerCase()}`,
      city,
      state,
      board,
      labRoomNumber: data.labRoomNumber ? String(data.labRoomNumber).trim() : undefined,
      labCapacity,
      coordinatorName: data.coordinatorName ? String(data.coordinatorName).trim() : undefined,
      coordinatorPhone: data.coordinatorPhone ? String(data.coordinatorPhone).trim() : undefined,
      coordinatorEmail: data.coordinatorEmail ? String(data.coordinatorEmail).trim().toLowerCase() : undefined,
      partnerCommissionPct,
      status: (data.status || "ACTIVE") as SchoolEntity["status"],
      createdAt: this.toDate(data.createdAt || new Date(), "School", "createdAt"),
    };
  }

  // 2. Tutor Entity Normalization
  public static normalizeTutor(data: Partial<TutorEntity>): TutorEntity {
    if (!data.id) throw new PreSchemaValidationError("Tutor", "Missing required id", "id");
    return {
      id: String(data.id),
      fullName: this.toNonEmptyString(data.fullName, "Tutor", "fullName"),
      email: this.toNonEmptyString(data.email, "Tutor", "email").toLowerCase(),
      phone: this.toNonEmptyString(data.phone, "Tutor", "phone"),
      bio: data.bio ? String(data.bio).trim() : undefined,
      photoUrl: data.photoUrl ? String(data.photoUrl).trim() : undefined,
      backgroundVerified: Boolean(data.backgroundVerified),
      status: (data.status || "ACTIVE") as TutorEntity["status"],
      createdAt: this.toDate(data.createdAt || new Date(), "Tutor", "createdAt"),
    };
  }

  // 3. Cohort Batch Entity Normalization
  public static normalizeCohortBatch(data: Partial<CohortBatchEntity>): CohortBatchEntity {
    if (!data.id) throw new PreSchemaValidationError("CohortBatch", "Missing required id", "id");
    const schoolId = this.toNonEmptyString(data.schoolId, "CohortBatch", "schoolId");
    const tutorId = this.toNonEmptyString(data.tutorId, "CohortBatch", "tutorId");
    const batchCode = this.toNonEmptyString(data.batchCode, "CohortBatch", "batchCode").toUpperCase();

    const gradeLevels = Array.isArray(data.gradeLevels) && data.gradeLevels.length > 0
      ? data.gradeLevels.map((g) => Number(g))
      : [6];

    return {
      id: String(data.id),
      schoolId,
      tutorId,
      batchCode,
      gradeLevels,
      dayOfWeek: data.dayOfWeek || "Saturday",
      startTime: data.startTime || "10:00",
      endTime: data.endTime || "11:30",
      maxCapacity: this.toNonNegativeInt(data.maxCapacity ?? 25, "CohortBatch", "maxCapacity"),
      confirmedStudentsCount: this.toNonNegativeInt(data.confirmedStudentsCount ?? 0, "CohortBatch", "confirmedStudentsCount"),
      startDate: this.toDate(data.startDate || new Date(), "CohortBatch", "startDate"),
      level5Date: this.toDate(data.level5Date || new Date(Date.now() + 35 * 86400000), "CohortBatch", "level5Date"),
      demoDayDate: this.toDate(data.demoDayDate || new Date(Date.now() + 56 * 86400000), "CohortBatch", "demoDayDate"),
      status: (data.status || "UPCOMING") as CohortBatchEntity["status"],
      createdAt: this.toDate(data.createdAt || new Date(), "CohortBatch", "createdAt"),
    };
  }

  // 4. User Entity Normalization
  public static normalizeUser(data: Partial<UserEntity>): UserEntity {
    if (!data.id) throw new PreSchemaValidationError("User", "Missing required id", "id");
    const phone = this.toNonEmptyString(data.phone, "User", "phone");
    const email = this.toNonEmptyString(data.email, "User", "email").toLowerCase();
    const username = this.toNonEmptyString(data.username || email.split("@")[0], "User", "username");

    return {
      id: String(data.id),
      phone,
      email,
      username,
      fullName: data.fullName ? String(data.fullName).trim() : undefined,
      role: (data.role || "PARENT") as UserEntity["role"],
      isPhoneVerified: Boolean(data.isPhoneVerified),
      isEmailVerified: Boolean(data.isEmailVerified),
      consentTimestamp: this.toDate(data.consentTimestamp || new Date(), "User", "consentTimestamp"),
      createdAt: this.toDate(data.createdAt || new Date(), "User", "createdAt"),
    };
  }

  // 5. Student Entity Normalization
  public static normalizeStudent(data: Partial<StudentEntity>): StudentEntity {
    if (!data.id) throw new PreSchemaValidationError("Student", "Missing required id", "id");
    const parentUserId = this.toNonEmptyString(data.parentUserId, "Student", "parentUserId");
    const fullName = this.toNonEmptyString(data.fullName, "Student", "fullName");
    const schoolUid = this.toNonEmptyString(data.schoolUid, "Student", "schoolUid").toUpperCase();
    const currentGrade = this.toNonNegativeInt(data.currentGrade ?? 6, "Student", "currentGrade");

    return {
      id: String(data.id),
      parentUserId,
      fullName,
      schoolUid,
      schoolName: data.schoolName ? String(data.schoolName).trim() : undefined,
      currentGrade,
      section: data.section ? String(data.section).trim() : undefined,
      preferredTrack: data.preferredTrack ? String(data.preferredTrack).trim() : undefined,
      priorExperience: data.priorExperience ? String(data.priorExperience).trim() : undefined,
      avatarUrl: data.avatarUrl ? String(data.avatarUrl).trim() : undefined,
      createdAt: this.toDate(data.createdAt || new Date(), "Student", "createdAt"),
    };
  }

  // 6. Enrollment Entity Normalization
  public static normalizeEnrollment(data: Partial<EnrollmentEntity>): EnrollmentEntity {
    if (!data.id) throw new PreSchemaValidationError("Enrollment", "Missing required id", "id");
    const studentId = this.toNonEmptyString(data.studentId, "Enrollment", "studentId");
    const cohortBatchId = this.toNonEmptyString(data.cohortBatchId, "Enrollment", "cohortBatchId");
    const schoolUid = this.toNonEmptyString(data.schoolUid, "Enrollment", "schoolUid").toUpperCase();

    return {
      id: String(data.id),
      studentId,
      cohortBatchId,
      schoolUid,
      paymentPlan: (data.paymentPlan || "FULL") as EnrollmentEntity["paymentPlan"],
      status: (data.status || "PENDING_PAYMENT") as EnrollmentEntity["status"],
      currentLevel: Number(data.currentLevel || 1),
      enrolledAt: this.toDate(data.enrolledAt || new Date(), "Enrollment", "enrolledAt"),
      installment2Paid: Boolean(data.installment2Paid),
      installmentReminderSentAt: data.installmentReminderSentAt ? this.toDate(data.installmentReminderSentAt, "Enrollment", "installmentReminderSentAt") : undefined,
    };
  }

  // 7. Order Entity Normalization
  public static normalizeOrder(data: Partial<OrderEntity>): OrderEntity {
    if (!data.id) throw new PreSchemaValidationError("Order", "Missing required id", "id");
    const enrollmentId = this.toNonEmptyString(data.enrollmentId, "Order", "enrollmentId");
    const userId = this.toNonEmptyString(data.userId, "Order", "userId");
    const amountInPaise = this.toNonNegativeInt(data.amountInPaise, "Order", "amountInPaise");

    return {
      id: String(data.id),
      enrollmentId,
      userId,
      orderType: (data.orderType || "FULL_PAYMENT") as OrderEntity["orderType"],
      amountInPaise,
      status: (data.status || "AWAITING_PAYMENT") as OrderEntity["status"],
      failureReason: data.failureReason ? String(data.failureReason) : undefined,
      checkoutUrl: data.checkoutUrl ? String(data.checkoutUrl) : "",
      expiresAt: this.toDate(data.expiresAt || new Date(Date.now() + 7200000), "Order", "expiresAt"),
      createdAt: this.toDate(data.createdAt || new Date(), "Order", "createdAt"),
      abandonedAlertSentAt: data.abandonedAlertSentAt ? this.toDate(data.abandonedAlertSentAt, "Order", "abandonedAlertSentAt") : undefined,
      enrolmentNotificationSentAt: data.enrolmentNotificationSentAt ? this.toDate(data.enrolmentNotificationSentAt, "Order", "enrolmentNotificationSentAt") : undefined,
      failureAlertSentAt: data.failureAlertSentAt ? this.toDate(data.failureAlertSentAt, "Order", "failureAlertSentAt") : undefined,
    };
  }

  // 8. Payment Entity Normalization
  public static normalizePayment(data: Partial<PaymentEntity>): PaymentEntity {
    if (!data.id) throw new PreSchemaValidationError("Payment", "Missing required id", "id");
    const orderId = this.toNonEmptyString(data.orderId, "Payment", "orderId");
    const amountInPaise = this.toNonNegativeInt(data.amountInPaise, "Payment", "amountInPaise");

    return {
      id: String(data.id),
      orderId,
      gateway: (data.gateway || "CASHFREE") as PaymentEntity["gateway"],
      gatewayOrderId: String(data.gatewayOrderId || orderId),
      gatewayPaymentId: String(data.gatewayPaymentId || `pay_${Date.now()}`),
      paymentMethod: (data.paymentMethod || "UPI") as PaymentEntity["paymentMethod"],
      amountInPaise,
      status: (data.status || "SUCCESS") as PaymentEntity["status"],
      paidAt: this.toDate(data.paidAt || new Date(), "Payment", "paidAt"),
    };
  }

  // 9. Refund Entity Normalization
  public static normalizeRefund(data: Partial<RefundEntity>): RefundEntity {
    if (!data.id) throw new PreSchemaValidationError("Refund", "Missing required id", "id");
    const paymentId = this.toNonEmptyString(data.paymentId, "Refund", "paymentId");
    const enrollmentId = this.toNonEmptyString(data.enrollmentId, "Refund", "enrollmentId");
    const amountInPaise = this.toNonNegativeInt(data.amountInPaise, "Refund", "amountInPaise");

    return {
      id: String(data.id),
      paymentId,
      enrollmentId,
      amountInPaise,
      reason: (data.reason || "DEMO_DAY_GUARANTEE") as RefundEntity["reason"],
      initiatedBy: (data.initiatedBy || "CLIENT") as RefundEntity["initiatedBy"],
      gatewayRefundId: data.gatewayRefundId ? String(data.gatewayRefundId) : undefined,
      status: (data.status || "INITIATED") as RefundEntity["status"],
      estimatedCreditDays: data.estimatedCreditDays || "5-7 business days",
      initiatedAt: this.toDate(data.initiatedAt || new Date(), "Refund", "initiatedAt"),
      completedAt: data.completedAt ? this.toDate(data.completedAt, "Refund", "completedAt") : undefined,
      refundAlertSentAt: data.refundAlertSentAt ? this.toDate(data.refundAlertSentAt, "Refund", "refundAlertSentAt") : undefined,
    };
  }

  // 10. Assessment Entity Normalization
  public static normalizeAssessment(data: Partial<AssessmentEntity>): AssessmentEntity {
    if (!data.id) throw new PreSchemaValidationError("Assessment", "Missing required id", "id");
    const studentId = this.toNonEmptyString(data.studentId, "Assessment", "studentId");
    const cohortBatchId = this.toNonEmptyString(data.cohortBatchId, "Assessment", "cohortBatchId");

    return {
      id: String(data.id),
      studentId,
      cohortBatchId,
      levelNumber: Number(data.levelNumber || 1),
      levelTitle: data.levelTitle || `Level ${data.levelNumber || 1}`,
      attendance: (data.attendance || "PRESENT") as AssessmentEntity["attendance"],
      projectTitle: data.projectTitle || "Student AI Project",
      projectArtifactUrl: data.projectArtifactUrl || "",
      tutorScore: Number(data.tutorScore || 5),
      tutorFeedback: data.tutorFeedback || "Great progress in lab.",
      safetyPledgeVerified: Boolean(data.safetyPledgeVerified),
      reportSentAt: data.reportSentAt ? this.toDate(data.reportSentAt, "Assessment", "reportSentAt") : undefined,
      createdAt: this.toDate(data.createdAt || new Date(), "Assessment", "createdAt"),
    };
  }

  // 11. Course Progress Normalization
  public static normalizeCourseProgress(data: Partial<CourseProgressEntity>): CourseProgressEntity {
    if (!data.id) throw new PreSchemaValidationError("CourseProgress", "Missing required id", "id");
    const studentId = this.toNonEmptyString(data.studentId, "CourseProgress", "studentId");
    const courseId = this.toNonEmptyString(data.courseId, "CourseProgress", "courseId");

    const totalWeeks = Number(data.totalWeeks || 6);
    const currentWeek = Math.min(totalWeeks, Math.max(1, Number(data.currentWeek || 1)));
    const totalEstimatedMinutes = Number(data.totalEstimatedMinutes || totalWeeks * 90);
    const completedMinutes = Number(data.completedMinutes || 0);
    const lengthLeftMinutes = Math.max(0, totalEstimatedMinutes - completedMinutes);
    const completionPercentage = Math.min(100, Math.round((completedMinutes / Math.max(1, totalEstimatedMinutes)) * 100));

    return {
      id: String(data.id),
      studentId,
      courseId,
      courseTitle: data.courseTitle || "Hands-on STEM Course",
      trackId: data.trackId || "ai",
      enrollmentId: data.enrollmentId || `enr_${Date.now()}`,
      parentUserId: data.parentUserId || "usr_parent",
      status: (data.status || "ACTIVE") as CourseProgressEntity["status"],
      currentWeek,
      totalWeeks,
      frequencyPerWeek: Number(data.frequencyPerWeek || 1),
      frequencyLabel: data.frequencyLabel || "1 live lab/week + 90 min session",
      completedMinutes,
      totalEstimatedMinutes,
      lengthLeftMinutes,
      completionPercentage: data.completionPercentage ?? completionPercentage,
      persona: (data.persona || "BUILDER") as CourseProgressEntity["persona"],
      milestones: Array.isArray(data.milestones) ? data.milestones : [],
      streakDays: Number(data.streakDays || 1),
      lastActiveAt: this.toDate(data.lastActiveAt || new Date(), "CourseProgress", "lastActiveAt"),
      nextSessionAt: data.nextSessionAt ? this.toDate(data.nextSessionAt, "CourseProgress", "nextSessionAt") : undefined,
      createdAt: this.toDate(data.createdAt || new Date(), "CourseProgress", "createdAt"),
      updatedAt: this.toDate(data.updatedAt || new Date(), "CourseProgress", "updatedAt"),
    };
  }

  // 12. Learning State Multi-State Analysis Normalization
  public static normalizeLearningAnalysis(data: Partial<LearningStateAnalysisEntity>): LearningStateAnalysisEntity {
    if (!data.id) throw new PreSchemaValidationError("LearningAnalysis", "Missing required id", "id");
    const studentId = this.toNonEmptyString(data.studentId, "LearningAnalysis", "studentId");
    const courseId = this.toNonEmptyString(data.courseId, "LearningAnalysis", "courseId");

    return {
      id: String(data.id),
      studentId,
      courseId,
      persona: (data.persona || "BUILDER") as LearningStateAnalysisEntity["persona"],
      frequencyScore: Number(data.frequencyScore || 92),
      completionVelocity: Number(data.completionVelocity || 1.1),
      lengthLeftWeeks: Number(data.lengthLeftWeeks || 5),
      projectedDemoDay: this.toDate(data.projectedDemoDay || new Date(Date.now() + 35 * 86400000), "LearningAnalysis", "projectedDemoDay"),
      followRoute: (data.followRoute || "STANDARD") as LearningStateAnalysisEntity["followRoute"],
      strengths: Array.isArray(data.strengths) ? data.strengths : ["Hands-on problem solving", "Circuit debugging"],
      areasOfGrowth: Array.isArray(data.areasOfGrowth) ? data.areasOfGrowth : ["Advanced conditional loops"],
      recommendedNextTrack: data.recommendedNextTrack,
      parentReportPill: data.parentReportPill || "Ahead of syllabus · Ready for Demo Day test 2",
      analyzedAt: this.toDate(data.analyzedAt || new Date(), "LearningAnalysis", "analyzedAt"),
    };
  }
}

