<<<<<<< HEAD
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnrolSuccessView } from "@/components/sections/EnrolSuccessView";
import { dbManager } from "../../../backend/database/client";
import { cashfreeClient } from "../../../backend/payments/cashfree";
import { defaultDispatcher } from "../../../backend/notifications/dispatcher";
import { emailTemplates } from "../../../backend/templates/email-templates";
import { whatsappTemplates } from "../../../backend/templates/whatsapp-templates";

export const metadata = {
  title: "Enrolment Complete · ThinkOva",
  description: "Your child is enrolled in ThinkOva.",
};

interface EnrolledPageProps {
  searchParams?: Promise<{
    name?: string;
    childName?: string;
    email?: string;
    parentEmail?: string;
    schoolCode?: string;
    school?: string;
    plan?: "full" | "parts";
    order_id?: string;
    orderRef?: string;
  }>;
}

export default async function EnrolledPage({ searchParams }: EnrolledPageProps) {
  const params = await searchParams;
  let child = params?.childName || params?.name || "Your child";
  let email = params?.email || params?.parentEmail || "your email";
  let plan: "full" | "parts" = params?.plan === "parts" ? "parts" : "full";
  let schoolCode = params?.schoolCode || params?.school;
  const orderRef = params?.orderRef || params?.order_id;

  if (orderRef) {
    const order = await dbManager.commerce.getOrderById(orderRef);
    if (order) {
      const enrollment = await dbManager.commerce.getEnrollmentById(order.enrollmentId);
      const student = enrollment ? await dbManager.commerce.getStudentById(enrollment.studentId) : null;
      const user = await dbManager.commerce.getUserById(order.userId);
      if (student) child = student.fullName;
      if (user) email = user.email;
      if (enrollment) {
        schoolCode = enrollment.schoolUid;
        plan = enrollment.paymentPlan === "INSTALLMENTS" ? "parts" : "full";
      }

      if (order.status !== "PAID" && cashfreeClient.isConfigured()) {
        try {
          const cfOrder = await cashfreeClient.getOrder(orderRef);
          if (cfOrder.orderStatus === "PAID") {
            await dbManager.commerce.updateOrderStatus(orderRef, "PAID");
            if (enrollment) {
              await dbManager.commerce.updateEnrollmentStatus(enrollment.id, "ENROLLED");
            }
            if (user && student) {
              const emailContent = emailTemplates.enrolmentSuccess({
                parentName: user.username || "Parent",
                studentName: student.fullName,
                currentGrade: student.currentGrade,
                schoolName: student.schoolUid,
                batchSchedule: "Weekly Computer Lab Sessions",
                tutorName: "Assigned ThinkOva Mentor",
                amountPaid: `₹${(order.amountInPaise / 100).toLocaleString("en-IN")}`,
                orderId: order.id,
              });
              await defaultDispatcher.sendEmail({
                to: user.email,
                subject: emailContent.subject,
                html: emailContent.html,
                text: emailContent.text,
              });

              const wa = whatsappTemplates.enrolmentConfirmed({
                parentPhone: user.phone,
                parentName: user.username || "Parent",
                studentName: student.fullName,
                schoolName: student.schoolUid,
                grade: student.currentGrade,
                orderId: order.id,
                amountPaid: `₹${(order.amountInPaise / 100).toLocaleString("en-IN")}`,
                startDate: "the upcoming Saturday batch",
              });
              await defaultDispatcher.sendWhatsApp({
                to: user.phone,
                templateName: "thinkova_enrolment_confirmed",
                fallbackText: wa.fallbackText,
              });
            }
          }
        } catch (e) {
          console.warn("[EnrolledPage] Verification sync notice:", e);
        }
      }
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)] bg-[#fbf9f5] flex items-center justify-center">
        <EnrolSuccessView
          childName={child}
          payPlan={plan}
          email={email}
          schoolCode={schoolCode}
          orderRef={orderRef}
        />
      </main>
      <Footer />
    </>
  );
}
=======
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnrolSuccessView } from "@/components/sections/EnrolSuccessView";

export const metadata = {
  title: "Enrolment Complete · LvlUp",
  description: "Your child is enrolled in LvlUp.",
};

export default function EnrolledPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)] bg-[#fbf9f5] flex items-center justify-center">
        <EnrolSuccessView childName="Aarav" payPlan="full" email="you@example.com" />
      </main>
      <Footer />
    </>
  );
}
>>>>>>> 0c48af08a90a288c46f1d0057cb12d934026860b
