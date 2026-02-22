'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Shield, Briefcase, MapPin, Laptop, Menu } from 'lucide-react';

const features = [
  { icon: Laptop, title: 'Instant Deployment', desc: 'Secure your laptop in 2.5 seconds flat.' },
  { icon: Shield, title: 'Impact Resistance', desc: 'Hardshell core protects against daily bumps.' },
  { icon: Briefcase, title: 'Professional Aesthetic', desc: 'Sleek dark tones for the modern urbanite.' },
  { icon: MapPin, title: 'Work Anywhere', desc: 'From airports to mountaintops.' },
  { icon: Zap, title: 'Quick Access Pockets', desc: 'For chargers, phones, and essentials.' },
  { icon: Menu, title: 'Expandable Storage', desc: 'Grows with your needs.' },
];

export default function FeatureDeepDive() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-[#0a0a0a] text-white py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Engineered to Perfection</h2>
          <p className="text-neutral-400 text-xl max-w-2xl">
            Every feature is designed with intention. Eliminating friction from your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-[#141414] border border-white/5 rounded-2xl p-8 hover:bg-[#1a1a1a] hover:border-white/10 transition-colors group cursor-default shadow-lg"
              >
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-neutral-300" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
