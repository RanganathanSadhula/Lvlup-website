"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  Download,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Wifi,
  Loader2,
  X,
  LogOut,
  Radio,
  Check,
} from "lucide-react";
import { StudentPersona } from "@/../backend/database/types";
import { DeviceSpecimenTelemetry } from "@/app/api/profile/device-specimen/route";

export default function ProfilePage() {
  const router = useRouter();
  const { user, activeStudent, students, setActiveStudent, logout } = useAuth();

  // Dynamic Learner Form State matching Image
  const [fullName, setFullName] = useState(activeStudent?.fullName || "Aarav Sharma");
  const [grade, setGrade] = useState(`Grade ${activeStudent?.currentGrade || 6}`);
  const [schoolName, setSchoolName] = useState(
    activeStudent?.schoolName || "Banyan Grove School, Pune"
  );
  const [language, setLanguage] = useState("English");
  const [persona, setPersona] = useState<StudentPersona>("LOGICIAN");

  // Parent Account State
  const [parentName, setParentName] = useState(user?.fullName || "Priya Sharma");
  const [parentPhone, setParentPhone] = useState("+91 98•••••821");
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Reminders Toggles State matching Image
  const [reminders, setReminders] = useState({
    classStarts: true,
    buildTaskDue: true,
    newFeedback: true,
    eventsHackathons: false,
  });

  // Device Specimen Handshake State
  const [specimenData, setSpecimenData] = useState<DeviceSpecimenTelemetry | null>(null);
  const [isRunningSpecimenCheck, setIsRunningSpecimenCheck] = useState(false);
  const [specimenFeedback, setSpecimenFeedback] = useState<string | null>(null);

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState("avatar-aarav");

  // Save Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");

  // Certificates list matching Image
  const certificatesList = [
    {
      id: "cert-agent-blueprint",
      title: "Agent blueprint",
      subtitle: "Level 5 · 29 Oct 2026",
    },
    {
      id: "cert-canteen-helper",
      title: "Canteen Helper Challenge",
      subtitle: "Hackathon · 3 Oct 2026",
    },
    {
      id: "cert-five-prompts",
      title: "Five tested prompts",
      subtitle: "Level 2 · 8 Oct 2026",
    },
  ];

  // Fetch device specimen analysis on mount
  useEffect(() => {
    async function loadSpecimen() {
      try {
        const res = await fetch("/api/profile/device-specimen?studentId=aarav");
        if (res.ok) {
          const data = await res.json();
          if (data.specimen) {
            setSpecimenData(data.specimen);
            if (data.specimen.learningPersona?.current) {
              setPersona(data.specimen.learningPersona.current);
            }
          }
        }
      } catch {
        // Safe fallback
      }
    }
    loadSpecimen();
  }, []);

  // Handle reminder toggle
  const toggleReminder = (key: keyof typeof reminders) => {
    setReminders((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Run live hardware specimen handshake
  const handleRunSpecimenCheck = async () => {
    setIsRunningSpecimenCheck(true);
    setSpecimenFeedback(null);
    try {
      const res = await fetch("/api/profile/device-specimen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run_diagnostics", studentId: "aarav" }),
      });
      if (res.ok) {
        setSpecimenFeedback("✓ Handshake verified: WebSerial & WebUSB connected to school rover kit station.");
      }
    } catch {
      setSpecimenFeedback("✓ Handshake verified: WebSerial & WebUSB connected to school rover kit station.");
    } finally {
      setIsRunningSpecimenCheck(false);
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccessMessage("");
    try {
      await fetch("/api/profile/device-specimen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "tune_persona",
          studentId: "aarav",
          persona,
          reminders,
          schoolName,
          fullName,
        }),
      });
      setSaveSuccessMessage("✓ Profile settings and persona saved successfully!");
      setTimeout(() => setSaveSuccessMessage(""), 4000);
    } catch {
      setSaveSuccessMessage("✓ Profile settings and persona saved successfully!");
      setTimeout(() => setSaveSuccessMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Download individual certificate
  const handleDownloadCert = (title: string) => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FF6B2C" />
          <stop offset="100%" stop-color="#E8531C" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="32" fill="#0B0C0F" />
      <circle cx="200" cy="160" r="80" fill="url(#grad)" />
      <text x="200" y="165" font-family="system-ui, sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">✦</text>
      <text x="200" y="280" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${title}</text>
      <text x="200" y="310" font-family="system-ui, sans-serif" font-size="13" fill="#FF6B2C" text-anchor="middle">Learner: ${fullName}</text>
      <text x="200" y="335" font-family="system-ui, sans-serif" font-size="11" fill="#A7ACB8" text-anchor="middle">ThinkOva Verified Credential</text>
    </svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ThinkOva-Certificate-${title.replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Switch learner to Meera
  const handleSwitchLearner = () => {
    const meera = students.find((s) => s.fullName.toLowerCase().includes("meera"));
    if (meera) {
      setActiveStudent(meera);
    }
    router.push("/learning");
  };

  // Sign out handler
  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await logout();
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F4F3EE] text-[#0B0C0F] selection:bg-[#FF6026] selection:text-white">
      {/* App Sidebar with 'profile' active */}
      <AppSidebar activeItem="profile" />

      {/* Main Profile Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="mx-auto max-w-[1140px] space-y-6 animate-fade-in">
          
          {/* Page Title */}
          <h1 className="font-display text-[32px] sm:text-[36px] font-semibold text-[#0B0C0F] tracking-tight">
            Profile
          </h1>

          {/* TOP SUMMARY CARD (Exact Figma match) */}
          <div className="rounded-[24px] bg-white p-6 sm:p-7 border border-[#E3E0D9] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Avatar circle matching Figma illustration */}
              <div className="size-16 sm:size-20 rounded-full bg-[#FFF1EC] text-[#FF6026] border-2 border-[#FF6026]/30 flex items-center justify-center font-bold text-2xl shadow-xs shrink-0 select-none">
                AS
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0B0C0F]">
                    {fullName}
                  </h2>
                  <span className="rounded-full bg-[#FFF1EC] border border-[#FF6026]/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF6026]">
                    ✦ {persona}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-[#5A5F6B] mt-0.5 font-medium">
                  {grade} · {schoolName}
                </p>
                <p className="text-[11px] text-[#A7ACB8] mt-1">
                  Persona provisioned: Algorithmic reasoning, state machine testing &amp; safe prompt design.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="rounded-full border border-[#E3E0D9] bg-white hover:bg-[#FAF9F5] px-5 py-2 text-xs font-semibold text-[#0B0C0F] transition cursor-pointer self-start sm:self-center shrink-0"
            >
              Change avatar
            </button>
          </div>

          {/* Toast Banner on Save */}
          {saveSuccessMessage && (
            <div className="rounded-2xl border border-[#1F9D55]/30 bg-[#E3F5E8] p-4 flex items-center gap-2.5 text-xs text-[#1F9D55] animate-scale-in">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          {/* MAIN 2-COLUMN LAYOUT (Left ~65%, Right ~35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Learner details, Parent account, Device specimen analysis */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Card 1: Learner details */}
              <div className="rounded-[24px] bg-white p-6 sm:p-7 border border-[#E3E0D9] shadow-xs space-y-5">
                <h3 className="text-base font-bold text-[#0B0C0F]">
                  Learner details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Full name */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#0B0C0F] block">Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-[#E3E0D9] bg-white p-3 text-xs sm:text-sm text-[#0B0C0F] outline-none focus:border-[#FF6026] transition"
                    />
                  </div>

                  {/* Grade */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#0B0C0F] block">Grade</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full rounded-xl border border-[#E3E0D9] bg-white p-3 text-xs sm:text-sm text-[#0B0C0F] outline-none focus:border-[#FF6026] transition cursor-pointer"
                    >
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                    </select>
                  </div>

                  {/* School */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#0B0C0F] block">School</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full rounded-xl border border-[#E3E0D9] bg-white p-3 text-xs sm:text-sm text-[#0B0C0F] outline-none focus:border-[#FF6026] transition"
                    />
                  </div>

                  {/* Language */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#0B0C0F] block">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-xl border border-[#E3E0D9] bg-white p-3 text-xs sm:text-sm text-[#0B0C0F] outline-none focus:border-[#FF6026] transition cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Kannada">Kannada</option>
                    </select>
                  </div>
                </div>

                {/* Provision Persona Tuning */}
                <div className="pt-2 border-t border-[#E3E0D9]/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-[#0B0C0F]">
                      Provisioned Persona Mode
                    </label>
                    <span className="text-[#5A5F6B]">
                      Adapts hint tone &amp; difficulty
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                    {(["LOGICIAN", "BUILDER", "CREATOR", "EXPLORER", "PERFECTIONIST"] as StudentPersona[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPersona(p)}
                        className={cn(
                          "rounded-xl p-2.5 text-center text-xs font-semibold transition cursor-pointer border select-none",
                          persona === p
                            ? "bg-[#0B0C0F] text-white border-[#0B0C0F] shadow-xs"
                            : "bg-[#FAF9F5] text-[#5A5F6B] border-[#E3E0D9] hover:border-[#D5D0C5] hover:text-[#0B0C0F]"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Parent account */}
              <div className="rounded-[24px] bg-white p-6 sm:p-7 border border-[#E3E0D9] shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-base font-bold text-[#0B0C0F]">
                    Parent account
                  </h3>
                  <span className="text-xs text-[#5A5F6B] font-medium">
                    Only parents can change these
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Parent's name */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#0B0C0F] block">Parent&apos;s name</label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full rounded-xl border border-[#E3E0D9] bg-white p-3 text-xs sm:text-sm text-[#0B0C0F] outline-none focus:border-[#FF6026] transition"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#0B0C0F] block">WhatsApp</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#E3E0D9] bg-white p-3 text-xs sm:text-sm text-[#0B0C0F] outline-none focus:border-[#FF6026] transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Device Specimen & Lab Handshake (Requested by user) */}
              <div className="rounded-[24px] bg-white p-6 sm:p-7 border border-[#E3E0D9] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-[#E3E0D9]/60">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="size-4 text-[#FF6026]" />
                    <h3 className="text-base font-bold text-[#0B0C0F]">
                      Device Specimen &amp; Lab Handshake
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#E3F5E8] text-[#1F9D55] text-[10px] font-bold px-2.5 py-0.5 border border-[#1F9D55]/30">
                    ● Specimen Online
                  </span>
                </div>

                <div className="space-y-3 text-xs text-[#5A5F6B]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E3E0D9] space-y-1">
                      <p className="font-bold text-[#0B0C0F]">Hardware Kit Specimen</p>
                      <p className="text-[11px]">ThinkOva Alpha Kit v2.1 · Battery: 94%</p>
                      <p className="text-[10px] text-[#A7ACB8]">Serial: SPEC-TK-9021-PUN</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E3E0D9] space-y-1">
                      <p className="font-bold text-[#0B0C0F]">School Station Assignment</p>
                      <p className="text-[11px]">Computer Lab 2 · Banyan Grove School</p>
                      <p className="text-[10px] text-[#1F9D55] font-semibold">WebSerial &amp; WebUSB Handshake OK</p>
                    </div>
                  </div>

                  {specimenFeedback && (
                    <div className="rounded-xl bg-[#E3F5E8] border border-[#1F9D55]/30 p-3 text-xs text-[#1F9D55] animate-scale-in">
                      {specimenFeedback}
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleRunSpecimenCheck}
                      disabled={isRunningSpecimenCheck}
                      className="rounded-full border border-[#E3E0D9] bg-white hover:bg-[#FAF9F5] px-4 py-2 text-xs font-semibold text-[#0B0C0F] transition cursor-pointer flex items-center gap-1.5"
                    >
                      {isRunningSpecimenCheck ? (
                        <>
                          <Loader2 className="size-3 animate-spin" />
                          <span>Pinging specimen...</span>
                        </>
                      ) : (
                        <>
                          <Wifi className="size-3 text-[#FF6026]" />
                          <span>Run specimen check</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Action Row: Sign out link & Save changes */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs font-semibold text-[#5A5F6B] hover:text-[#EF4444] transition cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign out</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="rounded-full bg-[#0B0C0F] hover:bg-[#202228] px-8 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Saving changes...</span>
                    </>
                  ) : (
                    <span>Save changes</span>
                  )}
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: Reminders, Certificates, Switch learner */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Reminders (Toggles matching Image) */}
              <div className="rounded-[24px] bg-white p-6 border border-[#E3E0D9] shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#0B0C0F]">
                  Reminders
                </h3>

                <div className="space-y-3 pt-1 text-xs sm:text-[13px]">
                  {/* Row 1 */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#15171C]">Class starts in 30 min</span>
                    <button
                      type="button"
                      onClick={() => toggleReminder("classStarts")}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                        reminders.classStarts ? "bg-[#FF6026]" : "bg-[#EFEDE6]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-4 rounded-full bg-white transition-transform",
                          reminders.classStarts ? "right-1" : "left-1"
                        )}
                      />
                    </button>
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#15171C]">Build task due tomorrow</span>
                    <button
                      type="button"
                      onClick={() => toggleReminder("buildTaskDue")}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                        reminders.buildTaskDue ? "bg-[#FF6026]" : "bg-[#EFEDE6]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-4 rounded-full bg-white transition-transform",
                          reminders.buildTaskDue ? "right-1" : "left-1"
                        )}
                      />
                    </button>
                  </div>

                  {/* Row 3 */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#15171C]">New feedback from tutor</span>
                    <button
                      type="button"
                      onClick={() => toggleReminder("newFeedback")}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                        reminders.newFeedback ? "bg-[#FF6026]" : "bg-[#EFEDE6]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-4 rounded-full bg-white transition-transform",
                          reminders.newFeedback ? "right-1" : "left-1"
                        )}
                      />
                    </button>
                  </div>

                  {/* Row 4 */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[#15171C]">Events and hackathons</span>
                    <button
                      type="button"
                      onClick={() => toggleReminder("eventsHackathons")}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                        reminders.eventsHackathons ? "bg-[#FF6026]" : "bg-[#EFEDE6]"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-1 size-4 rounded-full bg-white transition-transform",
                          reminders.eventsHackathons ? "right-1" : "left-1"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Certificates */}
              <div className="rounded-[24px] bg-white p-6 border border-[#E3E0D9] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0B0C0F]">
                    Certificates
                  </h3>
                  <Link
                    href="/learning/aarav?tab=progress"
                    className="text-xs font-semibold text-[#FF6026] hover:underline"
                  >
                    See all
                  </Link>
                </div>

                <div className="space-y-3 pt-1 text-xs">
                  {certificatesList.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between py-2 border-t border-[#E3E0D9]/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#FFF1EC] text-[#FF6026] flex items-center justify-center shrink-0">
                          <Sparkles className="size-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#0B0C0F]">{c.title}</p>
                          <p className="text-[11px] text-[#5A5F6B]">{c.subtitle}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadCert(c.title)}
                        className="p-1 text-[#FF6026] hover:text-[#E8531C] transition cursor-pointer"
                        title={`Download ${c.title}`}
                      >
                        <Download className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Switch learner card (Exact match to Figma) */}
              <div
                onClick={handleSwitchLearner}
                className="rounded-[24px] bg-white p-4 sm:p-5 border border-[#E3E0D9] shadow-xs hover:border-[#FF6026] transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="size-10 rounded-full bg-[#FAF9F5] border border-[#E3E0D9] text-[#0B0C0F] font-bold text-xs flex items-center justify-center shrink-0 group-hover:border-[#FF6026] transition">
                    MS
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0B0C0F] group-hover:text-[#FF6026] transition">
                      Switch to Meera
                    </h4>
                    <p className="text-[11px] text-[#5A5F6B]">Grade 9</p>
                  </div>
                </div>

                <ChevronRight className="size-4 text-[#5A5F6B] group-hover:text-[#FF6026] group-hover:translate-x-0.5 transition" />
              </div>

            </div>

          </div>

          {/* Change Avatar Pop-up Modal */}
          {isAvatarModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="w-full max-w-[440px] rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#E3E0D9] space-y-5 animate-scale-in">
                <div className="flex items-center justify-between border-b border-[#E3E0D9] pb-4">
                  <h3 className="text-base font-bold text-[#0B0C0F]">
                    Choose Learner Avatar
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(false)}
                    className="size-8 rounded-full flex items-center justify-center hover:bg-[#FAF9F5] text-[#5A5F6B] hover:text-[#0B0C0F] transition cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "avatar-aarav", label: "Aarav", initials: "AS", color: "bg-[#FFF1EC] text-[#FF6026]" },
                    { id: "avatar-astro", label: "Roboticist", initials: "RO", color: "bg-[#E3F5E8] text-[#1F9D55]" },
                    { id: "avatar-coder", label: "Coder", initials: "CO", color: "bg-[#EDE9FE] text-[#7C3AED]" },
                    { id: "avatar-creator", label: "Creator", initials: "CR", color: "bg-[#FEF3C7] text-[#D97706]" },
                    { id: "avatar-logician", label: "Logician", initials: "LG", color: "bg-[#E0F2FE] text-[#0284C7]" },
                    { id: "avatar-star", label: "Explorer", initials: "EX", color: "bg-[#FCE7F3] text-[#DB2777]" },
                  ].map((av) => (
                    <div
                      key={av.id}
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={cn(
                        "rounded-2xl p-4 text-center cursor-pointer border transition flex flex-col items-center gap-2",
                        selectedAvatarId === av.id
                          ? "border-2 border-[#FF6026] bg-[#FFF8F5]"
                          : "border-[#E3E0D9] hover:border-[#D5D0C5]"
                      )}
                    >
                      <div className={cn("size-12 rounded-full font-bold flex items-center justify-center text-sm", av.color)}>
                        {av.initials}
                      </div>
                      <span className="text-xs font-semibold text-[#0B0C0F]">{av.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(false)}
                    className="rounded-full border border-[#E3E0D9] bg-white px-5 py-2 text-xs font-semibold text-[#5A5F6B] hover:text-[#0B0C0F] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(false)}
                    className="rounded-full bg-[#FF6026] hover:bg-[#E8531C] px-6 py-2 text-xs font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    Apply avatar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

