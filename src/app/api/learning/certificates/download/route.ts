import { NextRequest, NextResponse } from "next/server";
import { getStudentProgressData } from "@/data/progress-data";

export async function GET(req: NextRequest) {
  try {
    const studentId = req.nextUrl.searchParams.get("studentId") || "aarav";
    const courseId = req.nextUrl.searchParams.get("courseId") || "ai-for-young-creators";
    const studentName = req.nextUrl.searchParams.get("studentName") || "Aarav Sharma";

    const data = getStudentProgressData(studentId, courseId, studentName);
    const cert = data.certificate;
    const certCode = cert.certificateCode || `THINKOVA-CERT-2026-${studentId.toUpperCase()}`;
    const dateStr = cert.issuedAt || "21 Nov 2026";
    const tutorStr = cert.tutorName || "Ms Ananya Rao";

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 850" width="1200" height="850">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFBF7" />
      <stop offset="100%" stop-color="#F4F1EA" />
    </linearGradient>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B2C" />
      <stop offset="100%" stop-color="#E8531C" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="850" fill="url(#bgGrad)" />

  <!-- Outer Double Borders -->
  <rect x="36" y="36" width="1128" height="778" rx="16" fill="none" stroke="#D5D0C5" stroke-width="2" />
  <rect x="48" y="48" width="1104" height="754" rx="12" fill="none" stroke="#FF6B2C" stroke-width="3" stroke-dasharray="8 4" opacity="0.6" />

  <!-- Corner Flourishes -->
  <circle cx="48" cy="48" r="6" fill="#FF6B2C" />
  <circle cx="1152" cy="48" r="6" fill="#FF6B2C" />
  <circle cx="48" cy="802" r="6" fill="#FF6B2C" />
  <circle cx="1152" cy="802" r="6" fill="#FF6B2C" />

  <!-- ThinkOva Branding Top -->
  <g transform="translate(600, 130)">
    <!-- Brand Icon -->
    <path d="M-18 -20 L-6 4 L6 4 L18 -20 Z" fill="url(#brandGrad)" />
    <circle cx="0" cy="-28" r="4" fill="#FF6B2C" />
    <text x="0" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" letter-spacing="4" fill="#0B0C0F" text-anchor="middle">THINKOVA LEARNING LABS</text>
    <text x="0" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" letter-spacing="2" fill="#5A5F6B" text-anchor="middle">OFFICIAL CERTIFICATE OF COMPLETION</text>
  </g>

  <!-- Main Certificate Title -->
  <text x="600" y="260" font-family="Georgia, serif" font-size="38" font-weight="bold" fill="#0B0C0F" text-anchor="middle" letter-spacing="1">Certificate of Achievement</text>
  <text x="600" y="295" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#5A5F6B" text-anchor="middle">This certifies that</text>

  <!-- Student Name -->
  <text x="600" y="370" font-family="Georgia, serif" font-size="46" font-weight="bold" fill="#FF6B2C" text-anchor="middle">${studentName}</text>
  <line x1="340" y1="395" x2="860" y2="395" stroke="#D5D0C5" stroke-width="1.5" />

  <!-- Course Completion Prose -->
  <text x="600" y="440" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#15171C" text-anchor="middle">has successfully completed the comprehensive hands-on curriculum in</text>
  <text x="600" y="480" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#0B0C0F" text-anchor="middle">${data.courseTitle}</text>
  <text x="600" y="515" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#5A5F6B" text-anchor="middle">Verified Level 1 to Level 8 · Practical Agents, Prompt Engineering &amp; Autonomous System Safety</text>

  <!-- Achievement Metric Badges -->
  <g transform="translate(600, 570)">
    <rect x="-240" y="-18" width="150" height="36" rx="18" fill="#E3F5E8" stroke="#1F9D55" stroke-width="1" />
    <text x="-165" y="5" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#1F9D55" text-anchor="middle">Grade: Distinction</text>

    <rect x="-70" y="-18" width="140" height="36" rx="18" fill="#FFF1EC" stroke="#FF6B2C" stroke-width="1" />
    <text x="0" y="5" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#FF6B2C" text-anchor="middle">5 of 8 Verified</text>

    <rect x="90" y="-18" width="150" height="36" rx="18" fill="#FAF9F5" stroke="#D5D0C5" stroke-width="1" />
    <text x="165" y="5" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#5A5F6B" text-anchor="middle">School Lab Demo</text>
  </g>

  <!-- Signatures & Verification Seal -->
  <!-- Tutor Signature -->
  <g transform="translate(260, 690)">
    <line x1="0" y1="0" x2="200" y2="0" stroke="#0B0C0F" stroke-width="1.5" />
    <text x="100" y="-10" font-family="'Brush Script MT', cursive, Georgia, serif" font-size="24" fill="#FF6B2C" text-anchor="middle">${tutorStr}</text>
    <text x="100" y="20" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#0B0C0F" text-anchor="middle">${tutorStr}</text>
    <text x="100" y="38" font-family="system-ui, sans-serif" font-size="11" fill="#5A5F6B" text-anchor="middle">Lead AI Tutor, ThinkOva Labs</text>
  </g>

  <!-- Center Official Seal -->
  <g transform="translate(600, 680)">
    <circle cx="0" cy="0" r="44" fill="#FFF8F5" stroke="#FF6B2C" stroke-width="2.5" />
    <circle cx="0" cy="0" r="38" fill="none" stroke="#FF6B2C" stroke-width="1" stroke-dasharray="3 3" />
    <text x="0" y="-4" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#FF6B2C" text-anchor="middle">OFFICIAL</text>
    <text x="0" y="10" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#0B0C0F" text-anchor="middle">VERIFIED</text>
    <text x="0" y="24" font-family="system-ui, sans-serif" font-size="8" fill="#5A5F6B" text-anchor="middle">2026</text>
  </g>

  <!-- Issue Date & Verification Code -->
  <g transform="translate(940, 690)">
    <line x1="-200" y1="0" x2="0" y2="0" stroke="#0B0C0F" stroke-width="1.5" />
    <text x="-100" y="-10" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#0B0C0F" text-anchor="middle">${dateStr}</text>
    <text x="-100" y="20" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#0B0C0F" text-anchor="middle">Date of Issuance</text>
    <text x="-100" y="38" font-family="monospace" font-size="10" fill="#5A5F6B" text-anchor="middle">${certCode}</text>
  </g>

  <!-- Footer security line -->
  <text x="600" y="780" font-family="system-ui, sans-serif" font-size="10" fill="#A7ACB8" text-anchor="middle">Verify credential authenticity online at thinkova.ai/verify?code=${certCode}</text>
</svg>`;

    const fileName = `ThinkOva-Certificate-${studentName.replace(/\s+/g, "-")}.svg`;

    return new NextResponse(svgContent, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

