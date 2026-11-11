import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth-session";
import { dbManager } from "@/../backend/database/client";
import { allCourses, tracksData } from "@/data/tracks";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const body = await req.json();

    const studentId = String(body.studentId || "").trim();
    const courseId = String(body.courseId || "ai-agents-starter").trim();
    const trackId = String(body.trackId || "ai").trim();
    const paymentPlan = (body.paymentPlan === "INSTALLMENTS" ? "INSTALLMENTS" : "FULL") as "FULL" | "INSTALLMENTS";

    if (!studentId) {
      return NextResponse.json({ error: "Please select a student to enrol." }, { status: 400 });
    }

    const student = await dbManager.commerce.getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student profile not found." }, { status: 404 });
    }

    const parentUserId = session?.userId || student.parentUserId || "usr_demo_parent";

    // Find course title and pricing
    const matchedCourse = allCourses.find((c) => c.id === courseId) || allCourses[0];
    const courseTitle = matchedCourse?.title || "AI & Agents: Build a Study Bot";
    const amountInRupees = matchedCourse?.price || 4499;

    const result = await dbManager.commerce.enrollAndInitializeLearning({
      studentId,
      courseId,
      courseTitle,
      trackId,
      parentUserId,
      paymentPlan,
      amountInRupees,
    });

    return NextResponse.json({
      success: true,
      message: `Enrolment complete for ${student.fullName}! OpenWA WhatsApp and Microsoft Graph notifications dispatched.`,
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

