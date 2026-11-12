import { NextRequest, NextResponse } from "next/server";

interface TutorQuestion {
  id: string;
  studentId: string;
  studentName: string;
  lessonTitle: string;
  questionText: string;
  attachmentName?: string;
  status: "submitted" | "answered";
  createdAt: string;
  tutorReply?: {
    tutorName: string;
    tutorRole: string;
    repliedAt: string;
    message: string;
  };
}

// In-memory store for tutor interactions
const tutorQuestionsStore: TutorQuestion[] = [
  {
    id: "q-seed-1",
    studentId: "aarav",
    studentName: "Aarav Sharma",
    lessonTitle: "Level 6 · Lesson 3: Connect the steps",
    questionText: "How do I make sure the agent remembers what subject was mentioned in step 1 when it answers in step 2?",
    attachmentName: "agent-draft.json",
    status: "answered",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    tutorReply: {
      tutorName: "Ms Ananya Rao",
      tutorRole: "AI & Robotics Mentor",
      repliedAt: new Date(Date.now() - 3600000).toISOString(),
      message: "Hi Aarav! In Lesson 3 at 04:10, we pass the memory state object across sequential steps. Make sure your step 2 function takes `context.previousTurn` as an argument before crafting its reply!",
    },
  },
];

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("studentId") || "aarav";
  const studentQuestions = tutorQuestionsStore.filter((q) => q.studentId === studentId);

  return NextResponse.json({
    success: true,
    questions: studentQuestions,
    tutor: {
      name: "Ms Ananya Rao",
      role: "Lead AI & Robotics Mentor",
      school: "The Bishop's School Lab",
      availability: "Replies within a few hours",
      avatarUrl: "/images/auth-lab.jpg",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentId = String(body.studentId || "aarav");
    const studentName = String(body.studentName || "Aarav Sharma");
    const lessonTitle = String(body.lessonTitle || "Level 6 · Lesson 3: Connect the steps");
    const questionText = String(body.questionText || "").trim();
    const attachmentName = body.attachmentName ? String(body.attachmentName) : undefined;

    if (!questionText) {
      return NextResponse.json(
        { error: "Question text cannot be empty." },
        { status: 400 }
      );
    }

    const newQuestionId = `tq-${Date.now()}`;

    // Instant realistic tutor reply generation tailored to the student's question
    let tutorResponse = "Hi Aarav! Great question. Make sure your step 1 output passes its structured JSON payload into step 2, and review the chapter at 04:10 in the lesson player!";
    if (questionText.toLowerCase().includes("memory") || questionText.toLowerCase().includes("remember")) {
      tutorResponse = "Hi Aarav! For agent memory, retain the subject in a `memory_context` variable. In your build task, test it with: 'My favorite planet is Saturn' followed by 'Which planet was that?'.";
    } else if (questionText.toLowerCase().includes("safety") || questionText.toLowerCase().includes("protect")) {
      tutorResponse = "Hi Aarav! Your safety check should intercept every reply. If user input asks for unsafe or unverified advice, the safety rule should prompt: 'I don't know that yet, let's ask your teacher.'";
    }

    const questionEntry: TutorQuestion = {
      id: newQuestionId,
      studentId,
      studentName,
      lessonTitle,
      questionText,
      attachmentName,
      status: "answered",
      createdAt: new Date().toISOString(),
      tutorReply: {
        tutorName: "Ms Ananya Rao",
        tutorRole: "AI & Robotics Mentor",
        repliedAt: new Date(Date.now() + 1000).toISOString(),
        message: tutorResponse,
      },
    };

    tutorQuestionsStore.unshift(questionEntry);

    return NextResponse.json({
      success: true,
      message: "Question successfully delivered to Tutor Ms Ananya Rao. Notification sent.",
      notificationSent: true,
      question: questionEntry,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

