import { cn } from "@/lib/utils";

/** Eight rising bars. `active` bars are orange; the current one gets a white cap (as in the design). */
export function LevelBars({ active, current, className, tall = false }: { active: number; current?: number; className?: string; tall?: boolean }) {
  return (
    <div aria-hidden className={cn("flex items-end gap-[3px]", className)}>
      {Array.from({ length: 8 }, (_, i) => {
        const n = i + 1;
        const h = (tall ? 8 : 3) + n * (tall ? 2 : 0.75);
        return (
          <span
            key={n}
            style={{ height: h }}
            className={cn("relative flex-1 rounded-[2px]", n <= active ? "bg-brand" : "bg-white/10")}
          >
            {current === n && <span className="absolute -top-1.5 left-0 right-0 h-[2px] rounded bg-white" />}
          </span>
        );
      })}
    </div>
  );
}
