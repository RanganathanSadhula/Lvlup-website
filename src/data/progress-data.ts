import { StudentProgressSummary } from "@/components/learning/types";

export const CANONICAL_COURSES_PROGRESS: Record<string, StudentProgressSummary> = {
  "ai-for-young-creators": {
    courseId: "ai-for-young-creators",
    courseTitle: "AI for Young Creators",
    lessonsDone: 27,
    totalLessons: 40,
    levelsDone: 5,
    totalLevels: 8,
    timeLearning: "18 h 30 m",
    buildTasksReviewed: 4,
    overallPercentage: 68,
    pathSteps: [
      { weekNumber: 1, weekLabel: "W1", title: "Problem map", status: "completed" },
      { weekNumber: 2, weekLabel: "W2", title: "Tested prompts", status: "completed" },
      { weekNumber: 3, weekLabel: "W3", title: "AI creation", status: "completed" },
      { weekNumber: 4, weekLabel: "W4", title: "Flow", status: "completed" },
      { weekNumber: 5, weekLabel: "W5", title: "Agent blueprint", status: "completed" },
      { weekNumber: 6, weekLabel: "W6", title: "Working agent", status: "active" },
      { weekNumber: 7, weekLabel: "W7", title: "Improve", status: "upcoming" },
      { weekNumber: 8, weekLabel: "W8", title: "Demo day", status: "upcoming" },
    ],
    buildTasks: [
      {
        id: "task-rev-1",
        title: "Problem map and safety pledge",
        levelNumber: 1,
        levelDisplay: "Level 1",
        badgeLabel: "Great",
        badgeType: "great",
        actionLabel: "View",
        taskId: "level-1-problem-map",
        tutorFeedback: {
          tutorName: "Ms Ananya Rao",
          grade: "Great (95/100)",
          date: "1 Oct",
          quote:
            "Wonderful safety rules! You clearly understood why an agent shouldn't collect private personal info.",
          skillsGained: ["Safety +25%", "Problem framing +15%"],
        },
      },
      {
        id: "task-rev-2",
        title: "Five tested prompts",
        levelNumber: 2,
        levelDisplay: "Level 2",
        badgeLabel: "Great",
        badgeType: "great",
        actionLabel: "View",
        taskId: "level-2-prompts",
        tutorFeedback: {
          tutorName: "Ms Ananya Rao",
          grade: "Great (92/100)",
          date: "8 Oct",
          quote:
            "The edge case prompt test was very thoughtful. The fallback message prevents the agent from making up answers.",
          skillsGained: ["Prompting +20%", "Testing +15%"],
        },
      },
      {
        id: "task-rev-3",
        title: "A story generator",
        levelNumber: 3,
        levelDisplay: "Level 3",
        badgeLabel: "Good",
        badgeType: "good",
        actionLabel: "View",
        taskId: "level-3-story",
        tutorFeedback: {
          tutorName: "Ms Ananya Rao",
          grade: "Good (88/100)",
          date: "15 Oct",
          quote:
            "The story branches were creative. Remember to limit the token length so the responses stay concise on mobile screens.",
          skillsGained: ["Creating +20%", "Agent design +10%"],
        },
      },
      {
        id: "task-rev-4",
        title: "Quiz flow for your class",
        levelNumber: 4,
        levelDisplay: "Level 4",
        badgeLabel: "Great",
        badgeType: "great",
        actionLabel: "View",
        taskId: "level-4-quiz",
        tutorFeedback: {
          tutorName: "Ms Ananya Rao",
          grade: "Great (94/100)",
          date: "22 Oct",
          quote:
            "Flawless multi-step quiz chaining! The score calculation and instant feedback logic worked on all test cases.",
          skillsGained: ["Agent design +25%", "Prompting +15%"],
        },
      },
      {
        id: "task-rev-5",
        title: "Agent blueprint",
        levelNumber: 5,
        levelDisplay: "Level 5",
        badgeLabel: "Good",
        badgeType: "good",
        actionLabel: "View",
        taskId: "level-5-blueprint",
        tutorFeedback: {
          tutorName: "Ms Ananya Rao",
          grade: "Good (89/100)",
          date: "29 Oct",
          quote:
            "Clear blueprint. Next time, write down one thing that could go wrong and how your agent should handle it.",
          skillsGained: ["Creating +15%", "Safety +10%"],
        },
      },
      {
        id: "task-rev-6",
        title: "Give your agent a memory",
        levelNumber: 6,
        levelDisplay: "Level 6",
        badgeLabel: "Due Fri",
        badgeType: "due",
        actionLabel: "Open",
        taskId: "level-6-memory",
      },
    ],
    certificate: {
      id: "cert-ai-creators",
      courseId: "ai-for-young-creators",
      courseTitle: "AI for Young Creators",
      studentName: "Aarav Sharma",
      studentId: "aarav",
      isUnlocked: false,
      unlockedText: "Unlocks at demo day · 5 of 8 levels done",
      levelsCompleted: 5,
      totalLevels: 8,
      completionPercentage: 68,
      certificateCode: "THINKOVA-CERT-2026-AI-84920",
      issuedAt: "Sat 21 Nov 2026 (Demo Day)",
      tutorName: "Ms Ananya Rao",
    },
    badges: [
      {
        id: "badge-1",
        title: "Agent Builder badge",
        subtitle: "Earned · 29 Oct",
        earnedDate: "29 Oct",
      },
      {
        id: "badge-2",
        title: "Canteen Helper Challenge",
        subtitle: "Hackathon · 3 Oct",
        earnedDate: "3 Oct",
      },
      {
        id: "badge-3",
        title: "Problem map and safety pledge",
        subtitle: "Level 1 · 1 Oct",
        earnedDate: "1 Oct",
      },
    ],
    skills: [
      { name: "Prompting", percentage: 80 },
      { name: "Safety", percentage: 90 },
      { name: "Agent design", percentage: 55 },
      { name: "Creating", percentage: 70 },
    ],
  },
  "robotics-starter": {
    courseId: "robotics-starter",
    courseTitle: "Robotics Starter: Build a Rover",
    lessonsDone: 0,
    totalLessons: 32,
    levelsDone: 0,
    totalLevels: 8,
    timeLearning: "0 h 00 m",
    buildTasksReviewed: 0,
    overallPercentage: 0,
    pathSteps: [
      { weekNumber: 1, weekLabel: "W1", title: "Unbox & Motors", status: "upcoming" },
      { weekNumber: 2, weekLabel: "W2", title: "Chassis Assembly", status: "upcoming" },
      { weekNumber: 3, weekLabel: "W3", title: "Microcontroller", status: "upcoming" },
      { weekNumber: 4, weekLabel: "W4", title: "Sensors & Ultrasonic", status: "upcoming" },
      { weekNumber: 5, weekLabel: "W5", title: "Line Follower", status: "upcoming" },
      { weekNumber: 6, weekLabel: "W6", title: "Obstacle Avoidance", status: "upcoming" },
      { weekNumber: 7, weekLabel: "W7", title: "Bluetooth Control", status: "upcoming" },
      { weekNumber: 8, weekLabel: "W8", title: "Rover Arena", status: "upcoming" },
    ],
    buildTasks: [
      {
        id: "task-rob-1",
        title: "Rover Chassis & Motor Check",
        levelNumber: 1,
        levelDisplay: "Level 1",
        badgeLabel: "Starts Sat",
        badgeType: "due",
        actionLabel: "Open",
        taskId: "robotics-level-1",
      },
    ],
    certificate: {
      id: "cert-robotics-starter",
      courseId: "robotics-starter",
      courseTitle: "Robotics Starter: Build a Rover",
      studentName: "Aarav Sharma",
      studentId: "aarav",
      isUnlocked: false,
      unlockedText: "Unlocks at Demo Day · Hardware kit waits at school lab",
      levelsCompleted: 0,
      totalLevels: 8,
      completionPercentage: 0,
      certificateCode: "THINKOVA-CERT-2026-ROB-19402",
      tutorName: "Mr Rohan Desai",
    },
    badges: [],
    skills: [
      { name: "Motor Control", percentage: 0 },
      { name: "Circuitry", percentage: 0 },
      { name: "Embedded Logic", percentage: 0 },
      { name: "Hardware Debugging", percentage: 0 },
    ],
  },
};

export function getStudentProgressData(
  studentId: string = "aarav",
  courseId: string = "ai-for-young-creators",
  studentName: string = "Aarav Sharma"
): StudentProgressSummary {
  const base =
    CANONICAL_COURSES_PROGRESS[courseId] ||
    CANONICAL_COURSES_PROGRESS["ai-for-young-creators"]!;

  return {
    ...base,
    certificate: {
      ...base.certificate,
      studentName: studentName || "Aarav Sharma",
      studentId: studentId || "aarav",
    },
  };
}

