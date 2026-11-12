import { NextRequest, NextResponse } from "next/server";
import { dbManager } from "@/../backend/database/client";
import { allCourses, getCourseById } from "@/data/tracks";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;
    const requestedCourseId = req.nextUrl.searchParams.get("courseId") || undefined;

    // Fetch student from DB or provide fallback
    let student = await dbManager.commerce.getStudentById(studentId);
    if (!student && studentId === "aarav") {
      student = {
        id: "aarav",
        parentUserId: "usr_priya_sharma",
        fullName: "Aarav Sharma",
        currentGrade: 6,
        schoolName: "The Bishop's School",
        schoolUid: "THE_BISHOPS_SCHOOL",
        preferredTrack: "ai",
        priorExperience: "intermediate",
        createdAt: new Date(),
      };
      await dbManager.commerce.upsertStudent(student);
    }

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    // Get active enrollments
    const enrollments = await dbManager.commerce.getEnrollmentsByStudentId(student.id);
    const activeEnrollment = requestedCourseId
      ? enrollments.find((e) => e.courseId === requestedCourseId) || enrollments[0]
      : enrollments[0];

    const courseId = activeEnrollment?.courseId || "ai-study-helper";
    const course = getCourseById(courseId) || allCourses[0];

    // Build the dynamic 8-level curriculum roadmap matching Figma 741:3244
    const levels = [
      {
        levelNumber: 1,
        title: "Level 1 · Problem map",
        weekTitle: "Week 1 · build task reviewed",
        status: "completed",
        score: 95,
        actionLabel: "Review",
      },
      {
        levelNumber: 2,
        title: "Level 2 · Tested prompts",
        weekTitle: "Week 2 · build task reviewed",
        status: "completed",
        score: 92,
        actionLabel: "Review",
      },
      {
        levelNumber: 3,
        title: "Level 3 · AI creation",
        weekTitle: "Week 3 · build task reviewed",
        status: "completed",
        score: 90,
        actionLabel: "Review",
      },
      {
        levelNumber: 4,
        title: "Level 4 · Interactive flow",
        weekTitle: "Week 4 · build task reviewed",
        status: "completed",
        score: 96,
        actionLabel: "Review",
      },
      {
        levelNumber: 5,
        title: "Level 5 · Agent blueprint",
        weekTitle: "Week 5 · build task reviewed",
        status: "completed",
        score: 94,
        actionLabel: "Review",
      },
      {
        levelNumber: 6,
        title: "Level 6 · Working agent",
        weekTitle: "Week 6 · 2 of 5 lessons done",
        status: "in_progress",
        actionLabel: "In progress",
        lessons: [
          {
            id: "lesson-1",
            lessonNumber: 1,
            title: "Starter template",
            type: "Video",
            duration: "12 min",
            status: "done",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          },
          {
            id: "lesson-2",
            lessonNumber: 2,
            title: "Agent instructions",
            type: "Build task",
            duration: "15 min",
            status: "done",
          },
          {
            id: "lesson-3",
            lessonNumber: 3,
            title: "Connect the steps",
            type: "Video",
            duration: "18 min",
            status: "resume",
            tutor: "Ms Ananya Rao",
            overviewText:
              "Your agent can now read a question. In this lesson you join two steps so the answer from the first step feeds the second. Then you test it with a real question from your class.",
            chapters: [
              { timestamp: "00:00", title: "Why order matters", status: "watched" },
              { timestamp: "04:10", title: "Connecting two steps", status: "playing" },
              { timestamp: "11:30", title: "Test it with a real question", status: "upcoming" },
            ],
          },
          {
            id: "lesson-4",
            lessonNumber: 4,
            title: "Test two tasks",
            type: "Quiz",
            duration: "14 min",
            status: "up_next",
          },
          {
            id: "lesson-5",
            lessonNumber: 5,
            title: "Improve and protect",
            type: "Video",
            duration: "16 min",
            status: "up_next",
          },
        ],
      },
      {
        levelNumber: 7,
        title: "Level 7 · Improve and polish",
        weekTitle: "Week 7 · opens after level 6",
        status: "locked",
      },
      {
        levelNumber: 8,
        title: "Level 8 · Demo for parents",
        weekTitle: "Week 8 · opens after level 7",
        status: "locked",
      },
    ];

    // Build Task details
    const activeBuildTask = {
      title: "Give your agent a memory",
      dueDate: "Due Fri, 9:00 PM",
      statusText: "1 of 3 checks done · draft saved",
      checks: [
        { id: "c1", label: "Agent remembers previous question subject", passed: true },
        { id: "c2", label: "Politely responds with clarification hint", passed: false },
        { id: "c3", label: "Saves conversation session locally", passed: false },
      ],
    };

    // Downloadable Materials
    const materials = [
      { id: "m1", title: "Level 6 worksheet", type: "PDF · 2 pages", filename: "Level-6-Worksheet.pdf" },
      { id: "m2", title: "Agent template", type: "Opens in the builder", filename: "thinkova-agent-template.json" },
      { id: "m3", title: "Safety checklist", type: "PDF · 1 page", filename: "Safety-Checklist.pdf" },
    ];

    return NextResponse.json({
      success: true,
      student,
      course,
      activeLevelNumber: 6,
      progressPercentage: 68,
      nextLiveClass: {
        time: "Thu, 6:00 PM",
        tutor: "Ms Ananya Rao",
        topic: "Level 7 · Personalise and improve",
      },
      levels,
      activeBuildTask,
      materials,
      otherCourses: allCourses
        .filter((c) => c.id !== course.id)
        .slice(0, 2)
        .map((c) => ({
          id: c.id,
          title: c.title,
          batchDate: c.nextBatch,
          image: c.image,
        })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

