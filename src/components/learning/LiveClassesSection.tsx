"use client";

import React from "react";
import { Check, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CLASS_PLAN_ITEMS,
  WEEK_CALENDAR_DAYS,
  REPLAY_ITEMS,
  BeforeJoinCheckItem,
  ReplayItem,
} from "@/data/live-classes";

interface LiveClassesSectionProps {
  beforeJoinList: BeforeJoinCheckItem[];
  onToggleBeforeJoin: (id: string) => void;
  onOpenRecording: (replay: ReplayItem) => void;
}

export function LiveClassesSection({
  beforeJoinList,
  onToggleBeforeJoin,
  onOpenRecording,
}: LiveClassesSectionProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Next Live Class Hero Card (Image 1 Exact) */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#0E1015] p-8 sm:p-10 text-white shadow-sm">
        {/* Background warm orange glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#FF6026]/15 blur-[100px]"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left Column: Badge, Title, Subtitle, Buttons */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6026] px-3.5 py-1 text-xs font-semibold text-white tracking-wide">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              LIVE IN 1 DAY
            </div>

            <h2 className="text-3xl sm:text-[36px] font-semibold text-white tracking-tight leading-tight">
              Level 7: Personalise and improve
            </h2>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Thu 12 Nov · 6:00 PM · 90 min · with Ms Ananya · bring your Level 6 agent
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                disabled
                className="rounded-full bg-[#3D251C] text-[#FF8B4E] px-6 py-2.5 text-xs sm:text-sm font-semibold cursor-not-allowed select-none"
              >
                Join class
              </button>
              <button
                type="button"
                onClick={() => alert("Added Thursday 6:00 PM Live Class to your calendar!")}
                className="rounded-full border border-white/20 bg-transparent hover:bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-medium text-white transition cursor-pointer"
              >
                Add to calendar
              </button>
              <span className="text-xs text-white/50 pl-1">
                Join opens 10 minutes before class
              </span>
            </div>
          </div>

          {/* Right Column: 3 Countdown Tiles */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-24 w-20 sm:h-28 sm:w-24 flex-col items-center justify-center rounded-2xl bg-[#1C1F26] border border-white/5">
              <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">01</span>
              <span className="mt-1 text-xs text-white/50 font-medium">days</span>
            </div>
            <div className="flex h-24 w-20 sm:h-28 sm:w-24 flex-col items-center justify-center rounded-2xl bg-[#1C1F26] border border-white/5">
              <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">04</span>
              <span className="mt-1 text-xs text-white/50 font-medium">hours</span>
            </div>
            <div className="flex h-24 w-20 sm:h-28 sm:w-24 flex-col items-center justify-center rounded-2xl bg-[#1C1F26] border border-white/5">
              <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">32</span>
              <span className="mt-1 text-xs text-white/50 font-medium">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week Calendar Strip Card */}
      <div className="rounded-[24px] bg-white border border-[#E3E0D9] p-4 sm:p-5 shadow-xs">
        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
          {WEEK_CALENDAR_DAYS.map((day) => {
            if (day.isHighlighted) {
              return (
                <div
                  key={day.dayNumber}
                  className="rounded-2xl border border-[#FF6026]/40 bg-[#FDF0EB] py-3.5 px-2 flex flex-col items-center justify-center transition"
                >
                  <span className="text-xs font-semibold text-[#B24514]">{day.dayName}</span>
                  <span className="text-2xl font-bold text-[#0B0C0F] my-0.5">{day.dayNumber}</span>
                  <span className="text-[11px] font-semibold text-[#FF6026] leading-tight">{day.sublabel}</span>
                </div>
              );
            }
            return (
              <div
                key={day.dayNumber}
                className="py-3.5 px-2 flex flex-col items-center justify-center transition hover:bg-[#FAF9F5] rounded-2xl"
              >
                <span className="text-xs font-medium text-[#5A5F6B]">{day.dayName}</span>
                <span className="text-2xl font-bold text-[#0B0C0F] my-0.5">{day.dayNumber}</span>
                <span className="text-[11px] text-[#5A5F6B] leading-tight">{day.sublabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Two-Column Grid: Class plan (Left) & Before you join + Replays (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Class plan) - 65% width */}
        <div className="lg:col-span-8 rounded-[24px] bg-white border border-[#E3E0D9] p-7 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#F0EDE6] pb-4">
            <h3 className="text-lg font-bold text-[#0B0C0F]">Class plan</h3>
            <span className="text-xs sm:text-sm font-medium text-[#5A5F6B]">90 minutes</span>
          </div>

          <div className="divide-y divide-[#F0EDE6]">
            {CLASS_PLAN_ITEMS.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="w-12 text-xs font-mono font-medium text-[#FF6026] pt-0.5 shrink-0">
                    {item.timestamp}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-[#0B0C0F]">{item.title}</h4>
                    <p className="text-xs text-[#5A5F6B] leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <span className="text-xs text-[#5A5F6B] font-medium shrink-0 pt-0.5">{item.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Before you join + Replays) - 35% width */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Before you join */}
          <div className="rounded-[24px] bg-white border border-[#E3E0D9] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0B0C0F]">Before you join</h3>
              <span className="text-xs font-medium text-[#5A5F6B]">
                {beforeJoinList.filter((i) => i.completed).length} of {beforeJoinList.length}
              </span>
            </div>

            <div className="space-y-3">
              {beforeJoinList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleBeforeJoin(item.id)}
                  className="flex items-center gap-3 cursor-pointer select-none group"
                >
                  <div
                    className={cn(
                      "size-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      item.completed
                        ? "bg-[#E3F5E8] text-[#1F9D55]"
                        : "border-2 border-[#D5D0C5] bg-transparent group-hover:border-[#FF6026]"
                    )}
                  >
                    {item.completed && <Check className="size-3.5 stroke-[3]" />}
                  </div>
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-medium transition",
                      item.completed ? "text-[#0B0C0F]" : "text-[#5A5F6B]"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Replays */}
          <div className="rounded-[24px] bg-white border border-[#E3E0D9] p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#0B0C0F]">Replays</h3>

            <div className="space-y-3.5">
              {REPLAY_ITEMS.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => onOpenRecording(rep)}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="size-8 rounded-full bg-[#FDF0EB] text-[#FF6026] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FF6026] group-hover:text-white transition">
                    <Play className="size-3.5 fill-current ml-0.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-[13px] font-semibold text-[#0B0C0F] group-hover:text-[#FF6026] transition leading-snug">
                      {rep.title}
                    </h4>
                    <p className="text-[11px] text-[#5A5F6B]">{rep.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

