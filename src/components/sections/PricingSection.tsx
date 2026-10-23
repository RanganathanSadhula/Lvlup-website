import { ButtonLink } from "@/components/ui/Button";
import { CheckBadge } from "@/components/ui/CheckBadge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pricing } from "@/data/content";
import { siteConfig } from "@/data/site";

export function PricingSection() {
  return (
    <Section id="fees" tone="light" aria-labelledby="fees-title" className="pb-8 sm:pb-10 lg:pb-12">
      <div aria-hidden className="bg-chevrons pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_40%,transparent)]" />
      <Container className="relative">
        <SectionHeader
          id="fees-title"
          title={<>One price. Everything included.</>}
          description="No packages to compare, no hidden extras, no countdown timers."
        />
        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-[1.06fr_1fr] lg:items-start">
          <article className="overflow-hidden rounded-3xl border-t-2 border-t-brand bg-gradient-to-b from-ink-2 to-ink p-6 text-white shadow-2xl sm:p-8 lg:p-9">
            <p className="font-mono text-xs text-muted-dark">LvlUp · all 8 levels</p>
            <p className="mt-6 flex flex-wrap items-end gap-x-3">
              <span className="font-display text-[72px] leading-none tracking-[-0.04em] sm:text-[88px]">{pricing.total}</span>
              <span className="pb-3 text-sm text-muted-dark">for the full course</span>
            </p>
            <dl className="mt-7 grid grid-cols-2 divide-x divide-white/10 rounded-xl border border-white/10">
              {pricing.installments.map((p) => (
                <div key={p.amount} className="px-5 py-4">
                  <dd className="text-xl font-medium">{p.amount}</dd>
                  <dt className="mt-1 text-sm text-muted-dark">{p.label}</dt>
                </div>
              ))}
            </dl>
            <ul className="mt-7 space-y-4">
              {pricing.inclusions.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[15px]"><CheckBadge />{t}</li>
              ))}
            </ul>
            <ButtonLink href={siteConfig.enrolUrl} className="mt-8 w-full">Enrol with your school code</ButtonLink>
            <p className="mt-5 text-sm text-muted-dark">Pay by UPI, card or net banking. Fees are paid to LvlUp, not to your school.</p>
          </article>

          <div className="space-y-5">
            <article className="rounded-3xl bg-peach p-6 sm:p-8">
              <p className="font-mono text-xs text-ink/70">Our promise</p>
              <h3 className="mt-4 font-display text-[26px] leading-[1.2] tracking-[-0.02em] sm:text-[30px]">{pricing.promiseTitle}</h3>
              <ul className="mt-6 space-y-3.5">
                {pricing.promisePoints.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] leading-snug"><CheckBadge />{t}</li>
                ))}
              </ul>
            </article>
            <aside className="rounded-2xl border border-black/[0.08] bg-white/40 p-6 sm:p-7">
              <h3 className="text-[15px] font-semibold">What you won’t pay for</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                A laptop at home, extra kits, app subscriptions or a certificate fee. Classes use your school’s computer lab.
              </p>
            </aside>
          </div>
        </div>
      </Container>
    </Section>
  );
}
