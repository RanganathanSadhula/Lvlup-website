import Image from "next/image";
import { pilotMetrics, testimonials } from "@/data/tutors";

export function ProofSection() {
  return (
    <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[1fr_1fr_0.82fr]">
      {testimonials.map((t) => (
        <figure key={t.name} className="flex min-h-[300px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-ink-3 to-ink-2 p-6 sm:p-7 lg:min-h-[317px]">
          <blockquote className="text-xl leading-snug sm:text-[22px]">“{t.quote}”</blockquote>
          <figcaption className="mt-8 flex items-center gap-3">
            <Image src={t.image} alt="" width={47} height={47} quality={90} className="size-[47px] shrink-0 rounded-full object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold">{t.name}</span>
              <span className="block text-xs leading-snug text-muted-dark">{t.role}</span>
            </span>
            <span className="shrink-0 rounded-full bg-white/[0.07] px-2.5 py-1 text-[11px] text-muted-dark">Sample</span>
          </figcaption>
        </figure>
      ))}
      <aside aria-label="Pilot batch results" className="rounded-2xl bg-brand-gradient p-6 text-ink sm:p-7">
        <h3 className="text-sm font-semibold">Pilot batch, Term 1</h3>
        <dl className="mt-5 space-y-5">
          {pilotMetrics.map((m) => (
            <div key={m.value}>
              <dd className="font-display text-[40px] leading-none tracking-[-0.03em]">{m.value}</dd>
              <dt className="mt-1.5 text-sm">{m.label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[11px] leading-snug text-ink/80">Sample figures. Replace with your real, dated counts.</p>
      </aside>
    </div>
  );
}
