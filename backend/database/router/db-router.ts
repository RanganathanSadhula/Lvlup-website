import type {
  IDatabaseDriver,
  SupportedDialect,
  DatabaseDriverStatus,
  QueryFilter,
  QueryOptions,
} from "../drivers/interface";
import { MemoryDatabaseDriver } from "../drivers/memory-driver";
import { PostgresDatabaseDriver } from "../drivers/postgres-driver";
import { MongoDatabaseDriver } from "../drivers/mongo-driver";
import { SqliteDatabaseDriver } from "../drivers/sqlite-driver";
import { UniversalSchemaMapper } from "../schema/mapper";

export type DomainPartition = "schools" | "commerce" | "default";

export interface DatabaseRouterConfig {
  defaultDriver?: string;
  fallbackToMemory?: boolean;
  circuitBreakerThreshold?: number; // consecutive failures before failover
}

/**
 * Pre-High Stable Database Router
 * Universal routing layer that dynamically dispatches database queries to ANY storage engine:
 * PostgreSQL, MongoDB, SQLite, In-Memory, MySQL, DynamoDB, or custom drivers.
 * Provides protocol auto-detection, domain partitioning, and circuit-breaker failover.
 */
export class DatabaseRouter {
  private drivers: Map<string, IDatabaseDriver> = new Map();
  private domainRoutes: Map<DomainPartition, string> = new Map();
  private fallbackDriver: MemoryDatabaseDriver;
  private failureCounts: Map<string, number> = new Map();
  private circuitBreakerTripped: Map<string, boolean> = new Map();
  private config: Required<DatabaseRouterConfig>;

  constructor(config?: DatabaseRouterConfig) {
    this.config = {
      defaultDriver: config?.defaultDriver || "memory",
      fallbackToMemory: config?.fallbackToMemory ?? true,
      circuitBreakerThreshold: config?.circuitBreakerThreshold ?? 3,
    };

    // Always register high-performance fallback in-memory driver
    this.fallbackDriver = new MemoryDatabaseDriver();
    this.registerDriver("memory", this.fallbackDriver);

    // Initialize auto-detected drivers from environment
    this.initDriversFromEnv();
  }

  /**
   * Automatically resolves driver implementations based on environment connection strings.
   */
  private initDriversFromEnv() {
    const defaultUri = process.env.DATABASE_URL || "";
    const schoolsUri = process.env.SCHOOLS_DATABASE_URL || "";
    const commerceUri = process.env.STUDENTS_COMMERCE_DATABASE_URL || "";

    // 1. Resolve and register driver for Schools domain
    if (schoolsUri) {
      const driver = this.createDriverFromUri("schools_db", schoolsUri);
      if (driver) {
        this.registerDriver("schools_db", driver);
        this.domainRoutes.set("schools", "schools_db");
      }
    }

    // 2. Resolve and register driver for Commerce domain
    if (commerceUri) {
      const driver = this.createDriverFromUri("commerce_db", commerceUri);
      if (driver) {
        this.registerDriver("commerce_db", driver);
        this.domainRoutes.set("commerce", "commerce_db");
      }
    }

    // 3. Fallback to generic DATABASE_URL if domain specific URIs are absent
    if (defaultUri && !schoolsUri && !commerceUri) {
      const driver = this.createDriverFromUri("primary_db", defaultUri);
      if (driver) {
        this.registerDriver("primary_db", driver);
        this.domainRoutes.set("default", "primary_db");
      }
    }
  }

  /**
   * Factory that detects the database protocol and instantiates the proper driver.
   */
  public createDriverFromUri(name: string, uri: string): IDatabaseDriver | null {
    if (!uri) return null;

    if (uri.startsWith("postgres://") || uri.startsWith("postgresql://")) {
      return new PostgresDatabaseDriver(uri);
    }
    if (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")) {
      return new MongoDatabaseDriver(uri);
    }
    if (uri.startsWith("sqlite://") || uri.startsWith("file:") || uri.endsWith(".db")) {
      return new SqliteDatabaseDriver(uri);
    }
    if (uri.startsWith("memory://")) {
      return new MemoryDatabaseDriver();
    }

    // Unknown protocol: fallback to memory driver with warning
    console.warn(`[DatabaseRouter] Unrecognized URI protocol for '${name}': "${uri.slice(0, 15)}...". Defaulting to memory driver.`);
    return null;
  }

  /**
   * Registers a new storage driver at runtime (e.g. DynamoDB, CouchDB, Redis, etc.)
   */
  public registerDriver(name: string, driver: IDatabaseDriver) {
    this.drivers.set(name, driver);
    this.failureCounts.set(name, 0);
    this.circuitBreakerTripped.set(name, false);
  }

  /**
   * Sets domain partitioning route (e.g. route 'schools' to PostgreSQL and 'commerce' to MongoDB)
   */
  public setDomainRoute(domain: DomainPartition, driverName: string) {
    if (!this.drivers.has(driverName)) {
      throw new Error(`[DatabaseRouter] Cannot route domain '${domain}' to unregistered driver '${driverName}'`);
    }
    this.domainRoutes.set(domain, driverName);
  }

