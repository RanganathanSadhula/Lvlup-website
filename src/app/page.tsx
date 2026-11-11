import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileView } from "@/components/mobile/MobileView";
import { TabletView } from "@/components/tablet/TabletView";

// Modular Section Components (Figma 1440px Web · Desktop 727:81)
import { HeroSection } from "@/components/sections/HeroSection";
import { FactsSection } from "@/components/sections/FactsSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { CurriculumSection } from "@/components/sections/CurriculumSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { OutcomesSection } from "@/components/sections/OutcomesSection";
import { TeachingSection } from "@/components/sections/TeachingSection";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { EnrolSection } from "@/components/sections/EnrolSection";
import { SafetySection } from "@/components/sections/SafetySection";
import { JoiningProcessSection } from "@/components/sections/JoiningProcessSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { SchoolsSection } from "@/components/sections/SchoolsSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

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

      {/* DESKTOP — shown at lg and above (1024px+) (Modular sections matching Figma 1440px Web · Desktop 727:81) */}
      <div className="hidden lg:block w-full bg-[#0B0C0F] text-white selection:bg-[#FF6B2C] selection:text-white">
        <Header />
        <main id="main">
          <HeroSection />
          <FactsSection />
          <ProblemSection />
          <CurriculumSection />
          <SolutionSection />
          <OutcomesSection />
          <TeachingSection />
          <AudienceSection />
          <PricingSection />
          <EnrolSection />
          <SafetySection />
          <JoiningProcessSection />
          <FAQSection />
          <SchoolsSection />
          <FinalCTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
