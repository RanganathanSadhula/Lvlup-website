"use client";

import React, { useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { TutorQnAItem } from "./types";

export interface AskTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  onQuestionSubmitted: (item: TutorQnAItem) => void;
  lessonTitle?: string;
}

export function AskTutorModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  onQuestionSubmitted,
  lessonTitle = "Level 6 · Connect the steps",
}: AskTutorModalProps) {
  const [askQuestionText, setAskQuestionText] = useState("");
  const [askAttachmentName, setAskAttachmentName] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  if (!isOpen) return null;

  const handleSendQuestionToTutor = async () => {
    if (!askQuestionText.trim()) return;
    setIsSubmittingQuestion(true);
    try {
      const res = await fetch("/api/learning/tutor-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          studentName,
          lessonTitle,
          questionText: askQuestionText,
          attachmentName: askAttachmentName || undefined,
        }),
      });
      const data = await res.json();
      if (data.question) {
        onQuestionSubmitted({
          id: data.question.id,
          question: data.question.questionText,
          askedAt: "Just now",
          tutorName: data.question.tutorReply?.tutorName || "Ms Ananya Rao",
          tutorRole: data.question.tutorReply?.tutorRole || "AI & Robotics Mentor",
          reply:
            data.question.tutorReply?.message ||
            "Hi Aarav! Thanks for your question. Make sure your step 2 parameters receive the output payload from step 1, as shown at 04:10.",
          repliedAt: "Just now",
        });
      }
      setAskQuestionText("");
      setAskAttachmentName("");
      onClose();
    } catch {
      // Local fallback
      onQuestionSubmitted({
        id: `q-${Date.now()}`,
        question: askQuestionText,
        askedAt: "Just now",
        tutorName: "Ms Ananya Rao",
        tutorRole: "AI & Robotics Mentor",
        reply:
          "Hi Aarav! Great question. At 04:10 in Lesson 3, we connect the read step with the reply step using a shared session state. Test it with your favorite planet example!",
        repliedAt: "Just now",
      });
      setAskQuestionText("");
      setAskAttachmentName("");
      onClose();
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-[540px] rounded-[28px] bg-white p-6 sm:p-7 shadow-2xl border border-[#E3E0D9] space-y-5 animate-scale-in">
        {/* Header with Tutor Avatar */}
        <div className="flex items-start justify-between border-b border-[#E3E0D9] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-full bg-[#FFEDE4] border border-[#FF6B2C]/30 text-[#FF6B2C] flex items-center justify-center font-bold text-base shadow-sm">
              AR
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B0C0F]">
                Ask Tutor Ms Ananya Rao
              </h3>
              <p className="text-xs text-[#5A5F6B]">
                AI & Robotics Tutor · Replies within a few hours
              </p>
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

        {/* Lesson context pill */}
        <div className="rounded-xl bg-[#FAF9F5] border border-[#E3E0D9] px-3.5 py-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-[#0B0C0F]">Active Lesson:</span>
          <span className="text-[#FF6B2C] font-medium">{lessonTitle}</span>
        </div>

        {/* Question Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0B0C0F]">
            Your question for Ms Ananya:
          </label>
          <textarea
            rows={4}
            value={askQuestionText}
            onChange={(e) => setAskQuestionText(e.target.value)}
            placeholder="e.g. In step 2, how do I pass the user's question into the safety check so it doesn't give a generic fallback?"
            className="w-full rounded-2xl border border-[#E3E0D9] bg-white p-4 text-xs sm:text-sm text-[#0B0C0F] placeholder-[#A7ACB8] outline-none focus:border-[#FF6026] transition resize-none leading-relaxed"
          />
        </div>

        {/* Attachment input simulation */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0B0C0F]">
            Attach file or screenshot (optional):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={askAttachmentName}
              onChange={(e) => setAskAttachmentName(e.target.value)}
              placeholder="e.g. agent-screenshot.png or agent-draft.json"
              className="flex-1 rounded-xl border border-[#E3E0D9] bg-[#FAF9F5] px-3.5 py-2 text-xs text-[#0B0C0F] placeholder-[#A7ACB8] outline-none focus:border-[#FF6026]"
            />
            <button
              type="button"
              onClick={() => setAskAttachmentName("agent-workflow-screen.png")}
              className="rounded-xl border border-[#E3E0D9] bg-white px-3 py-2 text-xs font-semibold text-[#5A5F6B] hover:text-[#0B0C0F] transition cursor-pointer"
            >
              Attach demo
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E3E0D9] bg-white px-5 py-2.5 text-xs font-semibold text-[#5A5F6B] hover:text-[#0B0C0F] transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmittingQuestion || !askQuestionText.trim()}
            onClick={handleSendQuestionToTutor}
            className="rounded-full bg-[#FF6026] hover:bg-[#E8531C] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmittingQuestion ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Submit question</span>
                <Send className="size-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

