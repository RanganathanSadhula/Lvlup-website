"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Download } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { cn } from "@/lib/utils";
import { LevelCard } from "./LevelCard";

export function LevelExplorer() {
  const [active, setActive] = useState(1);
  const activeRef = useRef(1);
  activeRef.current = active;

  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /** Scrolls the right-hand cards container to the target level */
  const scrollToCard = useCallback((level: number) => {
    const el = scrollRef.current;
    if (!el) return;

    if (level === 1) {
      el.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const card = el.querySelector<HTMLElement>(`#level-card-${level}`);
    if (!card) return;

    const cardRect = card.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offset = cardRect.top - elRect.top;
    el.scrollBy({ top: offset, behavior: "smooth" });
  }, []);

  /** Jump to a specific level when clicked */
  const goTo = useCallback(
    (level: number) => {
      const clamped = Math.max(1, Math.min(8, level));
      setActive(clamped);
      activeRef.current = clamped;
      scrollToCard(clamped);

      // Smoothly sync window scroll in the sticky track
      const track = trackRef.current;
      if (track && typeof window !== "undefined" && window.innerWidth >= 1024) {
        const scrollDistance = track.offsetHeight - window.innerHeight;
        if (scrollDistance > 0) {
          const targetY =
            track.offsetTop - 74 + (scrollDistance * (clamped - 1)) / 7;
          window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        }
      }
    },
    [scrollToCard]
  );

  /**
   * 100% Jerk-Free Native Sticky Scroll:
   * Uses CSS position: sticky to pin the screen with zero JS-scroll interference.
   * Advances Level 1 -> Level 2 -> ... -> Level 8 as user scrolls down.
   * Reverses Level 8 -> Level 7 -> ... -> Level 1 as user scrolls up.
   * Unlocks naturally before Level 1 and after Level 8.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (window.innerWidth < 1024) return;
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const headerOffset = 74;

      const scrollDistance = track.offsetHeight - window.innerHeight;
      if (scrollDistance <= 0) return;

      const currentScroll = -rect.top + headerOffset;
      const rawProgress = currentScroll / scrollDistance;
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Calculate level 1 to 8 across the scroll track
      const level = Math.min(8, Math.max(1, 1 + Math.floor(progress * 7.99)));

      if (level !== activeRef.current) {
        activeRef.current = level;
        setActive(level);
        scrollToCard(level);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollToCard]);

  return (
    <div ref={trackRef} className="relative lg:h-[350vh]">
      {/* ── STICKY VIEWPORT CONTAINER (Locks rock-solid at Image 2 framing) ── */}
      <div className="lg:sticky lg:top-[74px] flex flex-col justify-between pb-6">
        {/* ── 2-COLUMN GRID (Left Timeline + Right Cards) ── */}
        <div className="grid items-stretch gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-7">
          {/* Left: all 8 levels timeline stepper */}
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
                          past ? "bg-black" : "bg-black/15"
                        )}
                      />
                    )}

                    {/* Circle badge */}
                    <button
                      type="button"
                      onClick={() => goTo(l.level)}
                      aria-label={`Jump to level ${l.level}`}
                      className={cn(
                        "relative z-10 flex size-[34px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-all duration-300 cursor-pointer",
                        on
                          ? "bg-brand text-white shadow-md ring-4 ring-brand/25 scale-105"
                          : past
                          ? "bg-black text-white"
                          : "border-2 border-black/20 bg-white text-muted hover:border-black/40"
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
                        "flex flex-1 flex-col rounded-2xl px-3.5 py-2.5 text-left transition-all duration-300 cursor-pointer",
                        on
                          ? "bg-[#ffe2d4] text-ink shadow-sm translate-x-1"
                          : "text-ink hover:bg-black/[0.04]"
                      )}
                    >
                      <span
                        className={cn(
                          "block text-sm leading-snug transition-colors duration-200",
                          on ? "font-bold text-ink" : "font-semibold text-ink/80"
                        )}
                      >
                        {l.title}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block text-xs transition-colors duration-200",
                          on ? "text-ink/80 font-medium" : "text-muted"
                        )}
                      >
                        Makes: {l.navMakes}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Right: all 8 cards */}
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
                    "flex size-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold transition-all active:scale-95 cursor-pointer",
                    active === l.level
                  ? "bg-brand text-white shadow-sm ring-2 ring-brand/30"
                  : "border border-black/10 bg-white text-ink/70 hover:border-black/30"
                  )}
                >
                  {l.level}
                </button>
              ))}
            </div>

            {/* Container sized to fit full cards with generous padding and no bottom cutting */}
            <div
              ref={scrollRef}
              tabIndex={0}
              aria-label="Level details"
              className="relative space-y-6 lg:h-[485px] lg:min-h-[485px] lg:overflow-y-hidden p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {curriculum.map((l) => (
                <div key={l.level} id={`level-card-${l.level}`} className="pb-1">
                  <LevelCard data={l} isActive={active === l.level} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM BANNER (Matching Image 2) ── */}
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-black/[0.08] bg-white px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
            <p className="shrink-0 font-bold text-[15px] sm:text-[16px] text-[#111216]">
              Same goal for every child, set at the right level.
            </p>
            <p className="text-[14px] text-[#6b7280] leading-relaxed">
              Grades 5–6 build with guided templates. Grades 7–8 add more logic and test on their own.
            </p>
          </div>
          <a
            href="/downloads/LvlUp-Eight-Week-Curriculum.pdf"
            download="LvlUp Eight-Week Curriculum.pdf"
            className="inline-flex items-center gap-2.5 rounded-xl border border-black/80 bg-white px-4 py-2.5 text-[14px] font-semibold text-[#111216] shadow-sm transition-all duration-200 hover:bg-black/[0.04] active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Download className="size-4 stroke-[2]" />
            <span>Download full curriculum</span>
            <span className="rounded bg-[#feece3] px-1.5 py-0.5 text-[10px] font-bold text-[#ff6020] uppercase leading-none">
              PDF
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
