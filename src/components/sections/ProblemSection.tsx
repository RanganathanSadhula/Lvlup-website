import { Lock, MessageSquareText, Share2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

function CopyVisual() {
  return (
    <div className="flex flex-col items-start gap-2.5 rounded-xl bg-cream px-4 py-5 sm:px-5">
      <p className="rounded-xl bg-brand px-3.5 py-2 text-[13px] font-medium text-ink">What is the capital of Australia?</p>
      <p className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-[13px]">
        <MessageSquareText aria-hidden className="size-4 text-ink" /> Sydney. Definitely Sydney.
      </p>
      <p className="flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-white">
        <span aria-hidden className="size-1.5 rounded-full bg-brand" /> Copied into homework
        <span className="font-normal text-white/60">(it is Canberra)</span>
      </p>
    </div>
  );
}

function ShareVisual() {
  return (
    <div className="space-y-3 rounded-xl bg-gradient-to-br from-[#f7efe7] to-cream px-4 py-6 sm:px-6">
      <p className="rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-[13px] leading-relaxed">
        Hi! I’m <b className="font-medium text-brand-dark">Aarav Sharma</b>,{" "}
        <b className="font-medium text-brand-dark">Class 6B at Banyan Grove School</b>. My mum’s number is{" "}
        <b className="font-medium text-brand-dark">98201 4…</b>
      </p>
      <p className="flex items-center gap-2 px-1 text-xs font-semibold">
        <Lock aria-hidden className="size-4 text-brand-dark" /> 3 private details, sent to a stranger app
      </p>
    </div>
  );
}

function MagicVisual() {
  return (
    <div className="rounded-xl bg-gradient-to-b from-ink-3 to-ink px-5 py-6 text-white">
      <div className="flex items-center gap-4">
        <span aria-hidden className="inline-flex size-12 items-center justify-center rounded-xl border border-white/10 bg-ink-2">
          <MessageSquareText className="size-5 text-white" />
        </span>
        <p className="font-display text-[26px] tracking-[-0.02em]">“It just knows.”</p>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-dark">
        <Share2 aria-hidden className="size-3.5 text-brand" /> Really: patterns learned from lots of examples
      </p>
    </div>
  );
}

const cards = [
  { visual: <CopyVisual />, title: "They copy answers they can’t check", body: "A chatbot sounds sure even when it is wrong. Children need the habit of checking." },
  { visual: <ShareVisual />, title: "They share more than they should", body: "Names, school and photos go into tools without a second thought." },
  { visual: <MagicVisual />, title: "They see AI as magic", body: "Not as a tool they can question, shape and build with." },
];

export function ProblemSection() {
  return (
    <Section id="problem" tone="light" aria-labelledby="problem-title">
      <Container>
        <SectionHeader
          id="problem-title"
          title={<>Kids already use AI.<br className="hidden sm:block" /> Few are shown how it works.</>}
          description="They ask chatbots for homework help, edit photos with AI and meet it in games. What school rarely has time for is the next step: how AI decides, when it is wrong, what to keep private, and how to make it do something useful."
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-14">
          {cards.map((c) => (
            <li key={c.title} className="rounded-2xl border border-black/[0.08] bg-white p-5 sm:p-7">
              <div className="[&>div]:min-h-[150px]">{c.visual}</div>
              <h3 className="mt-6 font-display text-[26px] leading-tight tracking-[-0.02em]">{c.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">{c.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
