import type {
  AssessmentEntity,
  CohortBatchEntity,
  EnrollmentEntity,
  OrderEntity,
  PaymentEntity,
  RefundEntity,
  SchoolEntity,
  StudentEntity,
  TutorEntity,
  UserEntity,
} from "./types";
import {
  PreSchemaSchoolsRepository,
  type ISchoolsRepository,
} from "./repositories/schools-repo";
import {
  PreSchemaCommerceRepository,
  type ICommerceRepository,
  type OrderWithRelations,
  type InstallmentDueWithRelations,
  type RefundWithRelations,
  type AssessmentWithRelations,
} from "./repositories/commerce-repo";
import { dbRouter, DatabaseRouter } from "./router/db-router";
import { PreSchemaValidator } from "./schema/validator";
import { UniversalSchemaMapper } from "./schema/mapper";

export type {
  ISchoolsRepository,
  ICommerceRepository,
  OrderWithRelations,
  InstallmentDueWithRelations,
  RefundWithRelations,
  AssessmentWithRelations,
};

export { dbRouter, DatabaseRouter, PreSchemaValidator, UniversalSchemaMapper };

/**
 * Backwards-compatible Dynamic In-Memory Store Proxy
 * Delegates to the Router's fallback memory driver.
 */
class MemoryProxyStore {
  private getStore() {
    return dbRouter.getMemoryDriver().getRawStore();
  }

  private getCollectionMap<T>(collection: string): Map<string, T> {
    const raw = this.getStore();
    let map = raw.get(collection);
    if (!map) {
      map = new Map();
      raw.set(collection, map);
    }
    return map as Map<string, T>;
  }

  public get schools(): Map<string, SchoolEntity> {
    return this.getCollectionMap<SchoolEntity>("schools");
  }

  public get batches(): Map<string, CohortBatchEntity> {
    return this.getCollectionMap<CohortBatchEntity>("batches");
  }

  public get tutors(): Map<string, TutorEntity> {
    return this.getCollectionMap<TutorEntity>("tutors");
  }

  public get users(): Map<string, UserEntity> {
    return this.getCollectionMap<UserEntity>("users");
  }

  public get students(): Map<string, StudentEntity> {
    return this.getCollectionMap<StudentEntity>("students");
  }

  public get enrollments(): Map<string, EnrollmentEntity> {
    return this.getCollectionMap<EnrollmentEntity>("enrollments");
  }

  public get orders(): Map<string, OrderEntity> {
    return this.getCollectionMap<OrderEntity>("orders");
  }

  public get payments(): Map<string, PaymentEntity> {
    return this.getCollectionMap<PaymentEntity>("payments");
  }

  public get refunds(): Map<string, RefundEntity> {
    return this.getCollectionMap<RefundEntity>("refunds");
  }

  public get assessments(): Map<string, AssessmentEntity> {
    return this.getCollectionMap<AssessmentEntity>("assessments");
  }

  public clearAll() {
    dbRouter.getMemoryDriver().clearSync();
  }
}

/**
 * Dynamic Database Manager (Unified Facade)
 * High-stability routing layer supporting any DB system added now or in the future:
 * PostgreSQL, MongoDB, SQLite, In-Memory, MySQL, DynamoDB, or custom micro-drivers.
 */
export class DynamicDatabaseManager {
  public router: DatabaseRouter = dbRouter;
  public schools: ISchoolsRepository;
  public commerce: ICommerceRepository;
  public memory: MemoryProxyStore = new MemoryProxyStore();

  constructor(router: DatabaseRouter = dbRouter) {
    this.router = router;
    this.schools = new PreSchemaSchoolsRepository(this.router);
    this.commerce = new PreSchemaCommerceRepository(this.router);
  }

  /**
   * Diagnostic and health status metadata exposed via /api/db
   */
  public getDatabaseStatus() {
    const telemetry = this.router.getRouterTelemetry();
    const isSchoolsPostgres = Boolean(process.env.SCHOOLS_DATABASE_URL);
    const isCommercePostgres = Boolean(process.env.STUDENTS_COMMERCE_DATABASE_URL);

    return {
      status: "STABILIZED",
      architecture: "Pre-High Stable Database Router with Pre-Schema Normalization",
      schoolsDbConfigured: isSchoolsPostgres,
      commerceDbConfigured: isCommercePostgres,
      activeDriver: isSchoolsPostgres || isCommercePostgres ? "PostgreSQL (Managed Connection Pool)" : "Dynamic Universal Adapter (Memory)",
      telemetry,
      activeEntities: {
        schools: this.memory.schools.size,
        batches: this.memory.batches.size,
        tutors: this.memory.tutors.size,
        users: this.memory.users.size,
        students: this.memory.students.size,
        orders: this.memory.orders.size,
        payments: this.memory.payments.size,
      },
    };
  }
}

export const dbManager = new DynamicDatabaseManager();
