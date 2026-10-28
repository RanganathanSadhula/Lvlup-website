import Image from "next/image";
import { Check, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { goodFit, gradeCards, notFit } from "@/data/content";
import { cn } from "@/lib/utils";

/** Staircase offsets (desktop) mirroring the rising cards in Figma */
const rise = ["lg:mt-[78px]", "lg:mt-[52px]", "lg:mt-[26px]", "lg:mt-0"];

const gradeColors = [
  { num: "text-[#3b5bfd]", label: "text-[#3b5bfd]", card: "bg-white border border-black/[0.08] text-ink shadow-sm" },
  { num: "text-[#109e58]", label: "text-[#109e58]", card: "bg-white border border-black/[0.08] text-ink shadow-sm" },
  { num: "text-[#7048e8]", label: "text-[#7048e8]", card: "bg-white border border-black/[0.08] text-ink shadow-sm" },
  { num: "text-black", label: "text-black", card: "bg-[#ff6b2c] text-black shadow-md" },
];

const defaultStyle = { num: "text-brand", label: "text-brand", card: "bg-white border border-black/[0.08] text-ink shadow-sm" };

export function AudienceSection() {
  return (
    <Section id="fit" tone="light" topo aria-labelledby="fit-title">
      <Container>
        <SectionHeader
          id="fit-title"
          title="Is LvlUp right for your child?"
          description="An honest list, so you can decide quickly."
        />

        {/* 4 Rising Grade Cards (5 Blue, 6 Green, 7 Purple, 8 Orange) */}
        <ul className="mt-12 grid grid-cols-2 gap-4 lg:mt-14 lg:grid-cols-4 lg:items-start lg:gap-4">
          {gradeCards.map((g, i) => {
            const last = i === gradeCards.length - 1;
            const style = gradeColors[i] ?? defaultStyle;
            return (
              <li key={g.grade} className={cn("h-full", rise[i])}>
                <ScrollReveal delay={i * 80} className="h-full">
                  <div
                    className={cn(
                      "flex min-h-[150px] flex-col justify-end rounded-2xl p-5 sm:min-h-[170px] sm:p-6 lg:min-h-0 lg:h-[142px]",
                      style.card,
                    )}
                  >
                    <p className="flex items-end gap-2">
                      <span className={cn("font-display text-[54px] font-bold leading-none tracking-[-0.03em]", style.num)}>
                        {g.grade}
                      </span>
                      <span className={cn("mb-1 text-xs font-bold", style.label)}>Grade</span>
                    </p>
                    <p className={cn("mt-1.5 text-sm font-bold", last ? "text-black" : "text-ink")}>
                      {g.title}
                    </p>
                    <p className={cn("text-xs", last ? "text-black/80" : "text-muted")}>
                      {g.body}
                    </p>
                  </div>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>

        {/* Bottom Comparison Cards: Good Fit (Mint) & Not A Fit (Peach) */}
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          {/* Left: Good fit card with hover-to-colour girl photo */}
          <ScrollReveal delay={100}>
            <div className="group grid h-full overflow-hidden rounded-2xl border border-[#d2f0df] bg-[#ecf8f1] sm:grid-cols-[210px_1fr]">
              <div className="relative h-56 w-full overflow-hidden sm:h-full">
                <Image
                  src="/images/audience-fit-color.png"
                  alt="A girl sitting cross-legged with a laptop, one arm raised in celebration"
                  fill
                  unoptimized
                  quality={100}
                  className="object-cover object-center grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <div className="p-6 sm:p-8">
                <span className="inline-block rounded-md bg-[#dcf4e5] px-2.5 py-1 text-xs font-semibold text-[#109e58]">
                  Good fit
                </span>
                <h3 className="mt-3 font-display text-[24px] font-normal tracking-[-0.02em] text-ink">
                  A good fit if your child…
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {goodFit.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[15px] leading-snug text-ink">
                      <span
                        aria-hidden
                        className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#109e58] text-white"
                      >
                        <Check className="size-3" strokeWidth={3.5} />
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Not the right fit card */}
          <ScrollReveal delay={200}>
            <div className="h-full rounded-2xl border border-[#fdded6] bg-[#fff1ed] p-6 sm:p-8">
              <span className="inline-block rounded-md bg-[#fde2db] px-2.5 py-1 text-xs font-semibold text-[#e03131]">
                Not a fit
              </span>
              <h3 className="mt-3 font-display text-[24px] font-normal tracking-[-0.02em] text-ink">
                Not the right fit if you want…
              </h3>
              <ul className="mt-5 space-y-3.5">
                {notFit.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-snug text-ink">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e03131] text-white"
                    >
                      <X className="size-3" strokeWidth={3} />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  );
}
