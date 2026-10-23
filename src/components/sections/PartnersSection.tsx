import { partnerSchools } from "@/data/tutors";
import { cn } from "@/lib/utils";

export function PartnersSection() {
  return (
    <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
      <h3 className="shrink-0 text-sm font-semibold text-muted-dark lg:mr-2">Schools running LvlUp</h3>
      <ul className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {partnerSchools.map((s) => (
          <li key={s.name} className="flex items-center gap-3 rounded-lg border border-white/10 bg-ink-2 px-4 py-3.5">
            <span
              aria-hidden
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center border border-white/80 text-[11px] font-semibold",
                s.shape === "round" ? "rounded-full" : "rounded-md",
              )}
            >
              {s.initials}
            </span>
            <span className="text-sm font-medium">{s.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
