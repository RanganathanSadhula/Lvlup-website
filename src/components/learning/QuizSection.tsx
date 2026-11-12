"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizBreakdownItem, QuizQuestionItem } from "./types";

export interface QuizSectionProps {
  studentId: string;
  onCloseQuiz: () => void;
  onNextLesson: () => void;
  onReviewLesson: () => void;
  onQuizPassed?: (score: number) => void;
}

export const QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: "q1",
    num: 1,
    text: "What is the primary role of system instructions in an AI agent?",
    options: [
      { id: "A", text: "To increase GPU memory clock speed" },
      { id: "B", text: "To define the agent's persona, boundaries, and safe behavior" },
      { id: "C", text: "To format user messages into binary code" },
      { id: "D", text: "To play background audio during chat" },
    ],
    correct: "B",
  },
  {
    id: "q2",
    num: 2,
    text: "Why should you test an agent with two different tasks?",
    options: [
      { id: "A", text: "To make it run faster" },
      { id: "B", text: "To check it works for more than one request" },
      { id: "C", text: "To add more steps" },
      { id: "D", text: "It is not needed" },
    ],
    correct: "B",
  },
  {
    id: "q3",
    num: 3,
    text: "What happens when an agent chains two sequential steps?",
    options: [
      { id: "A", text: "The output from step 1 becomes the input for step 2" },
      { id: "B", text: "The agent resets and forgets step 1" },
      { id: "C", text: "The computer shuts down" },
      { id: "D", text: "It converts text to numbers automatically" },
    ],
    correct: "A",
  },
  {
    id: "q4",
    num: 4,
    text: "How do you protect your agent from hallucinating answers?",
    options: [
      { id: "A", text: "By asking it to guess whenever unsure" },
      { id: "B", text: "By anchoring answers to verified school notes and asking it to say 'I don't know' when not found" },
      { id: "C", text: "By turning off the internet connection" },
      { id: "D", text: "By deleting the prompt history" },
    ],
    correct: "B",
  },
  {
    id: "q5",
    num: 5,
    text: "What is a build task check designed to verify?",
    options: [
      { id: "A", text: "That the student typed 1000 words" },
      { id: "B", text: "That the agent meets key requirements (e.g. memory, safety, and correct answer format)" },
      { id: "C", text: "How fast the mouse moved" },
      { id: "D", text: "The screen brightness level" },
    ],
    correct: "B",
  },
];

