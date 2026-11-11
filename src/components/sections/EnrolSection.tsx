<<<<<<< HEAD
"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown, Loader2, UsersRound, AlertCircle } from "lucide-react";
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

  // Form input states
  const [childName, setChildName] = useState("");
  const [grade, setGrade] = useState("Grade 6");
  const [section, setSection] = useState("A");
  const [schoolCode, setSchoolCode] = useState("");
  const [parentName, setParentName] = useState("");
  const [relationship, setRelationship] = useState("Mother");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [orderRef, setOrderRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Field validation checks
  const isSchoolCodeValid = schoolCode.trim().length === 5;
  const isMobileValid = /^\d{10}$/.test(mobile.trim());
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isChildNameValid = childName.trim().length >= 2;
  const isParentNameValid = parentName.trim().length >= 2;

  // Complete form requirement check
  const isFormValid =
    isChildNameValid &&
    isSchoolCodeValid &&
    isParentNameValid &&
    isMobileValid &&
    isEmailValid &&
    agreed;

  async function handleEnrolSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);

    const amountInRupees = payPlan === "parts" ? 2500 : 4499;

    try {
      const res = await fetch("/api/cashfree/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: childName.trim(),
          parentName: parentName.trim(),
          parentEmail: email.trim(),
          parentPhone: mobile.trim(),
          schoolUid: schoolCode.trim().toUpperCase(),
          grade: parseInt(grade.replace(/\D/g, "") || "6", 10),
          paymentPlan: payPlan === "full" ? "FULL" : "INSTALLMENTS",
          amountInRupees,

        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Failed to create enrolment order.");
      }

      const result = await res.json();
      setOrderRef(result.orderId || `THK-${Date.now().toString().slice(-6)}`);
      // Seamless Cashfree Live Gateway Checkout
      if (result.paymentSessionId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const loadCashfreeSdk = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof (window as any).Cashfree !== "undefined") {
              const mode = (result.environment || "PRODUCTION").toLowerCase();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              resolve((window as any).Cashfree({ mode }));
              return;
            }
            const script = document.createElement("script");
            script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
            script.async = true;
            script.onload = () => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (typeof (window as any).Cashfree !== "undefined") {
                const mode = (result.environment || "PRODUCTION").toLowerCase();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                resolve((window as any).Cashfree({ mode }));
              } else {
                reject(new Error("Cashfree SDK failed to initialize."));
              }
            };
            script.onerror = () => reject(new Error("Failed to load Cashfree payment SDK."));
            document.body.appendChild(script);
          });
        };

        const cashfree = await loadCashfreeSdk();
        await cashfree.checkout({
          paymentSessionId: result.paymentSessionId,
          redirectTarget: "_self",
        });
        return;
      }

      setIsSubmitted(true);

      setTimeout(() => {
        const el = document.getElementById("enrol");
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 70;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
      }, 50);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <Section id="enrol" tone="light" topo aria-labelledby="enrol-success-title" className="py-16 lg:py-24">
        <EnrolSuccessView
          childName={childName}
          payPlan={payPlan}
          email={email.trim()}
          schoolCode={schoolCode.trim().toUpperCase()}
          orderRef={orderRef}
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

              {/* Mother Image */}
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
                        Child's full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="childName"
                        type="text"
                        required
                        placeholder="As on school records"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    <div>
                      <label htmlFor="grade" className="block text-xs font-medium text-ink/70">
                        Grade <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1.5">
                        <select
                          id="grade"
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
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
                        placeholder="e.g. A, B"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-black/5 bg-[#f4f5f7] px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="schoolCode" className="block text-xs font-medium text-ink/70">
                          School code (5 digits) <span className="text-red-500">*</span>
                        </label>
                        <span
                          className={cn(
                            "text-[11px] font-mono",
                            schoolCode.length === 5 ? "text-green-600 font-semibold" : "text-muted"
                          )}
                        >
                          {schoolCode.length}/5
                        </span>
                      </div>
                      <input
                        id="schoolCode"
                        type="text"
                        maxLength={5}
                        placeholder="5 digits, e.g. 10245"
                        value={schoolCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 5);
                          setSchoolCode(val);
                        }}
                        className={cn(
                          "mt-1.5 w-full rounded-xl border px-4 py-3 text-sm font-mono uppercase text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 transition",
                          schoolCode.length > 0 && !isSchoolCodeValid
                            ? "border-red-500 bg-red-50/20 text-red-950 focus:ring-red-500"
                            : "border-black/5 bg-[#f4f5f7] focus:ring-brand"
                        )}
                      />
                      {schoolCode.length > 0 && !isSchoolCodeValid && (
                        <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-red-600 animate-fadeIn">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>School code must be exactly 5 digits.</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. About You */}
                <div className="mt-7">
                  <h3 className="font-display text-[15px] font-bold text-ink">About you</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="parentName" className="block text-xs font-medium text-ink/70">
                        Parent or guardian name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="parentName"
                        type="text"
                        required
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
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
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
                      <div className="flex items-center justify-between">
                        <label htmlFor="mobile" className="block text-xs font-medium text-ink/70">
                          Mobile (WhatsApp) <span className="text-red-500">*</span>
                        </label>
                        <span
                          className={cn(
                            "text-[11px] font-mono",
                            mobile.length === 10 ? "text-green-600 font-semibold" : "text-muted"
                          )}
                        >
                          {mobile.length}/10
                        </span>
                      </div>
                      <input
                        id="mobile"
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit number"
                        value={mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setMobile(val);
                        }}
                        className={cn(
                          "mt-1.5 w-full rounded-xl border px-4 py-3 text-sm font-mono text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 transition",
                          mobile.length > 0 && !isMobileValid
                            ? "border-red-500 bg-red-50/20 text-red-950 focus:ring-red-500"
                            : "border-black/5 bg-[#f4f5f7] focus:ring-brand"
                        )}
                      />
                      {mobile.length > 0 && !isMobileValid && (
                        <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-red-600 animate-fadeIn">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>Mobile number must be exactly 10 digits.</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-ink/70">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(
                          "mt-1.5 w-full rounded-xl border px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:ring-2 transition",
                          email.length > 0 && !isEmailValid
                            ? "border-red-500 bg-red-50/20 text-red-950 focus:ring-red-500"
                            : "border-black/5 bg-[#f4f5f7] focus:ring-brand"
                        )}
                      />
                      {email.length > 0 && !isEmailValid && (
                        <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-red-600 animate-fadeIn">
                          <AlertCircle className="size-3.5 shrink-0" />
                          <span>Please enter a valid email address.</span>
                        </p>
                      )}
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
                    className="mt-1 size-4 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-xs leading-relaxed text-ink/75 cursor-pointer">
                    I am this child's parent or guardian. I agree to my child taking part in ThinkOva and to ThinkOva
                    keeping these details to run the course. Read the{" "}
                    <a href="/legal/consent" className="underline underline-offset-2 hover:text-ink">
                      consent form
                    </a>{" "}
                    and{" "}
                    <a href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">
                      privacy notice
                    </a>
                    . <span className="text-red-500">*</span>
                  </label>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* Submit button (Dull disabled state when incomplete) */}
                <button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className={cn(
                    "mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl py-4 text-center text-[15px] font-bold transition shadow-sm",
                    isFormValid && !submitting
                      ? "bg-brand-gradient text-ink shadow-glow hover:opacity-95 cursor-pointer active:scale-[0.99]"
                      : "bg-[#e2e2ea] text-[#8e8e99] cursor-not-allowed shadow-none opacity-60 border border-black/5"
                  )}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Opening payment gateway…</span>
                    </>
                  ) : (
                    <>
                      <span>{isFormValid ? "Continue to payment" : "Fill required fields to enrol"}</span>
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
=======
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
>>>>>>> 0c48af08a90a288c46f1d0057cb12d934026860b
