"use client";

import React, { useState } from "react";
import { Download, Printer, X, CheckCircle2, Sparkles, Award } from "lucide-react";
import { CertificateItem } from "./types";

export interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateItem;
  studentName: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  certificate,
  studentName,
}: CertificateModalProps) {
  const [isDemoUnlocked, setIsDemoUnlocked] = useState(certificate.isUnlocked);

  if (!isOpen) return null;

  const certCode = certificate.certificateCode || "THINKOVA-CERT-2026-AI-84920";
  const dateStr = certificate.issuedAt || "21 Nov 2026";
  const tutorStr = certificate.tutorName || "Ms Ananya Rao";

  const handleDownloadCertificate = () => {
    const url = `/api/learning/certificates/download?studentId=${certificate.studentId}&courseId=${certificate.courseId}&studentName=${encodeURIComponent(studentName)}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `ThinkOva-Certificate-${studentName.replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-[800px] rounded-[28px] bg-white p-6 sm:p-8 shadow-2xl border border-[#E3E0D9] space-y-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#E3E0D9] pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#FFF1EC] text-[#FF6026] flex items-center justify-center shadow-xs">
              <Award className="size-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0B0C0F]">
                Official Certificate Preview
              </h3>
              <p className="text-xs text-[#5A5F6B]">
                {certificate.courseTitle} · Accredited by ThinkOva Labs
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

        {/* Certificate Canvas / Rendered Preview */}
        <div className="relative rounded-2xl border-4 border double border-[#D5D0C5] bg-[#FCFBF7] p-8 sm:p-10 shadow-sm text-center space-y-5 select-none overflow-hidden">
          {/* Subtle Corner Accents */}
          <div className="absolute top-3 left-3 size-4 rounded-full border-2 border-[#FF6026]" />
          <div className="absolute top-3 right-3 size-4 rounded-full border-2 border-[#FF6026]" />
          <div className="absolute bottom-3 left-3 size-4 rounded-full border-2 border-[#FF6026]" />
          <div className="absolute bottom-3 right-3 size-4 rounded-full border-2 border-[#FF6026]" />

          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#FF6026]">
              <Sparkles className="size-3.5" />
              <span>THINKOVA LEARNING LABS</span>
              <Sparkles className="size-3.5" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B0C0F] tracking-wide pt-1">
              Certificate of Achievement
            </h2>
            <p className="text-xs text-[#5A5F6B]">This certifies that</p>
          </div>

          {/* Student Name */}
          <div className="py-1">
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#FF6026]">
              {studentName}
            </p>
            <div className="mx-auto w-48 sm:w-64 h-px bg-[#D5D0C5] mt-2" />
          </div>

          {/* Course Details */}
          <div className="space-y-1 max-w-lg mx-auto text-xs sm:text-sm text-[#15171C]">
            <p>has successfully completed the 8-week structured laboratory curriculum in</p>
            <p className="font-bold text-base sm:text-lg text-[#0B0C0F] pt-0.5">
              {certificate.courseTitle}
            </p>
            <p className="text-xs text-[#5A5F6B] pt-1">
              Verified: Level 1 to Level 8 · Practical Agents, Prompt Engineering & Autonomous Safety
            </p>
          </div>

          {/* Badges / Metrics Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold">
            <span className="rounded-full bg-[#E3F5E8] text-[#1F9D55] px-3 py-1 border border-[#1F9D55]/30">
              ✓ Distinction Grade
            </span>
            <span className="rounded-full bg-[#FFF1EC] text-[#FF6026] px-3 py-1 border border-[#FF6026]/30">
              {certificate.levelsCompleted} of {certificate.totalLevels} Levels Done
            </span>
            <span className="rounded-full bg-[#FAF9F5] text-[#5A5F6B] px-3 py-1 border border-[#E3E0D9]">
              School Lab Demo Day
            </span>
          </div>

          {/* Signatures & Seal Row */}
          <div className="pt-6 grid grid-cols-3 items-end gap-4 border-t border-[#E3E0D9]/80 text-xs text-[#5A5F6B]">
            <div>
              <p className="font-serif italic text-sm font-bold text-[#FF6026]">{tutorStr}</p>
              <div className="h-px bg-[#0B0C0F] my-1" />
              <p className="font-bold text-[#0B0C0F]">{tutorStr}</p>
              <p className="text-[10px]">Lead AI Tutor</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="size-16 rounded-full border-2 border-dashed border-[#FF6026] bg-[#FFF8F5] flex flex-col items-center justify-center text-[9px] font-bold text-[#FF6026] shadow-xs">
                <span>OFFICIAL</span>
                <span className="text-[#0B0C0F]">SEAL</span>
                <span className="text-[8px] text-[#5A5F6B]">2026</span>
              </div>
            </div>

            <div>
              <p className="font-semibold text-[#0B0C0F]">{dateStr}</p>
              <div className="h-px bg-[#0B0C0F] my-1" />
              <p className="font-bold text-[#0B0C0F]">Date of Issue</p>
              <p className="text-[10px] font-mono text-[#5A5F6B]">{certCode}</p>
            </div>
          </div>
        </div>

        {/* Action Controls & Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-[#5A5F6B] text-center sm:text-left">
            <p>Verification Code: <span className="font-mono font-bold text-[#0B0C0F]">{certCode}</span></p>
            <p className="text-[11px] text-[#A7ACB8]">Direct vector SVG and printable format supported.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-full border border-[#E3E0D9] bg-white hover:bg-[#FAF9F5] px-4 py-2.5 text-xs font-semibold text-[#0B0C0F] transition cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="flex items-center gap-1.5 rounded-full bg-[#FF6026] hover:bg-[#E8531C] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Download certificate (.svg)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

