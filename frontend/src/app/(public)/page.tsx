"use client"
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronRight, Play, Star, MapPin,
  Briefcase, Shield, Zap, Laptop, Globe, User,
  ArrowRight, Check, Plus, Minus
} from 'lucide-react';
import Navbar from '@/components/home/Navbar';
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
import SectionDivider from '@/components/common/SectionDivider';
import { Footer } from '@/components/layout/footer';
import { ASSETS } from '@/constants/assets';
import ScrollSection, { ParallaxImage } from '@/components/common/ScrollSection';
import GlobalVideoModal from '@/components/common/GlobalVideoModal';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-beige">
      <Navbar />
      <GlobalVideoModal />
      <main className="flex-grow">
        <ScrollSection>
          <Hero />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <GalleryIntro />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <Features />
        </ScrollSection>

        <ScrollSection>
          <DesignedToMove />
        </ScrollSection>

        <ScrollSection>
          <InAction />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <WhyChoose />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <Stats />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
        <WearableSection />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <GalleryThree />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <OfficeAnywhere />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <Testimonials />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <TechSpecs />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <RealMoments />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <Pricing />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <FAQ />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          {/* Large Product Reveal */}
          <div className="w-full h-[60vh] md:h-screen relative overflow-hidden">
            <ParallaxImage
              src={ASSETS.TICKERS.MAIN2}
              className="w-full h-full"
              alt="Detail View"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </ScrollSection>

        {/* Other Products Section */}
        <OurProducts />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
