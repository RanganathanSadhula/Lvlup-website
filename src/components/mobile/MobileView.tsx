"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Play,
  ArrowRight,
  Bot,
  BookOpen,
  ShieldCheck,
  UsersRound,
  X,
  Lock,
  LaptopMinimal,
  Award,
  Landmark,
  Footprints,
  MonitorPlay,
  FolderOpen,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
  Plus,
  Mic,
  ArrowUp,
  Folder,
} from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { tutors } from "@/data/tutors";
import { parentFaq, schoolFaq } from "@/data/faq";
import { siteConfig, legalLinks } from "@/data/site";
import {
  facts,
  solutionCards,
  gradeCards,
  goodFit,
  notFit,
  safetyCommitments,
  joiningSteps,
  schoolBenefits,
} from "@/data/content";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { EnrolSection } from "@/components/sections/EnrolSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const rhythm = [
  { label: "Ideas", min: 10 },
  { label: "Demo", min: 15 },
  { label: "Practice", min: 20 },
  { label: "Building", min: 35 },
  { label: "Sharing", min: 10 },
] as const;

const problemCards = [
  {
    image: "/images/problem-copy.png",
    alt: "Chatbot falsely answering capital of Australia as Sydney, copied into homework",
    title: "They copy answers they can’t check",
    body: "A chatbot sounds sure even when it is wrong.",
  },
  {
    image: "/images/problem-share.png",
    alt: "Student sharing private name, school and phone number into stranger app",
    title: "They share more than they should",
    body: "Names, school and photos go into tools without a second thought.",
  },
  {
    image: "/images/problem-magic.png",
    alt: "AI assistant responding that it learned patterns from examples",
    title: "They see AI as magic",
    body: "Not as a tool they can question, shape and build with.",
  },
];

const solutionItems = [
  {
    title: "Understand it",
    body: "How AI learns from examples, and why its answers need checking.",
    image: "/images/solution-understand-color.png",
    alt: "A smiling boy holding a stack of books",
  },
  {
    title: "Use it safely",
    body: "Private information stays private. Tools are approved and managed by us.",
    image: "/images/solution-safely-color.png",
    alt: "Two children smiling at a laptop together",
  },
  {
    title: "Build with it",
    body: "Each child designs, builds and tests an AI helper for a real problem.",
    image: "/images/solution-build-color.png",
    alt: "A girl raising her hand next to classmates with laptops",
  },
];

const testimonials = [
  {
    quote: "“Meera showed us her homework helper, then explained why it got one answer wrong. That second part is what I wanted.”",
    name: "Priya Sharma",
    role: "Parent, Grade 6",
    image: "/images/tutors/priya.jpg",
  },
  {
    quote: "“He used to accept whatever AI gave. Now he questions every single result before using it in school.”",
    name: "Vikram Joshi",
    role: "Parent, Grade 7",
    image: "/images/tutors/rohan.jpg",
  },
];

