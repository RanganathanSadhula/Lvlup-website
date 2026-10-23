import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "dark" | "outline-dark";

const variants: Record<Variant, string> = {
  primary: "bg-brand-gradient text-ink shadow-glow hover:brightness-105",
  outline: "border border-white/25 text-white hover:bg-white/10",
  "outline-dark": "border border-ink/70 text-ink hover:bg-ink/5",
  dark: "bg-ink text-white hover:bg-ink-3",
};

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  arrow?: boolean;
  className?: string;
  external?: boolean;
}

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] px-5 text-[15px] font-semibold transition focus-visible:outline-offset-4";

export function ButtonLink({ href, variant = "primary", children, arrow = true, className, external }: ButtonLinkProps) {
  const cls = cn(base, variants[variant], className);
  const content = (
    <>
      {children}
      {arrow && <ArrowRight aria-hidden className="size-4" />}
    </>
  );
  const isExternal = external ?? /^https?:/.test(href);
  if (isExternal) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} className={cls}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

export { base as buttonBase, variants as buttonVariants };
