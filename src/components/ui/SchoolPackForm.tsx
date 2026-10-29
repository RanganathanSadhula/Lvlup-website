"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { schoolPackSchema, type SchoolPackInput } from "@/lib/validations";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

type Status =
  | { state: "idle" }
  | { state: "success" }
  | { state: "error"; message: string };

const fields = [
  { name: "name", label: "Your name", placeholder: "e.g. Priya Sharma", autoComplete: "name", inputMode: "text" },
  { name: "schoolCity", label: "School and city", placeholder: "e.g. [School name], Pune", autoComplete: "organization", inputMode: "text" },
  { name: "role", label: "Your role", placeholder: "Principal, coordinator or teacher", autoComplete: "organization-title", inputMode: "text" },
  { name: "phone", label: "Phone or WhatsApp", placeholder: "10-digit mobile number", autoComplete: "tel-national", inputMode: "tel" },
] as const;

export function SchoolPackForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SchoolPackInput>({ resolver: zodResolver(schoolPackSchema), defaultValues: { company: "" } });

  async function onSubmit(values: SchoolPackInput) {
    setStatus({ state: "idle" });
    try {
      const res = await fetch("/api/school-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setStatus({ state: "success" });
        reset();
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus({
        state: "error",
        message:
          res.status === 503
            ? "Sending isn’t connected yet, so your request was not delivered. Please WhatsApp us instead."
            : body.error ?? "Something went wrong. Please try again, or WhatsApp us.",
      });
    } catch {
      setStatus({ state: "error", message: "We couldn’t reach the server. Check your connection and try again." });
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-3 py-6">
        <CheckCircle2 aria-hidden className="size-8 text-brand-dark" />
        <h3 className="font-display text-2xl tracking-[-0.02em]">Thank you. We have your request.</h3>
        <p className="text-sm leading-relaxed text-muted">
          We’ll send the school pack on WhatsApp within one working day.
        </p>
        <button type="button" onClick={() => setStatus({ state: "idle" })} className="mt-2 text-sm font-semibold underline underline-offset-2">
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-describedby={status.state === "error" ? "school-form-error" : undefined}>
      {fields.map((f) => {
        const err = errors[f.name];
        return (
          <div key={f.name} className="mb-4">
            <label htmlFor={`sp-${f.name}`} className="mb-1.5 block text-xs font-medium text-ink">{f.label}</label>
            <input
              id={`sp-${f.name}`}
              type={f.name === "phone" ? "tel" : "text"}
              inputMode={f.inputMode}
              autoComplete={f.autoComplete}
              placeholder={f.placeholder}
              aria-invalid={err ? true : undefined}
              aria-describedby={err ? `sp-${f.name}-err` : undefined}
              className={cn(
                "min-h-12 w-full rounded-lg border bg-cream px-4 text-[15px] text-ink placeholder:text-ink/40",
                err ? "border-red-600" : "border-transparent",
              )}
              {...register(f.name)}
            />
            {err && <p id={`sp-${f.name}-err`} className="mt-1.5 text-xs font-medium text-red-700">{err.message}</p>}
          </div>
        );
      })}
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Company<input type="text" tabIndex={-1} autoComplete="off" {...register("company")} /></label>
      </div>

      {status.state === "error" && (
        <div id="school-form-error" role="alert" className="mb-4 flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            {status.message}{" "}
            {siteConfig.whatsappUrl !== "/#contact" && (
              <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Open WhatsApp</a>
            )}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-ink text-[15px] font-semibold text-white transition hover:bg-ink-3 disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden className="size-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send me the school pack <ArrowRight aria-hidden className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
