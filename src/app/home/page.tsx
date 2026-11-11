"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ClipboardList,
  Video,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const router = useRouter();
  const { activeStudent, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const studentName = activeStudent?.fullName || "Aarav Sharma";
  const firstName = studentName.split(" ")[0];
  const studentGrade = activeStudent?.currentGrade || 6;

  return (
    <div className="flex min-h-screen w-full bg-[#F9F8F5] text-[#0B0C0F] selection:bg-[#FF6026] selection:text-white">
      {/* Shared Dark Sidebar */}
      <AppSidebar activeItem="home" />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Top Header: Greeting + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-[32px] sm:text-[40px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F]">
              Good evening, {firstName}
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-[#667085]">
              One thing is due this week. Let&apos;s get it done.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8F94A0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, tracks and lessons"
              className="w-full rounded-full border border-[#E3DFD5] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#0B0C0F] placeholder-[#8F94A0] shadow-sm outline-none transition focus:border-[#FF6026] focus:ring-2 focus:ring-[#FF6026]/15"
            />
          </div>
        </div>

        {/* Top Grid: Hero Card + This Week Widget */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Hero Card (Up Next · 12 Min) */}
          <div className="lg:col-span-8 relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-[#0E1015] p-7 sm:p-8 text-white shadow-xl min-h-[300px]">
            {/* Background Image of student working on laptop */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 overflow-hidden opacity-45 sm:opacity-65">
              <Image
                src="/images/explore-student-ai.jpg"
                alt="Student coding chatbot"
                fill
                priority
                className="object-cover object-left"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0E1015] via-[#0E1015]/60 to-transparent" />
            </div>

            <div className="relative z-10 max-w-[460px]">
              <span className="inline-block rounded-full bg-[#FF6026]/20 border border-[#FF6026]/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FF8B4E]">
                Up Next · 12 min
              </span>

              <h2 className="mt-3.5 font-display text-[28px] sm:text-[34px] font-medium leading-[1.1] tracking-tight text-white">
                Connect the steps
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-white/70">
                AI for Young Creators · Level 6, lesson 3 of 5
              </p>
            </div>

            <div className="relative z-10 mt-6 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="button"
                onClick={() => router.push(`/learning/${activeStudent?.id || "aarav"}`)}
                className="flex items-center justify-center gap-2 rounded-full bg-[#FF6026] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_16px_rgba(255,96,38,0.35)] transition hover:bg-[#E8531C] active:scale-95 cursor-pointer"
              >
                Resume lesson
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-white/60">
                  Level 6 · 60% done
                </span>
                <div className="h-1.5 w-24 sm:w-32 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full w-[60%] bg-[#FF6026] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* This Week Widget */}
          <div className="lg:col-span-4 rounded-[28px] border border-[#EAE6DE] bg-white p-6 shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-bold text-[#0B0C0F] tracking-tight">
              This week
            </h3>

            <div className="mt-4 space-y-4">
              {/* Item 1 */}
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#FFF2EB] text-[#FF6026]">
                  <ClipboardList className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0B0C0F]">
                    Build task: give your agent a memory
                  </h4>
                  <p className="text-[11px] text-[#8F94A0]">Due Fri, 9:00 PM</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#FFF2EB] text-[#FF6026]">
                  <Video className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0B0C0F]">
                    Live class: Personalise and improve
                  </h4>
                  <p className="text-[11px] text-[#8F94A0]">
                    Thu, 6:00 PM · bring your Level 6 agent
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-emerald-600">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#0B0C0F]">
                    Lesson 2: Agent instructions
                  </h4>
                  <p className="text-[11px] text-[#8F94A0]">Done on Tuesday</p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <span className="text-[11px] font-semibold text-[#FF6026] hover:underline cursor-pointer">
                View calendar &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Section: Your courses */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0B0C0F] tracking-tight">
              Your courses
            </h2>
            <Link
              href="/explore"
              className="text-xs font-semibold text-[#FF6026] hover:underline flex items-center gap-1"
            >
              See all in My learning <span>&rarr;</span>
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enrolled Course 1: AI for Young Creators (Flush image to left border matching Image 2) */}
            <div
              onClick={() => router.push(`/learning/${activeStudent?.id || "aarav"}`)}
              className="group flex cursor-pointer overflow-hidden rounded-[24px] border border-[#EAE6DE] bg-white shadow-sm transition hover:border-[#FF6026]/40 hover:shadow-md"
            >
              {/* Left Image Section: Flush to top, bottom, and left rounded borders */}
              <div className="relative w-36 sm:w-44 shrink-0 bg-[#F4F3EE] flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/tracks-ai.png"
                  alt="AI Study helper"
                  fill
                  className="object-contain p-1 grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>

              {/* Right Details Section */}
              <div className="flex flex-1 items-center justify-between p-5 sm:p-6 min-w-0 gap-4">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6026]">
                    AI & Agents
                  </span>
                  <h3 className="mt-0.5 text-base sm:text-[17px] font-bold text-[#0B0C0F] truncate">
                    AI for Young Creators
                  </h3>
                  <p className="mt-0.5 text-xs text-[#8F94A0]">
                    Level 6 of 8 · 60% done
                  </p>
                  <div className="mt-3 h-1.5 w-36 sm:w-44 rounded-full bg-[#EAE6DE] overflow-hidden">
                    <div className="h-full w-[60%] bg-[#FF6026] rounded-full" />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#0B0C0F] group-hover:text-[#FF6026] transition shrink-0">
                  <span>Continue</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </div>

            {/* Enrolled Course 2: Robotics Starter: Build a Rover (Flush image to left border matching Image 2) */}
            <div
              onClick={() => router.push("/courses/robotics-starter")}
              className="group flex cursor-pointer overflow-hidden rounded-[24px] border border-[#EAE6DE] bg-white shadow-sm transition hover:border-[#FF6026]/40 hover:shadow-md"
            >
              {/* Left Image Section: Flush to top, bottom, and left rounded borders */}
              <div className="relative w-36 sm:w-44 shrink-0 bg-[#F4F3EE] flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/rover-color.png"
                  alt="Robotics Rover"
                  fill
                  className="object-contain p-1 grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>

              {/* Right Details Section */}
              <div className="flex flex-1 items-center justify-between p-5 sm:p-6 min-w-0 gap-4">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6026]">
                    Robotics
                  </span>
                  <h3 className="mt-0.5 text-base sm:text-[17px] font-bold text-[#0B0C0F] truncate">
                    Robotics Starter: Build a Rover
                  </h3>
                  <p className="mt-0.5 text-xs text-[#8F94A0] truncate">
                    Starts Sat 6 Dec, 10:00 AM · kit waits at school
                  </p>
                  <span className="mt-2.5 inline-block rounded-full bg-[#FFF2EB] px-2.5 py-0.5 text-[10px] font-bold text-[#FF6026]">
                    Enrolled
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#0B0C0F] group-hover:text-[#FF6026] transition shrink-0">
                  <span>Get ready</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Try next, for Grade 6 */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0B0C0F] tracking-tight">
              Try next, for Grade {studentGrade}
            </h2>
            <Link
              href="/explore"
              className="text-xs font-semibold text-[#FF6026] hover:underline flex items-center gap-1"
            >
              Explore all 10 courses <span>&rarr;</span>
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: Game Design */}
            <div
              onClick={() => router.push("/courses/game-design-starter")}
              className="group flex cursor-pointer items-center justify-between rounded-2xl border border-[#EAE6DE] bg-white p-4 shadow-sm transition hover:border-[#FF6026]/40 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-[#F4F3EE]">
                  <Image
                    src="/images/tracks-games.png"
                    alt="Game design"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0B0C0F]">
                    Design a Playable Game
                  </h4>
                  <p className="text-[11px] text-[#8F94A0]">
                    Game Design · Grades 5–7 · ₹3,999
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#8F94A0] group-hover:text-[#FF6026] transition shrink-0" />
            </div>

            {/* Card 2: Sensors and Smart Alarms */}
            <div
              onClick={() => router.push("/courses/electronics-starter")}
              className="group flex cursor-pointer items-center justify-between rounded-2xl border border-[#EAE6DE] bg-white p-4 shadow-sm transition hover:border-[#FF6026]/40 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-[#F4F3EE]">
                  <Image
                    src="/images/tracks-electronics.png"
                    alt="Sensors alarm"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0B0C0F]">
                    Sensors and Smart Alarms
                  </h4>
                  <p className="text-[11px] text-[#8F94A0]">
                    Electronics & IoT · Grades 6–9 · ₹4,999
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#8F94A0] group-hover:text-[#FF6026] transition shrink-0" />
            </div>

            {/* Card 3: Design a Real Product */}
            <div
              onClick={() => router.push("/courses/design-starter")}
              className="group flex cursor-pointer items-center justify-between rounded-2xl border border-[#EAE6DE] bg-white p-4 shadow-sm transition hover:border-[#FF6026]/40 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-[#F4F3EE]">
                  <Image
                    src="/images/tracks-product.png"
                    alt="Design desk lamp"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0B0C0F]">
                    Design a Real Product
                  </h4>
                  <p className="text-[11px] text-[#8F94A0]">
                    Product & 3D Design · Grades 6–9 · ₹3,999
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#8F94A0] group-hover:text-[#FF6026] transition shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

