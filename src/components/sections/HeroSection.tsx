"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { tracksData, allCourses, Course } from "@/data/tracks";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const [selectedFinderGrade, setSelectedFinderGrade] = useState<number>(6);
  const [selectedFinderTrack, setSelectedFinderTrack] = useState<string>("robots");
  const { user, activeStudent } = useAuth();

  const matchedFinderCourse: Course = useMemo(() => {
    const track = tracksData.find((t) => t.slug === selectedFinderTrack) ?? tracksData[0]!;
    const match = track.courses.find(
      (c) => selectedFinderGrade >= c.minGrade && selectedFinderGrade <= c.maxGrade
    );
    return match ?? track.courses[0] ?? allCourses[0]!;
  }, [selectedFinderGrade, selectedFinderTrack]);

  const router = useRouter();
  const handleCourseClick = () => {
    if (user && activeStudent) {
      router.push(`/courses/${matchedFinderCourse.id}`);
    } else {
      router.push(`/explore?track=${selectedFinderTrack}&grade=${selectedFinderGrade}`);
    }
  };

  const scrollToEnrol = () => {
    const el = document.getElementById("enrol");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="course"
      aria-labelledby="hero-title"
      className="group relative min-h-[960px] w-full overflow-hidden bg-[#0B0C0F] pt-12 pb-28 lg:pb-36 text-white"
    >
      {/* Background radial glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-[#FF6B2C]/10 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[400px] top-96 h-[400px] w-[400px] rounded-full bg-[#FF6B2C]/5 blur-[120px]"
      />

      {/* ThinkOva Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          backgroundImage: 'url("/images/grain-dark.png")',
          backgroundRepeat: "repeat",
          opacity: 0.52,
        }}
      />

      {/* Right Hero Image Panel */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[55%] select-none overflow-hidden">
        <Image
          src="/images/hero-lab-student.png"
          alt="Student holding autonomous robotics rover in a computer lab"
          fill
          priority
          quality={100}
          className="object-cover object-center grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
        />

        {/* Left edge seamless dark gradient fade */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-[45%]"
          style={{
            background:
              "linear-gradient(to right, #0B0C0F 0%, rgba(11,12,15,0.92) 25%, rgba(11,12,15,0.5) 60%, transparent 100%)",
          }}
        />

        {/* Bottom edge fade */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background: "linear-gradient(to top, #0B0C0F 0%, transparent 100%)",
          }}
        />

        {/* Floating Rover Demo Day Badge - Fixed Glassmorphic Layout (Image 2 style) */}
        <div className="pointer-events-auto absolute bottom-14 right-14 z-20 w-[310px] sm:w-[320px] max-w-[90vw] rounded-2xl border border-white/15 bg-black/50 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B2C]">
            BUILT AT DEMO DAY
          </span>
          <h4 className="mt-2 text-[18px] font-semibold text-white leading-tight">
            Plant-watering system
          </h4>
          <p className="mt-1 text-xs text-white/60 leading-normal">
            Riya, Grade 10 · Electronics & IoT
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-3 py-1.5 text-xs font-medium text-emerald-400">
            <Check className="size-3.5 stroke-[2.5]" />
            2/2 tests passed
          </div>
        </div>
      </div>

      {/* Left Content Container */}
      <Container className="relative z-10 py-12 lg:py-16">
        <div className="max-w-[580px]">
          <ScrollReveal>
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80">
              <span className="size-2 rounded-full bg-[#FF6B2C]" />
              GRADES 5–11 · 5 TRACKS · 10 COURSES
            </div>

            {/* Headline */}
            <h1
              id="hero-title"
              className="mt-6 font-display text-[54px] font-normal leading-[1.05] tracking-[-0.035em] text-white sm:text-[64px]"
            >
              Don’t just use
              <br />
              technology. Build
              <br />
              with it.
            </h1>

            {/* Subhead */}
            <p className="mt-6 text-[17px] font-normal leading-[27px] text-[#A6ABB4]">
              Hands-on courses in robotics, electronics, AI, game design and product design.
              Your child learns with a trained tutor at school and finishes every course with
              something real that works.
            </p>

            {/* Glassmorphic Course Finder Card with Image 3 Glow directly at the back */}
            <div className="relative mt-8">
              {/* Image 3 Gradient Glow directly behind the first glass card (Zero clipping) */}
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 flex items-center justify-center opacity-85 select-none"
              >
                <div className="relative h-[125%] w-[125%] -translate-y-2">
                  <Image
                    src="/images/hero-card-glow.png"
                    alt=""
                    fill
                    quality={100}
                    priority
                    className="object-contain pointer-events-none"
                  />
                </div>
              </div>

              {/* Glassmorphic Course Finder Card (matching Image 2) */}
              <div className="relative rounded-2xl border border-white/15 bg-black/35 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-medium text-white">
                    Find a course in 10 seconds
                  </span>
                  <span className="text-xs text-white/40">No sign-up needed</span>
                </div>

                {/* Grade Selector */}
                <div className="mt-5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                    YOUR CHILD&apos;S GRADE
                  </label>
                  <div className="mt-2.5 flex items-center gap-2">
                    {[5, 6, 7, 8, 9, 10, 11].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setSelectedFinderGrade(g)}
                        className={cn(
                          "flex h-9 w-12 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200",
                          selectedFinderGrade === g
                            ? "bg-white text-[#0B0C0F] shadow-md scale-105"
                            : "border border-white/10 bg-white/[0.06] text-white/70 hover:border-white/30 hover:bg-white/[0.1] hover:text-white"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Track Selector */}
                <div className="mt-5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                    WHAT ARE THEY INTO?
                  </label>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {[
                      { label: "Robots", slug: "robots" },
                      { label: "Electronics", slug: "electronics" },
                      { label: "AI", slug: "ai" },
                      { label: "Games", slug: "games" },
                      { label: "Design", slug: "design" },
                    ].map((track) => (
                      <button
                        key={track.slug}
                        type="button"
                        onClick={() => setSelectedFinderTrack(track.slug)}
                        className={cn(
                          "rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200",
                          selectedFinderTrack === track.slug
                            ? "border border-[#FF6B2C] bg-[#FF6B2C]/20 text-[#FF6B2C] shadow-sm"
                            : "border border-white/10 bg-white/[0.05] text-white/70 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                        )}
                      >
                        {track.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Matched Course Row */}
                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-[15px] font-semibold text-white">
                        {matchedFinderCourse.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-white/50">
                        {matchedFinderCourse.grades} · {matchedFinderCourse.duration} · from{" "}
                        {matchedFinderCourse.priceFormatted} · next batch {matchedFinderCourse.nextBatch}
                      </p>
                    </div>
                    {/* Hover on button turns "See the course" into "Enrol now" */}
                    <button
                      type="button"
                      onClick={handleCourseClick}
                      className="group/btn relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#E05316] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(255,107,44,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="flex items-center gap-2 transition-all duration-200 group-hover/btn:hidden">
                        See the course
                        <ArrowRight className="size-3.5" />
                      </span>
                      <span className="hidden items-center gap-2 transition-all duration-200 group-hover/btn:flex">
                        Enrol now
                        <ArrowRight className="size-3.5" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
