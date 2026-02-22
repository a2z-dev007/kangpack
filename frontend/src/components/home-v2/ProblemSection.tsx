'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  // Subtle horizontal scroll for the scenes
  const scene1X = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const scene2X = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scene3X = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[120vh] bg-neutral-900 flex flex-col items-center justify-center overflow-hidden py-24"
    >
      <motion.div
        className="absolute inset-0 bg-black z-0 pointer-events-none"
        style={{ opacity: bgOpacity }}
      />
      
      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center">
        <motion.div
          className="text-center max-w-3xl mb-24"
          style={{ y: textY, opacity: textOpacity }}
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            The laptop promised freedom.
            <br />
            <span className="text-neutral-500">But reality is different.</span>
          </h2>
          <p className="text-xl text-neutral-400">
            Awkward postures, balancing acts on your knees, and the endless search for a comfortable workspace. The world wasn't built for mobile productivity.
          </p>
        </motion.div>

        {/* Storytelling Scenes */}
        <div className="flex flex-col gap-12 w-full mt-12">
          <motion.div style={{ x: scene1X }} className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden bg-neutral-800 p-8 border border-neutral-700/50 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-2 text-white/90">The Balancing Act</h3>
            <p className="text-neutral-400">Coffee in one hand, laptop sliding off your knees. A recipe for frustration rather than focus.</p>
          </motion.div>
          
          <motion.div style={{ x: scene2X }} className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden bg-neutral-800 p-8 border border-neutral-700/50 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-2 text-white/90">The Hunt for Space</h3>
            <p className="text-neutral-400">Wasting time looking for a clean, stable surface to simply open an email or check a document.</p>
          </motion.div>
          
          <motion.div style={{ x: scene3X }} className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden bg-neutral-800 p-8 border border-neutral-700/50 shadow-2xl">
            <h3 className="text-2xl font-semibold mb-2 text-white/90">The Posture Price</h3>
            <p className="text-neutral-400">Hunching over makeshift desks leaving your back and neck aching after just ten minutes.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
