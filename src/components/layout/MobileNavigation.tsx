"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { NavLink } from "@/types";

export function MobileNavigation({ links, enrolUrl }: { links: NavLink[]; enrolUrl: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (href.startsWith("#") || href.startsWith("/#")) {
      const targetId = href.replace(/^\/?#/, "");
      // Query all matching elements to find the visible one (mobile vs desktop)
      const elements = Array.from(document.querySelectorAll<HTMLElement>(`#${targetId}`));
      const element = elements.find((el) => el.offsetParent !== null || el.getBoundingClientRect().height > 0) || elements[0];
      if (element) {
        e.preventDefault();
        setTimeout(() => {
          const headerOffset = 64;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
          window.history.pushState(null, "", `#${targetId}`);
        }, 100);
      }
    }
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-lg border border-white/15 text-white"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-ink px-5 pb-8 pt-4 shadow-2xl"
        >
          <nav aria-label="Mobile">
            <ul className="divide-y divide-white/10">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className="flex min-h-12 items-center text-lg text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 flex items-center justify-end">
            <a
              href={enrolUrl}
              onClick={(e) => handleNavClick(e, enrolUrl)}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-brand-gradient px-5 text-[15px] font-semibold text-ink shadow-glow transition hover:brightness-105"
            >
              Enrol now
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
