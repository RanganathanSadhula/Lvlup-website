"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
  ChevronDown,
  Download,
  Loader2,
  Plus,
  Minus,
  Send,
  Sparkles,
  Phone,
  Calendar,
  Clock,
  Menu,
  Folder,
  ListChecks,
  Mic,
  ArrowUp,
} from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { tutors } from "@/data/tutors";
import { parentFaq, schoolFaq } from "@/data/faq";
import { siteConfig, legalLinks, navLinks } from "@/data/site";
import {
  facts,
  gradeCards,
  goodFit,
  notFit,
  safetyCommitments,
  joiningSteps,
} from "@/data/content";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const problemCardsData = [
  {
    image: "/images/problem-copy.png",
    alt: "Chatbot falsely answering capital of Australia as Sydney, copied into homework",
    title: "They copy answers they can’t check",
    body: "A chatbot sounds sure even when it is wrong.",
    snippetQ: "What is the capital of Australia?",
    snippetA: "Sydney. Definitely Sydney.",
  },
  {
    image: "/images/problem-share.png",
    alt: "Student sharing private name, school and phone number into stranger app",
    title: "They share more than they should",
    body: "Names, school and photos go into tools without a second thought.",
    snippetQ: "What school do you go to?",
    snippetA: "St. Mary's, Grade 6B. My phone is...",
  },
  {
    image: "/images/problem-magic.png",
    alt: "AI assistant responding that it learned patterns from examples",
    title: "They see AI as magic",
    body: "Not as a tool they can question, shape and build with.",
    snippetQ: "How do you know everything?",
    snippetA: "I don't. I predict word patterns.",
  },
];

const solutionPillars = [
  {
    title: "Understand it",
    body: "How AI learns from examples, and why its answers need checking.",
    image: "/images/solution-understand-color.png",
    icon: "/images/solution/icon-understand.png",
    alt: "A smiling boy holding a stack of books",
  },
  {
    title: "Use it safely",
    body: "Private information stays private. Tools are approved and managed by us.",
    image: "/images/solution-safely-color.png",
    icon: "/images/solution/icon-safely.png",
    alt: "Two children smiling at a laptop together",
  },
  {
    title: "Build with it",
    body: "Each child designs, builds and tests an AI helper for a real problem.",
    image: "/images/solution-build-color.png",
    icon: "/images/solution/icon-build.png",
    alt: "A girl raising her hand next to classmates with laptops",
  },
];

const outcomesList = [
  {
    title: "A digital portfolio",
    body: "Eight pieces of work in one place.",
    icon: Folder,
  },
  {
    title: "A head start on CBSE AI topics",
    body: "Practise the new Classes 3 to 8 ideas by building.",
    icon: BookOpen,
  },
  {
    title: "Habits that last",
    body: "Check answers, keep private things private.",
    icon: ListChecks,
  },
  {
    title: "Confidence to explain it",
    body: "A two-minute talk at demo day.",
    icon: Mic,
  },
];

