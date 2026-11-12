import { BuildTaskData, SubmittedFile } from "@/data/learning-tasks";
import { LiveClassSession, BeforeJoinCheckItem } from "@/data/live-classes";

export type ActiveTab = "course" | "lesson" | "quiz" | "build-task";
export type CourseSubTab = "courses" | "live" | "progress";
export type LessonSubTab = "overview" | "notes" | "materials" | "build-task";

export interface TutorQnAItem {
  id: string;
  question: string;
  askedAt: string;
  tutorName: string;
  tutorRole: string;
  reply?: string;
  repliedAt?: string;
}

export interface QuizQuestionOption {
  id: string;
  text: string;
}

export interface QuizQuestionItem {
  id: string;
  num: number;
  text: string;
  options: QuizQuestionOption[];
  correct: string;
}

export interface QuizBreakdownItem {
  questionId: string;
  questionNumber: number;
  isCorrect: boolean;
  explanation: string;
}

export interface NoteItem {
  id: string;
  timeSec: number;
  timeDisplay: string;
  text: string;
}

export interface BuildCheckItem {
  id: string;
  label: string;
  passed: boolean;
}

export interface PathStepItem {
  weekNumber: number;
  weekLabel: string;
  title: string;
  status: "completed" | "active" | "upcoming";
}

export interface TaskReviewRowItem {
  id: string;
  title: string;
  levelNumber: number;
  levelDisplay: string;
  badgeLabel: string;
  badgeType: "great" | "good" | "due";
  actionLabel: "View" | "Open";
  taskId?: string;
  tutorFeedback?: {
    tutorName: string;
    quote: string;
    grade: string;
    date: string;
    skillsGained?: string[];
  };
}

export interface EarnedBadgeItem {
  id: string;
  title: string;
  subtitle: string;
  earnedDate: string;
  downloadUrl?: string;
}

export interface SkillMetricItem {
  name: string;
  percentage: number;
}

export interface CertificateItem {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentId: string;
  isUnlocked: boolean;
  unlockedText: string;
  levelsCompleted: number;
  totalLevels: number;
  completionPercentage: number;
  certificateCode?: string;
  issuedAt?: string;
  tutorName?: string;
}

export interface StudentProgressSummary {
  courseId: string;
  courseTitle: string;
  lessonsDone: number;
  totalLessons: number;
  levelsDone: number;
  totalLevels: number;
  timeLearning: string;
  buildTasksReviewed: number;
  overallPercentage: number;
  pathSteps: PathStepItem[];
  buildTasks: TaskReviewRowItem[];
  certificate: CertificateItem;
  badges: EarnedBadgeItem[];
  skills: SkillMetricItem[];
}


