import Link from "next/link";
import { Download } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LevelExplorer } from "@/components/ui/LevelExplorer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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
        <ScrollReveal delay={100}>
          <div className="mt-12 lg:mt-14">
            <LevelExplorer />
          </div>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          {/* Bottom Banner matching Figma media_1793197999428_40ad34d2.png */}
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-black/[0.08] bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
              <p className="shrink-0 font-bold text-[15px] sm:text-[16px] text-[#111216]">
                Same goal for every child, set at the right level.
              </p>
              <p className="text-[14px] text-[#6b7280] leading-relaxed">
                Grades 5–6 build with guided templates. Grades 7–8 add more logic and test on their own.
              </p>
            </div>
            <a
              href="/downloads/LvlUp-Eight-Week-Curriculum.pdf"
              download="LvlUp Eight-Week Curriculum.pdf"
              className="inline-flex items-center gap-2.5 rounded-xl border border-black/80 bg-white px-4 py-2.5 text-[14px] font-semibold text-[#111216] shadow-sm transition-all duration-200 hover:bg-black/[0.04] active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Download className="size-4 stroke-[2]" />
              <span>Download full curriculum</span>
              <span className="rounded bg-[#feece3] px-1.5 py-0.5 text-[10px] font-bold text-[#ff6020] uppercase leading-none">
                PDF
              </span>
            </a>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
