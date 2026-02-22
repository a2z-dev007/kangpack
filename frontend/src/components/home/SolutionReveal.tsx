"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ASSETS } from "@/constants/assets";
import Link from "next/link";

const SolutionReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const productScale = useTransform(scrollYProgress, [0, 0.4, 1], [0.88, 1.0, 1.05]);
  const productOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6], [0, 1, 1]);
  const productY = useTransform(scrollYProgress, [0, 0.4], [60, 0]);
  const bgGlow = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [30, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.45], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#f5f2ee] overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Ambient glow behind product */}
      <motion.div
        style={{ opacity: bgGlow }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(ellipse_at_center,_rgba(166,124,82,0.08)_0%,_transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[radial-gradient(ellipse_at_center,_rgba(166,124,82,0.06)_0%,_transparent_60%)]" />
      </motion.div>

      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a67c52]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-40">
        {/* Header */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a67c52]/70 block mb-4">
            The Solution
          </span>
          <h2 className="text-4xl md:text-6xl xl:text-8xl font-black tracking-tighter text-[#1a1a1a] leading-[1.0] mb-6">
            Introducing<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a1a] via-[#a67c52] to-[#1a1a1a]/70">
              Kangpack
            </span>
          </h2>
          <p className="text-[#1a1a1a]/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            The world's first premium wearable workstation. Your laptop,
            always with you — always stable, always ergonomic.
          </p>
        </motion.div>

        {/* Product Reveal - Cinematic */}
        <motion.div
          style={{ scale: productScale, opacity: productOpacity, y: productY }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Leather texture glow */}
          <div className="absolute -inset-8 bg-[radial-gradient(ellipse_at_center,_rgba(166,124,82,0.1)_0%,_transparent_70%)] rounded-full" />

          {/* Main product image */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.15)]">
            <img
              src={ASSETS.FRONT_BACK_SIDEWAYS.IMAGE_2}
              alt="Kangpack Wearable Workstation"
              className="w-full h-auto object-cover"
            />
            {/* Overlay gradient for cinematic depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#f5f2ee]/60 via-transparent to-[#f5f2ee]/10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f5f2ee]/20 via-transparent to-[#f5f2ee]/20 pointer-events-none" />
          </div>

          {/* Floating spec badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute top-1/4 -left-4 md:-left-12 bg-white/80 backdrop-blur-xl border border-[#a67c52]/20 rounded-2xl p-4 md:p-5 shadow-lg"
          >
            <div className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest mb-1">Material</div>
            <div className="text-[#1a1a1a] font-bold text-sm md:text-base">Premium Leather</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute top-1/3 -right-4 md:-right-12 bg-white/80 backdrop-blur-xl border border-[#a67c52]/20 rounded-2xl p-4 md:p-5 shadow-lg"
          >
            <div className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest mb-1">Design</div>
            <div className="text-[#1a1a1a] font-bold text-sm md:text-base">Hands-Free Work</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="absolute bottom-1/4 -left-4 md:-left-12 bg-white/80 backdrop-blur-xl border border-[#a67c52]/20 rounded-2xl p-4 md:p-5 shadow-lg"
          >
            <div className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest mb-1">Comfort</div>
            <div className="text-[#1a1a1a] font-bold text-sm md:text-base">Ergonomic Harness</div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center mt-20 md:mt-24"
        >
          <Link href="/products">
            <button className="group relative px-10 py-4 bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-widest rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(0,0,0,0.15)] hover:shadow-[0_0_60px_rgba(0,0,0,0.25)]">
              <span className="relative z-10">Discover Kangpack</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#a67c52] via-[#a67c52]/90 to-[#a67c52]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a67c52]/30 to-transparent" />
    </section>
  );
};

export default SolutionReveal;
