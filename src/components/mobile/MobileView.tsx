"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Play, ArrowRight } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { tutors } from "@/data/tutors";
import { parentFaq } from "@/data/faq";
import { siteConfig, legalLinks } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export function MobileView() {
  const [openLevel, setOpenLevel] = useState<number | null>(6);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const mobileFaqItems = parentFaq.slice(0, 4);

  return (
    <div className="w-full bg-ink text-white font-sans antialiased overflow-x-hidden pb-[80px]">
      {/* 1. HERO SECTION */}
      <section aria-label="Hero" className="relative px-5 pt-7 pb-16 bg-ink overflow-hidden">
        <div aria-hidden className="bg-topo-dark pointer-events-none absolute inset-0 opacity-50" />
        <div aria-hidden className="pointer-events-none absolute -right-20 top-16 size-[320px] rounded-full bg-blue-600/20 blur-[90px]" />
        <div aria-hidden className="pointer-events-none absolute -left-12 top-64 size-[280px] rounded-full bg-[#ff6b2c]/20 blur-[80px]" />

        <div className="relative z-10">
          <p className="inline-block rounded-md bg-white/[0.06] border border-white/10 px-3 py-1 font-mono text-[11px] text-white/70">
            Grades 5&ndash;8 &middot; After school, at school
          </p>

          <h1 className="mt-5 font-display text-[52px] font-normal leading-[1.0] tracking-[-0.04em] text-white">
            Don&apos;t just use AI.
            <br />
            Build with it.
          </h1>

          <p className="mt-4 text-[16px] leading-[1.65] text-[#A2A3AB]">
            An eight-week course with a trained tutor at your child&apos;s school. Eight levels, one a week. At level 8, your child shows you a working AI helper they built.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <ButtonLink
              href={siteConfig.enrolUrl}
              className="w-full justify-center text-[15px] min-h-[50px] rounded-xl font-bold bg-brand-gradient text-ink shadow-glow"
            >
              Enrol with your school code
            </ButtonLink>

            <a
              href={siteConfig.whatsappUrl}
              className="flex min-h-[44px] w-full items-center justify-center gap-1.5 text-[15px] font-semibold text-white/90 transition hover:text-white"
            >
              WhatsApp us <span aria-hidden>→</span>
            </a>
          </div>

          {/* Meta table — exact Figma match: no card, only row bottom borders */}
          <div className="mt-7">
            <div className="flex items-center justify-between border-b border-[#2B2E36] px-4 py-3">
              <span className="text-[13px] text-white/45">Next batch</span>
              <span className="text-[15px] font-bold text-white">[Month] 2027</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#2B2E36] px-4 py-3">
              <span className="text-[13px] text-white/45">Class</span>
              <span className="text-[15px] font-bold text-white">90 min, once a week</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] text-white/45">Fee</span>
              <span className="text-[15px] font-bold text-white">&#8377;4,999 all-in</span>
            </div>
          </div>

          {/* Hero Image + Revise Buddy Card */}
          <div className="relative mt-7">
            <div className="overflow-hidden rounded-[20px]">
              <Image
                src="/images/hero-student.jpg"
                alt="A student with headphones using a laptop"
                width={1024}
                height={682}
                priority
                quality={95}
                className="w-full h-[380px] object-cover object-center"
              />
            </div>

            <div className="relative -mt-24 mx-3 rounded-[20px] border border-white/[0.14] bg-[#16171d]/95 backdrop-blur-md p-4 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#ff6b2c] font-medium">Level 6 of 8</span>
                <span className="text-white/50">Example project</span>
              </div>

              <div aria-hidden className="mt-3 flex h-5 items-end gap-1.5">
                {[5, 7, 9, 11, 13, 17, 9, 9].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: h }}
                    className={`relative flex-1 rounded-[2px] ${i < 6 ? "bg-[#ff6b2c]" : "bg-[#272932]"}`}
                  >
                    {i === 5 && <span className="absolute inset-x-0 -top-1.5 h-[2px] rounded bg-white shadow-sm" />}
                  </span>
                ))}
              </div>

              <h2 className="mt-3.5 font-display text-[17px] font-semibold tracking-tight text-white leading-snug">
                Revise Buddy &middot; built by Asha,
                <br />
                Grade 6
              </h2>

              <div className="mt-3.5 flex items-center gap-2.5 rounded-xl bg-[#1d1f27] px-3.5 py-2.5 text-xs text-white/95 border border-white/5">
                <span aria-hidden className="inline-flex size-4 shrink-0 items-center justify-center rounded-[3px] bg-[#ff6b2c] text-ink font-bold">
                  <Check className="size-2.5 text-black" strokeWidth={4} />
                </span>
                <span className="font-medium text-[13px]">2 of 2 test tasks passed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COURSE FACTS */}
      <section aria-label="Course Facts" className="bg-ink border-t border-white/10 px-5 py-6">
        <dl className="grid grid-cols-2 gap-y-6">
          <div className="pr-4">
            <dt className="font-display text-2xl tracking-tight text-white font-normal">8 levels</dt>
            <dd className="mt-1 font-sans text-xs text-muted-dark">One a week</dd>
          </div>
          <div className="pl-4 border-l border-white/10">
            <dt className="font-display text-2xl tracking-tight text-white font-normal">1 tutor</dt>
            <dd className="mt-1 font-sans text-xs text-muted-dark">In every class</dd>
          </div>
          <div className="pr-4 pt-4 border-t border-white/10">
            <dt className="font-display text-2xl tracking-tight text-white font-normal">Up to 25</dt>
            <dd className="mt-1 font-sans text-xs text-muted-dark">Students a batch</dd>
          </div>
          <div className="pl-4 pt-4 border-l border-t border-white/10">
            <dt className="font-display text-2xl tracking-tight text-white font-normal">Level 8</dt>
            <dd className="mt-1 font-sans text-xs text-muted-dark">Parent demo day</dd>
          </div>
        </dl>
      </section>

      {/* 3. PROBLEM STATEMENT */}
      <section aria-labelledby="mobile-problem-title" className="bg-[#f3f1ec] text-ink px-5 py-12">
        <h2 id="mobile-problem-title" className="font-display text-[28px] font-normal leading-[1.12] tracking-[-0.03em] text-ink">
          Kids already use AI. Few are shown how it works.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[#5f6068]">
          What school rarely has time for: how AI decides, when it is wrong, what to keep private, and how to make it do something useful.
        </p>
      </section>

      {/* 4. CURRICULUM ACCORDION */}
      <section id="levels" aria-labelledby="mobile-levels-title" className="bg-[#f3f1ec] text-ink px-5 pb-14 pt-2">
        <h2 id="mobile-levels-title" className="font-display text-[28px] font-normal leading-tight tracking-[-0.03em] text-ink mb-6">
          Eight levels. One a week.
        </h2>
        <ul className="space-y-2.5">
          {curriculum.map((l) => {
            const isOpen = openLevel === l.level;
            const num = String(l.level).padStart(2, "0");
            return (
              <li key={l.level} className={cn("overflow-hidden rounded-xl transition-all duration-150", isOpen ? "bg-[#15161b] text-white shadow-lg border border-white/15" : "bg-white text-ink border border-black/[0.08]")}>
                <button type="button" onClick={() => setOpenLevel(isOpen ? null : l.level)} aria-expanded={isOpen} className="flex w-full items-center justify-between p-4 text-left font-display text-[15px] font-semibold tracking-tight">
                  <span className="flex items-center gap-3">
                    <span className={cn("font-mono text-xs", isOpen ? "text-brand" : "text-[#5f6068]")}>{num}</span>
                    <span>{l.title}</span>
                  </span>
                  <span className={cn("flex size-6 shrink-0 items-center justify-center text-lg font-light", isOpen ? "text-white" : "text-ink/60")}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-xs leading-relaxed text-[#a2a3ab]">{l.level === 6 ? "Your child turns last week's blueprint into a supervised, working prototype and tests it on two tasks." : l.summary}</p>
                    <div className="mt-3.5 rounded-lg border border-white/10 bg-[#1d1e24] p-3">
                      <span className="block font-mono text-[10px] text-white/50">Your child makes</span>
                      <span className="mt-0.5 block text-xs font-semibold text-white">{l.level === 6 ? "Working prototype and two tests" : l.makes}</span>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* 5. TEACHING & TUTORS */}
      <section aria-labelledby="mobile-teaching-title" className="bg-[#0e0f12] text-white px-5 py-12">
        <h2 id="mobile-teaching-title" className="font-display text-[28px] font-normal leading-tight tracking-[-0.03em] text-white mb-6">
          See how we teach before you decide.
        </h2>
        <div className="relative overflow-hidden rounded-2xl">
          <Image src="/images/proof-class.png" alt="Students collaborating with a tutor in class" width={360} height={220} quality={90} className="w-full h-[220px] object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute left-4 bottom-4 flex items-center gap-2 rounded-full bg-ink/80 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-white">
            <span aria-hidden className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-ink">
              <Play className="size-2.5 fill-current ml-0.5" />
            </span>
            <span className="text-xs font-semibold">Watch a real class &middot; 3:12</span>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {tutors.map((t) => {
            let cred = "Background-checked";
            if (t.name === "Ananya Rao") cred = "B.Tech, 4 years teaching · background-checked";
            if (t.name === "Rohan Mehta") cred = "Ed-tech trainer · background-checked";
            if (t.name === "Sana Qureshi") cred = "Maths and coding, 9 years · background-checked";
            return (
              <div key={t.name} className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-[#15161b] p-3.5">
                <Image src={t.image} alt={`Portrait of ${t.name}`} width={48} height={48} className="size-12 shrink-0 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm text-white">{t.name}</p>
                  <p className="text-xs text-[#a2a3ab] mt-0.5">{cred}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#15161b] p-5">
          <blockquote className="text-sm leading-relaxed text-white">
            &ldquo;Meera showed us her homework helper at dinner, then explained why it got one answer wrong.&rdquo;
          </blockquote>
          <div className="mt-4 flex items-center gap-3">
            <Image src="/images/tutors/priya.jpg" alt="Priya Sharma" width={36} height={36} className="size-9 rounded-full object-cover" />
            <div>
              <p className="text-xs font-semibold text-white">Priya Sharma</p>
              <p className="text-[11px] text-[#a2a3ab]">parent, Grade 6 (sample)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING */}
      <section id="fees" aria-labelledby="mobile-fees-title" className="bg-[#f3f1ec] text-ink px-5 py-12">
        <h2 id="mobile-fees-title" className="font-display text-[28px] font-normal leading-tight tracking-[-0.03em] text-ink mb-6">
          One price. Everything included.
        </h2>
        <div className="rounded-2xl border-t-2 border-t-brand bg-[#15161b] p-5 text-white shadow-xl">
          <p className="font-display text-5xl font-normal tracking-tight text-white leading-none">&#8377;4,999</p>
          <p className="mt-2 text-xs font-medium text-white/80">&#8377;2,500 to join &middot; &#8377;2,499 before level 5</p>
          <ul className="mt-5 space-y-3 text-xs">
            {["8 tutor-led classes at school", "All materials and AI tool access", "Updates after levels 2, 4 and 6", "Demo day and a digital portfolio"].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-brand text-ink font-bold text-[10px]">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 rounded-2xl bg-[#ffe2d4] p-5 text-ink">
          <p className="font-mono text-[11px] text-ink/60">Our promise</p>
          <p className="mt-2 text-xs font-medium leading-relaxed text-ink">
            Attend at least 6 of 8 classes. If your child can&apos;t show a working AI helper at demo day, we refund the second payment.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" aria-labelledby="mobile-faq-title" className="bg-[#f3f1ec] text-ink px-5 pb-14">
        <h2 id="mobile-faq-title" className="font-display text-[28px] font-normal leading-tight tracking-[-0.03em] text-ink mb-6">
          Questions parents ask
        </h2>
        <ul className="space-y-2.5">
          {mobileFaqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <li key={item.question} className="rounded-xl border border-black/[0.08] bg-white overflow-hidden">
                <button type="button" onClick={() => setOpenFaq(isOpen ? null : idx)} aria-expanded={isOpen} className="flex w-full items-center justify-between p-4 text-left font-display text-[15px] font-semibold text-ink">
                  <span className="pr-3 leading-snug">{item.question}</span>
                  <span className="flex size-5 shrink-0 items-center justify-center text-lg font-light text-ink/60">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1">
                    <p className="text-xs leading-relaxed text-[#5f6068]">{item.answer}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* 8. SCHOOLS BANNER */}
      <section id="schools" aria-labelledby="mobile-school-banner" className="bg-[#0e0f12] text-white px-5 py-12 border-t border-white/10">
        <h2 id="mobile-school-banner" className="font-display text-[28px] font-normal leading-tight tracking-[-0.03em] text-white">
          Running a school?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#a2a3ab]">
          We bring the tutors, lessons and parent updates. You host one class a week.
        </p>
        <Link href="/#school-pack" className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-[#15161b] px-4 text-sm font-semibold text-white transition hover:bg-[#1d1e24]">
          Request the school pack <ArrowRight className="size-4" />
        </Link>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#0e0f12] border-t border-white/10 px-5 py-8 text-white">
        <Logo />
        <p className="mt-5 text-xs text-[#a2a3ab] flex flex-wrap items-center gap-1.5">
          <span>&copy; 2026 LvlUp</span>
          <span>&middot;</span>
          <Link className="hover:text-white" href={legalLinks.privacy}>Privacy</Link>
          <span>&middot;</span>
          <Link className="hover:text-white" href={legalLinks.childSafety}>Child safety</Link>
          <span>&middot;</span>
          <Link className="hover:text-white" href={legalLinks.refunds}>Refunds</Link>
        </p>
      </footer>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.10] bg-[#16171d]/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-bold text-white leading-none">&#8377;4,999</p>
            <p className="mt-0.5 text-[12px] text-white/45 leading-none">&#8377;2,500 to join</p>
          </div>
          <a href={siteConfig.whatsappUrl} className="flex h-[46px] items-center justify-center rounded-xl border border-white/20 bg-[#1e1f27] px-5 text-[14px] font-bold text-white transition hover:bg-[#25262f] shrink-0">
            WhatsApp
          </a>
          <a href={siteConfig.enrolUrl} className="flex h-[46px] items-center justify-center rounded-xl bg-brand-gradient px-5 text-[14px] font-bold text-ink shadow-glow transition hover:brightness-105 shrink-0">
            Enrol now
          </a>
        </div>
      </div>
    </div>
  );
}
