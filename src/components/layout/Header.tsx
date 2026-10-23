import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { navLinks, siteConfig } from "@/data/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNavigation } from "./MobileNavigation";

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/[0.06] bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-full max-w-page items-center justify-between px-5 sm:px-8 min-[1344px]:px-0">
        <Logo />
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-sm text-white/80">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition hover:text-white">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden lg:block"><LanguageSwitcher /></div>
          <ButtonLink href={siteConfig.enrolUrl} arrow={false} className="hidden min-h-10 px-4 text-sm lg:inline-flex">
            Enrol now
          </ButtonLink>
          <MobileNavigation links={navLinks} enrolUrl={siteConfig.enrolUrl} />
        </div>
      </div>
    </header>
  );
}
