/**
 * WhatsApp Template Payload Formatters (Meta Business / WATI / Interakt Compliant)
 */

export interface WhatsAppEnrolmentPayload {
  parentPhone: string;
  parentName: string;
  studentName: string;
  schoolName: string;
  startDate: string;
}

export interface WhatsAppWeeklyAssessmentPayload {
  parentPhone: string;
  parentName: string;
  studentName: string;
  levelNumber: number;
  levelTitle: string;
  projectCreated: string;
  tutorFeedback: string;
  reportUrl: string;
}

export interface WhatsAppDeEnrolmentPayload {
  parentPhone: string;
  parentName: string;
  studentName: string;
  refundStatus: string;
}

export const whatsappTemplates = {
  enrolmentConfirmed: (d: WhatsAppEnrolmentPayload) => ({
    to: d.parentPhone,
    templateName: "lvlup_enrollment_confirmation_v1",
    language: "en",
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: d.parentName },
          { type: "text", text: d.studentName },
          { type: "text", text: d.schoolName },
          { type: "text", text: d.startDate },
        ],
      },
    ],
    fallbackText: `Hi ${d.parentName}, ${d.studentName} is confirmed for LvlUp at ${d.schoolName} starting on ${d.startDate}. We will message you here with orientation details.`,
  }),

  weeklyAssessmentReport: (d: WhatsAppWeeklyAssessmentPayload) => ({
    to: d.parentPhone,
    templateName: "lvlup_weekly_assessment_card_v1",
    language: "en",
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: d.parentName },
          { type: "text", text: d.studentName },
          { type: "text", text: `Level ${d.levelNumber}: ${d.levelTitle}` },
          { type: "text", text: d.projectCreated },
          { type: "text", text: d.tutorFeedback },
          { type: "text", text: d.reportUrl },
        ],
      },
    ],
    fallbackText: `Level ${d.levelNumber} Progress Update 🚀\nHi ${d.parentName}, ${d.studentName} completed "${d.levelTitle}" and created: ${d.projectCreated}.\n\nTutor Note: "${d.tutorFeedback}"\n\nView Full Milestone Report: ${d.reportUrl}`,
  }),

  deEnrolmentNotice: (d: WhatsAppDeEnrolmentPayload) => ({
    to: d.parentPhone,
    templateName: "lvlup_de_enrollment_v1",
    language: "en",
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: d.parentName },
          { type: "text", text: d.studentName },
          { type: "text", text: d.refundStatus },
        ],
      },
    ],
    fallbackText: `Hi ${d.parentName}, ${d.studentName}'s LvlUp enrolment has been updated. Refund status: ${d.refundStatus}. If you have questions, reply to this chat.`,
  }),
};

