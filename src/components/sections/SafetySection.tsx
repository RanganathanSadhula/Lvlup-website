import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/IconTile";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { safetyCommitments } from "@/data/content";
import { legalLinks } from "@/data/site";

export function SafetySection() {
  return (
    <Section id="safety" tone="light" topo aria-labelledby="safety-title">
      <Container>
        <SectionHeader
          id="safety-title"
          title="Safe by design, and in writing."
          description="Five commitments we sign with every school and share with every family."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 md:items-start lg:mt-14">
          {safetyCommitments.map((c, idx) => (
            <li key={c.title}>
              <ScrollReveal delay={idx * 60}>
                <div className="flex gap-4 rounded-xl border border-black/[0.08] bg-white p-5 sm:p-6">
                  <IconTile icon={c.icon} tone="peach" className="size-10" />
                  <div>
                    <h3 className="text-[17px] font-semibold">{c.title}</h3>
                    <p className="mt-1.5 text-base leading-relaxed text-muted">{c.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            </li>
          ))}
          <li>
            <ScrollReveal delay={300}>
              <div className="rounded-xl bg-ink p-5 text-white sm:p-6">
                <Link href={legalLinks.childSafety} className="group flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[17px] font-semibold group-hover:underline">Read the full child safety policy</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-dark">
                      PDF · tools, data, who sees it
                    </p>
                  </div>
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </li>
        </ul>
      </Container>
    </Section>
  );
}
