import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnrolSuccessView } from "@/components/sections/EnrolSuccessView";

export const metadata = {
  title: "Enrolment Complete · LvlUp",
  description: "Your child is enrolled in LvlUp.",
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
  const child = params?.childName || params?.name || "Your child";
  const email = params?.email || params?.parentEmail || "your email";
  const plan = params?.plan === "parts" ? "parts" : "full";
  const schoolCode = params?.schoolCode || params?.school;
  const orderRef = params?.orderRef || params?.order_id;

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
