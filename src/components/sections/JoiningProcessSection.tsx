"use client";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function JoiningProcessSection() {
  const steps = [
    {
      step: "STEP 1",
      title: "Get your school code",
      desc: "In your school's circular or WhatsApp message.",
      dark: false,
    },
    {
      step: "STEP 2",
      title: "Choose a course",
      desc: "See every course running at your school, by track and grade.",
      dark: false,
    },
    {
      step: "STEP 3",
      title: "Enrol and pay",
      desc: "Pay in full, or in two parts for ₹500 more.",
      dark: false,
    },
    {
      step: "STEP 4",
      title: "Meet us online",
      desc: "A 30-minute parent session before the first class.",
      dark: false,
    },
    {
      step: "STEP 5",
      title: "Build each week",
      desc: "One class a week, and a tutor update every two weeks.",
      dark: false,
    },
    {
      step: "STEP 6",
      title: "Demo day",
      desc: "Your child shows you what they built, working, at school.",
      dark: true,
    },
  ];

  return (
    <section id="process" aria-labelledby="process-title" className="w-full bg-[#F4F3EE] py-20 text-[#0B0C0F]">
      <Container>
        <h2
          id="process-title"
          className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F] sm:text-[44px]"
        >
          Six steps from your school&apos;s message to
          <br className="hidden sm:block" /> demo day.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {steps.map((st) => (
            <div
              key={st.step}
              className={cn(
                "flex flex-col justify-between rounded-2xl p-6 transition shadow-sm",
                st.dark
                  ? "bg-[#0B0C0F] text-white shadow-xl"
                  : "border border-[#E3E1D9] bg-white hover:border-[#D1CFC7]"
              )}
            >
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF6B2C]">
                  {st.step}
                </span>
                <h3
                  className={cn(
                    "mt-3 text-[16px] font-semibold",
                    st.dark ? "text-white" : "text-[#0B0C0F]"
                  )}
                >
                  {st.title}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-xs leading-[18px]",
                    st.dark ? "text-white/60" : "text-[#5A5F6B]"
                  )}
                >
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
