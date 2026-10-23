"use client";

import { useRef, useState } from "react";
import { Award, Bot, BookOpen, MessageSquareText, MonitorPlay, Sparkles, Target, Workflow, type LucideIcon } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { cn } from "@/lib/utils";
import { LevelCard } from "./LevelCard";

const ICON_MAP: Record<string, LucideIcon> = {
  Award, Bot, BookOpen, MessageSquareText, MonitorPlay, Sparkles, Target, Workflow,
};

export function LevelExplorer() {
  const [active, setActive] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const clickLock = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Left button -> scroll the right column to that card. */
  function goTo(level: number) {
    const el = scrollRef.current;
    const card = el?.querySelector<HTMLElement>(`#level-${level}`);
    if (!el || !card) return;
    setActive(level);
    // Ignore scroll events while the smooth scroll is running so the highlight doesn't flicker.
    if (clickLock.current) clearTimeout(clickLock.current);
    clickLock.current = setTimeout(() => (clickLock.current = null), 800);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: card.offsetTop, behavior: reduce ? "auto" : "smooth" });
  }

  /** Right column scroll -> highlight the matching left button. */
  function onScroll() {
    const el = scrollRef.current;
    if (!el || clickLock.current) return;
    const last = curriculum[curriculum.length - 1];
    if (last && el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
      setActive(last.level);
      return;
    }
    let current = 1;
    el.querySelectorAll<HTMLElement>("article").forEach((card) => {
      if (card.offsetTop - el.scrollTop <= el.clientHeight * 0.35) {
        current = Number(card.id.replace("level-", ""));
      }
    });
    setActive(current);
  }

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-7">
      {/* Left: all 8 buttons, no scroll bar (desktop only) */}
      <nav aria-label="Levels" className="hidden rounded-xl border border-black/[0.08] bg-white p-2 lg:block">
        <ol>
          {curriculum.map((l) => {
            const Icon = ICON_MAP[l.icon] ?? Award;
            const on = active === l.level;
            return (
              <li key={l.level}>
                <button
                  type="button"
                  onClick={() => goTo(l.level)}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition",
                    on ? "bg-ink text-white" : "text-ink hover:bg-cream",
                  )}
                >
                  <span className={cn("mt-0.5 w-5 font-mono text-[11px]", on ? "text-brand" : "text-muted")}>
                    {String(l.level).padStart(2, "0")}
                  </span>
                  <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-dark" />
                  <span>
                    <span className="block text-sm font-semibold leading-tight">{l.title}</span>
                    <span className={cn("mt-1 block text-xs", on ? "text-muted-dark" : "text-muted")}>
                      Makes: {l.navMakes}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Right: all 8 cards, scrolls on its own on desktop; normal stacked page on mobile */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          tabIndex={0}
          aria-label="Level details"
          className="relative space-y-5 lg:absolute lg:inset-0 lg:snap-y lg:snap-proximity lg:overflow-y-scroll lg:pr-3 lg:[scrollbar-color:#ff6b2c_transparent] lg:[scrollbar-width:thin]"
        >
          {curriculum.map((l) => (
            <div key={l.level} className="lg:snap-start">
              <LevelCard data={l} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}