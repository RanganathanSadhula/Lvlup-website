"use client";

import { useEffect, useRef, useState } from "react";
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
  const isHovered = useRef(false);
  const animFrameId = useRef<number | null>(null);

  /** Hover Auto-Scroll mechanism: increased speed, loops back to first card when reached bottom */
  useEffect(() => {
    let lastTime: number | null = null;
    let isResetting = false;
    const speed = 65; // increased smooth scroll speed (~65px/sec)

    const step = (time: number) => {
      if (!isHovered.current || !scrollRef.current) {
        animFrameId.current = null;
        return;
      }
      if (lastTime !== null && !isResetting) {
        const delta = (time - lastTime) / 1000;
        const el = scrollRef.current;
        // Don't auto-scroll while smooth scroll to level is in progress
        if (!clickLock.current) {
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
            // Reached bottom -> smoothly scroll back to the top/first card
            isResetting = true;
            el.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => {
              isResetting = false;
              lastTime = null;
              if (isHovered.current && !animFrameId.current) {
                animFrameId.current = requestAnimationFrame(step);
              }
            }, 800);
          } else {
            el.scrollTop += speed * delta;
          }
        }
      }
      lastTime = time;
      if (!isResetting) {
        animFrameId.current = requestAnimationFrame(step);
      }
    };

    const handleMouseEnter = () => {
      // Only auto-scroll on devices with hover capability (desktop)
      if (window.matchMedia("(hover: hover)").matches) {
        isHovered.current = true;
        lastTime = null;
        if (!animFrameId.current) {
          animFrameId.current = requestAnimationFrame(step);
        }
      }
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      isHovered.current = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
      if (el) {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  /** Left button -> scroll the right column to that card. */
  function goTo(level: number) {
    const el = scrollRef.current;
    const card = el?.querySelector<HTMLElement>(`#level-${level}`);
    if (!el || !card) return;
    setActive(level);
    // Ignore scroll events while the smooth scroll is running so the highlight doesn't flicker.
    if (clickLock.current) clearTimeout(clickLock.current);
    clickLock.current = setTimeout(() => (clickLock.current = null), 600);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cardRect = card.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offset = cardRect.top - elRect.top;
    el.scrollBy({ top: offset, behavior: reduce ? "auto" : "smooth" });
  }

  /** Right column scroll -> highlight the matching left button. */
  function onScroll() {
    const el = scrollRef.current;
    if (!el || clickLock.current) return;
    
    // If scrolled right to the bottom
    const lastLevel = curriculum[curriculum.length - 1];
    if (lastLevel && el.scrollTop + el.clientHeight >= el.scrollHeight - 16) {
      setActive(lastLevel.level);
      return;
    }

    const elBox = el.getBoundingClientRect();
    let current = 1;

    for (const l of curriculum) {
      const card = el.querySelector<HTMLElement>(`#level-${l.level}`);
      if (card) {
        const cardBox = card.getBoundingClientRect();
        if (cardBox.top <= elBox.top + elBox.height * 0.45) {
          current = l.level;
        }
      }
    }
    setActive(current);
  }

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-7">
      {/* Left: all 8 levels timeline stepper matching Figma (desktop only) */}
      <nav aria-label="Levels" className="hidden lg:block">
        <ol className="relative space-y-1">
          {curriculum.map((l, i) => {
            const on = active === l.level;
            const past = l.level < active;
            const isLast = i === curriculum.length - 1;

            return (
              <li key={l.level} className="relative flex items-center gap-3">
                {/* Continuous vertical timeline connector line */}
                {!isLast && (
                  <div
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute left-[17px] top-[26px] h-full w-[2px] -translate-x-1/2 z-0",
                      past ? "bg-black" : "bg-black/15",
                    )}
                  />
                )}

                {/* Circle badge: past = black, active = orange, upcoming = white with border */}
                <button
                  type="button"
                  onClick={() => goTo(l.level)}
                  aria-label={`Jump to level ${l.level}`}
                  className={cn(
                    "relative z-10 flex size-[34px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-all duration-200",
                    on
                      ? "bg-brand text-white shadow-sm ring-4 ring-brand/20"
                      : past
                      ? "bg-black text-white"
                      : "border-2 border-black/20 bg-white text-muted hover:border-black/40",
                  )}
                >
                  {l.level}
                </button>

                {/* Card item with title and makes info */}
                <button
                  type="button"
                  onClick={() => goTo(l.level)}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "flex flex-1 flex-col rounded-2xl px-3.5 py-2.5 text-left transition-all duration-200",
                    on
                      ? "bg-[#ffe2d4] text-ink shadow-sm"
                      : "text-ink hover:bg-black/[0.04]",
                  )}
                >
                  <span className={cn("block text-sm leading-snug", on ? "font-bold text-ink" : "font-semibold text-ink")}>
                    {l.title}
                  </span>
                  <span className={cn("mt-0.5 block text-xs", on ? "text-ink/75" : "text-muted")}>
                    Makes: {l.navMakes}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Right: all 8 cards, scrolls on its own on desktop; normal stacked page on mobile */}
      <div className="relative">
        {/* Mobile horizontal level buttons */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none]">
          {curriculum.map((l) => (
            <button
              key={l.level}
              type="button"
              onClick={() => goTo(l.level)}
              aria-label={`Jump to level ${l.level}`}
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold transition-all active:scale-95",
                active === l.level
                  ? "bg-brand text-white shadow-sm ring-2 ring-brand/30"
                  : "border border-black/10 bg-white text-ink/70 hover:border-black/30"
              )}
            >
              {l.level}
            </button>
          ))}
        </div>

        <div
          ref={scrollRef}
          onScroll={onScroll}
          tabIndex={0}
          aria-label="Level details"
          className="relative space-y-5 lg:absolute lg:inset-0 lg:overflow-y-scroll lg:pr-3 lg:[scrollbar-color:#ff6b2c_transparent] lg:[scrollbar-width:thin]"
        >
          {curriculum.map((l) => (
            <div key={l.level}>
              <LevelCard data={l} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}