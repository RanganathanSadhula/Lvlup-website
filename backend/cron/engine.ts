import type {
  EngineListeners,
  JobDefinition,
  JobExecutionContext,
  JobExecutionLog,
  JobStatus,
} from "./types";
import { getNextRun } from "./trigger-utils";
import { defaultMetrics, MetricsCollector } from "../monitoring/metrics";
import { defaultLogger, CronLogger } from "../monitoring/logger";

export class CronEngine {
  private jobs: Map<string, JobDefinition> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private jobStatuses: Map<string, JobStatus> = new Map();
  private isRunning: boolean = false;
  private listeners: EngineListeners = {};
  private metrics: MetricsCollector;
  private logger: CronLogger;

  constructor(
    metrics: MetricsCollector = defaultMetrics,
    logger: CronLogger = defaultLogger
  ) {
    this.metrics = metrics;
    this.logger = logger;
  }

  /**
   * Registers event listeners for job lifecycle hooks
   */
  public setListeners(listeners: EngineListeners): void {
    this.listeners = listeners;
  }

  /**
   * Adds or updates a job definition in the scheduler registry
   */
  public registerJob<T>(job: JobDefinition<T>): void {
    this.jobs.set(job.id, job as unknown as JobDefinition);
    this.jobStatuses.set(job.id, job.enabled ? "IDLE" : "PAUSED");

    const nextRun = job.enabled ? getNextRun(job.trigger) : undefined;
    this.metrics.initJob(job.id, nextRun || undefined);
    this.logger.info(`Job registered: '${job.name}' (${job.id})`, {
      trigger: job.trigger.type,
      nextRunAt: nextRun?.toISOString(),
      enabled: job.enabled,
    });

    if (this.isRunning && job.enabled) {
      this.scheduleNext(job.id);
    }
  }

  /**
   * Removes a job from the registry and cancels any pending timer
   */
  public removeJob(jobId: string): boolean {
    this.cancelTimer(jobId);
    this.jobStatuses.delete(jobId);
    const removed = this.jobs.delete(jobId);
    if (removed) {
      this.logger.info(`Job removed: ${jobId}`);
    }
    return removed;
  }

  /**
   * Starts the cron engine and schedules all enabled jobs
   */
  public start(): void {
    if (this.isRunning) {
      this.logger.warn("CronEngine is already running.");
      return;
    }

    this.isRunning = true;
    this.logger.info("CronEngine started. Scheduling jobs...");

    this.jobs.forEach((job) => {
      if (job.enabled) {
        this.jobStatuses.set(job.id, "IDLE");
        this.scheduleNext(job.id);
      } else {
        this.jobStatuses.set(job.id, "PAUSED");
      }
    });
  }

