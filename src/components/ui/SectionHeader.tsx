"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
  id?: string;
}

export function SectionHeader({ title, description, tone = "light", className, id }: SectionHeaderProps) {
  return (
    <ScrollReveal>
      <div className={cn("grid items-start gap-5 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-x-16 lg:gap-x-24", className)}>
        <h2
          id={id}
          className="font-display text-[34px] font-normal leading-[1.08] tracking-[-0.03em] sm:text-[42px] lg:text-[48px]"
        >
          {title}
        </h2>
        {description && (
          <p className={cn("text-base leading-[1.7] sm:text-lg md:pt-2", tone === "dark" ? "text-muted-dark" : "text-muted")}>
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
