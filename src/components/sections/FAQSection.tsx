"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { parentFaq, schoolFaq } from "@/data/faq";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types";

type Tab = "parents" | "schools";

function Accordion({ items, idPrefix }: { items: FaqItem[]; idPrefix: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        const panelId = `${idPrefix}-panel-${i}`;
        const buttonId = `${idPrefix}-button-${i}`;
        return (
          <li key={item.question} className="rounded-xl border border-black/[0.08] bg-white">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex min-h-[60px] w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left text-[15px] font-semibold sm:px-6"
              >
                {item.question}
                {open ? <Minus aria-hidden className="size-5 shrink-0" /> : <Plus aria-hidden className="size-5 shrink-0" />}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn("grid transition-[grid-template-rows] duration-200", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-base leading-relaxed text-muted sm:px-6">{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function FAQSection() {
  const [tab, setTab] = useState<Tab>("parents");
  const uid = useId();
  const tabs: { id: Tab; label: string }[] = [
    { id: "parents", label: "For parents" },
    { id: "schools", label: "For schools" },
  ];

  return (
    <Section id="faq" tone="light" aria-labelledby="faq-title" className="pt-8 sm:pt-10 lg:pt-12">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] lg:gap-16">
        <ScrollReveal delay={80}>
          <div>
            <h2 id="faq-title" className="font-display text-[34px] font-normal leading-[1.08] tracking-[-0.03em] sm:text-[42px] lg:text-[48px]">
              Questions parents ask
            </h2>
            <div role="tablist" aria-label="FAQ audience" className="mt-6 inline-flex rounded-xl bg-cream-2 p-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  id={`${uid}-tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`${uid}-tabpanel`}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") setTab(tab === "parents" ? "schools" : "parents");
                  }}
                  className={cn(
                    "min-h-10 rounded-lg px-4 text-sm font-semibold transition",
                    tab === t.id ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="mt-6 max-w-[340px] text-base leading-relaxed text-muted">
              Something else? WhatsApp us at{" "}
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-ink"
              >
                {siteConfig.whatsappLabel}
              </a>
              . A person replies within a few hours. We only message you about your child’s batch, and you can reply STOP at any time.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <div role="tabpanel" id={`${uid}-tabpanel`} aria-labelledby={`${uid}-tab-${tab}`}>
            {tab === "parents" ? (
              <Accordion key="parents" items={parentFaq} idPrefix={`${uid}-p`} />
            ) : (
              <Accordion key="schools" items={schoolFaq} idPrefix={`${uid}-s`} />
            )}
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
