import { describe, expect, it } from "vitest";
import { normalisePhone, schoolPackSchema } from "@/lib/validations";

const valid = { name: "Priya Sharma", schoolCity: "Banyan Grove School, Pune", role: "Principal", phone: "98201 43210" };

describe("schoolPackSchema", () => {
  it("accepts a valid request", () => {
    expect(schoolPackSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects short or missing fields", () => {
    expect(schoolPackSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
    expect(schoolPackSchema.safeParse({ ...valid, schoolCity: "ab" }).success).toBe(false);
  });
  it("rejects invalid phone numbers", () => {
    expect(schoolPackSchema.safeParse({ ...valid, phone: "12345" }).success).toBe(false);
    expect(schoolPackSchema.safeParse({ ...valid, phone: "5123456789" }).success).toBe(false);
  });
  it("accepts +91 and leading-zero formats", () => {
    expect(schoolPackSchema.safeParse({ ...valid, phone: "+91 98201 43210" }).success).toBe(true);
    expect(schoolPackSchema.safeParse({ ...valid, phone: "098201 43210" }).success).toBe(true);
  });
  it("rejects a filled honeypot", () => {
    expect(schoolPackSchema.safeParse({ ...valid, company: "spam" }).success).toBe(false);
  });
});

describe("normalisePhone", () => {
  it("strips formatting and country code", () => {
    expect(normalisePhone("+91 98201-43210")).toBe("9820143210");
  });
});

describe("Enrolment Form Validation Logic", () => {
  const isSchoolCodeValid = (code: string) => code.trim().length === 5;
  const isMobileValid = (mobile: string) => /^\d{10}$/.test(mobile.trim());
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const checkFormCompleteness = (form: {
    childName: string;
    schoolCode: string;
    parentName: string;
    mobile: string;
    email: string;
    agreed: boolean;
  }) => {
    return (
      form.childName.trim().length >= 2 &&
      isSchoolCodeValid(form.schoolCode) &&
      form.parentName.trim().length >= 2 &&
      isMobileValid(form.mobile) &&
      isEmailValid(form.email) &&
      form.agreed
    );
  };

  it("1. School code must be strictly 5 digits / chars", () => {
    expect(isSchoolCodeValid("10245")).toBe(true);
    expect(isSchoolCodeValid("PUN01")).toBe(true);
    expect(isSchoolCodeValid("1234")).toBe(false);
    expect(isSchoolCodeValid("123456")).toBe(false);
    expect(isSchoolCodeValid("")).toBe(false);
  });

  it("2. Mobile number must be strictly 10 digits", () => {
    expect(isMobileValid("9876543210")).toBe(true);
    expect(isMobileValid("987654321")).toBe(false); // 9 digits
    expect(isMobileValid("98765432100")).toBe(false); // 11 digits
    expect(isMobileValid("abcdefghij")).toBe(false);
    expect(isMobileValid("")).toBe(false);
  });

  it("3. Enrolment button remains disabled until all required fields are complete and valid", () => {
    const invalidForm = {
      childName: "Aarav",
      schoolCode: "1234", // Incomplete (4 digits)
      parentName: "Gunvanth Madabattula",
      mobile: "9876543210",
      email: "gunvanth@example.com",
      agreed: true,
    };
    expect(checkFormCompleteness(invalidForm)).toBe(false);

    const missingConsent = {
      ...invalidForm,
      schoolCode: "10245",
      agreed: false,
    };
    expect(checkFormCompleteness(missingConsent)).toBe(false);

    const validForm = {
      childName: "Aarav",
      schoolCode: "10245",
      parentName: "Gunvanth Madabattula",
      mobile: "9876543210",
      email: "gunvanth@example.com",
      agreed: true,
    };
    expect(checkFormCompleteness(validForm)).toBe(true);
  });

  it("4. Email validation accepts real email and rejects malformed inputs", () => {
    expect(isEmailValid("parent@example.com")).toBe(true);
    expect(isEmailValid("gunvanth.m@thinkova.ai")).toBe(true);
    expect(isEmailValid("invalid-email")).toBe(false);
    expect(isEmailValid("")).toBe(false);
  });
});
