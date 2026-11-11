"use client";

import { Check, X } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function AudienceSection() {
  return (
    <section id="grade-fit" aria-labelledby="fit-title" className="w-full bg-[#F4F3EE] py-24 text-[#0B0C0F]">
      <Container>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <h2
            id="fit-title"
            className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F] sm:text-[44px]"
          >
            The same courses, pitched at
            <br />
            the right level.
          </h2>
          <p className="max-w-[420px] text-sm leading-[22px] text-[#5A5F6B]">
            Younger children build from kits and templates. Older ones plan, code and test on
            their own. Every course starts from zero.
          </p>
        </div>

        {/* 4 Grade Bands */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Band 1: 5-6 */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#E3E1D9] bg-white p-7 shadow-sm transition hover:border-[#D1CFC7] hover:shadow-md">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[38px] font-normal text-[#0B0C0F]">
                  5–6
                </span>
                <span className="text-xs font-medium text-[#5A5F6B]">Grades</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-[#0B0C0F]">Guided builds</h3>
              <p className="mt-1 text-xs leading-[18px] text-[#5A5F6B]">
                Kits and step-by-step templates
              </p>

              <div className="mt-6 border-t border-[#EAE8E1] pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B2C]">
                  THEY MIGHT BUILD
                </span>
                <ul className="mt-2.5 space-y-2 text-xs text-[#0B0C0F]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#FF6B2C]">→</span> A rover that follows a line
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#FF6B2C]">→</span> A game level on paper, then on
                    screen
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Band 2: 7-8 */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#E3E1D9] bg-white p-7 shadow-sm transition hover:border-[#D1CFC7] hover:shadow-md">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[38px] font-normal text-[#0B0C0F]">
                  7–8
                </span>
                <span className="text-xs font-medium text-[#5A5F6B]">Grades</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-[#0B0C0F]">More logic</h3>
              <p className="mt-1 text-xs leading-[18px] text-[#5A5F6B]">
                Plan, test and fix their own work
              </p>

              <div className="mt-6 border-t border-[#EAE8E1] pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B2C]">
                  THEY MIGHT BUILD
                </span>
                <ul className="mt-2.5 space-y-2 text-xs text-[#0B0C0F]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#FF6B2C]">→</span> A sensor alarm for the classroom
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#FF6B2C]">→</span> An AI study helper with rules
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Band 3: 9-10 */}
          <div className="flex flex-col justify-between rounded-3xl border border-[#E3E1D9] bg-white p-7 shadow-sm transition hover:border-[#D1CFC7] hover:shadow-md">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[38px] font-normal text-[#0B0C0F]">
                  9–10
                </span>
                <span className="text-xs font-medium text-[#5A5F6B]">Grades</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-[#0B0C0F]">Independent</h3>
              <p className="mt-1 text-xs leading-[18px] text-[#5A5F6B]">
                Real tools and their own idea
              </p>

              <div className="mt-6 border-t border-[#EAE8E1] pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B2C]">
                  THEY MIGHT BUILD
                </span>
                <ul className="mt-2.5 space-y-2 text-xs text-[#0B0C0F]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#FF6B2C]">→</span> A plant-watering system
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#FF6B2C]">→</span> A 3D-printed product prototype
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Band 4: 11 (Orange Card) */}
          <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#FF6B2C] to-[#E05316] p-7 text-white shadow-xl">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[38px] font-normal text-white">11</span>
                <span className="text-xs font-medium text-white/80">Grade</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">Portfolio-ready</h3>
              <p className="mt-1 text-xs leading-[18px] text-white/80">
                Projects for applications and contests
              </p>

              <div className="mt-6 border-t border-white/20 pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                  THEY MIGHT BUILD
                </span>
                <ul className="mt-2.5 space-y-2 text-xs text-white">
                  <li className="flex items-start gap-1.5">
                    <span>→</span> A connected smart-home device
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>→</span> An AI agent that does a real task
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fit Cards (Good Fit vs Not Fit) */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Good Fit Card */}
          <div className="rounded-3xl border border-emerald-200 bg-[#EBF7F0] p-8">
            <h4 className="text-[18px] font-semibold text-[#0B0C0F]">
              A good fit if your child...
            </h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3 text-sm text-[#0B0C0F]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Check className="size-3 stroke-[3]" />
                </span>
                Is curious about how robots, games, gadgets and apps work
              </li>
              <li className="flex items-center gap-3 text-sm text-[#0B0C0F]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Check className="size-3 stroke-[3]" />
                </span>
                Likes making things more than memorising them
              </li>
              <li className="flex items-center gap-3 text-sm text-[#0B0C0F]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Check className="size-3 stroke-[3]" />
                </span>
                Has never coded or built anything before
              </li>
            </ul>
          </div>

          {/* Not Fit Card */}
          <div className="rounded-3xl border border-rose-200 bg-[#FDF1F1] p-8">
            <h4 className="text-[18px] font-semibold text-[#0B0C0F]">
              Not the right fit if you want...
            </h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3 text-sm text-[#0B0C0F]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                  <X className="size-3 stroke-[3]" />
                </span>
                Exam coaching or higher marks
              </li>
              <li className="flex items-center gap-3 text-sm text-[#0B0C0F]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                  <X className="size-3 stroke-[3]" />
                </span>
                One-to-one classes at home
              </li>
              <li className="flex items-center gap-3 text-sm text-[#0B0C0F]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                  <X className="size-3 stroke-[3]" />
                </span>
                A job certificate or a coding bootcamp
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
