import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { joiningSteps } from "@/data/content";
import { cn } from "@/lib/utils";

export function JoiningProcessSection() {
  return (
    <Section id="joining" tone="dark" aria-labelledby="joining-title">
      <Container>
        <SectionHeader
          id="joining-title"
          tone="dark"
          title="How joining works"
          description="Six steps from your school’s message to your child’s demo day."
        />
        <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:gap-x-5">
          {joiningSteps.map((s, i) => {
            const Icon = s.icon;
            const last = i === joiningSteps.length - 1;
            return (
              <li key={s.title} className={cn("border-t-[3px] pt-5", last ? "border-brand" : "border-white/15")}>
                <Icon aria-hidden className="size-6 text-white" strokeWidth={1.5} />
                <p className="mt-4 font-mono text-xs text-brand">Step {i + 1}</p>
                <h3 className="mt-3 text-base font-semibold leading-snug">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-dark">{s.body}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
