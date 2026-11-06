/**
 * Core Types for the Thinkova APScheduler-inspired Cron & Job Engine
 */

export type JobStatus = "IDLE" | "RUNNING" | "SUCCESS" | "FAILED" | "RETRYING" | "PAUSED";

export interface CronTrigger {
  type: "cron";
  /** Standard 5-field cron expression (e.g. "0 9 * * *" or "star/5 * * * *") */
  expression: string;
  timezone?: string;
}

export interface IntervalTrigger {
  type: "interval";
  /** Interval in milliseconds */
  intervalMs: number;
}

export interface DateTrigger {
  type: "date";
  /** Exact target execution timestamp */
  runAt: Date;
}

export type JobTrigger = CronTrigger | IntervalTrigger | DateTrigger;

export interface JobExecutionLog {
  id: string;
  jobId: string;
  startedAt: Date;
  finishedAt?: Date;
  durationMs?: number;
  status: "SUCCESS" | "FAILED";
  error?: string;
  recordsProcessed?: number;
}

export interface JobMetrics {
  totalRuns: number;
  successCount: number;
  failureCount: number;
  lastRunAt?: Date;
  nextRunAt?: Date;
  avgDurationMs: number;
  lastDurationMs: number;
  lastError?: string;
}

export interface PreAggregatorResult<T> {
  data: T[];
  count: number;
  metadata?: Record<string, unknown>;
}

export type PreAggregator<T> = () => Promise<PreAggregatorResult<T>>;

export interface JobExecutionContext {
  jobId: string;
  runId: string;
  scheduledTime: Date;
  attempt: number;
}

export interface JobExecutionSummary {
  recordsProcessed: number;
  details?: Record<string, unknown>;
}

export type JobHandler<T> = (
  aggregatedData: T[],
  context: JobExecutionContext
) => Promise<JobExecutionSummary>;

export interface JobDefinition<T = unknown> {
  id: string;
  name: string;
  description: string;
  trigger: JobTrigger;
  enabled: boolean;
  /** Pre-aggregation function that fetches and prepares domain records before the handler executes */
  preAggregator?: PreAggregator<T>;
  /** The core execution handler taking pre-aggregated data */
  handler: JobHandler<T>;
  /** Maximum retry attempts on failure (default: 3) */
  retryLimit?: number;
  /** Delay between retries in milliseconds (default: 5000) */
  retryDelayMs?: number;
  /** Prevent overlapping execution if previous run has not completed (default: true) */
  preventOverlap?: boolean;
  /** Execution timeout limit in milliseconds (default: 30000) */
  timeoutMs?: number;
}

export interface EngineListeners {
  onJobStart?: (job: JobDefinition, context: JobExecutionContext) => void;
  onJobSuccess?: (job: JobDefinition, log: JobExecutionLog) => void;
  onJobFailure?: (job: JobDefinition, error: Error, log: JobExecutionLog) => void;
  onJobRetry?: (job: JobDefinition, attempt: number, error: Error) => void;
}

