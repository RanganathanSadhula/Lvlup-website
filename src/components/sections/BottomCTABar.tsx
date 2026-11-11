"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";
import { Logo } from "@/components/ui/Logo";

export function BottomCTABar() {
  const pathname = usePathname();
  if (
    pathname === "/enrolled" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/tell-us-child" ||
    pathname === "/who-is-learning" ||
    pathname === "/home" ||
    pathname === "/explore" ||
    pathname.startsWith("/courses") ||
    pathname === "/checkout" ||
    pathname === "/confirmation"
  ) {
    return null;
  }

  return (
    <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-white/[0.08] bg-[#0B0C0F]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-5 sm:px-8 min-[1344px]:px-0 gap-8">
        {/* Left: Brand logo + course info matching Figma stick pad */}
        <div className="flex items-center gap-3">
          <Logo imageClassName="h-7 w-auto" />
          <span className="text-xs text-[#A7ACB8]">
            8-week AI course · 90 min a week
          </span>
        </div>

        {/* Right group: price + WhatsApp + Enrol (matches Figma stick pad image exactly) */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-0.5 items-start">
            <span className="text-sm font-semibold text-white">₹4,999</span>
            <span className="text-xs text-[#A7ACB8]">₹2,500 to join</span>
          </div>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold border border-white/[0.06] rounded-[6px] text-white transition-all duration-200 transform-gpu hover:bg-white/10 active:scale-95 min-h-10 cursor-pointer"
          >
            WhatsApp us <span className="leading-none">→</span>
          </a>
          <a
            href={siteConfig.enrolUrl}
            onClick={(e) => {
              const targetId = siteConfig.enrolUrl.replace(/^\/?#/, "");
              const element = document.getElementById(targetId);
              if (element) {
                e.preventDefault();
                const headerOffset = 64;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                  top: Math.max(0, offsetPosition),
                  behavior: "smooth",
                });
                window.history.pushState(null, "", `#${targetId}`);
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-gradient text-[15px] font-semibold text-ink rounded-[6px] shadow-glow min-h-10 transition-all duration-200 transform-gpu hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,44,0.4)] active:scale-95 cursor-pointer"
          >
            Enrol now <span className="leading-none text-ink">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
