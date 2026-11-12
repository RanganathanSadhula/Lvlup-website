import type { JobDefinition } from "../cron/types";
import type { ClassReminderRecord } from "../aggregators/types";
import { preAggregators } from "../aggregators";
import { whatsappTemplates } from "../templates/whatsapp-templates";
import { defaultDispatcher } from "../notifications/dispatcher";

// In-memory idempotency cache to prevent duplicate reminder notifications and over-logging
// Key format: `${studentId}:${sessionId}:${normalizedDate}`
const sentRemindersCache = new Set<string>();

export function getSentRemindersCount(): number {
  return sentRemindersCache.size;
}

export function clearSentRemindersCache(): void {
  sentRemindersCache.clear();
}

export function isReminderAlreadySent(studentId: string, sessionId: string, dateStr: string): boolean {
  const key = `${studentId}:${sessionId}:${dateStr.toLowerCase().trim()}`;
  return sentRemindersCache.has(key);
}

export function markReminderAsSent(studentId: string, sessionId: string, dateStr: string): void {
  const key = `${studentId}:${sessionId}:${dateStr.toLowerCase().trim()}`;
  sentRemindersCache.add(key);
}

export const classReminderJob: JobDefinition<ClassReminderRecord> = {
  id: "job.class_reminder_daily",
  name: "Daily Class Reminder via OpenWA",
  description:
    "Dispatches daily WhatsApp reminders to parents for classes scheduled on the specific day using OpenWA, with quiet logging and duplicate prevention.",
  trigger: {
    type: "cron",
    expression: "0 9 * * *", // Daily at 09:00 AM IST (Indian Standard Time)
    timezone: "Asia/Kolkata",
  },
  enabled: true,
  preventOverlap: true,
  retryLimit: 2,
  retryDelayMs: 3000,
  preAggregator: () => preAggregators.classReminders(),
  handler: async (records, context) => {
    let sentCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const record of records) {
      const key = `${record.studentId}:${record.sessionId}:${record.classDate.toLowerCase().trim()}`;

      // Prevent over-logging & redundant message spam (idempotency check)
      if (sentRemindersCache.has(key)) {
        skippedCount++;
        continue;
      }

      try {
        const wa = whatsappTemplates.classReminder(record);

        const result = await defaultDispatcher.sendWhatsApp({
          to: record.parentPhone,
          templateName: wa.templateName,
          fallbackText: wa.fallbackText,
          components: wa.components,
          metadata: {
            studentId: record.studentId,
            sessionId: record.sessionId,
            classDate: record.classDate,
            jobId: context.jobId,
            channel: "OPENWA",
          },
        });

        if (result.status === "FAILED") {
          failedCount++;
        } else {
          sentRemindersCache.add(key);
          sentCount++;
        }
      } catch (err: unknown) {
        failedCount++;
        // Quietly record failure without crashing the whole batch
      }
    }

    // Consolidated single summary log line to prevent over-logging events & analysis noise
    if (sentCount > 0 || failedCount > 0) {
      console.info(
        `[OpenWA ClassReminder] Run complete for ${context.jobId}: ${sentCount} sent, ${skippedCount} skipped (already notified), ${failedCount} failed.`
      );
    }

    return {
      recordsProcessed: sentCount,
      details: {
        sent: sentCount,
        skipped: skippedCount,
        failed: failedCount,
      },
    };
  },
};
