"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Play, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

export function TeachingSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section
      id="proof"
      aria-labelledby="teaching-title"
      className="relative w-full overflow-hidden bg-[#0B0C0F] py-24 text-white"
    >
      {/* Topographic line background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('/images/topo-dark.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "800px",
        }}
      />

      <Container className="relative z-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <h2
            id="teaching-title"
            className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-white sm:text-[44px]"
          >
            See how we teach before you
            <br />
            decide.
          </h2>
          <p className="max-w-[420px] text-sm leading-[22px] text-white/60">
            We are running our first batches, so we show our work instead of asking you to
            trust a big number.
          </p>
        </div>

        {/* Upper Row: Video preview & Meet the tutors */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Video preview card (Cols 1-7) - Image 4 with grayscale to color + zoom on hover */}
          <div
            onClick={() => setIsVideoOpen(true)}
            className="group relative col-span-1 flex h-[380px] cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl transition hover:border-[#FF6B2C]/40 sm:h-[420px] lg:col-span-7"
          >
            <Image
              src="/images/teaching-classroom-color.jpg"
              alt="Students in classroom with tutor pointing at laptop screen"
              fill
              quality={100}
              className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#0B0C0F] via-black/40 to-black/20"
            />

            <div className="relative z-10 inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-black/50 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
              <span className="size-2 rounded-full bg-[#FF6B2C]" />
              3:12 · Robotics class
            </div>

            <div className="relative z-10 flex items-center gap-5">
              <div className="flex size-14 sm:size-16 items-center justify-center rounded-full bg-[#FF6B2C] text-white shadow-[0_4px_20px_rgba(255,107,44,0.5)] transition duration-300 group-hover:scale-110 shrink-0">
                <Play className="size-6 sm:size-7 fill-white translate-x-0.5" />
              </div>
              <div>
                <h3 className="text-[20px] sm:text-[22px] font-semibold text-white">Watch a real class</h3>
                <p className="mt-1 text-xs sm:text-sm text-white/70">
                  Wiring a rover&apos;s sensors with Mr Rohan, Grade 7
                </p>
              </div>
            </div>
          </div>

          {/* Meet the tutors (Cols 8-12) */}
          <div className="col-span-1 flex flex-col justify-between lg:col-span-5">
            <h3 className="text-[20px] font-semibold text-white">Meet the tutors</h3>

            <div className="mt-4 space-y-3.5">
              {[
                {
                  name: "Ananya Rao",
                  role: "B.Tech in computer science · leads the AI track",
                  img: "/images/tutors/ananya.jpg",
                },
                {
                  name: "Rohan Mehta",
                  role: "Ed-tech trainer · robotics and electronics, ran 30+ clubs",
                  img: "/images/tutors/rohan.jpg",
                },
                {
                  name: "Sana Qureshi",
                  role: "Maths and coding teacher · leads game design",
                  img: "/images/tutors/sana.jpg",
                },
              ].map((tutor) => (
                <div
                  key={tutor.name}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#16181D] p-4.5"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src={tutor.img}
                      alt={tutor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-white">{tutor.name}</h4>
                    <p className="mt-0.5 text-xs text-white/60">{tutor.role}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-white/50">
                      <span className="flex items-center gap-1 text-[#FF6B2C]">
                        <Check className="size-3" /> Background-checked
                      </span>
                      <span className="flex items-center gap-1 text-[#FF6B2C]">
                        <Check className="size-3" /> ThinkOva trained
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-white/50">
              Every tutor teaches a demo class before we hire them and is observed every week.
            </p>
          </div>
        </div>

        {/* Lower Row: Quotes & Pilot Batch Card */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Quote 1 (Cols 1-4) */}
          <div className="col-span-1 flex flex-col justify-between rounded-3xl border border-white/10 bg-[#16181D] p-8 lg:col-span-4">
            <p className="text-[15px] leading-[24px] text-white/80">
              “Meera showed us her homework helper at dinner, then explained why it got one
              answer wrong. That second part is what I wanted.”
            </p>
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <div className="relative size-10 overflow-hidden rounded-full">
                  <Image
                    src="/images/tutors/priya.jpg"
                    alt="Priya Sharma"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">Priya Sharma</h5>
                  <p className="text-xs text-white/50">
                    Parent of a Grade 6 student · Banyan Grove School
                  </p>
                </div>
              </div>
              <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase font-semibold text-white/60">
                Verified
              </span>
            </div>
          </div>

          {/* Quote 2 (Cols 5-8) */}
          <div className="col-span-1 flex flex-col justify-between rounded-3xl border border-white/10 bg-[#16181D] p-8 lg:col-span-4">
            <p className="text-[15px] leading-[24px] text-white/80">
              “They did not just talk about circuits — Kabir brought home an LED setup he wired
              himself and showed his grandfather.”
            </p>
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <div className="relative size-10 overflow-hidden rounded-full">
                  <Image
                    src="/images/tutors/vikram.jpg"
                    alt="Vikram Iyer"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">Vikram Iyer</h5>
                  <p className="text-xs text-white/50">
                    Parent of a Grade 8 student · Riverdale Academy
                  </p>
                </div>
              </div>
              <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase font-semibold text-white/60">
                Verified
              </span>
            </div>
          </div>

          {/* Pilot Batch Card (Cols 9-12) */}
          <div className="col-span-1 flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#FF6B2C] to-[#E05316] p-8 text-white shadow-2xl lg:col-span-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">
                PILOT BATCH · PUNE
              </span>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="font-display text-[44px] font-normal leading-none text-white">
                    36 of 38
                  </div>
                  <div className="mt-1 text-sm font-medium text-white/90">
                    finished every session
                  </div>
                </div>
                <div>
                  <div className="font-display text-[44px] font-normal leading-none text-white">
                    94%
                  </div>
                  <div className="mt-1 text-sm font-medium text-white/90">
                    completed demo day
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/20 pt-4 text-xs font-semibold text-white/90">
              2 partner schools · September 2024
            </div>
          </div>
        </div>

        {/* Partner Schools Rail */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Schools running ThinkOva
          </span>
          <div className="flex flex-wrap items-center gap-8 text-sm font-medium text-white/80">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full border border-white/20 text-xs font-bold text-white">
                BG
              </span>
              <span>Banyan Grove School</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md border border-white/20 text-xs font-bold text-white">
                RA
              </span>
              <span>Riverdale Academy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full border border-white/20 text-xs font-bold text-white">
                TK
              </span>
              <span>The Kalyani School</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md border border-white/20 text-xs font-bold text-white">
                MN
              </span>
              <span>Millennium National</span>
            </div>
          </div>
        </div>
      </Container>

      {/* Video Modal */}
      {isVideoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#16181D] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#FF6B2C]" />
                <span className="text-sm font-semibold text-white">
                  Wiring a rover&apos;s sensors with Mr Rohan, Grade 7
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close video"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={siteConfig.classVideoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"}
                title="ThinkOva Real Class Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
