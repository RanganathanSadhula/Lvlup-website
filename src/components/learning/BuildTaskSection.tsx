"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
  Paperclip,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TASK_DEFINITIONS,
  BuildTaskData,
  SubmittedFile,
} from "@/data/learning-tasks";

export interface BuildTaskSectionProps {
  studentId: string;
  activeTaskId: string;
  onCloseTask: () => void;
  onNavigateLive: () => void;
}

export function BuildTaskSection({
  studentId,
  activeTaskId,
  onCloseTask,
  onNavigateLive,
}: BuildTaskSectionProps) {
  const [activeTaskData, setActiveTaskData] = useState<BuildTaskData>(
    () => TASK_DEFINITIONS[activeTaskId] || TASK_DEFINITIONS["level-6-memory"]!
  );
  const [taskFiles, setTaskFiles] = useState<SubmittedFile[]>([
    activeTaskData.defaultFile,
  ]);
  const [studentBuildNote, setStudentBuildNote] = useState<string>(
    activeTaskData.defaultNote
  );
  const [taskDraftStatusText, setTaskDraftStatusText] = useState<string>(
    "Draft saved 2 min ago"
  );
  const [buildTaskSubmissionStatus, setBuildTaskSubmissionStatus] = useState<
    "draft_saved" | "submitted" | "reviewed"
  >("draft_saved");
  const [taskReviewData, setTaskReviewData] = useState<{
    tutorName: string;
    tutorAvatar?: string;
    grade: string;
    feedback: string;
  } | null>(null);
  const [isSubmittingBuild, setIsSubmittingBuild] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isPasteLinkOpen, setIsPasteLinkOpen] = useState(false);
  const [pastedLinkText, setPastedLinkText] = useState("");
  const [isBuildJustSubmitted, setIsBuildJustSubmitted] = useState(false);

  // Sync when activeTaskId changes
  useEffect(() => {
    const def = TASK_DEFINITIONS[activeTaskId] || TASK_DEFINITIONS["level-6-memory"]!;
    setActiveTaskData(def);
    setTaskFiles([def.defaultFile]);
    setStudentBuildNote(def.defaultNote);
  }, [activeTaskId]);

  // Fetch task submission status from localStorage and backend
  useEffect(() => {
    // 1. Instant local storage restoration
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(`thinkova_sub_${studentId}_${activeTaskId}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.files && parsed.files.length > 0) {
            setTaskFiles(parsed.files);
          }
          if (parsed.note) {
            setStudentBuildNote(parsed.note);
          }
          if (parsed.status === "submitted") {
            setBuildTaskSubmissionStatus("submitted");
            setIsBuildJustSubmitted(true);
            setTaskDraftStatusText("Submitted just now");
          }
        }
      } catch {
        // ignore
      }
    }

    // 2. Fetch from backend route
    async function loadBuildTask() {
      try {
        const res = await fetch(
          `/api/learning/build-task?studentId=${studentId}&taskId=${activeTaskId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.task) {
            setActiveTaskData(data.task);
          }
          if (data.submission) {
            if (data.submission.files && data.submission.files.length > 0) {
              setTaskFiles(data.submission.files);
            }
            if (data.submission.note) {
              setStudentBuildNote(data.submission.note);
            }
            if (data.submission.status) {
              setBuildTaskSubmissionStatus(data.submission.status);
              if (data.submission.status === "submitted") {
                setIsBuildJustSubmitted(true);
              }
            }
            if (data.submission.review) {
              setTaskReviewData(data.submission.review);
            }
          }
        }
      } catch {
        // safe fallback
      }
    }
    loadBuildTask();
  }, [studentId, activeTaskId]);

  // Real File Upload Handler (triggers native file input)
  const handleRealFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newFiles: SubmittedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      newFiles.push({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: `${sizeMB === "0.0" ? "< 0.1" : sizeMB} MB`,
        type: file.type || "application/octet-stream",
        uploadedAt: "Uploaded just now",
      });
    }
    setTaskFiles((prev) => [...prev, ...newFiles]);
    setTaskDraftStatusText("Draft saved just now");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // File Drop Handler for Drag-and-Drop
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const newFiles: SubmittedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      newFiles.push({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        size: `${sizeMB === "0.0" ? "< 0.1" : sizeMB} MB`,
        type: file.type || "application/octet-stream",
        uploadedAt: "Uploaded just now",
      });
    }
    setTaskFiles((prev) => [...prev, ...newFiles]);
    setTaskDraftStatusText("Draft saved just now");
  };

  // Paste a Link Handler
  const handleAddPastedLink = () => {
    if (!pastedLinkText.trim()) return;
    let displayName = pastedLinkText.trim();
    try {
      if (displayName.startsWith("http")) {
        const parsed = new URL(displayName);
        displayName = `${parsed.hostname}${parsed.pathname.length > 1 ? parsed.pathname.slice(0, 15) : ""}`;
      }
    } catch {
      // keep original
    }
    const newLinkFile: SubmittedFile = {
      id: `link-${Date.now()}`,
      name: displayName,
      size: "Project Link",
      type: "link",
      uploadedAt: "Attached just now",
    };
    setTaskFiles((prev) => [...prev, newLinkFile]);
    setPastedLinkText("");
    setIsPasteLinkOpen(false);
    setTaskDraftStatusText("Draft saved just now");
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveTaskFile = (fileId: string) => {
    setTaskFiles((prev) => prev.filter((f) => f.id !== fileId));
    setTaskDraftStatusText("Draft saved just now");
  };

  const handleSaveAndSubmitBuild = async () => {
    setIsSubmittingBuild(true);
    try {
      // 1. Save to localStorage immediately
      if (typeof window !== "undefined") {
        const payload = {
          status: "submitted",
          submittedAt: new Date().toISOString(),
          files: taskFiles,
          note: studentBuildNote,
        };
        localStorage.setItem(
          `thinkova_sub_${studentId}_${activeTaskId}`,
          JSON.stringify(payload)
        );
      }

      // 2. Sync with backend API
      const res = await fetch("/api/learning/build-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_build",
          studentId,
          taskId: activeTaskId,
          files: taskFiles,
          note: studentBuildNote,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.submission?.review) {
          setTaskReviewData(data.submission.review);
        }
      }
      setBuildTaskSubmissionStatus("submitted");
      setIsBuildJustSubmitted(true);
      setTaskDraftStatusText("Submitted just now");
    } catch {
      setBuildTaskSubmissionStatus("submitted");
      setIsBuildJustSubmitted(true);
      setTaskDraftStatusText("Submitted just now");
    } finally {
      setIsSubmittingBuild(false);
    }
  };

  const handleSaveBuildDraftOnly = async () => {
    setTaskDraftStatusText("Saving draft...");
    try {
      if (typeof window !== "undefined") {
        const payload = {
          status: "draft_saved",
          savedAt: new Date().toISOString(),
          files: taskFiles,
          note: studentBuildNote,
        };
        localStorage.setItem(
          `thinkova_sub_${studentId}_${activeTaskId}`,
          JSON.stringify(payload)
        );
      }
      await fetch("/api/learning/build-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_draft",
          studentId,
          taskId: activeTaskId,
          files: taskFiles,
          note: studentBuildNote,
        }),
      });
      setTaskDraftStatusText("Draft saved just now");
    } catch {
      setTaskDraftStatusText("Draft saved just now");
    }
  };

  const handleSimulateTutorReview = async () => {
    try {
      const res = await fetch("/api/learning/build-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review",
          studentId,
          taskId: activeTaskId,
          tutorName: "Ms Ananya",
          grade: "Pass",
          feedback:
            "Clear blueprint. Next time, write down one thing that could go wrong and how your agent should handle it.",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBuildTaskSubmissionStatus("reviewed");
        if (data.submission?.review) {
          setTaskReviewData(data.submission.review);
        }
      }
    } catch {
      setBuildTaskSubmissionStatus("reviewed");
      setTaskReviewData({
        tutorName: "Ms Ananya",
        grade: "Pass",
        feedback:
          "Clear blueprint. Next time, write down one thing that could go wrong and how your agent should handle it.",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb Navigation & Close Task */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#5A5F6B]">
          <button
            type="button"
            onClick={onCloseTask}
            className="hover:text-[#0B0C0F] cursor-pointer"
          >
            My learning
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={onCloseTask}
            className="hover:text-[#0B0C0F] cursor-pointer"
          >
            AI for Young Creators
          </button>
          <span>/</span>
          <span>Level {activeTaskData.levelNumber}</span>
          <span>/</span>
          <span className="font-semibold text-[#0B0C0F]">Build task</span>
        </div>

        <button
          type="button"
          onClick={onCloseTask}
          className="text-xs font-semibold text-[#5A5F6B] hover:text-[#0B0C0F] cursor-pointer"
        >
          ✕ Close task
        </button>
      </div>

      {/* Header: Title, Badges, and Top-Right Draft Status */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#0B0C0F] tracking-tight">
            {activeTaskData.title}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-[#FDF0EB] px-3.5 py-1 text-xs font-semibold text-[#B24514]">
              {activeTaskData.dueText}
            </span>
            <span className="rounded-full bg-[#EFECE6] px-3.5 py-1 text-xs font-medium text-[#5A5F6B]">
              {activeTaskData.estimatedTime}
            </span>
            <span className="rounded-full bg-[#EFECE6] px-3.5 py-1 text-xs font-medium text-[#5A5F6B]">
              {activeTaskData.levelBadge}
            </span>
          </div>
        </div>

        <div className="text-xs text-[#5A5F6B] sm:text-right shrink-0 pt-1">
          {taskDraftStatusText}
        </div>
      </div>

      {/* Status Banner when Submitted or Reviewed */}
      {buildTaskSubmissionStatus === "reviewed" && taskReviewData && (
        <div className="rounded-2xl border border-[#1F9D55]/30 bg-[#E3F5E8] p-4 flex items-center justify-between text-xs text-[#1F9D55] animate-scale-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 shrink-0 stroke-[2.5]" />
            <div>
              <p className="font-bold text-sm">Reviewed by {taskReviewData.tutorName} · Grade: {taskReviewData.grade}</p>
              <p className="text-[#0B0C0F] mt-0.5">{taskReviewData.feedback}</p>
            </div>
          </div>
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#1F9D55] shadow-xs">
            ✓ Verified Level {activeTaskData.levelNumber}
          </span>
        </div>
      )}

      {buildTaskSubmissionStatus === "submitted" && (
        <div className="rounded-2xl border border-[#FF6026]/30 bg-[#FFF7F4] p-4 flex items-center justify-between text-xs text-[#B24514] animate-scale-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 shrink-0 stroke-[2.5] text-[#FF6026]" />
            <div>
              <p className="font-bold text-sm">Build Submitted for Tutor Review</p>
              <p className="text-[#5A5F6B] mt-0.5">
                Ms Ananya will review your attached file and note before Friday 9:00 PM.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#FF6026] shadow-xs">
              Status: In Review
            </span>
            <button
              type="button"
              onClick={handleSimulateTutorReview}
              className="rounded-full bg-[#FF6026] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#E8531C] transition cursor-pointer"
              title="Simulate tutor grading"
            >
              Receive Tutor Feedback
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid: Left Column (Brief + Submission) & Right Column (LAST FEEDBACK + Stuck?) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns (approx 65%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: The brief */}
          <div className="rounded-[24px] bg-white p-7 sm:p-8 shadow-sm border border-[#E3E0D9] space-y-5">
            <h2 className="text-base font-bold text-[#0B0C0F]">The brief</h2>
            <p className="text-xs sm:text-sm text-[#5A5F6B] leading-relaxed">
              {activeTaskData.brief}
            </p>

            <div className="pt-2 space-y-3">
              <h3 className="text-xs font-bold text-[#0B0C0F]">What good looks like</h3>
              <div className="space-y-2.5">
                {activeTaskData.whatGoodLooksLike.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E3F5E8] text-[#1F9D55] text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-xs sm:text-[13px] text-[#0B0C0F]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Your submission */}
          <div className="rounded-[24px] bg-white p-7 sm:p-8 shadow-sm border border-[#E3E0D9] space-y-5">
            <h2 className="text-base font-bold text-[#0B0C0F]">Your submission</h2>

            {/* Hidden Real File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.zip,.py,.js"
              onChange={handleRealFileUpload}
              className="hidden"
            />

            {/* Dropzone with Drag & Drop and Native File Dialog Trigger */}
            <div
              onClick={handleTriggerUpload}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleFileDrop}
              className={cn(
                "rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer select-none",
                isDraggingFile
                  ? "border-[#FF6026] bg-[#FFEDE4]/40"
                  : "border-[#E3E0D9] hover:border-[#FF6026] bg-[#FAF9F5]"
              )}
            >
              <div className="mx-auto size-10 rounded-full bg-[#FFEDE4] flex items-center justify-center text-[#FF6026]">
                <UploadCloud className="size-5 text-[#FF6026]" />
              </div>
              <p className="mt-3 text-xs sm:text-sm font-semibold text-[#0B0C0F]">
                Drop a screenshot or file here
              </p>
              <p className="text-xs text-[#5A5F6B] mt-0.5">
                PNG, JPG or PDF up to 10 MB ·{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPasteLinkOpen(!isPasteLinkOpen);
                  }}
                  className="text-[#FF6026] underline hover:text-[#E8531C] cursor-pointer"
                >
                  or paste a link
                </button>
              </p>
            </div>

            {/* Paste a link input form */}
            {isPasteLinkOpen && (
              <div className="flex items-center gap-2 rounded-xl border border-[#E3E0D9] bg-[#FAF9F5] p-2.5 animate-fade-in">
                <Paperclip className="size-4 text-[#5A5F6B] shrink-0 ml-1" />
                <input
                  type="url"
                  value={pastedLinkText}
                  onChange={(e) => setPastedLinkText(e.target.value)}
                  placeholder="Paste link to Google Drive, GitHub repo, or Figma..."
                  className="flex-1 bg-transparent text-xs text-[#0B0C0F] outline-none placeholder:text-[#A7ACB8]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddPastedLink();
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddPastedLink}
                  className="rounded-lg bg-[#0B0C0F] hover:bg-[#202228] px-3 py-1.5 text-[11px] font-semibold text-white transition cursor-pointer"
                >
                  Attach link
                </button>
              </div>
            )}

            {/* Uploaded File Card */}
            {taskFiles.length > 0 && (
              <div className="space-y-2">
                {taskFiles.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-xl border border-[#E3E0D9] bg-white p-3.5 flex items-center justify-between text-xs transition hover:border-[#D5D0C5]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-[#FDF0EB] text-[#FF6026] flex items-center justify-center shrink-0">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0B0C0F]">{f.name}</p>
                        <p className="text-[11px] text-[#5A5F6B]">{f.size} · uploaded</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveTaskFile(f.id)}
                      className="text-xs font-medium text-[#5A5F6B] hover:text-[#EF4444] transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Note for Ms Ananya */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-[#0B0C0F] block">
                Note for Ms Ananya
              </label>
              <textarea
                rows={3}
                value={studentBuildNote}
                onChange={(e) => setStudentBuildNote(e.target.value)}
                placeholder="Explain what you changed and why..."
                className="w-full rounded-xl border border-[#E3E0D9] bg-white p-3.5 text-xs text-[#0B0C0F] outline-none focus:border-[#FF6026] transition leading-relaxed resize-none"
              />
            </div>

            {/* In-Card Direct Feedback Banner when Submitted */}
            {(buildTaskSubmissionStatus === "submitted" || isBuildJustSubmitted) && (
              <div className="rounded-xl border border-[#1F9D55]/30 bg-[#E3F5E8] p-4 flex items-center justify-between text-xs text-[#1F9D55] animate-scale-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-5 shrink-0 stroke-[2.5]" />
                  <div>
                    <p className="font-bold text-sm">Build submitted for tutor review!</p>
                    <p className="text-[#0B0C0F] mt-0.5">
                      Ms Ananya will review your attached screenshot and note before Friday 9:00 PM.
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white px-3 py-1 font-semibold text-[#1F9D55] shadow-xs shrink-0">
                  Status: In Review
                </span>
              </div>
            )}

            {/* Action Buttons: Submit build & Save draft */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveAndSubmitBuild}
                disabled={isSubmittingBuild}
                className={cn(
                  "rounded-full px-6 py-2.5 text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-1.5",
                  buildTaskSubmissionStatus === "submitted"
                    ? "bg-[#1F9D55] hover:bg-[#188044] text-white"
                    : "bg-[#FF6026] hover:bg-[#E8531C] text-white"
                )}
              >
                {isSubmittingBuild ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : buildTaskSubmissionStatus === "submitted" ? (
                  <>
                    <Check className="size-3.5 stroke-[3]" />
                    <span>Resubmit build →</span>
                  </>
                ) : (
                  <span>Submit build →</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveBuildDraftOnly}
                className="rounded-full border border-[#E3E0D9] bg-white hover:bg-[#FAF9F5] px-5 py-2.5 text-xs font-semibold text-[#0B0C0F] transition cursor-pointer"
              >
                Save draft
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Columns (approx 35%) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: LAST FEEDBACK */}
          <div className="rounded-[24px] bg-white p-6 shadow-sm border border-[#E3E0D9] space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5F6B]">
              LAST FEEDBACK
            </span>

            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#FFEDE4] border border-[#FF6B2C]/20 text-[#FF6B2C] flex items-center justify-center font-bold text-xs shrink-0">
                {activeTaskData.lastFeedback.avatarInitials}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0B0C0F]">
                  {activeTaskData.lastFeedback.tutorName}
                </h4>
                <p className="text-[11px] text-[#5A5F6B]">
                  {activeTaskData.lastFeedback.tutorMeta}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5A5F6B] leading-relaxed italic">
              {activeTaskData.lastFeedback.quote}
            </p>
          </div>

          {/* Card 2: Stuck? (Dark Ink Card #15171C) */}
          <div className="rounded-[24px] bg-[#15171C] p-6 text-white space-y-4">
            <h3 className="text-sm font-bold text-white">Stuck?</h3>

            <div className="space-y-2.5">
              {activeTaskData.stuckLinks.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (item.type === "live") {
                      onNavigateLive();
                    }
                  }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#202228] hover:bg-[#2A2C34] transition cursor-pointer"
                >
                  <div>
                    <h5 className="text-xs font-semibold text-white">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-[#A7ACB8]">
                      {item.subtitle}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-white/60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