export function TabletView() {
  // Navigation & Menu drawer
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Curriculum open level
  const [openLevel, setOpenLevel] = useState<number | null>(1);
  const [isHeroColored, setIsHeroColored] = useState(false);

  // FAQ states
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqTab, setFaqTab] = useState<"parents" | "schools">("parents");

  // Problem carousel scroll
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const problemScrollRef = useRef<HTMLDivElement>(null);

  // Interactive AI Helper Chat simulation in Outcomes
  const [messages, setMessages] = useState<Array<{ role: "bot" | "user"; text: string }>>([
    {
      role: "bot",
      text: "Hi! I am Revise Buddy. Ready to test what you know about the Solar System?",
    },
    { role: "user", text: "Yes! Ask me about Mars." },
    {
      role: "bot",
      text: "Great! Mars is often called the Red Planet. Why does it look red from Earth?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = inputText.trim();
    setMessages((prev) => [...prev, { role: "user", text: newMsg }]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Spot on! The iron oxide (rust) on its surface gives Mars its reddish tint. Next question: How many moons does Mars have?",
        },
      ]);
    }, 900);
  };

  // Enrolment form modal / expander
  const [isEnrolFormOpen, setIsEnrolFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"full" | "parts">("full");
  const [childName, setChildName] = useState("");
  const [childGrade, setChildGrade] = useState("Grade 6");
  const [childSec, setChildSec] = useState("A");
  const [schoolCode, setSchoolCode] = useState("PUNE-0427");
  const [parentName, setParentName] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [enrolSubmitted, setEnrolSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // School pack form
  const [schoolSubmitted, setSchoolSubmitted] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [schoolCity, setSchoolCity] = useState("Pune");
  const [contactPerson, setContactPerson] = useState("");
  const [schoolRole, setSchoolRole] = useState("Principal");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  };

  const handleEnrolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEnrolSubmitted(true);
    }, 600);
  };

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolSubmitted(true);
  };

  return (
    <div className="w-full bg-[#0B0C0F] text-white selection:bg-[#FF6B2C] selection:text-black overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────
          SCREEN 1: STICKY NAV (768px x 72px)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-[#23262F]/60 bg-[#0B0C0F]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[768px] items-center justify-between px-10">
          {/* LvlUp Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex cursor-pointer items-center gap-[10px]"
          >
            <Image src="/icons/logo.svg" alt="LvlUp" width={34} height={34} priority />
            <span className="font-display text-[23.8px] font-semibold tracking-[-0.03em] text-white">
              Lvl<span className="text-[#FF6B2C]">Up</span>
            </span>
          </div>

          {/* Right CTA + Menu Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEnrolFormOpen(true);
                scrollTo("tablet-enrol");
              }}
              className="flex h-[40px] w-[124px] items-center justify-center rounded-[6px] bg-gradient-to-b from-[#FF8B4E] via-[#FF6B2C] to-[#F2561A] text-[16px] font-semibold text-[#0B0C0F] shadow-[0px_10px_28px_-8px_rgba(255,107,44,0.35),inset_0px_1px_0px_rgba(255,255,255,0.28)] transition-all hover:brightness-105 active:scale-95"
            >
              Enrol now
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
              className="flex size-[44px] items-center justify-center rounded-[10px] border border-[#2B2E36] bg-[#15171C] text-white transition hover:border-[#FF6B2C] active:scale-95"
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Menu Drawer */}
      {isMenuOpen && (
        <div className="sticky top-[72px] z-40 w-full border-b border-[#23262F] bg-[#15171C] px-10 py-6 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 text-[16px] text-[#A7ACB8]">
            <button
              onClick={() => scrollTo("tablet-problem")}
              className="text-left py-2 hover:text-white transition"
            >
              The course
            </button>
            <button
              onClick={() => scrollTo("tablet-levels")}
              className="text-left py-2 hover:text-white transition"
            >
              Levels
            </button>
            <button
              onClick={() => scrollTo("tablet-safety")}
              className="text-left py-2 hover:text-white transition"
            >
              Safety
            </button>
            <button
              onClick={() => scrollTo("tablet-pricing")}
              className="text-left py-2 hover:text-white transition"
            >
              Fees
            </button>
            <button
              onClick={() => scrollTo("tablet-faq")}
              className="text-left py-2 hover:text-white transition"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollTo("tablet-schools")}
              className="text-left py-2 hover:text-white transition"
            >
              For schools
            </button>
          </nav>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 2: HERO SECTION (768px x 823px)
      ───────────────────────────────────────────────────────────── */}
      <section className="group/hero relative flex min-h-[823px] w-full flex-col justify-end px-10 pb-[72px] pt-[360px] isolate bg-[#0B0C0F] overflow-hidden">
        {/* Grain effect overlay matching website */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            backgroundImage: 'url("/images/grain-dark.png")',
            backgroundRepeat: "repeat",
            opacity: 0.52,
          }}
        />

        {/* Full Bleed Background Image with Black-to-Colour Transition on Hover & Tap */}
        <div
          onClick={() => setIsHeroColored((prev) => !prev)}
          className="absolute inset-x-0 top-0 h-[520px] overflow-hidden z-0 cursor-pointer"
        >
          <Image
            src="/images/hero-student-hd.png"
            alt="A girl with headphones working at a laptop with stacked books"
            fill
            priority
            unoptimized
            quality={100}
            sizes="768px"
            className={cn(
              "object-cover object-[center_15%] transition-all duration-700 ease-out group-hover/hero:scale-105 group-hover/hero:grayscale-0",
              isHeroColored ? "grayscale-0 scale-105" : "grayscale contrast-[1.05]"
            )}
          />
          {/* Top subtle fade & bottom heavy fade into #0B0C0F */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C0F]/20 via-transparent to-[#0B0C0F] z-10" />
          <div className="absolute inset-x-0 bottom-0 h-[240px] bg-gradient-to-t from-[#0B0C0F] via-[#0B0C0F]/90 to-transparent z-10" />
        </div>

        {/* Floating Revise Buddy Card (Matching media_1793132350131.jpg) */}
        <div className="absolute right-8 top-[140px] z-20 w-[272px] -rotate-2 rounded-[16px] bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:rotate-0 hover:scale-105">
          {/* Orange accent tab at top center */}
          <div className="flex justify-center -mt-1 mb-2.5">
            <div className="h-[5px] w-12 rounded-full bg-[#FF6B2C]" />
          </div>

          {/* Header: Bot icon + Title */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF0EA]">
              <Bot className="size-5 text-[#FF6B2C]" />
            </div>
            <div>
              <h4 className="font-display text-[16px] font-bold leading-tight text-[#0B0C0F]">
                Revise Buddy
              </h4>
              <p className="text-[11px] text-[#5A5F6B]">by Asha, Grade 6</p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2.5 text-[12px] leading-relaxed text-[#5A5F6B]">
            Quizzes her on a science chapter and explains what she got wrong.
          </p>

          {/* Chat bubbles container */}
          <div className="mt-2.5 space-y-2 rounded-xl bg-[#F4F5F7] p-2.5">
            {/* User message — right aligned */}
            <div className="flex justify-end">
              <span className="rounded-full bg-[#DCE8FE] px-3.5 py-1 text-[11px] font-medium text-[#0B0C0F]">
                Quiz me on chapter 7
              </span>
            </div>
            {/* AI question — left aligned */}
            <div className="flex items-start gap-1.5">
              <span className="mt-0.5 size-3 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-400" />
              <span className="text-[11px] leading-snug text-[#0B0C0F]/90">
                Question 1 of 5: which gas do plants take in to make food?
              </span>
            </div>
          </div>

          {/* Card footer */}
          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-full border border-[#109E58] px-2.5 py-0.5 text-[10px] font-bold text-[#109E58]">
              <Check className="size-3 stroke-[3]" />
              2/2 tests passed
            </span>
            <span className="text-[10px] text-[#5A5F6B]">Level 6 project</span>
          </div>
        </div>

        {/* Hero Content Frame (688px width) */}
        <div className="relative z-20 flex flex-col items-start gap-6 w-full">
          <ScrollReveal>
            <h1 className="font-display text-[56px] font-normal leading-[60px] tracking-[-0.03em] text-white">
              Don’t just use AI. <br />
              Build with it.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <p className="text-[18px] font-normal leading-[28px] text-white/65 max-w-[620px]">
              An eight-week course taught by a trained tutor at your child’s school. At level 8, your
              child shows you a working AI helper they designed and tested themselves.
            </p>
          </ScrollReveal>

          {/* CTA Buttons Row Matching media_1793132350131.jpg */}
          <ScrollReveal delay={160}>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEnrolFormOpen(true);
                  scrollTo("tablet-enrol");
                }}
                className="flex h-[48px] items-center justify-center gap-2 rounded-[8px] bg-gradient-to-b from-[#FF8B4E] via-[#FF6B2C] to-[#F2561A] px-6 text-[15px] font-semibold text-[#0B0C0F] shadow-[0px_10px_28px_-8px_rgba(255,107,44,0.35),inset_0px_1px_0px_rgba(255,255,255,0.28)] transition-all hover:brightness-105 active:scale-95"
              >
                <span>Enrol with your school code</span>
                <ArrowRight className="size-4 stroke-[2.5]" />
              </button>

              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-[48px] items-center justify-center gap-2 rounded-[8px] border border-[#2B2E36] bg-[#12141A] px-6 text-[15px] font-semibold text-white transition hover:border-[#FF6B2C] active:scale-95"
              >
                <span>WhatsApp us</span>
                <ArrowRight className="size-4 stroke-[2.5]" />
              </a>
            </div>
          </ScrollReveal>

          {/* Meta row matching media_1793132350131.jpg */}
          <ScrollReveal delay={200}>
            <div className="flex items-center gap-6 pt-2 text-[14px]">
              <div className="flex flex-col">
                <span className="text-[12px] text-[#A7ACB8]">Next batch</span>
                <span className="font-semibold text-white mt-0.5">[Month] 2027</span>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="flex flex-col">
                <span className="text-[12px] text-[#A7ACB8]">Class</span>
                <span className="font-semibold text-white mt-0.5">90 min, once a week</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 2 (FACT STRIP): 4 CARDS IN 1 ROW (Matching media_1793132384031.png)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#0B0C0F] px-10 pb-12 pt-4 border-b border-[#23262F]/40">
        <div className="grid grid-cols-4 gap-3.5 w-full">
          <ScrollReveal delay={0}>
            <div className="flex flex-col justify-center rounded-[16px] border border-[#23262F]/80 bg-[#12141A] p-5 text-left transition hover:border-[#FF6B2C]/50">
              <div className="font-display text-[22px] font-medium tracking-tight text-white">
                8 levels
              </div>
              <div className="mt-1 text-[13px] text-[#8A8F9E]">One a week</div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
            <div className="flex flex-col justify-center rounded-[16px] border border-[#23262F]/80 bg-[#12141A] p-5 text-left transition hover:border-[#FF6B2C]/50">
              <div className="font-display text-[22px] font-medium tracking-tight text-white">
                1 tutor
              </div>
              <div className="mt-1 text-[13px] text-[#8A8F9E]">In every class</div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="flex flex-col justify-center rounded-[16px] border border-[#23262F]/80 bg-[#12141A] p-5 text-left transition hover:border-[#FF6B2C]/50">
              <div className="font-display text-[22px] font-medium tracking-tight text-white">
                Up to 25
              </div>
              <div className="mt-1 text-[13px] text-[#8A8F9E]">Students a batch</div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={180}>
            <div className="flex flex-col justify-center rounded-[16px] border border-[#23262F]/80 bg-[#12141A] p-5 text-left transition hover:border-[#FF6B2C]/50">
              <div className="font-display text-[22px] font-medium tracking-tight text-white">
                Level 8
              </div>
              <div className="mt-1 text-[13px] text-[#8A8F9E]">Demo day at school</div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 3: PROBLEM SECTION (768px x 633.2px, #F4F3EE)
      ───────────────────────────────────────────────────────────── */}
      <section id="tablet-problem" className="w-full bg-[#F4F3EE] px-10 py-[72px] text-[#0B0C0F]">
        <ScrollReveal>
          <div className="w-full">
            <h2 className="font-display text-[36px] font-normal leading-[41px] tracking-[-0.015em] text-[#0B0C0F]">
              Kids already use AI. Few are shown how it works.
            </h2>
            <p className="mt-2.5 text-[17px] font-normal leading-[26px] text-[#5A5F6B]">
              School rarely has time for how AI decides, when it is wrong and what to keep private.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Problem Cards (Horizontal Scroll with snap on tablet, matching media_1793132805666.png) */}
        <ScrollReveal delay={100}>
          <div className="mt-7">
            <div
              ref={problemScrollRef}
              className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none"
            >
              {problemCardsData.map((item, idx) => (
                <div
                  key={idx}
                  className="w-[316px] shrink-0 snap-start rounded-[16px] border border-[#E3E1D9] bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  {/* Illustration Image from website */}
                  <div className="relative aspect-[652/344] w-full overflow-hidden rounded-xl bg-[#F4F3EE]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      unoptimized
                      quality={100}
                      sizes="316px"
                      className="object-contain transition-transform duration-700 ease-out hover:scale-105"
                    />
                  </div>

                  <div className="mt-5">
                    <h3 className="font-display text-[20px] font-semibold text-[#0B0C0F] leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-[#5A5F6B]">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="mt-2 flex justify-center gap-1.5">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveProblemIndex(idx);
                    if (problemScrollRef.current) {
                      problemScrollRef.current.scrollTo({
                        left: idx * 332,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    activeProblemIndex === idx ? "w-6 bg-[#FF6B2C]" : "w-1.5 bg-[#D1CFC7]"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 4: SOLUTION SECTION (768px x 564px, #0B0C0F)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#0B0C0F] px-10 py-[72px] text-white">
        <ScrollReveal>
          <div className="w-full">
            <h2 className="font-display text-[36px] font-normal leading-[41px] tracking-[-0.015em] text-white">
              LvlUp turns AI users into thoughtful builders.
            </h2>
            <p className="mt-2.5 text-[17px] font-normal leading-[26px] text-[#A7ACB8]">
              Every class mixes a short idea, a tutor demo and a lot of hands-on making.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Pillar Cards in 1 Row (Staggered Scroll Animation) */}
        <div className="mt-7 grid grid-cols-3 gap-3">
          {solutionPillars.map((p, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <div className="group/card flex flex-col overflow-hidden rounded-[14px] border border-[#23262F] bg-[#12141A] transition hover:border-[#FF6B2C]/60">
                {/* Crisp high-resolution photo with black-to-color transition */}
                <div className="relative h-[180px] w-full overflow-hidden bg-[#1D2027]">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    unoptimized
                    quality={100}
                    sizes="100vw"
                    className="object-cover grayscale transition-all duration-700 ease-out group-hover/card:grayscale-0 group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-transparent to-transparent opacity-70" />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="size-10 shrink-0 mb-3 overflow-hidden rounded-xl">
                    <Image
                      src={p.icon}
                      alt={`${p.title} icon`}
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-display text-[17px] font-semibold text-white">{p.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#A7ACB8]">{p.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 5: CURRICULUM (LEVELS ACCORDION, 768px x 1155px, #F4F3EE)
      ───────────────────────────────────────────────────────────── */}
      <section id="tablet-levels" className="w-full bg-[#F4F3EE] px-10 py-[72px] text-[#0B0C0F]">
        <ScrollReveal>
          <div>
            <h2 className="font-display text-[36px] font-normal leading-[41px] tracking-[-0.015em] text-[#0B0C0F]">
              Eight levels. One a week.
            </h2>
            <p className="mt-2.5 text-[17px] font-normal leading-[26px] text-[#5A5F6B]">
              Each 90-minute class ends with something your child made. Tap a level to see inside.
            </p>
          </div>
        </ScrollReveal>

        {/* Level 1 Expanded Showcase & Accordion List (Scroll Animated) */}
        <div className="mt-7 space-y-3">
          {curriculum.map((lvl, idx) => {
            const isOpen = openLevel === lvl.level;

            return (
              <ScrollReveal key={lvl.level} delay={idx * 40}>
                <div
                  className={cn(
                    "overflow-hidden rounded-[14px] border transition-all duration-300",
                    isOpen
                      ? "border-[#FF6B2C]/40 bg-white shadow-md"
                      : "border-[#E3E1D9] bg-white hover:border-[#D1CFC7]"
                  )}
                >
                  {/* Header item */}
                  <button
                    type="button"
                    onClick={() => setOpenLevel(isOpen ? null : lvl.level)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full text-[13px] font-bold transition",
                          isOpen
                            ? "bg-[#FF6B2C] text-white"
                            : "border border-[#E3E1D9] bg-[#F4F3EE] text-[#5A5F6B]"
                        )}
                      >
                        {lvl.level}
                      </span>
                      <div>
                        <h3 className="font-display text-[17px] font-normal text-[#0B0C0F]">
                          Level {lvl.level}: {lvl.title}
                        </h3>
                        <p className="text-[13px] text-[#5A5F6B]">{lvl.summary}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-5 text-[#5A5F6B] transition-transform duration-300",
                        isOpen && "rotate-180 text-[#FF6B2C]"
                      )}
                    />
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="border-t border-[#F4F3EE] p-5 pt-4">
                      <div className="grid grid-cols-[170px_1fr] gap-4 items-start">
                        {/* 170x200 photo */}
                        <div className="group/lvl relative h-[200px] w-[170px] overflow-hidden rounded-[10px] bg-[#E3E1D9]">
                          <Image
                            src={lvl.image?.src || "/images/curriculum/level-1-color.png"}
                            alt={lvl.image?.alt || "Student during class"}
                            fill
                            sizes="170px"
                            className="object-cover grayscale transition-all duration-500 group-hover/lvl:grayscale-0 group-hover/lvl:scale-105"
                          />
                        </div>

                        {/* Content details */}
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1.5">
                            {lvl.topics.map((t, tidx) => (
                              <span
                                key={tidx}
                                className="rounded-full bg-[#F4F3EE] px-2.5 py-1 text-[12px] font-medium text-[#0B0C0F]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* What they make card */}
                          <div className="rounded-[10px] border border-[#FFE3D4] bg-[#FFF8F5] p-3 text-[13px]">
                            <span className="font-semibold text-[#FF6B2C]">What they make: </span>
                            <span className="text-[#0B0C0F]">{lvl.makes}</span>
                          </div>

                          {/* What parents see */}
                          <div className="text-[12px] text-[#5A5F6B]">
                            <strong>Parents see: </strong>
                            {lvl.parentsSee}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Download Curriculum PDF Button */}
        <div className="mt-7 flex justify-center">
          <a
            href="/downloads/LvlUp-Eight-Week-Curriculum.pdf"
            download="LvlUp Eight-Week Curriculum.pdf"
            className="flex h-[47px] w-[266px] items-center justify-center gap-2 rounded-[8px] border border-[#2B2E36] bg-white text-[15px] font-semibold text-[#0B0C0F] shadow-xs hover:border-[#FF6B2C] hover:bg-[#FFFDF7] transition"
          >
            <Download className="size-4 text-[#FF6B2C]" />
            <span>Download full curriculum (PDF)</span>
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 6: OUTCOMES (Matching media_1793133182559.png & media_1793133196435.png)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#0B0C0F] px-10 py-[72px] text-white">
        <ScrollReveal>
          <div>
            <h2 className="font-display text-[36px] font-normal leading-[41px] tracking-[-0.015em] text-white">
              What your child walks away with
            </h2>
            <p className="mt-2.5 text-[17px] font-normal leading-[26px] text-[#A7ACB8]">
              Not a certificate for sitting through classes. Things they made, can show you, and can
              explain.
            </p>
          </div>
        </ScrollReveal>

        {/* Working AI Helper Large Card */}
        <ScrollReveal delay={100}>
          <div className="mt-8 rounded-[20px] border border-[#23262F] bg-[#12141A] p-6 shadow-2xl">
            <h3 className="font-display text-[22px] font-normal text-white">A working AI helper</h3>
            <p className="mt-1 text-[14px] text-[#A7ACB8]">
              Built from an approved template, tested on two tasks, shown live at demo day.
            </p>

            {/* Inner White Container matching media_1793133744260.png */}
            <div className="mt-5 overflow-hidden rounded-[16px] bg-white shadow-xl">
              <Image
                src="/images/outcomes-revise-buddy.png"
                alt="Revise Buddy chat example: photosynthesis quiz"
                width={1024}
                height={631}
                unoptimized
                quality={100}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* 2x2 Outcomes Tiles Grid (Matching media_1793133182559.png) */}
        <div className="mt-4 grid grid-cols-2 gap-3.5">
          {outcomesList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={idx} delay={idx * 60}>
                <div className="flex h-full flex-col justify-between rounded-[16px] border border-[#23262F] bg-[#12141A] p-5 transition hover:border-[#FF6B2C]/50">
                  <div>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[#FF6B2C]/10 text-[#FF6B2C] mb-3">
                      <Icon className="size-4.5" />
                    </div>
                    <h3 className="font-display text-[16px] font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#A7ACB8]">{item.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 7: AUDIENCE FIT (Matching media_1793133211512.png)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#F4F3EE] px-10 py-[72px] text-[#0B0C0F]">
        <ScrollReveal>
          <div>
            <h2 className="font-display text-[36px] font-normal leading-[41px] tracking-[-0.015em] text-[#0B0C0F]">
              Is LvlUp right for your child?
            </h2>
          </div>
        </ScrollReveal>

        {/* 4 Grade Cards in 1 Row (Grade 8 is full bright orange) */}
        <div className="mt-7 grid grid-cols-4 gap-3">
          {/* Grade 5 */}
          <ScrollReveal delay={60}>
            <div className="h-full rounded-[16px] border border-[#E3E1D9] bg-white p-4 text-left shadow-xs">
              <div className="flex items-baseline">
                <span className="font-display text-[34px] font-bold text-[#4057D6] leading-none">5</span>
                <span className="ml-1 text-[12px] font-semibold text-[#4057D6]">Grade</span>
              </div>
              <div className="mt-2 text-[14px] font-semibold text-[#0B0C0F]">Guided</div>
            </div>
          </ScrollReveal>

          {/* Grade 6 */}
          <ScrollReveal delay={120}>
            <div className="h-full rounded-[16px] border border-[#E3E1D9] bg-white p-4 text-left shadow-xs">
              <div className="flex items-baseline">
                <span className="font-display text-[34px] font-bold text-[#1F9D55] leading-none">6</span>
                <span className="ml-1 text-[12px] font-semibold text-[#1F9D55]">Grade</span>
              </div>
              <div className="mt-2 text-[14px] font-semibold text-[#0B0C0F]">More choice</div>
            </div>
          </ScrollReveal>

          {/* Grade 7 */}
          <ScrollReveal delay={180}>
            <div className="h-full rounded-[16px] border border-[#E3E1D9] bg-white p-4 text-left shadow-xs">
              <div className="flex items-baseline">
                <span className="font-display text-[34px] font-bold text-[#7350D3] leading-none">7</span>
                <span className="ml-1 text-[12px] font-semibold text-[#7350D3]">Grade</span>
              </div>
              <div className="mt-2 text-[14px] font-semibold text-[#0B0C0F]">More logic</div>
            </div>
          </ScrollReveal>

          {/* Grade 8 — Bright Orange background */}
          <ScrollReveal delay={240}>
            <div className="h-full rounded-[16px] bg-[#FF5520] p-4 text-left shadow-md">
              <div className="flex items-baseline">
                <span className="font-display text-[34px] font-bold text-[#0B0C0F] leading-none">8</span>
                <span className="ml-1 text-[12px] font-semibold text-[#0B0C0F]">Grade</span>
              </div>
              <div className="mt-2 text-[14px] font-semibold text-[#0B0C0F]">Independent</div>
            </div>
          </ScrollReveal>
        </div>

        {/* Side-by-Side: Good Fit vs Not Right Fit (Matching media_1793133211512.png) */}
        <div className="mt-6 grid grid-cols-2 gap-3.5 items-start">
          {/* Good Fit Column */}
          <ScrollReveal delay={100}>
            <div className="rounded-[20px] border border-[#1F9D55]/20 bg-[#F0FAF4] p-6">
              <h3 className="font-display text-[18px] font-normal text-[#0B0C0F] mb-4">
                A good fit if your child...
              </h3>
              <ul className="space-y-3 text-[14px] text-[#0B0C0F]">
                <li className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1F9D55] text-white">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                  <span>Is in Grade 5, 6, 7 or 8</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1F9D55] text-white">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                  <span>Is curious how apps and chatbots work</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1F9D55] text-white">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                  <span>Likes making things more than memorising</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1F9D55] text-white">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                  <span>Has never coded. No coding is needed</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* Not Right Fit Column */}
          <ScrollReveal delay={160}>
            <div className="rounded-[20px] border border-[#EB5757]/20 bg-[#FFF4F3] p-6">
              <h3 className="font-display text-[18px] font-normal text-[#0B0C0F] mb-4">
                Not the right fit if you want...
              </h3>
              <ul className="space-y-3 text-[14px] text-[#0B0C0F]">
                <li className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EB5757] text-white">
                    <X className="size-3.5 stroke-[3]" />
                  </div>
                  <span>Exam coaching or higher marks</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EB5757] text-white">
                    <X className="size-3.5 stroke-[3]" />
                  </div>
                  <span>One-to-one classes at home</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EB5757] text-white">
                    <X className="size-3.5 stroke-[3]" />
                  </div>
                  <span>A coding certificate for a job</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={200}>
          <p className="mt-6 text-left text-[14px] text-[#5A5F6B]">
            Not sure?{" "}
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#0B0C0F] underline hover:text-[#FF6B2C]"
            >
              Ask us on WhatsApp. A person replies.
            </a>
          </p>
        </ScrollReveal>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 8: PROOF (Matching media_1793133220722.png & media_1793133229637.png)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#0B0C0F] px-10 py-[72px] text-white">
        <ScrollReveal>
          <div>
            <h2 className="font-display text-[36px] font-normal leading-[41px] tracking-[-0.015em] text-white">
              See how we teach before you decide.
            </h2>
            <p className="mt-2.5 text-[17px] font-normal leading-[26px] text-[#A7ACB8]">
              We are running our first batches, so we show our work instead of asking you to trust a
              big number.
            </p>
          </div>
        </ScrollReveal>

        {/* Video Preview Card matching media_1793133229637.png */}
        <ScrollReveal delay={100}>
          <div className="group/video relative mt-7 h-[444px] w-full overflow-hidden rounded-[20px] border border-[#23262F] bg-[#12141A]">
            <Image
              src="/images/proof-class.png"
              alt="Classroom with children and tutor coding together"
              fill
              unoptimized
              quality={100}
              sizes="688px"
              className="object-cover grayscale contrast-[1.05] transition-all duration-700 ease-out group-hover/video:grayscale-0 group-hover/video:scale-105"
            />
            {/* Dark gradient fade for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

            {/* Top-left Badge */}
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/80 px-3.5 py-1 text-[12px] font-medium text-white backdrop-blur-md">
              <span className="size-2 rounded-full bg-[#FF6B2C]" />
              <span>3:12 · Level 4 class</span>
            </div>

            {/* Bottom-left Play Button & Title */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
              <div className="flex size-[64px] shrink-0 items-center justify-center rounded-full bg-[#FF6B2C] text-white shadow-[0_8px_30px_rgba(255,107,44,0.5)] transition hover:scale-110 active:scale-95 cursor-pointer">
                <Play className="size-7 fill-white ml-1" />
              </div>
              <div>
                <h3 className="font-display text-[22px] font-semibold text-white leading-tight">
                  Watch a real class
                </h3>
                <p className="mt-1 text-[14px] text-white/80">
                  Building interactive flows with Ms Ananya, Grade 6
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Meet the tutors */}
        <div className="mt-10">
          <ScrollReveal delay={80}>
            <h3 className="font-display text-[20px] font-normal text-white">Meet the tutors</h3>
          </ScrollReveal>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {/* Tutor 1 */}
            <ScrollReveal delay={100}>
              <div className="h-full rounded-[16px] border border-[#23262F] bg-[#12141A] p-4 text-left transition hover:border-[#FF6B2C]/50">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src="/images/tutors/ananya.jpg"
                      alt="Ananya Rao"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-[15px] font-semibold text-white">Ananya Rao</h4>
                    <p className="text-[12px] text-[#A7ACB8]">B.Tech, 4 years teaching</p>
                  </div>
                </div>
                <div className="mt-3.5 space-y-1.5 border-t border-[#23262F]/60 pt-3 text-[11px] text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#FF6B2C]" />
                    <span>Background-checked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#FF6B2C]" />
                    <span>LvlUp trained</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Tutor 2 */}
            <ScrollReveal delay={160}>
              <div className="h-full rounded-[16px] border border-[#23262F] bg-[#12141A] p-4 text-left transition hover:border-[#FF6B2C]/50">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src="/images/tutors/rohan.jpg"
                      alt="Rohan Mehta"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-[15px] font-semibold text-white">Rohan Mehta</h4>
                    <p className="text-[12px] text-[#A7ACB8]">Ran 30+ coding clubs</p>
                  </div>
                </div>
                <div className="mt-3.5 space-y-1.5 border-t border-[#23262F]/60 pt-3 text-[11px] text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#FF6B2C]" />
                    <span>Background-checked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#FF6B2C]" />
                    <span>LvlUp trained</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Tutor 3 */}
            <ScrollReveal delay={220}>
              <div className="h-full rounded-[16px] border border-[#23262F] bg-[#12141A] p-4 text-left transition hover:border-[#FF6B2C]/50">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src="/images/tutors/sana.jpg"
                      alt="Sana Qureshi"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-[15px] font-semibold text-white">Sana Qureshi</h4>
                    <p className="text-[12px] text-[#A7ACB8]">9 years teaching</p>
                  </div>
                </div>
                <div className="mt-3.5 space-y-1.5 border-t border-[#23262F]/60 pt-3 text-[11px] text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#FF6B2C]" />
                    <span>Background-checked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#FF6B2C]" />
                    <span>LvlUp trained</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={250}>
            <p className="mt-3 text-[13px] text-[#A7ACB8]">
              Every tutor teaches a demo class before we hire them.
            </p>
          </ScrollReveal>
        </div>

        {/* Orange Stats Strip (Matching media_1793133220722.png) */}
        <ScrollReveal delay={100}>
          <div className="mt-8 flex h-[90px] w-full items-center justify-around rounded-[16px] bg-[#FF6B2C] px-6 text-[#0B0C0F]">
            <div className="text-left">
              <div className="font-display text-[28px] font-bold leading-none">36 of 38</div>
              <div className="mt-1 text-[13px] font-semibold text-[#0B0C0F]/80">
                showed a working helper
              </div>
            </div>
            <div className="h-10 w-px bg-black/15" />
            <div className="text-left">
              <div className="font-display text-[28px] font-bold leading-none">94%</div>
              <div className="mt-1 text-[13px] font-semibold text-[#0B0C0F]/80">
                average attendance
              </div>
            </div>
            <div className="h-10 w-px bg-black/15" />
            <div className="text-left">
              <div className="font-display text-[28px] font-bold leading-none">2</div>
              <div className="mt-1 text-[13px] font-semibold text-[#0B0C0F]/80">
                partner schools
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 2 Parent Stories Side-by-Side (Matching media_1793133220722.png) */}
        <div className="mt-6 grid grid-cols-2 gap-3.5">
          <ScrollReveal delay={100}>
            <div className="flex h-full flex-col justify-between rounded-[16px] border border-[#23262F] bg-[#12141A] p-5">
              <p className="text-[14px] leading-relaxed text-white/90">
                “Meera showed us her homework helper, then explained why it got one answer wrong. That
                second part is what I wanted.”
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[#23262F]/60 pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative size-8 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src="/images/tutors/priya.jpg"
                      alt="Priya Sharma"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">Priya Sharma</div>
                    <div className="text-[11px] text-[#A7ACB8]">Parent, Grade 6</div>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                  Sample
                </span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <div className="flex h-full flex-col justify-between rounded-[16px] border border-[#23262F] bg-[#12141A] p-5">
              <p className="text-[14px] leading-relaxed text-white/90">
                “He used to ask a chatbot everything. Now he asks how it decided.”
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[#23262F]/60 pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative size-8 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src="/images/tutors/vikram.jpg"
                      alt="Vikram Iyer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">Vikram Iyer</div>
                    <div className="text-[11px] text-[#A7ACB8]">Parent, Grade 8</div>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                  Sample
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 9: CHILD SAFETY COMMITMENTS (Matching media_1793134529388.png)
      ───────────────────────────────────────────────────────────── */}
      <section id="tablet-safety" className="w-full bg-[#F4F3EE] py-[72px] text-[#0B0C0F]">
        <div className="mx-auto max-w-[768px] px-10">
          <ScrollReveal>
            <div>
              <h2 className="font-display text-[40px] font-normal leading-[46px] tracking-[-0.02em] text-[#0B0C0F]">
                Safe by design, and in writing.
              </h2>
              <p className="mt-2.5 text-[16px] text-[#5A5F6B]">
                Five commitments we sign with every school and share with every family.
              </p>
            </div>
          </ScrollReveal>

          {/* 2x3 Grid of 6 Cards Matching media_1793134529388.png */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {/* Card 1: A tutor in every class */}
            <ScrollReveal delay={60}>
              <div className="flex h-full items-center gap-4 rounded-[16px] bg-white p-4 shadow-none">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-[#FFE3D4]">
                  <UsersRound className="size-5 text-[#0B0C0F]" />
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-semibold text-[#0B0C0F] leading-tight">
                    A tutor in every class
                  </h3>
                  <p className="mt-1 text-[13px] text-[#5A5F6B]">
                    Children never use AI on their own with us.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Approved tools only */}
            <ScrollReveal delay={120}>
              <div className="flex h-full items-center gap-4 rounded-[16px] bg-white p-4 shadow-none">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-[#FFE3D4]">
                  <ShieldCheck className="size-5 text-[#FF6B2C]" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-semibold text-[#0B0C0F] leading-tight">
                    Approved tools only
                  </h3>
                  <p className="mt-1 text-[13px] text-[#5A5F6B]">
                    Accounts we set up and manage.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Your written consent first */}
            <ScrollReveal delay={180}>
              <div className="flex h-full items-center gap-4 rounded-[16px] bg-white p-4 shadow-none">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-[#FFE3D4]">
                  <Award className="size-5 text-[#FF6B2C]" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-semibold text-[#0B0C0F] leading-tight">
                    Your written consent first
                  </h3>
                  <p className="mt-1 text-[13px] text-[#5A5F6B]">
                    You can withdraw at any time.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 4: Minimal data, never sold */}
            <ScrollReveal delay={240}>
              <div className="flex h-full items-center gap-4 rounded-[16px] bg-white p-4 shadow-none">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-[#FFE3D4]">
                  <Lock className="size-5 text-[#0B0C0F]" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-semibold text-[#0B0C0F] leading-tight">
                    Minimal data, never sold
                  </h3>
                  <p className="mt-1 text-[13px] text-[#5A5F6B]">
                    Deleted when you ask.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 5: Safety is taught */}
            <ScrollReveal delay={300}>
              <div className="flex h-full items-center gap-4 rounded-[16px] bg-white p-4 shadow-none">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-[#FFE3D4]">
                  <div className="flex size-6 items-center justify-center rounded-[6px] bg-[#FF5520] text-black">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-semibold text-[#0B0C0F] leading-tight">
                    Safety is taught
                  </h3>
                  <p className="mt-1 text-[13px] text-[#5A5F6B]">
                    Level 1 ends with a safety pledge.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 6: Read child safety policy */}
            <ScrollReveal delay={360}>
              <a
                href="/safety"
                className="flex h-full items-center justify-between rounded-[16px] bg-[#0B0C0F] px-5 py-4 text-white transition hover:bg-[#15171C]"
              >
                <div>
                  <h3 className="font-display text-[15px] font-semibold text-white leading-tight">
                    Read the full child safety policy
                  </h3>
                  <p className="mt-1 text-[13px] text-[#A7ACB8]">PDF · tools, data, who sees it</p>
                </div>
                <ArrowRight className="size-5 text-white" />
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 10: PROCESS: HOW JOINING WORKS (Exact Figma Specs)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="tablet-process"
        className="w-full bg-[#0B0C0F] text-white"
        style={{ padding: "72px 40px" }}
      >
        <div className="mx-auto flex w-[688px] flex-col items-start gap-[28px]">
          {/* Header */}
          <ScrollReveal>
            <div className="flex w-[688px] flex-col items-start gap-[10px]">
              <h2 className="font-display text-[36px] font-medium leading-[41px] tracking-[-0.015em] text-white">
                How joining works
              </h2>
            </div>
          </ScrollReveal>

          {/* Steps */}
          <div className="flex w-[688px] flex-row flex-wrap items-start content-start gap-[12px]">
            {/* Step 1 */}
            <ScrollReveal delay={50}>
              <div className="box-border flex w-[221px] min-h-[114px] flex-row items-start gap-[14px] rounded-[14px] border border-[#2B2E36] bg-[#141519] p-[16px] text-left transition hover:border-[#FF6B2C]/50">
                <div className="flex size-[28px] shrink-0 items-center justify-center rounded-[14px] bg-[#1C1E24]">
                  <span className="font-sans text-[13px] font-semibold leading-[16px] text-white">
                    1
                  </span>
                </div>
                <div className="flex w-[145px] flex-col items-start gap-[2px]">
                  <h3 className="font-sans text-[15px] font-semibold leading-[21px] text-white">
                    Get your school code
                  </h3>
                  <p className="font-sans text-[13px] font-normal leading-[18px] text-[#A7ACB8]">
                    In your school’s circular or WhatsApp.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={100}>
              <div className="box-border flex w-[221px] min-h-[114px] flex-row items-start gap-[14px] rounded-[14px] border border-[#2B2E36] bg-[#141519] p-[16px] text-left transition hover:border-[#FF6B2C]/50">
                <div className="flex size-[28px] shrink-0 items-center justify-center rounded-[14px] bg-[#1C1E24]">
                  <span className="font-sans text-[13px] font-semibold leading-[16px] text-white">
                    2
                  </span>
                </div>
                <div className="flex w-[145px] flex-col items-start gap-[2px]">
                  <h3 className="font-sans text-[15px] font-semibold leading-[21px] text-white">
                    Enrol online
                  </h3>
                  <p className="font-sans text-[13px] font-normal leading-[18px] text-[#A7ACB8]">
                    Two minutes, on your phone.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={150}>
              <div className="box-border flex w-[221px] min-h-[114px] flex-row items-start gap-[14px] rounded-[14px] border border-[#2B2E36] bg-[#141519] p-[16px] text-left transition hover:border-[#FF6B2C]/50">
                <div className="flex size-[28px] shrink-0 items-center justify-center rounded-[14px] bg-[#1C1E24]">
                  <span className="font-sans text-[13px] font-semibold leading-[16px] text-white">
                    3
                  </span>
                </div>
                <div className="flex w-[145px] flex-col items-start gap-[2px]">
                  <h3 className="font-sans text-[15px] font-semibold leading-[21px] text-white">
                    Pay in full or in two parts
                  </h3>
                  <p className="font-sans text-[13px] font-normal leading-[18px] text-[#A7ACB8]">
                    ₹4,499 in full, or ₹4,999 in two parts.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 4 */}
            <ScrollReveal delay={200}>
              <div className="box-border flex w-[221px] min-h-[93px] flex-row items-start gap-[14px] rounded-[14px] border border-[#2B2E36] bg-[#141519] p-[16px] text-left transition hover:border-[#FF6B2C]/50">
                <div className="flex size-[28px] shrink-0 items-center justify-center rounded-[14px] bg-[#1C1E24]">
                  <span className="font-sans text-[13px] font-semibold leading-[16px] text-white">
                    4
                  </span>
                </div>
                <div className="flex w-[145px] flex-col items-start gap-[2px]">
                  <h3 className="font-sans text-[15px] font-semibold leading-[21px] text-white">
                    Meet us online
                  </h3>
                  <p className="font-sans text-[13px] font-normal leading-[18px] text-[#A7ACB8]">
                    A 30-minute parent session.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 5 */}
            <ScrollReveal delay={250}>
              <div className="box-border flex w-[221px] min-h-[93px] flex-row items-start gap-[14px] rounded-[14px] border border-[#2B2E36] bg-[#141519] p-[16px] text-left transition hover:border-[#FF6B2C]/50">
                <div className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#1C1E24]">
                  <span className="font-sans text-[13px] font-semibold leading-[16px] text-white">
                    5
                  </span>
                </div>
                <div className="flex w-[145px] flex-col items-start gap-[2px]">
                  <h3 className="font-sans text-[15px] font-semibold leading-[21px] text-white">
                    Level up each week
                  </h3>
                  <p className="font-sans text-[13px] font-normal leading-[18px] text-[#A7ACB8]">
                    Updates after levels 2, 4 and 6.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 6 */}
            <ScrollReveal delay={300}>
              <div className="box-border flex w-[221px] min-h-[93px] flex-row items-start gap-[14px] rounded-[14px] border border-[#2B2E36] bg-[#141519] p-[16px] text-left transition hover:border-[#FF6B2C]/50">
                <div className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#FF6B2C]">
                  <span className="font-sans text-[13px] font-semibold leading-[16px] text-[#0B0C0F]">
                    6
                  </span>
                </div>
                <div className="flex w-[145px] flex-col items-start gap-[2px]">
                  <h3 className="font-sans text-[15px] font-semibold leading-[21px] text-white">
                    Demo day
                  </h3>
                  <p className="font-sans text-[13px] font-normal leading-[18px] text-[#A7ACB8]">
                    Your child presents at school.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 11: PRICING (Matching media_1793134529388.png)
      ───────────────────────────────────────────────────────────── */}
      <section id="tablet-pricing" className="w-full bg-[#F4F3EE] py-[72px] text-[#0B0C0F]">
        <div className="mx-auto max-w-[768px] px-10">
          <ScrollReveal>
            <div>
              <h2 className="font-display text-[40px] font-normal leading-[46px] tracking-[-0.02em] text-[#0B0C0F]">
                One course. Everything included.
              </h2>
              <p className="mt-2 text-[16px] text-[#5A5F6B]">
                Two ways to pay for the same course. Paying in full costs less.
              </p>
            </div>
          </ScrollReveal>

          {/* Dark Price Card (Matching media_1793134529388.png) */}
          <ScrollReveal delay={100}>
            <div className="mt-8 rounded-[24px] border border-[#23262F] bg-[#0E1015] p-8 text-white shadow-xl">
              {/* Standard fee + discount badge */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[14px] text-white/60">
                  Standard fee <span className="line-through text-white/40 ml-1">₹15,000</span>
                </span>
                <span className="rounded-full bg-[#109E58] px-2.5 py-0.5 text-[11px] font-bold text-white tracking-wide ml-1">
                  Up to 70% off
                </span>
              </div>

              {/* Pay in full vs Pay in two parts side by side */}
              <div className="grid grid-cols-2 gap-4">
                {/* Pay in full */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("full")}
                  className={cn(
                    "flex items-center justify-between rounded-[16px] border p-4 text-left transition",
                    selectedPlan === "full"
                      ? "border-2 border-[#FF6B2C] bg-[#16181F]"
                      : "border border-[#23262F] bg-[#16181F]/50 opacity-70 hover:opacity-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Radio circle */}
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-[#FF6B2C]">
                      {selectedPlan === "full" && (
                        <div className="size-2.5 rounded-full bg-[#FF6B2C]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-[15px] font-semibold text-white">
                          Pay in full
                        </span>
                        <span className="rounded-full bg-[#109E58] px-2 py-0.5 text-[10px] font-bold text-white">
                          Save ₹500
                        </span>
                      </div>
                      <p className="text-[12px] text-[#A7ACB8] mt-0.5">
                        One payment when you enrol
                      </p>
                    </div>
                  </div>
                  <div className="font-display text-[28px] font-normal text-white">
                    ₹4,499
                  </div>
                </button>

                {/* Pay in two parts */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan("parts")}
                  className={cn(
                    "flex items-center justify-between rounded-[16px] border p-4 text-left transition",
                    selectedPlan === "parts"
                      ? "border-2 border-[#FF6B2C] bg-[#16181F]"
                      : "border border-[#23262F] bg-[#16181F]/50 opacity-70 hover:opacity-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Radio circle */}
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-white/30">
                      {selectedPlan === "parts" && (
                        <div className="size-2.5 rounded-full bg-[#FF6B2C]" />
                      )}
                    </div>
                    <div>
                      <div className="font-display text-[15px] font-semibold text-white">
                        Pay in two parts
                      </div>
                      <p className="text-[12px] text-[#A7ACB8] mt-0.5">
                        ₹2,500 now, ₹2,499 by level 5
                      </p>
                    </div>
                  </div>
                  <div className="font-display text-[28px] font-normal text-white">
                    ₹4,999
                  </div>
                </button>
              </div>

              {/* Inclusions 2x2 with orange check badges */}
              <div className="my-6 grid grid-cols-2 gap-x-6 gap-y-3.5 text-[14px] text-white/90">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C] text-black">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>8 tutor-led classes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C] text-black">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>All materials and tools</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C] text-black">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Progress updates</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C] text-black">
                    <Check className="size-3 stroke-[3]" />
                  </div>
                  <span>Demo day and portfolio</span>
                </div>
              </div>

              {/* Ember Button */}
              <button
                type="button"
                onClick={() => {
                  setIsEnrolFormOpen(true);
                  scrollTo("tablet-enrol");
                }}
                className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-[#FF8B4E] via-[#FF6B2C] to-[#F2561A] text-[16px] font-semibold text-[#0B0C0F] shadow-[0px_10px_28px_-8px_rgba(255,107,44,0.35)] transition hover:brightness-105 active:scale-95"
              >
                <span>Enrol and pay {selectedPlan === "full" ? "₹4,499" : "₹4,999"}</span>
                <ArrowRight className="size-4 stroke-[2.5]" />
              </button>

              {/* Subtext below button */}
              <p className="mt-3.5 text-[13px] text-[#A7ACB8]">
                Partner school prices. Paid to LvlUp, not your school.
              </p>
            </div>
          </ScrollReveal>

          {/* Peach Promise Card (Matching media_1793134529388.png) */}
          <ScrollReveal delay={150}>
            <div className="mt-5 rounded-[20px] bg-[#FFE5D4] p-7 text-[#0B0C0F]">
              <div className="font-mono text-[12px] uppercase tracking-wider text-[#5A5F6B] font-medium">
                Our promise
              </div>
              <p className="mt-2.5 font-display text-[22px] font-normal leading-[1.3] text-[#0B0C0F]">
                Comes to 6 of 8 classes but can’t show a working AI helper at demo day? We refund ₹2,499.
              </p>
              <p className="mt-2.5 text-[14px] text-[#5A5F6B]">
                No laptop, kits, subscriptions or certificate fee to pay.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 12 & 13: ENROL SECTION (Matching media_1793133718295.png)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="tablet-enrol"
        className="w-full bg-[radial-gradient(55.56%_38.46%_at_16.67%_65.38%,#FFF1E7_0%,#F4F3EE_100%)] py-[72px] text-[#0B0C0F]"
      >
        <div className="mx-auto max-w-[768px] px-10">
          <ScrollReveal>
            <div>
              <h2 className="font-display text-[40px] font-normal leading-[46px] tracking-[-0.02em] text-[#0B0C0F]">
                Enrol your child
              </h2>
              <p className="mt-2.5 text-[16px] text-[#5A5F6B]">
                It takes about three minutes. Keep your school code handy. Your school shares it with
                parents.
              </p>
            </div>
          </ScrollReveal>

          {/* 3 Step Pills in 1 row (Matching UI media_1793185887921_574f6b36.png) */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {/* Step 1 */}
            <ScrollReveal delay={60}>
              <div className="flex h-full items-center gap-3.5 rounded-[20px] bg-white p-5 shadow-xs border border-black/[0.04]">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-xs font-bold text-white">
                  1
                </span>
                <div>
                  <div className="font-display text-[15px] font-bold text-[#0B0C0F] leading-snug">
                    Fill in the form
                  </div>
                  <div className="mt-1 text-[13px] text-[#5A5F6B] leading-relaxed">
                    Your child's details and yours
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={120}>
              <div className="flex h-full items-center gap-3.5 rounded-[20px] bg-white p-5 shadow-xs border border-black/[0.04]">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white text-xs font-bold text-[#0B0C0F]">
                  2
                </span>
                <div>
                  <div className="font-display text-[15px] font-bold text-[#0B0C0F] leading-snug">
                    Choose how to pay
                  </div>
                  <div className="mt-1 text-[13px] text-[#5A5F6B] leading-relaxed">
                    ₹4,499 in full or ₹4,999 in two parts
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={180}>
              <div className="flex h-full items-center gap-3.5 rounded-[20px] bg-white p-5 shadow-xs border border-black/[0.04]">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white text-xs font-bold text-[#0B0C0F]">
                  3
                </span>
                <div>
                  <div className="font-display text-[15px] font-bold text-[#0B0C0F] leading-snug">
                    Get confirmation
                  </div>
                  <div className="mt-1 text-[13px] text-[#5A5F6B] leading-relaxed">
                    On WhatsApp, with the start date
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Row below pills: Start enrolment button + Text beside it */}
          {!isEnrolFormOpen && (
            <ScrollReveal delay={220}>
              <div className="mt-8 flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setIsEnrolFormOpen(true)}
                  className="flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[#FF5722] px-6 text-[15px] font-bold text-[#0B0C0F] shadow-[0_10px_20px_-5px_rgba(255,87,34,0.35)] transition hover:brightness-105 active:scale-95"
                >
                  <span>Start enrolment</span>
                  <ArrowRight className="size-4 stroke-[2.5]" />
                </button>
                <p className="text-[14px] text-[#5A5F6B]">
                  No school code? Ask your class teacher or <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#FF6B2C]">WhatsApp us</a>.
                </p>
              </div>
            </ScrollReveal>
          )}

          {/* Expanded Student Details & Enrolment Form */}
          {isEnrolFormOpen && (
            <div className="mt-7 rounded-[18px] border border-[#E3E1D9] bg-white p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
              {enrolSubmitted ? (
                <div className="py-4 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#109e58] text-white shadow-sm">
                    <Check className="size-6 stroke-[3]" />
                  </div>
                  <h3 className="mt-4 font-display text-[22px] font-normal text-[#0B0C0F]">
                    Enrolment request received!
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#5A5F6B]">
                    Thank you! We've sent a confirmation to WhatsApp at{" "}
                    <strong className="text-black font-semibold">
                      {mobileNum || "+91 98765 43210"}
                    </strong>{" "}
                    for {childName || "your child"}.
                  </p>
                  <div className="mt-5 rounded-xl bg-[#F4F3EE] p-4 text-left text-[13px] text-[#5A5F6B] space-y-1.5">
                    <p>
                      <strong className="text-[#0B0C0F]">Child:</strong> {childName || "Asha"} (
                      {childGrade}, Sec {childSec})
                    </p>
                    <p>
                      <strong className="text-[#0B0C0F]">School Code:</strong> {schoolCode}
                    </p>
                    <p>
                      <strong className="text-[#0B0C0F]">Plan:</strong>{" "}
                      {selectedPlan === "full" ? "₹4,499 in full" : "₹2,499 in two parts"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnrolSubmitted(false)}
                    className="mt-5 inline-block text-[13px] font-semibold text-[#FF6B2C] underline"
                  >
                    Edit details or enrol another child
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnrolSubmit} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[#E3E1D9] pb-3">
                    <h3 className="font-display text-[18px] font-normal text-[#0B0C0F]">
                      Student & Parent Details
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEnrolFormOpen(false)}
                      className="text-[13px] text-[#5A5F6B] hover:text-black font-medium"
                    >
                      Close form
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B0C0F]">
                        Child's full name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="As on school records"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="mt-1.5 w-full rounded-[8px] border border-[#E3E1D9] bg-[#F4F3EE] px-3.5 py-2.5 text-sm text-[#0B0C0F] placeholder:text-[#9ca3af] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B0C0F]">
                        School code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PUNE-0427"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        className="mt-1.5 w-full rounded-[8px] border border-[#E3E1D9] bg-[#F4F3EE] px-3.5 py-2.5 text-sm text-[#0B0C0F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B0C0F]">Grade</label>
                      <select
                        value={childGrade}
                        onChange={(e) => setChildGrade(e.target.value)}
                        className="mt-1.5 w-full rounded-[8px] border border-[#E3E1D9] bg-[#F4F3EE] px-3.5 py-2.5 text-sm text-[#0B0C0F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                      >
                        <option>Grade 5</option>
                        <option>Grade 6</option>
                        <option>Grade 7</option>
                        <option>Grade 8</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B0C0F]">Section</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. A"
                        value={childSec}
                        onChange={(e) => setChildSec(e.target.value)}
                        className="mt-1.5 w-full rounded-[8px] border border-[#E3E1D9] bg-[#F4F3EE] px-3.5 py-2.5 text-sm text-[#0B0C0F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B0C0F]">
                        Parent's name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Primary contact"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="mt-1.5 w-full rounded-[8px] border border-[#E3E1D9] bg-[#F4F3EE] px-3.5 py-2.5 text-sm text-[#0B0C0F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B0C0F]">
                        WhatsApp number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={mobileNum}
                        onChange={(e) => setMobileNum(e.target.value)}
                        className="mt-1.5 w-full rounded-[8px] border border-[#E3E1D9] bg-[#F4F3EE] px-3.5 py-2.5 text-sm text-[#0B0C0F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex h-[48px] w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-b from-[#FF8B4E] via-[#FF6B2C] to-[#F2561A] text-[16px] font-semibold text-[#0B0C0F] shadow-[0px_10px_28px_-8px_rgba(255,107,44,0.35)] transition hover:brightness-105 active:scale-95 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <>
                        <span>Complete enrolment & pay</span>
                        <ArrowRight className="size-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 14: FAQ SECTION (Matching UI media_1793185911617_46502380.png)
      ───────────────────────────────────────────────────────────── */}
      <section id="tablet-faq" className="w-full bg-[#F4F3EE] py-[72px] text-[#0B0C0F]">
        <div className="mx-auto max-w-[768px] px-10">
          <ScrollReveal>
            <div>
              <h2 className="font-display text-[40px] font-normal leading-[46px] tracking-[-0.02em] text-[#0B0C0F]">
                Questions parents ask
              </h2>
            </div>
          </ScrollReveal>

          {/* Tab switcher: Segmented Control matching UI */}
          <ScrollReveal delay={80}>
            <div className="mt-6 inline-flex rounded-[10px] bg-[#E3E1D9]/70 p-1">
              <button
                type="button"
                onClick={() => {
                  setFaqTab("parents");
                  setOpenFaq(0);
                }}
                className={cn(
                  "rounded-[8px] px-4 py-1.5 text-[14px] font-semibold transition",
                  faqTab === "parents"
                    ? "bg-white text-[#0B0C0F] shadow-xs"
                    : "text-[#5A5F6B] hover:text-[#0B0C0F]"
                )}
              >
                For parents
              </button>
              <button
                type="button"
                onClick={() => {
                  setFaqTab("schools");
                  setOpenFaq(0);
                }}
                className={cn(
                  "rounded-[8px] px-4 py-1.5 text-[14px] font-semibold transition",
                  faqTab === "schools"
                    ? "bg-white text-[#0B0C0F] shadow-xs"
                    : "text-[#5A5F6B] hover:text-[#0B0C0F]"
                )}
              >
                For schools
              </button>
            </div>
          </ScrollReveal>

          {/* FAQ Accordion List (Matching UI) */}
          <div className="mt-6 space-y-3">
            {(faqTab === "parents" ? parentFaq : schoolFaq).map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <ScrollReveal key={idx} delay={idx * 30}>
                  <div className="overflow-hidden rounded-[14px] border border-[#E3E1D9] bg-white transition-all duration-200">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-5 text-left"
                    >
                      <span className="font-sans text-[15px] font-semibold text-[#0B0C0F] pr-4">
                        {faq.question}
                      </span>
                      <div className="flex size-5 shrink-0 items-center justify-center text-[#0B0C0F]">
                        {isOpen ? (
                          <Minus className="size-4 stroke-[2.5]" />
                        ) : (
                          <Plus className="size-4 stroke-[2.5]" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 text-[14px] leading-relaxed text-[#5A5F6B]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Footer note matching UI */}
          <ScrollReveal delay={100}>
            <p className="mt-8 text-[14px] leading-relaxed text-[#5A5F6B]">
              Something else? WhatsApp us at <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline text-black font-normal hover:text-[#FF6B2C]">{siteConfig.whatsappLabel}</a>. A person replies within a few hours. We only
              message you about your child’s batch, and you can reply STOP at any time.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SCREEN 15: SCHOOLS SECTION (Matching UI media_1793185920198_774ab8a7.png)
      ───────────────────────────────────────────────────────────── */}
      <section id="tablet-schools" className="w-full bg-[#0B0C0F] py-[72px] text-white">
        <div className="mx-auto max-w-[768px] px-10">
          <ScrollReveal>
            <div>
              <h2 className="font-display text-[44px] font-medium leading-[50px] tracking-[-0.02em] text-white">
                Bring LvlUp to your school.
              </h2>
              <p className="mt-3 text-[17px] leading-[26px] text-[#A7ACB8] max-w-[688px]">
                We bring trained tutors, every lesson, enrolment, fees and parent updates. Your
                school hosts one class a week in its computer lab.
              </p>
            </div>
          </ScrollReveal>

          {/* 4 School Perk Badges (Matching UI) */}
          <ScrollReveal delay={80}>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#1C1E24] px-3.5 py-1.5 text-[13px] font-medium text-white">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C]">
                  <Check className="size-2.5 stroke-[3] text-black" />
                </span>
                <span>No extra work for teachers</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#1C1E24] px-3.5 py-1.5 text-[13px] font-medium text-white">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C]">
                  <Check className="size-2.5 stroke-[3] text-black" />
                </span>
                <span>Maps to CBSE AI topics</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#1C1E24] px-3.5 py-1.5 text-[13px] font-medium text-white">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C]">
                  <Check className="size-2.5 stroke-[3] text-black" />
                </span>
                <span>Partner fee per student</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-[#1C1E24] px-3.5 py-1.5 text-[13px] font-medium text-white">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C]">
                  <Check className="size-2.5 stroke-[3] text-black" />
                </span>
                <span>Demo day at level 8</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Get a Callback Card (White Card Matching UI) */}
          <ScrollReveal delay={120}>
            <div className="mt-8 rounded-[28px] bg-white p-8 sm:p-10 text-[#0B0C0F] shadow-2xl">
              <h3 className="font-display text-[28px] font-medium text-[#0B0C0F]">
                Get a callback
              </h3>
              <p className="mt-1.5 text-[15px] text-[#5A5F6B]">
                For schools. Our partnerships team calls within one working day.
              </p>

              {schoolSubmitted ? (
                <div className="mt-6 rounded-[12px] bg-[#1F9D55]/15 p-5 text-[#1F9D55] text-[15px]">
                  ✓ Callback requested! Our school partnerships team will get in touch within one working day.
                </div>
              ) : (
                <form onSubmit={handleSchoolSubmit} className="mt-7 space-y-5">
                  {/* School name (Full width) */}
                  <div>
                    <label className="block text-[14px] font-medium text-[#0B0C0F] mb-2">
                      School name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. [School name]"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="h-[52px] w-full rounded-[12px] border border-[#E3E1D9] bg-[#F4F3EE] px-4 text-[15px] text-[#0B0C0F] placeholder:text-[#8A8F9E] focus:border-[#0B0C0F] focus:outline-none transition"
                    />
                  </div>

                  {/* Your name & Role (2 columns) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[14px] font-medium text-[#0B0C0F] mb-2">
                        Your name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Priya Sharma"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="h-[52px] w-full rounded-[12px] border border-[#E3E1D9] bg-[#F4F3EE] px-4 text-[15px] text-[#0B0C0F] placeholder:text-[#8A8F9E] focus:border-[#0B0C0F] focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[14px] font-medium text-[#0B0C0F] mb-2">
                        Role
                      </label>
                      <div className="relative">
                        <select
                          value={schoolRole}
                          onChange={(e) => setSchoolRole(e.target.value)}
                          className="h-[52px] w-full appearance-none rounded-[12px] border border-[#E3E1D9] bg-[#F4F3EE] px-4 pr-10 text-[15px] text-[#0B0C0F] cursor-pointer focus:border-[#0B0C0F] focus:outline-none transition"
                        >
                          <option value="Principal">Principal</option>
                          <option value="Vice Principal">Vice Principal</option>
                          <option value="Head of Computer Science">Head of Computer Science</option>
                          <option value="Trustee / Management">Trustee / Management</option>
                          <option value="Teacher">Teacher</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#5A5F6B]" />
                      </div>
                    </div>
                  </div>

                  {/* City & Phone (2 columns) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[14px] font-medium text-[#0B0C0F] mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Pune"
                        value={schoolCity}
                        onChange={(e) => setSchoolCity(e.target.value)}
                        className="h-[52px] w-full rounded-[12px] border border-[#E3E1D9] bg-[#F4F3EE] px-4 text-[15px] text-[#0B0C0F] placeholder:text-[#8A8F9E] focus:border-[#0B0C0F] focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[14px] font-medium text-[#0B0C0F] mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10 digits"
                        value={schoolPhone}
                        onChange={(e) => setSchoolPhone(e.target.value)}
                        className="h-[52px] w-full rounded-[12px] border border-[#E3E1D9] bg-[#F4F3EE] px-4 text-[15px] text-[#0B0C0F] placeholder:text-[#8A8F9E] focus:border-[#0B0C0F] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#0B0C0F] text-[16px] font-semibold text-white transition hover:bg-[#1A1D24] active:scale-[0.99]"
                  >
                    <span>Get a callback</span>
                    <ArrowRight className="size-4 stroke-[2.5]" />
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* Download School Pack Link */}
          <ScrollReveal delay={160}>
            <div className="mt-8">
              <a
                href="/downloads/LvlUp-Eight-Week-Curriculum.pdf"
                download="LvlUp Eight-Week Curriculum.pdf"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-white underline underline-offset-4 transition hover:text-[#FF6B2C]"
              >
                <Download className="size-4.5" />
                <span>Download the school pack (PDF)</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FINAL CTA BANNER (Matching UI media_1793186377886_4903ccb9.png)
      ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#FF6B2C] py-14 text-[#0B0C0F]">
        <div className="mx-auto max-w-[768px] px-10">
          <ScrollReveal>
            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="font-display text-[40px] font-normal leading-[46px] tracking-[-0.02em] text-[#0B0C0F]">
                  Ready for level 1?
                </h2>
                <p className="mt-2.5 text-[16px] text-[#0B0C0F]/90 leading-relaxed">
                  Enrol with your school code, or ask us to bring LvlUp to your school.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEnrolFormOpen(true);
                  scrollTo("tablet-enrol");
                }}
                className="flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[#0B0C0F] px-6 text-[15px] font-medium text-white shadow-md transition hover:bg-[#1A1D24] active:scale-95"
              >
                <span>Enrol now</span>
                <ArrowRight className="size-4 stroke-[2]" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER (Matching UI media_1793186386087_97ac03d6.png)
      ───────────────────────────────────────────────────────────── */}
      <footer className="w-full bg-[#0B0C0F] py-14 text-[#A7ACB8]">
        <div className="mx-auto max-w-[768px] px-10">
          <ScrollReveal>
            {/* Logo using website logo */}
            <div className="flex items-center gap-2.5">
              <Image src="/icons/logo.svg" alt="LvlUp" width={32} height={32} priority />
              <span className="font-display text-[22px] font-semibold tracking-[-0.03em] text-white">
                Lvl<span className="text-[#FF6B2C]">Up</span>
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-[15px] leading-relaxed text-[#A7ACB8]">
              An eight-week AI course for Grades 5–8, taught by trained tutors at your child’s school.
            </p>

            {/* Nav links row */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-[15px] font-medium text-white">
              <button onClick={() => scrollTo("tablet-levels")} className="hover:text-[#FF6B2C] transition">
                Levels
              </button>
              <button onClick={() => scrollTo("tablet-safety")} className="hover:text-[#FF6B2C] transition">
                Safety
              </button>
              <button onClick={() => scrollTo("tablet-pricing")} className="hover:text-[#FF6B2C] transition">
                Fees
              </button>
              <button onClick={() => scrollTo("tablet-faq")} className="hover:text-[#FF6B2C] transition">
                FAQ
              </button>
              <button onClick={() => scrollTo("tablet-schools")} className="hover:text-[#FF6B2C] transition">
                For schools
              </button>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#FF6B2C] transition"
              >
                WhatsApp {siteConfig.whatsappLabel}
              </a>
              <a href={siteConfig.emailUrl} className="hover:text-[#FF6B2C] transition">
                {siteConfig.emailLabel}
              </a>
            </div>

            {/* Divider */}
            <div className="mt-8 border-t border-[#23262F]/60" />

            {/* Bottom legal line */}
            <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-[#8A8F9E]">
              <span>© 2026 LvlUp</span>
              <span>·</span>
              <a href={legalLinks.privacy} className="hover:text-white transition">
                Privacy
              </a>
              <span>·</span>
              <a href={legalLinks.childSafety} className="hover:text-white transition">
                Child safety
              </a>
              <span>·</span>
              <a href={legalLinks.refunds} className="hover:text-white transition">
                Refunds
              </a>
              <span>·</span>
              <a href={legalLinks.terms} className="hover:text-white transition">
                Terms
              </a>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </div>
  );
}
