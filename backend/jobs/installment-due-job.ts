import type { JobDefinition } from "../cron/types";
import type { InstallmentDueRecord } from "../aggregators/types";
import { preAggregators } from "../aggregators";
import { dbManager } from "../database/client";
import { emailTemplates } from "../templates/email-templates";
import { defaultDispatcher } from "../notifications/dispatcher";

export const installmentDueJob: JobDefinition<InstallmentDueRecord> = {
  id: "job.installment_due_reminder",
  name: "Installment 2 Reminder (3 Days Prior)",
  description: "Detects students approaching Level 5 and reminds parents to pay Installment 2 (₹2,499).",
  trigger: {
    type: "cron",
    expression: "0 9 * * *", // Runs every morning at 09:00 AM
    timezone: "Asia/Kolkata",
  },
  enabled: true,
  preventOverlap: true,
  retryLimit: 3,
  retryDelayMs: 5000,
  preAggregator: () => preAggregators.installmentDues(3),
  handler: async (records, context) => {
    let sentCount = 0;

    for (const record of records) {
      const email = emailTemplates.installmentReminder(record);

      // 1. Dispatch Email
      await defaultDispatcher.sendEmail({
        to: record.parentEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
        metadata: {
          jobId: context.jobId,
          enrollmentId: record.enrollmentId,
          studentName: record.studentName,
        },
      });

      // 2. Dispatch WhatsApp Reminder
      await defaultDispatcher.sendWhatsApp({
        to: record.parentPhone,
        templateName: "thinkova_installment_due_v1",
        fallbackText: `Hi ${record.parentName}, ${record.studentName} is reaching Level 5! Installment 2 (${record.installmentAmount}) is due by ${record.dueDate}. Pay online: ${record.paymentUrl}`,
        metadata: {
          enrollmentId: record.enrollmentId,
          dueDate: record.dueDate,
        },
      });

      // Mark in dynamic database
      await dbManager.commerce.markAlertSent("INSTALLMENT", record.enrollmentId);
      sentCount++;
    }

    return {
      recordsProcessed: sentCount,
      details: { runId: context.runId, daysAhead: 3 },
    };
  },
};
