import { describe, it, expect } from "vitest";
import { getStudentProgressData, CANONICAL_COURSES_PROGRESS } from "../src/data/progress-data";
import { GET as getCertificates, POST as postCertificates } from "../src/app/api/learning/certificates/route";
import { GET as downloadCertificate } from "../src/app/api/learning/certificates/download/route";
import { NextRequest } from "next/server";

describe("Progress & Certificates Engine and API", () => {
  it("1. Loads canonical course progress matching exact Figma image specifications", () => {
    const progress = getStudentProgressData("aarav", "ai-for-young-creators", "Aarav Sharma");

    // Top 4 stats
    expect(progress.lessonsDone).toBe(27);
    expect(progress.totalLessons).toBe(40);
    expect(progress.levelsDone).toBe(5);
    expect(progress.totalLevels).toBe(8);
    expect(progress.timeLearning).toBe("18 h 30 m");
    expect(progress.buildTasksReviewed).toBe(4);
    expect(progress.overallPercentage).toBe(68);

    // 8-Week path steps
    expect(progress.pathSteps.length).toBe(8);
    expect(progress.pathSteps[0]?.title).toBe("Problem map");
    expect(progress.pathSteps[0]?.status).toBe("completed");
    expect(progress.pathSteps[5]?.title).toBe("Working agent");
    expect(progress.pathSteps[5]?.status).toBe("active");
    expect(progress.pathSteps[7]?.title).toBe("Demo day");
    expect(progress.pathSteps[7]?.status).toBe("upcoming");

    // Build tasks list
    expect(progress.buildTasks.length).toBe(6);
    expect(progress.buildTasks[0]?.title).toBe("Problem map and safety pledge");
    expect(progress.buildTasks[0]?.badgeLabel).toBe("Great");
    expect(progress.buildTasks[5]?.title).toBe("Give your agent a memory");
    expect(progress.buildTasks[5]?.badgeLabel).toBe("Due Fri");
    expect(progress.buildTasks[5]?.actionLabel).toBe("Open");

    // Badges & Skills
    expect(progress.badges.length).toBe(3);
    expect(progress.badges[0]?.title).toBe("Agent Builder badge");
    expect(progress.skills.length).toBe(4);
    expect(progress.skills.find((s) => s.name === "Prompting")?.percentage).toBe(80);
    expect(progress.skills.find((s) => s.name === "Safety")?.percentage).toBe(90);
  });

  it("2. GET /api/learning/certificates returns progress summary and certificate metadata", async () => {
    const req = new NextRequest("http://localhost:3000/api/learning/certificates?studentId=aarav&courseId=ai-for-young-creators&studentName=Aarav%20Sharma");
    const res = await getCertificates(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.summary.lessonsDone).toBe(27);
    expect(data.summary.levelsDone).toBe(5);
    expect(data.certificate.courseTitle).toBe("AI for Young Creators");
    expect(data.certificate.studentName).toBe("Aarav Sharma");
    expect(data.verificationCode).toBe("THINKOVA-CERT-2026-AI-84920");
    expect(data.downloadUrl).toContain("/api/learning/certificates/download");
  });

  it("3. POST /api/learning/certificates allows unlocking demo or claiming certificate", async () => {
    const req = new NextRequest("http://localhost:3000/api/learning/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: "aarav",
        courseId: "ai-for-young-creators",
        studentName: "Aarav Sharma",
        action: "unlock_demo",
      }),
    });

    const res = await postCertificates(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.certificate.isUnlocked).toBe(true);
    expect(data.certificate.unlockedText).toContain("Issued on Demo Day");
  });

  it("4. GET /api/learning/certificates/download generates an official SVG certificate", async () => {
    const req = new NextRequest("http://localhost:3000/api/learning/certificates/download?studentId=aarav&courseId=ai-for-young-creators&studentName=Aarav%20Sharma");
    const res = await downloadCertificate(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("image/svg+xml");
    expect(res.headers.get("Content-Disposition")).toContain("attachment; filename=");

    const text = await res.text();
    expect(text).toContain("<svg");
    expect(text).toContain("THINKOVA LEARNING LABS");
    expect(text).toContain("Certificate of Achievement");
    expect(text).toContain("Aarav Sharma");
    expect(text).toContain("AI for Young Creators");
    expect(text).toContain("THINKOVA-CERT-2026-AI-84920");
  });

  it("5. Supports multiple enrolled courses dynamically", () => {
    const robProgress = getStudentProgressData("aarav", "robotics-starter", "Aarav Sharma");
    expect(robProgress.courseTitle).toBe("Robotics Starter: Build a Rover");
    expect(robProgress.levelsDone).toBe(0);
    expect(robProgress.totalLevels).toBe(8);
    expect(robProgress.pathSteps[0]?.title).toBe("Unbox & Motors");
  });
});

