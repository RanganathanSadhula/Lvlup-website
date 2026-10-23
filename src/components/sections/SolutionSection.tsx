import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/IconTile";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { solutionCards } from "@/data/content";

export function SolutionSection() {
  return (
    <Section id="course" tone="dark" topo aria-labelledby="solution-title">
      <Container>
        <SectionHeader
          id="solution-title"
          tone="dark"
          title={<>LvlUp turns AI users into thoughtful builders.</>}
          description="Every class mixes a short idea, a tutor demo and a lot of hands-on making. Children learn how AI works by using it for something real, with a tutor beside them."
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-14">
          {solutionCards.map((c) => (
            <li key={c.title} className="overflow-hidden rounded-2xl border border-white/10 bg-ink-2">
              <Image src={c.image} alt={c.alt} width={c.w} height={c.h} quality={90} sizes="(min-width:768px) 380px, 100vw" className="h-[218px] w-full object-cover" />
              <div className="p-7">
                <IconTile icon={c.icon} />
                <h3 className="mt-5 font-display text-2xl tracking-[-0.02em]">{c.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-dark">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
