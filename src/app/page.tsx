import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { CurriculumSection } from "@/components/sections/CurriculumSection";
import { EnrolSection } from "@/components/sections/EnrolSection";
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
import { TabletView } from "@/components/tablet/TabletView";

export default function HomePage() {
  return (
    <>
      {/* MOBILE — shown below md (< 768px) (100% untouched) */}
      <div className="block md:hidden">
        <Header />
        <MobileView />
      </div>

      {/* TABLET — shown between 768px and 1023px (Dedicated Figma 768px Design) */}
      <div className="hidden md:block lg:hidden">
        <TabletView />
      </div>

      {/* DESKTOP — shown at lg and above (1024px+) (100% untouched) */}
      <div className="hidden lg:block">
        <Header />
        <main id="main" className="w-full">
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
          <EnrolSection />
          <FAQSection />
          <SchoolsSection />
          <FinalCTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
