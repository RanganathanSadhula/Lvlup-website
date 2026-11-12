"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Users,
  Bell,
  Mail,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  FEATURED_HACKATHON,
  EVENTS_LIST,
  EventItem,
} from "@/data/events-data";

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "hackathons" | "demo-days" | "guest-sessions" | "past"
  >("all");
  const [notifiedEvents, setNotifiedEvents] = useState<Record<string, string>>({});

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "hackathons", label: "Hackathons" },
    { id: "demo-days", label: "Demo days" },
    { id: "guest-sessions", label: "Guest sessions" },
    { id: "past", label: "Past" },
  ] as const;

  const filteredEvents =
    selectedCategory === "all"
      ? EVENTS_LIST
      : EVENTS_LIST.filter((e) => e.categoryKey === selectedCategory);

  const handleActionClick = (e: React.MouseEvent, event: EventItem) => {
    e.preventDefault();
    if (event.actionType === "calendar") {
      setNotifiedEvents((prev) => ({
        ...prev,
        [event.id]: "Added to Google & Apple Calendar!",
      }));
    } else if (event.actionType === "remind") {
      setNotifiedEvents((prev) => ({
        ...prev,
        [event.id]: "Reminder set for livestream!",
      }));
    } else if (event.actionType === "invite") {
      setNotifiedEvents((prev) => ({
        ...prev,
        [event.id]: "Family invitation link generated & copied!",
      }));
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F4F3EE] text-[#0B0C0F] selection:bg-[#FF6026] selection:text-white">
      {/* App Sidebar with 'events' active */}
      <AppSidebar activeItem="events" />

      {/* Main Events Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="mx-auto max-w-[1140px] space-y-8 animate-fade-in">
          
          {/* Header Title & Subtitle */}
          <div>
            <h1 className="font-display text-[32px] sm:text-[36px] font-semibold text-[#0B0C0F] tracking-tight">
              Events
            </h1>
            <p className="text-xs sm:text-sm text-[#5A5F6B] mt-1 font-medium">
              Hackathons, demo days and guest sessions. Free for enrolled learners.
            </p>
          </div>

          {/* Featured Hackathon Hero Card (Image 1 Exact) */}
          <div className="group relative overflow-hidden rounded-[28px] bg-[#0B0C0F] text-white shadow-md">
            {/* Background radial glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#FF6026]/15 blur-[100px]"
            />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center">
              {/* Left Column: Badges, Title, Meta, and Action Button */}
              <div className="md:col-span-7 p-8 sm:p-10 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full bg-[#FF6026] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {FEATURED_HACKATHON.badgeCategory}
                  </span>
                  <span className="rounded-full bg-[#E3F5E8] border border-[#1F9D55]/30 px-3.5 py-1 text-xs font-semibold text-[#1F9D55]">
                    {FEATURED_HACKATHON.statusBadge}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-[32px] md:text-[36px] font-semibold text-white tracking-tight leading-tight">
                  {FEATURED_HACKATHON.title}
                </h2>

                <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl">
                  {FEATURED_HACKATHON.meta}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={FEATURED_HACKATHON.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6026] hover:bg-[#E8531C] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg transition active:scale-95"
                  >
                    <span>See details</span>
                    <span className="leading-none">→</span>
                  </Link>

                  <span className="text-xs text-white/60">
                    {FEATURED_HACKATHON.teamsCountText} · {FEATURED_HACKATHON.closesText}
                  </span>
                </div>
              </div>

              {/* Right Column: Illustration Image (Image 3) - Black & White when not hovered */}
              <div className="md:col-span-5 relative h-[240px] sm:h-[300px] md:h-[340px] w-full overflow-hidden select-none">
                <Image
                  src={FEATURED_HACKATHON.image}
                  alt={FEATURED_HACKATHON.title}
                  fill
                  priority
                  className="object-cover object-center grayscale contrast-105 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
                />
                {/* Gradient fade on left so the graphic fades seamlessly into dark card */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0C0F] to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0B0C0F] to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Category Filter Pills (Image 1 Exact) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  "rounded-full px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold transition cursor-pointer select-none",
                  selectedCategory === tab.id
                    ? "bg-[#0B0C0F] text-white shadow-xs"
                    : "bg-white border border-[#E3E0D9] text-[#5A5F6B] hover:text-[#0B0C0F] hover:border-[#D5D0C5]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid of Events (3 Cards - Exact match to Image 1) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group rounded-[24px] bg-white border border-[#E3E0D9] shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                {/* Top Image Container - Black & White when not hovered, full color on hover */}
                <div className="relative h-48 w-full bg-[#FAF9F5] overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className={cn(
                      "transition-all duration-500 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105",
                      event.image.includes("rover") ? "object-contain p-6" : "object-cover"
                    )}
                  />
                </div>


                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-start gap-4">
                    {/* Date Block */}
                    <div className="text-center shrink-0 pr-1">
                      <p className="text-2xl font-bold text-[#FF6026] leading-none">
                        {event.dayNumber}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A5F6B] mt-0.5">
                        {event.month}
                      </p>
                    </div>

                    {/* Event Info */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6026] block">
                        {event.category}
                      </span>
                      <h3 className="text-sm sm:text-[15px] font-bold text-[#0B0C0F] leading-snug group-hover:text-[#FF6026] transition">
                        {event.title}
                      </h3>
                      <p className="text-xs text-[#5A5F6B]">
                        {event.meta}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Link & Feedback */}
                  <div className="pt-2 border-t border-[#E3E0D9]/60 flex items-center justify-between text-xs">
                    {notifiedEvents[event.id] ? (
                      <span className="inline-flex items-center gap-1.5 text-[#1F9D55] font-semibold">
                        <CheckCircle2 className="size-3.5" />
                        <span>{notifiedEvents[event.id]}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleActionClick(e, event)}
                        className="font-semibold text-[#FF6026] hover:text-[#E8531C] transition cursor-pointer flex items-center gap-1"
                      >
                        <span>{event.actionLabel}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

