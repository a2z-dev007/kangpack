'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ASSETS } from '@/constants/assets';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const productY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const productScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const bgShiftY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center pt-20"
    >
      {/* Background with slight shift */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#111] via-[#1a1a1a] to-black"
        style={{ y: bgShiftY }}
      />
      
      {/* Product Image */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ y: productY, scale: productScale }}
      >
        <img
          src={ASSETS.HERO.PRODUCT}
          alt="Kangpack Product"
          className="w-full max-w-4xl object-contain drop-shadow-2xl opacity-80 mix-blend-screen"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center mt-20"
        style={{ opacity: opacityFade }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase"
        >
          Work Anywhere.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-white">
            Without Limits.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="mt-6 text-xl md:text-2xl text-neutral-400 max-w-2xl"
        >
          The premium portable wearable workstation engineered for true mobility.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="mt-10"
        >
          <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Explore Kangpack
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ opacity: opacityFade }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-8 h-8 text-neutral-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
