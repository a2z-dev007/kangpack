'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ASSETS } from '@/constants/assets';

export default function ProductImmersive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate rotation or shift based on scroll sections (4 sections)
  // Each segment is 25% of the scroll
  const productRotation = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const productScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);

  // Section Opacities
  const op1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.2, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  const op3 = useTransform(scrollYProgress, [0.5, 0.7, 0.8, 0.9], [0, 1, 1, 0]);
  const op4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);

  return (
    <section ref={containerRef} className="relative w-full h-[400vh] bg-neutral-950 flex flex-col items-center overflow-clip">
      
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center p-6 md:p-24 overflow-hidden">
        
        {/* Left Side: Product Image spinning/scaling */}
        <motion.div 
          className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center relative z-20"
          style={{ rotate: productRotation, scale: productScale }}
        >
          <img 
            src={ASSETS.FRONT_BACK_SIDEWAYS.IMAGE_1} 
            alt="Product Details" 
            className="w-full max-w-2xl object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)]"
          />
        </motion.div>

        {/* Right Side: Text Highlights */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-center z-30">
          
          <motion.div style={{ opacity: op1 }} className="absolute flex flex-col gap-4 text-center md:text-left text-white max-w-md">
            <h3 className="text-3xl font-bold uppercase tracking-wide">Wearable Design</h3>
            <p className="text-lg text-neutral-400">Crafted to fit your body naturally. The Kangpack merges seamlessly with your movement, so it feels like a part of you.</p>
          </motion.div>
          
          <motion.div style={{ opacity: op2 }} className="absolute flex flex-col gap-4 text-center md:text-left text-white max-w-md">
            <h3 className="text-3xl font-bold uppercase tracking-wide">Ultimate Stability</h3>
            <p className="text-lg text-neutral-400">Military-grade straps and tensioners keep your workstation solid, even on uneven terrain or crowded spaces.</p>
          </motion.div>
          
          <motion.div style={{ opacity: op3 }} className="absolute flex flex-col gap-4 text-center md:text-left text-white max-w-md">
            <h3 className="text-3xl font-bold uppercase tracking-wide">Exceptional Portability</h3>
            <p className="text-lg text-neutral-400">Folds away in seconds. Ready to deploy when inspiration strikes. The true definition of portable power.</p>
          </motion.div>
          
          <motion.div style={{ opacity: op4 }} className="absolute flex flex-col gap-4 text-center md:text-left text-white max-w-md">
            <h3 className="text-3xl font-bold uppercase tracking-wide">Premium Craftsmanship</h3>
            <p className="text-lg text-neutral-400">Built with hyper-durable ballistic nylon, genuine leather accents, and aerospace-grade aluminum hardware.</p>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
