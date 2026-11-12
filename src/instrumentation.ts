/**
 * Next.js Server Lifecycle Instrumentation Hook
 * Executes once when the Node.js server starts up.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const shouldAutoStart =
      process.env.ENABLE_INTERNAL_CRON === "true" ||
      (process.env.NODE_ENV === "development" && process.env.ENABLE_INTERNAL_CRON !== "false");

    if (shouldAutoStart) {
      const { initScheduler } = await import("../backend/cron/scheduler");
      initScheduler(true);
    }
  }
}

