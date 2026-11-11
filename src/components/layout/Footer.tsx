"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { legalLinks, siteConfig } from "@/data/site";

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-[#0B0C0F] py-20 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/images/topo-dark.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "800px",
        }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-10 pb-16 border-b border-white/10 md:grid-cols-12 md:gap-12">
          {/* Logo & Info (Cols 1-5) */}
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-[340px] text-xs leading-[20px] text-white/60">
              Hands-on courses in AI, robotics, electronics, game design and product design for
              Grades 5 to 11, taught by trained tutors at your child&apos;s school.
            </p>
          </div>

          {/* Courses (Cols 6-7) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Courses</h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <a
                  href="#tracks"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("tracks");
                  }}
                  className="hover:text-white transition"
                >
                  Tracks
                </a>
              </li>
              <li>
                <a
                  href="#safety"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("safety");
                  }}
                  className="hover:text-white transition"
                >
                  Safety
                </a>
              </li>
              <li>
                <a
                  href="#fees"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("fees");
                  }}
                  className="hover:text-white transition"
                >
                  Fees
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("faq");
                  }}
                  className="hover:text-white transition"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Schools (Cols 8-9) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Schools</h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <a
                  href="/downloads/ThinkOva-School-Partnership-Pack.pdf"
                  download
                  className="hover:text-white transition"
                >
                  School pack
                </a>
              </li>
              <li>
                <a
                  href="#schools"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("schools");
                  }}
                  className="hover:text-white transition"
                >
                  Get a callback
                </a>
              </li>
              <li>
                <Link href={legalLinks.partnerTerms} className="hover:text-white transition">
                  Partner terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact (Cols 10-12) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  WhatsApp {siteConfig.whatsappLabel}
                </a>
              </li>
              <li>
                <a href={siteConfig.emailUrl} className="hover:text-white transition">
                  {siteConfig.emailLabel}
                </a>
              </li>
              <li>Pune, India</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="mt-8 flex flex-col gap-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ThinkOva</span>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href={legalLinks.privacy} className="hover:text-white transition">
              Privacy
            </Link>
            <span className="text-white/20">·</span>
            <Link href={legalLinks.childSafety} className="hover:text-white transition">
              Child safety
            </Link>
            <span className="text-white/20">·</span>
            <Link href={legalLinks.refunds} className="hover:text-white transition">
              Refunds
            </Link>
            <span className="text-white/20">·</span>
            <Link href={legalLinks.terms} className="hover:text-white transition">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
