import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckBadge({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-brand text-ink", className)}>
      <Check className="size-3" strokeWidth={3.5} />
    </span>
  );
}

export function CrossBadge({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-white text-ink/70", className)}>
      <X className="size-3" strokeWidth={2.5} />
    </span>
  );
}
