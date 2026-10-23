import Image from "next/image";
import { Check, Play } from "lucide-react";
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
  const play = (
    <span aria-hidden className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-ink shadow-glow">
      <Play className="size-6 fill-current" />
    </span>
  );
  const caption = (
    <span className="text-left">
      <span className="block font-display text-xl tracking-[-0.02em] sm:text-2xl">Watch a real class</span>
      <span className="mt-1 block text-xs text-white/70 sm:text-sm">Building interactive flows with Ms Ananya, Grade 6</span>
    </span>
  );
  const inner = (
    <>
      {play}
      {caption}
    </>
  );
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <Image
        src="/images/proof-class.jpg"
        alt="A tutor and two students smiling at a laptop in a school computer lab"
        width={696}
        height={304}
        quality={90}
        sizes="(min-width:1024px) 700px, 100vw"
        className="h-[300px] w-full object-cover sm:h-[342px]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      {siteConfig.classVideoUrl ? (
        <a
          href={siteConfig.classVideoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-x-5 bottom-5 flex items-center gap-4 text-white sm:inset-x-6 sm:bottom-6"
        >
          {inner}
        </a>
      ) : (
        <div className="absolute inset-x-5 bottom-5 flex items-center gap-4 text-white sm:inset-x-6 sm:bottom-6">{inner}</div>
      )}
    </div>
  );
}

export function TutorsSection() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,700px)_minmax(0,1fr)] lg:gap-10">
      <ClassPreview />
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
    </div>
  );
}
