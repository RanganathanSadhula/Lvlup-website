"use client";

import React from "react";
import { Play, X } from "lucide-react";
import { LiveClassSession } from "@/data/live-classes";

export interface RecordingModalProps {
  recording: LiveClassSession | null;
  onClose: () => void;
}

export function RecordingModal({ recording, onClose }: RecordingModalProps) {
  if (!recording) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-[720px] rounded-[28px] bg-[#0B0C0F] text-white p-6 shadow-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="rounded-full bg-[#FF6B2C]/20 text-[#FF6B2C] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">
              Class Recording · Level {recording.levelNumber}
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              {recording.title}
            </h3>
            <p className="text-xs text-white/60">
              {recording.dateDisplay} · {recording.recordingDuration} · Tutor: {recording.tutorName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Video Playback Canvas */}
        <div className="relative aspect-video w-full rounded-2xl bg-[#14161D] border border-white/10 overflow-hidden flex items-center justify-center">
          <div className="text-center space-y-3 p-6">
            <div className="size-16 rounded-full bg-[#FF6026] text-white flex items-center justify-center mx-auto shadow-lg">
              <Play className="size-7 fill-current ml-1" />
            </div>
            <p className="text-sm font-semibold text-white">
              {recording.title}
            </p>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              {recording.topicDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 text-xs">
          <span className="text-white/60">
            Prep Notes: {recording.prepNotes.join(" · ")}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/15 px-4 py-2 font-semibold text-white transition cursor-pointer"
          >
            Close replay
          </button>
        </div>
      </div>
    </div>
  );
}

