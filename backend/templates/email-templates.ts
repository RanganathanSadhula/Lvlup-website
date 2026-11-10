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

export interface PrincipalEmailData {
  principalName?: string;
  schoolName?: string;
  city?: string;
  role?: string;
  replyUrl?: string;
  siteUrl?: string;
}

/**
 * Normalizes and formats the principal salutation dynamically from the school registry.
 * E.g.:
 * - "Priya Sharma", role: "Principal" -> "Dear Principal Sharma,"
 * - "Dr. Anita Desai", role: "Principal" -> "Dear Principal Dr. Anita Desai,"
 * - "Sunil Mehta", role: "Vice Principal" -> "Dear Vice Principal Mehta,"
 * - "Priya", role: "Principal" -> "Dear Principal Priya,"
 * - Fallback / blank -> "Dear Principal,"
 */
export function formatPrincipalSalutation(rawName?: string, rawRole?: string): string {
  const name = (rawName || "").trim();
  const role = (rawRole || "Principal").trim().toLowerCase();

  if (!name) return "Dear Principal,";

  // If name already starts with Principal
  if (/^principal\b/i.test(name)) {
    return `Dear ${name},`;
  }

  const isVice = role.includes("vice");
  const prefix = isVice ? "Vice Principal" : role.includes("coordinator") ? "Coordinator" : "Principal";

  const parts = name.split(/\s+/);
  if (parts.length > 1) {
    const firstWord = (parts[0] || "").replace(/\./g, "").toLowerCase();
    if (["dr", "prof", "mr", "ms", "mrs"].includes(firstWord)) {
      return `Dear ${prefix} ${parts.join(" ")},`;
    }
    const lastName = parts[parts.length - 1] || name;
    return `Dear ${prefix} ${lastName},`;
  }

  return `Dear ${prefix} ${name},`;
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

  /**
   * 7. Principal Outreach & Capstone Program Invitation
   * Fully responsive email matching the design specification with dynamic principal name & school.
   */
  principalOutreach: (d: PrincipalEmailData) => {
    const salutation = formatPrincipalSalutation(d.principalName, d.role);
    const siteUrl = (d.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://www.thinkova.ai").replace(/\/$/, "");
    const replyUrl = d.replyUrl || `mailto:info@thinkova.ai?subject=${encodeURIComponent(`Exploring Pilot Cohort - ${d.schoolName || "Our School"}`)}`;

    const imageHeroUrl = `${siteUrl}/images/email/principal-hero-student.png`;
    const imageCaseStudyUrl = `${siteUrl}/images/email/principal-case-study.jpg`;
    const imageGirlRobotUrl = `${siteUrl}/images/email/principal-generative-ai-girl.png`;

    const schoolSubjectPart = d.schoolName ? `for ${d.schoolName}` : "for Grades 5–12";
    const subject = `From traditional thinking to innovation thinking: A capstone program ${schoolSubjectPart}`;

    const text = `${salutation}\n\n` +
      `Your students${d.schoolName ? ` at ${d.schoolName}` : ""} are trained well in traditional thinking: learn the concept, practise it, find the right answer. That foundation matters. But the world they are entering also asks a different question: what problem can you solve, and how?\n\n` +
      `Traditional thinking -> Innovation thinking:\n` +
      `• Finding the right answer -> Asking the right question\n` +
      `• Learning a concept -> Applying it to a real problem\n` +
      `• Avoiding mistakes -> Testing, failing and improving\n` +
      `• Using technology -> Building with technology, safely and responsibly\n\n` +
      `That is ThinkOva's Innovation & Capstone Program. It is designed with mentors from MIT, the IITs and the IIMs, and it combines the discipline of traditional thinking with AI innovation thinking.\n\n` +
      `How it works:\n` +
      `• Two age-appropriate tracks: Junior Innovators (Grades 5–8) and Senior Innovators (Grades 9–12)\n` +
      `• 8 weeks, ending in a live capstone showcase for parents\n` +
      `• After school, in your existing computer lab, led by an expert ThinkOva mentor, so there is no load on your teachers\n` +
      `• Safe by design: ThinkOva-managed accounts only, with no personal emails or unmonitored browsing\n` +
      `• Aligned with the CBSE curriculum\n` +
      `• We handle parent enrolment, consent forms and weekly updates\n\n` +
      `We are planning a small number of pilot batches this term.\n` +
      `Could we have 10 minutes to explore a pilot cohort at ${d.schoolName || "your school"}? Simply reply with a day and time that suits you, and we will work around your school calendar.\n\n` +
      `Reply directly to this email or book a slot: ${replyUrl}\n\n` +
      `Warm regards,\n` +
      `Sumit Sharma\n` +
      `Strategic Partnerships, ThinkOva\n` +
      `+91 96066 26152 | info@thinkova.ai | thinkova.ai`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F7F4; margin: 0; padding: 24px 12px; color: #111111; line-height: 1.5;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #EAE8E2;">
          
          <!-- ── 1. HEADER & HERO SECTION ── -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <!-- Brand Logo -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="padding-bottom: 20px;">
                    <span style="font-size: 20px; font-weight: 800; color: #0E0F12; letter-spacing: -0.03em;">
                      <span style="color: #FF5520; font-size: 22px; margin-right: 2px;">&#9650;</span>thinkova
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Header Grid: Headline + Hero Graphic -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="middle" style="width: 58%; padding-right: 12px;">
                    <h1 style="font-size: 22px; font-weight: 700; line-height: 1.25; color: #0E0F12; margin: 0; letter-spacing: -0.02em;">
                      From traditional thinking to innovation thinking: A capstone program for Grades 5&ndash;12
                    </h1>
                  </td>
                  <td valign="middle" align="right" style="width: 42%;">
                    <img src="${imageHeroUrl}" alt="ThinkOva Innovation Program Student" width="220" style="width: 100%; max-width: 220px; height: auto; display: block;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── 2. SALUTATION & CORE COPY ── -->
          <tr>
            <td style="padding: 12px 32px 20px 32px;">
              <p style="font-size: 15px; font-weight: 700; color: #0E0F12; margin: 0 0 16px 0;">
                ${salutation}
              </p>

              <p style="font-size: 14px; line-height: 1.6; color: #2A2B33; margin: 0 0 18px 0;">
                Your students${d.schoolName ? ` at <strong>${d.schoolName}</strong>` : ""} are trained well in traditional thinking: learn the concept, practise it, find the right answer. That foundation matters. But the world they are entering also asks a different question: what problem can you solve, and how?
              </p>

              <!-- Comparison Heading -->
              <p style="color: #FF5520; font-weight: 700; font-size: 14.5px; margin: 18px 0 10px 0;">
                Traditional thinking &rarr; Innovation thinking
              </p>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="font-size: 13.5px; line-height: 1.8; color: #2A2B33; padding-left: 6px;">
                    &bull; <strong>Finding the right answer</strong> &rarr; Asking the right question<br/>
                    &bull; <strong>Learning a concept</strong> &rarr; Applying it to a real problem<br/>
                    &bull; <strong>Avoiding mistakes</strong> &rarr; Testing, failing and improving<br/>
                    &bull; <strong>Using technology</strong> &rarr; Building with technology, safely and responsibly
                  </td>
                </tr>
              </table>

              <!-- ── 3. CASE STUDY GRAPHIC (IMAGE 3) ── -->
              <div style="margin: 22px 0;">
                <img src="${imageCaseStudyUrl}" alt="Ananya Grade 6 and Rohan Grade 11 Case Study" width="516" style="width: 100%; max-width: 516px; height: auto; display: block; border-radius: 12px;" />
              </div>

              <!-- Paragraph 2 -->
              <p style="font-size: 14px; line-height: 1.6; color: #2A2B33; margin: 20px 0 18px 0;">
                That is Thinkova's Innovation &amp; Capstone Program. It is designed with mentors from MIT, the IITs and the IIMs, and it combines the discipline of traditional thinking with AI innovation thinking.
              </p>

              <!-- How it works -->
              <p style="color: #FF5520; font-weight: 700; font-size: 14.5px; margin: 18px 0 10px 0;">
                How it works:
              </p>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                <tr>
                  <td style="font-size: 13.5px; line-height: 1.75; color: #2A2B33; padding-left: 6px;">
                    &bull; <strong>Two age-appropriate tracks:</strong> Junior Innovators (Grades 5&ndash;8) and Senior Innovators (Grades 9&ndash;12)<br/>
                    &bull; <strong>8 weeks,</strong> ending in a live capstone showcase for parents<br/>
                    &bull; <strong>After school, in your existing computer lab,</strong> led by an expert Thinkova mentor, so there is no load on your teachers<br/>
                    &bull; <strong>Safe by design:</strong> Thinkova-managed accounts only, with no personal emails or unmonitored browsing<br/>
                    &bull; <strong>Aligned with the CBSE curriculum</strong><br/>
                    &bull; <strong>We handle parent enrolment, consent forms and weekly updates</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── 4. TIMELINE & IMAGE 4 BANNER ── -->
          <tr>
            <td style="padding: 0 24px 20px 24px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FF5520; border-radius: 14px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px 20px 16px 20px; text-align: center;">
                    <h2 style="font-size: 17.5px; font-weight: 700; color: #FFFFFF; margin: 0 0 16px 0;">
                      Thinkova runs an 8-week hands-on AI program for Grades 5&ndash;8
                    </h2>

                    <!-- Stepper Bar -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto 16px auto; max-width: 440px;">
                      <tr>
                        ${[1, 2, 3, 4, 5, 6, 7].map((num) => `
                          <td align="center" style="width: 12%;">
                            <div style="width: 24px; height: 24px; line-height: 24px; border-radius: 50%; background-color: #0E0F12; color: #FFFFFF; font-size: 11px; font-weight: 700;">${num}</div>
                          </td>
                        `).join("")}
                        <td align="center" style="width: 16%;">
                          <div style="width: 26px; height: 26px; line-height: 26px; border-radius: 50%; background-color: #FFFFFF; color: #0E0F12; font-size: 11px; font-weight: 800;">8</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="4" align="left" style="padding-top: 6px; font-size: 10px; color: rgba(255,255,255,0.85); font-weight: 600;">Week 1</td>
                        <td colspan="4" align="right" style="padding-top: 6px; font-size: 10px; color: #FFFFFF; font-weight: 700;">Week 8: live classes</td>
                      </tr>
                    </table>

                    <!-- Split: Image 4 + Highlight Text -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 14px;">
                      <tr>
                        <td valign="middle" align="center" style="width: 45%;">
                          <img src="${imageGirlRobotUrl}" alt="Generative AI for Students" width="190" style="width: 100%; max-width: 190px; height: auto; display: block;" />
                        </td>
                        <td valign="middle" align="left" style="width: 55%; padding-left: 10px;">
                          <div style="font-size: 20px; font-weight: 700; color: #0E0F12; line-height: 1.25;">
                            Generative AI is now part of students'<br/>
                            <span style="background-color: #FFFFFF; color: #0E0F12; padding: 4px 10px; border-radius: 6px; display: inline-block; margin-top: 6px; font-size: 19px; font-weight: 800;">daily lives.</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── 5. DARK BLACK CALL TO ACTION SECTION ── -->
          <tr>
            <td style="padding: 0 24px 28px 24px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0E0F12; border-radius: 14px; overflow: hidden;">
                <tr>
                  <td style="padding: 30px 24px 26px 24px; text-align: left;">
                    <!-- Pill Tag -->
                    <div style="display: inline-block; background-color: #FF8A4C; color: #0E0F12; font-size: 10.5px; font-weight: 800; letter-spacing: 0.05em; padding: 3px 10px; border-radius: 999px; text-transform: uppercase;">
                      PILOT BATCHES THIS TERM
                    </div>

                    <!-- Heading -->
                    <h2 style="font-size: 20px; font-weight: 700; color: #FF6B2C; line-height: 1.3; margin: 14px 0 12px 0;">
                      We are planning a small number of pilot batches this term.
                    </h2>

                    <!-- Body -->
                    <p style="font-size: 13.5px; line-height: 1.6; color: rgba(255, 255, 255, 0.85); margin: 0 0 20px 0;">
                      We are opening a small number of pilot batches this term. Could we have 10 minutes to explore a pilot cohort at ${d.schoolName || "your school"}? Simply reply with a day and time that suits you, and we will work around your school calendar. I am also happy to send the program outline for both tracks beforehand.
                    </p>

                    <!-- CTA Button -->
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 8px; background-color: #FF6B2C;">
                          <a href="${replyUrl}" target="_blank" style="font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; padding: 13px 26px; border-radius: 8px; display: inline-block;">
                            Reply with a day and time &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Dashed Delegation Box -->
                    <div style="border: 1px dashed rgba(255, 255, 255, 0.25); border-radius: 8px; padding: 12px 14px; margin: 22px 0 20px 0; font-size: 12px; color: rgba(255, 255, 255, 0.65); line-height: 1.5;">
                      <strong style="color: #FF8A4C;">Not the right person?</strong> If you are not the right person for this, I would be grateful if you could pass it on to the Principal.
                    </div>

                    <!-- Sign-off Block -->
                    <p style="font-size: 13px; color: rgba(255, 255, 255, 0.75); margin: 0 0 10px 0;">
                      Warm regards,
                    </p>

                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="middle" style="width: 44px;">
                          <div style="width: 38px; height: 38px; line-height: 38px; text-align: center; border-radius: 50%; background-color: #FF5520; color: #FFFFFF; font-size: 13px; font-weight: 800;">
                            SS
                          </div>
                        </td>
                        <td valign="middle" style="padding-left: 10px;">
                          <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; line-height: 1.2;">Sumit Sharma</div>
                          <div style="font-size: 11.5px; color: rgba(255, 255, 255, 0.65); line-height: 1.3;">Strategic Partnerships, Thinkova</div>
                        </td>
                        <td valign="middle" align="right" style="font-size: 11.5px; color: rgba(255, 255, 255, 0.85); line-height: 1.4;">
                          +91 96066 26152<br/>
                          <a href="mailto:info@thinkova.ai" style="color: #FF8A4C; text-decoration: none;">info@thinkova.ai</a> | <a href="https://www.thinkova.ai" style="color: #FF8A4C; text-decoration: none;">thinkova.ai</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── 6. FOOTER ── -->
          <tr>
            <td style="padding: 16px 32px 28px 32px; text-align: center; border-top: 1px solid #EAE8E2;">
              <span style="font-size: 16px; font-weight: 800; color: #0E0F12; letter-spacing: -0.02em;">
                <span style="color: #FF5520; font-size: 18px; margin-right: 2px;">&#9650;</span>thinkova
              </span>
              <p style="font-size: 11.5px; color: #787985; line-height: 1.5; margin: 10px auto 0 auto; max-width: 460px;">
                An 8-week AI program for Grades 5&ndash;8, taught by trained tutors at your school. You are receiving this because we think it may be useful for your school. Reply STOP at any time, or <a href="#" style="color: #787985; text-decoration: underline;">unsubscribe</a>.
              </p>
            </td>
          </tr>

        </table>
      </div>
    `;

    return { subject, text, html };
  },
};

