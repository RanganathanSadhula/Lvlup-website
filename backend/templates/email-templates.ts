/**
 * Brand-consistent HTML and Text Email Templates for ThinkOva
 */

export interface EnrolmentSuccessData {
  parentName: string;
  studentName: string;
  currentGrade: number;
  schoolName: string;
  batchSchedule: string;
  tutorName: string;
  amountPaid: string;
  orderId: string;
}

export interface AbandonedCartData {
  parentName: string;
  studentName: string;
  schoolName: string;
  seatsRemaining: number;
  checkoutUrl: string;
  holdExpiresAt: string;
}

export interface PaymentFailureData {
  parentName: string;
  studentName: string;
  amount: string;
  failureReason: string;
  retryUrl: string;
}

export interface InstallmentReminderData {
  parentName: string;
  studentName: string;
  schoolName: string;
  installmentAmount: string;
  dueDate: string;
  levelStartName: string;
  paymentUrl: string;
}

export interface RefundNotificationData {
  parentName: string;
  studentName: string;
  refundAmount: string;
  refundReference: string;
  reason: string;
  initiatedBy: "CLIENT" | "MANAGEMENT";
  estimatedCreditDays: string;
}

export interface WeeklyEvaluationEmailData {
  parentName: string;
  studentName: string;
  schoolName: string;
  levelNumber: number;
  levelTitle: string;
  projectCreated: string;
  tutorName?: string;
  tutorFeedback: string;
  reportUrl: string;
}

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #0E0F12;
  background-color: #F8F7F4;
  margin: 0;
  padding: 30px 15px;
`;

const cardStyles = `
  max-width: 580px;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid #E5E3DC;
  padding: 36px 32px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
`;

const buttonStyles = `
  display: inline-block;
  background: #FF6B2C;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 15px;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 20px;
