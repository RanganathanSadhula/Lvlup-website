import type { JobDefinition } from "../cron/types";
import type { RefundRecord } from "../aggregators/types";
import { preAggregators } from "../aggregators";
import { dbManager } from "../database/client";
import { emailTemplates } from "../templates/email-templates";
import { defaultDispatcher } from "../notifications/dispatcher";

export const refundStatusJob: JobDefinition<RefundRecord> = {
  id: "job.refund_status_notification",
  name: "Refund Status & Bank Timeline Notification",
  description: "Notifies parents when a refund is initiated by client or management (Demo Day guarantee).",
  trigger: {
    type: "interval",
    intervalMs: 600000, // Runs every 10 minutes
  },
  enabled: true,
  preventOverlap: true,
  retryLimit: 3,
  retryDelayMs: 4000,
  preAggregator: () => preAggregators.pendingRefunds(),
  handler: async (records, context) => {
    let count = 0;

    for (const record of records) {
      const email = emailTemplates.refundNotification(record);

      await defaultDispatcher.sendEmail({
        to: record.parentEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
        metadata: {
          jobId: context.jobId,
          refundId: record.refundId,
          refundReference: record.refundReference,
        },
      });

      await defaultDispatcher.sendWhatsApp({
        to: record.parentPhone,
        templateName: "lvlup_de_enrollment_v1",
        fallbackText: `Hi ${record.parentName}, a refund of ${record.refundAmount} has been initiated for ${record.studentName} (Ref: ${record.refundReference}). Bank credit expected within ${record.estimatedCreditDays}.`,
        metadata: {
          refundReference: record.refundReference,
        },
      });

      await dbManager.commerce.markAlertSent("REFUND", record.refundId);
      count++;
    }
    return { recordsProcessed: count };
  },
};
