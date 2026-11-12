export interface EventItem {
  id: string;
  category: string;
  categoryKey: "hackathons" | "demo-days" | "guest-sessions" | "past";
  dayNumber: string;
  month: string;
  title: string;
  meta: string;
  actionLabel: string;
  actionType: "calendar" | "remind" | "invite";
  image: string;
}

export interface FeaturedHackathon {
  id: string;
  badgeCategory: string;
  statusBadge: string;
  title: string;
  meta: string;
  teamsCountText: string;
  closesText: string;
  image: string;
  href: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: "lead" | "invited" | "confirmed";
  avatar: string;
}

export const FEATURED_HACKATHON: FeaturedHackathon = {
  id: "hackathon-build-for-school",
  badgeCategory: "HACKATHON",
  statusBadge: "Registration open",
  title: "Build something for your school day",
  meta: "22–29 Nov · online · teams of 2 to 4 · judged by tutors",
  teamsCountText: "12 teams registered",
  closesText: "closes Fri 20 Nov",
  image: "/images/events-hackathon-blueprint.jpg",
  href: "/events/hackathon",
};

export const EVENTS_LIST: EventItem[] = [
  {
    id: "event-farm-robots",
    category: "GUEST SESSION",
    categoryKey: "guest-sessions",
    dayNumber: "12",
    month: "NOV",
    title: "How robots help on Indian farms",
    meta: "Online · all levels · 45 min",
    actionLabel: "Add to calendar →",
    actionType: "calendar",
    image: "/images/tracks-rover.png",
  },
  {
    id: "event-hackathon-results",
    category: "HACKATHON RESULTS",
    categoryKey: "hackathons",
    dayNumber: "29",
    month: "NOV",
    title: "Every team presents for 5 minutes",
    meta: "Online · live stream",
    actionLabel: "Remind me →",
    actionType: "remind",
    image: "/images/events-hackathon-team.jpg",
  },
  {
    id: "event-parent-demo-day",
    category: "DEMO DAY",
    categoryKey: "demo-days",
    dayNumber: "5",
    month: "DEC",
    title: "Parent demo day",
    meta: "At school · every course shows its final project",
    actionLabel: "Invite family →",
    actionType: "invite",
    image: "/images/events-demo-day.jpg",
  },
];

export const AVAILABLE_CLASSMATES = [
  { id: "cm-1", name: "Rohan Verma", grade: "Grade 6", track: "AI & Agents" },
  { id: "cm-2", name: "Diya Patel", grade: "Grade 6", track: "Robotics" },
  { id: "cm-3", name: "Kabir Mehta", grade: "Grade 6", track: "Electronics" },
  { id: "cm-4", name: "Ananya Joshi", grade: "Grade 6", track: "Game Design" },
];

