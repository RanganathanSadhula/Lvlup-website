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
