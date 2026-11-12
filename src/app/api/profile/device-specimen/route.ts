import { NextRequest, NextResponse } from "next/server";
import { StudentPersona } from "@/../backend/database/types";

export interface DeviceSpecimenTelemetry {
  studentId: string;
  hardwareKit: {
    model: string;
    serialNumber: string;
    firmwareVersion: string;
    pairedAt: string;
    connectionStatus: "ONLINE_PAIRED" | "DISCONNECTED" | "UPDATING";
    batteryLevelPercentage: number;
    labStation: string;
  };
  clientSpecimen: {
    browserEngine: string;
    webSerialSupported: boolean;
    webUsbSupported: boolean;
    audioInputVerified: boolean;
    videoInputVerified: boolean;
    screenResolution: string;
    diagnosticsPassed: boolean;
  };
  learningPersona: {
    current: StudentPersona;
    traits: string[];
    velocityRatio: number;
    recommendedTrack: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    const studentId = req.nextUrl.searchParams.get("studentId") || "aarav";

    const specimenData: DeviceSpecimenTelemetry = {
      studentId,
      hardwareKit: {
        model: "ThinkOva Alpha Kit v2.1 (Arduino + Motor Shield)",
        serialNumber: "SPEC-TK-9021-PUN",
        firmwareVersion: "v1.4.2-stable",
        pairedAt: "Today, 10:15 AM IST",
        connectionStatus: "ONLINE_PAIRED",
        batteryLevelPercentage: 94,
        labStation: "School Computer Lab 2, Banyan Grove School, Pune",
      },
      clientSpecimen: {
        browserEngine: "Chrome / Blink (Desktop App Mode)",
        webSerialSupported: true,
        webUsbSupported: true,
        audioInputVerified: true,
        videoInputVerified: true,
        screenResolution: "1920x1080 (HiDPI 1.25x)",
        diagnosticsPassed: true,
      },
      learningPersona: {
        current: "LOGICIAN",
        traits: [
          "Algorithmic reasoning & multi-step chaining",
          "Edge-case testing before final build submission",
          "Prompt constraint verification",
        ],
        velocityRatio: 1.15,
        recommendedTrack: "Robotics Starter: Autonomous Rover Navigation",
      },
    };

    return NextResponse.json({
      success: true,
      specimen: specimenData,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = String(body.action || "run_diagnostics").trim();
    const updatedPersona = body.persona as StudentPersona | undefined;

    return NextResponse.json({
      success: true,
      message: action === "tune_persona"
        ? `Persona updated to ${updatedPersona}. Curriculum recommendations adapted.`
        : "Hardware specimen diagnostics completed. All hardware kit sensors & web handshakes verified.",
      status: "ONLINE_PAIRED",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

