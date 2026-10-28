"use client";

import { useState } from "react";
import { ArrowRight, Check, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { schoolBenefits } from "@/data/content";

export function SchoolsSection() {
  const [formData, setFormData] = useState({
    schoolName: "",
    name: "",
    role: "Principal",
    city: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Attempt sending to api
      await fetch("/api/school-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name || "School representative",
          schoolCity: `${formData.schoolName || "[School name]"}, ${formData.city || "India"}`,
          role: formData.role,
          phone: formData.phone || "9999999999",
        }),
      }).catch(() => null);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  return (
    <Section
      id="schools"
      tone="darker"
      topo
      grain
      grainOpacity={0.52}
      aria-labelledby="schools-title"
      className="py-20 lg:py-28"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_480px] lg:gap-16">
        {/* ── LEFT COLUMN ── */}
        <div>
          <h2
            id="schools-title"
            className="font-display text-[38px] font-normal leading-[1.06] tracking-[-0.03em] text-white sm:text-[46px] lg:text-[52px]"
          >
            Bring LvlUp to your school.
          </h2>

          <p className="mt-5 max-w-[540px] text-[16px] sm:text-[17px] leading-relaxed text-white/70">
            We bring trained tutors, every lesson, enrolment, fees and parent updates. Your school hosts one class a
            week in its computer lab.
          </p>

          {/* Checklist items */}
          <ul className="mt-8 space-y-4">
            {schoolBenefits.map((b) => (
              <li key={b} className="flex items-start gap-3.5 text-[15px] sm:text-base text-white/90">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-[#ff5520] text-white shadow-sm">
                  <Check className="size-3.5 stroke-[3]" />
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#school-callback-card"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("school-callback-card")?.scrollIntoView({ behavior: "smooth" });
                const input = document.getElementById("schoolName") as HTMLInputElement | null;
                input?.focus();
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-center text-[15px] font-bold text-ink shadow-glow transition-all duration-200 transform-gpu hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,107,44,0.4)] active:scale-95 cursor-pointer"
            >
              <span>Get a callback</span>
              <ArrowRight className="size-4" />
            </a>

            <a
              href="/downloads/LvlUp-Eight-Week-Curriculum.pdf"
              download="LvlUp Eight-Week Curriculum.pdf"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/40 px-6 py-3.5 text-center text-[15px] font-medium text-white backdrop-blur-sm transition-all duration-200 transform-gpu hover:border-white/30 hover:bg-white/10 active:scale-95 cursor-pointer"
            >
              <span>Download the school pack (PDF)</span>
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Callback Card ── */}
        <ScrollReveal delay={150}>
          <div
            id="school-callback-card"
            className="relative rounded-[28px] border border-black/[0.06] bg-white p-7 sm:p-9 text-ink shadow-2xl"
          >
          {submitted ? (
            <div className="py-2">
              {/* Green checkmark circle */}
              <div className="flex size-12 items-center justify-center rounded-full bg-[#109e58] text-white shadow-sm">
                <Check className="size-6 stroke-[3]" />
              </div>

              {/* Title */}
              <h3 className="mt-5 font-display text-[32px] sm:text-[36px] font-normal leading-[1.1] tracking-[-0.03em] text-ink">
                Request received
              </h3>

              {/* Description */}
              <p className="mt-4 text-[15px] sm:text-base leading-relaxed text-[#4b5563]">
                Thank you, {formData.name.trim().split(" ")[0] || "Priya"}. Our partnerships team will call you on{" "}
                <span className="font-mono text-ink">
                  {formData.phone.length >= 4
                    ? `${formData.phone.slice(0, 2)}XXXXXX${formData.phone.slice(-2)}`
                    : "98XXXXXX10"}
                </span>{" "}
                within one working day to plan a visit or a free demo class.
              </p>

              {/* While you wait box */}
              <div className="mt-6 rounded-2xl bg-[#f5f4ef] p-5 sm:p-6">
                <h4 className="text-sm font-semibold text-ink">While you wait</h4>
                <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-ink/75">
                  <a
                    href="/downloads/LvlUp-Eight-Week-Curriculum.pdf"
                    download="LvlUp Eight-Week Curriculum.pdf"
                    className="underline underline-offset-2 hover:text-ink font-medium"
                  >
                    Download the school pack (PDF)
                  </a>
                  : the deck, brochure and full curriculum.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 text-xs font-semibold text-muted hover:text-ink underline underline-offset-2"
              >
                ← Edit details or submit another request
              </button>
            </div>
          ) : (
            <>
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fcedea] px-3.5 py-1 text-xs font-normal text-[#8a3822]">
                <span className="size-2 rounded-full bg-[#109e58]" />
                <span>Partnerships team · calls back in 1 working day</span>
              </div>

              <h3 className="mt-4 font-display text-[28px] sm:text-[32px] font-normal tracking-[-0.02em] text-ink">
                Get a callback
              </h3>

              <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-muted">
                For schools. Leave your details and our partnerships team will call you within one working day.
              </p>
            <form onSubmit={handleSubmit} className="mt-5">
              {/* School Name */}
              <div>
                <label htmlFor="schoolName" className="block text-xs font-medium text-ink/75">
                  School name
                </label>
                <input
                  id="schoolName"
                  type="text"
                  required
                  placeholder="e.g. [School name]"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              {/* Your name and Your role */}
              <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="personName" className="block text-xs font-medium text-ink/75">
                    Your name
                  </label>
                  <input
                    id="personName"
                    type="text"
                    required
                    placeholder="Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div>
                  <label htmlFor="personRole" className="block text-xs font-medium text-ink/75">
                    Your role
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="personRole"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 pr-10 text-sm text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="Principal">Principal</option>
                      <option value="Vice Principal">Vice Principal</option>
                      <option value="Director / Trustee">Director / Trustee</option>
                      <option value="Head of Department">Head of Department</option>
                      <option value="Computer Teacher">Computer Teacher</option>
                      <option value="Coordinator">Coordinator</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
                  </div>
                </div>
              </div>

              {/* City and Phone */}
              <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="cityName" className="block text-xs font-medium text-ink/75">
                    City
                  </label>
                  <input
                    id="cityName"
                    type="text"
                    required
                    placeholder="Pune"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-xs font-medium text-ink/75">
                    Phone
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm font-mono text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink text-[15px] font-semibold text-white transition-all duration-200 transform-gpu hover:-translate-y-0.5 hover:bg-ink-3 active:scale-[0.96] active:translate-y-0 disabled:opacity-75 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Sending details…</span>
                  </>
                ) : (
                  <>
                    <span>Get a callback</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              {/* Footer note */}
              <p className="mt-4 text-center text-xs leading-relaxed text-muted">
                Are you a parent?{" "}
                <a href="#enrol" className="underline underline-offset-2 hover:text-ink">
                  Enrol your child
                </a>{" "}
                in the form above. We never share your details.
              </p>
            </form>
          </>
          )}
        </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
