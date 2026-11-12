"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/data/site";
import { MobileNavigation } from "./MobileNavigation";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const { user } = useAuth();
  const scrollToTarget = (targetId: string) => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(`#${targetId}`));
    const element =
      elements.find((el) => el.offsetParent !== null || el.getBoundingClientRect().height > 0) ||
      elements[0];

    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("thinkova-nav-jump", { detail: { targetId } })
        );
      }

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${targetId}`);
      return true;
    }
    return false;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") || href.startsWith("/#")) {
      const targetId = href.replace(/^\/?#/, "");
      if (scrollToTarget(targetId)) {
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^\/?#/, "");
      if (hash) {
        scrollToTarget(hash);
      }
    };

    const timer = setTimeout(handleHash, 150);
    window.addEventListener("hashchange", handleHash);

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && (href.startsWith("#") || href.startsWith("/#"))) {
        const id = href.replace(/^\/?#/, "");
        if (id && scrollToTarget(id)) {
          e.preventDefault();
        }
      }
    };
    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHash);
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  const desktopNavItems = [
    { label: "Courses", href: "#tracks" },
    { label: "Tracks", href: "#tracks" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Fees", href: "#fees" },
    { label: "Safety", href: "#safety" },
    { label: "For schools", href: "#schools" },
  ];

  return (
    <header className="sticky top-0 z-40 h-20 w-full border-b border-white/[0.08] bg-[#0B0C0F]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between px-6 sm:px-8">
        <Logo />

        <nav aria-label="Desktop Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[15px] font-medium text-white/80">
            {desktopNavItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="transition hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-6">
          {user ? (
            <Link
              href="/who-is-learning"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[14px] font-medium text-white transition hover:border-[#FF6B2C] hover:bg-white/15"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-[#FF6B2C] text-xs font-bold text-white">
                {(user.fullName || user.email || "P")[0]?.toUpperCase() || "P"}
              </span>
              <span className="hidden sm:inline">Who&apos;s learning</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-block text-[14px] font-medium text-white/80 transition hover:text-white"
            >
              Parent log in
            </Link>
          )}

          <Link
            href="/explore"
            className="rounded-full bg-gradient-to-r from-[#FF6B2C] to-[#E05316] px-4 sm:px-6 py-2.5 text-[14px] font-medium text-white shadow-[0_4px_16px_rgba(255,107,44,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore courses
          </Link>

          <div className="lg:hidden">
            <MobileNavigation
              links={desktopNavItems}
              enrolUrl="#enrol"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
