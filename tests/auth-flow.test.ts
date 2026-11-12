import { describe, it, expect, beforeEach } from "vitest";
import { dbManager } from "../backend/database/client";
import { createSessionToken, verifySessionToken } from "../src/lib/auth-session";
import { notificationDispatcher } from "../backend/notifications/dispatcher";

describe("Parent Auth & Student Profiles Flow", () => {
  beforeEach(() => {
    dbManager.memory.clearAll();
    notificationDispatcher.clearOutbox();
  });

  it("1. Generates and verifies HMAC-SHA256 session token", async () => {
    const payload = {
      userId: "usr_test_123",
      email: "parent@example.com",
      username: "parent123",
      fullName: "Anita Desai",
      phone: "9820011223",
      role: "PARENT" as const,
    };

    const token = await createSessionToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe("usr_test_123");
    expect(verified?.email).toBe("parent@example.com");
    expect(verified?.fullName).toBe("Anita Desai");
  });

  it("2. Persists parent signup and triggers welcome notification", async () => {
    const parent = {
      id: "usr_parent_001",
      fullName: "Siddharth Rao",
      username: "siddharth",
      email: "siddharth.rao@example.com",
      phone: "9820143210",
      role: "PARENT" as const,
      isPhoneVerified: true,
      isEmailVerified: true,
      consentTimestamp: new Date(),
      createdAt: new Date(),
    };

    await dbManager.commerce.upsertUser(parent);

    const fetched = await dbManager.commerce.getUserByEmail("siddharth.rao@example.com");
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe("usr_parent_001");
    expect(fetched?.fullName).toBe("Siddharth Rao");

    // Check notification outbox
    await notificationDispatcher.sendEmail({
      to: parent.email,
      subject: `Welcome to ThinkOva, ${parent.fullName}!`,
      text: "Welcome",
      html: "<p>Welcome</p>",
    });

    const emails = notificationDispatcher.getEmailOutbox(parent.email);
    expect(emails.length).toBe(1);
    expect(emails[0]?.subject).toContain("Siddharth Rao");
  });

  it("3. Creates student profile linked to parent", async () => {
    const parentId = "usr_parent_002";
    const student = {
      id: "std_001",
      parentUserId: parentId,
      fullName: "Aarav Rao",
      schoolUid: "SCH_DPS_RKP",
      schoolName: "Delhi Public School, R.K. Puram",
      currentGrade: 6,
      preferredTrack: "robotics",
      priorExperience: "beginner",
      createdAt: new Date(),
    };

    await dbManager.commerce.upsertStudent(student);

    const students = await dbManager.commerce.getStudentsByParentId(parentId);
    expect(students.length).toBe(1);
    expect(students[0]?.fullName).toBe("Aarav Rao");
    expect(students[0]?.currentGrade).toBe(6);
    expect(students[0]?.preferredTrack).toBe("robotics");
  });

  it("4. Adds another student to profile and prepares enrolment URL", async () => {
    const parentId = "usr_parent_003";

    // Student 1 (Aarav)
    await dbManager.commerce.upsertStudent({
      id: "std_101",
      parentUserId: parentId,
      fullName: "Aarav Rao",
      schoolUid: "SCH_DPS",
      schoolName: "Delhi Public School",
      currentGrade: 6,
      preferredTrack: "robotics",
      createdAt: new Date(),
    });

    // Student 2 (Ananya - Sibling)
    const sibling = {
      id: "std_102",
      parentUserId: parentId,
      fullName: "Ananya Rao",
      schoolUid: "SCH_DPS",
      schoolName: "Delhi Public School",
      currentGrade: 8,
      preferredTrack: "ai",
      createdAt: new Date(),
    };
    await dbManager.commerce.upsertStudent(sibling);

    const familyStudents = await dbManager.commerce.getStudentsByParentId(parentId);
    expect(familyStudents.length).toBe(2);

    // Verify enrolment URL generation for the newly added sibling
    const recommendedEnrollUrl = `/enrol?studentId=${sibling.id}&studentName=${encodeURIComponent(sibling.fullName)}&grade=${sibling.currentGrade}&track=${sibling.preferredTrack}`;
    expect(recommendedEnrollUrl).toContain("studentId=std_102");
    expect(recommendedEnrollUrl).toContain("track=ai");
    expect(recommendedEnrollUrl).toContain("grade=8");
  });
});
