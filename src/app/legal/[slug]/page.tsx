import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { legalPages } from "@/data/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return Object.keys(legalPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages[slug];
  return { title: page?.title ?? "Not found" };
}

/** Placeholder destination so footer/legal links never 404 until the real documents exist. */
export default async function LegalPlaceholderPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = legalPages[slug];
  if (!page) notFound();
  return (
    <>
      <Header />
      <main id="main" className="bg-cream py-24 text-ink">
        <Container className="max-w-2xl">
          <h1 className="font-display text-4xl tracking-[-0.03em]">{page.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {page.note} will be published here. Replace this page (or point the link to your hosted PDF) before launch.
          </p>
          {slug === "curriculum" && (
            <div className="mt-6">
              <a
                href="/downloads/LvlUp-Eight-Week-Curriculum.pdf"
                download="LvlUp Eight-Week Curriculum.pdf"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-105"
              >
                Download LvlUp Eight-Week Curriculum (PDF)
              </a>
            </div>
          )}
          <div className="mt-8"><ButtonLink href="/" variant="dark">Back to home</ButtonLink></div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
