"use client"
import React from 'react';
import Navbar from '@/components/home/Navbar';
import GlobalVideoModal from '@/components/common/GlobalVideoModal';
import ScrollSection, { ParallaxImage } from '@/components/common/ScrollSection';
import { ASSETS } from '@/constants/assets';

// Smooth scroll + cursor
import SmoothScroll from '@/components/home-v2/SmoothScroll';
import CursorGlow from '@/components/home-v2/CursorGlow';

// ── Existing sections ──────────────────────────────────────────────────────────
import Hero from '@/components/home/Hero';
import GalleryIntro from '@/components/home/GalleryIntro';
import Features from '@/components/home/Features';
import DesignedToMove from '@/components/home/DesignedToMove';
import InAction from '@/components/home/InAction';
import WhyChoose from '@/components/home/WhyChoose';
import Stats from '@/components/home/Stats';
import WearableSection from '@/components/home/WearableSection';
import GalleryThree from '@/components/home/GalleryThree';
import OfficeAnywhere from '@/components/home/OfficeAnywhere';
import Testimonials from '@/components/home/Testimonials';
import TechSpecs from '@/components/home/TechSpecs';
import RealMoments from '@/components/home/RealMoments';
import Pricing from '@/components/home/Pricing';
import FAQ from '@/components/home/FAQ';
import OurProducts from '@/components/home/OurProducts';
import Footer from '@/components/home/Footer';

// ── NEW sections ───────────────────────────────────────────────────────────────
import ProblemSection from '@/components/home/ProblemSection';
import SolutionReveal from '@/components/home/SolutionReveal';
import HowItWorks from '@/components/home/HowItWorks';
import ComparisonSection from '@/components/home/ComparisonSection';
import FinalCTA from '@/components/home/FinalCTA';

const HomePage: React.FC = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col font-sans bg-black">
        {/* Sticky Navbar */}
        <div className="fixed top-0 w-full z-50">
          <Navbar />
        </div>

        <GlobalVideoModal />

        <main className="flex-grow pt-0">

          {/* ═══════════════════════════════════════╗
               1 — HERO (Cinematic Impact)
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <Hero />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               2 — PROBLEM (Emotional Trigger)  [DARK]
          ╚══════════════════════════════════════ */}
          <ProblemSection />

          {/* ═══════════════════════════════════════╗
               3 — SOLUTION REVEAL                 [DARK]
          ╚══════════════════════════════════════ */}
          <SolutionReveal />

          {/* ═══════════════════════════════════════╗
               4 — PRODUCT IMMERSIVE SHOWCASE      [DARK]
                   WearableSection — sticky scroll
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <WearableSection />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               5 — PRODUCT GALLERY (3-view)        [DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <GalleryThree />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               5B — FEATURE DEEP DIVE              [DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <Features />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               6 — LIFESTYLE / IN ACTION           [DARK]
                   Horizontal scroll use-cases
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <OfficeAnywhere />
          </ScrollSection>

          <ScrollSection>
            <InAction />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               6B — GALLERY INTRO (light interlude)[DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <GalleryIntro />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               7 — HOW IT WORKS  (horizontal scroll)[DARK]
          ╚══════════════════════════════════════ */}
          <HowItWorks />

          {/* ═══════════════════════════════════════╗
               7B — DESIGNED TO MOVE               [DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <DesignedToMove />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               8 — SOCIAL PROOF / TESTIMONIALS     [DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <Testimonials />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               8B — REAL MOMENTS (gallery)         [DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <RealMoments />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               9 — COMPARISON / WHY KANGPACK       [DARK]
          ╚══════════════════════════════════════ */}
          <ComparisonSection />

          {/* ═══════════════════════════════════════╗
               9B — WHY CHOOSE                     [DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <WhyChoose />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               9C — TECH SPECS                     [DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <TechSpecs />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               9D — STATS                          [DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <Stats />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               9E — PRICING                        [DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <Pricing />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               9F — FAQ                            [DARK]
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <FAQ />
          </ScrollSection>

          {/* ═══════════════════════════════════════╗
               10 — FINAL CTA                      [LIGHT]
          ╚══════════════════════════════════════ */}
          <FinalCTA />

          {/* ═══════════════════════════════════════╗
               CINEMATIC FULL-BLEED IMAGE
          ╚══════════════════════════════════════ */}
          <ScrollSection>
            <div className="w-full h-[60vh] md:h-screen relative overflow-hidden">
              <ParallaxImage
                src={ASSETS.TICKERS.MAIN2}
                className="w-full h-full"
                alt="Detail View"
              />
              <div className="absolute inset-0 bg-black/30" />
              {/* Overlay CTA */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-4">Take it anywhere</p>
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                  The workspace<br />that follows you.
                </h3>
              </div>
            </div>
          </ScrollSection>

          {/* Products */}
          <OurProducts />

        </main>

        {/* Footer */}
        <Footer />

      </div>
    </SmoothScroll>
  );
};

export default HomePage;
