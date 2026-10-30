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
  grain?: boolean;
  grainOpacity?: number;
  /** Draws the faint vertical guide lines at the 1200px content edges (desktop only). */
  guides?: boolean;
  overflow?: "hidden" | "visible";
}

export function Section({
  tone = "light",
  topo = false,
  grain = false,
  grainOpacity = 0.52,
  guides = true,
  overflow = "hidden",
  className,
  children,
  ...props
}: SectionProps) {
  const isDark = tone === "dark" || tone === "darker";
  return (
    <section
      className={cn(
        "relative scroll-mt-16 py-16 sm:py-20 lg:py-24",
        overflow === "visible" ? "overflow-visible" : "overflow-hidden",
        tones[tone],
        className
      )}
      {...props}
    >
      {topo && (
        <div
          aria-hidden
          className={cn("pointer-events-none absolute inset-0", isDark ? "bg-topo-dark" : "bg-topo-light")}
        />
      )}
      {grain && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            backgroundImage: 'url("/images/grain-dark.png")',
            backgroundRepeat: "repeat",
            opacity: grainOpacity,
          }}
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
      <div className="relative z-10">{children}</div>
    </section>
  );
}
