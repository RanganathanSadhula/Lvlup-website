/**
 * Universal Storage Driver Interface & Types
 * Defines the contract that any storage engine (Postgres, Mongo, SQLite, Memory, DynamoDB) must implement.
 */

export type SupportedDialect =
  | "memory"
  | "postgres"
  | "mysql"
  | "sqlite"
  | "mongodb"
  | "dynamodb"
  | "custom";

export interface DatabaseDriverStatus {
  name: string;
  dialect: SupportedDialect;
  connected: boolean;
  latencyMs?: number;
  uriProtocol?: string;
  isFallback: boolean;
  activeRecordsCount?: number;
  lastChecked?: string;
}

export type QueryFilter<T = Record<string, unknown>> = {
  [K in keyof T]?: T[K] | { $gt?: unknown; $gte?: unknown; $lt?: unknown; $lte?: unknown; $ne?: unknown; $in?: unknown[] };
} & Record<string, unknown>;

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sort?: { [field: string]: "asc" | "desc" };
}

export interface IDatabaseDriver {
  readonly name: string;
  readonly dialect: SupportedDialect;

  /**
   * Initializes connection or pool to the database engine.
   */
  connect(): Promise<boolean>;

  /**
   * Closes active connections or pools gracefully.
   */
  disconnect(): Promise<void>;

  /**
   * Pings the database to verify connectivity and measure latency.
   */
  ping(): Promise<{ ok: boolean; latencyMs: number }>;

  /**
   * Returns live driver diagnostic and telemetry metadata.
   */
  getStatus(): DatabaseDriverStatus;

  /**
   * Universal CRUD operations
   */
  get<T>(collection: string, id: string): Promise<T | null>;
  find<T>(collection: string, filter?: QueryFilter, options?: QueryOptions): Promise<T[]>;
  upsert<T extends { id: string }>(collection: string, record: T): Promise<void>;
  update<T>(collection: string, id: string, partial: Partial<T>): Promise<void>;
  delete(collection: string, id: string): Promise<boolean>;
  clear(collection?: string): Promise<void>;
}

