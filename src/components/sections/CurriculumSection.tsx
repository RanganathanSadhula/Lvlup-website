"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { tracksData } from "@/data/tracks";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function CurriculumSection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const router = useRouter();
  const { user, activeStudent } = useAuth();

  const trackToCourseMap: Record<string, string> = {
    robotics: "robotics-starter",
    electronics: "electronics-starter",
    ai: "ai-study-helper",
    games: "game-design-starter",
    design: "design-starter",
  };

  const navigateToTrack = (trackId: string) => {
    // If the user is already logged in and selected the student -> take them directly to course details page explaining the overview of the course they clicked
    if (user && activeStudent) {
      const courseId = trackToCourseMap[trackId] || "robotics-starter";
      router.push(`/courses/${courseId}`);
    } else {
      router.push(`/explore?track=${trackId}`);
    }
  };

  const scrollToEnrol = () => {
    const el = document.getElementById("enrol");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="tracks" aria-labelledby="tracks-title" className="w-full bg-[#F4F3EE] py-20 text-[#0B0C0F]">
      <Container>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h2
              id="tracks-title"
              className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F] sm:text-[44px]"
            >
              Five tracks. One thing in
              <br className="hidden sm:block" /> common: it has to work.
            </h2>
          </div>
          <p className="max-w-[420px] text-sm leading-[22px] text-[#5A5F6B]">
            Every track has a junior course for younger grades and a senior course for older
            ones, so your child can come back and go deeper.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {[
            { label: "All tracks", filter: "all" },
            { label: "Robotics", filter: "robotics" },
            { label: "Electronics & IoT", filter: "electronics" },
            { label: "AI & Agents", filter: "ai" },
            { label: "Game Design", filter: "games" },
            { label: "Product & 3D Design", filter: "design" },
          ].map((tab) => (
            <button
              key={tab.filter}
              type="button"
              onClick={() => setActiveFilter(tab.filter)}
              className={cn(
                "rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200",
                activeFilter === tab.filter
                  ? "bg-[#0B0C0F] text-white shadow-sm"
                  : "border border-[#E3E1D9] bg-white text-[#5A5F6B] hover:border-[#D1CFC7] hover:text-[#0B0C0F]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* Left Featured Card: Robotics (matching Image 2 with larger rover brought down) */}
          <div
            className={cn(
              "group relative col-span-12 flex flex-col justify-end overflow-hidden rounded-3xl bg-[#F4F3EE] text-white shadow-xl transition-all duration-300 lg:col-span-6 min-h-[580px] lg:min-h-[620px]",
              activeFilter !== "all" && activeFilter !== "robotics" && "opacity-35 scale-[0.99]",
              activeFilter === "robotics" && "ring-2 ring-[#FF6B2C]"
            )}
          >
            {/* Prominent car image brought down with clean white top breathing room */}
            <div className="pointer-events-none absolute inset-x-0 top-6 sm:top-10 h-[380px] sm:h-[440px] flex items-center justify-center overflow-hidden">
              <div className="relative h-full w-[94%] sm:w-[96%] transition-all duration-700 ease-out group-hover:scale-105">
                <Image
                  src="/images/rover-color.png"
                  alt="Robotics autonomous rover kit"
                  fill
                  quality={100}
                  priority
                  className="object-contain object-bottom grayscale transition-all duration-700 ease-out group-hover:grayscale-0"
                />
              </div>
            </div>

            {/* Exact Black Shaded Mask overlay across the card */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 select-none"
            >
              <Image
                src="/images/tracks-rover-shade.png"
                alt=""
                fill
                quality={100}
                priority
                className="object-cover object-bottom"
              />
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-xl bg-[#FF6B2C] text-sm text-white shadow-sm">
                  🤖
                </span>
                <h3 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-white">Robotics</h3>
              </div>

              <p className="mt-2.5 text-xs sm:text-sm leading-[20px] sm:leading-[22px] text-white/70">
                Build a rover that sees a wall and steers around it. Kits stay at school, so
                there is nothing to buy.
              </p>

              {/* Course List Pills */}
              <div className="mt-5 space-y-2.5">
                <div
                  onClick={() => navigateToTrack("robotics")}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-[#FF6B2C]/50 hover:bg-white/[0.09]"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Robotics Starter: Build a Rover
                    </h4>
                    <p className="text-xs text-white/50">Grades 5–7 · 6 weeks</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#FF6B2C]">
                    <span>₹5,499</span>
                    <ArrowRight className="size-4" />
                  </div>
                </div>

                <div
                  onClick={() => navigateToTrack("robotics")}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-[#FF6B2C]/50 hover:bg-white/[0.09]"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Smart Robots with Sensors
                    </h4>
                    <p className="text-xs text-white/50">Grades 8–11 · 8 weeks</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#FF6B2C]">
                    <span>₹6,999</span>
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 2x2 Grid (Cols 7-12) */}
          <div className="col-span-12 grid gap-6 sm:grid-cols-2 lg:col-span-6">
            {/* Card 1: Electronics & IoT */}
            <div
              onClick={() => navigateToTrack("electronics")}
              className={cn(
                "group flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:border-[#FF6B2C]/40 hover:shadow-md",
                activeFilter !== "all" && activeFilter !== "electronics" && "opacity-35 scale-[0.99]",
                activeFilter === "electronics" ? "border-[#FF6B2C] ring-2 ring-[#FF6B2C]" : "border-[#E3E1D9]"
              )}
            >
              <div className="relative h-[190px] w-full overflow-hidden bg-[#F5F5F5] flex items-center justify-center p-3">
                <Image
                  src="/images/tracks-electronics.png"
                  alt="Electronics & IoT speaker and breadboard sensor project"
                  fill
                  quality={100}
                  className="object-contain p-2 grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-[#FF6B2C]/15 text-xs text-[#FF6B2C]">
                      ⚡
                    </span>
                    <h4 className="text-[17px] font-semibold text-[#0B0C0F]">
                      Electronics & IoT
                    </h4>
                  </div>
                  <p className="mt-2 text-xs leading-[18px] text-[#5A5F6B]">
                    An alarm that knows when the room gets stuffy.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#EAE8E1] pt-3 text-xs">
                  <span className="rounded-full bg-[#F4F3EE] px-2.5 py-1 font-medium text-[#5A5F6B]">
                    Grades 6–11
                  </span>
                  <span className="font-semibold text-[#0B0C0F] group-hover:text-[#FF6B2C]">
                    from ₹4,999 →
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: AI & Agents */}
            <div
              onClick={() => navigateToTrack("ai")}
              className={cn(
                "group flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:border-[#FF6B2C]/40 hover:shadow-md",
                activeFilter !== "all" && activeFilter !== "ai" && "opacity-35 scale-[0.99]",
                activeFilter === "ai" ? "border-[#FF6B2C] ring-2 ring-[#FF6B2C]" : "border-[#E3E1D9]"
              )}
            >
              <div className="relative h-[190px] w-full overflow-hidden bg-[#F5F5F5] flex items-center justify-center p-3">
                <Image
                  src="/images/tracks-ai.png"
                  alt="AI & Agents study helper tablet"
                  fill
                  quality={100}
                  className="object-contain p-2 grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-[#FF6B2C]/15 text-xs text-[#FF6B2C]">
                      ✨
                    </span>
                    <h4 className="text-[17px] font-semibold text-[#0B0C0F]">
                      AI & Agents
                    </h4>
                  </div>
                  <p className="mt-2 text-xs leading-[18px] text-[#5A5F6B]">
                    A study helper that quizzes you and explains mistakes.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#EAE8E1] pt-3 text-xs">
                  <span className="rounded-full bg-[#F4F3EE] px-2.5 py-1 font-medium text-[#5A5F6B]">
                    Grades 5–11
                  </span>
                  <span className="font-semibold text-[#0B0C0F] group-hover:text-[#FF6B2C]">
                    from ₹4,499 →
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Game Design */}
            <div
              onClick={() => navigateToTrack("games")}
              className={cn(
                "group flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:border-[#FF6B2C]/40 hover:shadow-md",
                activeFilter !== "all" && activeFilter !== "games" && "opacity-35 scale-[0.99]",
                activeFilter === "games" ? "border-[#FF6B2C] ring-2 ring-[#FF6B2C]" : "border-[#E3E1D9]"
              )}
            >
              <div className="relative h-[190px] w-full overflow-hidden bg-[#F5F5F5] flex items-center justify-center p-3">
                <Image
                  src="/images/tracks-games.png"
                  alt="Game design handheld console and level design"
                  fill
                  quality={100}
                  className="object-contain p-2 grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-[#FF6B2C]/15 text-xs text-[#FF6B2C]">
                      🎮
                    </span>
                    <h4 className="text-[17px] font-semibold text-[#0B0C0F]">
                      Game Design
                    </h4>
                  </div>
                  <p className="mt-2 text-xs leading-[18px] text-[#5A5F6B]">
                    A level your friends can actually play.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#EAE8E1] pt-3 text-xs">
                  <span className="rounded-full bg-[#F4F3EE] px-2.5 py-1 font-medium text-[#5A5F6B]">
                    Grades 5–11
                  </span>
                  <span className="font-semibold text-[#0B0C0F] group-hover:text-[#FF6B2C]">
                    from ₹3,999 →
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Product & 3D Design */}
            <div
              onClick={() => navigateToTrack("design")}
              className={cn(
                "group flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:border-[#FF6B2C]/40 hover:shadow-md",
                activeFilter !== "all" && activeFilter !== "design" && "opacity-35 scale-[0.99]",
                activeFilter === "design" ? "border-[#FF6B2C] ring-2 ring-[#FF6B2C]" : "border-[#E3E1D9]"
              )}
            >
              <div className="relative h-[190px] w-full overflow-hidden bg-[#F5F5F5] flex items-center justify-center p-3">
                <Image
                  src="/images/tracks-product.png"
                  alt="Product design articulated desk lamp prototype"
                  fill
                  quality={100}
                  className="object-contain p-2 grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-[#FF6B2C]/15 text-xs text-[#FF6B2C]">
                      📐
                    </span>
                    <h4 className="text-[17px] font-semibold text-[#0B0C0F]">
                      Product & 3D Design
                    </h4>
                  </div>
                  <p className="mt-2 text-xs leading-[18px] text-[#5A5F6B]">
                    A lamp, sketched, modelled and prototyped.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#EAE8E1] pt-3 text-xs">
                  <span className="rounded-full bg-[#F4F3EE] px-2.5 py-1 font-medium text-[#5A5F6B]">
                    Grades 6–11
                  </span>
                  <span className="font-semibold text-[#0B0C0F] group-hover:text-[#FF6B2C]">
                    from ₹3,999 →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
