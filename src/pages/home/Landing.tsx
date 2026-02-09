import { useLandingAnimations } from "@/lib/hooks/landing/useLandingAnimations";
import { LandingBackground } from "@/components/layout/landing/LandingBackground";
import { LandingHeader } from "@/components/layout/landing/LandingHeader";
import { LandingHero } from "@/components/layout/landing/LandingHero";
import { LandingProductMockup } from "@/components/layout/landing/LandingProductMockup";
import { LandingEcosystem } from "@/components/layout/landing/LandingEcosystem";
import { LandingFeatures } from "@/components/layout/landing/LandingFeatures";
import { LandingTestimonial } from "@/components/layout/landing/LandingTestimonial";
import { LandingWorkflow } from "@/components/layout/landing/LandingWorkflow";
import { LandingCTA } from "@/components/layout/landing/LandingCTA";
import { LandingFooter } from "@/components/layout/landing/LandingFooter";

export default function Landing() {
  const {
    isMenuOpen,
    setIsMenuOpen,
    scrolled,
    demoStatus,
    setDemoStatus,
    heroRef,
    ecoRef,
    mockupY,
    innerMockupY,
    opacity,
    scale,
    ecoY1,
    ecoY2,
    ecoY3,
  } = useLandingAnimations();

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#02040c] text-slate-900 dark:text-white selection:bg-blue-500/30 font-['Outfit'] overflow-x-hidden relative">
      <LandingBackground />

      <LandingHeader
        scrolled={scrolled}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <main className="relative z-10">
        <LandingHero heroRef={heroRef} opacity={opacity} scale={scale} />

        <LandingProductMockup
          mockupY={mockupY}
          innerMockupY={innerMockupY}
          demoStatus={demoStatus}
          setDemoStatus={setDemoStatus}
        />

        <LandingEcosystem
          ecoRef={ecoRef}
          ecoY1={ecoY1}
          ecoY2={ecoY2}
          ecoY3={ecoY3}
        />

        <LandingFeatures />

        <LandingTestimonial />

        <LandingWorkflow />

        <LandingCTA />
      </main>

      <LandingFooter />
    </div>
  );
}
