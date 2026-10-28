import type { NavLink } from "@/types";

const whatsappDigits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";
const city = process.env.NEXT_PUBLIC_CONTACT_CITY ?? "";

export const siteConfig = {
  name: "LvlUp",
  title: "LvlUp · An eight-week AI course for Grades 5–8",
  description:
    "Don't just use AI. Build with it. LvlUp is an eight-week after-school AI course for Grades 5–8, taught by a trained tutor at your child's school. ₹4,999 all-in.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  schoolName: process.env.NEXT_PUBLIC_SCHOOL_NAME ?? "[School name]",
  batchStartDate: process.env.NEXT_PUBLIC_BATCH_START ?? "[date]",
  /** Falls back to the section that explains how to join when no enrolment URL is configured. */
  classVideoUrl: process.env.NEXT_PUBLIC_CLASS_VIDEO_URL || "",
  enrolUrl: process.env.NEXT_PUBLIC_ENROL_URL || "/#enrol",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "/#school-pack",
  whatsappUrl: whatsappDigits ? `https://wa.me/${whatsappDigits}` : "/#contact",
  whatsappLabel: whatsappDigits ? `+${whatsappDigits}` : "[number]",
  emailUrl: email ? `mailto:${email}` : "/#contact",
  emailLabel: email || "[email]",
  cityLabel: city || "[City]",
};

export const navLinks: NavLink[] = [
  { label: "The course", href: "/#course" },
  { label: "Levels", href: "/#levels" },
  { label: "Safety", href: "/#safety" },
  { label: "Fees", href: "/#fees" },
  { label: "FAQ", href: "/#faq" },
  { label: "For schools", href: "/#schools" },
];

export const legalLinks = {
  privacy: "/legal/privacy",
  childSafety: "/legal/child-safety",
  refunds: "/legal/refunds",
  terms: "/legal/terms",
  partnerTerms: "/legal/partner-terms",
  curriculum: "/downloads/LvlUp-Eight-Week-Curriculum.pdf",
} as const;

export const legalPages: Record<string, { title: string; note: string }> = {
  privacy: { title: "Privacy", note: "The privacy policy" },
  "child-safety": { title: "Child safety policy", note: "The full child safety policy (tools we use, what we collect, who sees it, and how to reach us)" },
  refunds: { title: "Refunds", note: "The refund terms" },
  terms: { title: "Terms", note: "The terms of service" },
  "partner-terms": { title: "Partner terms", note: "The one-page school partner agreement" },
  curriculum: { title: "Full curriculum", note: "The full curriculum PDF" },
};
