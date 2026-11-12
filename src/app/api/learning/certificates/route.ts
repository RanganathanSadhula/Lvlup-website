import { NextRequest, NextResponse } from "next/server";
import { getStudentProgressData } from "@/data/progress-data";

export async function GET(req: NextRequest) {
  try {
    const studentId = req.nextUrl.searchParams.get("studentId") || "aarav";
    const courseId = req.nextUrl.searchParams.get("courseId") || "ai-for-young-creators";
    const studentName = req.nextUrl.searchParams.get("studentName") || "Aarav Sharma";

    const progress = getStudentProgressData(studentId, courseId, studentName);

    return NextResponse.json({
      success: true,
      studentId,
      courseId,
      certificate: progress.certificate,
      badges: progress.badges,
      skills: progress.skills,
      summary: {
        lessonsDone: progress.lessonsDone,
        totalLessons: progress.totalLessons,
        levelsDone: progress.levelsDone,
        totalLevels: progress.totalLevels,
        timeLearning: progress.timeLearning,
        overallPercentage: progress.overallPercentage,
        buildTasksReviewed: progress.buildTasksReviewed,
      },
      verificationCode: progress.certificate.certificateCode,
      downloadUrl: `/api/learning/certificates/download?studentId=${studentId}&courseId=${courseId}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentId = String(body.studentId || "aarav").trim();
    const courseId = String(body.courseId || "ai-for-young-creators").trim();
    const studentName = String(body.studentName || "Aarav Sharma").trim();
    const action = String(body.action || "verify").trim();

    const progress = getStudentProgressData(studentId, courseId, studentName);

    if (action === "unlock_demo" || action === "claim") {
      // Unlocks or issues the certificate
      const unlockedCert = {
        ...progress.certificate,
        isUnlocked: true,
        unlockedText: "Issued on Demo Day · Verified by Lead AI Tutor",
        issuedAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };

      return NextResponse.json({
        success: true,
        message: "Certificate verified and ready for download.",
        certificate: unlockedCert,
        downloadUrl: `/api/learning/certificates/download?studentId=${studentId}&courseId=${courseId}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Certificate verification status retrieved.",
      certificate: progress.certificate,
      isEligible: progress.levelsDone >= progress.totalLevels,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

