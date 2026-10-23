import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconTileProps {
  icon: LucideIcon;
  tone?: "dark" | "peach";
  className?: string;
}

export function IconTile({ icon: Icon, tone = "dark", className }: IconTileProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-xl",
        tone === "dark" ? "border border-white/10 bg-ink text-brand" : "bg-peach text-brand-dark",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.8} />
    </span>
  );
}
