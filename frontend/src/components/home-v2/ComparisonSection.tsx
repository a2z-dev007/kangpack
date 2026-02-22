'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, X } from 'lucide-react';

export default function ComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-black text-white py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-black mb-6">The Old Way vs Kangpack</h2>
          <p className="text-xl text-neutral-400">Stop compromising your posture and time.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 min-h-[500px]">
          {/* Traditional Way */}
          <motion.div 
            initial={{ opacity: 0.3 }}
            animate={isInView ? { opacity: 0.5 } : { opacity: 0.3 }}
            transition={{ duration: 1 }}
            className="flex-1 bg-neutral-900 rounded-[2rem] p-12 flex flex-col items-center text-center justify-center grayscale opacity-60"
          >
            <h3 className="text-3xl font-bold mb-8 text-neutral-400">The Traditional Laptop</h3>
            <ul className="space-y-6 text-neutral-500 text-lg w-full max-w-sm">
              <li className="flex items-center gap-4 justify-start border-b border-neutral-800 pb-4"><X className="text-red-900 w-6 h-6" /> Requires a flat surface</li>
              <li className="flex items-center gap-4 justify-start border-b border-neutral-800 pb-4"><X className="text-red-900 w-6 h-6" /> Causes neck strain</li>
              <li className="flex items-center gap-4 justify-start border-b border-neutral-800 pb-4"><X className="text-red-900 w-6 h-6" /> Limits your mobility</li>
              <li className="flex items-center gap-4 justify-start pb-4"><X className="text-red-900 w-6 h-6" /> Vulnerable to drops</li>
            </ul>
          </motion.div>

          {/* Kangpack Way */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 50 }}
            animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.95, opacity: 0, y: 50 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex-1 bg-gradient-to-br from-neutral-800 to-black rounded-[2rem] p-12 flex flex-col items-center text-center justify-center border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] relative overflow-hidden"
          >
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute top-0 left-0 right-0 h-1 bg-white origin-left"
            />
            
            <h3 className="text-4xl font-black mb-8 text-white">Kangpack</h3>
            <ul className="space-y-6 text-neutral-200 text-xl w-full max-w-sm">
              <li className="flex items-center gap-4 justify-start border-b border-white/5 pb-4"><Check className="text-white w-6 h-6 shrink-0" /> Work anywhere, instantly</li>
              <li className="flex items-center gap-4 justify-start border-b border-white/5 pb-4"><Check className="text-white w-6 h-6 shrink-0" /> Ergonomic viewing angle</li>
              <li className="flex items-center gap-4 justify-start border-b border-white/5 pb-4"><Check className="text-white w-6 h-6 shrink-0" /> Full mobility secured</li>
              <li className="flex items-center gap-4 justify-start pb-4"><Check className="text-white w-6 h-6 shrink-0" /> Hardshell protection</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
