"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  {
    label: "Workspace flexibility",
    traditional: "Fixed desk only",
    kangpack: "Anywhere on Earth",
    kangpackWins: true,
  },
  {
    label: "Ergonomic posture",
    traditional: "Hunched over flat surface",
    kangpack: "Dual-harness ergonomic support",
    kangpackWins: true,
  },
  {
    label: "Portability",
    traditional: "Requires bag + surface combo",
    kangpack: "All-in-one wearable system",
    kangpackWins: true,
  },
  {
    label: "Setup time",
    traditional: "Find, clean, arrange, adjust",
    kangpack: "Wear and work in 15 seconds",
    kangpackWins: true,
  },
  {
    label: "Hands-free operation",
    traditional: "Not possible",
    kangpack: "Built for it",
    kangpackWins: true,
  },
  {
    label: "Professional appearance",
    traditional: "Improvised look",
    kangpack: "Premium leather craftsmanship",
    kangpackWins: true,
  },
];

const ComparisonSection: React.FC = () => {
  return (
    <section className="relative bg-[#080808] text-white overflow-hidden py-24 md:py-36">
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,rgba(255,255,255,0.03),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/30 block mb-4">
            Why Kangpack
          </span>
          <h2 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tighter text-white leading-[1.0] mb-6">
            The old way vs.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              the right way.
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
            See why professionals are switching to the only workstation that moves with them.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl overflow-hidden border border-white/10"
        >
          {/* Column Headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-[#111111] border-b border-white/10">
            <div className="px-6 md:px-10 py-5 md:py-7">
              <span className="text-xs font-bold uppercase tracking-widest text-white/30">Feature</span>
            </div>
            <div className="px-6 md:px-10 py-5 md:py-7 border-l border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-white/30">Traditional Setup</span>
            </div>
            <div className="px-6 md:px-10 py-5 md:py-7 border-l border-white/5 bg-white/5 relative">
              <div className="absolute -top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-white/30 via-white/80 to-white/30" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">Kangpack ✦</span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className={`grid grid-cols-[1fr_1fr_1fr] border-b border-white/5 last:border-0 ${
                i % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#080808]"
              } group hover:bg-[#0f0f0f] transition-colors duration-300`}
            >
              {/* Feature Label */}
              <div className="px-6 md:px-10 py-5 md:py-6 flex items-center">
                <span className="text-white/60 text-sm md:text-base font-medium">
                  {row.label}
                </span>
              </div>

              {/* Traditional */}
              <div className="px-6 md:px-10 py-5 md:py-6 border-l border-white/5 flex items-center gap-3">
                <X className="w-4 h-4 text-red-400/60 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-white/30 text-sm md:text-base">
                  {row.traditional}
                </span>
              </div>

              {/* Kangpack */}
              <div className="px-6 md:px-10 py-5 md:py-6 border-l border-white/5 bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors duration-300 flex items-center gap-3">
                <Check className="w-4 h-4 text-white/80 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-white/90 text-sm md:text-base font-medium">
                  {row.kangpack}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px mt-8 rounded-2xl overflow-hidden border border-white/5"
        >
          {[
            { number: "6×", label: "more productive environments" },
            { number: "2h+", label: "saved daily in setup friction" },
            { number: "100%", label: "hands-free workstation design" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0d0d0d] px-8 py-7 text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                {stat.number}
              </div>
              <div className="text-xs text-white/40 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
};

export default ComparisonSection;
