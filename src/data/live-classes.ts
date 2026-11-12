export interface LiveClassSession {
  id: string;
  levelNumber: number;
  title: string;
  topicDescription: string;
  dateDisplay: string;
  timeDisplay: string;
  durationMinutes: number;
  tutorName: string;
  tutorRole: string;
  tutorAvatar: string;
  status: "UPCOMING" | "LIVE_NOW" | "COMPLETED";
  meetUrl?: string;
  recordingUrl?: string;
  recordingDuration?: string;
  prepNotes: string[];
}

export interface ClassPlanItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  duration: string;
}

export interface CalendarDayItem {
  dayName: string;
  dayNumber: number;
  sublabel: string;
  isHighlighted?: boolean;
}

export interface BeforeJoinCheckItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface ReplayItem {
  id: string;
  title: string;
  subtitle: string;
  videoUrl?: string;
}

export const LIVE_SESSIONS: LiveClassSession[] = [
  {
    id: "live-session-w6",
    levelNumber: 7,
    title: "Level 7: Personalise and improve",
    topicDescription:
      "Thu 12 Nov · 6:00 PM · 90 min · with Ms Ananya · bring your Level 6 agent",
    dateDisplay: "Thu 12 Nov",
    timeDisplay: "6:00 PM – 7:30 PM",
    durationMinutes: 90,
    tutorName: "Ms Ananya",
    tutorRole: "Lead AI Educator · ThinkOva",
    tutorAvatar: "AR",
    status: "UPCOMING",
    meetUrl: "https://meet.google.com/thinkova-ai-level7",
    prepNotes: [
      "Open your Level 6 agent",
      "Download the Level 7 worksheet",
      "Test your camera and mic",
    ],
  },
];

export const CLASS_PLAN_ITEMS: ClassPlanItem[] = [
  {
    id: "cp-1",
    timestamp: "0:00",
    title: "Warm-up and recap",
    description: "What your agent can do after level 6",
    duration: "10 min",
  },
  {
    id: "cp-2",
    timestamp: "0:10",
    title: "Tutor demo",
    description: "Ms Ananya shows how to give an agent a friendly, safe personality",
    duration: "25 min",
  },
  {
    id: "cp-3",
    timestamp: "0:35",
    title: "Guided practice",
    description: "Small steps, checked as you go",
    duration: "20 min",
  },
  {
    id: "cp-4",
    timestamp: "0:55",
    title: "Build time",
    description: "Mentors visit breakout rooms",
    duration: "25 min",
  },
  {
    id: "cp-5",
    timestamp: "1:20",
    title: "Show and share",
    description: "Two learners demo what they made",
    duration: "10 min",
  },
];

export const WEEK_CALENDAR_DAYS: CalendarDayItem[] = [
  { dayName: "Mon", dayNumber: 9, sublabel: "-" },
  { dayName: "Tue", dayNumber: 10, sublabel: "Replay watched" },
  { dayName: "Wed", dayNumber: 11, sublabel: "-" },
  { dayName: "Thu", dayNumber: 12, sublabel: "Class · 6 PM", isHighlighted: true },
  { dayName: "Fri", dayNumber: 13, sublabel: "Build task due" },
  { dayName: "Sat", dayNumber: 14, sublabel: "Robotics · 10 AM" },
  { dayName: "Sun", dayNumber: 15, sublabel: "-" },
];

export const BEFORE_YOU_JOIN_ITEMS: BeforeJoinCheckItem[] = [
  { id: "bj-1", label: "Open your Level 6 agent", completed: true },
  { id: "bj-2", label: "Download the Level 7 worksheet", completed: false },
  { id: "bj-3", label: "Test your camera and mic", completed: false },
];

export const REPLAY_ITEMS: ReplayItem[] = [
  {
    id: "rep-1",
    title: "Level 6: Build your first guided agent",
    subtitle: "Thu 5 Nov · watched",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "rep-2",
    title: "Level 5: Agent blueprint",
    subtitle: "Thu 29 Oct · watched",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

export const PAST_RECORDINGS: LiveClassSession[] = [
  {
    id: "rec-session-w6",
    levelNumber: 6,
    title: "Level 6: Build your first guided agent",
    topicDescription: "Thu 5 Nov · watched",
    dateDisplay: "Thu 5 Nov",
    timeDisplay: "Recorded · 55 min",
    durationMinutes: 55,
    tutorName: "Ms Ananya",
    tutorRole: "Lead AI Educator",
    tutorAvatar: "AR",
    status: "COMPLETED",
    recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    recordingDuration: "55 min",
    prepNotes: ["Level 6 agent verified"],
  },
  {
    id: "rec-session-w5",
    levelNumber: 5,
    title: "Level 5: Agent blueprint",
    topicDescription: "Thu 29 Oct · watched",
    dateDisplay: "Thu 29 Oct",
    timeDisplay: "Recorded · 58 min",
    durationMinutes: 58,
    tutorName: "Ms Ananya",
    tutorRole: "Lead AI Educator",
    tutorAvatar: "AR",
    status: "COMPLETED",
    recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    recordingDuration: "58 min",
    prepNotes: ["Worksheet completed", "Blueprint approved"],
  },
];
