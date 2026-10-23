import Image from "next/image";
import { UsersRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CheckBadge, CrossBadge } from "@/components/ui/CheckBadge";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { goodFit, gradeCards, notFit } from "@/data/content";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

/** Staircase offsets (desktop) that mirror the rising cards in the design. */
const rise = ["lg:mt-[78px]", "lg:mt-[52px]", "lg:mt-[26px]", "lg:mt-0"];

export function AudienceSection() {
  return (
    <Section id="fit" tone="light" topo aria-labelledby="fit-title">
      <Container>
        <SectionHeader id="fit-title" title="Is LvlUp right for your child?" description="An honest list, so you can decide quickly." />

        <ul className="mt-12 grid grid-cols-2 gap-4 lg:mt-14 lg:grid-cols-4 lg:items-start lg:gap-4">
          {gradeCards.map((g, i) => {
            const last = i === gradeCards.length - 1;
            return (
              <li
                key={g.grade}
                className={cn(
                  "flex min-h-[150px] flex-col justify-end rounded-2xl p-5 sm:min-h-[170px] sm:p-6 lg:min-h-0 lg:h-[139px]",
                  last ? "bg-brand-gradient text-ink" : "bg-gradient-to-b from-ink-3 to-ink text-white",
                  rise[i],
                )}
              >
                <p className="flex items-end gap-2">
                  <span className="font-display text-[56px] leading-none tracking-[-0.03em]">{g.grade}</span>
                  <span className={cn("mb-1.5 text-xs font-semibold", last ? "text-ink" : "text-brand")}>Grade</span>
                </p>
                <p className="mt-1 text-sm font-semibold">{g.title}</p>
                <p className={cn("text-xs", last ? "text-ink/80" : "text-muted-dark")}>{g.body}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="grid overflow-hidden rounded-2xl border border-black/[0.08] bg-white sm:grid-cols-[203px_1fr]">
            <Image
              src="/images/audience-fit.jpg"
              alt="A girl sitting cross-legged with a laptop, one arm raised in celebration"
              width={217}
              height={271}
              quality={90}
              className="h-56 w-full object-cover object-top sm:h-full"
            />
            <div className="p-6 sm:p-8">
              <h3 className="font-display text-[26px] tracking-[-0.02em]">A good fit if your child…</h3>
              <ul className="mt-5 space-y-3.5">
                {goodFit.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-snug"><CheckBadge />{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-2xl bg-cream-2 p-6 sm:p-8">
            <h3 className="font-display text-[26px] tracking-[-0.02em]">Not the right fit if you want…</h3>
            <ul className="mt-5 space-y-3.5">
              {notFit.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px] leading-snug"><CrossBadge />{t}</li>
              ))}
            </ul>
            <a
              href={siteConfig.whatsappUrl}
              className="mt-5 flex min-h-12 items-center gap-3 rounded-lg bg-white px-4 py-3 text-sm transition hover:shadow-md"
            >
              <UsersRound aria-hidden className="size-4 shrink-0 text-brand-dark" />
              Not sure? Ask us on WhatsApp. A person replies.
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
