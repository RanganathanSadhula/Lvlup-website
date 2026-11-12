import { beforeEach, describe, expect, it } from "vitest";
import { CronEngine } from "../backend/cron/engine";
import { registerAllJobs } from "../backend/jobs";
import { defaultDispatcher } from "../backend/notifications/dispatcher";
import { getNextCronDate } from "../backend/cron/trigger-utils";
import { seedDynamicTestData } from "./fixtures";

describe("Cron Job Scheduler & Notification Verification", () => {
  let engine: CronEngine;

  beforeEach(async () => {
    engine = new CronEngine();
    registerAllJobs(engine);
    await seedDynamicTestData();
    defaultDispatcher.clearOutbox();
  });

  it("1. Generates Abandoned Cart email only for carts > 1 hour old and prevents duplicate sends", async () => {
    expect(defaultDispatcher.getEmailOutbox().length).toBe(0);

    // First scheduled tick: should find dynamically seeded order (> 70 mins old)
    const log1 = await engine.runJobNow("job.abandoned_cart_recovery");
    expect(log1.status).toBe("SUCCESS");
    expect(log1.recordsProcessed).toBe(1);

    const outbox = defaultDispatcher.getEmailOutbox();
    expect(outbox.length).toBe(1);
    expect(outbox[0]?.to).toBe("sandeep.v@example.com");
    expect(outbox[0]?.subject).toContain("Arjun Verma");
    expect(outbox[0]?.html).toContain("Delhi Public School, Pune");
    expect(outbox[0]?.html).toContain("4 seats");

    // Second scheduled tick immediately after:
    // Should NOT send duplicate email because markAlertSent('ABANDONED_CART', id) updated the DB!
    const log2 = await engine.runJobNow("job.abandoned_cart_recovery");
    expect(log2.recordsProcessed).toBe(0);
    expect(defaultDispatcher.getEmailOutbox().length).toBe(1);
  });

  it("2. Generates Installment 2 reminder email AND WhatsApp message 3 days prior", async () => {
    const log = await engine.runJobNow("job.installment_due_reminder");
    expect(log.status).toBe("SUCCESS");
    expect(log.recordsProcessed).toBe(1);

    // Verify Email
    const emails = defaultDispatcher.getEmailOutbox("sandeep.v@example.com");
    expect(emails.length).toBe(1);
    expect(emails[0]?.subject).toContain("Arjun Verma");
    expect(emails[0]?.html).toContain("₹2,499");

    // Verify WhatsApp
    const whatsApps = defaultDispatcher.getWhatsAppOutbox("+919876543210");
    expect(whatsApps.length).toBe(1);
    expect(whatsApps[0]?.templateName).toBe("thinkova_installment_due_v1");
    expect(whatsApps[0]?.fallbackText).toContain("₹2,499");
  });

  it("3. Generates Enrolment Success email AND WhatsApp message when paid", async () => {
    const log = await engine.runJobNow("job.enrollment_success_dispatch");
    expect(log.status).toBe("SUCCESS");
    expect(log.recordsProcessed).toBe(1);

    // Verify Email
    const emails = defaultDispatcher.getEmailOutbox("sandeep.v@example.com");
    expect(emails.length).toBe(1);
    expect(emails[0]?.subject).toContain("Arjun Verma");
    expect(emails[0]?.html).toContain("Delhi Public School, Pune");
    expect(emails[0]?.html).toContain("Rohan Kulkarni");

    // Verify WhatsApp
    const whatsApps = defaultDispatcher.getWhatsAppOutbox("+919876543210");
    expect(whatsApps.length).toBe(1);
    expect(whatsApps[0]?.templateName).toBe("thinkova_enrollment_confirmation_v1");
  });

  it("4. Evaluates schedule in Indian Standard Time (Asia/Kolkata) accurately", () => {
    // 0 9 * * * in Asia/Kolkata: next 9 AM IST
    const from = new Date("2026-11-03T02:00:00Z"); // 07:30 AM IST
    const next = getNextCronDate("0 9 * * *", from, "Asia/Kolkata");
    expect(next).not.toBeNull();

    // 9:00 AM IST is 03:30 AM UTC
    expect(next?.getUTCHours()).toBe(3);
    expect(next?.getUTCMinutes()).toBe(30);
  });

  it("5. Generates Weekly Student Evaluation email AND WhatsApp report when lab assessment completed", async () => {
    const log = await engine.runJobNow("job.weekly_evaluation_dispatch");
    expect(log.status).toBe("SUCCESS");
    expect(log.recordsProcessed).toBe(1);

    // Verify Evaluation Email
    const emails = defaultDispatcher.getEmailOutbox("sandeep.v@example.com");
    expect(emails.length).toBe(1);
    expect(emails[0]?.subject).toContain("Level 3 Completed");
    expect(emails[0]?.subject).toContain("Arjun Verma");
    expect(emails[0]?.html).toContain("School Homework Voice Agent");
    expect(emails[0]?.html).toContain("Rohan Kulkarni");
    expect(emails[0]?.html).toContain("https://thinkova.ai/showcase/arjun/level-3");

    // Verify WhatsApp Card
    const whatsApps = defaultDispatcher.getWhatsAppOutbox("+919876543210");
    expect(whatsApps.length).toBe(1);
    expect(whatsApps[0]?.templateName).toBe("thinkova_weekly_assessment_card_v1");
    expect(whatsApps[0]?.fallbackText).toContain("Level 3");
    expect(whatsApps[0]?.fallbackText).toContain("School Homework Voice Agent");

    // Subsequent tick should process 0
    const log2 = await engine.runJobNow("job.weekly_evaluation_dispatch");
    expect(log2.recordsProcessed).toBe(0);
    expect(defaultDispatcher.getEmailOutbox().length).toBe(1);
  });
});
