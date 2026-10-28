import Image from "next/image";
import { Check, Bot } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { heroMeta } from "@/data/content";
import { siteConfig } from "@/data/site";

export function HeroSection() {
  return (
    <section
      id="course"
      aria-labelledby="hero-title"
      /* "group" placed here so hovering ANYWHERE in the hero section triggers the color */
      className="group relative overflow-hidden bg-[#0b0c0f]"
      style={{ minHeight: "660px" }}
    >
      {/* ── LvlUp Effect: Grain on dark (adjust opacity below for density: 0.55 = 55%) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          backgroundImage: 'url("/images/grain-dark.png")',
          backgroundRepeat: "repeat",
          opacity: 0.52, // <-- CHANGE THIS TO ADJUST DENSITY (e.g. 0.3 for 30%, 0.8 for 80%, 1 for 100%)
        }}
      />

      {/* ── RIGHT PANEL: Image on the right 55% ──────────────────────────────── */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[70%] lg:w-[55%] opacity-35 sm:opacity-75 lg:opacity-100 overflow-hidden">
        <Image
          src="/images/hero-student-hd.png"
          alt="A girl with headphones working at a laptop"
          fill
          priority
          unoptimized
          quality={100}
          sizes="100vw"
          /* Default: grayscale (black and white). Hovering anywhere in HeroSection turns it to full color with smooth zoom */
          className="object-cover object-[center_10%] grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
        />

        {/* Left edge of image: fade into dark background (rgba(11,12,15,1)) */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[55%]"
          style={{
            background:
              "linear-gradient(to right, #0b0c0f 0%, rgba(11,12,15,0.95) 30%, rgba(11,12,15,0.6) 65%, transparent 100%)",
          }}
        />

        {/* Bottom edge fade */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-28"
          style={{
            background: "linear-gradient(to top, #0b0c0f 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── TEXT CONTENT ──────────────────────────────────────────────────────── */}
      <Container className="relative z-10 py-20 lg:py-24">
        <div className="max-w-[500px]">
          <ScrollReveal>
            <p className="inline-block rounded-md bg-white/[0.06] px-3 py-1.5 font-mono text-xs text-white/70 sm:text-[13px]">
              Grades 5–8 · After school, at your child's school
            </p>

            <h1
              id="hero-title"
              className="mt-6 font-display text-[46px] font-normal leading-[0.98] tracking-[-0.045em] sm:text-[60px] lg:text-[72px]"
            >
              Don't just use AI.
              <br />
              Build with it.
            </h1>

            <p className="mt-6 max-w-[420px] text-base leading-[1.75] text-muted-dark">
              An eight-week course taught by a trained tutor at your child's school. At level 8,
              your child shows you a working AI helper they designed and tested themselves.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={siteConfig.enrolUrl}>Enrol now</ButtonLink>
              <ButtonLink href={siteConfig.whatsappUrl} variant="outline">
                WhatsApp us
              </ButtonLink>
            </div>
          </ScrollReveal>

          {/* Meta row */}
          <div className="mt-8 flex items-stretch divide-x divide-white/20 border-t border-white/10 pt-6">
            {heroMeta.slice(0, 2).map((m) => (
              <div key={m.label} className="flex flex-col pr-6 first:pl-0 [&:not(:first-child)]:pl-6">
                <span className="font-mono text-[11px] text-white/50">{m.label}</span>
                <span className="mt-0.5 text-[14px] font-semibold text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* ── REVISE BUDDY CARD — tilted / cross as in Figma ────────────────────── */}
      <div className="relative z-20 mx-auto mt-10 w-[92%] max-w-[320px] transform overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-transform duration-300 lg:absolute lg:bottom-8 lg:right-8 lg:mx-0 lg:mt-0 lg:w-[290px] lg:-rotate-2 lg:hover:rotate-0">
        {/* Orange accent tab at top centre */}
        <div className="flex justify-center pt-3">
          <div className="h-[5px] w-10 rounded-full bg-brand" />
        </div>

        <div className="p-5">
          {/* Header: icon + title */}
          <div className="flex items-center gap-3">
            <div className="flex size-[44px] shrink-0 items-center justify-center rounded-xl bg-[#FEF0EA]">
              <Bot className="size-5 text-brand" />
            </div>
            <div>
              <h2 className="font-display text-[16px] font-bold leading-snug text-ink">
                Revise Buddy
              </h2>
              <p className="text-[11px] text-ink/50">by Asha, Grade 6</p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-3 text-[12px] leading-relaxed text-ink/65">
            Quizzes her on a science chapter and explains what she got wrong.
          </p>

          {/* Chat bubbles */}
          <div className="mt-3 space-y-2 rounded-xl bg-[#f4f5f7] p-3">
            {/* User — right aligned */}
            <div className="flex justify-end">
              <span className="rounded-[10px] bg-[#dce8fe] px-3 py-1.5 text-[11px] font-medium text-ink/90">
                Quiz me on chapter 7
              </span>
            </div>
            {/* AI — left aligned */}
            <div className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-0.5 size-3.5 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-400"
              />
              <span className="text-[11px] leading-snug text-ink/80">
                Question 1 of 5: which gas do plants take in to make food?
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-full border-2 border-green-500 px-2.5 py-0.5 text-[10px] font-bold text-green-600">
              <Check className="size-2.5" strokeWidth={3.5} />
              2/2 tests passed
            </span>
            <span className="text-[10px] text-ink/40">Level 6 project</span>
          </div>
        </div>
      </div>
    </section>
  );
}
