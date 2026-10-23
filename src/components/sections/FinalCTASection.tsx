import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

export function FinalCTASection() {
  return (
    <section id="enrol" aria-labelledby="cta-title" className="relative overflow-hidden bg-brand-gradient py-16 text-ink sm:py-20">
      <div aria-hidden className="bg-chevrons pointer-events-none absolute inset-0 opacity-70" />
      <Container className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="cta-title" className="font-display text-[40px] font-normal leading-none tracking-[-0.035em] sm:text-[52px]">
            Ready for level 1?
          </h2>
          <p className="mt-4 max-w-[560px] text-base sm:text-lg">
            Enrol with your school code, or ask us to bring LvlUp to your school.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={siteConfig.enrolUrl} variant="dark">Enrol now</ButtonLink>
          <ButtonLink href="/#school-pack" variant="outline-dark">Request the school pack</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
