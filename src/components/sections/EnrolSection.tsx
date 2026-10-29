"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, ChevronDown, Loader2, UsersRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { EnrolSuccessView } from "./EnrolSuccessView";
import { siteConfig } from "@/data/site";

export function EnrolSection() {
  const [payPlan, setPayPlan] = useState<"full" | "parts">("full");
  const [agreed, setAgreed] = useState(false);
  const [isImageColored, setIsImageColored] = useState(false);
  const [childName, setChildName] = useState("");
  const [parentName, setParentName] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleEnrolSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        const el = document.getElementById("enrol");
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 70;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      }, 50);
    }, 600);
  }

  if (isSubmitted) {
    return (
      <Section id="enrol" tone="light" topo aria-labelledby="enrol-success-title" className="py-16 lg:py-24">
        <EnrolSuccessView
          childName={childName}
          payPlan={payPlan}
          email={parentName ? `${parentName.toLowerCase().replace(/\s+/g, ".")}@example.com` : "you@example.com"}
          onEdit={() => setIsSubmitted(false)}
        />
      </Section>
    );
  }

  return (
    <Section id="enrol" tone="light" topo aria-labelledby="enrol-title" className="py-20 lg:py-28">
      <Container>
          <div className="grid gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-16 items-start">
            {/* ── LEFT COLUMN: Enrol title, steps, support callout, and mother image ── */}
            <ScrollReveal>
              <div>
                <h2
                  id="enrol-title"
                  className="font-display text-[38px] font-normal leading-[1.05] tracking-[-0.03em] text-ink sm:text-[46px]"
                >
                  Enrol your child
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">
                  It takes about three minutes. Keep your school code handy. Your school shares it with parents.
                </p>

                {/* Steps list */}
                <ol className="mt-8 space-y-5">
                  <li className="flex items-start gap-3.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                      1
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Fill in the form</h3>
                      <p className="mt-0.5 text-xs text-muted">Your child's details and yours</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-xs font-bold text-muted">
                      2
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Choose how to pay</h3>
                      <p className="mt-0.5 text-xs text-muted">In full for ₹4,499, or two parts for ₹4,999</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-xs font-bold text-muted">
                      3
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">Pay and get confirmation</h3>
                      <p className="mt-0.5 text-xs text-muted">On WhatsApp, with the batch start date</p>
                    </div>
                  </li>
                </ol>

                {/* No school code callout */}
                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm">
                  <UsersRound aria-hidden className="size-5 shrink-0 text-ink/75" />
                  <p className="text-xs font-medium leading-snug text-ink/80">
                    No school code? Ask your class teacher or <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#ff5520]">WhatsApp us</a>.
                  </p>
                </div>

                {/* Mother Image: Smooth transition from black to colour on hover, touch & click */}
                <div
                  className="group/aunty-card mt-6 overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-black/20"
                  onMouseEnter={() => setIsImageColored(true)}
                  onMouseLeave={() => setIsImageColored(false)}
                  onClick={() => setIsImageColored((prev) => !prev)}
                  onTouchStart={() => setIsImageColored(true)}
                  onTouchEnd={() => setIsImageColored(false)}
                >
                  <div className="overflow-hidden">
                    <Image
                      src="/images/enrol-parent-color.png"
                      alt="A smiling parent sitting on sofa with book"
                      width={524}
                      height={391}
                      unoptimized
                      quality={100}
                      className={cn(
                        "h-auto w-full object-cover transition-all duration-700 ease-out transform-gpu",
                        "group-hover/aunty-card:grayscale-0 group-hover/aunty-card:scale-105 group-hover/aunty-card:contrast-100 group-hover/aunty-card:brightness-100",
                        isImageColored
                          ? "grayscale-0 scale-105 contrast-100 brightness-100"
                          : "grayscale scale-100 contrast-[1.08] brightness-95"
                      )}
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* ── RIGHT COLUMN: Enrolment Form ── */}
            <ScrollReveal delay={120}>
              <div className="rounded-3xl border border-black/[0.08] bg-white p-6 shadow-xl sm:p-8 lg:p-9">
              <form onSubmit={handleEnrolSubmit}>
                {/* 1. Student Details */}
                <div>
                  <h3 className="font-display text-[15px] font-bold text-ink">Student Details</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="childName" className="block text-xs font-medium text-ink/70">
                        Child's full name
                      </label>
                      <input
                        id="childName"
                        type="text"
                        placeholder="As on school records"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    <div>
                      <label htmlFor="grade" className="block text-xs font-medium text-ink/70">
                        Grade
                      </label>
                      <div className="relative mt-1.5">
                        <select
                          id="grade"
                          defaultValue="Grade 6"
                          className="w-full appearance-none rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand pr-10"
                        >
                          <option value="Grade 5">Grade 5</option>
                          <option value="Grade 6">Grade 6</option>
                          <option value="Grade 7">Grade 7</option>
                          <option value="Grade 8">Grade 8</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="section" className="block text-xs font-medium text-ink/70">
                        Section
                      </label>
                      <input
                        id="section"
                        type="text"
                        placeholder="B"
                        className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    <div>
                      <label htmlFor="schoolCode" className="block text-xs font-medium text-ink/70">
                        School code
                      </label>
                      <input
                        id="schoolCode"
                        type="text"
                        placeholder="e.g. PUNE-0427"
                        className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm font-mono uppercase text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. About You */}
                <div className="mt-7">
                  <h3 className="font-display text-[15px] font-bold text-ink">About you</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="parentName" className="block text-xs font-medium text-ink/70">
                        Parent or guardian name
                      </label>
                      <input
                        id="parentName"
                        type="text"
                        placeholder="Your full name"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    <div>
                      <label htmlFor="relationship" className="block text-xs font-medium text-ink/70">
                        Relationship
                      </label>
                      <div className="relative mt-1.5">
                        <select
                          id="relationship"
                          defaultValue="Mother"
                          className="w-full appearance-none rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand pr-10"
                        >
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Guardian">Guardian</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mobile" className="block text-xs font-medium text-ink/70">
                        Mobile (WhatsApp)
                      </label>
                      <input
                        id="mobile"
                        type="tel"
                        placeholder="10-digit number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm font-mono text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-ink/70">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. How would you like to pay? */}
                <div className="mt-7">
                  <h3 className="font-display text-[15px] font-bold text-ink">How would you like to pay?</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {/* Pay in full */}
                    <button
                      type="button"
                      onClick={() => setPayPlan("full")}
                      className={cn(
                        "flex flex-col justify-between rounded-2xl p-4 text-left transition-all border",
                        payPlan === "full"
                          ? "border-brand bg-white shadow-sm ring-1 ring-brand/30"
                          : "border-black/10 bg-white hover:border-black/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                              payPlan === "full" ? "border-brand" : "border-black/30"
                            )}
                          >
                            {payPlan === "full" && <span className="size-2 rounded-full bg-brand" />}
                          </span>
                          <span className="text-sm font-semibold text-ink">Pay in full</span>
                        </div>
                        <span className="rounded-md bg-[#109e58] px-2 py-0.5 text-[10px] font-bold text-white">
                          Save ₹500
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="block text-[22px] font-bold leading-none text-ink">₹4,499</span>
                        <span className="mt-1 block text-xs text-muted">One payment today</span>
                      </div>
                    </button>

                    {/* Pay in two parts */}
                    <button
                      type="button"
                      onClick={() => setPayPlan("parts")}
                      className={cn(
                        "flex flex-col justify-between rounded-2xl p-4 text-left transition-all border",
                        payPlan === "parts"
                          ? "border-brand bg-white shadow-sm ring-1 ring-brand/30"
                          : "border-black/10 bg-white hover:border-black/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                              payPlan === "parts" ? "border-brand" : "border-black/30"
                            )}
                          >
                            {payPlan === "parts" && <span className="size-2 rounded-full bg-brand" />}
                          </span>
                          <span className="text-sm font-semibold text-ink">Pay in two parts</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="block text-[22px] font-bold leading-none text-ink">₹4,999</span>
                        <span className="mt-1 block text-xs text-muted">₹2,500 today, ₹2,499 by level 5</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Consent checkbox */}
                <div className="mt-6 flex items-start gap-3">
                  <input
                    id="consent"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 size-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <label htmlFor="consent" className="text-xs leading-relaxed text-ink/75">
                    I am this child's parent or guardian. I agree to my child taking part in LvlUp and to LvlUp
                    keeping these details to run the course. Read the{" "}
                    <a href="/legal/consent" className="underline underline-offset-2 hover:text-ink">
                      consent form
                    </a>{" "}
                    and{" "}
                    <a href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">
                      privacy notice
                    </a>
                    .
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-4 text-center text-[15px] font-bold text-ink shadow-glow transition hover:opacity-95 disabled:opacity-75"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Processing…</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to payment</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-muted">
                  You will not be charged until the next step. Payments by UPI, card or net banking.
                </p>
              </form>
            </div>
          </ScrollReveal>
        </div>
        </Container>
    </Section>
  );
}
