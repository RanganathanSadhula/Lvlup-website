/**
 * WhatsApp Template Payload Formatters (Meta Business / WATI / Interakt Compliant)
 */

export interface WhatsAppEnrolmentPayload {
  parentPhone: string;
  parentName: string;
  studentName: string;
  schoolName: string;
  startDate?: string;
  grade?: number | string;
  orderId?: string;
  amountPaid?: string;
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

export interface WhatsAppClassReminderPayload {
  parentPhone: string;
  parentName: string;
  studentName: string;
  className: string;
  levelNumber?: number;
  classDate: string; // e.g. "Today (Thu 12 Nov)"
  classTime: string; // e.g. "6:00 PM – 7:30 PM IST (90 min)"
  tutorName: string; // e.g. "Ms Ananya"
  prepItem?: string; // e.g. "Bring your Level 6 agent"
  joinUrl?: string; // e.g. "https://meet.google.com/thinkova-ai-level7" or "School Lab"
}

export const whatsappTemplates = {
  enrolmentConfirmed: (d: WhatsAppEnrolmentPayload) => {
    const parent = d.parentName?.trim() || "Parent";
    const student = d.studentName?.trim() || "Your child";
    const school = d.schoolName?.trim() || "Your School";
    const startDate = d.startDate || "Upcoming Saturday batch";
    const grade = d.grade ? ` (Grade ${d.grade})` : "";
    const refLine = d.orderId ? `• *Reference ID:* ${d.orderId}\n` : "";
    const amountLine = d.amountPaid ? `• *Payment:* ${d.amountPaid} (Paid in full)\n` : "";

    const text = [
      `🎉 *ADMISSION CONFIRMED · ThinkOva AI Program*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Dear *${parent}*,`,
      ``,
      `We are thrilled to welcome *${student}*${grade} to the 8-Week Applied AI Program at *${school}*!`,
      ``,
      `📋 *Enrolment Summary*`,
      `• *Student:* ${student}${grade}`,
      `• *School & Lab:* ${school}`,
      `${refLine}${amountLine}• *Status:* Confirmed & Registered ✅`,
      ``,
      `🗓️ *What Happens Next:*`,
      `1️⃣ *Online Parent Session (30 min):* The orientation link will be shared here 2 days prior.`,
      `2️⃣ *Level 1 Kickoff:* 90 minutes in your school’s computer lab.`,
      `3️⃣ *Progress Reports:* Live WhatsApp milestone cards after Levels 2, 4, and 6.`,
      `4️⃣ *Level 8 Demo Day:* Live showcase at school where you see your child’s AI helper in action!`,
      ``,
      `📥 *Official 8-Week Curriculum & Lab Guide (PDF):*`,
      `https://thinkova.ai/downloads/ThinkOva-Eight-Week-Curriculum.pdf`,
      ``,
      `💬 Have any questions? Simply reply to this chat anytime — our academic mentors are here to assist!`,
      ``,
      `*ThinkOva Education*`,
      `_Empowering students to understand, safely use, and build real AI._`,
    ].join("\n");

    return {
      to: d.parentPhone,
      templateName: "thinkova_enrollment_confirmation_v1",
      language: "en",
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: parent },
            { type: "text", text: student },
            { type: "text", text: school },
            { type: "text", text: startDate },
          ],
        },
      ],
      fallbackText: text,
    };
  },

  weeklyAssessmentReport: (d: WhatsAppWeeklyAssessmentPayload) => ({
    to: d.parentPhone,
    templateName: "thinkova_weekly_assessment_card_v1",
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
    templateName: "thinkova_de_enrollment_v1",
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
    fallbackText: `Hi ${d.parentName}, ${d.studentName}'s ThinkOva enrolment has been updated. Refund status: ${d.refundStatus}. If you have questions, reply to this chat.`,
  }),

  classReminder: (d: WhatsAppClassReminderPayload) => {
    const parent = d.parentName?.trim() || "Parent";
    const student = d.studentName?.trim() || "Your child";
    const levelStr = d.levelNumber ? `Level ${d.levelNumber}: ` : "";
    const prepStr = d.prepItem ? `\n🎒 *What to bring/prepare:* ${d.prepItem}` : "";
    const joinStr = d.joinUrl ? `\n🔗 *Join link:* ${d.joinUrl} (opens 10 min early)` : "";

    const text = [
      `🔔 *CLASS REMINDER TODAY · ThinkOva AI Program*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Dear *${parent}*,`,
      ``,
      `Friendly reminder that *${student}* has their live AI class scheduled for *${d.classDate}*!`,
      ``,
      `📋 *Class Details:*`,
      `• *Session:* ${levelStr}${d.className}`,
      `• *Timing:* ${d.classTime}`,
      `• *Mentor:* ${d.tutorName}`,
      `${prepStr}${joinStr}`,
      ``,
      `💡 *Tip:* Please test the camera and microphone 5 minutes before class starts.`,
      ``,
      `💬 If you have any questions or attendance updates, reply to this WhatsApp chat anytime!`,
      ``,
      `*ThinkOva Education*`,
    ].join("\n");

    return {
      to: d.parentPhone,
      templateName: "thinkova_class_reminder_daily_v1",
      language: "en",
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: parent },
            { type: "text", text: student },
            { type: "text", text: `${levelStr}${d.className}` },
            { type: "text", text: d.classTime },
          ],
        },
      ],
      fallbackText: text,
    };
  },
};

