import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { legalLinks, siteConfig } from "@/data/site";

const linkCls = "text-sm text-muted-dark transition hover:text-white";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-2 pt-16 text-white">
      <div aria-hidden className="bg-topo-dark pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="grid gap-10 pb-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[300px] text-sm leading-relaxed text-muted-dark">
              An eight-week AI course for Grades 5–8, taught by trained tutors at your child’s school.
            </p>
          </div>
          <FooterColumn title="Course">
            <li><Link className={linkCls} href="/#levels">Levels</Link></li>
            <li><Link className={linkCls} href="/#safety">Safety</Link></li>
            <li><Link className={linkCls} href="/#fees">Fees</Link></li>
            <li><Link className={linkCls} href="/#faq">FAQ</Link></li>
          </FooterColumn>
          <FooterColumn title="Schools">
            <li><Link className={linkCls} href="/#school-pack">School pack</Link></li>
            <li><a className={linkCls} href={siteConfig.bookingUrl}>Book a call</a></li>
            <li><Link className={linkCls} href={legalLinks.partnerTerms}>Partner terms</Link></li>
          </FooterColumn>
          <div id="contact" className="scroll-mt-24">
            <FooterColumn title="Contact">
              <li>
                <a
                  className={linkCls}
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp {siteConfig.whatsappLabel}
                </a>
              </li>
              <li><a className={linkCls} href={siteConfig.emailUrl}>{siteConfig.emailLabel}</a></li>
              <li><span className={linkCls}>{siteConfig.cityLabel}, India</span></li>
            </FooterColumn>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-muted-dark sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LvlUp</p>
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            <li><Link className="hover:text-white" href={legalLinks.privacy}>Privacy</Link> ·</li>
            <li><Link className="hover:text-white" href={legalLinks.childSafety}>Child safety</Link> ·</li>
            <li><Link className="hover:text-white" href={legalLinks.refunds}>Refunds</Link> ·</li>
            <li><Link className="hover:text-white" href={legalLinks.terms}>Terms</Link></li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
