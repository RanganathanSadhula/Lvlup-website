import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  href?: string;
  asLink?: boolean;
}

export function Logo({
  className,
  imageClassName,
  href = "/",
  asLink = true,
}: LogoProps = {}) {
  const content = (
    <Image
      src="/images/logo-full.png"
      alt="thinkova"
      width={147}
      height={36}
      priority
      className={cn("h-8 sm:h-9 w-auto object-contain", imageClassName)}
    />
  );

  if (!asLink) {
    return (
      <span
        aria-label="Home"
        className={cn("inline-flex items-center rounded-sm", className)}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label="Home"
      className={cn(
        "inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm",
        className
      )}
    >
      {content}
    </Link>
  );
}
