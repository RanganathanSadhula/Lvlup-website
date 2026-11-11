<<<<<<< HEAD
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
}

export function Logo({ className, imageClassName }: LogoProps = {}) {
  return (
    <Link
      href="/"
      aria-label="Home"
      className={cn("inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm", className)}
    >
      <Image
        src="/images/logo-full.png"
        alt="thinkova"
        width={147}
        height={36}
        priority
        className={cn("h-8 sm:h-9 w-auto object-contain", imageClassName)}
      />
    </Link>
  );
}
=======
import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" aria-label="LvlUp home" className="inline-flex items-center gap-2.5">
      <Image src="/icons/logo.svg" alt="" width={32} height={32} priority />
      <span className="font-display text-[22px] font-semibold tracking-[-0.03em] text-white">
        Lvl<span className="text-brand">Up</span>
      </span>
    </Link>
  );
}
>>>>>>> 0c48af08a90a288c46f1d0057cb12d934026860b
