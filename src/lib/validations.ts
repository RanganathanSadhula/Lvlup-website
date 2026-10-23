import { z } from "zod";

/** Accepts "98765 43210", "+91 98765 43210", "09876543210" and normalises to 10 digits. */
export function normalisePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export const schoolPackSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "That name is too long"),
  schoolCity: z
    .string()
    .trim()
    .min(3, "Please enter your school and city")
    .max(120, "That is too long"),
  role: z.string().trim().min(2, "Please tell us your role").max(60, "That is too long"),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your mobile number")
    .refine((v) => /^[6-9]\d{9}$/.test(normalisePhone(v)), "Enter a valid 10-digit mobile number"),
  /** Honeypot: real users never see or fill this. */
  company: z.string().max(0).optional(),
});

export type SchoolPackInput = z.infer<typeof schoolPackSchema>;
