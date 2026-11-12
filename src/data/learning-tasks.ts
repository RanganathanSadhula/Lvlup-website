export interface SubmittedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export interface BuildTaskData {
  taskId: string;
  courseId: string;
  levelNumber: number;
  title: string;
  dueText: string;
  estimatedTime: string;
  levelBadge: string;
  brief: string;
  whatGoodLooksLike: string[];
  defaultFile: SubmittedFile;
  defaultNote: string;
  lastFeedback: {
    tutorName: string;
    tutorMeta: string;
    avatarInitials: string;
    quote: string;
  };
  stuckLinks: Array<{
    title: string;
    subtitle: string;
    type: "live" | "pdf";
  }>;
}

// Canonical task definitions matching Figma and course levels
export const TASK_DEFINITIONS: Record<string, BuildTaskData> = {
  "level-6-memory": {
    taskId: "level-6-memory",
    courseId: "ai-study-helper",
    levelNumber: 6,
    title: "Give your agent a memory",
    dueText: "Due Fri 13 Nov, 9:00 PM",
    estimatedTime: "About 30 min",
    levelBadge: "Counts toward Level 6",
    brief:
      "Your agent forgets everything between messages. Give it a memory so it remembers the user's name and their last two questions.",
    whatGoodLooksLike: [
      "It remembers the user's name after one message",
      "It recalls the last two questions correctly",
      "A short note on what you changed and why",
    ],
    defaultFile: {
      id: "f-memory-1",
      name: "memory-test-v2.png",
      size: "1.2 MB",
      type: "image/png",
      uploadedAt: new Date(Date.now() - 120000).toISOString(),
    },
    defaultNote:
      "I store the name in a variable and keep a list of the last two questions. When the list gets a third one I drop the oldest.",
    lastFeedback: {
      tutorName: "Ms Ananya",
      tutorMeta: "Level 5 · 2 days ago",
      avatarInitials: "AR",
      quote:
        '"Clear blueprint. Next time, write down one thing that could go wrong and how your agent should handle it."',
    },
    stuckLinks: [
      {
        title: "Ask in Thursday's class",
        subtitle: "Live · 6:00 PM",
        type: "live",
      },
      {
        title: "Memory tips sheet",
        subtitle: "PDF · 2 pages",
        type: "pdf",
      },
    ],
  },
  "level-6-steps": {
    taskId: "level-6-steps",
    courseId: "ai-study-helper",
    levelNumber: 6,
    title: "Connect three steps and test them",
    dueText: "Due Fri 13 Nov, 9:00 PM",
    estimatedTime: "About 25 min",
    levelBadge: "Counts toward Level 6",
    brief:
      "Join the read, pick and reply steps in your agent. Test how information passes between steps.",
    whatGoodLooksLike: [
      "The three steps run in order without errors",
      "Two test questions answered correctly",
      "Safety step checks every reply before sending",
    ],
    defaultFile: {
      id: "f-steps-1",
      name: "steps-chain-v1.json",
      size: "44 KB",
      type: "application/json",
      uploadedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    defaultNote:
      "Connected reader to prompt node and routed final output through content safety filter.",
    lastFeedback: {
      tutorName: "Ms Ananya",
      tutorMeta: "Level 5 · 2 days ago",
      avatarInitials: "AR",
      quote:
        '"Good node chaining. Make sure fallback triggers when input is missing."',
    },
    stuckLinks: [
      {
        title: "Ask in Thursday's class",
        subtitle: "Live · 6:00 PM",
        type: "live",
      },
      {
        title: "Node chaining guide",
        subtitle: "PDF · 3 pages",
        type: "pdf",
      },
    ],
  },
  "level-5-blueprint": {
    taskId: "level-5-blueprint",
    courseId: "ai-study-helper",
    levelNumber: 5,
    title: "Design your agent blueprint",
    dueText: "Completed",
    estimatedTime: "About 30 min",
    levelBadge: "Level 5 Completed",
    brief:
      "Map out the conversation flow, prompt states, and fallback logic for your study bot.",
    whatGoodLooksLike: [
      "Visual blueprint of user intents",
      "Explicit fallback responses for unknown queries",
      "Verified safety boundaries",
    ],
    defaultFile: {
      id: "f-blueprint-1",
      name: "study-bot-blueprint.pdf",
      size: "2.4 MB",
      type: "application/pdf",
      uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    defaultNote:
      "Created 3 intent branches with default study buddy persona.",
    lastFeedback: {
      tutorName: "Ms Ananya",
      tutorMeta: "Level 4 · 1 week ago",
      avatarInitials: "AR",
      quote:
        '"Clear blueprint. Next time, write down one thing that could go wrong and how your agent should handle it."',
    },
    stuckLinks: [
      {
        title: "Ask in Thursday's class",
        subtitle: "Live · 6:00 PM",
        type: "live",
      },
      {
        title: "Blueprint checklist",
        subtitle: "PDF · 1 page",
        type: "pdf",
      },
    ],
  },
};

export interface BuildSubmissionRecord {
  submissionId: string;
  studentId: string;
  taskId: string;
  taskTitle: string;
  files: SubmittedFile[];
  note: string;
  status: "draft_saved" | "submitted" | "reviewed";
  savedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  review?: {
    tutorName: string;
    tutorAvatar: string;
    grade: "Pass" | "Needs Revision" | "Exemplary";
    feedback: string;
  };
}

