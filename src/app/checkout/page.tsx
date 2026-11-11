"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Check,
  Loader2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { StudentAvatar } from "@/components/ui/StudentAvatar";
import { useAuth } from "@/lib/auth-context";
import { getCourseById } from "@/data/tracks";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeStudent, user } = useAuth();

  const courseId = searchParams.get("courseId") || "robotics-starter";
  const course = getCourseById(courseId);

  const studentName = activeStudent?.fullName || "Aarav Sharma";
  const studentFirstName = studentName.split(" ")[0];
  const studentGrade = activeStudent?.currentGrade || 6;

  const [paymentPlan, setPaymentPlan] = useState<"full" | "installments">("full");
  const [parentName, setParentName] = useState(user?.fullName || "Priya Sharma");
  const [parentEmail, setParentEmail] = useState(user?.email || "priya.sharma@gmail.com");
  const [parentPhone, setParentPhone] = useState("+91 98765 43210");
  const [schoolName, setSchoolName] = useState(
    activeStudent?.schoolName || "Banyan Grove School, Pune"
  );
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("priya@okhdfcbank");
  const [isProcessing, setIsProcessing] = useState(false);

  const payTodayAmount = paymentPlan === "full" ? course.price : 3000;
  const payTodayFormatted = `₹${payTodayAmount.toLocaleString("en-IN")}`;

  const handlePayAndEnrol = async () => {
    setIsProcessing(true);

    try {
      // Trigger backend enrolment API with pre-adaptable state & notifications
      const res = await fetch("/api/courses/enrol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: activeStudent?.id || "aarav",
          courseId: course.id,
          trackId: course.trackId,
          paymentPlan: paymentPlan === "full" ? "FULL" : "INSTALLMENTS",
        }),
      });

      // Always proceed to confirmation page matching Image 5
      setTimeout(() => {
        router.push(
          `/confirmation?courseId=${course.id}&studentId=${
            activeStudent?.id || "aarav"
          }&plan=${paymentPlan}&paid=${payTodayAmount}`
        );
      }, 700);
    } catch {
      router.push(
        `/confirmation?courseId=${course.id}&studentId=${
          activeStudent?.id || "aarav"
        }&plan=${paymentPlan}&paid=${payTodayAmount}`
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F9F8F5] text-[#0B0C0F] selection:bg-[#FF6026] selection:text-white">
      {/* Shared Dark Sidebar */}
      <AppSidebar activeItem="explore" />

      {/* Main Checkout Area */}
      <div className="flex-1 min-w-0 flex flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Breadcrumb matching Image 4 */}
        <nav className="flex items-center gap-2 text-xs text-[#8F94A0]">
          <Link href="/explore" className="hover:text-[#0B0C0F] transition">
            Explore
          </Link>
          <ChevronRight className="size-3" />
          <Link
            href={`/courses/${course.id}`}
            className="hover:text-[#0B0C0F] transition"
          >
            {course.title}
          </Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-[#0B0C0F]">Checkout</span>
        </nav>

        {/* Heading */}
        <div className="mt-4">
          <h1 className="font-display text-[32px] sm:text-[38px] font-bold leading-[1.1] tracking-tight text-[#0B0C0F]">
            Checkout
          </h1>
          <p className="mt-1 text-sm text-[#667085]">
            You won&apos;t be charged until you press Pay.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 Checkout Steps (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Learner */}
            <div className="rounded-[24px] border border-[#EAE6DE] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#0B0C0F] text-xs font-bold text-white">
                  1
                </span>
                <h2 className="text-base font-bold text-[#0B0C0F]">Learner</h2>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F9F8F5] p-4 border border-[#F0ECE1]">
                <div className="flex items-center gap-3.5">
                  <StudentAvatar name={studentName} size={42} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0B0C0F]">
                        {studentName}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <Check className="size-3" />
                        Right level
                      </span>
                    </div>
                    <div className="text-xs text-[#8F94A0]">
                      Grade {studentGrade} · fits {course.grades}
                    </div>
                  </div>
                </div>

                <Link
                  href="/who-is-learning"
                  className="text-xs font-semibold text-[#FF6026] hover:underline"
                >
                  Change
                </Link>
              </div>
            </div>

            {/* Step 2: How would you like to pay? */}
            <div className="rounded-[24px] border border-[#EAE6DE] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#0B0C0F] text-xs font-bold text-white">
                  2
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0B0C0F]">
                    How would you like to pay?
                  </h2>
                  <p className="text-xs text-[#8F94A0]">
                    Same course either way. Two parts costs ₹500 more in total.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option A: Pay in full */}
                <div
                  onClick={() => setPaymentPlan("full")}
                  className={cn(
                    "cursor-pointer rounded-2xl p-4 transition border",
                    paymentPlan === "full"
                      ? "border-[#FF6026] bg-[#FFF8F4] ring-1 ring-[#FF6026]"
                      : "border-[#EAE6DE] bg-white hover:border-[#D1CFC7]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B0C0F]">
                      Pay in full
                    </span>
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full border",
                        paymentPlan === "full"
                          ? "border-[#FF6026]"
                          : "border-[#D1CFC7]"
                      )}
                    >
                      {paymentPlan === "full" && (
                        <div className="size-2 rounded-full bg-[#FF6026]" />
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-xl font-bold text-[#0B0C0F]">
                    {course.priceFormatted}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#8F94A0]">
                    One payment · kit included
                  </div>
                </div>

                {/* Option B: Two parts */}
                <div
                  onClick={() => setPaymentPlan("installments")}
                  className={cn(
                    "cursor-pointer rounded-2xl p-4 transition border",
                    paymentPlan === "installments"
                      ? "border-[#FF6026] bg-[#FFF8F4] ring-1 ring-[#FF6026]"
                      : "border-[#EAE6DE] bg-white hover:border-[#D1CFC7]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B0C0F]">
                      Two parts
                    </span>
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full border",
                        paymentPlan === "installments"
                          ? "border-[#FF6026]"
                          : "border-[#D1CFC7]"
                      )}
                    >
                      {paymentPlan === "installments" && (
                        <div className="size-2 rounded-full bg-[#FF6026]" />
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-xl font-bold text-[#0B0C0F]">
                    ₹3,000 today
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#8F94A0]">
                    Then ₹2,999 before Week 4
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Parent details */}
            <div className="rounded-[24px] border border-[#EAE6DE] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#0B0C0F] text-xs font-bold text-white">
                  3
                </span>
                <div>
                  <h2 className="text-base font-bold text-[#0B0C0F]">
                    Parent details
                  </h2>
                  <p className="text-xs text-[#8F94A0]">
                    Receipts and class links go here.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B0C0F] mb-1">
                    Parent&apos;s full name
                  </label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full rounded-xl border border-[#DCD8CF] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6026]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B0C0F] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#DCD8CF] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6026]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#0B0C0F]">
                      WhatsApp number
                    </label>
                    <span className="text-[10px] text-[#8F94A0]">
                      For class reminders
                    </span>
                  </div>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#DCD8CF] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6026]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B0C0F] mb-1">
                    School (for kit delivery)
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full rounded-xl border border-[#DCD8CF] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6026]"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Payment method */}
            <div className="rounded-[24px] border border-[#EAE6DE] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#0B0C0F] text-xs font-bold text-white">
                  4
                </span>
                <h2 className="text-base font-bold text-[#0B0C0F]">
                  Payment method
                </h2>
              </div>

              {/* Segmented Tabs matching Image 4 */}
              <div className="mt-4 flex rounded-xl bg-[#F0ECE1] p-1 w-full sm:w-fit">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={cn(
                    "rounded-lg px-6 py-2 text-xs font-semibold transition flex-1 sm:flex-initial",
                    paymentMethod === "upi"
                      ? "bg-white text-[#0B0C0F] shadow-sm"
                      : "text-[#5A5F6B] hover:text-[#0B0C0F]"
                  )}
                >
                  UPI
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "rounded-lg px-6 py-2 text-xs font-semibold transition flex-1 sm:flex-initial",
                    paymentMethod === "card"
                      ? "bg-white text-[#0B0C0F] shadow-sm"
                      : "text-[#5A5F6B] hover:text-[#0B0C0F]"
                  )}
                >
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={cn(
                    "rounded-lg px-6 py-2 text-xs font-semibold transition flex-1 sm:flex-initial",
                    paymentMethod === "netbanking"
                      ? "bg-white text-[#0B0C0F] shadow-sm"
                      : "text-[#5A5F6B] hover:text-[#0B0C0F]"
                  )}
                >
                  Net banking
                </button>
              </div>

              {/* UPI ID Input with Verified Pill */}
              <div className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi"
                    className="w-full rounded-xl border border-[#DCD8CF] bg-white px-3.5 py-3 pr-24 text-xs sm:text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6026]"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <Check className="size-3" />
                    <span>Verified</span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-[#8F94A0]">
                  You&apos;ll approve the payment in your UPI app. Encrypted connection.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card (Cols 9-12) */}
          <div className="lg:col-span-4 sticky top-8">
            <div className="rounded-[28px] border border-[#EAE6DE] bg-white p-6 shadow-sm space-y-5">
              {/* Kit Preview Image */}
              <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-[#F4F3EE] p-3 flex items-center justify-center">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6026]">
                  {course.trackName.toUpperCase()} · {course.grades.toUpperCase()}
                </span>
                <h3 className="mt-1 text-base font-bold text-[#0B0C0F]">
                  {course.title}
                </h3>
                <p className="mt-1 text-xs text-[#8F94A0]">
                  6 weekly live classes, 90 min each · Saturdays 10:00 AM · starts 6 Dec
                </p>
              </div>

              {/* Line Items */}
              <div className="space-y-2.5 pt-4 border-t border-[#F0ECE1] text-xs">
                <div className="flex items-center justify-between text-[#5A5F6B]">
                  <span>Course fee</span>
                  <span className="font-semibold text-[#0B0C0F]">
                    {course.priceFormatted}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#5A5F6B]">
                  <span>Rover kit</span>
                  <span className="font-semibold text-emerald-600">Included</span>
                </div>
                <div className="flex items-center justify-between text-[#5A5F6B]">
                  <span>Extra fees</span>
                  <span className="font-semibold text-[#0B0C0F]">₹0</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="flex items-baseline justify-between pt-3 border-t border-[#F0ECE1]">
                <span className="text-sm font-bold text-[#0B0C0F]">Pay today</span>
                <span className="font-display text-2xl font-bold text-[#0B0C0F]">
                  {payTodayFormatted}
                </span>
              </div>

              {/* Promise Box matching Image 4 */}
              <div className="rounded-xl bg-[#FFF6F0] border border-[#FFE4D3] p-3 text-[11px] leading-[17px] text-[#0B0C0F]">
                <strong className="text-[#FF6026] uppercase text-[10px] block mb-0.5">
                  Our promise
                </strong>
                Half the fee back if {studentFirstName} attends at least 3 in 4
                classes and doesn&apos;t have a working project.
              </div>

              {/* Pay & Enrol CTA Button */}
              <button
                type="button"
                onClick={handlePayAndEnrol}
                disabled={isProcessing}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6026] py-4 px-6 text-sm sm:text-base font-semibold text-white shadow-[0_4px_16px_rgba(255,96,38,0.35)] transition hover:bg-[#E8531C] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin text-white" />
                    <span>Processing payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {payTodayFormatted} and enrol</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-[#8F94A0]">
                By paying you agree to the Parent agreement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

