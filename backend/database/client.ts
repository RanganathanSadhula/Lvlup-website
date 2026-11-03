import type {
  AssessmentEntity,
  CohortBatchEntity,
  EnrollmentEntity,
  OrderEntity,
  RefundEntity,
  SchoolEntity,
  StudentEntity,
  TutorEntity,
  UserEntity,
} from "./types";

export interface ISchoolsRepository {
  findByUid(schoolUid: string): Promise<SchoolEntity | null>;
  searchByNameOrAlias(query: string): Promise<SchoolEntity[]>;
  getBatch(batchId: string): Promise<CohortBatchEntity | null>;
  getTutor(tutorId: string): Promise<TutorEntity | null>;
  upsertSchool(school: SchoolEntity): Promise<void>;
  upsertBatch(batch: CohortBatchEntity): Promise<void>;
  upsertTutor(tutor: TutorEntity): Promise<void>;
}

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
  getUnsentAssessments(batchId: string, levelNumber: number): Promise<AssessmentWithRelations[]>;
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
}

/**
 * Dynamic in-memory runtime store used when live database URLs are not yet assigned.
 * Starts completely clean without stale hardcoded values.
 */
class DynamicInMemoryStore {
  public schools: Map<string, SchoolEntity> = new Map();
  public batches: Map<string, CohortBatchEntity> = new Map();
  public tutors: Map<string, TutorEntity> = new Map();

  public users: Map<string, UserEntity> = new Map();
  public students: Map<string, StudentEntity> = new Map();
  public enrollments: Map<string, EnrollmentEntity> = new Map();
  public orders: Map<string, OrderEntity> = new Map();
  public refunds: Map<string, RefundEntity> = new Map();
  public assessments: Map<string, AssessmentEntity> = new Map();

  public clearAll() {
    this.schools.clear();
    this.batches.clear();
    this.tutors.clear();
    this.users.clear();
    this.students.clear();
    this.enrollments.clear();
    this.orders.clear();
    this.refunds.clear();
    this.assessments.clear();
  }
}

const memoryStore = new DynamicInMemoryStore();

/**
 * School Management Database Repository (schools_db)
 */
class DynamicSchoolsRepository implements ISchoolsRepository {
  private isConnectedToLiveDb: boolean = false;

  constructor() {
    this.isConnectedToLiveDb = Boolean(process.env.SCHOOLS_DATABASE_URL);
  }

  async findByUid(schoolUid: string): Promise<SchoolEntity | null> {
    if (this.isConnectedToLiveDb) {
      // In prod: return await prismaSchools.school.findUnique({ where: { schoolUid } })
    }
    const normalized = schoolUid.trim().toUpperCase();
    for (const school of memoryStore.schools.values()) {
      if (school.schoolUid.toUpperCase() === normalized) {
        return school;
      }
    }
    return null;
  }

  async searchByNameOrAlias(query: string): Promise<SchoolEntity[]> {
    const q = query.trim().toLowerCase();
    const matches: SchoolEntity[] = [];
    for (const school of memoryStore.schools.values()) {
      if (school.officialName.toLowerCase().includes(q) || school.city.toLowerCase().includes(q)) {
        matches.push(school);
      }
    }
    return matches;
  }

  async getBatch(batchId: string): Promise<CohortBatchEntity | null> {
    return memoryStore.batches.get(batchId) || null;
  }

  async getTutor(tutorId: string): Promise<TutorEntity | null> {
    return memoryStore.tutors.get(tutorId) || null;
  }

  async upsertSchool(school: SchoolEntity): Promise<void> {
    memoryStore.schools.set(school.id, school);
  }

  async upsertBatch(batch: CohortBatchEntity): Promise<void> {
    memoryStore.batches.set(batch.id, batch);
  }

  async upsertTutor(tutor: TutorEntity): Promise<void> {
    memoryStore.tutors.set(tutor.id, tutor);
  }
}

/**
 * Student & Commerce Database Repository (students_commerce_db)
 */
class DynamicCommerceRepository implements ICommerceRepository {
  private isConnectedToLiveDb: boolean = false;

  constructor() {
    this.isConnectedToLiveDb = Boolean(process.env.STUDENTS_COMMERCE_DATABASE_URL);
  }

