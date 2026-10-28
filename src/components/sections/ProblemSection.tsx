import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

const cards = [
  {
    image: "/images/problem-copy.png",
    alt: "Chatbot falsely answering capital of Australia as Sydney, copied into homework",
    title: "They copy answers they can’t check",
    body: "A chatbot sounds sure even when it is wrong. Children need the habit of checking.",
  },
  {
    image: "/images/problem-share.png",
    alt: "Student sharing private name, school and phone number into stranger app",
    title: "They share more than they should",
    body: "Names, school and photos go into tools without a second thought.",
  },
  {
    image: "/images/problem-magic.png",
    alt: "AI assistant responding that it learned patterns from examples",
    title: "They see AI as magic",
    body: "Not as a tool they can question, shape and build with.",
  },
];

export function ProblemSection() {
  return (
    <Section id="problem" tone="light" aria-labelledby="problem-title">
      <Container>
        <SectionHeader
          id="problem-title"
          title={
            <>
              Kids already use AI.
              <br className="hidden sm:block" /> Few are shown how it works.
            </>
          }
          description="They use chatbots for homework and meet AI in games. School rarely has time for how it decides, when it is wrong and what to keep private."
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-14">
          {cards.map((c, i) => (
            <li key={c.title}>
              <ScrollReveal delay={i * 120}>
                <div className="group flex flex-col rounded-2xl border border-black/[0.08] bg-white p-5 sm:p-6 transition-all duration-300 hover:shadow-md">
                  <div className="relative aspect-[652/344] w-full overflow-hidden rounded-xl">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      unoptimized
                      quality={100}
                      className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-6 font-display text-[22px] font-normal leading-snug tracking-[-0.02em] text-ink sm:text-[24px]">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {c.body}
                  </p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
