"use client";

import { useEffect } from "react";
import { Logo } from "@/components/ui/Logo";
import { navLinks, siteConfig } from "@/data/site";
import { MobileNavigation } from "./MobileNavigation";

export function Header() {
  const scrollToTarget = (targetId: string) => {
    // Find all matching elements and pick the currently visible one
    const elements = Array.from(document.querySelectorAll<HTMLElement>(`#${targetId}`));
    const element =
      elements.find((el) => el.offsetParent !== null || el.getBoundingClientRect().height > 0) ||
      elements[0];

    if (element) {
      const headerOffset = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

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

    // Run after DOM has painted
    const timer = setTimeout(handleHash, 150);
    window.addEventListener("hashchange", handleHash);

    // Global listener for in-page anchor links
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



  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/[0.06] bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-5 sm:px-8 min-[1344px]:px-0">
        <Logo />
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-5 lg:gap-8 text-xs lg:text-sm text-white/80">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className="inline-block transition-all duration-200 hover:text-white active:scale-95 cursor-pointer"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.enrolUrl}
            onClick={(e) => handleNavClick(e, siteConfig.enrolUrl)}
            className="hidden min-h-10 items-center justify-center rounded-[10px] bg-brand-gradient px-4 text-sm font-semibold text-ink shadow-glow transition-all duration-200 transform-gpu hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,107,44,0.4)] active:scale-95 active:translate-y-0 sm:inline-flex cursor-pointer"
          >
            Enrol now
          </a>
          <MobileNavigation links={navLinks} enrolUrl={siteConfig.enrolUrl} />
        </div>
      </div>
    </header>
  );
}
