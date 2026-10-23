import type { Tutor } from "@/types";

export const tutors: Tutor[] = [
  { name: "Ananya Rao", credentials: "B.Tech in computer science · 4 years teaching", image: "/images/tutors/ananya.jpg" },
  { name: "Rohan Mehta", credentials: "Ed-tech trainer · ran 30+ coding clubs", image: "/images/tutors/rohan.jpg" },
  { name: "Sana Qureshi", credentials: "Maths and coding teacher · 9 years teaching", image: "/images/tutors/sana.jpg" },
];

export const testimonials = [
  {
    quote: "Meera showed us her homework helper at dinner, then explained why it got one answer wrong. That second part is what I wanted.",
    name: "Priya Sharma", role: "Parent of a Grade 6 student · Banyan Grove School", image: "/images/tutors/priya.jpg",
  },
  {
    quote: "He used to ask a chatbot everything. Now he asks how it decided. The demo day was the first school event he begged us to attend.",
    name: "Vikram Iyer", role: "Parent of a Grade 8 student · Riverstone Academy", image: "/images/tutors/vikram.jpg",
  },
] as const;

export const pilotMetrics = [
  { value: "36 of 38", label: "children showed a working helper at demo day" },
  { value: "94%", label: "average attendance across 8 levels" },
  { value: "2", label: "partner schools" },
] as const;

export const partnerSchools = [
  { initials: "BG", name: "Banyan Grove School", shape: "round" },
  { initials: "RA", name: "Riverstone Academy", shape: "square" },
  { initials: "KH", name: "Kestrel Hill School", shape: "square" },
  { initials: "MP", name: "Marigold Public School", shape: "round" },
] as const;
