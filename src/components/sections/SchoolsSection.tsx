import { ButtonLink } from "@/components/ui/Button";
import { CheckBadge } from "@/components/ui/CheckBadge";
import { Container } from "@/components/ui/Container";
import { SchoolPackForm } from "@/components/ui/SchoolPackForm";
import { Section } from "@/components/ui/Section";
import { schoolBenefits } from "@/data/content";
import { siteConfig } from "@/data/site";

export function SchoolsSection() {
  return (
    <Section id="schools" tone="darker" topo aria-labelledby="schools-title">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_450px] lg:gap-16">
        <div>
          <h2 id="schools-title" className="font-display text-[34px] font-normal leading-[1.08] tracking-[-0.03em] sm:text-[42px] lg:text-[48px]">
            Bring LvlUp to your school.
          </h2>
          <p className="mt-5 max-w-[520px] text-base leading-relaxed text-muted-dark sm:text-lg">
            We bring trained tutors, every lesson, enrolment, fees and parent updates. Your school hosts one class a week in its computer lab.
          </p>
          <ul className="mt-7 space-y-3.5">
            {schoolBenefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px]"><CheckBadge />{b}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/#school-pack">Request the school pack</ButtonLink>
            <ButtonLink href={siteConfig.bookingUrl} variant="outline">Book a 20-minute call</ButtonLink>
          </div>
        </div>

        <div id="school-pack" className="relative rounded-3xl bg-white p-6 text-ink sm:p-8">
          <h3 className="font-display text-2xl tracking-[-0.02em]">Get the school pack</h3>
          <p className="mb-6 mt-2 text-xs leading-relaxed text-muted">
            A 3-minute video, the deck and the brochure, sent on WhatsApp within one working day.
          </p>
          <SchoolPackForm />
        </div>
      </Container>
    </Section>
  );
}
