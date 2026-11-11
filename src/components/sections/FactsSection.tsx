"use client";

import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const metrics = [
  {
    num: "36",
    sub: "of 38",
    label: "children in our pilot term showed a working project at demo day",
  },
  {
    num: "94",
    sub: "%",
    label: "average attendance across the term",
  },
  {
    num: "1",
    sub: "tutor",
    label: "trained and background-checked, in every class",
  },
  {
    num: "4",
    sub: "schools",
    label: "in Pune running Thinkova this year",
  },
];

export function FactsSection() {
  return (
    <section aria-label="Proof strip" className="w-full border-t border-b border-white/[0.08] bg-[#0B0C0F] py-14 text-white">
      <Container>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {metrics.map((m, i) => (
            <ScrollReveal key={m.label} delay={i * 80}>
              <div className="group relative rounded-2xl border border-white/10 bg-[#12141A] p-6 transition-all duration-300 hover:border-[#FF6B2C]/40 hover:bg-[#161820] sm:p-7">
                {/* Orange line that extends on card hover with smooth animation */}
                <div className="h-1 w-7 rounded-full bg-[#FF6B2C] transition-all duration-500 ease-out group-hover:w-20 group-hover:bg-[#FF8B4E] group-hover:shadow-[0_0_12px_rgba(255,107,44,0.8)]" />
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-[38px] font-normal tracking-tight text-white sm:text-[44px]">
                    {m.num}
                  </span>
                  <span className="text-[17px] font-medium text-white/60">{m.sub}</span>
                </div>
                <p className="mt-3 text-xs leading-[20px] text-white/60 sm:text-sm sm:leading-[22px]">
                  {m.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
