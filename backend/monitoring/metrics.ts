import type { JobExecutionLog, JobMetrics } from "../cron/types";

export interface SystemHealthReport {
  status: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  uptimeSeconds: number;
  totalJobs: number;
  activeJobs: number;
  totalExecutions: number;
  overallSuccessRate: string;
  recentFailures: JobExecutionLog[];
}

export class MetricsCollector {
  private metrics: Map<string, JobMetrics> = new Map();
  private logs: Map<string, JobExecutionLog[]> = new Map();
  private maxLogsPerJob: number = 50;
  private startTime: number = Date.now();

  public initJob(jobId: string, nextRunAt?: Date): void {
    if (!this.metrics.has(jobId)) {
      this.metrics.set(jobId, {
        totalRuns: 0,
        successCount: 0,
        failureCount: 0,
        avgDurationMs: 0,
        lastDurationMs: 0,
        nextRunAt,
      });
      this.logs.set(jobId, []);
    }
  }

  public recordStart(jobId: string, runId: string, startedAt: Date = new Date()): void {
    const jobLogs = this.logs.get(jobId) || [];
    jobLogs.unshift({
      id: runId,
      jobId,
      startedAt,
      status: "SUCCESS", // temporarily until resolved
    });
    if (jobLogs.length > this.maxLogsPerJob) {
      jobLogs.pop();
    }
    this.logs.set(jobId, jobLogs);
  }

  public recordSuccess(
    jobId: string,
    runId: string,
    durationMs: number,
    recordsProcessed: number = 0,
    nextRunAt?: Date
  ): JobExecutionLog {
    const metric = this.metrics.get(jobId) || {
      totalRuns: 0,
      successCount: 0,
      failureCount: 0,
      avgDurationMs: 0,
      lastDurationMs: 0,
    };

    metric.totalRuns += 1;
    metric.successCount += 1;
    metric.lastRunAt = new Date();
    metric.nextRunAt = nextRunAt;
    metric.lastDurationMs = durationMs;
    metric.avgDurationMs = Math.round(
      (metric.avgDurationMs * (metric.totalRuns - 1) + durationMs) / metric.totalRuns
    );
    this.metrics.set(jobId, metric);

    const jobLogs = this.logs.get(jobId) || [];
    const logIndex = jobLogs.findIndex((l) => l.id === runId);
    const resolvedLog: JobExecutionLog = {
      id: runId,
      jobId,
      startedAt: jobLogs[logIndex]?.startedAt || new Date(),
      finishedAt: new Date(),
      durationMs,
      status: "SUCCESS",
      recordsProcessed,
    };

    if (logIndex >= 0) {
      jobLogs[logIndex] = resolvedLog;
    } else {
      jobLogs.unshift(resolvedLog);
    }
    return resolvedLog;
  }

  public recordFailure(
    jobId: string,
    runId: string,
    durationMs: number,
    error: Error,
    nextRunAt?: Date
  ): JobExecutionLog {
    const metric = this.metrics.get(jobId) || {
      totalRuns: 0,
      successCount: 0,
      failureCount: 0,
      avgDurationMs: 0,
      lastDurationMs: 0,
    };

    metric.totalRuns += 1;
    metric.failureCount += 1;
    metric.lastRunAt = new Date();
    metric.nextRunAt = nextRunAt;
    metric.lastDurationMs = durationMs;
    metric.lastError = error.message;
    metric.avgDurationMs = Math.round(
      (metric.avgDurationMs * (metric.totalRuns - 1) + durationMs) / metric.totalRuns
    );
    this.metrics.set(jobId, metric);

    const jobLogs = this.logs.get(jobId) || [];
    const logIndex = jobLogs.findIndex((l) => l.id === runId);
    const resolvedLog: JobExecutionLog = {
      id: runId,
      jobId,
      startedAt: jobLogs[logIndex]?.startedAt || new Date(),
      finishedAt: new Date(),
      durationMs,
      status: "FAILED",
      error: error.message,
    };

    if (logIndex >= 0) {
      jobLogs[logIndex] = resolvedLog;
    } else {
      jobLogs.unshift(resolvedLog);
    }
    return resolvedLog;
  }

  public getJobMetrics(jobId: string): JobMetrics | undefined {
    return this.metrics.get(jobId);
  }

  public getAllMetrics(): Record<string, JobMetrics> {
    const out: Record<string, JobMetrics> = {};
    this.metrics.forEach((v, k) => {
      out[k] = { ...v };
    });
    return out;
  }

  public getJobLogs(jobId: string): JobExecutionLog[] {
    return this.logs.get(jobId) || [];
  }

  public getHealthReport(totalRegisteredJobs: number, activeJobCount: number): SystemHealthReport {
    let totalExecutions = 0;
    let totalSuccesses = 0;
    let totalFailures = 0;
    const recentFailures: JobExecutionLog[] = [];

    this.metrics.forEach((m, jobId) => {
      totalExecutions += m.totalRuns;
      totalSuccesses += m.successCount;
      totalFailures += m.failureCount;

      const failures = (this.logs.get(jobId) || []).filter((l) => l.status === "FAILED");
      recentFailures.push(...failures.slice(0, 3));
    });

    const successRateNum = totalExecutions > 0 ? (totalSuccesses / totalExecutions) * 100 : 100;
    const status: SystemHealthReport["status"] =
      totalFailures === 0
        ? "HEALTHY"
        : successRateNum >= 90
        ? "DEGRADED"
        : "UNHEALTHY";

    return {
      status,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      totalJobs: totalRegisteredJobs,
      activeJobs: activeJobCount,
      totalExecutions,
      overallSuccessRate: `${successRateNum.toFixed(2)}%`,
      recentFailures: recentFailures.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime()).slice(0, 10),
    };
  }
}

export const defaultMetrics = new MetricsCollector();

