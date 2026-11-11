"use client";

import { useState } from "react";
import { Check, Download, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function SchoolsSection() {
  const [schoolName, setSchoolName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [schoolRole, setSchoolRole] = useState("Principal");
  const [schoolCity, setSchoolCity] = useState("Pune");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolSubmitting, setSchoolSubmitting] = useState(false);
  const [schoolSuccess, setSchoolSuccess] = useState(false);
  const [schoolError, setSchoolError] = useState("");

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolError("");

    if (!schoolName.trim() || !contactPerson.trim() || !schoolPhone.trim()) {
      setSchoolError("Please provide your school name, contact name, and phone number.");
      return;
    }

    setSchoolSubmitting(true);
    try {
      const res = await fetch("/api/school-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactPerson.trim(),
          schoolName: schoolName.trim(),
          city: schoolCity.trim() || "Pune",
          schoolCity: `${schoolName.trim()}, ${schoolCity.trim() || "Pune"}`,
          role: schoolRole,
          phone: schoolPhone.trim(),
          email: schoolEmail.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit callback request.");
      }

      setSchoolSuccess(true);
    } catch (err) {
      setSchoolError((err as Error).message || "Failed to submit. Please try again.");
    } finally {
      setSchoolSubmitting(false);
    }
  };

  return (
    <section
      id="schools"
      aria-labelledby="schools-title"
      className="relative w-full overflow-hidden bg-[#0B0C0F] py-24 text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('/images/topo-dark.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "800px",
        }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left School Props (Cols 1-6) */}
          <div className="col-span-1 flex flex-col justify-between lg:col-span-6">
            <div>
              <h2
                id="schools-title"
                className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-white sm:text-[44px]"
              >
                Bring ThinkOva to your school.
              </h2>
              <p className="mt-4 text-[17px] leading-[26px] text-white/70">
                We bring trained tutors, every lesson, build kits, enrolment, fees and parent
                updates. Your school picks the tracks and hosts one class a week in its lab.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "No extra work for your teachers",
                  "Covers CBSE AI and computational thinking topics, plus robotics and electronics, for Classes 5 to 11",
                  "A partner fee for each enrolled student, set out in a one-page agreement",
                  "A demo day for your school community at the end of every course",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C] text-white">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#schools"
                className="rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#E05316] px-6 py-3 text-xs font-semibold text-white shadow-lg transition hover:scale-[1.02]"
              >
                Get a callback →
              </a>
              <a
                href="/downloads/ThinkOva-School-Partnership-Pack.pdf"
                download
                className="rounded-xl border border-white/20 bg-white/[0.05] px-6 py-3 text-xs font-semibold text-white transition hover:border-white/40"
              >
                Download the school pack (PDF) →
              </a>
            </div>
          </div>

          {/* Right School Callback Form (Cols 7-12) */}
          <div className="col-span-1 lg:col-span-6">
            <div className="rounded-3xl border border-white/10 bg-white p-6 text-[#0B0C0F] shadow-2xl sm:p-9">
              {schoolSuccess ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="size-8 stroke-[2.5]" />
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-[#0B0C0F]">Request received</h3>
                  <p className="mt-2 text-sm text-[#5A5F6B]">
                    Thank you, {contactPerson}. Our partnerships team will call you within one
                    working day to plan a visit or a free demo class.
                  </p>
                  <a
                    href="/downloads/ThinkOva-School-Partnership-Pack.pdf"
                    download
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B0C0F] px-6 py-2.5 text-xs font-semibold text-white"
                  >
                    <Download className="size-4" />
                    Download the school pack (PDF)
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSchoolSubmit} className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#FEEFEA] px-3.5 py-1 text-xs font-semibold text-[#FF6B2C]">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Partnerships team · calls back in 1 working day
                  </div>

                  <h3 className="text-2xl font-semibold text-[#0B0C0F]">Get a callback</h3>
                  <p className="text-xs text-[#5A5F6B]">
                    For schools. Leave your details and our partnerships team will call you within
                    one working day.
                  </p>

                  {schoolError && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                      {schoolError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#5A5F6B]">
                      School name
                    </label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Banyan Grove School"
                      className="mt-1 w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5F6B]">
                        Contact person
                      </label>
                      <input
                        type="text"
                        required
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="Your name"
                        className="mt-1 w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A5F6B]">Role</label>
                      <select
                        value={schoolRole}
                        onChange={(e) => setSchoolRole(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                      >
                        <option value="Principal">Principal</option>
                        <option value="Trustee / Management">Trustee / Management</option>
                        <option value="Head of Science / CS">Head of Science / CS</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Parent representing school">Parent representing school</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A5F6B]">City</label>
                      <input
                        type="text"
                        value={schoolCity}
                        onChange={(e) => setSchoolCity(e.target.value)}
                        placeholder="Pune"
                        className="mt-1 w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A5F6B]">
                        Phone (WhatsApp preferred)
                      </label>
                      <input
                        type="tel"
                        required
                        value={schoolPhone}
                        onChange={(e) => setSchoolPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="mt-1 w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5A5F6B]">
                      Official email
                    </label>
                    <input
                      type="email"
                      value={schoolEmail}
                      onChange={(e) => setSchoolEmail(e.target.value)}
                      placeholder="principal@school.edu.in"
                      className="mt-1 w-full rounded-xl border border-[#E3E1D9] bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#0B0C0F] outline-none transition focus:border-[#FF6B2C] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={schoolSubmitting}
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#FF6B2C] to-[#E05316] py-3.5 text-center text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {schoolSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      "Request a callback & school pack →"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