export function MobileView() {
  const [openLevel, setOpenLevel] = useState<number | null>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqTab, setFaqTab] = useState<"parents" | "schools">("parents");
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const problemCarouselRef = useRef<HTMLDivElement>(null);

  const handleProblemScroll = () => {
    const el = problemCarouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.offsetWidth * 0.82;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveProblemIndex(Math.min(Math.max(index, 0), problemCards.length - 1));
  };

  const scrollToProblem = (index: number) => {
    const el = problemCarouselRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.82 + 16;
    el.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    setActiveProblemIndex(index);
  };

  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const testimonialCarouselRef = useRef<HTMLDivElement>(null);

  const handleTestimonialScroll = () => {
    const el = testimonialCarouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.offsetWidth * 0.82;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveTestimonialIndex(Math.min(Math.max(index, 0), testimonials.length - 1));
  };

  const scrollToTestimonial = (index: number) => {
    const el = testimonialCarouselRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth * 0.82 + 16;
    el.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    setActiveTestimonialIndex(index);
  };

  const [heroColored, setHeroColored] = useState(false);
  const [coloredSolutions, setColoredSolutions] = useState<Record<number, boolean>>({});
  const [selectedPricingPlan, setSelectedPricingPlan] = useState<"full" | "parts">("full");

  // Mobile Enrolment Form State
  const [isEnrolFormOpen, setIsEnrolFormOpen] = useState(false);
  const [enrolChildName, setEnrolChildName] = useState("");
  const [enrolGrade, setEnrolGrade] = useState("Grade 6");
  const [enrolSection, setEnrolSection] = useState("B");
  const [enrolSchoolCode, setEnrolSchoolCode] = useState("");
  const [enrolParentName, setEnrolParentName] = useState("");
  const [enrolRelationship, setEnrolRelationship] = useState("Mother");
  const [enrolMobile, setEnrolMobile] = useState("");
  const [enrolEmail, setEnrolEmail] = useState("");
  const [enrolConsent, setEnrolConsent] = useState(false);
  const [enrolSubmitting, setEnrolSubmitting] = useState(false);
  const [enrolSubmitted, setEnrolSubmitted] = useState(false);

  function handleMobileEnrolSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnrolSubmitting(true);
    setTimeout(() => {
      setEnrolSubmitting(false);
      setEnrolSubmitted(true);
    }, 600);
  }

  // School callback form state
  const [schoolForm, setSchoolForm] = useState({
    schoolName: "",
    name: "",
    role: "Principal",
    city: "",
    phone: "",
  });
  const [schoolSubmitting, setSchoolSubmitting] = useState(false);
  const [schoolSubmitted, setSchoolSubmitted] = useState(false);

  async function handleSchoolSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSchoolSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSchoolSubmitting(false);
    setSchoolSubmitted(true);
  }

  const faqItems = faqTab === "parents" ? parentFaq : schoolFaq;

  return (
    <div className="w-full bg-[#0b0c0f] text-white font-sans antialiased overflow-x-hidden pb-[80px]">
      {/* ── 1. HERO SECTION (Exact mockup design) ── */}
      <section
        id="course"
        aria-label="Hero"
        className="relative bg-[#0b0c0f] overflow-hidden text-white"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            backgroundImage: 'url("/images/grain-dark.png")',
            backgroundRepeat: "repeat",
            opacity: 0.52,
          }}
        />

        {/* Top Student Photo with Touch/Cursor Dark-to-Colour Transition */}
        <div
          className="group/hero relative h-[380px] sm:h-[430px] w-full overflow-hidden cursor-pointer select-none"
          onMouseEnter={() => setHeroColored(true)}
          onMouseLeave={() => setHeroColored(false)}
          onTouchStart={() => setHeroColored(true)}
          onTouchEnd={() => setHeroColored(false)}
          onClick={() => setHeroColored((v) => !v)}
        >
          <Image
            src="/images/hero-student-hd.png"
            alt="A student with headphones using a laptop"
            fill
            priority
            unoptimized
            quality={100}
            className={cn(
              "object-cover object-[center_12%] transition-all duration-700 ease-out transform-gpu",
              "group-hover/hero:grayscale-0 group-hover/hero:scale-[1.03] group-hover/hero:contrast-100 group-hover/hero:brightness-100",
              "group-active/hero:grayscale-0 group-active/hero:scale-[1.03] group-active/hero:contrast-100 group-active/hero:brightness-100",
              heroColored
                ? "grayscale-0 scale-[1.03] contrast-100 brightness-100"
                : "grayscale scale-100 contrast-[1.15] brightness-95"
            )}
          />

          {/* Floating Tilted Revise Buddy card on the left - matches Figma screenshot */}
          <div
            className="absolute left-4 top-20 sm:top-24 z-10 w-[195px] -rotate-3 transform rounded-2xl bg-white p-3.5 shadow-2xl border border-black/10 transition-transform duration-300 hover:rotate-0 active:scale-95 cursor-pointer text-ink"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#FEF0EA]">
                <Bot className="size-3.5 text-brand" />
              </div>
              <div className="min-w-0">
                <h4 className="font-display text-[11px] font-normal leading-tight text-ink">Revise Buddy</h4>
                <p className="text-[9px] text-ink/50">by Asha, Grade 6</p>
              </div>
            </div>
            <p className="mt-2 text-[9.5px] leading-tight text-ink/70">
              Quizzes her on a science chapter and explains what she got wrong.
            </p>
            <div className="mt-2 space-y-1.5 rounded-lg bg-[#f4f5f7] p-2 text-[8.5px]">
              <div className="flex justify-end">
                <span className="rounded bg-[#dce8fe] px-2 py-0.5 font-medium text-ink/90">
                  Quiz me on chapter 7
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="mt-0.5 size-2 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-400" />
                <span className="leading-tight text-ink/80">
                  Question 1 of 5: which gas do plants take in to make food?
                </span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[8.5px]">
              <span className="flex items-center gap-1 rounded-full border border-green-500 px-1.5 py-0.5 font-bold text-green-600">
                <Check className="size-2" strokeWidth={3} />
                2/2 tests passed
              </span>
              <span className="text-ink/40 font-medium">Level 6 project</span>
            </div>
          </div>

          {/* Smooth bottom gradient overlay fading to solid dark background */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0b0c0f] via-[#0b0c0f]/80 to-transparent z-[3]"
          />
        </div>

        {/* Hero Content below photo */}
        <ScrollReveal>
          <div
            className="relative z-10 px-5 pb-8 -mt-6 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="font-display text-[44px] sm:text-[50px] font-normal leading-[1.0] tracking-[-0.04em] text-white">
              Don’t just use AI.
              <br />
              Build with it.
            </h1>

            <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.55] text-[#9ca3af] max-w-[360px]">
              An eight-week course with a trained tutor at your child’s school. At level 8, your child shows you an AI helper they built.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="#enrol"
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff5520] to-[#ff6b2c] font-bold text-[15px] text-white shadow-[0_4px_25px_rgba(255,85,32,0.35)] transition-all duration-200 transform-gpu hover:brightness-110 active:scale-[0.97]"
              >
                <span>Enrol with your school code</span>
                <ArrowRight className="size-4 stroke-[2.5]" />
              </a>

              <a
                href={siteConfig.whatsappUrl}
                className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#16171d] font-semibold text-[15px] text-white transition-all duration-200 transform-gpu hover:bg-[#1f2029] active:scale-[0.97]"
              >
                <span>WhatsApp us</span>
                <ArrowRight className="size-4 stroke-[2.5]" />
              </a>
            </div>

            {/* Meta row: Next batch | Class */}
            <div className="mt-7 grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 pt-5">
              <div className="pr-4">
                <span className="text-xs text-white/50 block">Next batch</span>
                <span className="mt-1 block text-[17px] font-bold text-white tracking-tight">[Month] 2027</span>
              </div>
              <div className="pl-5">
                <span className="text-xs text-white/50 block">Class</span>
                <span className="mt-1 block text-[17px] font-bold text-white tracking-tight">90 min, once a week</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── 2. COURSE FACTS (Exact 2x2 rounded cards as in Figma media_1793118680096.png) ── */}
      <section aria-label="Course Facts" className="bg-[#0b0c0f] px-5 py-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {facts.map((fact, idx) => (
            <ScrollReveal key={fact.label} delay={idx * 75}>
              <div className="rounded-[20px] bg-[#121318] border border-white/[0.08] p-5 sm:p-6 shadow-sm transition-transform duration-200 active:scale-[0.98]">
                <div className="font-display text-[26px] sm:text-[30px] font-normal leading-tight text-white tracking-tight">
                  {fact.value}
                </div>
                <div className="mt-2 font-sans text-[13px] sm:text-[14px] text-[#8e9099] leading-snug">
                  {fact.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── 3. PROBLEM SECTION (Exact Figma Carousel media_1793119288707.png) ── */}
      <section aria-labelledby="mobile-problem-title" className="bg-[#f3f1ec] text-ink px-5 pt-12 pb-10">
        <ScrollReveal>
          <h2
            id="mobile-problem-title"
            className="font-display text-[32px] sm:text-[36px] font-normal leading-[1.12] tracking-[-0.03em] text-[#0e0f12]"
          >
            Kids already use AI. Few are shown how it works.
          </h2>
          <p className="mt-3 text-[16px] leading-[1.5] text-[#5f6068]">
            School rarely has time for how AI decides, when it is wrong and what to keep private.
          </p>
        </ScrollReveal>

        {/* Horizontal Swipeable Cards Carousel */}
        <ScrollReveal delay={120}>
          <div
            ref={problemCarouselRef}
            onScroll={handleProblemScroll}
            className="mt-7 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 -mx-5 px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {problemCards.map((c) => (
              <div
                key={c.title}
                className="w-[82%] sm:w-[320px] shrink-0 snap-center rounded-[24px] border border-black/[0.08] bg-white p-5 shadow-sm"
              >
                <div className="relative aspect-[652/380] w-full overflow-hidden rounded-[18px] border border-black/[0.06] bg-[#fafafa]">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    unoptimized
                    quality={100}
                    className="object-contain p-2"
                  />
                </div>
                <h3 className="mt-5 font-display text-[20px] sm:text-[22px] font-normal leading-snug tracking-tight text-[#0e0f12]">
                  {c.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#5f6068]">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Pagination Dots (Active is orange pill as in Figma) */}
        <div className="mt-5 flex items-center gap-1.5">
          {problemCards.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => scrollToProblem(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                activeProblemIndex === idx
                  ? "w-6 bg-[#ff5520]"
                  : "size-2 bg-[#d5d7de] hover:bg-[#b0b3bd]"
              )}
            />
          ))}
        </div>
      </section>

      {/* ── 3RD SCREEN: SOLUTION SECTION (Exact Figma media_1793119642468.png) ── */}
      <section
        aria-labelledby="mobile-solution-title"
        className="relative bg-[#0b0c0f] text-white px-5 py-12 overflow-hidden border-t border-white/10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            backgroundImage: 'url("/images/grain-dark.png")',
            backgroundRepeat: "repeat",
            opacity: 0.52,
          }}
        />

        <div className="relative z-10">
          <ScrollReveal>
            <h2
              id="mobile-solution-title"
              className="font-display text-[32px] sm:text-[38px] font-normal leading-[1.08] tracking-[-0.035em] text-white max-w-[360px]"
            >
              LvlUp turns AI users into thoughtful builders.
            </h2>
          </ScrollReveal>

          <div className="mt-8 space-y-3.5">
            {solutionItems.map((item, idx) => {
              const isColored = !!coloredSolutions[idx];
              return (
                <ScrollReveal key={item.title} delay={idx * 100}>
                  <div
                    className="group/card flex items-center gap-4 sm:gap-5 rounded-[24px] border border-white/[0.08] bg-[#13141a] p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-white/20 active:scale-[0.98] cursor-pointer"
                    onMouseEnter={() => setColoredSolutions((prev) => ({ ...prev, [idx]: true }))}
                    onMouseLeave={() => setColoredSolutions((prev) => ({ ...prev, [idx]: false }))}
                    onTouchStart={() => setColoredSolutions((prev) => ({ ...prev, [idx]: true }))}
                    onTouchEnd={() => setColoredSolutions((prev) => ({ ...prev, [idx]: false }))}
                    onClick={() => setColoredSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                  >
                    {/* Square thumbnail with smooth dark-to-colour transition */}
                    <div className="relative size-[94px] sm:size-[104px] shrink-0 overflow-hidden rounded-[18px] bg-[#1a1b22]">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        unoptimized
                        quality={100}
                        className={cn(
                          "object-cover transition-all duration-700 ease-out transform-gpu",
                          "group-hover/card:grayscale-0 group-hover/card:scale-105 group-hover/card:contrast-100 group-hover/card:brightness-100",
                          "group-active/card:grayscale-0 group-active/card:scale-105 group-active/card:contrast-100 group-active/card:brightness-100",
                          isColored
                            ? "grayscale-0 scale-105 contrast-100 brightness-100"
                            : "grayscale scale-100 contrast-[1.1] brightness-90"
                        )}
                      />
                    </div>

                    {/* Text on right */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[18px] sm:text-[20px] font-normal text-white tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] sm:text-[14px] leading-relaxed text-[#9ca3af]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4TH SCREEN: CURRICULUM SECTION (Levels 1–8) (Exact Figma media_1793119945369.png) ── */}
      <section id="levels" aria-labelledby="mobile-levels-title" className="bg-[#f3f1ec] text-ink px-5 py-12">
        <ScrollReveal>
          <h2 id="mobile-levels-title" className="font-display text-[32px] sm:text-[36px] font-normal leading-tight tracking-[-0.03em] text-[#0e0f12]">
            Eight levels. One a week.
          </h2>
          <p className="mt-2 text-[15px] sm:text-[16px] text-[#5f6068] leading-relaxed">
            Each 90-minute class ends with something your child made. Tap a level to see inside.
          </p>
        </ScrollReveal>

        <ul className="mt-7 space-y-3">
          {curriculum.map((l, idx) => {
            const isOpen = openLevel === l.level;
            return (
              <ScrollReveal key={l.level} delay={idx * 30}>
                <li
                  className={cn(
                    "overflow-hidden rounded-[22px] bg-white transition-all duration-200 shadow-sm",
                    isOpen
                      ? "border-2 border-[#ff5520] shadow-md"
                      : "border border-black/[0.08]"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenLevel(isOpen ? null : l.level)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={cn(
                          "flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full font-bold text-sm sm:text-base text-white transition-colors",
                          isOpen ? "bg-[#ff5520]" : "bg-[#0e0f12]"
                        )}
                      >
                        {l.level}
                      </span>
                      <div className="min-w-0">
                        <span className="block font-normal text-[15px] sm:text-[16px] text-[#0e0f12] leading-tight truncate">
                          {l.title}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-[#5f6068]">
                          Week {l.week}
                        </span>
                      </div>
                    </div>

                    <span className="ml-3 flex size-6 shrink-0 items-center justify-center text-[#5f6068]">
                      {isOpen ? (
                        <ChevronUp className="size-5 stroke-[2.2]" />
                      ) : (
                        <ChevronDown className="size-5 stroke-[2.2]" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0">
                      {/* Summary */}
                      <p className="text-[14px] leading-relaxed text-[#5f6068]">
                        {l.summary}
                      </p>

                      {/* Topic Badges with orange numbered prefix */}
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {l.topics.map((t, idx) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full bg-[#f4f5f7] px-3 py-1 text-[12px] font-medium text-[#2c2d33]"
                          >
                            <span className="mr-1.5 font-bold text-[#ff5520]">
                              {idx + 1}
                            </span>
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Peach Box: Your child makes & Parents see */}
                      <div className="mt-4 rounded-[16px] bg-[#ffece2] p-4 text-left">
                        <div>
                          <span className="block text-[12px] text-[#8e8f96] font-normal">
                            Your child makes
                          </span>
                          <span className="mt-0.5 block text-[14px] font-normal text-[#0e0f12] leading-snug">
                            {l.makes}
                          </span>
                        </div>
                        {l.parentsSee && (
                          <div className="mt-3">
                            <span className="block text-[12px] text-[#8e8f96] font-normal">
                              Parents see
                            </span>
                            <span className="mt-0.5 block text-[14px] font-normal text-[#0e0f12] leading-snug">
                              {l.parentsSee}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              </ScrollReveal>
            );
          })}
        </ul>

        {/* Download Curriculum PDF Button */}
        <ScrollReveal delay={100}>
          <a
            href="/downloads/LvlUp-Eight-Week-Curriculum.pdf"
            download="LvlUp Eight-Week Curriculum.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[14px] border border-[#0e0f12] bg-white font-bold text-sm text-[#0e0f12] shadow-sm transition hover:bg-black/5 active:scale-[0.98]"
          >
            <Download className="size-4 stroke-[2.2]" />
            <span>Download full curriculum (PDF)</span>
          </a>
        </ScrollReveal>
      </section>

      {/* ── 5. OUTCOMES SECTION (Exact Figma media_1793120176958.png) ── */}
      <section className="bg-[#0b0c0f] text-white px-5 py-12 border-t border-white/10">
        <ScrollReveal>
          <h2 className="font-display text-[32px] sm:text-[38px] font-normal leading-[1.08] tracking-[-0.035em] text-white">
            What your child walks away with
          </h2>
        </ScrollReveal>

        {/* Featured Card: A working AI helper */}
        <ScrollReveal delay={100}>
          <div className="mt-7 rounded-[28px] border border-white/[0.08] bg-[#13141a] p-5 sm:p-6 shadow-sm">
            <h3 className="font-display text-[22px] sm:text-[24px] font-normal text-white tracking-tight leading-snug">
              A working AI helper
            </h3>
            <p className="mt-2 text-[14px] text-[#9ca3af] leading-relaxed">
              Built from an approved template, tested on two tasks, shown live at demo day.
            </p>

            {/* Interactive Revise Buddy Mockup matching Figma exactly */}
            <div className="mt-5 rounded-[22px] bg-white p-4 sm:p-5 text-ink shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                  <span className="font-normal text-[16px] text-ink">Revise Buddy</span>
                </div>
                <span className="rounded-full bg-[#f4f5f7] px-3 py-1 text-[12px] font-medium text-[#5f6068]">
                  By Asha, level 6
                </span>
              </div>

              <div className="mt-4 rounded-[14px] bg-[#eef3f9] p-3 text-[14px] text-[#1c1d22]">
                Quiz me on chapter 7, photosynthesis.
              </div>

              <div className="mt-4 flex items-start gap-2.5">
                <span className="mt-1 size-3.5 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                <p className="text-[14px] leading-snug text-[#1c1d22]">
                  Question 1 of 5: which gas do plants take in to make food?
                </p>
              </div>

              {/* Chat Input Bar */}
              <div className="mt-5 flex items-center justify-between rounded-full bg-[#f0f4f9] px-4 py-2.5">
                <div className="flex items-center gap-2 text-[#6b7280]">
                  <Plus className="size-4 stroke-[2.5]" />
                  <span className="text-[13px]">Ask Revise Buddy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="size-4 text-[#4b5563]" />
                  <span className="flex size-7 items-center justify-center rounded-full bg-white text-[#1c1d22] shadow-sm">
                    <ArrowUp className="size-4 stroke-[2.5]" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Horizontal Swipeable Cards Row (matching media_1793120176958.png) */}
        <ScrollReveal delay={180}>
          <div className="mt-4 flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2 pt-1 -mx-5 px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Card 1: A digital portfolio */}
            <div className="w-[72%] sm:w-[260px] shrink-0 snap-start rounded-[24px] border border-white/[0.08] bg-[#13141a] p-5 shadow-sm">
              <span className="inline-flex size-10 items-center justify-center rounded-[14px] bg-[#1d1f27] text-[#ff6b2c]">
                <Folder className="size-5" />
              </span>
              <h4 className="mt-3.5 font-display text-[17px] font-normal text-white leading-tight">
                A digital portfolio
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-[#8e9099]">
                Eight pieces of work in one place.
              </p>
            </div>

            {/* Card 2: A head start on CBSE topics */}
            <div className="w-[72%] sm:w-[260px] shrink-0 snap-start rounded-[24px] border border-white/[0.08] bg-[#13141a] p-5 shadow-sm">
              <span className="inline-flex size-10 items-center justify-center rounded-[14px] bg-[#1d1f27] text-[#ff6b2c]">
                <BookOpen className="size-5" />
              </span>
              <h4 className="mt-3.5 font-display text-[17px] font-normal text-white leading-tight">
                A head start on CBSE topics
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-[#8e9099]">
                Practise the new Classes 6 to 8 ideas by building.
              </p>
            </div>

            {/* Card 3: Habits that last */}
            <div className="w-[72%] sm:w-[260px] shrink-0 snap-start rounded-[24px] border border-white/[0.08] bg-[#13141a] p-5 shadow-sm">
              <span className="inline-flex size-10 items-center justify-center rounded-[14px] bg-[#1d1f27] text-[#ff6b2c]">
                <ShieldCheck className="size-5" />
              </span>
              <h4 className="mt-3.5 font-display text-[17px] font-normal text-white leading-tight">
                Habits that last
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-[#8e9099]">
                Check answers before trusting, keep private details private.
              </p>
            </div>

            {/* Card 4: Confidence to explain */}
            <div className="w-[72%] sm:w-[260px] shrink-0 snap-start rounded-[24px] border border-white/[0.08] bg-[#13141a] p-5 shadow-sm">
              <span className="inline-flex size-10 items-center justify-center rounded-[14px] bg-[#1d1f27] text-[#ff6b2c]">
                <Award className="size-5" />
              </span>
              <h4 className="mt-3.5 font-display text-[17px] font-normal text-white leading-tight">
                Confidence to explain it
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-[#8e9099]">
                A two-minute talk on what they built and why.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── 6. AUDIENCE SECTION (Exact Figma media_1793120478656.png) ── */}
      <section className="bg-[#f3f1ec] text-ink px-5 py-12">
        <ScrollReveal>
          <h2 className="font-display text-[32px] sm:text-[38px] font-normal leading-tight tracking-[-0.03em] text-[#0e0f12]">
            Is LvlUp right for your child?
          </h2>
        </ScrollReveal>

        {/* 4 Grade Cards in a single row (4 columns) */}
        <ScrollReveal delay={100}>
          <div className="mt-6 grid grid-cols-4 gap-2.5 sm:gap-3">
            {/* Grade 5 */}
            <div className="rounded-[18px] sm:rounded-[20px] border border-black/[0.08] bg-white p-3 sm:p-3.5 shadow-sm flex flex-col justify-between">
              <div className="flex items-baseline">
                <span className="font-display text-[26px] sm:text-[32px] font-normal leading-none text-[#3b5bfd]">5</span>
                <span className="text-[10px] sm:text-[11px] font-normal text-[#3b5bfd] ml-1">Grade</span>
              </div>
              <p className="mt-2 text-[12px] sm:text-[13px] font-normal text-[#0e0f12] leading-tight">Guided</p>
            </div>

            {/* Grade 6 */}
            <div className="rounded-[18px] sm:rounded-[20px] border border-black/[0.08] bg-white p-3 sm:p-3.5 shadow-sm flex flex-col justify-between">
              <div className="flex items-baseline">
                <span className="font-display text-[26px] sm:text-[32px] font-normal leading-none text-[#109e58]">6</span>
                <span className="text-[10px] sm:text-[11px] font-normal text-[#109e58] ml-1">Grade</span>
              </div>
              <p className="mt-2 text-[12px] sm:text-[13px] font-normal text-[#0e0f12] leading-tight">More choice</p>
            </div>

            {/* Grade 7 */}
            <div className="rounded-[18px] sm:rounded-[20px] border border-black/[0.08] bg-white p-3 sm:p-3.5 shadow-sm flex flex-col justify-between">
              <div className="flex items-baseline">
                <span className="font-display text-[26px] sm:text-[32px] font-normal leading-none text-[#7048e8]">7</span>
                <span className="text-[10px] sm:text-[11px] font-normal text-[#7048e8] ml-1">Grade</span>
              </div>
              <p className="mt-2 text-[12px] sm:text-[13px] font-normal text-[#0e0f12] leading-tight">More logic</p>
            </div>

            {/* Grade 8 (Orange card) */}
            <div className="rounded-[18px] sm:rounded-[20px] border border-transparent bg-[#ff5520] p-3 sm:p-3.5 shadow-sm flex flex-col justify-between text-black">
              <div className="flex items-baseline">
                <span className="font-display text-[26px] sm:text-[32px] font-normal leading-none text-black">8</span>
                <span className="text-[10px] sm:text-[11px] font-normal text-black ml-1">Grade</span>
              </div>
              <p className="mt-2 text-[12px] sm:text-[13px] font-normal text-black leading-tight">Independent</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Good fit box (Mint green) */}
        <ScrollReveal delay={150}>
          <div className="mt-6 rounded-[24px] border border-[#d1edd8] bg-[#eef8f1] p-5 sm:p-6 shadow-sm">
            <h3 className="font-display text-[18px] sm:text-[20px] font-normal text-[#0e0f12]">
              A good fit if your child...
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                "Is in Grade 5, 6, 7 or 8",
                "Is curious how apps and chatbots work",
                "Likes making things more than memorising",
                "Has never coded. No coding is needed",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#109e58] text-white">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                  <span className="text-[14px] sm:text-[15px] font-normal text-[#2c2d33] leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* Not a fit box (Soft pink/red) */}
        <ScrollReveal delay={200}>
          <div className="mt-4 rounded-[24px] border border-[#fbdcdb] bg-[#fdf2f2] p-5 sm:p-6 shadow-sm">
            <h3 className="font-display text-[18px] sm:text-[20px] font-normal text-[#0e0f12]">
              Not the right fit if you want...
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                "Exam coaching or higher marks",
                "One-to-one classes at home",
                "A coding certificate for a job",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e04f4f] text-white">
                    <X className="size-3 stroke-[3]" />
                  </span>
                  <span className="text-[14px] sm:text-[15px] font-normal text-[#2c2d33] leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        {/* WhatsApp prompt */}
        <ScrollReveal delay={250}>
          <p className="mt-6 text-center text-[14px] sm:text-[15px] text-[#0e0f12] font-normal leading-relaxed">
            Not sure?{" "}
            <a
              href={siteConfig.whatsappUrl}
              className="font-normal underline underline-offset-2 hover:text-[#ff5520]"
            >
              Ask us on WhatsApp. A person replies.
            </a>
          </p>
        </ScrollReveal>
      </section>

      {/* ── 7. TEACHING & TUTORS (Exact Figma media_1793120511765.png) ── */}
      <section id="safety" aria-labelledby="mobile-teaching-title" className="bg-[#0b0c0f] text-white px-5 py-12 border-t border-white/10">
        <ScrollReveal>
          <h2 id="mobile-teaching-title" className="font-display text-[32px] sm:text-[38px] font-normal leading-[1.08] tracking-[-0.035em] text-white">
            See how we teach before you decide.
          </h2>
        </ScrollReveal>

        {/* Real Class Video Preview Card */}
        <ScrollReveal delay={100}>
          <div className="relative mt-6 overflow-hidden rounded-[24px] aspect-[16/10] w-full border border-white/10 shadow-lg group/video cursor-pointer">
            <Image
              src="/images/proof-class.png"
              alt="Students collaborating with a tutor in class"
              fill
              quality={95}
              className="object-cover transition-transform duration-500 group-hover/video:scale-105"
            />

            {/* Top-left badge */}
            <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm border border-white/10">
              <span className="size-1.5 rounded-full bg-[#ff5520]" />
              <span>3:12 · Level 4 class</span>
            </div>

            {/* Bottom play bar overlay */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3.5 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 sm:p-5 pt-8">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#ff5520] text-white shadow-lg transition-transform group-hover/video:scale-110 active:scale-95">
                <Play className="size-5 fill-current ml-0.5" />
              </span>
              <div>
                <p className="font-normal text-[15px] sm:text-[16px] text-white leading-tight">
                  Watch a real class
                </p>
                <p className="mt-0.5 text-[11px] sm:text-[12px] text-white/70">
                  Building interactive flows with Ms Ananya, Grade 6
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Meet the tutors */}
        <ScrollReveal delay={150}>
          <h3 className="mt-8 font-display text-[22px] font-normal text-white tracking-tight">
            Meet the tutors
          </h3>

          {/* Horizontal swipeable tutor cards */}
          <div className="mt-4 flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2 pt-1 -mx-5 px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Ananya Rao */}
            <div className="w-[72%] sm:w-[260px] shrink-0 snap-start rounded-[24px] border border-white/[0.08] bg-[#13141a] p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/tutors/ananya.jpg"
                  alt="Portrait of Ananya Rao"
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h4 className="font-normal text-[16px] text-white leading-tight truncate">Ananya Rao</h4>
                  <p className="mt-1 text-[12px] text-[#9ca3af] truncate">B.Tech, 4 years teaching</p>
                </div>
              </div>
              <div className="mt-3.5 flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e2028] px-2.5 py-1 text-[11px] text-white font-medium w-fit">
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-[#ff5520] text-white text-[8px] font-bold">✓</span>
                  Background-checked
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e2028] px-2.5 py-1 text-[11px] text-white font-medium w-fit">
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-[#ff5520] text-white text-[8px] font-bold">✓</span>
                  LvlUp trained
                </span>
              </div>
            </div>

            {/* Rohan Mehta */}
            <div className="w-[72%] sm:w-[260px] shrink-0 snap-start rounded-[24px] border border-white/[0.08] bg-[#13141a] p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/tutors/rohan.jpg"
                  alt="Portrait of Rohan Mehta"
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h4 className="font-normal text-[16px] text-white leading-tight truncate">Rohan Mehta</h4>
                  <p className="mt-1 text-[12px] text-[#9ca3af] truncate">Ran 30+ workshops</p>
                </div>
              </div>
              <div className="mt-3.5 flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e2028] px-2.5 py-1 text-[11px] text-white font-medium w-fit">
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-[#ff5520] text-white text-[8px] font-bold">✓</span>
                  Background-checked
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e2028] px-2.5 py-1 text-[11px] text-white font-medium w-fit">
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-[#ff5520] text-white text-[8px] font-bold">✓</span>
                  LvlUp trained
                </span>
              </div>
            </div>

            {/* Sana Qureshi */}
            <div className="w-[72%] sm:w-[260px] shrink-0 snap-start rounded-[24px] border border-white/[0.08] bg-[#13141a] p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/tutors/sana.jpg"
                  alt="Portrait of Sana Qureshi"
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h4 className="font-normal text-[16px] text-white leading-tight truncate">Sana Qureshi</h4>
                  <p className="mt-1 text-[12px] text-[#9ca3af] truncate">Maths & coding, 9 yrs</p>
                </div>
              </div>
              <div className="mt-3.5 flex flex-col gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e2028] px-2.5 py-1 text-[11px] text-white font-medium w-fit">
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-[#ff5520] text-white text-[8px] font-bold">✓</span>
                  Background-checked
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1e2028] px-2.5 py-1 text-[11px] text-white font-medium w-fit">
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-[#ff5520] text-white text-[8px] font-bold">✓</span>
                  LvlUp trained
                </span>
              </div>
            </div>
          </div>

          {/* Sub-note */}
          <p className="mt-4 text-[13px] text-[#8e9099]">
            Every tutor teaches a demo class before we hire them.
          </p>
        </ScrollReveal>

        {/* 3 Stats Banner (Orange Card) */}
        <ScrollReveal delay={200}>
          <div className="mt-6 rounded-[22px] bg-[#ff5520] p-5 text-black shadow-lg">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="font-display text-[24px] sm:text-[28px] font-normal leading-none text-black">
                  36 of 38
                </p>
                <p className="mt-1 text-[11px] sm:text-[12px] font-medium leading-tight text-black/85">
                  showed a working helper
                </p>
              </div>
              <div>
                <p className="font-display text-[24px] sm:text-[28px] font-normal leading-none text-black">
                  94%
                </p>
                <p className="mt-1 text-[11px] sm:text-[12px] font-medium leading-tight text-black/85">
                  average attendance
                </p>
              </div>
              <div>
                <p className="font-display text-[24px] sm:text-[28px] font-normal leading-none text-black">
                  2
                </p>
                <p className="mt-1 text-[11px] sm:text-[12px] font-medium leading-tight text-black/85">
                  partner schools
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Parent Testimonials Carousel */}
        <ScrollReveal delay={250}>
          <div
            ref={testimonialCarouselRef}
            onScroll={handleTestimonialScroll}
            className="mt-6 flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2 pt-1 -mx-5 px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="w-[82%] sm:w-[320px] shrink-0 snap-start rounded-[24px] border border-white/[0.08] bg-[#13141a] p-5 shadow-sm text-white flex flex-col justify-between"
              >
                <blockquote className="text-[14px] sm:text-[15px] leading-relaxed text-white/90">
                  {t.quote}
                </blockquote>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <p className="text-[13px] font-normal text-white">{t.name}</p>
                      <p className="text-[11px] text-[#8e9099]">{t.role}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#1e2028] px-2.5 py-0.5 text-[10px] font-medium text-[#8e9099]">
                    Sample
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials Pagination Dots */}
          <div className="mt-4 flex items-center gap-1.5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => scrollToTestimonial(idx)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  activeTestimonialIndex === idx
                    ? "w-6 bg-[#ff5520]"
                    : "size-2 bg-[#4b4e5a] hover:bg-[#6c707d]"
                )}
              />
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── 8. SAFETY COMMITMENTS (Exact Figma media_1793120805184.png) ── */}
      <section className="bg-[#f3f1ec] text-ink px-5 py-12">
        <ScrollReveal>
          <h2 className="font-display text-[32px] sm:text-[38px] font-normal leading-[1.1] tracking-[-0.03em] text-[#0e0f12]">
            Safe by design, and in
            <br />
            writing.
          </h2>
        </ScrollReveal>

        {/* 2x3 Grid of Cards */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-3.5">
          {/* Card 1: A tutor in every class */}
          <ScrollReveal delay={60}>
            <div className="h-full rounded-[22px] border border-black/[0.08] bg-white p-4 sm:p-5 shadow-sm flex flex-col justify-between">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#ffece2] text-[#ff5520]">
                <UsersRound className="size-5" />
              </span>
              <div className="mt-3">
                <h3 className="font-normal text-[14px] sm:text-[15px] text-[#0e0f12] leading-snug">
                  A tutor in every class
                </h3>
                <p className="mt-1 text-[12px] text-[#6b7280]">
                  Never on their own
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Approved tools only */}
          <ScrollReveal delay={120}>
            <div className="h-full rounded-[22px] border border-black/[0.08] bg-white p-4 sm:p-5 shadow-sm flex flex-col justify-between">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#ffece2] text-[#ff5520]">
                <ShieldCheck className="size-5" />
              </span>
              <div className="mt-3">
                <h3 className="font-normal text-[14px] sm:text-[15px] text-[#0e0f12] leading-snug">
                  Approved tools only
                </h3>
                <p className="mt-1 text-[12px] text-[#6b7280]">
                  Accounts we manage
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Your consent first */}
          <ScrollReveal delay={180}>
            <div className="h-full rounded-[22px] border border-black/[0.08] bg-white p-4 sm:p-5 shadow-sm flex flex-col justify-between">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#ffece2] text-[#ff5520]">
                <Award className="size-5" />
              </span>
              <div className="mt-3">
                <h3 className="font-normal text-[14px] sm:text-[15px] text-[#0e0f12] leading-snug">
                  Your consent first
                </h3>
                <p className="mt-1 text-[12px] text-[#6b7280]">
                  Withdraw any time
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4: Minimal data */}
          <ScrollReveal delay={240}>
            <div className="h-full rounded-[22px] border border-black/[0.08] bg-white p-4 sm:p-5 shadow-sm flex flex-col justify-between">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#ffece2] text-[#ff5520]">
                <Lock className="size-5" />
              </span>
              <div className="mt-3">
                <h3 className="font-normal text-[14px] sm:text-[15px] text-[#0e0f12] leading-snug">
                  Minimal data
                </h3>
                <p className="mt-1 text-[12px] text-[#6b7280]">
                  Never sold, deleted on request
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 5: Safety is taught */}
          <ScrollReveal delay={300}>
            <div className="h-full rounded-[22px] border border-black/[0.08] bg-white p-4 sm:p-5 shadow-sm flex flex-col justify-between">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-[#ffece2] text-[#ff5520]">
                <Check className="size-5 stroke-[2.5]" />
              </span>
              <div className="mt-3">
                <h3 className="font-normal text-[14px] sm:text-[15px] text-[#0e0f12] leading-snug">
                  Safety is taught
                </h3>
                <p className="mt-1 text-[12px] text-[#6b7280]">
                  A pledge at level 1
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 6: Read child safety policy (Dark card with arrow) */}
          <ScrollReveal delay={360}>
            <Link
              href={legalLinks.childSafety}
              className="h-full rounded-[22px] bg-[#0e0f12] text-white p-4 sm:p-5 shadow-sm flex flex-col justify-between transition hover:bg-[#191a21] active:scale-[0.98]"
            >
              <h3 className="font-normal text-[14px] sm:text-[15px] text-white leading-snug">
                Read the full child safety policy
              </h3>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-[11px] text-[#9ca3af] leading-tight">
                  PDF · tools, data, who sees it
                </p>
                <ArrowRight className="size-5 stroke-[2] text-white shrink-0 ml-2" />
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 9. HOW JOINING WORKS (Exact Figma media_1793120814163.png) ── */}
      <section id="joining" className="bg-[#0b0c0f] text-white px-5 py-12 border-t border-white/10">
        <ScrollReveal>
          <h2 className="font-display text-[32px] sm:text-[38px] font-normal leading-tight tracking-[-0.03em] text-white">
            How joining works
          </h2>
        </ScrollReveal>

        {/* Vertical Timeline with connecting line */}
        <ScrollReveal delay={120}>
          <div className="relative mt-8">
            {/* Vertical connecting line */}
            <div className="absolute left-4 top-4 bottom-5 w-[2px] bg-[#22242c]" />

            <ol className="space-y-6">
              {[
                { num: 1, title: "Get your school code", sub: "In your school’s circular or WhatsApp." },
                { num: 2, title: "Enrol online", sub: "Two minutes, on your phone." },
                { num: 3, title: "Pay in full or in two parts", sub: "₹4,499 in full, or ₹4,999 in two parts." },
                { num: 4, title: "Meet us online", sub: "A 30-minute parent session." },
                { num: 5, title: "Level up each week", sub: "Updates after levels 2, 4 and 6." },
                { num: 6, title: "Demo day", sub: "Your child presents at school.", isOrange: true },
              ].map((s) => (
                <li key={s.num} className="relative flex items-start gap-4 z-10">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full font-bold text-xs shadow-sm",
                      s.isOrange ? "bg-[#ff5520] text-black" : "bg-[#22242c] text-white"
                    )}
                  >
                    {s.num}
                  </span>
                  <div className="pt-0.5">
                    <h3 className="text-[15px] sm:text-[16px] font-normal text-white leading-tight">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-[13px] text-[#8e9099]">
                      {s.sub}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </ScrollReveal>
      </section>

      {/* ── 10. PRICING & PROMISE (Exact Figma media_1793120827639.png) ── */}
      <section id="fees" aria-labelledby="mobile-fees-title" className="bg-[#f3f1ec] text-ink px-5 py-12">
        <ScrollReveal>
          <h2 id="mobile-fees-title" className="font-display text-[32px] sm:text-[38px] font-normal leading-[1.1] tracking-[-0.03em] text-[#0e0f12]">
            One course. Everything
            <br />
            included.
          </h2>
        </ScrollReveal>

        {/* Main Dark Pricing Card */}
        <ScrollReveal delay={100}>
          <div className="mt-7 rounded-[28px] bg-[#111216] border border-white/10 p-5 sm:p-6 text-white shadow-xl">
            {/* Header row: Standard fee + discount badge */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#8e9099]">
                Standard fee{" "}
                <span className="line-through text-white/50">₹15,000</span>
              </span>
              <span className="rounded-full bg-[#125835] px-2.5 py-0.5 text-[11px] font-bold text-[#34d399]">
                Up to 70% off
              </span>
            </div>

            {/* Option 1: Pay in full */}
            <div
              onClick={() => setSelectedPricingPlan("full")}
              className={cn(
                "mt-5 rounded-[20px] p-4 flex items-center justify-between cursor-pointer transition-all",
                selectedPricingPlan === "full"
                  ? "border-2 border-[#ff5520] bg-[#1a1b22]"
                  : "border border-white/10 bg-[#16171f]"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    selectedPricingPlan === "full" ? "border-[#ff5520]" : "border-white/30"
                  )}
                >
                  {selectedPricingPlan === "full" && (
                    <span className="size-2.5 rounded-full bg-[#ff5520]" />
                  )}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[15px] text-white">Pay in full</span>
                    <span className="rounded-md bg-[#125835] px-1.5 py-0.5 text-[10px] font-bold text-[#34d399]">
                      Save ₹500
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#8e9099]">
                    One payment when you enrol
                  </p>
                </div>
              </div>
              <span className="font-display text-[26px] sm:text-[28px] font-normal text-white tracking-tight">
                ₹4,499
              </span>
            </div>

            {/* Option 2: Pay in two parts */}
            <div
              onClick={() => setSelectedPricingPlan("parts")}
              className={cn(
                "mt-3 rounded-[20px] p-4 flex items-center justify-between cursor-pointer transition-all",
                selectedPricingPlan === "parts"
                  ? "border-2 border-[#ff5520] bg-[#1a1b22]"
                  : "border border-white/10 bg-[#16171f]"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    selectedPricingPlan === "parts" ? "border-[#ff5520]" : "border-white/30"
                  )}
                >
                  {selectedPricingPlan === "parts" && (
                    <span className="size-2.5 rounded-full bg-[#ff5520]" />
                  )}
                </span>
                <div>
                  <span className="font-semibold text-[15px] text-white">Pay in two parts</span>
                  <p className="mt-0.5 text-[12px] text-[#8e9099]">
                    ₹2,500 now, ₹2,499 by level 5
                  </p>
                </div>
              </div>
              <span className="font-display text-[26px] sm:text-[28px] font-normal text-white tracking-tight">
                ₹4,999
              </span>
            </div>

            {/* Inclusions (2 columns) */}
            <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2 text-[12px] sm:text-[13px] text-white/90 pt-1">
              <div className="flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#ff5520] text-black">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>8 tutor-led classes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#ff5520] text-black">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>All materials and tools</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#ff5520] text-black">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>Progress updates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#ff5520] text-black">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>Demo day and portfolio</span>
              </div>
            </div>

            {/* CTA Enrol Button */}
            <button
              type="button"
              onClick={() => {
                setIsEnrolFormOpen(true);
                const el = document.getElementById("enrol");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff5520] to-[#ff6b2c] font-semibold text-[15px] text-black shadow-[0_4px_25px_rgba(255,85,32,0.4)] transition active:scale-[0.98]"
            >
              <span>
                {selectedPricingPlan === "full" ? "Enrol and pay ₹4,499" : "Enrol and pay ₹2,500"}
              </span>
              <ArrowRight className="size-4 stroke-[2.5]" />
            </button>

            <p className="mt-3 text-center text-[12px] text-[#8e9099]">
              Partner school prices. Paid to LvlUp, not your school.
            </p>
          </div>
        </ScrollReveal>

        {/* Our Promise Card */}
        <ScrollReveal delay={180}>
          <div className="mt-4 rounded-[24px] bg-[#ffece2] p-5 sm:p-6 text-[#0e0f12]">
            <p className="font-mono text-[13px] text-[#0e0f12]">
              Our promise
            </p>
            <p className="mt-2 font-display text-[18px] sm:text-[20px] font-normal leading-[1.3] text-[#0e0f12]">
              Comes to 6 of 8 classes but can’t show a working AI helper at demo day? We refund ₹2,499.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#5f6068]">
              No laptop, kits, subscriptions or certificate fee to pay.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── 11. ENROL YOUR CHILD (Exact Figma media_1793121632938.png) ── */}
      <section id="enrol" aria-labelledby="mobile-enrol-title" className="bg-[#f3f1ec] text-ink px-5 py-12 scroll-mt-6 border-t border-black/5">
        <ScrollReveal>
          <h2 id="mobile-enrol-title" className="font-display text-[32px] sm:text-[38px] font-normal leading-[1.08] tracking-[-0.03em] text-[#0e0f12]">
            Enrol your child
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[#5f6068]">
            About three minutes. Keep your school code handy.
          </p>
        </ScrollReveal>

        {/* 3 Steps List */}
        <ScrollReveal delay={100}>
          <ol className="mt-7 space-y-5">
            <li className="flex items-start gap-3.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ff5520] text-black font-bold text-xs shadow-sm">
                1
              </span>
              <div>
                <h3 className="font-normal text-[15px] sm:text-[16px] text-[#0e0f12] leading-tight">
                  Fill in the form
                </h3>
                <p className="mt-1 text-[13px] text-[#5f6068]">
                  Your child’s details and yours
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-xs font-normal text-[#0e0f12] shadow-xs">
                2
              </span>
              <div>
                <h3 className="font-normal text-[15px] sm:text-[16px] text-[#0e0f12] leading-tight">
                  Choose how to pay
                </h3>
                <p className="mt-1 text-[13px] text-[#5f6068]">
                  ₹4,499 in full or ₹4,999 in two parts
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white text-xs font-normal text-[#0e0f12] shadow-xs">
                3
              </span>
              <div>
                <h3 className="font-normal text-[15px] sm:text-[16px] text-[#0e0f12] leading-tight">
                  Get confirmation
                </h3>
                <p className="mt-1 text-[13px] text-[#5f6068]">
                  On WhatsApp, with the start date
                </p>
              </div>
            </li>
          </ol>
        </ScrollReveal>

        {/* Start enrolment button & note */}
        {!isEnrolFormOpen && (
          <ScrollReveal delay={160}>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setIsEnrolFormOpen(true)}
                className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff5520] to-[#ff6b2c] font-semibold text-[16px] text-black shadow-[0_4px_25px_rgba(255,85,32,0.4)] transition active:scale-[0.98]"
              >
                <span>Start enrolment</span>
                <ArrowRight className="size-4 stroke-[2.5]" />
              </button>

              <p className="mt-4 text-[13px] text-[#5f6068] leading-relaxed">
                No school code? Ask your class teacher or WhatsApp us.
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Expanded Student Details & Enrolment Form */}
        {isEnrolFormOpen && (
          <div className="mt-7 rounded-[26px] border border-black/[0.08] bg-white p-5 sm:p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            {enrolSubmitted ? (
              <div className="py-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#109e58] text-white shadow-sm">
                  <Check className="size-6 stroke-[3]" />
                </div>
                <h3 className="mt-4 font-display text-[22px] font-normal text-[#0e0f12]">
                  Enrolment request received!
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#5f6068]">
                  Thank you! We’ve sent a confirmation to WhatsApp at <strong className="text-black font-semibold">{enrolMobile || "+91 98765 43210"}</strong> for {enrolChildName || "your child"}.
                </p>
                <div className="mt-5 rounded-2xl bg-[#f4f5f7] p-4 text-left text-[13px] text-[#5f6068] space-y-1.5">
                  <p><strong className="text-[#0e0f12]">Child:</strong> {enrolChildName || "Child Name"} ({enrolGrade}, Sec {enrolSection})</p>
                  <p><strong className="text-[#0e0f12]">School Code:</strong> {enrolSchoolCode || "PUNE-0427"}</p>
                  <p><strong className="text-[#0e0f12]">Plan:</strong> {selectedPricingPlan === "full" ? "₹4,499 in full" : "₹4,999 in two parts"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnrolSubmitted(false)}
                  className="mt-5 inline-block text-[13px] font-semibold text-[#ff5520] underline"
                >
                  Edit details or enrol another child
                </button>
              </div>
            ) : (
              <form onSubmit={handleMobileEnrolSubmit} className="space-y-6">
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <h3 className="font-display text-[18px] font-normal text-[#0e0f12]">
                    1. Student Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEnrolFormOpen(false)}
                    className="text-[12px] text-[#8e9099] hover:text-black font-medium"
                  >
                    Close form
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#0e0f12]">
                      Child’s full name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="As on school records"
                      value={enrolChildName}
                      onChange={(e) => setEnrolChildName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm text-[#0e0f12] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5520]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0e0f12]">
                        Grade
                      </label>
                      <div className="relative mt-1.5">
                        <select
                          value={enrolGrade}
                          onChange={(e) => setEnrolGrade(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm text-[#0e0f12] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5520] pr-8"
                        >
                          <option value="Grade 5">Grade 5</option>
                          <option value="Grade 6">Grade 6</option>
                          <option value="Grade 7">Grade 7</option>
                          <option value="Grade 8">Grade 8</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8e9099]" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0e0f12]">
                        Section
                      </label>
                      <input
                        type="text"
                        placeholder="B"
                        value={enrolSection}
                        onChange={(e) => setEnrolSection(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm text-[#0e0f12] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5520]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0e0f12]">
                      School code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PUNE-0427"
                      value={enrolSchoolCode}
                      onChange={(e) => setEnrolSchoolCode(e.target.value.toUpperCase())}
                      className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm font-mono uppercase text-[#0e0f12] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5520]"
                    />
                  </div>
                </div>

                {/* 2. Parent Details */}
                <div className="border-t border-black/5 pt-5 space-y-3.5">
                  <h3 className="font-display text-[18px] font-normal text-[#0e0f12]">
                    2. Parent Details
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#0e0f12]">
                      Parent or guardian name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={enrolParentName}
                      onChange={(e) => setEnrolParentName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm text-[#0e0f12] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5520]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0e0f12]">
                        Relationship
                      </label>
                      <div className="relative mt-1.5">
                        <select
                          value={enrolRelationship}
                          onChange={(e) => setEnrolRelationship(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm text-[#0e0f12] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5520] pr-8"
                        >
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Guardian">Guardian</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8e9099]" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0e0f12]">
                        WhatsApp mobile
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10 digits"
                        value={enrolMobile}
                        onChange={(e) => setEnrolMobile(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm font-mono text-[#0e0f12] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5520]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0e0f12]">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={enrolEmail}
                      onChange={(e) => setEnrolEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm text-[#0e0f12] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5520]"
                    />
                  </div>
                </div>

                {/* 3. Plan Selection */}
                <div className="border-t border-black/5 pt-5">
                  <h3 className="font-display text-[18px] font-normal text-[#0e0f12] mb-3">
                    3. Payment Plan
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedPricingPlan("full")}
                      className={cn(
                        "rounded-xl p-3 text-left border transition",
                        selectedPricingPlan === "full"
                          ? "border-[#ff5520] bg-[#ffece2]/30 ring-1 ring-[#ff5520]"
                          : "border-black/10 bg-[#f4f5f7]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#0e0f12]">Pay in full</span>
                        <span className="rounded bg-[#125835] px-1.5 py-0.5 text-[9px] font-bold text-white">Save ₹500</span>
                      </div>
                      <p className="mt-1 text-[16px] font-normal font-display text-[#0e0f12]">₹4,499</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPricingPlan("parts")}
                      className={cn(
                        "rounded-xl p-3 text-left border transition",
                        selectedPricingPlan === "parts"
                          ? "border-[#ff5520] bg-[#ffece2]/30 ring-1 ring-[#ff5520]"
                          : "border-black/10 bg-[#f4f5f7]"
                      )}
                    >
                      <span className="text-[12px] font-semibold text-[#0e0f12]">Pay in two parts</span>
                      <p className="mt-1 text-[16px] font-normal font-display text-[#0e0f12]">₹4,999</p>
                      <p className="text-[10px] text-[#5f6068]">₹2,500 now</p>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    id="mobile-consent"
                    type="checkbox"
                    required
                    checked={enrolConsent}
                    onChange={(e) => setEnrolConsent(e.target.checked)}
                    className="mt-1 size-4 rounded border-black/20 text-[#ff5520] focus:ring-[#ff5520]"
                  />
                  <label htmlFor="mobile-consent" className="text-[12px] leading-snug text-[#5f6068]">
                    I confirm my child attends a partner school. I agree to the <Link href={legalLinks.childSafety} className="underline text-black font-semibold">Child Safety Policy</Link> and <Link href={legalLinks.terms} className="underline text-black font-semibold">Terms</Link>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={enrolSubmitting}
                  className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff5520] to-[#ff6b2c] font-semibold text-[15px] text-black shadow-lg transition active:scale-[0.98]"
                >
                  {enrolSubmitting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>
                      <span>
                        {selectedPricingPlan === "full" ? "Proceed to pay ₹4,499" : "Proceed to pay ₹2,500"}
                      </span>
                      <ArrowRight className="size-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </section>

      {/* ── 12. FAQ (Exact Figma media_1793121675929.png) ── */}
      <section id="faq" aria-labelledby="mobile-faq-title" className="bg-[#f3f1ec] text-ink px-5 pb-14 pt-4 border-t border-black/5">
        <ScrollReveal>
          <h2 id="mobile-faq-title" className="font-display text-[32px] sm:text-[38px] font-normal leading-tight tracking-[-0.03em] text-[#0e0f12]">
            Questions parents ask
          </h2>

          {/* Tab Toggle: For parents / For schools */}
          <div className="mt-4 mb-6 inline-flex rounded-xl bg-[#e6e4df] p-1 text-xs">
            <button
              type="button"
              onClick={() => setFaqTab("parents")}
              className={cn(
                "px-4 py-2 rounded-lg transition",
                faqTab === "parents" ? "bg-white text-[#0e0f12] font-semibold shadow-sm" : "text-[#5f6068] font-normal"
              )}
            >
              For parents
            </button>
            <button
              type="button"
              onClick={() => setFaqTab("schools")}
              className={cn(
                "px-4 py-2 rounded-lg transition",
                faqTab === "schools" ? "bg-white text-[#0e0f12] font-semibold shadow-sm" : "text-[#5f6068] font-normal"
              )}
            >
              For schools
            </button>
          </div>
        </ScrollReveal>

        {/* FAQ Accordion List */}
        <ScrollReveal delay={100}>
          <ul className="space-y-2.5">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <li
                  key={item.question}
                  className="rounded-[18px] border border-black/[0.08] bg-white overflow-hidden shadow-xs transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
                  >
                    <span className="font-normal text-[15px] sm:text-[16px] text-[#0e0f12] leading-snug pr-4">
                      {item.question}
                    </span>
                    <span className="flex size-6 shrink-0 items-center justify-center text-xl font-light text-[#0e0f12]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-0">
                      <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#5f6068]">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </ScrollReveal>

        {/* FAQ note below */}
        <ScrollReveal delay={150}>
          <p className="mt-6 text-[13px] text-[#5f6068] leading-relaxed">
            Something else? WhatsApp us at <a href={siteConfig.whatsappUrl} className="underline text-black font-normal">[number]</a>. A person replies within a few hours. We only message you about your child’s batch, and you can reply STOP at any time.
          </p>
        </ScrollReveal>
      </section>

      {/* ── 13. FOR SCHOOLS (Exact Figma media_1793121689317.png) ── */}
      <section id="schools" aria-labelledby="mobile-school-banner" className="bg-[#0b0c0f] text-white px-5 py-14 border-t border-white/10">
        <ScrollReveal>
          <h2 id="mobile-school-banner" className="font-display text-[32px] sm:text-[38px] font-normal leading-[1.08] tracking-[-0.03em] text-white">
            Bring LvlUp to your school.
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#9ca3af]">
            We bring the tutors, lessons and parent updates. You host one class a week in your lab.
          </p>
        </ScrollReveal>

        {/* Feature Badges */}
        <ScrollReveal delay={100}>
          <div className="mt-6 flex flex-col gap-2.5">
            <div>
              <span className="rounded-full bg-[#181920] border border-white/10 px-3.5 py-1.5 inline-flex items-center gap-2 text-[12.5px] text-white">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#ff5520] text-black">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>No extra work for teachers</span>
              </span>
            </div>

            <div>
              <span className="rounded-full bg-[#181920] border border-white/10 px-3.5 py-1.5 inline-flex items-center gap-2 text-[12.5px] text-white">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#ff5520] text-black">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>Maps to CBSE AI topics</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-[#181920] border border-white/10 px-3.5 py-1.5 inline-flex items-center gap-2 text-[12.5px] text-white">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#ff5520] text-black">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>Partner fee per student</span>
              </span>
              <span className="rounded-full bg-[#181920] border border-white/10 px-3.5 py-1.5 inline-flex items-center gap-2 text-[12.5px] text-white">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#ff5520] text-black">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>Demo day at level 8</span>
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* White Card: Get a callback */}
        <ScrollReveal delay={150}>
          <div className="mt-7 rounded-[28px] bg-white p-5 sm:p-6 text-[#0e0f12] shadow-xl">
            {schoolSubmitted ? (
              <div className="py-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#109e58] text-white shadow-sm">
                  <Check className="size-6 stroke-[3]" />
                </div>
                <h3 className="mt-4 font-display text-[22px] font-normal text-[#0e0f12]">
                  Callback request received!
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#5f6068]">
                  Thank you. Our school partnerships team will call you within one working day.
                </p>
                <button
                  type="button"
                  onClick={() => setSchoolSubmitted(false)}
                  className="mt-4 text-[13px] font-semibold text-[#ff5520] underline"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-[22px] sm:text-[24px] font-normal text-[#0e0f12]">
                  Get a callback
                </h3>
                <p className="mt-1 text-[13px] text-[#5f6068]">
                  For schools. Our partnerships team calls within one working day.
                </p>

                <form onSubmit={handleSchoolSubmit} className="mt-5 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#0e0f12]">
                      School name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. [School name]"
                      value={schoolForm.schoolName}
                      onChange={(e) => setSchoolForm({ ...schoolForm, schoolName: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm text-[#0e0f12] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0e0f12]">
                        Your name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Priya Sharma"
                        value={schoolForm.name}
                        onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm text-[#0e0f12] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0e0f12]">
                        Role
                      </label>
                      <div className="relative mt-1.5">
                        <select
                          value={schoolForm.role}
                          onChange={(e) => setSchoolForm({ ...schoolForm, role: e.target.value })}
                          className="w-full appearance-none rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm text-[#0e0f12] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black pr-8"
                        >
                          <option value="Principal">Principal</option>
                          <option value="Trustee / Director">Trustee / Director</option>
                          <option value="Computer Teacher / HOD">Computer Teacher / HOD</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8e9099]" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0e0f12]">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Pune"
                        value={schoolForm.city}
                        onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm text-[#0e0f12] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0e0f12]">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10 digits"
                        value={schoolForm.phone}
                        onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-black/10 bg-[#f4f5f7] px-4 py-3 text-sm font-mono text-[#0e0f12] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={schoolSubmitting}
                    className="mt-2 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#0e0f12] font-semibold text-[15px] text-white transition active:scale-[0.98]"
                  >
                    {schoolSubmitting ? (
                      <Loader2 className="size-5 animate-spin text-white" />
                    ) : (
                      <>
                        <span>Get a callback</span>
                        <ArrowRight className="size-4 stroke-[2]" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </ScrollReveal>

        {/* Download School Pack Link */}
        <ScrollReveal delay={200}>
          <a
            href="/downloads/LvlUp-Eight-Week-Curriculum.pdf"
            download="LvlUp Eight-Week Curriculum.pdf"
            className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-white underline underline-offset-4 hover:text-[#ff5520] transition"
          >
            <Download className="size-4 stroke-[2.5]" />
            <span>Download the school pack (PDF)</span>
          </a>
        </ScrollReveal>
      </section>

      {/* ── 14. FOOTER (Exact Figma media_1793121700752.png) ── */}
      <footer className="bg-[#08090b] border-t border-white/10 px-5 pt-12 pb-24 text-white">
        <ScrollReveal>
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-[12px] bg-[#ff5520] text-black shadow-md">
              <ChevronUp className="size-5 stroke-[3]" />
            </span>
            <span className="font-display text-[22px] font-bold tracking-tight text-white">
              Lvl<span className="text-[#ff5520]">Up</span>
            </span>
          </div>

          {/* Short description */}
          <p className="mt-4 text-[14px] leading-relaxed text-[#8e9099] max-w-[340px]">
            An eight-week AI course for Grades 5–8, taught by trained tutors at your child’s school.
          </p>

          {/* Primary nav links */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-medium text-white">
            <a href="#curriculum" className="hover:text-[#ff5520] transition">Levels</a>
            <a href="#safety" className="hover:text-[#ff5520] transition">Safety</a>
            <a href="#fees" className="hover:text-[#ff5520] transition">Fees</a>
            <a href="#faq" className="hover:text-[#ff5520] transition">FAQ</a>
            <a href="#schools" className="hover:text-[#ff5520] transition">For schools</a>
          </div>

          {/* Contact links */}
          <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-medium text-white">
            <a href={siteConfig.whatsappUrl} className="hover:text-[#ff5520] transition">
              WhatsApp [number]
            </a>
            <a href={siteConfig.emailUrl} className="hover:text-[#ff5520] transition">
              [email]
            </a>
          </div>

          {/* Divider */}
          <div className="my-7 h-px bg-white/10" />

          {/* Legal & Copyright */}
          <p className="text-[12px] sm:text-[13px] text-[#6b7280] flex flex-wrap items-center gap-1.5 leading-relaxed">
            <span>&copy; 2026 LvlUp</span>
            <span>&middot;</span>
            <Link className="hover:text-white transition" href={legalLinks.privacy}>Privacy</Link>
            <span>&middot;</span>
            <Link className="hover:text-white transition" href={legalLinks.childSafety}>Child safety</Link>
            <span>&middot;</span>
            <Link className="hover:text-white transition" href={legalLinks.refunds}>Refunds</Link>
            <span>&middot;</span>
            <Link className="hover:text-white transition" href={legalLinks.terms}>Terms</Link>
          </p>
        </ScrollReveal>
      </footer>

      {/* ── 15. STICKY BOTTOM BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.10] bg-[#16171d]/95 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-bold text-white leading-none">&#8377;4,999</p>
            <p className="mt-0.5 text-[12px] text-white/45 leading-none">&#8377;2,500 to join</p>
          </div>
          <a
            href={siteConfig.whatsappUrl}
            className="flex h-[46px] items-center justify-center rounded-xl border border-white/20 bg-[#1e1f27] px-5 text-[14px] font-bold text-white transition hover:bg-[#25262f] shrink-0 active:scale-95"
          >
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setIsEnrolFormOpen(true);
              const el = document.getElementById("enrol");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="flex h-[46px] items-center justify-center rounded-xl bg-brand-gradient px-5 text-[14px] font-bold text-ink shadow-glow transition hover:brightness-105 shrink-0 active:scale-95"
          >
            Enrol now
          </button>
        </div>
      </div>
    </div>
  );
}