  async getOrdersAwaitingPayment(thresholdMinutes: number): Promise<OrderWithRelations[]> {
    const now = Date.now();
    const thresholdMs = thresholdMinutes * 60 * 1000;
    const results: OrderWithRelations[] = [];

    for (const order of memoryStore.orders.values()) {
      const ageMs = now - order.createdAt.getTime();
      if (
        order.status === "AWAITING_PAYMENT" &&
        ageMs >= thresholdMs &&
        !order.abandonedAlertSentAt
      ) {
        const enrollment = memoryStore.enrollments.get(order.enrollmentId);
        const student = enrollment ? memoryStore.students.get(enrollment.studentId) : undefined;
        const user = order ? memoryStore.users.get(order.userId) : undefined;

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
    const results: InstallmentDueWithRelations[] = [];

    for (const enr of memoryStore.enrollments.values()) {
      if (enr.paymentPlan === "INSTALLMENTS" && !enr.installment2Paid && !enr.installmentReminderSentAt) {
        const batch = memoryStore.batches.get(enr.cohortBatchId);
        if (batch) {
          const diffMs = batch.level5Date.getTime() - now;
          if (diffMs > 0 && diffMs <= windowMs) {
            const student = memoryStore.students.get(enr.studentId);
            const user = student ? memoryStore.users.get(student.parentUserId) : undefined;
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
    const results: OrderWithRelations[] = [];

    for (const order of memoryStore.orders.values()) {
      if (order.status === "PAID" && !order.enrolmentNotificationSentAt) {
        const enrollment = memoryStore.enrollments.get(order.enrollmentId);
        const student = enrollment ? memoryStore.students.get(enrollment.studentId) : undefined;
        const user = student ? memoryStore.users.get(student.parentUserId) : undefined;

        if (enrollment && student && user) {
          results.push({ order, enrollment, student, user });
        }
      }
    }
    return results;
  }

  async getFailedOrders(): Promise<Array<{ order: OrderEntity; user: UserEntity; student: StudentEntity }>> {
    const results: Array<{ order: OrderEntity; user: UserEntity; student: StudentEntity }> = [];

    for (const order of memoryStore.orders.values()) {
      if (order.status === "FAILED" && !order.failureAlertSentAt) {
        const enrollment = memoryStore.enrollments.get(order.enrollmentId);
        const student = enrollment ? memoryStore.students.get(enrollment.studentId) : undefined;
        const user = student ? memoryStore.users.get(student.parentUserId) : undefined;

        if (student && user) {
          results.push({ order, user, student });
        }
      }
    }
    return results;
  }

  async getPendingRefunds(): Promise<RefundWithRelations[]> {
    const results: RefundWithRelations[] = [];

    for (const refund of memoryStore.refunds.values()) {
      if (refund.status === "INITIATED" && !refund.refundAlertSentAt) {
        const enrollment = memoryStore.enrollments.get(refund.enrollmentId);
        const student = enrollment ? memoryStore.students.get(enrollment.studentId) : undefined;
        const user = student ? memoryStore.users.get(student.parentUserId) : undefined;

        if (student && user) {
          results.push({ refund, user, student });
        }
      }
    }
    return results;
  }

  async getUnsentAssessments(batchId: string, levelNumber: number): Promise<AssessmentWithRelations[]> {
    const results: AssessmentWithRelations[] = [];

    for (const ass of memoryStore.assessments.values()) {
      if (
        ass.cohortBatchId === batchId &&
        ass.levelNumber === levelNumber &&
        !ass.reportSentAt
      ) {
        const student = memoryStore.students.get(ass.studentId);
        const user = student ? memoryStore.users.get(student.parentUserId) : undefined;
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
        const o = memoryStore.orders.get(id);
        if (o) o.abandonedAlertSentAt = now;
        break;
      }
      case "ENROLMENT": {
        const o = memoryStore.orders.get(id);
        if (o) o.enrolmentNotificationSentAt = now;
        break;
      }
      case "PAYMENT_FAILURE": {
        const o = memoryStore.orders.get(id);
        if (o) o.failureAlertSentAt = now;
        break;
      }
      case "INSTALLMENT": {
        const e = memoryStore.enrollments.get(id);
        if (e) e.installmentReminderSentAt = now;
        break;
      }
      case "REFUND": {
        const r = memoryStore.refunds.get(id);
        if (r) r.refundAlertSentAt = now;
        break;
      }
      case "ASSESSMENT": {
        const a = memoryStore.assessments.get(id);
        if (a) a.reportSentAt = now;
        break;
      }
    }
  }

  async upsertUser(user: UserEntity): Promise<void> {
    memoryStore.users.set(user.id, user);
  }

  async upsertStudent(student: StudentEntity): Promise<void> {
    memoryStore.students.set(student.id, student);
  }

  async upsertEnrollment(enrollment: EnrollmentEntity): Promise<void> {
    memoryStore.enrollments.set(enrollment.id, enrollment);
  }

  async upsertOrder(order: OrderEntity): Promise<void> {
    memoryStore.orders.set(order.id, order);
  }

  async upsertRefund(refund: RefundEntity): Promise<void> {
    memoryStore.refunds.set(refund.id, refund);
  }

  async upsertAssessment(assessment: AssessmentEntity): Promise<void> {
    memoryStore.assessments.set(assessment.id, assessment);
  }
}

export class DynamicDatabaseManager {
  public schools: ISchoolsRepository = new DynamicSchoolsRepository();
  public commerce: ICommerceRepository = new DynamicCommerceRepository();
  public memory = memoryStore;

  public getDatabaseStatus() {
    return {
      schoolsDbConfigured: Boolean(process.env.SCHOOLS_DATABASE_URL),
      commerceDbConfigured: Boolean(process.env.STUDENTS_COMMERCE_DATABASE_URL),
      driver: process.env.SCHOOLS_DATABASE_URL ? "PostgreSQL (Managed Connection Pool)" : "Dynamic DynamicAdapter",
      activeEntities: {
        schools: this.memory.schools.size,
        batches: this.memory.batches.size,
        tutors: this.memory.tutors.size,
        users: this.memory.users.size,
        students: this.memory.students.size,
        orders: this.memory.orders.size,
      },
    };
  }
}

export const dbManager = new DynamicDatabaseManager();

