"use client";

import Link from "next/link";
import { siteConfig } from "@/data/site";

export function BottomCTABar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-white/[0.06] bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-5 sm:px-8 min-[1344px]:px-0 gap-8">
        {/* Left: school + batch info */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            LvlUp at {siteConfig.schoolName}
          </span>
          <span className="text-xs text-[#A7ACB8]">
            Batch starts {siteConfig.batchStartDate} · 90 min a week
          </span>
        </div>

        {/* Right group: price + WhatsApp + Enrol (matches Figma exactly) */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-0.5 items-start">
            <span className="text-sm font-semibold text-white">₹4,999</span>
            <span className="text-xs text-[#A7ACB8]">₹2,500 to join</span>
          </div>
          <Link
            href={siteConfig.whatsappUrl}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border border-white/[0.06] rounded-[6px] text-white transition-colors hover:bg-white/5 min-h-10"
          >
            WhatsApp us <span className="leading-none">→</span>
          </Link>
          <Link
            href={siteConfig.enrolUrl}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-gradient text-[15px] font-semibold text-ink rounded-[6px] shadow-glow min-h-10 transition-opacity hover:opacity-90"
          >
            Enrol now <span className="leading-none text-ink">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
