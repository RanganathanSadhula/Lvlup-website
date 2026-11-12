import type { JobDefinition } from "../cron/types";
import type { PaymentFailureRecord } from "../aggregators/types";
import { preAggregators } from "../aggregators";
import { dbManager } from "../database/client";
import { emailTemplates } from "../templates/email-templates";
import { defaultDispatcher } from "../notifications/dispatcher";

export const paymentFailureJob: JobDefinition<PaymentFailureRecord> = {
  id: "job.payment_failure_alert",
  name: "Payment Failure Immediate Alert",
  description: "Alerts parents when a transaction fails with a direct retry link.",
  trigger: {
    type: "interval",
    intervalMs: 300000, // Runs every 5 minutes
  },
  enabled: true,
  preventOverlap: true,
  retryLimit: 2,
  retryDelayMs: 3000,
  preAggregator: () => preAggregators.paymentFailures(),
  handler: async (records, context) => {
    let count = 0;

    for (const record of records) {
      const email = emailTemplates.paymentFailure(record);

      await defaultDispatcher.sendEmail({
        to: record.parentEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
        metadata: {
          jobId: context.jobId,
          orderId: record.orderId,
        },
      });

      await dbManager.commerce.markAlertSent("PAYMENT_FAILURE", record.orderId);
      count++;
    }
    return { recordsProcessed: count };
  },
};
