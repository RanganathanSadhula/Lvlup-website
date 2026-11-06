import type { SupportedDialect } from "../drivers/interface";

/**
 * Universal Schema Mapper
 * Bidirectionally transforms entities between clean Domain Types and storage-specific formats.
 * Handles primary key conventions (id vs _id vs PK), Date serialization, and nested JSON fields.
 */
export class UniversalSchemaMapper {
  /**
   * Transforms a Domain Entity into a Storage Record suitable for the target DB dialect.
   */
  public static toStorage<T extends { id: string }>(
    entity: T,
    collection: string,
    dialect: SupportedDialect
  ): Record<string, unknown> {
    const raw: Record<string, unknown> = { ...entity };

    // Dialect specific primary key mapping
    if (dialect === "mongodb") {
      raw._id = raw.id;
      // Keep raw.id for convenience or delete if pure mongo
    } else if (dialect === "dynamodb") {
      raw.PK = `${collection.toUpperCase()}#${raw.id}`;
      raw.SK = "METADATA";
    }

    // Date serialization for SQL / Document engines if raw driver requires ISO strings
    for (const [key, val] of Object.entries(raw)) {
      if (val instanceof Date) {
        if (dialect === "sqlite" || dialect === "dynamodb") {
          raw[key] = val.toISOString();
        }
      }
    }

    return raw;
  }

  /**
   * Transforms a raw Storage Record from the database back into a type-safe Domain Entity.
   */
  public static fromStorage<T>(
    record: Record<string, unknown>,
    _collection: string,
    dialect: SupportedDialect
  ): T {
    const entity: Record<string, unknown> = { ...record };

    // Restore ID from Mongo _id
    if (dialect === "mongodb" && entity._id && !entity.id) {
      entity.id = String(entity._id);
    }

    // Rehydrate Date fields
    for (const [key, val] of Object.entries(entity)) {
      if (typeof val === "string" && (key.endsWith("At") || key.endsWith("Date") || key === "consentTimestamp")) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          entity[key] = d;
        }
      }
    }

    return entity as unknown as T;
  }
}

