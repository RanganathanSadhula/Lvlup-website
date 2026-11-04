import type { JobDefinition } from "../cron/types";
import type { WeeklyAssessmentRecord } from "../aggregators/types";
import { preAggregators } from "../aggregators";
import { dbManager } from "../database/client";
import { emailTemplates } from "../templates/email-templates";
import { whatsappTemplates } from "../templates/whatsapp-templates";
import { defaultDispatcher } from "../notifications/dispatcher";

export const weeklyEvaluationJob: JobDefinition<WeeklyAssessmentRecord> = {
  id: "job.weekly_evaluation_dispatch",
  name: "Weekly Student Evaluation & Milestone Dispatch",
  description:
    "Aggregates unsent student evaluations/assessments across cohorts, sends milestone progress report via Email and WhatsApp to parents, and updates report status.",
  trigger: {
    type: "cron",
    expression: "0 18 * * 6", // Every Saturday at 18:00 (6 PM) IST after school lab sessions
    timezone: "Asia/Kolkata",
  },
  enabled: true,
  preventOverlap: true,
  retryLimit: 3,
  retryDelayMs: 3000,
  preAggregator: () => preAggregators.weeklyAssessments(),
  handler: async (records, context) => {
    let processedCount = 0;

    for (const record of records) {
      // 1. Format Milestone Email
      const email = emailTemplates.weeklyEvaluationReport({
        parentName: record.parentName,
        studentName: record.studentName,
        schoolName: record.schoolName,
        levelNumber: record.levelNumber,
        levelTitle: record.levelTitle,
        projectCreated: record.projectCreated,
        tutorName: record.tutorName,
        tutorFeedback: record.tutorFeedback,
        reportUrl: record.reportUrl,
      });

      // 2. Format WhatsApp Card
      const wa = whatsappTemplates.weeklyAssessmentReport({
        parentPhone: record.parentPhone,
        parentName: record.parentName,
        studentName: record.studentName,
        levelNumber: record.levelNumber,
        levelTitle: record.levelTitle,
        projectCreated: record.projectCreated,
        tutorFeedback: record.tutorFeedback,
        reportUrl: record.reportUrl,
      });

      // 3. Dispatch Email
      await defaultDispatcher.sendEmail({
        to: record.parentEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
        metadata: {
          assessmentId: record.assessmentId,
          studentId: record.studentId,
          levelNumber: record.levelNumber,
          jobId: context.jobId,
        },
      });

      // 4. Dispatch WhatsApp
      await defaultDispatcher.sendWhatsApp({
        to: record.parentPhone,
        templateName: wa.templateName,
        fallbackText: wa.fallbackText,
        components: wa.components,
        metadata: {
          assessmentId: record.assessmentId,
          studentId: record.studentId,
          jobId: context.jobId,
        },
      });

      // 5. Mark as sent for idempotency
      await dbManager.commerce.markAlertSent("ASSESSMENT", record.assessmentId);
      processedCount++;
    }

    return {
      recordsProcessed: processedCount,
      details: { runId: context.runId },
    };
  },
};

