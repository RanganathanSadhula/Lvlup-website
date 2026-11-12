"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Calendar, ArrowRight, Download, Sparkles } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/lib/auth-context";
import { getCourseById } from "@/data/tracks";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeStudent, user } = useAuth();

  const courseId = searchParams.get("courseId") || "robotics-starter";
  const course = getCourseById(courseId);

  const studentName = activeStudent?.fullName || "Aarav Sharma";
  const studentFirstName = studentName.split(" ")[0];
  const parentEmail = user?.email || "priya.sharma@gmail.com";
  const paidAmount = searchParams.get("paid") || course.price.toLocaleString("en-IN");

  const handleDownloadInvoice = () => {
    alert("Downloading official tax invoice PDF for " + studentName + "...");
  };

  const handleAddToCalendar = () => {
    alert("Calendar invite created for Sat 6 Dec, 10:00 AM! Added to your schedule.");
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F9F8F5] text-[#0B0C0F] selection:bg-[#FF6026] selection:text-white">
      {/* Shared Dark Sidebar */}
      <AppSidebar activeItem="explore" />

      {/* Main Confirmation Container */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[560px] rounded-[32px] border border-[#EAE6DE] bg-white p-8 sm:p-10 shadow-lg text-center">
          {/* Green Checkmark Badge matching Image 5 */}
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#10B981] text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
            <Check className="size-7 stroke-[3]" />
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-display text-[28px] sm:text-[34px] font-bold tracking-tight text-[#0B0C0F]">
            {studentFirstName} is enrolled
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#667085]">
            Receipt and class link sent to{" "}
            <span className="font-semibold text-[#0B0C0F]">{parentEmail}</span> and WhatsApp.
          </p>

          {/* Grey Receipt Details Box matching Image 5 */}
          <div className="mt-6 rounded-2xl bg-[#F9F8F5] p-5 text-xs sm:text-sm text-left border border-[#F0ECE1] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#8F94A0]">Course</span>
              <span className="font-bold text-[#0B0C0F]">{course.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8F94A0]">First class</span>
              <span className="font-bold text-[#0B0C0F]">Sat 6 Dec, 10:00 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8F94A0]">Rover kit</span>
              <span className="font-bold text-[#0B0C0F]">
                Waits at {activeStudent?.schoolName || "Banyan Grove School"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8F94A0]">Paid</span>
              <span className="font-bold text-[#0B0C0F]">₹{paidAmount} · UPI</span>
            </div>
          </div>

          {/* What happens next */}
          <div className="mt-8 text-left">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B0C0F]">
              What happens next
            </h2>

            <div className="mt-4 space-y-3.5">
              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FFF2EB] text-xs font-bold text-[#FF6026]">
                  1
                </span>
                <p className="text-xs sm:text-sm text-[#0B0C0F] pt-0.5">
                  Collect the kit from school this week
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FFF2EB] text-xs font-bold text-[#FF6026]">
                  2
                </span>
                <p className="text-xs sm:text-sm text-[#0B0C0F] pt-0.5">
                  Join class 10 minutes early to test your mic
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FFF2EB] text-xs font-bold text-[#FF6026]">
                  3
                </span>
                <p className="text-xs sm:text-sm text-[#0B0C0F] pt-0.5">
                  Your first build task opens after class
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="flex w-full sm:w-1/2 items-center justify-center gap-2 rounded-2xl bg-[#FF6026] py-3.5 px-5 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(255,96,38,0.35)] transition hover:bg-[#E8531C] active:scale-[0.99] cursor-pointer"
            >
              <span>Go to My learning</span>
              <ArrowRight className="size-4" />
            </button>

            <button
              type="button"
              onClick={handleAddToCalendar}
              className="flex w-full sm:w-1/2 items-center justify-center gap-2 rounded-2xl border border-[#DCD8CF] bg-white py-3.5 px-5 text-xs sm:text-sm font-semibold text-[#0B0C0F] shadow-sm transition hover:bg-[#F2EFE9] active:scale-[0.99] cursor-pointer"
            >
              <Calendar className="size-4 text-[#8F94A0]" />
              <span>Add class to calendar</span>
            </button>
          </div>

          {/* Invoice PDF Link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="text-xs font-semibold text-[#FF6026] hover:underline"
            >
              Download invoice (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

