import Image from "next/image";
import { Check, Play } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { tutors } from "@/data/tutors";
import { siteConfig } from "@/data/site";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-1 text-[11px] text-white/90">
      <span aria-hidden className="inline-flex size-3 items-center justify-center rounded-[3px] bg-brand text-ink">
        <Check className="size-2.5" strokeWidth={4} />
      </span>
      {children}
    </span>
  );
}

function ClassPreview() {
  const content = (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-xl transition-all duration-300 hover:border-white/20">
      <Image
        src="/images/proof-class.png"
        alt="Watch a real class: Building interactive flows with Ms Ananya, Grade 6 (3:12 · Level 4 class)"
        width={1024}
        height={661}
        unoptimized
        quality={100}
        sizes="(min-width:1024px) 700px, 100vw"
        className="h-auto w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
      />
    </div>
  );

  return siteConfig.classVideoUrl ? (
    <a
      href={siteConfig.classVideoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      aria-label="Watch video: Building interactive flows with Ms Ananya, Grade 6"
    >
      {content}
    </a>
  ) : (
    content
  );
}

export function TutorsSection() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,700px)_minmax(0,1fr)] lg:gap-10">
      <ScrollReveal delay={80}>
        <ClassPreview />
      </ScrollReveal>
      <ScrollReveal delay={160}>
        <div>
          <h3 className="font-display text-2xl tracking-[-0.02em]">Meet the tutors</h3>
          <ul className="mt-4 space-y-3">
            {tutors.map((t) => (
              <li key={t.name} className="flex items-center gap-4 rounded-xl border border-white/10 bg-ink-2 p-4">
                <Image src={t.image} alt={`Portrait of ${t.name}`} width={57} height={57} quality={90} className="size-14 shrink-0 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="mt-0.5 text-[13px] text-muted-dark">{t.credentials}</p>
                  <p className="mt-2 flex flex-wrap gap-2"><Chip>Background-checked</Chip><Chip>LvlUp trained</Chip></p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] leading-relaxed text-muted-dark">
            Every tutor teaches a demo class before we hire them and is observed every week.
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
