import { describe, it, expect } from "vitest";
import { GET as getDeviceSpecimen, POST as postDeviceSpecimen } from "../src/app/api/profile/device-specimen/route";
import { NextRequest } from "next/server";

describe("Profile and Device Specimen Handshake API", () => {
  it("1. GET /api/profile/device-specimen returns hardware specimen telemetry", async () => {
    const req = new NextRequest("http://localhost:3000/api/profile/device-specimen?studentId=aarav");
    const res = await getDeviceSpecimen(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.specimen).toBeDefined();

    // Hardware kit validation
    expect(data.specimen.hardwareKit.model).toContain("ThinkOva Alpha Kit v2.1");
    expect(data.specimen.hardwareKit.serialNumber).toBe("SPEC-TK-9021-PUN");
    expect(data.specimen.hardwareKit.connectionStatus).toBe("ONLINE_PAIRED");
    expect(data.specimen.hardwareKit.batteryLevelPercentage).toBe(94);

    // Client specimen diagnostics
    expect(data.specimen.clientSpecimen.webSerialSupported).toBe(true);
    expect(data.specimen.clientSpecimen.webUsbSupported).toBe(true);
    expect(data.specimen.clientSpecimen.diagnosticsPassed).toBe(true);

    // Provisioned persona
    expect(data.specimen.learningPersona.current).toBe("LOGICIAN");
    expect(data.specimen.learningPersona.traits).toContain("Algorithmic reasoning & multi-step chaining");
  });

  it("2. POST /api/profile/device-specimen runs diagnostics handshake", async () => {
    const req = new NextRequest("http://localhost:3000/api/profile/device-specimen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "run_diagnostics",
        studentId: "aarav",
      }),
    });
    const res = await postDeviceSpecimen(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.status).toBe("ONLINE_PAIRED");
    expect(data.message).toContain("diagnostics completed");
  });

  it("3. POST /api/profile/device-specimen tunes learner persona", async () => {
    const req = new NextRequest("http://localhost:3000/api/profile/device-specimen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "tune_persona",
        studentId: "aarav",
        persona: "BUILDER",
        schoolName: "Banyan Grove School, Pune",
      }),
    });
    const res = await postDeviceSpecimen(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Persona updated to BUILDER");
  });

  it("4. AppSidebar routes profile navigation directly to /profile instead of /who-is-learning", async () => {
    // Read the AppSidebar file to verify the navItem mapping
    const fs = await import("fs");
    const appSidebarContent = fs.readFileSync("src/components/layout/AppSidebar.tsx", "utf8");

    // Profile item must route to /profile
    expect(appSidebarContent).toContain('id: "profile"');
    expect(appSidebarContent).toMatch(/id:\s*"profile"[\s\S]*?label:\s*"Profile"[\s\S]*?href:\s*"\/profile"/);

    // Switch learner still routes to /who-is-learning
    expect(appSidebarContent).toContain('router.push("/who-is-learning")');
  });
});

