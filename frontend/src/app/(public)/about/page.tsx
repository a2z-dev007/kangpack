"use client"
import React from 'react';
import Navbar from '@/components/home/Navbar';
import { motion } from 'framer-motion';
import { ASSETS } from '@/constants/assets';
import ScrollSection, { ParallaxImage } from '@/components/common/ScrollSection';
import SectionDivider from '@/components/common/SectionDivider';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-brand-beige">
            <Navbar solid />
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
                    <div className="absolute inset-0 bg-brand-brown/90 z-10" />
                    <ParallaxImage
                        src={ASSETS.ABOUT.FEATURE}
                        className="w-full h-full object-cover"
                        alt="About Kangpack"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6"
                        >
                            About Us
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-white/80 text-lg md:text-xl max-w-2xl font-light"
                        >
                            Redefining the way professionals work, move, and create in a mobile-first world.
                        </motion.p>
                    </div>
                </div>

                <SectionDivider />

                <ScrollSection className="py-24 px-6 md:px-16">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 bg-[#D4CEC4] px-4 py-2 rounded-lg"
                            >
                                <div className="w-1.5 h-1.5 bg-[#6B4A2D] rounded-full"></div>
                                <span className="text-[11px] font-medium tracking-wide brand-primary uppercase">
                                    Our Story
                                </span>
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-bold text-[#6B4A2D] tracking-tight">
                                Innovation driven by necessity.
                            </h2>
                            <p className="text-[#8B7E6F] text-lg leading-relaxed">
                                Kangpack was born from a simple observation: modern professionals are no longer tethered to desks, yet their gear hasn't kept up. We set out to create a solution that enables true mobile productivity without compromising on comfort or style.
                            </p>
                            <p className="text-[#8B7E6F] text-lg leading-relaxed">
                                Our wearable workstations are meticulously designed to provide a stable, ergonomic workspace wherever you are—whether it's a busy airport terminal, a park bench, or a remote mountainside.
                            </p>
                        </div>
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <ParallaxImage
                                src={ASSETS.ABOUT.IMG_1ST}
                                className="w-full h-full object-cover"
                                alt="Our Story"
                            />
                        </div>
                    </div>
                </ScrollSection>

                <SectionDivider />

                <ScrollSection className="py-24 px-6 md:px-16 bg-white/50">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-[#D4CEC4] px-4 py-2 rounded-lg mb-6"
                        >
                            <span className="text-[11px] font-medium tracking-wide brand-primary uppercase">
                                Our Values
                            </span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#6B4A2D] tracking-tight mb-6">
                            What drives us forward
                        </h2>
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Ergonomics First", desc: "We prioritize your physical health with designs that distribute weight evenly and promote good posture.", img: ASSETS.ABOUT.IMG_2ND },
                            { title: "Premium Materials", desc: "We use only the highest quality, durable materials that stand up to the rigors of daily travel and use.", img: ASSETS.ABOUT.IMG_3RD },
                            { title: "Functional Design", desc: "Every pocket, strap, and surface is intentional, designed to enhance your workflow and efficiency.", img: ASSETS.TICKERS.SIDE }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="h-64 rounded-xl overflow-hidden mb-6 relative">
                                    <div className="absolute inset-0 bg-[#6B4A2D]/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    <ParallaxImage
                                        src={item.img}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        alt={item.title}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-[#6B4A2D] mb-3">{item.title}</h3>
                                <p className="text-[#8B7E6F] leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </ScrollSection>
            </main>
        </div>
    );
};

export default AboutPage;
