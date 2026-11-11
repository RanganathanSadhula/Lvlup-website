"use client";

import Link from "next/link";
import { ArrowRight, UsersRound, Lock, ShieldCheck, Award, Pencil } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function SafetySection() {
  return (
    <section
      id="safety"
      aria-labelledby="safety-title"
      className="relative w-full overflow-hidden bg-[#F4F3EE] py-24 text-[#0B0C0F]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/images/topo-light.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "800px",
        }}
      />

      <Container className="relative z-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <h2
            id="safety-title"
            className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F] sm:text-[44px]"
          >
            Safe by design, and in writing.
          </h2>
          <p className="max-w-[420px] text-sm leading-[22px] text-[#5A5F6B]">
            Five commitments we sign with every school, and share with every family before the
            first class.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Commitment 1 */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#E3E1D9] bg-white p-6 shadow-sm">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FEEFEA] text-[#FF6B2C]">
              <UsersRound className="size-6" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-[#0B0C0F]">A tutor in every class</h3>
              <p className="mt-1 text-xs leading-[18px] text-[#5A5F6B]">
                Children never use AI tools or build kits on their own in our sessions.
              </p>
            </div>
          </div>

          {/* Commitment 2 */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#E3E1D9] bg-white p-6 shadow-sm">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FEEFEA] text-[#FF6B2C]">
              <Lock className="size-6" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-[#0B0C0F]">
                Minimal data, never sold
              </h3>
              <p className="mt-1 text-xs leading-[18px] text-[#5A5F6B]">
                We collect only what we need to run the course, and delete it when you ask.
              </p>
            </div>
          </div>

          {/* Commitment 3 */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#E3E1D9] bg-white p-6 shadow-sm">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FEEFEA] text-[#FF6B2C]">
              <ShieldCheck className="size-6" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-[#0B0C0F]">
                Approved tools and kits only
              </h3>
              <p className="mt-1 text-xs leading-[18px] text-[#5A5F6B]">
                Age-appropriate apps through accounts we set up, and low-voltage kits checked
                before every class.
              </p>
            </div>
          </div>

          {/* Commitment 4 */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#E3E1D9] bg-white p-6 shadow-sm">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FEEFEA] text-[#FF6B2C]">
              <Award className="size-6" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-[#0B0C0F]">
                Safety is taught, not just enforced
              </h3>
              <p className="mt-1 text-xs leading-[18px] text-[#5A5F6B]">
                Every course opens with a safety pledge: what to keep private, how to check an
                answer, how to handle a kit.
              </p>
            </div>
          </div>

          {/* Commitment 5 */}
          <div className="flex items-start gap-4 rounded-2xl border border-[#E3E1D9] bg-white p-6 shadow-sm">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FEEFEA] text-[#FF6B2C]">
              <Pencil className="size-6" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-[#0B0C0F]">
                Your written consent first
              </h3>
              <p className="mt-1 text-xs leading-[18px] text-[#5A5F6B]">
                We ask before your child uses any AI tool or takes a kit home. You can withdraw
                at any time.
              </p>
            </div>
          </div>

          {/* Card 6: Read child safety policy */}
          <Link
            href="/legal/child-safety"
            className="group flex items-center justify-between rounded-2xl bg-[#0B0C0F] p-6 text-white shadow-xl transition hover:bg-[#161820]"
          >
            <div>
              <h3 className="text-base font-semibold text-white">
                Read the full child safety policy
              </h3>
              <p className="mt-1 text-xs text-white/60">
                The tools and kits we use, what we collect, who sees it, and how to reach us.
              </p>
            </div>
            <ArrowRight className="size-5 text-[#FF6B2C] transition group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
