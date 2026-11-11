"use client";

import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function OutcomesSection() {
  return (
    <section id="outcomes" aria-labelledby="outcomes-title" className="w-full bg-[#F4F3EE] py-24 text-[#0B0C0F]">
      <Container>
        <div>
          <h2
            id="outcomes-title"
            className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F] sm:text-[44px]"
          >
            What your child walks away with
          </h2>
          <p className="mt-3 text-[17px] text-[#5A5F6B]">
            Things they made, can show you, and can explain in their own words.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Card: Revise Buddy Interactive Chat Mockup (Cols 1-5) */}
          <div className="col-span-1 rounded-3xl bg-[#0B0C0F] p-8 text-white shadow-xl lg:col-span-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B2C]">
              EXAMPLE BUILD · AI TRACK · GRADE 6
            </span>
            <h3 className="mt-2 font-display text-[28px] font-normal text-white">
              Revise Buddy
            </h3>

            {/* Chat Simulation */}
            <div className="mt-6 rounded-2xl bg-[#16181D] p-5">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-none bg-[#FF6B2C] px-4 py-2.5 text-xs font-medium text-white shadow-sm">
                    Quiz me on chapter 7, photosynthesis.
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-none bg-white px-4 py-2.5 text-xs text-[#0B0C0F] shadow-sm">
                    Question 1 of 5: which gas do plants take in to make food?
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-none bg-[#FF6B2C] px-4 py-2 text-xs font-medium text-white shadow-sm">
                    Oxygen?
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-none bg-white px-4 py-2.5 text-xs text-[#0B0C0F] shadow-sm">
                    Not quite. Plants take in carbon dioxide and give out oxygen. Ready for
                    question 2?
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs leading-[18px] text-white/50">
              Built from an approved starter and tested against two tasks it had to pass
              before demo day.
            </p>
          </div>

          {/* Right List: 5 Takeaways (Cols 6-12) */}
          <div className="col-span-1 flex flex-col justify-center space-y-6 lg:col-span-7">
            {[
              {
                title: "A working project",
                desc: "Tested against two tasks it must pass, and shown live to you at demo day.",
              },
              {
                title: "A portfolio they can show",
                desc: "Every sketch, test result and demo video in one link.",
              },
              {
                title: "A head start on school topics",
                desc: "Computational thinking, sensors, design and AI, taught by doing.",
              },
              {
                title: "Habits that last",
                desc: "Check before trusting, keep private details private, test before sharing.",
              },
              {
                title: "The confidence to explain it",
                desc: "A two-minute talk on what they built, why, and what they'd improve.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-5 border-b border-[#E3E1D9] pb-6 last:border-none"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C]/15 text-[#FF6B2C]">
                  <Check className="size-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-[19px] font-semibold text-[#0B0C0F]">{item.title}</h4>
                  <p className="mt-1 text-sm leading-[22px] text-[#5A5F6B]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
