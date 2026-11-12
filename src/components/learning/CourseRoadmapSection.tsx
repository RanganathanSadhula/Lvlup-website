"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Lock, Download, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseRoadmapSectionProps {
  isLessonCompleted: boolean;
  onNavigateLesson: () => void;
  onNavigateQuiz: () => void;
  onNavigateBuildTask: (taskId?: string) => void;
}

export function CourseRoadmapSection({
  isLessonCompleted,
  onNavigateLesson,
  onNavigateQuiz,
  onNavigateBuildTask,
}: CourseRoadmapSectionProps) {
  return (
    <div className="space-y-7 animate-fade-in">
      {/* Course Hero Card (Figma Node 731:1710) */}
      <div className="relative overflow-hidden rounded-[24px] bg-[#0B0C0F] p-8 sm:p-10 text-white shadow-md">
        {/* Background radial & pattern glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#FF6B2C]/15 blur-[100px]"
        />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.66px] text-[#FF6B2C]">
              AI &amp; AGENTS · GRADES 5–7
            </span>

            <h2 className="text-[30px] sm:text-[34px] font-medium leading-tight text-white tracking-[-0.68px]">
              AI for Young Creators
            </h2>

            {/* Progress Bar (Level 6 of 8 · 68%) */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-1.5 w-52 sm:w-64 rounded-full bg-[#404047] overflow-hidden">
                <div className="h-full w-[68%] rounded-full bg-[#FF6B2C]" />
              </div>
              <span className="text-xs sm:text-[13px] font-medium text-white/75">
                Level 6 of 8 · 68%
              </span>
            </div>

            {/* Resume Button & Time Left */}
            <div className="flex items-center gap-4 pt-3">
              <button
                type="button"
                onClick={onNavigateLesson}
                className="inline-flex items-center justify-center rounded-full bg-[#FF6B2C] px-6 py-3.5 text-[14px] sm:text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(255,107,44,0.35)] transition-all hover:bg-[#E8531C] active:scale-95 cursor-pointer"
              >
                Resume: Connect the steps
              </button>
              <span className="text-xs sm:text-[13px] font-medium text-white/60">
                12 min left
              </span>
            </div>
          </div>

          {/* Tablet Graphic with Dark Fade */}
          <div className="md:col-span-5 relative h-[180px] sm:h-[220px] flex items-center justify-center select-none">
            <div className="relative h-full w-full">
              <Image
                src="/images/tracks-ai.png"
                alt="AI for Young Creators"
                fill
                className="object-contain object-right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout (Level Path + Right Side Panels) (Figma Node 731:1724) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Level Path (712px width on desktop) */}
        <div className="lg:col-span-7 rounded-[20px] bg-white p-2 sm:p-3 shadow-[0px_8px_24px_0px_rgba(26,20,13,0.07)] border border-[#E3E0D9]">
          {/* Level 1 (Completed) */}
          <div className="flex items-center justify-between px-4 py-3.5 transition hover:bg-[#FAF9F5] rounded-xl">
            <div className="flex items-center gap-3.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#E3F5E8] text-[#1F9D55] text-xs font-bold">
                ✓
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#15171C]">
                  Level 1 · Problem map
                </h4>
                <p className="text-xs text-[#5A5F6B]">
                  Week 1 · build task reviewed
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateLesson}
              className="text-xs sm:text-[13px] font-semibold text-[#FF6B2C] hover:underline cursor-pointer"
            >
              Review
            </button>
          </div>
          <div className="h-px w-full bg-[#E3E0D9]" />

          {/* Level 2 (Completed) */}
          <div className="flex items-center justify-between px-4 py-3.5 transition hover:bg-[#FAF9F5] rounded-xl">
            <div className="flex items-center gap-3.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#E3F5E8] text-[#1F9D55] text-xs font-bold">
                ✓
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#15171C]">
                  Level 2 · Agent persona
                </h4>
                <p className="text-xs text-[#5A5F6B]">
                  Week 2 · build task reviewed
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateLesson}
              className="text-xs sm:text-[13px] font-semibold text-[#FF6B2C] hover:underline cursor-pointer"
            >
              Review
            </button>
          </div>
          <div className="h-px w-full bg-[#E3E0D9]" />

          {/* Level 3 (Completed) */}
          <div className="flex items-center justify-between px-4 py-3.5 transition hover:bg-[#FAF9F5] rounded-xl">
            <div className="flex items-center gap-3.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#E3F5E8] text-[#1F9D55] text-xs font-bold">
                ✓
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#15171C]">
                  Level 3 · Simple action
                </h4>
                <p className="text-xs text-[#5A5F6B]">
                  Week 3 · build task reviewed
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateLesson}
              className="text-xs sm:text-[13px] font-semibold text-[#FF6B2C] hover:underline cursor-pointer"
            >
              Review
            </button>
          </div>
          <div className="h-px w-full bg-[#E3E0D9]" />

          {/* Level 4 (Completed) */}
          <div className="flex items-center justify-between px-4 py-3.5 transition hover:bg-[#FAF9F5] rounded-xl">
            <div className="flex items-center gap-3.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#E3F5E8] text-[#1F9D55] text-xs font-bold">
                ✓
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#15171C]">
                  Level 4 · Interactive flow
                </h4>
                <p className="text-xs text-[#5A5F6B]">
                  Week 4 · build task reviewed
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateLesson}
              className="text-xs sm:text-[13px] font-semibold text-[#FF6B2C] hover:underline cursor-pointer"
            >
              Review
            </button>
          </div>
          <div className="h-px w-full bg-[#E3E0D9]" />

          {/* Level 5 (Completed) */}
          <div className="flex items-center justify-between px-4 py-3.5 transition hover:bg-[#FAF9F5] rounded-xl">
            <div className="flex items-center gap-3.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#E3F5E8] text-[#1F9D55] text-xs font-bold">
                ✓
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#15171C]">
                  Level 5 · Agent blueprint
                </h4>
                <p className="text-xs text-[#5A5F6B]">
                  Week 5 · build task reviewed
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateLesson}
              className="text-xs sm:text-[13px] font-semibold text-[#FF6B2C] hover:underline cursor-pointer"
            >
              Review
            </button>
          </div>
          <div className="h-px w-full bg-[#E3E0D9]" />

          {/* Level 6 (IN PROGRESS - Expanded Section Figma Node 731:1771) */}
          <div className="mt-1 rounded-2xl bg-[#FFEDE4] p-2.5 transition">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-3.5">
                <div className="flex size-7 items-center justify-center rounded-full bg-[#FF6B2C] text-xs font-bold text-white shadow-sm">
                  6
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#FF6B2C]">
                    WEEK 6 · CURRENT LEVEL
                  </span>
                  <h4 className="text-base font-semibold text-[#15171C]">
                    Chaining &amp; Testing Two Tasks
                  </h4>
                </div>
              </div>
              <span className="rounded-full bg-[#FF6B2C] px-3 py-1 text-xs font-semibold text-white shadow-xs">
                In progress
              </span>
            </div>

            <p className="px-3 text-xs text-[#5A5F6B] leading-relaxed">
              Connect inputs, memories, and safety checks into one smooth flow.
            </p>

            {/* Level 6 Lessons List */}
            <div className="mt-4 rounded-xl bg-white p-3 space-y-1 shadow-xs border border-[#E3E0D9]">
              {/* Lesson 1 */}
              <div className="flex items-center justify-between py-2 text-xs text-[#5A5F6B]">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[#15171C]">1. Why order matters</span>
                  <span>Video · 14 min</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#1F9D55] font-semibold">
                  <Check className="size-3.5 stroke-[2.5]" />
                  <span>Done</span>
                </div>
              </div>
              <div className="h-px w-full bg-[#E3E0D9]/50" />

              {/* Lesson 2 */}
              <div className="flex items-center justify-between py-2 text-xs text-[#5A5F6B]">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[#15171C]">2. Agent instructions</span>
                  <span>Video · 12 min</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#1F9D55] font-semibold">
                  <Check className="size-3.5 stroke-[2.5]" />
                  <span>Done</span>
                </div>
              </div>
              <div className="h-px w-full bg-[#E3E0D9]/50" />

              {/* Lesson 3: Connect the steps (Active) */}
              <div className="flex items-center justify-between rounded-lg bg-[#FFEDE4]/70 px-2 py-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#15171C]">3. Connect the steps</span>
                  <span className="text-[#5A5F6B]">Video · 18 min</span>
                </div>
                <button
                  type="button"
                  onClick={onNavigateLesson}
                  className="rounded-full bg-[#FF6B2C] px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-[#E8531C] cursor-pointer"
                >
                  {isLessonCompleted ? "Rewatch" : "Resume"}
                </button>
              </div>
              <div className="h-px w-full bg-[#E3E0D9]/50" />

              {/* Lesson 4: Test two tasks (Quiz) */}
              <div className="flex items-center justify-between py-2 text-xs text-[#5A5F6B]">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[#15171C]">4. Test two tasks</span>
                  <span>Quiz · 14 min</span>
                </div>
                <button
                  type="button"
                  onClick={onNavigateQuiz}
                  className={cn(
                    "font-semibold cursor-pointer",
                    isLessonCompleted
                      ? "rounded-full bg-[#FF6026] text-white px-3 py-1 shadow-xs hover:bg-[#E8531C]"
                      : "text-[#FF6B2C] hover:underline"
                  )}
                >
                  {isLessonCompleted ? "Start quiz →" : "Take quiz"}
                </button>
              </div>

              {/* Lesson 5: Improve and protect */}
              <div className="flex items-center justify-between py-2 text-xs text-[#5A5F6B]">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[#15171C]">5. Improve and protect</span>
                  <span>Video · 16 min</span>
                </div>
                <span className="text-[#A7ACB8]">Up next</span>
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-[#E3E0D9]" />

          {/* Level 7 (Locked) */}
          <div className="flex items-center justify-between px-4 py-3.5 text-[#A7ACB8]">
            <div className="flex items-center gap-3.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#EFEDE6] text-xs font-bold text-[#A7ACB8]">
                7
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#A7ACB8]">
                  Level 7 · Improve and polish
                </h4>
                <p className="text-xs text-[#5A5F6B]">
                  Week 7 · opens after level 6
                </p>
              </div>
            </div>
            <Lock className="size-4 text-[#A7ACB8]" />
          </div>
          <div className="h-px w-full bg-[#E3E0D9]" />

          {/* Level 8 (Locked) */}
          <div className="flex items-center justify-between px-4 py-3.5 text-[#A7ACB8]">
            <div className="flex items-center gap-3.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-[#EFEDE6] text-xs font-bold text-[#A7ACB8]">
                8
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-[#A7ACB8]">
                  Level 8 · Demo for parents
                </h4>
                <p className="text-xs text-[#5A5F6B]">
                  Week 8 · opens after level 7
                </p>
              </div>
            </div>
            <Lock className="size-4 text-[#A7ACB8]" />
          </div>
        </div>

        {/* Right Column: Build Task Due + Level Test + Materials + Other Course */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Build Task Due (Figma Node 731:1820) */}
          <div className="rounded-[24px] bg-white p-6 shadow-[0px_8px_24px_0px_rgba(26,20,13,0.07)] border border-[#E3E0D9]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B2C]">
              BUILD TASK · DUE FRI 9:00 PM
            </span>
            <h3 className="mt-1.5 text-lg font-bold text-[#0B0C0F]">
              Give your agent a memory
            </h3>
            <p className="mt-1 text-xs text-[#5A5F6B]">
              1 of 3 checks done · draft saved
            </p>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#E3E0D9]">
              <span className="text-xs text-[#5A5F6B]">Part of your level 6 build</span>
              <button
                type="button"
                onClick={() => onNavigateBuildTask("level-6-memory")}
                className="rounded-full bg-[#FF6B2C] hover:bg-[#E8531C] px-4 py-2 text-xs font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer"
              >
                Open build task →
              </button>
            </div>
          </div>

          {/* Card 2: Level 6 Test */}
          <div className="rounded-[24px] bg-white p-6 shadow-[0px_8px_24px_0px_rgba(26,20,13,0.07)] border border-[#E3E0D9]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B2C]">
                LEVEL TEST
              </span>
              <span className="text-xs text-[#5A5F6B]">Pass to unlock Level 7</span>
            </div>
            <h3 className="mt-1.5 text-lg font-bold text-[#0B0C0F]">
              Test two tasks
            </h3>
            <p className="mt-1 text-xs text-[#5A5F6B]">
              5 multiple choice questions · 14 minutes · retakes allowed
            </p>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#E3E0D9]">
              <span className="text-xs text-[#5A5F6B]">
                {isLessonCompleted ? "Ready to test" : "Opens after Lesson 3"}
              </span>
              <button
                type="button"
                onClick={onNavigateQuiz}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold shadow-xs transition cursor-pointer",
                  isLessonCompleted
                    ? "bg-[#0B0C0F] text-white hover:bg-[#202228] active:scale-95"
                    : "bg-[#EFECE6] text-[#A7ACB8] cursor-not-allowed"
                )}
              >
                Start quiz →
              </button>
            </div>
          </div>

          {/* Card 3: Materials & Downloads */}
          <div className="rounded-[24px] bg-white p-6 shadow-[0px_8px_24px_0px_rgba(26,20,13,0.07)] border border-[#E3E0D9] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B0C0F]">Course materials</h3>
              <a
                href="/downloads/ThinkOva-Eight-Week-Curriculum.pdf"
                download
                className="text-xs font-semibold text-[#FF6B2C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="size-3" />
                <span>Download all (ZIP)</span>
              </a>
            </div>

            <div className="space-y-2">
              <a
                href="/downloads/ThinkOva-Eight-Week-Curriculum.pdf"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E3E0D9] bg-[#FAF9F5] text-xs hover:border-[#D5D0C5] transition cursor-pointer"
              >
                <span className="font-medium text-[#0B0C0F]">Lesson 3 slides (PDF)</span>
                <span className="text-[11px] text-[#5A5F6B]">2.4 MB</span>
              </a>
              <a
                href="/downloads/ThinkOva-Eight-Week-Curriculum.pdf"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E3E0D9] bg-[#FAF9F5] text-xs hover:border-[#D5D0C5] transition cursor-pointer"
              >
                <span className="font-medium text-[#0B0C0F]">Safety step checklist (PDF)</span>
                <span className="text-[11px] text-[#5A5F6B]">1.1 MB</span>
              </a>
            </div>
          </div>

          {/* Card 4: Other Enrolled Course */}
          <div className="rounded-[24px] bg-white p-6 shadow-[0px_8px_24px_0px_rgba(26,20,13,0.07)] border border-[#E3E0D9] flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative size-14 rounded-2xl bg-[#F4F3EE] overflow-hidden shrink-0 flex items-center justify-center">
                <Image
                  src="/images/tracks-robotics.png"
                  alt="Robotics Starter"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="rounded-full bg-[#FAF9F5] border border-[#E3E0D9] px-2 py-0.5 text-[10px] font-bold text-[#5A5F6B] uppercase tracking-wider">
                  Robotics
                </span>
                <h4 className="text-sm font-bold text-[#0B0C0F] mt-1">
                  Robotics Starter: Build a Rover
                </h4>
                <p className="text-xs text-[#5A5F6B]">
                  Starts Sat 6 Dec · kit waits at school
                </p>
              </div>
            </div>
            <ChevronRight className="size-5 text-[#5A5F6B]" />
          </div>
        </div>
      </div>
    </div>
  );
}

