import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LevelExplorer } from "@/components/ui/LevelExplorer";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { legalLinks } from "@/data/site";

export function CurriculumSection() {
  return (
    <Section id="levels" tone="light" topo aria-labelledby="levels-title">
      <Container>
        <SectionHeader
          id="levels-title"
          title={<>Eight levels. One a week.<br className="hidden sm:block" /> Each ends with something your child made.</>}
          description="Every 90-minute class follows the same rhythm: 10 minutes of ideas, 15 of tutor demo, 20 of guided practice, 35 of building and 10 of sharing."
        />
        <div className="mt-12 lg:mt-14">
          <LevelExplorer />
        </div>
        <div className="mt-10 flex flex-col gap-2 rounded-xl border border-black/[0.08] bg-white/60 px-5 py-4 text-sm sm:flex-row sm:gap-8">
          <p className="shrink-0 font-semibold">Same goal for every child, set at the right level.</p>
          <p className="text-muted">
            Grades 5–6 build with guided templates. Grades 7–8 add more logic and test on their own.{" "}
            <Link href={legalLinks.curriculum} className="underline underline-offset-2 hover:text-ink">
              Download the full curriculum (PDF).
            </Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}