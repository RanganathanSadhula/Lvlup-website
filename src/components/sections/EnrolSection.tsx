"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, Loader2, Sparkles, UserCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
import { allCourses, tracksData } from "@/data/tracks";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { EnrolSuccessView } from "./EnrolSuccessView";

export function EnrolSection() {
  const { user, activeStudent } = useAuth();

  const [childName, setChildName] = useState("");
  const [grade, setGrade] = useState("Grade 6");
  const [schoolCode, setSchoolCode] = useState("");
  const [selectedCourseTitle, setSelectedCourseTitle] = useState(
    allCourses[0]?.title ?? "Robotics Starter: Build a Rover"
  );
  const [parentName, setParentName] = useState("");
  const [relationship, setRelationship] = useState("Mother");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [payPlan, setPayPlan] = useState<"full" | "installments">("full");
  const [consent, setConsent] = useState(true);
  const [linkedProfileBanner, setLinkedProfileBanner] = useState<string | null>(null);

  const [enrolSubmitting, setEnrolSubmitting] = useState(false);
  const [enrolError, setEnrolError] = useState("");
  const [enrolSuccess, setEnrolSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  // Read URL query parameters on mount to pre-fill student and track selection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const paramStudentName = params.get("studentName");
    const paramGrade = params.get("grade");
    const paramTrack = params.get("track");
    const paramParentName = params.get("parentName");
    const paramEmail = params.get("email");
    const paramPhone = params.get("phone");

    if (paramStudentName) {
      setChildName(paramStudentName);
      setLinkedProfileBanner(paramStudentName);
    }
    if (paramGrade) {
      const gNum = parseInt(paramGrade.replace(/\D/g, ""), 10);
      if (gNum >= 5 && gNum <= 11) {
        setGrade(`Grade ${gNum}`);
      }
    }
    if (paramTrack) {
      const trackMatch = tracksData.find(
        (t) => t.id.toLowerCase() === paramTrack.toLowerCase() || t.slug.toLowerCase() === paramTrack.toLowerCase()
      );
      if (trackMatch && trackMatch.courses.length > 0) {
        const gNum = paramGrade ? parseInt(paramGrade.replace(/\D/g, ""), 10) : 6;
        const matchedCourse =
          trackMatch.courses.find((c) => gNum >= c.minGrade && gNum <= c.maxGrade) ||
          trackMatch.courses[0];
        if (matchedCourse) {
          setSelectedCourseTitle(matchedCourse.title);
        }
      }
    }
    if (paramParentName) setParentName(paramParentName);
    if (paramEmail) setEmail(paramEmail);
    if (paramPhone) setMobile(paramPhone.replace(/\D/g, ""));
  }, []);

  // Sync with authenticated parent & active student
  useEffect(() => {
    if (user) {
      if (user.fullName && !parentName) setParentName(user.fullName);
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !mobile) setMobile(user.phone.replace(/\D/g, ""));
    }
    if (activeStudent && !childName) {
      setChildName(activeStudent.fullName);
      setLinkedProfileBanner(activeStudent.fullName);
      if (activeStudent.currentGrade) {
        setGrade(`Grade ${activeStudent.currentGrade}`);
      }
      if (activeStudent.preferredTrack) {
        const trackMatch = tracksData.find(
          (t) => t.id.toLowerCase() === activeStudent.preferredTrack?.toLowerCase()
        );
        if (trackMatch && trackMatch.courses.length > 0) {
          const gNum = activeStudent.currentGrade || 6;
          const matchedCourse =
            trackMatch.courses.find((c) => gNum >= c.minGrade && gNum <= c.maxGrade) ||
            trackMatch.courses[0];
          if (matchedCourse) {
            setSelectedCourseTitle(matchedCourse.title);
          }
        }
      }
    }
  }, [user, activeStudent]);

  const activeCourse =
    allCourses.find((c) => c.title === selectedCourseTitle) ?? allCourses[0]!;
  const basePrice = activeCourse ? activeCourse.price : 5499;
  const currentAmount =
    payPlan === "full" ? basePrice : Math.round(basePrice / 2) + 250;

  const handleEnrolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrolError("");

    if (!childName.trim()) {
      setEnrolError("Please enter your child's full name.");
      return;
    }
    if (!parentName.trim()) {
      setEnrolError("Please enter parent/guardian name.");
      return;
    }
    const cleanPhone = mobile.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setEnrolError("Please enter a valid 10-digit WhatsApp number.");
      return;
    }
    if (!consent) {
      setEnrolError("Please agree to the Parent agreement and child safety terms.");
      return;
    }

    setEnrolSubmitting(true);

    try {
      const res = await fetch("/api/cashfree/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: childName.trim(),
          parentName: parentName.trim(),
          parentEmail: email.trim() || undefined,
          parentPhone: cleanPhone,
          schoolUid: schoolCode.trim().toUpperCase() || "PUNE-SAMPLE",
          grade: parseInt(grade.replace(/\D/g, "") || "6", 10),
          courseTitle: selectedCourseTitle,
          paymentPlan: payPlan === "full" ? "FULL" : "INSTALLMENTS",
          amountInRupees: currentAmount,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Failed to create order.");
      }

      const result = await res.json();
      setOrderRef(result.orderId || `THK-${Date.now().toString().slice(-6)}`);

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
      } else {
        setEnrolSuccess(true);
      }
    } catch (err) {
      setEnrolError((err as Error).message || "An unexpected error occurred. Please try again.");
    } finally {
      setEnrolSubmitting(false);
    }
  };

  return (
    <section id="enrol" aria-labelledby="enrol-title" className="w-full bg-[#F4F3EE] py-24 text-[#0B0C0F]">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Steps (Cols 1-5) */}
          <div className="col-span-1 lg:col-span-5">
            <div>
              <h2
                id="enrol-title"
                className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F] sm:text-[44px]"
              >
                Enrol your child in
                <br />
                three minutes
              </h2>
              <p className="mt-4 text-[16px] leading-[25px] text-[#5A5F6B]">
                You’ll need your school code. It’s in the school’s circular or WhatsApp message.
              </p>

              <div className="mt-10 space-y-8">
                <div className="flex items-start gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0B0C0F] text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#0B0C0F]">Fill in the form</h3>
                    <p className="mt-0.5 text-xs text-[#5A5F6B]">
                      Your child&apos;s details and yours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0B0C0F] text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#0B0C0F]">Choose how to pay</h3>
                    <p className="mt-0.5 text-xs text-[#5A5F6B]">
                      Fees from ₹3,999. Two parts cost ₹500 more.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0B0C0F] text-xs font-bold text-white">
                    3
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#0B0C0F]">
                      Get confirmation on WhatsApp
                    </h3>
                    <p className="mt-0.5 text-xs text-[#5A5F6B]">
                      With the batch start date and class link
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-sm font-medium text-[#FF6B2C]">
                No school code? Ask your class teacher or{" "}
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-80"
                >
                  WhatsApp us
                </a>
                .
              </div>
            </div>
          </div>

          {/* Right Parent Registration Form (Cols 6-12) */}
          <div className="col-span-1 lg:col-span-7">
            <div className="rounded-3xl border border-[#E3E1D9] bg-white p-6 shadow-xl sm:p-10">
              {enrolSuccess ? (
                <EnrolSuccessView
                  childName={childName}
                  payPlan={payPlan === "full" ? "full" : "parts"}
                  email={email}
                  schoolCode={schoolCode}
                  orderRef={orderRef}
                  onEdit={() => setEnrolSuccess(false)}
                />
              ) : (
                <form onSubmit={handleEnrolSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-[#0B0C0F]">Parent enrolment</h3>
                    <p className="mt-1 text-xs text-[#5A5F6B]">
                      Enter your details to reserve a place in the next in-school batch.
                    </p>
                  </div>

                  {linkedProfileBanner && (
                    <div className="flex items-center gap-2.5 rounded-2xl border border-[#FF6B2C]/25 bg-[#FFF5EF] px-3.5 py-2.5 text-xs text-[#0B0C0F]">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C] text-white">
                        <UserCheck className="size-3.5" />
                      </span>
                      <span>
                        Enrolling profile for <strong className="text-[#FF6B2C]">{linkedProfileBanner}</strong>. Details have been pre-filled.
                      </span>
                    </div>
                  )}

                  {enrolError && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
                      {enrolError}
                    </div>
                  )}

                  {/* Child's Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5F6B]">
                        Child&apos;s full name
                      </label>
                      <input
                        type="text"
                        required
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="e.g. Kabir Sharma"
                        className="mt-1.5 w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-3 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5F6B]">
                          Grade
                        </label>
                        <div className="relative mt-1.5">
                          <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-3 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                          >
                            {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                              <option key={g} value={`Grade ${g}`}>
                                Grade {g}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 size-4 text-[#5A5F6B]" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5A5F6B]">
                          School code (5 letters)
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={schoolCode}
                          onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                          placeholder="e.g. BGS01"
                          className="mt-1.5 w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-3 text-sm uppercase text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A5F6B]">
                        Course
                      </label>
                      <div className="relative mt-1.5">
                        <select
                          value={selectedCourseTitle}
                          onChange={(e) => setSelectedCourseTitle(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-3 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                        >
                          {allCourses.map((c) => (
                            <option key={c.id} value={c.title}>
                              {c.title} (₹{c.price.toLocaleString("en-IN")}) · Grades {c.minGrade}–{c.maxGrade}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 size-4 text-[#5A5F6B]" />
                      </div>
                    </div>
                  </div>

                  {/* Parent Details */}
                  <div className="space-y-4 border-t border-[#EAE8E1] pt-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5F6B]">
                          Parent / guardian name
                        </label>
                        <input
                          type="text"
                          required
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          placeholder="e.g. Priya Sharma"
                          className="mt-1.5 w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-3 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5A5F6B]">
                          Relationship
                        </label>
                        <div className="relative mt-1.5">
                          <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-3 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                          >
                            <option value="Mother">Mother</option>
                            <option value="Father">Father</option>
                            <option value="Guardian">Guardian</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 size-4 text-[#5A5F6B]" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#5A5F6B]">
                          WhatsApp number (10 digits)
                        </label>
                        <div className="relative mt-1.5">
                          <span className="absolute left-3.5 top-3 text-sm text-[#5A5F6B]">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                            placeholder="9876543210"
                            className="w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] py-3 pl-12 pr-4 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5A5F6B]">
                          Email address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="priya@example.com"
                          className="mt-1.5 w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-3 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Switcher */}
                  <div className="border-t border-[#EAE8E1] pt-6">
                    <label className="block text-xs font-semibold text-[#5A5F6B]">
                      Payment option
                    </label>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div
                        onClick={() => setPayPlan("full")}
                        className={cn(
                          "flex flex-col justify-between min-h-[110px] cursor-pointer rounded-2xl border p-5 transition-all duration-200",
                          payPlan === "full"
                            ? "border-[#FF6B2C] bg-[#FF6B2C]/10 ring-1 ring-[#FF6B2C]"
                            : "border-[#E3E1D9] bg-[#FBF9F5] hover:border-[#D1CFC7]"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-bold text-[#0B0C0F]">Pay in full</span>
                          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            Save ₹500
                          </span>
                        </div>
                        <div className="mt-2 text-[22px] font-bold text-[#0B0C0F] leading-none">
                          ₹{basePrice.toLocaleString("en-IN")}
                        </div>
                        <p className="mt-1 text-xs text-[#5A5F6B]">One payment today</p>
                      </div>

                      <div
                        onClick={() => setPayPlan("installments")}
                        className={cn(
                          "flex flex-col justify-between min-h-[110px] cursor-pointer rounded-2xl border p-5 transition-all duration-200",
                          payPlan === "installments"
                            ? "border-[#FF6B2C] bg-[#FF6B2C]/10 ring-1 ring-[#FF6B2C]"
                            : "border-[#E3E1D9] bg-[#FBF9F5] hover:border-[#D1CFC7]"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-bold text-[#0B0C0F]">Two parts</span>
                        </div>
                        <div className="mt-2 text-[22px] font-bold text-[#0B0C0F] leading-none">
                          ₹{(Math.round(basePrice / 2) + 250).toLocaleString("en-IN")} now
                        </div>
                        <p className="mt-1 text-xs text-[#5A5F6B]">Second part by week 4</p>
                      </div>
                    </div>
                  </div>

                  {/* Consent checkbox */}
                  <div className="flex items-start gap-3 border-t border-[#EAE8E1] pt-6">
                    <input
                      type="checkbox"
                      id="consent-check"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 size-4 rounded accent-[#FF6B2C]"
                    />
                    <label htmlFor="consent-check" className="text-xs leading-[18px] text-[#5A5F6B]">
                      I agree to the{" "}
                      <a href="/legal/terms" className="font-semibold text-[#0B0C0F] underline">
                        Parent agreement
                      </a>{" "}
                      and{" "}
                      <a href="/legal/child-safety" className="font-semibold text-[#0B0C0F] underline">
                        child safety terms
                      </a>
                      . I understand kits stay at school unless my course includes taking them home.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={enrolSubmitting}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#FF6B2C] to-[#E05316] py-4 text-center text-sm font-semibold text-white shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {enrolSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Setting up payment...
                      </span>
                    ) : (
                      `Pay ₹${currentAmount.toLocaleString("en-IN")} & confirm place →`
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
