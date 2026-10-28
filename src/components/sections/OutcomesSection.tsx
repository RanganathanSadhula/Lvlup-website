import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/IconTile";
import { LevelBars } from "@/components/ui/LevelBars";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { outcomeIcons } from "@/data/content";

const card = "rounded-2xl border border-white/10 bg-[#14151a] p-6 sm:p-7";
const titleCls = "mt-5 font-display text-2xl font-normal tracking-[-0.02em] sm:text-[28px]";
const bodyCls = "mt-3 text-base leading-relaxed text-muted-dark";

export function OutcomesSection() {
  return (
    <Section
      id="outcomes"
      tone="darker"
      grain
      grainOpacity={0.52}
      aria-labelledby="outcomes-title"
    >
      <Container>
        <SectionHeader
          id="outcomes-title"
          tone="dark"
          title={<>What your child walks away with</>}
          description="Not a certificate for sitting through classes. Things they made, can show you, and can explain."
        />
        <div className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-[1.45fr_1fr]">
          {/* Card 1: Working AI helper with Revise Buddy chat visual */}
          <ScrollReveal delay={80} className="lg:row-span-2 h-full">
            <article className={`${card} group flex h-full flex-col justify-between`}>
              <div>
                <IconTile icon={outcomeIcons.helper} />
                <h3 className={titleCls}>A working AI helper</h3>
                <p className={bodyCls}>
                  Built from an approved template, tested on two tasks, and presented live at demo day.
                </p>
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-xl">
                <Image
                  src="/images/outcomes-revise-buddy.png"
                  alt="Revise Buddy chat example: photosynthesis quiz"
                  width={1024}
                  height={631}
                  unoptimized
                  quality={100}
                  className="h-auto w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </article>
          </ScrollReveal>

          {/* Card 2: Digital portfolio */}
          <ScrollReveal delay={140} className="h-full">
            <article className={`${card} h-full`}>
              <IconTile icon={outcomeIcons.portfolio} />
              <h3 className={titleCls}>A digital portfolio</h3>
              <p className={bodyCls}>
                Eight pieces of work in one place: tested prompts, a creation, a blueprint, the agent and the demo.
              </p>
              <LevelBars active={8} tall className="mt-6 h-10" />
            </article>
          </ScrollReveal>

          {/* Card 3: CBSE AI topics */}
          <ScrollReveal delay={200} className="h-full">
            <article className={`${card} h-full`}>
              <IconTile icon={outcomeIcons.cbse} />
              <h3 className={titleCls}>A head start on the new AI topics</h3>
              <p className={bodyCls}>
                From 2026–27, CBSE brings AI and computational thinking into Classes 3 to 8. LvlUp lets your child practise those ideas by building.
              </p>
            </article>
          </ScrollReveal>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          {/* Card 4: Habits that last */}
          <ScrollReveal delay={100} className="h-full">
            <article className={`${card} h-full`}>
              <IconTile icon={outcomeIcons.habits} />
              <h3 className={titleCls}>Habits that last</h3>
              <p className={bodyCls}>
                Check answers before trusting them, keep private details private, and credit where ideas came from.
              </p>
            </article>
          </ScrollReveal>

          {/* Card 5: Confidence to explain it with hover-to-colour girl image */}
          <ScrollReveal delay={160} className="h-full">
            <article className={`${card} group relative h-full overflow-hidden`}>
              <div className="relative z-10 max-w-[260px]">
                <IconTile icon={outcomeIcons.confidence} />
                <h3 className={titleCls}>The confidence to explain it</h3>
                <p className={bodyCls}>
                  A two-minute talk on what they built, why, and what they would improve next.
                </p>
              </div>
              <Image
                src="/images/outcomes-confidence-color.png"
                alt="A smiling girl with both arms raised"
                width={260}
                height={300}
                unoptimized
                quality={100}
                className="pointer-events-none absolute bottom-0 right-0 hidden h-[200px] w-auto origin-bottom-right object-contain grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0 sm:block lg:h-[235px]"
              />
            </article>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  );
}
