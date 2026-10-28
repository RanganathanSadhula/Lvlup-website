import Image from "next/image";
import {
  Award,
  Bot,
  BookOpen,
  MessageSquareText,
  MonitorPlay,
  Sparkles,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurriculumLevel } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  Bot,
  BookOpen,
  MessageSquareText,
  MonitorPlay,
  Sparkles,
  Target,
  Workflow,
};

export function LevelCard({ data }: { data: CurriculumLevel }) {
  const { level, week, title, summary, topics, makes, parentsSee, image, icon } = data;
  const Icon = ICON_MAP[icon] ?? Award;
  const hasCustomIcon = level >= 1 && level <= 8;

  return (
    <article
      id={`level-${level}`}
      aria-labelledby={`level-${level}-title`}
      className="group grid overflow-hidden rounded-[24px] border border-black/[0.08] bg-white shadow-sm transition-all duration-300 sm:grid-cols-[250px_1fr] lg:grid-cols-[275px_1fr]"
    >
      {/* ── LEFT COLUMN: Photo with Level / Week Badge (Exact Figma match) ── */}
      <div className="relative h-64 w-full overflow-hidden bg-[#18191e] sm:h-full sm:min-h-[380px]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          unoptimized
          quality={100}
          sizes="(min-width:1024px) 275px, (min-width:640px) 250px, 100vw"
          className="h-full w-full object-cover object-top grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
        />

        {/* Floating badge top-left: Level X / Week X (Exact Figma sample) */}
        <div className="absolute left-3.5 top-3.5 z-10 flex min-w-[56px] flex-col items-center justify-center rounded-2xl bg-white px-3 py-2 text-center shadow-md border border-black/[0.06]">
          <span className="text-[11px] font-medium text-[#71717a]">Level</span>
          <span className="font-display text-[28px] font-bold leading-none text-black my-0.5">{level}</span>
          <span className="text-[11px] font-semibold text-[#ff6020] leading-none">Week {week}</span>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Content (Exact Figma sample media_1793197567948_60a7d2c6.png) ── */}
      <div className="flex flex-col justify-between p-6 sm:p-7 lg:p-8">
        <div>
          {/* Header Row: Custom Illustrated Peach Icon Tile + Title side by side */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            {hasCustomIcon ? (
              <div className="size-12 sm:size-14 shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src={`/images/curriculum/icons/level-${level}.png`}
                  alt={`${title} icon`}
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-2xl bg-[#feece3]">
                <Icon aria-hidden className="size-6 text-[#ff6020] stroke-[2]" />
              </div>
            )}
            <h3
              id={`level-${level}-title`}
              className="font-display text-[24px] sm:text-[28px] lg:text-[30px] font-semibold leading-tight tracking-[-0.03em] text-[#111216]"
            >
              {title}
            </h3>
          </div>

          {/* Subtitle / Summary */}
          <p className="mt-3.5 text-[15px] sm:text-[15.5px] leading-relaxed text-[#6b7280]">
            {summary}
          </p>

          {/* Topics Pills: Light gray pill with orange number (Exact Figma sample) */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            {topics.map((t, i) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 rounded-full bg-[#f4f4f6] px-3.5 py-1.5 text-[13px] sm:text-[13.5px] font-medium text-[#18181b]"
              >
                <span className="font-bold text-[#ff6020]">{i + 1}</span>
                <span>{t}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Peach Box: Your child makes | Parents see (Exact Figma sample) */}
        <div className="mt-6 rounded-2xl bg-[#ffece3] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6">
          <div>
            <span className="block text-[12.5px] text-[#6b7280]">Your child makes</span>
            <p className="mt-1 text-[14.5px] sm:text-[15px] font-bold leading-snug text-[#111216]">
              {makes}
            </p>
          </div>
          <div>
            <span className="block text-[12.5px] text-[#6b7280]">Parents see</span>
            <p className="mt-1 text-[14.5px] sm:text-[15px] font-bold leading-snug text-[#111216]">
              {parentsSee}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
