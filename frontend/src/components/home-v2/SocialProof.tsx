'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  { text: "Kangpack transformed my commute. I no longer waste 30 minutes finding a surface at the terminal.", name: "Marcus T.", role: "Creative Director" },
  { text: "The engineering on this is incredible. The stability is perfect even when I'm walking to my next site.", name: "Elena R.", role: "Architect" },
  { text: "Best tech purchase of the year. My back thanks me every single day. A premium experience.", name: "David K.", role: "Freelance Developer" }
];

export default function SocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="bg-neutral-950 text-white py-32 border-t border-white/5" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center gap-2 mb-6 text-yellow-500">
            {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" stroke="none" />)}
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold mb-20 tracking-tight">
            Trusted by professionals globally.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
              transition={{ delay: i * 0.2 + 0.4, duration: 0.8 }}
              className="text-left"
            >
              <p className="text-xl text-neutral-300 italic mb-6 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-sm text-neutral-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
