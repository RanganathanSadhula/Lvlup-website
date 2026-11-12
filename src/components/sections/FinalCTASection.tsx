"use client";

import { Container } from "@/components/ui/Container";

export function FinalCTASection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#FF6B2C] to-[#E05316] py-16 text-white shadow-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('/images/chevrons.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "60px",
        }}
      />

      <Container className="relative z-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-[38px] font-normal tracking-[-0.03em] text-white sm:text-[48px]">
              Ready to build something?
            </h2>
            <p className="mt-2 text-base text-white/90">
              Find a course for your child’s grade, or ask us to bring ThinkOva to your school.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => scrollTo("tracks")}
              className="rounded-xl bg-[#0B0C0F] px-8 py-4 text-sm font-semibold text-white shadow-xl transition hover:bg-black active:scale-[0.98]"
            >
              Explore courses →
            </button>
            <button
              type="button"
              onClick={() => scrollTo("schools")}
              className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98]"
            >
              Get a callback (schools) →
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
