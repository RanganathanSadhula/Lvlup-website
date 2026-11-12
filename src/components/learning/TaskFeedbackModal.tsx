"use client";

import React from "react";
import { X, CheckCircle2, Award, Calendar, MessageSquare } from "lucide-react";
import { TaskReviewRowItem } from "./types";

export interface TaskFeedbackModalProps {
  task: TaskReviewRowItem | null;
  onClose: () => void;
}

export function TaskFeedbackModal({ task, onClose }: TaskFeedbackModalProps) {
  if (!task) return null;

  const feedback = task.tutorFeedback || {
    tutorName: "Ms Ananya Rao",
    grade: "Great (94/100)",
    date: "Reviewed on Tuesday",
    quote: "Clear and clean submission. Good understanding of the core concept.",
    skillsGained: ["Prompting +20%", "Safety +15%"],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-[560px] rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#E3E0D9] space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E3E0D9] pb-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-[#E3F5E8] text-[#1F9D55] flex items-center justify-center font-bold text-sm">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F9D55]">
                {task.levelDisplay} · Verified Submission
              </span>
              <h3 className="text-base font-bold text-[#0B0C0F]">
                {task.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center hover:bg-[#FAF9F5] text-[#5A5F6B] hover:text-[#0B0C0F] transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Grade Banner */}
        <div className="flex items-center justify-between rounded-xl bg-[#FAF9F5] border border-[#E3E0D9] p-3.5 text-xs">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-[#FF6026]" />
            <span className="font-semibold text-[#0B0C0F]">Evaluation Grade:</span>
            <span className="rounded-full bg-[#E3F5E8] text-[#1F9D55] font-bold px-2.5 py-0.5">
              {feedback.grade}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#5A5F6B]">
            <Calendar className="size-3.5" />
            <span>{feedback.date}</span>
          </div>
        </div>

        {/* Tutor Feedback Card */}
        <div className="space-y-3 rounded-2xl border border-[#E3E0D9] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-[#FFF1EC] text-[#FF6026] font-bold text-xs flex items-center justify-center">
              AR
            </div>
            <div>
              <p className="text-xs font-bold text-[#0B0C0F]">{feedback.tutorName}</p>
              <p className="text-[10px] text-[#5A5F6B]">Lead AI Mentor &amp; Reviewer</p>
            </div>
          </div>

          <p className="text-xs sm:text-[13px] text-[#15171C] leading-relaxed italic bg-[#FFFDF9] p-3 rounded-xl border border-[#FAF1E8]">
            &quot;{feedback.quote}&quot;
          </p>

          {/* Skills Credited */}
          {feedback.skillsGained && feedback.skillsGained.length > 0 && (
            <div className="pt-2 border-t border-[#E3E0D9]/70 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5F6B]">
                Skills Credited Toward Certification:
              </span>
              <div className="flex flex-wrap gap-2">
                {feedback.skillsGained.map((sk, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full bg-[#F4F3EE] px-2.5 py-0.5 text-[11px] font-semibold text-[#0B0C0F]"
                  >
                    ✦ {sk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#0B0C0F] hover:bg-[#202228] px-6 py-2.5 text-xs font-semibold text-white transition active:scale-95 cursor-pointer"
          >
            Close feedback
          </button>
        </div>
      </div>
    </div>
  );
}

