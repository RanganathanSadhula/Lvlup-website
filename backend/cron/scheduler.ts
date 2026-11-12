import { CronEngine, globalCronEngine } from "./engine";
import { registerAllJobs } from "../jobs";
import { defaultLogger } from "../monitoring/logger";

let isInitialized = false;

/**
 * Initializes and starts the Thinkova Cron Engine with all lifecycle jobs
 */
export function initScheduler(autoStart: boolean = false): CronEngine {
  if (!isInitialized) {
    defaultLogger.info("Initializing Thinkova Cron Scheduler...");

    // Register event listeners
    globalCronEngine.setListeners({
      onJobStart: (job, context) => {
        defaultLogger.info(`[Engine] Starting job: ${job.name} (Attempt ${context.attempt})`, {
          runId: context.runId,
        });
      },
      onJobSuccess: (job, log) => {
        defaultLogger.info(`[Engine] Job succeeded: ${job.name}`, {
          durationMs: log.durationMs,
          recordsProcessed: log.recordsProcessed,
        });
      },
      onJobFailure: (job, error, log) => {
        defaultLogger.error(`[Engine] Job failed: ${job.name}`, error, {
          durationMs: log.durationMs,
        });
      },
      onJobRetry: (job, attempt, error) => {
        defaultLogger.warn(`[Engine] Job retry #${attempt}: ${job.name} => ${error.message}`);
      },
    });

    // Register all lifecycle jobs (including OpenWA class reminders)
    registerAllJobs(globalCronEngine);

    isInitialized = true;
    defaultLogger.info("Thinkova Cron Scheduler initialized with registered jobs.");
  }

  if (autoStart) {
    globalCronEngine.start();
  }

  return globalCronEngine;
}

export function getScheduler(): CronEngine {
  if (!isInitialized) {
    return initScheduler(false);
  }
  return globalCronEngine;
}

