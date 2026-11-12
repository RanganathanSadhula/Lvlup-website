import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnrolSection } from "@/components/sections/EnrolSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enrol Your Child | ThinkOva",
  description: "Reserve a seat for your child in ThinkOva hands-on robotics, electronics, AI, game design, or product design tracks.",
};

export default function EnrolPage() {
  return (
    <div className="min-h-screen bg-[#F4F3EE] text-[#0B0C0F] selection:bg-[#FF6B2C] selection:text-white">
      <Header />
      <main id="main">
        <EnrolSection />
      </main>
      <Footer />
    </div>
  );
}

