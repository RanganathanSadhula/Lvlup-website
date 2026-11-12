"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { TASK_DEFINITIONS } from "@/data/learning-tasks";
import {
  BEFORE_YOU_JOIN_ITEMS,
  PAST_RECORDINGS,
  LiveClassSession,
  BeforeJoinCheckItem,
  ReplayItem,
} from "@/data/live-classes";
import {
  ActiveTab,
  CourseSubTab,
  TutorQnAItem,
  CourseRoadmapSection,
  LiveClassesSection,
  ProgressCertificatesSection,
  LessonPlayerSection,
  QuizSection,
  BuildTaskSection,
  AskTutorModal,
  RecordingModal,
} from "@/components/learning";

export default function MyLearningPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { activeStudent } = useAuth();

  const studentId = String(params?.studentId || "aarav");
  const studentName = activeStudent?.fullName || "Aarav Sharma";

  // Dynamic URL query parameters for unique ID variations & state restoration
  const initialLesson = searchParams.get("lesson");
  const initialQuiz = searchParams.get("quiz");
  const initialViewParam = searchParams.get("view");
  const initialTabParam = searchParams.get("tab") as CourseSubTab | null;
  const initialTaskId = searchParams.get("taskId") || "level-6-memory";

  const [activeView, setActiveView] = useState<ActiveTab>(
    initialViewParam === "build-task"
      ? "build-task"
      : initialQuiz
      ? "quiz"
      : initialLesson
      ? "lesson"
      : "course"
  );
  const [courseSubTab, setCourseSubTab] = useState<CourseSubTab>(
    initialTabParam === "live" || initialTabParam === "progress" ? initialTabParam : "courses"
  );
  const [activeTaskId, setActiveTaskId] = useState<string>(initialTaskId);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // Live classes & recordings state
  const [beforeJoinList, setBeforeJoinList] = useState<BeforeJoinCheckItem[]>(BEFORE_YOU_JOIN_ITEMS);
  const [activeRecordingModal, setActiveRecordingModal] = useState<LiveClassSession | null>(null);

  // "Ask a Question" Modal & Real-time Tutor Sync
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [tutorQnAList, setTutorQnAList] = useState<TutorQnAItem[]>([
    {
      id: "q-seed-1",
      question:
        "How do I make sure the agent remembers what subject was mentioned in step 1 when it answers in step 2?",
      askedAt: "2 hours ago",
      tutorName: "Ms Ananya Rao",
      tutorRole: "AI & Robotics Mentor",
      reply:
        "Hi Aarav! In Lesson 3 at 04:10, we pass the memory state object across sequential steps. Make sure your step 2 function takes `context.previousTurn` as an argument before crafting its reply!",
      repliedAt: "1 hour ago",
    },
  ]);

  // Dynamic navigation router with unique ID variations & browser history push
  const navigateView = (
    view: ActiveTab,
    opts?: {
      taskId?: string;
      tab?: CourseSubTab;
      lessonId?: string;
      quizId?: string;
    }
  ) => {
    setActiveView(view);
    if (opts?.tab) {
      setCourseSubTab(opts.tab);
    }
    if (opts?.taskId) {
      setActiveTaskId(opts.taskId);
    }

    // Synchronize URL query params so each state has a unique address
    const sp = new URLSearchParams();
    if (view !== "course") {
      sp.set("view", view);
    }
    if (view === "course" && (opts?.tab || courseSubTab) !== "courses") {
      sp.set("tab", opts?.tab || courseSubTab);
    }
    if (opts?.taskId) {
      sp.set("taskId", opts.taskId);
    }
    if (opts?.lessonId) {
      sp.set("lesson", opts.lessonId);
    }
    if (opts?.quizId) {
      sp.set("quiz", opts.quizId);
    }
    const q = sp.toString();
    const url = q ? `/learning/${studentId}?${q}` : `/learning/${studentId}`;
    window.history.pushState({}, "", url);
  };

  // Sync state on popstate (browser back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      const sp = new URLSearchParams(window.location.search);
      const v = (sp.get("view") as ActiveTab) || "course";
      const t = (sp.get("tab") as CourseSubTab) || "courses";
      const tid = sp.get("taskId") || "level-6-memory";
      setActiveView(v);
      setCourseSubTab(t);
      if (tid && TASK_DEFINITIONS[tid]) {
        setActiveTaskId(tid);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Toggle Before You Join checklist item
  const handleToggleBeforeJoin = (id: string) => {
    setBeforeJoinList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Open replay recording modal
  const handleOpenRecording = (replay: ReplayItem) => {
    const session =
      PAST_RECORDINGS.find(
        (r) =>
          r.title.toLowerCase().includes(replay.title.toLowerCase().slice(0, 10)) ||
          r.id === replay.id
      ) ||
      PAST_RECORDINGS[0] ||
      null;
    setActiveRecordingModal(session);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F4F3EE] text-[#0B0C0F] selection:bg-[#FF6026] selection:text-white">
      {/* App Sidebar v2 */}
      <AppSidebar activeItem="my-learning" />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="mx-auto max-w-[1140px]">

          {/* ========================================================================= */}
          {/* VIEW A: MAIN COURSE ROADMAP & SUBTABS                                     */}
          {/* ========================================================================= */}
          {activeView === "course" && (
            <div className="space-y-7">
              {/* Header Title & Subtabs */}
              <div>
                <h1 className="font-display text-[32px] sm:text-[36px] font-semibold text-[#0B0C0F] tracking-tight">
                  My learning
                </h1>

                {/* Sub-Tabs (Courses, Live classes, Progress and certificates) */}
                <div className="mt-5 flex items-center gap-8 border-b border-[#E3E0D9]">
                  <button
                    type="button"
                    onClick={() => navigateView("course", { tab: "courses" })}
                    className={cn(
                      "pb-3 text-sm font-semibold transition-all duration-200 cursor-pointer relative",
                      courseSubTab === "courses"
                        ? "text-[#0B0C0F] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FF6026]"
                        : "text-[#5A5F6B] hover:text-[#0B0C0F]"
                    )}
                  >
                    Courses
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateView("course", { tab: "live" })}
                    className={cn(
                      "pb-3 text-sm font-semibold transition-all duration-200 cursor-pointer relative",
                      courseSubTab === "live"
                        ? "text-[#0B0C0F] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FF6026]"
                        : "text-[#5A5F6B] hover:text-[#0B0C0F]"
                    )}
                  >
                    Live classes
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateView("course", { tab: "progress" })}
                    className={cn(
                      "pb-3 text-sm font-semibold transition-all duration-200 cursor-pointer relative",
                      courseSubTab === "progress"
                        ? "text-[#0B0C0F] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FF6026]"
                        : "text-[#5A5F6B] hover:text-[#0B0C0F]"
                    )}
                  >
                    Progress and certificates
                  </button>
                </div>
              </div>

              {/* Subtab 1: Courses Roadmap */}
              {courseSubTab === "courses" && (
                <CourseRoadmapSection
                  isLessonCompleted={isLessonCompleted}
                  onNavigateLesson={() => navigateView("lesson")}
                  onNavigateQuiz={() => navigateView("quiz")}
                  onNavigateBuildTask={(tid) =>
                    navigateView("build-task", { taskId: tid || "level-6-memory" })
                  }
                />
              )}

              {/* Subtab 2: Live Classes View */}
              {courseSubTab === "live" && (
                <LiveClassesSection
                  beforeJoinList={beforeJoinList}
                  onToggleBeforeJoin={handleToggleBeforeJoin}
                  onOpenRecording={handleOpenRecording}
                />
              )}

              {/* Subtab 3: Progress and Certificates */}
              {courseSubTab === "progress" && (
                <ProgressCertificatesSection
                  studentId={studentId}
                  studentName={studentName}
                  onNavigateBuildTask={(tid) =>
                    navigateView("build-task", { taskId: tid || "level-6-memory" })
                  }
                  onNavigateLesson={() => navigateView("lesson")}
                />
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW B: INTERACTIVE LESSON VIDEO PLAYER                                   */}
          {/* ========================================================================= */}
          {activeView === "lesson" && (
            <LessonPlayerSection
              studentId={studentId}
              isLessonCompleted={isLessonCompleted}
              setIsLessonCompleted={setIsLessonCompleted}
              onNavigateRoadmap={() => navigateView("course")}
              onNavigateQuiz={() => navigateView("quiz")}
              onNavigateBuildTask={(tid) =>
                navigateView("build-task", { taskId: tid || "level-6-memory" })
              }
              onOpenAskModal={() => setIsAskModalOpen(true)}
              tutorQnAList={tutorQnAList}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW C: TEST QUIZ ENGINE                                                  */}
          {/* ========================================================================= */}
          {activeView === "quiz" && (
            <QuizSection
              studentId={studentId}
              onCloseQuiz={() => navigateView("course")}
              onNextLesson={() => navigateView("course")}
              onReviewLesson={() => navigateView("lesson")}
              onQuizPassed={() => setIsLessonCompleted(true)}
            />
          )}

          {/* ========================================================================= */}
          {/* VIEW D: BUILD TASK WORKSPACE                                              */}
          {/* ========================================================================= */}
          {activeView === "build-task" && (
            <BuildTaskSection
              studentId={studentId}
              activeTaskId={activeTaskId}
              onCloseTask={() => navigateView("course")}
              onNavigateLive={() => navigateView("course", { tab: "live" })}
            />
          )}

          {/* ========================================================================= */}
          {/* MODALS                                                                    */}
          {/* ========================================================================= */}
          <AskTutorModal
            isOpen={isAskModalOpen}
            onClose={() => setIsAskModalOpen(false)}
            studentId={studentId}
            studentName={studentName}
            onQuestionSubmitted={(newItem) =>
              setTutorQnAList((prev) => [newItem, ...prev])
            }
          />

          <RecordingModal
            recording={activeRecordingModal}
            onClose={() => setActiveRecordingModal(null)}
          />

        </div>
      </main>
    </div>
  );
}