  /**
   * Resolves the active driver for a given domain with circuit-breaker protection.
   */
  public getDriverForDomain(domain: DomainPartition = "default"): IDatabaseDriver {
    let driverName = this.domainRoutes.get(domain) || this.domainRoutes.get("default") || this.config.defaultDriver;

    // Check circuit breaker status
    if (this.circuitBreakerTripped.get(driverName)) {
      if (this.config.fallbackToMemory) {
        return this.fallbackDriver;
      }
    }

    const driver = this.drivers.get(driverName);
    return driver || this.fallbackDriver;
  }

  /**
   * Wraps driver execution with circuit-breaker failover protection.
   */
  private async executeWithFailover<T>(
    domain: DomainPartition,
    operation: (driver: IDatabaseDriver) => Promise<T>
  ): Promise<T> {
    const primaryDriver = this.getDriverForDomain(domain);

    try {
      const result = await operation(primaryDriver);
      // Reset failure counter on success
      this.failureCounts.set(primaryDriver.name, 0);
      return result;
    } catch (err: unknown) {
      const failures = (this.failureCounts.get(primaryDriver.name) || 0) + 1;
      this.failureCounts.set(primaryDriver.name, failures);

      if (failures >= this.config.circuitBreakerThreshold) {
        this.circuitBreakerTripped.set(primaryDriver.name, true);
        console.warn(
          `[DatabaseRouter] [CIRCUIT BREAKER TRIPPED] Driver '${primaryDriver.name}' reached ${failures} consecutive failures. Failing over to Memory Driver.`
        );
      }

      if (this.config.fallbackToMemory && primaryDriver !== this.fallbackDriver) {
        console.warn(`[DatabaseRouter] Operation on '${primaryDriver.name}' failed. Falling back to in-memory store.`);
        return await operation(this.fallbackDriver);
      }

      throw err;
    }
  }

  // ==========================================
  // Universal Routed Operations
  // ==========================================

  public async get<T>(collection: string, id: string, domain: DomainPartition = "default"): Promise<T | null> {
    return this.executeWithFailover(domain, async (driver) => {
      const raw = await driver.get<Record<string, unknown>>(collection, id);
      if (!raw) return null;
      return UniversalSchemaMapper.fromStorage<T>(raw, collection, driver.dialect);
    });
  }

  public async find<T>(
    collection: string,
    filter?: QueryFilter,
    options?: QueryOptions,
    domain: DomainPartition = "default"
  ): Promise<T[]> {
    return this.executeWithFailover(domain, async (driver) => {
      const rawList = await driver.find<Record<string, unknown>>(collection, filter, options);
      return rawList.map((rec) => UniversalSchemaMapper.fromStorage<T>(rec, collection, driver.dialect));
    });
  }

  public async upsert<T extends { id: string }>(
    collection: string,
    record: T,
    domain: DomainPartition = "default"
  ): Promise<void> {
    return this.executeWithFailover(domain, async (driver) => {
      const storageRecord = UniversalSchemaMapper.toStorage(record, collection, driver.dialect);
      await driver.upsert(collection, storageRecord as unknown as T);

      // Mirror to fallback store to keep state sync if failover occurs
      if (driver !== this.fallbackDriver) {
        await this.fallbackDriver.upsert(collection, record);
      }
    });
  }

  public async update<T>(
    collection: string,
    id: string,
    partial: Partial<T>,
    domain: DomainPartition = "default"
  ): Promise<void> {
    return this.executeWithFailover(domain, async (driver) => {
      await driver.update(collection, id, partial);
      if (driver !== this.fallbackDriver) {
        await this.fallbackDriver.update(collection, id, partial);
      }
    });
  }

  public async delete(collection: string, id: string, domain: DomainPartition = "default"): Promise<boolean> {
    return this.executeWithFailover(domain, async (driver) => {
      const res = await driver.delete(collection, id);
      if (driver !== this.fallbackDriver) {
        await this.fallbackDriver.delete(collection, id);
      }
      return res;
    });
  }

  public async clearAll(): Promise<void> {
    for (const driver of this.drivers.values()) {
      await driver.clear();
    }
    await this.fallbackDriver.clear();
    this.failureCounts.clear();
    this.circuitBreakerTripped.clear();
  }

  /**
   * Diagnostic telemetry for /api/db and monitoring systems
   */
  public getRouterTelemetry() {
    const driverStatuses: Record<string, DatabaseDriverStatus> = {};
    for (const [name, driver] of this.drivers.entries()) {
      driverStatuses[name] = driver.getStatus();
    }

    return {
      activeDomainRoutes: {
        schools: this.domainRoutes.get("schools") || "memory",
        commerce: this.domainRoutes.get("commerce") || "memory",
        default: this.domainRoutes.get("default") || this.config.defaultDriver,
      },
      registeredDriversCount: this.drivers.size,
      registeredDrivers: Array.from(this.drivers.keys()),
      fallbackDriverStatus: this.fallbackDriver.getStatus(),
      drivers: driverStatuses,
      circuitBreakerStatus: Object.fromEntries(this.circuitBreakerTripped.entries()),
      timestamp: new Date().toISOString(),
    };
  }

  public getMemoryDriver(): MemoryDatabaseDriver {
    return this.fallbackDriver;
  }
}

export const dbRouter = new DatabaseRouter();

