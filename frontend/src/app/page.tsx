import { Navbar } from "@/components/navbar";
import { Hero } from "@/features/landing/components/hero";
import { AboutSection } from "@/features/landing/components/about-section";
import { EcosystemsSection } from "@/features/landing/components/ecosystems-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works";
import { MissionSection } from "@/features/landing/components/mission-section";
import { ImpactSection } from "@/features/landing/components/impact-section";
import { CtaSection } from "@/features/landing/components/cta-section";
import { Footer } from "@/features/landing/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <EcosystemsSection />
        <HowItWorksSection />
        <MissionSection />
        <ImpactSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
