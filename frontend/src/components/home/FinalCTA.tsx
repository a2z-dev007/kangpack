"use client";
import React from "react";
import { motion } from "framer-motion";
import { ASSETS } from "@/constants/assets";
import Link from "next/link";

const FinalCTA: React.FC = () => {
  return (
    <section className="relative bg-[#040404] text-white overflow-hidden py-28 md:py-40">
      {/* Glow from center */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_65%)]" />
      </div>
      {/* Hairlines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative z-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 border border-white/10 px-5 py-2 rounded-full backdrop-blur-sm">
            <span className="w-1 h-1 bg-white/30 rounded-full" />
            Ready to Work Anywhere
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-tighter text-white leading-[1.0] mb-8"
        >
          Your office.
          <br />
          <span className="text-white/20">Everywhere.</span>
        </motion.h2>

        {/* Supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-14 md:mb-16"
        >
          Join professionals across industries who've freed themselves from desks,
          cables, and compromise. Kangpack is engineered for the way you actually work.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/products">
            <button className="group relative px-12 py-5 bg-white text-black font-bold text-sm uppercase tracking-widest rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_50px_rgba(255,255,255,0.12)]">
              <span className="relative z-10 flex items-center gap-3">
                Buy Now — ₹12,999
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/8 to-transparent skew-x-12" />
            </button>
          </Link>

          <Link href="/products">
            <button className="group px-10 py-5 border border-white/10 text-white/60 font-bold text-sm uppercase tracking-widest rounded-full hover:bg-white/5 hover:border-white/30 hover:text-white transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm">
              Explore All Variants
            </button>
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 flex flex-wrap gap-x-8 gap-y-3 justify-center"
        >
          {[
            "Free Shipping Across India",
            "30-Day Return Policy",
            "Premium Leather Guarantee",
            "COD Available",
          ].map((trust, i) => (
            <span
              key={i}
              className="text-xs text-white/25 uppercase tracking-widest flex items-center gap-2"
            >
              <span className="w-1 h-1 bg-white/15 rounded-full" />
              {trust}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
