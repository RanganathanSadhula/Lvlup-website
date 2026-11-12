import type { JobDefinition } from "../cron/types";
import type { EnrolmentSuccessRecord } from "../aggregators/types";
import { preAggregators } from "../aggregators";
import { dbManager } from "../database/client";
import { emailTemplates } from "../templates/email-templates";
import { whatsappTemplates } from "../templates/whatsapp-templates";
import { defaultDispatcher } from "../notifications/dispatcher";

export const enrollmentSuccessJob: JobDefinition<EnrolmentSuccessRecord> = {
  id: "job.enrollment_success_dispatch",
  name: "Enrolment Success & School Roster Addition",
  description: "Synchronizes newly enrolled students to school management records and dispatches welcome packs.",
  trigger: {
    type: "interval",
    intervalMs: 120000, // Runs every 2 minutes
  },
  enabled: true,
  preventOverlap: true,
  retryLimit: 3,
  retryDelayMs: 3000,
  preAggregator: () => preAggregators.enrolmentSuccess(),
  handler: async (records, context) => {
    let processedCount = 0;

    for (const record of records) {
      const email = emailTemplates.enrolmentSuccess(record);
      const wa = whatsappTemplates.enrolmentConfirmed({
        parentPhone: record.parentPhone,
        parentName: record.parentName,
        studentName: record.studentName,
        schoolName: record.schoolName,
        startDate: record.batchSchedule,
      });

      // 1. Dispatch Email
      await defaultDispatcher.sendEmail({
        to: record.parentEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
        metadata: {
          orderId: record.orderId,
          schoolUid: record.schoolUid,
        },
      });

      // 2. Dispatch WhatsApp Confirmation
      await defaultDispatcher.sendWhatsApp({
        to: record.parentPhone,
        templateName: wa.templateName,
        fallbackText: wa.fallbackText,
        components: wa.components,
        metadata: {
          orderId: record.orderId,
        },
      });

      // Mark order in dynamic database
      await dbManager.commerce.markAlertSent("ENROLMENT", record.orderId);
      processedCount++;
    }

    return {
      recordsProcessed: processedCount,
      details: { runId: context.runId },
    };
  },
};
