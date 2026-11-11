"use client";

import { Container } from "@/components/ui/Container";

export function SolutionSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="w-full bg-[#0B0C0F] py-24 text-white">
      <Container>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <h2
            id="how-it-works-title"
            className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-white sm:text-[44px]"
          >
            Every class ends with
            <br />
            something that works.
          </h2>
          <p className="max-w-[420px] text-sm leading-[22px] text-white/60">
            A short idea, a live demo, guided practice, then their own build. Same rhythm in
            every track.
          </p>
        </div>

        {/* 90-Minute Class Rhythm Card */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-[#16181D] p-8 shadow-2xl sm:p-10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <h3 className="text-[20px] font-semibold text-white">Inside one 90-minute class</h3>
            <span className="text-xs text-white/50">Same rhythm in every track</span>
          </div>

          {/* Segment timeline bar */}
          <div className="mt-8 flex h-2.5 w-full gap-2">
            <div className="w-[10%] rounded-full bg-[#424652]" />
            <div className="w-[15%] rounded-full bg-[#424652]" />
            <div className="w-[20%] rounded-full bg-[#424652]" />
            <div className="w-[45%] rounded-full bg-[#FF6B2C] shadow-[0_0_14px_rgba(255,107,44,0.7)]" />
            <div className="w-[10%] rounded-full bg-[#424652]" />
          </div>

          {/* Blocks */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 lg:border-none lg:bg-transparent lg:p-0">
              <span className="text-xs font-semibold text-white/50">10 min</span>
              <h4 className="mt-2 text-base font-semibold text-white">Idea</h4>
              <p className="mt-2 text-xs leading-[18px] text-white/60">
                A short, clear explanation of how the thing works
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 lg:border-none lg:bg-transparent lg:p-0">
              <span className="text-xs font-semibold text-white/50">15 min</span>
              <h4 className="mt-2 text-base font-semibold text-white">Tutor demo</h4>
              <p className="mt-2 text-xs leading-[18px] text-white/60">
                The tutor builds it live and makes the common mistakes on purpose
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 lg:border-none lg:bg-transparent lg:p-0">
              <span className="text-xs font-semibold text-white/50">20 min</span>
              <h4 className="mt-2 text-base font-semibold text-white">Guided practice</h4>
              <p className="mt-2 text-xs leading-[18px] text-white/60">
                Small steps, checked by the tutor before moving on
              </p>
            </div>

            <div className="rounded-xl border border-[#FF6B2C]/20 bg-[#FF6B2C]/10 p-4 lg:border-none lg:bg-transparent lg:p-0">
              <span className="text-xs font-bold text-[#FF6B2C]">35 min</span>
              <h4 className="mt-2 text-base font-semibold text-[#FF6B2C]">Build</h4>
              <p className="mt-2 text-xs leading-[18px] text-white/80">
                Their own version, for a problem from their school day
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 lg:border-none lg:bg-transparent lg:p-0">
              <span className="text-xs font-semibold text-white/50">10 min</span>
              <h4 className="mt-2 text-base font-semibold text-white">Show and share</h4>
              <p className="mt-2 text-xs leading-[18px] text-white/60">
                Two minutes to show it working and get one useful note
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
