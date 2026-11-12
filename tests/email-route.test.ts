import { describe, it, expect } from "vitest";
import { GET as getSmtpSend, POST as postSmtpSend } from "../src/app/api/smtp/send/route";
import { POST as postSchoolPack } from "../src/app/api/school-pack/route";

describe("Email Routes & Template Generation Verification", () => {
  // 1. Test GET /api/smtp/send (Preview & Generation Check)
  it("1. GET /api/smtp/send generates dynamic Principal email with correct salutation", async () => {
    const req = new Request("http://localhost:3000/api/smtp/send?template=principalOutreach&name=Priya+Sharma&school=Delhi+Public+School,+Pune&role=Principal");
    const res = await getSmtpSend(req);

    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.status).toBe("ok");
    expect(data.template).toBe("principalOutreach");
    expect(data.salutation).toBe("Dear Principal Sharma,");
    expect(data.subject).toContain("Delhi Public School, Pune");
    expect(data.text).toContain("Dear Principal Sharma,");
    expect(data.text).toContain("Delhi Public School, Pune");
    expect(data.htmlLength).toBeGreaterThan(1000);
  });

  it("2. GET /api/smtp/send?format=html returns clean renderable HTML document", async () => {
    const req = new Request("http://localhost:3000/api/smtp/send?template=principalOutreach&name=Dr.+Anita+Desai&school=Bishop%27s+School&format=html");
    const res = await getSmtpSend(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/html");

    const html = await res.text();
    expect(html).toContain("Dear Principal Dr. Anita Desai,");
    expect(html).toContain("Bishop's School");
    expect(html).toContain("principal-hero-student.png");
    expect(html).toContain("principal-case-study.jpg");
    expect(html).toContain("principal-generative-ai-girl.png");
    expect(html).toContain("Sumit Sharma");
    expect(html).toContain("+91 96066 26152");
  });

  // 2. Test POST /api/smtp/send (Dispatch & Preview)
  it("3. POST /api/smtp/send renders template and returns generated payload in preview mode", async () => {
    const req = new Request("http://localhost:3000/api/smtp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: "principalOutreach",
        previewOnly: true,
        data: {
          principalName: "Ramesh Kulkarni",
          schoolName: "St. Mary's High School",
          city: "Pune",
          role: "Principal",
        },
      }),
    });

    const res = await postSmtpSend(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.status).toBe("rendered_success");
    expect(data.subject).toContain("St. Mary's High School");
    expect(data.html).toContain("Dear Principal Kulkarni,");
    expect(data.html).toContain("St. Mary's High School");
    expect(data.html).toContain("principal-hero-student.png");
  });

  // 3. Test POST /api/school-pack (School Registry creates school and dispatches email)
  it("4. POST /api/school-pack dynamically registers school and dispatches Principal email", async () => {
    const req = new Request("http://localhost:3000/api/school-pack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Priya Sharma",
        schoolName: "Delhi Public School",
        city: "Pune",
        role: "Principal",
        phone: "9876543210",
        email: "priya.sharma@dps-pune.edu",
      }),
    });

    const res = await postSchoolPack(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.ok).toBe(true);
    expect(data.salutation).toBe("Dear Principal Sharma,");
    expect(data.schoolName).toBe("Delhi Public School");
    expect(data.leadId).toBeDefined();
  });

  it("5. POST /api/school-pack rejects static fallback: requires dynamic school name and city", async () => {
    const req = new Request("http://localhost:3000/api/school-pack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Sunil Verma",
        role: "Principal",
        phone: "9876543210",
      }),
    });

    const res = await postSchoolPack(req);
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.error).toContain("Please provide both school name and city");
    expect(data.issues).toBeDefined();
  });

  it("6. GET /api/smtp/send dynamically uses registered school from database when params are omitted", async () => {
    // 1. Seed a school
    const { dbManager } = await import("../backend/database/client");
    await dbManager.schools.upsertSchool({
      id: "sch_dynamic_demo",
      schoolUid: "SCH-KOL-999",
      officialName: "The Heritage School, Kolkata",
      slug: "the-heritage-school",
      city: "Kolkata",
      state: "West Bengal",
      board: "CBSE",
      labCapacity: 30,
      coordinatorName: "Meenakshi Mukherjee",
      partnerCommissionPct: 0,
      status: "ACTIVE",
      createdAt: new Date(),
    });

    // 2. Call GET /api/smtp/send with NO name or school params
    const req = new Request("http://localhost:3000/api/smtp/send?template=principalOutreach");
    const res = await getSmtpSend(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.salutation).toBe("Dear Principal Mukherjee,");
    expect(data.subject).toContain("The Heritage School, Kolkata");
    expect(data.text).toContain("Dear Principal Mukherjee,");
    expect(data.text).toContain("The Heritage School, Kolkata");
  });

  it("7. GET /api/mail and /api/mail/send provide Microsoft Graph service metadata", async () => {
    const { GET: getMailStatus } = await import("../src/app/api/mail/route");
    const { GET: getMailSend } = await import("../src/app/api/mail/send/route");

    const statusRes = await getMailStatus();
    expect(statusRes.status).toBe(200);
    const statusData = await statusRes.json();
    expect(statusData.service).toContain("Microsoft Graph API Mailer");
    expect(statusData.config.provider).toBe("Microsoft Graph API");

    const previewRes = await getMailSend(new Request("http://localhost:3000/api/mail/send?template=principalOutreach&name=Dr.+Anita+Desai&school=Bishop%27s+School"));
    expect(previewRes.status).toBe(200);
    const previewData = await previewRes.json();
    expect(previewData.provider).toBe("Microsoft Graph API");
    expect(previewData.salutation).toBe("Dear Principal Dr. Anita Desai,");
  });
});
