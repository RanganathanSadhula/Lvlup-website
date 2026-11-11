"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  ArrowLeft,
  Send,
  MessageSquare,
  Bot,
  User,
  ShieldAlert,
  Loader2,
  PhoneCall,
  Mail,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { StudentAvatar } from "@/components/ui/StudentAvatar";

interface Milestone {
  id: string;
  weekNumber: number;
  title: string;
  summary: string;
  completed: boolean;
  score?: number;
  tutorNote?: string;
}

interface ProgressData {
  id: string;
  courseTitle: string;
  trackId: string;
  status: string;
  currentWeek: number;
  totalWeeks: number;
  completedMinutes: number;
  totalEstimatedMinutes: number;
  lengthLeftMinutes: number;
  completionPercentage: number;
  persona: string;
  frequencyLabel: string;
  milestones: Milestone[];
  streakDays: number;
}

interface AnalysisData {
  persona: string;
  frequencyScore: number;
  completionVelocity: number;
  lengthLeftWeeks: number;
  followRoute: string;
  strengths: string[];
  areasOfGrowth: string[];
  parentReportPill: string;
}

export default function LearningPortalPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = String(params?.studentId || "student");

  const [studentName, setStudentName] = useState("Aarav Sharma");
  const [currentGrade, setCurrentGrade] = useState(6);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Interactive Chatbot Simulator for AI Track
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    { sender: "bot", text: "Hi! I'm your study buddy. What do you want to do today?" },
    { sender: "bot", text: "1. Learn a topic\n2. Take a quiz\n3. Get study tips\n4. Exit" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/learning/progress?studentId=${studentId}`);
        const data = await res.json();
        if (data.success && data.student) {
          setStudentName(data.student.fullName);
          setCurrentGrade(data.student.currentGrade || 6);
          if (data.progress) setProgress(data.progress);
          if (data.analysis) setAnalysis(data.analysis);
        }
      } catch (e) {
        console.warn("Could not load progress", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [studentId]);

  const handleToggleMilestone = async (milestoneId: string) => {
    try {
      const res = await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, milestoneId }),
      });
      const data = await res.json();
      if (data.success && data.progress) {
        setProgress(data.progress);
      }
    } catch (e) {
      console.warn("Failed to toggle milestone", e);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMessage("");
    setBotTyping(true);

    setTimeout(() => {
      let reply = "Great answer! In our school lab, we're programming this logic into our edge microcontroller!";
      if (userText.includes("1") || userText.toLowerCase().includes("learn")) {
        reply = "Let's learn about Ultrasonic Sensors! They emit sound waves at 40kHz to calculate distance. Distance = (Speed × Time) / 2!";
      } else if (userText.includes("2") || userText.toLowerCase().includes("quiz")) {
        reply = "Quiz time! What sensor did our robot rover use to steer around the classroom wall? (Hint: HC-SR04)";
      } else if (userText.includes("3") || userText.toLowerCase().includes("tip")) {
        reply = "Study Tip: Break big coding challenges into small state diagrams on paper first, just like in your ThinkOva notebook!";
      }

      setChatMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setBotTyping(false);
    }, 600);
  };

  const completionPct = progress?.completionPercentage ?? 25;
  const lengthLeftMins = progress?.lengthLeftMinutes ?? 450;
  const currentWeek = progress?.currentWeek ?? 1;
  const persona = progress?.persona || analysis?.persona || "LOGICIAN";

  return (
    <div className="min-h-screen w-full bg-[#0B0C0F] text-white selection:bg-[#FF6026] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 h-20 w-full border-b border-white/[0.08] bg-[#0B0C0F]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              ● Active Learning Lab
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/who-is-learning"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-semibold text-white hover:border-[#FF6026] transition"
            >
              <ArrowLeft className="size-3.5" />
              <span>Who&apos;s learning</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Learning Hub */}
      <main className="mx-auto max-w-[1360px] px-6 py-10 sm:px-8 sm:py-12">
        {/* Student Profile & Progress Banner */}
        <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative size-16 sm:size-20 overflow-hidden rounded-full border-2 border-[#FF6026] shadow-lg">
                <StudentAvatar name={studentName} size={80} />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{studentName}</h1>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/80">
                    Grade {currentGrade}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#FF8B4E] font-medium">
                  {progress?.courseTitle || "AI & Agents: Build a Study Bot"}
                </p>
                <p className="text-xs text-white/50">
                  {progress?.frequencyLabel || "1 live in-school lab/week + 90 min guided sandbox"}
                </p>
              </div>
            </div>

            {/* Persona & Multi-State Analytics Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-[#FF6026]/30 bg-[#FF6026]/10 px-4 py-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#FF8B4E]">Persona</span>
                <span className="text-sm font-bold text-white">✨ {persona}</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/50">Frequency</span>
                <span className="text-sm font-bold text-white">100% Attendance</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/50">Length Left</span>
                <span className="text-sm font-bold text-white">{Math.round(lengthLeftMins / 60)}h remaining</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-white">
                Week {currentWeek} of {progress?.totalWeeks || 6}
              </span>
              <span className="text-[#FF8B4E]">{completionPct}% Completed</span>
            </div>
            <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF6026] to-[#E05316] transition-all duration-500"
                style={{ width: `${Math.max(8, completionPct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Two-Column Learning Console: Milestones Roadmap & Interactive Chatbot Simulator */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Syllabus Milestones & Tutor Feedback (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Course Milestones & Lab Roadmap</h2>
                <p className="text-xs text-white/60">Tap any lab milestone to verify completion & tutor feedback.</p>
              </div>
              <span className="text-xs font-semibold text-[#FF8B4E] bg-[#FF6026]/10 px-3 py-1 rounded-full border border-[#FF6026]/20">
                School Demo Day 6 Dec
              </span>
            </div>

            <div className="space-y-3">
              {(progress?.milestones || [
                { id: "m_1", weekNumber: 1, title: "Lab Orientation & Prompt Setup", summary: "Introduction to hardware kit and bot development environment.", completed: true, score: 95, tutorNote: "Quick start! Completed lab safety orientation." },
                { id: "m_2", weekNumber: 2, title: "Sensory Input & Conversation Nodes", summary: "Wiring input transducers or programming branching response logic.", completed: false },
                { id: "m_3", weekNumber: 3, title: "Autonomous Decision Rules & Feedback Loops", summary: "State machine logic and ultrasonic/agent error handling.", completed: false },
                { id: "m_4", weekNumber: 4, title: "Telemetry & Multi-Turn State Retention", summary: "Variables, persistent memory, and live telemetry readout.", completed: false },
                { id: "m_5", weekNumber: 5, title: "Fail-Safe Hardening & Stress Testing", summary: "Boundary testing, obstacle recovery, and edge-case prompt guards.", completed: false },
                { id: "m_6", weekNumber: 6, title: "School Demo Day Presentation & Live Defense", summary: "Showcase working robot/agent live in front of tutors and parents.", completed: false },
              ]).map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleToggleMilestone(m.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    m.completed
                      ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full mt-0.5 text-xs font-bold ${
                          m.completed ? "bg-emerald-500 text-white" : "border border-white/20 bg-white/5 text-white/60"
                        }`}
                      >
                        {m.completed ? <Check className="size-3.5" /> : m.weekNumber}
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold ${m.completed ? "text-emerald-300" : "text-white"}`}>
                          Week {m.weekNumber}: {m.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-white/60">{m.summary}</p>
                        {m.tutorNote && (
                          <p className="mt-2 text-xs italic text-[#FF8B4E]">
                            &ldquo;{m.tutorNote}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    {m.score && (
                      <span className="shrink-0 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400">
                        {m.score}/100
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Bot Simulator (matching Image 2 "My Chatbot") (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bot className="size-5 text-[#FF6026]" />
                Interactive Agent Simulator
              </h2>
              <span className="text-[11px] font-semibold text-white/40">Lab Sandbox</span>
            </div>

            {/* Laptop Screen Simulator matching Image 2 */}
            <div className="rounded-[28px] border border-white/15 bg-[#14161D] p-5 shadow-2xl flex flex-col h-[520px]">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-full bg-[#FF6026] text-white">
                    <Bot className="size-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">My Chatbot</span>
                    <span className="block text-[10px] text-emerald-400">● Live on School Device</span>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  Small ideas build big things :)
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#20232B] text-white">
                        <Bot className="size-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 leading-[18px] whitespace-pre-line ${
                        msg.sender === "user"
                          ? "bg-[#FF6026] text-white font-medium"
                          : "bg-white/10 text-white/90 border border-white/10"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {botTyping && (
                  <div className="flex items-center gap-2 text-xs text-white/50 italic">
                    <Loader2 className="size-3.5 animate-spin" />
                    Study buddy is thinking...
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message or choice (e.g. 1)..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-[#FF6026]"
                />
                <button
                  type="submit"
                  className="flex size-9 items-center justify-center rounded-xl bg-[#FF6026] text-white hover:bg-[#E8531C] transition shrink-0"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>

            {/* Notification Automation Log */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/70 space-y-2">
              <span className="block font-bold text-white text-[11px] uppercase tracking-wider">
                Automations & Notification Ledger
              </span>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="size-3.5" />
                <span>OpenWA WhatsApp: Orientation & Batch Roster Confirmed</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="size-3.5" />
                <span>Microsoft Graph: Syllabus Pack & Lab Pass dispatched</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

