import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PartnersSection } from "./PartnersSection";
import { ProofSection } from "./ProofSection";
import { TutorsSection } from "./TutorsSection";

/** Composes the "See how we teach" block: class demo + tutors, testimonials + pilot metrics, partner schools. */
export function TeachingSection() {
  return (
    <Section id="teaching" tone="darker" topo aria-labelledby="teaching-title">
      <Container>
        <SectionHeader
          id="teaching-title"
          tone="dark"
          title={<>See how we teach before you decide.</>}
          description="We are running our first batches, so we show our work instead of asking you to trust a big number."
        />
        <div className="mt-12 lg:mt-14">
          <TutorsSection />
        </div>
        <ProofSection />
        <PartnersSection />
      </Container>
    </Section>
  );
}
