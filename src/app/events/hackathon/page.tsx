"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  Check,
  CheckCircle2,
  Users,
  Plus,
  Loader2,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { AVAILABLE_CLASSMATES } from "@/data/events-data";

export default function HackathonRegistrationPage() {
  const { activeStudent } = useAuth();
  const studentName = activeStudent?.fullName || "Aarav Sharma";

  const [teamMembers, setTeamMembers] = useState([
    {
      id: "tm-1",
      name: `${studentName.split(" ")[0] || "Aarav"} (you)`,
      role: "Team lead",
      avatarInitials: "AS",
      status: "lead",
    },
    {
      id: "tm-2",
      name: "Rohan",
      role: "Invited · waiting",
      avatarInitials: "RV",
      status: "invited",
    },
  ]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedClassmateId, setSelectedClassmateId] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleInviteClassmate = () => {
    const cm = AVAILABLE_CLASSMATES.find((c) => c.id === selectedClassmateId);
    if (!cm) return;

    if (teamMembers.some((m) => m.name.includes(cm.name.split(" ")[0]!))) {
      setIsInviteModalOpen(false);
      return;
    }

    const newMember = {
      id: `tm-${Date.now()}`,
      name: cm.name.split(" ")[0] || cm.name,
      role: "Invited · waiting",
      avatarInitials: cm.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2),
      status: "invited",
    };

    setTeamMembers((prev) => [...prev, newMember]);
    setSelectedClassmateId("");
    setIsInviteModalOpen(false);
  };

  const handleRegisterTeam = async () => {
    setIsRegistering(true);
    setFeedbackMessage("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register_team",
          teamName: "Build for your School Innovators",
          members: teamMembers,
        }),
      });

      if (res.ok) {
        setIsRegistered(true);
        setFeedbackMessage("✓ Team registered successfully! Tutor Ms Ananya will review your project scope.");
      }
    } catch {
      setIsRegistered(true);
      setFeedbackMessage("✓ Team registered successfully! Tutor Ms Ananya will review your project scope.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F4F3EE] text-[#0B0C0F] selection:bg-[#FF6026] selection:text-white">
      {/* App Sidebar with 'events' active */}
      <AppSidebar activeItem="events" />

      {/* Main Hackathon Registration Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="mx-auto max-w-[1140px] space-y-6 animate-fade-in">

          {/* Breadcrumbs: Events / Hackathon */}
          <div className="flex items-center gap-2 text-xs text-[#5A5F6B]">
            <Link href="/events" className="hover:text-[#0B0C0F] transition">
              Events
            </Link>
            <span className="text-[#A7ACB8]">/</span>
            <span className="font-semibold text-[#0B0C0F]">Hackathon</span>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="rounded-full bg-[#FFF1EC] px-3.5 py-1 text-xs font-semibold text-[#FF6026]">
              Hackathon
            </span>
            <span className="rounded-full bg-[#F4F3EE] border border-[#E3E0D9] px-3.5 py-1 text-xs font-semibold text-[#5A5F6B]">
              22–29 Nov
            </span>
            <span className="rounded-full bg-[#F4F3EE] border border-[#E3E0D9] px-3.5 py-1 text-xs font-semibold text-[#5A5F6B]">
              Online
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="font-display text-[32px] sm:text-[38px] font-semibold text-[#0B0C0F] tracking-tight">
              Build for your school
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#5A5F6B] max-w-3xl leading-relaxed">
              Find a real problem at your school and fix it with what you&apos;ve learned. Any track counts:
              a robot, a sensor, a game, a product or an agent.
            </p>
          </div>

          {/* Registration Success Banner */}
          {isRegistered && (
            <div className="rounded-2xl border border-[#1F9D55]/30 bg-[#E3F5E8] p-4 flex items-center justify-between text-xs text-[#1F9D55] animate-scale-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0 stroke-[2.5]" />
                <div>
                  <p className="font-bold text-sm">Team registration confirmed!</p>
                  <p className="text-[#0B0C0F] mt-0.5">
                    Your team is set for Build Week (22–28 Nov). Check-ins with Ms Ananya start Sunday.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#1F9D55] shadow-xs">
                Status: Registered
              </span>
            </div>
          )}

          {/* Main 2-Column Layout (Left ~65%, Right ~35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
            
            {/* LEFT COLUMN: How it runs, What to submit, What you get */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Card 1: How it runs */}
              <div className="rounded-[24px] bg-white p-7 sm:p-8 border border-[#E3E0D9] shadow-xs space-y-6">
                <h2 className="text-base font-bold text-[#0B0C0F]">How it runs</h2>

                <div className="space-y-5">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <div className="size-6 rounded-full bg-[#0B0C0F] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0B0C0F]">Register your team</h3>
                      <p className="text-xs text-[#5A5F6B] mt-0.5">By Fri 20 Nov</p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-[#E3E0D9]/60 ml-10" />

                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <div className="size-6 rounded-full bg-[#0B0C0F] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0B0C0F]">Build week</h3>
                      <p className="text-xs text-[#5A5F6B] mt-0.5">22–28 Nov · daily tutor check-ins</p>
                    </div>
                  </div>

                  <div className="h-px w-full bg-[#E3E0D9]/60 ml-10" />

                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="size-6 rounded-full bg-[#0B0C0F] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0B0C0F]">Show and results</h3>
                      <p className="text-xs text-[#5A5F6B] mt-0.5">Sun 29 Nov · 5 minutes per team</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: What to submit */}
              <div className="rounded-[24px] bg-white p-7 sm:p-8 border border-[#E3E0D9] shadow-xs space-y-4">
                <h2 className="text-base font-bold text-[#0B0C0F]">What to submit</h2>

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E3F5E8] text-[#1F9D55] text-xs font-bold">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-[13px] text-[#0B0C0F]">
                      A working project your teacher can try
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E3F5E8] text-[#1F9D55] text-xs font-bold">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-[13px] text-[#0B0C0F]">
                      A 2-minute demo video
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E3F5E8] text-[#1F9D55] text-xs font-bold">
                      <Check className="size-3 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-[13px] text-[#0B0C0F]">
                      One page: the problem, your build, what you&apos;d do next
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: What you get */}
              <div className="rounded-[24px] bg-white p-7 sm:p-8 border border-[#E3E0D9] shadow-xs space-y-4">
                <h2 className="text-base font-bold text-[#0B0C0F]">What you get</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="rounded-2xl border border-[#E3E0D9] bg-[#FAF9F5] p-4 text-xs font-semibold text-[#0B0C0F] flex items-center justify-center text-center min-h-[58px]">
                    Daily tutor check-ins
                  </div>
                  <div className="rounded-2xl border border-[#E3E0D9] bg-[#FAF9F5] p-4 text-xs font-semibold text-[#0B0C0F] flex items-center justify-center text-center min-h-[58px]">
                    Feedback on every project
                  </div>
                  <div className="rounded-2xl border border-[#E3E0D9] bg-[#FAF9F5] p-4 text-xs font-semibold text-[#0B0C0F] flex items-center justify-center text-center min-h-[58px]">
                    A certificate for your portfolio
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Your team card & Registration closes */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Your team */}
              <div className="rounded-[24px] bg-white p-6 border border-[#E3E0D9] shadow-xs space-y-5">
                <div>
                  <h3 className="text-base font-bold text-[#0B0C0F]">Your team</h3>
                  <p className="text-xs text-[#5A5F6B] mt-1 leading-relaxed">
                    Teams of 2 to 4 from your batch. Your tutor approves teams.
                  </p>
                </div>

                {/* Team Members List */}
                <div className="space-y-3 pt-1">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E3E0D9]/60"
                    >
                      <div className="size-9 rounded-full bg-[#FFF1EC] text-[#FF6026] flex items-center justify-center font-bold text-xs shrink-0">
                        {member.avatarInitials}
                      </div>
                      <div className="text-xs flex-1">
                        <p className="font-bold text-[#0B0C0F]">{member.name}</p>
                        <p className="text-[11px] text-[#5A5F6B]">{member.role}</p>
                      </div>
                      {member.status === "lead" ? (
                        <span className="rounded-full bg-[#E3F5E8] text-[#1F9D55] text-[10px] font-bold px-2 py-0.5">
                          Lead
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#FAF9F5] text-[#5A5F6B] text-[10px] font-medium px-2 py-0.5 border border-[#E3E0D9]">
                          Waiting
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Invite Classmate Trigger */}
                {teamMembers.length < 4 && (
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(true)}
                    className="w-full rounded-2xl border-2 border-dashed border-[#E3E0D9] hover:border-[#FF6026] hover:bg-[#FFFDFB] p-3 text-center text-xs font-semibold text-[#0B0C0F] transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="size-3.5" />
                    <span>Invite a classmate</span>
                  </button>
                )}

                {/* Register Team Button */}
                <button
                  type="button"
                  onClick={handleRegisterTeam}
                  disabled={isRegistering || isRegistered}
                  className={cn(
                    "w-full rounded-full py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center gap-2",
                    isRegistered
                      ? "bg-[#1F9D55] hover:bg-[#188044]"
                      : "bg-[#FF6026] hover:bg-[#E8531C]"
                  )}
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Registering team...</span>
                    </>
                  ) : isRegistered ? (
                    <>
                      <Check className="size-4 stroke-[3]" />
                      <span>Team registered ✓</span>
                    </>
                  ) : (
                    <>
                      <span>Register team</span>
                      <span>→</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#5A5F6B] text-center">
                  Free for enrolled learners. Needs a parent&apos;s consent.
                </p>
              </div>

              {/* Card 2: Registration closes */}
              <div className="rounded-[24px] bg-[#FFF8F5] border border-[#FF6026]/20 p-6 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6026]">
                  REGISTRATION CLOSES
                </span>
                <p className="text-xl sm:text-2xl font-bold text-[#0B0C0F]">
                  Fri 20 Nov
                </p>
                <p className="text-xs text-[#5A5F6B]">
                  12 teams registered so far
                </p>
              </div>

            </div>

          </div>

          {/* Invite Classmate Pop-up Modal */}
          {isInviteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="w-full max-w-[480px] rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#E3E0D9] space-y-5 animate-scale-in">
                <div className="flex items-center justify-between border-b border-[#E3E0D9] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full bg-[#FFF1EC] text-[#FF6026] flex items-center justify-center font-bold text-xs">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0B0C0F]">
                        Invite a classmate
                      </h3>
                      <p className="text-xs text-[#5A5F6B]">
                        Select from your Grade 6 batch
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="size-8 rounded-full flex items-center justify-center hover:bg-[#FAF9F5] text-[#5A5F6B] hover:text-[#0B0C0F] transition cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Classmate Selection List */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {AVAILABLE_CLASSMATES.map((cm) => {
                    const isSelected = selectedClassmateId === cm.id;
                    return (
                      <div
                        key={cm.id}
                        onClick={() => setSelectedClassmateId(cm.id)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border text-xs transition cursor-pointer select-none",
                          isSelected
                            ? "border-2 border-[#FF6026] bg-[#FFF1EC]"
                            : "border-[#E3E0D9] bg-white hover:border-[#D5D0C5]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-[#FAF9F5] border border-[#E3E0D9] text-[#0B0C0F] font-bold text-xs flex items-center justify-center">
                            {cm.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-[#0B0C0F]">{cm.name}</p>
                            <p className="text-[11px] text-[#5A5F6B]">{cm.grade} · {cm.track}</p>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="size-5 rounded-full bg-[#FF6026] text-white flex items-center justify-center font-bold text-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="size-5 rounded-full border border-[#D5D0C5]" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="rounded-full border border-[#E3E0D9] bg-white px-5 py-2.5 text-xs font-semibold text-[#5A5F6B] hover:text-[#0B0C0F] transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={!selectedClassmateId}
                    onClick={handleInviteClassmate}
                    className="rounded-full bg-[#FF6026] hover:bg-[#E8531C] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    Send invitation
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

