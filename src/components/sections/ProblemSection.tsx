import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ProblemSection() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="w-full bg-[#F4F3EE] py-24 text-[#0B0C0F]">
      <Container>
        <div>
          <h2
            id="problem-title"
            className="font-display text-[36px] font-normal leading-[1.1] tracking-[-0.025em] text-[#0B0C0F] sm:text-[44px]"
          >
            Kids use technology every day. Few get to
            <br className="hidden sm:block" /> build it.
          </h2>
          <p className="mt-3 max-w-[680px] text-base leading-[26px] text-[#5A5F6B] sm:text-[17px]">
            They game, scroll and ask chatbots for homework help. School rarely has time to
            show how any of it works.
          </p>
        </div>

        {/* 3 Chat Mockup Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <ScrollReveal delay={80}>
            <div className="flex flex-col justify-between rounded-2xl border border-[#E3E1D9] bg-white p-7 shadow-sm transition-all hover:border-[#D1CFC7] hover:shadow-md">
              <div>
                <div className="rounded-xl border border-[#E8E6DF] bg-[#F9F8F5] p-4">
                  <div className="flex items-center gap-1.5 border-b border-[#E8E6DF] pb-2 text-[11px] text-[#7E8492]">
                    <span className="size-2 rounded-full bg-[#D1CFC7]" />
                    <span className="size-2 rounded-full bg-[#D1CFC7]" />
                    <span className="size-2 rounded-full bg-[#D1CFC7]" />
                    <span className="ml-2 font-medium">Homework helper</span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-tr-none bg-[#0B0C0F] px-4 py-2 text-xs text-white">
                        What's the capital of Australia?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-tl-none bg-[#EAE8E1] px-4 py-2 text-xs font-medium text-[#0B0C0F]">
                        <span className="underline decoration-wavy decoration-[#FF6B2C]">
                          Sydney. Definitely Sydney.
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-[#E3E1D9] bg-white px-3 py-1.5 text-xs text-[#7E8492]">
                    <span>Ask anything</span>
                    <span className="rounded-full bg-[#0B0C0F] p-1 text-white">↑</span>
                  </div>
                  <div className="mt-2 text-[11px] font-medium text-[#FF6B2C]">
                    ↳ Copied into homework. It's Canberra
                  </div>
                </div>

                <div className="mt-6">
                  <span className="font-mono text-xs font-bold text-[#FF6B2C]">01</span>
                  <h3 className="mt-2 text-[20px] font-semibold text-[#0B0C0F]">
                    They copy answers they can't check
                  </h3>
                  <p className="mt-2 text-sm leading-[22px] text-[#5A5F6B]">
                    A chatbot sounds sure even when it's wrong. Children need the habit of
                    checking.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal delay={160}>
            <div className="flex flex-col justify-between rounded-2xl border border-[#E3E1D9] bg-white p-7 shadow-sm transition-all hover:border-[#D1CFC7] hover:shadow-md">
              <div>
                <div className="rounded-xl border border-[#E8E6DF] bg-[#F9F8F5] p-4">
                  <div className="flex items-center gap-1.5 border-b border-[#E8E6DF] pb-2 text-[11px] text-[#7E8492]">
                    <span className="size-2 rounded-full bg-[#D1CFC7]" />
                    <span className="size-2 rounded-full bg-[#D1CFC7]" />
                    <span className="size-2 rounded-full bg-[#D1CFC7]" />
                    <span className="ml-2 font-medium">New chat</span>
                  </div>
                  <div className="mt-4">
                    <div className="rounded-xl border border-[#FF6B2C]/30 bg-white p-3 text-xs leading-[18px] text-[#0B0C0F]">
                      Hi! I'm <span className="text-[#FF6B2C] font-semibold underline">Aarav Sharma</span>, Class 6B at{" "}
                      <span className="text-[#FF6B2C] font-semibold underline">Banyan Grove School</span>. My mum's number is{" "}
                      <span className="text-[#FF6B2C] font-semibold underline">98765 43210</span>.
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-[#E3E1D9] bg-white px-3 py-1.5 text-xs text-[#7E8492]">
                    <span>Send to: Ask-Me-Anything bot</span>
                    <span className="rounded bg-[#0B0C0F] px-2 py-0.5 text-[10px] text-white font-medium">
                      Send
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] font-medium text-[#FF6B2C]">
                    ↳ 3 private details, one tap from sent
                  </div>
                </div>

                <div className="mt-6">
                  <span className="font-mono text-xs font-bold text-[#FF6B2C]">02</span>
                  <h3 className="mt-2 text-[20px] font-semibold text-[#0B0C0F]">
                    They share more than they should
                  </h3>
                  <p className="mt-2 text-sm leading-[22px] text-[#5A5F6B]">
                    Names, school and photos go into apps without a second thought.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3 */}
          <ScrollReveal delay={240}>
            <div className="flex flex-col justify-between rounded-2xl border border-[#E3E1D9] bg-white p-7 shadow-sm transition-all hover:border-[#D1CFC7] hover:shadow-md">
              <div>
                <div className="rounded-xl border border-[#E8E6DF] bg-[#F9F8F5] p-4">
                  <div className="flex items-center gap-1.5 border-b border-[#E8E6DF] pb-2 text-[11px] text-[#7E8492]">
                    <span className="size-2 rounded-full bg-[#D1CFC7]" />
                    <span className="size-2 rounded-full bg-[#D1CFC7]" />
                    <span className="size-2 rounded-full bg-[#D1CFC7]" />
                    <span className="ml-2 font-medium">Ask-Me-Anything</span>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-tr-none bg-[#0B0C0F] px-4 py-2 text-xs text-white">
                        How do you know everything?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-tl-none bg-[#EAE8E1] px-4 py-2 text-xs text-[#0B0C0F]">
                        I learned patterns from lots of examples. I can be wrong too.
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-[#E3E1D9] bg-white px-3 py-1.5 text-xs text-[#7E8492]">
                    <span>Ask anything</span>
                    <span className="rounded-full bg-[#0B0C0F] p-1 text-white">↑</span>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="font-mono text-xs font-bold text-[#FF6B2C]">03</span>
                  <h3 className="mt-2 text-[20px] font-semibold text-[#0B0C0F]">
                    They see technology as magic
                  </h3>
                  <p className="mt-2 text-sm leading-[22px] text-[#5A5F6B]">
                    Not as something they can open up, question and build.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Dark Banner: "So we teach them to build it" */}
        <ScrollReveal delay={120}>
          <div className="mt-10 rounded-2xl bg-[#0B0C0F] p-8 text-white shadow-xl sm:p-10">
            <div className="grid gap-8 lg:grid-cols-4">
              <div className="lg:border-r lg:border-white/10 lg:pr-6">
                <h3 className="font-display text-[28px] font-normal leading-[1.1] text-white sm:text-[32px]">
                  So we teach them to
                  <br />
                  build it.
                </h3>
              </div>

              <div>
                <span className="font-mono text-xs font-bold text-[#FF6B2C]">01</span>
                <h4 className="mt-2 text-[17px] font-semibold text-white">Understand it</h4>
                <p className="mt-2 text-sm leading-[22px] text-white/60">
                  How a sensor reads, how a robot decides, how a game keeps score.
                </p>
              </div>

              <div>
                <span className="font-mono text-xs font-bold text-[#FF6B2C]">02</span>
                <h4 className="mt-2 text-[17px] font-semibold text-white">Try it safely</h4>
                <p className="mt-2 text-sm leading-[22px] text-white/60">
                  Approved tools and kits. Private details stay private.
                </p>
              </div>

              <div>
                <span className="font-mono text-xs font-bold text-[#FF6B2C]">03</span>
                <h4 className="mt-2 text-[17px] font-semibold text-white">Build with it</h4>
                <p className="mt-2 text-sm leading-[22px] text-white/60">
                  Each child builds and tests a project for a real problem.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
