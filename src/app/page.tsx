import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { CurriculumSection } from "@/components/sections/CurriculumSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FactsSection } from "@/components/sections/FactsSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { HeroSection } from "@/components/sections/HeroSection";
import { JoiningProcessSection } from "@/components/sections/JoiningProcessSection";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SafetySection } from "@/components/sections/SafetySection";
import { SchoolsSection } from "@/components/sections/SchoolsSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { TeachingSection } from "@/components/sections/TeachingSection";
import { MobileView } from "@/components/mobile/MobileView";

export default function HomePage() {
  return (
    <>
      <Header />

      {/* MOBILE — shown below lg */}
      <div className="block lg:hidden">
        <MobileView />
      </div>

      {/* DESKTOP — shown at lg and above */}
      <div className="hidden lg:block">
        <main id="main">
          <HeroSection />
          <FactsSection />
          <ProblemSection />
          <SolutionSection />
          <CurriculumSection />
          <OutcomesSection />
          <AudienceSection />
          <TeachingSection />
          <SafetySection />
          <JoiningProcessSection />
          <PricingSection />
          <FAQSection />
          <SchoolsSection />
          <FinalCTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
