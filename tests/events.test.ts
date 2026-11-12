import { describe, it, expect } from "vitest";
import { FEATURED_HACKATHON, EVENTS_LIST, AVAILABLE_CLASSMATES } from "../src/data/events-data";
import { GET as getEvents, POST as postEvents } from "../src/app/api/events/route";
import { NextRequest } from "next/server";

describe("Events & Hackathon Engine and API", () => {
  it("1. Configures featured hackathon matching image 1 and image 3", () => {
    expect(FEATURED_HACKATHON.badgeCategory).toBe("HACKATHON");
    expect(FEATURED_HACKATHON.statusBadge).toBe("Registration open");
    expect(FEATURED_HACKATHON.title).toBe("Build something for your school day");
    expect(FEATURED_HACKATHON.meta).toBe("22–29 Nov · online · teams of 2 to 4 · judged by tutors");
    expect(FEATURED_HACKATHON.image).toBe("/images/events-hackathon-blueprint.jpg");
    expect(FEATURED_HACKATHON.href).toBe("/events/hackathon");
  });

  it("2. Configures events list matching image 1, 4, and 5", () => {
    expect(EVENTS_LIST.length).toBe(3);

    // Event 1: Guest session
    const farmEvent = EVENTS_LIST[0]!;
    expect(farmEvent.dayNumber).toBe("12");
    expect(farmEvent.month).toBe("NOV");
    expect(farmEvent.category).toBe("GUEST SESSION");
    expect(farmEvent.title).toBe("How robots help on Indian farms");
    expect(farmEvent.image).toBe("/images/tracks-rover.png");

    // Event 2: Hackathon results
    const resultsEvent = EVENTS_LIST[1]!;
    expect(resultsEvent.dayNumber).toBe("29");
    expect(resultsEvent.month).toBe("NOV");
    expect(resultsEvent.category).toBe("HACKATHON RESULTS");
    expect(resultsEvent.title).toBe("Every team presents for 5 minutes");
    expect(resultsEvent.image).toBe("/images/events-hackathon-team.jpg");

    // Event 3: Parent demo day
    const demoDayEvent = EVENTS_LIST[2]!;
    expect(demoDayEvent.dayNumber).toBe("5");
    expect(demoDayEvent.month).toBe("DEC");
    expect(demoDayEvent.category).toBe("DEMO DAY");
    expect(demoDayEvent.title).toBe("Parent demo day");
    expect(demoDayEvent.image).toBe("/images/events-demo-day.jpg");
  });

  it("3. GET /api/events returns all events and supports category filtering", async () => {
    // All events
    const reqAll = new NextRequest("http://localhost:3000/api/events");
    const resAll = await getEvents(reqAll);
    const dataAll = await resAll.json();

    expect(resAll.status).toBe(200);
    expect(dataAll.success).toBe(true);
    expect(dataAll.events.length).toBe(3);
    expect(dataAll.featured.title).toBe("Build something for your school day");

    // Filter by guest-sessions
    const reqGuest = new NextRequest("http://localhost:3000/api/events?category=guest-sessions");
    const resGuest = await getEvents(reqGuest);
    const dataGuest = await resGuest.json();

    expect(dataGuest.events.length).toBe(1);
    expect(dataGuest.events[0]?.id).toBe("event-farm-robots");
  });

  it("4. POST /api/events processes team registrations and classmate invitations", async () => {
    // Register team
    const regReq = new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register_team",
        teamName: "Build for your School Innovators",
        members: [{ name: "Aarav" }, { name: "Rohan" }],
      }),
    });
    const regRes = await postEvents(regReq);
    const regData = await regRes.json();

    expect(regRes.status).toBe(200);
    expect(regData.success).toBe(true);
    expect(regData.message).toContain("registered successfully");

    // Invite classmate
    const inviteReq = new NextRequest("http://localhost:3000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "invite_classmate",
        studentName: "Diya Patel",
      }),
    });
    const inviteRes = await postEvents(inviteReq);
    const inviteData = await inviteRes.json();

    expect(inviteRes.status).toBe(200);
    expect(inviteData.success).toBe(true);
    expect(inviteData.message).toContain("Invite dispatched to Diya Patel");
  });
});

