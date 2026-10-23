import type { FaqItem } from "@/types";

/**
 * Only the first parent answer appears in the design reference. The remaining answers are
 * drafted strictly from facts stated elsewhere on the page (see README → Assumptions).
 */
export const parentFaq: FaqItem[] = [
  { question: "Does my child need to know coding?", answer: "No. Children build with ready-made templates and plain instructions. Grades 7–8 can go further if they want to." },
  { question: "Is this safe for a 10-year-old?", answer: "It is designed to be. A tutor is in every class, children never use AI on their own in our sessions, tools are age-appropriate and run through accounts we set up and manage, and we ask for your written consent before your child uses any AI tool." },
  { question: "Which AI tools will my child use?", answer: "Age-appropriate tools approved by LvlUp, used through accounts we set up and manage. There are no personal chatbot accounts. The tools we use are listed in our child safety policy." },
  { question: "Does my child need a laptop at home?", answer: "No. Classes use your school’s computer lab, and all materials and AI tool access are included in the fee." },
  { question: "What if my child misses a class?", answer: "The course is built around eight weekly levels, and we ask that your child can attend at least 6 of the 8 weeks. Message us on WhatsApp and a person will help." },
  { question: "What exactly does the refund promise cover?", answer: "If your child comes to at least 6 of the 8 classes and can’t show a working AI helper at demo day, we refund the second payment. At demo day the helper must complete the two tasks your child set for it. Refunds are paid back to your account within [7] working days." },
  { question: "What happens at demo day?", answer: "At level 8, your child presents their AI helper to you at school, runs it on the two tasks they set for it, and shares a short learning summary and their digital portfolio." },
  { question: "How is this different from the CBSE AI syllabus?", answer: "From 2026–27, CBSE brings AI and computational thinking into Classes 3 to 8. LvlUp does not replace that. It lets your child practise those ideas by building something real." },
];

export const schoolFaq: FaqItem[] = [
  { question: "What does our school need to provide?", answer: "One class a week in your computer lab. We bring trained tutors, every lesson, enrolment, fees and parent updates." },
  { question: "Is there extra work for our teachers?", answer: "No. There is no extra work for your teachers." },
  { question: "How does the partnership work?", answer: "Your school earns a partner fee for each enrolled student, set out in a one-page agreement." },
  { question: "What does the school community get to see?", answer: "A demo day for your school community at level 8, where children present the AI helpers they built." },
];
