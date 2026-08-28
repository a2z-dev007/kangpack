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
import ProductShowcase from '@/components/home/ProductShowcase';
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
        {/* 1. Hero banner with high-impact value proposition */}
        <Hero />

        <SectionDivider />

        {/* 2. Stats & Trust builders immediately below Hero */}
        <ScrollSection>
          <Stats />
        </ScrollSection>

        <SectionDivider />

        {/* 3. Product Catalog Grid early in the scroll to convert users quickly */}
        <ScrollSection>
          <OurProducts />
        </ScrollSection>

        <SectionDivider />

        {/* 3b. New product showcase from poster assets */}
        <ScrollSection>
          <ProductShowcase />
        </ScrollSection>

        <SectionDivider />

        {/* 4. Visual introduction to the brand story */}
        <ScrollSection>
          <GalleryIntro />
        </ScrollSection>

        <SectionDivider />

        {/* 5. Key benefits & unique design features */}
        <ScrollSection>
          <Features />
        </ScrollSection>

        <ScrollSection>
          <DesignedToMove />
        </ScrollSection>

        {/* 6. Product Demo / In-action showcase */}
        <ScrollSection>
          <InAction />
        </ScrollSection>

        <SectionDivider />

        {/* 7. Why choose us / Brand values */}
        <ScrollSection>
          <WhyChoose />
        </ScrollSection>

        <SectionDivider />

        {/* 8. Lifestyle wearable showcase */}
        <ScrollSection>
          <WearableSection />
        </ScrollSection>

        <SectionDivider />

        <ScrollSection>
          <GalleryThree />
        </ScrollSection>

        <SectionDivider />

        {/* 9. Daily use cases (Office anywhere) */}
        <ScrollSection>
          <OfficeAnywhere />
        </ScrollSection>

        <SectionDivider />

        {/* 10. Social Proof (Testimonials / Customer Reviews) */}
        <ScrollSection>
          <Testimonials />
        </ScrollSection>

        <SectionDivider />

        {/* 11. Informational specs & technical dimensions */}
        <ScrollSection>
          <TechSpecs />
        </ScrollSection>

        <SectionDivider />

        {/* 12. User-generated content / Instagram moments */}
        <ScrollSection>
          <RealMoments />
        </ScrollSection>

        <SectionDivider />

        {/* 13. Pricing details and value bundles */}
        <ScrollSection>
          <Pricing />
        </ScrollSection>

        <SectionDivider />

        {/* 14. Customer FAQs to clear buying objections */}
        <ScrollSection>
          <FAQ />
        </ScrollSection>

        <SectionDivider />

        {/* 15. Large Product Reveal & exit CTA visual */}
        <ScrollSection>
          <div className="w-full h-[70vh] md:h-screen relative overflow-hidden flex items-center justify-center">
            <ParallaxImage
              src={ASSETS.TICKERS.MAIN2}
              className="w-full h-full object-cover"
              alt="Detail View"
            />
            {/* Sleek Gradient Overlay for maximum contrast and elegance */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15"></div>
            
            {/* Animated content card */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-12 z-10">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl space-y-6"
              >
                <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/80 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm inline-block">
                  Ready to Move?
                </span>
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                  Elevate Your <br className="hidden md:inline" />
                  <span className="text-[#E8D9C5]">Workstation</span>
                </h2>
                <p className="text-white/80 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
                  Join thousands of professionals who have transformed their daily productivity. Experience the smart wearable workstation today.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <motion.a
                    href="/products"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-[#6B4A2D] font-bold text-sm uppercase rounded-xl shadow-lg hover:bg-[#F9F7F4] transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    Shop the Collection
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </motion.a>
                  
                  <motion.a
                    href="/about"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm uppercase rounded-xl backdrop-blur-sm transition-all cursor-pointer"
                  >
                    Our Story
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollSection>
      </main>
  
    </div>
  );
};

export default HomePage;
