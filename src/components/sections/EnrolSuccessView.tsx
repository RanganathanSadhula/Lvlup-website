"use client";

import { ArrowRight, Check } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";

export interface EnrolSuccessProps {
  childName?: string;
  payPlan?: "full" | "parts";
  email?: string;
  onEdit?: () => void;
}

export function EnrolSuccessView({
  childName = "Aarav",
  payPlan = "full",
  email = "you@example.com",
  onEdit,
}: EnrolSuccessProps) {
  const amount = payPlan === "parts" ? "₹2,500" : "₹4,499";
  const name = childName.trim() || "Aarav";

  return (
    <div className="w-full bg-[#fbf9f5] py-10 sm:py-16 lg:py-24 text-ink">
      <Container className="max-w-[620px] px-4 sm:px-6 text-center">
        {/* Green checkmark circle */}
        <div className="mx-auto flex size-12 sm:size-14 items-center justify-center rounded-full bg-[#139a58] text-white shadow-sm">
          <Check className="size-6 sm:size-7 stroke-[3]" />
        </div>

        {/* Heading */}
        <h2 className="mt-5 sm:mt-6 font-display text-[30px] sm:text-[42px] lg:text-[46px] font-normal leading-[1.08] tracking-[-0.03em] text-ink">
          {name} is enrolled.
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-3 sm:mt-4 max-w-[500px] text-[14px] sm:text-[16px] leading-relaxed text-[#5e606a]">
          Payment of {amount} received. We have sent the receipt and your batch details to your WhatsApp and email.
        </p>

        {/* What happens next Card */}
        <div className="mt-6 sm:mt-8 rounded-2xl border border-black/[0.08] bg-white p-5 sm:p-7 text-left shadow-sm">
          <h3 className="font-display text-[15px] font-bold text-ink">
            What happens next
          </h3>

          <div className="mt-4 divide-y divide-black/[0.06]">
            {/* Row 1 */}
            <div className="grid grid-cols-[105px_1fr] sm:grid-cols-[140px_1fr] py-3.5 sm:py-4 items-baseline gap-2.5 sm:gap-6 first:pt-0">
              <span className="font-mono text-xs sm:text-[13px] font-medium text-[#ff5520]">
                [Date]
              </span>
              <span className="text-[13px] sm:text-[14px] leading-relaxed text-ink/80">
                Online parent session, 30 minutes. The link comes on WhatsApp.
              </span>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-[105px_1fr] sm:grid-cols-[140px_1fr] py-3.5 sm:py-4 items-baseline gap-2.5 sm:gap-6">
              <span className="font-mono text-xs sm:text-[13px] font-medium text-[#ff5520]">
                [Date]
              </span>
              <span className="text-[13px] sm:text-[14px] leading-relaxed text-ink/80">
                Level 1 at [School name], [day], 90 minutes in the computer lab.
              </span>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-[105px_1fr] sm:grid-cols-[140px_1fr] py-3.5 sm:py-4 items-baseline gap-2.5 sm:gap-6">
              <span className="font-mono text-xs sm:text-[13px] font-medium text-[#ff5520] leading-tight">
                After levels 2, 4 and 6
              </span>
              <span className="text-[13px] sm:text-[14px] leading-relaxed text-ink/80">
                A short progress update on WhatsApp.
              </span>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-[105px_1fr] sm:grid-cols-[140px_1fr] py-3.5 sm:py-4 items-baseline gap-2.5 sm:gap-6 last:pb-0">
              <span className="font-mono text-xs sm:text-[13px] font-medium text-[#ff5520]">
                Level 8
              </span>
              <span className="text-[13px] sm:text-[14px] leading-relaxed text-ink/80">
                Demo day at school. You see your child’s AI helper live.
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <a
            href="/downloads/LvlUp-Eight-Week-Curriculum.pdf"
            download="LvlUp Eight-Week Curriculum.pdf"
            className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff5520] to-[#ff6b2c] px-6 text-[14px] font-semibold text-white shadow-sm transition hover:brightness-105 active:scale-95"
          >
            <span>Download the curriculum (PDF)</span>
            <ArrowRight className="size-4" />
          </a>

          <a
            href={siteConfig.whatsappUrl}
            className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#eeece7] px-6 text-[14px] font-semibold text-ink transition hover:bg-[#e4e2dc] active:scale-95"
          >
            <span>WhatsApp us</span>
            <ArrowRight className="size-4" />
          </a>
        </div>

        {/* Reference note */}
        <p className="mt-6 sm:mt-8 font-mono text-[11px] sm:text-xs text-ink/45">
          Reference LVL-[000123] · Paid in full · Receipt sent to {email}
        </p>

        {/* Back / edit option */}
        {onEdit && (
          <div className="mt-4">
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-medium text-muted hover:text-ink underline underline-offset-2 cursor-pointer"
            >
              ← Edit enrolment details
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
