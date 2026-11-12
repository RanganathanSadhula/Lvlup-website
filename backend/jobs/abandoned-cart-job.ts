import type { JobDefinition } from "../cron/types";
import type { AbandonedCartRecord } from "../aggregators/types";
import { preAggregators } from "../aggregators";
import { dbManager } from "../database/client";
import { emailTemplates } from "../templates/email-templates";
import { defaultDispatcher } from "../notifications/dispatcher";

export const abandonedCartJob: JobDefinition<AbandonedCartRecord> = {
  id: "job.abandoned_cart_recovery",
  name: "Abandoned Cart Recovery (> 1 Hour)",
  description: "Detects carts awaiting payment for over 1 hour and dispatches seat recovery emails.",
  trigger: {
    type: "cron",
    expression: "*/15 * * * *", // Runs every 15 minutes
  },
  enabled: true,
  preventOverlap: true,
  retryLimit: 3,
  retryDelayMs: 4000,
  preAggregator: () => preAggregators.abandonedCarts(60),
  handler: async (records, context) => {
    let sentCount = 0;

    for (const record of records) {
      const email = emailTemplates.abandonedCart(record);

      await defaultDispatcher.sendEmail({
        to: record.parentEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
        metadata: {
          jobId: context.jobId,
          orderId: record.orderId,
          studentName: record.studentName,
        },
      });

      // Mark order in dynamic database to prevent duplicate alerts
      await dbManager.commerce.markAlertSent("ABANDONED_CART", record.orderId);
      sentCount++;
    }

    return {
      recordsProcessed: sentCount,
      details: { runId: context.runId, thresholdMinutes: 60 },
    };
  },
};
