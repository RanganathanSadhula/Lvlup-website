"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/lib/auth-context";
import { getCourseById } from "@/data/tracks";
import { cn } from "@/lib/utils";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { activeStudent } = useAuth();

  const courseId = (params?.courseId as string) || "robotics-starter";
  const course = getCourseById(courseId);

  const studentName = activeStudent?.fullName || "Aarav Sharma";
  const studentFirstName = studentName.split(" ")[0];

  const [activeTab, setActiveTab] = useState<"plan" | "tests" | "kit" | "tutor" | "faq">("plan");
  const [openWeek, setOpenWeek] = useState<number | null>(1);

  const weeklyPlan = course.weeklyPlan || [
    {
      week: 1,
      title: "Meet the parts, and the safety pledge",
      subtitle: "You'll have: A wired chassis and a signed safety pledge",
      tags: [
        "Parts of a robot",
        "Batteries and safe wiring",
        "How motors turn wheels",
        "Reading a build plan",
        "The safety pledge",
      ],
    },
    {
      week: 2,
      title: "Motors, wheels and power",
      subtitle: "You'll have: Wheels that turn on command",
      tags: ["Motor controllers", "Polarity & rotation", "DC motor current draw"],
    },
    {
      week: 3,
      title: "Your first drive program",
      subtitle: "You'll have: The rover drives a square",
      tags: ["Timed drive states", "Precision 90-degree pivot", "Square perimeter trace"],
    },
    {
      week: 4,
      title: "Add a distance sensor",
      subtitle: "You'll have: It measures how far the wall is",
      tags: ["Ultrasonic pulses", "Real-time range finding", "Echo pin timing"],
    },
    {
      week: 5,
      title: "Dodge obstacles on its own",
      subtitle: "You'll have: It stops and turns before a wall",
      tags: ["Proximity threshold", "Evasive reverse & turn", "Continuous obstacle evasion"],
    },
    {
      week: 6,
      title: "Rover challenge for parents",
      subtitle: "You'll have: Demo day: two tests, live",
      tags: ["Straight-line sprint", "20 cm wall emergency stop", "Parent live defense"],
    },
  ];

  const handleEnrol = () => {
    router.push(`/checkout?courseId=${course.id}&studentId=${activeStudent?.id || "aarav"}`);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F9F8F5] text-[#0B0C0F] selection:bg-[#FF6026] selection:text-white">
      {/* Shared Dark Sidebar */}
      <AppSidebar activeItem="explore" />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Breadcrumb matching Image 3 */}
        <nav className="flex items-center gap-2 text-xs text-[#8F94A0]">
          <Link href="/explore" className="hover:text-[#0B0C0F] transition">
            Explore
          </Link>
          <ChevronRight className="size-3" />
          <Link
            href={`/explore?track=${course.trackId}`}
            className="hover:text-[#0B0C0F] transition"
          >
            {course.trackName}
          </Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-[#0B0C0F]">{course.title}</span>
        </nav>

        {/* 2-Column Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hero Showcase + Tabs + Weekly Plan (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Course Hero Card matching Image 3 */}
            <div className="overflow-hidden rounded-[28px] border border-[#EAE6DE] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-7 items-stretch">
                {/* Photo of student holding rover */}
                <div className="relative w-full md:w-[280px] aspect-[4/5] shrink-0 overflow-hidden rounded-[20px] bg-[#0B0C0F]">
                  <Image
                    src={course.heroImage || "/images/course-rover-girl.jpg"}
                    alt={course.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-cover object-center"
                  />
                </div>

                {/* Course Overview Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6026]">
                      {course.trackName.toUpperCase()} · JUNIOR COURSE
                    </span>

                    <h1 className="mt-1.5 font-display text-[28px] sm:text-[34px] font-bold leading-[1.1] tracking-tight text-[#0B0C0F]">
                      {course.title}
                    </h1>

                    {/* Demo Day Callout Box */}
                    <div className="mt-4 rounded-2xl bg-[#FFF5EE] border border-[#FFE3D0] p-4 sm:p-5">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-[#FF6026]">
                        By demo day your child will have
                      </span>
                      <p className="mt-1 text-sm sm:text-[15px] font-medium leading-[22px] text-[#0B0C0F]">
                        {course.demoDayPromise ||
                          "A rover that drives on its own, sees a wall 20 cm away and steers around it."}
                      </p>
                    </div>

                    {/* Metadata Badges */}
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-lg bg-[#F4F3EE] px-3 py-1.5 text-xs font-semibold text-[#5A5F6B]">
                        {course.grades}
                      </span>
                      <span className="rounded-lg bg-[#F4F3EE] px-3 py-1.5 text-xs font-semibold text-[#5A5F6B]">
                        {course.duration}
                      </span>
                      <span className="rounded-lg bg-[#F4F3EE] px-3 py-1.5 text-xs font-semibold text-[#5A5F6B]">
                        {course.classSchedule || "90-min class, Saturdays"}
                      </span>
                      {course.kitIncluded && (
                        <span className="rounded-lg bg-[#F4F3EE] px-3 py-1.5 text-xs font-semibold text-[#5A5F6B]">
                          Kit included
                        </span>
                      )}
                      <span className="rounded-lg bg-[#F4F3EE] px-3 py-1.5 text-xs font-semibold text-[#5A5F6B]">
                        No coding needed
                      </span>
                    </div>
                  </div>

                  {/* Tutor Snippet */}
                  <div className="mt-6 flex items-center gap-3 pt-5 border-t border-[#F0ECE1]">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-[#EAE6DE]">
                      <Image
                        src="/images/tutors/rohan.jpg"
                        alt="Rohan Mehta"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0B0C0F]">
                        {course.tutor?.name || "Rohan Mehta"}
                      </div>
                      <div className="text-[11px] sm:text-xs text-[#8F94A0]">
                        {course.tutor?.bio || "Robotics tutor · background-checked · ran 30+ clubs"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 border-b border-[#EAE6DE] text-sm">
              {[
                { id: "plan", label: "Weekly plan" },
                { id: "tests", label: "The two tests" },
                { id: "kit", label: "Kit and tools" },
                { id: "tutor", label: "Tutor" },
                { id: "faq", label: "FAQ" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "pb-3 font-semibold transition cursor-pointer",
                    activeTab === tab.id
                      ? "border-b-2 border-[#FF6026] text-[#0B0C0F]"
                      : "text-[#8F94A0] hover:text-[#0B0C0F]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Weekly Plan Accordion List matching Image 3 */}
            <div className="space-y-3">
              {weeklyPlan.map((item) => {
                const isOpen = openWeek === item.week;
                const isFinalWeek = item.week === 6;

                return (
                  <div
                    key={item.week}
                    className="overflow-hidden rounded-2xl border border-[#EAE6DE] bg-white transition shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenWeek(isOpen ? null : item.week)}
                      className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                            isFinalWeek ? "bg-[#FF6026]" : "bg-[#0B0C0F]"
                          )}
                        >
                          {item.week}
                        </span>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[#0B0C0F]">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-[#8F94A0]">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-[#8F94A0]">
                        <span>Week {item.week}</span>
                        <span className="font-bold text-sm">{isOpen ? "—" : "+"}</span>
                      </div>
                    </button>

                    {isOpen && item.tags && (
                      <div className="px-5 pb-5 pt-1 border-t border-[#F5F2EB]">
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-[#F4F3EE] px-3.5 py-1.5 text-xs font-medium text-[#5A5F6B]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sticky Column: Black Pricing Card + Demo Day Tests Card (Cols 9-12) */}
          <div className="lg:col-span-4 space-y-6 sticky top-8">
            {/* Black Pricing Card matching Image 3 */}
            <div className="rounded-[28px] bg-[#0E1015] p-7 text-white shadow-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                All 6 weeks · Kit included
              </span>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-[32px] sm:text-[36px] font-bold text-white leading-none">
                  {course.priceFormatted}
                </span>
                <span className="text-xs text-white/60">in full</span>
              </div>

              <div className="mt-1 text-xs text-white/50">
                or {course.twoPartsPriceFormatted} in two parts
              </div>

              {/* Big Orange Enrol Button with Active Student Name */}
              <button
                type="button"
                onClick={handleEnrol}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6026] py-4 px-6 text-sm sm:text-base font-semibold text-white shadow-[0_4px_16px_rgba(255,96,38,0.35)] transition hover:bg-[#E8531C] active:scale-[0.99] cursor-pointer"
              >
                <span>Enrol {studentFirstName}</span>
                <span>&rarr;</span>
              </button>

              {/* Course Meta Info */}
              <div className="mt-6 space-y-3 pt-6 border-t border-white/10 text-xs text-white/70">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Next batch</span>
                  <span className="font-semibold text-white">
                    {course.classSchedule?.includes("Saturdays")
                      ? "Sat 6 Dec, 10:00 AM"
                      : "Sun 7 Dec, 10:00 AM"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Where</span>
                  <span className="font-semibold text-white">
                    {course.location || "Banyan Grove School lab"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Seats left</span>
                  <span className="font-semibold text-[#FF8B4E]">
                    {course.seatsLeft || 7} of 25
                  </span>
                </div>
              </div>
            </div>

            {/* White Demo Day Tests Card matching Image 3 */}
            <div className="rounded-[28px] border border-[#EAE6DE] bg-white p-6 shadow-sm">
              <h3 className="text-sm sm:text-base font-bold text-[#0B0C0F] tracking-tight">
                The two tests at demo day
              </h3>

              <div className="mt-4 space-y-3.5">
                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FFF2EB] text-xs font-bold text-[#FF6026]">
                    1
                  </span>
                  <p className="text-xs sm:text-sm text-[#0B0C0F] leading-[20px]">
                    Drives 2 metres in a straight line on its own
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FFF2EB] text-xs font-bold text-[#FF6026]">
                    2
                  </span>
                  <p className="text-xs sm:text-sm text-[#0B0C0F] leading-[20px]">
                    Stops or turns before a wall 20 cm away
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0ECE1] text-[11px] leading-[18px] text-[#8F94A0]">
                <strong className="text-[#0B0C0F]">Our promise:</strong> attend at least 3 in 4 classes.
                If it doesn&apos;t pass, half the fee comes back.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
