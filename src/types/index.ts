export interface CurriculumLevel {
  level: number;
  week: number;
  title: string;
  summary: string;
  topics: string[];
  makes: string;
  /** Short line shown in the left-hand level navigator */
  navMakes: string;
  parentsSee: string;
  image: { src: string; width: number; height: number; alt: string };
  /** Lucide icon name string — resolved to component inside client components */
  icon: string;
  featured?: boolean;
}

export interface Tutor {
  name: string;
  credentials: string;
  image: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface NavLink {
  label: string;
  href: string;
}
