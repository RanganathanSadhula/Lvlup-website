import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { IconTile } from "@/components/ui/IconTile";
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
          description="Five commitments we sign with every school, and share with every family before the first class."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 md:items-start lg:mt-14">
          {safetyCommitments.map((c) => (
            <li key={c.title} className="flex gap-4 rounded-xl border border-black/[0.08] bg-white p-5 sm:p-6">
              <IconTile icon={c.icon} tone="peach" className="size-10" />
              <div>
                <h3 className="text-[17px] font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-muted">{c.body}</p>
              </div>
            </li>
          ))}
          <li className="rounded-xl bg-ink p-5 text-white sm:p-6">
            <Link href={legalLinks.childSafety} className="group block">
              <h3 className="text-[17px] font-semibold group-hover:underline">Read the full child safety policy</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-dark">
                The tools we use, what we collect, who sees it, and how to reach us. <span className="underline">Read the policy (PDF)</span>
              </p>
            </Link>
          </li>
        </ul>
      </Container>
    </Section>
  );
}
