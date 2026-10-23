"use client";

import { useEffect, useState } from "react";
import { Award, Bot, BookOpen, MessageSquareText, MonitorPlay, Sparkles, Target, Workflow, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurriculumLevel } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Award, Bot, BookOpen, MessageSquareText, MonitorPlay, Sparkles, Target, Workflow,
};

/** Sticky level navigator. Highlights the level card currently in view and links to each card. */
export function LevelNav({ levels }: { levels: CurriculumLevel[] }) {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const els = levels
      .map((l) => document.getElementById(`level-${l.level}`))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) setActive(Number(first.target.id.replace("level-", "")));
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [levels]);

  return (
    <nav aria-label="Levels" className="sticky top-24 rounded-xl border border-black/[0.08] bg-white p-2 shadow-card">
      <ol>
        {levels.map((l) => {
          const Icon = ICON_MAP[l.icon] ?? Award;
          const on = active === l.level;
          return (
            <li key={l.level}>
              <a
                href={`#level-${l.level}`}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "flex items-start gap-3 rounded-lg px-3 py-3 transition",
                  on ? "bg-ink text-white" : "text-ink hover:bg-cream",
                )}
              >
                <span className={cn("mt-0.5 w-5 font-mono text-[11px]", on ? "text-brand" : "text-muted")}>
                  {String(l.level).padStart(2, "0")}
                </span>
                <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-dark" />
                <span>
                  <span className="block text-sm font-semibold leading-tight">{l.title}</span>
                  <span className={cn("mt-1 block text-xs", on ? "text-muted-dark" : "text-muted")}>Makes: {l.navMakes}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
