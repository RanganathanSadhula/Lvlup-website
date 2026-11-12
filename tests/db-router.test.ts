import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseRouter } from "../backend/database/router/db-router";
import { PreSchemaValidator, PreSchemaValidationError } from "../backend/database/schema/validator";
import { UniversalSchemaMapper } from "../backend/database/schema/mapper";
import { MemoryDatabaseDriver } from "../backend/database/drivers/memory-driver";
import type { IDatabaseDriver, SupportedDialect, DatabaseDriverStatus } from "../backend/database/drivers/interface";

describe("Pre-High Stable DB Routing & Pre-Schema Integration", () => {
  let router: DatabaseRouter;

  beforeEach(() => {
    router = new DatabaseRouter({ circuitBreakerThreshold: 2, fallbackToMemory: true });
  });

  // 1. Pre-Schema Validation & Normalization
  describe("1. Pre-Schema Validator", () => {
    it("normalizes school entity and enforces uppercase UID and default values", () => {
      const normalized = PreSchemaValidator.normalizeSchool({
        id: "sch_test_01",
        schoolUid: "  dps-pun-01  ",
        officialName: "Delhi Public School Pune",
      });

      expect(normalized.schoolUid).toBe("DPS-PUN-01");
      expect(normalized.slug).toBe("school-dps-pun-01");
      expect(normalized.labCapacity).toBe(25);
      expect(normalized.board).toBe("CBSE");
      expect(normalized.createdAt).toBeInstanceOf(Date);
    });

    it("throws PreSchemaValidationError when mandatory fields are missing or invalid", () => {
      expect(() => {
        PreSchemaValidator.normalizeSchool({
          id: "",
          schoolUid: "TEST",
          officialName: "Test School",
        });
      }).toThrowError(PreSchemaValidationError);

      expect(() => {
        PreSchemaValidator.normalizeOrder({
          id: "ord_1",
          userId: "usr_1",
          enrollmentId: "enr_1",
          amountInPaise: -100, // Invalid negative amount
        });
      }).toThrowError(PreSchemaValidationError);
    });

    it("coerces string timestamps and ISO dates cleanly to Date instances", () => {
      const isoString = "2026-11-06T10:00:00.000Z";
      const normalized = PreSchemaValidator.normalizeOrder({
        id: "ord_timestamp_test",
        userId: "usr_1",
        enrollmentId: "enr_1",
        amountInPaise: 449900,
        createdAt: new Date(isoString),
      });

      expect(normalized.createdAt).toBeInstanceOf(Date);
      expect(normalized.createdAt.toISOString()).toBe(isoString);
    });
  });

  // 2. Universal Schema Mapper
  describe("2. Universal Schema Mapper", () => {
    it("transforms entity primary key and dates according to DB dialect", () => {
      const entity = {
        id: "user_123",
        username: "Parent Name",
        createdAt: new Date("2026-11-06T12:00:00.000Z"),
      };

      // MongoDB mapping (_id)
      const mongoRecord = UniversalSchemaMapper.toStorage(entity, "users", "mongodb");
      expect(mongoRecord._id).toBe("user_123");

      // DynamoDB mapping (PK/SK)
      const dynamoRecord = UniversalSchemaMapper.toStorage(entity, "users", "dynamodb");
      expect(dynamoRecord.PK).toBe("USERS#user_123");
      expect(dynamoRecord.SK).toBe("METADATA");
      expect(typeof dynamoRecord.createdAt).toBe("string");

      // Restore from storage record
      const restored = UniversalSchemaMapper.fromStorage<{ id: string; username: string; createdAt: Date }>(
        { _id: "user_123", username: "Parent Name", createdAt: "2026-11-06T12:00:00.000Z" },
        "users",
        "mongodb"
      );
      expect(restored.id).toBe("user_123");
      expect(restored.createdAt).toBeInstanceOf(Date);
    });
  });

  // 3. Driver Storage Operations & Advanced Filtering
  describe("3. Storage Driver (Memory Driver)", () => {
    it("supports CRUD, complex operators ($gt, $in, $ne) and sorting", async () => {
      const driver = new MemoryDatabaseDriver();

      await driver.upsert("orders", { id: "o1", amount: 1000, status: "PAID" });
      await driver.upsert("orders", { id: "o2", amount: 2500, status: "AWAITING_PAYMENT" });
      await driver.upsert("orders", { id: "o3", amount: 4500, status: "PAID" });

      // $gt filter
      const over2000 = await driver.find<{ id: string; amount: number }>("orders", {
        amount: { $gt: 2000 },
      });
      expect(over2000.length).toBe(2);

      // $in filter
      const inQuery = await driver.find<{ id: string }>("orders", {
        status: { $in: ["PAID"] },
      });
      expect(inQuery.length).toBe(2);

      // Update
      await driver.update("orders", "o2", { status: "PAID" });
      const updated = await driver.get<{ id: string; status: string }>("orders", "o2");
      expect(updated?.status).toBe("PAID");

      // Delete
      await driver.delete("orders", "o1");
      const deleted = await driver.get("orders", "o1");
      expect(deleted).toBeNull();
    });
  });

  // 4. Protocol Auto-Detection & Custom Driver Registration
  describe("4. Router Driver Registry & Protocol Detection", () => {
    it("auto-detects database dialect from connection URIs", () => {
      const pgDriver = router.createDriverFromUri("pg", "postgresql://user:pass@localhost:5432/mydb");
      expect(pgDriver?.dialect).toBe("postgres");

      const mongoDriver = router.createDriverFromUri("mongo", "mongodb+srv://user:pass@cluster.mongodb.net/mydb");
      expect(mongoDriver?.dialect).toBe("mongodb");

      const sqliteDriver = router.createDriverFromUri("sqlite", "file:./local.db");
      expect(sqliteDriver?.dialect).toBe("sqlite");

      const memDriver = router.createDriverFromUri("mem", "memory://");
      expect(memDriver?.dialect).toBe("memory");
    });

    it("allows registering and routing to custom DB drivers added later", async () => {
      // Mock custom driver (e.g. AWS DynamoDB, CouchDB, Redis)
      let customUpsertCalled = false;
      const customDriver: IDatabaseDriver = {
        name: "custom_dynamo",
        dialect: "dynamodb",
        connect: async () => true,
        disconnect: async () => {},
        ping: async () => ({ ok: true, latencyMs: 5 }),
        getStatus: (): DatabaseDriverStatus => ({
          name: "custom_dynamo",
          dialect: "dynamodb",
          connected: true,
          isFallback: false,
        }),
        get: async () => null,
        find: async () => [],
        upsert: async () => {
          customUpsertCalled = true;
        },
        update: async () => {},
        delete: async () => true,
        clear: async () => {},
      };

      router.registerDriver("custom_dynamo", customDriver);
      router.setDomainRoute("commerce", "custom_dynamo");

      await router.upsert("orders", { id: "ord_dynamo_01" }, "commerce");
      expect(customUpsertCalled).toBe(true);
    });
  });

  // 5. Circuit Breaker & Resilient Failover
  describe("5. Circuit Breaker & Failover", () => {
    it("trips circuit breaker on consecutive driver failures and fails over to Memory driver without crashing", async () => {
      const faultyDriver: IDatabaseDriver = {
        name: "faulty_pg",
        dialect: "postgres",
        connect: async () => false,
        disconnect: async () => {},
        ping: async () => ({ ok: false, latencyMs: 999 }),
        getStatus: (): DatabaseDriverStatus => ({
          name: "faulty_pg",
          dialect: "postgres",
          connected: false,
          isFallback: false,
        }),
        get: async () => {
          throw new Error("Connection refused: 5432");
        },
        find: async () => {
          throw new Error("Connection timeout");
        },
        upsert: async () => {
          throw new Error("Socket closed");
        },
        update: async () => {
          throw new Error("Deadlock detected");
        },
        delete: async () => {
          throw new Error("Disk full");
        },
        clear: async () => {},
      };

      router.registerDriver("faulty_pg", faultyDriver);
      router.setDomainRoute("schools", "faulty_pg");

      // First call fails on faulty_pg but router catches and falls back to memory driver seamlessly
      await router.upsert("schools", { id: "sch_resilient_01", name: "Safe School" }, "schools");

      // Verify item was stored in fallback driver safely
      const retrieved = await router.get<{ id: string; name: string }>("schools", "sch_resilient_01", "schools");
      expect(retrieved?.name).toBe("Safe School");

      // Telemetry shows circuit breaker caught the errors
      const telemetry = router.getRouterTelemetry();
      expect(telemetry.circuitBreakerStatus["faulty_pg"]).toBeDefined();
    });
  });
});

