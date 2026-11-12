import type {
  SchoolEntity,
  CohortBatchEntity,
  TutorEntity,
} from "../types";
import { PreSchemaValidator } from "../schema/validator";
import { dbRouter, type DatabaseRouter } from "../router/db-router";

export interface ISchoolsRepository {
  findByUid(schoolUid: string): Promise<SchoolEntity | null>;
  searchByNameOrAlias(query: string): Promise<SchoolEntity[]>;
  listAll(limit?: number): Promise<SchoolEntity[]>;
  listActive(limit?: number): Promise<SchoolEntity[]>;
  getBatch(batchId: string): Promise<CohortBatchEntity | null>;
  getTutor(tutorId: string): Promise<TutorEntity | null>;
  upsertSchool(school: SchoolEntity): Promise<void>;
  upsertBatch(batch: CohortBatchEntity): Promise<void>;
  upsertTutor(tutor: TutorEntity): Promise<void>;
}

/**
 * Pre-Schema Routed Schools Repository
 * Validates, normalizes, and routes school domain data to any database engine through the universal router.
 */
export class PreSchemaSchoolsRepository implements ISchoolsRepository {
  private router: DatabaseRouter;

  constructor(router: DatabaseRouter = dbRouter) {
    this.router = router;
  }

  async findByUid(schoolUid: string): Promise<SchoolEntity | null> {
    const normalizedUid = schoolUid.trim().toUpperCase();
    const schools = await this.router.find<SchoolEntity>("schools", { schoolUid: normalizedUid }, undefined, "schools");
    if (schools.length > 0) return schools[0] || null;

    // Case-insensitive fallback scan
    const all = await this.router.find<SchoolEntity>("schools", undefined, undefined, "schools");
    return all.find((s) => s.schoolUid.toUpperCase() === normalizedUid) || null;
  }

  async searchByNameOrAlias(query: string): Promise<SchoolEntity[]> {
    const q = query.trim().toLowerCase();
    const all = await this.router.find<SchoolEntity>("schools", undefined, undefined, "schools");
    return all.filter(
      (s) => s.officialName.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );
  }

  async listAll(limit = 50): Promise<SchoolEntity[]> {
    return await this.router.find<SchoolEntity>("schools", undefined, { limit, sort: { createdAt: "desc" } }, "schools");
  }

  async listActive(limit = 50): Promise<SchoolEntity[]> {
    return await this.router.find<SchoolEntity>("schools", { status: "ACTIVE" }, { limit, sort: { createdAt: "desc" } }, "schools");
  }

  async getBatch(batchId: string): Promise<CohortBatchEntity | null> {
    return await this.router.get<CohortBatchEntity>("batches", batchId, "schools");
  }

  async getTutor(tutorId: string): Promise<TutorEntity | null> {
    return await this.router.get<TutorEntity>("tutors", tutorId, "schools");
  }

  async upsertSchool(school: SchoolEntity): Promise<void> {
    // 1. Pre-Schema Validation & Normalization
    const valid = PreSchemaValidator.normalizeSchool(school);
    // 2. Routed Storage
    await this.router.upsert("schools", valid, "schools");
  }

  async upsertBatch(batch: CohortBatchEntity): Promise<void> {
    const valid = PreSchemaValidator.normalizeCohortBatch(batch);
    await this.router.upsert("batches", valid, "schools");
  }

  async upsertTutor(tutor: TutorEntity): Promise<void> {
    const valid = PreSchemaValidator.normalizeTutor(tutor);
    await this.router.upsert("tutors", valid, "schools");
  }
}
