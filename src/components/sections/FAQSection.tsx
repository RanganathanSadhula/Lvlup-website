"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { parentFaq, schoolFaq } from "@/data/faq";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [faqTab, setFaqTab] = useState<"parents" | "schools">("parents");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const activeItems = faqTab === "parents" ? parentFaq : schoolFaq;

  return (
    <section id="faq" aria-labelledby="faq-title" className="w-full bg-[#F4F3EE] py-24 text-[#0B0C0F]">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left FAQ Info (Cols 1-4) */}
          <div className="col-span-1 flex flex-col justify-between lg:col-span-4">
            <div>
              <h2
                id="faq-title"
                className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F] sm:text-[44px]"
              >
                Questions {faqTab === "parents" ? "parents" : "schools"}
                <br />
                ask
              </h2>

              <div className="mt-8 flex items-center rounded-full border border-[#E3E1D9] bg-[#EAE8E1] p-1 w-fit">
                <button
                  type="button"
                  onClick={() => {
                    setFaqTab("parents");
                    setOpenFaqIndex(0);
                  }}
                  className={cn(
                    "rounded-full px-5 py-2 text-xs font-semibold transition",
                    faqTab === "parents"
                      ? "bg-white text-[#0B0C0F] shadow-sm"
                      : "text-[#5A5F6B] hover:text-[#0B0C0F]"
                  )}
                >
                  For parents
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFaqTab("schools");
                    setOpenFaqIndex(0);
                  }}
                  className={cn(
                    "rounded-full px-5 py-2 text-xs font-semibold transition",
                    faqTab === "schools"
                      ? "bg-white text-[#0B0C0F] shadow-sm"
                      : "text-[#5A5F6B] hover:text-[#0B0C0F]"
                  )}
                >
                  For schools
                </button>
              </div>
            </div>

            <div className="mt-12 text-xs leading-[20px] text-[#5A5F6B]">
              Something else? WhatsApp us at{" "}
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0B0C0F] underline"
              >
                {siteConfig.whatsappLabel}
              </a>
              . A person replies within a few hours. We only message you about your child&apos;s batch,
              and you can reply STOP at any time.
            </div>
          </div>

          {/* Right Accordion (Cols 5-12) */}
          <div className="col-span-1 space-y-3 lg:col-span-8">
            {activeItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={item.question}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-white transition-all duration-200",
                    isOpen ? "border-[#D1CFC7] shadow-sm" : "border-[#E3E1D9] hover:border-[#D1CFC7]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="text-[16px] font-semibold text-[#0B0C0F]">
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "ml-4 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F4F3EE] text-[#5A5F6B] transition-colors duration-200",
                        isOpen && "bg-[#EAE8E1] text-[#0B0C0F]"
                      )}
                    >
                      {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={cn(
                          "px-6 pb-6 text-sm leading-[24px] text-[#5A5F6B] transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          isOpen ? "translate-y-0" : "-translate-y-2"
                        )}
                      >
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
