import { Bot, BookOpen, FolderOpen, Landmark, LaptopMinimal, Lock, Mic, ListChecks, MonitorPlay, ShieldCheck, Award, UsersRound, Footprints, MessageSquareText } from "lucide-react";

export const facts = [
  { value: "8 levels", label: "One a week, each ends with something made" },
  { value: "1 tutor", label: "Trained by us, in every class" },
  { value: "Up to 25", label: "Students in a batch, Grades 5–8" },
  { value: "Level 8", label: "Demo day for parents at school" },
] as const;

export const heroMeta = [
  { label: "Next batch", value: "[Month] 2027" },
  { label: "Class", value: "90 min, once a week" },
  { label: "Fee", value: "₹4,999 all-in" },
] as const;

export const solutionCards = [
  { title: "Understand it", body: "How AI learns from examples, where it helps, and why its answers need checking.", icon: BookOpen, image: "/images/solution-understand.jpg", alt: "A smiling boy holding a stack of books", w: 764, h: 440 },
  { title: "Use it safely", body: "Private information stays private. Tools are approved, and the accounts are set up and managed by us.", icon: ShieldCheck, image: "/images/solution-safely.jpg", alt: "Two children smiling at a laptop together", w: 764, h: 440 },
  { title: "Build with it", body: "Each child designs, builds and tests an AI helper for a real problem from their own school day.", icon: Bot, image: "/images/solution-build.jpg", alt: "A girl raising her hand next to classmates with laptops", w: 764, h: 440 },
] as const;

export const gradeCards = [
  { grade: 5, title: "Guided templates", body: "Every step scaffolded" },
  { grade: 6, title: "Guided templates", body: "More choice in projects" },
  { grade: 7, title: "More logic", body: "Tests their own work" },
  { grade: 8, title: "Independent", body: "Designs and tests alone" },
] as const;

export const goodFit = [
  "Is in Grade 5, 6, 7 or 8",
  "Is curious about how apps, games and chatbots work",
  "Likes making things more than memorising them",
  "Has never coded before. That is fine, no coding is needed",
] as const;

export const notFit = [
  "Exam coaching or higher marks",
  "One-to-one classes at home",
  "A coding certificate for a job",
  "A course your child can’t attend for at least 6 of the 8 weeks",
] as const;

export const safetyCommitments = [
  { title: "A tutor in every class", body: "Children never use AI on their own in our sessions.", icon: UsersRound },
  { title: "Minimal data, never sold", body: "We collect only what we need to run the course, and delete it when you ask.", icon: Lock },
  { title: "Approved tools only", body: "Age-appropriate tools, through accounts we set up and manage. No personal chatbot accounts.", icon: LaptopMinimal },
  { title: "Safety is taught, not just enforced", body: "Level 1 ends with a safety pledge: what to keep private, and how to check an answer.", icon: ShieldCheck },
  { title: "Your written consent first", body: "We ask before your child uses any AI tool. You can withdraw at any time.", icon: Award },
] as const;

export const joiningSteps = [
  { title: "Get your school code", body: "It is in your school’s circular or WhatsApp message.", icon: Landmark },
  { title: "Enrol online", body: "Two minutes: your child’s name, grade and your WhatsApp number.", icon: LaptopMinimal },
  { title: "Pay ₹2,500 to join", body: "UPI, card or net banking. Paid to LvlUp, not to the school.", icon: Award },
  { title: "Meet us online", body: "A 30-minute parent session before level 1. Ask us anything.", icon: UsersRound },
  { title: "Level up each week", body: "Updates after levels 2, 4 and 6. Second payment before level 5.", icon: Footprints },
  { title: "Demo day", body: "Your child presents their AI helper to you, at school.", icon: MonitorPlay },
] as const;

export const pricing = {
  total: "₹4,999",
  installments: [
    { amount: "₹2,500", label: "to join" },
    { amount: "₹2,499", label: "before level 5" },
  ],
  inclusions: [
    "8 tutor-led classes at school (12 hours)",
    "All materials and AI tool access, nothing to buy",
    "Progress updates after levels 2, 4 and 6",
    "Demo day and a digital portfolio",
  ],
  promiseTitle: "If your child comes to at least 6 of the 8 classes and can’t show a working AI helper at demo day, we refund the second payment.",
  promisePoints: [
    "At demo day, the helper must complete the two tasks your child set for it.",
    "You watch it happen, so there is nothing to argue about.",
    "Refunds are paid back to your account within [7] working days.",
  ],
} as const;

export const schoolBenefits = [
  "No extra work for your teachers",
  "Practises the CBSE AI and computational thinking topics for Classes 6 to 8",
  "A partner fee for each enrolled student, set out in a one-page agreement",
  "Demo day for your school community at level 8",
] as const;

export const outcomeIcons = { helper: MessageSquareText, portfolio: FolderOpen, cbse: BookOpen, habits: ListChecks, confidence: Mic } as const;