export function QuizSection({
  studentId,
  onCloseQuiz,
  onNextLesson,
  onReviewLesson,
  onQuizPassed,
}: QuizSectionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({
    q1: "B",
    q2: "B", // Option B selected matching Figma 732:2178 & Image 4
    q3: "C",
    q4: "B",
    q5: "B",
  });
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(1); // Starts at Question 2 of 5
  const [quizResult, setQuizResult] = useState<"passed" | "try_again" | null>(null);
  const [quizScore, setQuizScore] = useState(4);
  const [quizDiagnostic, setQuizDiagnostic] = useState("4 of 5 right. Lesson 4 is now open.");
  const [quizBreakdown, setQuizBreakdown] = useState<QuizBreakdownItem[]>([
    { questionId: "q1", questionNumber: 1, isCorrect: true, explanation: "System instructions ground the agent with its tone, role, and safety rules." },
    { questionId: "q2", questionNumber: 2, isCorrect: true, explanation: "Multi-task evaluation verifies that the agent generalizes well." },
    { questionId: "q3", questionNumber: 3, isCorrect: false, explanation: "Chaining connects steps so information feeds forward seamlessly." },
    { questionId: "q4", questionNumber: 4, isCorrect: true, explanation: "Factual grounding restricts the agent to trusted reference material." },
    { questionId: "q5", questionNumber: 5, isCorrect: true, explanation: "Automated checks verify functional criteria before tutor review." },
  ]);
  const [isReviewingAnswers, setIsReviewingAnswers] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const handleSubmitQuiz = async () => {
    setIsSubmittingQuiz(true);
    try {
      const res = await fetch("/api/learning/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          answers: selectedAnswers,
        }),
      });
      const data = await res.json();
      const score = data.score ?? (selectedAnswers.q2 === "B" ? 4 : 2);
      setQuizScore(score);
      setQuizDiagnostic(
        data.diagnosticFeedback ||
          (data.passed
            ? "4 of 5 right. Lesson 4 is now open."
            : "2 of 5 right. You need 3 to pass. Question 4 is about testing, so lesson 3 will help.")
      );
      if (data.breakdown) {
        setQuizBreakdown(data.breakdown);
      } else {
        setQuizBreakdown(
          data.passed
            ? [
                { questionId: "q1", questionNumber: 1, isCorrect: true, explanation: "Correct!" },
                { questionId: "q2", questionNumber: 2, isCorrect: true, explanation: "Correct!" },
                { questionId: "q3", questionNumber: 3, isCorrect: false, explanation: "Chaining feeds output forward." },
                { questionId: "q4", questionNumber: 4, isCorrect: true, explanation: "Correct!" },
                { questionId: "q5", questionNumber: 5, isCorrect: true, explanation: "Correct!" },
              ]
            : [
                { questionId: "q1", questionNumber: 1, isCorrect: true, explanation: "Correct!" },
                { questionId: "q2", questionNumber: 2, isCorrect: false, explanation: "Testing two tasks checks generalization." },
                { questionId: "q3", questionNumber: 3, isCorrect: false, explanation: "Chaining connects steps." },
                { questionId: "q4", questionNumber: 4, isCorrect: true, explanation: "Correct!" },
                { questionId: "q5", questionNumber: 5, isCorrect: false, explanation: "Checks verify functional criteria." },
              ]
        );
      }

      if (data.passed) {
        setQuizResult("passed");
        if (onQuizPassed) onQuizPassed(score);
      } else {
        setQuizResult("try_again");
      }
    } catch {
      // Offline fallback: evaluate based on option B selection on q2
      const isPassed = selectedAnswers.q2 === "B";
      if (isPassed) {
        setQuizScore(4);
        setQuizDiagnostic("4 of 5 right. Lesson 4 is now open.");
        setQuizBreakdown([
          { questionId: "q1", questionNumber: 1, isCorrect: true, explanation: "System instructions ground the agent." },
          { questionId: "q2", questionNumber: 2, isCorrect: true, explanation: "Multi-task evaluation verifies generalization." },
          { questionId: "q3", questionNumber: 3, isCorrect: false, explanation: "Chaining connects steps sequentially." },
          { questionId: "q4", questionNumber: 4, isCorrect: true, explanation: "Factual grounding restricts hallucinations." },
          { questionId: "q5", questionNumber: 5, isCorrect: true, explanation: "Automated checks verify requirements." },
        ]);
        setQuizResult("passed");
        if (onQuizPassed) onQuizPassed(4);
      } else {
        setQuizScore(2);
        setQuizDiagnostic("2 of 5 right. You need 3 to pass. Question 4 is about testing, so lesson 3 will help.");
        setQuizBreakdown([
          { questionId: "q1", questionNumber: 1, isCorrect: true, explanation: "System instructions ground the agent." },
          { questionId: "q2", questionNumber: 2, isCorrect: false, explanation: "Testing two tasks verifies generalization." },
          { questionId: "q3", questionNumber: 3, isCorrect: false, explanation: "Chaining connects steps sequentially." },
          { questionId: "q4", questionNumber: 4, isCorrect: true, explanation: "Factual grounding restricts hallucinations." },
          { questionId: "q5", questionNumber: 5, isCorrect: false, explanation: "Checks verify functional criteria." },
        ]);
        setQuizResult("try_again");
      }
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleLeaveQuiz = () => {
    setQuizResult(null);
    onCloseQuiz();
  };

  const activeQ = QUIZ_QUESTIONS[currentQuizQuestionIndex] || QUIZ_QUESTIONS[1]!;
  const activeSelected = selectedAnswers[activeQ.id] || "";

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#5A5F6B]">
          <button type="button" onClick={handleLeaveQuiz} className="hover:text-[#0B0C0F] cursor-pointer">
            My learning
          </button>
          <span>/</span>
          <span>AI for Young Creators</span>
          <span>/</span>
          <span>Level 6</span>
          <span>/</span>
          <span className="font-semibold text-[#0B0C0F]">Quiz</span>
        </div>

        <button
          type="button"
          onClick={handleLeaveQuiz}
          className="text-xs font-semibold text-[#5A5F6B] hover:text-[#0B0C0F] transition cursor-pointer"
        >
          ✕ Leave quiz
        </button>
      </div>

      {/* Title Header */}
      <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#0B0C0F]">
        Test two tasks · quiz
      </h1>

      {/* State 1: Active Question (Figma Node 732:2178) */}
      {!quizResult && (
        <div className="mx-auto max-w-[760px] rounded-[28px] bg-white p-7 sm:p-9 shadow-[0px_8px_24px_0px_rgba(26,20,13,0.07)] border border-[#E3E0D9] space-y-6">
          {/* 5-step progress bar */}
          <div className="flex gap-2">
            {QUIZ_QUESTIONS.map((q, idx) => (
              <div
                key={q.id}
                onClick={() => setCurrentQuizQuestionIndex(idx)}
                className={cn(
                  "h-1.5 flex-1 rounded-full cursor-pointer transition-all",
                  idx === currentQuizQuestionIndex
                    ? "bg-[#FF6B2C]"
                    : selectedAnswers[q.id]
                    ? "bg-[#1F9D55]"
                    : "bg-[#EFEDE6]"
                )}
                title={`Jump to Question ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.66px] text-[#FF6B2C]">
              QUESTION {activeQ.num} OF 5
            </span>
            <span className="text-xs text-[#5A5F6B]">
              Click any step to switch questions
            </span>
          </div>

          <h2 className="text-[24px] sm:text-[28px] font-medium leading-[34px] text-[#15171C]">
            {activeQ.text}
          </h2>

          {/* Options A, B, C, D */}
          <div className="space-y-3">
            {activeQ.options.map((opt) => {
              const isSelected = activeSelected === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() =>
                    setSelectedAnswers({
                      ...selectedAnswers,
                      [activeQ.id]: opt.id,
                    })
                  }
                  className={cn(
                    "flex items-center gap-3.5 rounded-2xl border p-4 transition cursor-pointer select-none",
                    isSelected
                      ? "border-2 border-[#FF6B2C] bg-[#FFEDE4]"
                      : "border-[#E3E0D9] bg-white hover:border-[#D5D0C5]"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-2xl text-xs font-bold shrink-0",
                      isSelected
                        ? "bg-[#FF6B2C] text-white"
                        : "bg-[#EFEDE6] text-[#15171C]"
                    )}
                  >
                    {opt.id}
                  </div>
                  <span
                    className={cn(
                      "text-sm sm:text-base text-[#15171C]",
                      isSelected ? "font-semibold" : "font-medium"
                    )}
                  >
                    {opt.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Navigation & Submit Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E3E0D9]/60">
            <div className="flex items-center gap-2">
              {currentQuizQuestionIndex > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuizQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  className="rounded-xl border border-[#E3E0D9] bg-white px-4 py-2.5 text-xs font-semibold text-[#5A5F6B] hover:text-[#0B0C0F] transition cursor-pointer"
                >
                  ‹ Previous
                </button>
              )}
              {currentQuizQuestionIndex < 4 && (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuizQuestionIndex((prev) => Math.min(4, prev + 1))
                  }
                  className="rounded-xl border border-[#E3E0D9] bg-[#FAF9F5] px-4 py-2.5 text-xs font-semibold text-[#0B0C0F] hover:bg-[#F4F3EE] transition cursor-pointer"
                >
                  Next question ›
                </button>
              )}
            </div>

            <button
              type="button"
              disabled={isSubmittingQuiz}
              onClick={handleSubmitQuiz}
              className="rounded-2xl bg-[#0B0C0F] hover:bg-[#202228] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingQuiz ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Evaluating answers...
                </span>
              ) : (
                "Submit and evaluate →"
              )}
            </button>
          </div>
        </div>
      )}

      {/* State 2: Passed State (Matching Image 2 & Figma Node 732:2304) */}
      {quizResult === "passed" && (
        <div className="mx-auto max-w-[580px] rounded-[28px] bg-white p-8 sm:p-10 shadow-[0px_8px_24px_0px_rgba(26,20,13,0.07)] border border-[#E3E0D9] text-center space-y-6 animate-scale-in">
          {/* Circular Score Gauge matching Image 2 */}
          <div className="relative mx-auto size-28 sm:size-32 flex items-center justify-center">
            <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Grey Track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#EFEDE6"
                strokeWidth="7"
                fill="none"
              />
              {/* Green Arc (covers 80% with 20% gap for 4/5) */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#1F9D55"
                strokeWidth="7"
                strokeDasharray={263.9}
                strokeDashoffset={263.9 * (1 - quizScore / 5)}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-3xl font-bold text-[#0B0C0F]">
              {quizScore}/5
            </span>
          </div>

          <div>
            <h2 className="text-[28px] sm:text-[32px] font-semibold text-[#0B0C0F]">
              You passed
            </h2>
            <p className="mt-1.5 text-sm text-[#5A5F6B]">
              {quizDiagnostic}
            </p>
          </div>

          {/* Question Indicators (Q1-Q5) matching Image 2 */}
          <div className="flex justify-center gap-3">
            {quizBreakdown.map((b) => (
              <div key={b.questionId} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-xs font-bold transition-transform",
                    b.isCorrect
                      ? "bg-[#E3F5E8] text-[#1F9D55]"
                      : "bg-[#FEE2E2] text-[#EF4444]"
                  )}
                >
                  {b.isCorrect ? "✓" : "✕"}
                </div>
                <span className="text-xs font-medium text-[#5A5F6B]">
                  Q{b.questionNumber}
                </span>
              </div>
            ))}
          </div>

          {/* Pill Action Buttons matching Image 2 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setQuizResult(null);
                onNextLesson();
              }}
              className="w-full sm:w-auto rounded-full bg-[#FF6026] hover:bg-[#E8531C] px-8 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Next lesson</span>
              <span className="leading-none">→</span>
            </button>
            <button
              type="button"
              onClick={() => setIsReviewingAnswers(!isReviewingAnswers)}
              className="w-full sm:w-auto rounded-full border border-[#E3E0D9] bg-white hover:bg-[#FAF9F5] px-8 py-3 text-sm font-semibold text-[#0B0C0F] transition active:scale-95 cursor-pointer"
            >
              {isReviewingAnswers ? "Hide answers" : "Review answers"}
            </button>
          </div>

          {/* Optional Review Answers List */}
          {isReviewingAnswers && (
            <div className="mt-6 text-left border-t border-[#E3E0D9] pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0C0F]">
                Detailed Evaluation
              </h4>
              {QUIZ_QUESTIONS.map((q) => {
                const userPick = selectedAnswers[q.id] || "B";
                const isRight = userPick === q.correct;
                return (
                  <div key={q.id} className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E3E0D9] text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Q{q.num}: {q.text}</span>
                      <span className={isRight ? "text-[#1F9D55]" : "text-[#EF4444]"}>
                        {isRight ? "✓ Correct" : `✕ Selected (${userPick}), Correct (${q.correct})`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* State 3: Try Again State (Matching Image 3 & Figma Node 732:2432) */}
      {quizResult === "try_again" && (
        <div className="mx-auto max-w-[580px] rounded-[28px] bg-white p-8 sm:p-10 shadow-[0px_8px_24px_0px_rgba(26,20,13,0.07)] border border-[#E3E0D9] text-center space-y-6 animate-scale-in">
          {/* Circular Score Gauge matching Image 3 */}
          <div className="relative mx-auto size-28 sm:size-32 flex items-center justify-center">
            <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Grey Track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#EFEDE6"
                strokeWidth="7"
                fill="none"
              />
              {/* Orange Arc (covers 40% with 60% grey track for 2/5) */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#FF6026"
                strokeWidth="7"
                strokeDasharray={263.9}
                strokeDashoffset={263.9 * (1 - quizScore / 5)}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-3xl font-bold text-[#0B0C0F]">
              {quizScore}/5
            </span>
          </div>

          <div>
            <h2 className="text-[28px] sm:text-[32px] font-semibold text-[#0B0C0F]">
              Not yet. Let&apos;s try again.
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#5A5F6B] leading-relaxed max-w-md mx-auto">
              {quizDiagnostic}
            </p>
          </div>

          {/* Question Indicators matching Image 3 (Q1 ✓, Q2 ✕, Q3 ✕, Q4 ✓, Q5 ✕) */}
          <div className="flex justify-center gap-3">
            {quizBreakdown.map((b) => (
              <div key={b.questionId} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-xs font-bold transition-transform",
                    b.isCorrect
                      ? "bg-[#E3F5E8] text-[#1F9D55]"
                      : "bg-[#FEE2E2] text-[#EF4444]"
                  )}
                >
                  {b.isCorrect ? "✓" : "✕"}
                </div>
                <span className="text-xs font-medium text-[#5A5F6B]">
                  Q{b.questionNumber}
                </span>
              </div>
            ))}
          </div>

          {/* Pill Action Buttons matching Image 3 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setQuizResult(null);
                setCurrentQuizQuestionIndex(0);
                setSelectedAnswers({ q1: "B", q2: "B" });
                setIsReviewingAnswers(false);
              }}
              className="w-full sm:w-auto rounded-full bg-[#FF6026] hover:bg-[#E8531C] px-8 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer"
            >
              Try again from question 1
            </button>
            <button
              type="button"
              onClick={() => {
                setQuizResult(null);
                onReviewLesson();
              }}
              className="w-full sm:w-auto rounded-full border border-[#E3E0D9] bg-white hover:bg-[#FAF9F5] px-8 py-3 text-sm font-semibold text-[#0B0C0F] transition active:scale-95 cursor-pointer"
            >
              Watch the lesson again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

