import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/IconTile";
import { LevelBars } from "@/components/ui/LevelBars";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { outcomeIcons } from "@/data/content";

const card = "rounded-2xl border border-white/10 bg-gradient-to-b from-ink-3 to-ink-2 p-6 sm:p-7";
const titleCls = "mt-5 font-display text-2xl tracking-[-0.02em] sm:text-[28px]";
const bodyCls = "mt-3 text-base leading-relaxed text-muted-dark";

export function OutcomesSection() {
  return (
    <Section id="outcomes" tone="darker" aria-labelledby="outcomes-title">
      <Container>
        <SectionHeader
          id="outcomes-title"
          tone="dark"
          title={<>What your child walks away with</>}
          description="Not a certificate for sitting through classes. Things they made, can show you, and can explain."
        />
        <div className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-[1.45fr_1fr]">
          <article className={`${card} lg:row-span-2`}>
            <IconTile icon={outcomeIcons.helper} />
            <h3 className={titleCls}>A working AI helper</h3>
            <p className={bodyCls}>Built from an approved template, tested on two tasks, and presented live at demo day.</p>
            <figure className="mt-7 rounded-xl border border-white/10 bg-ink p-4 sm:p-5">
              <figcaption className="font-mono text-xs text-white/60">Example: Revise Buddy, built at level 6</figcaption>
              <div className="mt-4 space-y-3 text-sm">
                <p className="ml-auto w-fit max-w-[85%] rounded-xl bg-brand px-4 py-2.5 text-ink">Quiz me on chapter 7, photosynthesis.</p>
                <p className="w-fit max-w-[80%] rounded-xl bg-ink-3 px-4 py-3">Question 1 of 5: which gas do plants take in to make food?</p>
                <p className="ml-auto w-fit max-w-[85%] rounded-xl bg-brand px-4 py-2.5 text-ink">Oxygen?</p>
                <p className="w-fit max-w-[85%] rounded-xl bg-ink-3 px-4 py-3">Not quite. Plants take in carbon dioxide and give out oxygen. Ready for question 2?</p>
              </div>
            </figure>
          </article>

          <article className={card}>
            <IconTile icon={outcomeIcons.portfolio} />
            <h3 className={titleCls}>A digital portfolio</h3>
            <p className={bodyCls}>Eight pieces of work in one place: tested prompts, a creation, a blueprint, the agent and the demo.</p>
            <LevelBars active={8} current={8} tall className="mt-6 h-12" />
          </article>

          <article className={card}>
            <IconTile icon={outcomeIcons.cbse} />
            <h3 className={titleCls}>A head start on the new AI topics</h3>
            <p className={bodyCls}>From 2026–27, CBSE brings AI and computational thinking into Classes 3 to 8. LvlUp lets your child practise those ideas by building.</p>
          </article>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <article className={card}>
            <IconTile icon={outcomeIcons.habits} />
            <h3 className={titleCls}>Habits that last</h3>
            <p className={bodyCls}>Check answers before trusting them, keep private details private, and credit where ideas came from.</p>
          </article>
          <article className={`${card} relative overflow-hidden`}>
            <div className="relative z-10 max-w-[240px]">
              <IconTile icon={outcomeIcons.confidence} />
              <h3 className={titleCls}>The confidence to explain it</h3>
              <p className={bodyCls}>A two-minute talk on what they built, why, and what they would improve next.</p>
            </div>
            <Image
              src="/images/outcomes-confidence.png"
              alt="A smiling girl with both arms raised above an open book"
              width={230}
              height={273}
              quality={90}
              className="pointer-events-none absolute bottom-0 right-0 hidden h-[210px] w-auto sm:block lg:h-[230px]"
            />
          </article>
        </div>
      </Container>
    </Section>
  );
}
