import { cn } from "@/lib/utils";

type Tone = "light" | "dark" | "darker" | "brand";

const tones: Record<Tone, string> = {
  light: "bg-cream text-ink",
  dark: "bg-ink-2 text-white",
  darker: "bg-ink text-white",
  brand: "bg-brand-gradient text-ink",
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  topo?: boolean;
  /** Draws the faint vertical guide lines at the 1200px content edges (desktop only). */
  guides?: boolean;
}

export function Section({ tone = "light", topo = false, guides = true, className, children, ...props }: SectionProps) {
  const isDark = tone === "dark" || tone === "darker";
  return (
    <section
      className={cn("relative overflow-hidden py-16 sm:py-20 lg:py-24", tones[tone], className)}
      {...props}
    >
      {topo && (
        <div
          aria-hidden
          className={cn("pointer-events-none absolute inset-0", isDark ? "bg-topo-dark" : "bg-topo-light")}
        />
      )}
      {guides && tone !== "brand" && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-page -translate-x-1/2 border-x min-[1344px]:block",
            isDark ? "border-white/[0.07]" : "border-black/[0.08]",
          )}
        />
      )}
      <div className="relative">{children}</div>
    </section>
  );
}
