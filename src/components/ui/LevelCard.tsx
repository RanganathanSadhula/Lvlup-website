import Image from "next/image";
import { Award, Bot, BookOpen, MessageSquareText, MonitorPlay, Sparkles, Target, Workflow, type LucideIcon } from "lucide-react";
import { LevelBars } from "@/components/ui/LevelBars";
import { cn } from "@/lib/utils";
import type { CurriculumLevel } from "@/types";

const rhythm = [
  { label: "Ideas", min: 10 },
  { label: "Tutor demo", min: 15 },
  { label: "Guided practice", min: 20 },
  { label: "Building", min: 35 },
  { label: "Sharing", min: 10 },
] as const;

const ICON_MAP: Record<string, LucideIcon> = {
  Award, Bot, BookOpen, MessageSquareText, MonitorPlay, Sparkles, Target, Workflow,
};

export function LevelCard({ data }: { data: CurriculumLevel }) {
  const { level, week, title, summary, topics, makes, parentsSee, image, icon, featured } = data;
  const Icon = ICON_MAP[icon] ?? Award;
  return (
    <article
      id={`level-${level}`}
      aria-labelledby={`level-${level}-title`}
      className={cn(
        "group grid overflow-hidden rounded-2xl border transition-all duration-300 sm:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]",
        featured ? "border-ink bg-ink text-white shadow-xl" : "border-black/[0.08] bg-white",
      )}
    >
      <div className="relative h-56 w-full overflow-hidden sm:h-full">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          quality={95}
          unoptimized
          sizes="(min-width:1024px) 240px, (min-width:640px) 200px, 100vw"
          className="h-full w-full object-cover object-center grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
        />
        {/* Floating badge top-left: Level X / Week X */}
        <div className="absolute left-3 top-3 z-10 flex min-w-[50px] flex-col items-center justify-center rounded-xl bg-white px-2.5 py-1.5 text-center shadow-md border border-black/5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted">Level</span>
          <span className="font-display text-[22px] font-bold leading-none text-ink my-0.5">{level}</span>
          <span className="text-[10px] font-semibold text-[#ff6b2c] leading-none">Week {week}</span>
        </div>
      </div>
      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
            <Icon aria-hidden className="size-5" />
            Level {level} · Week {week}
          </p>
          <LevelBars active={level} current={featured ? level : undefined} className="h-3 w-24 sm:w-28" />
        </div>

        <h3 id={`level-${level}-title`} className="mt-4 font-display text-[30px] leading-tight tracking-[-0.025em] sm:text-[36px]">
          {title}
        </h3>
        <p className={cn("mt-2 text-base", featured ? "text-muted-dark" : "text-muted")}>{summary}</p>

        <ol className="mt-5 flex flex-wrap gap-2.5">
          {topics.map((t, i) => (
            <li
              key={t}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm",
                featured ? "bg-ink-3 text-white" : "bg-cream text-ink",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-full text-[11px] font-semibold",
                  featured ? "bg-ink-4 text-white" : "bg-white text-brand-dark ring-1 ring-black/10",
                )}
              >
                {i + 1}
              </span>
              {t}
            </li>
          ))}
        </ol>

        <div className="mt-7">
          <p className={cn("text-xs font-semibold uppercase tracking-wide", featured ? "text-muted-dark" : "text-muted")}>
            How each 90-minute class runs
          </p>
          <ul className="mt-3 flex gap-1">
            {rhythm.map((r) => (
              <li key={r.label} style={{ flex: r.min }} className="min-w-0">
                <span
                  aria-hidden
                  className={cn(
                    "block h-2 rounded-full",
                    r.label === "Building" ? "bg-brand" : featured ? "bg-white/20" : "bg-brand/30",
                  )}
                />
                <span className="mt-2 block truncate text-[11px] font-medium leading-tight">{r.label}</span>
                <span className={cn("block text-[11px]", featured ? "text-muted-dark" : "text-muted")}>{r.min} min</span>
              </li>
            ))}
          </ul>
        </div>

        <dl className={cn("mt-8 grid gap-5 rounded-xl p-5 pt-5 sm:grid-cols-2", featured ? "bg-ink-3" : "bg-peach")}>
          <div>
            <dt className={cn("text-sm", featured ? "text-muted-dark" : "text-ink/60")}>Your child makes</dt>
            <dd className="mt-1.5 text-base font-semibold leading-snug">{makes}</dd>
          </div>
          <div>
            <dt className={cn("text-sm", featured ? "text-muted-dark" : "text-ink/60")}>Parents see</dt>
            <dd className="mt-1.5 text-base font-semibold leading-snug">{parentsSee}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}