`;

export const emailTemplates = {
  /**
   * 1. Enrolment Success Email
   */
  enrolmentSuccess: (d: EnrolmentSuccessData) => ({
    subject: `Enrolment Confirmed: ${d.studentName} is registered for ThinkOva AI Course at ${d.schoolName}`,
    text: `Hi ${d.parentName},\n\n${d.studentName}'s enrolment for Grade ${d.currentGrade} at ${d.schoolName} is confirmed!\n\nSchedule: ${d.batchSchedule}\nTutor: ${d.tutorName}\nPayment: ${d.amountPaid} (Ref: ${d.orderId})\n\nWe look forward to welcoming ${d.studentName}!\n\nTeam ThinkOva`,
    html: `
      <div style="${baseStyles}">
        <div style="${cardStyles}">
          <h2 style="color: #0E0F12; margin-top: 0;">🎉 Enrolment Confirmed!</h2>
          <p>Hi <strong>${d.parentName}</strong>,</p>
          <p>We are excited to confirm that <strong>${d.studentName}</strong> (Grade ${d.currentGrade}) is officially enrolled in the 8-week ThinkOva AI program at <strong>${d.schoolName}</strong>.</p>
          
          <div style="background: #F4F3EE; border-radius: 10px; padding: 18px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>School Lab Session:</strong> ${d.batchSchedule}</p>
            <p style="margin: 4px 0;"><strong>Lead Tutor:</strong> ${d.tutorName}</p>
            <p style="margin: 4px 0;"><strong>Fee Received:</strong> ${d.amountPaid}</p>
            <p style="margin: 4px 0;"><strong>Order ID:</strong> ${d.orderId}</p>
          </div>

          <p>Classes take place directly in your school's computer lab. Prior to Level 1, you will also receive an invitation to our 30-minute online parent orientation.</p>
          <p style="margin-top: 28px; color: #5F6068; font-size: 13px;">Need assistance? Reply directly to this email or WhatsApp us at +91 96066 26152.</p>
        </div>
      </div>
    `,
  }),

  /**
   * 2. Abandoned Cart Recovery (1 Hour Pending)
   */
  abandonedCart: (d: AbandonedCartData) => ({
    subject: `Complete ${d.studentName}'s ThinkOva registration at ${d.schoolName}`,
    text: `Hi ${d.parentName},\n\nYou started enrolling ${d.studentName} for ThinkOva at ${d.schoolName}. There are only ${d.seatsRemaining} seats remaining in this batch.\n\nComplete checkout here: ${d.checkoutUrl}`,
    html: `
      <div style="${baseStyles}">
        <div style="${cardStyles}">
          <h2 style="color: #0E0F12; margin-top: 0;">Your child's seat is reserved</h2>
          <p>Hi <strong>${d.parentName}</strong>,</p>
          <p>We noticed you started enrolling <strong>${d.studentName}</strong> for the upcoming batch at <strong>${d.schoolName}</strong>, but payment was not finalized.</p>
          
          <div style="border-left: 4px solid #FF6B2C; padding-left: 14px; margin: 20px 0;">
            <p style="margin: 0; color: #5F6068;">Seats are capped at <strong>25 students per lab</strong>. Only <strong>${d.seatsRemaining} seats</strong> currently remain in this batch.</p>
          </div>

          <a href="${d.checkoutUrl}" style="${buttonStyles}">Resume & Complete Enrolment &rarr;</a>
          <p style="margin-top: 24px; font-size: 13px; color: #5F6068;">If you experienced any payment issues or have questions, please feel free to reach out to info@thinkova.ai.</p>
        </div>
      </div>
    `,
  }),

  /**
   * 3. Payment / Enrolment Failure
   */
  paymentFailure: (d: PaymentFailureData) => ({
    subject: `Action Required: Payment attempt for ${d.studentName} was unsuccessful`,
    text: `Hi ${d.parentName},\n\nYour payment of ${d.amount} for ${d.studentName} could not be processed.\nReason: ${d.failureReason}\n\nRetry here: ${d.retryUrl}`,
    html: `
      <div style="${baseStyles}">
        <div style="${cardStyles}">
          <h2 style="color: #D32F2F; margin-top: 0;">Payment Incomplete</h2>
          <p>Hi <strong>${d.parentName}</strong>,</p>
          <p>We were unable to complete your payment of <strong>${d.amount}</strong> for <strong>${d.studentName}</strong>'s ThinkOva enrolment.</p>
          
          <div style="background: #FDE8E8; border-radius: 8px; padding: 14px; margin: 18px 0; color: #9B1C1C;">
            <strong>Bank notice:</strong> ${d.failureReason}
          </div>

          <p>Your child's details are safely saved. You can retry with UPI, NetBanking, or card using the link below:</p>
          <a href="${d.retryUrl}" style="${buttonStyles}">Retry Payment &rarr;</a>
        </div>
      </div>
    `,
  }),

  /**
   * 4. Installment 2 Reminder (3 Days Prior to Level 5)
   */
  installmentReminder: (d: InstallmentReminderData) => ({
    subject: `Reminder: Installment 2 due for ${d.studentName}'s ThinkOva Course (${d.dueDate})`,
    text: `Hi ${d.parentName},\n\n${d.studentName} is reaching Level 5 (${d.levelStartName})! The final installment of ${d.installmentAmount} is due by ${d.dueDate}.\n\nPay online: ${d.paymentUrl}`,
    html: `
      <div style="${baseStyles}">
        <div style="${cardStyles}">
          <h2 style="color: #0E0F12; margin-top: 0;">Installment 2 Reminder</h2>
          <p>Hi <strong>${d.parentName}</strong>,</p>
          <p><strong>${d.studentName}</strong> has completed the foundational levels and is now advancing to Level 5 (<em>${d.levelStartName}</em>) at <strong>${d.schoolName}</strong>!</p>
          
          <div style="background: #F4F3EE; border-radius: 10px; padding: 18px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Installment 2 Amount:</strong> ${d.installmentAmount}</p>
            <p style="margin: 4px 0;"><strong>Due Date:</strong> ${d.dueDate}</p>
          </div>

          <p>To ensure uninterrupted lab access and software licenses for building their AI agent, please complete the second payment:</p>
          <a href="${d.paymentUrl}" style="${buttonStyles}">Pay ${d.installmentAmount} via UPI/Card &rarr;</a>
        </div>
      </div>
    `,
  }),

  /**
   * 5. Refund Notification
   */
  refundNotification: (d: RefundNotificationData) => ({
    subject: `Refund Notice: ${d.refundAmount} initiated for ${d.studentName}`,
    text: `Hi ${d.parentName},\n\nA refund of ${d.refundAmount} has been initiated for ${d.studentName} (Ref: ${d.refundReference}).\nReason: ${d.reason}\nEstimated credit: ${d.estimatedCreditDays}`,
    html: `
      <div style="${baseStyles}">
        <div style="${cardStyles}">
          <h2 style="color: #0E0F12; margin-top: 0;">Refund Initiated</h2>
          <p>Hi <strong>${d.parentName}</strong>,</p>
          <p>This email confirms that a refund of <strong>${d.refundAmount}</strong> has been initiated for <strong>${d.studentName}</strong>.</p>
          
          <div style="background: #F4F3EE; border-radius: 10px; padding: 18px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Refund Amount:</strong> ${d.refundAmount}</p>
            <p style="margin: 4px 0;"><strong>Reference ID:</strong> ${d.refundReference}</p>
            <p style="margin: 4px 0;"><strong>Reason:</strong> ${d.reason}</p>
            <p style="margin: 4px 0;"><strong>Estimated Credit:</strong> Within ${d.estimatedCreditDays} to your original payment method</p>
          </div>

          <p style="font-size: 13px; color: #5F6068;">If the refund is not reflected in your bank account after ${d.estimatedCreditDays}, please contact us at info@thinkova.ai quoting your reference ID.</p>
        </div>
      </div>
    `,
  }),

  /**
   * 6. Weekly Evaluation / Assessment Milestone Report
   */
  weeklyEvaluationReport: (d: WeeklyEvaluationEmailData) => ({
    subject: `🚀 Level ${d.levelNumber} Completed: ${d.studentName}'s Milestone & Project Report`,
    text: `Hi ${d.parentName},\n\nCongratulations! ${d.studentName} has completed Level ${d.levelNumber}: "${d.levelTitle}" at ${d.schoolName}.\n\nProject Built: ${d.projectCreated}\nTutor Feedback: "${d.tutorFeedback}"\n\nView interactive report & code: ${d.reportUrl}`,
    html: `
      <div style="${baseStyles}">
        <div style="${cardStyles}">
          <div style="display: inline-block; background-color: #FEF3C7; color: #D97706; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; margin-bottom: 12px; text-transform: uppercase;">
            Milestone Achieved 🚀
          </div>
          <h2 style="color: #0E0F12; margin-top: 0;">Level ${d.levelNumber}: ${d.levelTitle}</h2>
          <p>Hi <strong>${d.parentName}</strong>,</p>
          <p>We are excited to share that <strong>${d.studentName}</strong> successfully finished this week's in-school AI lab session at <strong>${d.schoolName}</strong>!</p>
          
          <div style="background: #F4F3EE; border-radius: 10px; padding: 18px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Project Built:</strong> 💻 ${d.projectCreated}</p>
            ${d.tutorName ? `<p style="margin: 4px 0;"><strong>Lab Tutor:</strong> ${d.tutorName}</p>` : ""}
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #D0D0D5;">
              <p style="margin: 4px 0; font-style: italic; color: #374151;">"${d.tutorFeedback}"</p>
            </div>
          </div>

          <p>You can view their working interactive project, code repository, and weekly badge on their personal learner portal:</p>
          <a href="${d.reportUrl}" style="${buttonStyles}">View Student Milestone Showcase &rarr;</a>

          <p style="font-size: 13px; color: #5F6068; margin-top: 24px;">Need assistance or have questions for the lab tutor? Contact us at info@thinkova.ai.</p>
        </div>
      </div>
    `,
  }),
};

