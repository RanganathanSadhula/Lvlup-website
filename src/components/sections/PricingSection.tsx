"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [feePlan, setFeePlan] = useState<"full" | "installments">("full");

  const scrollToEnrol = () => {
    const el = document.getElementById("enrol");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="fees" aria-labelledby="fees-title" className="w-full bg-[#F4F3EE] py-24 text-[#0B0C0F]">
      <Container>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <h2
            id="fees-title"
            className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F] sm:text-[44px]"
          >
            One fee per course. Kits and
            <br />
            tools included.
          </h2>
          <p className="max-w-[420px] text-sm leading-[22px] text-[#5A5F6B]">
            Partner-school fees, paid to ThinkOva. Pay in full, or in two parts for ₹500 more.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Fee Card (Cols 1-6) */}
          <div className="col-span-1 rounded-3xl bg-[#0B0C0F] p-8 text-white shadow-2xl sm:p-10 lg:col-span-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              EXAMPLE · ROBOTICS STARTER: BUILD A ROVER
            </span>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-[48px] sm:text-[56px] font-normal text-white">
                {feePlan === "full" ? "₹5,499" : "₹5,999"}
              </span>
              <span className="text-xs sm:text-sm text-white/60">for all 6 weeks, kit included</span>
            </div>

            {/* Payment Switcher - Fixed Layout & Proportions matching Image 5 */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Pay in full */}
              <div
                onClick={() => setFeePlan("full")}
                className={cn(
                  "flex flex-col justify-between min-h-[120px] cursor-pointer rounded-2xl border p-5 transition-all duration-200",
                  feePlan === "full"
                    ? "border-[#FF6B2C] bg-[#FF6B2C]/10 ring-1 ring-[#FF6B2C] shadow-lg"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-bold text-white">Pay in full</span>
                  <span className="shrink-0 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    Save ₹500
                  </span>
                </div>
                <div className="mt-3 text-[26px] font-bold tracking-tight text-white leading-none">
                  ₹5,499
                </div>
                <p className="mt-2 text-xs text-white/60 leading-normal">
                  One payment when you enrol
                </p>
              </div>

              {/* Two parts */}
              <div
                onClick={() => setFeePlan("installments")}
                className={cn(
                  "flex flex-col justify-between min-h-[120px] cursor-pointer rounded-2xl border p-5 transition-all duration-200",
                  feePlan === "installments"
                    ? "border-[#FF6B2C] bg-[#FF6B2C]/10 ring-1 ring-[#FF6B2C] shadow-lg"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-bold text-white">Two parts</span>
                </div>
                <div className="mt-3 text-[26px] font-bold tracking-tight text-white leading-none">
                  ₹5,999
                </div>
                <p className="mt-2 text-xs text-white/60 leading-normal">
                  ₹3,000 now, ₹2,999 by week 4
                </p>
              </div>
            </div>

            {/* Inclusions */}
            <ul className="mt-8 space-y-3.5 border-t border-white/10 pt-6">
              {[
                "6 tutor-led classes in your school's lab",
                "Rover kit, tools and all materials",
                "A progress update every two weeks",
                "Demo day and a digital portfolio",
              ].map((inc, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                  <Check className="size-4 text-[#FF6B2C] stroke-[2.5]" />
                  {inc}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={scrollToEnrol}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#E05316] py-3.5 text-center text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Enrol in this course →
            </button>
          </div>

          {/* Right Side: Track Price Table & Refund Promise (Cols 7-12) */}
          <div className="col-span-1 flex flex-col justify-between gap-6 lg:col-span-6">
            {/* Fee Table */}
            <div className="rounded-3xl border border-[#E3E1D9] bg-white p-8 shadow-sm">
              <div className="space-y-4">
                {[
                  { track: "Robotics", price: "₹5,499 – ₹6,999" },
                  { track: "Electronics & IoT", price: "₹4,999 – ₹6,499" },
                  { track: "AI & Agents", price: "₹4,499 – ₹5,499" },
                  { track: "Game Design", price: "₹3,999 – ₹4,999" },
                  { track: "Product & 3D Design", price: "₹3,999 – ₹5,999" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-[#EAE8E1] pb-4 last:border-none last:pb-0"
                  >
                    <span className="text-[15px] font-semibold text-[#0B0C0F]">
                      {row.track}
                    </span>
                    <span className="font-mono text-[15px] font-semibold text-[#0B0C0F]">
                      {row.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Promise Card */}
            <div className="rounded-3xl border border-[#FF6B2C]/30 bg-[#FEEFEA] p-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B2C]">
                OUR PROMISE
              </span>
              <p className="mt-3 text-[16px] leading-[26px] font-medium text-[#0B0C0F]">
                Come to at least 3 in 4 classes. If your child can’t show a working project at
                demo day, we refund half the fee within 7 working days.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
