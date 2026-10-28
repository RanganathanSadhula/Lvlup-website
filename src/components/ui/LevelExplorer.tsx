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
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const clickLock = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userPauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHovered = useRef(false);
  const isPausedByUser = useRef(false);
  const isResetting = useRef(false);
  const animFrameId = useRef<number | null>(null);
  const accumulatedPos = useRef(0);

  /** Continuous Smooth Auto-Scroll mechanism:
   *  - Automatically scrolls down smoothly when in view.
   *  - Pauses when hovered (so the user can read the card or click).
   *  - Pauses when the user clicks a level button or manually scrolls.
   *  - Loops smoothly back to Level 1 when reaching the bottom.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const el = scrollRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let isVisible = true;
    let lastTime: number | null = null;
    const speed = 45; // smooth ~45px/sec

    accumulatedPos.current = el.scrollTop;

    const step = (time: number) => {
      if (
        !isVisible ||
        isHovered.current ||
        isPausedByUser.current ||
        clickLock.current ||
        isResetting.current ||
        !scrollRef.current
      ) {
        lastTime = null;
        animFrameId.current = requestAnimationFrame(step);
        return;
      }

      if (lastTime !== null) {
        const delta = Math.min((time - lastTime) / 1000, 0.1);
        const scrollEl = scrollRef.current;
        const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;

        if (maxScroll > 10) {
          if (scrollEl.scrollTop >= maxScroll - 6) {
            // Reached bottom -> pause briefly at Level 8, then smoothly loop back to top
            isResetting.current = true;
            setTimeout(() => {
              scrollEl.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => {
                accumulatedPos.current = 0;
                isResetting.current = false;
                lastTime = null;
              }, 1000);
            }, 1500);
          } else {
            accumulatedPos.current += speed * delta;
            scrollEl.scrollTop = accumulatedPos.current;
          }
        }
      }

      lastTime = time;
      animFrameId.current = requestAnimationFrame(step);
    };

    // IntersectionObserver to auto-scroll only when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
        if (isVisible && scrollRef.current) {
          accumulatedPos.current = scrollRef.current.scrollTop;
          lastTime = null;
        }
      },
      { threshold: 0.1 }
    );

    const rootTarget = containerRef.current || el;
    observer.observe(rootTarget);

    animFrameId.current = requestAnimationFrame(step);

    // Hover listener: pause on hover, resume on mouse leave
    const container = containerRef.current;
    const handleMouseEnter = () => {
      isHovered.current = true;
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
      if (scrollRef.current) {
        accumulatedPos.current = scrollRef.current.scrollTop;
      }
    };

    // Manual scroll / wheel listener: pause auto-scroll for 3 seconds if user scrolls manually
    const handleManualScroll = () => {
      isPausedByUser.current = true;
      if (userPauseTimer.current) clearTimeout(userPauseTimer.current);
      userPauseTimer.current = setTimeout(() => {
        isPausedByUser.current = false;
        if (scrollRef.current) {
          accumulatedPos.current = scrollRef.current.scrollTop;
        }
      }, 3000);
    };

    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("wheel", handleManualScroll, { passive: true });
      container.addEventListener("touchstart", handleManualScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (userPauseTimer.current) clearTimeout(userPauseTimer.current);
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("wheel", handleManualScroll);
        container.removeEventListener("touchstart", handleManualScroll);
      }
    };
  }, []);

  /** Left button -> scroll the right column to that card. */
  function goTo(level: number) {
    const el = scrollRef.current;
    const card = el?.querySelector<HTMLElement>(`#level-${level}`);
    if (!el || !card) return;
    setActive(level);

    // Pause auto-scroll during and after user click so they can see the card
    isPausedByUser.current = true;
    if (clickLock.current) clearTimeout(clickLock.current);
    clickLock.current = setTimeout(() => {
      clickLock.current = null;
    }, 700);

    if (userPauseTimer.current) clearTimeout(userPauseTimer.current);
    userPauseTimer.current = setTimeout(() => {
      isPausedByUser.current = false;
      if (scrollRef.current) {
        accumulatedPos.current = scrollRef.current.scrollTop;
      }
    }, 3500);

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
    
    // Keep accumulated position in sync if user dragged scrollbar
    if (isPausedByUser.current || isHovered.current) {
      accumulatedPos.current = el.scrollTop;
    }

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
    <div
      ref={containerRef}
      className="grid items-stretch gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-7"
    >
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
