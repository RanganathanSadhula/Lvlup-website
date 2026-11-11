import { NextRequest, NextResponse } from "next/server";
import { dbManager } from "@/../backend/database/client";

export async function GET(req: NextRequest) {
  try {
    const studentId = req.nextUrl.searchParams.get("studentId");
    const courseId = req.nextUrl.searchParams.get("courseId") || undefined;

    if (!studentId) {
      return NextResponse.json({ error: "Missing required studentId parameter." }, { status: 400 });
    }

    const [student, progress, analysis] = await Promise.all([
      dbManager.commerce.getStudentById(studentId),
      dbManager.commerce.getCourseProgressByStudent(studentId, courseId),
      dbManager.commerce.getLearningAnalysis(studentId),
    ]);

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      student,
      progress: progress || null,
      analysis: analysis || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentId = String(body.studentId || "").trim();
    const milestoneId = String(body.milestoneId || "").trim();

    if (!studentId) {
      return NextResponse.json({ error: "Missing required studentId parameter." }, { status: 400 });
    }

    const currentProgress = await dbManager.commerce.getCourseProgressByStudent(studentId);
    if (!currentProgress) {
      return NextResponse.json({ error: "No active progress found for this student." }, { status: 404 });
    }

    // Toggle milestone or mark completed
    const updatedMilestones = currentProgress.milestones.map((m) => {
      if (m.id === milestoneId) {
        const completed = !m.completed;
        return {
          ...m,
          completed,
          completedAt: completed ? new Date() : undefined,
          score: completed ? (m.score || 95) : undefined,
        };
      }
      return m;
    });

    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const totalCount = updatedMilestones.length || 6;
    const completionPercentage = Math.round((completedCount / totalCount) * 100);
    const completedMinutes = completedCount * 90;
    const lengthLeftMinutes = Math.max(0, currentProgress.totalEstimatedMinutes - completedMinutes);

    const updated = await dbManager.commerce.upsertCourseProgress({
      ...currentProgress,
      milestones: updatedMilestones,
      completionPercentage,
      completedMinutes,
      lengthLeftMinutes,
      currentWeek: Math.min(currentProgress.totalWeeks, completedCount + 1),
      lastActiveAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      progress: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

