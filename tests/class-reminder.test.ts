import { describe, it, expect, beforeEach } from "vitest";
import { classReminderJob, clearSentRemindersCache } from "../backend/jobs/class-reminder-job";
import { preAggregators } from "../backend/aggregators";
import { whatsappTemplates } from "../backend/templates/whatsapp-templates";
import { GET, POST } from "../src/app/api/cron/class-reminders/route";
import { NextRequest } from "next/server";
import type { CronTrigger } from "../backend/cron/types";

describe("OpenWA Daily Class Reminder Automation", () => {
  beforeEach(() => {
    clearSentRemindersCache();
  });

  it("1. Configures the daily class reminder job with correct cron schedule and timezone", () => {
    expect(classReminderJob.id).toBe("job.class_reminder_daily");
    expect(classReminderJob.trigger.type).toBe("cron");
    const cron = classReminderJob.trigger as CronTrigger;
    expect(cron.expression).toBe("0 9 * * *"); // 09:00 AM daily
    expect(cron.timezone).toBe("Asia/Kolkata");
    expect(classReminderJob.enabled).toBe(true);
  });

  it("2. Formats WhatsApp class reminder template with accurate class timing, mentor, and preparation notes", () => {
    const wa = whatsappTemplates.classReminder({
      parentPhone: "919820143210",
      parentName: "Sandeep Sharma",
      studentName: "Aarav Sharma",
      className: "Personalise and improve",
      levelNumber: 7,
      classDate: "Thu 12 Nov",
      classTime: "6:00 PM – 7:30 PM IST (90 min)",
      tutorName: "Ms Ananya",
      prepItem: "Bring your Level 6 agent",
      joinUrl: "https://meet.google.com/thinkova-ai-level7",
    });

    expect(wa.to).toBe("919820143210");
    expect(wa.templateName).toBe("thinkova_class_reminder_daily_v1");
    expect(wa.fallbackText).toContain("CLASS REMINDER TODAY");
    expect(wa.fallbackText).toContain("Aarav Sharma");
    expect(wa.fallbackText).toContain("Level 7: Personalise and improve");
    expect(wa.fallbackText).toContain("6:00 PM – 7:30 PM IST");
    expect(wa.fallbackText).toContain("Ms Ananya");
    expect(wa.fallbackText).toContain("Bring your Level 6 agent");
    expect(wa.fallbackText).toContain("https://meet.google.com/thinkova-ai-level7");
  });

  it("3. Pre-aggregates daily class reminders for classes occurring on the specific day", async () => {
    const result = await preAggregators.classReminders("Thu 12 Nov");
    expect(result.count).toBeGreaterThan(0);
    const first = result.data[0];
    expect(first).toBeDefined();
    expect(first?.className).toContain("Level 7");
    expect(first?.studentName).toBe("Aarav Sharma");
    expect(first?.parentPhone).toBe("919820143210");
  });

  it("4. Enforces idempotency and prevents over-logging duplicate events", async () => {
    const testRecords = await preAggregators.classReminders("Thu 12 Nov");
    expect(testRecords.data.length).toBeGreaterThan(0);

    // Initial run dispatches reminders
    const firstRunSummary = await classReminderJob.handler(testRecords.data, {
      jobId: "job.class_reminder_daily",
      runId: "run_test_1",
      scheduledTime: new Date(),
      attempt: 1,
    });
    expect(firstRunSummary.recordsProcessed).toBeGreaterThan(0);

    // Second run immediately on same day: should skip duplicates without re-sending
    const secondRunSummary = await classReminderJob.handler(testRecords.data, {
      jobId: "job.class_reminder_daily",
      runId: "run_test_2",
      scheduledTime: new Date(),
      attempt: 1,
    });
    expect(secondRunSummary.recordsProcessed).toBe(0);
  });

  it("5. API Route GET handler returns structured execution summary and supports status query", async () => {
    // Status query
    const statusReq = new NextRequest("http://localhost:3000/api/cron/class-reminders?status=true");
    const statusRes = await GET(statusReq);
    expect(statusRes.status).toBe(200);
    const statusData = await statusRes.json();
    expect(statusData.channel).toBe("OPENWA");
    expect(statusData.schedule.frequency).toBe("DAILY");

    // Execution query for specific date
    const runReq = new NextRequest("http://localhost:3000/api/cron/class-reminders?date=Thu+12+Nov&force=true");
    const runRes = await GET(runReq);
    expect(runRes.status).toBe(200);
    const runData = await runRes.json();
    expect(runData.success).toBe(true);
    expect(runData.automation).toBe("OpenWA Daily Class Reminders");
    expect(runData.summary.dispatched).toBeGreaterThan(0);
    expect(runData.quietMode).toBe(true);
  });

  it("6. API Route POST handler handles JSON body with target date and force bypass", async () => {
    const postReq = new NextRequest("http://localhost:3000/api/cron/class-reminders", {
      method: "POST",
      body: JSON.stringify({
        date: "Thu 12 Nov",
        force: true,
        studentId: "aarav",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const postRes = await POST(postReq);
    expect(postRes.status).toBe(200);
    const postData = await postRes.json();
    expect(postData.success).toBe(true);
    expect(postData.summary.totalEligible).toBe(1);
    expect(postData.summary.dispatched).toBe(1);
  });
});
