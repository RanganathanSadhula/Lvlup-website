import { Container } from "@/components/ui/Container";
import { LevelExplorer } from "@/components/ui/LevelExplorer";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function CurriculumSection() {
  return (
    <Section
      id="levels"
      tone="light"
      topo
      guides
      overflow="visible"
      aria-labelledby="levels-title"
      className="py-12 sm:py-16 lg:pt-14 lg:pb-0"
    >
      <Container>
        <SectionHeader
          id="levels-title"
          title={<>Eight levels. One a week.<br className="hidden sm:block" /> Each ends with something your child made.</>}
          description="Every 90-minute class follows the same rhythm: 10 minutes of ideas, 15 of tutor demo, 20 of guided practice, 35 of building and 10 of sharing."
        />
        <div className="mt-8 lg:mt-10">
          <LevelExplorer />
        </div>
      </Container>
    </Section>
  );
}
