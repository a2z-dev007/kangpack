"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ASSETS } from "@/constants/assets";

const problems = [
  {
    label: "01 — The Reality",
    headline: "Your back\nstops you\nbefore your\nbattery does.",
    body: "Every day, professionals sacrifice comfort for connectivity. Hunched over laptops on stairs, walls, and laps — productivity killed by poor posture.",
    image: ASSETS.TICKERS.SIDE,
    accent: "Pain kills productivity.",
  },
  {
    label: "02 — The Constraint",
    headline: "Talent\nhas no desk.\nYour setup\ndoes.",
    body: "The best ideas come anywhere — on-site, in transit, outdoors. But your workspace doesn't follow. You end up improvising. Every single time.",
    image: ASSETS.TICKERS.FIRST,
    accent: "Your work deserves better.",
  },
  {
    label: "03 — The Cost",
    headline: "Hours lost.\nPosture ruined.\nWork delayed.",
    body: "The average professional loses 2+ hours per day to workspace friction. Carrying bags. Finding surfaces. Adjusting. Starting over. It's an invisible tax on your output.",
    image: ASSETS.TICKERS.SECOND,
    accent: "Friction costs you everything.",
  },
];

const ProblemSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#030303] py-24 md:py-32 overflow-hidden"
    >
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 md:mb-32"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 block mb-4">
            The Problem
          </span>
          <h2 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tighter text-white leading-[1.0]">
            Why does working{" "}
            <span className="text-white/20">anywhere</span>
            <br />
            feel so{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                impossible?
              </span>
            </span>
          </h2>
        </motion.div>

        {/* Problem Cards */}
        <div className="space-y-8 md:space-y-6">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-700"
            >
              {/* Image Side */}
              <div
                className={`relative aspect-[4/3] md:aspect-auto min-h-[280px] overflow-hidden ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  style={{ backgroundImage: `url(${problem.image})` }}
                />
                {/* Dark overlay that lifts on hover */}
                <div className="absolute inset-0 bg-black/70 group-hover:bg-black/40 transition-all duration-700" />

                {/* Accent badge */}
                <div className="absolute bottom-6 left-6">
                  <span className="text-xs font-bold text-red-400/80 uppercase tracking-widest bg-red-400/10 border border-red-400/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {problem.accent}
                  </span>
                </div>
              </div>

              {/* Content Side */}
              <div
                className={`relative bg-[#0a0a0a] p-8 md:p-12 xl:p-16 flex flex-col justify-between min-h-[280px] md:min-h-[400px] ${
                  i % 2 === 1 ? "md:order-1" : ""
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 block mb-6 md:mb-8">
                    {problem.label}
                  </span>
                  <h3 className="text-3xl md:text-4xl xl:text-5xl font-black tracking-tighter text-white leading-[1.05] whitespace-pre-line mb-6 md:mb-8">
                    {problem.headline}
                  </h3>
                </div>
                <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-md">
                  {problem.body}
                </p>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-white/5 via-white/0 to-white/0" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition text at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-24 md:mt-32 text-center"
        >
          <p className="text-white/20 text-sm uppercase tracking-[0.3em] font-medium">
            Until now.
          </p>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default ProblemSection;
