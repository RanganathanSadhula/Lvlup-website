import type { CurriculumLevel } from "@/types";

const img = (n: number, w: number, h: number, alt: string) => ({
  src: `/images/curriculum/level-${n}.jpg`,
  width: w,
  height: h,
  alt,
});

export const curriculum: CurriculumLevel[] = [
  {
    level: 1, week: 1, title: "Explore AI and digital safety",
    summary: "What AI can do, where it helps, and how to use it responsibly.",
    topics: ["AI in everyday life", "Human vs AI", "How AI recognises patterns", "Safe and responsible use", "Find a problem worth solving"],
    makes: "A personal problem map and an AI safety pledge", navMakes: "Problem map and safety pledge",
    parentsSee: "The first learning goal and the safety checklist",
    image: img(1, 193, 309, "A smiling boy holding a stack of books"), icon: "Award",
  },
  {
    level: 2, week: 2, title: "Prompt like a creator",
    summary: "Give clear instructions, improve results and think critically.",
    topics: ["What makes a useful prompt", "The prompt recipe", "Prompts for different tasks", "Improve and compare", "Check before trusting"],
    makes: "Five tested prompts, each with an improved version", navMakes: "Five tested prompts",
    parentsSee: "Stronger communication and checking skills",
    image: img(2, 193, 353, "A girl with headphones writing beside a laptop"), icon: "MessageSquareText",
  },
  {
    level: 3, week: 3, title: "Create with AI",
    summary: "Use AI as a flexible tool to turn ideas into useful, original work.",
    topics: ["From idea to outcome", "Explore output formats", "Organise information", "Edit with judgment", "Complete a creation"],
    makes: "One finished AI-assisted creation and a short reflection", navMakes: "An AI-assisted creation",
    parentsSee: "A practical creation your child chose to share",
    image: img(3, 193, 318, "Two children working together at a laptop"), icon: "Sparkles",
  },
  {
    level: 4, week: 4, title: "Build interactive solutions",
    summary: "Simple logic that turns a request into an interactive experience.",
    topics: ["Break down a problem", "Make a simple decision flow", "Build using a template", "Test and debug", "Share and explain"],
    makes: "A working interactive flow or prototype", navMakes: "A working interactive flow",
    parentsSee: "A demo of logical thinking and problem-solving",
    image: img(4, 193, 317, "A girl raising her hand in class"), icon: "Workflow",
  },
  {
    level: 5, week: 5, title: "Think like an agent designer",
    summary: "How an agent works toward a goal through guided steps.",
    topics: ["What is an AI agent", "Choose a useful task", "Define inputs and outputs", "Map a safe workflow", "Create the blueprint"],
    makes: "A one-page guided agent blueprint", navMakes: "A one-page agent blueprint",
    parentsSee: "What the planned agent will and will not do",
    image: img(5, 193, 352, "A group of children collaborating around a laptop"), icon: "BookOpen",
  },
  {
    level: 6, week: 6, title: "Build your first guided AI agent",
    summary: "Turn the blueprint into a supervised, working prototype.",
    topics: ["Choose a starter template", "Write agent instructions", "Connect the steps", "Test two tasks", "Improve and protect"],
    makes: "A working agent prototype and two test results", navMakes: "Working prototype and two tests",
    parentsSee: "The agent completing two set tasks",
    image: img(6, 193, 316, "A boy reading an open book"), icon: "Bot", featured: true,
  },
  {
    level: 7, week: 7, title: "Personalise and improve",
    summary: "Adapt the agent to a chosen problem and make it more reliable.",
    topics: ["Choose an improvement goal", "Improve the experience", "Add a useful feature", "Peer test and refine", "Document progress"],
    makes: "An improved agent and a portfolio draft", navMakes: "Improved agent and portfolio draft",
    parentsSee: "Your child's decisions and improvements",
    image: img(7, 193, 316, "Children sitting together on a school staircase"), icon: "Target",
  },
  {
    level: 8, week: 8, title: "Creator showcase",
    summary: "Demonstrate the agent and explain what was learned.",
    topics: ["Final functionality check", "Complete the portfolio", "Practise the presentation", "Showcase to parents", "Reflect and plan ahead"],
    makes: "A live demo and a digital portfolio", navMakes: "Live demo and digital portfolio",
    parentsSee: "A short learning summary at demo day",
    image: img(8, 193, 353, "A girl with both arms raised, smiling"), icon: "MonitorPlay",
  },
];
