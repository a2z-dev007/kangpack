"use client";
import React from 'react';
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
import { ASSETS } from '@/constants/assets';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-beige">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <SectionDivider />
        <GalleryIntro />
        <SectionDivider />
        <Features />
        <DesignedToMove />
        <InAction />
        <SectionDivider />
        <WhyChoose />
        <SectionDivider />
        <Stats />
        <SectionDivider />
        <WearableSection />
        <SectionDivider />
        <GalleryThree />
        <SectionDivider />
        <OfficeAnywhere />
        <SectionDivider />
        <Testimonials />
        <SectionDivider />
        <TechSpecs />
        <SectionDivider />
        <RealMoments />
        <SectionDivider />
        <Pricing />
        <SectionDivider />
        <FAQ />
        <SectionDivider />

        {/* Large Product Reveal */}
        <div className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden">
          <img
            src={ASSETS.TICKERS.MAIN2}
            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
            alt="Detail View"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        </div>

        {/* Other Products Section */}
        <OurProducts />
      </main>
    </div>
  );
};

export default HomePage;
