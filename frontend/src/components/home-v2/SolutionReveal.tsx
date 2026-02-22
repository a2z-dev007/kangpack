'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ASSETS } from '@/constants/assets';

export default function SolutionReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0.2, 0.8], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.4, 0.6], [50, 0]);

  return (
    <section ref={containerRef} className="relative w-full h-[150vh] bg-black flow-root">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 z-0 bg-radial-gradient from-white/10 to-transparent rounded-full blur-[100px]"
          style={{ opacity: scrollYProgress }}
        />

        <motion.div
          className="relative z-10 w-full max-w-4xl px-6 flex justify-center"
          style={{ scale, opacity }}
        >
          {/* Main Product Reveal - cinematic lighting */}
          <div className="relative">
            <motion.div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-20" />
            <img 
              src={ASSETS.FRONT_BACK_SIDEWAYS.IMAGE_2} 
              alt="Kangpack Reveal" 
              className="w-full h-auto object-contain z-10 relative drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] brightness-110 contrast-125"
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 z-30 text-center px-4"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest">
            Enter Kangpack
          </h2>
          <p className="mt-4 text-xl text-neutral-300 max-w-xl mx-auto font-light">
            Designed to redefine your workspace. Premium craftsmanship meets functional engineering.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
