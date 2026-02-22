'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ASSETS } from '@/constants/assets';

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const s1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 1, 0]);
  const s1Y = useTransform(scrollYProgress, [0.2, 0.4], [0, -50]);

  const s2Opacity = useTransform(scrollYProgress, [0.4, 0.5, 0.7], [0, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0.4, 0.5, 0.7], [50, 0, -50]);

  const s3Opacity = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);
  const s3Y = useTransform(scrollYProgress, [0.7, 0.8], [50, 0]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-black text-white">
      <div className="sticky top-0 h-screen flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto px-6">
        
        {/* Left visually pinned title */}
        <div className="w-full md:w-1/3 flex flex-col justify-center h-full z-20">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight uppercase">
            Deploy in <br /> Seconds.
          </h2>
          <motion.div className="h-1 bg-white/20 mt-8 w-1/2 relative">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-white" 
              style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
            />
          </motion.div>
        </div>

        {/* Right side steps */}
        <div className="w-full md:w-2/3 h-full relative flex items-center justify-center">
          
          <motion.div 
            style={{ opacity: s1Opacity, y: s1Y }} 
            className="absolute flex flex-col items-center justify-center text-center px-4"
          >
            <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center text-3xl font-bold mb-6">1</div>
            <h3 className="text-4xl font-semibold mb-4 text-white">Wear It</h3>
            <p className="text-xl text-neutral-400 max-w-sm">Strap the Kangpack securely to your chest with the intuitive quick-release buckles.</p>
            <img src={ASSETS.TICKERS.IMG_354A7751} alt="Wear" className="mt-8 rounded-2xl w-full max-w-md h-auto object-cover opacity-80 mix-blend-luminosity" />
          </motion.div>

          <motion.div 
            style={{ opacity: s2Opacity, y: s2Y }} 
            className="absolute flex flex-col items-center justify-center text-center px-4"
          >
             <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center text-3xl font-bold mb-6">2</div>
            <h3 className="text-4xl font-semibold mb-4 text-white">Flip the Desk</h3>
            <p className="text-xl text-neutral-400 max-w-sm">Release the magnetic locks and let the rigid shelf drop perfectly into place.</p>
            <img src={ASSETS.TICKERS.IMG_354A7762} alt="Place Laptop" className="mt-8 rounded-2xl w-full max-w-md h-auto object-cover opacity-80 mix-blend-luminosity" />
          </motion.div>

          <motion.div 
            style={{ opacity: s3Opacity, y: s3Y }} 
            className="absolute flex flex-col items-center justify-center text-center px-4"
          >
             <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center text-3xl font-bold mb-6">3</div>
            <h3 className="text-4xl font-semibold mb-4 text-white">Start Working</h3>
            <p className="text-xl text-neutral-400 max-w-sm">Place your laptop, adjust the angle, and type away with full stability.</p>
            <img src={ASSETS.TICKERS.SECOND} alt="Work" className="mt-8 rounded-2xl w-full max-w-md h-auto object-cover opacity-80 mix-blend-luminosity" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
