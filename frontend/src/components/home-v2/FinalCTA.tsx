'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative bg-black text-white h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Animated subtle background glow */}
      <motion.div
        animate={isInView ? { scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] } : {}}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[800px] h-[800px] bg-white rounded-full blur-[200px] opacity-10"
      />

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 text-center flex flex-col items-center px-4"
      >
        <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase">
          Ready to<br />Move?
        </h2>
        <p className="text-xl md:text-2xl text-neutral-400 mb-12 font-light max-w-lg">
          Join the waitlist or pre-order to secure the ultimate portable workstation.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden group bg-white text-black px-12 py-5 rounded-full font-bold text-xl uppercase tracking-widest"
        >
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            Secure Yours Now
          </span>
          <div className="absolute inset-0 bg-neutral-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
        </motion.button>
      </motion.div>
    </section>
  );
}
