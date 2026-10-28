import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { facts } from "@/data/content";

export function FactsSection() {
  return (
    <section aria-label="Course facts" className="bg-ink text-white">
      <Container>
        <dl className="grid grid-cols-2 border-t border-white/70 lg:grid-cols-4">
          {facts.map((f, i) => (
            <ScrollReveal key={f.value} delay={i * 80}>
              <div
                className={`px-0 py-6 sm:py-8 lg:py-9 ${i % 2 === 1 ? "pl-5" : ""} ${i > 0 ? "lg:border-l lg:border-white/70 lg:pl-7" : ""} ${i % 2 === 1 ? "border-l border-white/30 lg:border-white/70" : ""}`}
              >
                <dt className="font-display text-2xl tracking-[-0.02em] sm:text-3xl lg:text-[32px]">{f.value}</dt>
                <dd className="mt-2 max-w-[220px] text-sm leading-snug text-muted-dark">{f.label}</dd>
              </div>
            </ScrollReveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
