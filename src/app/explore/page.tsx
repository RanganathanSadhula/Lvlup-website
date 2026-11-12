"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ChevronDown,
  ArrowRight,
  Bot,
  Cpu,
  Sparkles,
  Gamepad2,
  Box,
  Check,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/lib/auth-context";
import { tracksData, allCourses, Course } from "@/data/tracks";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeStudent } = useAuth();

  const initialTrack = searchParams.get("track") || "all";
  const [selectedTrack, setSelectedTrack] = useState<string>(initialTrack);
  const [selectedGrade, setSelectedGrade] = useState<number>(activeStudent?.currentGrade || 6);
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKitOnly, setFilterKitOnly] = useState(false);
  const [filterStartsThisMonth, setFilterStartsThisMonth] = useState(false);

  const studentName = activeStudent?.fullName || "Aarav Sharma";

  // Filter courses based on track, grade, search and pills
  const filteredCourses = useMemo(() => {
    const list = allCourses.filter((course) => {
      // Track filter
      if (selectedTrack !== "all" && course.trackId !== selectedTrack) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = course.title.toLowerCase().includes(query);
        const matchesTrack = course.trackName.toLowerCase().includes(query);
        const matchesDesc = course.whatTheyBuild.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTrack && !matchesDesc) return false;
      }
      // Kit included filter
      if (filterKitOnly && !course.kitIncluded) {
        return false;
      }
      return true;
    });

    if (selectedTrack === "all" && !searchQuery.trim()) {
      const order = [
        "robotics-starter",
        "game-design-starter",
        "electronics-starter",
        "ai-study-helper",
        "design-starter",
        "electronics-iot",
      ];
      return list.sort((a, b) => {
        const idxA = order.indexOf(a.id);
        const idxB = order.indexOf(b.id);
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });
    }

    return list;
  }, [selectedTrack, searchQuery, filterKitOnly]);

  const fitGradeCount = allCourses.filter(
    (c) => selectedGrade >= c.minGrade && selectedGrade <= c.maxGrade
  ).length;
  const olderGradeCount = allCourses.length - fitGradeCount;

  const trackTabs = [
    { id: "all", label: "All tracks", count: "10 courses", icon: null },
    { id: "robotics", label: "Robotics", count: "2 courses", icon: Bot },
    { id: "electronics", label: "Electronics & IoT", count: "2 courses", icon: Cpu },
    { id: "ai", label: "AI & Agents", count: "2 courses", icon: Sparkles },
    { id: "games", label: "Game Design", count: "2 courses", icon: Gamepad2 },
    { id: "design", label: "Product & 3D", count: "2 courses", icon: Box },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#F9F8F5] text-[#0B0C0F] selection:bg-[#FF6026] selection:text-white">
      {/* Shared Dark Sidebar */}
      <AppSidebar activeItem="explore" />

      {/* Main Explore Content */}
      <div className="flex-1 min-w-0 flex flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Header Strip: Explore + Search + Grade Selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-[32px] sm:text-[40px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F]">
              Explore
            </h1>
            <p className="mt-1 text-sm sm:text-base text-[#667085]">
              10 courses across 5 tracks. Each one ends with something you build.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8F94A0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses"
                className="w-full rounded-full border border-[#E3DFD5] bg-white py-2 pl-9 pr-4 text-xs sm:text-sm text-[#0B0C0F] placeholder-[#8F94A0] shadow-sm outline-none transition focus:border-[#FF6026] focus:ring-2 focus:ring-[#FF6026]/15"
              />
            </div>

            {/* Grade Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-[#0B0C0F] bg-[#0B0C0F] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1C1F28]"
              >
                <span>For Grade {selectedGrade}</span>
                <ChevronDown className="size-3.5 opacity-70" />
              </button>

              {isGradeDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 z-30 w-36 rounded-2xl border border-[#EAE6DE] bg-white p-1.5 shadow-xl">
                  {[5, 6, 7, 8, 9, 10, 11].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => {
                        setSelectedGrade(grade);
                        setIsGradeDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition",
                        selectedGrade === grade
                          ? "bg-[#FFF2EB] text-[#FF6026]"
                          : "text-[#5A5F6B] hover:bg-[#F4F3EE] hover:text-[#0B0C0F]"
                      )}
                    >
                      Grade {grade}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Track Filter Cards Row (matching Image 2) */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {trackTabs.map((tab) => {
            const isSelected = selectedTrack === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTrack(tab.id)}
                className={cn(
                  "flex flex-col justify-between rounded-2xl p-4 text-left transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "bg-[#0E1015] text-white shadow-md"
                    : "border border-[#EAE6DE] bg-white text-[#0B0C0F] hover:border-[#D1CFC7] hover:shadow-sm"
                )}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-xl",
                      isSelected
                        ? "bg-[#FF6026] text-white"
                        : "bg-[#FFF2EB] text-[#FF6026]"
                    )}
                  >
                    {Icon ? (
                      <Icon className="size-4" />
                    ) : (
                      <div className="size-2 rounded-xs bg-white" />
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div
                    className={cn(
                      "text-xs sm:text-sm font-bold tracking-tight",
                      isSelected ? "text-white" : "text-[#0B0C0F]"
                    )}
                  >
                    {tab.label}
                  </div>
                  <div
                    className={cn(
                      "text-[11px] mt-0.5",
                      isSelected ? "text-white/60" : "text-[#8F94A0]"
                    )}
                  >
                    {tab.count}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-bar Filter & Counts */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#5A5F6B] pb-2">
          <div>
            <span>
              {fitGradeCount} courses fit Grade {selectedGrade}, plus {olderGradeCount} for older grades
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterStartsThisMonth(!filterStartsThisMonth)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-medium transition",
                filterStartsThisMonth
                  ? "border-[#FF6026] bg-[#FF6026] text-white"
                  : "border-[#E3DFD5] bg-white text-[#5A5F6B] hover:border-[#0B0C0F]"
              )}
            >
              Starts this month
            </button>

            <button
              type="button"
              onClick={() => setFilterKitOnly(!filterKitOnly)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-medium transition",
                filterKitOnly
                  ? "border-[#FF6026] bg-[#FF6026] text-white"
                  : "border-[#E3DFD5] bg-white text-[#5A5F6B] hover:border-[#0B0C0F]"
              )}
            >
              Kit included
            </button>

            <div className="rounded-full border border-[#E3DFD5] bg-white px-3 py-1.5 font-medium text-[#0B0C0F]">
              Sort: Starting soon ▾
            </div>
          </div>
        </div>

        {/* 2x3 Grid of Course Cards (matching Image 2) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.slice(0, 6).map((course, idx) => {
            const isEnrolled = course.id === "ai-study-helper";
            const isPopular = course.id === "robotics-starter";

            return (
              <div
                key={course.id}
                onClick={() => {
                  if (isEnrolled) {
                    router.push(`/learning/${activeStudent?.id || "aarav"}`);
                  } else {
                    router.push(`/courses/${course.id}`);
                  }
                }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#EAE6DE] bg-white shadow-sm transition-all duration-300 hover:border-[#FF6026] hover:shadow-md cursor-pointer"
              >
                {/* Top Badge */}
                {isPopular && (
                  <div className="absolute left-4 top-4 z-10 rounded-full bg-[#FF6026] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                    Popular in Grade {selectedGrade}
                  </div>
                )}
                {isEnrolled && (
                  <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#0B0C0F] shadow-sm">
                    <Check className="size-3 text-emerald-600" />
                    <span>You&apos;re enrolled</span>
                  </div>
                )}

                {/* Course Image Preview - Filled flush to borders, grayscale by default, vibrant color + zoom on hover */}
                <div className="relative h-[220px] w-full overflow-hidden bg-[#F4F3EE] flex items-center justify-center">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className={cn(
                      "grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105",
                      course.id === "electronics-iot"
                        ? "object-cover"
                        : "object-contain p-2 group-hover:p-1"
                    )}
                  />
                </div>

                {/* Course Details */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6026]">
                      {course.trackName}
                    </span>

                    <h3 className="mt-1 text-base sm:text-[17px] font-bold text-[#0B0C0F] tracking-tight group-hover:text-[#FF6026] transition">
                      {course.title}
                    </h3>

                    <p className="mt-2 text-xs leading-[18px] text-[#5A5F6B]">
                      <span className="font-semibold text-[#0B0C0F]">You&apos;ll build:</span>{" "}
                      {course.whatTheyBuild}
                    </p>

                    {/* Metadata Pills */}
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-[#F4F3EE] px-2.5 py-1 text-[11px] font-medium text-[#5A5F6B]">
                        {course.grades}
                      </span>
                      <span className="rounded-md bg-[#F4F3EE] px-2.5 py-1 text-[11px] font-medium text-[#5A5F6B]">
                        {course.duration}
                      </span>
                      {course.kitIncluded && (
                        <span className="rounded-md bg-[#F4F3EE] px-2.5 py-1 text-[11px] font-medium text-[#5A5F6B]">
                          Kit included
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Price & Link */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#F0ECE1] pt-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-[#0B0C0F]">
                        {course.priceFormatted}
                      </span>
                      <span className="text-xs text-[#8F94A0]">
                        {course.nextBatch}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (isEnrolled) {
                          router.push(`/learning/${activeStudent?.id || "aarav"}`);
                        } else {
                          router.push(`/courses/${course.id}`);
                        }
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-[#FF6026] hover:underline"
                    >
                      <span>{isEnrolled ? "Open" : "View"}</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
