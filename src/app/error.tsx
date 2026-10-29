"use client";

import { siteConfig } from "@/data/site";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center text-white">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="text-muted-dark">Please try again. If it keeps happening, message us on <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">WhatsApp</a>.</p>
      <button onClick={reset} className="min-h-12 rounded-[10px] bg-brand-gradient px-6 font-semibold text-ink">
        Try again
      </button>
    </main>
  );
}
