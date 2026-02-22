"use client"
import React from 'react';
import Navbar from '@/components/home/Navbar';
import FAQ from '@/components/home/FAQ';
import { motion } from 'framer-motion';
import { ASSETS } from '@/constants/assets';
import { ParallaxImage } from '@/components/common/ScrollSection';

const FAQsPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-brand-beige">
            <Navbar solid />
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative h-[40vh] min-h-[400px] overflow-hidden">
                    <div className="absolute inset-0 bg-brand-brown/90 z-10" />
                    <div className="absolute inset-0 opacity-30 z-0">
                        <ParallaxImage
                            src={ASSETS.TICKERS.MAIN} // Using a generic texture/image
                            className="w-full h-full object-cover grayscale"
                            alt="FAQs Background"
                        />
                    </div>

                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6 pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm mb-6 border border-white/20"
                        >
                            <span className="text-xs font-bold tracking-widest text-white uppercase">
                                Support Center
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6"
                        >
                            Frequently Asked
                        </motion.h1>
                    </div>
                </div>

                {/* Reuse the existing FAQ component */}
                <div className=" relative z-30 my-10">
                    <FAQ />
                </div>

            </main>
        </div>
    );
};

export default FAQsPage;
