import { beforeEach, describe, expect, it } from "vitest";
import { CronEngine } from "../backend/cron/engine";
import { getNextCronDate, getNextRun } from "../backend/cron/trigger-utils";
import { emailTemplates } from "../backend/templates/email-templates";
import { preAggregators } from "../backend/aggregators";
import { allJobs, registerAllJobs } from "../backend/jobs";
import { MetricsCollector } from "../backend/monitoring/metrics";
import { CronLogger } from "../backend/monitoring/logger";
import { seedDynamicTestData } from "./fixtures";

describe("Cron Trigger Utils", () => {
  it("calculates next minute for wildcard cron", () => {
    const from = new Date("2026-11-03T10:00:15Z");
    const next = getNextCronDate("* * * * *", from);
    expect(next).not.toBeNull();
    expect(next?.getUTCMinutes()).toBe(1);
    expect(next?.getUTCSeconds()).toBe(0);
  });

  it("calculates next 9 AM run for daily cron", () => {
    const from = new Date("2026-11-03T10:00:00");
    const next = getNextCronDate("0 9 * * *", from);
    expect(next).not.toBeNull();
    expect(next?.getHours()).toBe(9);
    expect(next?.getMinutes()).toBe(0);
  });

  it("resolves interval trigger next run correctly", () => {
    const from = new Date("2026-11-03T12:00:00Z");
    const next = getNextRun({ type: "interval", intervalMs: 60000 }, from);
    expect(next?.getTime()).toBe(from.getTime() + 60000);
  });
});

describe("Cron Engine & Pre-Aggregators", () => {
  beforeEach(async () => {
    await seedDynamicTestData();
  });

  it("registers all 6 core jobs into engine", () => {
    const engine = new CronEngine(new MetricsCollector(), new CronLogger("Test"));
    registerAllJobs(engine);
    expect(engine.getAllJobs().length).toBe(allJobs.length);
    expect(engine.getJob("job.abandoned_cart_recovery")).toBeDefined();
    expect(engine.getJob("job.installment_due_reminder")).toBeDefined();
    expect(engine.getJob("job.weekly_evaluation_dispatch")).toBeDefined();
  });

  it("executes weekly evaluation job and dispatches milestone report", async () => {
    const engine = new CronEngine(new MetricsCollector(), new CronLogger("Test"));
    registerAllJobs(engine);

    const log = await engine.runJobNow("job.weekly_evaluation_dispatch");
    expect(log.status).toBe("SUCCESS");
    expect(log.recordsProcessed).toBe(1);

    // Second run should process 0 due to idempotency
    const secondLog = await engine.runJobNow("job.weekly_evaluation_dispatch");
    expect(secondLog.status).toBe("SUCCESS");
    expect(secondLog.recordsProcessed).toBe(0);
  });

  it("executes all jobs cleanly via runAllJobs", async () => {
    const engine = new CronEngine(new MetricsCollector(), new CronLogger("Test"));
    registerAllJobs(engine);

    const results = await engine.runAllJobs();
    expect(results.length).toBe(6);
    expect(results.every((r) => r.status === "SUCCESS")).toBe(true);
  });

  it("executes pre-aggregator and job handler during manual run", async () => {
    const engine = new CronEngine(new MetricsCollector(), new CronLogger("Test"));
    registerAllJobs(engine);

    const log = await engine.runJobNow("job.abandoned_cart_recovery");
    expect(log.status).toBe("SUCCESS");
    expect(log.recordsProcessed).toBe(1);

    const health = engine.getHealth();
    expect(health.status).toBe("HEALTHY");
    expect(health.totalExecutions).toBe(1);
  });

  it("pre-aggregates abandoned carts data with required fields", async () => {
    const result = await preAggregators.abandonedCarts(60);
    expect(result.count).toBeGreaterThanOrEqual(1);
    const item = result.data[0];
    expect(item).toBeDefined();
    if (!item) return;
    expect(item.orderId).toBeDefined();
    expect(item.parentEmail).toContain("@");
    expect(item.studentName).toBeDefined();
    expect(item.seatsRemaining).toBe(4);
  });

  it("pre-aggregates installment dues data with due date", async () => {
    const result = await preAggregators.installmentDues(3);
    expect(result.count).toBeGreaterThanOrEqual(1);
    const item = result.data[0];
    expect(item).toBeDefined();
    if (!item) return;
    expect(item.installmentAmount).toBe("₹2,499");
    expect(item.dueDate).toBeDefined();
  });
});

describe("Email Templates", () => {
  it("renders enrolment success email with order details", () => {
    const t = emailTemplates.enrolmentSuccess({
      parentName: "Sunita Roy",
      studentName: "Kabir Roy",
      currentGrade: 7,
      schoolName: "St. Mary's Pune",
      batchSchedule: "Thursdays 3:00 PM",
      tutorName: "Priya Sharma",
      amountPaid: "₹4,999",
      orderId: "LVL-1234",
    });
    expect(t.subject).toContain("Kabir Roy");
    expect(t.html).toContain("St. Mary's Pune");
    expect(t.html).toContain("₹4,999");
  });

  it("renders abandoned cart email with seat recovery link", () => {
    const t = emailTemplates.abandonedCart({
      parentName: "Amit",
      studentName: "Riya",
      schoolName: "Delhi Public School",
      seatsRemaining: 3,
      checkoutUrl: "https://thinkova.ai/checkout?ref=test",
      holdExpiresAt: "04:00 PM",
    });
    expect(t.subject).toContain("Riya");
    expect(t.html).toContain("https://thinkova.ai/checkout?ref=test");
    expect(t.html).toContain("3 seats");
  });

  it("renders weekly evaluation milestone email with project details", () => {
    const t = emailTemplates.weeklyEvaluationReport({
      parentName: "Sandeep Verma",
      studentName: "Arjun Verma",
      schoolName: "Delhi Public School, Pune",
      levelNumber: 3,
      levelTitle: "Voice-AI Interactive Assistant",
      projectCreated: "School Homework Voice Agent",
      tutorName: "Rohan Kulkarni",
      tutorFeedback: "Demonstrated remarkable mastery of prompt chaining.",
      reportUrl: "https://thinkova.ai/showcase/arjun/level-3",
    });
    expect(t.subject).toContain("Level 3 Completed");
    expect(t.subject).toContain("Arjun Verma");
    expect(t.html).toContain("School Homework Voice Agent");
    expect(t.html).toContain("Rohan Kulkarni");
    expect(t.html).toContain("https://thinkova.ai/showcase/arjun/level-3");
  });
});
