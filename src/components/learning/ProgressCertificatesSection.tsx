"use client";

import React, { useState, useEffect } from "react";
import { Download, Sparkles, Award, CheckCircle2, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  StudentProgressSummary,
  TaskReviewRowItem,
  CertificateItem,
} from "./types";
import {
  getStudentProgressData,
  CANONICAL_COURSES_PROGRESS,
} from "@/data/progress-data";
import { CertificateModal } from "./CertificateModal";
import { TaskFeedbackModal } from "./TaskFeedbackModal";

export interface ProgressCertificatesSectionProps {
  studentId?: string;
  studentName?: string;
  onNavigateBuildTask?: (taskId?: string) => void;
  onNavigateLesson?: (lessonId?: string) => void;
}

export function ProgressCertificatesSection({
  studentId = "aarav",
  studentName = "Aarav Sharma",
  onNavigateBuildTask,
  onNavigateLesson,
}: ProgressCertificatesSectionProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ai-for-young-creators");
  const [progressData, setProgressData] = useState<StudentProgressSummary>(() =>
    getStudentProgressData(studentId, selectedCourseId, studentName)
  );
  const [selectedTaskFeedback, setSelectedTaskFeedback] = useState<TaskReviewRowItem | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [downloadingBadgeId, setDownloadingBadgeId] = useState<string | null>(null);

  // Sync with API or fallback to canonical data
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch(
          `/api/learning/certificates?studentId=${studentId}&courseId=${selectedCourseId}&studentName=${encodeURIComponent(studentName)}`
        );
        if (res.ok) {
          const apiData = await res.json();
          if (apiData.summary) {
            setProgressData((prev) => ({
              ...prev,
              lessonsDone: apiData.summary.lessonsDone ?? prev.lessonsDone,
              totalLessons: apiData.summary.totalLessons ?? prev.totalLessons,
              levelsDone: apiData.summary.levelsDone ?? prev.levelsDone,
              totalLevels: apiData.summary.totalLevels ?? prev.totalLevels,
              timeLearning: apiData.summary.timeLearning ?? prev.timeLearning,
              overallPercentage: apiData.summary.overallPercentage ?? prev.overallPercentage,
              buildTasksReviewed: apiData.summary.buildTasksReviewed ?? prev.buildTasksReviewed,
              certificate: apiData.certificate ?? prev.certificate,
              badges: apiData.badges ?? prev.badges,
              skills: apiData.skills ?? prev.skills,
            }));
          }
        }
      } catch {
        // Safe fallback
      }
    }
    loadProgress();
  }, [studentId, selectedCourseId, studentName]);

  const handleCourseChange = (newCourseId: string) => {
    setSelectedCourseId(newCourseId);
    setProgressData(getStudentProgressData(studentId, newCourseId, studentName));
  };

  const handleDownloadBadge = (badgeTitle: string, badgeId: string) => {
    setDownloadingBadgeId(badgeId);
    setTimeout(() => {
      // Trigger SVG badge download
      const svgBadge = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FF6B2C" />
            <stop offset="100%" stop-color="#E8531C" />
          </linearGradient>
        </defs>
        <rect width="300" height="300" rx="30" fill="#0B0C0F" />
        <circle cx="150" cy="120" r="60" fill="url(#grad)" />
        <path d="M150 90 L160 115 L185 115 L165 130 L172 155 L150 140 L128 155 L135 130 L115 115 L140 115 Z" fill="#FFFFFF" />
        <text x="150" y="215" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${badgeTitle}</text>
        <text x="150" y="235" font-family="system-ui, sans-serif" font-size="11" fill="#FF6B2C" text-anchor="middle">ThinkOva Verified Badge</text>
        <text x="150" y="255" font-family="system-ui, sans-serif" font-size="10" fill="#A7ACB8" text-anchor="middle">Learner: ${studentName}</text>
      </svg>`;

      const blob = new Blob([svgBadge], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ThinkOva-Badge-${badgeTitle.replace(/\s+/g, "-")}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadingBadgeId(null);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Optional Course Switcher if multiple courses enrolled */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Object.values(CANONICAL_COURSES_PROGRESS).map((c) => (
            <button
              key={c.courseId}
              type="button"
              onClick={() => handleCourseChange(c.courseId)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer",
                selectedCourseId === c.courseId
                  ? "bg-[#0B0C0F] text-white shadow-xs"
                  : "bg-white border border-[#E3E0D9] text-[#5A5F6B] hover:text-[#0B0C0F]"
              )}
            >
              {c.courseTitle}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsCertModalOpen(true)}
          className="text-xs font-semibold text-[#FF6026] hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>Preview certificate</span>
          <ExternalLink className="size-3" />
        </button>
      </div>

      {/* TOP ROW: 4 STATS METRIC CARDS (Exact match to Figma Image) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Lessons done */}
        <div className="rounded-[24px] bg-white p-6 border border-[#E3E0D9] shadow-xs">
          <p className="text-[28px] sm:text-[34px] font-bold text-[#0B0C0F] tracking-tight leading-tight">
            {progressData.lessonsDone} / {progressData.totalLessons}
          </p>
          <p className="text-xs text-[#5A5F6B] mt-1 font-medium">
            Lessons done
          </p>
        </div>

        {/* Card 2: Levels done */}
        <div className="rounded-[24px] bg-white p-6 border border-[#E3E0D9] shadow-xs">
          <p className="text-[28px] sm:text-[34px] font-bold text-[#0B0C0F] tracking-tight leading-tight">
            {progressData.levelsDone} / {progressData.totalLevels}
          </p>
          <p className="text-xs text-[#5A5F6B] mt-1 font-medium">
            Levels done
          </p>
        </div>

        {/* Card 3: Time learning */}
        <div className="rounded-[24px] bg-white p-6 border border-[#E3E0D9] shadow-xs">
          <p className="text-[28px] sm:text-[34px] font-bold text-[#0B0C0F] tracking-tight leading-tight">
            {progressData.timeLearning}
          </p>
          <p className="text-xs text-[#5A5F6B] mt-1 font-medium">
            Time learning
          </p>
        </div>

        {/* Card 4: Build tasks reviewed */}
        <div className="rounded-[24px] bg-white p-6 border border-[#E3E0D9] shadow-xs">
          <p className="text-[28px] sm:text-[34px] font-bold text-[#0B0C0F] tracking-tight leading-tight">
            {progressData.buildTasksReviewed}
          </p>
          <p className="text-xs text-[#5A5F6B] mt-1 font-medium">
            Build tasks reviewed
          </p>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT (Left ~65% / Right ~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: 8-Week Path + Build Tasks List (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Left Card 1: 8-Week Path Progress Card */}
          <div className="rounded-[24px] bg-white p-6 sm:p-7 border border-[#E3E0D9] shadow-xs space-y-5">
            {/* Header: Title + Percentage */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold text-[#0B0C0F]">
                {progressData.courseTitle} · your 8-week path
              </h3>
              <span className="text-sm sm:text-base font-bold text-[#FF6026]">
                {progressData.overallPercentage}%
              </span>
            </div>

            {/* Continuous Orange Progress Bar */}
            <div className="h-1.5 w-full bg-[#EFEDE6] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#FF6026] transition-all duration-700 ease-out"
                style={{ width: `${progressData.overallPercentage}%` }}
              />
            </div>

            {/* 8-Week Grid (W1 to W8 exact styling from Figma Image) */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 pt-1">
              {progressData.pathSteps.map((step) => {
                const isCompleted = step.status === "completed";
                const isActive = step.status === "active";
                const isUpcoming = step.status === "upcoming";

                return (
                  <div
                    key={step.weekNumber}
                    onClick={() => {
                      if (isActive && onNavigateLesson) {
                        onNavigateLesson();
                      }
                    }}
                    className={cn(
                      "rounded-xl p-2.5 transition flex flex-col justify-between min-h-[74px] select-none",
                      isCompleted && "bg-[#E3F5E8] border border-[#1F9D55]/20",
                      isActive && "bg-[#FFF1EC] border-2 border-[#FF6026]/40 shadow-xs cursor-pointer hover:border-[#FF6026]",
                      isUpcoming && "bg-[#FAF9F5] border border-[#E3E0D9] opacity-75"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase",
                        isCompleted && "text-[#1F9D55]",
                        isActive && "text-[#FF6026]",
                        isUpcoming && "text-[#5A5F6B]"
                      )}
                    >
                      {step.weekLabel}
                    </span>
                    <p
                      className={cn(
                        "text-[11px] font-semibold leading-tight mt-1 line-clamp-2",
                        isCompleted && "text-[#0B0C0F]",
                        isActive && "text-[#0B0C0F] font-bold",
                        isUpcoming && "text-[#5A5F6B]"
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Left Card 2: Build tasks Table Card */}
          <div className="rounded-[24px] bg-white p-6 sm:p-7 border border-[#E3E0D9] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#E3E0D9]/60">
              <h3 className="text-base font-semibold text-[#0B0C0F]">
                Build tasks
              </h3>
              <span className="text-xs text-[#5A5F6B]">
                Feedback from Ms Ananya
              </span>
            </div>

            {/* Table Rows (Figma Image exact layout) */}
            <div className="divide-y divide-[#E3E0D9]/60">
              {progressData.buildTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-3.5 text-xs sm:text-sm group hover:bg-[#FAF9F5]/60 px-2 rounded-xl transition"
                >
                  {/* Left: Task Title */}
                  <span className="font-medium text-[#15171C] pr-3">
                    {task.title}
                  </span>

                  {/* Right: Level number, Badge, and Action Link */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <span className="text-xs text-[#5A5F6B]">
                      {task.levelDisplay}
                    </span>

                    {/* Badge Pill */}
                    {task.badgeType === "due" ? (
                      <span className="rounded-full bg-[#FFF1EC] text-[#FF6026] text-[11px] font-semibold px-2.5 py-0.5 border border-[#FF6026]/30">
                        {task.badgeLabel}
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#E3F5E8] text-[#1F9D55] text-[11px] font-semibold px-2.5 py-0.5 border border-[#1F9D55]/30">
                        {task.badgeLabel}
                      </span>
                    )}

                    {/* Action Button: View or Open */}
                    {task.actionLabel === "Open" ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateBuildTask) {
                            onNavigateBuildTask(task.taskId || "level-6-memory");
                          }
                        }}
                        className="text-xs font-semibold text-[#FF6026] hover:underline cursor-pointer min-w-[32px] text-right"
                      >
                        Open
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedTaskFeedback(task)}
                        className="text-xs font-semibold text-[#FF6026] hover:underline cursor-pointer min-w-[32px] text-right"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Certificates, Badges & Skills (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Right Card 1: Certificates and badges */}
          <div className="rounded-[24px] bg-white p-6 border border-[#E3E0D9] shadow-xs space-y-5">
            <h3 className="text-base font-semibold text-[#0B0C0F]">
              Certificates and badges
            </h3>

            {/* Certificate Box */}
            <div
              onClick={() => setIsCertModalOpen(true)}
              className="rounded-2xl border border-[#E3E0D9] bg-[#FAF9F5] p-5 space-y-1.5 transition hover:border-[#FF6026] hover:bg-[#FFFDFB] cursor-pointer group shadow-xs"
              title="Click to preview & download certificate"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5F6B] group-hover:text-[#FF6026] transition">
                  CERTIFICATE OF COMPLETION
                </span>
                <span className="text-[10px] font-semibold text-[#FF6026] underline">
                  View →
                </span>
              </div>
              <h4 className="text-base font-bold text-[#0B0C0F]">
                {progressData.certificate.courseTitle}
              </h4>
              <p className="text-xs text-[#5A5F6B] leading-relaxed">
                {progressData.certificate.unlockedText}
              </p>
            </div>

            {/* Badges List (Image exact matching) */}
            <div className="space-y-3 pt-1">
              {progressData.badges.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between py-2 border-t border-[#E3E0D9]/60 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-[#FFF1EC] text-[#FF6026] flex items-center justify-center shrink-0">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B0C0F]">{b.title}</p>
                      <p className="text-[11px] text-[#5A5F6B]">{b.subtitle}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadBadge(b.title, b.id)}
                    disabled={downloadingBadgeId === b.id}
                    className="p-1 text-[#FF6026] hover:text-[#E8531C] transition cursor-pointer"
                    title={`Download ${b.title}`}
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card 2: Skills, from your build tasks */}
          <div className="rounded-[24px] bg-white p-6 border border-[#E3E0D9] shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-[#0B0C0F]">
              Skills, from your build tasks
            </h3>

            <div className="space-y-4 pt-1">
              {progressData.skills.map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#0B0C0F]">{skill.name}</span>
                    <span className="font-semibold text-[#0B0C0F]">
                      {skill.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#EFEDE6] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#FF6026] transition-all duration-700"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Certificate Preview & Download Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificate={progressData.certificate}
        studentName={studentName}
      />

      {/* Task Feedback Modal */}
      <TaskFeedbackModal
        task={selectedTaskFeedback}
        onClose={() => setSelectedTaskFeedback(null)}
      />
    </div>
  );
}
