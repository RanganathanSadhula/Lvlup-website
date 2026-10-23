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
