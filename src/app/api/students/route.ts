import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth-session";
import { dbManager } from "@/../backend/database/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const parentUserId = session?.userId || req.nextUrl.searchParams.get("parentUserId");

    if (!parentUserId) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const students = await dbManager.commerce.getStudentsByParentId(parentUserId);

    // Attach active enrollment details for each student
    const enriched = await Promise.all(
      students.map(async (student) => {
        const enrollments = await dbManager.commerce.getEnrollmentsByStudentId(student.id);
        const activeEnrollment = enrollments.find(
          (e) => e.status === "ENROLLED" || e.status === "PENDING_PAYMENT"
        );
        return {
          ...student,
          isEnrolled: Boolean(activeEnrollment && activeEnrollment.status === "ENROLLED"),
          activeEnrollment: activeEnrollment || null,
        };
      })
    );

    return NextResponse.json({ success: true, students: enriched });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const body = await req.json();

    const parentUserId = session?.userId || body.parentUserId;
    if (!parentUserId) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const fullName = String(body.fullName || "").trim();
    const currentGrade = Number(body.currentGrade || 6);
    const schoolName = String(body.schoolName || "Partner School").trim();
    const schoolUid = String(body.schoolUid || schoolName.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 16)).toUpperCase();
    const section = body.section ? String(body.section).trim() : undefined;
    const preferredTrack = body.preferredTrack ? String(body.preferredTrack).trim() : "robotics";
    const priorExperience = body.priorExperience ? String(body.priorExperience).trim() : "beginner";

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: "Please enter your child's full name." }, { status: 400 });
    }

    if (!currentGrade || currentGrade < 5 || currentGrade > 11) {
      return NextResponse.json({ error: "Please select a grade between 5 and 11." }, { status: 400 });
    }

    const studentId = `std_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const student = {
      id: studentId,
      parentUserId,
      fullName,
      schoolUid: schoolUid || "SCH_GENERAL",
      schoolName,
      currentGrade,
      section,
      preferredTrack,
      priorExperience,
      createdAt: new Date(),
    };

    await dbManager.commerce.upsertStudent(student);

    // Recommended enrol URL for frictionless step 2
    const recommendedEnrollUrl = `/enrol?studentId=${student.id}&studentName=${encodeURIComponent(student.fullName)}&grade=${student.currentGrade}&track=${encodeURIComponent(preferredTrack)}`;

    return NextResponse.json({
      success: true,
      student,
      recommendedEnrollUrl,
      message: `Profile created for ${student.fullName}. Now proceed to enrol them in their track.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

