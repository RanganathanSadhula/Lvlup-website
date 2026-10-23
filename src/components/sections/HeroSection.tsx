import Image from "next/image";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

import { heroMeta } from "@/data/content";
import { siteConfig } from "@/data/site";

const tests = ["Test 1 passed: asks 5 questions", "Test 2 passed: explains wrong answers"];

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-ink pb-24 pt-12 text-white sm:pt-16 lg:pb-28 lg:pt-20">
      <div aria-hidden className="bg-topo-dark pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 size-[600px] rounded-full bg-indigo-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-brand/10 blur-3xl" />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-10">
        <div>
          <p className="inline-block rounded-md bg-white/[0.06] px-3 py-1.5 font-mono text-xs text-white/70 sm:text-[13px]">
            Grades 5–8 · After school, at your child’s school
          </p>
          <h1
            id="hero-title"
            className="mt-7 font-display text-[46px] font-normal leading-[0.98] tracking-[-0.045em] sm:text-[64px] lg:text-[76px]"
          >
            Don’t just use AI.
            <br />
            Build with it.
          </h1>
          <p className="mt-7 max-w-[560px] text-base leading-[1.75] text-muted-dark sm:text-lg lg:text-xl lg:leading-[1.5]">
            LvlUp is an eight-week course taught by a trained tutor at your child’s school. Eight levels, one a week. At level 8, your child shows you a working AI helper they designed and tested themselves.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={siteConfig.enrolUrl}>Enrol with your school code</ButtonLink>
            <ButtonLink href={siteConfig.whatsappUrl} variant="outline">WhatsApp us</ButtonLink>
          </div>
          <dl className="mt-8 grid max-w-[488px] grid-cols-1 overflow-hidden rounded-lg border border-white/70 sm:grid-cols-[auto_auto_auto] sm:divide-x sm:divide-white/70">
            {heroMeta.map((m) => (
              <div key={m.label} className="border-b border-white/30 px-4 py-3 last:border-b-0 sm:border-b-0">
                <dt className="font-mono text-xs text-white/60">{m.label}</dt>
                <dd className="mt-1 whitespace-nowrap text-[15px] font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[480px] lg:mx-0">
          <div className="overflow-hidden rounded-[28px]">
            <Image
              src="/images/hero-student.jpg"
              alt="A girl with headphones working on a laptop"
              width={480}
              height={580}
              priority
              quality={90}
              sizes="(min-width:1024px) 480px, 100vw"
              className="h-[380px] w-full object-cover sm:h-[480px] lg:h-[580px]"
            />
          </div>
          <div className="relative z-10 mx-auto -mt-16 w-[92%] rounded-2xl border border-white/80 bg-ink-2 p-5 shadow-2xl lg:absolute lg:-bottom-[72px] lg:-left-9 lg:mx-0 lg:mt-0 lg:w-[320px]">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-brand">Level 6 of 8</span>
              <span className="text-white/70">Example project</span>
            </div>
            <div aria-hidden className="mt-3 flex h-6 items-end gap-1.5">
              {[5, 7.5, 10, 12.5, 14.5, 16.5, 19, 21].map((h, i) => (
                <span
                  key={i}
                  style={{ height: h }}
                  className={`relative flex-1 rounded-[3px] ${i < 6 ? "bg-brand" : "bg-ink-4"}`}
                >
                  {i === 5 && <span className="absolute inset-x-0 -top-1.5 h-[2px] rounded bg-white" />}
                </span>
              ))}
            </div>
            <h2 className="mt-4 font-display text-2xl tracking-[-0.02em]">Revise Buddy</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-dark">
              Built by Asha, Grade 6. Quizzes her on a science chapter and explains what she got wrong.
            </p>
            <ul className="mt-4 space-y-2">
              {tests.map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-lg bg-ink-3 px-3 py-3 text-sm">
                  <span aria-hidden className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded bg-brand text-ink">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
