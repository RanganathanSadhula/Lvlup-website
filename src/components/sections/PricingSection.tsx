"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pricing } from "@/data/content";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [plan, setPlan] = useState<"full" | "parts">("full");

  return (
    <Section id="fees" tone="light" aria-labelledby="fees-title" className="pb-8 sm:pb-10 lg:pb-12">
      <div
        aria-hidden
        className="bg-chevrons pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_40%,transparent)]"
      />
      <Container className="relative">
        <SectionHeader
          id="fees-title"
          title={<>One course. Everything included.</>}
          description="Two ways to pay for the same course. Paying in full costs less. No hidden extras, no countdown timers."
        />

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          {/* Main Pricing Card */}
          <ScrollReveal delay={80}>
            <article className="overflow-hidden rounded-3xl border-t-2 border-t-brand bg-gradient-to-b from-[#181920] to-[#121318] p-6 text-white shadow-2xl sm:p-8 lg:p-9">
            <p className="font-mono text-xs text-muted-dark">LvlUp · all 8 levels</p>

            <div className="mt-3 flex items-center gap-2.5">
              <span className="text-sm text-muted-dark">
                Standard fee <span className="line-through">₹15,000</span>
              </span>
              <span className="inline-block rounded-full bg-[#109e58] px-2.5 py-0.5 text-[11px] font-bold text-white">
                Up to 70% off
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
              <span className="font-display text-[64px] font-normal leading-none tracking-[-0.03em] sm:text-[76px]">
                {plan === "full" ? "₹4,499" : "₹4,999"}
              </span>
              <span className="text-sm text-muted-dark">
                {plan === "full" ? "with your school code, paid in full" : "with your school code, paid in two parts"}
              </span>
            </div>

            {/* Dynamic Interactive Selectable Payment Options */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Option 1: Pay in full */}
              <button
                type="button"
                onClick={() => setPlan("full")}
                className={cn(
                  "flex flex-col justify-between rounded-2xl p-4 text-left transition-all duration-200 border",
                  plan === "full"
                    ? "border-brand bg-[#1f2028] shadow-md ring-1 ring-brand/30"
                    : "border-white/10 bg-[#16171e] hover:border-white/20"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                        plan === "full" ? "border-brand" : "border-white/40"
                      )}
                    >
                      {plan === "full" && <span className="size-2 rounded-full bg-brand" />}
                    </span>
                    <span className="text-sm font-semibold text-white">Pay in full</span>
                  </div>
                  <span className="rounded-md bg-[#109e58] px-2 py-0.5 text-[10px] font-bold text-white">
                    Save ₹500
                  </span>
                </div>
                <div className="mt-3">
                  <span className="block text-[24px] font-bold leading-none text-white">₹4,499</span>
                  <span className="mt-1 block text-xs text-muted-dark">One payment when you enrol</span>
                </div>
              </button>

              {/* Option 2: Pay in two parts */}
              <button
                type="button"
                onClick={() => setPlan("parts")}
                className={cn(
                  "flex flex-col justify-between rounded-2xl p-4 text-left transition-all duration-200 border",
                  plan === "parts"
                    ? "border-brand bg-[#1f2028] shadow-md ring-1 ring-brand/30"
                    : "border-white/10 bg-[#16171e] hover:border-white/20"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                        plan === "parts" ? "border-brand" : "border-white/40"
                      )}
                    >
                      {plan === "parts" && <span className="size-2 rounded-full bg-brand" />}
                    </span>
                    <span className="text-sm font-semibold text-white">Pay in two parts</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="block text-[24px] font-bold leading-none text-white">₹4,999</span>
                  <span className="mt-1 block text-xs text-muted-dark">₹2,500 now, ₹2,499 by level 5</span>
                </div>
              </button>
            </div>

            {/* Inclusions List */}
            <ul className="mt-7 space-y-3.5">
              {pricing.inclusions.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] leading-snug text-white">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-brand text-ink"
                  >
                    <Check className="size-2.5" strokeWidth={4} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            {/* Dynamic CTA Button */}
            <a
              href={siteConfig.enrolUrl}
              className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-center text-[15px] font-bold text-ink shadow-glow transition-all duration-200 transform-gpu hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,107,44,0.4)] active:scale-[0.96] active:translate-y-0 cursor-pointer"
            >
              <span>{plan === "full" ? "Enrol and pay ₹4,499" : "Enrol and pay ₹2,500 now"}</span>
              <ArrowRight className="size-4" />
            </a>

            <p className="mt-4 text-xs leading-relaxed text-muted-dark">
              Partner school prices. Pay by UPI, card or net banking. Fees are paid to LvlUp, not to your school.
            </p>
            </article>
          </ScrollReveal>

          {/* Right Column: Our Promise & What You Won't Pay For */}
          <ScrollReveal delay={160}>
            <div className="space-y-5">
              <article className="rounded-3xl bg-[#ffe2d4] p-6 sm:p-8 text-ink">
                <p className="font-mono text-xs text-ink/70">Our promise</p>
                <h3 className="mt-4 font-display text-[24px] font-bold leading-[1.25] tracking-[-0.02em] sm:text-[28px]">
                  {pricing.promiseTitle}
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {pricing.promisePoints.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[15px] leading-snug">
                      <span
                        aria-hidden
                        className="mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-brand text-ink"
                      >
                        <Check className="size-2.5" strokeWidth={4} />
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <aside className="rounded-2xl border border-black/[0.08] bg-white/50 p-6 sm:p-7 backdrop-blur-sm">
                <h3 className="text-[15px] font-semibold text-ink">What you won’t pay for</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  A laptop at home, extra kits, app subscriptions or a certificate fee. Classes use your school’s computer lab.
                </p>
              </aside>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  );
}
