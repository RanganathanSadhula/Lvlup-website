"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, LogOut, Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth, StudentProfile } from "@/lib/auth-context";
import { StudentAvatar } from "@/components/ui/StudentAvatar";

export default function WhoIsLearningPage() {
  const router = useRouter();
  const { user, students, activeStudent, setActiveStudent, logout, refreshStudents } = useAuth();
  const [selectedId, setSelectedId] = useState<string>("aarav");

  useEffect(() => {
    refreshStudents();
  }, []);

  // Default demo profiles matching Figma Image 4 if parent has not registered custom profiles yet
  const displayStudents: Array<{
    id: string;
    fullName: string;
    gradeText: string;
    trackTitle: string;
    isEnrolled: boolean;
  }> =
    students.length > 0
      ? students.map((s, idx) => ({
          id: s.id,
          fullName: s.fullName,
          gradeText: `Grade ${s.currentGrade || 6} · ${s.isEnrolled ? "Enrolled" : "1 course"}`,
          trackTitle:
            s.preferredTrack === "robotics"
              ? "Robotics: Build a Rover"
              : s.preferredTrack === "electronics"
              ? "IoT: Build a Smart Home Device"
              : s.preferredTrack === "ai"
              ? "AI for Young Creators"
              : s.preferredTrack === "games"
              ? "Game Dev: 2D Arcade"
              : "3D CAD Modeling",
          isEnrolled: Boolean(s.isEnrolled),
        }))
      : [
          {
            id: "aarav",
            fullName: "Aarav",
            gradeText: "Grade 6 · 2 courses",
            trackTitle: "AI for Young Creators",
            isEnrolled: true,
          },
          {
            id: "meera",
            fullName: "Meera",
            gradeText: "Grade 9 · 1 course",
            trackTitle: "IoT: Build a Smart Home Device",
            isEnrolled: true,
          },
        ];

  const handleSelectStudent = (studentId: string, fullName: string) => {
    setSelectedId(studentId);
    const found = students.find((s) => s.id === studentId);
    if (found) {
      setActiveStudent(found);
    } else {
      setActiveStudent({
        id: studentId,
        fullName: fullName,
        parentUserId: user?.id || "parent_priya",
        schoolUid: "school_1",
        schoolName: "Banyan Grove School",
        currentGrade: studentId === "meera" ? 9 : 6,
        isEnrolled: true,
      });
    }
    // Home page comes up on clicking Aarav or the ward with their name displayed
    router.push("/home");
  };

  const handleAddChild = () => {
    router.push("/tell-us-child?sibling=true");
  };

  const parentDisplayName = user?.fullName || "Priya Sharma";

  return (
    <div className="relative min-h-screen w-full bg-[#0B0C0F] text-white selection:bg-[#FF6026] selection:text-white flex flex-col justify-between p-6 sm:p-10">
      {/* Background Subtle Pattern matching Figma */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-[1240px] items-center justify-between">
        <Logo className="inline-block" />
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/70 hover:border-white/30 hover:text-white transition"
        >
          <LogOut className="size-3.5" />
          Sign out
        </button>
      </header>

      {/* Center Main Content */}
      <main className="relative z-10 mx-auto my-auto flex w-full max-w-[960px] flex-col items-center py-10">
        <h1 className="font-display text-[36px] sm:text-[46px] font-normal leading-[1.1] tracking-[-0.025em] text-white text-center">
          Who&apos;s learning today?
        </h1>

        {/* 3 Profile Cards Row matching Figma Image 4 */}
        <div className="mt-12 flex w-full flex-wrap items-center justify-center gap-6">
          {displayStudents.map((student, idx) => {
            const isSelected = selectedId === student.id || (idx === 0 && selectedId === "aarav");

            return (
              <div
                key={student.id}
                onClick={() => handleSelectStudent(student.id, student.fullName)}
                className={`group relative flex w-[240px] cursor-pointer flex-col items-center rounded-[28px] p-7 text-center transition-all duration-200 hover:scale-[1.03] ${
                  isSelected
                    ? "bg-[#151820] border-2 border-[#FF6026] shadow-[0_8px_30px_rgba(255,96,38,0.18)]"
                    : "bg-[#151820] border border-[#262A34] hover:border-white/30"
                }`}
              >
                {/* Avatar */}
                <div className="relative mb-4 overflow-hidden rounded-full shadow-inner">
                  <StudentAvatar name={student.fullName} size={92} />
                </div>

                {/* Name */}
                <h2 className="text-[20px] font-bold text-white tracking-tight">
                  {student.fullName}
                </h2>

                {/* Subtitle */}
                <p className="mt-1 text-xs text-[#98A2B3]">
                  {student.gradeText}
                </p>

                {/* Highlight Track Tag */}
                <span className="mt-3 text-xs font-semibold text-[#FF6026] transition group-hover:underline">
                  {student.trackTitle}
                </span>
              </div>
            );
          })}

          {/* Add Child Card matching Figma Image 4 */}
          <div
            onClick={handleAddChild}
            className="group flex min-h-[258px] w-[240px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[#2B303C] p-7 text-center transition-all duration-200 hover:border-[#FF6026]/70 hover:bg-white/[0.02] hover:scale-[1.03]"
          >
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#20232B] text-white/90 transition group-hover:bg-[#FF6026] group-hover:text-white">
              <Plus className="size-6 stroke-[2.5]" />
            </div>

            <h3 className="text-base font-semibold text-white tracking-tight">
              Add child
            </h3>
            <p className="mt-1 text-xs text-[#717680]">
              Up to 4 on one account
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Footer Info matching Figma Image 4 */}
      <footer className="relative z-10 mx-auto text-center text-xs text-[#717680]">
        Parent account · {parentDisplayName} ·{" "}
        <button
          type="button"
          onClick={() => router.push("/#tracks")}
          className="hover:text-white transition underline"
        >
          Manage profiles
        </button>
      </footer>
    </div>
  );
}
