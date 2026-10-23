import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center text-white">
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="font-display text-4xl">This level doesn’t exist</h1>
      <Link href="/" className="min-h-12 rounded-[10px] bg-brand-gradient px-6 py-3 font-semibold text-ink">
        Back to LvlUp
      </Link>
    </main>
  );
}
