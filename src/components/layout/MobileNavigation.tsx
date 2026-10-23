"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
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
          className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-ink px-5 pb-8 pt-4"
        >
          <nav aria-label="Mobile">
            <ul className="divide-y divide-white/10">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-lg text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-5 flex items-center justify-between gap-4">
            <LanguageSwitcher />
            <ButtonLink href={enrolUrl} arrow={false}>Enrol now</ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