  /**
   * Stops the engine and clears all active timers
   */
  public stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.logger.info("CronEngine stopped.");
  }

  /**
   * Pauses a specific job
   */
  public pauseJob(jobId: string): void {
    this.cancelTimer(jobId);
    this.jobStatuses.set(jobId, "PAUSED");
    const job = this.jobs.get(jobId);
    if (job) job.enabled = false;
    this.logger.info(`Job paused: ${jobId}`);
  }

  /**
   * Resumes a paused job
   */
  public resumeJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.enabled = true;
    this.jobStatuses.set(jobId, "IDLE");
    this.logger.info(`Job resumed: ${jobId}`);
    if (this.isRunning) {
      this.scheduleNext(jobId);
    }
  }

  /**
   * Triggers an immediate execution of a job out of schedule (manual or test trigger)
   */
  public async runJobNow(jobId: string): Promise<JobExecutionLog> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Cannot run job '${jobId}': Job not registered.`);
    }

    this.logger.info(`Manual execution triggered for job: ${jobId}`);
    return this.executeJob(job, 1);
  }

  /**
   * Schedules the next execution of a job based on its trigger
   */
  private scheduleNext(jobId: string): void {
    this.cancelTimer(jobId);

    if (!this.isRunning) return;

    const job = this.jobs.get(jobId);
    if (!job || !job.enabled) return;

    const nextRun = getNextRun(job.trigger);
    if (!nextRun) {
      this.logger.info(`No further execution times for job: ${jobId}`);
      this.jobStatuses.set(jobId, "IDLE");
      return;
    }

    const delayMs = Math.max(0, nextRun.getTime() - Date.now());

    // Node.js setTimeout max is 2^31 - 1 (~24.8 days)
    const MAX_TIMEOUT = 2147483647;
    const safeDelay = Math.min(delayMs, MAX_TIMEOUT);

    const timer = setTimeout(async () => {
      if (delayMs > MAX_TIMEOUT) {
        // Re-schedule for remaining time
        this.scheduleNext(jobId);
        return;
      }

      await this.executeJob(job, 1);
      // Re-schedule next recurring tick
      if (this.isRunning && job.enabled && job.trigger.type !== "date") {
        this.scheduleNext(jobId);
      }
    }, safeDelay);

    this.timers.set(jobId, timer);
  }

  /**
   * Executes a job with pre-aggregation, overlap prevention, timeout, and retries
   */
  private async executeJob(job: JobDefinition, attempt: number): Promise<JobExecutionLog> {
    const currentStatus = this.jobStatuses.get(job.id);

    // Overlap prevention (APScheduler max_instances=1 behavior)
    if (job.preventOverlap !== false && currentStatus === "RUNNING") {
      this.logger.warn(`Skipping job '${job.id}' tick: Previous instance is still running (preventOverlap=true).`);
      return {
        id: `skip-${Date.now()}`,
        jobId: job.id,
        startedAt: new Date(),
        status: "SUCCESS",
        recordsProcessed: 0,
      };
    }

    this.jobStatuses.set(job.id, "RUNNING");
    const runId = `${job.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const startedAt = new Date();
    this.metrics.recordStart(job.id, runId, startedAt);

    const context: JobExecutionContext = {
      jobId: job.id,
      runId,
      scheduledTime: startedAt,
      attempt,
    };

    if (this.listeners.onJobStart) {
      this.listeners.onJobStart(job, context);
    }

    try {
      // 1. Run Pre-Aggregator if provided
      let aggregatedData: unknown[] = [];
      if (job.preAggregator) {
        this.logger.debug(`Running pre-aggregator for '${job.id}'...`);
        const preResult = await job.preAggregator();
        aggregatedData = preResult.data;
        this.logger.debug(`Pre-aggregated ${preResult.count} records for '${job.id}'.`);
      }

      // 2. Execute with timeout
      const timeoutMs = job.timeoutMs || 30000;
      const executionPromise = job.handler(aggregatedData, context);

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Job '${job.id}' timed out after ${timeoutMs}ms`)), timeoutMs);
      });

      const summary = await Promise.race([executionPromise, timeoutPromise]);
      const durationMs = Date.now() - startedAt.getTime();
      const nextRun = getNextRun(job.trigger);

      const log = this.metrics.recordSuccess(job.id, runId, durationMs, summary.recordsProcessed, nextRun || undefined);
      this.jobStatuses.set(job.id, "SUCCESS");

      this.logger.info(`Job completed successfully: '${job.name}' (${job.id}) in ${durationMs}ms`, {
        recordsProcessed: summary.recordsProcessed,
      });

      if (this.listeners.onJobSuccess) {
        this.listeners.onJobSuccess(job, log);
      }

      return log;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      const durationMs = Date.now() - startedAt.getTime();
      const retryLimit = job.retryLimit ?? 3;

      if (attempt < retryLimit) {
        this.jobStatuses.set(job.id, "RETRYING");
        const retryDelay = job.retryDelayMs ?? 5000;
        this.logger.warn(`Job '${job.id}' failed (Attempt ${attempt}/${retryLimit}). Retrying in ${retryDelay}ms... Error: ${error.message}`);

        if (this.listeners.onJobRetry) {
          this.listeners.onJobRetry(job, attempt, error);
        }

        await new Promise((r) => setTimeout(r, retryDelay));
        return this.executeJob(job, attempt + 1);
      }

      const nextRun = getNextRun(job.trigger);
      const log = this.metrics.recordFailure(job.id, runId, durationMs, error, nextRun || undefined);
      this.jobStatuses.set(job.id, "FAILED");

      this.logger.error(`Job failed permanently after ${attempt} attempts: '${job.name}' (${job.id})`, error);

      if (this.listeners.onJobFailure) {
        this.listeners.onJobFailure(job, error, log);
      }

      return log;
    }
  }

  private cancelTimer(jobId: string): void {
    const existing = this.timers.get(jobId);
    if (existing) {
      clearTimeout(existing);
      this.timers.delete(jobId);
    }
  }

  public getJob(jobId: string): JobDefinition | undefined {
    return this.jobs.get(jobId);
  }

  public getAllJobs(): JobDefinition[] {
    return Array.from(this.jobs.values());
  }

  public getJobStatus(jobId: string): JobStatus {
    return this.jobStatuses.get(jobId) || "IDLE";
  }

  public getHealth() {
    const activeCount = Array.from(this.jobs.values()).filter((j) => j.enabled).length;
    return this.metrics.getHealthReport(this.jobs.size, activeCount);
  }
}

export const globalCronEngine = new CronEngine();

